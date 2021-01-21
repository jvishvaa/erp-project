/* eslint-disable react/jsx-indent */
/* eslint-disable import/imports-first */
import React, { Children } from 'react'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from 'moment'
import { Form, Checkbox } from 'semantic-ui-react'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import Modal from '@material-ui/core/Modal/Modal'
import { COMBINATIONS } from './config/combination'
import GSelect from '../../../_components/globalselector'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import EditIcon from '@material-ui/icons/EditOutlined'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover/Popover'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import withDragAndDrop from '../dragAndDrop'
import FormControl from '@material-ui/core/FormControl'
import { urls } from '../../../urls'
import { AlertMessage, Toolbar, OmsSelect as Select, InternalPageStatus } from '../../../ui'
import { apiActions } from '../../../_actions'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ReactTable from 'react-table'
import './calendar.css'

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='Close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({

  root: {
    margin: 10,
    minHeight: 500,
    minWidth: 500,
    padding: theme.spacing.unit * 1
  }
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 10,
    padding: theme.spacing.unit
  }
}))(MuiDialogActions)

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}
const FORMS = {
  marginTop: '20px',
  fontSize: '20px'
}
const BUTTONS = {
  marginLeft: '50px'
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

const ColoredDateCellWrapper = ({ children, value }) =>
  React.cloneElement(Children.only(children), {
    style: {
      ...children.style,
      backgroundColor:
        moment(value).weekday() === 0 || moment(value).weekday() === 6
          ? 'lightgrey'
          : null
    }
  })

var calendarEvent = null

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentView: 'month',
      currentDate: new Date(),
      currentEvent: null,
      calendarEvent: null,
      events: [
        {
          id: 1,
          title: '',
          start: '',
          end: ''
        }
      ],
      Activity: [
        {
          id: 1,
          title: '',
          start: '',
          end: ''
        }
      ],
      currentActivity: null,
      openAdd: false,
      holiday: false,
      startDate: null,
      endDate: null,
      formname: '',
      description: '',
      startingDate: null,
      endingDate: null,
      branch: null,
      openPop: false,
      errorInTitle: false,
      errorInDescription: false,
      errorInStart: false,
      errorInEnd: false,
      firstTime: true,
      isdata: false,
      student: false,
      open: false,
      table: false,
      checked: false,
      studentDetails: [],
      selectedStudent: [],
      selectorData: [],
      tablehide: false,
      buttonhide: false,
      assignbutton: false,
      gradeId: [],
      ActivityData: '',
      UpdatedActivityList: [],
      DisplayTable: false,
      SelectStudentsInTable: false
    }
    this.user_profile = JSON.parse(localStorage.getItem('user_profile'))
    this.moveEvent = this.moveEvent.bind(this)
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.onChangeActivityData = this.onChangeActivityData.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleTick = this.handleTick.bind(this)
    this.onChange = this.onChange.bind(this)
    this.role = this.user_profile.personal_info.role
    this.getStudends = this.getStudends.bind(this)
    this.handleSelectAll = this.handleSelectAll.bind(this)
  }

  handleMode = (event, mode) => {
    let events = this.state.events.map(event => {
      return { ...event, draggable: mode === 'edit' }
    })
    if (mode === 'edit') {
      this.setState({ events, mode })
    } else {
      this.setState({ events, mode: 'view' })
    }
  };
  handleActivity = (event, mode) => {
    let Activitys = this.state.Activitys.map(event => {
      return { ...event, draggable: mode === 'edit' }
    })
    if (mode === 'edit') {
      this.setState({ Activitys, mode })
    } else {
      this.setState({ Activitys, mode: 'view' })
    }
  };

  handleBranchChange (e) {
    this.setState({ branch: e.value }, this.eventsCall)
  }
  handleUsersRole = () => {
    let user = this.user_profile
    if (user) {
      if (user.personal_info) {
        if (user.personal_info.role === 'Principal') {
          return null
        } else if (user.personal_info.role === 'Admin') {
          // user is admin, so returning branch dropdown
          return (

            <FormControl className='selectbr'>
              <Select
                placeholder='Select Branch'
                fluid
                search
                selection
                options={
                  this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : null
                }
                change={this.handleBranchChange}
              />
            </FormControl>
          )
        } else if (user.personal_info.role === 'BDM') {
          return (
            <FormControl style={{ marginLeft: 40 }} >
              <Select
                placeholder='Select Branch'
                fluid
                search
                selection
                options={this.state.branchData
                }
                change={this.handleBranchChange}
              />
            </FormControl>
          )
        }
      }
    }
  };

  handleEndDate = e => {
    var endDate = document.getElementById('endingDate').value
    this.setState({ endingDate: endDate })
  };

  updateEvent () {
    let { currentEvent } = this.state
    let payLoad = {
      ...currentEvent,
      title: this.state.formname,
      description: this.state.description,
      start: this.state.startingDate ? moment(this.state.startingDate).format('YYYY-MM-DD HH:mm:ss') : null,
      end: this.state.endingDate ? moment(this.state.endingDate).format('YYYY-MM-DD HH:mm:ss') : null,
      is_off: this.state.holiday
    }
    if (payLoad.start === payLoad.end) {
      payLoad.end = this.state.endingDate && moment(payLoad.end).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
    }
    axios.put(
      urls.Calendar + '?event_id=' + currentEvent.id, payLoad,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.user
        }
      }
    ).then(res => {
      if (res.status >= 200 && res.status <= 205) {
        this.props.alert.success('Event updated')
        this.setState({ openAdd: false }, this.eventsCall)
      }
    })
  };

  moveEvent ({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents
    })

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents
    })

    // alert(`${event.title} was resized to ${start}-${end}`)
  };
  formAddSubmit () {
    let confirm = window.confirm('Confirm to add Event')
    if (confirm) {
      let data = {
        title: this.state.formname,
        description: this.state.description,
        start: this.state.startingDate && moment(this.state.startingDate).format('YYYY-MM-DD HH:mm:ss'),
        end: this.state.endingDate && moment(this.state.endingDate).format('YYYY-MM-DD HH:mm:ss'),
        branch_id: this.state.branch,
        is_off: this.state.holiday,
        user_id: 1142
      }
      if (data.startingDate === data.endingDate) {
        data.endingDate = this.state.endingDate && moment(data.endingDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
      }
      let error = 0
      this.setState({ errorInDescription: false, errorInTitle: false, errorInStart: false, errorInEnd: false }, () => {
        Object.keys(data).forEach(item => {
          if (!data[item] && String(item) !== 'is_off') {
            error++
            switch (item) {
              case 'description':this.setState({ errorInDescription: true }); break
              case 'title': this.setState({ errorInTitle: true }); break
              case 'start':this.setState({ errorInStart: true }); break
              case 'end':this.setState({ errorInEnd: true }); break
            }
          }
        })
      })
      if (error === 0) {
        axios
          .post(urls.Calendar, data, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            },
            body: data
          })
          .then(success => {
            this.setState({
              alertMessage: {
                messageText: success.data,
                variant: 'success',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
            this.setState({
              openAdd: false,
              formname: '',
              description: '',
              startingDate: '',
              endingDate: '',
              holiday: false
            })
          })
      }
    }
  }

  eventsCall = () => {
    let { branch } = this.state
    axios
      .get(urls.Calendar + '?branch_id=' + branch, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(events => events.data)
      .then(events => {
        calendarEvent.onNavigate('PREV')
        setTimeout(() => {
          calendarEvent.onNavigate('TODAY')
        }, 1)
        this.setState({
          events: events.map(event => ({
            ...event,
            id: event.id,
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: event.title
          }))
        })
      })
  };

  view = (view, onView) => {
    onView(view)
  }

  viewNamesGroup (messages, views, view, onView) {
    let viewNames = views

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <Button key={name} variant='outlined' style={{
          textDecoration: 'none',
          backgroundColor: name === view && 'rgba(0, 0, 0, 0.08)'
        }} onClick={() => this.view(name, onView)}>{messages[name]}</Button>
      ))
    }
  }
  // STUDENT DATA CODE

  getStudends () {
    const { selectorData, UpdatedActivityList } = this.state
    let url = urls.Student
    if (this.state.mode === 'view') {
      url = url + '?acadsectionmapping=' + selectorData.section_mapping_id
    } else {
      url = url + '?acadsectionmapping=' + UpdatedActivityList.section_mapping_id
    }
    this.setState({ isStudentDataLoading: true })
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((response) => {
        this.setState({ studentDetails: response.data.result, isStudentDataLoading: false })
      }).catch(e => {
        this.setState({ isStudentDataLoading: false })
      })
  }
  handleClickOpen = () => {
    let { formname, startingDate, endingDate, description } = this.state
    if (formname && startingDate && endingDate && description) {
      this.setState({
        open: true
      })
    } else {
      this.props.alert.error('please Fill the Required field')
    }
  }
  AssignActivity () {
    let confirm = window.confirm('Confirm to assign Activity')
    if (confirm) {
      let data = {}
      if (this.state.selectorData.acad_branch_grade_mapping_id === undefined) {
        this.props.alert.error('Please select grade')
        return
      }
      // data['branch'] = this.state.branch
      data['acad_branch_grade'] = this.state.gradeId
      data['acad_section'] = this.state.sectionId
      data['users'] = this.state.selectedStudent
      data['activity_data'] =
    {
      'title': this.state.formname,
      'description': this.state.description,
      'start_date': this.state.startingDate && moment(this.state.startingDate).format('YYYY-MM-DD HH:mm:ss'),
      'end_date': this.state.endingDate && moment(this.state.endingDate).format('YYYY-MM-DD HH:mm:ss')
    }

      console.log(data, 'final_output')
      axios
        .post(urls.ActivityEvent + '?branch_id=' + this.state.branch, data, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          },
          body: data
        })
        .then(success => {
          if (success.status === 500) {
            this.props.alert.error('Somthing Went Wrong please try again')
            return
          }
          this.eventsCall()
          this.setState({
            alertMessage: {
              messageText: success.data,
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
          this.setState({
            openAdd: false,
            open: false,
            formname: '',
            description: '',
            startingDate: '',
            endingDate: ''
          })
        })
    }
  }

  updateActivity () {
    let confirm = window.confirm('Confirm to update Activity')
    if (confirm) {
      let data = {}
      // data['branch'] = this.state.branch
      data['acad_branch_grade'] = this.state.gradeId
      data['acad_section'] = this.state.sectionId
      data['users'] = this.state.selectedStudent
      data['is_off'] = false
      data['is_delete'] = false
      data['is_activity'] = true
      data['activity_data'] =
      {
        'title': this.state.formname,
        'description': this.state.description,
        'start_date': this.state.startingDate && moment(this.state.startingDate).format('YYYY-MM-DD HH:mm:ss'),
        'end_date': this.state.endingDate && moment(this.state.endingDate).format('YYYY-MM-DD HH:mm:ss')
      }

      console.log(data, 'final_output')
      axios
        .put(urls.ActivityEvent + this.state.ActivityData.event.id + '/', data, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          },
          body: data
        })
        .then(success => {
          this.setState({
            alertMessage: {
              messageText: success.data,
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            },
            openAdd: false,
            open: false,
            formname: '',
            description: '',
            startingDate: '',
            endingDate: ''
          })
          this.eventsCall()
        })
    }
  }
  handleNext () {
    const { branch_id: branch, acad_branch_grade_mapping_id: grade, section_mapping_id: section } = this.state.selectorData
    if (this.mode === 'view' || !branch || !grade || !section) {
      this.props.alert.error('Please enter required fields')
    } else {
      this.setState({ tablehide: true, sectionId: null, DisplayTable: true })
      if (this.state.mode !== 'view') {
        this.setState({ selectedStudent: this.state.ActivityData && this.state.ActivityData.assign_user.map((item) => { return item.id }) })
        this.getStudends()
      }
      this.getStudends()
    }
  }

  handleClose = () => {
    this.setState({ open: false, studentDetails: [], selectorData: null, tablehide: false, buttonhide: false, selectedStudent: [] })
    if (this.state.mode === 'edit') {
      this.setState({ DisplayTable: false })
    }
  }

  handleSelectAll (event) {
    let selectedStudent = []
    if (event.target.checked) {
      selectedStudent = [...this.state.studentDetails.map(student => student.user)]
    } else {
      selectedStudent = []
    }
    this.setState({ selectedStudent })
  }
  handleTick (e, user) {
    var sectionList
    var { selectedStudent = [] } = this.state
    if (e.target.checked) {
      selectedStudent.push(user)
    } else {
      let index = selectedStudent.indexOf(user)
      selectedStudent.splice(index, 1)
    }
    if (selectedStudent.length === 0) {
      sectionList = this.state.selectorData.section_mapping_id.split(',')
      this.setState({ sectionId: sectionList, gradeId: null }, () => {})
    }
    this.setState({ selectedStudent })
    console.log(this.state.selectedStudent, 'see stu')
  }

  filterTableData =(students, checkedAll, selected = []) => {
    let data = students.length
      ? students.map(st => ({
        name: st.name,
        // id: st.id,
        user: st.user,
        // erp: st.erp,
        checked: checkedAll || selected.includes(st.id)
      }))
      : []
    let { queryString } = this.state
    if (queryString && queryString.length) {
      return this.setState({ studentDetails: data.filter(student => student.name.includes(queryString)) })
    } else {
      return this.setState({ studentDetails: data })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.students) {
    }
    if (Array.isArray(nextProps.students) && nextProps.students.length > 0 && this.props.students.length === 0) {
      this.filterTableData(nextProps.students)
      return true
    }
    return true
  }
  onChange (data) {
    console.log(data, 'on change dataaaa')
    var gradeList
    var sectionList
    const { section_mapping_id: sectionId, acad_branch_grade_mapping_id: gradeId, branch_id: branchId } = data
    if (branchId) {
      this.setState({ assignbutton: true, selectorData: data, branchId: [branchId] }, () => {})
    }
    if (gradeId) {
      gradeList = gradeId.split(',')
      this.setState({ buttonhide: false, tablehide: false, selectedStudent: [], studentDetails: [], selectorData: data, branchId: null, gradeId: gradeList }, () => {})
    }
    if (sectionId) {
      sectionList = sectionId.split(',')
      this.setState({ selectorData: data, buttonhide: true, sectionId: sectionList, gradeId: null }, () => {})
    } else if (!data.section_mapping_id || !data.branch_id) {
      this.setState({ buttonhide: false, tablehide: false, selectedStudent: [], studentDetails: [] })
    } else if (!data.section_mapping_id || !data.branch_id || data.grade_id) {
      this.setState({ buttonhide: false, tablehide: false, selectedStudent: [], studentDetails: [] })
    }
  }
  onChangeActivityData (data) {
    var gradeList
    var sectionList
    let{ ActivityData, selectorData } = this.state
    const { branch_id: branchid, acad_branch_grade_mapping_id: gradeid, section_mapping_id: sectionid } = data
    if (branchid) {
      this.setState({ branchId: [branchid] }, () => {})
    }
    if (gradeid) {
      gradeList = gradeid.split(',')
      this.setState({ branchId: null, gradeId: gradeList }, () => {})
    }
    if (sectionid) {
      sectionList = sectionid.split(',')
      this.setState({ sectionId: sectionList, gradeId: null }, () => {})
    }
    if (!sectionid) {
      this.setState({ sectionId: null }, () => {})
    }
    if (ActivityData && ActivityData.acad_branch_grade_session.length !== 0) {
      this.setState({ UpdatedActivityList: data, selectorData: data, SelectStudentsInTable: false })
      console.log(selectorData && selectorData.acad_branch_grade_mapping_id && selectorData.acad_branch_grade_mapping_id.length)
      if (ActivityData && ActivityData.acad_branch_grade_session.length === 1) {
        this.setState({ UpdatedActivityList: data, selectorData: data })
        this.setState({ SelectStudentsInTable: true })
        if (!gradeid || !sectionid || !branchid) {
          this.setState({ DisplayTable: false })
        }
      }
      console.log('updated Data in grade', ActivityData.acad_branch_grade_session.length)
    } else if (this.state.ActivityData && this.state.ActivityData.acad_section_mapping.length !== 0) {
      if (ActivityData.acad_section_mapping.length === 1) {
        this.setState({ UpdatedActivityList: data, selectorData: data, SelectStudentsInTable: true })
      }
      if (!gradeid || !sectionid || !branchid) {
        this.setState({ DisplayTable: false })
      }
      this.setState({ UpdatedActivityList: data })
      console.log('updated data in section')
    } else if (ActivityData && ActivityData.assign_user.length !== 0) {
      this.setState({ UpdatedActivityList: data, selectorData: data, SelectStudentsInTable: true })
      console.log('updatd data in users')
      if (!gradeid || !sectionid || !branchid) {
        this.setState({ DisplayTable: false })
      }
    }
  }

  getActivityData (currentAct) {
    axios
      .get(urls.ActivityEvent + currentAct.id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((response) => {
        this.setState({ ActivityData: response.data.result, ActivityStudentData: response.data.students })
        console.log(this.state.ActivityData)
        if (response.status === 500) {
          this.props.alert.error('Error  Occured')
        }
      })
  }
  deleteActivity () {
    let confirm = window.confirm('Confirm to Delete Activity')
    if (confirm) {
      axios
        .delete(urls.ActivityEvent + this.state.ActivityData.event.id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then((response) => {
          this.eventsCall()
          this.setState({ openAdd: false, open: false })
          this.props.alert.success('Activity Deleted Successfully')
        })
    }
  }

  render () {
    let { classes } = this.props
    let{ selectedStudent } = this.state

    const columns = [
      {
        user: 'checkbox',
        Header: () => { return 'Selected ' + (selectedStudent ? selectedStudent.length : 0) },
        Cell: props => {
          return (<input
            type='checkbox'
            checked={(() => {
              const { selectedStudent = [] } = this.state
              if (Array.isArray(selectedStudent)) {
                return selectedStudent.indexOf(props.original.user) >= 0
              }
              return false
            })()}
            onChange={(e) => { this.handleTick(e, props.original.user) }}
          />)
        }
      },
      {
        Header: 'Student Name',
        accessor: 'name'
      },
      {
        Header: 'Student Enrollment',
        accessor: 'erp'
      }
    ]
    return (
      <React.Fragment>
        {/* <button onClick={e => { this.props.alert.error('d') }}>Tester</button> */}
        <AlertMessage alertMessage={this.state.alertMessage} />
        <div style={{ minHeight: 300, height: '65vh' }}>

          <DragAndDropCalendar className='mdw'
            views={['month', 'day', 'week']}
            localizer={localizer(moment)}
            events={this.state.events}
            Activitys={this.state.Activitys}
            // onSelectEvent={(event) => this.handleSelectEvent(event)}
            onEventDrop={this.moveEvent}
            // onActivityDrop={this.moveActivity}
            resizable
            customToolbar={(event) => {
              calendarEvent = event
              // firstTime && event.onNavigate('NEXT') && setTimeout(() => { event.onNavigate('TODAY') }, 1000)
              return <Toolbar>
                <Grid container style={{ flex: 1, justifyContent: '' }}>
                  <Grid item xs={this.state.branch ? 3 : 4}>
                    <Button variant='outlined' onClick={() => event.onNavigate('PREV')}>PREV</Button>
                    <Button variant='outlined' onClick={() => event.onNavigate('TODAY')}>Today</Button>
                    <Button variant='outlined' onClick={() => event.onNavigate('NEXT')}>NEXT</Button>
                  </Grid>
                  <Grid item xs={this.state.branch ? 3 : 4} style={{ textAlign: 'center' }}>{event.label}</Grid>
                  <Grid item xs={this.state.branch ? 6 : 4}>
                    <Grid container>
                      <Grid item xs={this.state.branch ? 4 : 6}>
                        <span className='rbc-btn-group'>{this.viewNamesGroup(event.localizer.messages, event.views, event.view, event.onView)}</span>
                      </Grid>
                      <Grid item xs={this.state.branch ? 8 : 3}>
                        <Grid container direction='row'>
                          <Grid item xs={this.state.branch ? 6 : 12}>{this.handleUsersRole()}</Grid>
                          <Grid item xs={this.state.branch ? 6 : 0}>{this.state.branch ? (
                            <Grid container style={{ alignItems: 'flex-end' }}>
                              <Grid item flex={1}>
                                <ToggleButtonGroup
                                  value={this.state.mode}
                                  exclusive

                                  onChange={this.handleMode}
                                  style={{ height: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}
                                >
                                  <ToggleButtonGroup
                                    value={this.state.mode}
                                    exclusive
                                    onChange={this.handleActivity}
                                    style={{ height: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}
                                  />
                                  <ToggleButton value='edit'><EditIcon /> Edit</ToggleButton>
                                </ToggleButtonGroup>
                              </Grid>
                              <Grid item flex={1}>
                                <Button variant='outlined' size='medium' color='primary' className={classes.margin} onClick={() => this.setState({ openAdd: true, formname: '', description: '', startingDate: '', endingDate: '', mode: 'view', open: false })}>
                                  ADD
                                </Button>
                              </Grid>
                            </Grid>
                          ) : null}</Grid></Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Toolbar>
            }}
            onEventResize={this.resizeEvent}
            onSelectSlot={this.newEvent}
            onSelectEvent={(event, synthetic) => {
              function convert (str) {
                var date = new Date(str)
                var mnth = ('0' + (date.getMonth() + 1)).slice(-2)
                var day = ('0' + date.getDate()).slice(-2)

                return [ date.getFullYear(), mnth, day ].join('-')
              }

              let { mode } = this.state
              if (mode === 'edit') {
                if (event.is_activity === true) {
                  console.log(event.is_activity, event)
                  this.setState({
                    openAdd: true,
                    formContent: 'activity',
                    anchorEl: synthetic.currentTarget,
                    currentEvent: event,
                    formname: event.title,
                    description: event.description,
                    startingDate: convert(event.start),
                    endingDate: convert(event.end) }, () => { this.getActivityData(event) })
                } else if (event.is_activity === false) {
                  this.setState({
                    openAdd: true,
                    formContent: 'event',
                    anchorEl: synthetic.currentTarget,
                    currentEvent: event,
                    holiday: event.is_off,
                    formname: event.title,
                    description: event.description,
                    startingDate: convert(event.start),
                    endingDate: convert(event.end) })
                }
              } else if (mode === 'view' || !mode) {
                this.setState({
                  anchorEl: synthetic.currentTarget,
                  openPop: true,
                  currentEvent: event
                })
              }
            }}

            defaultView={BigCalendar.Views.MONTH}
            components={{
              dateCellWrapper: ColoredDateCellWrapper
            }}
          />
        </div>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.state.openAdd}
          onClose={() => this.setState({ openAdd: false })}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography style={BUTTONS}variant='h7' id='modal-title'>
              <Button
                variant='outlined'
                color='primary'
                className={classes.button}
                value='AddEvent'
                onClick={() => {
                  if (this.state.mode === 'view') {
                    this.setState({ formContent: 'event', holiday: false, formname: '', description: '', startingDate: '', endingDate: '' })
                  }
                }}
                disabled={(this.state.formContent !== 'event' && this.state.mode === 'edit')}
              >
                {this.state.mode === 'view' ? 'Add Event' : 'Edit Event'}
              </Button>
              <Button variant='outlined'
                color='primary'
                className={classes.button}
                value='AddActivity'
                onClick={() => {
                  if (this.state.mode === 'view') {
                    this.setState(
                      { formContent: 'activity', formname: '', description: '', startingDate: '', endingDate: '' })
                  }
                }
                }
                disabled={(this.state.formContent !== 'activity' && this.state.mode === 'edit')}
              >
                {this.state.mode === 'view' ? 'Add Activity' : 'Edit Activity'}
              </Button>
            </Typography>

            {this.state.formContent === 'event' && <Typography style={FORMS} variant='subtitle1' id='simple-modal-description'>
              { this.state.mode === 'view' ? 'Add Event' : 'Edit Event' }
              <Form>
                <Form.Field error={this.state.errorInTitle}>
                  <label>Event Name</label>
                  <input
                    placeholder='Name'
                    onChange={e => {
                      this.setState({ formname: e.target.value })
                    }}
                    value={this.state.formname}
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInDescription}>
                  <label>Description</label>
                  <input
                    placeholder='Name'
                    onChange={e => {
                      this.setState({ description: e.target.value })
                    }}
                    value={this.state.description}
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInStart}>
                  <label>Starting Date</label>
                  <input
                    placeholder='Eg. 11/1/2018'
                    onChange={e => {
                      this.setState({ startingDate: e.target.value })
                    }}
                    value={this.state.startingDate}
                    type='date'
                    name='startingDate'
                    id='startingDate'
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInEnd}>
                  <label>Ending Date</label>
                  <input
                    placeholder='Eg. 13/1/2018'
                    name='endingDate'
                    id='endingDate'
                    onChange={this.handleEndDate}
                    value={this.state.endingDate}
                    type='date'
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    label='Holiday'
                    onChange={e => {
                      console.log(e)
                      this.setState({ holiday: !this.state.holiday })
                    }}
                    checked={this.state.holiday}
                  />
                </Form.Field>
                {this.state.mode === 'edit' ? <Button onClick={() => this.updateEvent()} > Save </Button> : <Button primary onClick={() => this.formAddSubmit()}>
                      Submit
                </Button>}
                <Button
                  secondary
                  onClick={() => this.setState({ openAdd: false })}
                >
                      Cancel
                </Button>
              </Form>
            </Typography>}

            {this.state.formContent === 'activity' && <Typography style={FORMS} variant='subtitle1' id='simple-modal-description'>
              {this.state.mode === 'view' ? 'Add Activity' : 'Edit Activity'}
              <Form>
                <Form.Field error={this.state.errorInTitle}>
                  <label>Activity Name</label>
                  <input
                    placeholder='Name'
                    onChange={e => {
                      this.setState({ formname: e.target.value })
                    }}
                    value={this.state.formname}
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInDescription}>
                  <label>Description</label>
                  <input
                    placeholder='Name'
                    onChange={e => {
                      this.setState({ description: e.target.value })
                    }}
                    value={this.state.description}
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInStart}>
                  <label>Starting Date</label>
                  <input
                    placeholder='Eg. 11/1/2018'
                    onChange={e => {
                      this.setState({ startingDate: e.target.value })
                    }}
                    value={this.state.startingDate}
                    type='date'
                    name='startingDate'
                    id='startingDate'
                  />
                </Form.Field>
                <Form.Field error={this.state.errorInEnd}>
                  <label>Ending Date</label>
                  <input
                    placeholder='Eg. 13/1/2018'
                    name='endingDate'
                    id='endingDate'
                    onChange={this.handleEndDate}
                    value={this.state.endingDate}
                    type='date'
                  />
                </Form.Field>
                <Form.Field>
                  <Button variant='contained' color='primary' onClick={() => this.handleClickOpen()}>{this.state.mode === 'view' ? 'Assign To' : 'Next'}
                  </Button>
                  {this.state.mode !== 'view' && <Button variant='contained' color='primary'className={classes.button} style={{ backgroundColor: '#eb432d', marginLeft: '40%' }} onClick={() => this.deleteActivity()}> Delete Activity
                  </Button>}
                </Form.Field>
              </Form>
            </Typography>}
            {this.state.open && this.state.mode === 'view' && <div>
              <Dialog
                onClose={this.handleClose}
                aria-labelledby='customized-dialog-title'
                open={this.state.open}
              >
                <DialogTitle id='customized-dialog-title' onClose={this.handleClose}>
                 Assign To
                </DialogTitle>
                <DialogContent>
                  <Grid style={{ marginLeft: 10 }} item>
                    <GSelect initialValue={{ branch_id: this.state.branch }} config={COMBINATIONS} variant={'filter'} onChange={this.onChange} defaultValue={this.state.branch} />
                    {this.state.buttonhide === true
                      ? <DialogActions>
                        <Button variant='outlined' color='secondary' className={classes.button} onClick={() => this.handleNext()}>
                     Select Students
                        </Button>
                      </DialogActions> : ''}
                  </Grid>

                  {this.state.tablehide && <DialogContent>
                    {this.state.isStudentDataLoading ? <InternalPageStatus label={'student data loading...'} /> : <React.Fragment>
                      <div>
                        <input type='checkbox' checked={this.state.studentDetails.length && this.state.studentDetails.length === this.state.selectedStudent.length} onChange={(e) => this.handleSelectAll(e)} />
                        <label>Select all</label>
                      </div>
                      <ReactTable
                        id='table1'
                        // loading={this.props.students.loading}
                        defaultPageSize={5}
                        data={this.state.studentDetails || []}
                        columns={columns}
                      />

                    </React.Fragment>
                    }
                  </DialogContent>}
                  { this.state.assignbutton && <DialogActions>
                    <Button onClick={() => this.AssignActivity()} variant='contained' color='primary' className={classes.button}>
                         Assign
                    </Button>
                  </DialogActions>}
                </DialogContent>

              </Dialog>
            </div> }
            {/* EDIT CODE */}
            {this.state.open && this.state.mode !== 'view' && <div>
              <Dialog
                onClose={this.handleClose}
                aria-labelledby='customized-dialog-title'
                open={this.state.open}
              >
                <DialogTitle id='customized-dialog-title' onClose={this.handleClose}>
                Selected Details
                </DialogTitle>
                <DialogContent>

                  {/* Grade Mapping */}
                  {this.state.ActivityData && this.state.ActivityData.acad_branch_grade_session.length !== 0 &&
                  <GSelect initialValue={{ branch_id: this.state.branch,
                    acad_branch_grade_mapping_id: this.state.ActivityData.acad_branch_grade_session && this.state.ActivityData.acad_branch_grade_session.map((data) => {
                      return data.id
                    }),
                    section_id: this.state.ActivityData.acad_section }} config={COMBINATIONS} variant={'filter'} onChange={this.onChangeActivityData} defaultValue={this.state.branch} />

                  }
                  {/* Section Mapping */}
                  {this.state.ActivityData && this.state.ActivityData.acad_section_mapping.length !== 0 && <GSelect initialValue={{ branch_id: this.state.branch, acad_branch_grade_mapping_id: this.state.ActivityData.acad_section_mapping && this.state.ActivityData.acad_section_mapping.map((item) => { return item.branch_grade_acad_session_mapping })[0], section_id: this.state.ActivityData.acad_section_mapping && this.state.ActivityData.acad_section_mapping.map((item) => { return item.section }) }} config={COMBINATIONS} variant={'filter'} onChange={this.onChangeActivityData} defaultValue={this.state.branch} />
                  }

                  {/* User Mapping */}
                  {this.state.ActivityData && this.state.ActivityData.assign_user && this.state.ActivityData.assign_user.length !== 0 && <GSelect initialValue={{ branch_id: this.state.branch, acad_branch_grade_mapping_id: this.state.ActivityStudentData && this.state.ActivityStudentData.map((item) => { return item.acad_branch_mapping.id })[0], section_id: this.state.ActivityStudentData && this.state.ActivityStudentData.map((item) => { return item.section.id })[0] }} config={COMBINATIONS} variant={'filter'} onChange={this.onChangeActivityData} defaultValue={this.state.branch} />
                  }
                  {this.state.SelectStudentsInTable === true
                    ? <DialogActions>
                      <Button variant='outlined' color='secondary' className={classes.button} onClick={() => this.handleNext()}>
                        {this.state.ActivityData && this.state.ActivityData.assign_user && this.state.ActivityData.assign_user.length !== 0 ? 'show selected students' : ' Select Students'}
                      </Button>
                    </DialogActions> : ''}
                  {this.state.DisplayTable
                    ? this.state.isStudentDataLoading ? <InternalPageStatus label={'student data loading...'} /> : <React.Fragment>
                      <div style={{ marginTop: '25px' }}>
                        <input type='checkbox' checked={this.state.studentDetails.length && this.state.studentDetails.length === this.state.selectedStudent.length} onChange={(e) => this.handleSelectAll(e)} />
                        <label>Select all</label>
                      </div>
                      <ReactTable
                        id='table1'
                        // loading={this.props.students.loading}
                        defaultPageSize={5}
                        data={this.state.studentDetails || []}
                        columns={columns}
                      />

                    </React.Fragment> : ''
                  }
                  <DialogActions>
                    <Button variant='contained' color='primary' className={classes.button} style={{ backgroundColor: 'Green' }} onClick={() => this.updateActivity()}>
                      Save
                    </Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </div> }
          </div>
        </Modal>
        <Popover
          id='simple-popper'
          open={this.state.openPop}
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ openPop: false })}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          { this.state.mode === 'view' ? <Typography
            className={classes.typography}
            style={{ padding: '10px', fontSize: '14px' }}
          >
            <h3>
              {this.state.currentEvent && this.state.currentEvent.title}
            </h3>
            <p>
              {this.state.currentEvent &&
                    this.state.currentEvent.description}
            </p>
            <p>
              {this.state.currentEvent &&
                    moment(this.state.currentEvent.start).format(
                      'YYYY/MM/DD'
                    )}{' '}
                  to{' '}
              {this.state.currentEvent &&
                    moment(this.state.currentEvent.end).format('YYYY/MM/DD')}
            </p>
          </Typography> : '' }
        </Popover>
      </React.Fragment>
    )
  }
}

// const SimpleModalWrapped = withStyles(styles)(Calendar);
const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  students: state.student && state.student.success ? state.student.success : []
})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadMapId => dispatch(apiActions.getSectionMapping(acadMapId)),
  listStudents: (sectionId, pageId = 1) => dispatch(apiActions.listStudents(sectionId, 'True', pageId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Calendar))
