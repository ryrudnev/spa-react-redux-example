import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { trigger } from 'redial';
import { Provider } from 'react-redux';
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { useScroll } from 'react-router-scroll';
import configureStore from 'common/redux/store/configureStore';
import config from './config';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const mountNode = document.getElementById(config.app.containerId);

let DevTools;
if (__DEVTOOLS__ && !window.devToolsExtension) {
  DevTools = require('common/containers/DevTools').default;
}

if (__DEV__ && __DEBUG__) {
  const { whyDidYouUpdate } = require('why-did-you-update');

  whyDidYouUpdate(React);
}

// Setup redux store
const store = configureStore({
  history: browserHistory,
  initialState: window.__INITIAL_STATE__,
});
const history = syncHistoryWithStore(browserHistory, store);

const renderApp = () => {
  const createRoutes = require('common/routes/createRoutes').default;
  const routes = createRoutes(store);

  // Pull child routes using match. Adjust Router for vanilla webpack HMR,
  // in development using a new key every time there is an edit.
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    // Render app with Redux and router context to container element.
    // We need to have a random in development because of `match`'s dependency on
    // `routes.` Normally, we would want just one file from which we require `routes` from.
    render(
      <AppContainer>
        <Provider store={store}>
          {
            DevTools ?
              <div>
                <Router {...renderProps} render={applyRouterMiddleware(useScroll())} />
                <DevTools />
              </div> :
              <Router {...renderProps} render={applyRouterMiddleware(useScroll())} />
          }
        </Provider>
      </AppContainer>,
      mountNode,
    );
  });

  // Listen for route changes on the browser history instance:
  return history.listen((location) => {
    // Match routes based on location object:
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (!renderProps) {
        return;
      }

      // Get array of route handler components:
      const { components } = renderProps;

      // Define locals to be provided to all lifecycle hooks:
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        // Allow lifecycle hooks to dispatch Redux actions:
        dispatch: store.dispatch,
      };

      // Don't fetch data for initial route, server has already done the work:
      if (window.__INITIAL_STATE__) {
        // Delete initial data so that subsequent data fetches can occur:
        delete window.__INITIAL_STATE__;
      } else {
        // Fetch mandatory data dependencies for 2nd route change onwards:
        trigger('fetch', components, locals);
      }

      // Fetch deferred, client-only data dependencies:
      trigger('defer', components, locals);
    });
  });
};

let unsubscribeHistory = renderApp();

// Enable hot reload by react-hot-loader
if (module.hot) {
  const reRenderApp = () => {
    try {
      unsubscribeHistory = renderApp();
    } catch (error) {
      const RedBox = require('redbox-react').default;
      render(<RedBox error={error} />, mountNode);
    }
  };

  module.hot.accept('../common/routes/createRoutes.js', () => {
    setImmediate(() => {
      unsubscribeHistory();
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      reRenderApp();
    });
  });
}
