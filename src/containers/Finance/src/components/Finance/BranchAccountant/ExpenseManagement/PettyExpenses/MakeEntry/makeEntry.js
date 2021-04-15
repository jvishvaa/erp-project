import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Grid } from 'semantic-ui-react'

import { withStyles, Button, CircularProgress, Grid } from '@material-ui/core/'
import Radio from '@material-ui/core/Radio'
import Select from 'react-select'
import {
  DeleteForeverOutlined as DeleteForeverOutlinedIcon
} from '@material-ui/icons'

import classes from './makeEntry.module.css'
import * as actionTypes from '../../../../store/actions'
import Layout from '../../../../../../../../Layout'
// import { CircularProgress } from '../../../../../../ui'


const styles = theme => ({
  root: {
    color: theme.palette.text.primary
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    '&:hover': {
      cursor: 'pointer'
    }
  }

})

const customStyles = () => {
  return {
    valueContainer: (base) => ({
      ...base,
      height: '38px',
      'min-height': '38px',
      'line-height': '38px'
    }),
    control: (base, state) => ({
      ...base,
      height: '38px',
      'min-height': '38px',
      'line-height': '38px'
    }),
    indicatorsContainer: provided => ({
      ...provided,
      padding: 4
    }),
    input: base => ({
      ...base,
      height: '38px',
      'min-height': '38px',
      'line-height': '38px'
    })
  }
}

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
class MakeEntry extends Component {
  state = {
    ledgerCount: 0,
    ledgerData: [],
    ledgerRow: [],
    paymentOption: 'cash',
    selectedBank: null,
    chequeNo: null,
    chequeDate: null,
    approvedBy: null,
    date: null,
    paidTo: null,
    file: [],
    selectedParty: null,
    selectedSession: null
  }
  
  componentDidMount () {
    const ledgerData = [...this.state.ledgerData]
    const data = {
      ledgerType: null,
      ledgerHead: null,
      ledgerName: null,
      narration: null,
      amount: null
    }
    ledgerData.push(data)
    this.setState({
      ledgerData
    })
    this.props.fetchPettyCash(this.props.user, this.props.alert, this.props.recData && this.props.recData.branch)
    this.props.fetchPartyList(this.props.user, this.props.alert, this.props.recData && this.props.recData.branch )
  }

  addLedgerRow = () => {
    const ledgerData = [...this.state.ledgerData]
    const data = {
      ledgerType: null,
      ledgerHead: null,
      ledgerName: null,
      narration: null,
      amount: null
    }
    ledgerData.push(data)
    this.setState({
      ledgerData
    })
  }

  deleteLedgerRow = (index) => {
    const ledgerData = [...this.state.ledgerData]
    ledgerData.splice(index, 1)
    this.setState({
      ledgerData
    })
  }

  fetchLedgerRecord = (e, i) => {
    this.props.fetchLedgerRecord(e.value, this.props.user, this.props.alert)
    const ledgerData = [...this.state.ledgerData]
    const data = { ...ledgerData[i] }
    data.ledgerType = e
    ledgerData[i] = data
    this.setState({
      ledgerData
    })
  }

  ledgerHeadChangeHandler = (e, i) => {
    this.props.fetchLedgerName(e.value, this.props.user, this.props.alert)
    const ledgerData = [...this.state.ledgerData]
    const data = { ...ledgerData[i] }
    data.ledgerHead = e
    ledgerData[i] = data
    this.setState({
      ledgerData
    })
  }

  ledgerDataChangeHandler = (e, i) => {
    const ledgerData = [...this.state.ledgerData]
    const data = { ...ledgerData[i] }
    data[e.target.name] = e.target.value
    ledgerData[i] = data
    this.setState({
      ledgerData
    })
  }

  ledgerNameChangeHandler = (e, i) => {
    const ledgerData = [...this.state.ledgerData]
    const data = { ...ledgerData[i] }
    data.ledgerName = e
    ledgerData[i] = data
    this.setState({
      ledgerData
    })
  }

  paymentOptionChangeHandler = (e) => {
    this.setState({
      paymentOption: e.target.value,
      selectedBank: null
    })
  }

  changeSelectedBankHandler = (e) => {
    const bank = this.props.pettyCashAccountsList.filter(item => +item.id === +e.value)[0]
    if (!bank.balance || this.calculateTotal() > +bank.balance) {
      this.props.alert.warning('Bank Balance is Insufficient')
      return
    }
    this.setState({
      selectedBank: e
    })
  }

  changeDataHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  changeFileHandler = (e) => {
    const newFile = [...this.state.file, ...Array.from(e.target.files)]
    this.setState({
      file: newFile
    })
  }

  fileDeleteHandler = (index) => {
    const files = this.state.file.filter((_, i) => index !== i)
    this.setState({
      file: files
    })
  }

