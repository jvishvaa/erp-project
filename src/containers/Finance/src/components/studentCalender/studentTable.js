import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from 'moment'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios'
import withDragAndDrop from '../manageTimeTable/dragAndDrop'
import '../css/staff.css'
import { InternalPageStatus } from '../../ui'

import { urls } from '../../urls'
import AuthService from '../AuthService'
import DailyDiaryMobile from '../DailyDairy/timetable'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class StudentCalender1 extends Component {
  constructor (props) {
    super(props)
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      events: []
    }
  }

  handleEvent = e => {
    console.log(e)
  };

  componentDidMount () {
    axios
      .get(
        urls.TimeTable +
          `?branch_id=${
            JSON.parse(localStorage.getItem('user_profile')).branch_id
          }&grade_id=${
            JSON.parse(localStorage.getItem('user_profile')).grade_id
          }&section_id=${
            JSON.parse(localStorage.getItem('user_profile')).section_id
          }`,
        {
          headers: {
            Authorization: 'Bearer ' + this.auth_token }
        }
      )
      .then(res => {
        console.log(res)
        if (res.status === 200 && res.data.length > 0) {
          let eventArr = res.data.map(v => {
            let title = v.title.replace(/'/g, '"')
            try {
              title = JSON.parse(title)
              title = title.subject_name
            } catch (err) {
              title = v.title
            }
            return {
              id: v.id,
              title: title,
              start: new Date(`${v.start}`),
              end: new Date(`${v.end}`),
              description: v.description ? v.description : 'No Description'
            }
          })
          console.log('manipulation of response', eventArr)
          this.setState({ events: eventArr, status: res.status })
        } else {
          this.setState({ status: res.status })
        }
      })
  }

  render () {
    let{ status } = this.state
    if (status === 200) {
      return (

        !window.isMobile ? <React.Fragment>
          <DragAndDropCalendar
            selectable
            localizer={localizer(moment)}
            events={this.state.events}
            min={moment()
              .set({ hour: 8, minute: 30, second: 0 })
              .toDate()}
            max={moment()
              .set({ hour: 17, minute: 0, second: 0 })
              .toDate()}
            step={1}
            timeslots={15}
            showMultiDayTimes
            onSelectEvent={this.handleEvent}
            resizable
            defaultView={BigCalendar.Views.WORK_WEEK}
            views={['work_week']}
            date={
              this.state.events.length > 0
                ? this.state.events[0].start
                : Date.now
            }
            toolbar=''
          /> </React.Fragment> : <DailyDiaryMobile />

      )
    } else if (status === 204) {
      return (
        <InternalPageStatus label='Hang tight! We are getting more content for you soon!' loader={false} />)
    } else {
      return (
        <InternalPageStatus label='Loading.......' loader />)
    }
  }
}
const StudentTimeTable = DragDropContext(HTML5Backend)(StudentCalender1)
export default StudentTimeTable
