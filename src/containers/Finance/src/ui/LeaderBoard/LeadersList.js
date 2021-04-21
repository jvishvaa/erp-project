import React from 'react'
import { List } from '@material-ui/core'
import Leader from './Leader'

const LeaderList = (props) => {
  return (
    <List>
      {
        props.leaders.map(leader => {
          return <Leader leaderDetails={leader} />
        })
      }
    </List>
  )
}

export default LeaderList
