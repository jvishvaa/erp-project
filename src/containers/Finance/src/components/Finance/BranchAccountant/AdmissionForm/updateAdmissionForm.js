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
import { apiActions } from '../../../../_actions'
import UpdateStudentDetailsFormAcc from './updateStudentDetails'
import UpdateOtherDetailsFormAcc from './updateOtherDetails'
import UpdateStudentParentDetailsFormAcc from './updateStudentParentDetails'
import UpdateAddressDetailsFormAcc from './updateAddressDetails'
import UpdateStudentSiblingDetailsFormAcc from './updateStudentSiblingDetails'
import UpdateStudentCertiDetailsAcc from './updateStudentCertificateDetails'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions'
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
  return ['Student Details', 'Student Parent Details', 'Address Details', 'Other Details', 'Sibling Details', 'Student Certificates']
}

class UpdateAdmissionFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      activeStep: 0,
      studentdetails: null,
      studentparentdetails: null,
      studentSiblingDetails: null,
      studentCertificateDetails: null,
      adressdetails: null,
      otherdetails: null,
      studentInformationForAdmission: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('RECIEVED PROPS', nextProps.redirect)
    if (nextProps.redirect === true) {
      this.props.history.push({
        pathname: '/finance/AdmissionForm'
      })
    }
  }

  componentDidMount () {
    console.log('props:', this.props.history.location.studentInformationForAdmission)
    if (this.props.history.location.studentInformationForAdmission) {
      this.setState({
        studentInformationForAdmission: this.props.history.location.studentInformationForAdmission
      }, () => {
        // console.log(this.state.studentInformationForAdmission.student_registered)
        if (this.state.studentInformationForAdmission && this.state.studentInformationForAdmission.student_registered) {
          this.props.fetchAdmissionRecordByErp(this.state.studentInformationForAdmission.student_registered.erp, this.props.user, this.props.alert)
        }
      })
    } else {
      this.setState({
        studentInformationForAdmission: null
      })
    }
    console.log(this.state.studentInformationForAdmission)
  }
  componentDidUpdate () {
    console.log('DID UPDATED', this.state.studentdetails)
    console.log('DID UPDATED', this.state.studentparentdetails)
    console.log('DID UPDATED', this.state.adressdetails)
    console.log('DID UPDATED', this.state.otherdetails)
    console.log('did update', this.state.studentCertificateDetails)
  }

    getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return <UpdateStudentDetailsFormAcc studentInformationForAdmission={this.state.studentInformationForAdmission} getStudentDetail={this.getStudentDetail} alert={this.props.alert} />
        case 1:
          return <UpdateStudentParentDetailsFormAcc studentInformationForAdmission={this.state.studentInformationForAdmission} getStudentParentDetail={this.getStudentParentDetail} />
        case 2:
          return <UpdateAddressDetailsFormAcc studentInformationForAdmission={this.state.studentInformationForAdmission} getAddressDetail={this.getAddressDetail} />
        case 3:
          return <UpdateOtherDetailsFormAcc studentInformationForAdmission={this.state.studentInformationForAdmission} alert={this.props.alert} getOtherDetail={this.getOtherDetail} />
        case 4:
          return <UpdateStudentSiblingDetailsFormAcc studentInformationForAdmission={this.state.studentInformationForAdmission} alert={this.props.alert} getSiblingDetail={this.getSiblingDetail} />
        case 5:
          return <UpdateStudentCertiDetailsAcc studentInformationForAdmission={this.state.studentInformationForAdmission} alert={this.props.alert} getCertificateDetail={this.getCertificateDetail} />
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

    getOtherDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        otherdetails: dataOb
      })
    }
    getSiblingDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        studentSiblingDetails: dataOb
      })
    }
    getCertificateDetail = (dataOb) => {
      console.log(dataOb)
      this.setState({
        studentCertificateDetails: dataOb
      })
    }

    handleNext = () => {
      console.log('handle next pressed')
      // if (this.state.activeStep < 5) {
      //   this.setState(prevState => {
      //     return {
      //       activeStep: prevState.activeStep + 1
      //     }
      //   })
      // }
      if (this.state.activeStep === 0) {
        if (this.state.studentdetails.firstName && this.state.studentdetails.dateOfBir) {
          this.setState(prevState => {
            return {
              activeStep: prevState.activeStep + 1
            }
          })
        } else {
          this.props.alert.warning('Fill all mandatory fields!')
        }
      } else if (this.state.activeStep === 1) {
        if (this.state.studentparentdetails.fatherName && (this.state.studentparentdetails.fatherphone || this.state.studentparentdetails.motherphone)) {
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
      } else if (this.state.activeStep === 5) {
        console.log('make API Call')
        const { studentdetails, otherdetails, studentCertificateDetails, studentparentdetails, adressdetails, studentSiblingDetails } = this.state
        const body = {
          aadhar_number: otherdetails.adharno,
          address: adressdetails.tempAdd,
          admission_date: studentdetails.dateofAdm,
          admission_number: studentdetails.refadmNum,
          admisssion_type: 'New Student',
          applicable_parent: false,
          blood_group: otherdetails.bloodgroup,
          caste: otherdetails.caste,
          class_group_name: studentdetails.classGroup,
          contact_no: studentdetails.residentialphone,
          current_address: adressdetails.tempAdd,
          current_zipcode: adressdetails.tempzip,
          date_of_birth: studentdetails.dateOfBir,
          certificate: studentCertificateDetails,
          erp: studentdetails.enrollment_code,
          erp_code: studentdetails.enrollment_code,
          father_aadhaar_number: studentparentdetails.fatherAadhar,
          father_business_name: studentparentdetails.fatherorganisation,
          father_designation: studentparentdetails.fatherdesignation,
          father_dob: studentparentdetails.fatherdob,
          father_email: studentparentdetails.fatheremail,
          father_marriage_anniversary: studentparentdetails.marriageAniversory,
          father_mobile: studentparentdetails.fatherphone,
          father_name: studentparentdetails.fatherName,
          father_occupation: studentparentdetails.fatheroccupation,
          father_qualification: studentparentdetails.fatherqualification,
          first_lang: otherdetails.language1,
          first_name: studentdetails.firstName,
          gender: studentdetails.gender,
          grade: studentdetails.class.id,
          guardian_email: studentSiblingDetails.guardianEmail,
          guardian_mobile: studentSiblingDetails.guardianmobile,
          guardian_name: studentSiblingDetails.guardianName,
          guardian_occupation: studentSiblingDetails.guardianOccupation,
          guardian_code: studentSiblingDetails.guardianCode,
          identification_mark_one: otherdetails.identificationMarks1,
          identification_mark_two: otherdetails.identificationMarks2,
          is_active: true,
          is_afternoonbatch: false,
          is_dayscholar: false,
          is_parent_vip: false,
          is_rte: true,
          is_specialchild: false,
          last_name: studentdetails.lastName,
          middle_name: studentdetails.middleName,
          mother_aadhaar_number: studentparentdetails.motherAadharno,
          mother_business_name: studentparentdetails.motherOrganisation,
          mother_designation: studentparentdetails.motherDesignation,
          mother_dob: studentparentdetails.motherDob,
          mother_email: studentparentdetails.motheremail,
          mother_mobile: studentparentdetails.motherphone,
          mother_name: studentparentdetails.motherName,
          mother_occupation: studentparentdetails.motheroccupation,
          mother_qualification: studentparentdetails.motherqualification,
          mother_tongue: otherdetails.mothertounge,
          name: studentdetails.firstName,
          nationality: otherdetails.nationality,
          permanent_address: adressdetails.perAdd,
          permanent_zipcode: adressdetails.perzip,
          point_of_contact: studentparentdetails.poc,
          qualified_exam_rank: otherdetails.qualifiedExamRank,
          religion: otherdetails.religion,
          second_lang: otherdetails.language2,
          section: studentdetails.section,
          siblings: studentparentdetails.siblingClass,
          stay_category: studentdetails.category,
          third_lang: otherdetails.language3,
          using_transport: studentdetails.transport,
          zip_code: adressdetails.tempzip
        }
        console.log('this is body', body)
        this.props.putStudentAdmission(body, this.props.user, this.props.alert)
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

    render () {
      const steps = getSteps()
      const { classes } = this.props
      const { activeStep } = this.state
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
          <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
          <footer>
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <div className={classes.spacing}>
                  <Button variant='contained' color='primary' onClick={this.handleBack}>Previous
                  </Button>
                </div>
              </Grid>
              <Grid item xs={1}>
                <div className={classes.buttonSpacing}>
                  <Button variant='contained' color='primary' onClick={this.handleNext}> {activeStep === steps.length - 1 ? 'Finish' : 'Next' }
                  </Button>
                </div>
              </Grid>
              {/* <Grid item xs={1}>
                <div style={{ marginTop: '27px' }}>
                  <Button variant='contained' color='primary' onClick={this.getStatusHandler}>Cancel
                  </Button>
                </div>
              </Grid> */}
              {this.props.dataLoading ? <CircularProgress open /> : null}
            </Grid>
          </footer>
        </React.Fragment>
        </Layout>
      )
    }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp,
  dataLoading: state.finance.common.dataLoader,
  redirect: state.finance.accountantReducer.admissionForm.redirect
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  postAdmission: (data, user, alert) => dispatch(actionTypes.postAdmission({ data, user, alert })),
  fetchAdmissionRecordByErp: (erp, user, alert) => dispatch(actionTypes.fetchAdmissionRecordByErp({ erp, user, alert })),
  putStudentAdmission: (data, user, alert) => dispatch(actionTypes.putStudentAdmission({ data, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateAdmissionFormAcc)))
