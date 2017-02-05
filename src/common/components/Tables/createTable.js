import { PureComponent, PropTypes, createElement } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { identity } from 'lodash/fp';

export default function createTable(
  initialConfig = {},
  mapTableProps = identity,
  mapColumnProps = identity,
) {
  const config = {
    columns: [],
    ...initialConfig,
  };

  class Table extends PureComponent {
    static propTypes = {
      columns: PropTypes.arrayOf(PropTypes.shape({
        dataField: PropTypes.string.isRequired,
        title: PropTypes.node.isRequired,
      })),
    }

    renderColumn = ({ title, ...otherProps }, index) => {
      const columnProps = mapColumnProps({
        key: index,
        ...otherProps,
      });

      return createElement(
        TableHeaderColumn,
        columnProps,
        title,
      );
    }

    renderColumns() {
      const {
        columns,
      } = this.props;

      if (!columns || !columns.length) {
        return [];
      }

      return columns.map(this.renderColumn);
    }

    render() {
      // remove some Table config only props
      /* eslint-disable no-unused-vars */
      const {
        columns,
        ...otherProps
      } = this.props;
      /* eslint-enable no-unused-vars */

      const tableProps = mapTableProps(otherProps);

      return createElement(
        BootstrapTable,
        tableProps,
        ...this.renderColumns(),
      );
    }
  }

  Table.Column = TableHeaderColumn;
  Table.defaultProps = config;

  return Table;
}
