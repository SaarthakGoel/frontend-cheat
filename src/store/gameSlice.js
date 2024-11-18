import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players : [{
    playerName : null,
    cardQuantity : null,
    cards : [],
    socketId : null
  }],

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
       const {players , turn , skip} = action.payload;
       state.players = players;
       state.turn = turn;
       state.skip = skip;
       state.won = skip;
    }
  }
})

export const {setGameData} = gameSlice.actions;

export default gameSlice.reducer;