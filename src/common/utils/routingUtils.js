import chalk from 'chalk';
import _debug from 'debug';
import { noop } from 'lodash/fp';

const debug = _debug('app:routing');

export function errorLoading(moduleName) {
  return (err) => {
    debug(chalk.red(`Error on loading '${moduleName}': ${err}`));
  };
}

export function loadModule(cb) {
  return (Component) => {
    cb(null, Component.default);
  };
}

export function wrapAuthOnEnter(store) {
  const connect = fn => (nextState, replaceState) => fn(store, nextState, replaceState);
  return __CLIENT__ ? noop : wrapper => connect(wrapper.onEnter);
}
