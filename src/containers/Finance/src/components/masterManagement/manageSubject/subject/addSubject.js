
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { Form, Checkbox } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import '../../../css/staff.css'
import { AlertMessage } from '../../../../ui'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'

class AddSubject extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      subject_name: '',
      subject_description: '',
      is_optional: false
    }
  }

toggle = () => this.setState({ is_optional: !this.state.is_optional })

  handlevalue = (e) => {
    e.preventDefault()
    this.setState({
      subject_name: e.target.subject_name.value,
      subject_description: e.target.subject_description.value
    })
    console.log(this.state)
  }

  handleClick = (e) => {
    axios.post(urls.SUBJECT, this.state,
      { headers: { Authorization: 'Bearer ' + this.auth_token } })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Successfully added subject',
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
        // alert("Successfully addedd Subject");
      })
      .catch(() => {
        console.log("Error: Couldn't fetch data from " + urls.AddStaff)
        // this.setState({
        //   alertMessage: {
        //     messageText: 'subject already exist',
        //     variant: 'error',
        //     reset: () => {
        //       this.setState({ alertMessage: null }, error)
        //     }
        //   }
        // })
        this.props.alert.error('subject already exist')
      })
  }
  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue} style={{ paddingLeft: '20px' }}>
          <Form.Group>
            <Form.Field width={5}>
              <label >SUBJECT NAME*</label>
              <input name='subject_name' onChange={(e) => this.setState({ subject_name: e.target.value })} value={this.state.subject_name} type='text' className='form-control' placeholder='SUBJECT NAME' />
            </Form.Field>
            <Form.Field width={5}>
              <label >SUBJECT DESCRIPTION*</label>
              <input name='subject_description' onChange={(e) => this.setState({ subject_description: e.target.value })} value={this.state.subject_description} type='text' className='form-control' placeholder='SUBJECT DESCRIPTION' />
            </Form.Field>
          </Form.Group>

          <Form.Group>
            <Checkbox id='check' onChange={this.toggle} checked={this.state.is_optional} label='Optional' />
          </Form.Group>
          <Form.Group className='formargin'>
            <Button type='submit' onClick={this.handleClick}
              disabled={!this.state.subject_name ||
              !this.state.subject_description}
              color='green'>Save</Button>

            <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
          </Form.Group>
        </Form>
        <br />
      </React.Fragment>
    )
  }
}

export default (withRouter(AddSubject))
