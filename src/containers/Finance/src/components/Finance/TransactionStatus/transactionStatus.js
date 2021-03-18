import React, { Component } from 'react'
import { withStyles, Button, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import Icon from '@material-ui/core/Icon'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'

import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions/index'
import { FilterInnerComponent, filterMethod } from '../FilterInnerComponent/filterInnerComponent'
import Modal from '../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import { urls } from '../../../urls'
import Layout from '../../../../../Layout'

import classes from './transactionStatus.module.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  icon: {
    margin: theme.spacing.unit,
    color: '#327ddf',
    marginTop: '0px',
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

// const MODE = [
//   { id: 3, value: 'Internet' },
//   { id: 2, value: 'Cheque' },
//   { id: 1, value: 'Cash' },
//   { id: 4, value: 'Swipe' },
//   { id: 5, value: 'Online' }
// ]

const FEE_TYPE = [
  { id: 1, value: 'Normal Fee' },
  // { id: 3, value: 'Store' },
  { id: 2, value: 'Other Fee' }
]
// let transactionState = null


const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Reports' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Transactions Report') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
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
class TransactionStatus extends Component {
  state = {
    currentSession: null,
    fromDate: new Date().toISOString().substr(0, 10),
    toDate: new Date().toISOString().substr(0, 10),
    currentBranch: null,
    selectedModes: null,
    page: 0,
    showViewModal: false,
    selectedTransactionId: null,
    showEditModal: false,
    currentBankClearance: false,
    currentCancelled: false,
    currentCollected: false,
    currentPaid: false,
    isAccountant: false,
    selectedFees: null,
    selectedFeePlans: null,
    feeAccId: '',
    feeAccData: [],
    paymentModeId: [],
    paymentModeData: []
  }

  componentDidMount () {
    // if (transactionState !== null) {
    //   this.setState(transactionState)
    // }
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const isAccountant = userProfile.personal_info.role.toLowerCase() === 'financeaccountant'
    this.setState({
      isAccountant
    })
  }

  componentWillUnmount () {
    // console.log('unmount reports')
    this.props.clearProps()
    // console.log('unmount state', this.state)
    this.setState({
      currentSession: null,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      currentBranch: null,
      selectedModes: null,
      page: 0,
      showViewModal: false,
      selectedTransactionId: null,
      showEditModal: false,
      currentBankClearance: false,
      currentCancelled: false,
      currentCollected: false,
      currentPaid: false,
      isAccountant: false,
      selectedFees: null,
      selectedFeePlans: null,
      feeAccId: '',
      feeAccData: [],
      paymentModeId: [],
      paymentModeData: []
    })
  }

  createData = () => {
    let dataToShow = []
    dataToShow = this.props.transactionDetails.results.map((transaction, index) => {
      return {
        sNo: index,
        transaction_id: transaction.transaction_id,
        student_name: transaction.student.name,
        student_erp: transaction.student.erp,
        student_grade: transaction.student.grade.grade + ' (' + transaction.student.section.section_name + ')',
        paid_date: transaction.paid_date,
        status: transaction.is_bank_clearance_done ? 'Bank Clearance Done' : (transaction.is_cancelled ? 'Cancelled' : (transaction.is_collected ? 'Collected' : 'Paid')),
        amount: transaction.amount,
        id: transaction.id,
        icon: <div className={classes.table__editIcon} onClick={() => this.showEditModalHandler(transaction.id)}><Icon >edit</Icon></div>
      }
    })
    return dataToShow
  }

  fetchBranchHandler = (e) => {
    if (!this.state.isAccountant) {
      this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
    }
    this.setState({
      currentSession: e.value
    }, () => {
      if (this.state.isAccountant) {
        this.props.fetchFeePlans(this.state.currentSession, null, this.props.user, this.props.alert)
      }
    })
  }

