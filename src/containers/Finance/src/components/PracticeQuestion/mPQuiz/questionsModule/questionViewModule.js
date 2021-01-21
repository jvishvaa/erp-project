import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
// import { withStyles, Button, Divider, List, Grid } from '@material-ui/core'
import { withStyles, Button, Grid } from '@material-ui/core'
import Timer from 'react-compound-timer'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
// import ListItem from '@material-ui/core/ListItem'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import ReactHTMLParser from 'react-html-parser'
import {
  WebSockectEvents,
  eventLabels
} from '../utilities'
// import AnimatedListReorder from '../leaderboard/AnimatedListReorder'
import OrderedList from '../leaderboard/OrderedList'
import '../styles/question_view.css'
import '../tempanim.css'
// import AnnouncementIcon from '@material-ui/icons/Announcement'
// import ReportQuestion from '../../../questbox/CreateTest/reportQuestion/ReportQuestion'

const useStyles = theme => ({})
const renderQues = 'render_question'
const renderLB = 'render_leader_board'
const renderPreQuesAnim = 'render_pre_question_anim'
const renderMeme = 'render_meme'
class QuestionModule extends Component {
  constructor (props) {
    super(props)
    // in msec
    let durationObj = {
      qOptionDuration: 2500,
      memeDuration: 5000,
      lbDuration: 5000,
      preQuesAnimDuration: 1000,
      firstQuesAnimDuration: 4000
    }
    // let { questionsMap = new Map(), updateStateToParent = () => {} } = props
    let { questionsMap = new Map() } = props
    let questionResponseMap = this.setExistingResponsesToMap(questionsMap)
    let skipToQuesIndex = this.skipToFistNonAttemptedQues(questionsMap)
    const activeStep = skipToQuesIndex || 0
    this.state = { questionResponseMap, activeStep, ...durationObj }
    const userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    let { personal_info: { role } } = userProfile || {}
    this.userRole = role
    // updateStateToParent({ activeStep })

    // Binding
    this.getTickIcon = this.getTickIcon.bind(this)
    this.getControlBtns = this.getControlBtns.bind(this)
    this.setExistingResponsesToMap = this.setExistingResponsesToMap.bind(this)
    this.convertArrayToMap = this.convertArrayToMap.bind(this)
    this.setStartTimeIfNotExists = this.setStartTimeIfNotExists.bind(this)
    this.setStartTime = this.setStartTime.bind(this)
    this.setEndTime = this.setEndTime.bind(this)
    this.setAttempedOption = this.setAttempedOption.bind(this)
    this.updateQuesResponse = this.updateQuesResponse.bind(this)
    this.doesQuesHasAttmptdPrevsly = this.doesQuesHasAttmptdPrevsly.bind(this)
    this.postQuestionResponse = this.postQuestionResponse.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.skipToFistNonAttemptedQues = this.skipToFistNonAttemptedQues.bind(this)
    this.getActiveQuestion = this.getActiveQuestion.bind(this)
    this.convertJSONObjToObj = this.convertJSONObjToObj.bind(this)
    this.covertOptionObjToArr = this.covertOptionObjToArr.bind(this)
    this.getCorrectAnsOptionIndex = this.getCorrectAnsOptionIndex.bind(this)
    this.isCorrect = this.isCorrect.bind(this)
    this.getOptionList = this.getOptionList.bind(this)
    this.getQuestionContent = this.getQuestionContent.bind(this)
    this.onEndCurrentQues = this.onEndCurrentQues.bind(this)
    this.onEndOfMeme = this.onEndOfMeme.bind(this)
    this.getMeme = this.getMeme.bind(this)
    this.onEndOfLb = this.onEndOfLb.bind(this)
    this.getLb = this.getLb.bind(this)
    this.onEndOfQuesAnim = this.onEndOfQuesAnim.bind(this)
    this.getPreQuestionAnim = this.getPreQuestionAnim.bind(this)
    this.getContent = this.getContent.bind(this)

    this.myRef = React.createRef()
  }
  /**
* Module takes js object of a particalar question.
* The return value is 'view'.
* On click of option selected key val will be sent to parent to a prop func call
* @param {
  id: 44484
  question_type: "MCQ"
  question_type_id: 1
  optionsArray: ["<p>0</p>", "<p>1</p>", "<p>2</p>", "<p>3</p>"]
  question: "<p>What integers should be multiplied by (-12) to become -300 ? </p>"
  correct_ans: "{"option4":"<p>Both (2) &amp; (3)</p>"}"
  response: {
          id: 50876,
          attempted_ans: 0 => enum [0,1,2,3, null] ==> null indicates user left the question
          start_time: "1579846368.065",
          end_time: "1579846460.065",
          duration: "92",//duration in seconds ie.. start_time - end_time,
          correct: true or false,
          score: <score acheieved for this particular question>
          is_quiz_over: true or false (true if this is the last question of quiz)
      }
      Or
      null   ==> indicates user not attempeted the question
  }
* }
* @param {string} [optionalArg] - An optional argument that is a string
*/
  componentWillUpdate (nextProps, nextState) {
    const paramTobeSent = ['activeStep', 'timeToRender']
    const updated = paramTobeSent.some((paramKey) => nextState[paramKey] !== this.state[paramKey])
    if (updated) {
      this.props.updateStateToParent(nextState)
    }
  }

