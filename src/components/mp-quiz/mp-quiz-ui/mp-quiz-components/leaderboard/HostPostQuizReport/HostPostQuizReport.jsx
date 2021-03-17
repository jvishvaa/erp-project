import React, { Component } from 'react'
import axios from 'axios'
import { Table, TableRow, TableHead, TableBody, TableCell } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import ToughestQuestion from './ToughestQuestion'
import LongestQuestion from './LongestQuestion'
import ClassAccuracy from './ClassAccuracy'
import HostPostStudentRankingDetails from './HostPostStudentRankingDetails'
import './HostPostQuiz.css'
import InternalPageStatus  from '../../internal-page-status'
import { constants } from '../../../../mp-quiz-providers'

const {urls}=constants||{}
class HostPostQuizReport extends Component {
  constructor () {
    super()

    this.state = {
      questions: [],
      isFetching: true,
      isFetchFailed: false,
      isFetched: false
    }
  }

  fetchQuestions = () => { //please handle
    const { onlineClassId } = this.props
    const { token } = JSON.parse(localStorage.getItem('user_profile')).personal_info
    this.setState({ isFetching: true, isFetchFailed: null }, () => {
      axios.get(`${urls.GetQuizQuestionsWithResponses}?online_class_id=${onlineClassId}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(res => {
          if (res.status === 200) {
            const { data: { result = {} } = {} } = res
            this.setState({ questions: result.data, isFetched: true, isFetching: false })
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({ isFetching: false, isFetchFailed: true })
        })
    })
  }

  componentDidMount () {
    this.fetchQuestions()
  }

  render () {
    const { questions, isFetched, isFetching, isFetchFailed } = this.state
    const { leaders = [], quizSummary = {} } = this.props
    return (
      <div className='hostpostquiz__container'>
        <div className='session__highlights'>
          <ClassAccuracy
            accuracy={quizSummary.average_accuracy}
            fetchStatus={{ isFetched, isFetching, isFetchFailed }}
          />
          <ToughestQuestion
            questionId={quizSummary.toughest_question_id}
            questions={questions}
            fetchStatus={{ isFetched, isFetching, isFetchFailed }}
          />
          <LongestQuestion
            questionId={quizSummary.longest_question_id}
            questions={questions}
            fetchStatus={{ isFetched, isFetching, isFetchFailed }}
          />
        </div>
        <div className='hostpostquiz__leaderboard'>
          <img className={`hostpostquiz__leaderboard--bg`} />
          <div className='hostpostquiz__result--container'>
            {
              isFetching
                ? <InternalPageStatus label='Loading leaderboard..' />
                : isFetched ? <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className='quiz__table__cell'>Rank</TableCell>
                      <TableCell className='quiz__table__cell'>Name</TableCell>
                      <TableCell className='quiz__table__cell'>Score</TableCell>
                      {
                        questions.map((elem, index) => {
                          return <TableCell className='quiz__table__cell'>Q{index + 1}</TableCell>
                        })
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      leaders && leaders.length
                        ? leaders.map(studentDetails => {
                          return <HostPostStudentRankingDetails {...studentDetails} questions={questions} />
                        })
                        : ''
                    }
                  </TableBody>
                </Table>
                  : <InternalPageStatus
                    label={
                      <p>Error occured in fetching Questions&nbsp;
                        <LinkTag
                          component='button'
                          onClick={this.fetchQuestions}>
                          <b>Click here to reload_</b>
                        </LinkTag>
                      </p>
                    }
                    loader={false}
                  />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default HostPostQuizReport