  branchChangeHandler = (e) => {
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    }, () => {
      this.props.fetchFeePlans(this.state.currentSession, this.state.currentBranch.id, this.props.user, this.props.alert)
    })
  }

  // modeChangeHandler = (e) => {
  //   this.setState({
  //     selectedModes: e
  //   })
  //   console.log(e)
  // }

  changePaymentMode = (e) => {
    const allLabel = e && e.filter(event => {
      return event && event.label === 'All'
    })
    let ids = []
    if (allLabel && allLabel.length === 1) {
      const allPayment = {
        value: 'all',
        label: 'All'
      }
      this.setState({
        paymentModeId: 'all', paymentModeData: allPayment
      }, () => {
        console.log('-all payment-----------', this.state.paymentModeId)
        console.log('-all payment-----------', this.state.paymentModeData)
      })
    } else {
      e && e.forEach(payment => {
        ids.push(payment.value)
      })
      this.setState({ paymentModeId: ids, paymentModeData: e })
    }
  }

  feePlanChangeHandler = (e) => {
    const allLabel = e && e.filter(event => {
      return event && event.label === 'All Fee Accounts'
    })
    let ids = []
    if (allLabel && allLabel.length === 1) {
      console.log('All Fee Account')
      const allFeeAccs = {
        value: 'all',
        label: 'All Fee Accounts'
      }
      this.setState({
        feeAccData: allFeeAccs,
        feeAccId: 'all'
      }, () => {
        console.log('-all fee accs-----------', this.state.feeAccData)
        console.log('-all fee accs ids-----------', this.state.feeAccId)
      })
    } else {
      e && e.forEach(fee => {
        ids.push(fee.value)
      })
      this.setState({ feeAccData: e, feeAccId: ids }, () => {
        console.log('-all fee accs-----------', this.state.feeAccData)
        console.log('-all fee accs ids-----------', this.state.feeAccId)
      })
    }
  }

  feeChangeHandler = (e) => {
    this.setState({
      selectedFees: e
    })
  }

  fromDateChangeHandler = (e) => {
    this.setState({
      fromDate: e.target.value
    })
  }

  toDateChangeHandler = (e) => {
    this.setState({
      toDate: e.target.value
    })
  }

  fetchAllTransactionHandler = (page = 0) => {
    const {
      currentSession,
      currentBranch,
      paymentModeId,
      selectedFees,
      toDate,
      fromDate,
      isAccountant,
      feeAccId
    } = this.state
    const {
      user,
      alert
    } = this.props
    // const modeIds = selectedModes && selectedModes.map(mode => mode.value)
    const feeIds = selectedFees && selectedFees.map(fee => fee.value)
    // const feePlanIds = selectedFeePlans && selectedFeePlans.map(plan => plan.value)
    // transactionState = this.state
    if (!currentSession || (!paymentModeId || paymentModeId.length === 0) || (!feeIds || feeIds.length === 0) || (!feeAccId || feeAccId.length === 0) || (!isAccountant && currentBranch === null)) {
      this.props.alert.warning('Please Fill all the details')
      return
    }
    if (fromDate > toDate) {
      this.props.alert.warning('From Date Should Not Be Greater than To Date')
      return
    }
    this.props.fetchAllTransaction(currentSession, !isAccountant ? currentBranch.id : null, isAccountant, paymentModeId, feeIds, feeAccId, fromDate, toDate, page, user, alert)
  }

  downloadReportHandler = () => {
    const {
      currentSession,
      currentBranch,
      paymentModeId,
      selectedFees,
      toDate,
      fromDate,
      isAccountant,
      feeAccId
    } = this.state
    const {
      user,
      alert
    } = this.props
    // const modeIds = selectedModes && selectedModes.map(mode => mode.value)
    const feeIds = selectedFees && selectedFees.map(fee => fee.value)
    // const feePlanIds = selectedFeePlans && selectedFeePlans.map(plan => plan.value)
    // transactionState = this.state
    if (!currentSession || (!paymentModeId || paymentModeId.length === 0) || (!feeIds || feeIds.length === 0) || (!feeAccId || feeAccId.length === 0) || (!isAccountant && currentBranch === null)) {
      this.props.alert.warning('Please Fill all the details')
      return
    }
    if (fromDate > toDate) {
      this.props.alert.warning('From Date Should Not Be Greater than To Date')
      return
    }

    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const role = userProfile.personal_info.role.toLowerCase()
    const data = {
      fee_accounts: feeAccId,
      academic_year: currentSession,
      from_date: fromDate,
      to_date: toDate,
      payment_modes: paymentModeId,
      type: feeIds,
      is_effective: false,
      is_issued_date: true
    }

    if (role === 'financeadmin') {
      data.branch_id = [currentBranch.id]
    }
    const url = urls.FDSReport
    const reportName = 'fee_day_sheet.xlsx'
    this.props.downloadReport(url, data, reportName, user, alert)
    this.setState({
      currentSession: null,
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      currentBranch: null,
      selectedModes: null,
      page: 0,
      selectedFees: null,
      selectedFeePlans: null,
      feeAccId: '',
      feeAccData: [],
      paymentModeId: [],
      paymentModeData: []
    })
    this.props.clearProps()
  }

  showViewModalHandler = (transactionId) => {
    this.setState({
      showViewModal: true,
      selectedTransactionId: transactionId
    })
  }

  hideViewModalHandler = () => {
    this.setState({
      showViewModal: false,
      selectedTransactionId: null
    })
  }

  showEditModalHandler = (transactionId) => {
    const index = this.props.transactionDetails.results.findIndex(transaction => {
      return transaction.id === transactionId
    })
    const requiredTransaction = { ...this.props.transactionDetails.results[index] }
    const currentBankClearance = requiredTransaction.is_bank_clearance_done
    const currentCancelled = requiredTransaction.is_cancelled
    const currentCollected = requiredTransaction.is_collected
    const currentPaid = requiredTransaction.is_paid
    this.setState({
      showEditModal: true,
      selectedTransactionId: transactionId,
      currentBankClearance,
      currentCancelled,
      currentCollected,
      currentPaid
    })
  }

  hideEditModalHandler = () => {
    this.setState({
      showEditModal: false,
      selectedTransactionId: null
    })
  }

  checkboxChangeHandler = (e) => {
    switch (e.target.name) {
      case 'currentBankClearance': {
        this.setState({
          [e.target.name]: e.target.checked,
          currentCancelled: false
        })
        break
      }
      case 'currentCollected': {
        this.setState({
          [e.target.name]: e.target.checked,
          currentCancelled: false
        })
        break
      }
      case 'currentCancelled': {
        this.setState({
          [e.target.name]: e.target.checked,
          currentCollected: false,
          currentBankClearance: false
        })
        break
      }
      default: {

      }
    }
  }

  createViewModalData = () => {
    if (!this.state.selectedTransactionId) {
      return null
    }
    const index = this.props.transactionDetails.results.findIndex(transaction => {
      return transaction.id === this.state.selectedTransactionId
    })
    const requiredTransaction = { ...this.props.transactionDetails.results[index] }
    return (
      <div className={classes.modal__body}>
        {requiredTransaction.transaction_id !== null ? <div> <span className={classes.modal__bodyHeading}>Transaction : </span><span className={classes.modal__bodyDetail}> {requiredTransaction.transaction_id} </span></div> : null}
        {requiredTransaction.amount !== null ? <div> <span className={classes.modal__bodyHeading}>Amount : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.amount}</span></div> : null}
        {requiredTransaction.date_of_receipt !== null ? <div> <span className={classes.modal__bodyHeading}>Date Of Receipt : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.date_of_receipt}</span></div> : null}
        {requiredTransaction.receipt_number !== null ? <div> <span className={classes.modal__bodyHeading}>Receipt Number : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.receipt_number}</span></div> : null}
        {requiredTransaction.student.name !== null ? <div> <span className={classes.modal__bodyHeading}>Student Name : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.student.name + ' ( ' + (requiredTransaction.student.gender ? requiredTransaction.student.gender : '') + ' ) '}</span></div> : null}
        {requiredTransaction.student.grade && requiredTransaction.student.section !== null ? <div> <span className={classes.modal__bodyHeading}>Student Grade : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.student.grade.grade + ' ( ' + requiredTransaction.student.section.section_name + ' ) '}</span></div> : null}
        {requiredTransaction.student.branch !== null ? <div> <span className={classes.modal__bodyHeading}>Branch : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.student.branch.branch_name}</span></div> : null}
        {requiredTransaction.student.contact_no !== null ? <div> <span className={classes.modal__bodyHeading}>Contact Number : </span><span className={classes.modal__bodyDetail}>{requiredTransaction.student.contact_no}</span></div> : null}
        {requiredTransaction.paid_date !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Paid Date : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.paid_date}</span></div> : null}
        {requiredTransaction.paid_to !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Paid To : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.paid_to}</span></div> : null}
        {requiredTransaction.collected_date !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Collected Date : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.collected_date}</span></div> : null}
        {requiredTransaction.collected_by !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Collected By: </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.collected_by}</span></div> : null}
        {requiredTransaction.cancelled_date !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Cancelled Date : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.cancelled_date}</span></div> : null}
        {requiredTransaction.cancelled_by !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Cancelled By : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.cancelled_by}</span></div> : null}
        {requiredTransaction.bank_date !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Bank Clearance Date : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.bank_date}</span></div> : null}
        {requiredTransaction.bank_clearance_done_by !== null ? <div> <strong><span className={classes.modal__bodyHeading}>Bank Clearance Done by : </span></strong><span className={classes.modal__bodyDetail}>{requiredTransaction.bank_clearance_done_by}</span></div> : null}
      </div>
    )
  }

  createEditModalData = () => {
    if (!this.state.selectedTransactionId) {
      return null
    }
    const index = this.props.transactionDetails.results.findIndex(transaction => {
      return transaction.id === this.state.selectedTransactionId
    })
    const requiredTransaction = { ...this.props.transactionDetails.results[index] }
    let currentStatus = requiredTransaction.is_bank_clearance_done ? 'Bank Clearance Done' : (requiredTransaction.is_cancelled ? 'Cancelled' : (requiredTransaction.is_collected ? 'Collected' : 'Paid'))
    let showCheckBoxes = null
    if (requiredTransaction.is_bank_clearance_done) {
      showCheckBoxes = <h3>Bank Clearance Already Done</h3>
    } else if (requiredTransaction.is_cancelled) {
      showCheckBoxes = <h3>This transaction has been Cancelled</h3>
    } else if (requiredTransaction.is_collected && !requiredTransaction.is_bank_clearance_done) {
      showCheckBoxes = (
        <div>
          <input type='checkbox' name='currentBankClearance' onChange={this.checkboxChangeHandler} checked={this.state.currentBankClearance} />
          <span>Bank Clearance Done</span>
          <br />
          <input type='checkbox' name='currentCancelled' onChange={this.checkboxChangeHandler} checked={this.state.currentCancelled} />
          <span>Cancel</span>
          <br />
        </div>)
    } else if (requiredTransaction.is_paid && !requiredTransaction.is_bank_clearance_done && !requiredTransaction.is_cancelled) {
      showCheckBoxes = (
        <div>
          <input type='checkbox' name='currentCancelled' onChange={this.checkboxChangeHandler} checked={this.state.currentCancelled} />
          <span>Cancel</span>
          <br />
          <input type='checkbox' name='currentCollected' onChange={this.checkboxChangeHandler} checked={this.state.currentCollected} />
          <span>Collected</span>
          <br />
          <input type='checkbox' name='currentBankClearance' onChange={this.checkboxChangeHandler} checked={this.state.currentBankClearance} />
          <span>Bank Clearance Done</span>
          <br />
        </div>)
    }

    return (
      <div className={classes.modal__body}>
        <div><span className={classes.modal__bodyHeading}>Current Status : </span> <span>{currentStatus}</span></div>
        {showCheckBoxes}
      </div>
    )
  }

  updateStatusHandler = () => {
    const {
      currentBankClearance,
      currentCancelled,
      currentCollected,
      currentPaid,
      selectedTransactionId,
      currentSession
    } = this.state
    this.props.updateTransaction(currentSession, selectedTransactionId, currentPaid, currentCollected, currentCancelled, currentBankClearance, this.props.user, this.props.alert)
    this.setState({
      showEditModal: false,
      currentBankClearance: false,
      currentCancelled: false,
      currentCollected: false,
      currentPaid: false,
      selectedTransactionId: null
    })
  }

  pageChangeHandler = (page) => {
    this.setState({
      page
    }, () => this.fetchAllTransactionHandler(page))
  }

  render () {
    // let transactionTable = null
    // if (this.props.transactionDetails &&
    //   this.props.transactionDetails.results.length &&
    //   !this.state.isAccountant) {
    //   transactionTable = (<ReactTable
    //     pages={Math.ceil(this.props.transactionDetails.count / 20)}
    //     data={this.createData()}
    //     manual
    //     columns={[
    //       // {
    //       //     Header: "S.No",
    //       //     accessor: "sNo",
    //       //     width: 50,
    //       //     sortable:true,
    //       // },
    //       {
    //         Header: 'Transaction ID',
    //         accessor: 'transaction_id',
    //         sortable: true,
    //         Cell: e => (
    //           <div className={classes.table__transactionid}
    //             onClick={() => this.showViewModalHandler(e.original.id)}>
    //             {e.row.transaction_id}
    //           </div>),
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'Student Name',
    //         accessor: 'student_name',
    //         sortable: true,
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'ERP Code',
    //         accessor: 'student_erp',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Grade (Section)',
    //         accessor: 'student_grade',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Paid Date',
    //         accessor: 'paid_date',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Status',
    //         accessor: 'status',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: false
    //       },
    //       {
    //         Header: this.state.isAccountant ? ' ' : 'Edit',
    //         accessor: 'icon',
    //         filterable: false,
    //         width: 70,
    //         style: {
    //           paddingLeft: '10px',
    //           display: this.state.isAccountant ? 'none' : 'inline-block'
    //         },
    //         sortable: false
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={20}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     page={this.state.page}
    //     // Callbacks
    //     onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // } else if (this.props.transactionDetails &&
    //   this.props.transactionDetails.results.length &&
    //   this.state.isAccountant) {
    //   transactionTable = (<ReactTable
    //     pages={Math.ceil(this.props.transactionDetails.count / 20)}
    //     data={this.createData()}
    //     manual
    //     columns={[
    //       // {
    //       //     Header: "S.No",
    //       //     accessor: "sNo",
    //       //     width: 50,
    //       //     sortable:true,
    //       // },
    //       {
    //         Header: 'Transaction ID',
    //         accessor: 'transaction_id',
    //         sortable: true,
    //         Cell: e => (
    //           <div className={classes.table__transactionid}
    //             onClick={() => this.showViewModalHandler(e.original.id)}>
    //             {e.row.transaction_id}
    //           </div>),
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'Student Name',
    //         accessor: 'student_name',
    //         sortable: true,
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'ERP Code',
    //         accessor: 'student_erp',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Grade (Section)',
    //         accessor: 'student_grade',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Paid Date',
    //         accessor: 'paid_date',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Status',
    //         accessor: 'status',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: false
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={20}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     page={this.state.page}
    //     // Callbacks
    //     onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }

    let viewModal = null
    if (this.state.showViewModal) {
      viewModal = (
        <Modal open={this.state.showViewModal} click={this.hideViewModalHandler}>
          <h3 className={classes.modal__heading}>Transaction Details</h3>
          <hr />
          {this.createViewModalData()}
        </Modal>)
    }

    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideEditModalHandler}>
          <h3 className={classes.modal__heading}>Edit Transaction</h3>
          <hr />
          {this.createEditModalData()}
          <div className={classes.modal__button}>
            <Button primary onClick={this.updateStatusHandler}>Update</Button>
          </div>
        </Modal>
      )
    }

    let branchSelect = null
    if (!this.state.isAccountant) {
      branchSelect = (
        <Grid item xs='3'>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={this.state.currentBranch ? ({
              value: this.state.currentBranch.id,
              label: this.state.currentBranch.branch_name
            }) : null}
            options={
              this.props.branches.length
                ? this.props.branches.map(branch => ({
                  value: branch.branch.id,
                  label: branch.branch.branch_name
                }))
                : []
            }
            onChange={this.branchChangeHandler}
          />
        </Grid>
      )
    }

    return (
      <Layout>      
        <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='9' />
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              name='download'
              onClick={this.downloadReportHandler}
            >Download Report</Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.currentSession ? ({
                value: this.state.currentSession,
                label: this.state.currentSession
              }) : null}
              options={
                this.props.session && this.props.session.session_year.length
                  ? this.props.session.session_year.map(session => ({ value: session, label: session })
                  ) : []}
              onChange={this.fetchBranchHandler}
            />
          </Grid>
          {branchSelect}
          <Grid item xs='3'>
            <label>Mode*</label>
            <Select
              placeholder='Payment Mode'
              isMulti
              value={this.state.paymentModeData ? this.state.paymentModeData : ''}
              options={
                this.state.paymentModeId !== 'all'
                  ? [
                    {
                      value: 'all',
                      label: 'All'
                    },
                    {
                      value: 5,
                      label: 'Online Payment'
                    },
                    {
                      value: 1,
                      label: 'Cash'
                    },
                    {
                      value: 2,
                      label: 'Cheque'
                    },
                    {
                      value: 3,
                      label: 'Internet Payment'
                    },
                    {
                      value: 4,
                      label: 'Credit/Debit Card Swipe'
                    },
                    {
                      value: 6,
                      label: 'Wallet'
                    },
                    {
                      value: 7,
                      label: 'Mpos'
                    }
                  ] : []
              }

              onChange={this.changePaymentMode}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Fee Accounts*</label>
            <Select
              placeholder='Select Fee Account'
              isMulti
              value={this.state.feeAccData ? this.state.feeAccData : ''}
              options={
                this.state.feeAccId !== 'all' ? this.props.feePlans.length
                  ? this.props.feePlans.map(plan => ({
                    value: plan.id,
                    label: plan.fee_account_name
                  }))
                  : [] : []
              }
              onChange={this.feePlanChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Fee Type*</label>
            <Select
              placeholder='Select Fee Type'
              isMulti
              value={
                this.state.selectedFees ? this.state.selectedFees : null
              }
              options={
                FEE_TYPE.length
                  ? FEE_TYPE.map(fee => ({
                    value: fee.id,
                    label: fee.value
                  }))
                  : []
              }
              onChange={this.feeChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>From Date*</label>
            <div className={classes.datePicker}>
              <input type='date' name='fromDate' value={this.state.fromDate}
                onChange={this.fromDateChangeHandler} />
            </div>
          </Grid>
          <Grid item xs='3'>
            <label>To Date*</label>
            <div className={classes.datePicker}>
              <input type='date' name='toDate' value={this.state.toDate}
                onChange={this.toDateChangeHandler} />
            </div>
          </Grid>
          <Grid item xs='3'>
            <Button
              name='get'
              color='primary'
              style={{ marginTop: '20px' }}
              variant='contained'
              onClick={() => { this.fetchAllTransactionHandler(0) }}
            >Get</Button>
          </Grid>
        </Grid>
        {/* {transactionTable} */}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {viewModal}
        {editModal}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader,
  transactionDetails: state.finance.transaction.transactionsDetail,
  feePlans: state.finance.transaction.multiFeeAcc
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchAllTransaction: (session, branchId, isAccountant, mode, fees, feePlanIds, fromDate, toDate, page, user, alert) => dispatch(actionTypes.fetchAllTransaction({ session, branchId, isAccountant, mode, fees, feePlanIds, fromDate, toDate, page, user, alert })),
  updateTransaction: (session, id, currentPaid, currentCollected, currentCancelled, currentBankClearance, user, alert) => dispatch(actionTypes.updateTransactionStatus({ session, id, currentPaid, currentCollected, currentCancelled, currentBankClearance, user, alert })),
  fetchFeePlans: (session, branchId, user, alert) => dispatch(actionTypes.fetchMultiFeeTypeTransaction({ session, branchId, user, alert })),
  downloadReport: (url, data, reportName, user, alert) => dispatch(actionTypes.downloadReports({ url, data, reportName, user, alert })),
  clearProps: () => dispatch(actionTypes.clearTotalPaidProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(TransactionStatus)))
