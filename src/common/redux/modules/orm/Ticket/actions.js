import { createApiAction } from 'common/redux/modules/api';
import {
  FETCH_REQUEST,
  FETCH_REQUEST_SUCCESS,
  FFETCH_REQUEST_FAILURE,
} from './constants';

// eslint-disable-next-line import/prefer-default-export
export const fetch = createApiAction(
  [FETCH_REQUEST, FETCH_REQUEST_SUCCESS, FFETCH_REQUEST_FAILURE],
  (fetchOptions = {}) => ({
    method: 'GET',
    path: 'tickets',
    ...fetchOptions,
  }),
);
