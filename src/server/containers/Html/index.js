import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.shape({
      styles: PropTypes.object,
      javascript: PropTypes.object,
    }),
    containerId: PropTypes.string,
    content: PropTypes.string,
    store: PropTypes.object,
  }

  static defaultProps = {
    content: '',
    containerId: 'app',
    assets: {},
  }

  render() {
    const {
      assets,
      store,
      content,
      containerId,
    } = this.props;

    const head = Helmet.rewind();
    const attrs = head.htmlAttributes.toComponent();

    return (
      <html {...attrs} lang="ru">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />

          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}

          {Object.keys(assets.styles || {}).map((style, i) =>
            <link
              key={i}
              href={assets.styles[style]}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
            />,
          )}
        </head>
        <body>
          <div id={containerId} dangerouslySetInnerHTML={{ __html: content }} />
          {store && <script
            type="text/javascript"
            charSet="UTF-8"
            dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState())};` }}
          />}

          {Object.keys(assets.javascript || {}).reverse().map((script, i) =>
            <script key={i} src={assets.javascript[script]} type="text/javascript" charSet="UTF-8" />,
          )}

          {head.script.toComponent()}
        </body>
      </html>
    );
  }
}
