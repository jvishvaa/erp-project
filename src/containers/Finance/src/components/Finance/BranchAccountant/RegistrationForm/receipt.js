import React, { Component } from 'react'
import { Grid, Radio, TextField, Button, withStyles } from '@material-ui/core/'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import * as actionTypes from '../../store/actions/index'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import appRegReceiptsPdf from '../../Receipts/appRegReceipts'
import { urls } from '../../../../urls'

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

class Receipt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedQualified: null,
      selectedPayment: 'a',
      amountValue: '1300',
      receiptNoValue: null,
      receiptOnlineValue: null,
      dOPValue: null,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isTrans: false,
      selectedReceipt: '1',
      isOnlineReceipt: false,
      isQualified: false,
      searchByValue: null,
      searchByData: null,
      payment: {
        cheque: {
          chequeNo: null,
          chequeDate: null,
          ifsc: null,
          micr: null,
          chequeName: null,
          chequeBankName: null,
          chequeBankBranch: null
        },
        internet: {
          internetDate: null,
          remarks: null
        },
        credit: {
          credits: 1,
          digits: null,
          creditDate: null,
          approval: null,
          bankName: null,
          creditRemarks: null
        },
        isQualified: true,
        isOnline: true,
        isOffline: false,
        transid: null,
        receiptNo: null,
        receiptOnline: null,
        isOnlinePayment: false,
        dateOfPayment: new Date().toISOString().substr(0, 10)
      }
    }
  }

  // componentDidUpdate (prevProps) {
  //   const {
  //     erpNo,
  //     session,
  //     alert,
  //     user
  //     // refresh
  //   } = this.props

  //   if (!(this.props.registrationDetails && this.props.registrationDetails.academic_year) || !(this.props.registrationDetails && this.props.registrationDetails.id)) {
  //     return
  //   }
  //   if (this.props.registrationDetails.academic_year === prevProps.registrationDetails.academic_year && this.props.registrationDetails.id === prevProps.session) {
  //     return
  //   }
  //   if (this.props.registrationDetails && (erpNo !== prevProps.erpNo || session !== prevProps.session || this.props.getData)) {
  //     this.props.fetchAccountantTransaction(erpNo, session, user, alert)
  //   }
  // }

  onAmountChange = (e) => {
    this.setState({
      amountValue: e.target.value
    })
  }

  handlePayment = event => {
    if (event.target.value === 'b') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: true,
        isInternetPaper: false,
        isOnlinePayment: false,
        isCreditPaper: false,
        isTrans: false
      })
    } else if (event.target.value === 'c') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: true,
        isOnlinePayment: false,
        isCreditPaper: false,
        isTrans: true
      })
    } else if (event.target.value === 'd') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isOnlinePayment: false,
        isCreditPaper: true,
        isTrans: false
      })
    } else if (event.target.value === 'a') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isOnlinePayment: false,
        isTrans: false
      })
    } else if (event.target.value === 'e') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isOnlinePayment: true,
        isTrans: false
      })
    }
  }

  chequeDataHandler = (event) => {
    const newPayment = { ...this.state.payment }
    const newCheque = { ...newPayment.cheque }
    switch (event.target.name) {
      case 'chequeNo': {
        // validation can be done here.chequeDataHandler
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
        if (this.state.searchByValue === 2 && event.target.value.length === 9) {
          this.props.fetchMicr(event.target.value, this.props.alert, this.props.user)
        }
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
    this.state.payment.credit.credits = event.value
  }

  handleReceipt = event => {
    this.setState({ selectedReceipt: event.target.value })
    if (event.target.value === '2') {
      // this.setState({payment.isOffline : true})
      this.setState({ isOnlineReceipt: true })
      this.state.payment.isOffline = true
      this.state.payment.isOnline = false
    } else {
      this.setState({ isOnlineReceipt: false })
      this.state.payment.isOffline = false
      this.state.payment.isOnline = true
    }
  }

  handleQualified = (e) => {
    this.setState({ selectedQualified: e.target.value })
    if (e.target.value === 'y') {
      // this.setState({ isQualified: true })
      this.state.payment.isQualified = true
    } else {
      // this.setState({ isQualified: e.target.value })
      this.state.payment.isQualified = false
    }
  }

  onReceiptOnlineChange = (e) => {
    this.setState(Object.assign(this.state.payment, { receiptOnline: e.target.value }))
  }

  onReceiptNoChange = (e) => {
    this.setState(Object.assign(this.state.payment, { receiptNo: e.target.value }))
  }

  onDOPChange = (e) => {
    this.setState(Object.assign(this.state.payment, { dateOfPayment: e.target.value }))
  }

  handleReceiptData = (event) => {
    switch (event.target.name) {
      case 'receiptNo': {
        this.setState(Object.assign(this.state.payment, { receiptNo: event.target.value }))
        break
      }
      case 'receiptOnline': {
        this.setState(Object.assign(this.state.payment, { receiptOnline: event.target.value }))
        break
      }
      case 'transid': {
        this.setState(Object.assign(this.state.payment, { transid: event.target.value }))
        break
      }
      case 'dateOfPayment': {
        this.setState(Object.assign(this.state.payment, { dateOfPayment: event.target.value }))
        break
      }
      default: {

      }
    }
  }

  searchBy = (e) => {
    this.setState({
      searchByValue: e.value, searchByData: e
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.micr && nextProps.micr.data && this.state.searchByValue === 2) {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      newCheque['ifsc'] = nextProps.micr.data[0].IFSC ? nextProps.micr.data[0].IFSC : null
      newCheque['chequeBankName'] = nextProps.micr.data[0].Bank ? nextProps.micr.data[0].Bank : null
      newCheque['chequeBankBranch'] = nextProps.micr.data[0].Branch ? nextProps.micr.data[0].Branch : null
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
      })
    } else if (nextProps.ifsc && this.state.searchByValue === 1) {
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
    // console.log('nextprops', )
    // You don't have to do this check first, but it can help prevent an unneeded render
    // if (nextProps.startTime !== this.state.startTime) {
    //   this.setState({ startTime: nextProps.startTime })
    // }
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

  onSaveClick = () => {
    const { isChequePaper, payment, selectedReceipt, isInternetPaper, isCreditPaper, todayDate } = this.state
    const { registrationDetails, acadYear, regNum, branchId, moduleId } = this.props

    if (Date.parse(registrationDetails.application_date) > Date.parse(payment.dateOfPayment)) {
      this.props.alert.warning('Date Cant be greater than application date!')
      return false
    }

    if (this.state.isOnlineReceipt && !this.state.payment.receiptOnline) {
      this.props.alert.warning('Enter Receipt no!')
      return false
    }

    if (!this.state.selectedPayment) {
      this.props.alert.warning('Please Select any Payment Mode!')
    }

    let dataToSend = null
    if (isChequePaper) {
      console.log('qwerty', this.dataIsSuitableToSend(payment.cheque))
      // if (!this.dataIsSuitableToSend(payment.cheque)) {
      //   this.props.alert.warning('Please Fill all the')
      //   // this.setState({ confirm: false })
      //   return
      // }
      if (!payment.cheque.chequeNo || !payment.cheque.chequeDate || (this.state.searchByData === 1 ? !payment.cheque.ifsc : !payment.cheque.micr) || !payment.cheque.chequeBankName || !payment.cheque.chequeBankBranch) {
        this.props.alert.warning('Please Fill all the fields')
        // this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 2,
        // payment: {...payment.cheque},
        payment: { ...payment },
        current_date: todayDate
      }
    } else if (isInternetPaper) {
      if (!this.dataIsSuitableToSend(payment.internet)) {
        this.props.alert.warning('Please Fill all the fields')
        // this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 3,
        // payment: {...payment.internet},
        payment: { ...payment },
        current_date: todayDate
      }
    } else if (isCreditPaper) {
      if (!this.dataIsSuitableToSend(payment.credit)) {
        this.props.alert.warning('Please Fill all the fields')
        // this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 4,
        // payment: {...payment.credit},
        payment: { ...payment },
        current_date: todayDate
      }
    } else if (this.state.isOnlinePayment) {
      // if (!this.dataIsSuitableToSend(payment.credit)) {
      //   this.props.alert.warning('Please Fill all the fields')
      //   // this.setState({ confirm: false })
      //   return
      // }
      dataToSend = {
        mode: 5,
        // payment: {...payment.credit},
        payment: { ...payment },
        current_date: todayDate
      }
    } else {
      dataToSend = {
        mode: 1,
        payment: { ...payment },
        current_date: todayDate
      }
    }
    console.log(dataToSend)
    if (isChequePaper === true) {
      let chequeData = {
        branch_id: branchId,
        module_id: moduleId,
        student: registrationDetails.id,
        academic_year: acadYear,
        is_qualified: payment.isQualified,
        payment_in: 2,
        paid_date: payment.dateOfPayment,
        amount: regNum && regNum.registration_fee && regNum.registration_fee.amount,
        receipt_type: +selectedReceipt,
        receipt_number: payment.receiptOnline,
        cheque_number: payment.cheque.chequeNo,
        date_of_cheque: payment.cheque.chequeDate,
        micr_code: payment.cheque.micr,
        ifsc_code: payment.cheque.ifsc,
        bank_name: payment.cheque.chequeBankName,
        bank_branch: payment.cheque.chequeBankBranch,
        registrationPaymentAmount: regNum && regNum.registration_fee && regNum.registration_fee.id
      }
      this.sendingToServer(chequeData)
    } else if (isInternetPaper === true) {
      let internetData = {
        student: registrationDetails.id,
        branch_id: branchId,
        module_id: moduleId,
        academic_year: acadYear,
        is_qualified: payment.isQualified,
        payment_in: 3,
        paid_date: payment.dateOfPayment,
        amount: regNum && regNum.registration_fee && regNum.registration_fee.amount,
        receipt_type: +selectedReceipt,
        receipt_number: payment.receiptOnline,
        bank_date: payment.internet.internetDate,
        remarks: payment.internet.remarks,
        registrationPaymentAmount: regNum && regNum.registration_fee && regNum.registration_fee.id
      }
      this.sendingToServer(internetData)
    } else if (isCreditPaper === true) {
      let creditData = {
        student: registrationDetails.id,
        branch_id: branchId,
        module_id: moduleId,
        academic_year: acadYear,
        payment_in: 4,
        is_qualified: payment.isQualified,
        paid_date: payment.dateOfPayment,
        amount: regNum && regNum.registration_fee && regNum.registration_fee.amount,
        receipt_type: +selectedReceipt,
        receipt_number: payment.receiptOnline,
        bank_date: payment.credit.creditDate,
        card_type: payment.credit.credits,
        card_last_digits: payment.credit.digits,
        approval_code: payment.credit.approval,
        bank_name: payment.credit.bankName,
        remarks: payment.credit.creditRemarks,
        registrationPaymentAmount: regNum && regNum.registration_fee && regNum.registration_fee.id
      }
      this.sendingToServer(creditData)
    } else if (this.state.isOnlinePayment === true) {
      let onlineData = {
        student: registrationDetails.id,
        branch_id: branchId,
        module_id: moduleId,
        academic_year: acadYear,
        is_qualified: payment.isQualified,
        payment_in: 5,
        paid_date: payment.dateOfPayment,
        amount: regNum && regNum.registration_fee && regNum.registration_fee.amount,
        receipt_type: +selectedReceipt,
        receipt_number: payment.receiptOnline,
        registrationPaymentAmount: regNum && regNum.registration_fee && regNum.registration_fee.id
      }
      this.sendingToServer(onlineData)
    } else if (this.state.selectedPayment === 'a') {
      let cashData = {
        student: registrationDetails.id,
        branch_id: branchId,
        module_id: moduleId,
        academic_year: acadYear,
        is_qualified: payment.isQualified,
        payment_in: 1,
        paid_date: payment.dateOfPayment,
        amount: regNum && regNum.registration_fee && regNum.registration_fee.amount,
        receipt_type: +selectedReceipt,
        receipt_number: payment.receiptOnline,
        registrationPaymentAmount: regNum && regNum.registration_fee && regNum.registration_fee.id
      }
      this.sendingToServer(cashData)
    }
    this.setState({
      selectedPayment: '',
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false
    })
  }

  sendingToServer = (data) => {
    const { registrationDetails } = this.props
    // const regNum = {
    //   acad_session_id: registrationDetails.academic_year,
    //   student: registrationDetails.id
    // }
    this.props.sendAllPaymentReg(data, this.props.user, this.props.alert)
    // this.props.createRegNum(regNum, this.props.user, this.props.alert)
  }

  componentDidUpdate () {
    // console.log('update: ', this.state.payment)
  }

  // Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.AppRegPdf}?transaction_id=${transactionId}&academic_year=${this.props.acadYear}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async (transid) => {
    try {
      const response = await this.getPdfData(transid)
      console.log('App reg Response: ', response)
      appRegReceiptsPdf(response.data)
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Unable to generate PDF!')
    }
  }

  render () {
    return (
      <Grid container spacing={3} style={{ padding: '20px' }}>
        <Grid Grid xs={12} >
          <strong>Is Qualified For Registration</strong>
        </Grid>
        <Grid item xs={2} >
          <Radio
            checked={this.state.selectedQualified === 'y'}
            onChange={this.handleQualified}
            value='y'
            name='qualified'
            aria-label='Cash'
          />Yes
        </Grid>
        <Grid item xs={10} >
          <Radio
            checked={this.state.selectedQualified === 'n'}
            onChange={this.handleQualified}
            value='n'
            name='qualified'
            aria-label='Cash'
          />No
        </Grid>
        {/* <Grid item xs={6}>
          <ReactTable
            data={data}
            columns={columns}
            pageSize={data.length}
            showPagination={false}
          />
        </Grid> */}
        <Grid item xs={1}>
          <label style={{ marginTop: '14px' }}>Receipt Type</label>
        </Grid>
        <Grid item xs={2} >
          <Radio
            checked={this.state.selectedReceipt === '1'}
            onChange={this.handleReceipt}
            value='1'
            name='online'
            aria-label='Cash'
          />Online
        </Grid>
        <Grid item xs={9} >
          <Radio
            checked={this.state.selectedReceipt === '2'}
            onChange={this.handleReceipt}
            value='2'
            name='manual'
            aria-label='Cash'
          />Manual
        </Grid>
        {this.state.isOnlineReceipt === true
          ? (<Grid container spacing={3} style={{ flexGrow: 1, padding: '10px' }}>
            <Grid item xs={1}>
              <label style={{ marginTop: '5px' }}>Receipt No Online</label>
            </Grid>
            <Grid xs={2} >
              <TextField
                style={{ width: '100%' }}
                id='outlined-search'
                // label={searchByValue}
                onChange={this.onReceiptOnlineChange}
                type='number'
                // className={useStyles.textField}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={9} />
          </Grid>
          )
          : null
        }
        <Grid item xs={1}>
          <label style={{ marginTop: '5px' }}>Date of Payment</label>
        </Grid>
        <Grid xs={2} >
          <TextField
            style={{ width: '100%' }}
            id='outlined-search'
            inputProps={{ min: this.props.registrationDetails.application_date }}
            // label={searchByValue}
            value={this.state.payment.dateOfPayment}
            onChange={this.onDOPChange}
            type='date'
            // className={useStyles.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={9} />
        <Grid xs={1}>
          <label style={{ marginTop: '15px' }}>Payment Mode:</label>
        </Grid>
        <Grid xs={2}>
          <Radio
            checked={this.state.selectedPayment === 'a'}
            onChange={this.handlePayment}
            value='a'
            name='radio-button-demo'
            aria-label='Cash'
          /> Cash
        </Grid>
        <Grid xs={2}>
          <Radio
            checked={this.state.selectedPayment === 'b'}
            onChange={this.handlePayment}
            value='b'
            name='radio-button-demo'
            aria-label='Cash'
          /> Cheque
        </Grid>
        <Grid xs={2}>
          <Radio
            checked={this.state.selectedPayment === 'c'}
            onChange={this.handlePayment}
            value='c'
            name='radio-button-demo'
            aria-label='Cash'
          /> Internet Payment
        </Grid>
        <Grid xs={3}>
          <Radio
            checked={this.state.selectedPayment === 'd'}
            onChange={this.handlePayment}
            value='d'
            name='radio-button-demo'
            aria-label='Cash'
          /> Credit / Debit Card
        </Grid>
        <Grid xs={2}>
          <Radio
            checked={this.state.selectedPayment === 'e'}
            onChange={this.handlePayment}
            value='e'
            name='radio-button-demo'
            aria-label='Online'
          /> Online
        </Grid>
        <Grid item xs={5} />
        {this.state.isChequePaper === true
          ? <Grid container spacing={24} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
              <Grid xs={4} style={{ flexGrow: 2, marginBottom: 10 }}>
                <label>Cheque No.</label>
                <input
                  name='chequeNo'
                  type='number'
                  className='form-control'
                  style={{ width: '250px' }}
                  value={this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                  onChange={this.chequeDataHandler}
                />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Cheque Date.</label>
                <input
                  name='chequeDate'
                  type='date'
                  className='form-control'
                  style={{ width: '250px' }}
                  value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                  onChange={this.chequeDataHandler}
                />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>SearchBy*</label>
                <Select
                  onChange={this.searchBy}
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
                ? <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>IFSC</label>
                  <input
                    name='ifsc'
                    type='text'
                    className='form-control'
                    style={{ width: '250px' }}
                    value={this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                    onChange={this.chequeDataHandler} />
                </Grid>
                : null}
              {this.state.searchByValue === 2 || this.state.searchByValue === 3
                ? <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>MICR Code</label>
                  <input
                    name='micr'
                    type='number'
                    className='form-control'
                    style={{ width: '250px' }}
                    value={this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                    onChange={this.chequeDataHandler} />
                </Grid>
                : null}
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Bank Name</label>
                <input
                  name='chequeBankName'
                  type='text'
                  className='form-control'
                  style={{ width: '250px' }}
                  value={this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                  onChange={this.chequeDataHandler}
                />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Bank Branch</label>
                <input
                  name='chequeBankBranch'
                  type='text'
                  className='form-control'
                  style={{ width: '250px' }}
                  value={this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                  onChange={this.chequeDataHandler}
                />
              </Grid>
            </div>
          </Grid>

          : null
        }
        {this.state.isInternetPaper === true
          ? <Grid container spacing={3} style={{ padding: '20px' }}>
            <Grid xs={4}>
              <label>Date: </label>
              <input
                name='internetDate'
                type='date'
                className='form-control'
                style={{ width: '250px' }}
                value={this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                onChange={this.internetDataHandler}
              />
            </Grid>
            <Grid xs={4}>
              <label>Remarks.</label>
              <input
                name='remarks'
                type='text'
                className='form-control'
                value={this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                style={{ width: '250px' }}
                onChange={this.internetDataHandler}
              />
            </Grid>
          </Grid>
          : null}
        {this.state.isCreditPaper === true
          ? <Grid container spacing={3} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
              <Grid xs={4} style={{ flexGrow: 2, marginRight: '15px', marginBottom: 10 }}>
                <label>Credit*</label>
                <Select
                  onChange={(e) => { this.creditTypeHandler(e) }}
                  name='credit'
                  // value={this.state.payment.credit.credits === 1 ? [{ value: 1, label: 'Credit' }] : [{ value: 2, label: 'Debit' }]}
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
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Credit Date</label>
                <input
                  name='creditDate'
                  type='date'
                  className='form-control'
                  value={this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '250px' }} />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Card Last 4 Digits*</label>
                <input
                  name='digits'
                  type='number'
                  className='form-control'
                  value={this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '250px' }} />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Approval Code.</label>
                <input
                  name='approval'
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '250px' }} />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Bank Name.</label>
                <input
                  name='bankName'
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '250px' }} />
              </Grid>
              <Grid xs={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                <label>Remarks.</label>
                <input
                  name='creditRemarks'
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '250px' }} />
              </Grid>
            </div>
          </Grid>
          : null}
        <Grid container spacing={3} style={{ padding: '20px' }}>
          {!this.props.registrationDetails.registration_is_paid
            ? <Grid item xs={2} >
              <Button variant='contained' disabled={this.props.finalRecords || !this.state.selectedPayment} color='primary' onClick={this.onSaveClick}>
                Save
              </Button>
            </Grid>
            : <React.Fragment>
              <h2>Payment is already done. Reg num: {this.props.registrationDetails.registration_number}</h2>
            </React.Fragment>}
          <Grid item xs={10}>
            {this.props.finalRecords
              ? <center>
                <h2>Thank You For Recording Payment Details</h2> <br />
                {this.props.finalRecords ? <b style={{ fontSize: '20px', marginBottom: '10px' }}>Reg No is {this.props.finalRecords.registration_number}</b> : null}<br />
                {this.props.finalRecords ? <b style={{ fontSize: '20px', marginBottom: '10px' }}>Receipt No is {this.props.finalRecords.receipt_number_online}</b> : null}<br />
                {this.props.finalRecords ? <b style={{ fontSize: '20px' }}>Transaction ID is {this.props.finalRecords.transaction_number}</b> : null}<br />
                {/* <br /> */}
                <Button variant='contained' color='primary' onClick={() => { this.generatePdf(this.props.finalRecords.transaction_number) }}>Download PDF</Button>
              </center>
              : null}
          </Grid>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  registrationDetails: state.finance.accountantReducer.regForm.registrationDetails,
  regNum: state.finance.accountantReducer.regForm.regNum,
  finalRecords: state.finance.accountantReducer.regForm.finalRecords,
  ifsc: state.finance.common.ifscDetails,
  micr: state.finance.common.micrDetails,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  sendAllPaymentReg: (data, user, alert) => dispatch(actionTypes.sendAllPaymentReg({ data, user, alert })),
  createRegNum: (data, user, alert) => dispatch(actionTypes.createRegNum({ data, user, alert })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Receipt)))
