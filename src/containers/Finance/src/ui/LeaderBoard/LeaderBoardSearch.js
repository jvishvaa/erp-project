import React from 'react'
import './LeaderBoard.css'

const LeaderBoardSearch = (props) => {
  const handleChange = (event) => {
    const { value } = event.target
    props.handleSearch(value)
  }

  return (
    <div className='leaderboard__search--container'>
      <input
        className='leaderboard__search--box'
        type='text'
        onChange={handleChange}
        placeholder='Search by name...'
      />
    </div>
  )
}

export default LeaderBoardSearch
