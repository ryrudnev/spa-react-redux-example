import { loadModule, errorLoading } from 'common/utils/routingUtils';

export default () => ({
  path: 'login',
  getComponent(nextState, cb) {
    System.import('./containers/Login')
      .then(loadModule(cb))
      .catch(errorLoading('Login'));
  },
});
