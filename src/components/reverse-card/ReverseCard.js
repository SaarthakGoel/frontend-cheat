import React from 'react'
import './card.css';

export default function ReverseCard(imgSrc) {
  return (
    <div className='card-container'>
       <div className='card'>
          <div className='card-inner'>
            <div className='card-front'>
               <img src="/cards/1B.svg" alt="AS" className='card-img' />
            </div>
            <div className='card-back'>
              <img src="/cards/AS.svg" alt='background' className='card-img' />
            </div>
          </div>
       </div>
    </div>
  )
}
