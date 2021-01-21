import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import PasswordStrengthBar from 'react-password-strength-bar'

import axios from 'axios'

import { urls } from '../../urls'

import { userActions } from '../../_actions'

import Tick from '../../assets/icon/tick.png'

import Wrong from '../../assets/icon/cross.png'

const styles = theme => ({
  main: {
    width: '100',
    display: 'block', // Fix IE 11 issue.
    padding: '10px',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  button: {
    'background-color': '#00bfff'
  },
  row: { textAlign: 'center', paddingLeft: 32, paddingRight: 32, paddingTop: 12 },
  validation: {
    paddingLeft: '9%',
    fontSize: '11px',
    color: '#848b8e'
  },
  display: {
    display: 'Flex',
    marginTop: '2%'
  },
  errorText: {
    marginLeft: '2%'
  }
})

function UpdatePassword ({ classes, alert }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [oldPasswordErrorStatus, setOldPasswordErrorStatus] = useState(false)
  const [newPasswordErrorStatus, setNewPasswordErrorStatus] = useState(false)
  const [confirmPasswordErrorStatus, setConfirmPasswordErrorStatus] = useState(false)
  const [checkMin, setcheckMin] = useState(false)
  const [checkLowercase, setcheckLowercase] = useState(false)
  const [checkUppercase, setcheckUppercase] = useState(false)
  const [checkSpecial, setcheckSpecial] = useState(false)
  const [checkNumber, setcheckNumber] = useState(false)

  function handleOldPasswordChange (e) {
    if (e.target.value.length === 0) {
      setOldPasswordErrorStatus(true)
    } else {
      setOldPasswordErrorStatus(false)
    }
    setOldPassword(e.target.value)
  }
  function handleNewPasswordChange (e) {
    console.log('vALUE', e.target.value.search(/^[a-zA-Z0-9- ,_]*$/))
    if (e.target.value.search(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/) === -1) {
      setNewPasswordErrorStatus(true)
    } else {
      setNewPasswordErrorStatus(false)
    }
    if (e.target.value.length >= 8) {
      setcheckMin(true)
    } else {
      setcheckMin(false)
    }
    // var regex = /^[0-9]+$/
    if (e.target.value.search(/[a-z]/) >= 0) {
      setcheckLowercase(true)
    } else {
      setcheckLowercase(false)
    }
    if (e.target.value.search(/[A-Z]/) >= 0) {
      setcheckUppercase(true)
    } else {
      setcheckUppercase(false)
    }
    if (e.target.value.search(/[0-9]/) >= 0) {
      setcheckNumber(true)
    } else {
      setcheckNumber(false)
    }
    if (e.target.value.search(/^[a-zA-Z0-9- ,_]*$/) >= 0) {
      setcheckSpecial(false)
    } else {
      setcheckSpecial(true)
    }
    setNewPassword(e.target.value)
  }
  function handleConfirmPasswordChange (e) {
    if (newPassword === e.target.value) {
      setConfirmPasswordErrorStatus(false)
    } else {
      setConfirmPasswordErrorStatus(true)
    }
    setConfirmPassword(e.target.value)
  }

  function handleUpdate () {
    setIsLoading(true)
    axios.post(urls.ResetPassword, {
      is_force_update_credentials: true,
      old_password: oldPassword,
      new_password: newPassword
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      alert.success('Successfully Updated.')
      userActions.logout()
    }).catch(e => {
      if (e.response.data.status && e.response.data.status.message === 'Old password was incorrect.') {
        alert.error('Looks like your old password was incorrect!')
        setOldPasswordErrorStatus(true)
        setIsLoading(false)
      } else {
        alert.error('Oops, something went Tick.')
      }
    })
  }

  return <main className={classes.main}>
    <CssBaseline />
    <Paper elevation={1} className={classes.paper}>
      {/* <img src={require('./logo.png')} alt='' width='350px' /> */}
      <Typography style={{ margin: 16 }} component='h1' variant='h5'>
   Update Your Password
      </Typography>
      <Typography className={classes.row} component='p' variant='p'>
   Hi there! Due to rising security concerns, you are asked to change your password.
      </Typography>
      <form className={classes.form} noValidate autoComplete='off'>
        <div className={classes.row}>
          <TextField
            InputLabelProps={{ shrink: true }}
            id='filled-password-input'
            label='Current Password'
            error={oldPasswordErrorStatus}
            fullWidth
            type='password'
            variant='outlined'
            value={oldPassword}
            onChange={handleOldPasswordChange}
            helperText={'Enter your current password'}
          />

        </div>
        <div className={classes.row}><TextField
          id='filled-password-input'
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={newPasswordErrorStatus}
          // helperText={`Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character`}
          label='New Password'
          type='password'
          variant='outlined'
          value={newPassword}
          onChange={handleNewPasswordChange}
        /></div>
        <div className={classes.validation}>
          <div className={classes.display}><img src={checkMin ? Tick : Wrong} width='4%' /> <div className={classes.errorText}>Minimum 8 characters</div></div>
          <div className={classes.display}><img src={checkUppercase ? Tick : Wrong} width='4%' /><div className={classes.errorText}>At least 1 Uppercase Alphabet</div></div>
          <div className={classes.display}><img src={checkLowercase ? Tick : Wrong} width='4%' /><div className={classes.errorText}>At least 1 Lowercase Alphabet</div></div>
          <div className={classes.display}><img src={checkNumber ? Tick : Wrong} width='4%' /><div className={classes.errorText}>At least 1 Number</div></div>
          <div className={classes.display}><img src={checkSpecial ? Tick : Wrong} width='4%' /><div className={classes.errorText}>At least 1 Special Character</div></div>
        </div>
        <div className={classes.row}>  <PasswordStrengthBar password={newPassword} /></div>
        <div className={classes.row}><TextField
          fullWidth
          error={confirmPasswordErrorStatus}
          InputLabelProps={{ shrink: true }}
          id='filled-password-input'
          label='Confirm Password'
          type='password'
          variant='outlined'
          value={confirmPassword}
          helperText={(newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword) && "Your password doesn't match"}
          onChange={handleConfirmPasswordChange}
        /></div>
        <div style={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 32, paddingRight: 32 }}><Button onClick={handleUpdate} disabled={(oldPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) || isLoading || confirmPasswordErrorStatus || newPasswordErrorStatus} variant='outlined' fullWidth>{isLoading ? <CircularProgress size={'0.875rem'} /> : 'Update'}</Button></div>
      </form>
    </Paper>

  </main>
}

export default withStyles(styles)(UpdatePassword)
