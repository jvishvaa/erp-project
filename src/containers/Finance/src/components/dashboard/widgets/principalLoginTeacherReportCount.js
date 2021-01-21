import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Today, Cloud } from '@material-ui/icons'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class PrincipalLoginTeacherReportCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      studentCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=' + 'teacherreportcount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          totalTeacherReportCountPrin: res.data.teacher_report_count.total_teacher_report_count, todayTeacherReportCountPrin: res.data.teacher_report_count.today_teacher_report_count
        })
      })
      .catch(error => {
        console.log(error)
      })
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  render () {
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell> Details</TableCell>
              <TableCell align='right'>COUNT</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Today /></TableCell>
              <TableCell>Today's TeacherReport Count</TableCell>
              <TableCell align='right'>{this.state.todayTeacherReportCountPrin }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Cloud /> </TableCell>
              <TableCell>Total TeacherReport Count</TableCell>
              <TableCell align='right'>{this.state.totalTeacherReportCountPrin } </TableCell>
            </TableRow>

          </TableHead>
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
)(withRouter(PrincipalLoginTeacherReportCount))
