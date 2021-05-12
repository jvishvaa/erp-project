import React, { Component } from 'react'
// import { Grid } from 'semantic-ui-react'
import { Radio, withStyles, Typography, CircularProgress, Grid } from '@material-ui/core/'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import * as actionTypes from '../../store/actions/index'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
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
      selectedPayment: 'a',
      selectedReceipt: 'online',
      todayDate: '',
      isOnlineReceipt: false,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isTrans: false,
      confirm: false,
      searchByValue: null,
      searchByData: null,
      currentData: [],
      moneyDetails: {},
      otherFeeDet: {},
      otherFeeAmt: 0,
      makeAmt: 0,
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
        isOnline: true,
        isOffline: false,
        transid: null,
        receiptNo: null,
        receiptOnline: null,
        isOnlinePayment: false,
        dateOfPayment: new Date().toISOString().substr(0, 10)
      }
    }
    this.handlePayment = this.handlePayment.bind(this)
    this.handleReceipt = this.handleReceipt.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.internetDataHandler = this.internetDataHandler.bind(this)
    this.creditDataHandler = this.creditDataHandler.bind(this)
    this.handleReceiptData = this.handleReceiptData.bind(this)
    this.creditTypeHandler = this.creditTypeHandler.bind(this)
  }

  componentDidMount () {
    // console.log('--------id--', this.props.otherFeeId)
    // this.setState({
    //   currentData: currentData
    // })
    // console.log('money-----------', this.props.money)
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 // January is 0!
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = dd + '-' + mm + '-' + yyyy
    let back = yyyy + '/' + mm + '/' + dd
    this.setState({
      todayDate: today,
      backDate: back
      // moneyDetails: this.props.money,
      // otherFeeDet: this.props.otherFeeDetails,
      // otherFeeAmt: this.props.otherPayAmt || 0,
      // makeAmt: this.props.makePayAmt || 0,
      // otherFees: this.props.otherFeeId || []
    }, () => {
      this.props.fetchReceiptRange(this.props.session, this.props.alert, this.props.user, this.props.branch)
      // let currentData = this.props.otherFeesList.filter(val => this.state.otherFees.includes(val.id.toString()))
      // this.setState({
      //   currentData: currentData
      // })
    })
    // this.setState(Object.assign(this.state.payment, { dateOfPayment: today }))
  }

  handlePayment = event => {
    if (event.target.value === 'b') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: true,
        isInternetPaper: false,
        isCreditPaper: false,
        isOnlinePayment: false,
        isTrans: false,
        confirm: false
      })
    } else if (event.target.value === 'c') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: true,
        isOnlinePayment: false,
        isCreditPaper: false,
        isTrans: true,
        confirm: false
      })
    } else if (event.target.value === 'd') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: true,
        isOnlinePayment: false,
        isTrans: false,
        confirm: false
      })
    } else if (event.target.value === 'a') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isOnlinePayment: false,
        isTrans: false,
        confirm: false
      })
    } else if (event.target.value === 'e') {
      this.setState({
        selectedPayment: event.target.value,
        isOnlinePayment: true,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false,
        confirm: false
      })
    }
  }

  handleReceipt = event => {
    this.setState({ selectedReceipt: event.target.value })
    if (event.target.value === 'manual') {
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
      // case 'chequeName': {
      //   newCheque['chequeName'] = event.target.value
      //   break
      // }
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

  searchBy = (e) => {
    this.setState({
      searchByValue: e.value, searchByData: e
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
    // if (this.props.makePayAmt === 0 || this.props.otherPayAmt === 0) {
    //   this.props.alert.warning('Cannot Proceed With Zero Amount')
    //   return
    // }

    if (this.state.isOnlineReceipt && !this.state.payment.receiptNo) {
      this.props.alert.warning('Enter Receipt no!')
      return false
    }
    let dataToSend = null
    if (this.state.isChequePaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.cheque)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 2,
        // payment: {...this.state.payment.cheque},
        payment: { ...this.state.payment },
        current_date: this.state.todayDate
      }
    } else if (this.state.isInternetPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.internet)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 3,
        // payment: {...this.state.payment.internet},
        payment: { ...this.state.payment },
        current_date: this.state.todayDate
      }
    } else if (this.state.isCreditPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.credit)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 4,
        // payment: {...this.state.payment.credit},
        payment: { ...this.state.payment },
        current_date: this.state.todayDate
      }
    } else if (this.state.isOnlinePayment) {
      if (!this.dataIsSuitableToSend(this.state.isOnlinePayment)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false })
        return
      }
      dataToSend = {
        mode: 5,
        // payment: {...this.state.payment.internet},
        payment: { ...this.state.payment },
        current_date: this.state.todayDate
      }
    } else {
      dataToSend = {
        mode: 1,
        payment: { ...this.state.payment },
        current_date: this.state.todayDate
      }
    }

    if (this.state.dateOfPayment === null) {
      this.props.alert.warning('Please fill all the fields!')
      return false
    }

    // if (!this.state.payment.receiptNo && this.state.isOnlineReceipt) {
    //   this.props.alert.warning('Please fill all the fields!')
    //   return false
    // }

    if (event.target.checked && this.props.feeTable.total > 0) {
      const total = this.props.feeTable.total
      this.setState({ confirm: true }, () => {
        this.props.getReceiptDetail(this.state.confirm, dataToSend, total)
      })
    } else if (this.props.feeTable.total <= 0) {
      this.props.alert.warning('Cannot Proceed With Zero Amount')
      this.setState({ confirm: false }, () => {
        this.props.getReceiptDetail(this.state.confirm)
      })
    } else {
      this.setState({ confirm: false }, () => {
        this.props.getReceiptDetail(this.state.confirm)
      })
    }
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
      appRegReceiptsPdf(response.data)
    } catch (e) {
      this.props.alert.warning('Unable to generate PDF!')
    }
  }

  render () {
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
    let paymentTable = null
    // const { classes } = this.props
    if (this.state.moneyDetails) {
      paymentTable = (
        // <div className={classes.tableWrapper}>
        //   <Table>
        //     <TableHead>
        //       <TableRow>
        //         {/* <TableCell /> */}
        //         <TableCell>Fee Type</TableCell>
        //         <TableCell>Installment</TableCell>
        //         <TableCell>Amount</TableCell>
        //         <TableCell>Balance after Amount Paid</TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       <React.Fragment>
        //         {this.props.feeTable
        //           ? this.props.feeTable.map((row, i) => {
        //             return (
        //               row.map((r, i) => {
        //                 return (
        //                   <TableRow>
        //                     {/* <TableCell /> */}
        //                     <TableCell>{r.fee_type.fee_type_name}</TableCell>
        //                     <TableCell>{r.installments.installment_name}</TableCell>
        //                     <TableCell>{row.payment}</TableCell>
        //                     <TableCell>{row.balance}</TableCell>
        //                   </TableRow>
        //                 )
        //               })
        //             )
        //           })
        //           : null
        //         }
        //       </React.Fragment>
        //     </TableBody>
        //   </Table>
        //   <div className={classes.tableTotal}>
        //     Total Selected Amount: {this.state.makeAmt}
        //   </div>
        // </div>
        <div>
          Total Amount to be paid: {this.props.feeTable && this.props.feeTable.total ? this.props.feeTable.total : 'Installments Not Selected'}
        </div>
      )
    }
    return (
      <Grid container spacing={3} style={{ padding: '15px' }}>
          <Grid item xs='12'>
            <Typography variant='h5'>Normal Fees</Typography>
            {paymentTable}
          </Grid>
          <Grid item xs='2'>
            <strong>Payment Mode:</strong>
          </Grid>
          <Grid item xs={2}>
            <Radio
              checked={this.state.selectedPayment === 'a'}
              onChange={this.handlePayment}
              value='a'
              name='radio-button-demo'
              aria-label='Cash'
            /> Cash
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={12}>
            <Radio
              checked={this.state.selectedPayment === 'e'}
              onChange={this.handlePayment}
              value='e'
              name='radio-button-demo'
              aria-label='Online'
            /> Online
          </Grid>
        {this.state.isChequePaper === true
          ? <Grid container spacing={3} style={{ padding: '15px' }}>
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
              <Grid item xs={3} >
                <label>Cheque Date.</label>
                <input
                  name='chequeDate'
                  type='date'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                  onChange={this.chequeDataHandler} />
              </Grid>
              <Grid item xs={3}>
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
                ? <Grid item xs={3} >
                  <label>IFSC</label>
                  <input
                    name='ifsc'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                    onChange={this.chequeDataHandler} />
                </Grid>
                : null}
              {this.state.searchByValue === 2 || this.state.searchByValue === 3
                ? <Grid item xs={3} >
                  <label>MICR Code</label>
                  <input
                    name='micr'
                    type='number'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                    onChange={this.chequeDataHandler} />
                </Grid>
                : null}
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
              {this.props.micr.is_multiple ? <div style={{ color: '#CC0000' }}>*This micr has multiple bank details, please verify once</div> : null}
          </Grid>
          : null
        }
        {this.state.isInternetPaper === true
          ? <Grid container spacing={3} style={{ padding: '15px'}}>
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
        {this.state.isCreditPaper === true
          ? <Grid container spacing={3} style={{ padding: '15px'}}>
              <Grid item xs={2}>
                <label>Card Type*</label>
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
              <Grid item xs={3} >
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
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '200px' }} />
              </Grid>
              <Grid item xs={2} >
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
        <Grid container spacing={3} style={{ padding: '20px'}}>
          <Grid style={{ paddingLeft: '5px'}} xs={2}>
            <strong>Receipt Type:</strong>
          </Grid>
          <Grid item xs={2}>
            <Radio
              checked={this.state.selectedReceipt === 'online'}
              onChange={this.handleReceipt}
              value='online'
              name='online'
              aria-label='Cash'
            /> Online
          </Grid>
          <Grid item xs computer={2}>
            <Radio
              checked={this.state.selectedReceipt === 'manual'}
              onChange={this.handleReceipt}
              value='manual'
              name='manual'
              aria-label='Cash'
            /> Manual
          </Grid>
        </Grid>
        {/* {this.state.isTrans === true
          ? <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Transaction ID*:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              <input
                name='transid'
                type='text'
                className='form-control'
                value={this.state.payment.transid ? this.state.payment.transid : ''}
                onChange={this.handleReceiptData}
                style={{ width: '200px' }} />
            </Grid.Column>
          </Grid.Row>
          : null
        } */}
        {this.state.isOnlineReceipt ? 
        <Grid container spacing={3} style={{ padding: '15px'}}>
          <Grid item xs={2}>
            <strong>Receipt Number:</strong>
          </Grid>
          <Grid item xs={4}>
            <input
              name='receiptNo'
              type='number'
              className='form-control'
              value={this.state.payment.receiptNo ? this.state.payment.receiptNo : ''}
              onChange={this.handleReceiptData}
              style={{ width: '200px' }} />
            {receiptData}
          </Grid>
        </Grid> : null}
        {/* displayed only if opted manual */}
        {/* {this.state.isOnlineReceipt === true
          ? <Grid.Row>
            <Grid.Column xs={2}>
              <strong>Receipt Number online:</strong>
            </Grid.Column>
            <Grid.Column xs={4}>
              <input
                name='receiptOnline'
                type='number'
                className='form-control'
                value={this.state.payment.receiptOnline ? this.state.payment.receiptOnline : ''}
                onChange={this.handleReceiptData}
                style={{ width: '200px' }} />
            </Grid.Column>
          </Grid.Row>
          : null
        } */}
        <Grid container  spacing={3} style={{ padding: '15px', display:'flex'}}>
          <Grid item xs={2}>
            <strong>Date of Payment:</strong>
          </Grid>
          <Grid item xs={4}>
            <input
              name='dateOfPayment'
              type='date'
              className='form-control'
              min={this.state.backDate}
              style={{ width: '200px' }}
              value={this.state.payment.dateOfPayment}
              onChange={this.handleReceiptData} />
            {/* <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p> */}
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15, display: 'flex' }}>
          <Grid item xs={2}>
            <strong>Current Date:</strong>
          </Grid>
          <Grid item xs={4}>
            {/* <input type="text" value= readonly /> */}
            <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: '20px'}}>
          <Grid item xs='4'>
            <input type='checkbox'
              name='confirm'
              onChange={this.handleConfirm}
              checked={this.state.confirm} />
                      Confirm Payment Details
          </Grid>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  receiptRange: state.finance.makePayAcc.receiptRange,
  ifsc: state.finance.common.ifscDetails,
  micr: state.finance.common.micrDetails
})

const mapDispatchToProps = dispatch => ({
  fetchReceiptRange: (session, alert, user, branchId) => dispatch(actionTypes.fetchReceiptRange({ session, alert, user, branchId })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Receipt)))
