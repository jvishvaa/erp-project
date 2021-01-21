
import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import { AlertMessage } from '../../../ui'
import { urls } from '../../../urls'
import AuthService from '../../AuthService'

class AddDepartment extends Component {
  constructor () {
    super()
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      department_name: ''
    }
  }

  handleSubmit = (e) => {
    this.setState({
      department_name: e.target.department_name.value
    })
    console.log(this.state)
    axios.post(urls.DEPARTMENT, this.state,
      { headers: { Authorization: 'Bearer ' + this.auth_token } })
      .then(res => {
        console.log(res)

        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Successfully added Department',
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
      .catch((error) => {
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
  }

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handleSubmit} >
          <Form.Group >
            <Form.Field width={5} style={{ paddingLeft: '20px' }}>
              <label>Department*</label>
              <input name='department_name' onChange={(e) => this.setState({ department_name: e.target.value })} value={this.state.department_name} type='text' className='form-control' placeholder='Department' />
            </Form.Field>
          </Form.Group>

          <Form.Group className='formargin'>
            <Form.Field width={5} style={{ padding: '20px' }}>
              <Button type='submit'
                disabled={!this.state.department_name}
                color='green'>Save</Button>
              <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
            </Form.Field>

          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

export default (withRouter(AddDepartment))
