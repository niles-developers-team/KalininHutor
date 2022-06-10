import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import DocumentMeta from 'react-document-meta';

import reportWebVitals from './reportWebVitals';

import configureStore from './store/createStore';

import { sessionService } from './services';
import { RoutesSwitch } from './components';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { amber, deepPurple } from '@mui/material/colors';

sessionService.init();

const theme = createTheme({
    palette: {
        primary: deepPurple,
        secondary: amber,
    },
});

const store = configureStore();

const meta = { title: 'Help it easy' }

ReactDOM.render(
  <React.StrictMode>
    <DocumentMeta {...meta}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <RoutesSwitch />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </DocumentMeta>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
