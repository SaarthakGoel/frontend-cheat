export const cardFaces = ["A" , "K" , "Q" , "J" , "T" , "9" , "8" , "7", "6" , "5" , "4" , "3" , "2"];


// after doubt open card , open all cards

// 3. Player State Synchronization:
// players state is maintained in both Redux and local component state. This duplication could cause desynchronization.
// You can directly use roomData.playerNames from Redux instead of duplicating it with players.
