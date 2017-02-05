import React, { PropTypes } from 'react';
import { auth } from 'common/redux/modules';

const Auth = ({ children }) => React.Children.only(children);

Auth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default auth.wrappers.UserIsAuthenticated(Auth);
