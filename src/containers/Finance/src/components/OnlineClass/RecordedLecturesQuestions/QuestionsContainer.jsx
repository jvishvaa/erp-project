import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import { urls } from '../../../urls'
import QuestionList from './QuestionsList'

class QuestionsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      questionsMap: new Map()
    }
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + props.authToken } }
    this.delayedCallback = _.debounce((callBack = () => {}) => {
      callBack()
    }, 3000)
  }
  throwErr = (message) => {
    message = message || 'Error: maditory param'
    window.alert(message)
    throw new Error(message)
  }
  convertJSONObjToObj = (jsonStr = this.throwErr(), questionId) => {
    let recurConvert = (jsonStr) => {
      let parsedStr
      try {
        parsedStr = JSON.parse(jsonStr)
      } catch (e) {
        // this.reportQuestion(questionId)
        throw new Error(`Question (id:${questionId}) has improper json format`)
      }
      if (typeof (parsedStr) === 'string') {
        recurConvert(parsedStr)
      } else {
        return parsedStr
      }
    }
    let jsObj = recurConvert(jsonStr)
    return jsObj
  }
  covertOptionObjToArr = (optionJson, questionId) => {
    let optionObj = this.convertJSONObjToObj(optionJson, questionId)
    return [...Object.values(optionObj)]
  }
  getCorrectAnsOptionIndex = (optionsArray, correctAnsjson) => {
    let correctAnsObj = this.convertJSONObjToObj(correctAnsjson)
    let correctAns = Object.keys(correctAnsObj).length ? Object.values(correctAnsObj)[0] : null
    return optionsArray.indexOf(correctAns)
  }
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')
  fetchQuestions = (onResolve = () => {}, onReject = () => {}) => {
    let { RecordedLetureQuestionPaper } = urls
    let { lmsId } = this.props
    let params = [
      ['lms_video_id', lmsId]
    ]
    let query = this.createQuery(params)
    let pathWithQuery = RecordedLetureQuestionPaper + '?' + query
    let { fetchHeaders } = this
    this.setState({ isFetching: true, isFetchFailed: false })
    axios
      .get(pathWithQuery, fetchHeaders)
      .then(response => {
        if (response.status === 200) {
          let { data: result = {} } = response
          let {
            data: {
              question_details: questionsArr = [],
              lms_vrl_details_user: lmsVrlDetailsUser,
              question_count: questionsCount
            } = {},
            status: {
              success,
              message
            }
          } = result
          console.log(success, message)

          this.handleVideoMetaParams(lmsVrlDetailsUser)

          questionsArr = questionsArr.map((item, index) => {
            let { option } = item
            let optionsArray = this.covertOptionObjToArr(option, item.id)
            let correctAnsOptionIndex = String(this.getCorrectAnsOptionIndex(optionsArray, item.correct_ans))
            return {
              ...item,
              optionsArray,
              correct_ans_option_index: correctAnsOptionIndex,
              timestamp: String(item.time_stamp) }
          })
          let questionsMap = this.convertObjectToMap(questionsArr)
          this.setState({ questionsMap, lmsVrlDetailsUser, questionsCount })
          this.setState({ isFetching: false, isFetchFailed: false })
          onResolve()
        } else {
          this.setState({ isFetching: false, isFetchFailed: true })
        }
      })
      .catch(er => {
        this.setState({ isFetching: false, isFetchFailed: true })
        onReject()
      })
  }
  handleVideoMetaParams = (lmsVrlDetailsUser) => {
    if (!lmsVrlDetailsUser) {
      setTimeout(() => {
        this.postVideoAsStarted()
      })
    }
    if (lmsVrlDetailsUser) {
      let { last_view_position_seconds: lastViewPositionSeconds } = lmsVrlDetailsUser || {}
      const isValidNumber = !isNaN(Number(lastViewPositionSeconds))
      const isFiniteNumber = isFinite(Number(lastViewPositionSeconds))
      if (isFiniteNumber && isValidNumber) {
        this.props.setThePlaybackPosition(lastViewPositionSeconds)
      }
    }
  }
  postIsCompleted = (seconds) => {
    let { lmsId } = this.props
    let payLoad = {
      'lms_video_id': lmsId,
      'is_completed': true
    }
    this.updateData(payLoad)
  }
  postIsReset = (seconds) => {
    let { lmsId } = this.props
    let payLoad = {
      'lms_video_id': lmsId,
      'is_reset': true
    }

    const onResovle = () => {
      const callBack = () => this.props.resume()
      this.fetchQuestions(callBack)
    }
    this.updateData(payLoad, onResovle)
  }
  postLastViewPosition = (seconds) => {
    let { lmsId } = this.props
    let payLoad = {
      'lms_video_id': lmsId,
      'last_view_position_seconds': seconds
    }
    this.updateData(payLoad)
  }
  postQuestionResponse = (responseObj) => {
    let { lmsId } = this.props
    let payLoad = {
      'lms_video_id': lmsId,
      'response': responseObj
    }
    this.updateData(payLoad)
  }
  updateData = (payLoad, onResovle = () => {}, onReject = () => {}) => {
    // Put method
    let { RecordedLeture } = urls
    // let { lmsId } = this.props
    let pathWithQuery = RecordedLeture
    let { fetchHeaders } = this
    this.setState({ isResPosting: true, isResPostFailed: false })
    axios
      .put(pathWithQuery, payLoad, fetchHeaders)
      .then(response => {
        onResovle(response)
      })
      .catch(err => {
        console.log(err)
        onReject(err)
        this.setState({ isResPosting: false, isResPostFailed: true })
      })
  }
  postVideoAsStarted = () => {
    let { RecordedLeture } = urls
    let { lmsId } = this.props
    let pathWithQuery = RecordedLeture
    let { fetchHeaders } = this
    this.setState({ isPosting: true, isPostFailed: false })
    let payLoad = {
      'lms_video_id': lmsId,
      'is_started': true
    }
    // payLoad = JSON.stringify(payLoad)
    axios
      .post(pathWithQuery, payLoad, fetchHeaders)
      .then(response => { })
      .catch(err => {
        console.log(err)
        this.setState({ isPosting: false, isPostFailed: true })
      })
  }
  componentWillReceiveProps (nextProps) {
    let { playerState: {
      isEnded: isEndedPrev,
      playbackPosition: playbackPositionPrev
    }
    } = this.props || {}
    let { playerState: {
      isEnded: isEndedPresent,
      playbackPosition: playbackPositionPresent
    } } = nextProps || {}
    if (isEndedPrev !== isEndedPresent && isEndedPresent === true) {
      this.postIsCompleted()
    }
    if (playbackPositionPrev !== playbackPositionPresent) {
      // Apply debounce here
      // this.postLastViewPosition(playbackPositionPresent)
      this.delayedCallback(() => {
        this.postLastViewPosition(playbackPositionPresent)
      })
    }
  }
  componentWillMount () {
    this.fetchQuestions()
  }

   convertObjectToMap = (questionsList) => {
     const quesMap = new Map()
     questionsList.forEach(question => {
       if (quesMap.has(question.timestamp)) {
         const questions = quesMap.get(question.timestamp)
         quesMap.set(question.timestamp, [...questions, question])
       } else {
         quesMap.set(question.timestamp, [question])
       }
     })
     return quesMap
     //  this.setState({ questionsMap: quesMap })
   }

  submitResponse = () => {

  }
  checkWhetherAttemptedAndResume = (timeStamp, resumeVideo = false) => {
    const hasQuestions = this.state.questionsMap.has(timeStamp)
    const questionsArray = hasQuestions ? (this.state.questionsMap.get(timeStamp) || []) : []
    const isAttempted = (questionObj) => questionObj.response && questionObj.response.attempted_ans !== undefined
    const isAllQuesAttempted = questionsArray.every(isAttempted)
    if (isAllQuesAttempted && resumeVideo) {
      // show options for some duration and resum video
      // setTimeout(() => {
      //   this.props.resume()
      // }, 1000)
      setTimeout(
        () => {
          this.updateQuestionsAsViewed(
            this.props.timeStamp,
            () => this.props.resume()
          )
        },
        1000
      )
    }
    return isAllQuesAttempted
  }
  resetAllQuesIsViewedInfo = () => {
    const { questionsMap = new Map() } = this.state
    const questionsArr = [...questionsMap.values()].flat().map(item => ({ ...item, is_question_viewed: undefined }))
    let questionsMapResetData = this.convertObjectToMap(questionsArr)
    this.setState({ questionsMap: questionsMapResetData })
  }
    updateQuestionsAsViewed = (timestamp, callBack = () => {}) => {
      const { questionsMap } = this.state
      const questionList = questionsMap.get(timestamp)
      const isAllViewed = questionList.every(questionObj => questionObj.is_question_viewed)
      const isAllNotViewed = !isAllViewed

      if (isAllNotViewed) {
        const updatedQuestion = questionList.map((question, index) => {
          // if (questionIndex === index) {
          const updatedObject = { ...question, is_question_viewed: true }
          return updatedObject
          // }
          // return question
        })

        const questionMapCopy = this.state.questionsMap
        questionMapCopy.set(timestamp, updatedQuestion)
        this.setState({ questionsMap: questionMapCopy }, () => {
          callBack()
        })
      }
      return isAllViewed
    }

  updateResponse = (timestamp, answerIndex, questionIndex) => {
    const { questionsMap } = this.state
    const questionList = questionsMap.get(timestamp)
    const updatedQuestion = questionList.map((question, index) => {
      if (questionIndex === index) {
        const responseObj = {
          id: question.id,
          attempted_ans: answerIndex,
          correct: String(question.correct_ans_option_index) === String(answerIndex)
        }
        const updatedObject = { ...question, response: responseObj }
        setTimeout(() => { this.postQuestionResponse(responseObj) })
        return updatedObject
      }
      return question
    })

    const questionMapCopy = this.state.questionsMap
    questionMapCopy.set(timestamp, updatedQuestion)
    this.setState({ questionsMap: questionMapCopy })
    this.checkWhetherAttemptedAndResume(timestamp, true)
  }

  render () {
    const { questionsMap, isFetching } = this.state
    if (isFetching) {
      return <div style={{ ...this.props.__style, display: 'flex' }}>
        <h4 style={{ margin: 'auto' }}>Questions are loading..</h4>
      </div>
    }
    return (
      <QuestionList
        updateResponse={this.updateResponse}
        questionsMap={questionsMap}
        timeStamp={this.props.playbackPosition}
        pause={this.props.pause}
        __style={this.props.__style}
        resume={this.props.resume}
        playerState={this.props.playerState}
        postIsReset={this.postIsReset}
        checkWhetherAttempted={(timeStamp) => {
          // check whther all questions attempted in particular time stamp
          return this.checkWhetherAttemptedAndResume(timeStamp, false)
        }}
        updateQuestionsAsViewed={this.updateQuestionsAsViewed}
        resetAllQuesIsViewedInfo={this.resetAllQuesIsViewedInfo}
        handleClose={this.props.handleClose}
      />)
  }
}
const mapStateToProps = state => ({
  authToken: state.authentication.user
})
export default connect(mapStateToProps)(QuestionsContainer)
