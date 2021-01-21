import React, { Component
  //  Fragment
} from 'react'
import Button from '@material-ui/core/Button'
import ViewTestsWithFilter from './viewTestsWithFilter'
import ViewTests from './viewTests'

class ViewTestsHome extends Component {
  constructor () {
    super()
    this.state = {
      buttonShow: false
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.buttonhandle = this.buttonhandle.bind(this)
  }
  buttonhandle (e) {
    this.setState((state) => ({ buttonShow: !state.buttonShow }))
  }

  getComponent (alert) {
    if (this.role === 'Admin' || this.role === 'Subjecthead' || this.role === 'Planner' || this.role === 'ExaminationHead') {
      return <ViewTestsWithFilter alert={alert} />
    } else if (this.role === 'Teacher' || this.role === 'LeadTeacher') {
      return <React.Fragment>
        <div>

          <Button style={{ margin: 10, float: 'right' }} variant='outlined' color='primary' onClick={this.buttonhandle} >
          Switch to {this.state.buttonShow ? ' View Tests' : ' Take Test'}
          </Button>
        </div>
        {this.state.buttonShow === true
          ? <ViewTests alert={alert} />
          : <ViewTestsWithFilter alert={alert} />

        }
      </React.Fragment>
    } else {
      return <ViewTests alert={alert} />
    }
  }
  render () {
    console.log(this.props)
    return (
      <React.Fragment>

        {this.getComponent(this.props.alert)}
      </React.Fragment>
    )
  }
}
export default ViewTestsHome
