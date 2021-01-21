import React from 'react'
import { Grid, ListItem } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
// import ExpandLess from '@material-ui/icons/ExpandLess'
// import ExpandMore from '@material-ui/icons/ExpandMore'
import { Toolbar } from '../../ui'
import Messaging from '../messaging'

// import Checkbox from '../questbox/Ch'

class Communication extends React.Component {
  constructor () {
    super()
    this.state = {
      newMessage: false,
      anchorEl: null
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  toggleNewMessage = (e) => {
    this.setState({ newMessage: true, anchorEl: e.currentTarget })
  }
  render () {
    this.currentRole = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    return <React.Fragment>
      {this.role === 'Teacher' || this.role === 'Admin' || this.role === 'Principal' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator'
        ? <Toolbar>
          <Button color='primary' style={{ float: 'right' }} onClick={this.toggleNewMessage}>
            <AddIcon /> New General Diary
          </Button>
        </Toolbar>
        : ''}
      <Messaging alert={this.props.alert} onCloseMessage={() => this.setState({ newMessage: false })} newMessage={this.state.newMessage} />
      <Grid item xs={2}>
        <ListItem button
          onOut
          onClick={(e) => {
            let { height, top, left } = e.target.getClientRects()[0]
            let { currentTarget } = e
            this.setState(state => ({ anchorEl: currentTarget, open: !state.open, positionTop: (height + top + window.screenTop), positionLeft: left }))
          }} />
      </Grid>
    </React.Fragment>
  }
}

export default Communication
