/* eslint-disable comma-dangle */

// see more options https://webpack.js.org/

const debug = require('debug')('ncs:config:webpack');
const chalk = require('chalk');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const project = require('./project.config');
const pkg = require('../package.json');

debug('Creating configuration.');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

// Register vendors here
let vendors = [
  'classnames',
  'react',
  'react-dom',
  'react-router',
  'react-router-redux',
  'react-redux',
  'react-helmet',
  'redux',
  'redux-thunk',
];

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
vendors = vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true;

    debug(chalk.red(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
      Consider removing it from 'vendors' in ~/config/webpack.config.js`
    ));

    return false;
  });

const webpackConfig = {
  context: project.paths.base(),
  devtool: __PROD__ ? 'hidden-source-map' : 'source-map',
  target: 'web',

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      project.paths.src(),
      'node_modules',
    ],
    unsafeCache: __DEV__,
  },

  module: {
    noParse: [
      /\.min\.js/,
    ],
  },

  // see https://webpack.js.org/configuration/stats/
  stats: {
    // Add asset Information
    assets: true,
     // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: true,
     // Add built modules information to chunk information
    chunkModules: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    // Add built modules information
    modules: true,
    // Add information about the reasons why modules are included
    reasons: true,
    // Add timing information
    timings: true,
  },
};

let devUrl;
if (__SSR__) {
  devUrl = `http://${project.dev_ssr_server_host}:${project.dev_ssr_server_port}`;
} else {
  devUrl = `http://${project.server_host}:${project.server_port}`;
}

// ------------------------------------
// Entry Points
// ------------------------------------
webpackConfig.entry = {
  app: [
    ...__DEV__ ? [
      `webpack-hot-middleware/client?path=${devUrl}/__webpack_hmr&reload=true`,
      'react-hot-loader/patch',
    ] : [],
    'babel-polyfill',
    project.paths.client(),
  ],
  vendor: vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  path: project.paths.dist(),
  filename: __PROD__ ? '[name].[chunkhash].js' : '[name].js',
  chunkFilename: __PROD__ ? '[name].[chunkhash].chunk.js' : '[name].chunk.js',
  publicPath: __DEV__ ? `${devUrl}${project.compiler_public_path}` : project.compiler_public_path,
  // https://webpack.js.org/configuration/output/#output-pathinfo
  pathinfo: __DEV__,
};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  // not loads additional locales for moment.js,
  new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru/),
  new webpack.LoaderOptionsPlugin({
    minimize: __PROD__,
    debug: __DEV__,
    options: {
      // Javascript lint
      eslint: {
        failOnError: false,  // Disable js lint error terminating here
      },
      context: '/',         // Required for the sourceMap of css/sass loader
    },
  }),
  // Style lint
  new StyleLintPlugin({
    syntax: 'scss',
    failOnError: false,      // Disable style lint error terminating here
  }),
  // Setup global variables for app
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(project.env),
    },
    NODE_ENV: project.env,
    __CLIENT__: true,
    __SERVER__: false,
    __DEV__,
    __DEVTOOLS__: __DEV__, // Disable redux-devtools here
    __DEBUG__,
    __PROD__,
    __TEST__,
    __SSR__,
    __COVERAGE__,
  }),
  new webpack.NoEmitOnErrorsPlugin(),
];

// Eable server side rendering
if (__SSR__) {
  const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
  const WebpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools.config');
  debug(WebpackIsomorphicToolsConfig);
  webpackConfig.plugins.push(new WebpackIsomorphicToolsPlugin(WebpackIsomorphicToolsConfig)
    .development(__DEV__));
} else {
  // generate assets
  const AssetsPlugin = require('assets-webpack-plugin');
  webpackConfig.plugins.push(new AssetsPlugin({
    filename: project.compiler_assets_filename,
    path: project.paths.dist(),
  }));
}

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__COVERAGE__) {
  webpackConfig.plugins.push(function testPlugin() {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        );
      }
    });
  });
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/)
  );
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: '[name].[chunkhash].js',
      minChunks: Infinity,
    })
  );
}

const cssLoader = [
  'css-loader?',
  'camelCase',
  __PROD__ ? 'minimize' : '-minimize',
  'modules',
  'importLoaders=1',
  `localIdentName=${__PROD__ ? '[hash:base64:5]' : '[name]__[local]__[hash:base64:3]'}`,
  ...__PROD__ ? [] : ['sourceMap'],
].join('&');

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.rules = [
  {
    enforce: 'pre',
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
  },
  // By default in webpack 2 https://github.com/webpack/json-loader
  // {
  //   test: /\.json$/,
  //   loader: 'json-loader',
  // },
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      babelrc: false, // disable default .babelrc
      cacheDirectory: project.paths.cache(), // caching
      compact: __PROD__,
      presets: [
        ['latest', { es2015: { modules: false } }],
        'stage-0',
        'react',
        // Optimize React code for the production build
        ...__PROD__ ? ['react-optimize'] : [],
      ],
      plugins: [
        'transform-decorators-legacy',
        // Externalise references to helpers and builtins,
        // automatically polyfilling your code without polluting globals.
        'transform-runtime',
        ...__DEV__ ? [
          // Adds component stack to warning messages
          'transform-react-jsx-source',
          // Adds __self attribute to JSX which React will use for some warnings
          'transform-react-jsx-self',
        ] : [['lodash', { id: ['lodash', 'recompose'] }]],
        'react-hot-loader/babel',
      ],
    },
  },
  {
    // OS Windows path problem (see https://webpack.github.io/docs/troubleshooting.html#windows-paths)
    test: /common(\\|\/)styles(\\|\/)global(\\|\/)app\.css$/,
    loader: __PROD__ ?
      ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?minimize!postcss-loader',
      }) :
      'style-loader!css-loader?sourceMap&-minimize!postcss-loader',
  },
  {
    test: /\.css$/,
    exclude: [/common(\\|\/)styles(\\|\/)global(\\|\/)app\.css$/],
    loader: __PROD__ ?
      ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: `${cssLoader}!postcss-loader`,
      }) :
      `style-loader!${cssLoader}!postcss-loader`,
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader',
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /favicon\.ico$/,
    loader: 'url-loader?limit=1',
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    // Any image below or equal to 10K will be converted to inline base64 instead
    loaders: [
      'url-loader?limit=10240',
      'image-webpack-loader?bypassOnDebug',  // Using for image optimization
    ],
  },
];

module.exports = webpackConfig;
