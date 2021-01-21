import React, { useState } from 'react'
import axios from 'axios'
import OtpInput from 'react-otp-input'
import Timer from 'react-compound-timer'
// import Alert from '@material-ui/lab/Alert'
// import OtpInput from 'react-otp-input'
import { makeStyles } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, Radio, FormControlLabel, TextField, Button, Grid, RadioGroup } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
// import { Link } from 'react-router-dom'
// import Autocomplete from '@material-ui/lab/Autocomplete'
// import cityList from './cityList'
import { qBUrls } from '../../urls'
import './aol.css'

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
  }
}))

function AolForgotPassword ({ alert, forgotHandler }) {
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [userName, setUserName] = useState('')
  const [otp, setOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [selectedValue, setSelectedValue] = useState('number')
  const [indexes, setIndexes] = useState(0)
  const [format, setFormat] = useState('')
  const [disabletextField, setDisableTextField] = useState(false)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  // useEffect(() => {

  // }, [props])
  const handleRadio = (event) => {
    if (event.target.name === 'number') {
      setSelectedValue('number')
      setUserName('')
      setEmail('')
      setIndexes(0)
      setFormat(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    } else {
      setSelectedValue('email')
      setNumber('')
      setUserName('')
      setIndexes(1)
      setFormat(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    }
  }

  const handleTextfield = (e) => {
    console.log('handler: ', e.target.value)
    if (e.target.name === 'number') {
      setNumber(e.target.value)
      setUserName('')
      setEmail('')
    } else {
      setEmail(e.target.value)
      setUserName('')
      setNumber('')
    }
  }
  const handle = (i, e) => {
    // if (e.target.name === 'userName') {
    //   setUserName(e.target.value)
    // } else if (e.target.name === 'email') {
    //   setUserName('')
    // }
    const values = [...userName]
    values[i] = e.target.value
    setUserName(values)
  }

  const TextFieldHandler = () => {
    // let{ email, number, indexes, Format, disabletextField } = this.state
    // let { classes } = this.props
    let mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
    let mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    const formdataArray = [{ label: 'Enter Your Phone Number', type: 'number', autoComplete: 'number', value: number, name: 'number', format: mobileFormat }, { label: 'Enter Your Email', type: 'email', autoComplete: 'email', value: email, name: 'email', format: mailFormat }]
    return (
      formdataArray.map((val, index) => {
        if (index === indexes) {
          return (
            <div>
              <TextField
                key={index + 1}
                required fullWidth
                id='standard-required'
                label={val.label}
                onChange={handleTextfield}
                // className={classes.textField}
                value={val.value || ''}
                type={val.type}
                name={val.name}
                autoComplete={val.autoComplete}
                disabled={disabletextField}
                // margin='normal'
                error={!val.value.match(format)}
                // variant='outlined'
                helperText={!val.value.match(format) ? (val.name === 'number' ? 'Please enter a 10 digit phone number' : 'Please enter a valid email address ') : ''}
              />
              <TextField required fullWidth id='standard-required' type='email' name='userName' disabled={disabletextField} value={userName} label='Username' onChange={e => handle(0, e)}
              />
            </div>

          )
        }
      })
    )
  }

  const handleSave = () => {
    // const { email, number } = this.state
    if (selectedValue === 'number' && number.length !== 10) {
      alert.warning('Please enter valid number!')
      return
    }
    if (selectedValue === 'email' && email.length === 0) {
      alert.warning('Please enter valid Email!')
      return
    }
    if (userName.length === 0) {
      alert.warning('Please enter Username')
      return
    }
    const formData = new FormData()
    if (selectedValue === 'email') {
      formData.append('email', email)
      formData.append('username', userName)
    } else {
      formData.append('phone_number', number)
      formData.append('username', userName)
    }
    // this.setState({ onSaveloading: true, showTimer: false })
    setShowTimer(false)
    setLoading(true)
    // console.log('urls: ', urls.SendOtp)
    axios.post(qBUrls.sendOtp, formData, {
    })
      .then(res => {
        console.log(JSON.stringify(res.data.status))
        alert.success(res.data.status)
        // this.setState({ otpSent: true, otp_sent: true, showTimer: true, onSaveloading: false, disabletextField: true })
        setOtpSent(true)
        setShowTimer(true)
        setDisableTextField(true)
        setLoading(false)
      })
      .catch(error => {
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          alert.error(JSON.stringify(message))
        } else {
          alert.error(JSON.stringify(status))
        }
        // this.setState({ onSaveloading: false })
        setLoading(false)
      })
  }

  const handleOtpChange = (e) => {
    setOtp(e)
  }

  const handleVerify = (e) => {
    // const { email, number, otp } = this.state
    const formData = new FormData()
    if (selectedValue === 'email') {
      formData.append('email', email)
      formData.append('username', userName)
    } else {
      formData.append('phone_number', number)
      formData.append('username', userName)
    }
    formData.append('otp', otp)
    // this.setState({ onVerifyloading: true })
    setLoading(true)
    axios.post(qBUrls.VerifyOtp, formData, {
    })
      .then(res => {
        alert.success('OTP verified successfully!')
        setLoading(false)
        console.log(res.data)
        //  history.push('/reset_password')
        // window.open(`${window.location.origin}/reset_password/${res.data}`, '_self')
        // this.setState({ resdata: res.data, redirect: true, resend_otp: false, otp_sent: false, otp: '', showTimer: false, onVerifyloading: false, Verified: true })
        forgotHandler(res.data)
      })
      .catch(error => {
        console.log(error.response.data)
        alert.error(error.response.data.status)
        // this.setState({ onVerifyloading: false })
        setLoading(false)
      })
  }

  return (
    <div className='login-header' style={{ minHeight: '1vh', position: 'relative' }}>
      <h3 style={{ fontSize: 20 }}>Reset your password</h3>
      <RadioGroup>
        <FormControlLabel
          control={
            <Radio
              checked={selectedValue === 'number'}
              onChange={handleRadio}
              value='number'
              name='number'

              aria-label='Number'
            />
          }
          label='Number'
        />
        <FormControlLabel
          control={
            <Radio
              checked={selectedValue === 'email'}
              onChange={handleRadio}
              value='email'
              name='email'

              aria-label='Email'
            />
          }
          label='Email'
        />
      </RadioGroup>
      {selectedValue.length && TextFieldHandler()}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {otpSent && <OtpInput
            inputStyle={{
              width: '2rem',
              height: '2rem',
              margin: '30px 10px 30px 0px',
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
          }
        </Grid> <Grid item xs={12}>

          {showTimer && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => setShowTimer(false)

              }
            ]}
          >
            <Grid item style={{ paddingTop: 10, fontSize: '20px' }}>
              <Timer.Minutes /> :
              <Timer.Seconds /></Grid>
          </Timer>
          }</Grid></Grid>
      {selectedValue && <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            onClick={forgotHandler}
            variant='outlined'
            color='secondary'
            disabled={loading}
            style={{ margin: '20px 0px' }}
          >
            <ArrowBackIcon />
            Go Back

          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            type='button'
            onClick={handleSave}
            variant='contained'
            color='primary'
            style={{ background: '#46b6cf', color: '#fff', width: '100%', margin: '20px 0px' }}
            disabled={loading}
          >
            {otpSent ? (loading ? 'RESENDING OTP...' : 'RESEND OTP') : (loading ? 'Confirming' + ' ' + selectedValue + '....' : 'Confirm' + ' ' + selectedValue)}

          </Button>
        </Grid>
        {otp.length === 6 ? <Grid item={12}> <Button
          onClick={handleVerify}
          variant='contained'
          color='primary'
          disabled={loading}
          style={{ background: '#46b6cf', color: '#fff', width: '100%' }}
        >
          { loading ? 'Verifying...' : 'Verify' }

        </Button></Grid> : ''}
        {/* {redirect ? <Redirect to={{ pathname: '/reset_password', state: { data: resdata } }} /> : ''} */}
      </Grid>}
      {loading ? <Backdrop className={classes.backdrop} open={loading}><CircularProgress /></Backdrop> : ''}
    </div>
  )
}

export default AolForgotPassword
