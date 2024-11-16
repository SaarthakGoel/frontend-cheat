import { configureStore } from "@reduxjs/toolkit";
import roomReducer from './roomSlice'

const store = configureStore({
  reducer : {
     room : roomReducer,
  }
})

export default store;