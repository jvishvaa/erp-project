import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
// import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
// import MomentUtils from '@date-io/moment'
import FaceIcon from '@material-ui/icons/Face'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Card, CardContent, Typography, Chip, Avatar, Drawer, Link } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import AddMessage from '../message/msgcommunication'
import { urls } from '../../urls'
import { Toolbar } from '../../ui'
import { COMBINATIONS } from './gselectorConfig'
import GSelect from '../../_components/globalselector'

class Communicate extends Component {
  constructor () {
    super()
    this.state = {
      messages: [],
      currentPage: 1,
      openNewMessage: false,
      selectedDate: [],
      scrolled: false,
      loading: false
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleDelete = this.handleDelete.bind(this)
    this.onChange = this.onChange.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)
    this.get = this.get.bind(this)
    this.user_id = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    this.role = this.userProfile.personal_info.role
  }

  getSmsData = (path) => {
    axios.get(`${urls.communication}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          messages: res.data.filtered_data
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    console.log(academicProfile)
    let path = ''
    if (this.role === 'Admin') {
      path += `?page_number=${this.state.currentPage}`
      this.getSmsData(path)
    }
    if (this.role === 'Teacher' || this.role === 'AcademicCoordinator') {
      path += `?page_number=${this.state.currentPage}&user_id=${this.user_id}`
      this.getSmsData(path)
    } else if (this.role === 'Student') {
      this.studentId = this.userProfile.student_id
      path += `?page_number=${this.state.currentPage}&student_id=${this.studentId}`
      this.getSmsData(path)
    } else if (this.role === 'Principal') {
      this.branchId = this.userProfile.academic_profile.branch_id
      path += `?page_number=${this.state.currentPage}&branch_id=${this.branchId}`
      this.getSmsData(path)
    }
  }

  toggleModal = () => {
    this.props.onCloseMessage()
  }

  static getDerivedStateFromProps (props, state) {
    if (state.openNewMessage !== props.newMessage) {
      return {
        openNewMessage: props.newMessage
      }
    }
  }
  handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { currentPage } = this.state
    console.log(currentPage)
    let { target } = event
    if (this.role === 'Admin' || this.role === 'MIS') {
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        let { selectorData } = this.state
        let path = ''
        if (selectorData.section_mapping_id) {
          let sectionId = selectorData.section_mapping_id
          path += `?page_number=${this.state.currentPage + 1}&secmap_id=${sectionId}`
        } else if (selectorData.acad_branch_grade_mapping_id) {
          let gradeId = selectorData.acad_branch_grade_mapping_id
          path += `?page_number=${this.state.currentPage + 1}&acad_branch_grade_id=${gradeId}`
        } else if (selectorData.branch_id) {
          let branchId = selectorData.branch_id
          path += `?page_number=${this.state.currentPage + 1}&branch_id=${branchId}`
        } else {
          path += `?page_number=${this.state.currentPage + 1}`
        }
        axios.get(`${urls.communication}${path}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.setState({
              currentPage: this.state.currentPage + 1,
              messages: [...this.state.messages, ...res.data.filtered_data]
            })
          })
      }
    } else if (this.role === 'Teacher' || this.role === 'AcademicCoordinator') {
      this.user_id = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        // let { selectorData } = this.state
        let path = ''
        path += `?page_number=${this.state.currentPage + 1}&user_id=${this.user_id}`
        axios.get(`${urls.communication}${path}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.setState({
              currentPage: this.state.currentPage + 1,
              messages: [...this.state.messages, ...res.data.filtered_data]
            })
          })
      }
    } else if (this.role === 'Principal') {
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        let { selectorData } = this.state
        this.branchId = this.userProfile.academic_profile.branch_id
        let path = ''
        if (selectorData.section_mapping_id) {
          let sectionId = selectorData.section_mapping_id
          path += `?page_number=${this.state.currentPage + 1}&secmap_id=${sectionId}`
        } else if (selectorData.acad_branch_grade_mapping_id) {
          let gradeId = selectorData.acad_branch_grade_mapping_id
          path += `?page_number=${this.state.currentPage + 1}&acad_branch_grade_id=${gradeId}`
        } else {
          path += `?page_number=${this.state.currentPage + 1}&branch_id=${this.branchId}`
        }
        axios.get(`${urls.communication}${path}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.setState({
              currentPage: this.state.currentPage + 1,
              messages: [...this.state.messages, ...res.data.filtered_data]
            })
          })
      }
    } else if (this.role === 'Student') {
      this.studentId = this.userProfile.student_id
      let path = ''
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        if (this.state.selectedDate) {
          path += `?page_number=${this.state.currentPage + 1}&student_id=${this.studentId}&date=${this.state.selectedDate}`
        } else {
          path += `?page_number=${this.state.currentPage + 1}&student_id=${this.studentId}`
        }
        axios.get(`${urls.communication}${path}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.setState({
              currentPage: this.state.currentPage + 1,
              messages: [...this.state.messages, ...res.data.filtered_data]
            })
          })
      }
    }
  }
  handleDelete (id) {
    axios
      .delete(urls.DeleteMessage + '?msg_id=' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Message has been deleted Successfully')
          let path = ''
          path += `?page_number=${this.state.currentPage}`
          this.getSmsData(path)
          let { sectionIndex, sectionMessages } = this.state
          let data = sectionMessages
          let index = data.map((data, index) => {
            if (index === sectionIndex) {
              data.message.findIndex(msg =>
                msg.id === id)
            }
          })
          data.splice(index, 1)
          this.setState({ sectionMessages: data })
        }
        this.setState({ loading: true })
      })
      .catch(error => {
        if (error.ressponse && error.ressponse.status === 409) {
          this.props.alert.error('Message Does not exist')
        }
        console.log(error)
      })
  }
  getFileName (url) {
    let part = (url.split('/')[url.split('/').length - 1])
    return part
  }
  onChange (data) {
    let container = document.getElementById('scroll-container')
    container.scrollTop = 0
    this.setState({ selectorData: data, messages: [], currentPage: 1 })
    console.log(container, 'container')
  }

  get (pageNumber) {
    console.log(this.state.selectorData, 'sssssssssssssssssssssss')
    let { selectorData } = this.state
    let path = ''
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?page_number=${this.state.currentPage}&secmap_id=${sectionId}`
      this.getSmsData(path)
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?page_number=${this.state.currentPage}&acad_branch_grade_id=${gradeId}`
      this.getSmsData(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?page_number=${this.state.currentPage}&branch_id=${branchId}`
      this.getSmsData(path)
    }
  }
  componentWillMount () {
    setTimeout(() => {
      this.setState({ isGSelectEnabled: true })
    }, 10000)
  }

  render () {
    const { messages } = this.state
    console.log(decodeURIComponent(window.location.href.split('/')[(window.location.href.split('/').length) - 1]))
    return (
      <React.Fragment>
        <Toolbar>
          <Grid container>
            {this.role !== 'Student' && this.role !== 'Teacher' && this.role !== 'AcademicCoordinator'
              ? <Grid style={{ marginLeft: 4 }} item>
                <GSelect initialValue={{ branch_name: decodeURIComponent(window.location.href.split('/')[(window.location.href.split('/').length) - 1]) }} config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
                <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() => this.get(this.state.currentPage)}>
              GET
                </Button>
              </Grid> : ''}

          </Grid>
        </Toolbar>
        <div className='feeds-container' id={'scroll-container'} onScroll={this.handleScroll}>
          {messages && messages.length > 0 && messages.map(message => {
            return (
              <Card className='card-wrapper' key={message.id}>
                <CardContent>
                  <Typography className='card-text' variant='h5'>
            TITLE :
                    {message.title}
                  </Typography>
                  <Typography className='card-text' variant='subtitle1' color='textSecondary'>
             MESSAGE :
                    {message.message}

                  </Typography>
                  <Typography className='card-text' variant='body1'>
                    <React.Fragment>
                      {this.role === 'Student' || this.role === 'Principal' || this.role === 'Admin' || this.role === 'Teacher' || this.role === 'MIS' || this.role === 'AcademicCoordinator'
                        ? <React.Fragment>
                          <Chip
                            label={message.uploaded_by ? message.uploaded_by.first_name : 'NoAuthor'}
                            avatar={<Avatar><SupervisorAccount /></Avatar>}
                          />
                        </React.Fragment> : ''
                      }
                    </React.Fragment>
                    <Chip
                      size='medium'
                      label={moment(message.uploaded_time).format('DD-MM-YYYY h:mm:ss a') || 'NO UPLOADED TIME'}
                    />
                    <Typography>

                      {message.grade_sec_details && message.grade_sec_details.map(branch => {
                        return (
                          <React.Fragment>
                            {
                              this.role !== 'Student'
                                ? <React.Fragment>
                                  <Chip
                                    size='medium'
                                    label={(branch.branch_name) || 'NO Branch'}
                                    avatar={<Avatar>B</Avatar>}
                                  />
                                  <Chip
                                    size='medium'
                                    label={(branch.grade_name) || 'NO Grade'}
                                    avatar={<Avatar>B</Avatar>}
                                  />
                                  <Chip
                                    size='medium'
                                    label={(branch.section_name) || 'NO Section'}
                                    avatar={<Avatar>B</Avatar>}
                                  />
                                </React.Fragment>
                                : ''}
                          </React.Fragment>
                        )
                      })}
                      <React.Fragment>
                        {this.role !== 'Student' && message.student_details
                          ? <React.Fragment>
                            <div>

                              <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography >RECEIVED BY STUDENT</Typography>
                                </ExpansionPanelSummary>
                                {message.student_details && message.student_details.map(student => {
                                  return (
                                    <React.Fragment>
                                      <ExpansionPanelDetails>
                                        <ListItem alignItems='flex-start'>
                                          <ListItemAvatar>
                                            <Avatar ><FaceIcon /></Avatar>
                                          </ListItemAvatar>
                                          <ListItemText
                                            primary='RECEIVED BY'
                                            secondary={
                                              <React.Fragment>
                                                <Typography
                                                  component='span'
                                                  variant='body2'
                                                  color='textPrimary'
                                                />
                                                {(student.student) || 'NO Student'}
                                                <Chip
                                                  size='medium'
                                                  label={(student.branch_name) || 'NO Branch'}
                                                  avatar={<Avatar>B</Avatar>}
                                                />
                                                <Chip
                                                  size='medium'
                                                  label={(student.grade_name) || 'NO Grade'}
                                                  avatar={<Avatar>G</Avatar>}
                                                />
                                                <Chip
                                                  size='medium'
                                                  label={(student.section_name) || 'NO Section'}
                                                  avatar={<Avatar>S</Avatar>}
                                                />
                                              </React.Fragment>
                                            }
                                          />
                                        </ListItem>
                                      </ExpansionPanelDetails>
                                    </React.Fragment>
                                  )
                                })}
                              </ExpansionPanel>
                            </div>
                          </React.Fragment>
                          : '' }
                      </React.Fragment>
                      {this.role !== 'Student' && message.student_details
                        ? <React.Fragment>
                          {message.branch_details && message.branch_details.map(branch => {
                            return <Chip
                              size='medium'
                              label={(branch.branch_name) || 'NO Branch'}
                              avatar={<Avatar>B</Avatar>}
                            />
                          })}
                        </React.Fragment>
                        : ''
                      }</Typography>

                    <Typography className='card-text' variant='body1'>
                      <React.Fragment>
                        {this.role === 'Principal' || this.role === 'Teacher' || this.role === 'Admin' || this.role === 'AcademicCoordinator'
                          ? <React.Fragment>
                            <IconButton
                              aria-label='Delete'
                              onClick={e => this.handleDelete(message.id)}>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                    DELETE
                          </React.Fragment> : ''}
                      </React.Fragment>
                    </Typography>
                    {message.msg_media && message.msg_media.length > 0
                      ? message.msg_media.map(media => {
                        return <li> <Link className='card-text' href={media.msg_media_file} variant='body1' target='_blank' style={{ color: 'blue' }}>
                         MEDIA:---- {this.getFileName(media.msg_media_file)}
                        </Link ></li>
                      })
                      : ''
                    }
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <Drawer
          anchor='right'
          open={this.state.openNewMessage}
          onClose={this.toggleModal}
        >
          <div style={{
            minWidth: window.isMobile ? 300 : 480
          }} >
            <AddMessage alert={this.props.alert} />
          </div>
        </Drawer>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(Communicate))
