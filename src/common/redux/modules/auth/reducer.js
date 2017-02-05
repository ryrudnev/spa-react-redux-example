import { handleActions } from 'redux-actions';
import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILURE,
  LOGOUT,
} from './constants';

const initialState = {
  authenticated: false,
  user: null,
};

const reducer = handleActions({
  [LOGIN_REQUEST]: () => ({
    ...initialState,
    authenticating: true,
  }),
  [LOGIN_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...initialState,
    authenticated: true,
    user: payload.data,
  }),
  [LOGIN_REQUEST_FAILURE]: () => ({
    ...initialState,
    error: 'Неправильно указан логин или пароль.',
  }),
  [LOGOUT]: () => ({
    ...initialState,
  }),
}, initialState);

export default reducer;
