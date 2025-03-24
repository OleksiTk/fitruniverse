// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import checkPositionReducer from "../state/state.slice"; // правильний шлях до файлу редюсера

const store = configureStore({
  reducer: {
    checkPosition: checkPositionReducer, // виправлено назву редюсера
  },
});

export default store;
