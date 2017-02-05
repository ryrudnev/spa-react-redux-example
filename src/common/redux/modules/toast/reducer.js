import { handleActions } from 'redux-actions';
import { CREATE, REMOVE, REMOVE_ALL } from './constants';

const initialState = [];

const reducer = handleActions({
  [CREATE]: (state, { payload: toastData }) => ([
    ...state.filter(({ id }) => id !== toastData.id),
    toastData,
  ]),
  [REMOVE]: (state, { payload: id }) => state.filter(n => n.id !== id),
  [REMOVE_ALL]: () => [],
}, initialState);

export default reducer;
