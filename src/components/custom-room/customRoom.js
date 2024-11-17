import React, { useState } from 'react'
import Card from '../card/card'
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../socket/socket';
import { setPlayerNames } from '../../store/roomSlice';
import ReverseCard from '../reverse-card/ReverseCard';

export default function CustomRoom() {

  const dispatch = useDispatch();
  const roomData = useSelector((state => state.room))
  console.log(roomData)

  const [players, setPlayers] = useState(Array.from({ length: roomData.playerNo - 1 }, (_, i) => `Player ${i + 1}`));
  const [win, setWin] = useState(false)

  socket.on('playerJoined', ({ playerName }) => {
    dispatch(setPlayerNames({ playerName }))
    setPlayers(handleNameAssign(playerName, players))
    console.log(playerName)
  })

  function handleNameAssign(playerNames, players) {
    // Find the index of the global name in the playerNames array
    const myIndex = playerNames.indexOf(roomData.name);

    if (myIndex === -1) {
      console.error('Your name is not in the list of real player names');
      return players;
    }

    // Create an array starting from the name after your name and wrapping around
    const orderedNames = [
      ...playerNames.slice(myIndex + 1),
      ...playerNames.slice(0, myIndex)
    ];

    // Replace dummy names in the players array with real names
    const updatedPlayers = players.map((_, index) => {
      return orderedNames[index] || players[index]; // Replace if a real name exists, otherwise keep the dummy name
    });
    console.log(updatedPlayers)
    return updatedPlayers;
  }

  return (
    <div>
      <div className="w-full bg-emerald-600 p-5">
        <div className="grid grid-cols-12 grid-rows-12 gap-4 w-full mx-auto bg-emerald-600 min-h-screen p-5">
          {players.map((player, index) => {
            // Define specific grid positions for up to 6 players to simulate them sitting around a table
            const playerPositions = [
              { colStart: 1, rowStart: 3 }, // Left center
              { colStart: 3, rowStart: 1 },  // Top-left
              { colStart: 6, rowStart: 1 }, // Top center
              { colStart: 9, rowStart: 1 }, // Top-right
              { colStart: 11, rowStart: 3 }, // Right center
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
                <div className='w-full flex space-x-3 absolute top-[100%]'>
                {[...Array(13)].map((_, cardIndex) => (
                      <ReverseCard key={cardIndex} />
                  ))}
                </div>
              </div>

            );
          })}
          <div className='col-span-2 row-span-2 relative' style={{ gridColumnStart: 6, gridRowStart: 7 }}>
            <div className='relative'>
              <p className='w-full text-xl text-center font-semibold text-white'>{roomData.name}</p>
              <img src='/avatar.svg' alt='avatar' className='h-14 w-14 absolute top-[-5px] left-[-25px] rounded-full border-[3px] border-emerald-800' />
              <p className='bg-emerald-50 min-w-80 text-center text-lg p-1'>hello</p>
            </div>
            <div className='w-full flex space-x-8 absolute top-[50%]'>
              {["2S" , "4H" , "KD"].map((item) => (
                <Card imgSrc={item} />
              ))}
            </div>
          </div>
        </div>



        {
          win ? <div className="mt-10 bg-white p-4 rounded-md shadow-lg w-full max-w-lg text-center">
            <p className="text-gray-800 text-lg mb-4">Congratulations! You won!</p>
            <div className="flex justify-between">
              <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Play with other rivals
              </button>
              <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Play with the same rivals
              </button>
            </div>
          </div> : null
        }


      </div>
    </div>
  )
}
