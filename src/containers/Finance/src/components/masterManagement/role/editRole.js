import React, { Component } from 'react'
import {
  Form,
  Grid
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import AuthService from '../../AuthService'
import { urls } from '../../../urls'
import '../../css/staff.css'
import { AlertMessage } from '../../../ui'

class EditRole extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      role: '',
      data: []
    }
  }

  changehandlerbranch = e => {
    console.log(e.value)
    this.setState({
      branch: e.label
    })
  };

  componentDidMount () {
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var UpdateRole = urls.ROLE + id + '/'
    axios
      .get(UpdateRole, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        var arr = res['data']
        var that = this
        console.log(arr)
        that.setState({
          role: arr.role_name
        })

        console.log(that.state)
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
      })
  }

  handlevalue = e => {
    e.preventDefault()
    var arr
    arr = {
      role_name: e.target.role.value
    }

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(arr)
    var ResponseList = urls.ROLE + id + '/'

    axios
      .put(ResponseList, arr, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        //   alert("Updated Role Successfully");
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Updated role successfully',
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
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
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
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column computer={4} mobile={15} tablet={10}>
                    Role Information
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form onSubmit={this.handlevalue}>
          <Grid className='student-addStudent-segment1'>
            <Grid.Row>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <label>Role*</label>
                <input
                  name='role'
                  type='text'
                  className='form-control'
                  onChange={e => this.setState({ role: e.target.value })}
                  placeholder='Role'
                  value={this.state.role}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={15}
                className='student-section-addstaff-button'
              >
                <Button type='submit' onClick={this.click} color='green'>
                        Update
                </Button>
                <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

export default (withRouter(EditRole))
