import React, { useEffect, useState } from 'react';
import Card from '../card/card';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../socket/socket';
import { setPlayerNames } from '../../store/roomSlice';
import ReverseCard from '../reverse-card/ReverseCard';
import { clearData, setDoubtOver, setFaceChanceData, setGameData, setRoundOver, setSkipTurn, setThrowChanceData } from '../../store/gameSlice';
import { cardFaces } from '../constants/cardFaces';
import DoubtCard from '../doubt-card/doubtCard';
import { shuffle } from 'lodash';
import { getPlayerPositions } from '../constants/playerPositions';
import Chat from '../chat/Chat';
import RankCard from '../rankCard/rankCard';
import './customRoom.css';
import { setMessageArr } from '../../store/extraSlice';



export default function CustomRoom() {
  const dispatch = useDispatch();
  const roomData = useSelector((state => state.room));
  const gameData = useSelector(state => state.gameData);
  const extraData = useSelector((state) => state.extraGameData);
  const messageArr = extraData.messageArr;
  const screenWidth = window.innerWidth;

  console.log(gameData)

  const [players, setPlayers] = useState(Array.from({ length: roomData.playerNo - 1 }, (_, i) => `Player ${i + 1}`));
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]); // State for selected cards
  const [doubtChance, setDoubtChance] = useState(false);
  const [flipedCard, setflipedCard] = useState(null);
  const [mainMessage, setMainMessage] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [myCards, setMyCards] = useState(null);
  const [isPrevOnly, setIsPrevOnly] = useState(false);
  const [ranking, setRanking] = useState(null);
  const [shuffledArr, setShuffledArr] = useState([]);
  const [chatPop, setChatPop] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  //Animation states
  const [faceCardAnimation, setFaceCardAnimation] = useState(false);

  const handleFlip = (item) => {

    if (!flipedCard) {
      socket.emit('cardFlipped', { currRoom: roomData.roomId, item: item });
      setTimeout(() => {
        socket.emit('handleDoubtLogic', { openCard: item, currRoom: Number(roomData.roomId), currSocketId: socket.id });
      }, 2000)
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
    dispatch(setPlayerNames({ playerNames: playerName }));
    const x = handleNameAssign(playerName, players);
    console.log(x);
    setPlayers(x);
  });


  socket.on('onlineJoined', ({ playerNames }) => {
    console.log("this is working Congrats!")
    console.log(playerNames);
    dispatch(setPlayerNames({ playerNames }));
    const x = handleNameAssign(playerNames, players);
    console.log(x);
    setPlayers(x);
  })


  console.log("Global players state", players)

  socket.on('playerLeft', ({ playerName }) => {
    dispatch(setPlayerNames({ playerName }));
    setPlayers(handleNameAssign2(playerName, players));
  });

  function handleNameAssign(playerNames, players) {
    console.log("in fuction", playerNames, players, roomData.name)
    const myIndex = playerNames.indexOf(roomData.name);

    if (myIndex === -1) {
      console.error('Your name is not in the list of real player names');
      return players;
    }

    const orderedNames = [
      ...playerNames.slice(myIndex + 1),
      ...playerNames.slice(0, myIndex),
    ];

    console.log("ordered names", orderedNames)

    const updatedPlayers = players.map((_, index) => {
      return orderedNames[index] || players[index];
    });
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


  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
    }
  };


  function handleFaceClick(face) {
    setFaceCardAnimation(true);
    setTimeout(() => {
      socket.emit('FaceChancePlayed', { currSocketId: socket.id, currRoom: Number(roomData.roomId), selectedCards: selectedCards, currFace: face })
      setSelectedCards([]);
      setFaceCardAnimation(false);
    }, 500);
  }

  socket.on('FaceChanceDone', ({ players, turn, cardsInMiddle, cardsInLastChance, prev, currentFace, mainMessage }) => {
    dispatch(setFaceChanceData({ players, turn, cardsInMiddle, cardsInLastChance, prev, currentFace }));
    setMainMessage(mainMessage);
  })



  function doubtHandler() {
    socket.emit('doubtChance', { currRoom: roomData.roomId });

  }

  socket.on('doubleChosen', ({ mainMessage }) => {
    setShuffledArr(shuffle(gameData.cardsInLastChance));
    setDoubtChance(true);
    setMainMessage(mainMessage);
  })



  function throwHandler() {
    setFaceCardAnimation(true);
    setTimeout(() => {
      socket.emit('throwChance', { currSocketId: socket.id, currRoom: Number(roomData.roomId), selectedCards: selectedCards });
      setFaceCardAnimation(false);
      setSelectedCards([]);
    }, 500)
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

  socket.on('roundOver', ({ turn, prev, skip, won, currentFace, cardsInMiddle, cardsInLastChance }) => {
    dispatch(setRoundOver({ turn, prev, skip, won, currentFace, cardsInMiddle, cardsInLastChance }))
  })

  socket.on('GameOver', ({ rankData }) => {
    setRanking(rankData);
    console.log(ranking);
  })


  function handleIWon() {
    socket.emit('iwon', { currSocketId: socket.id, currRoom: Number(roomData.roomId) });
    setWin(true);
  }

  socket.on('clearGameSlice', () => {
    console.log('this ran too')
    dispatch(clearData());
    setStarted(false);
    setMainMessage("");
  })





  //SIDE EFFECT
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
    if (gameData.turn === gameData.prev) {
      setIsPrevOnly(true);
    } else {
      setIsPrevOnly(false);
    }
  }, [gameData.turn])


  useEffect(() => {
    const x = gameData.players.find((player) => player.socketId === socket.id)
    setMyCards(x?.cardQuantity);
  }, [gameData])


  useEffect(() => {
    // Listen for chat messages from the server
    socket.on("chatSended", ({ name, message }) => {
      dispatch(setMessageArr({ name, message }));
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("chatSended");
    };
  }, []);

  useEffect(() => {
    if (chatPop) {
      setNewMessages(false);
      setLastMessageCount(messageArr.length);
    } else if (messageArr.length > lastMessageCount) {
      // Set newMessages to true only if there are new messages since chat was closed
      setNewMessages(true);
    }
  }, [messageArr, chatPop, lastMessageCount]);


  return (
    <div className="max-h-[100vh]">
      <div className="w-full bg-emerald-600 p-5">
        {ranking ? (
          <div className="flex justify-center items-center min-h-screen">
            <RankCard ranking={ranking} setRanking={setRanking} />
          </div>
        ) : (
          <div className="grid grid-cols-12 grid-rows-12 gap-4 w-full mx-auto bg-emerald-600 min-h-screen p-5">
            {/* Players */}
            {players.map((player, index) => {
              const playerPositions = getPlayerPositions(roomData.playerNo - 1);
              return (
                <div
                  key={index}
                  className="col-span-5 md:col-span-3 lg:col-span-2 row-span-1 relative bg-green-900 text-white rounded-lg shadow-md py-2 flex justify-center items-center"
                  style={{
                    gridColumnStart: playerPositions[index]?.colStart,
                    gridRowStart: playerPositions[index]?.rowStart,
                  }}
                >
                  <div className="mb-2">
                    <img src="/avatar.svg" alt="avatar" className="h-9 w-9 md:h-12 md:w-12 rounded-full" />
                  </div>
                  <p className="md:text-lg font-semibold">{player}</p>
                  <div className="w-full flex space-x-1 md:space-x-2 lg:space-x-3 absolute top-[100%]">
                    {gameData?.players
                      ?.find(item => item.playerName === player)
                      ?.cards?.map(i => (
                        <ReverseCard key={i} />
                      ))}
                  </div>
                </div>
              );
            })}

            {/* Current Player */}
            <div
              className="col-span-3 row-span-2 relative"
              style={screenWidth <= 768 ? { gridColumnStart: 4, gridRowStart: 9 } : screenWidth <= 1024 ? { gridColumnStart: 5, gridRowStart: 7 } : { gridColumnStart: 5, gridRowStart: 7 }}
            >
              <div className="relative">
                <p className="w-full md:text-lg lg:text-xl text-center font-semibold text-white">
                  {roomData.name}
                </p>
                <img
                  src="/avatar.svg"
                  alt="avatar"
                  className="h-12 w-12 lg:h-14 lg:w-14 absolute top-[-15px] left-[-50px] md:top-[-5px] md:left-[-25px] rounded-full border-[3px] border-emerald-800"
                />
                <p className="bg-emerald-50 min-w-52 md:min-w-72 lg:min-w-80 text-center text-base md:text-lg p-1">{mainMessage}</p>
              </div>
              <div className="w-full flex space-x-[14px] md:space-x-4 lg:space-x-6 absolute top-[50%] left-[-120%] md:left-[-25%]">
                {gameData?.players
                  ?.find(player => player.playerName === roomData.name)
                  ?.cards?.map(item => (
                    <div
                      key={item}
                      onClick={() => handleCardClick(item)}
                      className={`transform transition-transform duration-200 cursor-pointer ${selectedCards.includes(item) ? faceCardAnimation ? 'facecardanimation' : 'translate-y-[-20px]' : ''
                        }`}
                    >
                      <Card imgSrc={item} />
                    </div>
                  ))}
              </div>
            </div>


            {/*Middle Section*/}
            <div
              className="col-span-8 md:col-span-6 lg:col-span-3 row-span-2 w-full flex space-x-[5px] md:space-x-2 lg:space-x-3 ring-inset bg-emerald-500 py-8 px-2 shadow-inner"
              style={screenWidth <= 768 ? { gridColumnStart: 3, gridRowStart: 6 } : screenWidth <= 1024 ? { gridColumnStart: 4, gridRowStart: 4 } : { gridColumnStart: 5, gridRowStart: 4 }}
            >
              {
                doubtChance ?
                  gameData.cardsInMiddle.filter((card) => !gameData.cardsInLastChance.includes(card)).map(i => (
                    <ReverseCard key={i} />
                  ))
                  :
                  gameData.cardsInMiddle?.map(i => (
                    <ReverseCard key={i} />
                  ))
              }
            </div>

            {/* Action Buttons */}
            {gameData.turn === socket.id && (
              myCards === 0 ? (
                <div
                  className="col-span-12 md:col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
                  style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <= 1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
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
                  className="col-span-12 md:col-span-5 row-span-1 flex justify-around pt-2 flex-wrap gap-1 md:gap-0 md:flex-nowrap items-end pb-3 rounded-lg relative"
                  style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <= 1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <div className='absolute top-4 left-4 space-x-[4px] space-y-[4px] md:static'>
                    {cardFaces.map((face, index) => (
                      <button
                        key={index}
                        disabled={selectedCards.length === 0}
                        onClick={() => handleFaceClick(face)}
                        className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-3 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
                      >
                        {face === 'T' ? '10' : face}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="col-span-12 md:col-span-5 row-span-1 flex justify-around items-end px-4 pb-3 bg-emerald-300 rounded-lg"
                  style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <= 1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <button
                    disabled={isPrevOnly || doubtChance}
                    onClick={doubtHandler}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cheat!
                  </button>
                  <button
                    onClick={throwHandler}
                    disabled={isSkipped || doubtChance}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Throw
                  </button>
                  <button
                    disabled={doubtChance}
                    onClick={skipChanceHandler}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pass
                  </button>
                </div>
              )
            )}

            {/* Game Not Started */}
            {!started && (
              <div
                className="col-span-8 md:col-span-6 lg:col-span-3 row-span-3 flex flex-col gap-4 justify-center items-center bg-emerald-300 rounded-lg"
                style={screenWidth <= 768 ? { gridColumnStart: 3, gridRowStart: 4 } : screenWidth <= 1024 ? { gridColumnStart: 4, gridRowStart: 4 } : { gridColumnStart: 5, gridRowStart: 4 }}
              >
                <button
                  disabled={roomData.playerNames?.length !== roomData.playerNo || roomData.host !== true}
                  onClick={handleStartGame}
                  className="bg-emerald-900 rounded-full text-lg md:text-xl lg:text-2xl font-semibold text-emerald-100 px-2 md:px-4 lg:px-8 py-3 hover:bg-white hover:text-emerald-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Game
                </button>
                <p className="text-sm md:text-base lg:text-lg text-pretty font-semibold">
                  No of players in room : {roomData.playerNames?.length}/{roomData.playerNo}
                </p>
                <p className="text-sm md:text-base lg:text-lg text-pretty font-semibold">Room Id : {roomData.roomId}</p>
                <p className="text-sm md:text-base text-pretty font-semibold">
                  {roomData.playerNames?.length === roomData.playerNo
                    ? 'Wait for the host to start the game'
                    : 'Waiting for other players'}
                </p>
              </div>
            )}

            {/* Doubt Section */}
            {doubtChance && (
              <div
                className="col-span-10 lg:col-span-3 row-span-2 flex gap-4 items-center w-full space-x-[70px] lg:space-x-20 relative"
                style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 6 } : { gridColumnStart: 1, gridRowStart: 6 }}
              >
                {shuffledArr.map(item => (
                  <button key={item} disabled={gameData.turn !== socket.id} onClick={() => handleFlip(item)}>
                    <DoubtCard flipedCard={flipedCard === item} imgSrc={item} />
                  </button>
                ))}
              </div>
            )}

            {/* Chat Component */}
            {
              screenWidth > 1024 ? <Chat setChatPop={setChatPop} /> : chatPop ? <Chat setChatPop={setChatPop} /> : <div className='fixed top-[50%] right-[2px]'>
                {!chatPop && newMessages ? <div className="fixed top-[48%] right-[10px] bg-red-700 text-xs text-white font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                  New!
                </div> : null}
                <button className='bg-emerald-900 p-1 rounded-md' onClick={() => setChatPop(true)}>
                  <img src='/comments-regular.svg' className='h-10 w-10' />
                </button>
              </div>
            }

            {/* Win Section */}
            {win && (
              <div className="col-span-3 row-span-1 mt-10 bg-white p-4 rounded-md shadow-lg w-full max-w-lg text-center" style={{ gridColumnStart: 4, gridRowStart: 9 }}>
                <p className="text-gray-800 bg-emerald-500 text-lg md:text-xl font-bold mb-4">Congratulations! You won! {gameData?.won[gameData?.players?.findIndex((player) => player.playerName === roomData.name)]}th Rank</p>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );

}
