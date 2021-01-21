import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import axios from 'axios'
// import { withStyles } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import { InternalPageStatus } from '../../../../ui'
import QuestionViewModule from './questionViewModule'
import { urls } from '../../../../urls'
import { postQuesReponseTrigger } from '../utilities'

// const useStyles = theme => ({
//   appBar: {
//     position: 'relative',
//     backgroundColor: 'transparent'
//   },
//   title: {
//     color: 'black',
//     marginLeft: theme.spacing(2),
//     flex: 1
//   }
// })
class QuestionHandler extends Component {
  constructor (props) {
    super(props)

    // let { page = 1, size = 1 } = this.getSearchParams()
    const { page = 1, size = 100000000 } = {}
    this.state = { pageSize: size, pageNumber: page, questionType: 1 }
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + props.authToken } }
    this.decideScoreAndBonus = this.decideScoreAndBonus.bind(this)
  }
  reportQuestion = (questionId = this.throwErr()) => {
    // if (questionId) return
    // Auto question report when questions having invalid json fomat
    let { fetchHeaders } = this
    const formData = new FormData()
    formData.append('question_id', questionId)
    formData.append('new_report_type', `Message: This question (id: ${questionId}) has improper JSON format which resulting in code breakage of practice question\nReported by: Error handler module\nResolve: navigate to edit question page and submit question`)
    axios.post(urls.ReportQuestion + '?online_class_id=id from props', formData, fetchHeaders)
      .then(() => {
        this.fetchQuestions()
      })
  }
  getSearchParams = () => {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
  handlePagination = (pageNumber = this.throwErr()) => {
    this.setState({ pageNumber }, () => {
      this.fetchQuestions()
    })
  }
  decideScoreAndBonus (questionId, payLoad) {
    let { questionsMap = new Map() } = this.state
    /*
      Sort bonusConfigArray by duration in ascending order
      from:[
        {duration: 5, timing_score: 150},
        {duration: 15, timing_score: 50},
        {duration: 10, timing_score: 100}
      ]
      To:[
        {duration: 5, timing_score: 150},
        {duration: 10, timing_score: 100},
        {duration: 15, timing_score: 50}
      ]
    */
    let { score_schema: {
      question_score: questionScore = 0,
      timing_configuration: bonusConfigArray = []
    } = {} } = questionsMap.get(questionId) || {}

    const sortedBonusConfAr = bonusConfigArray.map(item => ({ ...item, duration: Number(item.duration) }))
      .filter(item => !isNaN(item.duration))
      .sort((a, b) => (a.duration - b.duration))

    payLoad = { ...payLoad, duration: payLoad.end_time - payLoad.start_time }
    let { correct: isAttemptedCorrect, duration: timeTakenToAttempt } = payLoad
    let scoreObj
    if (isAttemptedCorrect) {
      let bonusScore = 0
      let bonusScoreObj = {}
      let bonusAchieved = sortedBonusConfAr.some(item => {
        let { duration, timing_score: timingScore } = item
        timingScore = isNaN(Number(timingScore)) ? 0 : Number(timingScore)
        if (timeTakenToAttempt <= duration) {
          bonusScore = timingScore
          bonusScoreObj = item
          return true
        }
      })
      scoreObj = {
        score: questionScore + bonusScore,
        bonus_achieved: bonusAchieved,
        bonus_score_obj: bonusScoreObj
      }
      /* Setting score to state ie. to update to quiz tobar with animation effect */
      this.setState({ score: questionScore + bonusScore })
    } else {
      scoreObj = { score: 0, bonus_achieved: false }
    }
    return { ...payLoad, ...scoreObj }
  }
  postQuesReponse = (questionId, payLoad) => {
    const payLoadWithScore = this.decideScoreAndBonus(questionId, payLoad)
    console.log({ ...payLoadWithScore }, 'mk')
    if (payLoadWithScore) {
      postQuesReponseTrigger(this.props.websocket, payLoadWithScore)
    } else {
      window.alert(`Payload is being false of qid ${questionId}, alert in development mode`)
    }
  }
  handleFinish =() => {
    window.alert('All questions in are attempted')
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
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')
  convertJSONObjToObj = (jsonStr = this.throwErr(), questionId) => {
    let recurConvert = (jsonStr) => {
      let parsedStr
      try {
        parsedStr = JSON.parse(jsonStr)
      } catch (e) {
        this.reportQuestion(questionId)
        throw new Error(`Question (id:${questionId}) has improper json format`)
      }
      if (typeof (parsedStr) === 'string') {
        return recurConvert(parsedStr)
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
  fetchQuestions = () => {
    let { GetQuizQuestionsWithResponses: getQuesWithResUrl } = urls
    let { pageSize } = this.state
    let { onlineClassId } = this.props
    let params = [
      ['online_class_id', onlineClassId]
    ]
    let query = this.createQuery(params)
    let pathWithQuery = getQuesWithResUrl + '?' + query
    let { fetchHeaders } = this
    this.setState({ isFetching: true, isFetchFailed: false })
    axios
      .get(pathWithQuery, fetchHeaders)
      .then(response => {
        if (response.status === 200) {
          let { data: { result = {} } = {} } = response
          result['current_page'] = '1'
          result['total_page_count'] = '1'
          result['page_size'] = pageSize
          let camelCasedResult = camelcaseKeys(result)
          let { data: questionsArr, ...extraData } = camelCasedResult
          questionsArr = questionsArr.map((item, index) => {
            let { option } = item
            let optionsArray = this.covertOptionObjToArr(option, item.id)
            return { ...item, optionsArray }
          })
          let questionsMap = this.convertArrayToMap(questionsArr, 'id')
          this.setState({ questionsMap, questionData: { ...extraData }, isFetching: false, isFetchFailed: false })
          // this.props.history.push(`?open=true&size=${pageSize}&page=${pageNumber}`)
        } else {
          this.setState({ isFetching: false, isFetchFailed: true })
        }
      })
      .catch(er => {
        // let { message = '' } = er || {}
        // if (message.includes('has improper json format')) {
        //   this.setState({ errorMessage: 'Following questions has issue and will be rectified, please attempt it later' })
        // }
        this.setState({ isFetching: false, isFetchFailed: true })
      })
  }
  componentWillMount () {
    this.fetchQuestions()
  }
  getFetchStatus = () => {
    let { isFetching, isFetchFailed, questionsMap } = this.state
    let mapHasQuestions = (questionsMap && questionsMap.size)
    let canRenderQuestions
    if (isFetching) {
      canRenderQuestions = false
      return [canRenderQuestions, <InternalPageStatus label='loading..' />]
    }
    if (!isFetching && isFetchFailed) {
      canRenderQuestions = false
      return [canRenderQuestions, <InternalPageStatus
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
      />]
    }
    if (!mapHasQuestions) {
      canRenderQuestions = false
      return [canRenderQuestions, <InternalPageStatus label='No Questions' loader={false} />]
    }
    if (!isFetching && !isFetchFailed && mapHasQuestions) {
      canRenderQuestions = true
      return [canRenderQuestions, <p>This is not going to get rendered</p>]
    }
  }
  componentWillUpdate (nextProps, nextState) {
    const paramTobeSent = ['isFetchFailed', 'isFetching', 'questionData', 'score']
    const updated = paramTobeSent.some((paramKey) => nextState[paramKey] !== this.state[paramKey])
    // eslint-disable-next-line no-debugger
    // debugger
    if (updated) {
      this.props.updateStateToParent(nextState)
    }
  }
  renderQuestions = () => {
    let [canRenderQuestions, fetchStatus] = this.getFetchStatus()
    if (!canRenderQuestions) return <div className='fetched__status--container'>{fetchStatus}</div>
    if (canRenderQuestions) {
      let { questionsMap = new Map(), questionData } = this.state
      let propsToChild = {
        ...questionData,
        questionsMap,
        handleFinish: this.handleFinish,
        postQuestionResponse: this.postQuesReponse,
        handlePagination: this.handlePagination,
        updateStateToParent: this.props.updateStateToParent,
        onlineClassId: this.props.onlineClassId,
        bgms: this.props.bgms
      }
      const wbData = {}
      Object.keys(this.props).filter(key => key.includes('wb_')).forEach(keyName => {
        wbData[keyName] = this.props[keyName]
      })

      return <QuestionViewModule key={'question-handler'} {...propsToChild}{...wbData} isMuted={this.props.isMuted} />
    }
  }
  render () {
    return <React.Fragment>
      {this.renderQuestions()}
      {/* <button style={{ background: 'none' }} onClick={this.fetchQuestions} >Fetch Questions</button> */}
    </React.Fragment>
  }
}
const mapStateToProps = state => ({
  authToken: state.authentication.user
})
// export default connect(mapStateToProps)(withRouter(withStyles(useStyles)(QuestionHandler)))
export default connect(mapStateToProps)(withRouter(QuestionHandler))
