import React, { Component } from 'react'
import { CardContent } from '@material-ui/core'

class Finish extends Component {
  renderUI = () => {
    let{ testType, attemptingAssessNo, totalAssessments } = this.props
    console.log(testType, attemptingAssessNo, totalAssessments)
    if (attemptingAssessNo === (totalAssessments - 1)) {
      return <div style={{ display: 'flex', minHeight: '40vh' }}><h4 style={{ margin: 'auto' }}>You have successfully completed the test.<br />Test statistics loading please wait</h4></div>
    } else {
      return (<div style={{ display: 'flex', minHeight: '40vh' }}>
        <div style={{ margin: 'auto' }}>
          <h4>You have successfully completed the assessment&nbsp;{ attemptingAssessNo + 1}</h4>
          <h6>Next assessment starts in few seconds</h6>
        </div>
      </div >)
    }
  }
  render () {
    let{ testType, attemtingAssessNo, totalAssessments } = this.props
    console.log(testType, attemtingAssessNo, totalAssessments)
    return (<CardContent>{ this.renderUI()}</CardContent>)
  }
}

export default Finish
