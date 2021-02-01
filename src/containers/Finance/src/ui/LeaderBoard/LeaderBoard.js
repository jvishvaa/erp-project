import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@material-ui/core'
import LeaderList from './LeadersList'
import LeaderBoardSearch from './LeaderBoardSearch'
import './LeaderBoard.css'

/**
 * Represents a user.
 * { name: 'John', rank: 1, secured_percentage: 90 }
 */

/**
 * props to be passed:
 * showLoader: if true shows the loader, else hides it
 * users: should be an array, and should be in sequence. Ranging from rank 1 to the last rank to be shown
 */

const LeaderBoard = (props) => {
  const [leaders, setLeaders] = useState([])
  const [searchedLeaders, setSearchedLeaders] = useState([])
  const [disableScroll, setDisableScroll] = useState(false)

  const handleScroll = (event) => {
    const { currentPage, totalPages } = props.pageDetails
    const { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight && !disableScroll && totalPages > currentPage) {
      props.handleScroll()
    }
  }

  useEffect(() => {
    setLeaders(props.leaders)
    setSearchedLeaders(props.leaders)
  }, [props.leaders])

  const handleSearch = (value) => {
    if (!value) {
      setSearchedLeaders(leaders)
      setDisableScroll(false)
    } else {
      const searchedLeaders = leaders.filter(leader => {
        const name = leader.name.toLowerCase()
        const searchValue = value.toLowerCase()
        return name.includes(searchValue)
      })
      setSearchedLeaders(searchedLeaders)
      setDisableScroll(true)
    }
  }

  return (
    <React.Fragment>
      <Box boxShadow={4} className='leaderboard__main__container'>
        <LeaderBoardSearch handleSearch={handleSearch} />
        <div className='leaders__container'>
          <span className='heading__leader__list'>Rank</span>
          <span className='heading__leader__list' style={{ width: 200, textAlign: 'center' }}>Profile</span>
          <span className='heading__leader__list'>Expertise XP</span>
          <span className='heading__leader__list'>Unattempted Questions</span>
        </div>
        <div className='leader__list__container' onScroll={handleScroll}>
          {
            !searchedLeaders.length
              ? <Typography style={{ margin: '60px auto', textAlign: 'center' }}>No students found</Typography>
              : <LeaderList leaders={searchedLeaders} />
          }
        </div>
      </Box>
    </React.Fragment>
  )
}

export default LeaderBoard
