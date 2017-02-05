import { loadModule, errorLoading } from 'common/utils/routingUtils';

export default () => ({
  path: '*',
  getComponent(nextState, cb) {
    System.import('./containers/NotFound')
      .then(loadModule(cb))
      .catch(errorLoading('NotFound'));
  },
});
