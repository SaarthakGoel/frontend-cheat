import React, { useEffect, useState } from 'react';
import Card from '../card/card';
import { useDispatch, useSelector } from 'react-redux';
import ReverseCard from '../reverse-card/ReverseCard';
import { cardFaces, findFaceName } from '../constants/cardFaces';
import DoubtCard from '../doubt-card/doubtCard';
import { shuffle } from 'lodash';
import { getPlayerPositions } from '../constants/playerPositions';
import RankCard from '../rankCard/rankCard';
import { setComputerState } from '../../store/computerGameSlice';
import { setShuffleArr } from '../../store/extraSlice';



export default function ComputerRoom() {
  const dispatch = useDispatch();
  const computerGameData = useSelector(state => state.computerGameData);
  const extraData = useSelector(state => state.extraGameData);
  console.log(computerGameData)

  const [selectedCards, setSelectedCards] = useState([]); // State for selected cards
  const [doubtChance, setDoubtChance] = useState(false);
  const [flipedCard, setflipedCard] = useState(null);
  const [mainMessage, setMainMessage] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [isPrevOnly, setIsPrevOnly] = useState(false);
  const [ranking, setRanking] = useState(null);

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


  function handleFaceClick(face, Index, selectedCards) {
    console.log(`face chance played by index ${Index}`)
    setFaceCardAnimation(true);

    let localState = structuredClone(computerGameData);

    localState.players[Index].cards = localState.players[Index].cards.filter((card) => !selectedCards.includes(card));

    localState.cardsInLastChance = selectedCards;
    setAllThrownCards((prev) => [...prev, ...selectedCards]);
    if (localState.cardsInMiddle === null) {
      localState.cardsInMiddle = selectedCards;
    } else {
      localState.cardsInMiddle = [...localState.cardsInMiddle, ...selectedCards]
    }

    localState.prev = Index;
    localState.currentFace = face;

    let nextPlayerIndex = (Index + 1) % localState.players.length;
    while (localState.won[nextPlayerIndex] > 0) {
      nextPlayerIndex = (nextPlayerIndex + 1) % localState.players.length;
    }

    localState.turn = nextPlayerIndex;

    setMainMessage(`${localState.players[Index].playerName} threw ${selectedCards.length} ${findFaceName(localState.currentFace)}`);
    setSelectedCards([]);
    setFaceCardAnimation(false);
    dispatch(setComputerState({ localState }));

  }


  function throwHandler(Index, selectedCards) {
    console.log(`throw chance played by index ${Index}`)
    setFaceCardAnimation(true);

    let localState = structuredClone(computerGameData)

    localState.players[Index].cards = localState.players[Index].cards.filter((card) => !selectedCards.includes(card));

    localState.cardsInLastChance = selectedCards;
    setAllThrownCards((prev) => [...prev, ...selectedCards]);
    if (localState.cardsInMiddle === null) {
      localState.cardsInMiddle = selectedCards;
    } else {
      localState.cardsInMiddle = [...localState.cardsInMiddle, ...selectedCards]
    }

    localState.prev = Index;
    let nextPlayerIndex = (Index + 1) % localState.players.length;

    while (localState.won[nextPlayerIndex] > 0) {
      nextPlayerIndex = (nextPlayerIndex + 1) % localState.players.length;
    }

    localState.turn = nextPlayerIndex;

    setMainMessage(`${localState.players[Index].playerName} threw ${selectedCards.length} ${findFaceName(localState.currentFace)}`);
    setFaceCardAnimation(false);
    setSelectedCards([]);
    dispatch(setComputerState({ localState }));

  }



  function skipChanceHandler(Index) {
    console.log(`skip chance played by index ${Index}`)

    let localState = structuredClone(computerGameData)
    localState.skip[Index] = 1;

    if (Math.min(...localState.skip) === 1) {
      let nextPlayerIndex = (Index + 1) % localState.players.length;
      while (localState.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % localState.players.length;
        if (nextPlayerIndex === Index) {
          return;
        }
      }

      localState.turn = nextPlayerIndex;
      localState.prev = null;
      localState.skip = localState.won.map((x) => x >= 1);
      localState.currentFace = null;
      localState.cardsInMiddle = [];
      localState.cardsInLastChance = [];

      dispatch(setComputerState({ localState }));
      setMainMessage(`${localState.players[Index].playerName} has skipped`);

    } else {

      let nextPlayerIndex = (Index + 1) % localState.players.length;
      while (localState.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % localState.players.length;
        if (nextPlayerIndex === Index) {
          return;
        }
      }

      localState.turn = nextPlayerIndex;
      setMainMessage(`${localState.players[Index].playerName} has skipped`);

      dispatch(setComputerState({ localState }));

    }
  }

  function doubtHandler(Index) {
    console.log(`doubt chance played by index ${Index}`)

    let localState = structuredClone(computerGameData)
    setMainMessage(`${localState.players[Index].playerName} has Doubted ${localState.players[localState.prev].playerName}`);
    const shuffledArr = shuffle(computerGameData.cardsInLastChance)
    dispatch(setShuffleArr({ shuffledArr }));
    setDoubtChance(true);
  }

  const handleFlip = (item, Index) => {
    console.log(`flip done by index ${Index}`)
    setflipedCard(item);

    let localState = structuredClone(computerGameData)

    if (localState.currentFace === item) {
      const newCards = [...computerGameData.players[Index].cards, ...computerGameData.cardsInMiddle];
      newCards.sort((a, b) => a.localeCompare(b));
      localState.players[Index].cards = newCards;

      let nextPlayerIndex = (Index + 1) % localState.players.length;
      while (localState.won[nextPlayerIndex] > 0) {
        nextPlayerIndex = (nextPlayerIndex + 1) % localState.players.length;
        if (nextPlayerIndex === Index) {
          return;
        }
      }

      localState.turn = nextPlayerIndex;
      localState.won = localState.players.map((player) => {
        if (player.cards.length === 0) {
          return 1;
        } else {
          return 0;
        }
      })
      localState.skip = localState.won.map((x) => x === 1);

      setMainMessage(`Wrong Call! , ${localState.players[localState.prev].playerName} was truthfull`);
      const newAllTHrownCards = allThrownCards?.filter((card) => !localState.cardsInMiddle.includes(card));
      setAllThrownCards(newAllTHrownCards);

      localState.prev = null;
      localState.currentFace = null;
      localState.cardsInMiddle = [];
      localState.cardsInLastChance = [];

      dispatch(setComputerState({ localState }));
    }

    else {

      const prevIndex = localState.prev;
      const newCards = [...computerGameData.players[prevIndex].cards, ...computerGameData.cardsInMiddle];
      newCards.sort((a, b) => a.localeCompare(b));
      localState.players[prevIndex].cards = newCards;

      localState.won = localState.players.map((player) => {
        if (player.cards.length === 0) {
          return 1;
        } else {
          return 0;
        }
      })

      localState.skip = localState.won.map((x) => x === 1);

      setMainMessage(`Good Call! , ${localState.players[prevIndex].playerName} was lying`);
      const newAllTHrownCards = allThrownCards?.filter((card) => !localState.cardsInMiddle.includes(card));
      setAllThrownCards(newAllTHrownCards);

      localState.prev = null;
      localState.currentFace = null;
      localState.cardsInMiddle = [];
      localState.cardsInLastChance = [];

      dispatch(setComputerState({ localState }));

    }
    setDoubtChance(false);
    setflipedCard(null);

  };


  const otherPlayers = computerGameData?.players.filter((player, index) => index !== 0);



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


  function handleRobo(face, index) {

    const botCards = computerGameData.players[index].cards;
    const totalCardsPerFace = 4 * decks;

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

      const lieProbablity = (0.3 * (cardsOfFaceInHand.length / totalCardsPerFace)) + (0.7 * (1 - (allThrownCardsOfFace.length / totalCardsPerFace)));

      if (lieProbablity > 0.5) {

        const lieFace = selectLieCardFace(botCards, totalCardsPerFace);

        const lieCard = botCards.filter((card) => card[0] === lieFace);

        const chance = Math.random();
        let selectedCards = [];
        if (chance <= 0.33) {
          selectedCards = lieCard.filter((card, index) => index === 0)
        } else if (chance > 0.33 && chance < 0.66) {
          selectedCards = [...cardsOfFaceInHand, lieCard[0]]
        } else {
          const halfCards = cardsOfFaceInHand.slice(0, Math.ceil(cardsOfFaceInHand.length / 2));
          selectedCards = [...halfCards, lieCard[0]];
        }

        handleFaceClick(maxFace, index, selectedCards);

      } else {
        const selectedCards = cardsOfFaceInHand;
        handleFaceClick(maxFace, index, selectedCards);
      }

      return;
    }

    if (computerGameData.prev !== computerGameData.turn && computerGameData.prev !== null) {
      let cheatProb = (0.9 * (allThrownCardsOfFace.length / totalCardsPerFace)) + (0.1 * (computerGameData.cardsInLastChance.length / 4));

      cheatProb = Math.min(1, cheatProb);

      console.log("cheat prob", cheatProb)

      if (cheatProb > 0.5) {
        doubtHandler(index);
        console.log(extraData.shuffledArr);
        const chanceIndex = Math.floor((Math.random() * extraData.shuffledArr.length));

          console.log(chanceIndex)
          handleFlip(extraData.shuffledArr[chanceIndex], index);

        //faceChance
        if(computerGameData.turn === index){
          const botCardsFreq = countFaceFrequency(botCards);
          const maxFace = Object.keys(botCardsFreq).reduce((max, current) =>
            botCardsFreq[current] > botCardsFreq[max] ? current : max
          );
  
          cardsOfFaceInHand = botCards.filter((card) => card[0] === maxFace);
  
          const lieProbablity = (0.3 * (cardsOfFaceInHand.length / totalCardsPerFace)) + (0.7 * (1 - (allThrownCardsOfFace.length / totalCardsPerFace)));
  
          if (lieProbablity > 0.5) {
  
            const lieFace = selectLieCardFace(botCards, totalCardsPerFace);
  
            const lieCard = botCards.filter((card) => card[0] === lieFace);
  
            const chance = Math.random();
            let selectedCards = [];
            if (chance <= 0.33) {
              selectedCards = lieCard.filter((card, index) => index === 0)
            } else if (chance > 0.33 && chance < 0.66) {
              selectedCards = [...cardsOfFaceInHand, lieCard[0]]
            } else {
              const halfCards = cardsOfFaceInHand.slice(0, Math.ceil(cardsOfFaceInHand.length / 2));
              selectedCards = [...halfCards, lieCard[0]];
            }
  
            handleFaceClick(maxFace, index, selectedCards);
  
          } else {
            const selectedCards = cardsOfFaceInHand;
            handleFaceClick(maxFace, index, selectedCards);
          }
        }
        
        return;
        
      }

    }

    const lieProbablity = (0.3 * (cardsOfFaceInHand.length / totalCardsPerFace)) + (0.7 * (1 - (allThrownCardsOfFace.length / totalCardsPerFace)));

    console.log(`lie prob for ${computerGameData.players[index].playerName}`, lieProbablity);

    if (lieProbablity > 0.5) {

      const lieFace = selectLieCardFace(botCards, totalCardsPerFace);

      const lieCard = botCards.filter((card) => card[0] === lieFace);

      console.log("lie card", lieCard)

      const chance = Math.random();
      console.log(chance);
      let selectedCards = [];
      if (chance <= 0.33) {
        selectedCards = lieCard.filter((card, index) => index === 0)
      } else if (chance > 0.33 && chance < 0.66) {
        selectedCards = [...cardsOfFaceInHand, lieCard[0]]
      } else {
        const halfCards = cardsOfFaceInHand.slice(0, Math.ceil(cardsOfFaceInHand.length / 2));
        selectedCards = [...halfCards, lieCard[0]];
      }
      console.log("Selected Cards", selectedCards);
      throwHandler(index, selectedCards);

    } else {
      if (cardsOfFaceInHand.length === 0) {
        skipChanceHandler(index);
        return;
      }
      const selectedCards = cardsOfFaceInHand;
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
    }, 5000)
  }, [computerGameData.turn])


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
                  className="col-span-2 row-span-1 relative bg-green-900 text-white rounded-lg shadow-md py-2 flex justify-center items-center"
                  style={{
                    gridColumnStart: playerPositions[index]?.colStart,
                    gridRowStart: playerPositions[index]?.rowStart,
                  }}
                >
                  <div className="mb-2">
                    <img src="/avatar.svg" alt="avatar" className="h-12 w-12 rounded-full" />
                  </div>
                  <p className="text-lg font-semibold">{player.playerName}</p>
                  <div className="w-full flex space-x-3 absolute top-[100%]">
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
              style={{ gridColumnStart: 5, gridRowStart: 7 }}
            >
              <div className="relative">
                <p className="w-full text-xl text-center font-semibold text-white">
                  {computerGameData.players[0].playerName}
                </p>
                <img
                  src="/avatar.svg"
                  alt="avatar"
                  className="h-14 w-14 absolute top-[-5px] left-[-25px] rounded-full border-[3px] border-emerald-800"
                />
                <p className="bg-emerald-50 min-w-80 text-center text-lg p-1">{mainMessage}</p>
              </div>
              <div className="w-full flex space-x-6 absolute top-[50%] left-[-25%]">
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
              className="col-span-3 row-span-2 w-full flex space-x-3 ring-inset bg-emerald-500 py-8 px-2 shadow-inner"
              style={{ gridColumnStart: 5, gridRowStart: 4 }}
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
                  className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
                  style={{ gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <button
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300"
                  >
                    I WON
                  </button>
                </div>
              ) : !computerGameData.currentFace ? (
                <div
                  className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
                  style={{ gridColumnStart: 4, gridRowStart: 9 }}
                >
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
              ) : (
                <div
                  className="col-span-5 row-span-1 flex justify-around items-end pb-3 bg-emerald-300 rounded-lg"
                  style={{ gridColumnStart: 4, gridRowStart: 9 }}
                >
                  <button
                    disabled={isPrevOnly || doubtChance}
                    onClick={() => doubtHandler(computerGameData.turn)}
                    className="bg-emerald-900 text-emerald-100 font-semibold text-lg py-1 px-6 rounded-md hover:text-emerald-900 hover:bg-emerald-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cheat!
                  </button>
                  <button
                    onClick={() => throwHandler(computerGameData.turn, selectedCards)}
                    disabled={isSkipped || doubtChance}
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
                className="col-span-3 row-span-2 flex gap-4 items-center w-full space-x-20 relative"
                style={{ gridColumnStart: 1, gridRowStart: 6 }}
              >
                {extraData.shuffledArr.map(item => (
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
