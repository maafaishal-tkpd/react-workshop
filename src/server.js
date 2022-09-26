import 'isomorphic-unfetch';
import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { ServerStyleSheet } from 'styled-components';
import express from 'express';

const razzleAssets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const helmetContext = {};

const sheet = new ServerStyleSheet();

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css.map((asset) => `<link rel="stylesheet" href="${asset}">`).join('')
      : ''
    : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map((asset) => `<script src="${asset}" ${extra.join(' ')}></script>`).join('')
      : ''
    : '';
};

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      sheet.collectStyles(
        <HelmetProvider context={helmetContext}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </HelmetProvider>,
      ),
    );

    const { helmet } = helmetContext;

    if (context.url) {
      res.redirect(context.url);
    } else {
      const html = `<html lang="en">
            <head>
            ${helmet.title.toString()}
              <meta httpEquiv="X-UA-Compatible" content="IE=edge">
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${helmet.priority.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${helmet.script.toString()}
              ${cssLinksFromAssets(razzleAssets, 'client')}
            </head>
            <body>
              <div id="root">${markup}</div>
              ${jsScriptTagsFromAssets(razzleAssets, 'client', 'defer', 'crossorigin')}
            </body>
          </html>`;

      res.status(200).send(`<!doctype html>\n${html}`);
    }
  });

export default server;
