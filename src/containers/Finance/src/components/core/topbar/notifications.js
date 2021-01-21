import React from 'react'

import { connect } from 'react-redux'

import moment from 'moment'

import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
// import CloseButton from '@material-ui/icons/Close'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// import { CardHeader, CardContent } from '@material-ui/core'
import { CardContent, ListItem, ListItemText, Modal } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
// import { Redirect } from 'react-router'
// import Switch from '@material-ui/core/Switch'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemText from '@material-ui/core/ListItemText'
// import SnackbarContent from '@material-ui/core/SnackbarContent'
// import Snackbar from '@material-ui/core/Snackbar'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import { withStyles } from '@material-ui/core/styles'

import NotificationIcon from '@material-ui/icons/Notifications'

import axios from 'axios'
import { Toolbar } from '../../../ui'
import Firebase, { messages } from '../../Firebase/bloc'
import { urls } from '../../../urls'
import '../../css/staff.css'

const styles = () => ({
  paper: {
    marginTop: 28
  }
})

class Notifications extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      anchorEl: '',
      data: [],
      newMessages: [],
      user: {},
      noOfTimesSubscribed: 0,
      approve: false,
      item: '',
      showModal: false,
      tabValue: 0,
      openMessage: false,
      isapproved: false,
      loading: false
    }
    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)
    this.handleApproval = this.handleApproval.bind(this)
    this.ApproveStatusShuffle = this.ApproveStatusShuffle.bind(this)
    this.handleChangeStatusshuffleTab = this.handleChangeStatusshuffleTab.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.ModalclassName = this.ModalclassName.bind(this)
    this.getrequestdata = this.getrequestdata.bind(this)
  }

  componentDidMount () {
    messages.subscribe(data => { console.log(data, 'Data incoming..'); this.setState({ newMessages: [...this.state.newMessages, { body: data['firebase-messaging-msg-data'].notification.body, title: data['firebase-messaging-msg-data'].notification.title, uploaded_at: moment.now() }] }) })
  }
  onOpen (event) {
    this.setState({ data: [] }, () => {
      let role = ''
      let isPersonalInfoDefined = JSON.parse(localStorage.getItem('user_profile')) && (JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info)
      if (isPersonalInfoDefined) {
        role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
      }
      if (role === 'Admin' || role === 'Principal') {
        let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.acad_session_id : ''
        let branchId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.branch_id : ''
        let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
        let topicA = acadsessionId + '_' + roleId + '_' + branchId
        if (acadsessionId && roleId && branchId) {
          this.getNotification(topicA)
        }
      }
      if (role === 'Teacher') {
        let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].acad_session_id : ''
        let branchId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].branch_id : ''
        let sectionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].section_id : ''
        let gradeId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].grade_id : ''
        let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
        let topicA = acadsessionId + '_' + roleId + '_' + branchId
        let topicB = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId
        let topicC = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId + '_' + sectionId
        if (acadsessionId && roleId && branchId) {
          this.getNotification(topicA)
        }
        if (acadsessionId && roleId && branchId && gradeId) {
          this.getNotification(topicB)
        }
        if (acadsessionId && roleId && branchId && gradeId && sectionId) {
          this.getNotification(topicC)
        }
      }
      if (role === 'Student') {
        let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).acad_session_id
        let branchId = JSON.parse(localStorage.getItem('user_profile')).branch_id
        let sectionId = JSON.parse(localStorage.getItem('user_profile')).section_id
        let gradeId = JSON.parse(localStorage.getItem('user_profile')).grade_id
        let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
        let topicA = acadsessionId + '_' + roleId + '_' + branchId
        let topicB = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId
        let topicC = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId + '_' + sectionId
        if (acadsessionId && roleId && branchId) {
          this.getNotification(topicA)
        }
        if (acadsessionId && roleId && branchId && gradeId) {
          this.getNotification(topicB)
        }
        if (acadsessionId && roleId && branchId && gradeId && sectionId) {
          this.getNotification(topicC)
        }
      }

      let firebase = new Firebase()
      if (!_.isEqual(this.state.user, JSON.parse(localStorage.getItem('user_profile'))) && this.state.noOfTimesSubscribed === 0) {
        if (role === 'Student') {
          let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).acad_session_id
          console.log(acadsessionId)
          let branchId = JSON.parse(localStorage.getItem('user_profile')).branch_id
          let sectionId = JSON.parse(localStorage.getItem('user_profile')).section_id
          let gradeId = JSON.parse(localStorage.getItem('user_profile')).grade_id
          let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
          let topicA = acadsessionId + '_' + roleId + '_' + branchId
          let topicB = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId
          let topicC = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId + '_' + sectionId
          firebase.init().then(() => firebase.requestPermission().then(() => {
            if (acadsessionId && roleId && branchId) {
              firebase.subscribeToTopic(topicA)
            }
            if (acadsessionId && roleId && branchId && gradeId) {
              firebase.subscribeToTopic(topicB)
            }
            if (acadsessionId && roleId && branchId && gradeId && sectionId) {
              firebase.subscribeToTopic(topicC)
            }
            this.setState({ noOfTimesSubscribed: 1 })
          }).catch(e => console.log(e))).catch(e => console.log(e))
          this.setState({ user: JSON.parse(localStorage.getItem('user_profile')) })
        } else if (role === 'Teacher') {
          let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].acad_session_id : ''
          let branchId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].branch_id : ''
          let sectionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].section_id : ''
          let gradeId = JSON.parse(localStorage.getItem('user_profile')).academic_profile.length > 0 ? JSON.parse(localStorage.getItem('user_profile')).academic_profile[0].grade_id : ''
          let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
          let topicA = acadsessionId + '_' + roleId + '_' + branchId
          let topicB = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId
          let topicC = acadsessionId + '_' + roleId + '_' + branchId + '_' + gradeId + '_' + sectionId
          firebase.init().then(() => firebase.requestPermission().then(() => {
            if (acadsessionId && roleId && branchId) {
              firebase.subscribeToTopic(topicA)
            }
            if (acadsessionId && roleId && branchId && gradeId) {
              firebase.subscribeToTopic(topicB)
            }
            if (acadsessionId && roleId && branchId && gradeId && sectionId) {
              firebase.subscribeToTopic(topicC)
            }
            this.setState({ noOfTimesSubscribed: 1 })
          }).catch(e => console.log('error'))).catch(e => console.log('error'))
          this.setState({ user: JSON.parse(localStorage.getItem('user_profile')) })
        } else if (role === 'Admin' && JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.branch_name : '' === 'Central') {
          let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.acad_session_id : ''
          let branchId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.branch_id : ''
          let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
          let topicA = acadsessionId + '_' + roleId + '_' + branchId
          firebase.init().then(() => firebase.requestPermission().then(() => {
            if (acadsessionId && roleId && branchId) {
              firebase.subscribeToTopic(topicA)
            }
            this.setState({ noOfTimesSubscribed: 1 })
          }).catch(e => console.log(e))).catch(e => console.log(e))
          this.setState({ user: JSON.parse(localStorage.getItem('user_profile')) })
        } else if (role === 'Principal') {
          let acadsessionId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.acad_session_id : ''
          let branchId = JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.branch_id : ''
          let roleId = JSON.parse(localStorage.getItem('user_profile')).personal_info.role_id
          let topicA = acadsessionId + '_' + roleId + '_' + branchId
          firebase.init().then(() => firebase.requestPermission().then(() => {
            if (acadsessionId && roleId && branchId) {
              firebase.subscribeToTopic(topicA)
            }
            this.setState({ noOfTimesSubscribed: 1 })
          }).catch(e => console.log(e))).catch(e => console.log(e))
          this.setState({ user: JSON.parse(localStorage.getItem('user_profile')) })
          this.getApprovalNeedsData()
        }
      }
    })
    this.setState({ anchorEl: event.target, open: true })
  }

  onClose (event) {
    this.setState({ anchorEl: null, open: false })
  }
  getNotification (topic) {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return
    }
    this.setState({ loading: true })
    axios
      .get(urls.NotificationsHistory + `?condition='${topic}' in topics`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('id_token'),
          'Content-Type': 'application/json'
        }
      })

      .then(res => {
        console.log(res.data.length, res.data)
        this.setState((prevState) => ({ data: [...prevState.data, ...res.data] }))
        this.setState({ loading: false })
      })
      .catch(error => {
        console.log(error)
      })
  }
  ApproveStatusShuffle (data, mode) {
    // let erp = data.replace(/\D/g, '')
    let { student: { erp, id } = {} } = data

    let payload = {}

    if (mode === 'status_update') {
      payload = { erp: erp, status_update: mode }
      this.setState({ Erp: erp })
    } else {
      payload = { erp: erp, shuffled: mode }
      this.setState({ studentId: id })
    }

    this.setState({ isapproved: true })
    axios
      .post(urls.ApproveStatusShuffle, JSON.stringify(payload), {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })

      .then(res => {
        // window.alert('Approved successfully')
        // this.props.alert.success('Approved successfully')

        this.getApprovalNeedsData()
        this.setState({ isapproved: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({ isapproved: false })
        window.alert('Not approved')
      })
  }
  getApprovalNeedsData () {
    axios
      .get(urls.ApproveStatusShuffle, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })

      .then(res => {
        // window.alert('Approved successfully')
        this.setState({ NeedsApprovalStatus: res.data.status_updated_data, NeedsApprovalShuffle: res.data.shuffled_data })
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
        // window.alert('Not approved')
      })
  }

  handleApproval=(e) => {
    // e.preventDefault()
    let { history, location } = this.props
    let { openModal } = this.state
    this.setState({ showModal: true })
    console.log(history, location, openModal)
  }
  handleCloseModal () {
    this.setState({ showModal: !this.state.showModal })
  }
  handleChangeStatusshuffleTab (event, tab) {
    console.log(tab, 'tabbbbbbbbb')
    // let { tab1, tab2 } = this.state
    if (tab === 0) {
      this.setState({ tabValue: tab })
    } else if (tab === 1) {
      this.setState({ tabValue: tab })
    }
  }
  ModalclassName () {
    let{ isapproved } = this.state
    if (isapproved) {
      return 'notification-body'
    } else {
      return ''
    }
  }
  getrequestdata (data, mode) {
    if (mode === 'status_update') {
      if (data.student.status) {
        return 'Inactive'
      } else {
        return 'Active'
      }
    } else {
      return data.student.to_section.section_name
    }
  }
  render () {
    let { anchorEl, data, newMessages, isapproved, loading } = this.state
    let { classes } = this.props
    return JSON.parse(localStorage.getItem('user_profile')) && ((JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info && JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Student') || (JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info && JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Teacher') || (JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info && JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Admin' && JSON.parse(localStorage.getItem('user_profile')).academic_profile ? JSON.parse(localStorage.getItem('user_profile')).academic_profile.branch_name : '' === 'Central') || (JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info && JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Principal')) && <React.Fragment>
      <IconButton onClick={this.onOpen} style={{ color: 'white', marginRight: 16 }} >
        <Badge badgeContent={newMessages.length} color='secondary' >
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Popover
        classes={{
          paper: classes.paper
        }}
        open={this.state.open}
        anchorEl={anchorEl}
        onClose={this.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <ListSubheader style={{ backgroundColor: 'white', boxShadow: 'inset 0 0 3px rgba(0,0,0,0.15)' }}>Notifications</ListSubheader>
        <List style={{ maxHeight: 230, minWidth: 330, overflow: 'auto' }}>
          {loading ? 'Loading...' : (data.length > 0 ? data.map(item => {
            // console.log(item.title.includes('STUDENT SHUFFLED') ? item.body.replace(/\D/g, '') : 'nothing', 'body')
            // this.setState({ title: item.title })
            return <ListItem button>
              <ListItemText
                primary={item.title}
                secondary={<React.Fragment>
                  <Typography
                    component='span'
                    variant='body2'
                    color='textPrimary'
                  >
                    {item.body}
                  </Typography>&nbsp;&nbsp;
                  {moment(item.uploaded_at).fromNow()}
                </React.Fragment>} />
              {(JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info && JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Principal') && (item.title.includes('STUDENT SHUFFLED') || item.title.includes('STUDENT STATUS UPDATED')) ? <Button variant='outlined'
                style={{ right: '0px' }} onClick={(e) => this.handleApproval(item.body)}>check approvals</Button> : ''}
              {/* {showModal ? <Switch><Redirect exact to={{ pathname: '/student', state: { data: showModal } }} /></Switch> : ''} */}
            </ListItem>
          }) : 'No notifications.')}
        </List>
      </Popover>
      <div >
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.state.showModal}
          onClose={this.handleCloseModal}
        >

          <Card style={{
            position: 'fixed',
            top: '5%',
            left: '10%',
            width: '80vw',
            height: '80vh',
            overflow: 'auto'
          }}
          >
            <div className='notification'>
              {/* <CardHeader action={
                <IconButton>
                  <CloseButton onClick={this.handleCloseModal} />
                </IconButton>
              }title='All Approvals' /> */}

              <Grid >
                <Toolbar >
                  <Tabs value={this.state.tabValue} indicatorColor='primary' textColor='primary' onChange={this.handleChangeStatusshuffleTab} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Tab label='STATUS APPROVALS' />
                    <Tab label='SHUFFLE APPROVALS' />
                  </Tabs></Toolbar></Grid></div>
            {isapproved && <div className='notification-text'>wait approving..</div>}
            <div className={this.ModalclassName()}>

              {this.state.tabValue === 0 && <span>
                {this.state.NeedsApprovalStatus && this.state.NeedsApprovalStatus.length > 0 ? this.state.NeedsApprovalStatus.map((data, index) => {
                  console.log(data[0], data[index], index, 'index')
                  return (
                    <CardContent ><span><Chip label={'student erp:' + data.student.erp} /><span style={{ padding: '5px' }} /><Chip label={'status updated by:' + data.status_updated_by.name} /><span style={{ padding: '5px' }} /><Chip label={'request to Make:' + this.getrequestdata(data, 'status_update')} /></span><span style={{ padding: '80px' }} /><span style={{ position: 'absolute' }}><Button variant='contained'
                      color='primary' onClick={(e) => this.ApproveStatusShuffle(data, 'status_update')} disabled={data.student.erp === this.state.Erp}>approve</Button></span></CardContent>
                  )
                }) : <h5 style={{ marginTop: '180px', verticalAlign: 'middle', textAlign: 'center' }}>No more approvals</h5>}</span>}
              {this.state.tabValue === 1 &&
              <span> {this.state.NeedsApprovalShuffle && this.state.NeedsApprovalShuffle.length > 0 ? this.state.NeedsApprovalShuffle.map(data => {
                return (
                  <CardContent ><span><Chip label={'student erp:' + data.student.erp} /><span style={{ padding: '5px' }} /><Chip label={'section shuffled by:' + data.shuffled_by.name} /><span style={{ padding: '5px' }} /><Chip label={'request to Make:' + this.getrequestdata(data, 'shuffle')} /></span><span style={{ padding: '80px' }} /><Button variant='contained'
                    color='primary' onClick={(e) => this.ApproveStatusShuffle(data, 'shuffled')} disabled={data.student.id === this.state.studentId}>approve</Button></CardContent>
                )
              }) : <h5 style={{ marginTop: '180px', verticalAlign: 'middle', textAlign: 'center' }}>No more approvals</h5>}
              </span>}
            </div>
          </Card></Modal>
      </div>
      {/* <div>
        <Snackbar
          open={this.state.openMessage}
          onClose={this.handleCloseMessage}
          // TransitionComponent={state.Transition}
          message='Approval is pending ,wait for principal to approve'
          style={{ background: 'yellow', width: '40px' }}
        />
      </div> */}
    </React.Fragment>
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Notifications)))
