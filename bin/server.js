const fs = require('fs');
const chalk = require('chalk');
const project = require('../config/project.config');
const debug = require('debug')(__SSR__ ? 'ncs:server:ssr' : 'ncs:server');

const babelrc = fs.readFileSync('./.babelrc');
let babelConfig = {};
try {
  babelConfig = JSON.parse(babelrc);
} catch (err) {
  debug(chalk.red('==> Error parsing your .babelrc.'));
  debug(chalk.red(err));
}

require('babel-core/register')(babelConfig);

if (__SSR__) {
  // Better local require() paths for Node.js
  // https://gist.github.com/branneman/8048520
  require('app-module-path')
    .addPath(project.paths.src());

  // Settings of webpack-isomorphic-tools
  // see more https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
  const WebpackIsomorphicToolsConfig = require('../config/webpack-isomorphic-tools.config');

  global.webpackIsomorphicTools = new
  WebpackIsomorphicTools(WebpackIsomorphicToolsConfig)
  .server(project.paths.base(), () => {
    require('../src/server/server-ssr');
  });
} else {
  require('../src/server/server');
}
