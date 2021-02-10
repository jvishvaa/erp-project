import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import { Button, Grid, TextField, Checkbox, FormControlLabel } from '@material-ui/core/'
import Select from 'react-select'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'

class EditMiscFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alertMessage: '',
      fee_type_name: null,
      is_multiple_records_allow: false,
      individual_student_wise: false,
      allow_partial_payments: false,
      can_be_group: false,
      is_allow_remarks: false,
      allow_excess_amount: false,
      is_last_year_due: false,
      is_advance_fee: false,
      is_parent_enable: false,
      set_due_date: null,
      sessionData: null,
      start_date: null,
      // feeAcc: '',
      end_date: null,
      feeAccount: '',
      is_store_related: false,
      branchData: [],
      branchIds: null,
      amount: null
    }
  }

  componentDidMount () {
    console.log('alert---------------', this.props.alert)
    let currentData = this.props.miscFeeList.filter(val => val.id === this.props.id)
    currentData.forEach(arr => {
      console.log(arr)
      this.setState({
        fee_type_name: arr.fee_type_name ? arr.fee_type_name : '',
        is_multiple_records_allow: arr.is_multiple_records_allow ? arr.is_multiple_records_allow : false,
        individual_student_wise: arr.individual_student_wise ? arr.individual_student_wise : false,
        allow_partial_payments: arr.allow_partial_payments ? arr.allow_partial_payments : false,
        can_be_group: arr.can_be_group ? arr.can_be_group : false,
        is_allow_remarks: arr.is_allow_remarks ? arr.is_allow_remarks : false,
        allow_excess_amount: arr.allow_excess_amount ? arr.allow_excess_amount : false,
        is_last_year_due: arr.is_last_year_due ? arr.is_last_year_due : false,
        is_advance_fee: arr.is_advance_fee ? arr.is_advance_fee : false,
        is_parent_enable: arr.is_parent_enable ? arr.is_parent_enable : false,
        set_due_date: arr.set_due_date ? arr.set_due_date : '',
        // sessionData: arr.academic_year ? arr.academic_year : '',
        // start_date: arr.star_date ? arr.star_date : '',
        // end_date: arr.end_date ? arr.end_date : '',
        feeAccount: this.props.feeAccs ? {
          label: this.props.feeAccs.fee_account_name,
          value: this.props.feeAccs.id
        } : '',
        // is_store_related: arr.is_store_related,
        // branchData: arr.branch ? arr.branch : '',
        amount: arr.amount ? arr.amount : '',
        sessionData: this.props.sessions,
        branchData: this.props.branch,
        startDate: this.props.start_date,
        endDate: this.props.end_dates,
        branchIds: this.props.branchIdss,
        is_store_related: this.props.store ? this.props.store : false
      })
    })
  }

  dueDateHandler = e => {
    this.setState({ set_due_date: e.target.value })
  }

  amountHandler = e => {
    this.setState({ amount: e.target.value })
  }
  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  feeTypeNameHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
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
      is_store_related: this.state.is_store_related ? this.state.is_store_related : false,
      amount: this.state.amount,
      branch: this.state.branchIds,
      academic_year: this.state.sessionData && this.state.sessionData.value
    }
    this.props.updateListMiscFee(this.props.id, data, this.props.alert, this.props.user)
    this.props.close()
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ sessionData: e }, () => {
      console.log(this.state.sessionData)
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

  feeAccountHandler = (e) => {
    console.log('fee acc', e)
    this.setState({
      feeAccount: {
        label: e.label,
        value: e.value
      }
    })
  }

  changehandlerbranch = (e) => {
    // let branchIds = []
    // e.forEach(function (branch) {
    //   branchIds.push(branch.value)
    // })
    this.setState({ branchIds: e.value, branchData: e })
    let data = {
      session_year: [this.state.sessionData && this.state.sessionData.value],
      branch_id: [e.value]
    }
    this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
    // this.props.fetchAllFeeAccounts(this.state.sessionData && this.state.sessionData.value, e.value, this.props.alert, this.props.user)
  }

  render () {
    return (
      <Form>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label className='student-addStudent-segment1-heading'>
                      Edit Misc Fee Type
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} style={{ padding: 15 }}>
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
              // isMulti
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
          <Grid item xs='5'>
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
          <Grid item xs='5'>
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
              onChange={(e) => this.amountHandler(e)}
              // margin='normal'
              variant='outlined'
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_multiple_records_allow}
              onChange={(e) => this.changedHandler('is_multiple_records_allow', e)}
            /> &nbsp; multiple records allo
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.individual_student_wise}
              onChange={(e) => this.changedHandler('individual_student_wise', e)}
            /> &nbsp; individual student wise
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.allow_partial_payments}
              onChange={(e) => this.changedHandler('allow_partial_payments', e)}
            /> &nbsp; allow partial payments
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.can_be_group}
              onChange={(e) => this.changedHandler('can_be_group', e)}
            /> &nbsp; can be group
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_allow_remarks}
              onChange={(e) => this.changedHandler('is_allow_remarks', e)}
            /> &nbsp; allow remarks
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.allow_excess_amount}
              onChange={(e) => this.changedHandler('allow_excess_amount', e)}
            /> &nbsp; allow excess amount

          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_last_year_due}
              onChange={(e) => this.changedHandler('is_last_year_due', e)}
            /> &nbsp; last year due

          </Grid>
          <Grid item xs='5'>

            <input
              type='checkbox'
              checked={this.state.is_advance_fee}
              onChange={(e) => this.changedHandler('is_advance_fee', e)}
            /> &nbsp; advance fee

          </Grid>
          <Grid item xs='5'>

            <input
              type='checkbox'
              checked={this.state.is_parent_enable}
              onChange={(e) => this.changedHandler('is_parent_enable', e)}
            /> &nbsp; parent enable

          </Grid>
          <Grid item xs='5'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_store_related}
                  onChange={(e) => this.changedHandler('is_store_related', e)}
                  color='primary'
                />
              }
              label='store_related'
            />

          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item xs='5'>
            <div>
              <Button variant='contained' color='primary' onClick={this.handlevalue}>
                    Update
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
  miscFeeList: state.finance.miscFee.miscFeeList,
  branches: state.finance.common.branchPerSession,
  session: state.academicSession.items,
  viewFeeAccList: state.finance.tallyReports.feeAccountPerBranch
})

const mapDispatchToProps = dispatch => ({
  fetchFeeAccounts: (data, alert, user) => dispatch(actionTypes.fetchFeeAccPerBranchAndAcad({ data, alert, user })),
  // fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user })),
  updateListMiscFee: (id, data, alert, user) => dispatch(actionTypes.updateMiscFeeList({ id, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditMiscFeeType)))
