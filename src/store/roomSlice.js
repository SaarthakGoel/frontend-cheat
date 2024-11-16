import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  name : "",
  roomId : 0,
  playerNo : 0,
  decks : 0
}

const roomSlice = createSlice({
  name : 'room',
  initialState,
  reducers : {
    setState: (state, action) => {
      const { name,roomName, numPlayers, numDecks } = action.payload;

      console.log(name, roomName, numPlayers, numDecks);

      const introom = parseInt(roomName)

      state.name = name;
      state.roomId = introom;
      state.playerNo = numPlayers;
      state.decks = numDecks;

      console.log(JSON.stringify(state));
    }
  }
})

export const {setState} = roomSlice.actions;

export default roomSlice.reducer;