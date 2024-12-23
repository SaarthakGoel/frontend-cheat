import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shuffledArr : [],
}

const extraGameSlice = createSlice({
  name : 'extraData',
  initialState,
  reducers : {
     setShuffleArr : (state , action) => {
      const {shuffledArr} = action.payload;
      state.shuffledArr = shuffledArr;
     },
  }
})

export const {setShuffleArr} = extraGameSlice.actions;

export default extraGameSlice.reducer;