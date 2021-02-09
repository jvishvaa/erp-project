import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, CircularProgress } from '@material-ui/core/'

import Select from 'react-select'

import * as actionTypes from '../../../store/actions'
// import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

import classes from '../PettyDeposit/bankDeposit.module.css'

class ExpenseDeposit extends Component {
  state = {
    cheque: true,
    onlineTransfer: false,
    sms: true,
    email: true,
    expenseAcc: null,
    collectionAcc: null,
    amount: null,
    date: null,
    remark: null,
    approvedBy: null,
    chequeNo: null,
    openingBalance: 0
  }

  componentDidMount () {
    this.props.fetchAllAccounts(this.props.session, this.props.branch.id, this.props.user, this.props.alert)
  }

  componentDidUpdate (prevPorps) {
    if (prevPorps.session !== this.props.session || prevPorps.branch.id !== this.props.branch.id) {
      this.props.fetchAllAccounts(this.props.session, this.props.branch.id, this.props.user, this.props.alert)
    }
  }

  expenseAccChangeHandler = (e) => {
    this.setState({
      expenseAcc: {
        id: e.value,
        bank_name: e.label
      }
    }, () => {
      console.log(this.state)
    })
  }

  collectionAccChangeHandler = (e) => {
    if (this.props.collectionAccounts.length) {
      const selectedAcc = this.props.collectionAccounts.filter(acc => {
        return +acc.bank_name.id === +e.value
      })
      if (selectedAcc.length !== 0) {
        console.log('Balance ++', selectedAcc[0].bank_name.balance)
        this.setState({
          openingBalance: selectedAcc[0].bank_name.balance
        })
      }
    }
    this.setState({
      collectionAcc: {
        id: e.value,
        bank_name: e.label
      }
    }, () => {
      console.log(this.state)
    })
  }

  chequeCheckHandler = (e) => {
    this.setState({
      cheque: e.target.checked,
      onlineTransfer: !e.target.checked
    })
  }

  onlineCheckHandler = (e) => {
    this.setState({
      cheque: !e.target.checked,
      onlineTransfer: e.target.checked
    })
  }

  onEmailCheckHandler = (e) => {
    this.setState({
      email: e.target.checked
    })
  }

  onSmsCheckHandler = (e) => {
    this.setState({
      sms: e.target.checked
    })
  }

  amountChangeHandler = (e) => {
    const amountValue = e.target.value
    if (amountValue < 0) {
      this.props.alert.warning('Value should be graeter then 0!')
      return
    }
    this.setState({
      amount: amountValue
    })
  }

  dateChangeHandler = (e) => {
    this.setState({
      date: e.target.value
    })
  }

  approvedByChangeHandler = (e) => {
    this.setState({
      approvedBy: e.target.value
    })
  }

  chequeNoChangeHandler = (e) => {
    this.setState({
      chequeNo: e.target.value
    })
  }

  remarkChangeHandler = (e) => {
    this.setState({
      remark: e.target.value
    })
  }
  saveExpenseDiposit = () => {
    const {
      expenseAcc,
      collectionAcc,
      amount,
      date,
      remark,
      approvedBy,
      chequeNo,
      cheque,
      sms,
      email,
      openingBalance
    } = this.state

    if (+openingBalance < +amount) {
      this.props.alert.warning('Insufficient Amount')
      return
    }

    if (!collectionAcc || !amount || !date || !expenseAcc || (cheque && !chequeNo) || !remark) {
      this.props.alert.warning('Please Fill All Data')
      return
    }

    const mode = cheque ? 'Cheque' : 'Online Transfer'
    this.props.saveExpenseDeposit(
      this.props.session,
      this.props.branch.id,
      expenseAcc,
      collectionAcc,
      mode,
      amount,
      date,
      remark,
      chequeNo,
      approvedBy,
      email,
      sms,
      this.props.user,
      this.props.alert
    )
    this.setState({
      cheque: true,
      onlineTransfer: false,
      sms: true,
      email: true,
      expenseAcc: null,
      collectionAcc: null,
      amount: null,
      date: null,
      remark: null,
      approvedBy: null,
      chequeNo: null,
      openingBalance: 0
    })
  }

