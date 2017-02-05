import { LOGIN_REQUEST_FAILURE } from 'common/redux/modules/auth/constants';
import { RESET } from './constants';

const blacklist = [LOGIN_REQUEST_FAILURE];

const isApiError = ({ payload }) => payload && payload.name === 'ApiError';

const reducer = (state = null, action) => {
  const { type } = action;

  if (type === RESET) {
    return null;
  } else if (!blacklist.includes(type) && isApiError(action)) {
    return action.payload;
  }

  return state;
};

export default reducer;
