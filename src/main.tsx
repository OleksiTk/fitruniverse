import React from "react";
import ReactDOM from "react-dom/client"; // імпортуємо createRoot
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";

// Створення кореня для рендерингу
const root = ReactDOM.createRoot(document.getElementById("root"));

// Використовуємо createRoot для рендерингу
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
