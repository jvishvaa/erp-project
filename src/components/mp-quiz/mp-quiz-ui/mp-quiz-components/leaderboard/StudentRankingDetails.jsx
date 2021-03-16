import React, { Component } from 'react'
import Emoji from './assets/smile.svg'
import Laugh from './assets/laugh.svg'
import './StudentRankingDetails.css'

class StudentRankingDetails extends Component {
  truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

  render () {
    const { currentUserId, rank, total_score: totalScore, user_id: userId, first_name: name, childRef, avatar = '' } = this.props.studentDetails
    const me = String(currentUserId) === String(userId)
    return (
      <div
        ref={me ? childRef : ''}
        className={`quiz__rank--container ${me ? 'quiz__rank--bg-white' : 'quiz__rank--bg-blue'}`}>
        <div className='quiz__rank'>{rank || '-'}</div>
        <div className='quiz__line' />
        <div className='quiz__emoji'>
          {
            avatar
              ? <img style={{ borderRadius: '50%' }} src={avatar} alt='Smiley' />
              : <img src={me ? Laugh : Emoji} alt='Smiley' />
          }
        </div>
        <div className='quiz__user--name'>{ name ? this.truncateString(name, 10) : 'Unknown' }</div>
        <div className='quiz__user--points'>{totalScore || 0}</div>
      </div>
    )
  }
}

export default StudentRankingDetails
