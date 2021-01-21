import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { urls } from '../../../urls'

class BranchWiseTeacherReportCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,

      selectedDate: moment().format('YYYY-MM-DD')
    }
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  componentDidMount () {
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=teachherreportbranchwisecount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          teacherReportBranchWiseCount: res.data.branch_wise_teacher_report_today_count

        })
      })
      .catch(error => {
        console.log(error)
      })
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  handleDateChange (update) {
    this.setState({ selectedDate: update.format('YYYY-MM-DD') })
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=teachherreportbranchwisecount' + '&user_date=' + update.format('YYYY-MM-DD')}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          teacherReportBranchWiseCount: res.data.branch_wise_teacher_report_today_count

        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render () {
    let { selectedDate } = this.state
    let { teacherReportBranchWiseCount } = this.state
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell align='center'>Count</TableCell>
              <TableCell align='right'> <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  style={{ margin: 8 }}
                  value={selectedDate}
                  onChange={this.handleDateChange}
                />
              </MuiPickersUtilsProvider></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            { teacherReportBranchWiseCount && teacherReportBranchWiseCount.length > 0 && teacherReportBranchWiseCount.map((row, index) => (
              <TableRow key={index}>
                <TableCell component='th' scope='row'>
                  <Link
                    onClick={() => { this.props.history.push(`teacher-report/view/` + row.branch_name) }}
                  >{row.branch_name}</Link>
                </TableCell>
                <TableCell align='right'>
                  {row.today_teacher_report_count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BranchWiseTeacherReportCount))
