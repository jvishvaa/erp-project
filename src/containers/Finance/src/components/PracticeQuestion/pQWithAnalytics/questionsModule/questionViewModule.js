
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles, Button, Divider, List } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import ListItem from '@material-ui/core/ListItem'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import ReactHTMLParser from 'react-html-parser'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ReportQuestion from '../../../questbox/CreateTest/reportQuestion/ReportQuestion'

const useStyles = theme => ({})
class QuestionModule extends Component {
  constructor (props) {
    super(props)
    let { questionsMap = new Map() } = props
    let questionResponseMap = this.setExistingResponsesToMap(questionsMap)
    this.state = { questionResponseMap, activeStep: 0 }
    const userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    let { personal_info: { role } } = userProfile || {}
    this.userRole = role
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
          duration: "92",//duration in seconds ie.. start_time - end_time
      }
      Or
      null   ==> indicates user not attempeted the question
  }
* }
* @param {string} [optionalArg] - An optional argument that is a string
*/
  getTickIcon = (isCorrect) => {
    if (isCorrect) {
      return <CheckIcon fontSize='large' style={{
        color: 'green',
        fontWeight: 'bolder'
      }} />
    } else { return <ClearIcon fontSize='large' style={{ color: 'red', fontWeight: 'bolder' }} /> }
  }
  getControlBtns = () => {
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
        // onClick={this.props.handleFinish}
        >
          finish <KeyboardArrowRight />
        </Button> : <Button color='primary' variant='contained' onClick={this.handleNext} >
          Next Ques <KeyboardArrowRight />
        </Button>}
    </div>
  }
  setExistingResponsesToMap = questionsMap => {
    return this.convertArrayToMap([...questionsMap.values()].filter(i => i.response), 'id', 'response')
  }
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

  setStartTimeIfNotExists = (questionId, ...extraArgs) => {
    let { questionResponseMap = new Map() } = { ...this.state }
    let { start_time: startTime } = questionResponseMap.get(questionId) || {}
    if (!startTime) {
      this.setStartTime(questionId)
    }
  }
  setStartTime = (questionId, callBack, ...extraArgs) => {
    // second argument is callback
    let startTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { start_time: startTime }, callBack, ...extraArgs)
  }
  setEndTime = (questionId, callBack, ...extraArgs) => {
    // second argument is callback
    let endTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { end_time: endTime }, callBack, ...extraArgs)
  }
  setAttempedOption = (questionId, option, ...extraArgs) => {
    // third argument is callback
    let endTime = new Date().getTime() / 1000
    this.updateQuesResponse(questionId, { attempted_ans: option, end_time: endTime }, ...extraArgs)
  }
  updateQuesResponse = (questionId, obj, callBack = () => { }) => {
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
      questionResponseMap.set(questionId, updatedObj
      )
      this.setState({ questionResponseMap }, () => {
        let { questionResponseMap: updatedMap = new Map() } = { ...this.state }
        callBack(updatedMap.get(questionId))
      })
    }
  }
  doesQuesHasAttmptdPrevsly = (questionId) => {
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

  postQuestionResponse = (questionId) => {
    // let [activeQuesId, questionObj] = this.getActiveQuestion()
    // console.log(questionObj)
    // questionId = activeQuesId
    this.setEndTime(questionId, (respObj) => {
      let payLoad = respObj
      this.props.postQuestionResponse(questionId, payLoad)
    })
  }
  handleNext = () => {
    // Before switching to next question, post the reponse of active question
    let [activeQuesId] = this.getActiveQuestion()
    setTimeout(() => { this.postQuestionResponse(activeQuesId) }, 0)

    let { activeStep } = this.state
    let { questionsMap = new Map() } = this.props
    let noOfQuestions = questionsMap.size - 1 // starting fron 0
    if (activeStep < noOfQuestions) {
      this.setState({ activeStep: activeStep + 1 })
    } else {
      let { currentPage, totalPageCount } = this.props
      currentPage = Number(currentPage)
      totalPageCount = Number(totalPageCount)
      let nextPage = currentPage + 1
      if (nextPage <= totalPageCount) {
        this.props.handlePagination(nextPage)
      } else {
        // redirecting to step3 (Accuracy statistics page)
        // this.props.history.push(this.props.location.pathname)
        this.props.handleFinish()
      }
    }
  }
  handleBack = () => {
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
  getActiveQuestion = () => {
    let { activeStep } = this.state
    let { questionsMap = new Map() } = this.props
    if (activeStep < questionsMap.size) {
      return [...questionsMap.entries()][activeStep]
    }
    //  else {
    //   window.alert('step accessed')
    //   return [0, {}]
    // }
  }
  convertJSONObjToObj = (jsonStr = this.throwErr()) => {
    let recurConvert = (jsonStr) => {
      let parsedStr = JSON.parse(jsonStr)
      if (typeof (parsedStr) === 'string') {
        recurConvert(parsedStr)
      } else {
        return parsedStr
      }
    }
    let jsObj = recurConvert(jsonStr)
    return jsObj
  }
  covertOptionObjToArr = (optionJson) => {
    let optionObj = this.convertJSONObjToObj(optionJson)
    return [...Object.values(optionObj)]
  }
  getCorrectAnsOptionIndex = (optionsArray, correctAnsjson) => {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns)
  }
  isCorrect = (optionsArray, correctAnsjson, optionIndex) => {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns) === Number(optionIndex)
  }
  getOptionList = (questionObj) => {
    const correctAnsStyles = { backgroundColor: 'rgba(123,229,32, 0.35)', boxShadow: '5px 5px rgba(123,229,32, 0.1)' }
    const wrongAnsStyles = { backgroundColor: 'rgba(237,68,51, 0.35)', boxShadow: '5px 5px rgba(237,68,51, 0.1)' }
    const alphabeticOptions = ['A', 'B', 'C', 'D']

    let { optionsArray: options, id: questionId, correct_ans: correctAns } = questionObj
    let { questionResponseMap = new Map() } = this.state
    let { attempted_ans: attemptedAns } = questionResponseMap.get(questionId) || {}

    let attemptedOptionIndex = String(attemptedAns)
    const tempOptionsArr = ['0', '1', '2', '3']
    let isAttempted = tempOptionsArr.includes(attemptedOptionIndex)
    let correctAnsOptionIndex = String(this.getCorrectAnsOptionIndex(options, correctAns))
    let isCorrect = String(correctAnsOptionIndex) === String(attemptedOptionIndex)
    return <List component='nav'>
      {
        options.map((option, index) => {
          return (
            <React.Fragment>
              <ListItem
                // disabled={isAttempted}
                onClick={() => {
                  if (!isAttempted) {
                    this.setAttempedOption(questionId, index)
                    // on option selection post the reponse of active question
                    let [activeQuesId] = this.getActiveQuestion()
                    setTimeout(() => { this.postQuestionResponse(activeQuesId) }, 0)
                  }
                }}
                key={option}
                // role={undefined}
                dense
                button={!isAttempted}
                style={{ ...isAttempted ? correctAnsOptionIndex === String(index) ? correctAnsStyles : attemptedOptionIndex === String(index) ? wrongAnsStyles : {} : {} }}
              >

                <div name='option-wrapper' style={{ display: 'flex', flexWrap: 'nowrap', margin: 10 }}>

                  <span name='index-container' style={{ marginRight: 10 }}>
                    {alphabeticOptions[index]}.&nbsp;
                  </span>

                  <div style={{ marginRight: 10 }}>
                    {attemptedAns === index ? this.getTickIcon(isCorrect) : null}
                    <p />
                  </div>

                  <div name='option-container' style={{ fontWeight: 'normal' }}>
                    {ReactHTMLParser(option)}
                  </div>

                </div>
              </ListItem>
              <Divider variant='fullWidth' component='li' />

            </React.Fragment>
          )
        })}
    </List>
  }

  isMobile = () => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }
  getQuestionContent = () => {
    let [activeQuesId, questionObj] = this.getActiveQuestion()
    this.setStartTimeIfNotExists(activeQuesId)
    let { question: questionText } = questionObj
    let { activeStep } = this.state
    let { currentPage, pageSize } = this.props
    currentPage = Number(currentPage)
    pageSize = Number(pageSize)
    let questionIndex = (activeStep + 1) + ((currentPage - 1) * pageSize)
    return (
      <div name='Container' style={{ border: '0px solid  red', display: 'flex', fontFamily: 'arial', fontWeight: 'bold', fontSize: 15, padding: 30 }}>

        <div name='wrapper' style={{ margin: '0 auto', display: 'flex', flexWrap: 'nowrap', border: '0px solid blue', ...this.isMobile() ? { width: '100%' } : { width: '60vw', minWidth: '60vw' } }}>

          <span name='index-container' style={{ marginRight: 10, border: '0px solid green', flexGrow: 2 }}>
            {questionIndex}.&nbsp;
          </span>

          <div name='question-wrapper' style={{ border: '0px solid green', flexGrow: 98 }}>
            <div name='question-container' style={{ textAlign: 'justify' }}>
              {ReactHTMLParser(questionText)}
            </div>

            <div name='options-wrapper'>
              {this.getOptionList(questionObj)}
            </div>
          </div>

        </div>

      </div>
    )
  }
  renderReportQues = () => {
    let [activeQuesId] = this.getActiveQuestion()
    let { reportQuestion } = this.state
    return reportQuestion ? <ReportQuestion
      questionId={activeQuesId}
      handleClose={() => { this.setState({ reportQuestion: false }) }}
    /> : null
  }
  reportQuesAccessRoles = ['Student']
  render () {
    return (
      <React.Fragment>
        {this.getControlBtns()}
        {this.getQuestionContent()}

        {this.reportQuesAccessRoles.includes(this.userRole)
          ? <div style={{ display: 'flex' }}>
            <Button
              variant='raised'
              size='small'
              onClick={() => {
                this.setState({ reportQuestion: true })
              }}
              startIcon={<AnnouncementIcon color='primary' fontSize='inherit' />}
            >
              Report an issue
            </Button>
          </div> : null
        }
        {this.renderReportQues()}
      </React.Fragment>
    )
  }
}
export default withRouter(withStyles(useStyles)(QuestionModule))
