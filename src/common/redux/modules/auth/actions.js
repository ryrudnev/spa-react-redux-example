import md5 from 'blueimp-md5';
import { createAction } from 'redux-actions';
import { createApiAction } from 'common/redux/modules/api';
import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILURE,
  LOGOUT,
} from './constants';

// Logout user
export const logout = createAction(LOGOUT);

// Login user - ({ string: password, string: login })
export const login = createApiAction(
  [LOGIN_REQUEST, LOGIN_REQUEST_SUCCESS, LOGIN_REQUEST_FAILURE],
  ({ password, ...rest } = {}) => ({
    method: 'POST',
    path: 'session/login',
    body: { password: md5(password), ...rest },
  }),
);
