import { loadModule, errorLoading } from 'common/utils/routingUtils';

export default () => ({
  path: '/',
  getComponent(nextState, cb) {
    System.import('./containers/Home')
      .then(loadModule(cb))
      .catch(errorLoading('Home'));
  },
});
