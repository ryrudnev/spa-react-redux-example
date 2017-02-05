import { ORM } from 'redux-orm';
import Staff from './Staff/Model';
import Ticket from './Ticket/Model';

const orm = new ORM();

orm.register(
  Staff,
  Ticket,
);

export default orm;
