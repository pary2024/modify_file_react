import '@fontsource/battambang'; 
import '@fontsource/roboto';
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./Colors/Themes"; // make sure path is correct
import stores from './stores/stores';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={stores}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
