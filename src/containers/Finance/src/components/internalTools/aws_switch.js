import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { urls } from '../../urls'
// import { Form } from 'semantic-ui-react'

class AwsRouterSwitch extends Component {
  constructor () {
    super()
    this.state = {
      // is_admin: true
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleSwitch = this.handleSwitch.bind(this)
  }
  componentDidMount () {
    this.is_admin = this.userProfile.personal_info.is_admin
  }
  componentWillMount () {
    this.getPage()
  }
  handleSwitch () {
    axios.post(`${urls.SwitchRouter}` + '/', {}, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(this.getPage, 2000)
          setTimeout(this.getPage, 3000)
        }
      })
  }
  getPage = () => {
    this.setState({ isDataLoading: true })
    axios.get(`${urls.SwitchRouter}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data, 'report data')
        let { rule_list: tableData = [] } = res.data
        this.setState({ tableData, isDataLoading: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({ isDataLoading: false })
      })
  }
  render () {
    let { tableData, isDataLoading } = this.state
    return (
      <Form.Field>
        <ReactTable
        // manual
          loading={isDataLoading}
          data={tableData || []}
          showPageSizeOptions={false}
          showPagination={false}
          defaultPageSize={2}
          className='-highlight'
          columns={[
            {
              Header: 'Sr',
              accessor: 'id',
              Cell: (row) => {
                return <div>{row.index + 1}</div>
              }

            },
            {
              Header: 'Host Name',
              accessor: 'host_name'
            },
            {
              Header: 'Friendly Name',
              accessor: 'name'

            },
            {
              Header: 'Private IP',
              accessor: 'private_ip'

            },
            {
              Header: 'Public IP',
              accessor: 'public_ip'

            },
            {
              Header: 'Health Status',
              accessor: 'health_status'
            },
            {
              Header: 'Status',
              accessor: 'status'

            }
          ]}
          getTrProps={(state, rowInfo, column, instance) => {
            // eslint-disable-next-line no-debugger
            // debugger
            if (typeof rowInfo !== 'undefined') {
              return {
                style: {
                  background: rowInfo.original.status === 'Active' ? 'green' : 'blue'
                }
              }
            } else {
              return {
                style: {
                  background: 'white'
                }
              }
            }
          }}

        />
        {this.is_admin
          ? <div style={{ display: 'flex' }}>
            <Button variant='raised' size='large' color='primary' style={{ margin: 'auto', width: '30%' }} onClick={this.handleSwitch}> Switch </Button>
          </div>
          : null }

      </Form.Field>
      // <div>
      // <Button onClick={this.handleSwitch}> Switch </Button>
      // </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(AwsRouterSwitch)
