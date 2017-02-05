import fs from 'fs';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
import hpp from 'hpp';
import chalk from 'chalk';
import proxyMiddleware from 'http-proxy-middleware';
import opn from 'opn';
import project from '../../../config/project.config';

export function setupDefault(app /* debug */) {
  app.disable('x-powered-by');
  app.use(cookieParser());

  // server not proccess body in current implementation
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());

  // development
  if (__DEV__) {
    app.use(morgan('dev'));
  } else {
    // only log error responses
    app.use(morgan('combined', {
      skip: (req, res) => res.statusCode < 400,
    }));
    // Using helmet to secure Express with various HTTP headers
    app.use(helmet());
    // Prevent HTTP parameter pollution.
    app.use(hpp());
    // Compress all requests
    app.use(compression());
  }

  app.use(express.static(project.paths.public()));

  // setup API proxy
  app.use(proxyMiddleware('/api', {
    target: project.proxy_api_target,
    changeOrigin: true,
    logLevel: project.proxy_log_level,
    pathRewrite: {
      '^/api': '',
    },
  }));

  // setup pusher proxy
  app.use(proxyMiddleware('/pusher', {
    target: project.proxy_pusher_target,
    changeOrigin: true,
    logLevel: project.proxy_log_level,
    pathRewrite: {
      '^/pusher': '',
    },
  }));

  const faviconPath = project.paths.public('favicon.ico');
  if (fs.existsSync(faviconPath)) {
    app.use(favicon(faviconPath));
  }

  return app;
}

export function createServer({ handleRequest, setup = setupDefault, name = 'server' }) {
  const debug = require('debug')(name);

  const app = setup(express(), debug);

  app.get('*', (req, res, next) => handleRequest(req, res, next, debug));

  return () => {
    // Launch the server
    app.listen(project.server_port, project.server_host, (error) => {
      const serverUrl = `http://${project.server_host}:${project.server_port}/`;

      if (error) {
        debug(chalk.red('==> Server error'));
        debug(chalk.red(error));
      } else {
        debug(`==> Server listening at ${serverUrl}`);

        // Try to open in browser
        if (__DEV__) {
          try {
            opn(serverUrl);
          } catch (err) {
            debug(chalk.yellow('Open browser failed'));
            debug(chalk.yellow(err));
          }
        }
      }
    });
  };
}
