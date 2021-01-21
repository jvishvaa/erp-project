import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import SMS from '../sms'
import { Toolbar } from '../../ui'

class OfflineSms extends React.Component {
  constructor () {
    super()
    this.state = {
      newSMS: false,
      anchorEl: null
    }
  }

  toggleNewSMS = (e) => {
    this.setState({ newSMS: true, anchorEl: e.currentTarget })
  }

  render () {
    this.currentRole = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    return <React.Fragment>
      <Toolbar>
        <Button color='primary' style={{ float: 'right' }} onClick={this.toggleNewSMS}>
          <AddIcon /> New SMS
        </Button>
      </Toolbar>
      <SMS alert={this.props.alert} anchorEl={this.state.anchorEl} onCloseSMS={() => this.setState({ newSMS: false })} newSMS={this.state.newSMS} />
    </React.Fragment>
  }
}

export default OfflineSms
