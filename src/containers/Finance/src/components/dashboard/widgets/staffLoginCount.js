import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class StaffLoginCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      staffCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.LoginCount}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          staffCount: res.data.staff_count
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
              <TableCell> DETAILS</TableCell>
              <TableCell align='right'>COUNT</TableCell>
            </TableRow>
            <TableRow>
              <TableCell> Today Web Login's</TableCell>
              <TableCell align='right'>{this.state.staffCount.staff_today_web_login_count} </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Web Login's</TableCell>
              <TableCell align='right'>{this.state.staffCount.total_staff_web_login_count }</TableCell>
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
)(withRouter(StaffLoginCount))
