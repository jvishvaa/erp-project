import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import Select from 'react-select'
import { Checkbox, FormControlLabel, Button, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'

class AddMiscFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      is_multiple_records_allow: false,
      individual_student_wise: false,
      allow_partial_payments: false,
      can_be_group: false,
      is_allow_remarks: false,
      allow_excess_amount: false,
      is_last_year_due: false,
      is_advance_fee: false,
      show_transaction_in_parent_login: false,
      is_parent_enable: false,
      alertMessage: '',
      branchData: [],
      branchIds: [],
      fee_type_name: null,
      set_due_date: null
    }
    this.handlevalue = this.handlevalue.bind(this)
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  componentDidMount () {
    if (this.props.acadId) {
      this.props.fetchBranches(this.props.acadId, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Select Academic Year')
    }
  }

  dueDateHandler = e => {
    this.setState({ set_due_date: e.target.value })
  }

  changehandlerbranch = (e) => {
    let branchIds = []
    e.forEach(function (branch) {
      branchIds.push(branch.value)
    })
    this.setState({ branchIds: branchIds, branchData: e })
  }

  feeTypeNameHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      academic_year: this.props.acadId,
      branch: this.state.branchIds,
      fee_type_name: this.state.fee_type_name,
      set_due_date: this.state.set_due_date,
      is_multiple_records_allow: this.state.is_multiple_records_allow,
      individual_student_wise: this.state.individual_student_wise,
      allow_partial_payments: this.state.allow_partial_payments,
      can_be_group: this.state.can_be_group,
      is_allow_remarks: this.state.is_allow_remarks,
      allow_excess_amount: this.state.allow_excess_amount,
      is_last_year_due: this.state.is_last_year_due,
      is_advance_fee: this.state.is_advance_fee,
      show_transaction_in_parent_login: this.state.show_transaction_in_parent_login,
      is_parent_enable: this.state.is_parent_enable
    }
    this.props.addedMiscFeeList(data, this.props.alert, this.props.user)
    this.props.close()
  }

  render () {
    return (
      <Form>
        <Grid conatiner spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label className='student-addStudent-segment1-heading'>
                      Create Misc Fee Type
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              isMulti
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>

          <Grid item xs='5'>
            <label>Fee Type Name</label>
            <input
              name='fee_type_name'
              type='text'
              className='form-control'
              onChange={this.feeTypeNameHandler}
              placeholder='Fee Type Name'
              value={this.state.fee_type_name}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Set Due Date</label>
            <input
              name='set_due_date'
              type='date'
              className='form-control'
              onChange={this.dueDateHandler}
              placeholder='set_due_date'
              value={this.state.set_due_date}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_multiple_records_allow}
                  onChange={this.changedHandler('is_multiple_records_allow')}
                  color='primary'
                />
              }
              label='Multiple Records Allow'
            />
          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.individual_student_wise}
                  onChange={this.changedHandler('individual_student_wise')}
                  color='primary'
                />
              }
              label='Individual Student Wise'
            />

          </Grid>
          <Grid item xs='5'>

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.allow_partial_payments}
                  onChange={this.changedHandler('allow_partial_payments')}
                  color='primary'
                />
              }
              label='Allow Partial Payments'
            />

          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.can_be_group}
                  onChange={this.changedHandler('can_be_group')}
                  color='primary'
                />
              }
              label='Can Be Group'
            />

          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_allow_remarks}
                  onChange={this.changedHandler('is_allow_remarks')}
                  color='primary'
                />
              }
              label='Allow Remarks'
            />

          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.allow_excess_amount}
                  onChange={this.changedHandler('allow_excess_amount')}
                  color='primary'
                />
              }
              label='Allow Excess Amount'
            />

          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_last_year_due}
                  onChange={this.changedHandler('is_last_year_due')}
                  color='primary'
                />
              }
              label='Last Year Due'
            />

          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_advance_fee}
                  onChange={this.changedHandler('is_advance_fee')}
                  color='primary'
                />
              }
              label='Advance Fee'
            />

          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_parent_enable}
                  onChange={this.changedHandler('is_parent_enable')}
                  color='primary'
                />
              }
              label='Parent Enable'
            />

          </Grid>
        </Grid>
        <Grid container spacing={3} justify='center'>
          <Grid item xs='5'>
            <div>
              <Button variant='contained' color='primary' onClick={this.handlevalue}
                disabled={
                  !this.state.fee_type_name || !this.state.set_due_date
                }
              >
                    Create
              </Button>
              <Button color='secondary' variant='contained' style={{ marginLeft: 20 }} onClick={this.props.close} type='button'>Return</Button>
            </div>
          </Grid>
        </Grid>
      </Form>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = dispatch => ({
  addedMiscFeeList: (data, alert, user) => dispatch(actionTypes.addMiscFeeList({ data, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddMiscFeeType)))
