import React from 'react'
import { Avatar, Typography } from '@material-ui/core'
import './LeaderBoard.css'

const LeaderDetails = (props) => {
  const { rank, secured_percentage: percentage, img_url: imageUrl } = props.selectedUser
  return (
    <div className='leader__info__container'>
      <div className='leader__info__header'>
        <Typography variant='h5' className='syntax__white__leaderboard'>{rank}</Typography>
        <Avatar
          className='avatar__leaderboard__header'
          src={imageUrl}
        />
        <Typography variant='h5' className='syntax__white__leaderboard'>{percentage} %</Typography>
      </div>
    </div>
  )
}

export default LeaderDetails
