import React, { Component } from 'react'
import { Tooltip } from '@material-ui/core'
import Emoji from '../assets/smile.svg'
import './PostQuizLeaderboard.css'

class PostQuizStudentRankingDetails extends Component {
  truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

  render () {
    const { first_name: firstName, total_score: totalScore, rank, possibleScore, totalQuestions = 0, attempted_ques_count: totalAttemptedQuestions = 0, isHost, avatar = '', visibility } = this.props
    const percentage = Math.floor((totalScore / possibleScore) * 100)
    return (
      <div className={`postquiz__rank--container`} style={{ visibility: visibility }}>
        <div className='postquiz__rank'>{rank || ''}</div>
        <div className='postquiz__emoji'>
          <img style={{ borderRadius: '50%' }} src={avatar || Emoji} alt='Smiley' />
        </div>
        <div className='postquiz__user--name'>
          { firstName ? this.truncateString(firstName, 10) : 'Unknown' }</div>
        <div className={`${isHost ? 'postquiz__progress--holder--host' : 'postquiz__progress--holder--student'}`}>
          <div className='postquiz__progress--parent'>
            <div className='postquiz__progress--child' style={{ width: `${percentage<=100?percentage:100}%` }} />
          </div>
        </div>
        {
          isHost
            ? <Tooltip title='Number of attempted question / Total Questions' arrow>
              <div className='attempted__questions--count'>
                {`${totalAttemptedQuestions}`} / {`${totalQuestions}`}
              </div>
            </Tooltip>
            : ''
        }

        <div className='postquiz__user--points'>{totalScore || 0} pts</div>
      </div>
    )
  }
}

export default PostQuizStudentRankingDetails
