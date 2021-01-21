import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import Alert from '@material-ui/lab/Alert'
// import OtpInput from 'react-otp-input'
import { makeStyles } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, TextField, Button, Grid } from '@material-ui/core'
// import { Link } from 'react-router-dom'
// import Autocomplete from '@material-ui/lab/Autocomplete'
// import cityList from './cityList'
import AolForgotPassword from './aolForgotPassword'
import AolResetPassword from './aolResetPassword'
import { urls } from '../../urls'
import './aol.css'
import userLogo from './assets/user.svg'

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

function AolLogin (props) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [forgotToggle, setForgotToggle] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    console.log('login props: ', props)
    console.log()
  }, [props])

  const userNameHandler = (event) => {
    setUserName(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if (!userName.length || !password.length) {
      props.alert.warning('Enter username and password')
      return
    }
    const body = {
      username: userName,
      password: password,
      source: 'aol'
    }
    setLoading(true)
    axios
      .post(urls.LOGIN, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(user => {
        setLoading(false)
        console.log('res: ', user.data)
        if (user.data.personal_info && user.data.personal_info.token) {
          if (user.data.personal_info.role === 'Parent') {
            localStorage.setItem('user_profile', JSON.stringify({ personal_info: user.data.personal_info }))
            localStorage.setItem('parent_profile', JSON.stringify(user.data))
            localStorage.setItem('id_token', user.data.personal_info.token)
            console.log(user.data)
            window.location.reload()
            return user.data.personal_info.token
          }
          // store user.data details and jwt token in local storage to keep user.data logged in between page refreshes
          localStorage.setItem('user_profile', JSON.stringify(user.data))
          localStorage.setItem('id_token', user.data.personal_info.token)
          window.location.reload()
          return user.data.personal_info.token
        }
      }).catch(error => {
        setLoading(false)
        console.log(error)
        props.alert.error('Incorrect Username or Password')
        // alert('warning');
      })
  }

  const forgotHandler = (receivedData) => {
    console.log('after otp verifi: ', receivedData)
    if (receivedData === 'done') {
      setForgotToggle(false)
      return
    }
    if (receivedData && receivedData.user_id) {
      setUserData(receivedData)
    } else {
      setUserData(null)
    }
    setForgotToggle(!forgotToggle)
  }

  return (
    <React.Fragment>
      {userData && userData.user_id
        ? <AolResetPassword userData={userData} forgotHandler={forgotHandler} alert={props.alert} />
        : !forgotToggle
          ? <div className='login-header' style={{ minHeight: '1vh', position: 'relative' }}>
            <img src={userLogo} className='user-logo' alt='logo' />
            <h2>Welcome</h2>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>Please login using your Username/Phone Number/Email</h3>
            <form onSubmit={submitHandler}>
              <div className={classes.margin}>
                <Grid container spacing={1} alignItems='flex-end'>
                  <Grid item>
                    <TextField id='input-with-icon-grid' variant='outlined' name='userName' value={userName} label=' Username/Phone/Email' onChange={userNameHandler} />
                  </Grid>
                </Grid>
              </div>
              <div className={classes.margin}>
                <Grid container spacing={1} alignItems='flex-end'>
                  <Grid item>
                    <TextField id='input-with-icon' type='password' variant='outlined' name='password' value={password} label='Password' onChange={passwordHandler} />
                  </Grid>
                </Grid>
              </div>
              <span className='span-text' onClick={forgotHandler}> Forgot Password ?</span>
              <Button variant='contained' type='submit' style={{ background: '#46b6cf', color: '#fff', width: '100%', margin: '20px 0px' }} onClick={submitHandler}>Submit</Button>
            </form>
            {loading ? <Backdrop className={classes.backdrop} open={loading}><CircularProgress /></Backdrop> : ''}
          </div>
          : <AolForgotPassword forgotHandler={forgotHandler} alert={props.alert} />}
    </React.Fragment>
  )
}

export default AolLogin
