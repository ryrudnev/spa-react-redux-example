import chalk from 'chalk';
import React from 'react';
import { trigger } from 'redial';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import BodyClassName from 'react-body-classname';
import createRoutes from 'common/routes/createRoutes';
import configureStore from 'common/redux/store/configureStore';
import { createServer } from './utils/baseServer';
import Html from './containers/Html';

const server = createServer({
  name: 'server:ssr',
  handleRequest(req, res, next, debug) {
    global.navigator = { userAgent: req.headers['user-agent'] };

    if (__DEV__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    const location = req.originalUrl;
    const memoryHistory = createMemoryHistory(location);
    const store = configureStore({
      history: memoryHistory,
      cookies: req.cookies,
    });
    const routes = createRoutes(store);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({ history, routes, location }, (error, redirectLocation, renderProps) => {
      // Error handling
      if (error) {
        debug(chalk.red(`Router location "${location}" error`));
        debug(chalk.red(error));
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        const redirect = redirectLocation.pathname + redirectLocation.search;
        debug(chalk.blue(`Router location "${location}" redirect to "${redirect}"`));
        res.redirect(302, redirect);
      } else if (!renderProps) {
        debug(chalk.blue(`Router location "${location}" not found`));
        res.status(404).send('Not found');
      } else {
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

        // Wait for async data fetching to complete, then render:
        trigger('fetch', components, locals)
          .then(() => {
            const content = renderToString(
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>,
            );
            // Initialize the correct classes to body element
            const bodyClassname = BodyClassName.rewind(); // eslint-disable-line no-unused-vars

            res.status(200).send(`<!doctype html>\n${renderToStaticMarkup(
              <Html assets={webpackIsomorphicTools.assets()} content={content} store={store} />,
            )}`);
          })
          .catch((e) => {
            debug(chalk.red(`Router fetch "${location}" error`));
            debug(chalk.red(e));
            res.status(503).end();
          });
      }
    });
  },
});

server();
