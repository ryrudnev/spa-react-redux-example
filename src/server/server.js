import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import project from '../../config/project.config';
import { createServer, setupDefault } from './utils/baseServer';
import getAssets from './utils/getAssets';
import Html from './containers/Html';

const assetsPath = project.paths.dist(project.compiler_assets_filename);

const server = createServer({
  name: 'server',
  setup(app, debug) {
    setupDefault(app);

    if (__DEV__) {
      const webpack = require('webpack');
      const webpackConfig = require('../../config/webpack.config');
      const compiler = webpack(webpackConfig);

      app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        quiet: true,
      }));

      app.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr',
        log: debug,
        heartbeat: 10 * 1000,
      }));
    }

    return app;
  },
  handleRequest(req, res, next, debug) {
    res.status(200).send(`<!doctype html>\n${renderToStaticMarkup(
      <Html assets={getAssets(assetsPath, debug)} />,
    )}`);
  },
});

server();
