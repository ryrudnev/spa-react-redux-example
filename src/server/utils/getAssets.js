import fs from 'fs';
import chalk from 'chalk';

// eslint-disable-next-line no-console
export default function getAssets(assetsPath, debug = console.log) {
  let assets = {};
  if (!fs.existsSync(assetsPath)) {
    if (__PROD__) {
      throw (chalk.red('Assets files not found. It\'s necessary to generate them before running the server in production mode.'));
    }
    return assets;
  }
  try {
    assets = JSON.parse(fs.readFileSync(assetsPath)) || {};
  } catch (err) {
    debug(chalk.red('==> Error on loading assets file.'));
    debug(chalk.red(err));
  }
  /* eslint-disable no-param-reassign */
  return Object.keys(assets || {}).reduce((memo, key) => {
    const a = assets[key];
    if (a.js) memo.javascript[key] = a.js;
    if (a.css) memo.styles[key] = a.css;
    return memo;
  }, { javascript: {}, styles: {} });
  /* eslint-enable */
}
