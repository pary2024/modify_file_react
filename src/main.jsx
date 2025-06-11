import '@fontsource/battambang'; 
import '@fontsource/roboto';
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./colors/Thems"; // make sure path is correct
import store from './stores/store';
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
