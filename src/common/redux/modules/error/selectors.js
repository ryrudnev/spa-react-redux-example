import { get } from 'lodash/fp';

// Main error state selector
export const errorSelector = get('error');

export const getError = errorSelector;
