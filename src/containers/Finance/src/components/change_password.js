import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
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

class ChangePassword extends Component {
  constructor (props) {
    super(props)
    var auth = new AuthService()
    let user = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).personal_info : undefined
    let username = user ? user.email : undefined
    this.role = user ? user.role : undefined
    this.auth_token = auth.getToken()
    this.state = {
      username,
      password: '',
      confirmPassword: ''
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

  handleFormSubmit (e) {
    e.preventDefault()
    console.log(this.state)
    let {
      username,
      password,
      confirmPassword
    } = this.state
    if (!username || !confirmPassword || !password) { this.props.alert.warning('Please enter required fields'); return }
    if (password !== confirmPassword) { return }
    //  delete this.state.confirmPassword
    // var  { username, password,confirmPassword } = this.state

    // axios.put('api url',JSON.stringify(this.state),{}).then((res)=>{}).catch(er=>{})
    // debugger
    // let x =this.auth_token
    axios
      .post(qBUrls.change_password, JSON.stringify(this.state), {
        headers: {
          Authorization: 'Bearer ' + this.auth_token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        // console.log('then',res);
        console.log('Status', res.status)
        if (res.status === 200) {
          this.props.alert.success('password changed successfully')
          this.setState({ password: '', confirmPassword: '' })
        } else {
          this.props.alert.error('password not chnage')
        }
      }).catch(error => {
        console.clear()
        console.log(error)
      })
  }

  render () {
    const { classes } = this.props
    return <div className={classes.div}><form className={classes.form} onSubmit={this.handleFormSubmit}>
      <FormControl margin='normal' required fullWidth>
        <InputLabel htmlFor='email'>Username</InputLabel>
        <Input id='username' name='username' disabled={this.role !== 'Admin'} autoComplete='username' error={this.props.error} value={this.state.username} autoFocus onChange={this.handleChange} />
        <FormHelperText style={{ display: !this.props.error && 'none' }} error>Wrong Email or Password </FormHelperText>
      </FormControl>
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
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
      >
            submit

      </Button>
    </form></div>
  }
}
ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  reset_password: (username, password, confirmPassword) => dispatch(userActions.login(username, password, confirmPassword))
})
const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  error: state.authentication.error
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChangePassword))
