import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import TableRow from '@material-ui/core/TableRow/TableRow'
import TableHead from '@material-ui/core/TableHead/TableHead'
import TableCell from '@material-ui/core/TableCell/TableCell'
import Table from '@material-ui/core/Table/Table'
import TableBody from '@material-ui/core/TableBody/TableBody'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { connect } from 'react-redux'
import axios from 'axios'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'

class TeacherHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    // getting report data based on report id
    axios
      .get(urls.ReportHistory + '?report_id=' + this.props.match.params.id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        if (res.data.includes('Resource does not exists')) {
        } else {
          this.setState({ reportHistoryData: res.data })
        }
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.ReportHistory + error)
      })
  }

  render () {
    let { reportHistoryData } = this.state
    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={12}
              tablet={15}
              className='staff-table1'
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Recap of prev class</TableCell>
                    <TableCell>Details of Class Work</TableCell>
                    <TableCell>End Summary Check</TableCell>
                    <TableCell>Support Materials</TableCell>
                    <TableCell>Homework Given</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { reportHistoryData && reportHistoryData.map((report, index) => {
                    return (
                      <TableRow key={index + 1}>
                        <TableCell>{moment(report.history_date).format('DD/MM/YYYY HH:MM:SS')}</TableCell>
                        <TableCell>{moment(report.createdAt).format('DD/MM/YYYY HH:MM:SS')}</TableCell>
                        <TableCell>{moment(report.updatedAt).format('DD/MM/YYYY HH:MM:SS')}</TableCell>
                        <TableCell>{report.added_by ? report.added_by.first_name : ''}</TableCell>
                        <TableCell>{report.recap}</TableCell>
                        <TableCell>{report.classswork}</TableCell>
                        <TableCell>{report.summary}</TableCell>
                        <TableCell>{report.support_materials}</TableCell>
                        <TableCell>{report.homework}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => (
  {
    branches: state.branches.items,
    user: state.authentication.user
  }
)

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TeacherHistory))
