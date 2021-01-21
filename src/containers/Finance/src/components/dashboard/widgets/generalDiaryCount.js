import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { urls } from '../../../urls'

class GeneralDiaryCount extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      studentCount: {}
    }
  }

  componentDidMount () {
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=' + 'generaldiarybranchwisecount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          totalGeneralDiaryCount: res.data.general_diary_count.total_general_diary_count, toDayGeneralDiaryCount: res.data.general_diary_count.today_total_generL_diary_count
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
              <TableCell>Today's General Diary Count</TableCell>
              <TableCell align='right'>{this.state.toDayGeneralDiaryCount }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total General Diary Count </TableCell>
              <TableCell align='right'>{this.state.totalGeneralDiaryCount } </TableCell>
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
)(withRouter(GeneralDiaryCount))
