import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import {
  Typography,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Modal
} from '@material-ui/core'

import {
  AddBox
} from '@material-ui/icons'

import classes from './pettyExpenses.module.css'
import * as actionTypes from '../../../store/actions'
// import {  Modal } from '../../../../../ui'
import Layout from '../../../../../../../Layout'


const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Expanse Management' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Petty Cash Expense') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
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
class PettyExpenses extends Component {
  state = {
    addMoneyModal: false,
    selectedBank: null,
    amount: null,
    narration: null,
    chequeNo: null,
    approvedBy: null,
    date: null,
    selectedSession: null
  }
  componentDidMount () {
    // this.props.fetchPettyCashAcc(this.props.user)
    // this.props.listCashOpeningBalance(this.props.user, this.props.alert)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      this.props.fetchPettyCashAcc(this.props.user, this.state.session, this.state.selectedBranches?.value)
    }
  }

  makeEntryClickHandler = () => {
    // this.props.history.push('/finance/Expanse Management/MakeEntry')
    if (this.state.session &&  this.state.selectedBranches) {
    this.props.history.push({
      pathname: '/finance/Expanse Management/MakeEntry',
      state: {
        branch: this.state.selectedBranches && this.state.selectedBranches.value
      }
    })
  } else {
     this.props.alert.warning('Please Select Year and Branch!')
  }
    let data = {
      branch:this.state.selectedBranches && this.state.selectedBranches.value,
      moduleId:moduleId
    }
    this.props.sendData(data, this.props.alert, this.props.user)
  }

  bankAccClickHandler = (id) => {
    // this.props.history.push(`/finance/Expanse Management/BankReport${id}`)
    // this.props.history.push(`/finance/Expanse Management/BankReport`)
  }

  cashClickHandler = (id) => {
    this.props.history.push(`/finance/Expanse Management/CashReport`)
  }
  selectedSessionChangeHandler = (e) => {
    this.setState({
      selectedSession: e.target.value
    })
  }

  ledgerReportClickHandler = () => {
    if (this.state.session &&  this.state.selectedBranches) {
    this.props.history.push('/finance/Expanse Management/LedgerReport')
    let data = {
      branch:this.state.selectedBranches && this.state.selectedBranches.value,
      moduleId:moduleId
    }
    this.props.sendData(data, this.props.alert, this.props.user)
  } else {
    this.props.alert.warning('Please Select Year and Branch!')
 }
  }

  reportClickHandler = () => {
    if (this.state.session &&  this.state.selectedBranches) {
    this.props.history.push('/finance/Expanse Management/FinancialLedgerReport')
    let data = {
      branch:this.state.selectedBranches && this.state.selectedBranches.value,
      moduleId:moduleId
    }
    this.props.sendData(data, this.props.alert, this.props.user) 
  } else {
    this.props.alert.warning('Please Select Year and Branch!')
 }
  }

  addMoneyHandler = (e) => {
    this.setState({
      addMoneyModal: true
    })
    e.stopPropagation()
  }

  hideMoneyModalHandler = () => {
    this.setState({
      addMoneyModal: false
    })
  }

  bankChangeHandler = (e) => {
    this.setState({
      selectedBank: e.target.value
    })
  }

  cashModalChangeHandler = (e) => {
    // const amountValue = e.target.value
    if (e.target.name === 'amount' && e.target.value < 0) {
      this.props.alert.warning('Value should be greater then 0!')
      return
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  saveCashWithdraw = () => {
    const {
      selectedBank,
      selectedSession,
      amount,
      narration,
      chequeNo,
      approvedBy,
      date
    } = this.state
    const {
      user,
      alert
    } = this.props

    if (!selectedSession ||
      !selectedBank ||
      !amount ||
      !narration ||
      !chequeNo ||
      !approvedBy ||
      !date) {
      alert.warning('Fill All Fields')
      return
    }

    const selectedBankAmount = this.props.pettyCashAccounts.filter(item => +item.id === +selectedBank)[0].balance
    if (selectedBankAmount < amount) {
      alert.warning('Insufficient Amount in Selected Bank')
      return
    }
    this.props.saveCashWithdraw(selectedSession,
      selectedBank,
      amount,
      narration,
      chequeNo,
      approvedBy,
      date,
      user,
      alert,
      this.state.selectedBranches  && this.state.selectedBranches.value
    )

    this.setState({
      selectedBank: null,
      amount: null,
      narration: null,
      chequeNo: null,
      approvedBy: null,
      date: null,
      selectedSession: null,
      selectedBranches: null,
      session: '',
      sessionData: ''
    })
  }

  handleAcademicyear = (e) => {
    this.setState({ session: e.value, sessionData: e}, () => {
      this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
    })
  }

  changehandlerbranch = (e) => {
    // this.props.fetchGrades(this.props.alert, this.props.user, moduleId, e.value, this.state.session)
    this.setState({ selectedBranches: e})
    this.props.fetchPettyCashAcc(this.props.user, this.state.session, e.value)
    this.props.listCashOpeningBalance(this.props.user, this.props.alert, this.state.session, e.value)
  }


  render () {
    let bankList = null
    let total = 0
    if (this.props.pettyCashAccounts.length) {
      bankList = this.props.pettyCashAccounts.map(acc => {
        total += acc.balance ? acc.balance : 0
        return (
          <div className={classes.pettyExp__tableBody} key={acc.id} >
              {/* <Link to={{ 
      pathname: '/finance/Expanse Management/BankReport', 
      state: acc.id
      }}>
        {/* <div className={classes.pettyExp__tableBodyBig}>{acc.bank_name}</div>
        <div className={classes.pettyExp__tableBodySmall}>{acc.balance ? acc.balance : 0}</div> */}
        {acc.bank_name}
        {/* {acc.balance ? acc.balance : 0} */}
      {/* </Link> */}
            {/* <div className={classes.pettyExp__tableBodyBig}>{acc.bank_name}</div>  */}
            {/* <div className={classes.pettyExp__tableBodySmall}>{acc.balance ? acc.balance : 0}</div> */}
          </div>
        )
      })
    }
    let moneyModal = null
    if (this.state.addMoneyModal) {
      moneyModal = (
        <Modal
          open={this.state.addMoneyModal}
          onClose={this.hideMoneyModalHandler}
          style={{ padding: '5px', justifyContent: 'center', alignItems: 'center', display: 'flex', maxWidth: '800px', minHeight: '500px', margin: 'auto'}}
          medium
        >
          <React.Fragment>
            <Grid container spacing={3} style={{ padding: 15, background:'white' }}>
              <Grid item xs='12'>         
            <Typography variant='h4' className={classes.modalHeader}>
            Withdraw Money
          </Typography>
          <Divider className={classes.divider} />
          </Grid>
          <Grid item xs='3'>   
          <TextField
            label='Financial Year'
            select
            // className={classes.firstTextField}
            value={this.state.selectedSession || ''}
            margin='normal'
            variant='outlined'
            required
            fullWidth
            onChange={this.selectedSessionChangeHandler}
          >
            {this.props.session.length
              ? this.props.session.map(item => (
                <MenuItem key={item.session_year} value={item.session_year}>
                  {item.session_year}
                </MenuItem>
              )) : []}
          </TextField>
          </Grid>
          <Grid item xs='3'>  
          <TextField
            select
            label='Select Bank'
            value={this.state.selectedBank || ''}
            onChange={this.bankChangeHandler}
            margin='normal'
            variant='outlined'
            fullWidth
            required
          >
            {this.props.pettyCashAccounts.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.bank_name}
              </MenuItem>
            ))}
          </TextField>
          </Grid>
          <Grid item xs='3'>  
          <TextField
            type='number'
            label='Amount'
            value={this.state.amount || ''}
            name='amount'
            min='0'
            onChange={this.cashModalChangeHandler}
            margin='normal'
            variant='outlined'
            fullWidth
            required
          />
          </Grid>
          <Grid item xs='3'>  
          <TextField
            type='text'
            label='Narration'
            value={this.state.narration || ''}
            name='narration'
            onChange={this.cashModalChangeHandler}
            margin='normal'
            variant='outlined'
            multiline
            fullWidth
            required
          />
          </Grid>
          <Grid item xs='3'>  
          <TextField
            type='text'
            label='Cheque No'
            value={this.state.chequeNo || ''}
            name='chequeNo'
            onChange={this.cashModalChangeHandler}
            margin='normal'
            variant='outlined'
            fullWidth
            required
          />
          </Grid>
          <Grid item xs='3'>  
          <TextField
            type='text'
            label='Approved By'
            value={this.state.approvedBy || ''}
            name='approvedBy'
            onChange={this.cashModalChangeHandler}
            margin='normal'
            variant='outlined'
            fullWidth
            required
          />
          </Grid>
          <Grid item xs='3'>  
          <TextField
            type='date'
            required
            label='Date'
            value={this.state.date || ' '}
            name='date'
            onChange={this.cashModalChangeHandler}
            margin='normal'
            variant='outlined'
            fullWidth
          />
          </Grid>
          <Grid item xs='3'>  
            <Button variant='contained' color='primary'
              style={{ display: 'block', margin: 'auto' }}
              onClick={this.saveCashWithdraw}
            >
              Save
            </Button>
          </Grid>
          </Grid>
          </React.Fragment>
        </Modal>
      )
    }
    return (
      <Layout>
      <Grid container spacing={3} style={{ padding: 15 }}>
      <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : ''}
              options={
                this.props.session
                  ? this.props.session && this.props.session.map(session => ({
                    value: session?.session_year,
                    label: session?.session_year
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              // isMulti
              placeholder='Select Branch'
              value={this.state.selectedBranches ? this.state.selectedBranches : ''}
              options={
                this.state.selectedbranchIds !== 'all' ? this.props.branches.length && this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : [] : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
          </Grid>
          <div>
        <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='1'>
            </Grid>
            <Grid item xs='3'>
              <Button variant='contained' color='primary' onClick={this.makeEntryClickHandler}>
                Make Entry
              </Button>
            </Grid>
            <Grid item xs='3'>
              <Button variant='contained' color='primary' onClick={this.reportClickHandler}>
                View Report
              </Button>
            </Grid>
            <Grid item xs='3'>
              <Button variant='contained' color='primary' onClick={this.ledgerReportClickHandler}>
                View Ledger Report
              </Button>
            </Grid>
          <div className={classes.pettyExp__table}>
            <div className={classes.pettyExp__tableHeader}>
              <div className={classes.pettyExp__tableHeaderBig}>Particulars</div>
              <div className={classes.pettyExp__tableHeaderSmall}>Closing Balance</div>
            </div>
            <div className={classes.pettyExp__tableBodyHeading}>
              <div className={classes.pettyExp__tableBodyBig} style={{ color: 'blue', fontWeight: 'bolder' }}>Cash</div>
              <div className={classes.pettyExp__tableBodySmall} style={{ color: 'blue', fontWeight: 'bolder' }}>{this.props.cashInHand}</div>
            </div>
            <div className={classes.pettyExp__tableBody}>
              {/* <div className={classes.pettyExp__tableBodyBig} onClick={this.cashClickHandler}> */}
              <div className={classes.pettyExp__tableBodyBig}>
                <div><span style={{ display: 'inline-block', verticalAlign: 'top' }}>Cash</span>
                  <AddBox color='primary' className={classes.addIcon} onClick={this.addMoneyHandler} /></div>
              </div>
              <div className={classes.pettyExp__tableBodySmall}>{this.props.cashInHand}</div>
            </div>
            <div className={classes.pettyExp__tableBodyHeading}>
              <div className={classes.pettyExp__tableBodyBig} style={{ color: 'blue', fontWeight: 'bolder' }}>Bank</div>
              <div className={classes.pettyExp__tableBodySmall} style={{ color: 'blue', fontWeight: 'bolder' }}>{total}</div>
            </div>
            {bankList}
          </div>
        </Grid>
        {moneyModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  pettyCashAccounts: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.pettyCashAccounts,
  cashInHand: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.cashInHand,
  dataLoading: state.finance.common.dataLoader,
  session: state.finance.common.financialYear,
  // session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
})

const mapDispatchToProps = (dispatch) => ({
  fetchPettyCashAcc: (user, session, branch) => dispatch(actionTypes.fetchPettyCashAcc({ user, session, branch })),
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear(moduleId)),
  listCashOpeningBalance: (user, alert, session, branch) => dispatch(actionTypes.listCashOpeningBalance({ user, alert, session, branch })),
  saveCashWithdraw: (session, bank, amount, narration, chequeNo, approvedBy, date, user, alert, branch) => dispatch(actionTypes.cashWithdraw({ session, bank, amount, narration, chequeNo, approvedBy, date, user, alert, branch })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  sendData: (data, alert, user) => dispatch(actionTypes.sendingData({ data, alert, user})),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PettyExpenses))
