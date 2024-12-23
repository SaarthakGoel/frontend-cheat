import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players : [{
    playerName : null,
    playerIndex : null,
    cards : [],
  }],
  turn : null,
  prev : null,
  skip : [],
  won : [],
  currentFace : null,
  cardsInMiddle : [],
  cardsInLastChance : []
}

const computerGameSlice = createSlice({
  name : 'gameData',
  initialState,
  reducers : {
     setComputerGameState : (state , action) => {
       const {players , turn , skip , won} = action.payload;
       state.players = players;
       state.turn = turn;
       state.skip = skip;
       state.won = won;
     },
     setComputerState: (state, action) => {
      const { localState } = action.payload;
    
      // Create a deep copy of the state using structuredClone or another utility
      return {
        ...state,
        players: [...localState.players],
        turn: localState.turn,
        prev: localState.prev,
        skip: [...localState.skip],
        won: [...localState.won],
        currentFace: localState.currentFace,
        cardsInMiddle: [...localState.cardsInMiddle],
        cardsInLastChance: [...localState.cardsInLastChance],
      };
    },
  }
})

export const {setComputerGameState , setComputerState} = computerGameSlice.actions;

export default computerGameSlice.reducer;