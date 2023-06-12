import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';

import configureStore from './store/createStore';

import { sessionService } from './services';
import { RoutesSwitch } from './components';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ruRU } from "@mui/x-data-grid";

import './index.css';
import './themes/bootstrap.scss';
import './themes/paddings.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "moment/locale/ru";
import { createTheme, ThemeProvider } from '@mui/material';

sessionService.init();

const store = configureStore();

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  ruRU,
);

export const appName = 'Калини Хутор';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <BrowserRouter>
            <RoutesSwitch />
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
