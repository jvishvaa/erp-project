import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core/'
import { connect } from 'react-redux'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import * as actionTypes from '../store/actions'

class EditFeePlanName extends Component {
  constructor (props) {
    super(props)
    this.state = {
      limitedTime: false,
      is_new_admission: false,
      is_regular: false,
      is_rte: false,
      is_specialchild: false,
      is_dayscholar: false,
      is_afternoonbatch: false,
      active: false,
      inactive: false
    }
  }

  componentDidMount () {
    let currentFeePlan = this.props.listFeePlan.filter(val => val.id === this.props.id)
    // console.log(currentFeePlan)
    currentFeePlan.forEach(arr => {
      this.setState((state) => ({
        feeplan_name: arr.fee_plan_name ? arr.fee_plan_name : '',
        limitedTime: arr.is_this_a_limited_plan ? arr.is_this_a_limited_plan : false,
        startDate: arr.date_from ? arr.date_from : '',
        endDate: arr.date_to ? arr.date_to : '',
        is_afternoonbatch: arr.is_afternoonbatch ? arr.is_afternoonbatch : false,
        is_dayscholar: arr.is_dayscholar ? arr.is_dayscholar : false,
        is_new_admission: arr.is_new_admission ? arr.is_new_admission : false,
        is_regular: arr.is_regular ? arr.is_regular : false,
        is_rte: arr.is_rte ? arr.is_rte : false,
        is_specialchild: arr.is_specialchild ? arr.is_specialchild : false,
        active: arr.plan_status ? arr.plan_status : false
      }))
    })
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  handleEndDate = (e) => {
    this.setState({ endDate: e.target.value })
    var startDate = document.getElementById('startDate').value
    var endDate = document.getElementById('endDate').value
    if (Date.parse(startDate) >= Date.parse(endDate)) {
      this.setState({
        alertMessage: {
          messageText: 'End date should be greater than Start date',
          variant: 'error',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      this.setState({ endDate: '' })
    }
  }

  feePlanNameHandler = e => {
    this.setState({ feeplan_name: e.target.value })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      id: this.props.id,
      fee_plan_name: this.state.feeplan_name,
      is_this_a_limited_plan: this.state.limitedTime,
      date_from: this.state.startDate ? this.state.startDate : null,
      date_to: this.state.endDate ? this.state.endDate : null,
      is_new_admission: this.state.is_new_admission,
      is_regular: this.state.is_regular,
      is_rte: this.state.is_rte,
      is_specialchild: this.state.is_specialchild,
      is_dayscholar: this.state.is_dayscholar,
      is_afternoonbatch: this.state.is_afternoonbatch,
      plan_status: this.state.active

    }
    this.props.updateIndividualFeePlan(this.props.id, data, this.props.alert, this.props.user)
    this.props.close()
    // var updatedList = urls.Finance + this.props.id  + '/editcreatefeeplan/'
    // axios
    //   .put(updatedList, data, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     if (res.status === 200) {
    //       console.log(res)
    //       this.props.alert.success('Updated Successfully')
    //       this.props.giveData("success", res.data)
    //     }
    //   })
    //   .catch((error) => {
    //     this.props.alert.error('Something Went Wrong')
    //     console.log("Error: Couldn't fetch data from " + urls.NormalFeeType + error)
    //   })
  }

  render () {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label className='student-addStudent-segment1-heading'>
                          Edit Fee Plan Name
            </label>
          </Grid>
        </Grid>
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='4'>
            <label>Fee Plan Name*</label>
            <input
              name='feeplan_name'
              type='text'
              className='form-control'
              onChange={this.feePlanNameHandler}
              placeholder='Fee Plan Name'
              value={this.state.feeplan_name}
            />
          </Grid>
          <Grid item xs='6'>
            <input
              type='checkbox'
              onChange={(e) => this.changedHandler('limitedTime', e)}
              checked={this.state.limitedTime}
            /> &nbsp; Is this a limited period time ?
          </Grid>
        </Grid>
        <Grid container direction='row' spacing={3} style={{ padding: 15 }}>
          {this.state.limitedTime
            ? <React.Fragment>
              <Grid item xs='4'>
                <label>Start Date</label>
                <input
                  type='date'
                  value={this.state.startDate}
                  onChange={e => { this.setState({ startDate: e.target.value }) }}
                  className='form-control'
                  name='startDate'
                  id='startDate'
                />
              </Grid>
              <Grid item xs='4'>
                <label>End Date</label>
                <input
                  type='date'
                  value={this.state.endDate}
                  className='form-control'
                  name='endDate'
                  id='endDate'
                  onChange={this.handleEndDate}
                />
              </Grid>

            </React.Fragment>
            : ''}
        </Grid>
        <Grid container direction='row' spacing={3} style={{ padding: 15 }}>
          <Grid item x='3'>
            <label>Fee Plan Applicable To : </label>
          </Grid>
          <Grid item xs='9'>
            {this.state.is_regular ? ''
              : <span>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_new_admission', e)}
                  checked={this.state.is_new_admission}
                /> New Admission
              </span>
            }
                      &nbsp; &nbsp;
            {this.state.is_new_admission ? ''
              : <span>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_regular', e)}
                  checked={this.state.is_regular}
                /> &nbsp; Regular
              </span>
            } &nbsp; &nbsp;
            <input
              type='checkbox'
              onChange={(e) => this.changedHandler('is_rte', e)}
              checked={this.state.is_rte}
            /> &nbsp; RTE
                          &nbsp; &nbsp;
            <input
              type='checkbox'
              onChange={(e) => this.changedHandler('is_specialchild', e)}
              checked={this.state.is_specialchild}
            /> &nbsp; Special Child
                          &nbsp; &nbsp;
            {this.state.is_afternoonbatch ? ''
              : <span>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_dayscholar', e)}
                  checked={this.state.is_dayscholar}
                /> &nbsp; Day Scholar
              </span>
            }
                        &nbsp; &nbsp;
            {this.state.is_dayscholar ? ''
              : <span>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_afternoonbatch', e)}
                  checked={this.state.is_afternoonbatch}
                /> &nbsp;Afternoon Batch
              </span>

            }
          </Grid>
        </Grid>
        <Grid container direction='row' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Plan Status</label>
          </Grid>
          <Grid item xs='4'>
            <input
              type='checkbox'
              onChange={(e) => this.changedHandler('active', e)}
              checked={this.state.active}
            /> &nbsp; Active
          </Grid>
        </Grid>
        <Grid container direction='row' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='8'>
            <Button onClick={(e) => { this.handlevalue(e) }} color='primary' variant='outlined'>
                    Update
            </Button>
            <Button color='primary' variant='contained' onClick={this.props.close} type='button'>Return</Button>
          </Grid>
        </Grid>
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
  listBranches: dispatch(apiActions.listBranches()),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  updateIndividualFeePlan: (feePlanId, data, alert, user) => dispatch(actionTypes.updateFeePlan({ feePlanId, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditFeePlanName)))
