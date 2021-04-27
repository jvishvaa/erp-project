import React, { Component } from 'react'
import StudentRankingDetails from './StudentRankingDetails'

export class Article extends Component {
  render () {
    const { studentDetails } = this.props
    return (
      <div>
        <StudentRankingDetails {...studentDetails} />
      </div>
    )
  }
}

export default Article
