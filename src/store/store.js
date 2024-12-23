import { configureStore } from "@reduxjs/toolkit";
import roomReducer from './roomSlice';
import gameReducer from './gameSlice';
import computerReducer from './computerGameSlice';
import extraReducer from './extraSlice';

const store = configureStore({
  reducer : {
     room : roomReducer,
     gameData : gameReducer,
     computerGameData : computerReducer,
     extraGameData : extraReducer
  }
})

export default store;