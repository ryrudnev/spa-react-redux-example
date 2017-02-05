import { flow, get, getOr } from 'lodash/fp';

// Main auth selector
export const authSelector = get('auth');

export const getUser = flow(authSelector, get('user'));

export const isAuthenticating = flow(authSelector, getOr(false, 'authenticating'));

export const isAuthenticated = flow(authSelector, getOr(false, 'authenticated'));

export const getError = flow(authSelector, get('error'));