  getTickIcon (isCorrect) {
    if (isCorrect) {
      return <CheckIcon fontSize='large' style={{
        color: 'green',
        fontWeight: 'bolder'
      }} />
    } else { return <ClearIcon fontSize='large' style={{ color: 'red', fontWeight: 'bolder' }} /> }
  }

  getControlBtns () {
    let [activeQuesId, questionObj] = this.getActiveQuestion()
    console.log(activeQuesId)
    let { id: questionId } = questionObj
    let { questionResponseMap = new Map() } = this.state
    let { attempted_ans: attemptedAns } = questionResponseMap.get(questionId) || {}
    let attemptedOptionIndex = String(attemptedAns)
    const tempOptionsArr = ['0', '1', '2', '3']
    let isAttempted = tempOptionsArr.includes(attemptedOptionIndex)
    if (!isAttempted) return <p>Not attempeted</p>
    let { activeStep } = this.state
    let { currentPage, totalPageCount, questionsMap = new Map() } = this.props
    let isFirstQuesInChap = Number(currentPage) === 1 && activeStep === 0
    let isLastQuesInChap = (Number(totalPageCount) === Number(currentPage)) && (activeStep === (questionsMap.size - 1))

    return <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
      <Button color='primary' variant='contained' disabled={isFirstQuesInChap} onClick={this.handleBack} >
        <KeyboardArrowLeft /> Prev Ques
      </Button>
      {isLastQuesInChap
        ? <Button color='primary' variant='contained'
          onClick={this.handleNext}
        >
          finish <KeyboardArrowRight />
        </Button> : <Button color='primary' variant='contained' onClick={this.handleNext} >
          Next Ques <KeyboardArrowRight />
        </Button>}
    </div>
  }
  setExistingResponsesToMap (questionsMap) {
    return this.convertArrayToMap([...questionsMap.values()].filter(i => i.response), 'id', 'response')
  }
  throwErr = (message) => {
    message = message || 'Error: maditory param'
    window.alert(message)
    throw new Error(message)
  }
  convertArrayToMap (arr = [], keyName = this.throwErr(), valueKey = null) {
    if (!Array.isArray(arr)) {
      this.throwErr('1st arg must be an array type')
    }
    if (arr.length && typeof (arr[0][keyName]) === 'object') {
      this.throwErr('arr[index][keyName] must be primitive data type')
    }
    return new Map(arr.map(i => [i[keyName], valueKey ? i[valueKey] : i]))
  }

