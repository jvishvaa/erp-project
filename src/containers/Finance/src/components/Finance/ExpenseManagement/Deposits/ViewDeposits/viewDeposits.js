import React, { Component } from 'react'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
import Select from 'react-select'
// import 'react-table/react-table.css'
import {
  Edit as EditIcon,
  ArrowDownward as ArrowIcon
} from '@material-ui/icons'
import {
  Typography,
  Divider,
  Checkbox,
  Button,
  Button as MatButton,
  Grid,
  CircularProgress,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
  TablePagination
} from '@material-ui/core'
import { FilterInnerComponent, filterMethod } from '../../../FilterInnerComponent/filterInnerComponent'

import * as actionTypes from '../../../store/actions'
import Modal from '../../../../../ui/Modal/modal'
import classes from './viewDeposits.module.css'
// import { generateExcel } from '../../../../../utils'

const DEPOSIT = [
  { value: 'petty', label: 'Petty Deposit' },
  { value: 'expense', label: 'Expense Deposit' },
  { value: 'collection', label: 'Collection Deposit' }
]
class ViewDiposits extends Component {
  state = {
    currentSession: null,
    currentBranch: null,
    fromDate: null,
    toDate: null,
    depositType: null,
    editInfo: null,
    showEditModal: false,
      page: 0,
      rowsPerPage: 10
  }

