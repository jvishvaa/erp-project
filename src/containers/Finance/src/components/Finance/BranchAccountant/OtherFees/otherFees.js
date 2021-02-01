import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
// import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel, Checkbox, Button } from '@material-ui/core/'
import axios from 'axios'

// import { apiActions } from '../../../../_actions'
import classess from './deleteModal.module.css'
import EditOtherFee from './editOtherFee'
import ReceiptDetails from './receiptDetails'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Modal from '../../../../ui/Modal/modal'
// import PdfGenerator from '../../../../utils/pdfGenerator'
import feeReceipts from '../../Receipts/feeReceipts'
import { urls } from '../../../../urls'

// import otherFeeclasses from './otherFees.module.css'
// let downloadButton = null
const styles = theme => ({
  tableWrapper: {
    overflowX: 'scroll',
    width: '100%'
  },
  root: {
    width: '100%'
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

// function getSteps () {
//   return ['Other Fee Details', 'Reciept Details', 'Completed']
// }

let otherFeeState = null

class OtherFeesAccountant extends Component {
  state = {
    erpNo: null,
    currentSession: null,
    showData: false,
    currentFeeAccount: null,
    feeTypeName: '',
    subFeeTypeName: '',
    amount: '',
    showAddFeeModal: false,
    showEditModal: false,
    showAdd: false,
    otherFeeId: null,
    showDeleteModal: false,
    deleteId: null,
    activeStep: 0,
    amountToBePaid: 0,
    isSelectedPayments: [],
    isDisabled: [],
    feesId: '',
    payment: {},
    showAssignFeeModal: false,
    currentOtherFee: '',
    erp_code: '',
    due_date: '',
    agreeOther: false,
    isChecked: {},
    final: {},
    partialAmount: ''
  }
  componentDidMount () {
    console.log('props--------------------', this.props)
    const { erp, session, alert } = this.props
    if (otherFeeState) {
      this.setState(otherFeeState)
      return
    }
    if (erp && session) {
      // this.props.listOtherFees(session, erp, alert, user)
      this.setState({ showData: true, showAdd: true, amountToBePaid: 0, isSelectedPayments: [] })
    } else {
      alert.warning('select Session And Erp!')
    }
  }
  erpChangeHander = (e) => {
    this.setState({
      erpNo: e.target.value
    })
    otherFeeState = this.state
  }

  sessionChangeHandler = (e) => {
    this.setState({
      currentSession: e.value
    })
  }

  feeAccountChangeHandler = (e) => {
    this.setState({
      currentFeeAccount: e
    })
  }

  assignErpHandler = (e) => {
    this.setState({
      erp_code: e.target.value
    })
  }

  dueDateHandler = (e) => {
    this.setState({
      due_date: e.target.value
    })
  }

  handleAssignOtherFees = () => {
    let data = {
      due_date: this.state.due_date,
      erp: this.props.erp,
      other_fee: this.state.currentOtherFee.value
    }
    console.log(data)
    this.props.assignOtherFees(data, this.props.alert, this.props.user)
    this.hideModalHandler()
    this.setState({
      due_date: '',
      erp_code: '',
      currentOtherFee: []
    })
  }

  otherFeeHandler = () => {
    if (!this.state.currentSession || !this.props.erp) {
      this.props.alert.warning('Please Fill All The Fields')
    }
    console.log(this.props.erp)
    this.props.listOtherFees(this.state.currentSession, this.props.erp, this.props.alert, this.props.user)
    // this.props.fetchOtherFees(this.state.currentSession, this.props.alert, this.props.user)
    this.setState({ showData: true, showAdd: true, amountToBePaid: 0, isSelectedPayments: [] })
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

  amountHandler = (e) => {
    this.setState({
      amount: e.target.value
    })
    let amount = document.getElementById('amount').value
    if (amount < 1) {
      this.props.alert.warning('Invalid Amount')
      this.setState({ amount: '' })
    }
  }

  showEditModalHandler = (id) => {
    this.setState({
      showEditModal: true,
      otherFeeId: id
    })
  }

  showAssignFeeModalHandler = () => {
    this.setState({
      showAssignFeeModal: true
    })
  }

  showAddFeeModalHandler = () => {
    this.setState({
      showAddFeeModal: true
    })
    this.props.fetchFeeAccount(this.props.erp, this.props.alert, this.props.user)
  }

  hideModalHandler = () => {
    this.setState({
      showAddFeeModal: false,
      showEditModal: false,
      showAssignFeeModal: false
    })
  }

  deleteModalShowHandler = (id) => {
    this.setState({
      showDeleteModal: true,
      deleteId: id
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  deleteHandler = () => {
    this.props.deleteOtherFees(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  OtherFeesChangeHandler = (e) => {
    this.setState({
      currentOtherFee: e
    })
  }

  handleSubmitOtherFees = () => {
    console.log('-clicked---------')
    console.log('FeeAccount', this.state.currentFeeAccount)
    console.log('Feetype', this.state.feeTypeName)
    console.log('subFeeType', this.state.subFeeTypeName)
    console.log('amount', this.state.amount)
    let data = {
      erp: this.props.erp,
      fee_account: this.state.currentFeeAccount.value,
      fee_type_name: this.state.feeTypeName,
      sub_type: this.state.subFeeTypeName,
      amount: this.state.amount
    }
    this.props.addOtherFees(data, this.props.alert, this.props.user)
    this.hideModalHandler()
    this.setState({
      currentFeeAccount: [],
      feeTypeName: '',
      subFeeTypeName: '',
      amount: ''
    })
  }

  handleCheckbox = (name, id) => e => {
    let { isChecked } = this.state
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [id]: true } })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [id]: false } })
    }

    let pay = this.state.amountToBePaid
    const data = this.props.otherFeesList.filter(list => (list.id === id))

    let partialAmt = 0
    // adding and removing the total amount to be paid
    data.map(amt => {
      partialAmt = parseInt(this.state.partialAmount[id]) ? parseInt(this.state.partialAmount[id]) : amt.balance
      if (e.target.checked) {
        // pay += amt.balance
        pay += partialAmt
      } else {
        // pay -= partialAmt
        pay -= partialAmt
      }
    })

    if (pay === 0) {
      // removed disableNext
      this.setState({ amountToBePaid: pay })
    } else if (pay > 0) {
      this.setState({ amountToBePaid: pay })
    }
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.feeDetails()
      case 1:
        return <ReceiptDetails
          otherFeeId={this.state.feesId}
          erp={this.props.erp}
          session={this.props.session}
          amountToBePaid={this.state.amountToBePaid}
          alert={this.props.alert}
          getDetail={this.getPaymentDetailHandler} />
      case 2:
        if (this.props.confirmStatus) {
          return <div>
            {/* <h2>Thank You For Recording Payment Details</h2>
            <br />
            <Button variant='contained' onClick={this.generatePdf}>Download PDF</Button> */}
            <center>
              <h2>Thank You For Recording Payment Details</h2>
              {this.props.ReceiptNo ? <b style={{ fontSize: '20px' }}>Receipt No is {this.props.ReceiptNo}</b> : null}
              <br />
              <Button variant='contained' onClick={this.generatePdf}>Download PDF</Button>
            </center>
          </div>
        }
        break
      default:
        return 'Unknown stepIndex'
    }
  }
  // Demo for Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.state.currentSession}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    if (this.props.trnsId) {
      try {
        const response = await this.getPdfData(this.props.trnsId)
        feeReceipts(response.data)
      } catch (e) {
        console.log(e)
        this.props.alert.warning('Something Went Wrong')
      }
    }
  }
  // Demo for Generation od PDF End
  getPaymentDetailHandler = (confirm, paymentDetail) => {
    if (confirm) {
      this.setState({ disableNext: false })
    } else {
      this.setState({ disableNext: true })
    }
    // we Will SetState to PaymentDatail
    this.setState({
      payment: paymentDetail
    })
  }

  checkOtherFeesHandler = (e) => {
    // adding partial amount
    console.log('Called from new func')
    const partialPayAmt = document.querySelectorAll('[name=partialAmount]')
    console.log('mpa Partial amount: ', partialPayAmt)
    let bal = []
    let payed = []
    let checkedRowId = []
    checkedRowId = Object.keys(this.state.isChecked).filter(ele => {
      return this.state.isChecked[ele]
    })
    let payInstall = []
    checkedRowId.map((row, i) => {
      payInstall.push(this.props.otherFeesList.filter(list => (+list.id === +row)))
    })
    console.log('mpa payInstall 1st----', payInstall)
    // to calculate the paying amount and balance after that.
    payInstall.map((row, i) => {
      row.map((r) => {
        if (+checkedRowId[i] === +r.id) {
          for (let k = 0; k < partialPayAmt.length; k++) {
            if (+partialPayAmt[k].id === +r.id) {
              if (+r.balance === +partialPayAmt[k].value) {
                bal.push(0)
                payed.push(r.balance)
              } else if (r.balance > partialPayAmt[k].value) {
                payed.push(parseInt(partialPayAmt[k].value))
                bal.push(r.balance - partialPayAmt[k].value)
              }
            }
          }
        }
      })
    })
    console.log(payed)
    console.log(bal)

    const newPayInstall = payInstall.map((ele, i) => {
      ele.partial_payment = payed[i]
      ele.balance = bal[i]
      return ele
    })
    console.log('mpa Pay New Insyall-------', newPayInstall)
    this.setState({
      final: {
        finalAmt: this.state.selectedTotal,
        installment_rows: newPayInstall
        // payment: payed,
        // balance: bal
      }
    }, () => {
      console.log('final state', this.state.final)
    })

    if (this.state.amountToBePaid === 0 || this.state.amountToBePaid < 0) {
      this.props.alert.warning('Cannot Proceed with Zero Amount')
      this.setState({
        agreeOther: false
      })
    } else if (e.target.checked && this.state.amountToBePaid > 0) {
      let checkedRowId = []
      checkedRowId = Object.keys(this.state.isChecked).filter(ele => {
        return this.state.isChecked[ele]
      })
      this.setState({
        agreeOther: e.target.checked,
        final: {
          finalAmt: this.state.amountToBePaid,
          installment_rows: newPayInstall
        }
      }, () => {
        this.props.checkFee(this.state.agreeOther, this.state.amountToBePaid, checkedRowId, this.state.final)
      })
    } else if (!e.target.checked) {
      console.log('false')
      this.setState({
        agreeOther: false
      }, () => {
        this.props.checkFee(this.state.agreeOther, 0, [])
      })
    }
  }

  handleNext = () => {
    if (this.state.activeStep < 1) {
      if (this.state.amountToBePaid === 0 || this.state.amountToBePaid < 0) {
        this.props.alert.warning('Cannot Proceed with Zero Amount')
      } else if (this.state.amountToBePaid > 0) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: true
          }
        })
      }
    } else if (this.state.activeStep === 1) {
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1
          // disableNext: true,
        }
      })
      this.makeFinalPayment()
    } else if (this.state.activeStep > 1) {
      this.setState(prevState => {
        return {
          activeStep: 0
          // erpNo: '',
          // currentSession: [],
          // showData: false,
          // showAdd: false
        }
      }, () => {
        this.props.clearProps()
        this.otherFeeHandler()
        this.setState({ amountToBePaid: 0, isSelectedPayments: [] }, () => {
          console.log('--state---------', this.state)
        })
      })
    }
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }), () => {
      // disabling and enabling next button
      if (this.state.activeStep === 1) {
        this.setState({ disableNext: true })
      } else {
        this.setState({ disableNext: false })
      }
      // if( (this.state.activeStep > 1) {

      // })
    })
  }

  partialAmountHandler = (id) => e => {
    if (e.target.value < 0) {
      this.props.alert.warning('Value should be greater then 0!')
      return
    }
    let ppValid = true
    let { partialAmount } = this.state

    const rowData = this.props.otherFeesList.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.balance < e.target.value) && (e.target.value > 0)) {
        this.props.alert.warning('Amount cant be greater than balance!')
        ppValid = false
        return false
      }
    })

    if (ppValid) {
      this.setState({ partialAmount: { ...partialAmount, [id]: e.target.value } })
    }
  }

  makeFinalPayment = () => {
    let fee = []
    console.log(this.state.feesId)
    let currentData = this.props.otherFeesList.filter(val => val.id === this.state.feesId)
    console.log('currentData------------', currentData)
    currentData.map(val => {
      return (
        fee.push({
          id: val.id,
          other_fee_id: val.other_fee.id ? val.other_fee.id : '',
          student: this.props.erp ? this.props.erp : '',
          due_date: val.due_date ? val.due_date : '',
          total_amount: this.state.amountToBePaid ? this.state.amountToBePaid : ''
        })
      )
    })
    console.log('fee------------', fee)
    if (+this.state.payment.mode === 1) {
      let cashData = {
        student: this.props.erp,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.amountToBePaid ? this.state.amountToBePaid : null,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? parseInt(this.state.payment.payment.receiptNo) : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? parseInt(this.state.payment.payment.receiptOnline) : null,
        current_date: this.state.payment.current_date ? this.state.payment.current_date : null,
        other_fee: fee
      }
      this.sendingToServer(cashData)
    } else if (+this.state.payment.mode === 2) {
      let chequeData = {
        student: this.props.erp,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.amountToBePaid ? this.state.amountToBePaid : null,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? parseInt(this.state.payment.payment.receiptNo) : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? parseInt(this.state.payment.payment.receiptOnline) : null,
        cheque_number: this.state.payment.payment.cheque.chequeNo ? this.state.payment.payment.cheque.chequeNo : null,
        date_of_cheque: this.state.payment.payment.cheque.chequeDate ? this.state.payment.payment.cheque.chequeDate : null,
        micr_code: this.state.payment.payment.cheque.micr ? this.state.payment.payment.cheque.micr : null,
        ifsc_code: this.state.payment.payment.cheque.ifsc ? this.state.payment.payment.cheque.ifsc : null,
        name_on_cheque: this.state.payment.payment.cheque.chequeName ? this.state.payment.payment.cheque.chequeName : null,
        current_date: this.state.payment.current_date ? this.state.payment.current_date : null,
        bank_name: this.state.payment.payment.cheque.chequeBankName ? this.state.payment.payment.cheque.chequeBankName : null,
        bank_branch: this.state.payment.payment.cheque.chequeBankBranch ? this.state.payment.payment.cheque.chequeBankBranch : null,
        other_fee: fee
      }
      this.sendingToServer(chequeData)
    } else if (+this.state.payment.mode === 3) {
      let internetData = {
        student: this.props.erp,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.amountToBePaid ? this.state.amountToBePaid : null,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? parseInt(this.state.payment.payment.receiptNo) : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? parseInt(this.state.payment.payment.receiptOnline) : null,
        transaction_id: this.state.payment.payment.transid ? this.state.payment.payment.transid : null,
        internet_date: this.state.payment.payment.internet.internetDate ? this.state.payment.payment.internet.internetDate : null,
        remarks: this.state.payment.payment.internet.remarks ? this.state.payment.payment.internet.remarks : null,
        current_date: this.state.payment.current_date ? this.state.payment.current_date : null,
        other_fee: fee
      }
      this.sendingToServer(internetData)
    } else if (+this.state.payment.mode === 4) {
      let creditData = {
        student: this.props.erp,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.amountToBePaid ? this.state.amountToBePaid : null,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? parseInt(this.state.payment.payment.receiptNo) : null,
        receipt_number_online: this.state.payment.payment.receiptOnline ? parseInt(this.state.payment.payment.receiptOnline) : null,
        // transaction_id: this.state.payment.payment.transid ? this.state.payment.payment.transid : null,
        remarks: this.state.payment.payment.credit.creditRemarks ? this.state.payment.payment.credit.creditRemarks : null,
        approval_code: this.state.payment.payment.credit.approval ? this.state.payment.payment.credit.approval : null,
        card_type: this.state.payment.payment.credit.credit ? this.state.payment.payment.credit.credit : null,
        card_last_digits: this.state.payment.payment.credit.digits ? this.state.payment.payment.credit.digits : null,
        bank_name: this.state.payment.payment.credit.bankName ? this.state.payment.payment.credit.bankName : null,
        credit_date: this.state.payment.payment.credit.creditDate ? this.state.payment.payment.credit.creditDate : null,
        current_date: this.state.payment.current_date ? this.state.payment.current_date : null,
        other_fee: fee
      }
      this.sendingToServer(creditData)
    }
  }

  sendingToServer = (data) => {
    console.log('finalDara---------------------------', data)
    this.props.payFee(data, this.props.alert, this.props.user)
  }

  feeDetails = () => {
    let { classes } = this.props
    return (
      <div className={classes.tableWrapper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.</TableCell>
              <TableCell>Fee Account</TableCell>
              <TableCell>Installment Name</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Concession</TableCell>
              <TableCell>Fine Amount</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Partial Payment</TableCell>
              <TableCell>Fee Type Name</TableCell>
              <TableCell>Sub Type</TableCell>
              <TableCell>Installment Start Date</TableCell>
              <TableCell>Installment Due Date</TableCell>
              <TableCell>Installment End Date</TableCell>
              {/* <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            <React.Fragment>
              {this.props.otherFeesList && this.props.otherFeesList.length ? this.props.otherFeesList.map((row, i) => {
                return (
                  <TableRow hover >
                    <TableCell>
                      <input
                        type='checkbox'
                        style={{ width: '20px', height: '20px' }}
                        checked={this.state.isChecked[row.id]}
                        // checked={this.state.isSelectedPayments[i] ? this.state.isSelectedPayments[i] : false}
                        onChange={this.handleCheckbox('select', row.id)}
                        // disabled={this.state.isDisabled[i]}
                      />
                    </TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.fee_account ? row.other_fee_installments.fee_account.fee_account_name : ''}</TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_name ? row.other_fee_installments.installment_name : ''}</TableCell>
                    <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_amount ? row.other_fee_installments.installment_amount : 0}</TableCell>
                    <TableCell>{row.discount ? row.discount : 0}</TableCell>
                    <TableCell>{row.fine ? row.fine : 0}</TableCell>
                    <TableCell>{row.balance ? row.balance : 0}</TableCell>
                    <TableCell>
                      <input
                        name='partialAmount'
                        type='number'
                        className='form-control'
                        id={row.id}
                        style={{ width: '100px' }}
                        readOnly={this.state.isChecked[row.id]}
                        onChange={this.partialAmountHandler(row.id)}
                        value={this.state.partialAmount[row.id] ? this.state.partialAmount[row.id] : row.balance} />
                    </TableCell>
                    <TableCell>{row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                    <TableCell>{row.other_fee.sub_type ? row.other_fee.sub_type : ''}</TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_start_date ? row.other_fee_installments.installment_start_date : ''}</TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.due_date ? row.other_fee_installments.due_date : ''}</TableCell>
                    <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_end_date ? row.other_fee_installments.installment_end_date : ''}</TableCell>
                  </TableRow>
                )
              }) : 'no data'}
              <TableRow>
                <TableCell colSpan={5} style={{ fontSize: '25px' }} >Total Amount to be paid: {this.state.amountToBePaid ? this.state.amountToBePaid : 0}</TableCell>
              </TableRow>
            </React.Fragment>
          </TableBody>
        </Table>
      </div>
    )
  }

  render () {
  // edit other fee modal
    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideModalHandler}>
          <EditOtherFee
            acadId={this.state.currentSession}
            otherFeeId={this.state.otherFeeId}
            erpNo={this.props.erp}
            alert={this.props.alert}
            close={this.hideModalHandler}
          />
        </Modal>
      )
    }

    // delete other fee modal
    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button negative onClick={this.deleteHandler}>Delete</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button primary onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    return (
      <Grid>
        <Grid.Row>
          {this.feeDetails()}
        </Grid.Row>
        <Grid.Row>
          {/* <input
            type='checkbox'
            name='agree'
            value={this.state.agreeOther}
            onChange={this.checkOtherFeesHandler}
          /> */}
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.agreeOther}
                onChange={this.checkOtherFeesHandler}
                value='Agree'
                color='primary'
              />
            }
            label='Agree'
          />
        </Grid.Row>
        {/* {addModal} */}
        {editModal}
        {/* {assignModal} */}
        {deleteModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  feeAccounts: state.finance.accountantReducer.listOtherFee.accountantFeeAccount,
  otherFeesList: state.finance.accountantReducer.listOtherFee.accountantOtherFees,
  dropdownOtherFeeList: state.finance.accountantReducer.listOtherFee.listOtherFees,
  trnsId: state.finance.accountantReducer.listOtherFee.transactionId,
  confirmStatus: state.finance.accountantReducer.listOtherFee.confirmPayment,
  ReceiptNo: state.finance.accountantReducer.listOtherFee.receiptNo,
  dataLoading: state.finance.common.dataLoader,
  pdfData: state.finance.common.pdfData
})

