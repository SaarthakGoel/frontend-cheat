import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearComputerGame } from '../../store/computerGameSlice';

export default function RankCard2({ranking , setRanking}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const confettiColors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400', 'bg-purple-400'];

  function handleBackToHome() {
    setRanking(null)
    dispatch(clearComputerGame());
    navigate('/');
  }

  return (
    <motion.div
      className="bg-emerald-200 p-6 rounded-lg shadow-lg w-96 relative"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {/* Party Popper Animations */}
      <div className="absolute left-0 md:left-[-90%] top-[-70%] lg:left-[-140%] w-[80vw] md:w-[90vw] h-[95vh] pointer-events-none">
        {[...Array(300)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-2 ${confettiColors[Math.floor(Math.random() * confettiColors.length)]} rounded-full`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1.5,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1,
              delay: Math.random() * 0.5,
              repeat: 4,
            }}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-emerald-900 text-center mb-4">
        Game Rankings
      </h2>
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
      <div className="flex justify-center items-center">
        <button onClick={handleBackToHome} className="bg-emerald-800 text-white px-4 py-2 rounded-full mt-3 font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-300">
          Back to Home
        </button>
      </div>
    </motion.div>
  );
}

