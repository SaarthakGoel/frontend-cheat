import React from 'react'
import './doubtCard.css';

export default function DoubtCard({imgSrc , flipedCard }) {
  return (
    <div className='card-container2'>
       <div className='card2'>
          <div className={`card-inner2 ${flipedCard ? ' flipped' : ''}`}>
            <div className='card-front2'>
               <img src="/cards/1B.svg" alt="1B" className='card-img2' />
            </div>
            <div className='card-back2'>
              <img src={`/cards/${imgSrc}.svg`} alt={imgSrc} className='card-img2' />
            </div>
          </div>
       </div>
    </div>
  )
}
