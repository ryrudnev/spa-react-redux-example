import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { TOGGLE_MENUBAR, TOGGLE_SIDEBAR, SELECT_SIDEBAR } from './constants';

const menubarInitialState = {
  toggled: false,
};

const menubar = handleActions({
  [TOGGLE_MENUBAR]: state => ({ ...state, toggled: !state.toggled }),
}, menubarInitialState);

const sidebarInitialState = {
  toggled: false,
  selectedKey: 'tasks',
};

const sidebar = handleActions({
  [TOGGLE_SIDEBAR]: state => ({ ...state, toggled: !state.toggled }),
  [SELECT_SIDEBAR]: (state, action) => ({ ...state, selectedKey: action.payload }),
}, sidebarInitialState);

// Main reducer
const reducer = combineReducers({
  menubar,
  sidebar,
});

export default reducer;
