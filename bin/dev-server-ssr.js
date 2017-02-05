const debug = require('debug')('ncs:dev:server:ssr');
const chalk = require('chalk');
const express = require('express');
const webpack = require('webpack');
const project = require('../config/project.config');
const webpackConfig = require('../config/webpack.config');

debug('Starting development server for server side rendering.');

if (!__SSR__ || !__DEV__) {
  debug(chalk.red('To start the server, you must specify --ssr key and set NODE_ENV=development mode.'));
  return;
}

const app = express();
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  contentBase: `http://${project.server_host}:${project.server_port}`,
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  noInfo: true,
  hot: true,
  clientLogLevel: 'error',
  inline: true,
  lazy: false,
  watchOptions: { ignored: /node_modules/ },
  headers: { 'Access-Control-Allow-Origin': '*' },
}));

app.use(require('webpack-hot-middleware')(compiler, {
  path: '/__webpack_hmr',
  log: debug,
  heartbeat: 10 * 1000,
}));

app.listen(project.dev_ssr_server_port, project.dev_ssr_server_host, (error) => {
  const serverUrl = `http://${project.dev_ssr_server_port}:${project.dev_ssr_server_host}/`;

  if (error) {
    debug(chalk.red('==> Server error'));
    debug(chalk.red(error));
  } else {
    debug(`==> Server listening at ${serverUrl}`);
  }
});
