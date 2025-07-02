import '@fontsource/battambang'; 
import '@fontsource/roboto';
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./Colors/Thems"; // make sure path is correct
import store from './Stores/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
