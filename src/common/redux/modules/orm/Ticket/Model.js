import { compose } from 'redux';
import { Model, attr, fk } from 'redux-orm';
import PropTypes from 'proptypes';
import propTypesMixin from 'redux-orm-proptypes';
import baseMixin from '../mixin';
import { FETCH_REQUEST_SUCCESS } from './constants';

export default class Ticket extends compose(baseMixin, propTypesMixin)(Model) {
  static modelName = 'Ticket'

  static propTypes = {
    id: PropTypes.number,
  }

  static fields = {
    id: attr(),
    creator: fk('Staff'),
  }

  static parse(userData) {
    return this.createOrUpdate(userData);
  }

  static reducer(action, TicketModel) {
    const { payload, type } = action;
    switch (type) {
      case FETCH_REQUEST_SUCCESS:
        payload.data.map(ticketData => TicketModel.parse(ticketData));
        break;
      default:
        break;
    }
  }
}