  setStartTimeIfNotExists (questionId, ...extraArgs) {
    let { questionResponseMap = new Map() } = { ...this.state }
    let { start_time: startTime } = questionResponseMap.get(questionId) || {}
    if (!startTime) {
      this.setStartTime(questionId)
    }
  }
  setStartTime (questionId, callBack, ...extraArgs) {
    let { activeStep } = this.state
    // second argument is callback
    let startTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { start_time: startTime, sequence: activeStep }, callBack, ...extraArgs)
  }
  setEndTime (questionId, callBack, ...extraArgs) {
    // second argument is callback
    let endTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { end_time: endTime }, callBack, ...extraArgs)
  }
  setAttempedOption (questionId, option, wasAttemptedCorrectly, isLastQuesInQuiz, ...extraArgs) {
    // fifth argument is callback
    let endTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { attempted_ans: option, end_time: endTime, correct: wasAttemptedCorrectly, is_quiz_over: isLastQuesInQuiz }, ...extraArgs)
  }
  updateQuesResponse (questionId, obj, callBack = () => { }) {
    // third argument is callback
    let { questionResponseMap = new Map() } = { ...this.state }
    let isHaving = this.doesQuesHasAttmptdPrevsly(questionId)
    if (isHaving) {
      // this means student has already attempted this question previously
      // so do not update any start and end times of this particualr question
      // So no callBack call
    } else {
      let responseObj = questionResponseMap.get(questionId) || { id: questionId, attempted_ans: null }
      let { end_time: prevEndTime, start_time: prevStartTime } = responseObj
      // if time variables (prev and start) have values then do not update
      var updatedObj = { ...responseObj, ...obj }
      if (prevEndTime) { updatedObj['end_time'] = prevEndTime }
      if (prevStartTime) { updatedObj['start_time'] = prevStartTime }
      questionResponseMap.set(questionId, updatedObj)
      this.setState({ questionResponseMap }, () => {
        let { questionResponseMap: updatedMap = new Map() } = { ...this.state }
        callBack(updatedMap.get(questionId))
      })
    }
  }
  doesQuesHasAttmptdPrevsly (questionId) {
    const { questionsMap = new Map() } = { ...this.props }
    const { response } = questionsMap.get(questionId) || {}
    let { attempted_ans: attemptedAns } = response || {}
    attemptedAns = String(attemptedAns)
    // attemptedAns will null or 0 or 1 or 2 or 3
    // let isAttempted = (attemptedAns !== 'null' || attemptedAns !== 'undefined')
    const tempOptionsArr = ['0', '1', '2', '3']
    let isAttempted = tempOptionsArr.includes(attemptedAns)
    return isAttempted
  }

  postQuestionResponse (questionId) {
    this.setEndTime(questionId, (respObj) => {
      let payLoad = respObj
      this.props.postQuestionResponse(questionId, payLoad)
    })
  }
  handleNext () {
    // Before switching to next question, post the reponse of active question
    // let [activeQuesId] = this.getActiveQuestion()
    // setTimeout(() => { this.postQuestionResponse(activeQuesId) }, 0)
    /* the above logic is not required anymore */

    let { activeStep } = this.state
    let { questionsMap = new Map() } = this.props
    let noOfQuestions = questionsMap.size - 1 // starting fron 0
    if (activeStep < noOfQuestions) {
      // this.setState({ activeStep: activeStep + 1 })
      this.setState({ activeStep: activeStep + 1, timeToRender: renderPreQuesAnim })
    } else {
      let { currentPage, totalPageCount } = this.props
      currentPage = Number(currentPage)
      totalPageCount = Number(totalPageCount)
      let nextPage = currentPage + 1
      if (nextPage <= totalPageCount) {
        this.props.handlePagination(nextPage)
      } else {
        // quiz over for this particular user
        this.props.handleFinish()
      }
    }
  }
  handleBack () {
    let { activeStep } = this.state
    let { currentPage } = this.props
    currentPage = Number(currentPage)
    if (activeStep === 0 && currentPage > 1) {
      let prevPage = currentPage - 1
      this.props.handlePagination(prevPage)
      // this.setState({ activeStep: pageSize - 1 })
    } else {
      this.setState({ activeStep: activeStep - 1 })
    }
  }
  skipToFistNonAttemptedQues (questionsMap = new Map()) {
    const indexOfQues = [...questionsMap.values()].map(i => i.response ? i.response.attempted_ans : i.response).indexOf(null)
    if (indexOfQues === -1) {
      return questionsMap.size > 0 ? questionsMap.size - 1 : 0
    } else if (indexOfQues >= 0) {
      return indexOfQues
    } else {
      return 0
    }
  }
  getActiveQuestion () {
    let { activeStep } = this.state
    let { questionsMap = new Map() } = this.props
    if (activeStep < questionsMap.size) {
      return [...questionsMap.entries()][activeStep]
    }
  }
  convertJSONObjToObj (jsonStr = this.throwErr()) {
    let recurConvert = (jsonStr) => {
      let parsedStr = JSON.parse(jsonStr)
      if (typeof (parsedStr) === 'string') {
        return recurConvert(parsedStr)
      } else {
        return parsedStr
      }
    }
    let jsObj = recurConvert(jsonStr)
    return jsObj
  }
  covertOptionObjToArr (optionJson) {
    let optionObj = this.convertJSONObjToObj(optionJson)
    return [...Object.values(optionObj)]
  }
  getCorrectAnsOptionIndex (optionsArray, correctAnsjson) {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns)
  }
  isCorrect (optionsArray, correctAnsjson, optionIndex) {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns) === Number(optionIndex)
  }
  getOptionList (questionObj) {
    // const correctAnsStyles = { backgroundColor: 'rgba(123,229,32, 0.35)', boxShadow: '5px 5px rgba(123,229,32, 0.1)' }
    // const wrongAnsStyles = { backgroundColor: 'rgba(237,68,51, 0.35)', boxShadow: '5px 5px rgba(237,68,51, 0.1)' }
    // const alphabeticOptions = ['A', 'B', 'C', 'D']
    let { optionsArray: options, id: questionId, correct_ans: correctAns } = questionObj
    let { questionResponseMap = new Map() } = this.state
    let { attempted_ans: attemptedAns, correct: isCorrectOption } = questionResponseMap.get(questionId) || {}

    let attemptedOptionIndex = String(attemptedAns)
    const tempOptionsArr = ['0', '1', '2', '3']
    let isAttempted = tempOptionsArr.includes(attemptedOptionIndex)
    let correctAnsOptionIndex = String(this.getCorrectAnsOptionIndex(options, correctAns))
    // let isCorrect = String(correctAnsOptionIndex) === String(attemptedOptionIndex)
    const correctAnsStyles = { backgroundColor: 'rgb(98,195,112)', border: '3px solid rgb(98,195,112)' }
    const wrongAnsStyles = { backgroundColor: 'rgb(231,69,70)', border: 'rgb(231,69,70)' }
    // if (correctAnsStyles) {
    let { activeStep } = this.state
    let { currentPage, totalPageCount, questionsMap = new Map() } = this.props
    let isLastQuesInQuiz = (Number(totalPageCount) === Number(currentPage)) && (activeStep === (questionsMap.size - 1))
    // if already attempted question then call below func immediately
    if (isAttempted) {
      this.onEndCurrentQues()
    }
    return <Grid container className='options-grid' >
      {isAttempted ? isCorrectOption ? this.getBgm('right') : this.getBgm('wrong') : null}
      {options.map((option, index) => {
        return <Grid
          item
          xs={12} sm={3} md={3} lg={3}
          className={`option option-${index + 1}`}
          onClick={() => {
            if (!isAttempted) {
              let [activeQuesId] = this.getActiveQuestion()
              let wasAttemptedCorrectly = String(correctAnsOptionIndex) === String(index)
              this.setAttempedOption(questionId, index, wasAttemptedCorrectly, isLastQuesInQuiz, () => {
                this.postQuestionResponse(activeQuesId)
              })
              // on option selection post the reponse of active question
              // let [activeQuesId] = this.getActiveQuestion()
              // setTimeout(() => { this.postQuestionResponse(activeQuesId) }, 0)
              this.onEndCurrentQues()
            }
          }}
        >
          <div className='option-inner'
            style={{
              ...isAttempted ? correctAnsOptionIndex === String(index) ? correctAnsStyles : attemptedOptionIndex === String(index) ? wrongAnsStyles : { display: 'none' } : { },
              ...attemptedOptionIndex === String(index) ? { border: '3px solid white' } : {}
            }}
          >
            <div className='resizeable-text'>
              <div className='resizeable'>
                {ReactHTMLParser(option)}
              </div>
            </div>
          </div>
        </Grid>
      })}
    </Grid>
  }

  getQuestionContent () {
    let [activeQuesId, questionObj] = this.getActiveQuestion()
    this.setStartTimeIfNotExists(activeQuesId)
    let { question: questionText } = questionObj

    return (<div className='whole-container grow'>
      <div className='question-container'>
        <div className='resizeable-text'>
          <div className='resizeable'>
            {/* {activeStep},{activeQuesId} */}
            {ReactHTMLParser(questionText.replace(/&nbsp;/g, ' '))}
          </div>
        </div>
      </div>
      <div className='options-container'>
        {this.getOptionList(questionObj)}
      </div>

    </div>)
  }
  getBgm =(bgmVariant) => {
    let { bgms: { [bgmVariant]: bgmsArray = [] } = {}, isMuted } = this.props
    let bgmUrl
    if (bgmsArray.length) {
      let item = bgmVariant === 'leaderboard' ? bgmsArray[0] : bgmsArray[Math.floor(Math.random() * bgmsArray.length)]
      let { url: bgmSrc } = item
      bgmUrl = bgmSrc
    }
    return bgmUrl && !isMuted ? <audio ref={this.myRef} style={{ visibility: 'hidden' }} key={bgmUrl} id={bgmUrl} autoPlay src={bgmUrl} /> : null
  }

  retrieveWSDataFromProps (eventLabel, previousData = false) {
    let datKey
    if (previousData) {
      datKey = WebSockectEvents[eventLabel]['prevDataStrgKey']
    } else {
      datKey = WebSockectEvents[eventLabel]['storageKey']
    }
    let { [datKey]: dataObj = {} } = this.props
    return dataObj
  }
  onEndCurrentQues () {
    /*
    * function to call on attemption of current question
    */
    let{ qOptionDuration } = this.state
    setTimeout(() => {
      this.setState({ timeToRender: renderMeme })
    }, qOptionDuration)
  }
  onEndOfMeme () {
    /*
    * function to call on end of mem
    */
    this.setState({ timeToRender: renderLB })
  }

  getMeme = (callBack = this.onEndOfMeme) => {
    let { activeStep, memeDuration } = this.state
    let [activeQuesId] = this.getActiveQuestion()
    let { questionResponseMap = new Map() } = this.state
    let { correct } = questionResponseMap.get(activeQuesId)
    const { respondToQuestion } = eventLabels
    let { data: { meme_details: memeUrl = null } = {}, updatedAt } = this.retrieveWSDataFromProps(respondToQuestion)
    const timeNow = new Date().getTime()
    const isLatestMeme = updatedAt - timeNow <= 5000
    let loaderUrl = 'https://www.demilked.com/magazine/wp-content/uploads/2016/06/gif-animations-replace-loading-screen-14.gif'
    memeUrl = isLatestMeme ? memeUrl : loaderUrl

    return <Timer
      key={`meme-${activeStep}`}
      initialTime={memeDuration}
      direction='backward'
      lastUnit='s'
      checkpoints={[{ time: 0, callback: () => { callBack() } }]}
    >
      {(timerObj) => {
        return <React.Fragment>
          {this.getBgm('meme')}
          <div className='whole-container grow'>
            <div style={{ margin: 'auto' }} >
              {
                correct

                  ? <img className='meme__image'
                    src={memeUrl || 'https://assets.memedrop.io/memes/qL5XLO0MTOCe54QNSzQhDIdggKqdEd9VIE39E2Aq.gif'}
                    alt='meme' />
                  : <img className='meme__image'
                    src={memeUrl || 'http://julianfrost.co.nz/work/skypeemoticons/images/thumbsdown.gif'}
                    alt='meme' />

              }
            </div>
          </div>
        </React.Fragment>
      }}
    </Timer>
  }
  onEndOfLb () {
    /*
    * function to call on end of leader board
    */
    // set timeToRender = renderpreques anim and swith to next question

    // this.setState({ timeToRender: renderPreQuesAnim }, this.handleNext)
    this.handleNext()
  }
  getLb (callBack = this.onEndOfLb) {
    let { fetchLeaderboard } = eventLabels
    let { data: leaderboardData = [] } = this.retrieveWSDataFromProps(fetchLeaderboard) || {}

    let { activeStep, lbDuration } = this.state
    // {/* <h1>student q to q leaderBoard comes here</h1> */}
    return <Timer
      key={`leaderboard-${activeStep}`}
      initialTime={lbDuration}
      direction='backward'
      lastUnit='s'
      checkpoints={[{ time: 0, callback: () => { callBack() } }]}
    >
      {(timerObj) => {
        // const seconds = Math.round(Math.ceil(timerObj.getTime() / 1000))
        // const percentile = (timerObj.getTime() / lbDuration) * 100
        return <React.Fragment>
          {this.getBgm('leaderboard')}
          <div className='host__quiz--container host__quiz--container--withscroll'>
            <OrderedList leaders={leaderboardData} />
          </div>
        </React.Fragment>
      }}
    </Timer>
  }
  onEndOfQuesAnim () {
    /*
    * function to call on end of pre question animation
    */
    this.setState({ timeToRender: renderQues })
  }
  getPreQuestionAnim (callBack = this.onEndOfQuesAnim) {
    /*
    /* on zero checkpoint set below values to state
    * timeToRender: renderMeme
    */
    let { activeStep, preQuesAnimDuration, firstQuesAnimDuration } = this.state
    return <Timer
      key={activeStep}
      initialTime={activeStep === 0 ? firstQuesAnimDuration : preQuesAnimDuration}
      direction='backward'
      lastUnit='s'
      checkpoints={[{ time: 0,
        callback: () => {
          callBack()
        } }]}
    >
      {(timerObj) => {
        const seconds = Math.round(Math.ceil(timerObj.getTime() / 1000))
        return <React.Fragment>

          <div
            // className={'animated fadeInUpBig counter'}
            className={'animated grow counter counter__position'}
            // key={keySec}
            key={Math.round(timerObj.getTime())}
          >
            <hr />
            <div style={{ margin: 'auto' }}>
              {(seconds === 1 || seconds === 0) ? `Q${activeStep + 1}` : seconds }
            </div>
            <hr />
          </div>
          {/* { timerObj.getTime() } */}
        </React.Fragment>
      }}
    </Timer>
  }

  reportQuesAccessRoles = ['Student']
  getContent () {
    const { timeToRender = renderPreQuesAnim } = this.state
    switch (timeToRender) {
      case renderPreQuesAnim: {
        return this.getPreQuestionAnim()
      }
      case renderQues: {
        return this.getQuestionContent()
      }
      case renderMeme: {
        return this.getMeme()
      }
      case renderLB: {
        return this.getLb()
      }
    }
  }
  render () {
    return (
      <React.Fragment>
        {this.getContent()}
      </React.Fragment>
    )
  }
}
export default withRouter(withStyles(useStyles)(QuestionModule))

