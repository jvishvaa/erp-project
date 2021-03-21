import React from 'react'
import Excellent from './assets/1.svg'
import Good from './assets/2.svg'
import Average from './assets/3.svg'
import Poor from './assets/4.svg'
import Worst from './assets/5.svg'
import './EmojiFeedback.css'

export const EmojiExcellent = (props) => {
  const handleClick = (event) => {
    const { name } = event.target
    props.handleEmojiClick(name)
  }

  return (
    <div className='emoji__container' >
      <img src={Excellent} alt='Excellent' onClick={handleClick} name={props.type === 'numeric' ? 5 : 'Excellent'} />
    </div>
  )
}

export const EmojiGood = (props) => {
  const handleClick = (event) => {
    const { name } = event.target
    props.handleEmojiClick(name)
  }

  return (
    <div className='emoji__container' >
      <img src={Good} alt='Good' onClick={handleClick} name={props.type === 'numeric' ? 4 : 'Good'} />
    </div>
  )
}

export const EmojiAverage = (props) => {
  const handleClick = (event) => {
    const { name } = event.target
    props.handleEmojiClick(name)
  }

  return (
    <div className='emoji__container' >
      <img src={Average} alt='Average' onClick={handleClick} name={props.type === 'numeric' ? 3 : 'Average'} />
    </div>
  )
}

export const EmojiPoor = (props) => {
  const handleClick = (event) => {
    const { name } = event.target
    props.handleEmojiClick(name)
  }

  return (
    <div className='emoji__container' >
      <img src={Poor} alt='Poor' onClick={handleClick} name={props.type === 'numeric' ? 2 : 'Poor'} />
    </div>
  )
}

export const EmojiWorst = (props) => {
  const handleClick = (event) => {
    const { name } = event.target
    props.handleEmojiClick(name)
  }

  return (
    <div className='emoji__container'>
      <img src={Worst} alt='Worst' onClick={handleClick} name={props.type === 'numeric' ? 1 : 'Worst'} />
    </div>
  )
}
