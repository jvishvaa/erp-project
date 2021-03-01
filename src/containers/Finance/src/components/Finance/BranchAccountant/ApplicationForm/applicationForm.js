/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
import React, { Component } from 'react'
import { Button, withStyles,
  Radio, StepLabel, Step, Stepper, Typography,
  Table, TableBody, TableCell, TableRow, TableHead, TablePagination, Paper, Grid } from '@material-ui/core/'
// import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import ReactTable from 'react-table'
import axios from 'axios'
// import '../../../css/staff.css' // rajneesh
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import AutoSuggest from '../../../../ui/AutoSuggest/autoSuggest'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { debounce } from '../../../../utils' // rajneesh due to some import issue
import appRegReceiptsPdf from '../../Receipts/appRegReceipts'
import { urls } from '../../../../urls'
import Layout from '../../../../../../Layout'
// import classes from './pdc.module.css'
// import Student from '../../Profiles/studentProfile'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    borderRadius: '5px',
    backgroundColor: '#2196f3',
    padding: '2px !important',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0b7dda'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  cardBoard: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
})

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing * 3,
//     overflowX: 'auto'
//   },
//   table: {
//     minWidth: 650
//   }
// }))

function getSteps () {
  return ['Personal Details', 'Fee Details', 'Payment Details', 'Status']
}

const validate = (email) => {
  const expression = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  const result = expression.test(String(email).toLowerCase())
  console.log('EXpression result', email + ' ' + result)
  return result
}

class ApplicationFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
    page: 0,
    rowsPerPage: 10,
      session: '2020-21',
      sessionData: {
        label: '2020-21',
        value: '2020-21'
      },
      todayDate: new Date().toISOString().substr(0, 10),
      searchBy: 'a',
      searchKey: null,
      activeStep: 0,
      childId: null,
      showApp: false,
      showSiblingTable: false,
      formData: {
        parentInfo: {
          fatherName: null,
          fatherPhone: null,
          fatherEmail: null,
          motherName: null,
          motherPhone: null,
          motherEmail: null
        },
        studentInfo: {
          studentName: null,
          childId: null,
          stdNo: null,
          optingClass: null,
          studentDob: null,
          appDate: new Date().toISOString().substr(0, 10),
          admissionType: null,
          gender: null
        },
        address: {
          street: null,
          locality: null,
          remarks: null
        }
      },
      appTypeData: null,
      selectedPayment: 'a',
      selectedReceipt: 'online',
      // todayDate: '',
      isOnlineReceipt: false,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isTrans: false,
      confirm: false,
      disableNext: false,
      searchByCheque: {
        label: null,
        value: null
      },
      payment: {
        cheque: {
          chequeNo: null,
          chequeDate: null,
          ifsc: null,
          micr: null,
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
        dateOfPayment: new Date().toISOString().substr(0, 10)
      },
      searchTypeData: {
        label: 'Enquiry Code',
        value: 'enquiry_code'
      },
      searchedValue: '',
      searchedLabel: '',
      disableCreateApp: false
    }
    // preserve the initial state in a new object
    this.baseState = this.state
    this.baseFormState = this.state.formData
  }

  componentDidMount () {
    if (this.state.session) {
      this.props.fetchGrade(this.state.session, this.props.alert, this.props.user)
      this.props.fetchReceiptRange(this.state.session, this.props.alert, this.props.user)
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  }

  handleAcademicyear = (e) => {
    this.setState({ session: e.value, sessionData: e }, () => {
      this.props.fetchGrade(this.state.session, this.props.alert, this.props.user)
    })
  }

  searchByHandler = event => {
    this.setState({
      searchBy: event.target.value
    })
  }

  searchByChequeHandler = event => {
    this.setState({
      searchByCheque: event
    })
  }

  // for searching
  // myFunc = debounce(() => { this.props.fetchApplicationDetails(this.state.searchKey, this.props.user, this.props.alert) }, 1000)
  myFunc = () => { this.props.fetchApplicationDetails(this.state.searchKey, this.props.user, this.props.alert) }

  searchHandler = (event) => {
    // console.log('just console', event.target.value)
    this.setState({ searchKey: event.target.value }, () => {
      // enable this.myFunc to start searching.
      // this.myFunc()
      // this.props.fetchApplicationDetails(this.state.searchKey, this.props.user, this.props.alert)
    })
  }

  getDetails = () => {
    this.setState(prevState => ({
      ...prevState,
      formData: this.baseFormState
    }), () => {
      this.props.fetchApplicationDetails(this.state.session, this.state.searchedValue, this.props.user, this.props.alert)
    })
    // this.setState({ showSiblingTable: true })
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this.personalInfo()
      case 1:
        return this.feeDetails()
      case 2:
        return this.receiptFields()
      case 3:
        if (this.props.finalRecords) {
          return <React.Fragment>
            <center>
              <h2>Thank You For Recording Payment Details</h2> <br />
              {this.props.finalRecords ? <b style={{ fontSize: '20px', marginBottom: '10px' }}>App No is {this.props.finalRecords.application_number}</b> : null}<br />
              {this.props.finalRecords ? <b style={{ fontSize: '20px', marginBottom: '10px' }}>Receipt No is {this.props.finalRecords.receipt_number_online}</b> : null}<br />
              {this.props.finalRecords ? <b style={{ fontSize: '20px' }}>Transaction ID is {this.props.finalRecords.transaction_number}</b> : null}<br />
              <br />
              <Button variant='contained' onClick={() => { this.generatePdf(this.props.finalRecords.transaction_number) }}>Download PDF</Button>
            </center>
          </React.Fragment>
        }
        // else {
        //   return <React.Fragment> <center><h2>Processing...</h2></center></React.Fragment>
        // }
        break
      default:
        return 'Unknown stepIndex'
    }
  }

    // Generation of PDF Start
    getPdfData = (transactionId) => {
      return (axios.get(`${urls.AppRegPdf}?transaction_id=${transactionId}&academic_year=${this.state.session}`, {
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

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }), () => {
      // disabling and enabling next button
      // if (this.state.activeStep === 1) {
      //   this.setState({ disableNext: true })
      // } else {
      //   this.setState({ disableNext: false })
      // }
      // if( (this.state.activeStep > 1) {

      // })
    })
  }

  // emailValidationHandler = (email) => {
  //   let con = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  //   let reg = email.match(con)
  //   return reg
  // }

  isValidDate = (dateString) => {
    // console.log('inside ', dateString.match(regEx))
    // return dateString.match(regEx) != null
    console.log('date: ', dateString)
    var data = dateString && dateString.split('-')
    // using ISO 8601 Date String
    if (data) {
      if (data[0] < 1000 && data[0] > 3000) {
        return false
      }
      // if (isNaN(Date.parse(data[2] + '-' + data[1] + '-' + data[0]))) {
      //   return false
      // }
      return true
    }
  }

  handleNext = () => {
    console.log('active state: ', this.state.activeStep)
    if (this.state.activeStep < 1) {
      const { studentInfo, parentInfo } = this.state.formData
      if (parentInfo.fatherEmail && !validate(parentInfo.fatherEmail)) {
        this.props.alert.warning('Enter Valid father email')
        return false
      }
      if (parentInfo.motherEmail && !validate(parentInfo.motherEmail)) {
        this.props.alert.warning('Enter Valid mother email')
        return false
      }
      console.log('IsValid Date: ', this.isValidDate(studentInfo.studentDob))
      if (!this.isValidDate(studentInfo.studentDob)) {
        this.props.alert.warning('Enter Valid Date')
        return
      }
      if (studentInfo.studentName && studentInfo.studentDob && studentInfo.optingClass && studentInfo.optingClass.value && ((parentInfo.fatherName && parentInfo.fatherPhone && parentInfo.fatherPhone.length <= 10 && parentInfo.fatherPhone.length >= 8) || (parentInfo.motherName && parentInfo.motherPhone && parentInfo.motherPhone.length === 10))) {
        this.setState({ disableCreateApp: true })
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1
            // disableNext: true
          }
        })
        this.sendAppForm()
      } else {
        this.props.alert.warning('fill required fields')
      }
    } else if (this.state.activeStep === 1) {
      if (this.state.appTypeData) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1,
            disableNext: true
          }
        })
      } else {
        this.props.alert.warning('Select Admission Type')
      }
    } else if (this.state.activeStep === 2) {
      this.setState(prevState => {
        return {
          activeStep: prevState.activeStep + 1
        }
      })
      this.makeFinalPayment()
    } else if (this.state.activeStep > 2) {
      console.log('BASE STATE', this.baseState === this.state)
      this.setState(this.baseState)
      // this.setState(prevState => {
      //   return {
      //     // activeStep: 0
      //     // this.baseState
      //   }
      // })
    }
  }

  sendAppForm = () => {
    const { formData } = this.state
    let data = {
      student_name: formData.studentInfo.studentName ? formData.studentInfo.studentName : null,
      date_of_birth: formData.studentInfo.studentDob ? formData.studentInfo.studentDob : null,
      opting_class: formData.studentInfo.optingClass && formData.studentInfo.optingClass.value ? +formData.studentInfo.optingClass.value : null,
      gender: formData.studentInfo.gender === 'Male' ? 1 : 2,
      application_date: formData.studentInfo.appDate ? formData.studentInfo.appDate : null,
      phone: formData.studentInfo.stdNo ? formData.studentInfo.stdNo : null,
      application_type: formData.studentInfo.admissionType ? formData.studentInfo.admissionType.value : null,
      academic_year: this.state.session ? this.state.session : null,
      address: formData.address.street ? formData.address.street : null,
      nearest_locality: formData.address.locality ? formData.address.locality : null,
      father_name: formData.parentInfo.fatherName ? formData.parentInfo.fatherName : null,
      father_mobile_no: formData.parentInfo.fatherPhone ? formData.parentInfo.fatherPhone : null,
      father_email: formData.parentInfo.fatherEmail ? formData.parentInfo.fatherEmail : null,
      mother_name: formData.parentInfo.motherName ? formData.parentInfo.motherName : null,
      mother_mobile_no: formData.parentInfo.motherPhone ? formData.parentInfo.motherPhone : null,
      mother_email: formData.parentInfo.motherEmail ? formData.parentInfo.motherEmail : null,
      enquiry_code: this.props.appDetails.data[0] && this.props.appDetails.data[0].enquiry_no ? this.props.appDetails.data[0].enquiry_no : null,
      child_id: formData.studentInfo.childId ? formData.studentInfo.childId : null,
      lead_id: this.props.appDetails.data[0] && this.props.appDetails.data[0].id ? this.props.appDetails.data[0].id : null
    }
    this.props.saveAllFormData(data, this.props.user, this.props.alert)
  }

  showAppHandler = (id) => {
    const child = this.props.appDetails.data[0].child_detail_fk.filter((child, index) => {
      return child.id === id
    })
    const parentData = this.props.appDetails.data[0]
    this.setState({
      showApp: true,
      activeStep: 0,
      childId: id,
      formData: {
        ...this.state.formData,
        parentInfo: {
          ...this.state.parentInfo,
          fatherName: parentData.lead_name ? parentData.lead_name : null,
          fatherPhone: parentData.lead_contact_no ? parentData.lead_contact_no : null,
          fatherEmail: parentData.lead_email_id ? parentData.lead_email_id : null,
          motherName: parentData.mother_name ? parentData.mother_name : null,
          motherPhone: parentData.mother_contact_no ? parentData.mother_contact_no : null,
          motherEmail: parentData.mother_email_id ? parentData.mother_email_id : null
        },
        studentInfo: {
          ...this.state.studentInfo,
          studentName: child[0] && child[0].child_name ? child[0].child_name : null,
          childId: child[0] && child[0].id ? child[0].id : null,
          stdNo: null,
          optingClass: {
            value: child[0] && child[0].child_class && child[0].child_class.letseduvate_id ? child[0].child_class.letseduvate_id : null,
            label: child[0] && child[0].child_class && child[0].child_class.grade ? child[0].child_class.grade : null
          },
          studentDob: child[0] && child[0].Date_of_birth ? child[0].Date_of_birth : null,
          appDate: new Date().toISOString().substr(0, 10),
          admissionType: null,
          gender: child[0] && child[0].child_gender === 'Male' ? 'Male' : 'Female'
        },
        address: {
          ...this.state.address,
          street: null,
          locality: null,
          remarks: parentData.remark ? parentData.remark : null
        }
      }
    })
  }
  renderSiblingsTable = () => {
    let dataToShow = null
    let { classes, appDetails } = this.props
    dataToShow = appDetails.data && appDetails.data[0].child_detail_fk.length > 0 && appDetails.data[0].child_detail_fk.map((val, i) => {
      return {
        id: val.id,
        leadName: appDetails.data[0].lead_name ? appDetails.data[0].lead_name : 'No data',
        leadNumber: appDetails.data[0].lead_contact_no ? appDetails.data[0].lead_contact_no : 'No data',
        studentName: val.child_name ? val.child_name : 'No data',
        appNum: val.application_no ? val.application_no : 'No data',
        class: val.child_class && val.child_class.grade ? val.child_class.grade : 'No data',
        leadStatus: val.lead_status && val.lead_status.status_name ? val.lead_status.status_name : 'No Data',
        app: val.application_no ? 'Application Completed' : <Button variant='extended' color='primary' className={classes.button} disabled={!this.state.session} onClick={() => { this.showAppHandler(val.id) }}>Create Application</Button>
      }
    })
    let parentData = null
    parentData = appDetails.data && appDetails.data[0].child_detail_fk.length === 0 && appDetails.data.map((item) => {
      return {
        leadName: item.lead_name ? item.lead_name : 'No data',
        leadNumber: item.lead_contact_no ? item.lead_contact_no : 'No data',
        app: item.child_detail_fk.length === 0 ? <Button variant='extended' color='primary' className={classes.button} disabled={this.state.disableCreateApp} onClick={() => { this.showAppHandler() }}>Create Application</Button> : null
      }
    })
    return dataToShow || parentData
    // console.log('Data to show: ', [...dataToShow, ...parentData])
    // return [...dataToShow, ...parentData]
  }
  personalInfo = () => {
    // let info = this.props.appDetails.data[0]
    // console.log('App personalInfo func: ', info)
    const {
      formData
    } = this.state

    return (
      <div style={{ margin: '30px' }}>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label> Name*</label>
            <input
              name='studentName'
              type='text'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.studentInfo.studentName ? formData.studentInfo.studentName : ''}
              onChange={(e) => { this.dataHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Residential Phone No</label>
            <input
              name='numberStd'
              type='number'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.studentInfo.stdNo ? formData.studentInfo.stdNo : ''}
              onChange={(e) => { this.dataHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Opting Class*</label>
            <Select
              placeholder='Select Class'
              name='opting'
              // className='form-control'
              value={formData.studentInfo.optingClass ? formData.studentInfo.optingClass : null}
              options={
                this.props.gradeData
                  ? this.props.gradeData.map(grades => ({
                    value: grades.grade.id,
                    label: grades.grade.grade
                  }))
                  : []
              }
              onChange={(e) => { this.optHandler(e) }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Date Of Birth*</label>
            <input
              name='dob'
              type='date'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.studentInfo.studentDob ? formData.studentInfo.studentDob : ''}
              onChange={(e) => { this.dataHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Application Date*</label>
            <input
              name='appDate'
              type='date'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.studentInfo.appDate ? formData.studentInfo.appDate : ''}
              onChange={(e) => { this.dataHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Admission Type</label>
            <Select
              placeholder='Select Type'
              name='admissionType'
              // className='form-control'
              value={formData.studentInfo.admissionType ? formData.studentInfo.admissionType : null}
              options={[
                {
                  label: 'Day Scholar',
                  value: 1
                },
                {
                  label: 'Residential',
                  value: 2
                },
                {
                  label: 'Hostel',
                  value: 3
                }
              ]}
              onChange={(e) => { this.admissionHandler(e) }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='2'>
            <strong>Gender*:</strong>
          </Grid>
          <Grid item xs='3'>
            <Radio
              checked={formData.studentInfo.gender === 'Male'}
              onChange={(e) => { this.genderHandler(e) }}
              value='Male'
              name='gender-male'
              aria-label='gender'
            /> Male
          </Grid>
          <Grid item xs='3'>
            <Radio
              checked={formData.studentInfo.gender === 'Female'}
              onChange={(e) => { this.genderHandler(e) }}
              value='Female'
              name='gender-female'
              aria-label='gender'
            /> Female
          </Grid>
        </Grid>
        <Grid>
          <div>
            <hr />
            <label style={{ color: '#DC143C', fontSize: '16px' }}>{this.props.leadNumberCheck && this.props.leadNumberCheck.status ? 'Data already exist, Search by Enquiry Code: ' + this.props.leadNumberCheck.enquiry : '' }</label><br />
          </div>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='12'>
            <h3>Parent Details</h3>
          </Grid>
          <Grid item xs='3'>
            <label>Father Name*</label>
            <input
              name='fatherName'
              type='text'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.parentInfo.fatherName ? formData.parentInfo.fatherName : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Father Mobile*</label>
            <input
              name='fatherPhone'
              type='number'
              className='form-control'
              style={{ width: '200px' }}
              disabled={(this.props.appDetails && this.props.appDetails.data[0] && this.props.appDetails.data[0].lead_contact_no) || (this.props.leadNumberCheck && this.props.leadNumberCheck.status)}
              value={formData.parentInfo.fatherPhone ? formData.parentInfo.fatherPhone : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Email</label>
            <input
              name='fatherEmail'
              type='email'
              required
              className='form-control'
              style={{ width: '200px' }}
              value={formData.parentInfo.fatherEmail ? formData.parentInfo.fatherEmail : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Mother Name</label>
            <input
              name='motherName'
              type='text'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.parentInfo.motherName ? formData.parentInfo.motherName : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Mother Mobile</label>
            <input
              name='motherPhone'
              type='number'
              className='form-control'
              style={{ width: '200px' }}
              disabled={this.props.leadNumberCheck && this.props.leadNumberCheck.status}
              value={formData.parentInfo.motherPhone ? formData.parentInfo.motherPhone : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Email</label>
            <input
              name='motherEmail'
              type='email'
              className='form-control'
              style={{ width: '200px' }}
              value={formData.parentInfo.motherEmail ? formData.parentInfo.motherEmail : ''}
              onChange={(e) => { this.parentInfoHandler(e) }}
            />
          </Grid>
        </Grid>
        <Grid>
          <div><hr /></div>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='12'>
            <h3>Address and Other Details</h3>
          </Grid>
          <Grid item xs='3'>
            <label>Address</label>
            <textarea
              name='street'
              type='text'
              className='form-control'
              stysle={{ width: '200px', height: '100px' }}
              value={formData.address.street ? formData.address.street : ''}
              onChange={(e) => { this.addressHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>NearBy Locality</label>
            <textarea
              name='locality'
              type='text'
              className='form-control'
              style={{ width: '200px', height: '100px' }}
              value={formData.address.locality ? formData.address.locality : ''}
              onChange={(e) => { this.addressHandler(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Remarks</label>
            <textarea
              name='remarks'
              type='text'
              className='form-control'
              style={{ width: '200px', height: '100px' }}
              value={formData.address.remarks ? formData.address.remarks : ''}
              onChange={(e) => { this.addressHandler(e) }}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
  optHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newStudentInfo = { ...newFormData.studentInfo }
    newStudentInfo['optingClass'] = e
    newFormData.studentInfo = newStudentInfo
    this.setState({
      formData: newFormData
    })
  }
  admissionHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newStudentInfo = { ...newFormData.studentInfo }
    newStudentInfo['admissionType'] = e
    newFormData.studentInfo = newStudentInfo
    this.setState({
      formData: newFormData
    })
  }

  genderHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newStudentInfo = { ...newFormData.studentInfo }
    newStudentInfo['gender'] = e.target.value
    newFormData.studentInfo = newStudentInfo
    this.setState({
      formData: newFormData
    })
  }

  parentInfoHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newParentInfo = { ...newFormData.parentInfo }
    switch (e.target.name) {
      case 'fatherName': {
        newParentInfo['fatherName'] = e.target.value
        break
      }
      case 'fatherPhone': {
        if (e.target.value.length <= 10) {
          newParentInfo['fatherPhone'] = e.target.value
          if (e.target.value.length >= 8 && e.target.value.length <= 10) {
            this.props.appMobileChecker(e.target.value, this.props.user, this.props.alert)
          }
        } else {
          this.props.alert.warning('Cant exceed 10 digits')
          return
        }
        break
      }
      case 'fatherEmail': {
        newParentInfo['fatherEmail'] = e.target.value
        break
      }
      case 'motherName': {
        newParentInfo['motherName'] = e.target.value
        break
      }
      case 'motherPhone': {
        if (e.target.value.length <= 10) {
          newParentInfo['motherPhone'] = e.target.value
          if (e.target.value.length === 10) {
            this.props.appMobileChecker(e.target.value, this.props.user, this.props.alert)
          }
        } else {
          this.props.alert.warning('Cant exceed 10 digits')
          return
        }
        break
      }
      case 'motherEmail': {
        newParentInfo['motherEmail'] = e.target.value
        break
      }
      default: {

      }
    }
    newFormData.parentInfo = newParentInfo
    this.setState({
      formData: newFormData
    })
  }

  addressHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newAddress = { ...newFormData.address }
    switch (e.target.name) {
      case 'street': {
        newAddress['street'] = e.target.value
        break
      }
      case 'locality': {
        newAddress['locality'] = e.target.value
        break
      }
      case 'remarks': {
        newAddress['remarks'] = e.target.value
        break
      }
      default: {

      }
    }
    newFormData.address = newAddress
    this.setState({
      formData: newFormData
    })
  }

  dataHandler = (e) => {
    const newFormData = { ...this.state.formData }
    const newStudentInfo = { ...newFormData.studentInfo }
    switch (e.target.name) {
      case 'studentName': {
        newStudentInfo['studentName'] = e.target.value
        break
      }
      case 'numberStd': {
        if (e.target.value.length >= 13) {
          this.props.alert.warning('Enter valid number')
          return
        } else {
          newStudentInfo['stdNo'] = e.target.value
        }
        break
      }
      case 'dob': {
        newStudentInfo['studentDob'] = e.target.value
        break
      }
      case 'appDate': {
        newStudentInfo['appDate'] = e.target.value
        break
      }
      default: {

      }
    }
    newFormData.studentInfo = newStudentInfo
    this.setState({
      formData: newFormData
    })
  }

  // Fee Details section

  feeDetails = () => {
    const { formData } = this.state
    const classes = this.props
    return (
      <Paper className={classes.cardBoard} style={{ padding: '30px', margin: '20px' }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* <TableCell align='right'>App No.</TableCell> */}
              <TableCell align='right'>Student Name</TableCell>
              <TableCell align='right'>Class</TableCell>
              <TableCell align='right'>Father Name</TableCell>
              <TableCell align='right'>Father No.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* <TableCell align='right'>{this.props.appNum && this.props.appNum.application_number ? this.props.appNum.application_number : ''}</TableCell> */}
              <TableCell align='right'>{formData.studentInfo.studentName ? formData.studentInfo.studentName : null}</TableCell>
              <TableCell align='right'>{formData.studentInfo.optingClass ? formData.studentInfo.optingClass.label : null}</TableCell>
              <TableCell align='right'>{formData.parentInfo.fatherName ? formData.parentInfo.fatherName : null}</TableCell>
              <TableCell align='right'>{formData.parentInfo.fatherPhone ? formData.parentInfo.fatherPhone : null}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowSpan={2} />
              <TableCell colSpan={1}>Type</TableCell>
              <TableCell align='right'>
                <Select
                  placeholder='Select Type'
                  name='AppType'
                  // className='form-control'
                  value={this.state.appTypeData ? this.state.appTypeData : null}
                  options={[
                    {
                      label: 'New Admission',
                      value: 1
                    },
                    {
                      label: 'RTE Admission',
                      value: 2
                    }
                    // {
                    //   label: 'Internal Student',
                    //   value: 3
                    // }
                    // {
                    //   label: 'Paid To Other Branch',
                    //   value: 4
                    // },
                    // {
                    //   label: 'No Application Fee',
                    //   value: 5
                    // }
                  ]}
                  onChange={(e) => { this.appTypeHandler(e) }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell rowSpan={2} /> */}
              <TableCell>Fee Application </TableCell>
              <TableCell align='right'>{this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : 200}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  appTypeHandler = (e) => {
    this.setState({
      appTypeData: e
    })
  }

  handlePayment = event => {
    if (event.target.value === 'b') {
      this.setState({
        selectedPayment: event.target.value,
        confirm: false,
        disableNext: true,
        isChequePaper: true,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false
      })
    } else if (event.target.value === 'c') {
      this.setState({
        selectedPayment: event.target.value,
        confirm: false,
        disableNext: true,
        isChequePaper: false,
        isInternetPaper: true,
        isCreditPaper: false,
        isTrans: true
      })
    } else if (event.target.value === 'd') {
      this.setState({
        selectedPayment: event.target.value,
        confirm: false,
        disableNext: true,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: true,
        isTrans: false
      })
    } else if (event.target.value === 'a') {
      this.setState({
        selectedPayment: event.target.value,
        confirm: false,
        disableNext: true,
        isChequePaper: false,
        isInternetPaper: false,
        isCreditPaper: false,
        isTrans: false
      })
    }
  }

  handleReceipt = event => {
    this.setState({ selectedReceipt: event.target.value })
    if (event.target.value === 'manual') {
      // this.setState({payment.isOffline : true})
      this.setState({ isOnlineReceipt: true, confirm: false, disableNext: true })
      this.state.payment.isOffline = true
      this.state.payment.isOnline = false
    } else {
      this.setState({ isOnlineReceipt: false, confirm: false, disableNext: true })
      this.state.payment.isOffline = false
      this.state.payment.isOnline = true
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
      case 'ifsc': {
        if (this.state.searchByCheque.value === 1 && event.target.value.length === 11) {
          this.props.fetchIfsc(event.target.value, this.props.alert, this.props.user)
        }
        newCheque['ifsc'] = event.target.value
        break
      }
      case 'micr': {
        if (this.state.searchByCheque.value === 2 && event.target.value.length === 9) {
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
        console.log('not suited')
        // this.setState({validation : false}, ()=>{return false})
        suited = false
        return undefined
      }
    })
    return suited
  }

  handleConfirm = (event) => {
    // console.log('activ state: ', this.state.activeStep)
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

    if (this.state.payment.dateOfPayment === null) {
      this.props.alert.warning('Please fill all the fields!')
      return false
    }

    if (!this.state.payment.receiptOnline && this.state.isOnlineReceipt) {
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

  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.micr)
    if (nextProps.micr && nextProps.micr.data && this.state.searchByCheque.value === 2) {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      newCheque['ifsc'] = nextProps.micr.data[0].IFSC ? nextProps.micr.data[0].IFSC : null
      newCheque['chequeBankName'] = nextProps.micr.data[0].Bank ? nextProps.micr.data[0].Bank : null
      newCheque['chequeBankBranch'] = nextProps.micr.data[0].Branch ? nextProps.micr.data[0].Branch : null
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
      })
    } else if (nextProps.ifsc && this.state.searchByCheque.value === 1) {
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

  receiptFields = () => {
    return (
      <React.Fragment>
        {/* <h3> Amount to be Paid : {this.state.total}</h3> */}
        {/* <TableRow>
            <TableCell><p style={{ fontSize: '16px' }}>Type</p></TableCell>
            <TableCell><p style={{ fontSize: '16px' }}>Amount</p></TableCell>
          </TableRow>
          <br /> */}
        <TableRow>
          {/* <TableCell rowSpan={2} /> */}
          <TableCell>Type<br /><p style={{ fontSize: '14px' }}>Application Fee</p></TableCell>
          <TableCell align='right'> Amount<br /><p style={{ fontSize: '16px' }}>{this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : 200}</p></TableCell>
        </TableRow>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='2'>
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
          <Grid item xs='3'>
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
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          {this.state.isChequePaper === true
            ? <React.Fragment>
              <Grid item xs='3'>
                <label>Cheque No.</label>
                <input
                  name='chequeNo'
                  type='number'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                  onChange={this.chequeDataHandler} />
              </Grid>
              <Grid item xs='3'>
                <label>Cheque Date.</label>
                <input
                  name='chequeDate'
                  type='date'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                  onChange={this.chequeDataHandler} />
              </Grid>
              <Grid item xs='3'>
                <div style={{ width: '200px' }}>
                  <label>SearchBy*</label>
                  <Select
                    onChange={(e) => { this.searchByChequeHandler(e) }}
                    value={this.state.searchByCheque ? this.state.searchByCheque : null}
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
                </div>
              </Grid>
              {this.state.searchByCheque.value === 1 || this.state.searchByCheque.value === 3
                ? <Grid item xs='3'>
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
              {this.state.searchByCheque.value === 2 || this.state.searchByCheque.value === 3
                ? <Grid item xs='3'>
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
              <Grid item xs='3'>
                <label>Bank Name</label>
                <input
                  name='chequeBankName'
                  type='text'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                  onChange={this.chequeDataHandler} />
              </Grid>
              <Grid item xs='3'>
                <label>Bank Branch</label>
                <input
                  name='chequeBankBranch'
                  type='text'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                  onChange={this.chequeDataHandler} />
              </Grid>
            </React.Fragment>
            : null
          }
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          {this.state.isInternetPaper === true
            ? <React.Fragment>
              <Grid item xs='3'>
                <label>Date: </label>
                <input
                  name='internetDate'
                  type='date'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                  onChange={this.internetDataHandler} />
              </Grid>
              <Grid item xs='3'>
                <label>Remarks.</label>
                <input
                  name='remarks'
                  type='text'
                  className='form-control'
                  value={this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                  style={{ width: '200px' }}
                  onChange={this.internetDataHandler} />
              </Grid>
            </React.Fragment>
            : null}
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          {this.state.isCreditPaper === true
            ? <React.Fragment>
              <Grid item xs='3'>
                <div style={{ width: '200px' }}>
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
                </div>
              </Grid>
              <Grid item xs='3'>
                <label>Credit Date</label>
                <input
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
                  name='bankName'
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}

                  onChange={this.creditDataHandler}
                  style={{ width: '200px' }} />
              </Grid>
              <Grid item xs='3'>
                <label>Remarks.</label>
                <input
                  name='creditRemarks'
                  type='text'
                  className='form-control'
                  value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                  onChange={this.creditDataHandler}
                  style={{ width: '200px' }} />
              </Grid>
            </React.Fragment>
            : null}
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='2'>
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
          <Grid item xs='2'>
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
        {/* <Grid.Row>
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
            </Grid.Column>
          </Grid.Row> */}
        {/* displayed only if opted manual */}
        <Grid container spacing={3} style={{ padding: 15 }}>
          {this.state.isOnlineReceipt === true
            ? <React.Fragment>
              <Grid item xs='2'>
                <strong>Receipt Number online:</strong>
              </Grid>
              <Grid item xs='3'>
                <input
                  name='receiptOnline'
                  type='number'
                  className='form-control'
                  value={this.state.payment.receiptOnline ? this.state.payment.receiptOnline : ''}
                  onChange={this.handleReceiptData}
                  style={{ width: '200px' }} />
              </Grid>
            </React.Fragment>
            : null
          }
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='2'>
            <strong>Date of Payment:</strong>
          </Grid>
          <Grid item xs='3'>
            <input
              name='dateOfPayment'
              type='date'
              className='form-control'
              style={{ width: '200px' }}
              max={new Date().toISOString().substr(0, 10)}
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
            <p style={{ fontSize: '16px' }}>{this.state.todayDate ? this.state.todayDate : null}</p>
          </Grid>
        </Grid>
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <input type='checkbox'
              name='confirm'
              onChange={this.handleConfirm}
              checked={this.state.confirm} />
                  Confirm Payment Details
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  makeFinalPayment = () => {
    const { payment } = this.state
    if (this.state.selectedPayment === 'a') {
      let cashData = {
        academic_year: this.state.session ? this.state.session : null,
        admission_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.appNum && this.props.appNum.student.id ? this.props.appNum.student.id : null,
        amount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        applicationPaymentAmount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.id : null,
        payment_in: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: this.state.payment.isOnline ? 1 : 2,
        receipt_number: payment.receiptOnline ? payment.receiptOnline : null,
        // receipt_number_online: payment.receiptOnline ? payment.receiptOnline : null,
        current_date: new Date().toISOString().substr(0, 10)
      }
      this.sendingToServer(cashData)
    } else if (this.state.selectedPayment === 'b') {
      let chequeData = {
        academic_year: this.state.session ? this.state.session : null,
        admission_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.appNum && this.props.appNum.student.id ? this.props.appNum.student.id : null,
        amount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        applicationPaymentAmount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.id : null,
        payment_in: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: payment.isOnline ? 1 : 2,
        receipt_number: payment.receiptOnline ? payment.receiptOnline : null,
        // receipt_number_online: payment.receiptOnline ? payment.receiptOnline : null,
        cheque_number: payment.cheque.chequeNo ? payment.cheque.chequeNo : null,
        date_of_cheque: payment.cheque.chequeDate ? payment.cheque.chequeDate : null,
        micr_code: payment.cheque.micr ? payment.cheque.micr : null,
        ifsc_code: payment.cheque.ifsc ? payment.cheque.ifsc : null,
        name_on_cheque: payment.cheque.chequeName ? payment.cheque.chequeName : null,
        current_date: new Date().toISOString().substr(0, 10),
        bank_name: payment.cheque.chequeBankName ? payment.cheque.chequeBankName : null,
        bank_branch: payment.cheque.chequeBankBranch ? payment.cheque.chequeBankBranch : null
      }
      this.sendingToServer(chequeData)
    } else if (this.state.selectedPayment === 'c') {
      let internetData = {
        academic_year: this.state.session ? this.state.session : null,
        admission_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.appNum && this.props.appNum.student.id ? this.props.appNum.student.id : null,
        amount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        applicationPaymentAmount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.id : null,
        payment_in: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: payment.isOnline ? 1 : 2,
        receipt_number: payment.receiptOnline ? payment.receiptOnline : null,
        // receipt_number_online: payment.receiptOnline ? payment.receiptOnline : null,
        // transaction_id: payment.transid ? payment.transid : null,
        internet_date: payment.internet.internetDate ? payment.internet.internetDate : null,
        remarks: payment.internet.remarks ? payment.internet.remarks : null,
        current_date: new Date().toISOString().substr(0, 10)
      }
      this.sendingToServer(internetData)
    } else if (this.state.selectedPayment === 'd') {
      let creditData = {
        academic_year: this.state.session ? this.state.session : null,
        admission_type: this.state.appTypeData ? this.state.appTypeData.value : null,
        student: this.props.appNum && this.props.appNum.student.id ? this.props.appNum.student.id : null,
        amount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.amount : null,
        date_of_payment: payment.dateOfPayment ? payment.dateOfPayment : null,
        applicationPaymentAmount: this.props.appNum && this.props.appNum.application_fee ? this.props.appNum.application_fee.id : null,
        payment_in: this.state.selectedPayment === 'a' ? 1 : this.state.selectedPayment === 'b' ? 2 : this.state.selectedPayment === 'c' ? 3 : 4,
        receipt_type: payment.isOnline ? 1 : 2,
        receipt_number: payment.receiptOnline ? payment.receiptOnline : null,
        // receipt_number_online: payment.receiptOnline ? payment.receiptOnline : null,
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
    this.props.saveAppPayment(paymentObj, this.props.user, this.props.alert)
  }

  componentDidUpdate () {
    // console.log('--------New Payment State------------')
    // console.log(this.state.payment)
  }

  searchTypeHandler = (e) => {
    this.setState({
      searchTypeData: e,
      searchedValue: '',
      searchedLabel: ''
    })
  }

  // myErpFunc = debounce(() => {
  //   this.props.fetchSuggestions(
  //     this.state.session,
  //     this.state.searchTypeData.value,
  //     this.state.searchedValue,
  //     this.props.user,
  //     this.props.alert
  //   )
  // }, 500)
  myErpFunc = () => {
    this.props.fetchSuggestions(
      this.state.session,
      this.state.searchTypeData.value,
      this.state.searchedValue,
      this.props.user,
      this.props.alert
    )
  }

  onSearchChange = (e, selected) => {
    console.log('onSearch click', e.target.value)
    this.setState({
      searchedValue: e.target.value, searchedLabel: e.target.label, showApp: false
    }, () => {
      console.log(this.state.searchedValue)
      if (this.state.searchedValue.length >= 3) {
        // console.log('debounce')
        this.myErpFunc()
      }
    })
  }

  render () {
    let { classes } = this.props
    const steps = getSteps()
    const { activeStep } = this.state
    let { appDetails } = this.props
    let siblings = null
    // console.log('===>appDetails: ', this.props.appDetails)
    if (this.props.appDetails.recordsAvailable) {
      siblings = (<div>
        {this.props.appDetails && this.props.appDetails.data[0] && this.props.appDetails.data[0].child_detail_fk.length > 0
          ? <Button variant='extended' color='primary' className={classes.button} disabled={!this.state.session} onClick={() => { this.showAppHandler() }}>Create Sibling Application</Button>
          : null}
        <ReactTable
          // pages={Math.ceil(this.props.viewBanksList.count / 20)}
          data={this.renderSiblingsTable()}
          manual
          columns={[
            {
              Header: 'Lead Name',
              accessor: 'leadName',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Lead Number',
              accessor: 'leadNumber',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Student Name',
              accessor: 'studentName',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Application No',
              accessor: 'appNum',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Opting Class',
              accessor: 'class',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Lead Status',
              accessor: 'leadStatus',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: '',
              accessor: 'app',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: '',
              accessor: 'siblingApp',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            }
          ]}
          filterable
          sortable
          defaultPageSize={2}
          // showPageSizeOptions={false}
          className='-striped -highlight'
          // Controlled props
          // page={this.state.page}
          // Callbacks
          // onPageChange={page => this.pageChangeHandler(page)}
        />
      </div>)
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              isDisabled={this.state.activeStep !== 0}
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={(e) => { this.handleAcademicyear(e) }}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Search Type*</label>
            <Select
              placeholder='Select Type'
              value={this.state.searchTypeData ? this.state.searchTypeData : ''}
              isDisabled={this.state.activeStep !== 0}
              options={[
                {
                  label: 'Enquiry Code',
                  value: 'enquiry_code'
                },
                {
                  label: 'Father Name',
                  value: 'father_name'
                },
                {
                  label: 'Student Name',
                  value: 'student_name'
                },
                {
                  label: 'Mobile No.',
                  value: 'mobile_no'
                }
              ]}
              onChange={this.searchTypeHandler}
            />
          </Grid>
          <Grid item xs='3' style={{ marginTop: 8 }}>
            <AutoSuggest
              label={this.state.searchTypeData.label}
              // disabled={this.state.activeStep !== 0}
              style={{ display: 'absolute', top: '10px', width: '240px' }}
              // value='sadas'
              value={this.state.searchedLabel && this.state.searchedLabel.length > 0 ? this.state.searchedLabel : this.state.searchedValue}
              onChange={this.onSearchChange}
              margin='dense'
              variant='outlined'
              data={
                this.props.stdSugg && this.props.stdSugg.length > 0 && this.state.searchTypeData.value === 'enquiry_code'
                  ? this.props.stdSugg.map(item => ({ value: item.enquiry_no ? item.enquiry_no : '', label: item.enquiry_no ? item.enquiry_no : '' }))
                  : this.props.stdSugg && this.props.stdSugg.length > 0 && this.state.searchTypeData.value === 'father_name'
                    ? this.props.stdSugg.map(item => ({ value: item.enquiry_no ? item.enquiry_no : '', label: item.lead_name ? item.lead_name : '' }))
                    : this.props.stdSugg && this.props.stdSugg.length > 0 && this.state.searchTypeData.value === 'student_name'
                      ? this.props.stdSugg.map(item => ({ value: item.enquiry_no ? item.enquiry_no : '', label: item.child_name ? item.child_name : '' }))
                      : this.props.stdSugg && this.props.stdSugg.length > 0 && this.state.searchTypeData.value === 'mobile_no'
                        ? this.props.stdSugg.map(item => ({ value: item.enquiry_no ? item.enquiry_no : '', label: item.lead_contact_no ? item.lead_contact_no : '' }))
                        : []
              }
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 20 }}
              disabled={!this.state.session}
              onClick={this.getDetails}
            >
                GET
            </Button>
          </Grid>
        </Grid>
        {/* {siblings} */}
        { appDetails.data && appDetails.data[0] && appDetails.data[0].child_detail_fk.length > 0 && appDetails && appDetails.data[0] && appDetails.data[0].child_detail_fk ?
          <React.Fragment>
             <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lead Name</TableCell>
                      <TableCell>Lead Number</TableCell>
                      <TableCell> Student Name</TableCell>
                      <TableCell> Apllication No</TableCell>
                      <TableCell> Opting Class</TableCell>
                      <TableCell>Lead Status</TableCell>
                      <TableCell>App</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {appDetails.data && appDetails.data[0] && appDetails.data[0].child_detail_fk.length > 0 && appDetails && appDetails.data[0] && appDetails.data[0].child_detail_fk.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> {appDetails.data[0].lead_name ? appDetails.data[0].lead_name : 'No data'}</TableCell>
                     <TableCell>{appDetails.data[0].lead_contact_no ? appDetails.data[0].lead_contact_no : 'No data'}</TableCell>
                      <TableCell>{ val.child_name ? val.child_name : 'No data'}</TableCell>
                      <TableCell> {val.application_no ? val.application_no : 'No data'}</TableCell>
                      <TableCell> {val.child_class && val.child_class.grade ? val.child_class.grade : 'No data'}</TableCell>
                      <TableCell>{val.lead_status && val.lead_status.status_name ? val.lead_status.status_name : 'No Data'}</TableCell>
                      <TableCell> {val.application_no ? 'Application Completed' : <Button variant='extended' color='primary' className={classes.button} disabled={!this.state.session} onClick={() => { this.showAppHandler(val.id) }}>Create Application</Button>}</TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={appDetails.data && appDetails.data.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </React.Fragment>
            : [] }
        {this.state.showApp || (this.props.appDetails.data && !this.props.appDetails.recordsAvailable)
          ? <div className={classes.root} style={{ margin: '10px' }}>
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
                  <div>
                    <Button
                      disabled={activeStep === 0 || activeStep === 1 || activeStep === 3}
                      onClick={this.handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                    <Button variant='contained' color='primary' onClick={this.handleNext}
                      disabled={(this.props.leadNumberCheck && this.props.leadNumberCheck.status) || (this.state.activeStep === 2 && this.state.disableNext)}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          : null }
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  appDetails: state.finance.accountantReducer.appForm.appDetails,
  gradeData: state.finance.accountantReducer.appForm.gradeData,
  dataLoading: state.finance.common.dataLoader,
  ifsc: state.finance.common.ifscDetails,
  micr: state.finance.common.micrDetails,
  appNum: state.finance.accountantReducer.appForm.applicationNum,
  stdSugg: state.finance.accountantReducer.appForm.stdSuggestions,
  finalRecords: state.finance.accountantReducer.appForm.finalRecords,
  leadNumberCheck: state.finance.accountantReducer.appForm.leadNumberCheck,
  receiptRange: state.finance.makePayAcc.receiptRange
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrade: (session, alert, user) => dispatch(actionTypes.fetchGrade({ session, alert, user })),
  fetchApplicationDetails: (session, key, user, alert) => dispatch(actionTypes.fetchApplicationDetails({ session, key, user, alert })),
  saveAllFormData: (data, user, alert) => dispatch(actionTypes.saveAllFormData({ data, user, alert })),
  saveAppPayment: (data, user, alert) => dispatch(actionTypes.saveAppPayment({ data, user, alert })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user })),
  fetchSuggestions: (session, sType, value, user, alert) => dispatch(actionTypes.fetchStdSuggestions({ session, sType, value, user, alert })),
  appMobileChecker: (leadNumber, user, alert) => dispatch(actionTypes.appMobileChecker({ leadNumber, user, alert })),
  fetchReceiptRange: (session, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(ApplicationFormAcc)))
