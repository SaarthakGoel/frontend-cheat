import React, { useState , useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import socket from '../../socket/socket';
import { useDispatch } from 'react-redux';
import { setState } from '../../store/roomSlice';

export default function PlayOnlinePop({ close }) {

  console.log(socket.id)

  const [name, setName] = useState('');
  const [numPlayers, setNumPlayers] = useState(3);
  const [numDecks, setNumDecks] = useState(1);
  const [nameError, setNameError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error , setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation functions
  const validateName = () => {
    const isValid = /^[A-Za-z]{4,8}$/.test(name);
    setNameError(isValid ? '' : 'Name must be between 4 and 8 alphabets');
    return isValid;
  };

  // Update card deck options based on the number of players
  const getDeckOptions = () => {
    if (numPlayers === 3) return [1];
    if (numPlayers === 4) return [1, 2];
    if (numPlayers === 5 || numPlayers === 6) return [2];
    return [];
  };

  const handleNumPlayersChange = (e) => {
    const players = parseInt(e.target.value, 10);
    setNumPlayers(players);
    const deckOptions = getDeckOptions(players);
    setNumDecks(deckOptions[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('playOnline' , {
      name : name,
      players : numPlayers,
      decks : numDecks
    })
  };

  socket.on('onlineRoomCreated' , ({roomId}) => {
    dispatch(setState({name, roomName : roomId , numPlayers , numDecks , host : true}));
    setError("");
    navigate('/custom-room')
  })

  socket.on('roomJoined', ({name , roomName , numPlayers , numDecks}) => {
    dispatch(setState({name , roomName , numPlayers , numDecks , host : false}));
    setError("");
    navigate('/custom-room')
  })

  useEffect(() => {
    setIsValid(validateName());
  }, [name , numPlayers , numDecks ]);

  useEffect(() => {
    if(numPlayers === 5 || numPlayers === 6)
    setNumDecks(2)
  },[numPlayers])

  return (
    <div>
      <div onClick={() => close(false)} className='z-20 fixed h-screen w-full bg-white opacity-50'>
      </div>
      <div className='z-30 fixed top-[20vh] left-[10vw] md:left-[20vw] lg:left-[30vw] flex justify-center items-center'>
        <div className='bg-emerald-100 pb-10 w-[80vw] md:w-[60vw] lg:w-[40vw] rounded-xl relative'>
          <img onClick={() => close(false)} src="/xmark.svg" className='absolute top-[-5px] right-[-10px] h-8 w-10' />
          <h1 className='bg-emerald-700 rounded-t-xl text-center text-emerald-100 text-4xl font-semibold py-4'>Play online</h1>
          <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-emerald-100 rounded-b-lg">
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-emerald-800 font-semibold mb-2">
                Name: (between 4 and 8 alphabets)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
                required
                className="w-full p-2 border border-emerald-400 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
              />
              {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-emerald-800 font-semibold mb-2">Number of Players:</label>
              <div className="flex space-x-4">
                {[3, 4, 5, 6].map((num) => (
                  <label key={num} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="numPlayers"
                      value={num}
                      checked={numPlayers === num}
                      onChange={handleNumPlayersChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2">{num}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-emerald-800 font-semibold mb-2">Number of Card Decks:</label>
              <div className="flex space-x-4">
                {getDeckOptions().map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="numDecks"
                      value={option}
                      checked={numDecks === option}
                      onChange={(e) => setNumDecks(parseInt(e.target.value, 10))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full p-2 rounded-md transition ${isValid ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}`}
            >
              Play Online
            </button>
            {
              error ? <p className="text-red-600">{error}</p> : null
            }
          </form>
        </div>
      </div>
    </div>
  );
}