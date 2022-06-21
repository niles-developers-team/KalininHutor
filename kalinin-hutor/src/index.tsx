import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import DocumentMeta from 'react-document-meta';

import reportWebVitals from './reportWebVitals';

import configureStore from './store/createStore';

import { sessionService } from './services';
import { RoutesSwitch } from './components';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import './index.css';
import './themes/bootstrap.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "moment/locale/ru";


sessionService.init();

const store = configureStore();

const meta = { title: 'Хутор Калинин' }

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <DocumentMeta {...meta}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <BrowserRouter>
            <RoutesSwitch />
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    </DocumentMeta>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
