import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import { withStyles, Button, CircularProgress } from '@material-ui/core/'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withRouter } from 'react-router-dom'
// import axios from 'axios'
import { ArrowBack } from '@material-ui/icons/'
import axios from 'axios'
import { apiActions } from '../../../../_actions'
import NonRTEStudentDetailsFormAcc from './nonRTEstudentDetails'
import NonRTEOtherDetailsFormAcc from './nonRTEotherDetails'
import NonRTEStudentParentDetailsFormAcc from './nonRTEstudentParentDetails'
import NonRTEAddressDetailsFormAcc from './nonRTEaddressDetails'
import NonRTEFeeDetailsFormAcc from './nonRTEFeePlan'
import Receipt from './nonRTEPayment'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions'
import { urls } from '../../../../urls'
import feeReceiptss from '../../Receipts/feeReceiptss'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    width: '100%'
  },
  paper: {
    textAlign: 'center'
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '27px',
    marginBottom: '10px'
  },
  buttonSpacing: {
    marginLeft: '35px',
    marginRight: '10px',
    marginTop: '27px',
    marginBottom: '10px'
  }
})

function getSteps () {
  return ['Student Details', 'Student Parent Details', 'Address Details', 'Other Details', 'Fee Plans', 'Payment']
}

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Admission Form') {
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
class NonRTEFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      activeStep: 0,
      studentdetails: null,
      studentparentdetails: null,
      adressdetails: null,
      otherdetails: null,
      feeDetails: null,
      regNo: null,
      disableNext: false
    }
  }

  componentDidMount () {
    console.log('props:', this.props.history.location.regNo)
    this.setState({
      regNo: this.props.history.location.regNo
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log('RECIEVED PROPS', nextProps.redirect)
    if (nextProps.redirect === true) {
      this.props.history.push({
        pathname: '/finance/customizedAdmissionForm'
      })
    }
  }

  componentDidUpdate () {
    // console.log('DID UPDATED', this.state.studentdetails)
    console.log('DID UPDATED', this.state.studentparentdetails)
    // console.log('DID UPDATED', this.state.adressdetails)
    // console.log('DID UPDATED', this.state.otherdetails)
    // console.log('DID UPDATED', this.state.feeDetails)
  }

    getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return <NonRTEStudentDetailsFormAcc studentPrefillDetails={this.props.studentPrefillDetails} getStudentDetail={this.getStudentDetail} alert={this.props.alert} />
        case 1:
          return <NonRTEStudentParentDetailsFormAcc getStudentParentDetail={this.getStudentParentDetail} alert={this.props.alert} />
        case 2:
          return <NonRTEAddressDetailsFormAcc getAddressDetail={this.getAddressDetail} />
        case 3:
          return <NonRTEOtherDetailsFormAcc alert={this.props.alert} getOtherDetail={this.getOtherDetail} />
        case 4:
          return <NonRTEFeeDetailsFormAcc alert={this.props.alert} session={this.state.studentdetails.academicyear} stuGrade={this.state.studentdetails.class} getFeeDetails={this.getFeeDetails} />
        case 5:
          return <Receipt alert={this.props.alert} session={this.state.studentdetails.academicyear} feeTable={this.state.feeDetails} getReceiptDetail={this.getReceiptDetail} />

        default:
          return 'Unknown stepIndex'
      }
    }

    getStudentDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        studentdetails: dataOb
      })
    }

    getStudentParentDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        studentparentdetails: dataOb
      })
    }

    getAddressDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        adressdetails: dataOb
      })
    }

    getFeeDetails = (dataOb) => {
      console.log(dataOb)
      this.setState({
        feeDetails: dataOb
      })
    }

    getReceiptDetail = (confirm, paymentDetail, total) => {
      if (confirm) {
        // this.setState({ disableNext: false })
        this.setState({
          disableNext: true,
          payment: paymentDetail,
          totalAmountToBePaid: total
        }, () => {
          console.log('payment details from main file: ', this.state.payment)
        })
      } else {
        this.setState({ disableNext: false })
      }
      // we Will SetState to PaymentDatail
    }

    getOtherDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        otherdetails: dataOb
      })
    }

    handleNext = () => {
      const { studentparentdetails } = this.state
      if (this.state.activeStep === 0) {
        if (this.state.studentdetails.academicyear && this.state.studentdetails.firstName && this.state.studentdetails.class && this.state.studentdetails.section && this.state.studentdetails.dateOfBir) {
          if (Date.parse(this.state.studentdetails.dateofAdm) < Date.parse(this.props.studentDetailsForAdmission.registration_date)) {
            this.props.alert.warning('Admission date cant be less than reg date!')
            return false
          }
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else {
          // this.props.alert.warning('Fill all mandatory fields!')
        }
      } else if (this.state.activeStep === 1) {
        if (+studentparentdetails.poc === 1 && studentparentdetails.fatherName && studentparentdetails.fatherphone && studentparentdetails.fatherphone.length === 10) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else if (+studentparentdetails.poc === 2 && studentparentdetails.motherName && studentparentdetails.motherphone && studentparentdetails.motherphone.length === 10) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else if (+studentparentdetails.poc === 3 && studentparentdetails.guName && studentparentdetails.guPhone && studentparentdetails.guPhone.length === 10) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else {
          this.props.alert.warning('Fill all mandatory fields!')
        }
      } else if (this.state.activeStep === 2) {
        if (this.state.adressdetails.tempAdd) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else {
          this.props.alert.warning('Fill all mandatory fields!')
        }
      } else if (this.state.activeStep === 3) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1
          }
        })
      } else if (this.state.activeStep === 4) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1
          }
        })
      }
      if (this.state.activeStep === 5) {
        // this.setState(prevState => {
        //   return {
        //     activeStep: prevState.activeStep + 1
        //   }
        // })
        console.log('make API Call')
        const { studentdetails, otherdetails, studentparentdetails, adressdetails, feeDetails } = this.state
        let payData = null
        if (+this.state.payment.mode === 1) {
          payData = {
            student: this.props.erpCode,
            date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
            total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
            total_fee_amount: this.state.selectedTotal ? this.state.selectedTotal : 0,
            total_other_fee_amount: this.state.otherFeeAmount ? this.state.otherFeeAmount : 0,
            payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
            receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
            receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
            // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          // this.sendingToServer(cashData)
        } else if (+this.state.payment.mode === 2) {
          payData = {
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
            current_date: new Date().toISOString().substr(0, 10),
            bank_name: this.state.payment.payment.cheque.chequeBankName ? this.state.payment.payment.cheque.chequeBankName : null,
            bank_branch: this.state.payment.payment.cheque.chequeBankBranch ? this.state.payment.payment.cheque.chequeBankBranch : null
          }
          // this.sendingToServer(chequeData)
        } else if (+this.state.payment.mode === 3) {
          payData = {
            student: this.props.erpCode,
            date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
            total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
            payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
            receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
            receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
            // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
            transaction_id: this.state.payment.payment.transid ? this.state.payment.payment.transid : null,
            internet_date: this.state.payment.payment.internet.internetDate ? this.state.payment.payment.internet.internetDate : null,
            remarks: this.state.payment.payment.internet.remarks ? this.state.payment.payment.internet.remarks : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          // this.sendingToServer(internetData)
        } else if (+this.state.payment.mode === 5) {
          payData = {
            student: this.props.erpCode,
            date_of_payment: this.state.payment.payment.dateOfPayment ? this.state.payment.payment.dateOfPayment : null,
            total_amount: this.state.totalAmountToBePaid ? this.state.totalAmountToBePaid : 0,
            payment_mode: this.state.payment.mode ? this.state.payment.mode : null,
            receipt_type: this.state.payment.payment.isOnline ? 1 : 2,
            receipt_number: this.state.payment.payment.receiptNo ? this.state.payment.payment.receiptNo : null,
            // receipt_number_online: this.state.payment.payment.receiptOnline ? this.state.payment.payment.receiptOnline : null,
            transaction_id: this.state.payment.payment.transid ? this.state.payment.payment.transid : null,
            internet_date: this.state.payment.payment.internet.internetDate ? this.state.payment.payment.internet.internetDate : null,
            remarks: this.state.payment.payment.internet.remarks ? this.state.payment.payment.internet.remarks : null,
            current_date: new Date().toISOString().substr(0, 10)
          }
          // this.sendingToServer(internetData)
        } else if (+this.state.payment.mode === 4) {
          payData = {
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
            current_date: new Date().toISOString().substr(0, 10)
          }
          // this.sendingToServer(creditData)
        }
        const body = {
          session_year: studentdetails.academicyear,
          name: studentdetails.firstName,
          first_name: studentdetails.firstName,
          middle_name: studentdetails.middleName,
          last_name: studentdetails.lastName,
          siblings: studentparentdetails.siblingClass,
          grade: studentdetails.class.value,
          section: studentdetails.section,
          admission_date: studentdetails.dateofAdm,
          gender: studentdetails.gender,
          date_of_birth: studentdetails.dateOfBir,
          admission_number: studentdetails.refadmNum,
          is_rte: false,
          registration_number: this.state.regNo,
          first_lang: otherdetails.language1,
          third_lang: otherdetails.language3,
          second_lang: otherdetails.language2,
          using_transport: studentdetails.transport,
          address: adressdetails.tempAdd,
          current_address: adressdetails.tempAdd,
          current_zipcode: adressdetails.tempzip,
          permanent_address: adressdetails.perAdd,
          permanent_zipcode: adressdetails.perzip,
          class_group_name: studentdetails.classGroup,
          nationality: otherdetails.nationality,
          religion: otherdetails.religion,
          mother_tongue: otherdetails.mothertounge,
          caste: otherdetails.caste,
          blood_group: otherdetails.bloodgroup,
          point_of_contact: studentparentdetails.poc,
          father_name: studentparentdetails.fatherName,
          father_mobile: studentparentdetails.fatherphone,
          father_email: studentparentdetails.fatheremail,
          father_occupation: studentparentdetails.fatheroccupation,
          father_qualification: studentparentdetails.fatherqualification,
          mother_occupation: studentparentdetails.motheroccupation,
          mother_name: studentparentdetails.motherName,
          mother_qualification: studentparentdetails.motherqualification,
          mother_email: studentparentdetails.motheremail,
          mother_mobile: studentparentdetails.motherphone,
          guardian_occupation: studentparentdetails.guOccupation,
          guardian_name: studentparentdetails.guName,
          guardian_qualification: studentparentdetails.guQualification,
          guardian_email: studentparentdetails.guEmail,
          guardian_mobile: studentparentdetails.guPhone,
          previous_admission_no: otherdetails.prevAdmissionno,
          aadhar_number: otherdetails.adharno,
          fee: feeDetails.checkedInstallments,
          other_fee: [],
          fee_plan_name: feeDetails.feePlanId,
          ...payData
        }
        console.log('this is body', body)
        this.props.postAdmission(body, this.props.user, this.props.alert)
      }
    }
    handleBack = () => {
      console.log('handle back pressed')
      this.setState(state => ({
        activeStep: state.activeStep - 1
      }), () => {
        // disabling and enabling next button
        if (this.state.activeStep === 1) {
          this.setState({ disableNext: true })
        } else {
          this.setState({ disableNext: false })
        }
      })
    }

  // Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.state.studentdetails.academicyear}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    try {
      const response = await this.getPdfData(this.props.receiptGen.transaction_id)
      feeReceiptss(response.data)
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Something Went Wrong')
    }
  }
  render () {
    const steps = getSteps()
    const { classes } = this.props
    const { activeStep } = this.state
    return (
      <Layout>
      <React.Fragment>
        <Button style={{ marginLeft: '20px'}} color='primary' className={classes.btn} onClick={this.props.history.goBack}>
          <ArrowBack /> Back
        </Button>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
        {this.props.receiptGen
          ? <React.Fragment>
            <center>
              <h2>Thank You For Recording Payment Details</h2>
              {this.props.receiptGen ? <b style={{ fontSize: '20px' }}>Transaction No is {this.props.receiptGen.transaction_id}</b> : null}
              <br />
              <Button variant='contained' onClick={this.generatePdf}>Download PDF</Button>
            </center>
          </React.Fragment>
          : <footer>
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <div className={classes.spacing}>
                  <Button variant='contained' disabled={activeStep === 0} color='primary' onClick={this.handleBack}>Previous
                  </Button>
                </div>
              </Grid>
              <Grid item xs={1}>
                <div className={classes.buttonSpacing}>
                  <Button variant='contained' disabled={this.state.activeStep === 5 && !this.state.disableNext} color='primary' onClick={this.handleNext}> {activeStep === steps.length - 1 ? 'Finish' : 'Next' }
                  </Button>
                </div>
              </Grid>
            </Grid>
          </footer>}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  redirect: state.finance.accountantReducer.admissionForm.redirect,
  receiptGen: state.finance.accountantReducer.admissionForm.receiptGen,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  postAdmission: (data, user, alert) => dispatch(actionTypes.postAdmission({ data, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NonRTEFormAcc)))
