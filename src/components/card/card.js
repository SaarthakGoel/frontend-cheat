import React from 'react'
import './card.css';

export default function Card(imgSrc) {
  return (
    <div className='card-container'>
       <div className='card'>
          <div className='card-inner'>
            <div className='card-front'>
               <img src="/cards/AS.svg" alt="AS" className='card-img' />
            </div>
            <div className='card-back'>
              <img src="/cards/1B.svg" alt='background' className='card-img' />
            </div>
          </div>
       </div>
    </div>
  )
}
