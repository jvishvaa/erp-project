import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import Select from 'react-select'
import { Checkbox, FormControlLabel, Button, Grid, TextField } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'

let moduleId = null 
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Fee Type' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Misc. Fee Type') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId = item.child_id
          // })
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}
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
      set_due_date: null,
      sessionData: null,
      start_date: null,
      end_date: null,
      feeAccount: '',
      is_store_related: false,
      amount: null
    }
    this.handlevalue = this.handlevalue.bind(this)
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  componentDidMount () {
    if (this.props.acadId) {
      this.props.fetchBranches(this.props.acadId, this.props.alert, this.props.user, moduleId)
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
    let data = {
      session_year: [this.state.sessionData && this.state.sessionData.value],
      branch_id: branchIds
    }
    this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
  }

  feeTypeNameHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  handleAcademicyear = (e) => {
    this.setState({ sessionData: e }, () => {
    })
  }

  handleEditChange= (e) => {
    switch (e.target.id) {
      case 'start_date': {
        this.setState({
          startDate: e.target.value
        })
        break
      }
      case 'end_date': {
        this.setState({
          endDate: e.target.value
        })
        break
      }
      default: {
      }
    }
  }

  amountHandler = (e) => {
    this.setState({
      amount: e.target.value
    })
  }
  feeAccountHandler = (e) => {
    this.setState({
      feeAccount: {
        label: e.label,
        value: e.value
      }
    })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      academic_year: this.state.sessionData && this.state.sessionData.value,
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
      is_parent_enable: this.state.is_parent_enable,
      start_date: this.state.startDate,
      end_date: this.state.endDate,
      fee_account: this.state.feeAccount && this.state.feeAccount.value,
      is_store_related: this.state.is_store_related,
      amount: this.state.amount
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
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session ? this.props.session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
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
          <Grid item xs={10}>
            <label>Start Date*</label>
            <br />
            <TextField
              id='start_date'
              // label='Start Date'
              type='date'
              // className={classes.textField}
              value={this.state.startDate || ''}
              onChange={(e) => { this.handleEditChange(e) }}
              // margin='normal'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={10}>
            <label>End Date*</label>
            <br />
            <TextField
              id='end_date'
              // label='End Date'
              type='date'
              // className={classes.textField}
              value={this.state.endDate || ''}
              onChange={(e) => { this.handleEditChange(e) }}
              // margin='normal'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={5}>
            <label>Fee Account*</label>
            <Select
              placeholder='Select Fee Account'
              value={this.state.feeAccount ? this.state.feeAccount : null}
              options={
                this.props.viewFeeAccList && this.props.viewFeeAccList.length
                  ? this.props.viewFeeAccList.map(feeAcc => ({
                    value: feeAcc.id,
                    label: feeAcc.fee_account_name
                  }))
                  : []
              }
              onChange={(e) => { this.feeAccountHandler(e) }}
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
          <Grid item xs={5}>
            <label>Amount*</label>
            <br />
            <TextField
              id='start_date'
              // label='Start Date'
              type='number'
              // className={classes.textField}
              value={this.state.amount || ''}
              onChange={(e) => { this.amountHandler(e) }}
              // margin='normal'
              variant='outlined'
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
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_store_related}
                  onChange={this.changedHandler('is_store_related')}
                  color='primary'
                />
              }
              label='store_related'
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
  branches: state.finance.common.branchPerSession,
  session: state.academicSession.items,
  viewFeeAccList: state.finance.tallyReports.feeAccountPerBranchs
})

const mapDispatchToProps = dispatch => ({
  fetchFeeAccounts: (data, alert, user) => dispatch(actionTypes.fetchFeeAccPerBranchAndAcad({ data, alert, user })),
  // fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user })),
  addedMiscFeeList: (data, alert, user) => dispatch(actionTypes.addMiscFeeList({ data, alert, user })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddMiscFeeType)))
