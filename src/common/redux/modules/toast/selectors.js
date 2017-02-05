import { get } from 'lodash/fp';

// Main toast selector
export const toastSelector = get('toast');

export const getAll = toastSelector;
