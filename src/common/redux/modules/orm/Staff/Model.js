import { compose } from 'redux';
import { Model, attr } from 'redux-orm';
import PropTypes from 'proptypes';
import propTypesMixin from 'redux-orm-proptypes';
import { REHYDRATE } from 'redux-persist/constants';
import { LOGIN_REQUEST_SUCCESS } from 'common/redux/modules/auth/constants';
import baseMixin from '../mixin';

export default class Staff extends compose(baseMixin, propTypesMixin)(Model) {
  static modelName = 'Staff'

  static propTypes = {
    id: PropTypes.number,
    login: PropTypes.string.isRequired,
    email: PropTypes.string,
    full_name: PropTypes.string,
  }

  static fields = {
    id: attr(),
    login: attr(),
    email: attr(),
    full_name: attr(),
  }

  static parse(userData) {
    return this.createOrUpdate(userData);
  }

  static reducer(action, StaffModel) {
    const { payload, type } = action;
    switch (type) {
      // Create user after rehydrate state (via redux-persist)
      case REHYDRATE:
        if (payload.auth && payload.auth.user) {
          StaffModel.parse(payload.auth.user);
        }
        break;
      // User logged on application
      case LOGIN_REQUEST_SUCCESS:
        StaffModel.parse(payload.data);
        break;
      default:
        break;
    }
  }
}
