import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
// import { Button } from '@material-ui/core'
// import { OmsSelect, Toolbar } from '../../ui'
import { TextField, Button } from '@material-ui/core'
import { urls } from '../../urls'

class IntegrationTesting extends Component {
  constructor () {
    super()
    this.state = {
      date: new Date().toISOString().substr(0, 10),
      loading: true
    }
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
  }
    state = { pages: -1 }
    getPath = (state) => {
      let { IntegrationTestReport: path } = urls
      let { state: { queryUrl: qUrl, queryUserName: qUser, queryErrorMessage: qEM, queryContext: qC, queryReportedDatetime: qDate, userNamesListMap: usNamesMap = new Map() } } = this
      let queryParams = new Map([
        ['pageNumber', (state.page + 1)],
        ['pageSize', state.pageSize],
        ['url', qUrl],
        ['context', qC],
        ['errorMessage', qEM],
        ['userId', usNamesMap.get(qUser) || null],
        ['reported_datetime', qDate ? qDate.split('T')[0] : null]
      ])
      path += '?'
      queryParams.forEach((val, key) => {
        if (val) { path += key + '=' + val + '&' }
      })
      this.setState({ page: state.page, pageSize: state.pageSize })
      return path
    }
    // fetchData = (state, instance) => {
    //   let { headers, getPath: gP, userNamesMap: uSP } = this
    //   let path = gP(state)
    //   this.setState({ loading: true })
    //   axios.get(path, headers)
    //     .then(r => {
    //       console.log(r, 'result')
    //       console.log(r.data.report_data, 'report dataaa')
    //       this.setState({
    //         apiRes: { ...r.data, report_data: 'look in state.reportData' },
    //         reportData: r.data.report_data,
    //         pages: r.data.total_pages,
    //         loading: false
    //       },
    //       () => { setTimeout(uSP, 0) }
    //       )
    //     })
    //     .catch(e => this.setState({ reportData: undefined }))
    // }

    getReports = () => {
      axios.get(`${urls.IntegrationTestReport}?date_filter=${this.state.date}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res.data, 'report data')
          this.setState({ tableData: res.data.results })
        })
        .catch(error => {
          console.log(error)
        })

      // this.setState({ date: event.target.value })
    }

    handleDateChange (update) {
      this.setState({ selectedDate: update.format('YYYY-MM-DD') })
    }
    render () {
      let { tableData } = this.state
      return (
        <Form.Field required width={4}>
          {/* <label>Date</label> */}
          <TextField
            id='date'
            label='Date'
            type='date'
            margin='normal'
            defaultValue={this.state.date}
            onChange={e => this.setState({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() => this.getReports()}>
              Get Reports
          </Button>
          <ReactTable
            manual
            data={tableData}
            className='-highlight'
            columns={[
              {
                Header: 'Sr',
                accessor: 'id',
                Cell: (row) => {
                  return <div>{row.index + 1}</div>
                },
                width: 60
              },
              {
                Header: 'Test Suite name',
                accessor: 'testcase[0].test_suite_name',
                width: 80
              },
              {
                Header: 'Test Case',
                accessor: 'testcase[0].test_case',
                width: 80
              },
              {
                Header: 'Status',
                accessor: 'status.status',
                width: 80
              },
              {
                Header: 'Url',
                accessor: 'status.response'
              },
              // {
              //   id: 'error message',
              //   Header: 'message',
              //   accessor: props => {
              //     let eMessage = props.error_message
              //     let message = eMessage.split(':')
              //     message = message[0].length < 50 ? message[0] : eMessage.substr(0, 40) + '...'
              //     return message
              //   }
              // },
              {
                Header: 'Test duration',
                accessor: 'status.duration'
              },
              {
                Header: 'Date and Time',
                accessor: 'status.date_time'
              }
            ]}
          />
        </Form.Field>
      )
    }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(IntegrationTesting)
