import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles, Card, CardHeader, Typography, AppBar, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Modal, Tooltip, IconButton } from '@material-ui/core'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
// import InfoIcon from '@material-ui/icons/Info'
import axios from 'axios'
import moment from 'moment'
import { urls } from '../../../urls'
import ResourceModal from './resourceModal'
import { InternalPageStatus, Pagination } from '../../../ui'
import Countdown from './CountDownTimer'
import OnlineClassFeedback from '../../OnlineClass/Feedback/OnlineClassFeedback'
import './onlineclass.css'
import { HomeworkStudentModal } from './HomeworkStudentModal'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
})

class OnlineClass extends Component {
  constructor () {
    super()

    this.state = {
      currentTime: this.formatedDate(new Date()),
      onlinClassData: [],
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      currentTab: 0,
      loading: true,
      isTabDisabled: true,
      currentPage: 1,
      totalPages: 0,
      seconds: 0,
      showDialog: false,
      interest: '',
      zoomId: '',
      onlineClassId: null,
      isModalOpen: false,
      resourceType: 'resource',
      isFeedbackOpen: false,
      showConfirmationDialog: false,
      onlineClsId: null,
      olClassIndex: null,
      classId: null,
      zoomMeetingId: null,
      showHomeworkModal: false,
      files: [],
      userProfile: JSON.parse(localStorage.getItem('user_profile')), // FIXME:
      allowedBranchIdsToJoinQuiz: [19, 8],
      feedbackZoomId: null,
      feedbackClassId: null
    }
  }

  componentDidMount () {
    this.getOnlineClass()
    this.interval = setInterval(() => this.tick(), 1000)
  }

  tick = () => {
    this.setState(state => ({
      seconds: state.seconds + 1
    }))
  }

