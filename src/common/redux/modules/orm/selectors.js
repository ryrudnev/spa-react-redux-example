import { createSelector } from 'reselect';
import { get } from 'lodash/fp';
import orm from './orm';

// Selects the state managed by Redux-ORM.
export const ormSelector = get('orm');

// Gets ORM session
export const getSession = createSelector(
  ormSelector,
  ormState => orm.session(ormState),
);
