import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
// import Emoji from './assets/smile.svg'
import './StudentRankingDetails.css'

class StudentDetails extends Component {
  truncateString = (str, num) => {
    if ( str !== null && str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

  render () {
    const { currentUserId, name = 'Unknown', user_id: userId, isHost, removeUser, avatar = '' } = this.props
    // const Emoji = 'https://omrsheet.s3.ap-south-1.amazonaws.com/media/user_profile/download_wchd7Wo.png'; // Please handle
    const Emoji = 'https://d2r9gkgplfhsr2.cloudfront.net/media/user_profile/download_wchd7Wo.png'; // Please handle

    const me = String(currentUserId) === String(userId)
    const { mouseOnMe } = this.state || {}
    if (isHost) {
      return (
      <div
        onMouseEnter={() => { this.setState({ mouseOnMe: true }) }}
        onMouseLeave={() => { this.setState({ mouseOnMe: false }) }}
        className={`quiz__rank--container ${mouseOnMe ? 'quiz__rank--bg-white' : 'quiz__rank--bg-blue'}`}
      >
        <div className='quiz__user--studentname'>
          { `${this.truncateString(name, 10)}${mouseOnMe ? `` : ``}` }

        </div>
        <div className='quiz__emoji'>
          {mouseOnMe
            ? <IconButton size='small' onClick={removeUser || (() => {})} style={{ background: 'rgb(94,37,73)' }} aria-label='delete' color={'secondary'}>
              <DeleteIcon />
            </IconButton>
            : <img style={{ borderRadius: '50%' }} src={avatar || Emoji} alt='Smiley' />
          }
        </div>

      </div>)
    } else {
      return (
        <div
          className={`quiz__rank--container ${me ? 'quiz__rank--bg-white' : 'quiz__rank--bg-blue'}`}>
          <div className='quiz__user--studentname'>
            { `${this.truncateString(name, 10)}` }
          </div>
          <div className='quiz__emoji'>
            <img style={{ borderRadius: '50%' }} src={avatar || Emoji} alt='Smiley' />
          </div>
        </div>
      )
    }
  }
}

export default StudentDetails