  getOnlineClass = () => {
    const { currentTab, currentPage, personalInfo } = this.state
    axios.get(`${personalInfo.role === 'Student' ? urls.StudentOnlineClasses : urls.GuestStudentOnlineClasses}?is_completed=${currentTab !== 0}&page_number=${currentPage}&page_size=${10}`, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        this.setState({
          onlinClassData: res.data.data,
          loading: false,
          isTabDisabled: false,
          totalPages: res.data.total_pages
        })
      })
      .catch(err => {
        this.setState({ loading: false, isTabDisabled: false })
        this.props.alert.error(err.response ? err.response.data.status : 'Something went wrong')
      })
  }

  handleInterest = (event) => {
    const { value } = event.target
    this.setState({ interest: value })
  }

  submitInterest = () => {
    const { zoomId, interest, personalInfo } = this.state
    const formData = new FormData()
    formData.append('zoom_meeting_id', zoomId)
    formData.append('intrest', interest)
    axios.post(urls.GuestStudentOnlineClassInterest, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        this.props.alert.success(res.data.status)
        this.setState({ zoomId: '', interest: '', showDialog: false })
      })
      .catch(err => {
        this.props.alert.error(err.response ? err.response.data.status : 'Something went wrong')
      })
  }

  renderError = () => {
    return (
      <Dialog open={this.state.showDialog} onClose={() => {
        this.setState({ showDialog: false, interest: '', zoomId: '' })
      }} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title' style={{ color: '#eb4d4b' }}>Sorry. You cannot join this class as limit has been reached</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: 'black' }}>
            To show interest in this class, you can click the button below.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            onChange={this.handleInterest}
            type='email'
            fullWidth
            placeholder='Reason for showing interest (optional)'
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' variant='contained' onClick={this.submitInterest}>
            Show Interest
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  updateAcceptRejectStatus =(id) => {
    let { acceptRejectStatus = new Set() } = this.state
    acceptRejectStatus.delete(id)
    this.setState({ acceptRejectStatus })
  }

  postAcceptReject = (accept, index, id) => {
    const { onlinClassData, personalInfo } = this.state
    const path = personalInfo.role === 'Student' ? `${urls.StudentAcceptRejectClass}?StudentOnlineClassRecordId=${id}&is_accepted=${accept}` : `${urls.GuestStudentAcceptRejectClass}?zoom_meeting_id=${id}&is_accepted=${accept}`
    this.setState({ postAcceptRejectUnderProgress: true })
    let { acceptRejectStatus = new Set() } = this.state
    acceptRejectStatus.add(id)
    this.setState({ acceptRejectStatus })
    axios.post(path, '', {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        const classCopy = onlinClassData
        classCopy[index]['is_accepted'] = !!accept
        this.setState({ onlinClassData: classCopy, onlineClsId: null, olClassIndex: null })
        this.updateAcceptRejectStatus(id)
      })
      .catch(err => {
        if (err.response.data.is_restricted) {
          const classCopy = onlinClassData
          classCopy[index]['is_restricted'] = true
          this.setState({ onlinClassData: classCopy, showDialog: true, zoomId: id })
        }
        this.updateAcceptRejectStatus(id)
        // this.props.alert.error(err.response ? err.response.data.status : 'Something went wrong')
      })
  }

  handleAcceptReject (accept, index, id, isOptional) {
    if (!accept) {
      if (window.confirm('Are you sure you want to reject?')) {
        this.postAcceptReject(accept, index, id)
      }
    } else if (isOptional) {
      this.setState({ onlineClsId: id, showConfirmationDialog: true, olClassIndex: index })
    } else {
      this.postAcceptReject(accept, index, id)
    }
  }

  getTimeInMinutes = (time) => {
    const duration = moment.duration(moment(time).diff(moment.now()), 'milliseconds')
    const minutes = duration.minutes()
    return minutes
  }

  formatedDate = (dt) => {
    // returns date in yyyy-mm-dd hh:mm:ss
    const date = new Date()
    let dateStr =
      date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2) + ' ' +
      ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2) + ':' +
      ('00' + date.getSeconds()).slice(-2)
    return dateStr
  }

  isAcceptanceTime = (endTime) => {
    const currentTime = this.formatedDate(new Date())
    if (currentTime < endTime) {
      return true
    }
    return false
  }

  isJoinTime = (joinTime, endTime) => {
    const currentTime = this.formatedDate(new Date())
    if (currentTime > joinTime && currentTime < endTime) {
      return true
    }
    return false
  }

  handleFeedbackClick = (rating) => {
    const { zoomMeetingId, joinButtonIndex, feedbackClassId, feedbackZoomId } = this.state
    const formData = new FormData()
    formData.append('student_rating', rating)
    formData.append('zoom_meeting_id', feedbackZoomId)
    formData.append('class_id', feedbackClassId)
    axios.post(`${urls.OnlineClassFeedback}`, formData, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        const { message } = res.data
        this.props.alert.success(message)
        this.setState({ isFeedbackOpen: false, classId: null, zoomMeetingId: null, feedbackClassId: null, feedbackZoomId: null })
        this.handleJoin(zoomMeetingId, joinButtonIndex)
      })
      .catch(err => {
        console.log(err)
        this.setState({ isFeedbackOpen: false })
        this.props.alert.error('Failed to post feed back')
        this.handleJoin(zoomMeetingId, joinButtonIndex)
      })
  }

  renderFeedbackForm = (id) => {
    const { isFeedbackOpen } = this.state
    return (
      <div>
        <Modal
          open={isFeedbackOpen}
          onClose={() => { this.setState({ isFeedbackOpen: false }) }}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <div className='onlineclass__feedback--modal'>
            <div className='onlineclass__feedback--topbar'>
              <p className='onlineclass__feedback--topbartitle'>How was your last online class ?</p>
            </div>
            <div className='onlineclass__emoji--container'>
              <OnlineClassFeedback handleFeedBack={(rating) => { this.handleFeedbackClick(rating, id) }} feedbackType='numeric' />
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  handleJoin = (id, index) => {
    const path = this.state.personalInfo.role === 'Student' ? `${urls.StudentJoinOnlineClass}?StudentOnlineClassRecordId=${id}` : `${urls.GuestStudentJoinOnlineClass}?zoom_meeting_id=${id}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        const { join_url: joinUrl } = res.data
        window.open(joinUrl, '_blank')
      })
      .catch(err => {
        if (err.response.data.is_restricted) {
          const classCopy = this.state.onlinClassData
          classCopy[index]['is_restricted'] = true
          this.setState({ onlinClassData: classCopy, showDialog: true, zoomId: id })
        }
        this.props.alert.error(err.response ? err.response.data.status : 'Something went wrong')
      })
  }

  handleResourceView = (id, type) => {
    if (type === 'homework') {
      this.setState({ onlineClassId: id, showHomeworkModal: true, resourceType: type })
    } else {
      this.setState({
        onlineClassId: id,
        isModalOpen: true,
        resourceType: type
      })
    }
  }

  closeModalHandler = () => {
    this.setState({
      onlineClassId: null,
      isModalOpen: false
    })
  }
  closeHomeworkHandler = () => {
    this.setState({
      onlineClassId: null,
      showHomeworkModal: false
    })
  }

  quizLaunchHandler = (onlineClassId) => {
    axios.get(`${urls.OnlineClassQuizLink}?online_class_id=${onlineClassId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      if (res.data && res.data.length) {
        const index = res.data.length - 1
        if (res.data[index] && res.data[index].link) {
          window.open(res.data[index].link.trim())
        } else {
          this.props.alert.warning('Quiz Link is not ready yet')
        }
      } else {
        this.props.alert.warning('Quiz Link is not ready yet')
      }
    }).catch(err => {
      console.err(err)
      this.props.alert.warning('Quiz Link is not ready yet')
    })
  }

  handleJoinQuiz = (onlineClassId) => {
    const { personalInfo } = this.state
    axios.get(`${urls.QuizInfo}?online_class_id=${onlineClassId}`, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        if (res.status === 200) {
          const { data: responseData = {} } = res
          const { data: quizDetails } = responseData
          const { quiz_lobby_details: { lobby_uuid: uniqueLobbyId } = {} } = quizDetails
          if (uniqueLobbyId) {
            const url = `/quiz/start/${onlineClassId}`
            let link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.click()
            link.remove()
          } else {
            this.props.alert.warning(`Quiz lobby is not created yet. Please wait untill the host creates it`)
          }
        }
      })
      .catch(err => {
        const { message: errorMessage, response: { data: { status: { message: msgFromDeveloper } = {} } = {} } = {} } = err
        if (msgFromDeveloper) {
          this.props.alert.error(`${msgFromDeveloper}`)
        } else if (errorMessage) {
          this.props.alert.error(`${errorMessage}`)
        } else {
          this.props.alert.error(`Failed to connect to server`)
        }
      })
  }

  getFormattedTime = (time) => {
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const formattedTime = ('00' + hours).slice(-2) + ':' +
    ('00' + minutes).slice(-2) + ':' +
    ('00')
    return formattedTime
  }

  isBetween12and9 = (startTime) => {
    const start = '12:00:00'
    const end = '21:00:00'
    const classStartTime = this.getFormattedTime(new Date(startTime))
    if (classStartTime >= start && classStartTime <= end) {
      return true
    }
    return false
  }

  isBetween6and12 = (startTime) => {
    const start = '06:00:00'
    const end = '12:00:00'
    const classStartTime = this.getFormattedTime(new Date(startTime))
    if (classStartTime >= start && classStartTime <= end) {
      return true
    }
    return false
  }

  getPreviousHours = (startTime, hours) => {
    const start = new Date(startTime)
    start.setHours(start.getHours() - hours)
    return new Date(start)
  }

 optionalClassAcceptance = (onlineClass) => {
   const { start_time: startTime, end_time: endTime, is_optional: isOptional } = onlineClass
   if (!isOptional) {
     return false
   } else if (this.isBetween6and12(startTime)) {
     const prev = this.getPreviousHours(startTime, 12)
     const currentTime = new Date()
     return (currentTime > prev && currentTime < new Date(startTime)) || (currentTime < new Date(endTime) && currentTime > new Date(startTime))
   } else if (this.isBetween12and9(startTime)) {
     const prev = this.getPreviousHours(startTime, 4)
     const currentTime = new Date()
     return (currentTime > prev && currentTime < new Date(startTime)) || (currentTime < new Date(endTime) && currentTime > new Date(startTime))
   }
 }

 checkAcceptance = (olClass, id) => {
   if (!olClass.is_optional) {
     return !this.isAcceptanceTime(olClass.end_time, olClass.is_optional)
   } else {
     return !this.optionalClassAcceptance(olClass)
   }
 }

  renderAcceptRejectionButton = (olClass, index, id, isCanceled, onlineClassId) => {
    let { acceptRejectStatus = new Set(), personalInfo } = this.state
    return (
      <React.Fragment>
        {
          isCanceled
            ? <Typography style={{ marginLeft: 15 }} color='primary' variant='h6'>Class Cancelled</Typography>
            : <React.Fragment>
              <Tooltip title={`Note: Accept button for optional classes scheduled between 6AM-12PM and 12PM-9PM will be enabled 12 hours and 4 hours respectively before class starts`}>
                <IconButton style={{ backgroundColor: 'transparent', margin: 0 }}>
                  <Button
                    style={{ margin: '0px 20px' }}
                    variant='contained'
                    color='primary'
                    disabled={this.checkAcceptance(olClass) || acceptRejectStatus.has(id)}
                    onClick={() => { this.handleAcceptReject(true, index, id, olClass.is_optional) }}
                  >
                    {acceptRejectStatus.has(id) ? 'please wait..' : 'Accept'}
                  </Button>
                </IconButton>
              </Tooltip>
              {/* <Button
                variant='contained'
                color='secondary'
                disabled={!this.isAcceptanceTime(olClass.end_time, olClass.is_optional) || acceptRejectStatus.has(id)}
                onClick={() => this.handleAcceptReject(false, index, id)}
              >
                {acceptRejectStatus.has(id) ? 'please wait..' : 'Reject'}
              </Button> */}
              <Button
                variant='contained'
                color='primary'
                onClick={() => this.handleResourceView(onlineClassId, 'resource')}
              >
                Resources
              </Button>
              {
                this.state.currentTab !== 0 && this.state.personalInfo.role !== 'GuestStudent' ? (
                  <Button
                    variant='contained'
                    style={{ marginLeft: '20px', backgroundColor: '#821057', color: 'white', position: 'relative' }}
                    onClick={() => this.handleResourceView(onlineClassId, 'homework')}
                  >
                    <span style={{ backgroundColor: 'white', position: 'absolute', width: 10, height: 10, right: 0, top: 0 }} />
                    Homework
                  </Button>
                ) : null
              }
              <Button
                variant='outlined'
                style={{ marginLeft: '20px' }}
                color='primary'
                onClick={() => this.quizLaunchHandler(onlineClassId)}
              >
                <span style={{ backgroundColor: '#5d1049', position: 'absolute', width: 10, height: 10, right: 0, top: 0 }} />
                Launch Quiz
              </Button>
              {
                personalInfo.role === 'Student'
                  ? <Button
                    variant='contained'
                    style={{ marginLeft: '20px' }}
                    color='primary'
                    onClick={() => this.handleJoinQuiz(onlineClassId)}
                  >
                Join Quiz
                  </Button>
                  : ''
              }

            </React.Fragment>

        }

      </React.Fragment>
    )
  }

  renderJoinButton = (olClass, onlineClass, onlineClassId, index) => {
    return (
      <React.Fragment>
        <Button
          style={{ marginLeft: 20 }}
          onClick={() => {
            this.setState({ joinButtonIndex: index }, () => {
              this.checkPreviousClassAttendance(onlineClass, index)
            })
          }}
          disabled={!this.isJoinTime(olClass.join_time, olClass.end_time)}
          variant='contained' color='primary'
        >
        Join
        </Button>
        <Button
          variant='contained'
          style={{ marginLeft: '20px' }}
          color='primary'
          onClick={() => this.handleResourceView(onlineClassId, 'resource')}
        >
          Resources
        </Button>
        {
          this.state.personalInfo.role !== 'GuestStudent' && (
            <Button
              variant='contained'
              style={{ marginLeft: '20px', position: 'relative' }}
              color='primary'
              onClick={() => this.handleResourceView(onlineClassId, 'homework')}
            >
              <span style={{ backgroundColor: 'white', position: 'absolute', width: 10, height: 10, right: 0, top: 0 }} />
              Homework
            </Button>
          )
        }
        <Button
          variant='outlined'
          style={{ marginLeft: '20px', position: 'relative' }}
          color='primary'
          onClick={() => this.quizLaunchHandler(onlineClassId)}
        >
          <span style={{ backgroundColor: '#5d1049', position: 'absolute', width: 10, height: 10, right: 0, top: 0 }} />
          Launch Quiz
        </Button>
        {
          this.state.personalInfo.role === 'Student'
            ? <Button
              variant='contained'
              style={{ marginLeft: '20px' }}
              color='primary'
              onClick={() => this.handleJoinQuiz(onlineClassId)}
            >
                Join Quiz
            </Button>
            : ''
        }
      </React.Fragment>
    )
  }

  isClassEnded = (olClass) => {
    const currentTime = this.formatedDate(new Date())
    if (currentTime > olClass.end_time) {
      return true
    }
    return false
  }

  showTime = (startTime) => {
    const currentTime = this.formatedDate(new Date())
    if (currentTime < startTime) {
      return true
    }
    return false
  }

  handleTabChange = (value, tab) => {
    this.setState({ currentTab: tab, loading: true, isTabDisabled: true, currentPage: 1 }, () => {
      this.getOnlineClass()
    })
  }

  handlePagination = (page) => {
    this.setState({ currentPage: page, loading: true, isTabDisabled: true }, () => {
      this.getOnlineClass()
    })
  }

  checkPreviousClassAttendance = (onlineClass, index) => {
    const { id } = onlineClass
    const { user_id: userId, token } = this.state.personalInfo
    axios.get(`${urls.PreviousOnlineClassAttendaceChecker}?user_id=${userId}`, {

      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        const { is_attended: isAttended, feedback_submitted: feedbackSubmitted, online_class_id: clsId, zoom_meeting_id: zmId } = res.data
        if (isAttended && feedbackSubmitted === false) {
          this.setState({ isFeedbackOpen: true, classId: onlineClass.zoom_meeting ? onlineClass.zoom_meeting.online_class.id : onlineClass.online_class.id, zoomMeetingId: id, feedbackClassId: clsId, feedbackZoomId: zmId })
        } else {
          this.handleJoin(onlineClass.id, index)
        }
      })
      .catch(err => {
        this.handleJoin(onlineClass.id, index)
        this.props.alert.error(err.response ? err.response.data.status : 'Something went wrong')
      })
  }

  handleConfirmationClose = () => {
    this.setState({ showConfirmationDialog: false, olClassIndex: null, onlineClsId: null })
  }

  handleConfirmation = (isConfirmed, index, id) => {
    const { onlineClsId, olClassIndex } = this.state
    if (isConfirmed) {
      this.postAcceptReject(true, olClassIndex, onlineClsId)
      this.setState({ showConfirmationDialog: false, olClassIndex: null, onlineClsId: null })
    } else {
      this.setState({ showConfirmationDialog: false, olClassIndex: null, onlineClsId: null })
    }
  }

  renderConfirmationDialog = () => {
    const { showConfirmationDialog } = this.state
    return (
      <Dialog
        open={showConfirmationDialog}
        onClose={this.handleConfirmationClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>{'Please accept the class only when you are sure you can attend it. The spots are limited and this blocks a spot that can be used by someone else.'}</DialogTitle>
        <DialogActions>
          <Button variant='contained' onClick={() => { this.handleConfirmation(true) }} color='primary'>
            Confirm
          </Button>
          <Button variant='outlined' onClick={() => { this.handleConfirmation(false) }} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  setFiles = (files) => {
    this.setState({ files })
  }

  render () {
    const { classes } = this.props
    let { onlinClassData, currentTab, loading, isTabDisabled, personalInfo, showDialog } = this.state
    return (
      <React.Fragment>
        {
          showDialog
            ? this.renderError()
            : ''
        }
        <AppBar position='static' color='default' style={{ overflow: 'hidden' }}>
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid item>
              <Tabs value={currentTab} onChange={this.handleTabChange} aria-label='simple tabs example'>
                <Tab label='Upcoming Classes' disabled={isTabDisabled} />
                <Tab label='Completed Classes' disabled={isTabDisabled} />
              </Tabs>
            </Grid>
            <Grid item>
              <div style={{ height: '100%', right: 0 }}>
                <Pagination
                  rowsPerPageOptions={[10, 10]}
                  labelRowsPerPage={''}
                  page={this.state.currentPage - 1}
                  rowsPerPage={10}
                  count={(this.state.totalPages * 10)}
                  onChangePage={(e, i) => {
                    this.handlePagination(i + 1)
                  }}

                />
              </div>
            </Grid>
          </Grid>
        </AppBar>
        <div className='color__indicator--container'>
          <div>
            <span className='color__indicator--green' />
            <Typography variant='h6' style={{ display: 'inline-block' }}>Optional Class</Typography>
          </div>
        </div>
        {
          loading
            ? <InternalPageStatus label={'Loading classes'} />
            : <React.Fragment>
              {onlinClassData && onlinClassData.length <= 0
                ? <InternalPageStatus label={'No Online Classess Are Available'} loader={false} />
                : <div style={{ padding: 20 }}>
                  {onlinClassData && onlinClassData.length > 0 && onlinClassData.map((onlineClass, index) => {
                    const { online_class: olClass, is_canceled: isCanceled } = personalInfo.role === 'Student' ? onlineClass.zoom_meeting : onlineClass

                    return (
                      <Card className={classes.card} key={olClass.id} style={{ margin: '20px 0px', padding: 10, background: olClass.is_optional ? 'linear-gradient(to right bottom, #9DFFBE, #fff)' : 'white' }}>
                        {
                          olClass.is_assigned_to_parent
                            ? <div style={{ marginLeft: 20 }}>
                              <SupervisorAccountIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: '#eb8f83' }} />
                              <Typography variant='h6' style={{ display: 'inline-block' }}>Class for Parents</Typography>
                            </div>
                            : ''
                        }
                        <CardHeader
                          action={
                            <React.Fragment>
                              <Typography variant='h5' color='textPrimary' style={{ marginTop: 10 }}>Subject : {olClass.subject.subject_name}
                                {
                                  this.showTime(olClass.start_time)
                                    ? <Countdown timeTillDate={olClass.start_time} timeFormat={'YYYY-MM-DD h:mm:ss'} />
                                    : ''
                                }
                                <Typography variant='h5' color='textPrimary' style={{ marginTop: 10 }}>Join Limit for this class: {personalInfo.role === 'GuestStudent' ? olClass.guest_students_attendee_count : olClass.join_limit}</Typography>
                              </Typography>
                            </React.Fragment>
                          }
                          title={olClass.title}
                          subheader={<div style={{ marginTop: 10 }}>{moment(olClass.start_time).format('MMMM Do YYYY, h:mm:ss a')}</div>}
                        />
                        {
                          onlineClass.is_restricted && personalInfo.role === 'GuestStudent'
                            ? <Typography variant='h6' style={{ marginLeft: 15 }} color='primary'>You cannot accept as join limit has been reached</Typography>
                            : onlineClass.is_accepted === null
                              ? this.renderAcceptRejectionButton(olClass, index, onlineClass.id, isCanceled, onlineClass.zoom_meeting ? onlineClass.zoom_meeting.online_class.id : onlineClass.online_class.id)
                              : onlineClass.is_accepted
                                ? this.renderJoinButton(olClass,
                                  onlineClass,
                                  onlineClass.zoom_meeting ? onlineClass.zoom_meeting.online_class.id : onlineClass.online_class.id, index)
                                : <Typography variant='h6' style={{ marginLeft: 15 }} color='primary'>Rejected</Typography>
                        }
                        {
                          olClass.is_optional
                            ? <ExpansionPanel style={{ width: '50%', margin: '20px', borderRadius: 5 }}>
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                              >
                                <Typography>Click here to view description</Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <Typography>
                                  {olClass.description ? olClass.description : ''}
                                </Typography>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                            : ''
                        }
                        <div>
                          {this.renderFeedbackForm(onlineClass.id)}
                        </div>
                      </Card>
                    )
                  })
                  }
                </div>}
              {
                this.state.onlineClassId && (
                  <ResourceModal
                    isOpen={this.state.isModalOpen}
                    onClick={this.closeModalHandler}
                    alert={this.props.alert}
                    id={this.state.onlineClassId}
                    type={this.state.resourceType}
                    key={'resource_modal' + this.state.onlineClassId}
                  />
                )
              }
              {
                this.state.onlineClassId && (
                  <HomeworkStudentModal
                    isOpen={this.state.showHomeworkModal}
                    onClose={this.closeHomeworkHandler}
                    alert={this.props.alert}
                    files={this.state.files}
                    setFiles={this.setFiles}
                    id={this.state.onlineClassId}
                    key={'homework_model_' + this.state.onlineClassId}
                    type={this.state.resourceType}
                  />
                )
              }
              {this.renderConfirmationDialog()}
            </React.Fragment>
        }
        {/* {this.renderFeedbackForm()} */}
      </React.Fragment>)
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withRouter(withStyles(styles)(OnlineClass)))
