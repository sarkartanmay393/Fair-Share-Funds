import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider, createStore } from "easy-peasy";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App.tsx";
import Theme from "./theme/theme.ts";
import globalStore from "./store/globalStore.ts";
import reportWebVitals from "./reportWebVitals.ts";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("On need refresh");
    const prompt = document.createElement("div");
    prompt.style.position = "fixed";
    prompt.style.bottom = "0";
    prompt.style.width = "100%";
    prompt.style.backgroundColor = "#333";
    prompt.style.color = "#fff";
    prompt.style.textAlign = "center";
    prompt.style.padding = "1em";
    prompt.innerText = "New version available. Click to update.";
    prompt.style.cursor = "pointer";

    prompt.addEventListener("click", () => {
      updateSW(true);
    });

    document.body.appendChild(prompt);
  },
  onOfflineReady() {
    console.log("The application is ready to work offline");
  },
});

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
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
