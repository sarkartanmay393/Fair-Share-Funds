import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider, createStore } from "easy-peasy";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App";
import Theme from "./theme/theme";
import globalStore from "./store/globalStore";
import reportWebVitals from "./reportWebVitals";
import SupabaseContextProvider from "./provider/supabase/provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const mode = "dark";
const theme = createTheme(Theme(mode));
const store = createStore(globalStore);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SupabaseContextProvider>
        <StoreProvider store={store}>
          <App />
        </StoreProvider>
      </SupabaseContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
