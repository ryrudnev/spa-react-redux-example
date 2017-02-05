import configureReducer from './configureReducer';

// Using for injecting the async reducers
export default function injectAsyncReducer(store, name, asyncReducer) {
  if (store.asyncReducers[name]) {
    return;
  }
  store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
  store.replaceReducer(configureReducer(store.asyncReducers));
}
