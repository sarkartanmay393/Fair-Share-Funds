import './styles/globals.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import App from './App';
import Theme from './theme/theme';
import reportWebVitals from './reportWebVitals';
import { StoreProvider, createStore } from 'easy-peasy';
import globalStore from './store/globalStore';
import { GlobalStore } from './interfaces';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const mode = 'dark';
const theme = createTheme(Theme(mode));
const store = createStore<GlobalStore>(globalStore);

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
