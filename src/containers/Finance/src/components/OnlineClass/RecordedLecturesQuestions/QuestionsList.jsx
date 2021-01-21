import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import CloseIcon from '@material-ui/icons/Close'
import QuestionBox from './QuestionBox'

export class QuestionsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  // componentWillReceiveProps (props) {
  //   const { questionsMap, timeStamp } = props
  //   const questionsByTimeStamp = questionsMap.get(timeStamp)
  //   this.setState({ questions: questionsByTimeStamp })
  // }
  componentWillReceiveProps (nextProps) {
    let { playerState: {
      isEnded: isEndedPrev
      // playbackPosition: playbackPositionPrev
    } } = this.props || {}
    let { playerState: {
      isEnded: isEndedPresent
      // playbackPosition: playbackPositionPresent
    } } = nextProps || {}

    if (isEndedPrev === true && isEndedPresent === false) {
      // logic to show end banner on video replayed and ended
      this.setState({ closeEndSummaryBanner: false })
    }
  }

  // convertObjectToArray = (object = {}) => {
  //   return Object.values(object)
  // }
  iconBtnStyles={ background: 'rgba(0, 0, 0,0.5)',
    boxShadow: '0px 0px 2px black',
    borderRadius: '0px',
    padding: 4,
    minWidth: '34px',
    minHeight: '34px',
    maxHeight: '34px' }
  iconStyles={
    padding: 0,
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 'bolder',
    color: 'white' }
  iconLabelStyles = {
    padding: 0,
    margin: 0,
    fontSize: '1.1rem',
    color: 'white',
    letterSpacing: '1.5px' }
    getViDeoEndedContent = () => {
      let { closeEndSummaryBanner } = this.state
      let { questionsMap = new Map(),
        playerState: { isEnded: isVideoEnded } = {}
      } = this.props || {}

      let questionsArray = [...questionsMap.values()].flatMap(item => item)
      const noOfQuestions = questionsArray.length
      const noOfQuestionsCorrect = questionsArray.filter(item => item.response && item.response.correct).length
      const noOfQuestionsInCorrect = questionsArray.filter(item => item.response && !item.response.correct).length
      const noOfQuestionsSkipped = questionsArray.filter(item => !item.response).length
      if (closeEndSummaryBanner && isVideoEnded) return null
      return <div
        style={{
          ...this.props.__style,
          overflow: 'auto',
          color: 'white'
        }}
      >
        <div style={{ margin: 'auto' }}>
          <div style={{ position: 'absolute', right: 5, top: 10, zIndex: '10000' }}>
            <IconButton
              onClick={() => {
                this.setState({ closeEndSummaryBanner: true })
                this.props.handleClose()
                // this.props.resetAllQuesIsViewedInfo()
              }}
              style={this.iconBtnStyles}
              aria-label='upload picture'
              component='span'>
              <span style={this.iconLabelStyles}>Close</span>
              &nbsp;
              <CloseIcon style={this.iconStyles} />
            </IconButton>
          </div>
          {/* <p>Video ENDed</p> */}
          <div className='recoreded__questions__review'>
            <h2>Questions Review</h2>
            <h3>
            No of questions: {noOfQuestions}
            </h3>
            <h3>
            No of questions correct: {noOfQuestionsCorrect}
            </h3>
            <h3>
            No of questions incorrect: {noOfQuestionsInCorrect}
            </h3>
            <h3>
            No of  questions skipped: {noOfQuestionsSkipped}
            </h3>
            <Button
              onClick={() => {
                this.props.resetAllQuesIsViewedInfo()
                this.props.resume()
              }}
              variant='outlined' color='primary' style={
                { 'background-color': '#7DC37D', color: 'white', borderRadius: '24px' }
              }>
              Replay
            </Button>
            <br />
            <br />
            <Button
              onClick={this.props.postIsReset}
              variant='outlined' color='primary'
              style={{ 'background-color': '#7DC37D', color: 'white', borderRadius: '24px' }}
            >
              Reset questions and replay
            </Button>
          </div>

        </div>
      </div>
      // </div>
    }
    getQuestionsContent = () => {
      let hasQuestions = this.props.questionsMap.has(this.props.timeStamp)
      let questionsArray = hasQuestions ? (this.props.questionsMap.get(this.props.timeStamp) || []) : []
      const { updateResponse, timeStamp } = this.props

      return <div
        style={{
          ...this.props.__style,
          overflow: 'auto'
        }}
      >
        <div style={{ margin: 'auto' }}>

          <div style={{ position: 'absolute', right: 5, top: 10, zIndex: '10000' }}>
            <IconButton
              onClick={() => {
                this.props.updateQuestionsAsViewed(
                  this.props.timeStamp, () => {
                    this.props.resume()
                  }
                )
              }}
              style={this.iconBtnStyles}
              aria-label='upload picture'
              component='span'>
              <span style={this.iconLabelStyles}>

                {
                  this.props.checkWhetherAttempted(this.props.timeStamp)
                    ? 'continue' : 'skip Ques'
                }
              </span>
              &nbsp;
              <SkipNextIcon style={this.iconStyles} />
            </IconButton>
          </div>

          { questionsArray.map((question, index) => {
            return <div style={{
              // border: '1px solid red',
              margin: '15px 0px 15px 0px' }}>
              <QuestionBox
                key={question.id}
                handleAnswer={updateResponse}
                timeStamp={timeStamp}
                questionIndex={index}
                pause={this.props.pause}
                resume={this.props.resume}
                questionObj={question}
              />
            </div>
          })
          }
        </div>
      </div>
    }
    render () {
      let hasQuestionsInTmstmp = this.props.questionsMap.has(this.props.timeStamp)
      let questionsArray = hasQuestionsInTmstmp ? (this.props.questionsMap.get(this.props.timeStamp) || []) : []
      // hasQuestionsInTmstmp = !!questionsArray.length
      const hasQuestionsInTmstmpAndNotViewed = questionsArray.length && questionsArray.every(item => !item.is_question_viewed)
      let { playerState: { isEnded: isVideoEnded } = {} } = this.props
      return (hasQuestionsInTmstmpAndNotViewed)
        ? this.getQuestionsContent()
        : isVideoEnded
          ? this.getViDeoEndedContent()
          : null
    }
}

export default QuestionsList
