import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import Alert from '@material-ui/lab/Alert'
// import OtpInput from 'react-otp-input'
import { makeStyles } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, TextField, Button, Grid } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
// import { Link } from 'react-router-dom'
// import Autocomplete from '@material-ui/lab/Autocomplete'
// import cityList from './cityList'
import { qBUrls } from '../../urls'
import AuthService from './../AuthService'
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

function AolResetPassword ({ alert, forgotHandler, userData }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // const [userData, setUserData] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    let auth = new AuthService()
    setAuthToken(auth.getToken())
    // setUserData(userData)
    setLoading(false)
    console.log('userData reset: ', userData)
  }, [userData])

  const passwordHandler = (event) => {
    setPassword(event.target.value)
    setConfirmPassword('')
  }
  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value)
  }

  const confirmHandler = (e) => {
    // send ps
    e.preventDefault()
    // this.setState({ userId: location.state.data.user_id, uuid: location.state.data.uuid })
    let userId = userData && userData.user_id
    let uuid = userData && userData.uuid
    let payload = { password, confirmPassword, user_id: userId, uuid }
    if (!confirmPassword || !password) {
      alert.warning('Please enter required fields!')
      return
    }
    if (password !== confirmPassword) {
      alert.warning('Password did not match!')
      return
    }
    // let userid = location.state.data.user_id
    // let uuid = location.state.data.uuid
    console.log('auth: ', authToken)
    axios
      .post(qBUrls.resetPassword, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          ...authToken ? { Authorization: 'Bearer ' + authToken } : {}
        }
      })
      .then(res => {
        // console.log('then',res);
        console.log('Status', res.status)
        if (res.status === 200) {
          alert.success('Password Updated Successfully')
          // this.setState({ password: '', confirmPassword: '' })
          // e.stopPropagation()
          forgotHandler('Done')
        } else {
          alert.error('Password not changed')
        }
        // this.setState({ reset_password_success: true })
      }).catch(error => {
        console.clear()
        console.log(error)
        if (error.response.status === 409) {
          alert.error('Link Expired enter valid Number or Email')
          e.stopPropagation()
          setTimeout(e => {
            forgotHandler()
          }, 4000)
        }
        // this.setState({ reset_password_failed: true })
      })
  }

  return (
    <div className='login-header' style={{ minHeight: '1vh', position: 'relative' }}>
      <h3 style={{ fontSize: 20 }}>Enter new password</h3>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField style={{ width: '100%' }} error={password && password.length < 7} helperText={password && password.length < 7 ? 'Min 6 characters' : ''} type='password' name='password' value={password} label='Password*' onChange={passwordHandler} />
        </Grid>
        <Grid item xs={12}>
          <TextField style={{ width: '100%' }} error={password !== confirmPassword} helperText={confirmPassword && password !== confirmPassword ? 'Password Didnt Match' : ''} type='password' name='confirmPassword' value={confirmPassword} label='Confirm Password*' onChange={confirmPasswordHandler} />
        </Grid>
        <Grid item xs={5} style={{ marginTop: '20px' }}>
          <Button variant='outlined' color='secondary' onClick={forgotHandler} >
            <ArrowBackIcon />
            Go Back
          </Button>
        </Grid>
        <Grid item xs={7} style={{ marginTop: '20px' }}>
          <Button variant='contained' style={{ background: '#46b6cf', color: '#fff' }} onClick={confirmHandler}>
            Confirm Password
          </Button>
        </Grid>
      </Grid>
      {loading ? <Backdrop className={classes.backdrop} open={loading}><CircularProgress /></Backdrop> : ''}
    </div>
  )
}

export default AolResetPassword
