import React, { useState } from 'react';
import Card from '../card/card';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../socket/socket';
import { setPlayerNames } from '../../store/roomSlice';
import ReverseCard from '../reverse-card/ReverseCard';
import { setGameData } from '../../store/gameSlice';

export default function CustomRoom() {
  const dispatch = useDispatch();
  const roomData = useSelector((state => state.room));
  const gameData = useSelector(state => state.gameData);

  console.log(gameData)

  const [players, setPlayers] = useState(Array.from({ length: roomData.playerNo - 1 }, (_, i) => `Player ${i + 1}`));
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]); // State for selected cards

  // Room Socket Logic
  socket.on('playerJoined', ({ playerName }) => {
    dispatch(setPlayerNames({ playerName }));
    setPlayers(handleNameAssign(playerName, players));
  });

  socket.on('playerLeft', ({ playerName }) => {
    dispatch(setPlayerNames({ playerName }));
    setPlayers(handleNameAssign2(playerName, players));
  });

  function handleNameAssign(playerNames, players) {
    const myIndex = playerNames.indexOf(roomData.name);

    if (myIndex === -1) {
      console.error('Your name is not in the list of real player names');
      return players;
    }

    const orderedNames = [
      ...playerNames.slice(myIndex + 1),
      ...playerNames.slice(0, myIndex),
    ];

    const updatedPlayers = players.map((_, index) => {
      return orderedNames[index] || players[index];
    });
    console.log(updatedPlayers);
    return updatedPlayers;
  }

  function handleNameAssign2(playerNames, players) {
    const myIndex = playerNames.indexOf(roomData.name);

    if (myIndex === -1) {
      console.error('Your name is not in the list of real player names');
      return players;
    }

    const orderedNames = [
      ...playerNames.slice(myIndex + 1),
      ...playerNames.slice(0, myIndex),
    ];

    const updatedPlayers = players.map((_, index) => {
      return orderedNames[index] || 'Waiting';
    });

    return updatedPlayers;
  }

  function handleStartGame() {
    socket.emit('startGame', { currSocketId: socket.id, currRoom: Number(roomData.roomId) });
  }

  socket.on('gameStarted', ({ players, turn, skip }) => {
    dispatch(setGameData({ players, turn, skip }));
    setStarted(true);
  });

  // Function to handle card click
  const handleCardClick = (card) => {
    // Check if the card is already selected
    if (selectedCards.includes(card)) {
      // Remove card if it's already selected
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 4) {
      // Add card if not already selected and limit not reached
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <div>
      <div className="w-full bg-emerald-600 p-5">
        <div className="grid grid-cols-12 grid-rows-12 gap-4 w-full mx-auto bg-emerald-600 min-h-screen p-5">
          {players.map((player, index) => {
            const playerPositions = [
              { colStart: 1, rowStart: 3 },
              { colStart: 3, rowStart: 1 },
              { colStart: 6, rowStart: 1 },
              { colStart: 9, rowStart: 1 },
              { colStart: 11, rowStart: 3 },
            ];

            return (
              <div
                className="col-span-2 row-span-1 relative bg-green-900 text-white rounded-lg shadow-md py-2 flex justify-center items-center"
                style={{
                  gridColumnStart: playerPositions[index]?.colStart,
                  gridRowStart: playerPositions[index]?.rowStart,
                }}
                key={index}
              >
                <div className="mb-2">
                  <img
                    src="/avatar.svg"
                    alt={`avatar`}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <p className="text-lg font-semibold">{player}</p>
                <div className="w-full flex space-x-3 absolute top-[100%]">
                  {[...Array(13)].map((_, cardIndex) => (
                    <ReverseCard key={cardIndex} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="col-span-2 row-span-2 relative" style={{ gridColumnStart: 6, gridRowStart: 7 }}>
            <div className="relative">
              <p className="w-full text-xl text-center font-semibold text-white">{roomData.name}</p>
              <img src="/avatar.svg" alt="avatar" className="h-14 w-14 absolute top-[-5px] left-[-25px] rounded-full border-[3px] border-emerald-800" />
              <p className="bg-emerald-50 min-w-80 text-center text-lg p-1">hello</p>
            </div>
            <div className="w-full flex space-x-8 absolute top-[50%]">
              {gameData.players[0].cards.map((item) => (
                <div
                  key={item}
                  onClick={() => handleCardClick(item)}
                  className={`transform transition-transform duration-300 cursor-pointer ${
                    selectedCards.includes(item) ? 'translate-y-[-10px]' : ''
                  }`}
                >
                  <Card imgSrc={item} />
                </div>
              ))}
            </div>
          </div>

          {started ? (
            <div></div>
          ) : (
            <div className="col-span-4 row-span-3 flex flex-col gap-4 justify-center items-center bg-emerald-300 rounded-lg" style={{ gridColumnStart: 1, gridRowStart: 6 }}>
              <button
                disabled={roomData.playerNames.length !== roomData.playerNo || roomData.host !== true}
                onClick={handleStartGame}
                className="bg-emerald-900 rounded-full text-2xl font-semibold text-emerald-100 px-8 py-3 hover:bg-white hover:text-emerald-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Game
              </button>
              <p className="text-lg text-pretty font-semibold">No of players in room : {roomData.playerNames.length}/{roomData.playerNo}</p>
              <p className="text-lg text-pretty font-semibold">Room Id : {roomData.roomId}</p>
              <p className="text-pretty font-semibold">
                {roomData.playerNames.length === roomData.playerNo ? 'Wait for the host to start the game' : 'Waiting for other players'}
              </p>
            </div>
          )}
        </div>
        {win ? (
          <div className="mt-10 bg-white p-4 rounded-md shadow-lg w-full max-w-lg text-center">
            <p className="text-gray-800 text-lg mb-4">Congratulations! You won!</p>
            <div className="flex justify-between">
              <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Play with other rivals
              </button>
              <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Play with the same rivals
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
