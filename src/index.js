import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';

import 'material-design-lite/material.min.css';
import 'jquery-ui-dist/jquery-ui.min.css'
import 'dialog-polyfill/dialog-polyfill.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'openlayers/dist/ol.css';

import 'css/reset.css';
import 'css/ol.css';
import 'css/styles.css';

import Routes from './routes';
import store from './store/store';

import 'components/ext/mdl/MaterialDesignLite';
import 'jquery-ui-dist/jquery-ui.min.js';

render(
  <Provider store={store}>
    {Routes}
  </Provider>,
  document.getElementById('app')
);
