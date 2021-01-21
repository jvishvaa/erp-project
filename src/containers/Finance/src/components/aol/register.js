import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Timer from 'react-compound-timer'
// import Alert from '@material-ui/lab/Alert'
import OtpInput from 'react-otp-input'
import { makeStyles } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, Grid, Select, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Stepper, Step, StepLabel, MenuItem, InputLabel, Modal } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { urls } from '../../urls'
import cityList from './cityList'
import AolLogin from './aolLogin'
import './aol.css'
import logoName from './assets/logo_name.png'

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 225
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  outlined: {
    zIndex: 0
  },
  paper: {
    position: 'absolute',
    width: '350px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #fff',
    boxShadow: theme.shadows[5],
    padding: '10px 20px',
    borderRadius: '10px',
    outlineColor: 'transparent'
    // padding: theme.spacing(2, 4, 3)
  }
}))

function getSteps () {
  return ['User Details', 'Verification']
}

// const sessionValue = sessionStorage.getItem('digital')

function RegisterationForm (props) {
  // registeration states
  const [userName, setUserName] = useState([])
  const [firstName, setFirstName] = useState([])
  const [password, setPassword] = useState([])
  const [confirmPassword, setConfirmPassword] = useState([])
  const [email, setEmail] = useState([])
  // const [email1, setEmail1] = useState('')
  const [mobile, setMobile] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1998-01-10')
  const [gender, setGender] = useState('male')
  const [city, setCity] = useState('')
  const [cityName, setCityName] = useState('')
  const [school, setSchool] = useState([])
  // const [address, setAddress] = useState('')
  const [pinCode, setPinCode] = useState([])
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState([])
  // for error handling states
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  // const [resendOtp, setResendOtp] = useState(true)
  const [showTimer, setShowTimer] = useState(true)
  const [modalStyle] = useState(getModalStyle)
  const [showModal, setShowModal] = useState(false)
  // const [showTable, setTable] = useState(false)
  const [fields, setFields] = useState([{ value: null }])
  // const [value, setValues] = useState([])
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  // eslint-disable-next-line no-unused-vars
  const [details, setDetails] = useState([{ name: '', gender: '' }])

  useEffect(() => {
    fetchGrades()
    // console.log(details, 'detail')
  }, [])

  let steps = getSteps()

  const handleModal = (title) => {
    setShowModal(!showModal)
  }

  function handleAddChild () {
    console.log('clicked')
    setOpen(true)
    if (open === true) {
      const values = [...fields]
      values.push({ value: null })
      console.log(values.length - 1)
      setFields(values)
    }
  }

  function handleRemove (i) {
    const values = [...fields]
    values.splice(i, 1)
    setFields(values)
  }

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 style={{ textAlign: 'center' }} id='simple-modal-title'>Login</h2> */}
      {/* <p style={{ textAlign: 'center' }}>Currently Signin is not activated as registrations are going on. This will be activated in few days.</p> */}
      <AolLogin alert={props.alert} />
    </div>
  )

  const fetchGrades = () => {
    setLoading(true)
    // let url = 'https://erp.letseduvate.com/qbox/accounts/grade/'
    axios
      .get(urls.GRADE, {
      // headers: {
      //   Authorization: 'Bearer ' + payload.user
      // }
      }).then(response => {
        let removeGrades = [1, 17, 18, 21, 16, 26, 27, 25, 24, 35, 29, 28, 30, 42, 60, 61, 58, 59, 45, 51, 53, 43, 47, 48, 46, 52, 54, 50, 44, 49]
        const newSetGrade = response.data.filter((grade) => !removeGrades.includes(grade.id))
        // console.log('newSetgrades', newSetGrade)
        setGrades(newSetGrade)
        setLoading(false)
      // Message('hi')
      }).catch(error => {
        console.error(error)
        setLoading(false)
      })
  }
  const userNameHandler = (i, event) => {
    const values = [...userName]
    values[i] = event.target.value
    setUserName(values)
    // (event.target.value)
    console.log(userName.toString().length, 'username')
  }

  function firstNameHandler (i, event) {
    console.log(event.target.value, 'firstname')
    const values = [...firstName]
    values[i] = event.target.value
    setFirstName(values)
  }

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  const mobileHandler = (event) => {
    setMobile(event.target.value)
  }
  const dobHandler = (i, event) => {
    const values = [...dateOfBirth]
    values[i] = event.target.value
    setDateOfBirth(values)
    // setDateOfBirth(event.target.value)
  }
  const genderHandler = (i, event) => {
    const values = [...gender]
    values[i] = event.target.value
    setGender(values)
  }
  const passwordHandler = (i, event) => {
    const values = [...password]
    values[i] = event.target.value
    setPassword(values)
    console.log(password, confirmPassword, 'password')
  }
  const confirmPasswordHandler = (i, event) => {
    const values = [...confirmPassword]
    values[i] = event.target.value
    setConfirmPassword(values)
  }

  const pinCodeHandler = (i, event) => {
    const values = [...pinCode]
    values[i] = event.target.value
    setPinCode(values)
  }
  const gradeChangeHandler = (i, event) => {
    const values = [...selectedGrade]
    values[i] = event.target.value
    setSelectedGrade(values)
  }

  const cityHandler = (event, value) => {
    console.log('Event: ', event)
    console.log('Value: ', value)
    setCity(value && value.City ? value.City : '')
  }

  const cityNameHandler = (event) => {
    setCityName(event.target.value)
  }

  const schoolHandler = (i, event) => {
    const values = [...school]
    values[i] = event.target.value
    setSchool(values)
    // setSchool(event.target.value)
  }

  const handleNext = () => {
    // const { userName, password, gender, firstName, mobile, dateOfBirth, activeStep, otp, selectedGrade } = this.state
    if (activeStep === 0) {
      if (!userName || !password || !gender || !firstName || !mobile || !dateOfBirth || !selectedGrade || !city || !pinCode) {
        props.alert.warning('Please enter required fields')
        return
      } else {
        // if (this.state.count === 0) {
        // this.setState({ sendingData: true })
        // handleFormSubmit()
        // }
        handleFormSubmit()
        // setActiveStep(activeStep + 1)
        // this.setState({ count: this.state.count + 1 })
      }
    } else if (activeStep === 1) {
      if (!otp) {
        props.alert.warning('Please enter required fields')
        return
      } else {
        handleVerification()
        // setActiveStep(activeStep + 1)
      }
    }
    // let steps = getSteps()
    if (activeStep === (steps.length)) {
      // setTimeout(() => { window.location.assign('/login') }, 200)
      props.history.location.push('/thankyou')
      // handleModal()
      console.log('verification completed')
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
    if (activeStep === 1) {
    } else if (activeStep === 2) {
      // this.setState({ count: 1 })
    }
  }

  const handleFormSubmit = () => {
    console.log(pinCode.length, 'vali')

    // handling source tracking for digital marketing
    let temp = window.sessionStorage.getItem('digital')
    console.log('history temp : ', JSON.parse(temp))
    let source = JSON.parse(temp)
    let utmSource = ''
    let utmMedium = ''
    let utmCampaign = ''
    let utmTerm = ''
    let utmGclid = ''
    let utmPlacement = ''
    let utmExp = ''
    let utmNetwork = ''
    let utmAdgroup = ''
    let utmContent = ''
    let utmExt = ''
    let utmPosition = ''
    if (source && source.length) {
      for (let i = 0; i < source.length; i++) {
        let item = source[i].split('=')
        console.log('item: ', item)
        if (item[0] === 'utm_source') {
          utmSource = item[1]
        } else if (item[0] === 'utm_medium') {
          utmMedium = item[1]
        } else if (item[0] === 'utm_campaign') {
          utmCampaign = item[1]
        } else if (item[0] === 'utm_term') {
          utmTerm = item[1]
        } else if (item[0] === 'gclid') {
          utmGclid = item[1]
        } else if (item[0] === 'utm_placement') {
          utmPlacement = item[1]
        } else if (item[0] === 'utm_experiment') {
          utmExp = item[1]
        } else if (item[0] === 'utm_network') {
          utmNetwork = item[1]
        } else if (item[0] === 'utm_adgroup') {
          utmAdgroup = item[1]
        } else if (item[0] === 'utm_content') {
          utmContent = item[1]
        } else if (item[0] === 'utm_extension') {
          utmExt = item[1]
        } else if (item[0] === 'utm_position') {
          utmPosition = item[1]
        }
      }
    }
    // console.log('sessionStorage:', value)
    if (/\s/.test(userName)) {
      props.alert.warning('Username cant have space!')
      return
    }

    if (city === 'Not Listed' && cityName.length === 0) {
      props.alert.warning('Enter city name!')
      return
    }
    if (password.toString() !== confirmPassword.toString()) {
      // console.log(password[idx], 'idx')

      props.alert.warning('Password Dont Match')
      return
    }
    if (!selectedGrade) {
      props.alert.warning('Select Grade')
      return
    }

    let details = []
    firstName.forEach((item, index) => {
      console.log(firstName, 'first')

      details.push({ username: userName[index],
        password: confirmPassword[index],
        name: firstName[index],
        // email_address: email,
        address: '',
        grade_id: selectedGrade[index],
        gender: gender[index],
        // phone_number: mobile,
        date_of_birth: dateOfBirth[index],
        city: city === 'Not Listed' ? cityName : city,
        school: school[index],
        source: 'aol',
        pincode: pinCode[index] })
    })
    let data = {
      email_address: email,
      phone_number: mobile,
      details,
      // date_of_birth: dateOfBirth,
      // city: city === 'Not Listed' ? cityName : city,
      // school: school,
      // source: 'aol',
      // pincode: pinCode,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      gclid: utmGclid,
      utm_placement: utmPlacement,
      utm_experiment: utmExp,
      utm_network: utmNetwork,
      utm_adgroup: utmAdgroup,
      utm_content: utmContent,
      utm_extension: utmExt,
      utm_position: utmPosition
    }
    console.log(data, 'data')

    // this.setState({ nameError: false, mailError: false })
    if (userName && email && firstName && selectedGrade && mobile && confirmPassword && dateOfBirth && gender) {
      setLoading(true)
      // let url = 'https://erp.letseduvate.com/qbox/accounts/register/student/guest/'
      axios
        .post(urls.GuestRegister, data)
        .then(res => {
          if (res.status === 201) {
            let { status } = res.data
            props.alert.success(`${status}`)
            // this.setState({ activeStep: this.state.activeStep + 1, sendingData: false })
            setActiveStep(activeStep + 1)
          } else {
            props.alert.warning('Error Occured')
          }
          setLoading(false)
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let a = error.response.data
            if (a) {
              props.alert.warning(a.status)
              // this.setState({ count: 0, sendingData: false })
            }
          }
          if (error.response && error.response.status === 500) {
            props.alert.warning('Email is not Entered Properly')
            // this.setState({ count: 0, sendingData: false })
          }
          setLoading(false)
          // console.log('Error: Couldn't fetch data from ' + urls.GuestRegister, error)
        })
    }
  }

  const handleOtpChange = (otp) => {
    setOtp(otp)
  }

  const resendOtpHandler = () => {
    // let { username, name, email, password, confirmPassword, aGradeId, mobile, address, gender, selectedDate } = this.state
    setShowTimer(false)
    // this.setState({ ResendOtpButton: false, ShowTimer: false })

    let details = []
    firstName.forEach((item, index) => {
      console.log(firstName, 'first')

      details.push({ username: userName[index],
        password: confirmPassword[index],
        name: firstName[index],
        // email_address: email,
        address: '',
        grade_id: selectedGrade[index],
        gender: gender[index],
        // phone_number: mobile,
        date_of_birth: dateOfBirth[index],
        city: city === 'Not Listed' ? cityName : city,
        school: school[index],
        source: 'aol',
        pincode: pinCode[index] })
    })
    let data = {
      email_address: email,
      phone_number: mobile,
      details
    }
    // this.setState({ nameError: false, mailError: false })
    if (userName && email && firstName && selectedGrade && mobile && confirmPassword && dateOfBirth && gender) {
      setLoading(true)
      // let url = 'https://erp.letseduvate.com/qbox/accounts/register/student/guest/'
      axios
        .post(urls.GuestRegister, data)
        .then(res => {
          if (res.status === 201) {
            props.alert.success('OTP Re-Sent Successfully ')
            // this.setState({ ShowTimer: true })
            setShowTimer(true)
          } else {
            props.alert.warning('Error Occured')
          }
          setLoading(false)
        })
    }
  }
  const handleVerification = () => {
    // verification
    // let { otp, mobile } = this.state
    let verify = {
      otp: otp,
      phone_number: mobile
    }
    if (otp && mobile) {
      setLoading(true)
      // let url = 'https://erp.letseduvate.com/qbox/accounts/register/student/guest/verify/'
      axios
        .post(urls.VerifyGuestRegister, verify)
        .then(res => {
          // this.props.alert.success(res.verify)
          props.alert.success('Successfully Verified')
          window.location.assign('/thankyou')
          // setActiveStep(activeStep + 1)
          // this.setState({
          //   activeStep: this.state.activeStep + 1
          // })
          setLoading(false)
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let a = error.response.data
            if (a) {
              props.alert.warning(`${a.status}`)
            }
          }
          setLoading(false)
          // console.log('Error: Couldn't fetch data from ' + urls.VerifyGuestRegister, error)
        })
    }
  }
  return (
    <div className='login-header'>
      <img src={logoName} className='App-logo' alt='logo' />
      <h2>User Registration</h2>
      <h3 style={{ margin: 0 }}>Please fill in student's details below.</h3>
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
      {activeStep === 0
        ? <React.Fragment>
          <div className={classes.formControl}>

            <TextField variant='outlined' style={{ width: 225 }} error={userName[0] && userName[0].length <= 5} helperText={userName[0] && userName[0].length <= 5 ? 'More than 5 characters.' : ''} type='text' name='userName' value={userName[0]} label='Username*' onChange={e => userNameHandler(0, e)} />

          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} type='text' name='firstName' value={firstName[0]} label='Full Name*' onChange={e => firstNameHandler(0, e)} />
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} type='text' name='email' label='Email*' value={email} onChange={emailHandler} />
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} error={mobile && mobile.length !== 10} helperText={mobile && mobile.length !== 10 ? '10 Digits only' : ''} type='number' name='mobile' label='Mobile Number*' value={mobile} onChange={mobileHandler} />
            {/* {mobile.length <= 11 ? <p style={{ color: 'red', fontSize: 10 }}>Username should be more than 5 characters</p> : <p style={{ color: 'green', fontSize: 10 }}>Valid Username</p>} */}
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' type='date' name='date' label='Child`s Date of Birth' style={{ width: 225 }} value={dateOfBirth[0]} onChange={e => dobHandler(0, e)} />
          </div>
          <div className={classes.formControl}>
            <FormControl component='fieldset' className={classes.formControl} margin='normal' fullWidth>
              <FormLabel component='legend'>Gender*</FormLabel>
              <RadioGroup
                aria-label='gender'
                name='gender1'
                // className={classes.group}
                value={gender[0]}
                onChange={e => genderHandler(0, e)}
                // style={{ display: 'flex' }}
              >
                <FormControlLabel value='male' control={<Radio />} label='Male' />
                <FormControlLabel value='female' control={<Radio />} label='Female' />
                <FormControlLabel value='other' control={<Radio />} label='Other' />
              </RadioGroup>
            </FormControl>
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} error={password[0] && password[0].length < 7} helperText={password[0] && password[0].length < 7 ? ' Min 6 characters' : ''} type='password' name='password' value={password[0]} label='Password*' onChange={e => passwordHandler(0, e)} />
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} error={password[0] !== confirmPassword[0]} helperText={confirmPassword[0] && password[0] !== confirmPassword[0] ? 'password not match' : ''} type='password' name='confirmPassword' value={confirmPassword[0]} label='Confirm Password*'onChange={e => confirmPasswordHandler(0, e)} />
          </div>
          <div className={classes.formControl}>
            {/* <TextField variant='outlined' style={{ width: 225 }} type='text' name='city' label='Current City*' value={city} onChange={cityHandler} /> */}
            <Autocomplete
              id='city'
              options={cityList}
              onChange={cityHandler}
              getOptionLabel={(option) => option.City}
              renderInput={(params) => <TextField {...params} label='City*' value={city} variant='outlined' />}
            />
          </div>
          {city === 'Not Listed'
            ? <div className={classes.formControl}>
              <TextField variant='outlined' style={{ width: 225 }} type='text' name='CityName' label='Enter City Name*' value={cityName[0]} onChange={e => cityNameHandler(0, e)} />
            </div>
            : ''}
          <div className={classes.formControl}>

            <TextField variant='outlined' style={{ width: 225 }} type='text' name='school' label='Child`s School' value={school[0]} onChange={e => schoolHandler(0, e)} />
          </div>
          <div className={classes.formControl}>
            <TextField variant='outlined' style={{ width: 225 }} error={pinCode[0] && pinCode[0].length !== 6} helperText={pinCode[0] && pinCode[0].length !== 6 ? 'Invalid pincode' : ''} type='number' name='pincode' value={pinCode[0]} label='Pin Code*' onChange={e => pinCodeHandler(0, e)} />
          </div>
          <div className={classes.margin}>
            <FormControl margin='normal' variant='outlined' className={classes.formControl}>
              <InputLabel>Grade*</InputLabel>
              <Select
                // placeholder='Grade*'
                label='Grade*'
                // labelId='label'
                onChange={e => gradeChangeHandler(0, e)}
              >
                {grades.length ? grades.map((grade) => {
                  return (<MenuItem value={grade.id}>{grade.grade}</MenuItem>)
                }) : []}
              </Select>
            </FormControl>
          </div>
          <Button variant='outlined' color='primary' style={{ marginLeft: '120px' }} onClick={handleAddChild}>
        Add Child
          </Button>
          {

            open

              ? <div>
                {fields.map((field, idx) => {
                  return (
                    <div key={`${field}-${idx}`}>

                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} error={userName[idx + 1] && userName[idx + 1].length <= 5} helperText={userName[idx + 1] && userName[idx + 1].length <= 5 ? 'More than 5 characters.' : ''} type='text' name='userName' value={userName[idx + 1]} label='Username*' onChange={e => userNameHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} type='text' name='firstName' value={firstName[idx + 1]} label='Full Name*'onChange={e => firstNameHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        <TextField variant='outlined' type='date' name='date' label='Child`s Date of Birth' style={{ width: 225 }} value={dateOfBirth[idx + 1]} onChange={e => dobHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        <FormControl component='fieldset' className={classes.formControl} margin='normal' fullWidth>
                          <FormLabel component='legend'>Gender*</FormLabel>
                          <RadioGroup
                            aria-label='gender'
                            name='gender1'
                            // className={classes.group}
                            value={gender[idx + 1]}
                            onChange={e => genderHandler(idx + 1, e)}
                            // style={{ display: 'flex' }}
                          >
                            <FormControlLabel value='male' control={<Radio />} label='Male' />
                            <FormControlLabel value='female' control={<Radio />} label='Female' />
                            <FormControlLabel value='other' control={<Radio />} label='Other' />
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} error={password[idx + 1] && password[idx + 1].length < 7} helperText={password[idx + 1] && password[idx + 1].length < 7 ? ' Min 6 characters' : ''} type='password' name='password' value={password[idx + 1]} label='Password*'onChange={e => passwordHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} error={password[idx + 1] !== confirmPassword[idx + 1]} helperText={confirmPassword[idx + 1] && password[idx + 1] !== confirmPassword[idx + 1] ? 'password not match' : ''} type='password' name='confirmPassword' value={confirmPassword[idx + 1]} label='Confirm Password*' onChange={e => confirmPasswordHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        {/* <TextField variant='outlined' style={{ width: 225 }} type='text' name='city' label='Current City*' value={city} onChange={cityHandler} /> */}
                        <Autocomplete
                          id='city'
                          options={cityList}
                          onChange={cityHandler}
                          getOptionLabel={(option) => option.City}
                          renderInput={(params) => <TextField {...params} label='City*' value={city} variant='outlined' />}
                        />
                      </div>
                      {city === 'Not Listed'
                        ? <div className={classes.formControl}>
                          <TextField variant='outlined' style={{ width: 225 }} type='text' name='CityName' label='Enter City Name*' value={cityName} onChange={cityNameHandler} />
                        </div>
                        : ''}
                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} type='text' name='school' label='Child`s School' value={school[idx + 1]}onChange={e => schoolHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.formControl}>
                        <TextField variant='outlined' style={{ width: 225 }} error={pinCode[idx + 1] && pinCode[idx + 1].length !== 6} helperText={pinCode[idx + 1] && pinCode[idx + 1].length !== 6 ? 'Invalid pincode' : ''} type='number' name='pincode' value={pinCode[idx + 1]} label='Pin Code*' onChange={e => pinCodeHandler(idx + 1, e)} />
                      </div>
                      <div className={classes.margin}>
                        <FormControl margin='normal' variant='outlined' className={classes.formControl}>
                          <InputLabel>Grade*</InputLabel>
                          <Select
                            // placeholder='Grade*'
                            label='Grade*'
                            // labelId='label'
                            onChange={e => gradeChangeHandler(idx + 1, e)}
                          >
                            {grades.length ? grades.map((grade) => {
                              return (<MenuItem value={grade.id}>{grade.grade}</MenuItem>)
                            }) : []}
                          </Select>
                        </FormControl>
                      </div>
                      <Button color='primary' onClick={() => handleRemove(idx)}>
                    Cancel
                      </Button>
                    </div>
                  )
                })}
              </div>

              : ''}

        </React.Fragment>
        : ''}
      {activeStep === 1
        ? <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p><strong>Note: </strong>OTP has been sent to your Registered Mobile No and Mail id. </p>
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
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              separator={<span><b>-</b></span>}
              shouldAutoFocus
            />
          </div>
          <div>
            <Grid item style={{ paddingTop: 10 }}>
              <Button
                onClick={resendOtpHandler}
                // className={classes.button}
                variant='outlined'
                color='secondary'
              >Resend OTP</Button>

            </Grid>
            {showTimer && <Timer
              initialTime={120000}
              direction='backward'
              checkpoints={[
                {
                  time: 0,
                  callback: () => {
                    // setResendOtp(true)
                    setShowTimer(false)
                  }
                }
              ]}
            >
              <Grid item style={{ paddingTop: 17 }}>
                <Timer.Minutes /> :
                <Timer.Seconds />
              </Grid>
            </Timer>}
          </div>
        </div>
        : ''}
      {activeStep === 2
        ? <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h1>Thank You for Registering!</h1>
          <p>You can click below to watch some fun educational videos or just jump right into a world of knowledge!</p>
          {/* <p>Expect a call from our councellor in next 4-5 days.. </p> */}
          <Link to='/videos' className='link-style'>
            <li><Button variant='contained' style={{ color: '#fff', background: '#46b6cf' }}>Watch Now</Button></li>
          </Link>
        </div>
        : ''}
      {/* {this.state.sendingData ? <InternalPageStatus label={'Sending ...'} /> : ''} */}
      <div style={{ margin: '20px 0px' }}>
        <Button
          disabled={activeStep === 0 || activeStep === 2}
          onClick={handleBack}
          className={classes.button}
        >
          Back
        </Button>
        <Button
          // disabled={activeStep === 2}
          variant='contained'
          // color='primary'
          style={{ background: '#52bdd1', color: '#fff' }}
          className={classes.button}
          onClick={handleNext}
        >
          {activeStep === steps.length ? 'Login' : 'Next'}
        </Button>
      </div>
      <Modal
        open={showModal}
        onClose={handleModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {modalBody}
      </Modal>
      {loading ? <Backdrop className={classes.backdrop} open={loading}><CircularProgress /></Backdrop> : ''}
    </div>
  )
}

export default RegisterationForm
