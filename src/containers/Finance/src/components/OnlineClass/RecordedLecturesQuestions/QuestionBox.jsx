import React, { Component } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { Grid } from '@material-ui/core'
import './questionUIStyles.css'

class QuestionBox extends Component {
  constructor () {
    super()
    this.state = {
      showResults: false
    }
  }

  correctAnsStyles = { backgroundColor: 'rgb(98,195,112)', border: '3px solid rgb(98,195,112)' }
  wrongAnsStyles = { backgroundColor: 'rgb(231,69,70)', border: 'rgb(231,69,70)' }

  getOptionList (questionObj) {
    let { optionsArray, response, correct_ans_option_index: correctAnsOptionIndex } = questionObj
    let { attempted_ans: attemptedOptionIndex } = response || {}
    correctAnsOptionIndex = String(correctAnsOptionIndex)
    attemptedOptionIndex = String(attemptedOptionIndex)
    const { timeStamp, questionIndex } = this.props
    const isAttempted = ['0', '1', '2', '3'].includes(String(attemptedOptionIndex))
    return <Grid container className='options-grid-rl' >
      {
        optionsArray.map((option, index) => {
          return <Grid
            item
            xs={12} sm={3} md={3} lg={3}
            className={`option-rl option-rl-${index + 1}`}
            onClick={() => {
              if (!isAttempted) {
                this.handleAttemptedAnswer(timeStamp, index, questionIndex)
              }
            }}
          >
            <div className='option-inner-rl'
              style={{
                ...isAttempted
                  ? correctAnsOptionIndex === String(index)
                    ? this.correctAnsStyles
                    : attemptedOptionIndex === String(index)
                      ? this.wrongAnsStyles
                      : { display: 'none' }
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
  getQuestionContent = () => {
    // let { questionObj = {}, questionIndex } = this.props || {}
    let { questionObj = {} } = this.props || {}
    let { question: questionText } = questionObj || {}
    return (<div className='whole-container-rl shrink-img'>
      <div className='question-container-rl'>
        <div className='resizeable-text-rl'>
          <div className='resizeable-rl'>
            {/* {questionIndex + 1}) */}
            {ReactHTMLParser(questionText.replace(/&nbsp;/g, ' '))}
          </div>
        </div>
      </div>
      <div className='options-container-rl'>
        {this.getOptionList(questionObj)}
      </div>

    </div>)
  }
    handleAttemptedAnswer = (timeStamp, attemptedIndex, questionIndex) => {
      const { handleAnswer } = this.props
      handleAnswer(timeStamp, attemptedIndex, questionIndex)
    }

    render () {
      const { questionObj = {} } = this.props || {}
      const { is_question_viewed: isQuestionViewed } = questionObj
      const quesNotViewed = !isQuestionViewed
      if (quesNotViewed) {
        this.props.pause()
        return this.getQuestionContent()
      } else {
        return null
      }
    }
};

export default QuestionBox
