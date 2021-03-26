import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
import { withStyles, Radio, StepLabel, CircularProgress, TablePagination, Step, Tab, Tabs, AppBar, Stepper, Button, Typography, Grid, Table, TableCell, TableRow, TableHead, TableBody, Paper, TextField, Checkbox } from '@material-ui/core/'
import Select from 'react-select'
import axios from 'axios'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import { urls } from '/home/om/lets_eduvate/oms/src/urls.js'
// import feeReceipts from '/home/om/lets_eduvate/oms/src/components/Finance/Receipts/feeReceipts.js'
import { urls } from '../../../../urls'
import feeReceipts from '../../Receipts/feeReceipts'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest'
// import { debounce } from '../../../../utils'
import Student from '../../Profiles/studentProfile'
import Layout from '../../../../../../Layout'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = (theme) => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    margin: '10px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
  // root: {
  //   backgroundColor: theme.palette.background.paper,
  //   width: '100%',
  //   marginTop: '72px',
  //   marginLeft: '40px',
  //   paddingTop: '20px',
  //   minHeight: '75vh'
  // }
})

function getSteps () {
  return ['1. Fee Details', '2. Reciept Details', '3. Payment mode', '4. Print Receipt']
}

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'student' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Fee Collection') {
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
class FeeShowList extends Component {
  state = {
      page: 0,
      rowsPerPage: 10,
    branchDatas: [],
    prevAmt: null,
    totalAmounts: null,
    miscFee: true,
    showData: false,
    erp: '',
    value: '',
    student: '',
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
    },
    sessions: {
      label: '2020-21',
      value: '2020-21'
    },
    sessionData: null,
    getDatas: false,
    showTabs: false,
    erpNo: null,
    gradeId: 'all',
    gradeData: {
      label: 'All Grades',
      id: 'all'
    },
    sectionId: null,
    sectionData: null,
    studentTypeData: {
      label: 'Active',
      value: 1
    },
    // studentTypeId: null,
    searchTypeData: {
      label: 'Student Name',
      value: 2
    },
    searchTypeId: 2,
    students: '',
    selectedErpStatus: false,
    studentName: '',
    selectedNameStatus: false,
    studentErp: '',
    allSections: true
  }

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
        if (event.target.value <= new Date().toISOString().substr(0, 10)) {
          newreceiptInfo['dateofPayment'] = event.target.value
        } else {
          this.props.alert.warning('Date of payment can be todays date or less than todays date')
          newreceiptInfo['dateofPayment'] = ''
        }
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

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  };

  erpHandler = (e) => {
    this.setState({
      erp: e.target.value
    })
  }

  getHandler = (e) => {
    if (this.state.erp && this.state.erp.length >= 10) {
      this.setState({
        showData: true
      })
      this.props.fetchStudentErpDet(this.state.erp, this.state.session, this.props.user, this.props.alert)
    } else {
      this.props.alert.warning('Enter 10 Digit Valid Erp!')
    }
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
              {this.props.trnsId ? <b style={{ fontSize: '20px' }}>Transaction Id is {this.props.trnsId}</b> : null}
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
      session: this.props.location.state.session,
      branchId: this.props.location.state.branch
    }, () => {
      this.props.fetchFeeCollection(this.state.session, this.props.user, this.props.alert, this.state.branchId)
      // this.props.fetchGrades(this.state.session, this.props.alert, this.props.user)
      this.props.fetchGrades(this.props.alert, this.props.user, moduleId, this.state.branchId)
    })
    if (this.state.sessions) {
      // this.props.fetchGrades(this.state.sessions.value, this.props.alert, this.props.user)
    }
    // this.props.fetchBranchData(this.props.alert, this.props.user)
    // this.props.fetchReceiptRange(this.state.session, this.props.branchData && this.props.branchData.branch_name, this.props.alert, this.props.user)
  }
  componentDidUpdate () {
    console.log('====> newState: ', this.state.receiptDetails)
  }
  checkBoxHandler = (e, id, misc, amo) => {
    let { checkBox } = this.state
    let { amountToEnter } = this.state
    this.setState({ amountToEnter: { ...amountToEnter, [id]: amo } })
    if (e.target.checked) {
      this.setState(
        { checkBox: { ...checkBox, [id]: true },
          miscFee: misc,
          prevAmt: amo
        })
      // this.setState({ amount: { ...amount, [id]: !this.state.disabled } })
    } else {
      this.setState({ checkBox: { ...checkBox, [id]: false },
        amountToEnter: { ...amountToEnter, [id]: false },
        miscFee: misc,
        prevAmt: amo
      })
      // this.setState({ amountToEnter: { ...amountToEnter, [id]: null } })
    }
    // console.log(checkBox)
    // if (checkBox) {

    // }
  }

  amountHandler = (id, amt) => e => {
    // let amountIds = []
    console.log('the value', e.target.value)
    let validAmount = true
    let { amountToEnter } = this.state
    let { disableNext } = this.state
    console.log(disableNext)
    const rowData = this.props.feeList.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.amount < e.target.value)) {
        this.props.alert.warning('Amount canot be greater than given amount!')
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
        if (this.state.payment.cheque.ifsc) {
          if (!this.state.payment.cheque.chequeBankBranch || !this.state.payment.cheque.chequeBankName || !this.state.payment.cheque.ifsc || !this.state.payment.cheque.chequeNo || !this.state.payment.cheque.chequeDate || !this.state.searchByData) {
            this.props.alert.warning('Please Fill all the fields')
            this.setState({ confirm: false })
            return
          }
        } else if (!this.state.payment.cheque.chequeBankBranch || !this.state.payment.cheque.chequeBankName || !this.state.payment.cheque.micr || !this.state.payment.cheque.chequeNo || !this.state.payment.cheque.chequeDate || !this.state.searchByData) {
          this.props.alert.warning('Please Fill all the fields')
          this.setState({ confirm: false })
          return
        }
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
    if (nextProps.micr && this.state.searchByValue === 2) {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      newCheque['micr'] = nextProps.micr.data[0].MICR ? nextProps.micr.data[0].MICR : null
      newCheque['chequeBankName'] = nextProps.micr.data[0].Bank ? nextProps.micr.data[0].Bank : null
      newCheque['chequeBankBranch'] = nextProps.micr.data[0].Branch ? nextProps.micr.data[0].Branch : null
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
      })
    } else if (nextProps.ifsc && this.state.searchByValue === 1) {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      newCheque['ifsc'] = nextProps.ifsc.ifsc ? nextProps.ifsc.ifsc : null
      newCheque['chequeBankName'] = nextProps.ifsc.bank ? nextProps.ifsc.bank : null
      newCheque['chequeBankBranch'] = nextProps.ifsc.branch ? nextProps.ifsc.branch : null
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
      })
    }
    // console.log('ifsc', nextProps.micr.data)
    // if (nextProps.micr && nextProps.micr.data && this.state.searchByValue === 2) {
    //   const newPayment = { ...this.state.payment }
    //   const newCheque = { ...newPayment.cheque }
    //   newCheque['ifsc'] = nextProps.micr.data[0].IFSC ? nextProps.micr.data[0].IFSC : null
    //   newCheque['chequeBankName'] = nextProps.micr.data[0].Bank ? nextProps.micr.data[0].Bank : null
    //   newCheque['chequeBankBranch'] = nextProps.micr.data[0].Branch ? nextProps.micr.data[0].Branch : null
    //   newPayment.cheque = newCheque
    //   this.setState({
    //     payment: newPayment
    //   })
    // } else if (nextProps.ifsc && this.state.searchByValue === 1) {
    //   const newPayment = { ...this.state.payment }
    //   const newCheque = { ...newPayment.cheque }
    //   newCheque['micr'] = nextProps.ifsc.micr ? nextProps.ifsc.micr : null
    //   newCheque['chequeBankName'] = nextProps.ifsc.bank ? nextProps.ifsc.bank : null
    //   newCheque['chequeBankBranch'] = nextProps.ifsc.branch ? nextProps.ifsc.branch : null
    //   newPayment.cheque = newCheque
    //   this.setState({
    //     payment: newPayment
    //   })
    // }
    // if (this.props.gradeData && this.props.gradeData.length > 0) {
    //   let a = []
    //   a = this.props.gradeData
    //   this.setState({
    //     gradeDatas: a && a.shift()
    //   })
    //   console.log(this.state.gradeDatas)
    // }
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
      if (this.state.amountToEnter || this.state.prevAmt) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: false
          }
        })
      } else {
        this.props.alert.warning('Enter Amount')
        // let a = []
        // a = this.props.gradeData
        // this.setState({
        //   gradeDatas: a.shift()
        // })
        // console.log(this.state.gradeDatas)
      }
    } else if (this.state.activeStep === 1) {
      if (this.state.receiptDetails.receiptInfo.dateofPayment) {
        const { studentName, parentName, parentMobile } = this.state.receiptDetails.outsiderInfo
        const { generalDescription } = this.state.receiptDetails
        if (this.state.value === 'two') {
          if ((studentName && parentName && parentMobile) || generalDescription) {
            if ((parentMobile && parentMobile.length === 10) || generalDescription) {
              this.setState(prevState => {
                return {
                  activeStep: prevState.activeStep + 1,
                  disableNext: true
                }
              })
              this.sendOutsiderInfo()
            } else {
              this.props.alert.warning('Please Enter 10 Digit Number!')
            }
          } else {
            this.props.alert.warning('fill all details')
          }
        } else {
          if (this.state.sessions && this.state.gradeData && this.state.studentTypeData && this.state.searchTypeData && (this.state.students || this.state.studentName)) {
            this.setState(prevState => {
              return {
                activeStep: prevState.activeStep + 1,
                disableNext: true
              }
            })
            this.sendOutsiderInfo()
          } else {
            this.props.alert.warning('Fill all the required Fields and click on Get!')
          }
        }
      } else {
        this.props.alert.warning('Select Date of Payment to continue!')
      }
    } else if (this.state.activeStep === 2) {
      if (this.state.selectedPayment === 'b') {
        if (this.state.payment.cheque.chequeNo && this.state.payment.cheque.chequeNo.length === 6) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
              // disableNext: true
            }
          })
          this.makeFinalPayment()
        } else {
          this.props.alert.warning('Enter only 6 digit in Cheque Number!')
        }
      } else if (this.state.selectedPayment === 'd') {
        if (this.state.payment.credit.digits && this.state.payment.credit.digits.length === 4) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
              // disableNext: true
            }
          })
          this.makeFinalPayment()
        } else {
          this.props.alert.warning('Enter only 4 Digits in card last digit!')
        }
      } else {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1
            // disableNext: true
          }
        })
        this.makeFinalPayment()
      }
    } else if (this.state.activeStep > 2) {
      this.setState(prevState => {
        window.location.replace('/finance/student/FeeCollection')
        return {
          totalAmounts: null,
          gradeData: {
            label: 'All Grades',
            id: 'all'
          },
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: false,
          receiptData: [],
          amountToEnter: '',
          selectedPayment: 'a',
          searchByData: null,
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
          },
          // disableNext: true
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
          // activeStep: 0,
          sectionId: null,
          sectionData: null,
          studentTypeData: {
            label: 'Active',
            value: 1
          },
          // studentTypeId: null,
          searchTypeData: {
            label: 'Student Name',
            value: 2
          },
          searchTypeId: 2,
          students: '',
          selectedErpStatus: false,
          studentName: '',
          selectedNameStatus: false,
          studentErp: '',
          allSections: true,
          checkBox: {},
          confirm: false
        }
      })
      // this.makeFinalPayment()
    }
  }

    sendOutsiderInfo = () => {
      console.log('sendOutsiderInfo')
      // let amountIds = null
      // amountIds = Object.keys(this.state.amountToEnter)

    // const { receiptDetails } = this.state
    // let data = {
    //   session_year: this.state.session ? this.state.session : null,
    //   student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
    //   parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
    //   parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
    //   grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
    //   school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
    //   address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
    //   description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : '',
    //   other_fee: amountIds,
    //   student_type: 2
    // }
    // this.props.saveOutsiders(data, this.props.user, this.props.alert)
    }

    makeFinalPayment = () => {
      let amountIds = []
      let amounts = []
      amountIds = Object.keys(this.state.amountToEnter)
      amounts = Object.values(this.state.amountToEnter)
      var a = null
      var b = null
      for (let key in amountIds) {
        a = amountIds[key]
        console.log('a++', amountIds[key])
      }
      for (let key in amounts) {
        b = amounts[key]
        console.log('b++', b, a)
      }
      let c = []
      for (let key in amountIds) {
        if (amounts[key]) {
          c.push({ id: amountIds[key], amount: amounts[key] })
        }
      }
      console.log('c++', c)
      // let c = amountIds.toString()
      const { receiptDetails } = this.state
      // let data = {
      //   session_year: this.state.session ? this.state.session : null,
      //   student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
      //   parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
      //   parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
      //   grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
      //   school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
      //   address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
      //   description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : '',
      //   other_fee: amountIds,
      //   student_type: 2
      // }
      const { payment } = this.state
      if (this.state.selectedPayment === 'a') {
      // if (this.state.miscFee === true || this.state.miscFee === null) {
        if (this.state.value === 'two') {
          let cashData = {
            student: {
              student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
              parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
              parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
              grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
              school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
            },
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          this.sendingToServer(cashData)
          // } else {
          //   let cashData = {
          //     student: {
          //       student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
          //       parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
          //       parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
          //       grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
          //       school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
          //       address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
          //       description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
          //     },
          //     other_fee: [
          //       {
          //         id: amountIds,
          //         amount: amounts
          //       }
          //     ],
          //     misc_fee: [],
          //     session_year: this.state.session ? this.state.session : null,
          //     // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
          //     // student: this.props.studentId ? this.props.studentId : null,
          //     date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
          //     total_amount: 200,
          //     payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
          //     receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
          //     receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
          //     current_date: new Date().toISOString().substr(0, 10)
          //   }
          //   this.sendingToServer(cashData)
          // }
        } else {
          let cashData = {
            student: this.state.studentErp ? this.state.studentErp : this.state.students,
            grade: this.state.gradeId,
            section: this.state.sectionId,
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          this.sendingToServer(cashData)
        // } else {
        //   let cashData = {
        //     student: {
        //       student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
        //       parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
        //       parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
        //       grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
        //       school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
        //       address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
        //       description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
        //     },
        //     other_fee: [
        //       {
        //         id: amountIds,
        //         amount: amounts
        //       }
        //     ],
        //     misc_fee: [],
        //     session_year: this.state.session ? this.state.session : null,
        //     // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        //     // student: this.props.studentId ? this.props.studentId : null,
        //     date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        //     total_amount: 200,
        //     payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        //     receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
        //     receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
        //     current_date: new Date().toISOString().substr(0, 10)
        //   }
        //   this.sendingToServer(cashData)
        // }
        }
      } else if (this.state.selectedPayment === 'b') {
        if (this.state.value === 'two') {
          let chequeData = {
            student: {
              student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
              parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
              parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
              grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
              school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
            },
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
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
        } else {
          let chequeData = {
            student: this.state.studentErp ? this.state.studentErp : this.state.students,
            grade: this.state.gradeId,
            section: this.state.sectionId,
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
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
        }
      } else if (this.state.selectedPayment === 'c') {
        if (this.state.value === 'two') {
          let internetData = {
            student: {
              student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
              parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
              parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
              grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
              school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
            },
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
            transaction_id: payment.transid ? payment.transid : null,
            internet_date: payment.internet.internetDate ? payment.internet.internetDate : null,
            remarks: payment.internet.remarks ? payment.internet.remarks : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          this.sendingToServer(internetData)
        } else {
          let internetData = {
            student: this.state.studentErp ? this.state.studentErp : this.state.students,
            grade: this.state.gradeId,
            section: this.state.sectionId,
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number_online: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
            transaction_id: payment.transid ? payment.transid : null,
            internet_date: payment.internet.internetDate ? payment.internet.internetDate : null,
            remarks: payment.internet.remarks ? payment.internet.remarks : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          this.sendingToServer(internetData)
        }
      } else if (this.state.selectedPayment === 'd') {
        if (this.state.value === 'two') {
          let creditData = {
            student: {
              student_name: receiptDetails.outsiderInfo.studentName ? receiptDetails.outsiderInfo.studentName : '',
              parent_name: receiptDetails.outsiderInfo.parentName ? receiptDetails.outsiderInfo.parentName : '',
              parent_mobile: receiptDetails.outsiderInfo.parentMobile ? receiptDetails.outsiderInfo.parentMobile : '',
              grade: receiptDetails.outsiderInfo.class ? receiptDetails.outsiderInfo.class : '',
              school_name: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              address: receiptDetails.outsiderInfo.schoolName ? receiptDetails.outsiderInfo.schoolName : '',
              description: receiptDetails.outsiderInfo.outsiderDescription ? receiptDetails.outsiderInfo.outsiderDescription : ''
            },
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
            payment_mode: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
            receipt_type: this.state.receiptDetails.radioChecked === 'online' ? 1 : 2,
            receipt_number: this.state.receiptDetails.receiptNoOnline ? this.state.receiptDetails.receiptNoOnline : null,
            remarks: payment.credit.creditRemarks ? payment.credit.creditRemarks : null,
            approval_code: payment.credit.approval ? payment.credit.approval : null,
            card_type: payment.credit.credit ? payment.credit.credit : null,
            card_last_digits: payment.credit.digits ? payment.credit.digits : null,
            bank_name: payment.credit.bankName ? payment.credit.bankName : null,
            credit_date: payment.credit.creditDate ? payment.credit.creditDate : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          this.sendingToServer(creditData)
        } else {
          let creditData = {
            student: this.state.studentErp ? this.state.studentErp : this.state.students,
            grade: this.state.gradeId,
            section: this.state.sectionId,
            other_fee: [],
            misc_fee: c,
            session_year: this.state.session ? this.state.session : null,
            // application_type: this.state.appTypeData ? this.state.appTypeData.value : null,
            // student: this.props.studentId ? this.props.studentId : null,
            date_of_payment: this.state.receiptDetails.receiptInfo && this.state.receiptDetails.receiptInfo.dateofPayment,
            total_amount: this.state.totalAmounts,
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
    }

  sendingToServer = (paymentObj) => {
    console.log('tab', this.state.value)
    if (this.state.value === 'one') {
      this.props.orchidsStudentPay(paymentObj, this.props.user, this.props.alert)
    } else {
      this.props.paymentAction(paymentObj, this.props.user, this.props.alert)
    }
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

  gradeHandlers = (e) => {
    const newReceiptDetails = { ...this.state.receiptDetails }
    const newOutsiderInfo = { ...newReceiptDetails.outsiderInfo }
    newOutsiderInfo['class'] = e.value
    newReceiptDetails.outsiderInfo = newOutsiderInfo
    this.setState({
      receiptDetails: newReceiptDetails
    })
  }

  getPdfData = (transactionId) => {
    if (this.state.value === 'two') {
      return (axios.get(`${urls.FetchPdfData}?transaction_id=${transactionId}&academic_year=${this.state.session}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }))
    } else {
      return (axios.get(`${urls.FetchNonOrchids}?transaction_id=${transactionId}&academic_year=${this.state.session}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }))
    }
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
  // NEW
  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  handleAcademicyear = (e) => {
    console.log('current session: ', e)
    this.setState({
      sessions: e,
      getData: false,
      s: null,
      showTabs: false
    }, () => {
      this.props.fetchGrades(this.state.sessions.value, this.props.alert, this.props.user)
    })
  }

  gradeHandler = (e) => {
    this.setState({ gradeId: e.value, gradeData: e, sectionData: [] }, () => {
      if (this.state.gradeId === 'all') {
        this.setState({
          allSections: true,
          sectionId: 'all',
          getData: false
        })
      } else {
        this.props.fetchAllSections(this.state.sessions.value, this.state.gradeId, this.props.alert, this.props.user, moduleId)
        this.setState({
          allSections: false,
          getData: false
        })
      }
    })
  }

  sectionHandler = (e) => {
    let sectionIds = []
    e.forEach(section => {
      sectionIds.push(section.value)
    })
    this.setState({ sectionId: sectionIds, sectionData: e, getData: false })
  }

  allSectionHandler = (e) => {
    this.setState({ sectionId: e.target.value, sectionData: e, getData: false })
  }

  activeHandler = (e) => {
    this.setState({
      // studentTypeId: e.value,
      studentTypeData: e,
      getData: false
    })
  }

  searchTypeHandler = (e) => {
    this.setState({
      searchTypeData: e,
      searchTypeId: e.value,
      getData: false,
      showTabs: false,
      studentName: ''
    }, () => {
      this.props.clearAllProps()
    })
  }

  erpHandler = () => {
    // const erp = document.querySelectorAll('[name=searchBox]')
    if (this.state.searchTypeData.value === 1 && this.state.selectedErpStatus) {
      this.props.fetchAllPayment(this.state.sessions.value, this.state.studentLabel, this.props.user, this.props.alert)
    } else if (this.state.searchTypeData.value === 2 && this.state.selectedNameStatus) {
      this.props.fetchAllPayment(this.state.sessions.value, this.state.studentErp, this.props.user, this.props.alert)
    } else {
      this.props.alert.warning('Select Valid Erp')
    }
    // makePayState = this.state
  }

  myErpFunc = () => {
    this.props.studentErpSearch(
      'erp',
      this.state.sessions.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.students,
      this.props.alert,
      this.props.user
    )
  }

  studentErpChangeHandler = (e, selected) => {
    this.setState({ students: e.target.value, studentLabel: e.target.label, selectedErpStatus: selected, showTabs: false, getData: false }, () => {
      if (this.state.students.length >= 3) {
        this.myErpFunc()
      }
    })
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: false,
        getData: false
      })
    }
  }

  myStudentFun = () => {
    const { searchTypeId } = this.state
    this.props.studentErpSearch(
      searchTypeId === 2 ? 'student' : searchTypeId === 3 ? 'fatherName' : searchTypeId === 4 ? 'fatherNo' : searchTypeId === 5 ? 'motherName' : searchTypeId === 6 ? 'motherNo' : 'na',
      this.state.sessions.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.studentName,
      this.props.alert,
      this.props.user
    )
  }

  studentNameChangeHandler = (e, selected) => {
    this.setState({ studentName: e.target.value, selectedNameStatus: selected, showTabs: false, getData: false }, () => {
      const student = this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.filter(item => item.name === this.state.studentName)[0] : ''
      this.setState({
        studentErp: student && student.erp ? student.erp : null
      })
      if (this.state.studentName.length >= 3) {
        this.myStudentFun()
      }
    })
  }

  // erpChangeHander = (e) => {
  //   this.setState({
  //     erpNo: e.target.value,
  //     getData: false
  //   })
  // }

  showLedgerHandler = () => {
    if (!this.state.sessions && !this.state.studentErp) {
      this.props.alert.warning('Please Fill All The Fields')
      return
    }
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: true,
        getData: true
      })
    } else {
      this.props.alert.warning('Select Valid Student')
    }
  }
  callbackFunction = (childData) => {
    this.setState({
      sessions: {
        label: childData,
        value: childData
      }
      // getData: false,
      // showTabs: false
    }, () => {
      console.log('realsession', this.state.session)
    })
    console.log('Childdata', childData)
  }
  renderTable = () => {
    console.log('-------rendertable called')
    let dataToShow = []
    dataToShow = this.props.feeList.map((val, i) => {
      return {
        id: val.id,
        check: <input
          type='checkbox'
          name='checking'
          // value={i + 1}
          checked={this.state.checkBox[val.id]}
          onChange={
            (e) => { this.checkBoxHandler(e, val.id, val.is_misc, val.amount) }
          } />,
        feeCollectionType: val.fee_type_name ? val.fee_type_name : '',
        // subType: val.sub_type ? val.sub_type : '',
        amountGiven: val.amount && val.amount ? val.amount : '',
        amount: <input
          name='amount'
          type='number'
          // value={i + 1}
          disabled={val.allow_partial_payments === false}
          value={this.state.amountToEnter[val.id] || val.amount}
          readOnly={!this.state.checkBox[val.id]}
          onChange={this.amountHandler(val.id, val.amount)}
        />,
        feeAccount: val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : ''
      }
    })
    return dataToShow
  }

  // renderReceiptTable = () => {

  // }

  feeListTableHandler = () => {
    // let feeListTable = null
    // console.log('print:', this.props.feeList)
    // if (this.props.feeList && this.props.feeList.length > 0) {
    //   feeListTable = (<ReactTable
    //     // pages={Math.ceil(this.props.viewBanksList.count / 20)}
    //     data={this.renderTable()}
    //     manual
    //     columns={[
    //       {
    //         Header: 'select',
    //         accessor: 'check',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Fee Collection Type',
    //         accessor: 'feeCollectionType',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       // {
    //       //   Header: 'Sub Type',
    //       //   accessor: 'subType',
    //       //   inputFilterable: true,
    //       //   exactFilterable: true,
    //       //   sortable: true
    //       // },
    //       {
    //         Header: 'Amount Given',
    //         accessor: 'amountGiven',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Amount',
    //         accessor: 'amount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Fee Account',
    //         accessor: 'feeAccount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={10}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     // page={this.state.page}
    //     // Callbacks
    //     // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }
    // return feeListTable

    let feeListTable = null
    console.log('print:', this.props.feeList)
    if (this.props.feeList && this.props.feeList.length > 0) {
      feeListTable = (
        <React.Fragment>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell> select</TableCell>
            <TableCell> Fee Collection Type</TableCell>
            {/* <TableCell> Sub Type</TableCell> */}
            <TableCell> Amount Given</TableCell>
            <TableCell> Amount</TableCell>
            <TableCell> Fee Account</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.props.feeList && this.props.feeList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
          return (
        <TableRow>
           <TableCell> <input
          type='checkbox'
          name='checking'
          // value={i + 1}
          checked={this.state.checkBox[val.id]}
          onChange={
            (e) => { this.checkBoxHandler(e, val.id, val.is_misc, val.amount) }
          } /></TableCell>
            {/* <TableCell>{ val.id} </TableCell> */}
            <TableCell>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
            <TableCell>{val.amount && val.amount ? val.amount : ''}</TableCell>
            <TableCell>{ <input
          name='amount'
          type='number'
          // value={i + 1}
          disabled={val.allow_partial_payments === false}
          value={this.state.amountToEnter[val.id] || val.amount}
          readOnly={!this.state.checkBox[val.id]}
          onChange={this.amountHandler(val.id, val.amount)}
        />} </TableCell>
            <TableCell>{val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : ''} </TableCell>
        </TableRow>
          )
        })}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={this.props.feeList && this.props.feeList.length}
      rowsPerPage={this.state.rowsPerPage}
      page={this.state.page}
      onChangePage={this.handleChangePage}
      onChangeRowsPerPage={this.handleChangeRowsPerPage}
    />
    </React.Fragment>

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
    const handleChange = (event, value) => {
      this.setState({
        value: value,
        totalAmounts: totalAmount
      })
      if (this.state.receiptDetails && this.state.receiptDetails.radioChecked === 'manual' && (this.state.receiptDetails.receiptNoOnline < (this.props.receiptRange.manual[0] && this.props.receiptRange.manual[0].range_from) || this.state.receiptDetails.receiptNoOnline > (this.props.receiptRange.manual[0] && this.props.receiptRange.manual[0].range_to))) {
        this.props.alert.warning('Enter Receipt no between given Range!')
      }
      if (!this.state.receiptDetails.receiptInfo.dateofPayment) {
        this.props.alert.warning('Select Date of Payment to continue!')
      }
    }
    let sectionRow = null
    if (this.state.allSections) {
      sectionRow = 'All Sections'
    } else {
      sectionRow = (
        <Select
          placeholder='Select Section'
          isMulti
          disabled={this.state.allSections}
          value={this.state.sectionData ? this.state.sectionData : ''}
          options={
            this.props.sectionData
              ? this.props.sectionData.map(sec => ({
                value: sec.section.id,
                label: sec.section.section_name
              }))
              : []
          }
          onChange={this.sectionHandler}
        />
      )
    }
    // auto suggestions dropdown
    const { searchTypeData, searchTypeId } = this.state
    let searchBox = null
    if (searchTypeData.value === 1) {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label='Search ERP'
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.students || ''}
            onChange={this.studentErpChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.map(item => ({ value: item.erp ? item.erp : '', label: item.erp ? item.erp : '' })) : []}
          />
        </div>
      )
    } else {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label={searchTypeId === 2 ? 'Search Student Name' : searchTypeId === 3 ? 'Search Father Name' : searchTypeId === 4 ? 'Search Father Number' : searchTypeId === 5 ? 'Search Mother Name' : searchTypeId === 6 ? 'Search Mother Number' : 'na'}
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.studentName || ''}
            onChange={this.studentNameChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.studentErp && this.props.studentErp.length > 0 ? this.props.studentErp.map(item => ({ value: item.name ? item.name : '', label: item.name ? item.name : '' })) : []}
          />
        </div>
      )
    }
    return (
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right'>Fee Type</TableCell>
                {/* <TableCell align='right'>Sub Type</TableCell> */}
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
                      <TableCell align='right'>{amountToEnter[val.id] && val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      {/* <TableCell align='right'>{val.sub_type ? val.sub_type : ''}</TableCell> */}
                      <TableCell align='right'>{amountToEnter[val.id] ? amountToEnter[val.id] : ''}</TableCell>
                      {/* <TableCell align='right'>{val.amount ? val.amount : ''}</TableCell> */}
                      <TableCell align='right'>{amountToEnter[val.id] && '0'}</TableCell>
                      <TableCell align='right'>{amountToEnter[val.id] && '0'}</TableCell>
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
                {this.props.receiptRange && this.props.receiptRange.manual.length > 0
                  ? <label style={{ color: 'red' }}>Range From: {this.props.receiptRange.manual[0].range_from} - Range To: {this.props.receiptRange.manual[0].range_to}</label>
                  : '' }
                <br />
                <TextField
                  className={this.props.classes.textField}
                  label='Receipt No'
                  type='number'
                  // margin='dense'
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
          <Grid container spacing={3}style={{ padding: 15 }}>
            <Grid item xs={3}>
              <p style={{ fontSize: '16px' }}>Total Amount: {totalAmount}</p>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.receiptDetails.boxChecked}
                    onChange={this.boxHandler}
                    // value="checkedB"
                    color='primary'
                  />
                }
                label='Is Student Related Payment'
              /> */}
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
            {/* </Grid> */}
          </Grid>
          <React.Fragment>
            <AppBar position='static' style={{ zIndex: 0 }}>
              <Tabs value={this.state.value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
                <Tab value='one' label='OLV Students' />
                <Tab value='two' label='Non OLV Students' />
              </Tabs>
            </AppBar>
          </React.Fragment>
          {this.state.value === 'one' && <TabContainer>
            {/* <Grid container spacing={3} style={{ margin: '20px', marginTop: '5px' }}>
              <Grid item xs={3}>
                <TextField
                  className={this.props.classes.textField}
                  label='Erp'
                  type='number'
                  name='Enter Erp'
                  margin='dense'
                  // fullWidth
                  onChange={this.erpHandler}
                  required
                  value={this.state.erp}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant='contained' onClick={this.getHandler}>GET</Button>
              </Grid>
            </Grid>
            {this.props.studentDet && this.state.showData
              ? <Grid container spacing={3} style={{ margin: '20px', marginTop: '5px' }}>
                <Grid item xs={3}>
              Student Name: {this.props.studentDet && this.props.studentDet.student_name}
                </Grid>
                <Grid item xs={3}>
              Grade: {this.props.studentDet && this.props.studentDet.grade}
                </Grid>
                <Grid item xs={3}>
              Section: {this.props.studentDet && this.props.studentDet.section}
                </Grid>
                <Grid item xs={3}>
              Active: {this.props.studentDet && this.props.studentDet.is_active ? 'yes' : 'No'}
                </Grid>
                <Grid item xs={3}>
              Father Name: {this.props.studentDet && this.props.studentDet.father_name}
                </Grid>
                <Grid item xs={3}>
              Father Mobile No: {this.props.studentDet && this.props.studentDet.father_mobile}
                </Grid>
              </Grid>
              : [] } */}

            <React.Fragment>
              <Grid container spacing={3} style={{ padding: 15 }}>
                <Grid item xs={3} className={this.props.classes.item} style={{ zIndex: '1103' }}>
                  <label>Academic Year*</label>
                  <Select
                    placeholder='Select Year'
                    value={this.state.sessions ? this.state.sessions : null}
                    options={
                      this.props.session
                        ? this.props.session.session_year.map(session => ({
                          value: session,
                          label: session
                        }))
                        : []
                    }
                    onChange={this.handleAcademicyear}
                  />
                </Grid>
                <Grid item xs={3} className={this.props.classes.item} style={{ zIndex: '1102' }}>
                  <label>Grade*</label>
                  <Select
                    placeholder='Select Grade'
                    value={this.state.gradeData ? this.state.gradeData : null}
                    options={
                      this.props.gradeData
                        ? this.props.gradeData && this.props.gradeData.map(grades => ({
                          value: grades.grade.id,
                          label: grades.grade.grade
                        }))
                        : []
                    }
                    onChange={this.gradeHandler}
                  />
                </Grid>
                <Grid item xs={3} className={this.props.classes.item} style={{ zIndex: '1101' }}>
                  <label>Section*</label>
                  {sectionRow}
                </Grid>
                <Grid item xs={3} className={this.props.classes.item} style={{ zIndex: '1100' }}>
                  <label>Active/Inactive*</label>
                  <Select
                    placeholder='Select State'
                    value={this.state.studentTypeData ? this.state.studentTypeData : ''}
                    options={[
                      {
                        label: 'Active',
                        value: 1
                      },
                      {
                        label: 'InActive',
                        value: 2
                      },
                      {
                        label: 'Both',
                        value: 3
                      }
                    ]}
                    onChange={this.activeHandler}
                  />
                </Grid>
                <Grid item xs={3} className={this.props.classes.item} style={{ zIndex: '1000' }}>
                  <label>Search Type*</label>
                  <Select
                    placeholder='Select Type'
                    value={this.state.searchTypeData ? this.state.searchTypeData : ''}
                    options={[
                      {
                        label: 'ERP',
                        value: 1
                      },
                      {
                        label: 'Student Name',
                        value: 2
                      },
                      {
                        label: 'Father Name',
                        value: 3
                      },
                      {
                        label: 'Father Number',
                        value: 4
                      },
                      {
                        label: 'Mother Name',
                        value: 5
                      },
                      {
                        label: 'Mother Number',
                        value: 6
                      }
                    ]}
                    onChange={this.searchTypeHandler}
                  />
                </Grid>
                <Grid item xs={3}>
                  {searchBox}
                </Grid>
                <Grid item xs={2} className={this.props.classes.item}>
                  <Button
                    style={{ marginLeft: '10px', marginTop: '20px' }}
                    variant='contained'
                    color='primary'
                    disabled={!this.state.session}
                    // onClick={this.erpHandler}
                    onClick={this.showLedgerHandler}>
              GET
                  </Button>
                </Grid>
              </Grid>
              {this.state.searchTypeData.value === 1
                ? <Student erp={this.state.studentLabel} session={this.state.sessions.value} user={this.props.user} alert={this.props.alert} />
                : <Student erp={this.state.studentErp} session={this.state.sessions.value} user={this.props.user} alert={this.props.alert} />}
              {/* {tabBar} */}
              {this.props.dataLoading ? <CircularProgress open /> : null}
            </React.Fragment>
          </TabContainer>
          }
          {this.state.value === 'two' && <TabContainer>
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
                <Grid item xs={3} >
                  <label>Grade*</label>
                  <div style={{ width: '200px', marginBottom: '30px' }}>
                    <Select
                      style={{ marginLeft: '8px', marginRight: '8px' }}
                      onChange={(e) => { this.gradeHandlers(e) }}
                      name='class'
                      // className='form-control'
                      options={
                        this.props.gradeDatas
                          ? this.props.gradeDatas && this.props.gradeDatas.map(grades => ({
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
          </TabContainer>}
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
              style={{ marginLeft: '20px' }}
                disabled={activeStep === 0 || activeStep > 1}
                onClick={this.handleBack}
                className={this.props.classes.backButton}
              >
                Back
              </Button>
              <Button variant='contained' color='primary' onClick={this.handleNext}
                disabled={this.state.disableNext}
              >
                {this.state.activeStep <= 2 ? 'NEXT' : 'FINISH'}
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
  receiptRange: state.finance.makePayAcc.receiptRange,
  dataLoading: state.finance.common.dataLoader,
  feeList: state.finance.accountantReducer.feeCollection.feeCollectionList,
  studentId: state.finance.accountantReducer.feeCollection.studentId,
  gradeData: state.finance.accountantReducer.pdc.gradeData,
  gradeDatas: state.finance.accountantReducer.pdc.gradeDatas,
  ifsc: state.finance.common.ifscDetails,
  ReceiptNo: state.finance.accountantReducer.feeCollection.ReceiptNo,
  status: state.finance.accountantReducer.feeCollection.status,
  trnsId: state.finance.accountantReducer.feeCollection.transactionId,
  studentDet: state.finance.accountantReducer.feeCollection.studentDet,
  micr: state.finance.common.micrDetails,
  // NEW
  session: state.academicSession.items,
  // ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  // gradeData: state.finance.accountantReducer.pdc.gradeData,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  studentErp: state.finance.accountantReducer.studentErpSearch.studentErpList,
  branchData: state.finance.accountantReducer.financeAccDashboard.branchData
})

const mapDispatchToProps = dispatch => ({
  fetchStudentErpDet: (erp, session, user, alert) => dispatch(actionTypes.fetchStudentErpDet({ erp, session, user, alert })),
  fetchFeeCollection: (session, user, alert, branch) => dispatch(actionTypes.fetchFeeCollectionList({ session, user, alert, branch })),
  saveOutsiders: (data, user, alert) => dispatch(actionTypes.saveOutsiders({ data, user, alert })),
  orchidsStudentPay: (data, user, alert) => dispatch(actionTypes.orchidsStudentPay({ data, user, alert })),
  // fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  fetchGrades: (alert, user, moduleId, branch) => dispatch(actionTypes.fetchGradeList({ alert, user, moduleId, branch })),
  paymentAction: (data, user, alert) => dispatch(actionTypes.paymentAction({ data, user, alert })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  // sendAllPayments: (data, user, alert) => dispatch(actionTypes.sendAllPayments({ data, user, alert }))
  // NEW
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  // fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  // fetchErpSuggestions: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.fetchErpSuggestions({ type, session, grade, section, status, erp, alert, user })),
  studentErpSearch: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.studentErpSearch({ type, session, grade, section, status, erp, alert, user })),
  clearAllProps: (alert, user) => dispatch(actionTypes.clearAllProps({ alert, user })),
  fetchAllSections: (session, gradeId, alert, user, moduleId) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user, moduleId })),
  fetchReceiptRange: (session, erp, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, erp, alert, user })),
  fetchBranchData: (alert, user, moduleId) => dispatch(actionTypes.fetchAccountantBranch({ alert, user, moduleId })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(FeeShowList)))
