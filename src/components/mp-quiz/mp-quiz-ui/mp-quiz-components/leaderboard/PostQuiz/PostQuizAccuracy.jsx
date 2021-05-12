import React, { Component } from 'react'

export class PostQuizAccuracy extends Component {
  render () {
    return (
      <div className='postquiz__accuracy--container'>
        <div className='postquiz__accuracy--progress'>
          <span className='postquiz__accuracy--left-container postquiz__accuracy--corners' />
          <span className='postquiz__accuracy--left-text'>10</span>
          <span className='postquiz__accuracy--progress-container' />
          <span className='postquiz__accuracy--right-container postquiz__accuracy--corners' />
          <span className='postquiz__accuracy--right-text'>10</span>
        </div>
      </div>
    )
  }
}

export default PostQuizAccuracy
