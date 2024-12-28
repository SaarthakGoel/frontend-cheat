import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [
    {
      playerName: null,
      playerIndex: null,
      cards: [],
    },
  ],
  turn: null,
  prev: null,
  skip: [],
  won: [],
  currentFace: null,
  cardsInMiddle: [],
  cardsInLastChance: [],
};

const computerGameSlice = createSlice({
  name: "computerGame",
  initialState,
  reducers: {
    setComputerGameState: (state, action) => {

      const { players, turn, skip, won } = action.payload;

      state.players = players;

      state.turn = turn;

      state.skip = skip;

      state.won = won;

    },
    setPlayers(state, action) {
      state.players = action.payload;
    },
    setTurn(state, action) {
      state.turn = action.payload;
    },
    setPrev(state, action) {
      state.prev = action.payload;
    },
    setSkip(state, action) {
      state.skip = action.payload;
    },
    setWon(state, action) {
      state.won = action.payload;
    },
    setCurrentFace(state, action) {
      state.currentFace = action.payload;
    },
    setCardsInMiddle(state, action) {
      state.cardsInMiddle = action.payload;
    },
    setCardsInLastChance(state, action) {
      state.cardsInLastChance = action.payload;
    },
    clearComputerGame(state , action){
      return initialState;
    }
  },
});

export const {
  setComputerGameState,
  setPlayers,
  setTurn,
  setPrev,
  setSkip,
  setWon,
  setCurrentFace,
  setCardsInMiddle,
  setCardsInLastChance,
  clearComputerGame
} = computerGameSlice.actions;

export default computerGameSlice.reducer;