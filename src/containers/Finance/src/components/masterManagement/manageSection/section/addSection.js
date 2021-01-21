import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Grid, Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import '../../../css/staff.css'
import AuthService from '../../../AuthService'
import { AlertMessage } from '../../../../ui'
import { urls } from '../../../../urls'

class AddSection extends Component {
  constructor () {
    super()
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      section_name: ''
    }
  }

  handlevalue = e => {
    e.preventDefault()
    if (!e.target.section_name.value) {
      this.setState({
        alertMessage: {
          messageText: 'Enter section name.',
          variant: 'warning',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      return
    }
    this.setState({
      section_name: e.target.section_name.value
    })
    console.log(this.state)
    axios
      .post(urls.SECTION, this.state, {
        headers: { Authorization: 'Bearer ' + this.auth_token }
      })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Successfully added section',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
        //  alert("Successfully added Section");
      })
      .catch(error => {
        // alert("Section Alraedy Exists")
        this.setState({
          alertMessage: {
            messageText: 'Section already exists',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data.section_name)
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
        console.log("Error: Couldn't fetch data from " + urls.SectionMapping)
      })
  };

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue}>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={6} mobile={15} tablet={6}>
                <label>Section*</label>
                <input
                  name='section_name'
                  onChange={e =>
                    this.setState({ section_name: e.target.value })
                  }
                  value={this.state.section_name}
                  type='text'
                  className='form-control'
                  placeholder='Section'
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Grid>
            <Grid.Row>
              <Grid.Column computer={8} mobile={15} tablet={10}>
                <Button
                  value='submit'
                  disabled={!this.state.section_name}
                  color='green'
                >
              Save
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

export default (withRouter(AddSection))
