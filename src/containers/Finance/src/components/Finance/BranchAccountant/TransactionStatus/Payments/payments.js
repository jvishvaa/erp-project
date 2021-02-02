import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import {
  Grid, Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, TextField, Paper,
  Table, TableRow, TableCell, TableHead, TableBody
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import axios from 'axios'

import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
import feeReceipts from '../../../Receipts/feeReceipts'
// import storeReceipts from '../../../../Inventory/Receipts/storePaymentReceipt'
import { urls } from '../../../../../urls'
import Modal from '../../../../../ui/Modal/modal'
import customClasses from './payments.module.css'
import appRegReceiptsPdf from '../../../Receipts/appRegReceipts'

const styles = theme => ({
  button: {
    borderRadius: '5px',
    backgroundColor: '#2196f3',
    padding: '2px !important',
    '&:hover': {
      backgroundColor: '#0b7dda'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  buttonGreen: {
    // borderRadius: '5px',
    backgroundColor: '#4caf50;',
    padding: '6px !important',
    color: 'white',
    marginTop: '2px !important',
    '&:hover': {
      backgroundColor: '#5fb962'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  mainItem: {
    margin: '30px'
  },
  modalBackButton: {
    position: 'fixed',
    bottom: '5px'
  }
})

class Payments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editId: null,
      showEditModal: false,
      isDateRequest: false,
      isAmountRequest: false,
      isReceiptRequest: false,
      isChequeNoRequest: false,
      isWrongKitPayment: false,
      isKitPayment: false,
      isWrongPayment: false,
      chequeNumber: null,
      dateChange: null,
      receiptNoChange: null,
      amountChange: {},
      remarks: null,
      payMode: '',
      todayDate: new Date().toISOString().substr(0, 10),
      oldChequeNumber: null
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    // if (nextProps.refresh) {
    //   const {
    //     erpNo,
    //     session,
    //     alert,
    //     user
    //   } = this.props
    //   this.props.fetchAccountantTransaction(erpNo, session, user, alert)
    // }
    if (nextProps.erpNo === this.props.erpNo &&
      nextProps.session === this.props.session &&
      nextProps.getData === this.props.getData &&
      this.props.transactions === nextProps.transactions &&
      this.props.dataLoading === nextProps.data) {
      return false
    }
    return nextProps.getData
  }

  componentDidMount () {
    const erpLength = (this.props.erpNo + '').length
    if (!this.props.erpNo || erpLength !== 10 || !this.props.session || !this.props.getData) {
      return
    }
    const {
      erpNo,
      session,
      alert,
      user
    } = this.props
    this.props.fetchReceiptRange(session, erpNo, alert, user)
    this.props.fetchAccountantTransaction(erpNo, session, user, alert)
  }

  componentDidUpdate (prevProps) {
    const erpLength = (this.props.erpNo + '').length
    const {
      erpNo,
      session,
      alert,
      user
      // refresh
    } = this.props
    // if (refresh !== prevProps.refresh) {
    //   this.props.fetchAccountantTransaction(erpNo, session, user, alert)
    // }
    if (!this.props.erpNo || !this.props.session || !this.props.getData || erpLength !== 10) {
      return
    }
    if (this.props.erpNo === prevProps.erpNo && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    if (this.props.getData && (erpNo !== prevProps.erpNo || session !== prevProps.session || this.props.getData)) {
      this.props.fetchAccountantTransaction(erpNo, session, user, alert)
    }
  }

  // componentWillReceiveProps (prevProps) {
  //   console.log('from receive props: ', prevProps)

  // }

  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.props.session}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  getKitPdfData = (transactionId) => {
    return (axios.get(`${urls.StoreReceiptPdfData}?transaction_id=${transactionId}&academic_year=${this.props.session}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async (transactionId, isCancelled, isKit) => {
    try {
      if (isKit) {
        const response = await this.getKitPdfData(transactionId)
        // storeReceipts(response.data, isCancelled)
      } else {
        const response = await this.getPdfData(transactionId)
        let feeType = response.data.feeType
        if (feeType === 'Application Fee' || feeType === 'Registration Fee') {
          appRegReceiptsPdf(response.data, isCancelled)
        } else {
          feeReceipts(response.data, isCancelled)
        }
      }
    } catch (error) {
      // console.log(e)
      console.error(error)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        this.props.alert.error(error.response.data)
      } else {
        this.props.alert.error('Unable To get Status')
      }
      // this.props.alert.warning('Something Went Wrong')
    }
  }

  editTransaction = (id, chequeNumber, isKit, mode) => {
    console.log('transss id: ', id)
    this.setState({
      showEditModal: true,
      editId: id,
      isKitPayment: isKit,
      oldChequeNumber: chequeNumber,
      chequeNumber: chequeNumber,
      payMode: mode
    })
    this.props.editAccountantTransaction(id, this.props.user, this.props.alert)
  }

  hideEditModalHandler = () => {
    this.setState({
      showEditModal: false,
      isDateRequest: false,
      isAmountRequest: false,
      isReceiptRequest: false,
      dateChange: null,
      receiptNoChange: null,
      amountChange: {},
      remarks: '',
      payMode: ''
    })
  }

  dateRequestHandler = (e) => {
    this.setState({
      isDateRequest: e.target.checked
    })
  }

  amountRequestHandler = (e) => {
    this.setState({
      isAmountRequest: e.target.checked
    })
  }

  wrongPayHandler = (e) => {
    this.setState({
      isWrongKitPayment: e.target.checked
    })
  }
  wrongPaymentHandler = (e) => {
    this.setState({
      isWrongPayment: e.target.checked
    })
  }

  remarksHandler = (e) => {
    this.setState({
      remarks: e.target.value
    })
  }

  receiptRequestHandler = (e) => {
    this.setState({
      isReceiptRequest: e.target.checked
    })
  }

  chequeRequestHandler = (e) => {
    this.setState({
      isChequeNoRequest: e.target.checked
    })
  }

  dateChangeHandler = (e) => {
    this.setState({
      dateChange: e.target.value
    })
  }

  receiptChangeHandler = (e) => {
    this.setState({
      receiptNoChange: e.target.value
    })
  }

  chequeChangeHandler = (e) => {
    this.setState({
      chequeNumber: e.target.value
    })
  }

  amountChangeHandler = (e, instaAmount, instaId) => {
    console.log('amount requested', e.target.value, instaAmount, instaId)
    if (e.target.value <= instaAmount) {
      const { amountChange } = this.state
      this.setState({ amountChange: { ...amountChange, [instaId]: e.target.value } },
        () => {
          console.log('amountchange: ', amountChange)
        })
    } else {
      this.props.alert.warning('Amount cant be greater than paid amount')
    }
  }

  updateTransactionHandler = () => {
    // cloning the og object and modifying with updated data
    let newEditTrans = JSON.parse(JSON.stringify(this.props.editTrans))
    console.log('newEditTrans: ', newEditTrans)
    const { amountChange, isAmountRequest, isDateRequest, isWrongPayment, isWrongKitPayment, isReceiptRequest, isChequeNoRequest, remarks } = this.state
    if (newEditTrans) {
      newEditTrans.fee.map((main) => {
        Object.keys(amountChange).map((val) => {
          if (+main.installment_id === +val) {
            console.log('the changed amount', amountChange[val])
            // main.installment_amount = amountChange[val]
            main['new_amount'] = +amountChange[val]
          }
        })
      })

      if (this.state.isWrongKitPayment) {
        newEditTrans['wrong_kit_payment'] = this.state.isWrongKitPayment
      }
      if (isWrongPayment) {
        newEditTrans['is_wrong_payment'] = isWrongPayment
      }

      if (this.state.isDateRequest) {
        newEditTrans['new_date'] = this.state.dateChange
      }
      if (this.state.isReceiptRequest) {
        newEditTrans['new_receipt_number'] = this.state.receiptNoChange
      }
      if (this.state.isChequeNoRequest) {
        newEditTrans['new_cheque_number'] = this.state.chequeNumber
      }
      if (this.state.oldChequeNumber) {
        newEditTrans['old_cheque_number'] = this.state.oldChequeNumber
      }
      newEditTrans['session_year'] = this.props.session
      newEditTrans['student_id'] = this.props.erpNo
      newEditTrans['change_date_of_payment_status'] = isDateRequest
      newEditTrans['change_receipt_number_status'] = isReceiptRequest
      newEditTrans['change_cheque_number_status'] = isChequeNoRequest
      newEditTrans['change_amount_status'] = isAmountRequest
      newEditTrans['request_reason'] = remarks
      newEditTrans['kit_payment'] = this.state.isKitPayment
    }
    console.log('updated data: ', newEditTrans)
    if (isReceiptRequest || isChequeNoRequest || isAmountRequest || isDateRequest || isWrongKitPayment || isWrongPayment) {
      if (isReceiptRequest && isDateRequest) {
        if (!this.state.receiptNoChange) {
          this.props.alert.warning('Fill the Receipt no and Date!')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isReceiptRequest && isDateRequest && isAmountRequest) {
        if (!this.state.receiptNoChange) {
          this.props.alert.warning('Fill the Receipt no , Date and Amount !')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isReceiptRequest && isDateRequest && isAmountRequest && isChequeNoRequest) {
        if (!this.state.receiptNoChange) {
          this.props.alert.warning('Fill the Receipt no ,Date, Amount and Cheque no:!')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isReceiptRequest) {
        if (!this.state.receiptNoChange) {
          this.props.alert.warning('Fill the Receipt no:!')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isChequeNoRequest) {
        if (!this.state.chequeNumber) {
          this.props.alert.warning('Fill the Cheque no:!')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isAmountRequest) {
        if (!this.state.amountChange) {
          this.props.alert.warning('Fill the Amount: !')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isDateRequest) {
        if (!this.state.dateChange) {
          this.props.alert.warning('Fill the Date: !')
        } else {
          this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
          this.hideEditModalHandler()
        }
      } else if (isWrongKitPayment) {
        this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
        this.hideEditModalHandler()
      } else if (isWrongPayment) {
        this.props.updateAccountantTransaction(newEditTrans, this.props.user, this.props.alert)
        this.hideEditModalHandler()
      }
    } else {
      this.props.alert.warning('Select any Field! !')
    }
    // else {
    //   this.props.alert.warning('Fill the Fields to proceed!')
    // }
  }

  render () {
    const { classes } = this.props
    let receiptData = null
    if (this.props.receiptRange && this.props.receiptRange.manual.length > 0) {
      receiptData = (
        this.props.receiptRange.manual.map(ele => {
          return (
            <p style={{ color: 'red' }}>From: {ele.range_from} & To: {ele.range_to} </p>
          )
        })
      )
    } else {
      receiptData = (
        <p style={{ color: 'red' }}>Receipt No. Not Assigned!</p>
      )
    }
    // for modal
    const { editTrans } = this.props
    // const [value, setValue] = React.useState('female')
    let transactionTable = null
    let transactionData = null
    let editTransModal = null
    if (this.props.transactions && this.props.transactions.results && this.props.transactions.results.length) {
      console.log(this.props.transactions.results)
      transactionData = this.props.transactions.results.map((transaction, index) => {
        let feeTypes = transaction.Fee_type[0]['fee-type-installment']
        console.log(feeTypes)
        let feeTotal = 0
        return (
          <div className={customClasses.table__bodyRecords} key={transaction.transaction_id}>
            <div className={customClasses.table__bodySno}>{index + 1}</div>
            <div className={customClasses.table__bodyTranId}>{transaction.transaction_id}</div>
            <div className={customClasses.table__bodyRcptNo}>{transaction.RecepitNo}</div>
            <div className={customClasses.table__bodyDate}>{transaction.date_of_payment}</div>
            <div className={customClasses.table__bodyPymntMd}>
              <div>{transaction.payment_mode} </div>
              <div>{transaction.cheque_number}</div>
            </div>
            <div className={customClasses.table__bodyFee}>
              {transaction.Fee_type.map((fee, i) => {
                feeTotal += fee.paid_amount
                return (
                  <div className={customClasses.table__bodyFeeTyp} key={i + fee['fee-type-installment']}>
                    <div className={customClasses.table__bodyFeeTypItem}>{fee['fee-type-installment']}</div>
                    <div className={customClasses.table__bodyAmnt}>{fee.paid_amount}</div>
                  </div>
                )
              })}
            </div>
            <div className={customClasses.table__bodyTotal}>{feeTotal}</div>
            <div className={customClasses.table__bodyActn}>
              <div>
                {
                  (feeTypes !== 'Registration Fee' && feeTypes !== 'Application Fee')
                    ? <Button disabled={transaction.is_cancelled || transaction.is_raised_for_cancellation || (this.props.transId === transaction.transaction_id ? this.props.refresh : false)} variant='extended' color='primary' className={classes.button} onClick={() => this.editTransaction(transaction.transaction_id, transaction.cheque_number, transaction.kit_payment, transaction.payment_mode)}>
                      <span style={{ color: 'white', marginRight: '5px', fontSize: '1rem', fontWeight: 'normal' }}>Edit</span>
                      <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}>edit</Icon>
                    </Button> : null
                }
                <Button variant='extended' color='primary' className={classes.buttonGreen} onClick={() => this.generatePdf(transaction.transaction_id, transaction.is_cancelled, transaction.kit_payment)}>
                  <span style={{ color: 'white', marginRight: '5px', fontSize: '1rem', fontWeight: 'normal' }}>Print</span>
                  <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}>print</Icon>
                </Button>
              </div>
            </div>
          </div>
        )
      })
    }
    if (this.props.transactions && this.props.transactions.results && this.props.transactions.results.length) {
      transactionTable = (
        <div className={customClasses.table}>
          <div className={customClasses.table__head}>All Payments</div>
          <div className={customClasses.table__heading}>
            <div className={customClasses.table__headingSno}>S.No</div>
            <div className={customClasses.table__headingTranId}>Transaction Id</div>
            <div className={customClasses.table__headingRcptNo}>Receipt No</div>
            <div className={customClasses.table__headingDate}>Date Of Payment</div>
            <div className={customClasses.table__headingPymntMd}>Payment Mode</div>
            <div className={customClasses.table__headingFee}>
              <div className={customClasses.table__headingFeeTyp}>
                <div className={customClasses.table__headingFeeTypItem} >Fee Type / Kit Name</div>
                <div className={customClasses.table__headingAmnt}>Amount Paid</div>
              </div>
            </div>
            <div className={customClasses.table__headingTotal}>Total</div>
            <div className={customClasses.table__headingActn}>Action</div>
          </div>
          <div className={customClasses.table__body}>
            {transactionData}
          </div>
        </div>
      )
    }

    if (this.state.showEditModal) {
      editTransModal = (
        <Modal open={this.state.showEditModal} click={this.hideEditModalHandler} large>
          <h3 className={customClasses.modal__heading}>Edit Transaction</h3>
          <hr />
          {/* <h1>{this.props.editTrans}</h1> */}
          {this.props.editTrans
            ? <div className={classes.mainItem}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h3>Change for Transaction ID: {this.state.editId}</h3>
                  <hr />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: '30px', marginBottom: '5px' }}>
                <Grid item xs={12}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Change Request For:</FormLabel>
                    <FormGroup aria-label='position' name='position' row>
                      <FormControlLabel
                        value='date'
                        disabled={this.state.payMode === 'Online'}
                        control={<Checkbox color='primary' />}
                        label='Date'
                        labelPlacement='end'
                        onChange={(e) => {
                          this.dateRequestHandler(e)
                        }}
                      />
                      {this.state.isKitPayment
                        ? <FormControlLabel
                          value='Wrong Payment'
                          control={<Checkbox color='primary' />}
                          label='Cancel Transaction'
                          labelPlacement='end'
                          onChange={(e) => {
                            this.wrongPayHandler(e)
                          }}
                        />
                        : <FormControlLabel
                          value='amount'
                          control={<Checkbox color='primary' />}
                          label='Amount'
                          labelPlacement='end'
                          onChange={(e) => {
                            this.amountRequestHandler(e)
                          }}
                        />
                      }
                      {!this.state.isKitPayment
                        ? <FormControlLabel
                          value='Wrong Payment'
                          control={<Checkbox color='primary' />}
                          label='Cancel Transaction'
                          labelPlacement='end'
                          onChange={(e) => {
                            this.wrongPaymentHandler(e)
                          }}
                        /> : []}
                      <FormControlLabel
                        disabled={this.state.payMode === 'Online'}
                        value='receipt'
                        control={<Checkbox color='primary' />}
                        label='Receipt No'
                        labelPlacement='end'
                        onChange={(e) => {
                          this.receiptRequestHandler(e)
                        }}
                      />
                      <FormControlLabel
                        value='Cheque No'
                        disabled={this.state.payMode !== 'Cheque' || this.state.payMode === 'Online'}
                        control={<Checkbox color='primary' />}
                        label='Cheque No'
                        labelPlacement='end'
                        onChange={(e) => {
                          this.chequeRequestHandler(e)
                        }}
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} className={classes.mainItem}>
                <Grid item xs={6}>
                  {/* <FormLabel component='legend'>Actual Payment:</FormLabel> */}
                  <label>Actual Payment : </label>
                  {editTrans && editTrans.date_of_payment ? editTrans.date_of_payment : null}
                </Grid>
                <Grid item xs={6}>
                  <label>Actual Receipt No : </label>
                  {/* <FormLabel component='legend'>Actual Receipt No.:</FormLabel> */}
                  {editTrans && editTrans.receipt_number_online ? editTrans.receipt_number_online : null}
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: '30px', marginBottom: '10px' }}>
                <Grid item xs={6}>
                  <TextField
                    id='date'
                    label='Date to be Changed:'
                    type='date'
                    variant='outlined'
                    defaultValue={this.state.todayDate}
                    className={classes.textField}
                    disabled={!this.state.isDateRequest}
                    onChange={(e) => {
                      this.dateChangeHandler(e)
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  {receiptData}
                  <TextField
                    id='receipt'
                    label='Receipt to be Changed:'
                    type='number'
                    variant='outlined'
                    disabled={!this.state.isReceiptRequest}
                    onChange={(e) => {
                      this.receiptChangeHandler(e)
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: '30px', marginBottom: '10px' }}>
                <Grid item xs={6}>
                  <TextField
                    id='remarks'
                    label='Add Remarks'
                    type='text'
                    variant='outlined'
                    value={this.state.remarks}
                    className={classes.textField}
                    // disabled={!this.state.isAmountRequest && !this.state.isDateRequest && !this.state.isReceiptRequest}
                    onChange={(e) => {
                      this.remarksHandler(e)
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id='recei'
                    label='ChequeNo tobe Changed:'
                    type='number'
                    variant='outlined'
                    disabled={!this.state.isChequeNoRequest}
                    value={this.state.chequeNumber}
                    onChange={(e) => {
                      this.chequeChangeHandler(e)
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper className={classes.mainItem}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align='right'>Fee Type</TableCell>
                          <TableCell align='right'>Installment Amount</TableCell>
                          <TableCell align='right'>Paid Amount</TableCell>
                          <TableCell align='right'>Amount to be changed</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {editTrans && editTrans.fee.length
                          ? editTrans.fee.map((row, i) => {
                            return (
                              <TableRow>
                                <TableCell align='right'>{row.installment_name}</TableCell>
                                <TableCell align='right'>{row.installment_amount}</TableCell>
                                <TableCell align='right'>{row.paid_amount}</TableCell>
                                <TableCell align='right'>
                                  <TextField
                                    id='amount'
                                    // label='Receipt to be Changed:'
                                    type='number'
                                    disabled={!this.state.isAmountRequest}
                                    value={this.state.amountChange[row.installment_id] || row.installment_amount}
                                    // defaultValue={row.paid_amount}
                                    variant='outlined'
                                    onChange={(e) => {
                                      this.amountChangeHandler(e, row.installment_amount, row.installment_id)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                      shrink: true
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })
                          : null}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </div>
            : null}
          <div className={customClasses.modal__deletebutton}>
            <Button disabled={!this.state.remarks} className={classes.buttonGreen} onClick={this.updateTransactionHandler}>Update</Button>
          </div>
          <div className={customClasses.modal__remainbutton}>
            <Button style={{ color: '#fff' }} onClick={this.hideEditModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    return (
      <div>
        {transactionTable}
        {/* <div className={customClasses.totalAmount}>
          <p>Total Amount: {this.props.transactions ? this.props.transactions.total : 0}</p>
          <p style={{ color: '#B22222' }}>{this.props.refresh ? '*Please Refresh for Updated Total' : null}</p>
        </div> */}
        {editTransModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  transactions: state.finance.accountantReducer.payment.allTransactions,
  editTrans: state.finance.accountantReducer.payment.editTrans,
  refresh: state.finance.accountantReducer.payment.refresh,
  transId: state.finance.accountantReducer.payment.transId,
  dataLoading: state.finance.common.dataLoader,
  receiptRange: state.finance.makePayAcc.receiptRange
})

const mapDispatchToProps = (dispatch) => ({
  fetchReceiptRange: (session, erp, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, erp, alert, user })),
  fetchAccountantTransaction: (erpNo, session, user, alert) => dispatch(actionTypes.fetchAccountantTransaction({ erpNo, session, user, alert })),
  editAccountantTransaction: (transactionId, user, alert) => dispatch(actionTypes.editAccountantTransaction({ transactionId, user, alert })),
  updateAccountantTransaction: (data, user, alert) => dispatch(actionTypes.updateAccountantTransaction({ data, user, alert }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Payments))
