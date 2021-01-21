import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Android, Language, Cloud } from '@material-ui/icons'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class StudentLoginCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      studentCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.LoginCount + '?report_type=' + 'studentlogincount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          studentCount: res.data.student_count
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
              <TableCell> DETAILS</TableCell>

              <TableCell align='right'>COUNT</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#217bbf' }}><Language /> </TableCell>
              <TableCell>Today Web Login's</TableCell>

              <TableCell align='right'>{this.state.studentCount.student_today_web_login_count }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#0ea04f' }}><Android /></TableCell>
              <TableCell>Today Android Login's </TableCell>

              <TableCell align='right'>{this.state.studentCount.student_today_android_login_count } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: 'blue' }}><Cloud /></TableCell>
              <TableCell>Total Today Login's </TableCell>

              <TableCell align='right'>{this.state.studentCount.total_student_today_login_count } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#217bbf' }}><Language /></TableCell>
              <TableCell>Total Web Login's</TableCell>

              <TableCell align='right'>{this.state.studentCount.total_student_web_login_count } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#0ea04f' }}><Android /></TableCell>
              <TableCell>Total Android Login's</TableCell>

              <TableCell align='right'>{this.state.studentCount.total_student_android_login_count } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Total Login's</TableCell>

              <TableCell align='right'>{this.state.studentCount.total_student_login_count } </TableCell>
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
)(withRouter(StudentLoginCount))
