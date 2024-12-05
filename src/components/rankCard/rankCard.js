import React from 'react'

export default function RankCard({ranking}) {
  return (
    <div className="bg-emerald-200 p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-emerald-900 text-center mb-4">Game Rankings</h2>
      <div className="flex flex-col space-y-4">
        {ranking.map((player, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-md ${
              index === 0
                ? 'bg-yellow-300 text-yellow-900'
                : index === 1
                ? 'bg-gray-300 text-gray-900'
                : index === 2
                ? 'bg-amber-500 text-amber-900'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`h-10 w-10 flex items-center justify-center rounded-full font-bold ${
                  index === 0
                    ? 'bg-yellow-400'
                    : index === 1
                    ? 'bg-gray-400'
                    : index === 2
                    ? 'bg-amber-600'
                    : 'bg-emerald-300'
                }`}
              >
                {index + 1}
              </div>
              <p className="font-medium text-lg">{player.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center'>
        <button className='bg-emerald-800 text-white px-4 py-2 rounded-full mt-3 font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-300'>Back to room</button>
      </div>
    </div>
  );
}
