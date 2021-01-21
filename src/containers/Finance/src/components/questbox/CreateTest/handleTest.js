import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import LinkTag from '@material-ui/core/Link'
import { Button, Collapse } from '@material-ui/core'
// import ReactGA from 'react-ga'
import { apiActions } from '../../../_actions'
import { InternalPageStatus } from '../../../ui'
import { urls } from '../../../urls'
import OnlineTest from '../../Test'
import AssessStatTable from './assessSatisticsTable'
import GA from '../../analytics'

// function testAnalytics (action, testId, testType, category) {
//   console.log('test analytics')
//   if (!action || !testId || !testType) { return }
//   category = category || 'Online test'
//   let label = `id: ${testId}, type: ${testType}`
//   // {
//   //   category: 'Online test',
//   //   action: 'Started || Finished || Aborted || Resumed',
//   //   label: 'id :$$, type -> Practice || Online'
//   // }
//   ReactGA.event({ category, action, label })
// }

class HandleTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dispatchedAction: false,
      noOfAssess: null, // zero indexing
      attemptingAssessNo: 0,
      isReviewingTest: null,
      expandedReview: null,
      expandedStats: null
    }
    this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    window.localStorage.removeItem('reviewTest')
    this.ga = new GA()

    let { match: { params: { user_id: userIdFromViewResultsPage = null } = {} } = {} } = this.props
    this.userIdFromViewResultsPage = userIdFromViewResultsPage
  }

  componentWillMount () {
    let { id } = this.props.match.params
    this.setState({ dispatchedAction: true, testId: id }, e => {
      this.props.getOnlineTest(id, this.userIdFromViewResultsPage)
    })
  }

  handleWindowClose (event) {
    // Cancel the event as stated by the standard.
    event.preventDefault()
    // Chrome requires returnValue to be set.
    // event.returnValue = ''
    let { testStatus, testId, testType } = this.state
    if (testStatus !== 'C') {
      this.ga.testAnalytics('Aborted', testId, testType)
    }
    if (testStatus === 'C') {
      this.clearLS()
    }
  }

  clearLS =() => {
    let lskeys = Object.keys(localStorage)
    for (let i = 0; i < lskeys.length; i++) {
      if (lskeys[i] !== 'user_profile' && lskeys[i] !== 'ruulzIndex' &&
        lskeys[i] !== 'id_token' && lskeys[i] !== 'duration') {
        localStorage.removeItem(lskeys[i])
      }
    }
  }

  componentDidMount () {
    window.addEventListener('beforeunload', e => { this.handleWindowClose(e) })
  }

  componentWillUnmount () {
    // this.clearLS()
    window.removeEventListener('beforeunload', e => { this.handleWindowClose(e) })
  }

  componentWillReceiveProps (props) {
    if (props.testData && this.state.dispatchedAction) {
      let testStatus = props.testData.status
      let testType = props.testData.onlinetest_type
      let noOfAssess = props.testData.assessment.length - 1
      let { attemptingAssessNo: atAsNo } = this.state
      let assessId = props.testData.assessment[atAsNo].id
      this.setState({ dispatchedAction: false, testStatus, assessId, noOfAssess, testType }, this.initializeTest)
    } else if (props.testData === '' && props.isTestDataLoading === false) {
      this.props.alert.error('No test data found')
    } else if (props.testData && props.testData.error) { this.props.alert.error(String(props.testData.error)) }
  }

  initializeTest=(retakeTest) => {
    let { testId, testStatus, testType } = this.state
    let method
    let path = urls.OnlineTestInstance
    let headers = {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      } }
    if (testStatus === 'S') {
      setTimeout(() => this.ga.testAnalytics('Resumed', testId, testType), 0)
    }
    if (testStatus === 'S') {
      method = 'get'
      path += '?onlinetest_id=' + testId
      if (this.userIdFromViewResultsPage) {
        this.props.history.goBack()
        return
      }
    } else if (testStatus === 'C') {
      method = 'get'
      path += '?onlinetest_id=' + testId
      if (this.userIdFromViewResultsPage) {
        path += '&user_id=' + this.userIdFromViewResultsPage
      }
    } else {
      method = 'post'
      headers.headers['Content-Type'] = 'application/json'
      if (this.userIdFromViewResultsPage) {
        this.props.history.goBack()
        return
      }
    }
    let payLoad = JSON.stringify({ 'onlinetest_id': testId, 'Status': 'Started' })
    axios[method](path, method === 'post' ? payLoad : headers, headers)
      .then(res => {
        this.setState({ isTestInitialized: true })
        // debugger // eslint-disable-line
        if (method === 'post') {
          if (res.status === 201) {
            // this.props.alert.success('initailize')
            this.setState({ instanceId: res.data.id })

            let action = retakeTest ? 'Retake' : 'Started'
            setTimeout(() => {
              this.props.getAllTests() // to update test status in viewtests component
              this.ga.testAnalytics(action, testId, testType)
            }, 0)
          } else {
            // this.props.alert.success('initailization failed, re-initializing')
            this.initializeTest()
          }
        } else if (method === 'get' && res.status === 200 && res.data) {
          // this.props.alert.success('captured instance id')
          let instanceId = res.data.onlinetest_instance.id
          let testMaxScore = res.data.online_test_max_score
          let testTotalScore = res.data.online_test_total_score
          this.setState({ instanceId, testMaxScore, testTotalScore, testResultData: res.data })
          this.handleTestResponseInstance(res.data, testStatus)
        }
      })
      .catch(e => {
        console.group('intialize test failed')
        console.log(`Something went wrong in initialize test`, e)
        console.groupEnd()
        this.props.alert.error('Failed to initialize test')
        this.props.history.goBack()
      })
  }
  tempCodeToHandleComprehension=(assessResp, item) => {
    // temp code to handle comprehension
    let choiceHandler = assessResp
    let questionsList = this.props.testData.assessment[item]['question_paper']['quesList']
    let tempChoice = {}
    questionsList.forEach((questionObj, index) => {
      if (questionObj.comprehension_text) {
        let { id: comprehensionId, question_detail: subQuestions = [] } = questionObj
        /*
      {
        compQuestions: {53174: {id: 53174, value: 1, index: 3}}
        id: 659
        isCompType: true
        value: null
      }
        */
        var tempObj = {
          id: comprehensionId,
          isCompType: true,
          value: null,
          compQuestions: {}
        }
        subQuestions.forEach((subQues, subIndex) => {
          let subQuesId = subQues.id
          let usersAns = choiceHandler.filter(item => item.id === subQuesId)
          usersAns = usersAns.length ? usersAns[0].answer : null
          // if (!usersAns) {
          // window.alert('error from comp')
          // }
          tempObj.compQuestions[subQuesId] = { id: subQuesId, index: subIndex, value: usersAns }
        })

        tempChoice[index] = tempObj
      } else {
        let { id: normalQuestionId } = questionObj
        let usersAns = choiceHandler.filter(item => item.id === normalQuestionId)
        usersAns = usersAns.length ? usersAns[0].answer : null
        // if (!usersAns) {
        // window.alert('error from normal')
        // }
        tempObj = { id: normalQuestionId, value: usersAns }
        /*
        id: 6592
        value: 1
        */
        tempChoice[index] = tempObj
      }
    })
    console.log('mk', tempChoice)
    return tempChoice
  }

  handleTestResponseInstance = (resData, testStatus) => {
    let otar = resData.online_test_assessment_response
    let { testData: { assessment = [] } } = this.props
    let noOfAssessFromProps = assessment.length
    if (otar && otar.length) {
      if (testStatus === 'C') {
        let obj = {}
        obj['testId'] = resData.online_test_details.id
        for (let item in otar) {
          var key = 'assessId' + otar[item].assessment
          // obj[key] = otar[item].assessment_response.map(item => ({ id: item.id, value: Number(item.answer) }))
          let assresponce = otar[item].assessment_response
          obj[key] = this.tempCodeToHandleComprehension(assresponce, item)
        }
        localStorage.setItem('reviewTest', JSON.stringify({ ...obj }))
      } else if (testStatus === 'S') {
        let testDtl = resData.online_test_details
        // lSkey = 'roleId/Practice47/Assess29
        var lSKey
        for (let item in otar) {
          lSKey = this.userId + '/' + testDtl.onlinetest_type + testDtl.id + '/Assess' + otar[item].assessment.id
          let choice = otar[item].assessment_response.map(item => ({ id: item.id, value: Number(item.answer) }))
          if (choice.length) { localStorage.setItem(lSKey, JSON.stringify({ choice })) }
          // logic for skipping assessments which are submitted already(which has o_t_a_r)
          if (otar.length <= noOfAssessFromProps) {
            let attemptingAssessNo = otar.length - 1
            let assessId = this.props.testData.assessment[attemptingAssessNo].id
            this.setState(state => ({
              attemptingAssessNo, assessId
            }))
          }
        }
      }
    }
  }

  sendAssessResponse (responseData, isLastAss) {
    let { testId, testType, attemptingAssessNo } = this.state
    let payLoad = { ...responseData }
    if (isLastAss === true) { payLoad['status'] = 'Completed' }
    axios.put(urls.OnlineTestInstance + this.state.instanceId + '/', JSON.stringify(payLoad), {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setNextAssess()
          if (isLastAss) {
            // this.props.alert.success(String(res.data))
            this.handleTestResponseInstance(res.data, 'C')
            let testMaxScore = res.data.online_test_max_score
            let testTotalScore = res.data.online_test_total_score
            this.setState({ testFinish: 'finished', testMaxScore, testTotalScore, testResultData: res.data })
            setTimeout(() => {
              this.props.getAllTests() // to update test status in view test component
              this.ga.testAnalytics('Finished', testId, testType)
            }, 0)
          }
        }
      })
      .catch(e => {
        console.group('send assess Response failed')
        console.log(`Something went wrong in sendAssessResponse`, e)
        console.groupEnd()
        this.props.alert.error(`Failed to submit the assessment ${attemptingAssessNo + 1}`)
      })
  }
  setNextAssess = () => {
    let { assessId, noOfAssess, attemptingAssessNo: atAsNo, isReviewingTest } = this.state
    // noOfAssess -= 1 // - 1 because of zero indexing of attemptingAssessNo
    let isLastAss = (atAsNo === noOfAssess)
    if (isLastAss) {
      console.log('lastAssesment finished')
    } else {
      atAsNo += 1
      assessId = this.props.testData.assessment[atAsNo].id
      this.setState({ attemptingAssessNo: atAsNo, assessId })
    }
    if (isReviewingTest && isLastAss) {
      // for continuous reviewing of answer from 0-1-2-0-1-2
      assessId = this.props.testData.assessment[0].id
      this.setState({ attemptingAssessNo: 0, assessId })
    }
  }
  handlefinishAsses = (responseData) => {
    let { noOfAssess, attemptingAssessNo: atAsNo, isReviewingTest } = this.state
    // noOfAssess -= 1 // - 1 because of zero indexing of attemptingAssessNo
    let isLastAss = (atAsNo === noOfAssess)
    if (isReviewingTest) {
      // if it is reviewing test
      this.setNextAssess()
    } else {
      // test taking
      this.sendAssessResponse(responseData, isLastAss)
    }
  }

  getStatistics = () => {
    let{ testType, testMaxScore, testTotalScore, testResultData } = this.state
    let { testData } = this.props
    if (!testResultData) { return (<InternalPageStatus label={'Fetching test statistics...'} />) }
    let { onlinetest_name: testName } = testData
    let percent = testTotalScore / testMaxScore
    percent = isFinite(percent) ? (percent * 100).toFixed(1) + '%' : null
    return <Fragment>
      <div style={{ width: '100%', minHeight: '60vh', padding: '1%' }}>
        <div>
          <h5 style={{ margin: '0px' }}>
            {this.userIdFromViewResultsPage ? 'Test Name: ' : 'You have completed: '}
            <small><h2 style={{ display: 'inline-block', color: 'purple' }}>{testName}</h2></small>
          </h5>
          <h5 style={{ margin: '0px' }}>Test score:
            <small>
              <h2 style={{ display: 'inline-block', color: 'purple' }}>
                {percent || <small> &nbsp;--&nbsp;&nbsp; <small>(max_marks has no proper data)</small></small>}
              </h2>
            </small>
          </h5>
          <LinkTag
            component='button'
            variant='h6'
            onClick={e => { let val = this.state.expandedStats; this.setState({ expandedStats: !val }) }}
          >
            Click here to view exam stats >
          </LinkTag><br />
          <Collapse in={this.state.expandedStats} timeout='auto' unmountOnExit>
            <AssessStatTable data={testResultData} />
          </Collapse>
          {this.state.testType === 'Practice' ? <Fragment>
            <LinkTag
              component='button'
              variant='h6'
              onClick={e => { let tempVar = this.state.isReviewingTest; this.setState({ isReviewingTest: !tempVar, expandedReview: !tempVar, expandedStats: false }) }}
            >
            Review answers >
            </LinkTag>
            <Collapse in={this.state.expandedReview} timeout='auto' unmountOnExit>
              {this.reviewTest()}
            </Collapse>
          </Fragment> : null}
        </div>
      </div>
      <div>
        <Button variant='contained' color='primary'onClick={this.props.history.goBack}>
            Return
        </Button>
        {
          testType && testType === 'Practice' && !this.userIdFromViewResultsPage
            ? <Button variant='contained' color='default' style={{ marginLeft: '1vw' }} onClick={() => { console.log('retake test'); this.retakeTest() }}>Take test Again
            </Button>
            : null}
      </div>
    </Fragment>
  }

  retakeTest = () => {
    let testData = this.props.testData
    // let { testType, testId } = this.state
    for (let i = 0; i < testData.assessment.length; i++) {
      let assessmentData = testData.assessment[i]
      // lSkey = 'userId/Practice47/Assess29
      let lSKey = this.userId + '/' + testData.onlinetest_type + testData.id + '/Assess' + assessmentData.id
      // console.log('removed key from ls-------------------', lSKey)
      localStorage.removeItem(lSKey)
    }
    let assessId = testData.assessment[0].id
    this.setState({ testStatus: 'NS', testFinish: null, attemptingAssessNo: 0, assessId, isReviewingTest: null }, e => this.initializeTest(true))
  }

  reviewTest = () => {
    let { testId, assessId, noOfAssess, attemptingAssessNo, onlinetest_type: testType, isReviewingTest, testResultData } = this.state
    let isLastAsm, isFirstAsm
    isFirstAsm = attemptingAssessNo === 0
    isLastAsm = (attemptingAssessNo === noOfAssess)
    let { testData } = this.props
    let tempArr = []
    for (let i = 0; i <= noOfAssess; i++) {
      tempArr.push(i)
    }
    let otar = testResultData.online_test_assessment_response.filter(item => item.assessment === assessId)[0]
    let assessScore = otar.assessment_score
    let assessMaxScore = otar.assessment_max_score
    return (tempArr.map((item, index) => {
      if (index === attemptingAssessNo) {
        return <div style={{ minHeight: '70vh', marginTop: '10px' }}>
          <Button
            variant='outlined'
            style={{ float: 'left' }}
            disabled={isFirstAsm}
            onClick={e => this.handleNextPrev(-1)}
          >
            Previous Assessment
          </Button>
          <Button
            variant='outlined'
            style={{ float: 'right' }}
            disabled={isLastAsm}
            onClick={e => this.handleNextPrev(1)}
          >
            Next Assessment
          </Button>
          <OnlineTest
            assessScore={assessScore}
            assessMaxScore={assessMaxScore}
            isReviewingTest={isReviewingTest}
            testId={testId}
            assessId={assessId}
            noOfAssess={noOfAssess + 1}
            attemptingAssessNo={attemptingAssessNo}
            testData={testData}
            alert={this.props.alert}
            onFinishAssess={this.handlefinishAsses}
            testType={testType}
          />
        </div>
      }
    }))
  }

  handleNextPrev = (handlerVal) => {
    let { attemptingAssessNo: atAsNo, isReviewingTest, noOfAssess } = this.state
    if (isReviewingTest) {
      atAsNo = atAsNo + handlerVal
      if (atAsNo >= 0 && atAsNo <= noOfAssess) {
        let assessId = this.props.testData.assessment[atAsNo].id
        this.setState({ attemptingAssessNo: atAsNo, assessId })
      }
    }
  }

  render () {
    let { isTestInitialized, testStatus, testId, assessId, noOfAssess, attemptingAssessNo, onlinetest_type: testType, testFinish, isReviewingTest } = this.state
    let { testData } = this.props
    let tempArr = []
    for (let i = 0; i <= noOfAssess; i++) {
      tempArr.push(i)
    }
    if (!testData) {
      return (
        <InternalPageStatus label={'Loading test...'} />
      )
    }
    if (!isTestInitialized) {
      let label = testStatus === 'NS' ? 'Initializing test...' : (testStatus === 'S' ? 'Fetching test response...' : 'Fetching test statistics...')
      return (
        <InternalPageStatus label={label} />
      )
    }
    return (testData && tempArr.length
      ? <Fragment>
        {testStatus === 'C' || testFinish === 'finished'
          ? this.getStatistics()
          : tempArr.map((item, index) => {
            if (index === attemptingAssessNo) {
              return <OnlineTest
                isReviewingTest={isReviewingTest}
                testId={testId} assessId={assessId}
                noOfAssess={noOfAssess + 1}
                attemptingAssessNo={attemptingAssessNo}
                testData={testData}
                alert={this.props.alert}
                onFinishAssess={this.handlefinishAsses}
                testType={testType}
              />
            }
          })}
      </Fragment>
      : <InternalPageStatus label={'Error while rendering test please try again later...'} loader={false} />)
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  testData: state.onlineTest.items,
  isTestDataLoading: state.onlineTest.loading
})

const mapDispatchToProps = dispatch => ({
  getAllTests: () => dispatch(apiActions.listTests()),
  getOnlineTest: (testId, userId) => dispatch(apiActions.getOnlineTest(testId, userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HandleTest))
