import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players : [{
    playerName : null,
    cardQuantity : null,
    cards : [],
    socketId : null
  }],
  roomId : "",
  turn : null,
  prev : null,
  skip : [],
  won : [],
  currentFace : null,

  cardsInMiddle : [],
  cardsInLastChance : []
}

const gameSlice = createSlice({
  name : 'gameData',
  initialState,
  reducers : {
    setGameData : (state , action) => {
       const {players , turn , skip , roomId} = action.payload;
       state.players = players;
       state.roomId = roomId;
       state.turn = turn;
       state.skip = skip;
       state.won = skip;
    },
    setFaceChanceData : (state , action) => {
      const {players , turn , cardsInMiddle , cardsInLastChance , prev , currentFace} = action.payload;
      state.players = players;
      state.turn = turn;
      state.cardsInMiddle = cardsInMiddle;
      state.cardsInLastChance = cardsInLastChance;
      state.prev = prev;
      state.currentFace = currentFace;
    }
  }
})

export const {setGameData , setFaceChanceData} = gameSlice.actions;

export default gameSlice.reducer;