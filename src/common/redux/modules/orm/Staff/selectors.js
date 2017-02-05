/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { getUser as getUserData } from 'common/redux/modules/auth/selectors';
import orm from '../orm';
import { ormSelector } from '../selectors';

export const getAuthUser = createSelector(
  ormSelector,
  getUserData,
  ormCreateSelector(orm, (session, { id }) =>
    (id != null ? session.Staff.withId(id) : null),
  ),
);
