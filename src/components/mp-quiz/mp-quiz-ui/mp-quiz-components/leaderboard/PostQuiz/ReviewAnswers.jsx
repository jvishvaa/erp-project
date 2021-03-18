import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import axios from 'axios'
import ReactHTMLParser from 'react-html-parser'
// import { urls } from '../../../../../urls'
// import { InternalPageStatus } from '../../../../../ui'
import {InternalPageStatus  }from '../../../../mp-quiz-utils/'
import { constants } from '../../../../mp-quiz-providers'

const {urls}=constants||{}

export class ReviewAnswers extends Component {
  constructor () {
    super()
    this.state = {
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      loading: true,
      questions: []
    }
  }

  getQuestions = () => {
    const { personalInfo } = this.state
    const { onlineClassId } = this.props
    const url = `${urls.GetQuizQuestionsWithResponses}?online_class_id=${onlineClassId}`
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        const { result: { data = [] } } = res.data
        if (res.status === 200) {
          this.setState({ loading: false, questions: data })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      })
  }

  componentDidMount () {
    this.setState({ loading: true }, () => {
      this.getQuestions()
    })
  }

  renderQuestion = (question) => {
    return (
      <div>
        <div className='resizeable'>
          {ReactHTMLParser(question.replace(/&nbsp;/g, ' '))}
        </div>
      </div>
    )
  }

  convertJSONObjToObj = (jsonStr = this.throwErr(), questionId) => {
    let parsedStr
    try {
      parsedStr = JSON.parse(jsonStr)
    } catch (e) {
      parsedStr = 'Incorrect Format'
    }
    return parsedStr
  }

  convertOptionObjToArr = (optionJson) => {
    let optionObj = this.convertJSONObjToObj(optionJson)
    return [...Object.values(optionObj)]
  }

  getCorrectAnsOptionIndex (optionsArray, correctAnsjson) {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns)
  }

  getOptionList = (questionObj) => {
    let { option, correct_ans: correctAns } = questionObj
    let { attempted_ans: attemptedAns } = questionObj.response || {}
    let attemptedOptionIndex = String(attemptedAns)
    const tempOptionsArr = ['0', '1', '2', '3']
    let isAttempted = tempOptionsArr.includes(attemptedOptionIndex)
    const correctAnsStyles = { backgroundColor: 'rgb(98,195,112)', border: '3px solid rgb(98,195,112)' }
    const wrongAnsStyles = { backgroundColor: 'rgb(231,69,70)', border: 'rgb(231,69,70)' }
    let correctAnsOptionIndex = String(this.getCorrectAnsOptionIndex(this.convertOptionObjToArr(option), correctAns))
    return <Grid container className='options-grid-rl options__container--quiz' >
      {
        this.convertOptionObjToArr(option).map((option, index) => {
          return <Grid
            item
            xs={12} sm={3} md={3} lg={3}
            className={`option-rl`}
          >
            <div className='option-inner-rl option-inner__border'
              style={{
                ...isAttempted
                  ? correctAnsOptionIndex === String(index)
                    ? correctAnsStyles
                    : attemptedOptionIndex === String(index)
                      ? wrongAnsStyles
                      : { display: 'block' }
                  : { },
                ...attemptedOptionIndex === String(index) ? { border: '3px solid white' } : {}
              }}
            >
              <div className='resizeable-text-rl'>
                <div className='resizeable-rl'>
                  {ReactHTMLParser(option)}
                </div>
              </div>
            </div>
          </Grid>
        })
      }
    </Grid>
  }

  render () {
    const { loading, questions } = this.state
    return (
      <div style={{ marginTop: 100 }}>
        {
          loading
            ? <InternalPageStatus label={'Loading your answers. Please wait!'} />
            : questions && questions.length
              ? questions.map((question, index) => {
                return <div className='review__answers--quiz'>
                  <h1>{index + 1})</h1>
                  {this.renderQuestion(question.question)}
                  {this.getOptionList(question)}
                </div>
              })
              : <InternalPageStatus label={'No questions were found!'} loader={false} />
        }

      </div>
    )
  }
}

export default ReviewAnswers
