import { bindActionCreators } from 'redux';
import { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { compose, pure } from 'recompose';
import { Errors } from 'common/components';

const NotFound = ({ goBack, goHome }) =>
  createElement(Errors, { goBack, goHome, error: { status: 'notfound' } });

NotFound.propTypes = {
  goBack: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  goBack: routerActions.goBack,
  goHome: () => routerActions.push('/'),
}, dispatch);

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  pure,
)(NotFound);
