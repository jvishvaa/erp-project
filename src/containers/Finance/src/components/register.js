import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { urls } from '../urls'
import { apiActions } from '../_actions'

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

export class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      first_name: '',
      email: '',
      gradeId: '',
      branchId: '',
      applicantId: '',
      name: '',
      role: '',
      contact: '',
      nameError: false,
      mailError: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleRole = this.handleRole.bind(this)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState(
      {
        [name]: value
      }
    )
  }

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

  handleClickBranch = event => {
    this.props.gradeMapBranch(event.value)
    this.setState({ aBranchId: event.value })
  }

  handleClickGrade = event => {
    this.setState({ aGradeId: event.value })
  }

  handleRole= event => {
    this.setState({ role: event.value })
  }

  handleFormSubmit (e) {
    e.preventDefault()
    let { username, name, email, password, confirmPassword, aGradeId, aBranchId, role,
      mobile } = this.state
    if (password !== confirmPassword) {
      this.props.alert.error('Password Dont Match')
    } else if (!aBranchId) {
      this.props.alert.error('Select Branch')
    } else if (!aGradeId) {
      this.props.alert.error('Select Grade')
    } else if (!role) {
      this.props.alert.error('Select Role')
    }

    let data = {
      username: username,
      password: confirmPassword,
      name: name,
      email: email,
      gradeId: aGradeId,
      branchId: aBranchId,
      role_id: role,
      contact: mobile
    }

    this.setState({ nameError: false, mailError: false })
    if (username && email && name && aBranchId && aGradeId && role && mobile && confirmPassword) {
      axios
        .post(urls.Applicant, data)
        .then(res => {
          if (res.status === 201) {
            this.props.alert.success(res.data)
            setTimeout(() => { window.location.assign('/login') }, 200)
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let [a] = error.response.data
            if (a === 'User Created') {
              this.props.alert.error('User name already exists')
            } else {
              this.props.alert.error(error.response.data)
            }
            if (error.response.data[0].includes('name')) {
              this.setState({ nameError: true })
            } else if (error.response.data[0].includes('mail')) {
              this.setState({ mailError: true })
            }
          } else {
            this.props.alert.error('Error Occured')
          }
          console.log("Error: Couldn't fetch data from " + urls.Applicant, error)
        })
    }
  }

  render () {
    let { nameError, mailError } = this.state
    const { classes } = this.props
    /* global localStorage */
    return localStorage.getItem('id_token')
      ? <Redirect to={{ pathname: '/dashboard' }} /> : <main className={classes.main}>
        <CssBaseline />
        <Paper elevation={1} className={classes.paper}>
          {/* <img alt='' src={require('./logo.png')} width='250px' /> */}
          <img src={window.location.host === 'www.alwaysonlearning.com' ? require('./logoaol.png') : require('./logo.png')} alt='logo' width='250px' />
          <Typography component='h1' variant='h5'>
            Register
          </Typography>
          <Typography component='h4' varient='h4' >with your Applicant Login</Typography>
          <form className={classes.form} onSubmit={this.handleFormSubmit}>
            <FormControl margin='normal' required fullWidth error={nameError}>
              <InputLabel htmlFor='text'>User Name (Your Applicant Id):</InputLabel>
              <Input type='text' name='username' autoFocus onChange={this.handleChange} placeholder='Enter Applicant Id' required />
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
              <InputLabel htmlFor='password'>Password </InputLabel>
              <Input type='password' onChange={this.handlePassword} placeholder='Password' />
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
              <label>Select Branch To Be Admitted</label>
              <Select
                placeholder='Select Branch'
                options={
                  this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : []
                }
                onChange={this.handleClickBranch}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <label>Select Grade </label>
              <Select
                placeholder='Select Grade'
                options={
                  this.props.grades
                    ? this.props.grades.map(grades => ({
                      value: grades.grade.id,
                      label: grades.grade.grade
                    }))
                    : []
                }
                onChange={this.handleClickGrade}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <label>Select Role </label>
              <Select
                placeholder='Select Role'
                options={this.props.role &&
                  this.props.role.filter(role => role.role_name === 'Applicant')
                    .map(role => ({ value: role.id, label: role.role_name }))
                }
                onChange={this.handleRole}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              Register
            </Button>
          </form>
        </Paper>
      </main>
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  role: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  listRole: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Register))
