import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shuffledArr : [],
  messageArr : [],
}

const extraGameSlice = createSlice({
  name : 'extraData',
  initialState,
  reducers : {
     setShuffleArr : (state , action) => {
      const {shuffledArr} = action.payload;
      state.shuffledArr = [...shuffledArr];
     },
     setMessageArr : (state , action) => {
      const {name , message} = action.payload;
      state.messageArr = [...state.messageArr , {name : name , message : message}];
     }
  }
})

export const {setShuffleArr , setMessageArr} = extraGameSlice.actions;

export default extraGameSlice.reducer;