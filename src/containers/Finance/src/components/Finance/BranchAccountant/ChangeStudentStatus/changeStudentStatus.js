import React, { Component } from 'react'
import { Grid, Button, TextField } from '@material-ui/core'
// import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Switch from '@material-ui/core/Switch'
// import { apiActions } from '../../../../_actions'
import * as actionTypes from '../store/actions'

// import { urls } from '../../../../urls'

class ChangeStudentStatus extends Component {
  state = {
    mode: null,
    studentErp: null
  }

  erpHandler = (e) => {
    this.setState({
      studentErp: e.target.value
    }, () => {
      console.log('entered erp: ', this.state.studentErp)
    })
  }

  getStatusHandler = () => {
    // action call
    this.props.getStudentActiveStatus(this.state.studentErp, this.props.user, this.props.alert)
  }

  changeStatusHandler = () => {
    // POST CALL
    this.props.updateStudentStatus()
  }

  handleSwitch = (e) => {
    // console.log('switch state', e.target.checked)
    this.setState({
      mode: e.target.checked
    }, () => {
      const { studentErp, mode } = this.state
      let data = {
        erp: studentErp,
        is_active_status: mode
      }
      this.props.updateStudentStatus(data, this.props.user, this.props.alert)
    })
  }

  render () {
    // console.log('student status', this.props.studentStatus)
    let switcher = null
    let statusIndicator = null
    if (this.props.studentStatus) {
      switcher = (
        <div>
          <Switch
            checked={this.state.mode}
            onChange={(e) => { this.handleSwitch(e) }}
            defaultChecked={this.props.studentStatus.is_active_status}
            // value="checkedA"
            // inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      )
      if (this.state.mode) {
        statusIndicator = (
          <div style={{ marginTop: '15px', marginLeft: '30px' }}>
            Active
          </div>
        )
      } else {
        statusIndicator = (
          <div style={{ marginTop: '15px', marginLeft: '30px' }}>
            Inactive
          </div>
        )
      }
    }
    return (
      <div style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              // className={this.props.classes.textField}
              label='ERP number'
              type='number'
              margin='dense'
              // className='form-control'
              fullWidth
              onChange={this.erpHandler}
              required
              value={this.state.studentErp ? this.state.studentErp : null}
              variant='outlined'
              name='erpNumber' />
          </Grid>
          <Grid item xs={3} style={{ marginTop: '15px', marginLeft: '30px' }}>
            <Button variant='contained' color='primary' disabled={!this.state.studentErp} onClick={this.getStatusHandler}>GET
            </Button>
          </Grid>
          {switcher}{statusIndicator}
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  studentStatus: state.finance.accountantReducer.changeStudentStatus.studentStatus
// session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
// loadSession: dispatch(apiActions.listAcademicSessions())
  getStudentActiveStatus: (studentErp, user, alert) => dispatch(actionTypes.getStudentActiveStatus({ studentErp, user, alert })),
  updateStudentStatus: (data, user, alert) => dispatch(actionTypes.updateStudentStatus({ data, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangeStudentStatus))
