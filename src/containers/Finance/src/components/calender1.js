import React, { Component } from 'react'
// import { Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import DateRangePicker from 'react-bootstrap-daterangepicker'
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css'
import './css/staff.css'

export default class Calender extends Component {
  constructor (props) {
    super()
    this.state = {

    }
  }

  handleEvent (event, picker) {
    let y1 = picker.startDate._d.getFullYear()
    let y2 = picker.endDate._d.getFullYear()
    let m1 = picker.startDate._d.getMonth()
    let m2 = picker.endDate._d.getMonth()
    let d1 = picker.startDate._d.getDate()
    let d2 = picker.endDate._d.getDate()
    let first = `${d1}` + `-` + `${m1}` + `-` + `${y1}`
    let second = `${d2}` + `-` + `${m2}` + `-` + `${y2}`
    let comp = `${first}` + `-----` + `${second}`
    console.log(comp)
    // this.setState={comp1:comp,...this.state};
  }

  render () {
    return (
      <DateRangePicker onApply={this.handleEvent} startDate='1/1/2014' endDate='3/1/2014'>

        <Button className='calender' color='teal' content='Select Date Range' />

      </DateRangePicker>
    )
  }
}
