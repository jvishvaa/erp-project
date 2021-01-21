import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { Typography, Paper } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Divider } from 'semantic-ui-react'
// import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'
// import FormHelperText from '@material-ui/core/FormHelperText'

import AuthService from './AuthService'
import { qBUrls } from '../urls'
import { userActions } from '../_actions'

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
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  div: {
    display: 'flex'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    margin: 'auto',
    maxWidth: '500px',
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

class ResetPassword extends Component {
  constructor (props) {
    super(props)
    var auth = new AuthService()
    let user = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).personal_info : undefined
    this.role = user ? user.role : undefined
    this.auth_token = auth.getToken()
    this.state = {
      password: '',
      confirmPassword: '',
      reset_password_success: false,
      reset_password_failed: false,
      d: new Date()
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState(
      {
        [name]: value
      })
  }

  handlePassword (e) {
    let passwordEntered = e.target.value
    console.log(passwordEntered)
    this.setState({ password: passwordEntered })
  }

  handleConfirmPassword (e) {
    let cpasswordEntered = e.target.value
    this.setState({ confirmPassword: cpasswordEntered })
  }

  getUrlVars () {
    var vars = {}
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value
    })
    console.log(parts)
    return vars
  }

  handleFormSubmit (e) {
    let { location } = this.props
    e.preventDefault()
    console.log(this.state, location.state.data.user_id)
    // this.setState({ userId: location.state.data.user_id, uuid: location.state.data.uuid })
    let userId = location.state.data.user_id
    let uuid = location.state.data.uuid
    console.log(this.state.userId, 'USER')
    let {
      password,
      confirmPassword
    } = this.state
    let payload = { password, confirmPassword, user_id: userId, uuid }
    if (!confirmPassword || !password) { this.props.alert.warning('Please enter required fields'); return }
    if (password !== confirmPassword) { return }
    // let userid = location.state.data.user_id
    // let uuid = location.state.data.uuid
    axios
      .post(qBUrls.ResetPassword, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          ...this.auth_token ? { Authorization: 'Bearer ' + this.auth_token } : {}
        }
      })
      .then(res => {
        // console.log('then',res);
        console.log('Status', res.status)
        if (res.status === 200) {
          this.props.alert.success('Password Updated Successfully')
          this.setState({ password: '', confirmPassword: '' })
          e.stopPropagation()
          this.props.history.push(
            '/login/'
          )
        } else {
          this.props.alert.error('password not chnage')
        }
        this.setState({ reset_password_success: true })
      }).catch(error => {
        console.clear()
        console.log(error)
        if (error.response.status === 409) {
          this.props.alert.error('Link Expired enter valid Number or Email')
          e.stopPropagation()
          setTimeout(e => {
            this.props.history.push(
              '/forgot_password/'
            )
          }, 4000)
        }
        this.setState({ reset_password_failed: true })
      })
  }

  render () {
    const { classes } = this.props
    console.log(this.props.location.state.data, 'res')
    return <main className={classes.main}>
      <CssBaseline />
      <Paper elevation={1} className={classes.paper}>
        <img src={require('./logo.png')} alt='' width='350px' />
        <Typography component='h1' variant='h5'>
     Reset Password
        </Typography>
        <form className={classes.form} onSubmit={this.handleFormSubmit}>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='password'>New password </InputLabel>
            <Input type='password' onChange={this.handlePassword} placeholder='New password' value={this.state.password} />
          </FormControl>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='password'>Confirm Password</InputLabel>
            <Input type='password' value={this.state.confirmPassword} onChange={this.handleConfirmPassword} placeholder='Confirm password' />
            {this.state.confirmPassword ? this.state.confirmPassword === this.state.password
              ? <p style={{ color: 'green' }}>Password Matched</p>
              : <p style={{ color: 'red' }}>Password Doesn't Match</p> : ''
            }
          </FormControl>
          <Button
            style={{ marginTop: 5 }}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            // disabled={this.props.loggingIn}
            className={classes.submit}
          >
            {this.props.loggingIn ? <CircularProgress className={classes.progress} color='white' size={20} thickness={4} /> : 'Submit'}

          </Button>
          <Divider />
          {/* <Register>register</Register> */}
          {/* <Link to='/RegisterGuest'>Register as a Guest Student</Link> */}
          {/* <Link to='/resetPassword'>Forgot Password</Link> */}
        </form>
      </Paper>
      <br />
      <p>By proceeding, you agree to our
        <a href='http://letseduvate.com/terms-condition.html' >&nbsp;Terms of use</a>
      &nbsp;and
        <a href='http://letseduvate.com/privacy.html'>&nbsp;Privacy Policy.</a></p>
      <footer style={{ backgroundColor: '#fff' }}>
        <strong >Copyright&copy; {this.state.d.getFullYear()}, K12 Techno Services. All Rights Reserved</strong>

      </footer>

    </main>
  }
}
ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  reset_password: (password, confirmPassword) => dispatch(userActions.login(password, confirmPassword))
})
const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  error: state.authentication.error
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ResetPassword)))
