import React, { Component } from 'react'
import { TableRow, TableCell } from '@material-ui/core'
// import Emoji from '../assets/smile.svg'

export class HostPostStudentRankingDetails extends Component {
  throwErr = (message) => {
    message = message || 'Error: maditory param'
    window.alert(message)
    throw new Error(message)
  }
  convertArrayToMap = (arr = [], keyName = this.throwErr(), valueKey = null) => {
    if (!Array.isArray(arr)) {
      this.throwErr('1st arg must be an array type')
    }
    if (arr.length && typeof (arr[0][keyName]) === 'object') {
      this.throwErr('arr[index][keyName] must be primitive data type')
    }
    return new Map(arr.map(i => [i[keyName], valueKey ? i[valueKey] : i]))
  }
  render () {
    const { first_name: firstName = '', total_score: totalScore = '', rank = '',
      questions: questions = [],
      question_responses: questionResponses = [] } = this.props
    const questionResponsesMap = this.convertArrayToMap(questionResponses, 'id')
    // const questionsMap = this.convertArrayToMap(questions, 'id')
    return (
      // <div className='hostpostquiz__studentranking--container'>
      //   <div className='hostpostquiz__student--rank'>{rank}</div>
      //   <div className='hostpostquiz__student--name'>{firstName}</div>
      //   <div className='hostpostquiz__student--score'>{totalScore} pts</div>
      //   <div className='hostpostquiz__student--correct'>
      //     {
      //       questions.map(question => {
      //         return question.correct ? <span style={{ margin: '0px 10px' }} >&#10004;</span> : <span style={{ margin: '0px 10px' }}>&#10008;</span>
      //       })
      //     }
      //   </div>
      // </div>
      <TableRow>
        <TableCell className='quiz__table__cell'>{rank}</TableCell>
        <TableCell className='quiz__table__cell'>{firstName}</TableCell>
        <TableCell className='quiz__table__cell'>{totalScore}</TableCell>
        {
          questions.map(question => {
            let{ correct = null } = questionResponsesMap.get(question.id) || {}
            switch (correct) {
              case true: {
                return <TableCell className='quiz__table__cell'>
                  <span className='hostpostquiz__student--correct'>&#10004;</span>
                </TableCell>
              }
              case false: {
                return <TableCell className='quiz__table__cell'>
                  <span className='hostpostquiz__student--incorrect'>&#10008;</span>
                </TableCell>
              }
              case null: {
                return <TableCell className='quiz__table__cell'>
                  <span className='hostpostquiz__student--notattempted'>&#x02298;</span>
                </TableCell>
              }
            }
          })
        }
      </TableRow>
    )
  }
}

export default HostPostStudentRankingDetails
