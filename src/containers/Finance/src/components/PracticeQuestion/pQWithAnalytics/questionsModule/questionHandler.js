import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import axios from 'axios'
import { withStyles, Button } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import LinkTag from '@material-ui/core/Link'
import { InternalPageStatus } from '../../../../ui'
import QuestionViewModule from './questionViewModule'
import { urls } from '../../../../urls'

const useStyles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'transparent'
  },
  title: {
    color: 'black',
    marginLeft: theme.spacing(2),
    flex: 1
  }
})
class QuestionHandler extends Component {
  constructor (props) {
    super(props)

    let { page = 1, size = 1 } = this.getSearchParams()
    this.state = { pageSize: size, pageNumber: page, questionType: 1 }
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + props.authToken } }
  }
  reportQuestion = (questionId = this.throwErr()) => {
    // if (questionId) return
    // Auto question report when questions having invalid json fomat
    let { fetchHeaders } = this
    const formData = new FormData()
    formData.append('question_id', questionId)
    formData.append('new_report_type', `Message: This question (id: ${questionId}) has improper JSON format which resulting in code breakage of practice question\nReported by: Error handler module\nResolve: navigate to edit question page and submit question`)
    axios.post(urls.ReportQuestion, formData, fetchHeaders)
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
  postQuesReponse = (questionId, payLoad) => {
    let { subjectId, chapterId } = this.props
    let { PracticeQuestionResponse } = urls
    let apiUrl = PracticeQuestionResponse
    let { fetchHeaders } = this
    let params = [
      ['subject', subjectId],
      ['chapter_id', chapterId]]
    let query = this.createQuery(params)
    let pathWithQuery = apiUrl + '?' + query
    payLoad = {
      ...payLoad,
      duration: payLoad.end_time - payLoad.start_time,
      chapter_id: chapterId
    }
    axios
      .post(pathWithQuery, payLoad, fetchHeaders)
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
  fetchQuestions = () => {
    // to bhushan
    //   1. make sub and chap ids manditory params
    //   2. make level param as list of vals support
    //   3. make is_approved defaulty true (do not expect from param)
    //   4. return page_size value in response
    //   5. if no pagesize param , set it to 10
    //   6. give only ques which are having 'is_comprehension', false and is_approved true
    //   7. provide param to select question.option in array (list) or object (dictionary)
    //   8. make sure question.option dictionary is stringified once
    //   9. make pageSize, pageNumber, all number related values must type of number only
    let { GetPracticeQuestionsWithResponses: getQuesWithResUrl } = urls
    let { pageSize, pageNumber, questionType } = this.state
    let { subjectId, chapterId, qLevelId } = this.props
    let params = [
      ['subject', subjectId],
      ['chapter', chapterId],
      // ['level', [1, 2, 3]],
      ['level', qLevelId],
      ['question_type', questionType],
      ['pagesize', pageSize],
      ['pagenumber', pageNumber]
    ]
    let query = this.createQuery(params)
    let pathWithQuery = getQuesWithResUrl + '?' + query
    let { fetchHeaders } = this
    this.setState({ isFetching: true, isFetchFailed: false })
    axios
      .get(pathWithQuery, fetchHeaders)
      .then(response => {
        if (response.status === 200) {
          // let { data: { result = {} } = {} } = response
          let { data: { result = '' } = {} } = response
          // result = JSON.parse(window.atob(result)) || {}
          let camelCasedResult = camelcaseKeys(result)
          let { data: questionsArr, ...extraData } = camelCasedResult
          questionsArr = questionsArr.map((item, index) => {
            let { option } = item
            let optionsArray = this.covertOptionObjToArr(option, item.id)
            return { ...item, optionsArray }
          })
          let questionsMap = this.convertArrayToMap(questionsArr, 'id')
          this.setState({ questionsMap, questionData: { ...extraData }, isFetching: false, isFetchFailed: false })
          this.props.history.push(`?open=true&size=${pageSize}&page=${pageNumber}`)
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

  renderQuestions = () => {
    let [canRenderQuestions, fetchStatus] = this.getFetchStatus()
    if (!canRenderQuestions) return fetchStatus
    if (canRenderQuestions) {
      let { questionsMap = new Map(), questionData } = this.state
      let propsToChild = {
        ...questionData,
        questionsMap,
        handleFinish: this.props.handleFinish,
        postQuestionResponse: this.postQuesReponse,
        handlePagination: this.handlePagination
      }
      // eslint-disable-next-line no-debugger
      debugger
      return <QuestionViewModule {...propsToChild} />
    }
  }
  render () {
    let { classes } = this.props
    let { questionData: { questionCount } = {} } = this.state
    // let questionIndex = 1
    return <React.Fragment>
      <AppBar className={classes.appBar}>
        {true && <Toolbar>
          <IconButton edge='start' color='primary' onClick={this.props.handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          {questionCount ? <h5 className={classes.title}>
            Total Questions: &nbsp;{questionCount}
          </h5> : null}
          <Button autoFocus color='primary' variant='outlined' onClick={this.props.handleClose}>
            save
          </Button>
        </Toolbar>}
      </AppBar>
      <div style={{ margin: 10 }} />
      {this.renderQuestions()}
    </React.Fragment>
  }
}
const mapStateToProps = state => ({
  authToken: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(withStyles(useStyles)(QuestionHandler)))
