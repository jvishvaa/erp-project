import React, { Component } from 'react'
import { Paper,
  CssBaseline,
  Typography,
  TextField,
  Card,
  CardContent,
  Button
} from '@material-ui/core'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'
import GoogleRecaptcha from '../../ui/GoogleRecaptcha/GoogleRecaptcha'
import { browserCheck, getOS } from '../../_helpers/userAgent'
import './reportProblem.css'
import { urls } from '../../urls'

const styles = theme => ({
  main: {
    display: 'block',
    padding: '10px',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    height: '100vh',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 3
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2.5}px`
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  row: { textAlign: 'center',
    marginTop: 10
  }
})

export class ReportAProblem extends Component {
  constructor () {
    super()
    this.state = {
      files: [],
      email: '',
      username: '',
      erp: '',
      description: '',
      recaptchaToken: null,
      isEmailValid: false,
      key: 0,
      isSubmitting: false,
      disableButton: false
    }
  }

    getFileNameAndSize = (files) => {
      if (files.length) {
        const fileName = this.state.files && this.state.files.map(file => (
          <li key={file.name}>
            {file.name} - {file.size} bytes
          </li>
        ))
        return fileName
      }
      return null
    }

    isImageOrVideo = (files) => {
      if (files[0].name.match(/.(jpg|jpeg|png|mp4|ogg|webm)$/i)) {
        return true
      }
      return false
    }

    onDrop = (files) => {
      if (!this.isImageOrVideo(files)) {
        this.props.alert.warning('Please select only image or video file format')
        return
      } else if (files.length > 1) {
        this.props.alert.warning('You can only select a single file at a time')
        return
      }
      this.setState({ files: files })
    }

    handleSubmit = (event) => {
      this.setState({ isSubmitting: true })
      const { email, files, description, username, erp } = this.state
      const browser = browserCheck()
      if (!this.isFormValid()) {
        return
      }
      const formData = new FormData()
      formData.append('browser_name', browser[0])
      formData.append('browser_version', browser[1])
      formData.append('os_name', getOS())
      formData.append('title', email)
      formData.append('is_grievance', 'True')
      formData.append('is_reported', 'True')
      formData.append('grievance_sub_type', 3) // db id for desktop
      formData.append('grievance_type', 5) // db id for eduvate-app portal
      formData.append('file', files[0])
      formData.append('message', description)
      formData.append('username', username)
      formData.append('message', description)
      if (erp) formData.append('erp', erp)

      axios.post(urls.ReportIssue, formData)
        .then(res => {
          if (res.status === 200) {
            this.props.alert.success(`Successfully submitted your issue! Your issue will be fixed soon :)`)
            this.props.history.push('/')
          }
        })
        .catch(err => {
          console.log(err)
          this.props.alert.error('Something went wrong')
          this.setState({ isSubmitting: false })
        })
    }

    handleReCaptcha = (value) => {
      this.setState({ recaptchaToken: value })
    }

    handleInputChange = (event) => {
      const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      const { value, name } = event.target
      if (name === 'email') {
        value.match(emailRegexp) ? this.setState({ isEmailValid: true }) : this.setState({ isEmailValid: false })
      }
      this.setState({ [name]: value })
    }

    isFormValid = (show) => {
      const { isEmailValid, files, description, recaptchaToken, username } = this.state
      if (!username) {
        this.props.alert.warning('Please enter your name')
        return false
      }
      if (!isEmailValid) {
        this.props.alert.warning('Please enter a valid email address')
        return false
      }
      if (!description) {
        this.props.alert.warning('Please tell us What went wrong?')
        return false
      }
      if (!files.length) {
        this.props.alert.warning('Please upload a screenshot or screen recording of the issue')
        return false
      }
      if (!recaptchaToken) {
        this.props.alert.warning('Please check the Recaptcha field')
        return false
      }
      this.setState({ disableButton: true })
      return true
    }

    render () {
      const { files, email, description, key, isSubmitting, disableButton, username, erp } = this.state
      const { classes } = this.props

      return (
        <div className={classes.main}>
          <CssBaseline />
          <Paper elevation={1} className={classes.paper}>
            <Typography component='h1' variant='h5' className='report__problem--title'>
            Report a problem
            </Typography>
            <form
              className={classes.form}
              noValidate
              autoComplete='off'
              onSubmit={this.handleSubmit}
            >
              <div className={classes.row}>
                <label className='report__problem--label'>Enter your name</label>
                <TextField
                  id='report__problem--email'
                  fullWidth
                  type='text'
                  variant='outlined'
                  name='username'
                  value={username}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className={classes.row}>
                <label className='report__problem--label'>Enter your ERP</label>
                <TextField
                  id='report__problem--email'
                  fullWidth
                  type='text'
                  variant='outlined'
                  name='erp'
                  value={erp}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className={classes.row}>
                <label className='report__problem--label'>Enter your email</label>
                <TextField
                  id='report__problem--email'
                  fullWidth
                  type='text'
                  variant='outlined'
                  name='email'
                  value={email}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className={classes.row}>
                <label className='report__problem--label'>What went wrong?</label>
                <TextField
                  id='report__problem--issue'
                  multiline
                  fullWidth
                  rows={5}
                  variant='outlined'
                  name='description'
                  value={description}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className={classes.row}>
                <label className='report__problem--label'>Drag and drop or Click below to upload</label>
                <Dropzone onDrop={this.onDrop} >
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept
                  }) => (
                    <Card
                      elevation={0}
                      style={{
                        border: '1px solid black',
                        borderStyle: 'dotted',
                        padding: 5
                      }}
                      {...getRootProps()}
                      className='dropzone'
                    >
                      <CardContent>
                        <input {...getInputProps()} accept='.png, .jpg, .jpeg, .mp4, .ogg, .webm' />
                        <div>
                          {isDragAccept && 'Only image and video files will be accepted'}
                          {!isDragActive && 'Upload a screenshot or screen recording related to the issue'}
                        </div>
                        {this.getFileNameAndSize(files)}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </div>
              <div className={classes.row}>
                <GoogleRecaptcha key={key} onReCaptcha={(value) => { this.handleReCaptcha(value) }} />
              </div>
              <div style={{ paddingTop: 12 }}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleSubmit}
                  disabled={isSubmitting && disableButton}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Paper>

        </div>
      )
    }
}

export default withRouter(withStyles(styles)(ReportAProblem))
