import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  name : "",
  roomId : 0,
  playerNo : 0,
  decks : 0,
  host : true,
  playerNames : []
}

const roomSlice = createSlice({
  name : 'room',
  initialState,
  reducers : {
    setState: (state, action) => {
      const { name,roomName, numPlayers, numDecks , host } = action.payload;
      const introom = parseInt(roomName)
      state.name = name;
      state.roomId = introom;
      state.playerNo = numPlayers;
      state.decks = numDecks;
      state.host = host;
    },
    setPlayerNames : (state , action) => {
      const {playerName} = action.payload;
      state.playerNames = playerName;
    }
  }
})

export const {setState , setPlayerNames} = roomSlice.actions;

export default roomSlice.reducer;