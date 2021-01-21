/* eslint-disable no-undef */
import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import { Stepper, Step, StepLabel, withStyles, Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Grid from '@material-ui/core/Grid'
import OtpInput from 'react-otp-input'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Timer from 'react-compound-timer'
import { urls } from '../urls'
import { apiActions } from '../_actions'
import { OmsSelect as Select, InternalPageStatus } from './../ui'

const styles = theme => ({
  main: {
    width: '100',
    display: 'block', // Fix IE 11 issue.
    padding: '10px',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    height: '100vh',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    root: {
      width: '90%'
    },
    button: {
      marginRight: theme.spacing.unit
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  validationLabel: {
    fontSize: '11px',
    textTransform: 'capitalize'
  }
})
const RESEND = {
  marginLeft: '70%',
  color: 'blue',
  fontSize: '20px'
}
const BUTTONS = {
  marginTop: '50px'
}

function getSteps () {
  return ['Enter required fields', 'Verification']
}

export class RegisterGuest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      first_name: '',
      email: '',
      aGradeId: '',
      name: '',
      mobile: '',
      nameError: false,
      mailError: false,
      address: '',
      pincode: '',
      gender: 'male',
      selectedDate: '1998-01-10',
      activeStep: 0,
      loading: true,
      otp: '',
      ShowTimer: true,
      ResendOtpButton: true,
      count: 0,
      sendingData: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleVerification = this.handleVerification.bind(this)
    this.Resendotp = this.Resendotp.bind(this)
  }
  // stepper start
  handleNext = () => {
    const { username, password, gender, name, mobile, selectedDate, activeStep, otp, aGradeId, pincode } = this.state
    if (activeStep === 0) {
      if (!username || !password || !gender || !name || !mobile || !selectedDate || !aGradeId || !pincode) {
        this.props.alert.warning('Please enter required fields')
        return
      } else {
        if (this.state.count === 0) {
          this.setState({ sendingData: true })
          this.handleFormSubmit()
        }
        this.setState({ count: this.state.count + 1 })
      }
    } else if (activeStep === 1) {
      if (!otp) {
        this.props.alert.warning('Please enter required fields')
        return
      } else {
        this.handleVerification()
      }
    }
    let steps = getSteps()
    if (activeStep === (steps.length)) {
      setTimeout(() => { window.location.assign('/login') }, 200)
      console.log('verification compleated')
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: this.state.activeStep - 1
    }))
    if (this.state.activeStep === 1) {
      this.setState({ count: 0 })
      this.setState({
        username: '',
        password: '',
        name: '',
        email: '',
        address: '',
        grade_id: '',
        aGradeId: '',
        gender: 'male',
        mobile: '',
        pincode: '',
        confirmPassword: '',
        selectedDate: '1998-01-10' })
    } else if (this.state.activeStep === 2) {
      this.setState({ count: 1 })
    }
  };

  // STEPPER END
  // OTP CODE

  handleOtpChange = otp => {
    this.setState({ otp })
  };

  // end hear
  handleChange (e) {
    const { name, value } = e.target
    this.setState(
      {
        [name]: value
      }
    )
  }

  handleDateChange (update) {
    this.setState({ selectedDate: update.format('YYYY-MM-DD') })
  }
  handlegender = (event) => {
    this.setState({ gender: event.target.value })
  }

  handleaddress = (event) => {
    this.setState({ address: event.target.value })
  };

  handlePassword (e) {
    let passwordEntered = e.target.value
    this.setState({ password: passwordEntered })
  }

  handleConfirmPassword (e) {
    let cpasswordEntered = e.target.value
    this.setState(
      {
        confirmPassword: cpasswordEntered
      }
    )
  }

  handleClickGrade = event => {
    this.setState({ aGradeId: event.value })
  }
  handlePincode=(e) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ pincode: e.target.value })
  }

  Resendotp (e) {
    let { username, name, email, password, confirmPassword, aGradeId, mobile, address, gender, selectedDate, pincode } = this.state
    if (password !== confirmPassword) {
      this.props.alert.error('Password Dont Match')
    }
    this.setState({ ResendOtpButton: false, ShowTimer: false })
    let data = {
      username: username,
      password: confirmPassword,
      name: name,
      email_address: email,
      address: address,
      grade_id: aGradeId,
      gender: gender,
      phone_number: mobile,
      date_of_birth: selectedDate,
      pincode: pincode
    }
    this.setState({ nameError: false, mailError: false })
    if (username && email && name && aGradeId && mobile && confirmPassword && selectedDate && gender && pincode) {
      axios
        .post(urls.GuestRegister, data)
        .then(res => {
          if (res.status === 201) {
            this.props.alert.success('OTP Re-Sent Successfully ')
            this.setState({ ShowTimer: true })
          } else {
            this.props.alert.error('Error Occured')
          }
        })
    }
  }

  handleVerification (e) {
    let { otp, mobile } = this.state
    let verify = {
      otp: otp,
      phone_number: mobile
    }
    if (otp && mobile) {
      axios
        .post(urls.VerifyGuestRegister, verify)
        .then(res => {
          if (res.status === 200) {
            // this.props.alert.success(res.verify)
            this.props.alert.success('Successfully Verified')
            this.setState({
              activeStep: this.state.activeStep + 1
            })
          } else {
            alert.props.alert.error('error occured')
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let a = error.response.data
            if (a) {
              this.props.alert.error(`${a.status}`)
            }
          }
          console.log("Error: Couldn't fetch data from " + urls.VerifyGuestRegister, error)
        })
    }
  }

  handleFormSubmit (e) {
    // e.preventDefault()
    let { username, name, email, password, confirmPassword, aGradeId, mobile, address, gender, selectedDate, pincode } = this.state
    if (password !== confirmPassword) {
      this.props.alert.error('Password Dont Match')
    } else if (!aGradeId) {
      this.props.alert.error('Select Grade')
    }
    let data = {
      username: username,
      password: confirmPassword,
      name: name,
      email_address: email,
      address: address,
      grade_id: aGradeId,
      gender: gender,
      phone_number: mobile,
      date_of_birth: selectedDate,
      pincode: pincode
    }

    this.setState({ nameError: false, mailError: false })
    if (username && email && name && aGradeId && mobile && confirmPassword && selectedDate && gender && pincode) {
      axios
        .post(urls.GuestRegister, data)
        .then(res => {
          if (res.status === 201) {
            let { status } = res.data
            this.props.alert.success(`${status}`)
            this.setState({ activeStep: this.state.activeStep + 1, sendingData: false })
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let a = error.response.data
            if (a) {
              this.props.alert.error(a.status)
              this.setState({ count: 0, sendingData: false })
            }
          }
          if (error.response && error.response.status === 500) {
            this.props.alert.error('Email is not Entered Properly')
            this.setState({ count: 0, sendingData: false })
          }
          console.log("Error: Couldn't fetch data from " + urls.GuestRegister, error)
        })
    }
  }

  componentWillMount () {
    this.props.loadGrades()
  }
  render () {
    let { nameError, mailError, activeStep } = this.state
    console.log(this.props.grades, 'dffffffffff')
    const { classes } = this.props
    let steps = getSteps()
    return localStorage.getItem('id_token')
      ? <Redirect to={{ pathname: '/dashboard' }} /> : <main className={classes.main}>
        <CssBaseline />
        <Paper elevation={10} className={classes.paper}>
          {/* <img alt='' src={require('./logo.png')} width='250px' /> */}
          <img src={window.location.host === 'www.alwaysonlearning.com' ? require('./logoaol.png') : require('./logo.png')} alt='logo' width='250px' />
          <Typography component='h1' variant='h5'>
            Guest Registration
          </Typography>
          <Typography component='h4' varient='h4' />
          <div className={classes.root}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            {this.state.activeStep === 0 ? <form className={classes.form} onSubmit={this.handleFormSubmit}>
              <FormControl margin='normal' required fullWidth error={nameError}>
                <InputLabel htmlFor='text'>User Name  </InputLabel>
                <Input type='text' name='username' autoFocus onChange={this.handleChange} placeholder='Enter User Name' required />
                {nameError ? <p style={{ color: 'red' }} className={classes.validationLabels}>Username already exits</p> : ''}
                {this.state.username ? this.state.username.length >= 5
                  ? <p className={classes.validationLabels} style={{ color: 'green' }}> valid username </p>
                  : <p className={classes.validationLabels} style={{ color: 'red' }} /> : ''
                }
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='text'>Your Name </InputLabel>
                <Input type='text' name='name' onChange={this.handleChange} placeholder='Enter Name' />
              </FormControl>
              <FormControl margin='normal' required fullWidth error={mailError}>
                <InputLabel htmlFor='email'>Your Email </InputLabel>
                <Input name='email' type='email' onChange={this.handleChange} placeholder='Enter Email' />
                {mailError ? <p className={classes.validationLabels} style={{ color: 'red' }}>Email already exits</p> : ''}
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='mobile'>Your Mobile </InputLabel>
                <Input type='number' name='mobile' onChange={this.handleChange} placeholder='Enter Mobile' />
                {this.state.mobile ? this.state.mobile.length === 10
                  ? <p className={classes.validationLabels}style={{ color: 'green' }}>Valid</p>
                  : <p className={classes.validationLabels}style={{ color: 'red' }}>Must be a valid contact number</p> : ''
                }
                {this.state.mobile ? this.state.mobile.length > 10
                  ? <p style={{ color: 'red' }}>Invalid</p>
                  : <p style={{ color: 'red' }} /> : ''
                }
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                {/* */}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    style={{ margin: 8 }}
                    label='Date of Birth *'
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              <FormControl component='fieldset' className={classes.formControl} margin='normal' required fullWidth>
                <FormLabel component='legend'>Gender</FormLabel>
                <RadioGroup
                  aria-label='gender'
                  name='gender1'
                  className={classes.group}
                  value={this.state.gender}
                  onChange={this.handlegender}
                >
                  <FormControlLabel value='male' control={<Radio />} label='Male' />
                  <FormControlLabel value='female' control={<Radio />} label='Female' />
                  <FormControlLabel value='other' control={<Radio />} label='Other' />
                </RadioGroup>
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='password'>Password </InputLabel>
                <Input type='password' onChange={this.handlePassword} placeholder='Password' autoComplete='new-password' />
                {this.state.password ? this.state.password.length >= 5
                  ? <p style={{ color: 'green' }} />
                  : <p className={classes.validationLabels} style={{ color: 'red' }}>Enter minimum 5 character or more for your password</p> : ''
                }
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='password'>Confirm Password</InputLabel>
                <Input type='password' onChange={this.handleConfirmPassword} placeholder='Password' />
                {this.state.confirmPassword ? this.state.confirmPassword === this.state.password
                  ? <p className={classes.validationLabels}style={{ color: 'green' }}>Password Matched</p>
                  : <p className={classes.validationLabels}style={{ color: 'red' }}>Password Don't Match</p> : ''
                }
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <TextField
                  id='standard-multiline-flexible'
                  label='Address'
                  multiline
                  rowsMax='4'
                  placeholder='Enter Address'
                  value={this.state.address}
                  onChange={this.handleaddress}
                  className={classes.textField}
                  margin='normal'
                />

              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='pin code'>Pin Code</InputLabel>
                <Input type='number' name='pincode' onChange={(e) => this.handlePincode(e)} placeholder='Enter Pin Code' value={this.state.pincode} />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <Select
                  placeholder='Select Grade *'
                  fluid
                  search
                  selection
                  options={
                    this.props.grades
                      ? this.props.grades.map(grades => ({
                        value: grades.id,
                        label: grades.grade
                      }))
                      : null
                  }
                  change={this.handleClickGrade}
                />
              </FormControl>

              <p><strong>Note:</strong>Fields marked * are required </p>

            </form> : ''}
            {this.state.activeStep === 1
              ? <div>
                <p><strong>Note:</strong>OTP has been send to your Registred Mobile No and Gmail </p>
                <h3> Enter Verification Code</h3>
                <div>
                  <OtpInput
                    inputStyle={{
                      width: '2rem',
                      height: '2rem',
                      margin: '30px 10px 30px 10px',
                      fontSize: '2rem',
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.3)'
                    }}
                    value={this.state.otp}
                    onChange={this.handleOtpChange}
                    numInputs={6}
                    separator={<span><b>-</b></span>}
                    shouldAutoFocus
                  />
                </div>
                <div style={RESEND}>
                  <Grid item style={{ paddingTop: 17 }}>
                    <Button
                      onClick={this.Resendotp}
                      className={classes.button}
                    >Resend OTP</Button>

                  </Grid>
                  {this.state.ShowTimer && <Timer
                    initialTime={120000}
                    direction='backward'
                    checkpoints={[
                      {
                        time: 0,
                        callback: () => this.setState({ ResendOtpButton: true, ShowTimer: false })
                      }
                    ]}
                  >
                    <Grid item style={{ paddingTop: 17 }}>
                      <Timer.Minutes /> :
                      <Timer.Seconds /></Grid>
                  </Timer>}
                </div>
              </div>

              : ''}
            <React.Fragment>
              <div>
                {/* {this.activeStep === steps.length ? (
                  <div>
                    {this.state.loading ? <Typography className={classes.instructions}>
                  Loading....
                    </Typography> : <Button
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                  Back
                    </Button>}
                  </div>
                ) : ( */}
                <div>
                  {this.state.sendingData ? <InternalPageStatus label={'Sending ...'} /> : ''}
                  <div style={BUTTONS}>
                    <Button
                      disabled={this.state.activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={this.state.activeStep === steps.length + 1}
                      variant='contained'
                      color='primary'
                      className={classes.button}
                      onClick={this.handleNext}
                    >
                      {this.state.activeStep === steps.length ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
                {/* )} */}
              </div>
            </React.Fragment>
          </div>
        </Paper>
      </main>
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items
})

const mapDispatchToProps = dispatch => ({
  loadGrades: () => dispatch(apiActions.listGrades())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterGuest))
