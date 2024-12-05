import React from 'react'
import Card from '../card/card'
import './animation.css';

export default function FaceCardAnimation({ selectedCards }) {
  return (
    <div className=''>
      {
        selectedCards.map(item => (
          <div
            key={item}
            className='facecardanimation'
          >
            <Card imgSrc={item} />
          </div>
        ))
      }
    </div>
  )
}
