import React, { Component } from 'react'
// import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Entry from './entry'
import TestModule from './testModule'
import Finish from './finish'
import { apiActions } from '../../_actions'

class OnlineTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      test: 'not_started',
      loaded: false,
      attemptedDetails: [],
      dispatchedAction: false
    }
    this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    this.onStart = this.onStart.bind(this)
    this.onFinish = this.onFinish.bind(this)
    this.getQuestionPaper = this.getQuestionPaper.bind(this)
  }

  componentDidMount () {
    this.getQuestionPaper()
  }

  getQuestionPaper () {
    let { assessId, testId, testData } = this.props
    if (testData) {
      // this.props.alert.success('has redux data')
      var assessmentData = testData.assessment.filter(item => item.id === assessId)[0]
      // lSkey = 'roleId/Practice47/Assess29
      var lSKey = this.userId + '/' + testData.onlinetest_type + testData.id + '/Assess' + assessmentData.id
      var testType = testData.onlinetest_type
      console.log(assessmentData, 'assessment', assessId)
    } else {
      // this.props.alert.error('dispatching action')
      this.setState({ dispatchedAction: true })
      this.props.getOnlineTest(testId)
      return
    }
    // Filtering other than MCQ type and Comprehension type Questions from Queslist
    assessmentData.question_paper.quesList = assessmentData.question_paper.quesList.filter((item) => {
      if (item.comprehension_text || (item.question_type && item.question_type === 'MCQ')) {
        return true
      }
    })
    this.setState({
      ...assessmentData,
      questions: assessmentData.question_paper.quesList,
      name: assessmentData.name_assessment,
      type: assessmentData.assessment_type,
      loaded: true,
      lSKey,
      testType
    })
  }

  onStart () {
    this.setState({ test: 'started' })
  }

  onFinish (choice) {
    // let { attemptingAssessNo, noOfAssess, isReviewingTest } = this.props
    let { lSKey } = this.state
    let responseData = {
      assessment_id: this.props.assessId,
      ResponseJSON: Object.keys(choice).map(item => ({ id: choice[item].id, answer: choice[item].value }))
    }
    this.setState({ test: 'finished' })
    // let countDown = attemptingAssessNo === (noOfAssess - 1) || isReviewingTest === true ? 0 : 2000 // if last assess count down = 0
    // setTimeout(() => { localStorage.removeItem(lSKey); this.props.onFinishAssess(responseData) }, countDown)
    localStorage.removeItem(lSKey)
    this.props.onFinishAssess(responseData)
    localStorage.removeItem('duration')
  }

  render () {
    let { test, questions, loaded, duration, name, instruction, description, lSKey,
      testType } = this.state
    let { assessScore, assessMaxScore } = this.props
    if (test === 'not_started') {
      return <Entry
        onStart={this.onStart}
        loaded={loaded}
        attemptingAssessNo={this.props.attemptingAssessNo}
        totalAssessments={this.props.noOfAssess}
        testMetaData={{ name, duration, description, instruction, addedDate: '2018-12-28 11:28:30.294424' }}
        isReviewingTest={this.props.isReviewingTest}
        assessScore={assessScore}
        assessMaxScore={assessMaxScore}
      />
    } else if (test === 'started') {
      return <TestModule
        onFinish={this.onFinish}
        testType={testType}
        questions={questions}
        duration={duration}
        lSKey={lSKey}
        skipTest={this.props.onFinish}
        alert={this.props.alert}
        isReviewingTest={this.props.isReviewingTest}
        assessId={this.props.assessId}
      />
    } else if (test === 'finished') {
      return <Finish
        testType={testType}
        attemptingAssessNo={this.props.attemptingAssessNo}
        totalAssessments={this.props.noOfAssess}
        isReviewingTest={this.props.isReviewingTest}
      />
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  testData: state.onlineTest.items
})

const mapDispatchToProps = dispatch => ({
  getOnlineTest: testId => dispatch(apiActions.getOnlineTest(testId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnlineTest))
