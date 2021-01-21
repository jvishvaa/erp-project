import React from 'react'
import ReactSelect from 'react-select'
import { Form } from 'semantic-ui-react'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from 'moment'
import { withStyles, Popover, Button } from '@material-ui/core/'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import '../../css/staff.css'
import { urls } from '../../../urls'
import withDragAndDrop from '../dragAndDrop'
import { apiActions } from '../../../_actions'
import { Toolbar } from '../../../ui'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../../_components/globalselector'
import './timeTable.css'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const StyledPopover = withStyles({
  paper: {
    overflow: 'visible'
  }
})(Popover)

class AddTimeTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      branch: '',
      mappedGrades: '',
      section: '',
      branchError: false,
      gradeError: false,
      sectionError: false,
      events: [],
      currentDate: null,
      mode: 'view',
      disableTimeTableGenerateButton: true
    }
    this.getEvents = this.getEvents.bind(this)
    this.generateEvents = this.generateEvents.bind(this)
    this.handleMode = this.handleMode.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.changehandlergrade = this.changehandlergrade.bind(this)
    this.onSelectBranch = this.onSelectBranch.bind(this)
    this.changehandlersection = this.changehandlersection.bind(this)
    this.onChange = this.onChange.bind(this)
    this.user_profile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  onSelectBranch (branchId) {
    console.log(this.props.user)
    axios
      .get(urls.GradeMapping + '?branch=' + branchId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.data)
        if (Array.isArray(res.data)) {
          var mappedGrades = []
          if (res.data.length) {
            if (this.role === 'Teacher') {
              let mappindDetails = this.user_profile.academic_profile
              if (!mappindDetails.length) {
                this.props.alert.warning('You have no academic profile data')
                return
              }
              let gradeData = []
              let apiData = res.data
              let map = new Map()
              for (const item of mappindDetails) {
                if (!map.has(item.grade_id)) {
                  map.set(item.grade_id, true)
                  gradeData.push({
                    value: item.grade_id,
                    id: item.grade_id,
                    label: item.grade_name
                  })
                }
              }
              gradeData.map(grade => {
                apiData.map(item => {
                  if (grade.id === item.grade.id) {
                    mappedGrades.push(item)
                  }
                })
              })
            } else {
              mappedGrades = res.data
            }

            this.setState({ mappedGrades })
          } else {
            this.props.alert.warning('Selected branch has no grade data')
          }
        } else {
          this.props.alert.error(res.data)
        }
      })
  }

  onSelectGrade (acadBranchGradeMappingId) {
    axios
      .get(
        urls.SectionMapping +
          '?acad_branch_grade_mapping_id=' +
          acadBranchGradeMappingId,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        console.log(res.data)
        if (Array.isArray(res.data)) {
          var mappedSections = []
          if (res.data.length) {
            if (this.role === 'Teacher') {
              let mappindDetails = this.user_profile.academic_profile
              if (!mappindDetails.length) {
                this.props.alert.warning('You have no academic profile data')
                return
              }
              let sectionData = []
              let apiData = res.data
              let map = new Map()
              for (const item of mappindDetails) {
                if (!map.has(item.section_id) && item.grade_id === this.state.gradeId) {
                  map.set(item.section_id, true)
                  sectionData.push({
                    value: item.section_id,
                    id: item.section_id,
                    label: item.section_name
                  })
                }
              }
              sectionData.map(section => {
                apiData.map(item => {
                  if (section.id === item.section.id) {
                    mappedSections.push(item)
                  }
                })
              })
            } else {
              mappedSections = res.data
            }
            this.setState({ mappedSections })
          } else {
            this.props.alert.warning('Selected grade has no section data')
          }
        } else {
          this.props.alert.error(res.data)
        }
      })
  }

  changehandlerbranch = event => {
    if (event.value) {
      this.setState(
        {
          branch: event.value,
          mappedGrades: null,
          mappedSections: null,
          events: []
        },
        () => {
          this.onSelectBranch(event.value)
        }
      )
    }
  };

  changehandlergrade = event => {
    if (event.value) {
      this.setState(
        {
          gradeId: event.gradeId,
          acad_branch_grade_mapping_id: event.value,
          mappedSections: null,
          sectionMappingId: null,
          events: []
        },
        () => {
          this.onSelectGrade(event.value)
        }
      )
      console.log(event.value)
    }
  };

  changehandlersection = event => {
    if (event.value) {
      this.setState({
        sectionMappingId: event.value,
        events: []
      })
    }
  };

  getEvents () {
    let { selectorData } = this.state
    console.log(selectorData)
    axios
      .get(
        urls.TimeTable +
          `?branch_id=${selectorData.branch_id}&grade_id=${selectorData.grade_id}&section_id=${
            selectorData.section_id
          }`,
        {
          headers: {
            AUthorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        let startingDate
        let events = res.data.map(event => {
          startingDate = startingDate || moment(event.start)
          let title = event.title.replace(/'/g, '"')
          try {
            title = JSON.parse(title)
            title = title.subject_name
          } catch (err) {
            title = event.title
          }
          return {
            ...event,
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: title || '',
            draggable: this.state.mode === 'edit'
          }
        })
        this.setState(
          {
            currentDate: startingDate,
            events: events,
            currentBranch: selectorData.branch_id,
            currentGrade: selectorData.grade_id,
            currentSection: selectorData.section_id
          },
          () => console.log(this.state)
        )
      }).catch(e => {
        console.log(e)
        this.setState({ disableTimeTableGenerateButton: false, events: [] })
      })
  }

  generateEvents () {
    let { selectorData } = this.state

    axios
      .get(
        urls.TimeTableGenerate +
          `?branch_id=${selectorData.branch_id}&grade_id=${selectorData.grade_id}&section_id=${
            selectorData.section_id
          }`,
        {
          headers: {
            AUthorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        let branch = this.state.mappedGrades && this.state.mappedGrades.filter(branch => {
          return branch.branch.id === selectorData.branch_id
        })
        let originalStartingDate = branch[0]
        let firstDate = res.data[0].start
        let startingDate = moment(originalStartingDate).day(1 + 7)
        let date = moment(startingDate).get('date')
        let month = moment(startingDate).get('month')
        let year = moment(startingDate).get('year')
        let originalEvents = res.data
        let events = res.data.map(event => {
          let startDate = moment(event.start)
          let difference = startDate.diff(moment(firstDate), 'days')
          let title = event.title.replace(/'/g, '"')
          try {
            title = JSON.parse(title)
            title = title.subject_name
          } catch (err) {
            title = event.title
          }
          return {
            ...event,
            start: moment(event.start)
              .set({ date: date + difference, month: month, year: year })
              .toDate(),
            end: moment(event.end)
              .set({ date: date + difference, month: month, year: year })
              .toDate(),
            title: title || '',
            draggable: this.state.mode === 'edit'
          }
        })
        this.setState(
          {
            currentDate: startingDate,
            events: events,
            currentBranch: selectorData.branch_id,
            currentGrade: selectorData.grade_id,
            currentSection: selectorData.section_id,
            originalEvents
          })
      })
  }

  handleMode = (event, mode) => {
    console.log(mode)
    let events = this.state.events.map(event => {
      console.log(mode === 'edit')
      return { ...event, draggable: mode === 'edit' }
    })
    this.setState({ events, mode })
  };

  updateEvent = ({ value }) => {
    const { events } = this.state
    let originalEvent = events.filter(event => {
      return event.id === this.state.currentEvent.id
    })[0]
    let date = moment(originalEvent.start).get('date')
    let month = moment(originalEvent.start).get('month')
    let year = moment(originalEvent.start).get('year')
    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === this.state.currentEvent.id
        ? {
          ...existingEvent,
          title: this.props.subjects
            .filter(subject => subject.id === value)
            .map(subject => subject.subject_name)[0]
        }
        : existingEvent
    })
    this.setState({ events: nextEvents, openPop: false })
    let data = nextEvents.map(event => {
      let title = {
        subject_id: this.props.subjects
          .filter(subject => subject.subject_name === event.title)
          .map(subject => subject.id)[0],
        subject_name: this.props.subjects
          .filter(subject => subject.subject_name === event.title)
          .map(subject => subject.subject_name)[0]
      }
      return {
        ...event,
        title,
        start: moment(event.start).set({ date, month, year }).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(event.end).set({ date, month, year }).format('YYYY-MM-DD HH:mm:ss')
      }
    })
    data = data.filter(event => {
      // sending only the event which was altered -->[{}]
      return this.state.currentEvent.id === event.id
    })
    axios.put(
      urls.TimeTable,
      {
        grade_id: this.state.currentGrade,
        branch_id: this.state.currentBranch,
        section_id: this.state.currentSection,
        event_list: data

      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.user
        }
      }
    )
  };

  handleUsersRole = () => {
    let user = this.user_profile
    if (user) {
      if (user.personal_info) {
        if (user.personal_info.role === 'Principal') {
          return null
        } else if (user.personal_info.role === 'Admin') {
          // user is admin, so returning branch dropdown
          // return (
          // <Form.Field required>
          //   <OmsSelect
          //     label={'Branch'}
          //     options={
          //       this.props.branches
          //         ? this.props.branches.map(branch => ({
          //           value: branch.id,
          //           label: branch.branch_name
          //         }))
          //         : [{ value: undefined, label: 'Loading...' }]
          //     }
          //     change={this.changehandlerbranch}
          //     error={this.state.branchError}
          //   />
          // </Form.Field>
          // )
        }
        // else if (user.personal_info.role === 'BDM') {
        //   return (
        //     <Form.Field required>
        //       <OmsSelect
        //         label={'Branch'}
        //         options={
        //           this.state.branchData
        //         }
        //         change={this.changehandlerbranch}
        //         error={this.state.branchError}
        //       />
        //     </Form.Field>
        //   )
        // }
      }
    }
  };

  componentDidMount () {
    let user = this.user_profile
    if (user.personal_info) {
      if (user.personal_info.role === 'Principal') {
        let branchId = user.academic_profile.branch_id
        this.setState({ branch: branchId })
        this.onSelectBranch(branchId)
      } else if (user.personal_info.role === 'AcademicCoordinator') {
        let academicProfile = user.academic_profile
        if (Array.isArray(academicProfile) && academicProfile.length) {
          let branchId = academicProfile[0].branch_id
          this.setState({ branch: branchId })
          this.onSelectBranch(branchId)
        } else {
          this.props.alert.error('No mappings found')
        }
      } else if (user.personal_info.role === 'Teacher') {
        let academicProfile = user.academic_profile
        if (Array.isArray(academicProfile) && academicProfile.length) {
          let branchId = academicProfile[0].branch_id
          this.setState({ branch: branchId })
          this.onSelectBranch(branchId)
        } else {
          this.props.alert.error('No mappings found')
        }
      } else if (user.personal_info.role === 'BDM') {
        let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
        let branchData = []
        let map = new Map()
        for (const item of branchsAssigned) {
          if (!map.has(item.branch_id)) {
            map.set(item.branch_id, true)
            branchData.push({
              value: item.branch_id,
              label: item.branch_name
            })
          }
        }
        this.setState({ branchData })
      }
    }
  }
  onChange (data) {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data })
    // data.branch_id && data.grade_id && data.section_id && axios
    //   .get(
    //     urls.TimeTable +
    //     `?branch_id=${data.branch_id}&grade_id=${data.grade_id}&section_id=${
    //       data.section_id
    //     }`,
    //     {
    //       headers: {
    //         AUthorization: 'Bearer ' + this.props.user
    //       }
    //     }
    //   )
    //   .then(res => {
    //     console.log(res, 'resulttt')
    // console.log(res.data, 'only dataaa')
    // let branch = this.state.mappedGrades.filter(branch => {
    //   return branch.branch.id === data.branch_id
    // })
    // let originalStartingDate = branch[0].acad_session.start_date
    // let firstDate = res.data[0].start
    // let startingDate = moment(originalStartingDate).day(1 + 7)
    // let date = moment(startingDate).get('date')
    // let month = moment(startingDate).get('month')
    // let year = moment(startingDate).get('year')
    // let originalEvents = res.data
    // let events = res.data.map(event => {
    //   let startDate = moment(event.start)
    //   let difference = startDate.diff(moment(firstDate), 'days')
    //   let title = event.title.replace(/'/g, '"')
    //   try {
    //     title = JSON.parse(title)
    //     title = title.subject_name
    //   } catch (err) {
    //     title = event.title
    //   }
    //     return {
    //       ...event,
    //       start: moment(event.start)
    //         .set({ date: date + difference, month: month, year: year })
    //         .toDate(),
    //       end: moment(event.end)
    //         .set({ date: date + difference, month: month, year: year })
    //         .toDate(),
    //       title: title || '',
    //       draggable: this.state.mode === 'edit'
    //     }
    //   })
    //   this.setState(
    //     {
    //       currentDate: startingDate,
    //       events: events,
    //       currentBranch: data.branch_id,
    //       currentGrade: data.grade_id,
    //       currentSection: data.section_id,
    //       originalEvents
    //     },
    //     () => console.log(this.state)
    //   )
    // }).catch(e => {
    //   console.log(e)
    //   this.setState({ disableTimeTableGenerateButton: false })
    // })
  }

  render () {
    let classes = this.props
    return (
      <React.Fragment>

        <Toolbar
          floatRight={this.user_profile.personal_info.role !== 'Teacher' && <Form.Field>
            <label>Mode :</label>
            <ToggleButtonGroup
              value={this.state.mode}
              exclusive
              onChange={this.handleMode}
              style={{ height: 'auto', marginLeft: '8px' }}
            >
              <ToggleButton value='view'>View</ToggleButton>
              <ToggleButton value='edit'>Edit</ToggleButton>
            </ToggleButtonGroup>
          </Form.Field>
          }
        >
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          </Grid>
          <Form>
            <Form.Group>
              {this.handleUsersRole()}
              {/* <Form.Field required>
                <OmsSelect
                  label={'Grade'}
                  options={
                    this.state.mappedGrades
                      ? this.state.mappedGrades.map(mapgrade => ({
                        value: mapgrade.id,
                        gradeId: mapgrade.grade.id,
                        label: mapgrade.grade && mapgrade.grade.grade
                      }))
                      : [{ value: undefined, label: 'Loading' }]
                  }
                  change={this.changehandlergrade}
                  error={this.state.gradeError}
                />
              </Form.Field> */}

              {/* <Form.Field required>
                <OmsSelect
                  label={'Section'}
                  options={
                    this.state.mappedSections
                      ? this.state.mappedSections.map(section => ({
                        value: section.id,
                        label: section.section.section_name
                      }))
                      : [{ value: undefined, label: 'Loading' }]
                  }
                  change={this.changehandlersection}
                  error={this.state.sectionError}
                />
              </Form.Field> */}

              {/* <Form.Field className='positionalignment' width={2}> */}
              <Button primary onClick={this.getEvents}>
                    Show
              </Button>
              {/* </Form.Field> */}
              {/* <Form.Field className='positionalignment' width={4}> */}
              {this.role !== 'Teacher'
                ? <Button primary onClick={this.generateEvents} disabled={this.state.disableTimeTableGenerateButton}>
                  Generate TimeTable
                </Button> : ''}
              {/* </Form.Field> */}
            </Form.Group>
          </Form>
        </Toolbar>
        <DragAndDropCalendar
          draggableAccessor={'draggable'}
          localizer={localizer(moment)}
          date={this.state.currentDate}
          min={moment()
            .set({ hour: 8, minute: 30, second: 0 })
            .toDate()}
          max={moment()
            .set({ hour: 17, minute: 0, second: 0 })
            .toDate()}
          defaultView={BigCalendar.Views.WORK_WEEK}
          views={['work_week']}
          events={this.state.events}
          step={1}
          timeslots={15}
          style={{ fontFamily: 'Arial', fontWeight: 'bold' }}
          showMultiDayTimes
          onEventDrop={e => console.log(e)}
          onEventResize={e => console.log(e)}
          onSelectEvent={(event, synthetic) => {
            let eventIndex = this.state.events.findIndex(item => item.id === event.id)
            let NonSubjectList = ['Arrival', 'Attendance', 'Assembly and Break', 'Short break1', 'Long Break', 'Short break2', 'Dispersal']
            if (!NonSubjectList.includes(this.state.events[eventIndex].description)) {
              this.setState({
                anchorEl: synthetic.currentTarget,
                openPop: true,
                currentEvent: event,
                currentEventIndex: eventIndex
              })
            }
          }}
        />
        <StyledPopover
          id='simple-popper'
          open={this.state.openPop}
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ openPop: false })}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          classes={{
            paper: classes.paper
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <div style={{ width: '15vw', margin: '0.5vw', minWidth: '150px' }} >
            {this.state.currentEvent && this.state.currentEvent.draggable
              ? (
                <h4>
                  <ReactSelect
                    onChange={this.updateEvent}
                    search
                    options={this.props.subjects &&
                        this.props.subjects.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                    }
                  />
                </h4>
              ) : (
                <h4>
                  {this.state.currentEvent && this.state.currentEvent.title && this.state.currentEvent.description}
                </h4>
              )}
            <div><p style={{ color: 'black' }} >
              {this.state.currentEvent && this.state.currentEvent.description} </p>
            </div>
            {this.state.currentEvent &&
                  moment(this.state.currentEvent.start).format(' HH:mm')}{' '}
                to{' '}
            {this.state.currentEvent &&
                  moment(this.state.currentEvent.end).format('HH:mm')}
          </div>
        </StyledPopover>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  loadGrades: dispatch(apiActions.listGrades()),
  loadSections: dispatch(apiActions.listSections()),
  loadSubjects: dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTimeTable)
