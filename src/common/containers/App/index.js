import React, { PropTypes } from 'react';
import { compose, pure } from 'recompose';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import Helmet from 'react-helmet';
import { error } from 'common/redux/modules';
import config from 'client/config';

// import global styles
import 'common/styles/global/app.css';
import { Errors } from 'common/components';
import Notifications from '../Notifications';

const App = ({ children, errorState, goBack, goHome }) => (
  <div>
    <Helmet {...config.app.head} />
    {
      errorState
      ? (<Errors error={errorState} goBack={goBack} goHome={goHome} />)
      : children
    }
    <Notifications position="bottom-right" />
  </div>
  );

App.propTypes = {
  children: PropTypes.node,
  errorState: PropTypes.object,
  goBack: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
};

App.defaultProps = {
  children: null,
  errorState: null,
};

const mapStateToProps = state => ({
  errorState: error.selectors.getError(state),
});

const mapDispatchToProps = dispatch => ({
  goHome: () => {
    dispatch(error.actions.reset());
    dispatch(routerActions.push('/'));
  },
  goBack: () => {
    dispatch(error.actions.reset());
    dispatch(routerActions.goBack());
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  pure,
)(App);
