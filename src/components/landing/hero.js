import React, { useState } from 'react'
import Roompop from './Roompop';
import Roompop2 from './Roompop2';
import PlayOnlinePop from './playOnilnePop';
import RobotPop from './robotPop';

export default function Hero() {

  const [pop1 , setPop1] = useState(false);
  const [pop2 , setPop2] = useState(false);
  const [pop3 , setPop3] = useState(false);
  const [pop4 , setPop4] = useState(false);

  return (
    <div className="bg-emerald-900 min-h-screen">
      {
        pop1 ? <Roompop close={setPop1} /> : null
      }
      {
        pop2 ? <Roompop2 close={setPop2} /> : null
      }
      {
        pop3 ? <PlayOnlinePop close={setPop3} /> : null
      }
      {
        pop4 ? <RobotPop close={setPop4} /> : null 
      }
      <div className='bg-emerald-900 z-10 flex gap-10 md:gap-20 lg:gap-40 justify-center items-center fixed top-0 right-0 left-0'>
        <button className="bg-emerald-900 font-bold text-white text-base sm:text-lg md:text-xl px-2 sm:px-5 md:px-10 py-4 sm:py-5 rounded-full hover:text-emerald-900 hover:bg-white transition-all duration-300">
          How To Play
        </button>
        <img src='/logo.jpg' className='h-auto w-[135px] md:w-[250px]' />
        <button className="bg-emerald-900 font-bold text-white text-base sm:text-lg md:text-xl px-2 sm:px-5 md:px-10 py-4 sm:py-5 rounded-full hover:text-emerald-900 hover:bg-white transition-all duration-300">
          Game Preview
        </button>
      </div>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row w-full justify-center items-center pt-40 md:pt-80 relative">
        <h1 className="text-emerald-300 text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mx-5 sm:mx-10 md:mx-28 lg:mx-40 my-5 absolute top-64  ">
          Bluff, Play, Conquer : Your Ultimate Card Challenge!
        </h1>
        <div> 
          <div className="flex flex-col gap-6 justify-center">
            <button onClick={() => setPop3(true)} className="bg-emerald-400 text-black sm:text-lg lg:text-xl px-5 lg:px-10 py-3 md:py-5 rounded-full hover:text-white hover:bg-emerald-900 transition-all duration-300">
              Play Online
            </button>
            <button onClick={() => setPop4(true)} className="bg-emerald-400 text-black sm:text-lg lg:text-xl px-5 lg:px-10 py-3 md:py-5 rounded-full hover:text-white hover:bg-emerald-900 transition-all duration-300">
              Play Computer
            </button>
          </div>
        </div>

        <p className="text-white text-xl md:text-2xl mb-8">
          <span className="inline-block align-middle">
            <img
              src="/heroImg.webp"  // Replace with the correct image path
              alt="Phone Notification"
              className='h-[350px] w-[350px] md:h-[500px] md:w-[500px]'
            />
          </span>
        </p>

        <div className="mt-8 flex flex-col gap-6 pb-10 md:py-0">
          <button onClick={() => setPop1(!pop1)} className="bg-emerald-400 text-black sm:text-lg lg:text-xl px-5 lg:px-10 py-3 md:py-5 rounded-full hover:text-white hover:bg-emerald-900 transition-all duration-300">
            Create Room
          </button>
          <button onClick={() => setPop2(!pop2)} className="bg-emerald-400 text-black sm:text-lg lg:text-xl px-5 lg:px-10 py-3 md:py-5 rounded-full hover:text-white hover:bg-emerald-900 transition-all duration-300">
            Join Room
          </button>
        </div>
      </div>

      <section className="py-28 md:py-40 px-5 bg-white">
  <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-center mb-10 md:mb-20 text-emerald-700">How to Play</h2>
  <div className="flex gap-6 md:gap-12 flex-wrap justify-center">
    <div className="bg-emerald-400 p-10 rounded-lg shadow-md w-[40vw] min-w-[250px]">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-700">Step 1: Deal the Cards</h3>
      <p className="text-white text-base md:text-lg">The deck is dealt evenly among all players. Each player holds their cards in hand without revealing them.</p>
    </div>
    <div className="bg-emerald-400 p-10 rounded-lg shadow-md w-[40vw] min-w-[250px]">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-700">Step 2: Take Turns</h3>
      <p className="text-white text-base md:text-lg">Players take turns placing one or more cards face down in the center, declaring their value (e.g., "two Aces").</p>
    </div>
    <div className="bg-emerald-400 p-10 rounded-lg shadow-md w-[40vw] min-w-[250px]">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-700">Step 3: Call 'Cheat' or Pass</h3>
      <p className="text-white text-base md:text-lg">Other players can challenge the move by calling "Cheat!" If the declaration was false, the challenged player picks up the pile; if true, the challenger takes the pile.</p>
    </div>
    <div className="bg-emerald-400 p-10 rounded-lg shadow-md w-[40vw] min-w-[250px]">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-700">Step 4: Win the Game</h3>
      <p className="text-white text-base md:text-lg">The goal is to be the first to get rid of all your cards. Bluff smartly and call others' bluffs to win!</p>
    </div>
  </div>
</section>

      {/* Gameplay Preview Section */}
      <section className="py-28 md:py-40 px-5 bg-emerald-400">
        <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-center mb-20 text-white">Gameplay Preview</h2>
        <div className="flex justify-center">
          {/* Placeholder for image */}
          <div className="bg-white w-[600px] h-[400px] rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-emerald-800">Gameplay preview goes here</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8 mt-10">
        <div className="text-center">
          <p>&copy; 2024 Cheat. All rights reserved.</p>
          <p>Developed by Your Name</p>
        </div>
      </footer>
    </div>
  )
}
