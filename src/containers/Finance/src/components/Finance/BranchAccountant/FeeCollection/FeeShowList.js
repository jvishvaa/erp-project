import React, { Component, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
import { withStyles, Radio, StepLabel, Step, Stepper, Button, Typography, Grid, Table, TableCell, TableRow, TableHead, TableBody, Paper, TextField, Checkbox } from '@material-ui/core/'
import Select from 'react-select'
import axios from 'axios'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import { urls } from '/home/om/lets_eduvate/oms/src/urls.js'
// import feeReceipts from '/home/om/lets_eduvate/oms/src/components/Finance/Receipts/feeReceipts.js'
import { urls } from '../../../../urls'
import feeReceipts from '../../Receipts/feeReceipts'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'
import { AlertNotificationContext } from '../../../../../../../context-api/alert-context/alert-state'

const styles = (theme) => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

function getSteps () {
  return ['1. Fee Details', '2. Receipt Details', '3. Payment mode', '4. Print Receipt']
}

class FeeShowList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      session: null,
      disabled: true,
      checkBox: {},
      amountToEnter: '',
      activeStep: 0,
      disableNext: false,
      receiptData: [],
      useId: [],
      roundedAmount: '',
      amount: '',
      finalAmt: null,
      receiptTableInfo: {
        feeType: '',
        subType: '',
        amount: '',
        roundedAmount: '',
        gstPercentage: '',
        gstAmount: '',
        roundedGST: '',
        totalAmount: ''
      },
      receiptDetails: {
        receiptInfo: {
          // receiptNo: '',
          dateofPayment: new Date().toISOString().substr(0, 10)
        },
        outsiderInfo: {
          studentName: '',
          parentName: '',
          parentMobile: '',
          class: '',
          schoolName: '',
          address: '',
          outsiderDescription: ''
        },
        studentNameInsider: '',
        radioChecked: 'online',
        boxChecked: true,
        selectValue: 1,
        generalDescription: '',
        receiptNoOnline: ''
      },
      selectedPayment: 'a',
      searchByValue: null,
      searchByData: null,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isTrans: false,
      confirm: false,
      payment: {
        cheque: {
          chequeNo: null,
          chequeDate: null,
          ifsc: null,
          micr: null,
          // chequeName: null,
          chequeBankName: null,
          chequeBankBranch: null
        },
        internet: {
          internetDate: null,
          remarks: null
        },
        credit: {
          credit: 1,
          digits: null,
          creditDate: null,
          approval: null,
          bankName: null,
          creditRemarks: null
        },
        transid: null,
        dateOfPayment: new Date().toISOString().substr(0, 10)
      }
    }
  }


  // let { setAlert } = useContext(AlertNotificationContext);
  static contextType = AlertNotificationContext

  outsiderInfoHandler = (event) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    const newoutsiderInfo = { ...newReceiptDetails.outsiderInfo }
    switch (event.target.name) {
      case 'studentName': {
        newoutsiderInfo['studentName'] = event.target.value
        break
      }
      case 'parentName': {
        newoutsiderInfo['parentName'] = event.target.value
        break
      }
      case 'parentMobile': {
        newoutsiderInfo['parentMobile'] = event.target.value
        break
      }
      // case 'class': {
      //   newoutsiderInfo['class'] = event.value
      //   break
      // }
      case 'schoolName': {
        newoutsiderInfo['schoolName'] = event.target.value
        break
      }
      case 'address': {
        newoutsiderInfo['address'] = event.target.value
        break
      }
      case 'outsiderDescription': {
        newoutsiderInfo['outsiderDescription'] = event.target.value
        break
      }
      default: {

      }
    }
    newReceiptDetails.outsiderInfo = newoutsiderInfo
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  receiptInfoHandler = (event) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    const newreceiptInfo = { ...newReceiptDetails.receiptInfo }
    switch (event.target.name) {
      case 'receiptNo': {
        newreceiptInfo['receiptNo'] = event.target.value
        break
      }
      case 'dateofPayment': {
        newreceiptInfo['dateofPayment'] = event.target.value
        break
      }
      default: {

      }
    }
    newReceiptDetails.receiptInfo = newreceiptInfo
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  studentNameInsiderHandler = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['studentNameInsider'] = e.target.value
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  generalDescriptionHandler = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['generalDescription'] = e.target.value
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  receiptNoOnlineHandler = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['receiptNoOnline'] = e.target.value
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.feeListTableHandler()
        // break
      case 1:
        return this.receiptDetailHandler()
      case 2:
        return this.paymentMode()
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
      default:
        return 'Unknown stepIndex'
    }
  }

  componentDidMount () {
    // console.log('Total1', this.props.location.state.session)
    this.setState({
      session: this.props.location.state.session
    }, () => {
      this.props.fetchFeeCollection(this.state.session, this.props.user, this.props.alert)
      this.props.fetchGrades(this.state.session, this.props.alert, this.props.user)
    })
  }


  componentDidUpdate () {
    // console.log('====> new alert: ', this.context.setAlert('success', 'updated success'))
    console.log('====> old alert: ', this.props.alert)
    console.log('====> old user: ', this.props.user)
  }
  checkBoxHandler = (e, id) => {
    let { checkBox } = this.state
    let { amountToEnter } = this.state
    if (e.target.checked) {
      this.setState({ checkBox: { ...checkBox, [id]: true } })
      // this.setState({ amount: { ...amount, [id]: !this.state.disabled } })
    } else {
      this.setState({ checkBox: { ...checkBox, [id]: false }, amountToEnter: { ...amountToEnter, [id]: false } })
      // this.setState({ amountToEnter: { ...amountToEnter, [id]: null } })
    }
    // console.log(checkBox)
    // if (checkBox) {

    // }
  }

  amountHandler = (id) => e => {
    // let amountIds = []
    console.log('the value', e.target.value)
    let validAmount = true
    let { amountToEnter } = this.state
    let { disableNext } = this.state
    console.log(disableNext)
    const rowData = this.props.feeList.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.amount < e.target.value)) {
        this.props.alert.warning('Amount cant be greater than given amount!')
        validAmount = false
        return false
      }
    })
    if (validAmount) {
      this.setState({ amountToEnter: { ...amountToEnter, [id]: e.target.value } }, () => {
        console.log('amountToEnter: ', this.state.amountToEnter)
      }, { disableNext: false })
    }
  }

  dataIsSuitableToSend = (data) => {
    let suited = true
    Object.keys(data).forEach((keys) => {
      if (data[keys] === null) {
        // this.setState({validation : false}, ()=>{return false})
        suited = false
        return undefined
      }
    })
    return suited
  }

  handleConfirm = (event) => {
    console.log('activ state: ', this.state.activeStep)
    // let dataToSend = null
    if (this.state.isChequePaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.cheque)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
    } else if (this.state.isInternetPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.internet)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
    } else if (this.state.isCreditPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.credit)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
    }
    if (event.target.checked) {
      this.setState({ confirm: true, disableNext: false }, () => {
        // console.log(dataToSend)
        // this.props.getDetail(this.state.confirm, dataToSend)
      })
    } else {
      this.setState({ confirm: false, disableNext: true }, () => {
        // this.props.getDetail(this.state.confirm)
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('===receiceed props', nextProps)
    if (nextProps.ifsc) {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      newCheque['micr'] = nextProps.ifsc.micr ? nextProps.ifsc.micr : null
      newCheque['chequeBankName'] = nextProps.ifsc.bank ? nextProps.ifsc.bank : null
      newCheque['chequeBankBranch'] = nextProps.ifsc.branch ? nextProps.ifsc.branch : null
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
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

  handleNext = () => {
    console.log('amount state', this.state.activeStep)
    if (this.state.activeStep < 1) {
      if (this.state.amountToEnter) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: false
          }
        })
      } else {
        this.props.alert.warning('Enter Amount')
        // this.props.AlertNotificationContext.setAlert('error', 'Enter the Amount');
      }
    } else if (this.state.activeStep === 1) {
      const { studentName, parentName, parentMobile } = this.state.receiptDetails.outsiderInfo
      const { generalDescription } = this.state.receiptDetails
      if ((studentName && parentName && parentMobile) || generalDescription) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: true
          }
        })
        this.sendOutsiderInfo()
      } else {
        this.props.alert.warning('fill all details')
      }
    } else if (this.state.activeStep === 2) {
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1
          // disableNext: true
        }
      })
      this.makeFinalPayment()
    } else if (this.state.activeStep > 2) {
      this.setState(prevState => {
        return {
          activeStep: 0
          // disableNext: true
        }
      })
      // this.makeFinalPayment()
    }
  }

  sendOutsiderInfo = () => {
    console.log('sendOutsiderInfo')
    let amountIds = null
    amountIds = Object.keys(this.state.amountToEnter)

    const { receiptDetails } = this.state
    let data = {
      session_year: this.state.session ? this.state.session : null,
      student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
      parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
      parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
      grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
      school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
      address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
      description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : '',
      other_fee: amountIds,
      student_type: 2
    }
    this.props.saveOutsiders(data, this.props.user, this.props.alert)
  }

  makeFinalPayment = () => {
    const { payment } = this.state
    if (this.state.selectedPayment === 'a') {
      let cashData = {
        session_year: this.state.session ? this.state.session : null,
        // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.studentId ? this.props.studentId : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        total_amount: 200,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
        receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
        current_date: new Date().toISOString().substr(0, 10)
      }
      this.sendingToServer(cashData)
    } else if (this.state.selectedPayment === 'b') {
      let chequeData = {
        session_year: this.state.session ? this.state.session : null,
        // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.studentId ? this.props.studentId : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        total_amount: 200,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
        receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
        cheque_number: payment.cheque.chequeNo ? payment.cheque.chequeNo : null,
        date_of_cheque: payment.cheque.chequeDate ? payment.cheque.chequeDate : null,
        micr_code: payment.cheque.micr ? payment.cheque.micr : null,
        ifsc_code: payment.cheque.ifsc ? payment.cheque.ifsc : null,
        // name_on_cheque: payment.cheque.chequeName ? payment.cheque.chequeName : null,
        current_date: new Date().toISOString().substr(0, 10),
        bank_name: payment.cheque.chequeBankName ? payment.cheque.chequeBankName : null,
        bank_branch: payment.cheque.chequeBankBranch ? payment.cheque.chequeBankBranch : null
      }
      this.sendingToServer(chequeData)
    } else if (this.state.selectedPayment === 'c') {
      let internetData = {
        session_year: this.state.session ? this.state.session : null,
        // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.studentId ? this.props.studentId : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        total_amount: 200,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
        receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
        transaction_id: payment.transid ? payment.transid : null,
        internet_date: payment.internet.internetDate ? payment.internet.internetDate : null,
        remarks: payment.internet.remarks ? payment.internet.remarks : null,
        current_date: new Date().toISOString().substr(0, 10)
      }
      this.sendingToServer(internetData)
    } else if (this.state.selectedPayment === 'd') {
      let creditData = {
        session_year: this.state.session ? this.state.session : null,
        // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.studentId ? this.props.studentId : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        total_amount: 200,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
        receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
        remarks: payment.credit.creditRemarks ? payment.credit.creditRemarks : null,
        approval_code: payment.credit.approval ? payment.credit.approval : null,
        card_type: payment.credit.credit ? payment.credit.credit : null,
        card_last_digits: payment.credit.digits ? payment.credit.digits : null,
        bank_name: payment.credit.bankName ? payment.credit.bankName : null,
        credit_date: payment.credit.creditDate ? payment.credit.creditDate : null,
        current_date: new Date().toISOString().substr(0, 10)
      }
      this.sendingToServer(creditData)
    }
  }

  sendingToServer = (paymentObj) => {
    this.props.paymentAction(paymentObj, this.props.user, this.props.alert)
  }

  radioHandler = e => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['radioChecked'] = e.target.value
    this.setState({
      receiptDetails: newReceiptDetails
    })
    // console.log(this.state.amountToEnter.value)
  }

  boxHandler = e => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['boxChecked'] = !this.state.receiptDetails.boxChecked
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  selectHandler = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    newReceiptDetails['selectValue'] = e.value
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  selectCode = (e) => {
    this.setState({
      searchByValue: e.value,
      searchByData: e
    })
  }

  gradeHandler = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    const newOutsiderInfo = { ...newReceiptDetails.outsiderInfo }
    newOutsiderInfo['class'] = e.value
    newReceiptDetails.outsiderInfo = newOutsiderInfo
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FetchPdfData}?transaction_id=${transactionId}&academic_year=${this.state.session}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    try {
      const response = await this.getPdfData(this.props.trnsId)
      feeReceipts(response.data)
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Something Went Wrong')
    }
  }

  // renderReceiptTable = () => {

  // }

  feeListTableHandler = () => {
    let feeListTable = null
    console.log('print fee list table:', this.props.feeList)
    if (this.props.feeList && this.props.feeList.length > 0) {

      feeListTable = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> select</TableCell>
              <TableCell> Fee Collection Type</TableCell>
              <TableCell> Sub Type</TableCell>
              <TableCell> Amount Given</TableCell>
              <TableCell> Amount</TableCell>
              <TableCell> Fee Account</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.props.feeList.length && this.props.feeList.map((val, i) => { 
            return (
              <TableRow>
                <TableCell>
                  <input
                    type='checkbox'
                    name='checking'
                    // value={i + 1}
                    checked={this.state.checkBox[val.id]}
                    onChange={
                      (e) => { this.checkBoxHandler(e, val.id) }
                    } />
                </TableCell>
                <TableCell>
                  {val.fee_type_name ? val.fee_type_name : ''}
                  </TableCell>
                  <TableCell>{val.sub_type ? val.sub_type : ''} </TableCell>
                <TableCell>{ val.amount && val.amount ? val.amount : ''}</TableCell>
                <TableCell>
                  <input
                    name='amount'
                    type='number'
                    // value={i + 1}
                    value={this.state.amountToEnter[val.id]}
                    readOnly={!this.state.checkBox[val.id]}
                    onChange={this.amountHandler(val.id)}
                  />
                  </TableCell>
                <TableCell>
                  {val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : ''}
                  </TableCell>
                </TableRow>
                )})}
            {/* {this.renderTable()} */}
            </TableBody>
          </Table>
      )
    }
    return feeListTable
  }

  receiptDetailHandler = (id) => {
    // let {
    //   studentName,
    //   parentName,
    //   parentMobile,
    //   schoolName,
    //   address,
    //   outsiderDescription
    // } = this.state
    let totalAmountArr = null
    let totalAmount = 0
    let { amountToEnter } = this.state
    // let { disableNext } = this.state
    console.log(amountToEnter)
    // console.log(disableNext)
    totalAmountArr = Object.values(this.state.amountToEnter)
    totalAmountArr.map((ele) => {
      totalAmount += +ele
    })
    // show the amount in material ui table
    let amountIds = null
    amountIds = Object.keys(this.state.amountToEnter)
    console.log('AmountIds: ', amountIds)
    let receiptData = []
    this.props.feeList.forEach(function (item) {
      for (let index = 0; index < amountIds.length; index++) {
        if (item.id === +amountIds[index]) {
          receiptData.push(item)
        }
      }
    })
    // if (this.state.boxChecked) {
    //   if (studentName && parentName && parentMobile && schoolName && address && outsiderDescription && this.state.class) {
    //     disableNext = false
    //     console.log('DISABLENEXT', this.state.disableNext)
    //   } else {
    //     disableNext = true
    //   }
    // } else {
    //   if (this.state.generalDescription) {
    //     disableNext = false
    //     console.log('DISABLENEXT', this.state.disableNext)
    //   } else {
    //     disableNext = true
    //   }
    // }
    console.log('receiptData', receiptData)
    console.log('the amounttoenter state', this.state.amountToEnter)
    return (
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right'>Fee Type</TableCell>
                <TableCell align='right'>Sub Type</TableCell>
                <TableCell align='right'>Amount</TableCell>
                {/* <TableCell align='right'>Rounded Amount</TableCell> */}
                <TableCell align='right'>GST %</TableCell>
                <TableCell align='right'>GST Amount</TableCell>
                {/* <TableCell align='right'>Rounded GST</TableCell> */}
                <TableCell align='right'>TotalAmount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                receiptData.map((val, i) => {
                  return (
                    <TableRow>
                      <TableCell align='right'>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      <TableCell align='right'>{val.sub_type ? val.sub_type : ''}</TableCell>
                      <TableCell align='right'>{amountToEnter[val.id] ? amountToEnter[val.id] : ''}</TableCell>
                      {/* <TableCell align='right'>{val.amount ? val.amount : ''}</TableCell> */}
                      <TableCell align='right'>{'0'}</TableCell>
                      <TableCell align='right'>{'0'}</TableCell>
                      {/* <TableCell align='right'>{'0'}</TableCell> */}
                      <TableCell align='right'>{amountToEnter[val.id] ? amountToEnter[val.id] : ''}</TableCell>
                    </TableRow>
                  )
                })}
              <TableRow>
                <TableCell align='right' style={{ fontSize: '18px' }}><strong>Total: {totalAmount}</strong></TableCell>
              </TableRow>
            </TableBody>
            {/* <TableFooter>

            </TableFooter> */}
          </Table>
        </Paper>
        <div style={{ margin: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <label>Receipt Type</label>
              <Radio
                type='radio'
                name='receipt Type'
                value='online'
                checked={this.state.receiptDetails.radioChecked === 'online'}
                onChange={this.radioHandler}
                aria-label='Online'
              />Online
            </Grid>
            <Grid item xs={3}>
              <Radio
                type='radio'
                name='receipt Type'
                value='manual'
                checked={this.state.receiptDetails.radioChecked === 'manual'}
                onChange={this.radioHandler}
                aria-label='Manual'
              />Manual
            </Grid>
          </Grid>
          {this.state.receiptDetails.radioChecked === 'manual'
            ? <Grid container spacing={3}>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  label='Receipt No Online'
                  type='number'
                  margin='dense'
                  // className='form-control'
                  fullWidth
                  onChange={this.receiptNoOnlineHandler}
                  required
                  value={this.state.receiptDetails.receiptNoOnline}
                  variant='outlined'
                  name='receiptNoOnline'
                />
              </Grid>
            </Grid> : null
          }
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                className={this.props.classes.textField}
                label='Date of Payment'
                type='date'
                name='dateofPayment'
                margin='dense'
                fullWidth
                onChange={this.receiptInfoHandler}
                required
                value={this.state.receiptDetails.receiptInfo.dateofPayment}
                variant='outlined'
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <p style={{ fontSize: '16px' }}>Total Amount: {totalAmount}</p>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.receiptDetails.boxChecked}
                    onChange={this.boxHandler}
                    // value="checkedB"
                    color='primary'
                  />
                }
                label='Is Student Related Payement'
              />
              {/* <Checkbox
                label='Is Student Related Payement'
                checked={this.state.receiptDetails.boxChecked}
                onChange={this.boxHandler}
                color='primary'
                inputProps={{
                  'aria-label': 'Is Student Related Payement'
                }}
              /> */}
              {/* <input
                type='checkbox'
                name='isStudentRelatedPayement'
                // className='form-control'
                onChange={this.boxHandler}
                checked={this.state.receiptDetails.boxChecked}
              /><label>Is Student Related Payement </label> */}
            </Grid>
          </Grid>
          { this.state.receiptDetails.boxChecked
            ? <Grid container spacing={3} style={{ margin: '20px', marginTop: '5px' }}>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='Student name'
                  type='text'
                  margin='dense'
                  name='studentName'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.studentName}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='Parent name'
                  type='text'
                  margin='dense'
                  name='parentName'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.parentName}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='Parent mobile'
                  type='number'
                  margin='dense'
                  name='parentMobile'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.parentMobile}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <div style={{ width: '200px', marginTop: '10px', lineHeight: '2.5' }}>
                  <Select
                    style={{ marginLeft: '8px', marginRight: '8px' }}
                    onChange={(e) => { this.gradeHandler(e) }}
                    name='class'
                    // className='form-control'
                    options={
                      this.props.gradeData
                        ? this.props.gradeData.map(grades => ({
                          value: grades.grade.id,
                          label: grades.grade.grade
                        }))
                        : []
                    }
                  />
                </div>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='School name'
                  type='text'
                  name='schoolName'
                  margin='dense'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.schoolName}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  //   className='form-control'
                  label='Address'
                  type='text'
                  name='address'
                  margin='dense'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.address}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='Description'
                  type='multiliner'
                  name='outsiderDescription'
                  margin='dense'
                  fullWidth
                  value={this.state.receiptDetails.outsiderInfo.outsiderDescription}
                  onChange={this.outsiderInfoHandler}
                  required
                  variant='outlined'
                  style={{ width: '200px' }}
                />
              </Grid>
            </Grid>
            : <Grid container spacing={3}>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  // className='form-control'
                  label='Description'
                  type='multiline'
                  margin='dense'
                  name='generalDescription'
                  fullWidth
                  onChange={this.generalDescriptionHandler}
                  required
                  value={this.state.receiptDetails.generalDescription}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          }
        </div>
      </div>
    )
  }

  paymentMode = () => {
    let paymentModeGrid = null
    paymentModeGrid = (
      <div style={{ margin: '20px' }}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Radio
              checked={this.state.selectedPayment === 'a'}
              onChange={this.handlePayment}
              value='a'
              name='radio-button-demo'
              aria-label='Cash'
            /> Cash
          </Grid>
          <Grid item xs={3}>
            <Radio
              checked={this.state.selectedPayment === 'b'}
              onChange={this.handlePayment}
              value='b'
              name='radio-button-demo'
              aria-label='Cash'
            /> Cheque
          </Grid>
          <Grid item xs={3}>
            <Radio
              checked={this.state.selectedPayment === 'c'}
              onChange={this.handlePayment}
              value='c'
              name='radio-button-demo'
              aria-label='Cash'
            /> Internet Payment
          </Grid>
          <Grid item xs={3}>
            <Radio
              checked={this.state.selectedPayment === 'd'}
              onChange={this.handlePayment}
              value='d'
              name='radio-button-demo'
              aria-label='Cash'
            /> Credit / Debit Card
          </Grid>
        </Grid>
        {this.state.isChequePaper
          ? <Grid container spacing={3}>
            <Grid item xs={3}>
              <label>Cheque No.</label>
              <input
                name='chequeNo'
                type='number'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                onChange={this.chequeDataHandler} />
            </Grid>
            <Grid item xs={3}>
              <label>Cheque Date.</label>
              <input
                name='chequeDate'
                type='date'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                onChange={this.chequeDataHandler} />
            </Grid>
            <Grid item xs={3} style={{ flexGrow: 2, marginRight: '15px', marginBottom: 10, width: '200px' }}>
              <label>SearchBy*</label>
              <Select
                onChange={this.selectCode}
                value={this.state.searchByData ? this.state.searchByData : null}
                name='searchBy'
                options={[
                  {
                    value: 1,
                    label: 'IFSC'
                  },
                  {
                    value: 2,
                    label: 'MICR'
                  },
                  {
                    value: 3,
                    label: 'Not Listed'
                  }
                ]}
              />
            </Grid>
            {this.state.searchByValue === 1 || this.state.searchByValue === 3
              ? <Grid item xs={3}>
                <label>IFSC</label>
                <input
                  name='ifsc'
                  type='text'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                  onChange={this.chequeDataHandler} />
              </Grid> : null}
            {this.state.searchByValue === 2 || this.state.searchByValue === 3
              ? <Grid item xs={3}>
                <label>MICR Code</label>
                <input
                  name='micr'
                  type='number'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                  onChange={this.chequeDataHandler} />
              </Grid> : null}
            <Grid item xs={3}>
              <label>Bank Name</label>
              <input
                name='chequeBankName'
                type='text'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                onChange={this.chequeDataHandler} />
            </Grid>
            <Grid item xs={3}>
              <label>Bank Branch</label>
              <input
                name='chequeBankBranch'
                type='text'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                onChange={this.chequeDataHandler} />
            </Grid>
          </Grid>
          : null}
        {this.state.isInternetPaper
          ? <Grid container spacing={3}>
            <Grid item xs={3}>
              <label>Date: </label>
              <input
                name='internetDate'
                type='date'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                onChange={this.internetDataHandler} />
            </Grid>
            <Grid item xs={3}>
              <label>Remarks.</label>
              <input
                name='remarks'
                type='text'
                className='form-control'
                value={this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                style={{ width: '200px' }}
                onChange={this.internetDataHandler} />
            </Grid>
          </Grid>
          : null}
        {this.state.isCreditPaper
          ? <Grid container spacing={3}>
            <Grid item xs={3}>
              <div style={{ width: '200px' }}>
                <label>Credit*</label>
                <Select
                  onChange={this.creditTypeHandler}
                  name='credit'
                  options={[
                    {
                      value: 1,
                      label: 'Credit'
                    },
                    {
                      value: 2,
                      label: 'Debit'
                    }
                  ]}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <label>Credit Date</label>
              <input
                name='creditDate'
                type='date'
                className='form-control'
                value={this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                onChange={this.creditDataHandler}
                style={{ width: '200px' }} />
            </Grid>
            <Grid item xs={3}>
              <label>Card Last 4 Digits*</label>
              <input
                name='digits'
                type='number'
                className='form-control'
                value={this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                onChange={this.creditDataHandler}
                style={{ width: '200px' }} />
            </Grid>
            <Grid item xs={3}>
              <label>Approval Code.</label>
              <input
                name='approval'
                type='number'
                className='form-control'
                value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                onChange={this.creditDataHandler}
                style={{ width: '200px' }} />
            </Grid>
            <Grid item xs={3}>
              <label>Bank Name.</label>
              <input
                name='bankName'
                type='text'
                className='form-control'
                value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}

                onChange={this.creditDataHandler}
                style={{ width: '200px' }} />
            </Grid>
            <Grid item xs={3}>
              <label>Remarks.</label>
              <input
                name='creditRemarks'
                type='text'
                className='form-control'
                value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                onChange={this.creditDataHandler}
                style={{ width: '200px' }} />
            </Grid>
          </Grid>
          : null}
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={this.handleConfirm}
                  checked={this.state.confirm}
                  // value="checkedB"
                  color='primary'
                />
              }
              label='Confirm Payment Details'
            />
          </Grid>
        </Grid>
      </div>
    )
    return paymentModeGrid
  }

  handlePayment = event => {
    if (event.target.value === 'b') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: true,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false
      })
    } else if (event.target.value === 'c') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: true,
        isCreditPaper: false,
        isTrans: true
      })
    } else if (event.target.value === 'd') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: true,
        isTrans: false
      })
    } else if (event.target.value === 'a') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false
      })
    }
  }

  chequeDataHandler = (event) => {
    const newPayment = { ...this.state.payment }
    const newCheque = { ...newPayment.cheque }
    switch (event.target.name) {
      case 'chequeNo': {
        // validation can be done here.
        newCheque['chequeNo'] = event.target.value
        break
      }
      case 'chequeDate': {
        newCheque['chequeDate'] = event.target.value
        break
      }
      case 'chequeName': {
        newCheque['chequeName'] = event.target.value
        break
      }
      case 'ifsc': {
        if (this.state.searchByValue === 1 && event.target.value.length === 11) {
          this.props.fetchIfsc(event.target.value, this.props.alert, this.props.user)
        }
        newCheque['ifsc'] = event.target.value
        break
      }
      case 'micr': {
        newCheque['micr'] = event.target.value
        break
      }
      case 'chequeBankName': {
        newCheque['chequeBankName'] = event.target.value
        break
      }
      case 'chequeBankBranch': {
        newCheque['chequeBankBranch'] = event.target.value
        break
      }
      default: {

      }
    }
    newPayment.cheque = newCheque
    this.setState({
      payment: newPayment
    })
  }

  internetDataHandler = (event) => {
    const newPayment = { ...this.state.payment }
    const newinternet = { ...newPayment.internet }
    switch (event.target.name) {
      case 'internetDate': {
        newinternet['internetDate'] = event.target.value
        break
      }
      case 'remarks': {
        newinternet['remarks'] = event.target.value
        break
      }
      default: {

      }
    }
    newPayment.internet = newinternet
    this.setState({
      payment: newPayment
    })
  }

  creditDataHandler= (event) => {
    const newPayment = { ...this.state.payment }
    const newcredit = { ...newPayment.credit }
    switch (event.target.name) {
      case 'creditDate': {
        newcredit['creditDate'] = event.target.value
        break
      }
      case 'digits': {
        newcredit['digits'] = event.target.value
        break
      }
      case 'approval': {
        newcredit['approval'] = event.target.value
        break
      }
      case 'bankName': {
        newcredit['bankName'] = event.target.value
        break
      }
      case 'creditRemarks': {
        newcredit['creditRemarks'] = event.target.value
        break
      }
      default: {

      }
    }
    newPayment.credit = newcredit
    this.setState({
      payment: newPayment
    })
  }

  creditTypeHandler = (event) => {
    this.state.payment.credit.credit = event.value
  }

  render () {
    const steps = getSteps()
    const { activeStep } = this.state
    console.log('State', this.props.location.state)
    return (
      <Layout>     
         <React.Fragment>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          <div>
            <Typography>{this.getStepContent(activeStep)}</Typography>
            <div>
              <Button
                disabled={activeStep === 0 || activeStep > 1}
                onClick={this.handleBack}
                className={this.props.classes.backButton}
              >
                Back
              </Button>
              <Button variant='contained' color='primary' onClick={this.handleNext}
                disabled={this.state.disableNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {/* {feeListTable} */}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  feeList: state.finance.accountantReducer.feeCollection.feeCollectionList,
  studentId: state.finance.accountantReducer.feeCollection.studentId,
  gradeData: state.finance.accountantReducer.pdc.gradeData,
  ifsc: state.finance.common.ifscDetails,
  ReceiptNo: state.finance.accountantReducer.feeCollection.ReceiptNo,
  status: state.finance.accountantReducer.feeCollection.status,
  trnsId: state.finance.accountantReducer.feeCollection.transactionId
})

const mapDispatchToProps = dispatch => ({
  fetchFeeCollection: (session, user, alert) => dispatch(actionTypes.fetchFeeCollectionList({ session, user, alert })),
  saveOutsiders: (data, user, alert) => dispatch(actionTypes.saveOutsiders({ data, user, alert })),
  fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  paymentAction: (data, user, alert) => dispatch(actionTypes.paymentAction({ data, user, alert })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user }))
  // sendAllPayments: (data, user, alert) => dispatch(actionTypes.sendAllPayments({ data, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(FeeShowList)))
