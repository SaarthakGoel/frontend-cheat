export const cardFaces = ["A" , "K" , "Q" , "J" , "T" , "9" , "8" , "7", "6" , "5" , "4" , "3" , "2"];


// after doubt open card , open all cards
// shuffle doubt cards

// 3. Player State Synchronization:
// players state is maintained in both Redux and local component state. This duplication could cause desynchronization.
// You can directly use roomData.playerNames from Redux instead of duplicating it with players.


// playerPositions for different players is hardcoded. This could be dynamic based on the number of players:
// jsx
// Copy code
// const playerPositions = Array.from({ length: roomData.playerNo }, (_, index) => ({
//   colStart: (index * 2) + 1,
//   rowStart: index % 2 === 0 ? 1 : 3,
// }));