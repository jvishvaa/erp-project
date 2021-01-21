import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import { withStyles, TextField, Button, Grid } from '@material-ui/core'
import { urls } from '../../urls'
import ViewFeedbck from './viewFeedback'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
})

class Feedback extends React.Component {
  constructor () {
    super()
    this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    this.updatedId = []
    this.state = {
      mode: 'send',
      user_id: this.userId
    }
    this.handleMode = this.handleMode.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleMode (event, mode) {
    this.setState({ mode })
    if (mode === 'view') {
      axios
        .get(urls.Feedback + '?user_id=' + this.userId, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({ feedbackData: res.data })
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }

  validation () {
    let { subject, message } = this.state
    if (!subject) {
      this.props.alert.error('Enter title for the feedback')
      return false
    } else if (!message) {
      this.props.alert.error('Enter message for the feedback')
      return false
    } else {
      return true
    }
  }

  handleSubmit () {
    let error = this.validation()
    if (!error) {
      return
    }
    axios
      .post(urls.Feedback, this.state, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 201) {
          this.props.alert.success('Feedback sent Successfully')
          this.setState({
            subject: null,
            message: null
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  render () {
    let { mode, subject, message, feedbackData } = this.state
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid
          style={{ paddingTop: 16 }}
          container
          direction='row'
          justify='center'
          alignItems='center'
          item
        >
          <ToggleButtonGroup
            value={mode}
            onChange={this.handleMode}
            exclusive
          >
            <ToggleButton value='send'> Send Feedback </ToggleButton>
            <ToggleButton value='view'> View Sent Feedback </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {mode === 'send'
          ? <React.Fragment>
            <Grid style={{ padding: 20 }} item>
              <TextField
                required
                label='Title'
                className={classes.textField}
                margin='normal'
                variant='outlined'
                type='text'
                name='title'
                value={subject}
                fullWidth
                onChange={event => this.setState({ subject: event.target.value })}
              />
              <TextField
                required
                label='Message'
                className={classes.textField}
                margin='normal'
                variant='outlined'
                multiline
                rows='5'
                name='feedback'
                value={message}
                fullWidth
                onChange={event => this.setState({ message: event.target.value })}
              />
              <Button
                color='primary'
                variant='outlined'
                onClick={this.handleSubmit}>
                Send Feedback
              </Button>
            </Grid>
          </React.Fragment>
          : feedbackData
            ? <ViewFeedbck feedbackData={feedbackData} />
            : ''
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

Feedback.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Feedback))