  changePartyHandler = (e) => {
    this.setState({
      selectedParty: e
    })
  }

  changeSessionHandler = (e) => {
    this.setState({
      selectedSession: e.value
    })
  }

  calculateTotal = () => {
    let total = 0
    this.state.ledgerData.forEach(item => {
      total += item.amount ? +item.amount : 0
    })
    return total
  }

  getPaymentModeCode = () => {
    if (this.state.paymentOption === 'cash') { return 1 } else if (this.state.paymentOption === 'cheque') { return 2 } else { return 3 }
  }

  saveDataHandler = () => {
    const form = new FormData()
    let error = false
    let totalAmount = 0
    const ledgerData = this.state.ledgerData.map(item => {
      if (!item.ledgerType || !item.ledgerHead || !item.ledgerName || !item.narration || !item.amount) {
        error = true
      }
      totalAmount += item.amount ? +item.amount : 0
      return {
        ledger_type: item.ledgerType && item.ledgerType.value,
        ledger_head: item.ledgerHead && item.ledgerHead.value,
        ledger_name: item.ledgerName && item.ledgerName.value,
        narration: item.narration,
        amount: item.amount
      }
    })
    if (error) {
      this.props.alert.warning('Please Fill all the Ledger Details')
      return
    }
    if (!this.state.approvedBy || !this.state.date || !this.state.selectedParty || !this.state.selectedSession) {
      this.props.alert.warning('Please Fill all Details')
      return
    }
    this.state.file.forEach(file => {
      form.append('file', file)
    })
    form.append('add_ledger', JSON.stringify(ledgerData))
    form.append('total_amount', totalAmount)
    form.append('payment_mode', this.getPaymentModeCode())
    form.append('paid_to', this.state.selectedParty.value)
    form.append('approved_by', this.state.approvedBy)
    form.append('date', this.state.date)
    form.append('academic_year', this.state.selectedSession)
    if (this.state.paymentOption === 'cheque') {
      if (!this.state.chequeNo || !this.state.selectedBank || !this.state.chequeDate) {
        this.props.alert.warning('Please Fill all Details')
        return
      }
      form.append('cheque_no', this.state.chequeNo)
      form.append('bank', this.state.selectedBank.value)
      form.append('cheque_date', this.state.chequeDate)
    } else if (this.state.paymentOption === 'online') {
      if (!this.state.selectedBank) {
        this.props.alert.warning('Please Fill all Details')
        return
      }
      form.append('bank', this.state.selectedBank.value)
    }
    this.props.savePettyCashExpense(form, this.props.user, this.props.alert)
    const data = {
      ledgerType: null,
      ledgerHead: null,
      ledgerName: null,
      narration: null,
      amount: null
    }
    this.setState({
      ledgerCount: 0,
      ledgerData: [{ ...data }],
      ledgerRow: [],
      paymentOption: 'cash',
      selectedBank: null,
      chequeNo: null,
      chequeDate: null,
      approvedBy: null,
      date: null,
      paidTo: null,
      file: [],
      selectedParty: null,
      selectedSession: null
    })
  }

  pymntBasedView = () => {
    let view = null
    const accounts = this.props.pettyCashAccountsList
    const { paymentOption } = this.state
    if (paymentOption === 'cheque') {
      view = (
        <React.Fragment>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              Bank Name :
            </Grid>
            <Grid item xs={8}>
              <Select
                placeholder='Select Bank'
                value={this.state.selectedBank ? ({
                  value: this.state.selectedBank.value,
                  label: this.state.selectedBank.label
                }) : null}
                options={
                  accounts.length
                    ? accounts.map(type => ({ value: type.id, label: type.bank_name })
                    ) : []}
                onChange={this.changeSelectedBankHandler}
              />
            </Grid>

            <Grid item xs={4}>
              Cheque / DD No :
            </Grid>
            <Grid item xs={8}>
              <input type='text'
                className={classes.table__input}
                name='chequeNo'
                value={this.state.chequeNo || ''}
                onChange={this.changeDataHandler}
              />
            </Grid>

            <Grid item xs={4}>
              Cheque Date :
            </Grid>
            <Grid item xs={8}>
              <input type='date'
                className={classes.table__input}
                name='chequeDate'
                style={{ width: '50%' }}
                value={this.state.chequeDate || ''}
                onChange={this.changeDataHandler}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      )
    }
    if (paymentOption === 'online') {
      view = (
        <React.Fragment>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              Bank Name :
            </Grid>
            <Grid item xs={8}>
              <Select
                placeholder='Select Bank'
                value={this.state.selectedBank ? ({
                  value: this.state.selectedBank.value,
                  label: this.state.selectedBank.label
                }) : null}
                options={
                  accounts.length
                    ? accounts.map(type => ({ value: type.id, label: type.bank_name })
                    ) : []}
                onChange={this.changeSelectedBankHandler}
              />
            </Grid>

          </Grid>
        </React.Fragment>
      )
    }
    return view
  }

