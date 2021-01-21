import React, { Component } from 'react'
import { CardContent, CardHeader, Button, Divider, CardActions } from '@material-ui/core'

class EntryPage extends Component {
  ui = () => {
    let { testMetaData, attemptingAssessNo, totalAssessments, isReviewingTest, assessScore,
      assessMaxScore } = this.props
    // let temp = testMetaData.duration.split(':')

    // Time calculations for days, hours, minutes and seconds
    let seconds = testMetaData.duration
    seconds = parseInt(seconds, 10)
    var days = Math.floor(seconds / (3600 * 24))
    seconds -= days * 3600 * 24
    var hrs = Math.floor(seconds / 3600)
    seconds -= hrs * 3600
    var mnts = Math.floor(seconds / 60)
    seconds -= mnts * 60
    let duration = testMetaData.duration ? days + 'd ' + hrs + 'h ' + mnts + 'm ' + seconds + 's ' : ' --- '
    if (isReviewingTest === true) {
      return (
        <React.Fragment>
          <CardHeader
            title={testMetaData.name}
            subheader={<b>Assessment :
              {` ${attemptingAssessNo + 1} of ${totalAssessments}`}
            </b>}
            action={<h4>{`Score : ${assessScore}/${assessMaxScore || '--'}`}</h4>}
          />
          <Divider />
          <CardActions>
            <Button variant='contained' onClick={this.props.onStart}>
              Review Questions
            </Button>
          </CardActions></React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <CardHeader
            title={testMetaData.name}
            subheader={new Date(testMetaData.addedDate).toDateString()}
            // action={
            //   <h4>{`${temp[0] ? temp[0] : '0'}:h ${temp[1] ? temp[1] : '0'}:m ${temp[2] ? temp[2] : '0'}:s`}</h4>
            // }
            action={<h4>Duration: {duration}</h4>}
          />
          <Divider />
          <CardContent>
            <b>Instructions :</b>
            {testMetaData.instruction}
            <br />
            <b>Assessment :
              {` ${attemptingAssessNo + 1} of ${totalAssessments}`}
            </b>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              variant='contained'
              color='secondary'
              disabled={!this.props.loaded}
              onClick={this.props.onStart}
            >
              Start Test
            </Button>
          </CardActions></React.Fragment>
      )
    }
  }
  render () {
    return this.ui()
  }
}

export default EntryPage
