import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import EditQues from './editQues'
import EditCompQues from './editCompQues'

class QuestionEdit extends Component {
  render () {
    return (
      <React.Fragment>
        {this.props.match.params.type === 'comp' ? <EditCompQues alert={this.props.alert} /> : <EditQues alert={this.props.alert} />}
      </React.Fragment>

    )
  }
}
export default withRouter(QuestionEdit)
