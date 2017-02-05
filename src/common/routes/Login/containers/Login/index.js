import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import BodyClassName from 'react-body-classname';
import cn from 'classnames/bind';
import { compose, pure } from 'recompose';
import { auth } from 'common/redux/modules';
import LoginForm from '../LoginForm';
import styles from './styles.css';

const Login = ({ classes }) => (
  <div className={classes('login-page')}>
    <Helmet title="Вход" />
    <BodyClassName className={classes('login')} />
    <LoginForm />
  </div>
);

Login.propTypes = {
  classes: PropTypes.func.isRequired,
};

Login.defaultProps = {
  classes: cn.bind(styles),
};

export default compose(
  auth.wrappers.UserIsNotAuthenticated,
  pure,
)(Login);
