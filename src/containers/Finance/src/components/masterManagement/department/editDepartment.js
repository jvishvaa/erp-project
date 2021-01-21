import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import AuthService from '../../AuthService'
import { urls } from '../../../urls'
import { AlertMessage } from '../../../ui'
import '../../css/staff.css'

class EditDepartment extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {}
  }
  componentDidMount () {
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    //       console.log(id);
    var UpdateStaff = urls.DEPARTMENT + +id + '/'
    axios
      .get(UpdateStaff, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res.data)
        this.setState({
          deptname: res.data.department_name
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  handlevalue = e => {
    e.preventDefault()
    var object = {
      department_name: e.target.deptname.value
    }
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var ResponseList = urls.DEPARTMENT + id + '/'

    axios
      .put(ResponseList, object, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Successfully  Updated Department',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        } else {
          this.setState({
            alertMessage: {
              messageText: 'Error: Something went wrong, please try again.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null, error })
            }
          }
        })
      })
    // alert('Successfully  Updated Department');
  };

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue} style={{ padding: '20px' }}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Department Name*</label>
              <input
                onChange={e =>
                  this.setState({ deptname: e.target.value })
                }
                value={this.state.deptname}
                name='deptname'
                placeholder='Department Name'
              />
            </Form.Field>
          </Form.Group>
          <Button type='submit' color='green'>
            Save
          </Button>
          <Button
            primary
            onClick={this.props.history.goBack}
            type='button'
          >
            Return
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(EditDepartment)
