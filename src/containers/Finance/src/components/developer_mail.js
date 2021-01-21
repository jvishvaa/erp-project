import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Form } from 'semantic-ui-react'
import Checkbox from '@material-ui/core/Checkbox'
import { connect } from 'react-redux'
// import { Checkbox } from 'semantic-ui-react'
// import { Button } from '@material-ui/core'
import Button from '@material-ui/core/Button'

// import { OmsSelect, Toolbar } from '../../ui'
// import { TextField } from '@material-ui/core'
import { urls } from '../urls'
// import { common } from '@material-ui/core/colors';

class DeveloperMails extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      send_mail: false,
      list_dev: [],
      show: false

    }
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleChange = this.handleChange.bind(this)
    this.addDevs = this.addDevs.bind(this)
    this.sendmails = this.sendmails.bind(this)
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    this.is_admin = this.userProfile.personal_info.is_admin

    this.user_id = this.userProfile.personal_info.user_id
    if (this.role === 'Developer') {
      this.setState({ userId: this.user_id })
    }
  }
  componentWillMount () {
    this.getReports()
  }

  addDevs () {
    this.setState({ show: true })
    console.log(this.state.show, 'show status')
  }

  handleChange (event, index) {
    console.log(event.target)

    let { tableData } = this.state
    let userdata = {
      user_id: tableData[index].user.id,
      send_mail: event.target.checked
    }
    this.state.list_dev.push(userdata)
    console.log(this.state.list_dev, 'list dev')
  }
  sendmails () {
    axios({
      method: 'POST',
      url: urls.DeveloperListDisplay,
      headers: {
        'Authorization': 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'

      },
      data: this.state.list_dev
    })
      .then(res => {
        console.log(res.data, 'developer id')
        // this.setState({ send_mail: true })
      })
  }
    getReports = () => {
      axios.get(`${urls.DeveloperListDisplay}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res.data, 'report data')
          this.setState({ tableData: res.data })
        })
        .catch(error => {
          console.log(error)
        })
    }
    render () {
      let { tableData } = this.state
      console.log(this.is_admin, 'is admin check')
      return (

        <Form.Field required width={4}>
          <div style={{ float: 'right' }}>
            {this.is_admin
              ? <div> <Button onClick={this.addDevs}> Edit </Button>
                <Button onClick={this.sendmails}>Save</Button> </div> : ''}
          </div>
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
                Header: 'User Id',
                accessor: 'user.id',
                width: 100
              },
              {
                Header: 'User Name',
                accessor: 'user.username',
                width: 150
              },

              {
                Header: (<div> {this.is_admin ? 'Assign to' : ''}</div>),
                accessor: 'send_mail',
                Cell: rowInfo => (<div> { this.state.show && this.is_admin
                  ? <Checkbox value={rowInfo.send_mail} key={rowInfo.index}
                    onChange={(event) => this.handleChange(event, rowInfo.index)} /> : '' } </div>),
                width: 80
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

export default connect(mapStateToProps)(DeveloperMails)
