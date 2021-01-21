
import React, { Component } from 'react'
import axios from 'axios'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import { AlertMessage } from '../../../ui'
import { urls } from '../../../urls'
import AuthService from '../../AuthService'

class AddRole extends Component {
  constructor () {
    super()
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      role_name: ''
    }
  }
  handleRole = (e) => {
    this.setState({
      role_name: e.target.value
    })
  }
  handleSubmit = (e) => {
    console.log(this.state)
    axios.post(urls.ROLE, this.state,
      { headers: { Authorization: 'Bearer ' + this.auth_token } })
      .then(res => {
        console.log(res)

        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Created Successfully',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        if (error.response.status === 409) {
          this.setState({
            alertMessage: {
              messageText: 'Role already exist',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
        //  alert("Successfully added Role");
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  };
  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handleSubmit} style={{ paddingLeft: '20px' }}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Role*</label>
              <input name='role_name' onChange={this.handleRole} type='text' className='form-control' placeholder='Role' />
            </Form.Field>
          </Form.Group>
          <Form.Group className='formargin' style={{ paddingBottom: '20px' }}>
            <Button type='submit'
              disabled={!this.state.role_name}
              color='green'>Save</Button>
            <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

export default (withRouter(AddRole))
