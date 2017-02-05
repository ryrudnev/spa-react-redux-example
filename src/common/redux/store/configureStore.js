import chalk from 'chalk';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { apiMiddleware } from 'redux-api-middleware';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import { persistStore, autoRehydrate } from 'redux-persist';
import { toast } from 'common/redux/modules';
import configureStorage, { migrate } from '../storage/configureStorage';
import configureReducer from '../reducer/configureReducer';

export default function configureStore(options) {
  const {
    initialState,
    history,
    cookies,
  } = options;

  const middlewares = [
    thunk,
    apiMiddleware,
    // hanlde action to be able to creaty notification
    toast.middleware,
    routerMiddleware(history),
    // TODO: fix condition race problem (@@INIT dispatched before REHYDRATE action)
    // https://github.com/rt2zz/redux-persist/issues/126
    createActionBuffer(REHYDRATE),
  ];

  if (__DEV__ && __CLIENT__) {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger({ collapsed: true }));
  }

  const enhancers = [
    autoRehydrate({ log: __DEV__ }),
    migrate(),
    applyMiddleware(...middlewares),
  ];

  if (__DEV__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('common/containers/DevTools').default;
    enhancers.push(
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    );
  }

  const store = createStore(
    configureReducer(),
    initialState,
    compose(...enhancers),
  );

  persistStore(store, configureStorage({ cookies }));

  store.asyncReducers = {}; // Async reducer registry

  if (__DEV__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer/configureReducer', () => {
      try {
        const reducer = require('../reducer/configureReducer').default;
        store.replaceReducer(reducer(store.asyncReducers));
      } catch (error) {
        console.error(chalk.red(`==> Reducer hot reloading error ${error}`)); // eslint-disable-line
      }
    });
  }

  return store;
}