const mapDispatchToProps = (dispatch) => ({
  // loadSession: dispatch(apiActions.listAcademicSessions()),
  listOtherFees: (session, erp, alert, user) => dispatch(actionTypes.fetchAccountantOtherFee({ session, erp, alert, user })),
  addOtherFees: (data, alert, user) => dispatch(actionTypes.addAccountantOtherFee({ data, alert, user })),
  fetchFeeAccount: (erp, alert, user) => dispatch(actionTypes.fetchAccountantFeeAccount({ erp, alert, user })),
  deleteOtherFees: (id, alert, user) => dispatch(actionTypes.deleteAccOtherFeeList({ id, alert, user })),
  fetchOtherFees: (session, alert, user) => dispatch(actionTypes.fetchListtOtherFee({ session, alert, user })),
  assignOtherFees: (data, alert, user) => dispatch(actionTypes.assignOtherFee({ data, alert, user })),
  payFee: (data, alert, user) => dispatch(actionTypes.payOtherFee({ data, alert, user })),
  clearProps: () => dispatch(actionTypes.clearingAllProps()),
  feeTransactionReceipt: (transactionId, user, alert) => dispatch(actionTypes.feeTransactionReceipt({ transactionId, user, alert })),
  clearPdfData: () => dispatch({ type: actionTypes.CLEAR_PDF_DATA })
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(OtherFeesAccountant)))
