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
import StudentDetailsFormAcc from './studentDetails'
import OtherDetailsFormAcc from './otherDetails'
import StudentParentDetailsFormAcc from './studentParentDetails'
import AddressDetailsFormAcc from './addressDetails'
import * as actionTypes from '../store/actions'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
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

// const [activeStep, setActiveStep] = React.useState(0)
// const [skipped, setSkipped] = React.useState(new Set())

function getSteps () {
  return ['Student Details', 'Student Parent Details', 'Address Details', 'Other']
}

class NewAdmissionFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      activeStep: 0,
      studentdetails: null,
      studentparentdetails: null,
      adressdetails: null,
      otherdetails: null
    }
  }

  componentDidUpdate () {
    // console.log('DID UPDATED', this.state.studentdetails)
    // console.log('DID UPDATED', this.state.studentparentdetails)
    // console.log('DID UPDATED', this.state.adressdetails)
    // console.log('DID UPDATED', this.state.otherdetails)
  }

  componentWillReceiveProps (nextProps) {
    // console.log('RECIEVED PROPS', nextProps)
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StudentDetailsFormAcc studentdetails={this.state.studentdetails} getStudentDetail={this.getStudentDetail} alert={this.props.alert} />
      case 1:
        return <StudentParentDetailsFormAcc studentparentdetails={this.state.studentparentdetails} getStudentParentDetail={this.getStudentParentDetail} />
      case 2:
        return <AddressDetailsFormAcc adressdetails={this.state.adressdetails} getAddressDetail={this.getAddressDetail} />
      case 3:
        return <OtherDetailsFormAcc otherdetails={this.state.otherdetails} alert={this.props.alert} getOtherDetail={this.getOtherDetail} />
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

  handleNext = () => {
    console.log('handle next pressed')
    if (this.state.activeStep === 0) {
      if (this.state.studentdetails.academicyear && this.state.studentdetails.firstName && this.state.studentdetails.class && this.state.studentdetails.section && this.state.studentdetails.dateOfBir && this.state.studentdetails.dateofAdm && this.state.studentdetails.refadmNum) {
        this.setState(prevState => {
          return {
            activeStep: prevState.activeStep + 1
          }
        })
      } else {
        // this.props.alert.warning('Fill all mandatory fields!')
      }
    } else if (this.state.activeStep === 1) {
      if (this.state.studentparentdetails.fatherName && (this.state.studentparentdetails.fatherphone || this.state.studentparentdetails.motherphone) && this.state.studentparentdetails.poc) {
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
        // this.props.alert.warning('Fill all mandatory fields!')
      }
    } else if (this.state.activeStep === 3) {
      console.log('make API Call')
      const { studentdetails, otherdetails, studentparentdetails, adressdetails } = this.state
      const body = {
        session_year: studentdetails.academicyear,
        name: studentdetails.firstName,
        first_name: studentdetails.firstName,
        middle_name: studentdetails.middleName,
        last_name: studentdetails.lastName,
        siblings: studentparentdetails.siblingClass,
        grade: studentdetails.class,
        section: studentdetails.section,
        admission_date: studentdetails.dateofAdm,
        gender: studentdetails.gender,
        date_of_birth: studentdetails.dateOfBir,
        admission_number: studentdetails.refadmNum,
        is_rte: true,
        first_lang: otherdetails.language1,
        third_lang: otherdetails.language3,
        second_lang: otherdetails.language2,
        using_transport: studentdetails.transport,
        address: adressdetails.tempAdd,
        class_group_name: studentdetails.classGroup,
        nationality: otherdetails.nationality,
        religion: otherdetails.religion,
        mother_tongue: otherdetails.mothertounge,
        current_address: adressdetails.tempAdd,
        current_zipcode: adressdetails.tempzip,
        permanent_address: adressdetails.perAdd,
        permanent_zipcode: adressdetails.perzip,
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
        previous_admission_no: otherdetails.prevAdmissionno,
        aadhar_number: otherdetails.adharno
      }
      console.log('this is body', body)
      this.props.postAdmission(body, this.props.user, this.props.alert)
      this.props.history.push({
        pathname: '/finance/customizedAdmissionForm'
      })
    }
  }
  handleBack = () => {
    console.log('handle back pressed')
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }), () => {
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
    console.log('Active step: !', activeStep)
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
                <Button variant='contained' disabled={activeStep === 0} color='primary' onClick={this.handleBack}>Previous
                </Button>
              </div>
            </Grid>
            <Grid item xs={1}>
              <div className={classes.buttonSpacing}>
                <Button variant='contained' color='primary' onClick={this.handleNext}> {activeStep === steps.length - 1 ? 'Finish' : 'Next' }
                </Button>
              </div>
            </Grid>
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
  dataLoading: state.finance.common.dataLoader,
  redirect: state.finance.accountantReducer.admissionForm.redirect
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  postAdmission: (data, user, alert) => dispatch(actionTypes.postAdmission({ data, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NewAdmissionFormAcc)))
