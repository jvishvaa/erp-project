import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios'
import '../css/staff.css'
import { urls } from '../../urls'
import AuthService from '../AuthService'

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

  handleEvent = (e) => {
    console.log(e)
  }

  componentDidMount () {
    axios
      .get(urls.Calendar + `?branch_id=${JSON.parse(localStorage.getItem('user_profile')).branch_id}`, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        let eventArr = res.data.map((v) => (
          {
            id: v.id,
            title: v.title,
            start: new Date(`${v.start}`),
            end: new Date(`${v.end}`),
            desc: v.description ? v.description : 'No Description'
          }
        ))
        console.log('manipulation of response', eventArr)
        this.setState({ events: eventArr })
      })
  }

  render () {
    return (
      <React.Fragment>
        <div style={{ padding: '20px', height: '100vh' }}>
          <DragAndDropCalendar
            selectable
            localizer={localizer(moment)}
            events={this.state.events}
            onSelectEvent={this.handleEvent}
            resizable
            defaultView={BigCalendar.Views.MONTH}
          />
        </div>
      </React.Fragment>

    )
  }
}
const StudentCalender = DragDropContext(HTML5Backend)(StudentCalender1)
export default StudentCalender