// full screen dark mode
// animation 3,2,1 go-- bg sound
// restrict option char length
// top right side rank,
// top right score
// top left 1/10, (no of ques)
// top left no of particpts
// top timer running
// no Zoom to ques

// attemption:
// if corect --

// incorrect

// gap filler

// memes
// leader board animation
// avatar selection

// fade in fade out animation to question view

// no power ups
// no redemption question

// prize
// 1st, 2nd, 3rd (in center screen card)

// toughesr ques, longest ques,

// leaderboard,

// over view --leaderboard-
// sno | name | score | q1 | q2 | q3 .....
// 1 | manikanta | 8489(50%) | right(tick) | worng (wrong tick) |

// urls:
// https://quizizz.com/join/quiz/5ea31495dc9569001d935c11/start
// https://quizizz.com/join/game/5678765/

// create quiz
// host
// https://quizizz.com/join/quiz/5e9f58749071d8001bade029/challenge/5eb291b3912e5c001ce8a17d
// from this to --- https://quizizz.com/join?gc=67290339&from=challengeFriends
// sharable link (participants)
// to this --------- https://quizizz.com/join/pre-game/running/456787654/start

// lobby page
// https://quizizz.com/join/game/U2FsdGVkX1%252FKat2WVMiGsQKad45H2XytXcE615SwQXohBACWtCe8QVX7LxtigqYv?gameType=live
// paricipants
// on click of join (choose avatar)
// https://quizizz.com/join/game/<id>/?gameType=live
// https://quizizz.com/join/game/<id>/?gameType=live
// play also in these links

// mk

// host lobby
// https://quizizz.com/quiz/start/<id>/
// participants
// https://quizizz.com/quiz/join/pre-game/running/<id>/start TO https://quizizz.com/quiz/join/<id>/

// same lobby component for host and participant
// host and participant depends on the api data

// game play
// for both and host
// https://quizizz.com/quiz/game/<id>/?gameType=live
