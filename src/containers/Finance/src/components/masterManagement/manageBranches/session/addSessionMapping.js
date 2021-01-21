import React, { Component } from 'react'
import {
  // Button,
  Grid,
  // Table,
  Form
  // Input
} from 'semantic-ui-react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
// import update from 'immutability-helper'
import { withRouter } from 'react-router-dom'

import axios from 'axios'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'
import { OmsSelect, AlertMessage } from '../../../../ui'

class AddSessionMapping extends Component {
  constructor () {
    super()
    this.state = {
      sessionData: null,
      updatedAcad: {},
      startDateError: false

    }
    this.handleClick = this.handleClick.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  handlerowchange = (branchid, dateType, e, newValue) => {
    console.log('acad: row changed', branchid, dateType, e, newValue)

    var tempUpdatedAcad = this.state.updatedAcad

    if (typeof tempUpdatedAcad[branchid] !== 'undefined') {
      tempUpdatedAcad[branchid][dateType] = newValue
    } else {
      tempUpdatedAcad[branchid] = {}
      tempUpdatedAcad[branchid][dateType] = newValue
    }

    this.setState({
      updatedAcad: tempUpdatedAcad
    })
    console.log('updatedAcad:', this.state.updatedAcad)
  };
  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, gradevalue: [], branchData: e })
    // this.props.gradeMapBranch(e.value)
  };

  handleClick = e => {
    this.setState({ acadId: e.value })

    setTimeout(() => {
      console.log('trrtytdt7d7dd75d75d', this.state.acadId)
    }, 200)

    setTimeout(() => {
      console.log('trrtytdt7d7dd75d75d', this.state.acadId)
    }, 200)

    axios
      .get(urls.ACADEMICSESSION + '?session_year=' + e.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var acadSession = res['data']
        console.log(acadSession)
        this.setState({ sessionData: acadSession, sessionYear: e.value })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.BRANCH, error)
      })
  };

  handlevalue = e => {
    e.preventDefault()
    var op = []
    for (var branchid in this.state.updatedAcad) {
      var temp = {}
      temp['branch'] = branchid
      if ('start_date' in this.state.updatedAcad[branchid]) { temp['start_date'] = this.state.updatedAcad[branchid]['start_date'] }
      if ('end_date' in this.state.updatedAcad[branchid]) { temp['end_date'] = this.state.updatedAcad[branchid]['end_date'] }
      op.push(temp)
    }
    console.log(op)
    axios
      .put(
        urls.UTILACADEMICSESSION + '?session_year=' + this.state.sessionYear,
        op,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        // alert("Session Added Successfully")
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Session Added Successfully',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        } else {
          this.setState({
            alertMessage: {
              messageText: 'Error: Something went wrong, please try again.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        // alert("Session Failed");
        console.log(error)
        this.setState({
          alertMessage: {
            messageText: 'Session Failed',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
        console.log(
          "Error: Couldn't fetch data from " + urls.UTILACADEMICSESSION, error
        )
      })
  };
  handleAdd () {
    // var that = this

    let { acadId, branch } = this.state
    console.log(this.state, 'this.styate')

    let obj = {
      session_year: acadId,
      branch: branch,
      start_date: this.state.startDate,
      end_date: this.state.endDate
    }

    axios
      .patch(urls.session, JSON.stringify(obj), {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'

        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.props.alert.success('Created')
        } else if (res.status === 400) {
          this.props.alert.error('This Branch Already Exist in Acad Session')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  handleEndDate = e => {
    // this.setState({ endDate : e.target.value })
    var startDate = document.getElementById('startDate').value
    var nendDate = document.getElementById('endDate').value
    if (!this.state.acadId) {
      this.props.alert.error('Select Academic-Year to proceed')
    } else {
      let acadEndDatebefore = this.state.acadId.split('-')[1]
      let acadYear = '20'
      let selectedDate = (moment(e.target.value.toString()).format('YYYY'))
      let acadEndDate = acadYear.concat(acadEndDatebefore)
      if (selectedDate !== acadEndDate) {
        this.props.alert.error('End Date Year should be same as the year in which the academic session ends')
      }
    }
    if (startDate >= nendDate) {
      this.props.alert.error('End date should be greater than Start date')
      this.setState({ endDate: '' })
    } else {
      this.setState({ endDate: nendDate })
    }
  };

  render () {
    const { startDateError, endDateError } = this.state
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue}>
          <Grid>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={6}
                tablet={6}
                className='addSectionmapping-column'
              >
                <label>Select Academic Year*</label>
                <OmsSelect
                  options={
                    this.props.session
                      ? this.props.session.session_year.map(
                        session => ({
                          value: session,
                          label: session
                        })
                      )
                      : null
                  }
                  change={this.handleClick}
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={6}
                tablet={6}
                className='addSectionmapping-column'
              >
                <label>Branch*</label>

                <OmsSelect
                  options={
                    this.props.branches
                      ? this.props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : []
                  }
                  // disabled={this.role === 'Principal'}
                  change={this.changehandlerbranch}
                // defaultValue={branchData}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Column
              computer={4}
              mobile={6}
              tablet={6}
              className='addSectionmapping-column'
            >
              <label>Start Date</label>
              <input
                type='date'
                value={this.state.startDate || ''}
                required
                min={(() => { let tdy = new Date(this.state.acadIdacadId); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
                onChange={e => {
                  let { acadId } = this.state
                  if (!acadId) {
                    this.props.alert.error('Select Academic-year to proceed')
                    return
                  }
                  let selectedDate = (moment(e.target.value.toString()).format('YYYY'))
                  let acadStartDate = (this.state.acadId.split('-')[0])
                  selectedDate !== acadStartDate ? this.props.alert.error('Start date year should be same as that of the academic session start year') : this.setState({ startDate: e.target.value })
                }}
                className='form-control'
                name='startDate'
                id='startDate'
              />
              {startDateError && (
                <Typography style={{ color: 'red' }}>Select Start Date</Typography>
              )}
            </Grid.Column>
            <Grid.Column
              computer={4}
              mobile={6}
              tablet={6}
              className='addSectionmapping-column'
            >
              <label>End Date</label>

              <input
                type='date'
                value={this.state.endDate || ''}
                className='form-control'
                name='endDate'
                id='endDate'
                // onChange={e => {
                //   this.setState({ endDate: e.target.value })
                // }}
                onChange={this.handleEndDate}
                required
              />
              {endDateError && (
                <Typography style={{ color: 'red' }}>Select End Date</Typography>
              )}
            </Grid.Column>
            <Grid.Column
              computer={12}
              mobile={15}
              tablet={14}
            >
              <Button variant='contained' onClick={this.handleAdd}
                disabled={
                  !this.state.acadId ||
                !this.state.branch ||
                !this.state.startDate ||
                !this.state.endDate
                }
                color='primary'
              >
        Save
              </Button>
              <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
            </Grid.Column>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  session: state.academicSession.items
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  listBranches: dispatch(apiActions.listBranches())

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddSessionMapping))
