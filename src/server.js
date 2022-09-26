import 'isomorphic-unfetch';
import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import express from 'express';

const razzleAssets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const sheet = new ServerStyleSheet();

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css.map((asset, idx) => <link key={idx} rel="stylesheet" href={asset} />)
      : ''
    : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map((asset, idx) => <script key={idx} src={`${asset}`} defer crossOrigin />)
      : ''
    : '';
};

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const markup = (
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      const html = renderToString(
        sheet.collectStyles(
          <html lang="en">
            <head>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              {cssLinksFromAssets(razzleAssets, 'client')}
            </head>
            <body>
              <div id="root">${markup}</div>
              {jsScriptTagsFromAssets(razzleAssets, 'client')}
            </body>
          </html>,
        ),
      );

      res.status(200).header('Content-Type', 'text/html').send(`<!doctype html>\n${html}`);
    }
  });

export default server;
