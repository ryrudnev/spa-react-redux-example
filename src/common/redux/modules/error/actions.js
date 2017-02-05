/* eslint-disable import/prefer-default-export */

import { createAction } from 'redux-actions';
import { RESET } from './constants';

// Reset error state
export const reset = createAction(RESET);
