import React, { Component } from 'react'
import Select from 'react-select'
import { Grid, withStyles, Radio, Table, TableBody, TableCell, TableHead, TableRow, Typography,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Switch, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions/index'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import '../../css/staff.css'
// import { TransferWithinAStationSharp } from '@material-ui/icons'
// import { classgrouptypes } from '../../../_reducers/classGroupType.reducer';
// import { apiActions } from '../../../_actions'
// import MakePayment from './makePayment'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 10,
    marginTop: 10,
    'border': '1px solid black',
    borderRadius: 4
  },
  tableTotal: {
    fontSize: '16px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10px'
  }
})

class ReceiptDetails extends Component {
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
      isAxisPos: false,
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
        dateOfPayment: new Date().toISOString().substr(0, 10),
        isWalletAgree: false
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

  componentWillUnmount () {
    this.setState({
      otherFeeDet: {}
    })
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
      backDate: back,
      moneyDetails: this.props.money,
      otherFeeDet: this.props.otherFeeDetails,
      otherFeeAmt: this.props.otherPayAmt || 0,
      makeAmt: this.props.makePayAmt || 0,
      otherFees: this.props.otherFeeId || []
    }, () => {
      let currentData = this.props.otherFeesList.filter(val => this.state.otherFees.includes(val.id.toString()))
      this.setState({
        currentData: currentData
      })
    })
    // this.setState(Object.assign(this.state.payment, { dateOfPayment: today }))
    this.props.fetchReceiptRange(this.props.session, this.props.erp, this.props.alert, this.props.user)
  }

  // componentDidUpdate (prevProps, prevState) {
  //   console.log('--------prevState------------', prevState)
  //   console.log('--------prevprops------------', prevProps)
  // }

    handlePayment = event => {
      if (event.target.value === 'b') {
        this.props.getData(false)
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: true,
          isInternetPaper: false,
          isCreditPaper: false,
          isTrans: false,
          isAxisPos: false,
          confirm: false
        })
      } else if (event.target.value === 'c') {
        this.props.getData(false)
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: true,
          isCreditPaper: false,
          isTrans: true,
          isAxisPos: false,
          confirm: false
        })
      } else if (event.target.value === 'd') {
        this.props.getData(false)
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: true,
          isTrans: false,
          isAxisPos: false,
          confirm: false
        })
      } else if (event.target.value === 'a') {
        this.props.getData(false)
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: false,
          isTrans: false,
          isAxisPos: false,
          confirm: false
        })
      } else if (event.target.value === 'e') {
        this.props.getData(true)
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: false,
          isAxisPos: true,
          isTrans: false,
          confirm: false
        })
        let insta = []
        let otherDetails = []
        // let otherFeeDet = []
        if (this.props.money && this.props.money.installment_rows && this.props.money.installment_rows.length > 0) {
          this.props.money.installment_rows.map(row => {
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

        if (this.props.otherFeeDetails && this.props.otherFeeDetails.installment_rows && this.props.otherFeeDetails.installment_rows.length > 0) {
          this.props.otherFeeDetails.installment_rows.map(row => {
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
        let data = {
          // mode: 7,
          // payment: {...this.state.payment.credit},
          // payment: { ...this.state.payment },
          // current_date: this.state.todayDate
          session_year: this.props.session,
          student: this.props.erp,
          date_of_payment: this.state.payment && this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
          total_amount: this.state.makeAmt + this.state.otherFeeAmt ? this.state.makeAmt + this.state.otherFeeAmt : 0,
          total_fee_amount: this.props.makePayAmt ? this.props.makePayAmt : 0,
          total_other_fee_amount: this.props.otherPayAmt ? this.props.otherPayAmt : 0,
          payment_mode: 7,
          receipt_type: this.state.payment && this.state.payment.isOnline ? 1 : 2,
          receipt_number: this.state.payment && this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
          // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
          current_date: this.props.dateFromServer && this.props.dateFromServer[0] ? this.props.dateFromServer[0] : null,
          fee: insta,
          other_fee: otherDetails
        }
        this.props.sendAxisPosPayment(data, this.props.alert, this.props.user)
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
          console.log('date', event.target.value)
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
          // this.setState(Object.assign(this.state.payment, { receiptNo: event.target.value }))
          this.setState({
            payment: {
              ...this.state.payment, receiptNo: event.target.value
            }
          })
          break
        }
        case 'receiptOnline': {
          this.setState(Object.assign(this.state.payment, { receiptOnline: event.target.value }))
          break
        }
        case 'transid': {
          // this.setState(Object.assign(this.state.payment, { transid: event.target.value }))
          this.setState({
            payment: {
              ...this.state.payment, transid: event.target.value
            }
          })
          break
        }
        case 'dateOfPayment': {
          // this.setState(Object.assign(this.state.payment, { dateOfPayment: event.target.value }))
          this.setState({
            payment: {
              ...this.state.payment, dateOfPayment: event.target.value
            }
          })
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
      console.log('make Pay', this.props.makePayAmt)
      console.log('other fee', this.props.otherPayAmt)
      // if (this.props.makePayAmt === 0 || this.props.otherPayAmt === 0) {
      //   this.props.alert.warning('Cannot Proceed With Zero Amount')
      //   retur
      let dataToSend = null
      const total = this.state.makeAmt + this.state.otherFeeAmt
      if (this.state.isWalletAgree && total > 0 && (total <= this.props.walletInfo[0].reaming_amount)) {
        if (event.target.checked) {
          dataToSend = {
            mode: 6,
            // payment: {...this.state.payment.cheque},
            payment: { ...this.state.payment },
            current_date: this.state.todayDate
          }
          this.setState({ confirm: true }, () => {
            this.props.getDetail(this.state.confirm, this.state.isWalletAgree, dataToSend, this.state.currentData, total)
          })
          return
        } else {
          this.setState({ confirm: false })
          return
        }
      }
      if (this.state.isOnlineReceipt && !this.state.payment.receiptNo) {
        this.props.alert.warning('Enter Receipt no!')
        return false
      }
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
        } else if ((this.state.payment && (this.state.payment.credit.digits).toString().length < 4) || (this.state.payment && (this.state.payment.credit.digits).toString().length > 4)) {
          this.props.alert.warning('Enter Only Last four Digit of Card Number!')
          this.setState({ confirm: false })
          return
        }
        dataToSend = {
          mode: 4,
          // payment: {...this.state.payment.credit},
          payment: { ...this.state.payment },
          current_date: this.state.todayDate
        }
      } else if (this.state.isAxisPos) {
        if (!this.dataIsSuitableToSend(this.state.payment.credit)) {
          this.props.alert.warning('Please Fill all the fields')
          this.setState({ confirm: false })
          return
        } else if ((this.state.payment && (this.state.payment.credit.digits).toString().length < 4) || (this.state.payment && (this.state.payment.credit.digits).toString().length > 4)) {
          this.props.alert.warning('Enter Only Last four Digit of Card Number!')
          this.setState({ confirm: false })
          return
        }
        dataToSend = {
          mode: 7,
          // payment: {...this.state.payment.credit},
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
      } else if (Date.parse(this.state.dateOfPayment) > Date.parse(new Date().toISOString().substr(0, 10))) {
        this.props.alert.warning('Date Cannot be greater tha today!')
        return false
      }
      // if (!this.state.payment.receiptNo && this.state.isOnlineReceipt) {
      //   this.props.alert.warning('Please fill all the fields!')
      //   return false
      // }

      if (event.target.checked && (this.props.makePayAmt > 0 || this.props.otherPayAmt > 0)) {
        const total = this.state.makeAmt + this.state.otherFeeAmt
        this.setState({ confirm: true }, () => {
          this.props.getDetail(this.state.confirm, this.state.isWalletAgree, dataToSend, this.state.currentData, total)
        })
      } else if (this.state.makeAmt <= 0 || this.state.otherFeeAmt <= 0) {
        this.props.alert.warning('Cannot Proceed With Zero Amount')
        this.setState({ confirm: false }, () => {
          this.props.getDetail(this.state.confirm)
        })
      }
    }

    componentWillReceiveProps (nextProps) {
      console.log('ifsc', nextProps.micr.data)
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

      console.log('componentWillReceiveProps', nextProps)
      console.log('data+', this.props.cardDetailsData)
      if (this.state.isAxisPos) {
        if (this.props.cardDetailsData !== nextProps) {
          let cardtype = this.props.cardDetailsData && this.props.cardDetailsData.CardType
          let cardNum = this.props.cardDetailsData && this.props.cardDetailsData.CardNumber
          let appCode = this.props.cardDetailsData && this.props.cardDetailsData.ApprovalCode
          let bankName = this.props.cardDetailsData && this.props.cardDetailsData.AcquirerName
          let transDate = this.props.cardDetailsData && this.props.cardDetailsData.TransactionDate
          console.log('date+', transDate)
          transDate && transDate.toString()
          // this.state.payment.credit.credit = cardtype
          console.log('data++', this.props.cardDetailsData)
          console.log('card', cardtype)
          console.log('date++', transDate)
          console.log('date', (transDate && transDate.slice(transDate.length - 4, transDate.length)) + '-' + (transDate && transDate.slice(transDate.length - 6, transDate.length - 4)) + '-' + (transDate && transDate.slice(transDate.length - 8, transDate.length - 6)))
          this.setState({
            payment: { credit: {
              credit: cardtype,
              digits: cardNum && cardNum.slice(cardNum.length - 4, cardNum.length),
              creditDate: (transDate && transDate.slice(transDate.length - 4, transDate.length)) + '-' + (transDate && transDate.slice(transDate.length - 6, transDate.length - 4)) + '-' + (transDate && transDate.slice(transDate.length - 8, transDate.length - 6)),
              approval: appCode,
              bankName: bankName
            }
            }
          })
        }
      }
      // console.log('nextprops', )
      // You don't have to do this check first, but it can help prevent an unneeded render
      // if (nextProps.startTime !== this.state.startTime) {
      //   this.setState({ startTime: nextProps.startTime })
      // }
    }

    getCardDetailsHandler = (e) => {
      if (this.props.axisPosData && this.props.axisPosData.data) {
        let data = {
          ref_id: this.props.axisPosData && this.props.axisPosData.data && this.props.axisPosData.data.PlutusTransactionReferenceID
        }
        this.props.cardDetailsPayment(data, this.props.alert, this.props.user)
      }
    }

    agreeWalletPayment = (event) => {
      console.log('agree wallet: ', event.target.checked)
      this.setState((prevState) => ({
        isWalletAgree: !prevState.isWalletAgree,
        confirm: false
        // disableNext: prevState.agreeTerms
      }))
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
      const { classes } = this.props
      if (this.state.moneyDetails) {
        paymentTable = (
          <div className={classes.tableWrapper}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell /> */}
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Installment</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Balance after Amount Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <React.Fragment>
                  {this.state.moneyDetails.installment_rows
                    ? this.state.moneyDetails.installment_rows.map((row, i) => {
                      return (
                        row.map((r, i) => {
                          return (
                            <TableRow>
                              {/* <TableCell /> */}
                              <TableCell>{r.fee_type.fee_type_name}</TableCell>
                              <TableCell>{r.installments.installment_name}</TableCell>
                              <TableCell>{row.payment}</TableCell>
                              <TableCell>{row.balance}</TableCell>
                            </TableRow>
                          )
                        })
                      )
                    })
                    : null
                  }
                </React.Fragment>
              </TableBody>
            </Table>
            <div className={classes.tableTotal}>
              Total Selected Amount: {this.state.makeAmt}
            </div>
          </div>
        )
      }

      let otherPaymentTable = null
      if (this.state.otherFeeDet) {
        otherPaymentTable = (
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>Fee Account</TableCell> */}
                <TableCell>Fee Type</TableCell>
                <TableCell>Installment</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Balance after Amount Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <React.Fragment>
                {this.state.otherFeeDet.installment_rows
                  ? this.state.otherFeeDet.installment_rows.map((row, i) => {
                    return (
                      // <TableRow>
                      //   {/* <TableCell>{row.other_fee.fee_account ? row.other_fee.fee_account.fee_account_name : ''}</TableCell> */}
                      //   <TableCell>{row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                      //   <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_name ? row.other_fee_installments.installment_name : ''}</TableCell>
                      //   {/* <TableCell>{row.other_fee.sub_type ? row.other_fee.sub_type : ''}</TableCell>
                      //   <TableCell>{row.due_date ? row.due_date : ''}</TableCell> */}
                      //   <TableCell>{this.state.otherFeeAmt ? this.state.otherFeeAmt : 0}</TableCell>
                      //   {/* <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                      //   <TableCell>{row.balance ? row.balance : 0}</TableCell> */}
                      //   { /* Zero Amount HardCoded for Balance After Paid */}
                      //   <TableCell>{row.balance && this.state.otherFeeAmt ? row.balance - this.state.otherFeeAmt : 0}</TableCell>
                      //   {/* <TableCell>{row.other_fee_installments && row.other_fee_installments.installment_amount && row.balance ? row.other_fee_installments.installment_amount - row.balance : 0}</TableCell> */}
                      // </TableRow>
                      row.map((r, i) => {
                        return (
                          <TableRow>
                            {/* <TableCell /> */}
                            <TableCell>{r.other_fee.fee_type_name ? r.other_fee.fee_type_name : ''}</TableCell>
                            <TableCell>{r.other_fee_installments && r.other_fee_installments.installment_name ? r.other_fee_installments.installment_name : ''}</TableCell>
                            <TableCell>{row.partial_payment}</TableCell>
                            <TableCell>{row.balance}</TableCell>
                          </TableRow>
                        )
                      })
                    )
                  })
                  : null
                }

              </React.Fragment>
            </TableBody>
          </Table>
        )
      }

      return (
        <React.Fragment>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs='12'>
              <Typography variant='h5'>Normal Fees</Typography>
              {paymentTable}
            </Grid>
            <Grid item xs='12'>
              <Typography variant='h5'>Other Fees</Typography>
              <div className={classes.tableWrapper}>
                {otherPaymentTable}
                <div className={classes.tableTotal}>
                Total Selected Amount: {this.state.otherFeeAmt}
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs={12}>
              {this.props.walletInfo.length && this.props.walletInfo[0].reaming_amount > 0
                ? <div style={{ marginBottom: 15 }}>
                  <h4>Total Amount to be paid: {this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt > this.props.walletInfo[0].reaming_amount) ? this.state.makeAmt + this.state.otherFeeAmt - this.props.walletInfo[0].reaming_amount : this.state.makeAmt + this.state.otherFeeAmt}</h4>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.isWalletAgree}
                        onChange={this.agreeWalletPayment}
                        // disabled={this.state.total + this.state.shippingAmount > this.props.walletInfo[0].total_amount}
                        color='primary'
                      />
                    }
                    label='Pay using Wallet Amount'
                  />
                  <h4 style={{ marginTop: 0 }}>Total available balance: {this.props.walletInfo[0].reaming_amount}</h4>
                  {this.state.isWalletAgree ? <h4 style={{ marginTop: 0 }}>Remaining wallet balance: {this.props.walletInfo[0].reaming_amount <= this.state.makeAmt + this.state.otherFeeAmt ? 0 : this.props.walletInfo[0].reaming_amount - this.state.makeAmt - this.state.otherFeeAmt}</h4> : ''}
                </div>
                : ''}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs={12}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Payment Mode:</FormLabel>
                <RadioGroup aria-label='gender' name='gender1' value={this.state.selectedPayment} onChange={this.handlePayment}>
                  <FormControlLabel value='a' control={<Radio />} label='Cash' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='b' control={<Radio />} label='Cheque' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='c' control={<Radio />} label='Internet Payment' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='d' control={<Radio />} label='Credit / Debit' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='e' control={<Radio />} label='Axis POS' />
                  {/* <FormControlLabel value='e' control={<Radio />} label='Card - POS' disabled /> */}
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* <Grid item xs='2'>
              <strong>Payment Mode:</strong>
            </Grid>
            <Grid item xs='2'>
              <Radio
                checked={this.state.selectedPayment === 'a'}
                onChange={this.handlePayment}
                value='a'
                name='radio-button-demo'
                aria-label='Cash'
              /> Cash
            </Grid>
            <Grid item xs='2'>
              <Radio
                checked={this.state.selectedPayment === 'b'}
                onChange={this.handlePayment}
                value='b'
                name='radio-button-demo'
                aria-label='Cash'
              /> Cheque
            </Grid>
            <Grid item xs='3' >
              <Radio
                checked={this.state.selectedPayment === 'c'}
                onChange={this.handlePayment}
                value='c'
                name='radio-button-demo'
                aria-label='Cash'
              /> Internet Payment
            </Grid>
            <Grid item xs='3'>
              <Radio
                checked={this.state.selectedPayment === 'd'}
                onChange={this.handlePayment}
                value='d'
                name='radio-button-demo'
                aria-label='Cash'
              /> Credit / Debit Card
            </Grid> */}
            {this.state.isChequePaper === true
              ? <React.Fragment>
                <Grid container spacing={3} style={{ padding: 15 }}>
                  <Grid item xs='3'>
                    <label>Cheque No.</label>
                    <input
                      name='chequeNo'
                      type='number'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Cheque Date.</label>
                    <input
                      name='chequeDate'
                      type='date'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid>
                  <Grid item xs='3'>
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
                    ? <Grid item xs='3'>
                      <label>IFSC</label>
                      <input
                        name='ifsc'
                        type='text'
                        className='form-control'
                        style={{ width: '200px' }}
                        value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                        onChange={this.chequeDataHandler} />
                    </Grid>
                    : null}
                  {this.state.searchByValue === 2 || this.state.searchByValue === 3
                    ? <Grid item xs='3'>
                      <label>MICR Code</label>
                      <input
                        name='micr'
                        type='number'
                        className='form-control'
                        style={{ width: '200px' }}
                        value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                        onChange={this.chequeDataHandler} />
                    </Grid>
                    : null}
                  <Grid item xs='3'>
                    <label>Bank Name</label>
                    <input
                      name='chequeBankName'
                      type='text'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Bank Branch</label>
                    <input
                      name='chequeBankBranch'
                      type='text'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment && this.state.payment.cheque && this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid>
                  {this.props.micr.is_multiple ? <div style={{ color: '#CC0000' }}>*This micr has multiple bank details, please verify once</div> : null}
                </Grid>
              </React.Fragment>
              : null
            }
            {this.state.isInternetPaper === true
              ? <React.Fragment>
                <Grid item xs='3'>
                  <label>Date: </label>
                  <input
                    name='internetDate'
                    type='date'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment && this.state.payment.internet && this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                    onChange={this.internetDataHandler} />
                </Grid>
                <Grid item xs='3'>
                  <label>Remarks.</label>
                  <input
                    name='remarks'
                    type='text'
                    className='form-control'
                    value={this.state.payment && this.state.payment.internet && this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                    style={{ width: '200px' }}
                    onChange={this.internetDataHandler} />
                </Grid>
              </React.Fragment>
              : null}
            {this.state.isCreditPaper === true
              ? <React.Fragment>
                <Grid container spacing={3} style={{ padding: 15 }}>
                  <Grid item xs='3'>
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
                  <Grid item xs='3'>
                    <label>Credit Date</label>
                    <input
                      name='creditDate'
                      type='date'
                      className='form-control'
                      value={this.state.payment && this.state.payment.credit && this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Card Last 4 Digits*</label>
                    <input
                      name='digits'
                      type='number'
                      className='form-control'
                      value={this.state.payment && this.state.payment.credit && this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Approval Code.</label>
                    <input
                      name='approval'
                      type='text'
                      className='form-control'
                      value={this.state.payment && this.state.payment.credit && this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Bank Name.</label>
                    <input
                      name='bankName'
                      type='text'
                      className='form-control'
                      value={this.state.payment && this.state.payment.credit && this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Remarks.</label>
                    <input
                      name='creditRemarks'
                      type='text'
                      className='form-control'
                      value={this.state.payment && this.state.payment.credit && this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                </Grid>
              </React.Fragment>
              : null}
            {this.state.isAxisPos === true && (this.props.axisPosData && this.props.axisPosData.data && this.props.axisPosData.data.ResponseCode === 0)
              ? <React.Fragment>
                <Grid container spacing={3} style={{ padding: 15 }}>
                  <Grid item xs='3'>
                    <Button variant='contained' onClick={this.getCardDetailsHandler}>PAY NOW</Button>
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ padding: 15 }}>
                  <Grid item xs='3'>
                    <label>Card Type*</label>
                    <input
                      disabled={this.state.isAxisPos}
                      name='approval'
                      type='text'
                      className='form-control'
                      value={this.state.payment.credit.credit ? this.state.payment.credit.credit : ''}
                      style={{ width: '200px' }}
                      onChange={this.creditTypeHandler}
                    />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Credit Date</label>
                    <input
                      disabled={this.state.isAxisPos}
                      name='creditDate'
                      type='date'
                      className='form-control'
                      value={this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Card Last 4 Digits*</label>
                    <input
                      disabled={this.state.isAxisPos}
                      name='digits'
                      type='number'
                      className='form-control'
                      value={this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Approval Code.</label>
                    <input
                      disabled={this.state.isAxisPos}
                      name='approval'
                      type='text'
                      className='form-control'
                      value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  <Grid item xs='3'>
                    <label>Bank Name.</label>
                    <input
                      disabled={this.state.isAxisPos}
                      name='bankName'
                      type='text'
                      className='form-control'
                      value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid>
                  {/* <Grid item xs='3'>
                    <label>Remarks.</label>
                    <input
                      name='creditRemarks'
                      type='text'
                      className='form-control'
                      value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                      onChange={this.creditDataHandler}
                      style={{ width: '200px' }} />
                  </Grid> */}
                </Grid>
              </React.Fragment>
              : null}
            <React.Fragment>
              <Grid container spacing={3} style={{ padding: 15 }}>
                {!this.state.isAxisPos
                  ? <Grid item xs={12}>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend'>Receipt Type:</FormLabel>
                      <RadioGroup aria-label='gender' name='gender1' value={this.state.selectedReceipt} onChange={this.handleReceipt}>
                        <FormControlLabel value='online' control={<Radio />} label='Online' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                        <FormControlLabel value='manual' control={<Radio />} label='Manual' disabled={this.state.isWalletAgree && (this.state.makeAmt + this.state.otherFeeAmt <= this.props.walletInfo[0].reaming_amount)} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  : []}
                {/* <Grid item xs='2'>
                  <strong>Receipt Type:</strong>
                </Grid>
                <Grid item xs='2'>
                  <Radio
                    checked={this.state.selectedReceipt === 'online'}
                    onChange={this.handleReceipt}
                    value='online'
                    name='online'
                    aria-label='Cash'
                  /> Online
                </Grid>
                <Grid item xs='3'>
                  <Radio
                    checked={this.state.selectedReceipt === 'manual'}
                    onChange={this.handleReceipt}
                    value='manual'
                    name='manual'
                    aria-label='Cash'
                  /> Manual
                </Grid> */}
              </Grid>
            </React.Fragment>
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
            {this.state.isOnlineReceipt ? <React.Fragment>
              <Grid item xs='2'>
                <strong>Receipt Number:</strong>
              </Grid>
              <Grid item xs='3'>
                <input
                  name='receiptNo'
                  type='number'
                  className='form-control'
                  value={this.state.payment.receiptNo ? this.state.payment.receiptNo : ''}
                  onChange={this.handleReceiptData}
                  style={{ width: '200px' }} />
                {receiptData}
              </Grid>
            </React.Fragment> : null}
            {/* displayed only if opted manual */}
            {/* {this.state.isOnlineReceipt === true
            ? <Grid.Row>
              <Grid.Column computer={2}>
                <strong>Receipt Number online:</strong>
              </Grid.Column>
              <Grid.Column computer={4}>
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
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='2'>
              <strong>Date of Payment:</strong>
            </Grid>
            <Grid item xs='3'>
              <input
                disabled={this.state.isAxisPos}
                name='dateOfPayment'
                type='date'
                className='form-control'
                // min={this.state.backDate}
                max={new Date().toISOString().substr(0, 10)}
                // disabled={this.state.payment.paymentDate}
                style={{ width: '200px' }}
                value={this.state.payment.dateOfPayment}
                onChange={this.handleReceiptData} />
              {/* <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p> */}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='2'>
              <strong>Current Date:</strong>
            </Grid>
            <Grid item xs='3'>
              {/* <input type="text" value= readonly /> */}
              <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            {!this.state.isAxisPos
              ? <Grid item xs='3'>
                <input type='checkbox'
                  name='confirm'
                  onChange={this.handleConfirm}
                  checked={this.state.confirm} />
                        Confirm Payment Details
              </Grid>
              : [] }
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </React.Fragment>
      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  receiptRange: state.finance.makePayAcc.receiptRange,
  ifsc: state.finance.common.ifscDetails,
  otherFeesList: state.finance.accountantReducer.listOtherFee.accountantOtherFees,
  micr: state.finance.common.micrDetails,
  walletInfo: state.finance.makePayAcc.walletInfo,
  dateFromServer: state.finance.common.dateFromServer,
  axisPosData: state.finance.makePayAcc.axisPosData,
  cardDetailsData: state.finance.makePayAcc.cardDetailsData
})

const mapDispatchToProps = dispatch => ({
  cardDetailsPayment: (data, alert, user) => dispatch(actionTypes.cardDetailsPayment({ data, alert, user })),
  sendAxisPosPayment: (data, alert, user) => dispatch(actionTypes.sendAxisPosPayment({ data, alert, user })),
  fetchReceiptRange: (session, erp, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, erp, alert, user })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ReceiptDetails)))
