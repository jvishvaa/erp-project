import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core/'

import { connect } from 'react-redux'
import Select from 'react-select'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'

class editOtherFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentFeeAccount: null,
      feeTypeName: '',
      subFeeTypeName: '',
      startDate: '',
      dueDate: '',
      endDate: ''
    }
  }

  componentDidMount () {
    if (!this.props.acadId || !this.props.otherFeeId) {
      this.props.alert.warning('Select the required Fields')
    } else {
      this.props.fetchFeeAccount(this.props.acadId, this.props.branchId, this.props.alert, this.props.user)
      let currentData = this.props.otherFees.filter(val => val.id === this.props.otherFeeId)
      currentData.forEach(arr => {
        this.setState({
          currentFeeAccount: arr.fee_account ? arr.fee_account : '',
          feeTypeName: arr.fee_type_name ? arr.fee_type_name : '',
          subFeeTypeName: arr.sub_type ? arr.sub_type : '',
          startDate: arr.start_date ? arr.start_date : '',
          dueDate: arr.due_date ? arr.due_date : '',
          endDate: arr.end_date ? arr.end_date : ''
        })
      })
    }
  }

  feeTypeHandler = (e) => {
    this.setState({
      feeTypeName: e.target.value
    })
  }

  subFeeTypeHandler = (e) => {
    this.setState({
      subFeeTypeName: e.target.value
    })
  }

  // amountHandler = (e) => {
  //   this.setState({
  //     amount: e.target.value
  //   })
  //   let amount = document.getElementById('amount').value
  //   if (amount < 1) {
  //     this.props.alert.warning('Invalid Amount')
  //     this.setState({ amount: '' })
  //   }
  // }

  feeAccountChangeHandler = (e) => {
    const feeAccount = {
      id: e.value,
      fee_account_name: e.label
    }
    this.setState({
      currentFeeAccount: feeAccount
    })
  }

  startDateChangeHandler = (e) => {
    this.setState({
      startDate: e.target.value
    })
  }

  dueDateChangeHandler = (e) => {
    this.setState({
      dueDate: e.target.value
    })
  }

  endDateChangeHandler = (e) => {
    this.setState({
      endDate: e.target.value
    })
  }

  handleSubmitOtherFees = () => {
    const {
      currentFeeAccount,
      feeTypeName,
      subFeeTypeName,
      startDate,
      dueDate,
      endDate
    } = this.state
    if (currentFeeAccount && feeTypeName && subFeeTypeName && startDate && dueDate && endDate) {
      let data = {
        id: this.props.otherFeeId,
        fee_account: this.state.currentFeeAccount.fee_account_name,
        due_date: this.state.dueDate,
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        fee_type_name: this.state.feeTypeName,
        sub_type: this.state.subFeeTypeName
      }
      this.props.updateListOtherFee(data, this.props.alert, this.props.user)
      this.props.close()
    } else {
      this.props.alert.warning('Select All Fields')
    }
  }

  render () {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='4'>
            <div style={{ margin: '0 auto' }}>
              <h3>Edit Other Fee</h3>
            </div>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label>Fee Account</label>
            <Select
              placeholder='Select Fee Account'
              value={this.state.currentFeeAccount ? ({
                value: this.state.currentFeeAccount.id,
                label: this.state.currentFeeAccount.fee_account_name
              }) : null}
              options={
                this.props.feeAccounts && this.props.feeAccounts.length > 0
                  ? this.props.feeAccounts.map(fee => ({ value: fee.id, label: fee.fee_account_name })
                  ) : []}
              onChange={this.feeAccountChangeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Fee Type</label>
            <input
              type='text'
              style={{ padding: '18px' }}
              className='form-control'
              placeholder='Fee Type'
              value={this.state.feeTypeName}
              onChange={this.feeTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Sub Fee Type</label>
            <input
              type='text'
              style={{ padding: '18px' }}
              placeholder='Sub Fee Type'
              className='form-control'
              value={this.state.subFeeTypeName}
              onChange={this.subFeeTypeHandler}
            />
          </Grid>
          {/* <Grid.Column
            computer={8}
            mobile={16}
            tablet={8}
            className='student-section-inputField'
          >
            <label>Amount</label>
            <input
              type='number'
              name='amount'
              min='1'
              id='amount'
              className='form-control'
              placeholder='Amount'
              value={this.state.amount}
              onChange={this.amountHandler}
            />
          </Grid.Column> */}
          <Grid item xs='5'>
            <label>Start Date</label>
            <input
              type='date'
              name='start_date'
              style={{ padding: '18px' }}
              min='1'
              id='amount'
              className='form-control'
              placeholder='Start Date'
              value={this.state.startDate}
              onChange={this.startDateChangeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Due Date</label>
            <input
              type='date'
              name='due_date'
              style={{ padding: '18px' }}
              min='1'
              id='amount'
              className='form-control'
              placeholder='Due Date'
              value={this.state.dueDate}
              onChange={this.dueDateChangeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>End Date</label>
            <input
              type='date'
              name='end_date'
              style={{ padding: '18px' }}
              min='1'
              id='amount'
              className='form-control'
              placeholder='End Date'
              value={this.state.endDate}
              onChange={this.endDateChangeHandler}
            />
          </Grid>
          <div
            style={{ margin: '0 auto' }}
          >
            <Button
              color='primary'
              variant='contained'
              onClick={this.handleSubmitOtherFees}
            >Update</Button>
          </div>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  // feeAccounts: state.finance.accountantReducer.listOtherFee.accountantFeeAccount,
  feeAccounts: state.finance.viewFeeAccounts.viewFeeAccList,
  otherFees: state.finance.accountantReducer.listOtherFee.adminOtherfees
})

const mapDispatchToProps = dispatch => ({
  updateListOtherFee: (data, alert, user) => dispatch(actionTypes.updateOtherFeeInst({ data, alert, user })),
  fetchFeeAccount: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(editOtherFeeType)))