  componentDidUpdate (prevPorps) {
    if (prevPorps.session !== this.props.session || prevPorps.branch.id !== this.props.branch.id) {
      const {
        session,
        branch,
        user,
        alert
      } = this.props
      this.props.fetchDepositTransaction(session, branch.id, user, alert)
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  }

  dateChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  fetchDataHandler = () => {
    const {
      session,
      branch,
      user,
      alert
    } = this.props

    const {
      fromDate,
      toDate,
      depositType
    } = this.state

    if (!session || !branch || !fromDate || !toDate || !depositType) {
      alert.warning('Please Fill All Fields')
      return
    }
    this.props.fetchDepositTransaction(session, branch.id, fromDate, toDate, depositType.value, user, alert)
  }

  depositTypeChangeHandler = (e) => {
    this.setState({
      depositType: e
    })
  }

  showEditModalHandler = (id, transactionId, depositMode, date, amount, remarks, isCancelled) => {
    this.setState({
      editInfo: {
        id,
        transactionId,
        depositMode,
        date,
        amount,
        remarks,
        isCancelled
      },
      showEditModal: true
    })
  }

  hideEditModalHandler = () => {
    this.setState({
      showEditModal: false
    })
  }

  editDataChangeHandler = (e) => {
    const editInfo = { ...this.state.editInfo }
    editInfo[e.target.name] = e.target.value
    this.setState({
      editInfo
    })
  }

  setEditCancelled = (e) => {
    const editInfo = { ...this.state.editInfo }
    editInfo.isCancelled = e.target.checked
    this.setState({
      editInfo
    })
  }

  updateDepositEntryHandler = () => {
    const {
      id,
      amount,
      remarks,
      isCancelled,
      date
    } = this.state.editInfo
    const {
      alert,
      user
    } = this.props
    this.props.updateDepositEntry(id, date, amount, remarks, isCancelled, this.state.depositType, user, alert)
  }

  createExcel = () => {
    if (!this.props.pettyCashDeposit.length) {
      this.props.alert.warning('No Data To Generate Excel')
      return
    }
    const columns = [
      {
        Header: 'Date',
        accessor: 'date'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      },
      {
        Header: 'Transaction Id',
        accessor: 'transaction_id'
      },
      {
        Header: 'From Account',
        accessor: 'from_account'
      },
      {
        Header: 'To Account',
        accessor: 'to_account'
      },
      {
        Header: 'Cheque No.',
        accessor: 'cheque_no'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      },
      {
        Header: 'Type',
        accessor: 'type'
      },
      {
        Header: 'Mode Of Diposit',
        accessor: 'depositMode'
      },
      {
        Header: 'Is Cancelled',
        accessor: 'cancel'
      }
    ]

    const excelData = this.props.pettyCashDeposit.map((txn, index) => {
      return {
        transaction_id: txn.transaction_id ? txn.transaction_id : '',
        date: txn.date ? txn.date : '',
        amount: txn.amount ? txn.amount : '',
        depositMode: txn.deposit_mode ? txn.deposit_mode : '',
        id: txn.id ? txn.id : '',
        from_account: txn.from_account ? txn.from_account.bank_name : '',
        to_account: txn.to_account ? txn.to_account.bank_name : '',
        type: DEPOSIT[txn.deposit_type - 1].label || '',
        cheque_no: txn.cheque_no ? txn.cheque_no : '',
        remarks: txn.remarks ? txn.remarks : '',
        cancel: txn.is_cancelled ? 'Yes' : 'No'
      }
    })

    const fileName = 'ViewDeposit'
    const data = {
      fileName,
      columns,
      excelData
    }
    // generateExcel(data)
  }

  // createData = () => {
  //   let dataToShow = []
  //   console.log('Petty Cash Deposit', this.props.pettyCashDeposit)
  //   dataToShow = this.props.pettyCashDeposit.map((txn, index) => {
  //     return {
  //       sNo: index + 1,
  //       transaction_id: txn.transaction_id ? txn.transaction_id : '',
  //       date: txn.date ? txn.date : '',
  //       amount: txn.amount ? txn.amount : '',
  //       depositMode: txn.deposit_mode ? txn.deposit_mode : '',
  //       id: txn.id ? txn.id : '',
  //       from_account: txn.from_account ? txn.from_account.bank_name : '',
  //       to_account: txn.to_account ? txn.to_account.bank_name : '',
  //       // type: transaction.deposit_type ? transaction.deposit_type.deposit_type : '',
  //       cheque_no: txn.cheque_no ? txn.cheque_no : '',
  //       remarks: txn.remarks ? txn.remarks : '',
  //       cancel: txn.is_cancelled ? 'Yes' : 'No',
  //       icon: <div style={{ 'padding-left': '10px' }} onClick={() => this.showEditModalHandler(txn.id, txn.transaction_id, txn.deposit_mode, txn.date, txn.amount, txn.remarks, txn.is_cancelled)}><EditIcon className={classes.icon} /></div>
  //     }
  //   })

  //   return dataToShow
  // }

  render () { // rajneesh
    // let transactionTable = null
    // if (this.props.pettyCashDeposit.lenght !== 0) {
    //   transactionTable = (<ReactTable
    //     data={this.createData()}
    //     columns={[
    //       {
    //         Header: 'S.No',
    //         accessor: 'sNo',
    //         width: 50,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Date',
    //         accessor: 'date',
    //         sortable: true,
    //         style: {
    //           paddingLeft: '20px'
    //         }
    //       },
    //       {
    //         Header: 'Amount',
    //         accessor: 'amount',
    //         sortable: true
    //       },
    //       {
    //         Header: 'Transaction Id',
    //         accessor: 'transaction_id',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'From Account',
    //         accessor: 'from_account',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'To Account',
    //         accessor: 'to_account',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Cheque No.',
    //         accessor: 'cheque_no',
    //         // Filter: props => <FilterInnerComponent {...props} />,
    //         // filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Remarks',
    //         accessor: 'remarks',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       // {
    //       //   Header: "Type",
    //       //   accessor: "type",
    //       //   Filter: props => <FilterInnerComponent {...props} />,
    //       //   filterMethod: filterMethod,
    //       //   sortable: false,
    //       // },
    //       {
    //         Header: 'Mode Of Diposit',
    //         accessor: 'depositMode',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Is Cancelled',
    //         accessor: 'cancel',
    //         Filter: props => <FilterInnerComponent {...props} />,
    //         filterMethod: filterMethod,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Edit',
    //         accessor: 'icon',
    //         filterable: false,
    //         width: 70,
    //         style: {
    //           paddingLeft: '10px'
    //         },
    //         sortable: false
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={20}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //   // Controlled props
    //   // page={this.state.page}
    //   // Callbacks
    //   // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }

    let editModal = null

    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideEditModalHandler} style={{ padding: '15px' }}>
          <Typography variant='h3' className={classes.modalHeading}>Edit Deposit</Typography>
          <Divider className={classes.divider} />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
                Mode of Payment
            </Grid>
            <Grid item xs='2'>
              {this.state.editInfo.depositMode}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
                Transaction ID
            </Grid>
            <Grid item xs='2'>
              {this.state.editInfo.transactionId}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label className={classes.label}>Date</label>
              <input type='date'
                value={this.state.editInfo ? this.state.editInfo.date : ''}
                className={classes.form__inputAmount + ' ' + classes.datePicker}
                name='date'
                onChange={this.editDataChangeHandler} />
            </Grid>
            <Grid item xs='3'>
              <label className={classes.label}>Amount</label>
              <input
                value={this.state.editInfo ? this.state.editInfo.amount : ''}
                className={classes.form__inputAmount}
                name='amount'
                disabled
                onChange={this.editDataChangeHandler} />
            </Grid>

            <Grid item xs='3'>
              <label className={classes.label}>Ramarks</label>
              <input
                value={this.state.editInfo ? this.state.editInfo.remarks : ''}
                className={classes.form__inputAmount}
                name='remarks'
                onChange={this.editDataChangeHandler} />
            </Grid>
          </Grid>
          <Grid item xs='3'>
            <Checkbox
              checked={(this.state.editInfo && this.state.editInfo.isCancelled) || false}
              onChange={this.setEditCancelled}
              className={classes.checkbox}
              value='checkedA'
            />
            <label className={classes.cancelLabel}>Is Cancelled</label>
          </Grid>
          <MatButton
            color='primary'
            variant='contained'
            Style={{ marginLeft: '10px' }}
            onClick={this.updateDepositEntryHandler}
          >
            Update
          </MatButton>
        </Modal>
      )
    }

    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label className={classes.label}>From Date</label>
            <input type='date'
              value={this.state.fromDate ? this.state.fromDate : ''}
              className={classes.form__inputAmount + ' ' + classes.datePicker}
              name='fromDate'
              onChange={this.dateChangeHandler} />
          </Grid>
          <Grid item xs='3'>
            <label className={classes.label}>To Date</label>
            <input type='date'
              value={this.state.toDate ? this.state.toDate : ''}
              className={classes.form__inputAmount + ' ' + classes.datePicker}
              name='toDate'
              onChange={this.dateChangeHandler} />
          </Grid>
          <Grid item xs='3'>
            <label className={classes.label}>Deposit Type</label>
            <Select
              placeholder='Select Deposit Type'
              value={this.state.depositType ? ({
                value: this.state.depositType.value,
                label: this.state.depositType.label
              }) : null}
              options={
                DEPOSIT
                  ? DEPOSIT.map(type => ({ value: type.value, label: type.label })
                  ) : []}
              onChange={this.depositTypeChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              onClick={this.fetchDataHandler}
              style={{ marginTop: '20px' }}
            >Get</Button>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <div>
          <MatButton variant='contained'
            color='primary'
            onClick={this.createExcel}
          >
            <ArrowIcon />
            Import
          </MatButton>
        </div>
        <div className={classes.tableContainer}>
          {/* {transactionTable} */} 
          <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Date</TableCell>
                      <TableCell> Amount</TableCell>
                      <TableCell> Transaction Id</TableCell>
                      <TableCell> From Account</TableCell>
                      <TableCell> To Account</TableCell>
                      <TableCell> Cheque No</TableCell>
                      <TableCell> Remark</TableCell>
                      {/* <TableCell> Type</TableCell> */}
                      <TableCell> Mode Of Deposite </TableCell>
                      {/* <TableCell> Is Cancelled</TableCell>
                      <TableCell> Edit</TableCell> */} 
                      {/* <TableCell> Delete</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.pettyCashDeposit && this.props.pettyCashDeposit.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((txn, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell> {txn.date ? txn.date : ''}</TableCell>
                      <TableCell> {txn.amount ? txn.amount : ''} </TableCell>
                      <TableCell>{txn.transaction_id ? txn.transaction_id : ''}</TableCell>
                      <TableCell> {txn.from_account ? txn.from_account.bank_name : ''} </TableCell>
                      <TableCell> {txn.to_account ? txn.to_account.bank_name : ''}</TableCell>
                      <TableCell>{txn.cheque_no ? txn.cheque_no : ''}</TableCell>
          <TableCell>{txn.remarks ? txn.remarks : ''}</TableCell>
          {/* <TableCell>{transaction.deposit_type ? transaction.deposit_type.deposit_type : ''}</TableCell> */}
          <TableCell>{txn.deposit_mode ? txn.deposit_mode : ''} </TableCell>
          {/* <TableCell>{txn.is_cancelled ? 'Yes' : 'No'}</TableCell>
          <TableCell>{<div style={{ 'padding-left': '10px' }} onClick={() => this.showEditModalHandler(txn.id, txn.transaction_id, txn.deposit_mode, txn.date, txn.amount, txn.remarks, txn.is_cancelled)}><EditIcon className={classes.icon} /></div>}</TableCell> */}
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.pettyCashDeposit && this.props.pettyCashDeposit.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
        </div>
        {editModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  pettyCashDeposit: state.finance.expenseMngmt.deposit.pettyCashTransactions,
  dataLoading: state.finance.common.dataLoader

})

const mapDispatchToProps = (dispatch) => ({
  // fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchDepositTransaction: (session, branch, fromDate, toDate, depositType, user, alert) => dispatch(actionTypes.fetchDepositTransaction({ session, branch, fromDate, toDate, depositType, user, alert })),
  updateDepositEntry: (id, date, amount, remarks, isCancelled, depositType, user, alert) => dispatch(actionTypes.updateDepositEntry({ id, date, amount, remarks, isCancelled, depositType, user, alert }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDiposits)
