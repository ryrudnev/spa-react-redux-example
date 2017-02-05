import { handleActions } from 'redux-actions';
import { omit, set, unset } from 'lodash/fp';
import {
  INITIALIZE,
  SET_FETCH_OPTIONS,
  DESTROY,
  RESET,
  FETCH,
  CLEAR_FETCH,
  FETCH_REQUEST,
  FETCH_REQUEST_SUCCESS,
  FETCH_REQUEST_FAILURE,
} from './constants';

const initialState = {
  // data: [],
  // fetching: false,
  // error: false,
  // triggerFetch: false,
  // options: {},
  // initial: {}
};

const reducer = handleActions({
  [INITIALIZE]: (state, { payload: initial = {} }) => {
    const result = { initial, options: state.options || initial };
    return state.data ? set('data', state.data, result) : result;
  },
  [SET_FETCH_OPTIONS]: (state, { payload: options }) => set('options', options, state),
  [FETCH]: state => set('triggerFetch', true, state),
  [CLEAR_FETCH]: state => unset('triggerFetch', state),
  [FETCH_REQUEST]: (state, { payload: options }) => {
    const result = { ...state, fetching: true, options };
    return unset('error', result);
  },
  [FETCH_REQUEST_SUCCESS]: (state, { payload = {} }) => {
    const { data, options = {} } = payload;
    const result = {
      ...state,
      options: { ...state.options || {}, ...options },
      data,
    };
    return unset('fetching', result);
  },
  [FETCH_REQUEST_FAILURE]: (state) => {
    const result = { ...state, error: true };
    return unset('fetching', result);
  },
  [RESET]: state => ({
    initial: state.initial || {},
    options: state.initial || {},
  }),
}, initialState);

const byTable = tableReducer => (state = {}, action) => {
  const table = action.meta && action.meta.table;
  if (!table) {
    return state;
  }
  if (action.type === DESTROY) {
    return omit(table, state);
  }
  const tableState = state[table];
  const result = tableReducer(tableState, action);
  return result === tableState ? state : { ...state, [table]: result };
};

export default byTable(reducer);
