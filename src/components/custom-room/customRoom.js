import React, { useEffect, useState } from 'react';
import Card from '../card/card';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../socket/socket';
import { setPlayerNames } from '../../store/roomSlice';
import ReverseCard from '../reverse-card/ReverseCard';
import { setDoubtOver, setFaceChanceData, setGameData, setRoundOver, setSkipTurn, setThrowChanceData } from '../../store/gameSlice';
import { cardFaces } from '../constants/cardFaces';
import DoubtCard from '../doubt-card/doubtCard';
import { shuffle } from 'lodash';
import { getPlayerPositions } from '../constants/playerPositions';
import Chat from '../chat/Chat';

export default function CustomRoom() {
  const dispatch = useDispatch();
  const roomData = useSelector((state => state.room));
  const gameData = useSelector(state => state.gameData);

  console.log(gameData)

  const [players, setPlayers] = useState(Array.from({ length: roomData.playerNo - 1 }, (_, i) => `Player ${i + 1}`));
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]); // State for selected cards
  const [doubtChance, setDoubtChance] = useState(false);
  const [flipedCard, setflipedCard] = useState(null);
  const [mainMessage, setMainMessage] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [myCards , setMyCards] = useState(null);

  console.log(flipedCard);

  const handleFlip = (item) => {

    if (!flipedCard) {
      socket.emit('cardFlipped', { currRoom: roomData.roomId, item: item });
      socket.emit('handleDoubtLogic', { openCard: item, currRoom: Number(roomData.roomId), currSocketId: socket.id });
    }
  };

  socket.on('cardFlipComplete', ({ item }) => {
    setflipedCard(item);
  })

  socket.on('doubtLogicDone', ({ players, turn, prev, skip, won, currentFace, cardsInMiddle, cardsInLastChance, mainMessage }) => {
    dispatch(setDoubtOver({ players, turn, prev, skip, won, currentFace, cardsInMiddle, cardsInLastChance }));
    setDoubtChance(false);
    setflipedCard(null);
    setMainMessage(mainMessage);
  });

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

  socket.on('gameStarted', ({ players, turn, skip, mainMessage }) => {
    dispatch(setGameData({ players, turn, skip, roomId: roomData.roomId }));
    setStarted(true);
    setMainMessage(mainMessage);
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


  function handleFaceClick(face) {
    socket.emit('FaceChancePlayed', { currSocketId: socket.id, currRoom: Number(roomData.roomId), selectedCards: selectedCards, currFace: face })
    setSelectedCards([]);
  }

  socket.on('FaceChanceDone', ({ players, turn, cardsInMiddle, cardsInLastChance, prev, currentFace, mainMessage }) => {
    dispatch(setFaceChanceData({ players, turn, cardsInMiddle, cardsInLastChance, prev, currentFace }));
    setMainMessage(mainMessage);
  })



  function doubtHandler() {
    socket.emit('doubtChance', { currRoom: roomData.roomId });

  }

  socket.on('doubleChosen', ({ mainMessage }) => {
    setDoubtChance(true);
    setMainMessage(mainMessage);
  })



  function throwHandler() {
    socket.emit('throwChance', { currSocketId: socket.id, currRoom: Number(roomData.roomId), selectedCards: selectedCards });
    setSelectedCards([]);
  }

  socket.on('throwChanceDone', ({ players, turn, cardsInMiddle, cardsInLastChance, prev, won, mainMessage }) => {
    dispatch(setThrowChanceData({ players, turn, cardsInMiddle, cardsInLastChance, prev, won }));
    setMainMessage(mainMessage)
  })



  function skipChanceHandler() {
    socket.emit('skipChance', { currSocketId: socket.id, currRoom: Number(roomData.roomId) });
  }

  socket.on('chanceSkipped', ({ turn, skip, mainMessage }) => {
    dispatch(setSkipTurn({ turn, skip }));
    setMainMessage(mainMessage);
  })

  socket.on('roundOver', ({ turn, prev, skip, currentFace, cardsInMiddle, cardsInLastChance }) => {
    dispatch(setRoundOver({ turn, prev, skip, currentFace, cardsInMiddle, cardsInLastChance }))
  })


  function handleIWon(){
    socket.emit('iwon' , {currSocketId: socket.id, currRoom: Number(roomData.roomId)});
  }






  useEffect(() => {
    function isSkippedcheck() {
      const index = gameData.players.findIndex((player) => player.socketId === socket.id)
      console.log(index);
      if (!gameData.skip[index]) {
        setIsSkipped(false)
      } else {
        setIsSkipped(true)
      }
    }

    isSkippedcheck();
  }, [gameData.skip]);

  useEffect(() => {
    const x = gameData.players.find((player) => player.socketId === socket.id)
    console.log(x);
    setMyCards(x?.cardQuantity);
  },[gameData])

  console.log(myCards)

  return (
    <div className='max-h-[100vh]'>
      <div className="w-full bg-emerald-600 p-5">
        <div className="grid grid-cols-12 grid-rows-12 gap-4 w-full mx-auto bg-emerald-600 min-h-screen p-5">
          {
            // players and thier components
            players.map((player, index) => {

              const playerPositions = getPlayerPositions(players.length)

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
                    {
                      gameData?.players?.find((item) => item.playerName === player)?.cards?.map((i) => (
                        <ReverseCard key={i} />
                      ))
                    }
                  </div>
                </div>
              );
            })}



          <div className="col-span-3 row-span-2 relative" style={{ gridColumnStart: 5, gridRowStart: 7 }}>
            <div className="relative">
              <p className="w-full text-xl text-center font-semibold text-white">{roomData.name}</p>
              <img src="/avatar.svg" alt="avatar" className="h-14 w-14 absolute top-[-5px] left-[-25px] rounded-full border-[3px] border-emerald-800" />
              <p className="bg-emerald-50 min-w-80 text-center text-lg p-1">
                {mainMessage}
              </p>
            </div>
            <div className="w-full flex space-x-6 absolute top-[50%] left-[-25%]">
              {gameData?.players
                ?.find((player) => player.playerName === roomData.name)
                ?.cards?.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleCardClick(item)}
                    className={`transform transition-transform duration-300 cursor-pointer ${selectedCards.includes(item) ? 'translate-y-[-20px]' : ''
                      }`}
                  >
                    <Card imgSrc={item} />
                  </div>
                ))}
            </div>
          </div>

          {
  gameData.turn === socket.id && (
    myCards === 0 ? (
      <div
        className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
        style={{ gridColumnStart: 4, gridRowStart: 9 }}
      >
        <button
          onClick={handleIWon}
          className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
        >
          I WON
        </button>
      </div>
    ) : !gameData.currentFace ? (
      <div
        className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
        style={{ gridColumnStart: 4, gridRowStart: 9 }}
      >
        {cardFaces.map((face, index) => (
          <button
            key={index} // Ensure key is unique
            disabled={selectedCards.length === 0}
            onClick={() => handleFaceClick(face)}
            className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-3 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
          >
            {face === "T" ? "10" : face}
          </button>
        ))}
      </div>
    ) : (
      <div
        className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
        style={{ gridColumnStart: 4, gridRowStart: 9 }}
      >
        <button
          onClick={doubtHandler}
          className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
        >
          I Doubt
        </button>
        <button
          onClick={throwHandler}
          disabled={isSkipped}
          className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Throw
        </button>
        <button
          onClick={skipChanceHandler}
          className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
        >
          Skip
        </button>
      </div>
    )
  )
}

          {started ? (
            <div></div>
          ) : (
            <div className="col-span-3 row-span-3 flex flex-col gap-4 justify-center items-center bg-emerald-300 rounded-lg" style={{ gridColumnStart: 1, gridRowStart: 6 }}>
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

          {
            doubtChance ?
              <div className="col-span-3 row-span-2 flex gap-4 items-center w-full space-x-20 relative" style={{ gridColumnStart: 1, gridRowStart: 6 }}>
                {
                  shuffle(gameData.cardsInLastChance).map((item) => (
                    <div onClick={() => handleFlip(item)} className=''>
                      <DoubtCard flipedCard={flipedCard === item} imgSrc={item} />
                    </div>
                  ))
                }
              </div>
              : null
          }

          <Chat />


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
