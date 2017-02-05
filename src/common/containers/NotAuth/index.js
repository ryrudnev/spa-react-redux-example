import React, { PropTypes } from 'react';
import { auth } from 'common/redux/modules';

const NotAuth = ({ children }) => React.Children.only(children);

NotAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default auth.wrappers.UserIsNotAuthenticated(NotAuth);
