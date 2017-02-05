import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import ui from 'common/redux/modules/ui';
import auth from 'common/redux/modules/auth';
import orm from 'common/redux/modules/orm';
import toast from 'common/redux/modules/toast';
import datatable from 'common/redux/modules/datatable';
import error from 'common/redux/modules/error';

// Only combine reducers needed for initial render, others will be added async
export default function configureReducer(asyncReducers = {}) {
  return combineReducers({
    ui,
    auth,
    routing,
    toast,
    orm,
    form,
    datatable,
    error,
    ...asyncReducers,
  });
}
