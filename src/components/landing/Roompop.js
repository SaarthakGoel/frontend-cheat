import React from 'react'

export default function Roompop({close}) {
  return (
    <div> 
      <div onClick={() => close(false)} className='z-20 fixed h-screen w-full bg-white opacity-50'>
      </div>
      <div className='z-30 fixed top-[30vh] left-[30vw] flex justify-center items-center'>
        <div className='bg-emerald-500 h-[40vh] w-[40vw]'>
          hello friends chai peelo
        </div>
      </div>
      
    </div>
  )
}
