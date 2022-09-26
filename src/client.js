import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate } from 'react-dom';

hydrate(
  <BrowserRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
