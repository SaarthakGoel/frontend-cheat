import React, { useEffect, useState } from 'react';
import Card from '../card/card';
import { useDispatch, useSelector } from 'react-redux';
import ReverseCard from '../reverse-card/ReverseCard';
import { cardFaces, findFaceName } from '../constants/cardFaces';
import DoubtCard from '../doubt-card/doubtCard';
import { shuffle } from 'lodash';
import { getPlayerPositions } from '../constants/playerPositions';
import RankCard from '../rankCard/rankCard';
import { setPlayers, setTurn, setPrev, setSkip, setWon, setCurrentFace, setCardsInMiddle, setCardsInLastChance, } from '../../store/computerGameSlice';
import { setShuffleArr } from '../../store/extraSlice';



export default function ComputerRoom() {
  const dispatch = useDispatch();
  const computerGameData = useSelector(state => state.computerGameData);
  const extraData = useSelector(state => state.extraGameData);
  const screenWidth = window.innerWidth;
  console.log(computerGameData)
  console.log(extraData);

  const [selectedCards, setSelectedCards] = useState([]);
  const [doubtChance, setDoubtChance] = useState(false);
  const [flipedCard, setFlipedCard] = useState(null);
  const [mainMessage, setMainMessage] = useState("");
  const [ranking, setRanking] = useState(null);
  const [cheatComplete , setCheatCompelte] = useState(false);
  const [allThrownCards, setAllThrownCards] = useState([]);
  console.log('all thrown cards', allThrownCards)

  const decks = computerGameData.players.length === 3 ? 1 : computerGameData.players.length === 4 && computerGameData.players[0].cards === 13 ? 1 : 2;


  //Animation states
  const [faceCardAnimation, setFaceCardAnimation] = useState(false);

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
    }
  };


  async function handleFaceClick(face, index, selectedCards) {
    console.log(`Face chance played by player ${index}`);
    setFaceCardAnimation(true);
    const shuffledArr = shuffle(selectedCards);
    dispatch(setShuffleArr({ shuffledArr }));
    await delay(500);

    const localPlayers = [...computerGameData.players];
    const updatedPlayerCards = localPlayers[index].cards.filter(
      (card) => !selectedCards.includes(card)
    );
    localPlayers[index] = { ...localPlayers[index], cards: updatedPlayerCards };

    dispatch(setPlayers(localPlayers));
    dispatch(setCardsInLastChance(selectedCards));
    setAllThrownCards((prev) => [...prev, ...selectedCards]);

    dispatch(setCardsInMiddle(selectedCards));

    dispatch(setPrev(index));
    dispatch(setCurrentFace(face));

    let nextPlayerIndex = (index + 1) % localPlayers.length;
    while (computerGameData.won[nextPlayerIndex] > 0) {
      nextPlayerIndex = (nextPlayerIndex + 1) % localPlayers.length;
    }

    dispatch(setTurn(nextPlayerIndex));

    setMainMessage(
      `${localPlayers[index].playerName} threw ${selectedCards.length} ${findFaceName(
        face
      )}`
    );
    setSelectedCards([]);
    setFaceCardAnimation(false);
  }

  async function throwHandler(index, selectedCards) {
    console.log(`Throw chance played by player ${index}`);
    setFaceCardAnimation(true);

    const shuffledArr = shuffle(selectedCards);
    dispatch(setShuffleArr({ shuffledArr }));

    await delay(500);

    const localPlayers = [...computerGameData.players];
    const updatedPlayerCards = localPlayers[index].cards.filter(
      (card) => !selectedCards.includes(card)
    );
    localPlayers[index] = { ...localPlayers[index], cards: updatedPlayerCards };

    dispatch(setPlayers(localPlayers));
    dispatch(setCardsInLastChance(selectedCards));
    setAllThrownCards((prev) => [...prev, ...selectedCards]);

    if (!computerGameData.cardsInMiddle.length) {
      dispatch(setCardsInMiddle(selectedCards));
    } else {
      dispatch(
        setCardsInMiddle([...computerGameData.cardsInMiddle, ...selectedCards])
      );
    }

    dispatch(setPrev(index));

    let nextPlayerIndex = (index + 1) % localPlayers.length;
    while (computerGameData.won[nextPlayerIndex] > 0) {
      nextPlayerIndex = (nextPlayerIndex + 1) % localPlayers.length;
    }

    dispatch(setTurn(nextPlayerIndex));

    setMainMessage(
      `${localPlayers[index].playerName} threw ${selectedCards.length} ${findFaceName(
        computerGameData.currentFace
      )}`
    );
    setSelectedCards([]);
    setFaceCardAnimation(false);
  }

  function skipChanceHandler(index) {
    console.log(`Skip chance played by player ${index}`);

    const updatedSkip = [...computerGameData.skip];
    updatedSkip[index] = 1;

    dispatch(setSkip(updatedSkip));

    if (Math.min(...updatedSkip) === 1) {
      let nextPlayerIndex = (index + 1) % computerGameData.players.length;
      while (computerGameData.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % computerGameData.players.length;
      }

      dispatch(setTurn(nextPlayerIndex));
      dispatch(setPrev(null));
      dispatch(setSkip(computerGameData.won.map((x) => x >= 1)));
      dispatch(setCurrentFace(null));
      dispatch(setCardsInMiddle([]));
      dispatch(setCardsInLastChance([]));
    } else {
      let nextPlayerIndex = (index + 1) % computerGameData.players.length;
      while (computerGameData.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % computerGameData.players.length;
      }

      dispatch(setTurn(nextPlayerIndex));
      setMainMessage(`${computerGameData.players[index].playerName} has skipped`);
    }
  }

  function doubtHandler(index) {
    console.log(`Doubt chance played by player ${index}`);

    setMainMessage(
      `${computerGameData.players[index].playerName} has doubted ${computerGameData.players[computerGameData.prev].playerName}`
    );
    //dispatch(setCardsInLastChance(shuffledArr));
    setDoubtChance(true);
  }


  const handleFlip = async (item, index) => {
    console.log(`Card ${item} flipped by player ${index}`);
    setFlipedCard(item);

    await delay(1000);

    const localPlayers = [...computerGameData.players];

    if (computerGameData.currentFace === item[0]) {
      const updatedCards = [
        ...localPlayers[index].cards,
        ...computerGameData.cardsInMiddle,
      ];

      updatedCards.sort((a, b) => a.localeCompare(b));
      localPlayers[index] = { ...localPlayers[index], cards: updatedCards };
      dispatch(setPlayers(localPlayers));

      let nextPlayerIndex = (index + 1) % localPlayers.length;
      while (computerGameData.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % localPlayers.length;
      }

      dispatch(setTurn(nextPlayerIndex));

      const newAllThrownCards = allThrownCards.filter(
        (card) => !computerGameData.cardsInMiddle.includes(card)
      );
      setAllThrownCards(newAllThrownCards);

      dispatch(setPrev(null));
      dispatch(setCurrentFace(null));
      dispatch(setCardsInMiddle([]));
      dispatch(setCardsInLastChance([]));
      dispatch(setSkip(computerGameData.won.map((x) => x >= 1)));

      setMainMessage(
        `Wrong Call! ${computerGameData.players[computerGameData.prev].playerName} was truthful.`
      );
    } else {
      const prevIndex = computerGameData.prev;
      const updatedCards = [
        ...localPlayers[prevIndex].cards,
        ...computerGameData.cardsInMiddle,
      ];

      updatedCards.sort((a, b) => a.localeCompare(b));
      localPlayers[prevIndex] = {
        ...localPlayers[prevIndex],
        cards: updatedCards,
      };
      dispatch(setPlayers(localPlayers));

      const newAllThrownCards = allThrownCards.filter(
        (card) => !computerGameData.cardsInMiddle.includes(card)
      );
      setAllThrownCards(newAllThrownCards);

      dispatch(setPrev(null));
      dispatch(setCurrentFace(null));
      dispatch(setCardsInMiddle([]));
      dispatch(setCardsInLastChance([]));
      dispatch(setSkip(computerGameData.won.map((x) => x >= 1)));

      setMainMessage(
        `Good Call! ${computerGameData.players[prevIndex].playerName} was lying.`
      );
    }
    setDoubtChance(false);
    setFlipedCard(null);
    setSelectedCards([]);
  };


  function playIwon(Index){

    setMainMessage(`${computerGameData.players[Index].playerName} has Won`);

    const maxWonValue = Math.max(...computerGameData.won.map((val) => Number(val) || 0));

    let won = [...computerGameData.won];
    won[Index] = maxWonValue + 1;

    const skip = won.map((x) => x >= 1);

    let nextPlayerIndex = (Index+1) % computerGameData.players.length;
    while(won[nextPlayerIndex]){
      nextPlayerIndex = (nextPlayerIndex + 1) % computerGameData.players.length;
    }

    dispatch(setTurn(nextPlayerIndex));
    dispatch(setPrev(null));
    dispatch(setSkip(skip));
    dispatch(setCurrentFace(null));
    dispatch(setCardsInMiddle([]));
    dispatch(setCardsInLastChance([]));

    let updatedWon;

    if (won.filter((x) => x === 0).length === 1) {
      updatedWon = [...won]; // Create a mutable copy of the won array
      const rankData = computerGameData.players.map((player, index) => {
        if (updatedWon[index] === 0) {
          updatedWon[index] = computerGameData.players.length;
        }
        return { name: player.playerName, rank: updatedWon[index] };
      });
    
      rankData.sort((a, b) => a.rank - b.rank);
      setRanking(rankData);
    }
    dispatch(setWon(updatedWon));
  }



  const otherPlayers = computerGameData?.players.filter((player, index) => index !== 0);

  async function delay(ms){
    return new Promise((resolve) => setTimeout(resolve , ms));
  }



  function countFaceFrequency(cards) {
    const frequencyMap = {};
    cards?.forEach(card => {
      const face = card[0];
      frequencyMap[face] = (frequencyMap[face] || 0) + 1;
    });
    return frequencyMap;
  }

  function selectLieCardFace(botCards, totalCardsPerFace) {
    const botCardsFreq = countFaceFrequency(botCards);
    const allThrownCardsFreq = countFaceFrequency(allThrownCards);

    const faceScores = {};
    Object.keys(botCardsFreq).forEach(face => {
      const freqInBotCards = botCardsFreq[face];
      const freqInAllThrownCards = allThrownCardsFreq[face] || 0;

      const score = 0.5 * (1 / (freqInBotCards + 1)) + 0.5 * (freqInAllThrownCards / totalCardsPerFace);

      faceScores[face] = score;
    });

    const sortedFaces = Object.keys(faceScores).sort(
      (a, b) => faceScores[b] - faceScores[a]
    )

    return sortedFaces[0] === computerGameData.currentFace ? sortedFaces[1] : sortedFaces[0];
  }


  async function handleRobo(face, index) {

    const botCards = computerGameData.players[index].cards;
    const totalCardsPerFace = 4 * decks;

    if(botCards.length === 0){
       playIwon(index);
       return;
    }

    let cardsOfFaceInHand = botCards.filter((card) => card[0] === face);
    const allThrownCardsOfFace = allThrownCards.filter((card) => card[0] === face);

    console.log(`For player ${computerGameData.players[index].playerName}, ${index} , ${face}   , cards : ${botCards} , totalCardsPerFace : ${totalCardsPerFace} , cardsOfFaceInHand : ${cardsOfFaceInHand} , allthrownCarddOfFace : ${allThrownCardsOfFace}`);

    //face chance
    if (face === null) {

      const botCardsFreq = countFaceFrequency(botCards);
      const maxFace = Object.keys(botCardsFreq).reduce((max, current) =>
        botCardsFreq[current] > botCardsFreq[max] ? current : max
      );

      cardsOfFaceInHand = botCards.filter((card) => card[0] === maxFace);

      const lieProbablity = (0.2 * (cardsOfFaceInHand.length / totalCardsPerFace)) + (0.6 * (1 - (allThrownCardsOfFace.length / totalCardsPerFace)));

      if (lieProbablity > 0.5) {

        const lieFace = selectLieCardFace(botCards, totalCardsPerFace);

        const lieCard = botCards.filter((card) => card[0] === lieFace);

        const chance = Math.random();
        let selectedCards = [];
        if (chance <= 0.15) {
          selectedCards = lieCard.filter((card, index) => index === 0)
        } else if (chance > 0.15 && chance < 0.5) {
          const halfCards = cardsOfFaceInHand.length < 3 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,3);
          selectedCards = [...halfCards, lieCard[0]]
        } else {
          const halfCards = cardsOfFaceInHand.length < 1 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,1);
          selectedCards = [...halfCards, lieCard[0]];
        }

        handleFaceClick(maxFace, index, selectedCards);

      } else {
        const selectedCards = cardsOfFaceInHand.length < 4 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,4);
        handleFaceClick(maxFace, index, selectedCards); 
      }

      return;
    }

    if (computerGameData.prev !== computerGameData.turn && computerGameData.prev !== null) {
      let cheatProb = (0.5 * (computerGameData.cardsInMiddle.length / totalCardsPerFace)) + (0.3 * (computerGameData.cardsInLastChance.length / 4));

      cheatProb = Math.min(1, cheatProb);

      console.log("cheat prob", cheatProb)

      if (cheatProb > 0.7) {
        doubtHandler(index);
        console.log(extraData.shuffledArr);
        const chanceIndex = Math.floor((Math.random() * extraData.shuffledArr.length));

        console.log(chanceIndex)
        await delay(2000);
        handleFlip(extraData.shuffledArr[chanceIndex], index);

        await delay(2000);
        setCheatCompelte(!cheatComplete);
        return;

      }

    }

    if(computerGameData.skip[index]){
      skipChanceHandler(index);
      return;
    }

    const lieProbablity = (0.2 * (cardsOfFaceInHand.length / totalCardsPerFace)) + (0.6 * (1 - (allThrownCardsOfFace.length / totalCardsPerFace)));

    console.log(`lie prob for ${computerGameData.players[index].playerName}`, lieProbablity);

    if (lieProbablity > 0.5) {

      const lieFace = selectLieCardFace(botCards, totalCardsPerFace);

      const lieCard = botCards.filter((card) => card[0] === lieFace);

      console.log("lie card", lieCard)

      const chance = Math.random();
      console.log(chance);
      let selectedCards = [];
      if (chance <= 0.15) {
        selectedCards = lieCard.filter((card, index) => index === 0)
      } else if (chance > 0.15 && chance < 0.5) {
        const halfCards = cardsOfFaceInHand.length < 3 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,3);
        selectedCards = [...halfCards, lieCard[0]]
      } else {
        const halfCards = cardsOfFaceInHand.length < 1 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,1);
        selectedCards = [...halfCards, lieCard[0]];
      }
      console.log("Selected Cards", selectedCards);
      throwHandler(index, selectedCards);

    } else {
      if (cardsOfFaceInHand.length === 0) {
        skipChanceHandler(index);
        return;
      }
      const selectedCards = cardsOfFaceInHand.length < 4 ? cardsOfFaceInHand : cardsOfFaceInHand.slice(0,4);
      console.log("Selected Cards", selectedCards);
      throwHandler(index, selectedCards);
    }


  }


  useEffect(() => {

    setTimeout(() => {
      if (computerGameData.turn !== 0) {
        console.log(`I AM BEING CALLED FOR ${computerGameData.turn}`)
        handleRobo(computerGameData.currentFace, computerGameData.turn);
      }
    }, 3000)
  }, [computerGameData.turn , cheatComplete]);


  return (
    <div className="max-h-[100vh]">
      <div className="w-full bg-emerald-600 p-5">
        {ranking ? (
          <div className="flex justify-center items-center min-h-screen">
            <RankCard ranking={ranking} />
          </div>
        ) : (
          <div className="grid grid-cols-12 grid-rows-12 gap-4 w-full mx-auto bg-emerald-600 min-h-screen p-5">
            {/* Players */}
            {otherPlayers.map((player, index) => {
              const playerPositions = getPlayerPositions(otherPlayers.length);
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
                  <p className="md:text-lg font-semibold">{player.playerName}</p>
                  <div className="w-full flex space-x-1 md:space-x-2 lg:space-x-3 absolute top-[100%]">
                    {computerGameData?.players
                      ?.find(item => item.playerName === player.playerName)
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
              style={screenWidth <= 768 ? { gridColumnStart: 4, gridRowStart: 9 } : screenWidth <=1024 ? { gridColumnStart: 5, gridRowStart: 7 } : { gridColumnStart: 5, gridRowStart: 7 }}
            >
              <div className="relative">
                <p className="w-full md:text-lg lg:text-xl text-center font-semibold text-white">
                  {computerGameData.players[0].playerName}
                </p>
                <img
                  src="/avatar.svg"
                  alt="avatar"
                  className="h-12 w-12 lg:h-14 lg:w-14 absolute top-[-15px] left-[-50px] md:top-[-5px] md:left-[-25px] rounded-full border-[3px] border-emerald-800"
                />
                <p className="bg-emerald-50 min-w-52 md:min-w-72 lg:min-w-80 text-center text-base md:text-lg p-1">{mainMessage}</p>
              </div>
              <div className="w-full flex space-x-[14px] md:space-x-4 lg:space-x-6 absolute top-[50%] left-[-120%] md:left-[-25%]">
                {computerGameData?.players[0].cards?.map(item => (
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
              style={screenWidth <= 768 ? {gridColumnStart : 3 , gridRowStart : 6} : screenWidth <= 1024 ? {gridColumnStart : 4 , gridRowStart : 4} : { gridColumnStart: 5, gridRowStart: 4 }}
            >
              {
                doubtChance ?
                  computerGameData.cardsInMiddle.filter((card) => !computerGameData.cardsInLastChance.includes(card)).map(i => (
                    <ReverseCard key={i} />
                  ))
                  :
                  computerGameData.cardsInMiddle?.map(i => (
                    <ReverseCard key={i} />
                  ))
              }
            </div>

            {/* Action Buttons */}
            {computerGameData.turn === 0 && (
              computerGameData.players[0].cards.length === 0 ? (
                <div
                  className="col-span-12 md:col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
                  style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <=1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <button
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
                    onClick={() => playIwon(0)}
                  >
                    I WON
                  </button>
                </div>
              ) : !computerGameData.currentFace ? (
                <div
                className="col-span-12 md:col-span-5 row-span-1 flex justify-around pt-2 flex-wrap gap-1 md:gap-0 md:flex-nowrap items-end pb-3 rounded-lg relative"
                style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <=1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <div className='absolute top-4 left-4 space-x-[4px] space-y-[4px] md:static'>
                  {cardFaces.map((face, index) => (
                    <button
                      key={index}
                      disabled={selectedCards.length === 0}
                      onClick={() => handleFaceClick(face, computerGameData.turn, selectedCards)}
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
                  style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 11 } : screenWidth <=1024 ? { gridColumnStart: 4, gridRowStart: 9 } : { gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <button
                    disabled={computerGameData.prev === 0 || doubtChance}
                    onClick={() => doubtHandler(computerGameData.turn)}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cheat!
                  </button>
                  <button
                    onClick={() => throwHandler(computerGameData.turn, selectedCards)}
                    disabled={computerGameData.skip[0] || doubtChance}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Throw
                  </button>
                  <button
                    disabled={doubtChance}
                    onClick={() => skipChanceHandler(computerGameData.turn)}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pass
                  </button>
                </div>
              )
            )}

            {/* Doubt Section */}
            {doubtChance && (
              <div
              className="col-span-10 lg:col-span-3 row-span-2 flex gap-4 items-center w-full space-x-[70px] lg:space-x-20 relative"
              style={screenWidth <= 768 ? { gridColumnStart: 1, gridRowStart: 6 }:{ gridColumnStart: 1, gridRowStart: 6 }}
              >
                {extraData.shuffledArr?.map(item => (
                  <button key={item} disabled={computerGameData.turn !== 0} onClick={() => handleFlip(item, 0)}>
                    <DoubtCard flipedCard={flipedCard === item} imgSrc={item} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
