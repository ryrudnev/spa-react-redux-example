import { flow, get, getOr } from 'lodash/fp';

// Main ui selector
export const uiSelector = get('ui');

export const getMenubar = flow(uiSelector, get('menubar'));

export const isToogledMenubar = flow(getMenubar, getOr(false, 'toggled'));

export const getSidebar = flow(uiSelector, get('sidebar'));

export const isToogledSidebar = flow(getSidebar, getOr(false, 'toggled'));

export const getSelectedSidebarKey = flow(getSidebar, get('selectedKey'));
