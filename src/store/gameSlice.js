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
    },
    setThrowChanceData : (state , action) => {
      const {players , turn , cardsInMiddle , cardsInLastChance , prev , won} = action.payload;
      state.players = players;
      state.turn = turn;
      state.cardsInMiddle = cardsInMiddle;
      state.cardsInLastChance = cardsInLastChance;
      state.prev = prev;
      state.won = won
    },
    setSkipTurn : (state , action) => {
      const {turn , skip} = action.payload;
      state.turn = turn;
      state.skip = skip;
    },
    setRoundOver : (state , action) => {
      const {turn , prev , skip , won , currentFace , cardsInMiddle , cardsInLastChance} = action.payload;
      state.turn = turn;
      state.prev = prev;
      state.skip = skip;
      state.won = won;
      state.currentFace = currentFace;
      state.cardsInMiddle = cardsInMiddle;
      state.cardsInLastChance = cardsInLastChance;
    },
    setDoubtOver : (state , action) => {
      const {players , turn , prev , skip , won , currentFace , cardsInMiddle , cardsInLastChance} = action.payload;
      state.players = players;
      state.turn = turn;
      state.prev = prev;
      state.won = won;
      state.skip = skip;
      state.currentFace = currentFace;
      state.cardsInMiddle = cardsInMiddle;
      state.cardsInLastChance = cardsInLastChance;
    }
  }
})

export const {setGameData , setFaceChanceData , setThrowChanceData , setSkipTurn , setRoundOver , setDoubtOver} = gameSlice.actions;

export default gameSlice.reducer;