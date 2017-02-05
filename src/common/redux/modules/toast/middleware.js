import * as auth from 'common/redux/modules/auth';

import { create } from './actions';

const mapToast = {
  [auth.actionTypes.LOGIN_REQUEST_SUCCESS]: (action, state) => ({
    headline: `Привет, ${auth.selectors.getUser(state).login}!`,
    message: 'Вы успешно вошли в систему.',
    type: 'success',
  }),
  [auth.actionTypes.LOGOUT]: () => ({
    message: 'Вы успешно вышли из системы.',
    type: 'info',
  }),
};

export default ({ dispatch, getState }) => next => (action) => {
  const result = next(action);

  if (mapToast[action.type]) {
    const toastData = mapToast[action.type](action, getState());
    if (toastData) {
      dispatch(create(toastData));
    }
  }

  return result;
};
