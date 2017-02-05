import { createAction } from 'redux-actions';
import {
  INITIALIZE,
  SET_FETCH_OPTIONS,
  DESTROY,
  FETCH,
  CLEAR_FETCH,
  FETCH_REQUEST,
  FETCH_REQUEST_SUCCESS,
  FETCH_REQUEST_FAILURE,
  RESET,
} from './constants';

export const initialize = createAction(
  INITIALIZE,
  (table, fetchOptions) => fetchOptions,
  (table, fetchOptions, otherMeta) => ({ table, ...otherMeta }),
);

export const fetch = createAction(
  FETCH,
  undefined,
  table => ({ table }),
);

export const clearFetch = createAction(
  CLEAR_FETCH,
  undefined,
  table => ({ table }),
);

export const fetchRequest = createAction(
  FETCH_REQUEST,
  (table, fetchOptions) => fetchOptions,
  table => ({ table }),
);

export const fetchRequestSuccess = createAction(
  FETCH_REQUEST_SUCCESS,
  (table, resp) => resp, // { options, data }
  table => ({ table }),
);

export const fetchRequestFailure = createAction(
  FETCH_REQUEST_FAILURE,
  (table, resp) => resp,
  table => ({ table }),
);

export const reset = createAction(
  RESET,
  undefined,
  table => ({ table }),
);

export const destroy = createAction(
  DESTROY,
  undefined,
  (...table) => ({ table }),
);

export const setOptions = createAction(
  SET_FETCH_OPTIONS,
  (table, fetchOptions) => fetchOptions,
  table => ({ table }),
);
