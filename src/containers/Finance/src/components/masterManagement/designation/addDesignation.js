import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { AlertMessage } from '../../../ui'
import AuthService from '../../AuthService'
import { urls } from '../../../urls'
import '../../css/staff.css'

class AddDesignation extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      data: [],
      field: [],
      designation: ''
    }
  }

  handleDesignation = e => {
    this.setState({ designation: e.target.value })
  };

  handlevalue = e => {
    e.preventDefault()
    var arr
    arr = {
      designation_name: e.target.designation.value
    }

    axios
      .post(urls.DESIGNATION, arr, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res.data)
        // alert("Updated Successfully");
        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Added Successfully',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }

        arr = {
          designation_name: ''
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + urls.GRADE)
        this.setState({
          alertMessage: {
            messageText: 'this designation is already exist',
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
        <Form onSubmit={this.handlevalue} style={{ paddingLeft: '20px' }}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Designation*</label>
              <input
                name='designation'
                onChange={this.handleDesignation}
                type='text'
                className='form-control'
                placeholder='Designation'
              />
            </Form.Field>
          </Form.Group>
          <Form.Group
            className='formargin'
            style={{ paddingBottom: '20px' }}
          >
            <Button
              type='submit'
              disabled={!this.state.designation}
              color='green'
            >
              Save
            </Button>
            <Button
              primary
              onClick={this.props.history.goBack}
              type='button'
            >
              Return
            </Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(AddDesignation)
