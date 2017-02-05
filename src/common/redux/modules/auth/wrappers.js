import { UserAuthWrapper } from 'redux-auth-wrapper';
import { routerActions } from 'react-router-redux';
import { getUser } from './selectors';

// Redirects to /login by default
export const UserIsAuthenticated = UserAuthWrapper({
  wrapperDisplayName: 'UserIsAuthenticated',
  authSelector: getUser, // how to get the user state
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
});

// Want to redirect the user when they are done loading and authenticated
export const UserIsNotAuthenticated = UserAuthWrapper({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  authSelector: getUser,
  redirectAction: routerActions.replace,
  predicate: user => user == null,
  failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/',
  allowRedirectBack: false,
});
