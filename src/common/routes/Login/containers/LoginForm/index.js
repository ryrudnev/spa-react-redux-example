import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import cn from 'classnames/bind';
import { Button } from 'react-bootstrap';
import { auth } from 'common/redux/modules';
import { Forms, Icon } from 'common/components';
import validate from './validate';
import styles from './styles.css';

const LoginForm = ({ classes, handleSubmit, authenticating, authError }) => (
  <form onSubmit={handleSubmit} className={classes('login-form')}>
    <div className={classes('top')}>
      <h1>ncs</h1>
      <h4>Network Connect System</h4>
    </div>
    <div className={classes('form-area')}>
      {
        authError &&
        <div className={classes('kode-alert', 'kode-alert-icon', 'alert6')}>
          <Icon name="exclamation-circle" />
          {authError}
        </div>
      }
      <Field
        name="login"
        type="text"
        component={Forms.Field}
        feedback
        icon={<Icon name="user" />}
      />
      <Field
        name="password"
        type="password"
        component={Forms.Field}
        feedback
        icon={<Icon name="key" />}
      />
      <Button
        type="submit"
        className={classes('btn-block')}
        disabled={authenticating}
      >
        Войти
      </Button>
    </div>
  </form>
);

LoginForm.propTypes = {
  classes: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  authenticating: PropTypes.bool,
  authError: PropTypes.string,
};

LoginForm.defaultProps = {
  classes: cn.bind(styles),
  authenticating: false,
  authError: '',
};

const mapStateToProps = state => ({
  authenticating: auth.selectors.isAuthenticating(state),
  authError: auth.selectors.getError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit: auth.actions.login,
}, dispatch);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form: 'login',
    validate,
  }),
  pure,
)(LoginForm);
