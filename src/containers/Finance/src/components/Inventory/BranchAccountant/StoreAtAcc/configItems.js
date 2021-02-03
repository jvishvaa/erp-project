import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { withStyles,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  StepLabel,
  Step,
  Stepper,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  FormControl,
  FormLabel,
  RadioGroup
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import axios from 'axios'
import { ArrowBack } from '@material-ui/icons/'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import { urls } from '../../../../urls'
// import storeReceipts from '../../Receipts/storePaymentReceipt' //rajneesh
// import { urls } from '../../../../urls'

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
  return ['Config Items', 'Receipt Details', 'Completed']
}

class ConfigItems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      swipeDevice: null,
      selectedPayment: 'a',
      selectedReceipt: 'online',
      isOnlineReceipt: false,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isSwipe: false,
      searchByValue: null,
      searchByData: null,
      isTrans: false,
      confirm: false,
      activeStep: 0,
      isCheckAll: true,
      isChecked: {},
      quantity: {},
      size: {},
      total: 0,
      shippingAmount: 0,
      discountAmount: 0,
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
        // receiptOnline: null,
        session: null,
        dateOfPayment: new Date().toISOString().substr(0, 10),
        agreeTerms: false,
        isWalletAgree: false
      }
    }
  }

  componentDidMount () {
    // console.log('kitD in receip: ', this.props.selectedKits)
    this.props.fetchWalletInfo(this.props.session, this.props.erpCode, this.props.alert, this.props.user)
    this.props.fetchCouponDiscount(this.props.erpCode, this.props.session, this.props.selectedKits, this.props.alert, this.props.user)
    this.props.fetchSubCategoryStore(this.props.session, this.props.erpCode, this.props.alert, this.props.user)
    if (!this.props.isStudent) {
      // this.props.fetchDeviceId(this.props.session, this.props.alert, this.props.user)
      this.props.storeReceiptNumbers(this.props.session, this.props.erpCode, this.props.alert, this.props.user)
      // let grade = JSON.parse(localStorage.getItem('user_profile')).grade_id
      // let branch = JSON.parse(localStorage.getItem('user_profile')).branch_id
      // this.props.fetchSubCategoryStore(this.props.session, grade, branch, this.props.alert, this.props.user)
    }
    if (this.props.isDelivery === 'home') {
      this.props.fetchDeliveryAmount(this.props.erpCode, this.props.alert, this.props.user)
    }
    // current Date
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
    this.setState({ todayDate: today })
    // this.setState(Object.assign(this.state.payment, { dateOfPayment: today }))

    if (this.props.storeItems.length === 0) {
      this.setState({
        isChecked: {},
        total: 0
      })
    } else {
      // const sum = this.props.storeList.reduce((acc, curr) => acc + curr.kit_price, 0)
      const isChecked = {}
      this.props.storeItems.forEach((item) => {
        isChecked[item.id] = true
        // quantity[item.id] = 1
      })
      this.setState({
        total: this.props.selectedTotal,
        isChecked,
        quantity: { ...this.props.itemsQuantity }
      }, () => {
        // this.calculateTotalAmount()
      })
    }
    if (this.props.shippingComponent) {
      this.setState({
        activeStep: 1
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
    if (nextProps.storeItems !== this.props.storeItems) {
      if (nextProps.storeItems.length === 0) {
        this.setState({
          isChecked: {},
          quantity: {}
        })
      } else {
        // const sum = nextProps.storeitems.reduce((acc, curr) => acc + curr.kit_price, 0)
        const isChecked = {}
        nextProps.storeItems.forEach(item => {
          isChecked[item.id] = true
          // quantity[item.id] = 1
        })
        this.setState({
          isChecked,
          total: this.props.selectedTotal,
          quantity: { ...this.props.itemsQuantity }
        }, () => {
          this.calculateTotalAmount()
        })
      }
    }
    if (nextProps.couponDiscount.length !== this.props.couponDiscount.length) {
      this.calculateTotalAmount()
    }
    if (nextProps.deliveryAmount !== this.props.deliveryAmount) {
      if (nextProps.deliveryAmount.length && this.props.isDelivery === 'home') {
        this.setState({
          shippingAmount: nextProps.deliveryAmount[0].kit_price ? nextProps.deliveryAmount[0].kit_price : 0
        })
      }
    }
    // if (nextProps.walletInfo.length !== this.props.walletInfo.length) {
    //   let value = false
    //   if (this.props.walletInfo.length && this.props.walletInfo[0].total_amount >= this.props.selectedTotal + this.state.shippingAmount) {
    //     value = true
    //   }
    //   this.setState({
    //     isWalletAgree: value
    //   })
    // }
  }

  // shouldComponentUpdate (nextProps) {
  //   return nextProps.couponDiscount.length !== this.props.couponDiscount.length
  // }

  componentDidUpdate (prevProps) {
    // this.calculateTotalAmount()
    // console.log('CDU wallet agree: ', this.state.isWalletAgree)
    if (prevProps.couponDiscount.length !== this.props.couponDiscount.length) {
      this.calculateTotalAmount()
    }

    const erpLength = (this.props.erpCode + '').length
    const {
      erp,
      session
      // alert,
      // user
      // refresh
    } = this.props
    // if (refresh !== prevProps.refresh) {
    //   this.props.fetchAccountantTransaction(erpNo, session, user, alert)
    // }
    if (!this.props.erpCode || !this.props.session || !this.props.getData || erpLength !== 10) {
      return
    }
    if (this.props.erpCode === prevProps.erpCode && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData)) {
      console.log('inside did update')
      // this.subjectCheckHandler()
      this.getBackPlease()
    }
  }

  isQuantitySmall = (obj1, obj2) => {
    let isSmall = false
    Object.keys(obj1).forEach(key => {
      if (obj1[key] < obj2[key]) {
        isSmall = true
      }
    })
    // const changedQuantity = Object.keys(obj1)
    //   .reduce((acc, curr) => {
    //     acc += (+obj1[curr])
    //     return acc
    //   }, 0)

    // const givenQuantity = Object.keys(obj2)
    //   .reduce((acc, curr) => {
    //     acc += (+obj2[curr])
    //     return acc
    //   }, 0)

    return isSmall
  }

  termCheckHandler = () => {
    this.setState((prevState) => ({
      agreeTerms: !prevState.agreeTerms
      // disableNext: prevState.agreeTerms
    }))
  }

  calculateTotalAmount = (isUniform) => {
    console.log('CDM')
    const isChecked = { ...this.state.isChecked }
    const checkedItems = Object.keys(isChecked).filter(key => isChecked[key])
    let disAmt = 0
    let statAmt = 0
    let uniAmt = 0
    let bothAmt = 0
    if (this.props.couponDiscount.length && this.props.couponDiscount[0].coupon) {
      let uniformItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && item.is_uniform_item)
      let stationaryItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && !item.is_uniform_item)
      if (this.props.couponDiscount[0].applicable === 'uniform') {
        uniformItems.map(item => {
          uniAmt += item.final_price_after_gst * this.state.quantity[item.id]
        })
        disAmt = uniAmt * this.props.couponDiscount[0].coupon / 100
      } else if (this.props.couponDiscount[0].applicable === 'stationary') {
        stationaryItems.map(item => {
          statAmt += item.final_price_after_gst * this.state.quantity[item.id]
        })
        disAmt = statAmt * this.props.couponDiscount[0].coupon / 100
      } else {
        uniformItems.map(item => {
          bothAmt += item.final_price_after_gst * this.state.quantity[item.id]
        })
        stationaryItems.map(item => {
          bothAmt += item.final_price_after_gst * this.state.quantity[item.id]
        })
        disAmt = bothAmt * this.props.couponDiscount[0].coupon / 100
      }
    }
    if (checkedItems.length === 0) {
      this.setState({
        total: 0,
        isWalletAgree: false
      })
    } else if (checkedItems.length === this.props.storeItems.length &&
      !this.isQuantitySmall(this.state.quantity, this.props.itemsQuantity)) {
      const extraAmount = this.props.storeItems.reduce((acc, curr) => {
        return acc + (this.state.quantity[curr.id] - this.props.itemsQuantity[curr.id]) * curr.final_price_after_gst
      }, 0)
      console.log('CDM extra: ', extraAmount)
      // let value = false
      // if (this.props.walletInfo.length && (this.props.selectedTotal + extraAmount - disAmt) <= this.props.walletInfo[0].total_amount) {
      //   value = true
      // }
      this.setState({
        total: this.props.selectedTotal + extraAmount - disAmt,
        discountAmount: disAmt,
        isWalletAgree: false
      })
    } else {
      let stationaryPrice = 0
      let uniformPrice = 0

      let stationaryItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && !item.is_uniform_item)
      let uniformItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && item.is_uniform_item)
      console.log('store list: ', this.props.storeList)
      const uniformKitList = this.props.storeList.filter(item => item.is_uniform_kit)[0]
      const stationaryKitList = this.props.storeList.filter(item => !item.is_uniform_kit)[0]
      console.log('stationary kit list', stationaryKitList)

      const uniformQuantity = uniformKitList ? uniformKitList.quantity.reduce((acc, curr) => {
        acc[curr.id] = curr.quantity
        return acc
      }, {}) : {}

      const stationaryQuantity = stationaryKitList ? stationaryKitList.quantity.reduce((acc, curr) => {
        acc[curr.id] = curr.quantity
        return acc
      }, {}) : {}

      const changedUniformQuantity = uniformItems ? uniformItems.reduce((acc, curr) => {
        acc[curr.id] = this.state.quantity[curr.id]
        return acc
      }, {}) : {}

      const changedStationaryQuantity = stationaryItems ? stationaryItems.reduce((acc, curr) => {
        acc[curr.id] = this.state.quantity[curr.id]
        return acc
      }, {}) : {}

      if (uniformKitList && uniformKitList.item.length === uniformItems.length &&
        !this.isQuantitySmall(changedUniformQuantity, uniformQuantity)) {
        uniformPrice = uniformItems.reduce((acc, curr) => {
          return acc + (this.state.quantity[curr.id] - this.props.itemsQuantity[curr.id]) * curr.final_price_after_gst
        }, 0)
        uniformPrice = uniformPrice + ((uniformKitList && uniformKitList.kit_price) || 0)
      } else if (uniformItems.length &&
        (uniformItems.length < uniformKitList.item.length ||
          this.isQuantitySmall(changedUniformQuantity, uniformQuantity))) {
        uniformPrice = uniformItems.reduce((acc, curr) => {
          return acc + (this.state.quantity[curr.id]) * curr.final_price_after_gst
        }, 0)
      }

      if (stationaryKitList && stationaryKitList.item.length === stationaryItems.length &&
        !this.isQuantitySmall(changedStationaryQuantity, stationaryQuantity)) {
        stationaryPrice = stationaryItems.reduce((acc, curr) => {
          return acc + (this.state.quantity[curr.id] - this.props.itemsQuantity[curr.id]) * curr.final_price_after_gst
        }, 0)
        stationaryPrice = stationaryPrice + ((stationaryKitList && stationaryKitList.kit_price) || 0)
      } else if (stationaryItems.length &&
        (stationaryItems.length < stationaryKitList.item.length ||
          this.isQuantitySmall(changedStationaryQuantity, stationaryQuantity))) {
        stationaryPrice = stationaryItems.reduce((acc, curr) => {
          return acc + (this.state.quantity[curr.id]) * curr.final_price_after_gst
        }, 0)
      }
      const total = stationaryPrice + uniformPrice - disAmt
      console.log('CDM stationary price' + stationaryPrice + 'uniform Price: ' + uniformPrice + 'total: ' + total)
      // let value = false
      // if (this.props.walletInfo.length && total <= this.props.walletInfo[0].total_amount) {
      //   value = true
      // }
      this.setState({
        total,
        discountAmount: disAmt,
        isWalletAgree: false
      })
    }
  }

  checkDisable = (item) => {
    const {
      checkedKits,
      isUniformBought,
      isStationaryBought,
      // hasSubjectChoosen,
      isNewStudent
    } = this.props
    // for the new Student
    // if (item.store_sub_category === 3) {
    //   return false
    // }
    const subCat = this.props.subCategoryStore.length && this.props.subCategoryStore.filter(sub => {
      return sub.is_store_sub_category_applicable && sub.store_sub_category === item.store_sub_category
    })
    console.log('subCat item: ', subCat, item)
    if (subCat && subCat.length) {
      return false
    }
    if (isNewStudent && !isUniformBought && item.is_uniform_item && (item.item_compulsory === '1' || item.item_compulsory === '4')) {
      return true
    } else if (isNewStudent && !isStationaryBought && !item.is_uniform_item && (item.item_compulsory === '1' || item.item_compulsory === '4')) {
      return true
    }

    // for the old student
    let isMandatory = false
    if (item.is_uniform_item) {
      const uniformKit = checkedKits.filter(kit => kit.is_uniform_kit)[0]
      isMandatory = !!uniformKit && uniformKit.is_mandatory
    } else {
      const stationaryKit = checkedKits.filter(kit => !kit.is_uniform_kit)[0]
      isMandatory = !!stationaryKit && stationaryKit.is_mandatory
    }
    if (!isNewStudent && isMandatory && !item.is_uniform_item && !isStationaryBought && (item.item_compulsory === '2' || item.item_compulsory === '4')) {
      return true
    } else if (!isNewStudent && isMandatory && item.is_uniform_item && !isUniformBought && (item.item_compulsory === '2' || item.item_compulsory === '4')) {
      return true
    }
    return false
  }

  checkQuantityDisable = (item) => {
    const {
      isUniformBought,
      isStationaryBought
    } = this.props
    console.log('disable: ', item.store_sub_category)
    // if (item.store_sub_category === 3) {
    if (!item.can_be_sold_alone_to_all && !item.is_uniform_item && !isStationaryBought) {
      return true
    } else if (!item.can_be_sold_alone_to_all && item.is_uniform_item && !isUniformBought) {
      return true
    }
    // }
    return false
  }

  checkChangeHandler = (e, row) => {
    console.log('Check Change Handler', this.state.isChecked)
    let { isChecked } = this.state
    // const subCat = this.props.subCategoryStore.length && this.props.subCategoryStore[0].is_store_sub_category_applicable && this.props.subCategoryStore[0].store_sub_category
    const subCat = this.props.subCategoryStore.length && this.props.subCategoryStore.filter(sub => {
      return sub.is_store_sub_category_applicable && sub.store_sub_category === row.store_sub_category
    })
    // check if the check box is checked or unchecked
    // for sub cat
    const ids = subCat.length && this.props.storeItems.filter(item => item.store_sub_category === subCat[0].store_sub_category && row.store_sub_category === subCat[0].store_sub_category)
    console.log('subCat ids: ', ids)
    ids && ids.forEach((item) => {
      isChecked[item.id] = e.target.checked
    })
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [row.id]: true } }, () => {
        this.calculateTotalAmount(row.is_uniform_item)
      })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [row.id]: false } }, () => {
        this.calculateTotalAmount(row.is_uniform_item)
      })
    }
  }

  checkAllHandler = (e) => {
    if (e.target.checked) {
      const isChecked = Object.keys(this.state.isChecked).reduce((acc, curr) => {
        acc[curr] = true
        return acc
      }, {})
      this.setState({
        isChecked,
        isCheckAll: true
      }, () => {
        this.calculateTotalAmount()
      })
    } else {
      const isChecked = Object.keys(this.state.isChecked).reduce((acc, curr) => {
        acc[curr] = false
        return acc
      }, {})
      this.setState({
        isChecked,
        isCheckAll: false
      }, () => {
        this.calculateTotalAmount()
      })
    }
  }

  quantityChangeHandler = (e, row) => {
    if (+e.target.value < 1) {
      this.props.alert.warning('Quantity Cannot be Less Than 1')
      return
    }
    const count = +e.target.value
    this.setState((prevState) => {
      return {
        quantity: { ...prevState.quantity, [row.id]: count }
      }
    }, () => {
      console.log(this.state)
      this.calculateTotalAmount(row.is_uniform_item)
    })
  }

  // Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.StoreReceiptPdfData}?transaction_id=${transactionId}&academic_year=${this.props.session}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    try {
      const response = await this.getPdfData(this.props.trnsId)
      // storeReceipts(response.data)
    } catch (error) {
      console.error(error.response)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        this.props.alert.error(error.response.data)
      } else {
        this.props.alert.error('Unable To get Status')
      }
      // this.props.alert.warning('Something Went Wrong')
    }
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.itemsTable()
      case 1:
        return this.receiptFields()
      case 2:
        if (this.props.status) {
          return <React.Fragment>
            <h2>Thank You For Recording Payment Details</h2>
            <Button variant='contained' onClick={this.generatePdf}>Download PDF</Button>
          </React.Fragment>
        }
        break
      default:
        return 'Unknown stepIndex'
    }
  }

  handlePayment = event => {
    console.log('event: ', event)
    if (event.target.value === 'b') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: true,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false,
        isSwipe: false,
        confirm: false,
        disableNext: true
      })
    } else if (event.target.value === 'c') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: true,
        isCreditPaper: false,
        isSwipe: false,
        isTrans: true,
        confirm: false,
        disableNext: true
      })
    } else if (event.target.value === 'd') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: true,
        isSwipe: false,
        isTrans: false,
        confirm: false,
        disableNext: true
      })
    } else if (event.target.value === 'a') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false,
        isSwipe: false,
        confirm: false,
        disableNext: true
      })
    } else if (event.target.value === 'e') {
      this.setState({
        selectedPayment: event.target.value,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false,
        isSwipe: true,
        confirm: false,
        disableNext: true
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

  creditDataHandler = (event) => {
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

  agreeWalletPayment = (event) => {
    console.log('agree wallet: ', event.target.checked)
    // if (event.target.checked && this.props.walletInfo.length && this.state.total > this.props.walletInfo[0].total_amount) {
    //   this.props.alert.warning('Wallet Balance is not enough!')
    //   return
    // }
    this.setState((prevState) => ({
      isWalletAgree: !prevState.isWalletAgree
      // disableNext: prevState.agreeTerms
    }))
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

  handleReceipt = event => {
    this.setState({ selectedReceipt: event.target.value })
    if (event.target.value === 'manual') {
      // this.setState({payment.isOffline : true})
      this.setState({ isOnlineReceipt: true })
      // this.state.payment.isOffline = true
      // this.state.payment.isOnline = false
    } else {
      this.setState({ isOnlineReceipt: false })
      // this.state.payment.isOffline = false
      // this.state.payment.isOnline = true
    }
  }

  searchBy = (e) => {
    this.setState({
      searchByValue: e.value, searchByData: e
    })
  }

  deviceHandler = (e) => {
    console.log('device id: ', e)
    this.setState({
      swipeDevice: e
    })
  }

  dataIsSuitableToSend = (data) => {
    let suited = true
    Object.keys(data).forEach((keys) => {
      if (!data[keys]) {
        // this.setState({validation : false}, ()=>{return false})
        suited = false
        return undefined
      }
    })
    return suited
  }

  handleConfirm = (event) => {
    if (this.state.isWalletAgree && (this.state.total + this.state.shippingAmount < this.props.walletInfo[0].reaming_amount)) {
      if (event.target.checked) {
        this.setState({ confirm: true, disableNext: false })
        return
      } else {
        this.setState({ confirm: false, disableNext: true })
        return
      }
    }

    if (this.state.selectedPayment === 'e' && !this.state.swipeDevice) {
      this.props.alert.warning('Select device before proceeding..')
      return
    }
    // let dataToSend = null
    if (this.state.isChequePaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.cheque)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false, disableNext: true })
        return
      }
    } else if (this.state.isInternetPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.internet)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false, disableNext: true })
        return
      }
    } else if (this.state.isCreditPaper) {
      if (!this.dataIsSuitableToSend(this.state.payment.credit)) {
        this.props.alert.warning('Please Fill all the fields')
        this.setState({ confirm: false, disableNext: true })
        return
      }
    }

    if (this.state.payment.dateOfPayment === null) {
      this.props.alert.warning('Please fill all the fields!')
      return false
    }

    if (!this.state.payment.receiptNo && this.state.isOnlineReceipt) {
      this.props.alert.warning('Please fill all the fields!')
      return false
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

  termsAndConditionRenderer = () => {
    if (this.props.isStudent) {
      return (
        <React.Fragment>
          <Grid.Row>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={5}
              className='student-section-inputField'
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.agreeTerms}
                    onChange={this.termCheckHandler}
                    color='primary'
                  />
                }
                label='I / We Agree Terms and Conditions'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={5}
              className='student-section-inputField'
            >
              <label>Terms &amp; Conditions :</label>
              <div style={{ color: 'red' }}>
                <p>1. Please be informed that additional transaction
                    charges are applicable. For more information
                    please contact your school administrator.</p>
                <p>2. LetsEduvate will not store any of
                    your Bank credentials / Card details.
                    The system will redirect you to concerned
                      Bank pages only to complete your transaction.</p>
                <p>3. No refund(s)/ No Cancellations are allowed for the transactions done
                  through this channel.</p>
                <p>4. In case of any dispute regarding the payments, you are requested to
                  contact school administrator.</p>
                <p>5. Terms and conditions include Online Payment Fee charges, Refund Policy,
                  Privacy Policy, Withdrawal from School, Governing Law, Jurisdiction etc.</p>
              </div>
            </Grid.Column>
          </Grid.Row>
        </React.Fragment>
      )
    }

    return null
  }

  receiptFields = () => {
    let receiptData = null
    if (this.props.receiptRange && this.props.receiptRange.manual && this.props.receiptRange.manual.length > 0) {
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
    return (
      <div style={{ marginLeft: '15px' }}>
        <h3> Amount to be Paid : {this.state.isWalletAgree && (this.state.total + this.state.shippingAmount > this.props.walletInfo[0].reaming_amount) ? this.state.total + this.state.shippingAmount - this.props.walletInfo[0].reaming_amount : this.state.total + this.state.shippingAmount}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={12}>
              {this.props.walletInfo.length && this.props.walletInfo[0].reaming_amount > 0
                ? <div style={{ marginBottom: 15 }}>
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
                  {this.state.isWalletAgree ? <h4 style={{ marginTop: 0 }}>Remaining wallet balance: {this.props.walletInfo[0].reaming_amount <= this.state.total + this.state.shippingAmount ? 0 : this.props.walletInfo[0].reaming_amount - this.state.total - this.state.shippingAmount}</h4> : ''}
                </div>
                : ''}
            </Grid.Column>
            <Grid.Column computer={12}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Payment Mode:</FormLabel>
                <RadioGroup aria-label='gender' name='gender1' value={this.state.selectedPayment} onChange={this.handlePayment}>
                  <FormControlLabel value='a' control={<Radio />} label='Cash' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='b' control={<Radio />} label='Cheque' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='c' control={<Radio />} label='Internet Payment' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='d' control={<Radio />} label='Credit / Debit' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                  {/* <FormControlLabel value='e' control={<Radio />} label='Card - POS' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} /> */}
                </RadioGroup>
              </FormControl>
            </Grid.Column>
          </Grid.Row>
          {this.state.isChequePaper === true
            ? <Grid.Row>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
                <Grid.Column computer={4} style={{ flexGrow: 2, marginBottom: 10 }}>
                  <label>Cheque No.</label>
                  <input
                    name='chequeNo'
                    type='number'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Cheque Date.</label>
                  <input
                    name='chequeDate'
                    type='date'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 2, marginRight: 15, marginBottom: 10 }}>
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
                </Grid.Column>
                {this.state.searchByValue === 1 || this.state.searchByValue === 3
                  ? <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                    <label>IFSC</label>
                    <input
                      name='ifsc'
                      type='text'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid.Column>
                  : null}
                {this.state.searchByValue === 2 || this.state.searchByValue === 3
                  ? <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                    <label>MICR Code</label>
                    <input
                      name='micr'
                      type='number'
                      className='form-control'
                      style={{ width: '200px' }}
                      value={this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                      onChange={this.chequeDataHandler} />
                  </Grid.Column>
                  : null}
                {/* <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Name on Cheque</label>
                  <input
                    name='chequeName'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeName ? this.state.payment.cheque.chequeName : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column> */}
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Bank Name</label>
                  <input
                    name='chequeBankName'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Bank Branch</label>
                  <input
                    name='chequeBankBranch'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
              </div>
            </Grid.Row>

            : null
          }
          {this.state.isInternetPaper === true
            ? <Grid.Row>
              <Grid.Column computer={4}>
                <label>Date: </label>
                <input
                  name='internetDate'
                  type='date'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                  onChange={this.internetDataHandler} />
              </Grid.Column>
              <Grid.Column computer={4}>
                <label>Remarks.</label>
                <input
                  name='remarks'
                  type='text'
                  className='form-control'
                  value={this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                  style={{ width: '200px' }}
                  onChange={this.internetDataHandler} />
              </Grid.Column>
            </Grid.Row>
            : null}
          {this.state.isCreditPaper === true
            ? <Grid.Row>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
                <Grid.Column computer={4} style={{ flexGrow: 2, marginRight: '15px', marginBottom: 10 }}>
                  <label>Credit*</label>
                  <Select
                    onChange={this.creditTypeHandler}
                    name='credit'
                    // value={this.state.payment.credit.credit === 1 ? [{ value: 1, label: 'Credit' }] : [{ value: 2, label: 'Debit' }]}
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
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Credit Date</label>
                  <input
                    name='creditDate'
                    type='date'
                    className='form-control'
                    value={this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Card Last 4 Digits*</label>
                  <input
                    name='digits'
                    type='number'
                    className='form-control'
                    value={this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Approval Code.</label>
                  <input
                    name='approval'
                    type='text'
                    className='form-control'
                    value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Bank Name.</label>
                  <input
                    name='bankName'
                    type='text'
                    className='form-control'
                    value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}

                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1, marginBottom: 10 }}>
                  <label>Remarks.</label>
                  <input
                    name='creditRemarks'
                    type='text'
                    className='form-control'
                    value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
              </div>
            </Grid.Row>
            : null}
          {this.state.isSwipe
            ? <div style={{ width: 300 }}>
              {this.props.deviceId.length
                ? <>
                  <label>Select Device*</label>
                  <Select
                    onChange={this.deviceHandler}
                    value={this.state.swipeDevice ? this.state.swipeDevice : null}
                    name='device'
                    options={this.props.deviceId.length
                      ? this.props.deviceId.map((device) => {
                        return ({
                          label: 'Device ID: ' + device.device_id,
                          value: device.device_id
                        })
                      }) : []}
                  />
                </>
                : <p style={{ color: 'red' }}>*Swipe machine is not integrated!</p>}
            </div>
            : ''}
          <Grid.Row>
            <Grid.Column computer={12}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Receipt Type:</FormLabel>
                <RadioGroup aria-label='gender' name='gender1' value={this.state.selectedReceipt} onChange={this.handleReceipt}>
                  <FormControlLabel value='online' control={<Radio />} label='Online' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                  <FormControlLabel value='manual' control={<Radio />} label='Manual' disabled={this.state.isWalletAgree && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount)} />
                </RadioGroup>
              </FormControl>
            </Grid.Column>
            {/* <Grid.Column computer={4}>
              <Radio
                checked={this.state.selectedReceipt === 'online'}
                onChange={this.handleReceipt}
                value='online'
                name='online'
                aria-label='Cash'
              /> Online
            </Grid.Column>
            <Grid.Column computer={3}>
              <Radio
                checked={this.state.selectedReceipt === 'manual'}
                onChange={this.handleReceipt}
                value='manual'
                name='manual'
                aria-label='Cash'
              /> Manual
            </Grid.Column> */}
          </Grid.Row>
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
          {this.state.isOnlineReceipt
            ? <Grid.Row>
              <Grid.Column computer={2}>
                <strong>Receipt Number:</strong>
              </Grid.Column>
              <Grid.Column computer={4}>
                <input
                  name='receiptNo'
                  type='number'
                  className='form-control'
                  value={this.state.payment.receiptNo ? this.state.payment.receiptNo : ''}
                  onChange={this.handleReceiptData}
                  style={{ width: '200px' }} />
                {receiptData}
              </Grid.Column>
            </Grid.Row>
            : null}

          {/* displayed only if opted manual */}
          {/* {this.state.isOnlineReceipt === true
            ? <Grid.Row>
              <Grid.Column computer={2}>
                <strong>Receipt Number:</strong>
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
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Date of Payment:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              <input
                name='dateOfPayment'
                type='date'
                className='form-control'
                style={{ width: '200px' }}
                max={new Date().toISOString().substr(0, 10)}
                value={this.state.payment.dateOfPayment}
                onChange={this.handleReceiptData} />
              {/* <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p> */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Current Date:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              {/* <input type="text" value= readonly /> */}
              <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <input type='checkbox'
                name='confirm'
                onChange={this.handleConfirm}
                checked={this.state.confirm} />
              Confirm Payment Details
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  itemsTable = () => {
    let statAmount = 0
    let uniAmount = 0
    let bothAmount = 0
    let { classes } = this.props
    return (
      <div className={classes.tableWrapper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <input
                  type='checkbox'
                  name='checking'
                  checked={this.state.isCheckAll}
                  onChange={
                    (e) => this.checkAllHandler(e)
                  }
                  // disabled={this.checkDisable(row)}
                />
              </TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>SKU Code</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <React.Fragment>
              {this.props.storeItems
                ? this.props.storeItems.map((row, i) => {
                  if (!row.is_uniform_item && this.state.isChecked[row.id]) {
                    statAmount += row.final_price_after_gst * this.state.quantity[row.id]
                  } else if (row.is_uniform_item && this.state.isChecked[row.id]) {
                    uniAmount += row.final_price_after_gst * this.state.quantity[row.id]
                  }
                  if (this.state.isChecked[row.id]) {
                    bothAmount += row.final_price_after_gst * this.state.quantity[row.id]
                  }
                  return (
                    <TableRow hover >
                      <TableCell>
                        <input
                          type='checkbox'
                          name='checking'
                          checked={this.state.isChecked[row.id]}
                          onChange={
                            (e) => this.checkChangeHandler(e, row)
                          }
                          disabled={this.checkDisable(row)}
                        />
                      </TableCell>
                      <TableCell>{row.item_name}</TableCell>
                      <TableCell>{row.item_description}</TableCell>
                      <TableCell>{row.gender === '1' ? 'Male' : row.gender === '2' ? 'Female' : 'Both'}</TableCell>
                      <TableCell>{row.sku_code}</TableCell>
                      <TableCell>
                        <input
                          name='quantity'
                          type='number'
                          className='form-control'
                          id={row.id}
                          style={{ width: '100px' }}
                          // defaultValue='1'
                          value={this.state.quantity[row.id] || ''}
                          onChange={(e) => this.quantityChangeHandler(e, row)}
                          disabled={this.checkQuantityDisable(row)}
                        />
                      </TableCell>
                      {row.is_uniform_item
                        ? <TableCell>
                          <input
                            name='size'
                            // type='number'
                            placeholder='Size'
                            className='form-control'
                            id={row.id}
                            value={this.state.size[row.id] || ''}
                            style={{ width: '100px' }}
                            onChange={(e) => this.itemSizeHandler(e, row.id)}
                            disabled={!row.is_uniform_item}
                          />
                        </TableCell>
                        : ''}
                    </TableRow>
                  )
                })
                : null
              }
              {this.state.total > 0
                ? <>
                  <TableRow>
                    <TableCell colSpan={3} style={{ fontSize: '16px' }}>Total Amount: {this.state.total}</TableCell>
                    {/* <TableCell colSpan={3}>{this.state.feeDetailsList}</TableCell> */}
                  </TableRow>
                  {this.props.walletInfo.length && this.props.isStudent && this.props.walletInfo[0].reaming_amount > 0
                    ? <TableRow>
                      <TableCell>
                        {/* <input
                          type='checkbox'
                          name='agree'
                          checked={this.state.isWalletAgree}
                          onChange={this.agreeWalletPayment}
                          // disabled={this.state.total > this.props.walletInfo[0].reaming_amount}
                        /> <label>Pay using Wallet Amount: {this.props.walletInfo[0].reaming_amount}</label> */}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.isWalletAgree}
                              onChange={this.agreeWalletPayment}
                              // disabled={this.state.total + this.state.shippingAmount > this.props.walletInfo[0].reaming_amount}
                              color='primary'
                            />
                          }
                          label='Pay using Wallet Amount'
                        />
                        {/* <Switch
                          checked={this.state.isWalletAgree}
                          onChange={this.agreeWalletPayment}
                          disabled={this.state.total + this.state.shippingAmount > this.props.walletInfo[0].reaming_amount}
                          color='primary'
                        /> */}
                        <h4 style={{ marginTop: 0 }}>Total available balance: {this.props.walletInfo[0].reaming_amount}</h4>
                        {this.state.isWalletAgree ? <h4 style={{ marginTop: 0 }}>Remaining balance: {this.props.walletInfo[0].reaming_amount <= this.state.total + this.state.shippingAmount ? 0 : this.props.walletInfo[0].reaming_amount - this.state.total - this.state.shippingAmount}</h4> : ''}
                      </TableCell>
                    </TableRow>
                    : ''}
                </>
                : null
              }
            </React.Fragment>
          </TableBody>
        </Table>
        {this.props.couponDiscount.length
          ? <h4 style={{ color: 'red' }}>Student is eligible for {this.props.couponDiscount[0].coupon}% discount ({this.props.couponDiscount[0].applicable === 'stationary' ? 'Stationary Coupon of ' + (statAmount * this.props.couponDiscount[0].coupon / 100).toFixed(2) + ' Rs/-' : this.props.couponDiscount[0].applicable === 'uniform' ? 'Uniform Coupon of ' + (uniAmount * this.props.couponDiscount[0].coupon / 100).toFixed(2) + ' Rs/-' : 'Kit Coupon of ' + (bothAmount * this.props.couponDiscount[0].coupon / 100).toFixed(2) + ' Rs/-'}) is applied on kit!</h4>
          : ''}
        {this.props.isDelivery === 'home'
          ? <h3>Total Amount + Shipping Charge({this.state.shippingAmount}): {(this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount <= this.state.total + this.state.shippingAmount)) ? +(this.state.total + this.state.shippingAmount - this.props.walletInfo[0].reaming_amount).toFixed(2) : (this.state.total + this.state.shippingAmount).toFixed(2)}</h3>
          : <h3>Total Amount Selected: {(this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount <= this.state.total + this.state.shippingAmount)) ? (this.state.total + this.state.shippingAmount - this.props.walletInfo[0].reaming_amount).toFixed(2) : (this.state.total + this.state.shippingAmount).toFixed(2)}</h3>}
        {this.termsAndConditionRenderer()}
      </div>
    )
  }

  itemSizeHandler = (e, id) => {
    let { size } = this.state
    this.setState({ size: { ...size, [id]: e.target.value } })
  }

  getFinalItems = () => {
    let itemsid = []
    Object.keys(this.state.isChecked).forEach((key) => {
      if (this.state.isChecked[key]) {
        itemsid.push(key)
      }
    })

    // filtering only the checked items from main list
    let finalitems = []
    finalitems = this.props.storeItems.filter(item => itemsid.includes(item.id + ''))

    // separating uniform and stationary items
    let uniformItems = []
    let stationaryItems = []
    finalitems.forEach(ele => {
      if (ele.is_uniform_item) {
        uniformItems.push(ele)
      } else {
        stationaryItems.push(ele)
      }
    })

    // for uniform and stationary kit ID
    let uniformId = null
    let stationaryId = null
    this.props.checkedKits.forEach((ele) => {
      if (ele.is_uniform_kit) {
        uniformId = ele.id
      } else {
        stationaryId = ele.id
      }
    })

    // console.log('size state : ', this.state.size)

    Object.keys(this.state.size).forEach((key) => {
      uniformItems.forEach(u => {
        if (+key === +u.id) {
          u.size = this.state.size[key]
        }
      })
    })

    Object.keys(this.state.quantity).forEach((key) => {
      uniformItems.forEach(u => {
        if (+key === +u.id) {
          u.quantity = this.state.quantity[key]
        }
      })
      stationaryItems.forEach(s => {
        if (+key === +s.id) {
          s.quantity = this.state.quantity[key]
        }
      })
    })

    return { uniformItems, stationaryItems, uniformId, stationaryId }
  }

  paymentThroughGateway = () => {
    const {
      uniformItems,
      stationaryItems,
      uniformId,
      stationaryId
    } = this.getFinalItems()
    let del = null
    if (this.props.isDelivery === 'home') {
      if (!this.props.deliveryAmount.length) {
        this.props.alert.warning('You are Not Applicable for home delivery ,contact with branch , cannot proceed, Sorry!')
        return
      }
      del = {
        delivery: {
          delivery_id: this.props.deliveryAmount && this.props.deliveryAmount[0] && this.props.deliveryAmount[0].kit,
          items: this.props.deliveryAmount && this.props.deliveryAmount[0] && this.props.deliveryAmount[0].item
        }
      }
    }
    let wal = null
    if (this.props.walletInfo.length) {
      wal = {
        wallet_agree: this.state.isWalletAgree,
        wallet_data: this.props.walletInfo[0],
        payment_mode: 6,
        wallet_amount_taken: this.state.isWalletAgree && this.props.walletInfo.length && (this.state.total + this.state.shippingAmount <= this.props.walletInfo[0].reaming_amount) ? this.state.total + this.state.shippingAmount : this.state.isWalletAgree && (this.state.total + this.state.shippingAmount >= this.props.walletInfo[0].reaming_amount) ? this.props.walletInfo[0].reaming_amount : 0
      }
    }

    let couponData = []
    if (this.props.couponDiscount.length) {
      const isChecked = { ...this.state.isChecked }
      const checkedItems = Object.keys(isChecked).filter(key => isChecked[key])
      // let disAmt = 0
      let statAmt = 0
      let uniAmt = 0
      let uniformItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && item.is_uniform_item)
      let stationaryItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && !item.is_uniform_item)
      uniformItems.map(item => {
        uniAmt += item.final_price_after_gst * this.state.quantity[item.id]
      })
      stationaryItems.map(item => {
        statAmt += item.final_price_after_gst * this.state.quantity[item.id]
      })
      couponData = [...this.props.couponDiscount]
      if (this.props.couponDiscount[0].applicable === 'uniform') {
        couponData[0].discount_uniform_total = this.state.discountAmount
        couponData[0].discount_stationary_total = 0
      } else if (this.props.couponDiscount[0].applicable === 'stationary') {
        couponData[0].discount_stationary_total = this.state.discountAmount
        couponData[0].discount_uniform_total = 0
      } else {
        couponData[0].discount_uniform_total = +((uniAmt * this.props.couponDiscount[0].coupon / 100).toFixed(2))
        couponData[0].discount_stationary_total = +((statAmt * this.props.couponDiscount[0].coupon / 100).toFixed(2))
      }
      // couponData[0].discount_amount = this.state.discountAmount
    }
    let coup = {
      coupon_discount: couponData
    }
    let url = null
    if (this.props.walletInfo.length && this.state.isWalletAgree) {
      url = /book_uniform_payment/
    } else {
      url = /book_uniform_payment/
    }
    this.props.history.replace({
      pathname: url,
      state: {
        academic_year: this.props.session,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        total_paid_amount: this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount <= this.state.total + this.state.shippingAmount) ? +(this.state.total + this.state.shippingAmount - this.props.walletInfo[0].reaming_amount).toFixed(2) : +(this.state.total + this.state.shippingAmount).toFixed(2),
        student: this.props.erpCode,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      },
      user: this.props.user,
      url: this.props.isStudent && this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount >= this.state.total + this.state.shippingAmount) ? urls.StorePaymentAcc : urls.AirpayStore
    })
  }

  makeFinalPayment = () => {
    // taking only the keys which are true and checked
    const {
      uniformItems,
      stationaryItems,
      uniformId,
      stationaryId
    } = this.getFinalItems()
    console.log('deli id', this.props.deliveryAmount[0])
    let del = null
    if (this.props.isDelivery === 'home') {
      if (!this.props.deliveryAmount.length) {
        this.props.alert.warning('You are Not Applicable for home delivery ,contact with branch , cannot proceed, Sorry!')
        return
      }
      del = {
        delivery: {
          delivery_id: this.props.deliveryAmount && this.props.deliveryAmount[0] && this.props.deliveryAmount[0].kit,
          items: this.props.deliveryAmount && this.props.deliveryAmount[0] && this.props.deliveryAmount[0].item
        }
      }
    }

    let kitId = null
    kitId = {
      delivery_data_kit_id: this.props.kitIdToBePaid,
      t_no: this.props.transactionId
    }

    let wal = null
    let tot = this.state.total + this.state.shippingAmount
    if (this.props.walletInfo.length && this.state.isWalletAgree) {
      let bal = this.props.walletInfo[0].reaming_amount
      console.log('total and balnce: ', tot, bal)
      wal = {
        wallet_agree: this.state.isWalletAgree,
        wallet_data: this.props.walletInfo[0],
        // payment_mode: 6,
        wallet_amount_taken: this.state.isWalletAgree && (tot >= bal) ? bal : this.state.isWalletAgree && (tot <= bal) ? tot : 0
      }
    }

    let couponData = []
    if (this.props.couponDiscount.length) {
      const isChecked = { ...this.state.isChecked }
      const checkedItems = Object.keys(isChecked).filter(key => isChecked[key])
      // let disAmt = 0
      let statAmt = 0
      let uniAmt = 0
      let uniformItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && item.is_uniform_item)
      let stationaryItems = this.props.storeItems
        .filter(item => checkedItems.includes(item.id + '') && !item.is_uniform_item)
      uniformItems.map(item => {
        uniAmt += item.final_price_after_gst * this.state.quantity[item.id]
      })
      stationaryItems.map(item => {
        statAmt += item.final_price_after_gst * this.state.quantity[item.id]
      })
      couponData = [...this.props.couponDiscount]
      if (this.props.couponDiscount[0].applicable === 'uniform') {
        couponData[0].discount_uniform_total = this.state.discountAmount
        couponData[0].discount_stationary_total = 0
      } else if (this.props.couponDiscount[0].applicable === 'stationary') {
        couponData[0].discount_stationary_total = this.state.discountAmount
        couponData[0].discount_uniform_total = 0
      } else {
        couponData[0].discount_uniform_total = +((uniAmt * this.props.couponDiscount[0].coupon / 100).toFixed(2))
        couponData[0].discount_stationary_total = +((statAmt * this.props.couponDiscount[0].coupon / 100).toFixed(2))
      }
      // couponData[0].discount_amount = this.state.discountAmount
    }

    let coup = {
      coupon_discount: couponData
    }
    console.log('payment wal::::', wal)
    if (this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount >= this.state.total + this.state.shippingAmount)) {
      let walletMoney = {
        academic_year: this.props.session,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        payment_mode: 6,
        ...this.props.isDelivery === 'home' ? del : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        student: this.props.erpCode,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null,
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null
      }
      this.sendingToServer(walletMoney)
      return
    }

    if (this.state.selectedPayment === 'a') {
      let cashData = {
        academic_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.receiptOnline ? this.state.payment.receiptOnline : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null

      }
      this.sendingToServer(cashData)
    } else if (this.state.selectedPayment === 'b') {
      let chequeData = {
        academic_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.receiptOnline ? this.state.payment.receiptOnline : null,
        cheque_number: this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : null,
        date_of_cheque: this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : null,
        micr_code: this.state.payment.cheque.micr ? this.state.payment.cheque.micr : null,
        ifsc_code: this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : null,
        // name_on_cheque: this.state.payment.cheque.chequeName ? this.state.payment.cheque.chequeName : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        bank_name: this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : null,
        bank_branch: this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      }
      this.sendingToServer(chequeData)
    } else if (this.state.selectedPayment === 'c') {
      let internetData = {
        academic_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.receiptOnline ? this.state.payment.receiptOnline : null,
        // transaction_id: this.state.payment.transid ? this.state.payment.transid : null,
        internet_date: this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : null,
        remarks: this.state.payment.internet.remarks ? this.state.payment.internet.remarks : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      }
      this.sendingToServer(internetData)
    } else if (this.state.selectedPayment === 'd') {
      let creditData = {
        academic_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
        // receipt_number_online: this.state.payment.receiptOnline ? this.state.payment.receiptOnline : null,
        remarks: this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : null,
        approval_code: this.state.payment.credit.approval ? this.state.payment.credit.approval : null,
        card_type: this.state.payment.credit.credit ? this.state.payment.credit.credit : null,
        card_last_digits: this.state.payment.credit.digits ? this.state.payment.credit.digits : null,
        bank_name: this.state.payment.credit.bankName ? this.state.payment.credit.bankName : null,
        credit_date: this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      }
      this.sendingToServer(creditData)
    } else if (this.state.selectedPayment === 'e') {
      if (!this.state.swipeDevice) {
        this.props.alert.warning('Select device before proceeding..')
        return
      }
      let posData = {
        device_id: this.state.swipeDevice && this.state.swipeDevice.value,
        academic_year: this.props.session,
        student: this.props.erpCode,
        date_of_payment: this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : null,
        total_amount: this.props.couponDiscount.length ? this.state.total + this.state.shippingAmount : this.state.total + this.state.shippingAmount,
        payment_mode: 7,
        receipt_type: this.state.isOnlineReceipt ? 2 : 1,
        receipt_number: this.state.payment.receiptNo ? this.state.payment.receiptNo : null,
        current_date: this.state.todayDate ? this.state.todayDate : null,
        ...this.props.couponDiscount.length ? coup : null,
        uniform: {
          uniform_id: uniformId,
          items: uniformItems.length > 0 ? uniformItems : null
        },
        stationary: {
          stationary_id: stationaryId,
          items: stationaryItems.length > 0 ? stationaryItems : null
        },
        ...this.props.isDelivery === 'home' ? del : null,
        ...this.props.kitIdToBePaid ? kitId : null,
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      }
      this.sendingToServer(posData)
    }
  }

  sendingToServer = (paymentObj) => {
    console.log('payment obj::::', paymentObj)
    this.props.storePayment(paymentObj, this.props.alert, this.props.user)
  }

  handleNext = () => {
    if (this.state.activeStep < 1) {
      const ids = Object.keys(this.state.isChecked).filter(key => this.state.isChecked[key])
      const uniformItems = this.props.storeItems.filter(item => item.is_uniform_item).map(item => item.id)
      let error = false
      uniformItems.forEach(item => {
        if (ids.includes(`${item}`) && !this.state.size[item]) {
          error = true
        }
      })
      if (this.props.isDelivery === 'home' && this.state.shippingAmount <= 0) {
        return this.props.alert.warning('Shipping amount not assigned, Contact branch!')
      }
      if (error) {
        // commenting size check 21 jan
        // this.props.alert.warning('Please Fill Size for Uniform Items')
        // return
      }
      if (!this.props.isStudent) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: true
          }
        })
      } else {
        this.paymentThroughGateway()
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
          // isChecked: {},
          // feeDetailsList: [],
          // selectedTotal: 0,
          // fullAmount: 0,
          // final: {},
          // payment: {},
          // disableNext: false,
          // partialAmount: ''
        }
      }, () => {
        // this.props.history.replace('/finance/accountant/store')
        this.getBackPlease()
      })
    }
  }

  handleBack = () => {
    // if(this.state.active === 0) {

    // }
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
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  }

  getBackPlease = () => {
    this.props.getBack(false)
  }

  // checkWalletAction = () => {

  // }

  render () {
    const { classes } = this.props
    const steps = getSteps()
    const { activeStep } = this.state
    const someKey = true
    console.log(this.props.deviceId)
    // console.log('the session from confug items', this.props.session)
    return (
      <React.Fragment>
        <Button style={{ width: '40px' }} color='primary' className={classes.btn} onClick={this.props.shippingComponent ? this.props.getBack : this.getBackPlease}>
          <ArrowBack /> Back
        </Button>
        {someKey
          ? <div className={classes.root}>
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
                  <div>
                    {activeStep === 0
                      ? ''
                      : <Button
                        disabled={activeStep === 0 || activeStep > 1 || this.props.shippingComponent}
                        onClick={this.handleBack}
                        className={classes.backButton}
                      >
                            Back
                      </Button>}
                    <Button variant='contained' color='primary' onClick={this.handleNext}
                      disabled={this.state.disableNext || (this.props.isStudent && !this.state.agreeTerms)}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          : null}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  storeItems: state.inventory.branchAcc.storeAtAcc.itemsList,
  itemsQuantity: state.inventory.branchAcc.storeAtAcc.kitItemQuantity,
  receiptRange: state.inventory.branchAcc.storeAtAcc.receiptNumbers,
  hasSubjectChoosen: state.inventory.branchAcc.storeAtAcc.hasSubjectChoosen,
  storeList: state.inventory.branchAcc.storeAtAcc.storeList,
  dataLoading: state.finance.common.dataLoader,
  status: state.inventory.branchAcc.storeAtAcc.status,
  trnsId: state.inventory.branchAcc.storeAtAcc.transactionId,
  ifsc: state.finance.common.ifscDetails,
  micr: state.finance.common.micrDetails,
  // deviceId: state.finance.common.deviceId,
  deliveryAmount: state.inventory.branchAcc.storeAtAcc.deliveryAmount,
  couponDiscount: state.inventory.branchAcc.storeAtAcc.couponDiscount,
  walletInfo: state.inventory.branchAcc.storeAtAcc.walletInfo,
  subCategoryStore: state.inventory.branchAcc.storeAtAcc.subCategoryStore
  // receiptData: state.inventory.branchAcc.storeAtAcc.receiptData
})

const mapDispatchToProps = dispatch => ({
  storePayment: (data, alert, user) => dispatch(actionTypes.storePayment({ data, alert, user })),
  storeReceiptNumbers: (session, erp, alert, user) => dispatch(actionTypes.storeReceiptNumbers({ session, erp, alert, user })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user })),
  fetchDeliveryAmount: (erp, alert, user) => dispatch(actionTypes.fetchDeliveryAmount({ erp, alert, user })),
  fetchCouponDiscount: (erp, session, kit, alert, user) => dispatch(actionTypes.fetchCouponDiscount({ erp, session, kit, alert, user })),
  fetchSubCategoryStore: (session, erp, alert, user) => dispatch(actionTypes.fetchSubCategoryStore({ session, erp, alert, user })),
  fetchWalletInfo: (session, erp, alert, user) => dispatch(actionTypes.fetchWalletInfo({ session, erp, alert, user }))
  // fetchDeviceId: (session, alert, user) => dispatch(actionTypes.fetchDeviceId({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ConfigItems)))
