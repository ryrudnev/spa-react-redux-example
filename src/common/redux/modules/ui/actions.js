import { createAction } from 'redux-actions';
import { TOGGLE_MENUBAR, TOGGLE_SIDEBAR, SELECT_SIDEBAR } from './constants';

// Toggle menubar
export const toggleMenubar = createAction(TOGGLE_MENUBAR);

// Toggle sidebar
export const toggleSidebar = createAction(TOGGLE_SIDEBAR);

// Select tabs on sidebar by key
export const selectSidebar = createAction(SELECT_SIDEBAR);
