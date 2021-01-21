import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class CircularCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      studentCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=' + 'circularcount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          totalCircularCount: res.data.circular_count.total_circular_count, toDaysCircularCount: res.data.circular_count.today_circular_count
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
              <TableCell> Details</TableCell>
              <TableCell align='right'>COUNT</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Today's Circular Count</TableCell>
              <TableCell align='right'>{this.state.toDaysCircularCount }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Circular Count </TableCell>
              <TableCell align='right'>{this.state.totalCircularCount } </TableCell>
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
)(withRouter(CircularCount))
