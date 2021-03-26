import React, { Component } from 'react'
// import { Grid } from 'semantic-ui-react'
import { Button, withStyles, StepLabel, Step, Stepper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
// import Select from 'react-select'

// import { apiActions } from '../../../_actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import { debounce } from '../../../utils'
// import AutoSuggest from '../../../ui/AutoSuggest/autoSuggest'
import * as actionTypes from '../store/actions/index'
import feeReceiptss from '../Receipts/feeReceiptss'
import makPayReceipts from '../Receipts/makePaymentReceipts'
import '../../css/staff.css'
import ReceiptDetails from './receiptDetails'
import OtherFeesAccountant from '../BranchAccountant/OtherFees/otherFees'
import { urls } from '../../../urls'
// import Student from '../Profiles/studentProfile'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

function getSteps () {
  return ['Fee Details', 'Other Fee Details', 'Reciept Details', 'Completed']
}

let makePayState = null

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Student' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Ledger Tab') {
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
class MakePayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      sessionData: null,
      gradeId: null,
      gradeData: null,
      sectionId: null,
      sectionData: null,
      studentTypeData: null,
      studentTypeId: null,
      otherFeeId: [],
      otherFeeAmount: 0,
      searchTypeData: {
        label: 'Student Name',
        value: 2
      },
      searchTypeId: null,
      activeStep: 0,
      feeDetailsList: [],
      isChecked: {},
      fullAmount: 0,
      selectedTotal: 0,
      final: {},
      payment: {},
      disableNext: false,
      erpCode: null,
      partialAmount: '',
      acadSession: null,
      student: '',
      selectedErpStatus: false,
      studentName: '',
      selectedNameStatus: false,
      studentErp: '',
      allSections: false,
      otherFeeDetails: [],
      totalAmountToBePaid: 0,
      finalOtherFeeDet: {},
      isWalletAgree: false,
      // makeNextDisable: false
      // makeDisableDueBut: true
      axisPos: false
    }
    this.feeDetails = this.feeDetails.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
    this.addBalance = this.addBalance.bind(this)
    this.makeFinalPayment = this.makeFinalPayment.bind(this)
    this.partialAmountHandler = this.partialAmountHandler.bind(this)
  }

  componentDidMount () {
    if (makePayState) {
      this.setState(makePayState)
    }
    this.props.fetchAllPayment(this.props.session, this.props.erp, this.props.user, this.props.alert)
    this.props.listOtherFees(this.props.session, this.props.erp, this.props.alert, this.props.user)
    this.props.fetchNormalWallet(this.props.session, this.props.erp, this.props.alert, this.props.user)
    this.props.fetchDate(this.props.alert, this.props.user)
    this.props.fetchStudentDues(this.props.erp, this.props.session, this.props.alert, this.props.user)
  }
  // componentWillUnmount () {
  //   this.setState({
  //     makeNextDisable: false
  //   })
  // }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (nextProps.erp === this.props.erp &&
  //       nextProps.session === this.props.session &&
  //       nextProps.getData === this.props.getData &&
  //       this.props.transactions === nextProps.transactions &&
  //       this.props.dataLoading === nextProps.data) {
  //     return false
  //   }
  //   // makePayState = this.state
  //   return nextProps.getData
  // }

  componentDidUpdate (prevProps) {
    const erpLength = (this.props.erp + '').length
    const {
      erp,
      session,
      alert,
      user
      // refresh
    } = this.props
    // if (refresh !== prevProps.refresh) {
    //   this.props.fetchAccountantTransaction(erp, session, user, alert)
    // }
    if (!this.props.erp || !this.props.session || !this.props.getData || erpLength !== 10) {
      return
    }
    if (this.props.erp === prevProps.erp && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData)) {
      this.props.fetchAllPayment(session, erp, user, alert)
      this.props.listOtherFees(this.props.session, this.props.erp, this.props.alert, this.props.user)
      this.props.fetchDate(this.props.alert, this.props.user)
    }
    if (session !== prevProps.session) {
      this.props.fetchStudentDues(this.props.erp, this.props.session, this.props.alert, this.props.user)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.getData) {
      this.setState({
        activeStep: 0,
        isChecked: {},
        feeDetailsList: [],
        selectedTotal: 0,
        fullAmount: 0,
        final: {},
        payment: {},
        disableNext: false,
        partialAmount: '',
        otherFeeAmount: 0,
        otherFeeId: []
      })
    }
    // if (nextProps.studentDues) {
    //   if ((this.props.studentDues && this.props.studentDues.dues) !== 0 && (this.props.studentDues && this.props.studentDues.is_academic_year_fee_paid === false)) {
    //     this.setState({
    //       makeNextDisable: true
    //     })
    //   } else {
    //     this.setState({
    //       makeNextDisable: false
    //     })
    //   }
    // }
  }

  checkOtherFeeHandler = (value, amount, otherfee, data) => {
    if (value) {
      this.setState({
        otherFeeId: otherfee,
        otherFeeAmount: amount,
        finalOtherFeeDet: data
      })
    } else {
      this.setState({
        otherFeeId: [],
        otherFeeAmount: 0,
        finalOtherFeeDet: {}
      })
    }
  }

  calculateTotalAmt = () => {
    let amt = 0
    if (this.props.feeDetailsList && this.props.feeDetailsList.length > 0) {
      amt = this.props.feeDetailsList.reduce((acc, item) => {
        acc += item.balance
        return acc
      }, 0)
    }
    return amt
  }

  generateMakePayPdf = () => {
    if (this.props.feeDetailsList && this.props.feeDetailsList.length > 0 && this.props.erpDet && this.props.erpDet.length > 0) {
      const dataTosend = {
        data: this.props.feeDetailsList,
        stdDetails: this.props.erpDet
      }
      makPayReceipts(dataTosend)
    } else {
      this.props.alert.warning('No Records Found')
    }
  }

  // Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.props.session}&branch_id=${this.props.branchId}&module_id=${this.props.moduleId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    try {
      const response = await this.getPdfData(this.props.trnsId)
      feeReceiptss(response.data)
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Something Went Wrong')
    }
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.feeDetails()
      case 1:
        return <OtherFeesAccountant
          checkFee={this.checkOtherFeeHandler}
          session={this.props.session}
          getData={this.props.getData}
          erp={this.props.erp}
          user={this.props.user}
          alert={this.props.alert}
        />
      case 2:
        return <ReceiptDetails
          payment
          makePayAmt={this.state.selectedTotal}
          otherPayAmt={this.state.otherFeeAmount}
          otherFeeId={this.state.otherFeeId}
          otherFeeDetails={this.state.finalOtherFeeDet}
          session={this.props.session}
          erp={this.props.erpCode}
          money={this.state.final}
          getDetail={this.getPaymentDetailHandler}
          getData={this.getAxisPosDataHandler}
          totalAmountToBePaid={this.state.totalAmountToBePaid}
          alert={this.props.alert}
          // walletInfo={this.props.walletInfo}
        />
      case 3:
        if (this.props.status) {
          return <React.Fragment>
            <center>
              <h2>Thank You For Recording Payment Details</h2>
              {this.props.ReceiptNo ? <b style={{ fontSize: '20px' }}>Receipt No is {this.props.ReceiptNo}</b> : null}
              <br />
              <Button variant='contained' onClick={this.generatePdf}>Download PDF</Button>
            </center>
          </React.Fragment>
        }
        break
        // else {
        //   return <React.Fragment>
        //     <h2>Payment Failed</h2>
        //   </React.Fragment>
        // }
      default:
        return 'Unknown stepIndex'
    }
  }

  feeDetails = (e) => {
    let { classes } = this.props
    return (
      <React.Fragment style={{ position: 'relative' }}>
        {(this.props.studentDues && this.props.studentDues.dues) !== 0 && (this.props.studentDues && this.props.studentDues.is_academic_year_fee_paid === false)
          ? <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
            <label style={{ fontSize: '18px', color: 'red', paddingTop: '25px' }}>Clear your dues to proceed. Dues are Pending! and Due Amount is : {this.props.studentDues.dues} </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '100px' }}>
              {(this.props.studentDues && this.props.studentDues.dues) !== 0 && (this.props.studentDues && this.props.studentDues.is_academic_year_fee_paid === false)
                ? <Button
                  variant='contained'
                  style={{ margin: '20px 0px' }}
                  onClick={this.sendData}
                  color='primary'
                >
            CLEAR YOUR DUES
                </Button>
                : []}
            </div>
          </div>
          : []}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: '20px 0px' }}
            onClick={this.generateMakePayPdf}
          >
            Download PDF
          </Button>
        </div>
        <div className={classes.tableWrapper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Fee Type</TableCell>
                <TableCell>Installment</TableCell>
                <TableCell>Fee Amount</TableCell>
                <TableCell>Concession</TableCell>
                <TableCell>Fine Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Partial Payment</TableCell>
                {/* <TableCell>Paid Till Month</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <React.Fragment>
                {this.props.feeDetailsList
                  ? this.props.feeDetailsList.map((row, i) => {
                    if (!row.is_paid) {
                      return (
                        <TableRow hover >
                          <TableCell>
                            <input
                              type='checkbox'
                              name='checking'
                              value={i + 1}
                              checked={this.state.isChecked[row.id]}
                              onChange={
                                (e) => this.addBalance(e, row.id)
                              } />
                          </TableCell>
                          <TableCell>{row.fee_type.fee_type_name}</TableCell>
                          <TableCell>{row.installments.installment_name}</TableCell>
                          <TableCell>{row.installments.installment_amount}</TableCell>
                          <TableCell>{row.discount ? row.discount : 0}</TableCell>
                          <TableCell>{row.fine_amount ? row.fine_amount : 0}</TableCell>
                          <TableCell>{row.amount_paid}</TableCell>
                          <TableCell>{row.balance}</TableCell>
                          <TableCell>
                            <input
                              name='partialAmount'
                              type='number'
                              className='form-control'
                              min='0'
                              id={row.id}
                              style={{ width: '100px' }}
                              readOnly={this.state.isChecked[row.id]}
                              onChange={(e) => this.partialAmountHandler(e, row.id)}
                              value={this.state.partialAmount[row.id] ? this.state.partialAmount[row.id] : row.balance}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    }
                  })
                  : null
                }
              </React.Fragment>
            </TableBody>
          </Table>
          <h3>Total Amount Selected: {this.state.selectedTotal}</h3>
        </div>
        {/* <div>
          {this.props.feeDetailsList.length > 0 && !this.props.feeDetailsList[0].is_paid
            ? <TableRow>
              <TableCell colSpan={3} style={{ fontSize: '16px' }}>Total Amount: {this.calculateTotalAmt()}</TableCell>
              <TableCell colSpan={3}>{this.state.feeDetailsList}</TableCell>
            </TableRow>
            : null
          }
        </div> */}
      </React.Fragment>
    )
  }

  partialAmountHandler = (e, id) => {
    console.log('e and id', e, id)
    let ppValid = true
    let { partialAmount } = this.state

    const rowData = this.props.feeDetailsList.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.balance < e.target.value) && (e.target.value > 0)) {
        this.props.alert.warning('Amount cant be greater than balance!')
        ppValid = false
        return false
      }
    })

    if (ppValid) {
      this.setState({ partialAmount: { ...partialAmount, [id]: e.target.value } })
    } // 1908010049
  }

  // adding the balance amount based on checkbox
  addBalance = (e, id) => {
    let { isChecked } = this.state
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [id]: true } })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [id]: false } })
    }

    let pay = this.state.selectedTotal
    const data = this.props.feeDetailsList.filter(list => (list.id === id))

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
      this.setState({ selectedTotal: pay })
    } else if (pay > 0) {
      this.setState({ selectedTotal: pay })
    }
  }

  makeFinalPayment = () => {
    let insta = []
    let otherDetails = []
    // let otherFeeDet = []
    if (this.state.final && this.state.final.installment_rows && this.state.final.installment_rows.length > 0) {
      this.state.final.installment_rows.map(row => {
        row.map(r => {
          insta.push({
            fee_type: r.fee_type.id,
            installment_id: r.installments.id,
            amount: row.payment,
            balance: row.balance,
            id: r.id
          })
        })
      })
    }

    console.log('final state make payment', this.state.finalOtherFeeDet.installment_rows)

    if (this.state.finalOtherFeeDet && this.state.finalOtherFeeDet.installment_rows && this.state.finalOtherFeeDet.installment_rows.length > 0) {
      this.state.finalOtherFeeDet.installment_rows.map(row => {
        row.map(r => {
          otherDetails.push({
            other_fee_installments: r.other_fee_installments ? r.other_fee_installments : '',
            other_fee: r.other_fee ? r.other_fee : '',
            id: r.id ? r.id : '',
            is_delete: r.is_delete ? r.is_delete : false,
            is_paid: r.is_paid ? r.is_paid : false,
            is_shuffled: r.is_shuffled ? r.is_shuffled : false,
            partial_payment: row.partial_payment,
            balance: r.balance ? r.balance : 0,
            academic_year: r.academic_year ? r.academic_year : '',
            paid_amount: r.paid_amount ? r.paid_amount : 0,
            fine: r.fine ? r.fine : 0
          })
        })
      })
    }

    console.log('other fee details', otherDetails)

    // let currentOtherFee = this.props.otherFeesList.filter(val => val.id === this.state.otherFeeId)
    let wal = null
    let tot = this.state.selectedTotal + this.state.otherFeeAmount
    if (this.props.walletInfo.length && this.state.isWalletAgree) {
      let bal = this.props.walletInfo[0].reaming_amount
      console.log('total and balnce: ', tot, bal)
      wal = {
        wallet_agree: this.state.isWalletAgree,
        wallet_data: this.props.walletInfo[0],
        wallet_amount_taken: this.state.isWalletAgree && (tot >= bal) ? bal : this.state.isWalletAgree && (tot <= bal) ? tot : 0
      }
    }

    if (+this.state.payment.mode === 6) {
      let walletData = {
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        session_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
        total_fee_amount: this.state.selectedTotal ? this.state.selectedTotal : 0,
        total_other_fee_amount: this.state.otherFeeAmount ? this.state.otherFeeAmount : 0,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
        current_date: this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
        fee: insta,
        other_fee: otherDetails
      }
      this.sendingToServer(walletData)
      return
    }

    if (+this.state.payment.mode === 1) {
      let cashData = {
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        session_year: this.props.session,
        branch_id: this.props.branchId,
        module_id: this.props.moduleId,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
        total_fee_amount: this.state.selectedTotal ? this.state.selectedTotal : 0,
        total_other_fee_amount: this.state.otherFeeAmount ? this.state.otherFeeAmount : 0,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
        current_date: this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
        fee: insta,
        other_fee: otherDetails
      }
      this.sendingToServer(cashData)
    } else if (+this.state.payment.mode === 2) {
      let chequeData = {
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        session_year: this.props.session,
        branch_id: this.props.branchId,
        module_id: this.props.moduleId,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
        cheque_number: this.state.payment.payment.cheque.chequeNo ? this.state.payment.payment.cheque.chequeNo : null,
        date_of_cheque: this.state.payment.payment.cheque.chequeDate ? this.state.payment.payment.cheque.chequeDate : null,
        micr_code: this.state.payment.payment.cheque.micr ? this.state.payment.payment.cheque.micr : null,
        ifsc_code: this.state.payment.payment.cheque.ifsc ? this.state.payment.payment.cheque.ifsc : null,
        // name_on_cheque: this.state.payment.payment.cheque.chequeName ? this.state.payment.payment.cheque.chequeName : null,
        current_date: this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
        bank_name: this.state.payment.payment.cheque.chequeBankName ? this.state.payment.payment.cheque.chequeBankName : null,
        bank_branch: this.state.payment.payment.cheque.chequeBankBranch ? this.state.payment.payment.cheque.chequeBankBranch : null,
        fee: insta,
        other_fee: otherDetails
      }
      this.sendingToServer(chequeData)
    } else if (+this.state.payment.mode === 3) {
      let internetData = {
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        session_year: this.props.session,
        branch_id: this.props.branchId,
        module_id: this.props.moduleId,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
        // transaction_id: this.state.payment.payment.transid ? this.state.payment.payment.transid : null,
        internet_date: this.state.payment.payment.internet.internetDate ? this.state.payment.payment.internet.internetDate : null,
        remarks: this.state.payment.payment.internet.remarks ? this.state.payment.payment.internet.remarks : null,
        current_date: this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
        fee: insta,
        other_fee: otherDetails
      }
      this.sendingToServer(internetData)
    } else if (+this.state.payment.mode === 4) {
      let creditData = {
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        session_year: this.props.session,
        branch_id: this.props.branchId,
        module_id: this.props.moduleId,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
        total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
        payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
        receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
        receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
        remarks: this.state.payment.payment.credit.creditRemarks ? this.state.payment.payment.credit.creditRemarks : null,
        approval_code: this.state.payment.payment.credit.approval ? this.state.payment.payment.credit.approval : null,
        card_type: this.state.payment.payment.credit.credit ? this.state.payment.payment.credit.credit : null,
        card_last_digits: this.state.payment.payment.credit.digits ? this.state.payment.payment.credit.digits : null,
        bank_name: this.state.payment.payment.credit.bankName ? this.state.payment.payment.credit.bankName : null,
        credit_date: this.state.payment.payment.credit.creditDate ? this.state.payment.payment.credit.creditDate : null,
        current_date: this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
        fee: insta,
        other_fee: otherDetails
      }
      this.sendingToServer(creditData)
    }
  }

  sendingToServer = (data) => {
    console.log('final data', data)
    this.props.sendAllPayment(data, this.props.user, this.props.alert)
  }

  handleNext = () => {
    console.log('index:', this.state.activeStep)
    if (this.state.activeStep < 1) {
      this.receiptDetailsTableHandler()
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1
          // disableNext: true
        }
      }, () => {

      })
    } else if (this.state.activeStep === 1) {
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1
          // disableNext: true
        }
      })
    } else if (this.state.activeStep === 2) {
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1,
          disableNext: true
        }
      })
      this.makeFinalPayment()
    } else if (this.state.activeStep > 2) {
      this.setState(prevState => {
        return {
          activeStep: 0,
          isChecked: {},
          feeDetailsList: [],
          selectedTotal: 0,
          fullAmount: 0,
          final: {},
          payment: {},
          disableNext: false,
          partialAmount: '',
          otherFeeAmount: 0,
          otherFeeId: [],
          finalOtherFeeDet: {}
        }
      }, () => {
        this.props.clearAllProps()
        this.props.fetchAllPayment(this.props.session, this.props.erp, this.props.user, this.props.alert)
        this.props.listOtherFees(this.props.session, this.props.erp, this.props.alert, this.props.user)
        this.props.fetchNormalWallet(this.props.session, this.props.erp, this.props.alert, this.props.user)
        // this.props.fetchAllPayment(this.props.erpCode, this.props.user, this.props.alert)
      })
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }), () => {
      // disabling and enabling next button
      if (this.state.activeStep === 1) {
        // this.setState({ disableNext: true })
      } else {
        // this.setState({ disableNext: false })
      }
      // if( (this.state.activeStep > 1) {

      // })
    })
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };

  receiptDetailsTableHandler = () => {
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
      payInstall.push(this.props.feeDetailsList.filter(list => (+list.id === +row)))
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
      ele.payment = payed[i]
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
    })
  }

  getAxisPosDataHandler = (isAxisPos) => {
    this.setState({
      axisPos: isAxisPos
    })
  }

  getPaymentDetailHandler = (confirm, wallet, paymentDetail, otherFee, total) => {
    if (confirm) {
      // this.setState({ disableNext: false })
      console.log('other', otherFee)
      this.setState({
        disableNext: false,
        payment: paymentDetail,
        otherFeeDetails: otherFee,
        totalAmountToBePaid: total,
        isWalletAgree: wallet
      }, () => {
        console.log('other Fee', this.state)
      })
    } else {
      // this.setState({ disableNext: true })
    }
    // we Will SetState to PaymentDatail
  }
  sendData = () => {
    let year = this.props.session && this.props.session.split('-')
    console.log('year', year)
    let newYear = year.map((n) => n - 1)
    newYear = newYear.join('-')
    console.log('previousYear', newYear)
    this.props.parentCallback(newYear)
    this.setState({
      selectedTotal: null,
      isChecked: {}
    })
  }
  render () {
    // let { classes } = this.props
    // console.log('datefrom server: ', this.props.dateFromServer)
    const { classes } = this.props
    const steps = getSteps()
    const { activeStep } = this.state

    return (
      <React.Fragment>
        {this.props.erpCode
          ? <div className={classes.root}>
            {/* <Student erp={this.props.erpCode} user={this.props.user} /> */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {this.state.activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>All steps completed</Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                  {!this.state.axisPos
                    ? <div>
                      <Button
                        disabled={activeStep === 0 || activeStep === 3}
                        onClick={this.handleBack}
                        className={classes.backButton}
                      >
                      Back
                      </Button>
                      <Button variant='contained' color='primary' onClick={this.handleNext}
                      // disabled={this.state.disableNext}
                      // disabled={this.state.makeNextDisable}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                    : []}
                </div>
              )}
            </div>
          </div>
          : null }
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  // session: state.academicSession.items,
  feeDetailsList: state.finance.makePayAcc.feeDetailsList,
  erpCode: state.finance.makePayAcc.erpCode,
  erpDet: state.finance.makePayAcc.erpDetails,
  trnsId: state.finance.makePayAcc.transactionId,
  status: state.finance.makePayAcc.status,
  ReceiptNo: state.finance.makePayAcc.receiptNo,
  ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  dataLoading: state.finance.common.dataLoader,
  gradeData: state.finance.accountantReducer.pdc.gradeData,
  otherFeesList: state.finance.accountantReducer.listOtherFee.accountantOtherFees,
  dateFromServer: state.finance.common.dateFromServer,
  walletInfo: state.finance.makePayAcc.walletInfo,
  studentDues: state.finance.makePayAcc.studentDues
})

const mapDispatchToProps = dispatch => ({
  // loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchAllPayment: (session, erp, user, alert) => dispatch(actionTypes.fetchAllPayment({ session, erp, user, alert })),
  listOtherFees: (session, erp, alert, user) => dispatch(actionTypes.fetchAccountantOtherFee({ session, erp, alert, user })),
  sendAllPayment: (data, user, alert) => dispatch(actionTypes.sendAllPayment({ data, user, alert })),
  clearAllProps: () => dispatch(actionTypes.clearAllProps()),
  fetchGrades: (session, alert, user, moduleId) => dispatch(actionTypes.fetchGrades({ session, alert, user, moduleId })),
  fetchErpSuggestions: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.fetchErpSuggestions({ type, session, grade, section, status, erp, alert, user })),
  fetchAllSections: (session, gradeId, alert, user, moduleId ) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user, moduleId })),
  fetchDate: (alert, user) => dispatch(actionTypes.fetchDateFromServer({ alert, user })),
  fetchStudentDues: (erp, session, alert, user) => dispatch(actionTypes.fetchStudentDues({ erp, session, alert, user })),
  fetchNormalWallet: (session, erp, alert, user) => dispatch(actionTypes.fetchNormalWallet({ session, erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(MakePayment)))
