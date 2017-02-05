import { PropTypes, PureComponent, createElement } from 'react';
import { bindActionCreators } from 'redux';
import { mapValues, isFunction, isEqual, identity } from 'lodash/fp';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import { connect } from 'react-redux';
import { getDisplayName } from 'common/utils/elementUtils';
import fetchAdapter from './tableFetchAdapter';
import defaultParseResponse from './defaultParseResponse';
import * as tableActions from './actions';
import makeTableSelectors, { datatableSelector } from './selectors';

const checkActionCreator = (actionCreator) => {
  invariant(
    isFunction(actionCreator),
    'Expected actionCreator to be a function that returns an API action.',
  );
  return actionCreator;
};

const checkMapData = (mapData) => {
  invariant(
    isFunction(mapData),
    'Expected mapData to be a function that returns a data to display in table.',
  );
  return mapData;
};

export default function dataTable(initialConfig = {}) {
  const config = {
    destroyOnUnmount: true,
    fetchOnMount: true,
    mapData: identity,
    parseResponse: defaultParseResponse,
    enableReinitialize: false,
    getDataTableState: datatableSelector,
    ...initialConfig,
  };

  return (TableComponent) => {
    /* eslint-disable react/require-default-props */
    const dataTablePropTypes = {
      table: PropTypes.string.isRequired,
      actionCreator: PropTypes.func.isRequired,
      initialOptions: PropTypes.object,
      mapData: PropTypes.func,
      data: PropTypes.array,
      options: PropTypes.object,
      parseResponse: PropTypes.func,

      destroyOnUnmount: PropTypes.bool,
      fetchOnMount: PropTypes.bool,
      enableReinitialize: PropTypes.bool,
      triggerFetch: PropTypes.bool,
      loaded: PropTypes.bool,

      initialize: PropTypes.func.isRequired,
      destroy: PropTypes.func.isRequired,
      clearFetch: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    };
    /* eslint-enable react/require-default-props */

    class DataTable extends PureComponent {
      static displayName = `DataTable(${getDisplayName(TableComponent)})`

      static propTypes = dataTablePropTypes

      componentWillMount() {
        this.initIfNeed();
        this.fetchIfNeed();
      }

      componentWillReceiveProps(nextProps) {
        this.initIfNeed(nextProps);
        this.fetchIfNeed(nextProps);
      }

      componentWillUnmount() {
        const { destroyOnUnmount, destroy } = this.props;
        if (destroyOnUnmount) {
          destroy();
        }
      }

      initIfNeed(nextProps) {
        const { initialize, enableReinitialize } = this.props;

        if (nextProps) {
          if (enableReinitialize && (nextProps.table !== this.props.table ||
            nextProps.actionCreator !== this.props.actionCreator ||
            nextProps.parseResponse !== this.props.parseResponse)
          ) {
            this.fetcher = fetchAdapter(
              nextProps.table,
              checkActionCreator(nextProps.actionCreator),
              nextProps.parseResponse,
            );
          }
          if (enableReinitialize && !isEqual(nextProps.initialOptions, this.props.initialOptions)) {
            initialize(nextProps.initialOptions);
          }
        } else {
          this.fetcher = fetchAdapter(
            this.props.table,
            checkActionCreator(this.props.actionCreator),
            this.props.parseResponse,
          );

          if (this.props.initialOptions) {
            initialize(this.props.initialOptions);
          }
        }
      }

      fetch(fetchOptions) {
        const { dispatch } = this.props;
        dispatch(this.fetcher(fetchOptions));
      }

      fetchIfNeed(nextProps) {
        const { clearFetch, triggerFetch, fetchOnMount, loaded } = this.props;
        if (nextProps) {
          if (!triggerFetch && nextProps.triggerFetch) {
            clearFetch();
            this.fetch(this.nextProps.options);
          }
        } else if (!loaded && fetchOnMount) {
          this.fetch();
        }
      }

      handlePageChange = (page, sizePerPage) => {
        const options = {
          ...this.props.options,
          currentPage: page,
          sizePerPage,
        };
        this.fetch(options);
      }

      genBootstrapTableProps() {
        const {
          currentPage: page,
          totalSize: dataTotalSize,
          sizePerPage,
          sizePerPageList = [10, 20, 30, 50],
          pageStartIndex = 1,
        } = this.props.options;

        return {
          fetchInfo: {
            dataTotalSize,
          },
          remote: true,
          pagination: true,
          options: {
            pageStartIndex,
            sizePerPageList,
            sizePerPage,
            page,
            onPageChange: this.handlePageChange,
          },
        };
      }

      render() {
        // remove some datatable config-only props
        /* eslint-disable no-unused-vars */
        const {
          table,
          actionCreator,
          initialOptions,
          mapData,
          parseResponse,
          data,
          destroyOnUnmount,
          fetchOnMount,
          enableReinitialize,
          triggerFetch,
          loaded,
          options,
          initialize,
          destroy,
          clearFetch,
          dispatch,
          ...rest
        } = this.props;
         /* eslint-enable no-unused-vars */

        // gets props for react-bootstrap-table component
        const bootstrapTableProps = this.genBootstrapTableProps();

        const propsToPass = { ...bootstrapTableProps, data, ...rest };

        return createElement(TableComponent, propsToPass);
      }
    }

    const mapStateToProps = (state, ownProps) => {
      const tableSelectors = makeTableSelectors(ownProps.table);

      const options = tableSelectors.getOptions(state) ||
        ownProps.initialOptions ||
        tableSelectors.getInitial(state);

      const triggerFetch = tableSelectors.isTriggerFetch(state);
      const fetching = tableSelectors.isFetching(state);
      const error = tableSelectors.isError(state);

      const rawData = tableSelectors.getData(state);
      const loaded = !!rawData;

      // map data function
      const mapData = checkMapData(ownProps.mapData);
      const data = mapData(rawData || [], state);

      return {
        data,
        options,
        loaded,
        triggerFetch,
        fetching,
        error,
      };
    };

    const mapDispatchToProps = (dispatch, ownProps) => {
      const bindTable = actionCreator => actionCreator.bind(null, ownProps.table);

      // Bind the first parameter on `ownProps.table`
      const tableACs = mapValues(bindTable, tableActions);

      // Wrap action creators with `dispatch`
      const boundTableACs = bindActionCreators(tableACs, dispatch);

      const computedActions = {
        ...boundTableACs,
        dispatch,
      };

      return () => computedActions;
    };

    const connector = connect(mapStateToProps, mapDispatchToProps);

    const ConnectedTable = hoistStatics(connector(DataTable), TableComponent);
    ConnectedTable.defaultProps = config;

    return ConnectedTable;
  };
}
