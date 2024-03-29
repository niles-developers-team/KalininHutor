import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';

import configureStore from './store/createStore';

import { sessionService } from './services';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ruRU } from "@mui/x-data-grid";

import './index.css';
import './themes/bootstrap.scss';
import './themes/paddings.scss';
import './themes/margins.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "moment/locale/ru";
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { RoutesSwitch } from './routes';
import { YMInitializer } from 'react-yandex-metrika';

sessionService.init();

const store = configureStore();

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
      background: {
        default: '#e3e3e3'
      }
    },
  },
  ruRU,
);

export const appName = 'Калинин Хутор';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={theme}>
    <YMInitializer accounts={[94277254]} options={{
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    }} />
    <CssBaseline />
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
