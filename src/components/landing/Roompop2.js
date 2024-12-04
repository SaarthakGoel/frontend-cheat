import React, { useState , useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import socket from '../../socket/socket';
import { useDispatch } from 'react-redux';
import { setState } from '../../store/roomSlice';

export default function Roompop2({ close }) {

  const [roomName, setRoomName] = useState('');
  const [name, setName] = useState('');
  const [roomNameError, setRoomNameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error , setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation functions
  const validateRoomName = () => {
    const isValid = /^\d{6}$/.test(roomName);
    setRoomNameError(isValid ? '' : 'Room name must be a 6-digit number');
    return isValid;
  };

  const validateName = () => {
    const isValid = /^[A-Za-z]{4,8}$/.test(name);
    setNameError(isValid ? '' : 'Name must be between 4 and 8 alphabets');
    return isValid;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Room Details:', { name, roomName });
    socket.emit('joinRoom' , {
      name : name,
      room : roomName
    })
    socket.on('roomNotExist' , ({message}) => {
      setError(message)
    } )
    socket.on('roomFullError' , ({message}) => {
      setError(message)
    })
    socket.on('duplicateName' , ({message}) => {
      setError(message);
    } ) 
    socket.on('roomJoined', ({name , roomName , numPlayers , numDecks}) => {
      dispatch(setState({name , roomName , numPlayers , numDecks , host : false}));
      setError("");
      navigate('/custom-room')
    })
  };

  useEffect(() => {
    setIsValid(validateRoomName() && validateName());
  }, [roomName, name]);

  return (
    <div>
      <div onClick={() => close(false)} className='z-20 fixed h-screen w-full bg-white opacity-50'>
      </div>
      <div className='z-30 fixed top-[20vh] left-[30vw] flex justify-center items-center'>
        <div className='bg-emerald-100 pb-10 w-[40vw] rounded-xl relative'>
          <img onClick={() => close(false)} src="/xmark.svg" className='absolute top-[-5px] right-[-10px] h-8 w-10' />
          <h1 className='bg-emerald-700 rounded-t-xl text-center text-emerald-100 text-4xl font-semibold py-4'>Join Room</h1>
          <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-emerald-100 rounded-b-lg">
            <div className="mb-4">
              <label htmlFor="roomName" className="block text-emerald-800 font-semibold mb-2">
                Room Name:
              </label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onBlur={validateRoomName}
                required
                className="w-full p-2 border border-emerald-400 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
              />
              {roomNameError && <p className="text-red-600 text-sm">{roomNameError}</p>}
            </div>

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
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full p-2 rounded-md transition ${isValid ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}`}
            >
              Join Room
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