  chequeFormGenerator = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Amount</label>
          </Grid>
          <Grid item xs='3'>
            <input type='number' placeholder='Amount'
              value={this.state.amount ? this.state.amount : ''}
              className={classes.form__inputAmount}
              onChange={this.amountChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Date</label>
          </Grid>
          <Grid item xs='3'>
            <input type='date'
              value={this.state.date ? this.state.date : ''}
              className={classes.form__inputAmount + ' ' + classes.datePicker}
              onChange={this.dateChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Cheque Number</label>
          </Grid>
          <Grid item xs='3'>
            <input type='text' placeholder='Cheque Number'
              value={this.state.chequeNo ? this.state.chequeNo : ''}
              className={classes.form__inputAmount}
              onChange={this.chequeNoChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Remarks</label>
          </Grid>
          <Grid item xs='3'>
            <input placeholder='Remarks' type='text'
              className={classes.form__inputAmount}
              value={this.state.remark ? this.state.remark : ''}
              onChange={this.remarkChangeHandler} />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  onlineFormGenerator = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Amount</label>
          </Grid>
          <Grid item xs='3'>
            <input type='number'
              placeholder='Amount'
              className={classes.form__inputAmount}
              value={this.state.amount ? this.state.amount : ''}
              onChange={this.amountChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Date</label>
          </Grid>
          <Grid item xs='3'>
            <input type='date'
              className={classes.form__inputAmount + ' ' + classes.datePicker}
              value={this.state.date ? this.state.date : ''}
              onChange={this.dateChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Remarks</label>
          </Grid>
          <Grid item xs='3'>
            <input placeholder='Remarks' type='text'
              className={classes.form__inputAmount}
              value={this.state.remark ? this.state.remark : ''}
              onChange={this.remarkChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Approved By Whom</label>
          </Grid>
          <Grid item xs='3'>
            <input placeholder='Approved By Whom' type='text'
              className={classes.form__inputAmount}
              value={this.state.approvedBy ? this.state.approvedBy : ''}
              onChange={this.approvedByChangeHandler} />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <input type='checkbox' value='email'
              checked={this.state.email} id='email'
              onChange={this.onEmailCheckHandler}
              style={{ marginLeft: '35px' }} />
            <label htmlFor='email' className={classes.label__emailSms}>Send Email</label>
          </Grid>
          <Grid item xs='3'>
            <input type='checkbox' value='sms'
              checked={this.state.sms} id='sms'
              onChange={this.onSmsCheckHandler} />
            <label htmlFor='email' className={classes.label__emailSms}>Send SMS</label>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  render () {
    let remainingForm = null

    if (this.state.cheque) {
      remainingForm = this.chequeFormGenerator()
    } else if (this.state.onlineTransfer) {
      remainingForm = this.onlineFormGenerator()
    }

    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Transfer From</label>
          </Grid>
          <Grid item xs='3'>
            <Select
              placeholder='Select Collection Account'
              value={this.state.collectionAcc ? ({
                value: this.state.collectionAcc.id,
                label: this.state.collectionAcc.bank_name
              }) : null}
              options={
                this.props.collectionAccounts.length
                  ? this.props.collectionAccounts.map(bank => ({ value: bank.bank_name.id, label: bank.bank_name.bank_name })
                  ) : []}
              onChange={this.collectionAccChangeHandler}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Transfer To </label>
          </Grid>
          <Grid item xs='3'>
            <Select
              placeholder='Select Expense Account'
              value={this.state.expenseAcc ? ({
                value: this.state.expenseAcc.id,
                label: this.state.expenseAcc.bank_name
              }) : null}
              options={
                this.props.expenseAccounts.length
                  ? this.props.expenseAccounts.map(bank => ({ value: bank.bank_name.id, label: bank.bank_name.bank_name })
                  ) : []}
              onChange={this.expenseAccChangeHandler}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Deposit Mode</label>
          </Grid>
          <Grid item xs='3'>
            <div>
              <input type='radio' id='cheque' name='dipositMode' value='cheque'
                onChange={this.chequeCheckHandler}
                checked={this.state.cheque} />
              <label htmlFor='cheque' className={classes.label__mode}>Cheque</label>
            </div>
            <div>
              <input type='radio' id='online' name='dipositMode' value='onlineTransfer'
                onChange={this.onlineCheckHandler}
                checked={this.state.onlineTransfer} />
              <label htmlFor='online' className={classes.label__mode}>Online Transfer</label>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>Opening Balance</label>
          </Grid>
          <Grid item xs='3'>
            <p className={classes.form__opening}><strong>{this.state.openingBalance}</strong></p>
          </Grid>
        </Grid>
        {remainingForm}
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              onClick={this.saveExpenseDiposit}
              style={{ marginLeft: '40px' }}
            >Save</Button>
          </Grid>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  dataLoading: state.finance.common.dataLoader,
  expenseAccounts: state.finance.expenseMngmt.deposit.expenseAccounts,
  collectionAccounts: state.finance.expenseMngmt.deposit.collectionAccounts
})

const mapDispatchToProps = (dispatch) => ({
  fetchAllAccounts: (session, branchId, user, alert) => dispatch(actionTypes.fetchAllAccounts({ session, branchId, user, alert })),
  saveExpenseDeposit: (session, branchId, expenseAcc, collectionAcc, mode, amount, date, remark, chequeNo, approvedBy, email, sms, user, alert) => dispatch(actionTypes.saveExpenseDeposit({ session, branchId, expenseAcc, collectionAcc, mode, amount, date, remark, chequeNo, approvedBy, email, sms, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpenseDeposit)
