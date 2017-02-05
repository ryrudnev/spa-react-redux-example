const project = require('./project.config');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

function styleFilter(module, regex, options, log) {
  if (options.development) {
    // in development mode there's webpack "style-loader",
    // so the module.name is not equal to module.name
    return WebpackIsomorphicToolsPlugin.styleLoaderFilter(module, regex, options, log);
  }

  // In production mode there's no Webpack "style-loader",
  // so `module.name`s of the `module`s created by Webpack "css-loader"
  // (those which contain CSS text)
  // will be simply equal to the correct asset path
  return regex.test(module.name);
}

function stylePath(module, options, log) {
  if (options.development) {
      // in development mode there's webpack "style-loader",
      // so the module.name is not equal to module.name
    return WebpackIsomorphicToolsPlugin.styleLoaderPathExtractor(module, options, log);
  }

    // in production mode there's no webpack "style-loader",
    // so the module.name will be equal to the asset path
  return module.name;
}

function styleParser(module, options, log) {
  if (options.development) {
    // In development mode it adds an extra `_style` entry
    // to the CSS style class name map, containing the CSS text
    return WebpackIsomorphicToolsPlugin.cssModulesLoaderParser(module, options, log);
  }

  // in production mode there's Extract Text Loader which extracts CSS text away
  return module.source;
}

module.exports = {
  debug: __DEBUG__,
  webpack_assets_file_path: project.paths.dist(project.compiler_assets_filename),
  webpack_stats_file_path: project.paths.dist(project.compiler_stats_filename),
  assets: {
    images: {
      extensions: ['png', 'jpg', 'jpeg', 'gif'],
      parser: WebpackIsomorphicToolsPlugin.urlLoaderParser,
    },
    fonts: {
      extensions: ['eot', 'ttf', 'woff', 'woff2'],
      parser: WebpackIsomorphicToolsPlugin.urlLoaderParser,
    },
    svg: {
      extension: 'svg',
      parser: WebpackIsomorphicToolsPlugin.urlLoaderParser,
    },
    style_modules: {
      extensions: ['css', 'scss', 'less'],
      filter: styleFilter,
      path: stylePath,
      parser: styleParser,
    },
  },
};
