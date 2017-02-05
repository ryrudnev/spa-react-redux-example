const debug = require('debug')('ncs:config:project');
const path = require('path');
const argv = require('yargs').argv;

debug('Creating default configuration.');

const env = process.env.NODE_ENV || 'development';

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = env === 'development';
global.__PROD__ = env === 'production';
global.__TEST__ = env === 'test';
global.__SSR__ = Boolean(argv.ssr || (argv.env && argv.env.ssr));
global.__COVERAGE__ = !argv.watch && __TEST__;
global.__DEBUG__ = Boolean(process.env.DEBUG);

// ----------------------------------
// Default configuration
// ----------------------------------
const config = {
  env,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  absolute_base: path.normalize(path.join(__dirname, '..')),
  dir_public: 'public',
  dir_dist: 'public/dist',
  dir_src: 'src',
  dir_client: 'client',
  dir_server: 'server',
  dir_config: 'config',
  dir_node_modules: 'node_modules',
  dir_global_styles: 'common/styles/global',
  dir_cache: '.cache',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: process.env.SERVER_HOST || 'localhost',
  server_port: process.env.SERVER_PORT || 3000,

  // ----------------------------------
  // Proxy Configuration
  // ----------------------------------
  proxy_api_target: process.env.API_ENDPOINT,
  proxy_pusher_target: process.env.PUSHER_ENDPOINT,
  proxy_log_level: 'error',

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_assets_filename: 'webpack-assets.json',
  compiler_stats_filename: 'webpack-stats.json',
  compiler_public_path: '/dist/',
};

// ------------------------------------
// Utilities
// ------------------------------------
function base(...paths) {
  return (...otherPaths) => path.resolve(...[config.absolute_base, ...paths, ...otherPaths]);
}

config.paths = {
  base: base(),
  public: base(config.dir_public),
  src: base(config.dir_src),
  client: base(config.dir_src, config.dir_client),
  server: base(config.dir_src, config.dir_server),
  dist: base(config.dir_dist),
  config: base(config.dir_config),
  cache: base(config.dir_cache),
  node_modules: base(config.dir_node_modules),
  global_styles: base(config.dir_src, config.dir_global_styles),
};

// ----------------------------------
// SSR Development Configuration
// ----------------------------------
Object.assign(config, {
  dev_ssr_server_host: config.server_host,
  dev_ssr_server_port: (Number(config.server_port) + 1) || 3001,
});

// ------------------------------------
// Overrides
// ------------------------------------
debug(`Looking for environment overrides for NODE_ENV "${env}".`);
const envs = require('./env.config');

const overrides = envs[env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}
module.exports = config;
