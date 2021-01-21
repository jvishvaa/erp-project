import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Place, PermIdentity, ChildCare, SupervisedUserCircle } from '@material-ui/icons'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class CountData extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      studentCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=' + 'countdata'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          branchCount: res.data.no_of_branches, teacherCount: res.data.no_of_teachers, studentsCount: res.data.no_of_students, plannerCount: res.data.no_of_planners
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
              <TableCell style={{ color: 'red' }}><Place /></TableCell>
              <TableCell >Branches</TableCell>
              <TableCell align='right'>{this.state.branchCount }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#1e229c' }}><PermIdentity /> </TableCell>
              <TableCell >Teachers</TableCell>
              <TableCell align='right'>{this.state.teacherCount } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#db2828' }}><ChildCare /> </TableCell>
              <TableCell >Students</TableCell>
              <TableCell align='right'>{this.state.studentsCount } </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: '#0e568c' }}><SupervisedUserCircle /></TableCell>
              <TableCell >Planners</TableCell>
              <TableCell align='right'>{this.state.plannerCount } </TableCell>
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
)(withRouter(CountData))