  render () {
    let circularProgress = null
    if (this.props.dataLoading) {
      circularProgress = (
        <CircularProgress open />
      )
    }
    const ledgerRow = this.state.ledgerData.map((item, index) => (
      <div className={classes.makeentry__tableBody} key={index}>
        <div className={classes.bodyType}>
          <Select
            placeholder='Select Type'
            styles={customStyles()}
            value={item.ledgerType ? ({
              value: item.ledgerType.value,
              label: item.ledgerType.label
            }) : null}
            options={
              this.props.ledgerTypeList.length
                ? this.props.ledgerTypeList.map(type => ({ value: type.id, label: type.ledger_type_name })
                ) : []}
            onChange={(e) => this.fetchLedgerRecord(e, index)}
          />
        </div>
        <div className={classes.bodyHead}>
          <Select
            placeholder='Select Head'
            styles={customStyles()}
            value={item.ledgerHead ? ({
              value: item.ledgerHead.value,
              label: item.ledgerHead.label
            }) : null}
            onChange={(e) => this.ledgerHeadChangeHandler(e, index)}
            options={
              this.props.leadgerHeadList.map(type => ({ value: type.id, label: type.account_head_name })
              )}
          />
        </div>
        <div className={classes.bodyName}>
          <Select
            placeholder='Select Name'
            styles={customStyles()}
            value={item.ledgerName ? ({
              value: item.ledgerName.value,
              label: item.ledgerName.label
            }) : null}
            onChange={(e) => this.ledgerNameChangeHandler(e, index)}
            options={
              this.props.ledgerNameList.map(type => ({ value: type.id, label: type.ledger_account })
              )}
          />
        </div>
        <div className={classes.bodyNarration}><input type='text'
          className={classes.table__input}
          name='narration'
          value={item.narration || ''}
          onChange={(event) => this.ledgerDataChangeHandler(event, index)} />
        </div>
        <div className={classes.bodyAmount}><input type='text'
          className={classes.table__input}
          name='amount'
          value={item.amount || ''}
          onChange={(event) => this.ledgerDataChangeHandler(event, index)} />
        </div>
        <div className={classes.bodyAction}>
          {index > 0 ? <div className={classes.bodyAction__icon}><DeleteForeverOutlinedIcon className={classes.icon} onClick={() => this.deleteLedgerRow(index)} /></div> : null}
        </div>
      </div>
    ))
    return (
      <Layout>      
        <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='8'>
              <label className='student-addStudent-segment1-heading'
                style={{ display: 'inline-block', height: '100%', paddingTop: '10px', paddingLeft: '50px' }}>
                Voucher Type : <span style={{ color: 'red', fontWeight: 'bolder' }}>Payment</span>
              </label>
            </Grid>
            <Grid item xs='4' >
              <Button variant='contained' color='primary' onClick={this.addLedgerRow}>
                Add Ledger
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
            <div className={classes.makeentry__table}>
              <div className={classes.makeentry__tableHeader}>
                <div className={classes.headerType}>Ledger Type</div>
                <div className={classes.headerHead}>Ledger Head</div>
                <div className={classes.headerName}>Ledger Name</div>
                <div className={classes.headerNarration}>Narration</div>
                <div className={classes.headerAmount}>Amount</div>
                <div className={classes.headerAction}>Action</div>
              </div>
              {ledgerRow}
            </div>
            </Grid>
          </Grid>
        <div className={classes.contentContainer}>
          <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'
                className={classes.textInMiddle}
              >
                Total Amount:
              </Grid>
              <Grid item xs='1'
                className={classes.textInMiddle}
              >
                :
              </Grid>
              <Grid item xs='8'
                className={classes.textInMiddle}
              >
                {this.calculateTotal()}
              </Grid>
              <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'      >
                Financial Year
              </Grid>
              <Grid item xs='1'
                className={classes.selectLabel}
              >
                :
              </Grid>
              <Grid item xs='8'
              >
                <Select
                  placeholder='Select Year'
                  value={this.state.selectedSession ? ({
                    value: this.state.selectedSession,
                    label: this.state.selectedSession
                  }) : null}
                  options={
                    this.props.session.length ? this.props.session.map(type => ({ value: type.session_year, label: type.session_year })
                    ) : []}
                  onChange={this.changeSessionHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'
                className={classes.textInMiddle}
              >
                Payment Mode
              </Grid>
              <Grid item xs= '1'
                className={classes.textInMiddle}
              >
                :
              </Grid>
              <Grid item xs='2'
              >
                <Radio
                  checked={this.state.paymentOption === 'cash'}
                  onChange={this.paymentOptionChangeHandler}
                  value='cash'
                  name='radio-button-demo'
                  inputProps={{ 'aria-label': 'A' }}
                />
                <label>Cash</label>
              </Grid>
              <Grid item xs='2'
              >
                <Radio
                  checked={this.state.paymentOption === 'cheque'}
                  onChange={this.paymentOptionChangeHandler}
                  value='cheque'
                  name='radio-button-demo'
                  inputProps={{ 'aria-label': 'A' }}
                />
                <label>Cheque</label>
              </Grid>
              <Grid item xs='2'
              >
                <Radio
                  checked={this.state.paymentOption === 'online'}
                  onChange={this.paymentOptionChangeHandler}
                  value='online'
                  name='radio-button-demo'
                  inputProps={{ 'aria-label': 'A' }}
                />
                <label>Online / Internet</label>
              </Grid>
            </Grid>
            {this.pymntBasedView()}
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'
                floated='left'
                computer={2}
                mobile={2}
                tablet={2}
                className={classes.selectLabel}
              >
                Paid To
              </Grid>
              <Grid item xs='1'
                className={classes.selectLabel}
              >
                :
              </Grid>
              <Grid item xs='8' >
                <Select
                  placeholder='Select Party'
                  value={this.state.selectedParty ? ({
                    value: this.state.selectedParty.value,
                    label: this.state.selectedParty.label
                  }) : null}
                  options={
                    this.props.partyList.map(type => ({ value: type.id, label: type.party_name })
                    )}
                  onChange={this.changePartyHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'
                className={classes.selectLabel}
              >
                Approved By
              </Grid>
              <Grid item xs='1'
                className={classes.selectLabel}
              >
                :
              </Grid>
              <Grid item xs='8'
              >
                <input
                  name='approvedBy'
                  className={classes.table__input}
                  value={this.state.approvedBy || ''}
                  onChange={this.changeDataHandler}
                />
              </Grid>
              <Grid item xs='3'>
                Date
              </Grid>
              <Grid item xs='1'
                className={classes.selectLabel}
              >
                :
              </Grid>
              <Grid item xs='8'
              >
                <input
                  type='date'
                  className={classes.table__input}
                  name='date'
                  value={this.state.date || ''}
                  onChange={this.changeDataHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='3'
                className={classes.selectLabel}
              >
                Attachment
              </Grid>
              <Grid item xs='1'
                className={classes.selectLabel}
              >
                :
              </Grid>
              <Grid item xs='8'
              >
                <input
                  type='file'
                  // value={this.state.file}
                  multiple
                  onChange={this.changeFileHandler}
                  style={{ width: '30%', paddingTop: '5px' }}
                  className={classes.table__input}
                />
                <span>No. of File(s): {this.state.file.length}</span>
                {
                  this.state.file.map((file, index) => {
                    return (
                      <div className={classes.fileData} key={file.name}>
                        <div style={{ width: '70%' }}>
                          {file.name.length > 13
                            ? file.name.slice(0, 10).trim().padEnd(13, '.')
                            : file.name}
                        </div>
                        <div className={classes.fileDelete}>
                          <DeleteForeverOutlinedIcon
                            onClick={() => this.fileDeleteHandler(index)} />
                        </div>
                      </div>
                    )
                  })
                }
                {/* <div className={classes.fileData}>File 1</div>
                <div className={classes.fileData}>File 2</div> */}
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='12'
                floated='center'
              >
                <Button variant='contained' color='primary' onClick={this.saveDataHandler}>
                  Record
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
        {circularProgress}
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  ledgerTypeList: state.finance.common.ledgerType,
  session: state.finance.common.financialYear,
  pettyCashAccounts: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.pettyCashAccounts,
  pettyCashAccountsList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.pettyCashAccountsList,
  dataLoading: state.finance.common.dataLoader,
  leadgerHeadList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.ledgerHeadList,
  ledgerNameList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.ledgerNameList,
  partyList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.partyList,
  recData: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.sendData
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear(moduleId)),
  loadLedgerType: dispatch(actionTypes.fetchLedgerType()),
  fetchLedgerRecord: (ledgerType, user, alert) => dispatch(actionTypes.fetchLedgerRecord({ ledgerType, user, alert })),
  fetchLedgerName: (headId, user, alert) => dispatch(actionTypes.fetchLedgerName({ headId, user, alert })),
  fetchPettyCash: (user, alert, branch) => dispatch(actionTypes.listPettyCash({ user, alert, branch })),
  savePettyCashExpense: (body, user, alert) => dispatch(actionTypes.savePettyCashExpense({ body, alert, user })),
  fetchPartyList: (user, alert, branch) => dispatch(actionTypes.fetchPartyList({ user, alert, branch }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MakeEntry))
