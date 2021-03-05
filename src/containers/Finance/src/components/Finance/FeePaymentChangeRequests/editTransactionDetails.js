import React, {
  useEffect,
  useState
} from 'react'
import { withStyles,
  Grid, label, Paper, TableHead, Table, TableBody, TableCell, TableRow,
  TextField, Button, CircularProgress
} from '@material-ui/core/'
// import { Edit } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import RequestShuffle from './requestShuffle'
// import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
import Layout from '../../../../../Layout'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
// import CircularProgress from '../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  item: {
    padding: '10px'
  },
  btn: {
    margin: '5px',
    '&:hover': {
      backgroundColor: '#8B008B',
      color: '#fff'
    }
  },
  root: {
    width: '80%',
    // marginTop: theme.spacing * 3,
    // flexGrow: 1,
    margin: '0 auto',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  margin: {
    margin: theme.spacing(1)
  },
  approve: {
    backgroundColor: '#008000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  reject: {
    backgroundColor: '#FF0000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B0000'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  }
})

const EditTransactionDetails = ({ classes, history, dataLoading, fetchEditDetails, editDetails, updateEditDetails, redirect, clearAll, alert, user }) => {
  const [newAmount, setNewAmount] = useState({})
  const [newReceipt, setNewReceipt] = useState(null)
  const [remarks, setRemarks] = useState(null)
  const [newPayDate, setNewPayDate] = useState(null)
  const [newChequeNo, setNewChequeNo] = useState(null)
  useEffect(() => {
    const { requestId } = history.location
    if (requestId) {
      fetchEditDetails(requestId, alert, user)
    }
  }, [fetchEditDetails, history.location, alert, user])

  useEffect(() => {
    // if (editDetails && editDetails.change_receipt_number_status) {
    //   setNewReceipt(editDetails.new_receipt_number)
    // }
    // if (editDetails && editDetails.change_date_of_payment_status) {
    //   setNewPayDate(editDetails.new_date)
    // }
    if (editDetails) {
      setNewPayDate(editDetails.new_date ? editDetails.new_date : null)
      setNewReceipt(editDetails.new_receipt_number ? editDetails.new_receipt_number : null)
      setNewChequeNo(editDetails.new_cheque_number ? editDetails.new_cheque_number : null)
    }
  }, [editDetails])

  useEffect(() => {
    // console.log('the details', editDetails)
    if (redirect) {
      history.push({
        pathname: '/finance/Approval/Requests/FeePaymentRequests'
      })
    }
  }, [redirect, history])

  useEffect(() => {
    return () => {
      clearAll()
      console.log('----------cleaning up-----')
      setNewAmount(null)
      setNewPayDate(null)
      setNewReceipt(null)
      setRemarks(null)
    }
  }, [clearAll])

  const amountChangeHandler = (e, instaAmount, instaId) => {
    console.log('amount requested', e.target.value, instaAmount, instaId)
    if (e.target.value <= instaAmount) {
      const newAmt = { ...newAmount }
      newAmt[instaId] = e.target.value
      setNewAmount(newAmt)
    } else {
      this.props.alert.warning('Amount cant be greater than paid amount')
    }
  }

  const dateChangeHandler = (e) => {
    setNewPayDate(e.target.value)
  }

  const ChequeNoChangeHandler = (e) => {
    setNewChequeNo(e.target.value)
  }

  const receiptChangeHandler = (e) => {
    setNewReceipt(e.target.value)
  }

  const remarksHandler = (e) => {
    setRemarks(e.target.value)
  }

  const updateHandler = (btnValue, id) => {
    // send everything
    let newEditDetails = JSON.parse(JSON.stringify(editDetails))

    if (editDetails.change_date_of_payment_status) {
      newEditDetails['new_date'] = newPayDate
    }

    if (editDetails.change_receipt_number_status) {
      newEditDetails['new_receipt_number'] = newReceipt
    }

    if (editDetails.change_cheque_number_status) {
      newEditDetails['new_cheque_number'] = newChequeNo
    }

    if (editDetails.change_amount_status) {
      newEditDetails.fee_amount_change.map((main) => {
        Object.keys(newAmount).map((val) => {
          if (+main.installment_id === +val) {
            console.log('the changed amount', newAmount[val])
            // main.installment_amount = amountChange[val]
            main['new_amount'] = +newAmount[val]
          }
        })
      })
    }

    if (btnValue === 'update') {
      newEditDetails['changed_status'] = 'Updated'
    } else if (btnValue === 'cancel') {
      newEditDetails['changed_status'] = 'Cancelled'
    } else {
      newEditDetails['changed_status'] = 'Rejected'
    }

    newEditDetails['changed_remarks'] = remarks
    // do the call
    updateEditDetails(newEditDetails, alert, user)
  }

  const editDetailsHandler = () => {
    let data = null
    if (editDetails) {
      data = (
        <Paper className={classes.root}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={6} className={classes.item}>
              {/* <div style={{ textAlign: 'center', margin: '8px' }}> */}
              <label>Change Request For TransactionID : </label>
              {editDetails.transaction_id ? editDetails.transaction_id : ''}
              {/* </div> */}
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <label>ERP : </label>
              {editDetails.student && editDetails.student.erp ? editDetails.student.erp : ''}
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <label>Name : </label>
              {editDetails.student && editDetails.student.name ? editDetails.student.name : ''}
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <label>Class : </label>
              4th std hd
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <label>Branch : </label>
              {editDetails.acad_session && editDetails.acad_session.branch && editDetails.acad_session.branch.branch_name ? editDetails.acad_session.branch.branch_name : ''}
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <label>Reason : </label>
              {editDetails.request_reason ? editDetails.request_reason : ''}
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <label>Receipt No.:</label>
              {editDetails.old_receipt_number ? editDetails.old_receipt_number : ''}
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <label>Paid Date : </label>
              {editDetails.old_date ? editDetails.old_date : ''}
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <label>Cheque No: : </label>
              {editDetails.old_cheque_number ? editDetails.old_cheque_number : ''}
            </Grid>
            <Grid item xs={4} className={classes.item}>
              {/* <label>Receipt to be Changed : </label> */}
              <TextField
                id='newReceipt'
                type='number'
                label='Receipt to be Changed'
                disabled={!editDetails.change_receipt_number_status}
                value={newReceipt || null}
                // defaultValue={row.new_amount}
                variant='outlined'
                onChange={(e) => {
                  receiptChangeHandler(e)
                }}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              {/* <label>Date to be Changed : </label> */}
              <TextField
                id='date'
                type='date'
                disabled={!editDetails.change_date_of_payment_status}
                label='Date to be Changed'
                value={newPayDate || null}
                // defaultValue={row.new_amount}
                variant='outlined'
                onChange={(e) => {
                  dateChangeHandler(e)
                }}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={4} className={classes.item}>
              {/* <label>Date to be Changed : </label> */}
              <TextField
                id='cheque'
                type='number'
                disabled={!editDetails.change_cheque_number_status}
                label='ChequeNo to be Changed'
                value={newChequeNo || null}
                // defaultValue={row.new_amount}
                variant='outlined'
                onChange={(e) => {
                  ChequeNoChangeHandler(e)
                }}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.item}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Installment name
                    </TableCell>
                    <TableCell>
                      Installment Amount
                    </TableCell>
                    <TableCell>
                      Paid Amount
                    </TableCell>
                    <TableCell>
                      Amount to be changed
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editDetails.fee_amount_change.map((row) => (
                    <TableRow>
                      <TableCell>{row.installment_name}</TableCell>
                      <TableCell>{row.installment_amount}</TableCell>
                      <TableCell>{row.old_amount}</TableCell>
                      <TableCell>
                        <TextField
                          id='amount'
                          type='number'
                          disabled={!editDetails.change_amount_status}
                          value={newAmount[row.installment_id] || row.new_amount}
                          // defaultValue={row.new_amount}
                          variant='outlined'
                          onChange={(e) => {
                            amountChangeHandler(e, row.installment_amount, row.installment_id)
                          }}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <TextField
                id='remarks'
                type='text'
                label='Remarks'
                // disabled={!editDetails.change_receipt_number_status}
                value={remarks || null}
                // defaultValue={row.new_amount}
                variant='outlined'
                onChange={(e) => {
                  remarksHandler(e)
                }}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={4} className={classes.item}>
              <Button disabled={!remarks} onClick={() => { updateHandler('update', editDetails.id) }} className={classes.approve}>Update</Button>
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <Button disabled={!remarks} onClick={() => { updateHandler('cancel', editDetails.id) }} className={classes.reject}>Cancel Transaction</Button>
            </Grid>
            <Grid item xs={4} className={classes.item}>
              <Button disabled={!remarks} onClick={() => { updateHandler('reject', editDetails.id) }} className={classes.reject}>Reject</Button>
            </Grid>
          </Grid>
        </Paper>
      )
    }
    return data
  }

  return (
    <React.Fragment>
      <Layout>
        {editDetailsHandler()}
      </Layout>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

EditTransactionDetails.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  editDetails: state.finance.feePayChange.editDetails,
  redirect: state.finance.feePayChange.redirect
})

const mapDispatchToProps = dispatch => ({
  fetchEditDetails: (requestId, alert, user) => dispatch(actionTypes.fetchEditDetails({ requestId, alert, user })),
  updateEditDetails: (data, alert, user) => dispatch(actionTypes.updateEditDetails({ data, alert, user })),
  clearAll: () => dispatch(actionTypes.clearingAll())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(EditTransactionDetails)))
