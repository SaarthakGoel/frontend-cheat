import React, { useState } from 'react'
import Card from '../card/card'
import { useSelector } from 'react-redux';

export default function CustomRoom({ numPlayers = 4 }) {

  const roomData = useSelector((state => state.room))
  console.log(roomData)

  const [players] = useState(Array.from({ length: roomData.playerNo }, (_, i) => `Player ${i + 1}`));

  const [win, setWin] = useState(false)

  return (
    <div>
      <div className="flex flex-col items-center bg-emerald-600 min-h-screen p-5">
        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
          {players.map((player, index) => (
            <div className="relative bg-green-900 text-white rounded-lg shadow-md p-4 flex flex-col items-center" key={index}>
              <div className="mb-2">
                <img
                  src="/avatar.svg"
                  alt={`avatar`}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <p className="text-lg font-semibold">{player}</p>
              <div className="flex mt-2 space-x-8">
                {/* Display a set of cards for each player */}
                {[...Array(5)].map((_, cardIndex) => (
                  <Card />
                ))}
              </div>
            </div>
          ))}
        </div>


        <div>
          <div className='relative'>
            <p className='w-full text-xl text-center font-semibold text-white'>{roomData.name}</p>
            <img src='/avatar.svg' alt='avatar' className='h-14 w-14 absolute top-[-5px] left-[-25px] rounded-full border-[3px] border-emerald-800' />
            <p className='bg-emerald-50 min-w-80 text-center text-lg p-1'>hello</p>
          </div>
          <div>
            
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
