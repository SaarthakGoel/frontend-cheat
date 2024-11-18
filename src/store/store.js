import { configureStore } from "@reduxjs/toolkit";
import roomReducer from './roomSlice';
import gameReducer from './gameSlice';

const store = configureStore({
  reducer : {
     room : roomReducer,
     gameData : gameReducer
  }
})

export default store;