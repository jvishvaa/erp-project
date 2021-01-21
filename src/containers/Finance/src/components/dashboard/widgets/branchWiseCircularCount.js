import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Link from '@material-ui/core/Link'
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

class BranchWiseCircularCount extends Component {
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
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=circularbranchwisecount'}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          circularBranchWiseCount: res.data.branch_wise_circular_today_count

        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleDateChange (update) {
    this.setState({ selectedDate: update.format('YYYY-MM-DD') })
    axios.get(`${urls.DashboardConsolidationReport + '?report_type=circularbranchwisecount' + '&user_date=' + update.format('YYYY-MM-DD')}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          circularBranchWiseCount: res.data.branch_wise_circular_today_count

        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render () {
    let { selectedDate } = this.state
    let { circularBranchWiseCount } = this.state
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
            { circularBranchWiseCount && circularBranchWiseCount.length > 0 && circularBranchWiseCount.map((row, index) => (
              <TableRow key={index}>
                <TableCell component='th' scope='row'>
                  <Link
                    onClick={() => { this.props.history.push(`v2/circular/view/` + row.branch_name) }}
                  >{row.branch_name}</Link>
                </TableCell>
                <TableCell align='right'>
                  {row.today_circular_count}
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
)(withRouter(BranchWiseCircularCount))
