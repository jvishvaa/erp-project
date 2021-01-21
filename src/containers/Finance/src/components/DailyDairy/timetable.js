import React from 'react'
import Card from '@material-ui/core/Card'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import moment from 'moment'
import axios from 'axios'
import { urls } from '../../urls'

function TabContainer (props) {
  return <div>{props.children}</div>
}

class TimeTable extends React.Component {
  constructor () {
    super()
    this.state = {
      organizedData: {},
      currentTab: 'MONDAY'
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
    // this.role = JSON.parse(localStorage.getItem('user_profile')).student_timetable.role
    this.token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
    let branchId = JSON.parse(localStorage.getItem('user_profile')).branch_id
    let gradeId = JSON.parse(localStorage.getItem('user_profile')).grade_id
    let sectionId = JSON.parse(localStorage.getItem('user_profile')).section_id
    // this.userToken = JSON.parse(localStorage.getItem('id_token'))

    axios.get(`${urls.TimeTable}?branch_id=${branchId}&grade_id=${gradeId}&section_id=${sectionId}`, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => {
        let events = res.data
        let organizedData = {}
        events.forEach((event) => {
          let eventStartDate = event.start
          let weekDay = moment(eventStartDate).weekday()
          let dayOfTheWeek = (moment.weekdays(weekDay)).toUpperCase()
          if (organizedData[dayOfTheWeek]) {
            organizedData[dayOfTheWeek].push(event)
          } else {
            organizedData[dayOfTheWeek] = [event]
          }
        })
        this.setState({ organizedData })
      })
      .catch(error => {
        console.log(error)
      })
  }
  handleChange (event, value) {
    this.setState({ currentTab: value })
  }
  render () {
    let { organizedData, currentTab } = this.state
    return (
      <div>
        <Toolbar
          containerStyle={{ padding: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
          style={{ padding: 0 }}>
          <Tabs
            variant='scrollable'
            scrollButtons='auto'
            onChange={this.handleChange}
            value={this.state.currentTab}
          >
            <Tab label='MONDAY' value='MONDAY' />
            <Tab label='TUESDAY' value='TUESDAY' />
            <Tab label='WEDNESDAY' value='WEDNESDAY' />
            <Tab label='THURSDAY' value='THURSDAY' />
            <Tab label='FRIDAY' value='FRIDAY' />
            <Tab label='SATURDAY' value='SATURDAY' />
          </Tabs>
        </Toolbar>

        <div container>
          {<TabContainer>{
            organizedData[currentTab] && organizedData[currentTab].map(event => {
              let title
              try {
                let parsableData = event.title.replace(/'/g, '"')
                console.log(parsableData)
                let titleData = JSON.parse(parsableData)
                title = titleData.subject_name
              } catch (e) {
                title = event.title
              }
              return (
                <Card style={{ marginTop: 20,
                  textAlign: 'center',
                  textColor: 'green'
                }}
                >
                  {console.log(event.title)}
                  <h3>{title}</h3>
                  <p style={{ color: 'rgb(60,179,113)' }}>{event.description}</p>
                </Card>
              )
            })
          }</TabContainer>}
        </div>

      </div>
    )
  }
}
export default TimeTable
