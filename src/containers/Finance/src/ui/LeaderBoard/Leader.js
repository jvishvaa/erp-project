import React from 'react'
import { ListItem, Typography, Avatar } from '@material-ui/core'
import './LeaderBoard.css'

const Leader = (props) => {
  const { name, rank, secured_score: securedScore, id, image, unattempted_ques: unAttempedQuestions } = props.leaderDetails

  return (
    <ListItem
      id={id}
      button
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography>{rank}</Typography>
      <div className='avatar__leaderboard__container' style={{ width: 150 }}>
        <Avatar
          src={image}
          className='avatar__leaderboard__list'
        />
        <Typography className='leader__name' variant='subtitle2'>{name}</Typography>
      </div>
      <Typography style={{ marginRight: 40 }}>{securedScore}</Typography>
      <Typography style={{ marginRight: 40 }}>{unAttempedQuestions}</Typography>
    </ListItem>
  )
}

export default Leader
