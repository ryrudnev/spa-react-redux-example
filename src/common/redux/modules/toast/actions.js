import { createAction } from 'redux-actions';
import { CREATE, REMOVE, REMOVE_ALL } from './constants';

// Creates a new toast by options
export const create = createAction(
  CREATE,
  toastData => ({
    id: new Date().getTime(),
    type: 'info',
    dismissTitle: 'Закрыть',
    showIcon: true,
    timeout: 4000,
    ...toastData,
  }),
);

// Removes an existing toast by id
export const remove = createAction(REMOVE);

// Removes all toasts
export const removeAll = createAction(REMOVE_ALL);
