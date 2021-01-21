import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
// import FormHelperText from '@material-ui/core/FormHelperText'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import CloseButton from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import './loginPage.css'
import { userActions } from '../_actions'

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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

export class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      open: false,
      d: new Date(),
      webLink: '',
      showPassword: false,
      isClose: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount () {
    console.log('Win Loc: ', window.location.host)
    this.setState({
      webLink: window.location.host
    })
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState(
      {
        [name]: value
      }
    )
  }

  handleFormSubmit (e) {
    e.preventDefault()
    this.setState({ isClose: false })
    const { username, password, webLink } = this.state
    this.props.login(username, password, webLink)
  }
  redirection () {
    let userInfo = JSON.parse(localStorage.getItem('user_profile'))['personal_info']
    let userProfile = JSON.parse(localStorage.getItem('user_profile'))
    // if (userInfo && userInfo['force_update_credentials'] === true) {
    //   return <Redirect to={{ pathname: '/updatePassword' }} />
    // }
    if (userInfo && userInfo.role === 'Teacher') {
      return <Redirect to={{ pathname: '/homework' }} />
    } else if (userInfo && userInfo.role === 'Applicant') {
      return <Redirect to={{ pathname: 'questbox/viewTests' }} />
    } else if (userInfo && userInfo.role === 'Student') {
      let { parent_contact: parentContact } = userProfile || {}
      // parentContact = true
      if (parentContact === true) {
        return <Redirect to={{ pathname: '/studentWelcome' }} />
      } else {
        return <Redirect show={this.state.open} to={{ pathname: '/contact_updation' }} />
      }
    } else if (userInfo && userInfo.role === 'FinanceAdmin') {
      return <Redirect to={{ pathname: '/finance/dashboard' }} />
    } else if (userInfo && userInfo.role === 'FinanceAccountant') {
      return <Redirect to={{ pathname: '/financeAcc/dashboard' }} />
    } else if (userInfo && userInfo.role === 'GuestStudent') {
      return <Redirect to={{ pathname: '/studentWelcome' }} />
    } else if (userInfo && userInfo.role === 'Parent') {
      return <Redirect to={{ pathname: '/selectStudent/' }} />
    } else if (userInfo && userInfo.role === 'Management Admin') {
      return <Redirect to={{ pathname: '/management_dashboard/' }} />
    } else {
      return <Redirect to={{ pathname: '/dashboard' }} />
    }
  }

  handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  handleClickShowPassword=() => {
    let{ showPassword } = this.state
    this.setState({ showPassword: !showPassword })
  }
  handleClose=() => {
    let{ isClose } = this.state
    this.setState({ isClose: !isClose })
  }

  render () {
    const { classes } = this.props
    /* global localStorage */
    return localStorage.getItem('id_token')
      ? this.redirection() : <main className={classes.main}>
        <CssBaseline />
        <Paper elevation={1} className={classes.paper}>
          <img src={this.state.webLink === 'www.alwaysonlearning.com' || this.state.webLink === 'alwaysonlearning.com' || this.state.webLink === 'dev.alwaysonlearning.com' ? require('./logoaol.png') : require('./logo.png')} alt='logo' width='250px' />
          <Typography component='h1' variant='h5'>
         Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleFormSubmit}>

            { (!this.state.isClose && this.props.error) && <div className='validation-form-container' >
              <IconButton>
                <CloseButton onClick={this.handleClose} />
              </IconButton>
              <span style={{ paddingTop: '15px' }}>{this.props.error && typeof (this.props.error) === 'string' && this.props.error.includes('Inoperative') ? `Your Account Seems To Be Inoperative. You Are Requested To Contact Our School's Front Office` : this.props.error && typeof (this.props.error) === 'string' && this.props.error.includes('invalid') ? 'There was an error with your Password. Please try with valid Password.' : this.props.error && typeof (this.props.error) === 'string' ? 'There was an error with your User Name. Please try with valid User Name.' : 'Failed to login .Please check with your internet connection. '}</span>
            </div>
            }
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='email'>Username</InputLabel>
              <Input id='username' name='username' autoComplete='username' value={this.state.username} autoFocus onChange={this.handleChange}

              />
              {/* {(this.props.error !== 'User is not active') ? <FormHelperText style={{ display: !this.props.error && 'none' }} error>Wrong email or password </FormHelperText> : ''} */}
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input name='password' type={this.state.showPassword ? 'text' : 'password'} id='password' value={this.state.password} autoComplete='current-password' onChange={this.handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      edge='end'
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }

              />
              <br />
              <Link to='/forgot_password'>Forgot Password ?</Link>
            </FormControl>
            <Button
              style={{ marginTop: 5 }}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled={this.props.loggingIn}
              className={classes.submit}
            >
              {this.props.loggingIn ? <CircularProgress className={classes.progress} color='white' size={20} thickness={4} /> : 'Sign In'}

            </Button>
            <Divider />
            {/* <Register>register</Register> */}
            <Button size='small'>
              <Link to='/RegisterGuest'>Register as a Guest Student</Link>
            </Button>
            <Button className='btn__report--problem' size='small' color='primary'>
              <Link to='/report_problem'>Report a problem</Link>
            </Button>
            {/* <Link to='/resetPassword'>Forgot Password</Link> */}
          </form>
        </Paper>
        <br />
        <p>By proceeding, you agree to our&nbsp;
          <Link to='/terms_conditions'>Terms and Conditions </Link>
          &nbsp;and
          <Link to='/privacy_policy'>&nbsp;Privacy Policy.</Link></p>
        <footer style={{ backgroundColor: '#fff' }}>
          <strong >Copyright&copy; {this.state.d.getFullYear()}, K12 Techno Services. All Rights Reserved</strong>

        </footer>

      </main>
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  login: (username, password, webLink) => dispatch(userActions.login(username, password, webLink))
})
const mapStateToProps = state => ({
  user: state.authentication.user,
  loggingIn: state.authentication.loggingIn,
  error: state.authentication.error
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login))
