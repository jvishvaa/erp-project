import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Grid
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { AlertMessage } from '../../../../ui'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'

class editSection extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      section: '',
      data: []
    }
  }
  componentDidMount () {
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(id)
    var UpdateSection = urls.SECTION + id + '/'
    axios
      .get(UpdateSection, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        var arr = res['data']
        console.log(arr)
        this.setState({
          section: arr.section_name
        })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
      })
  }

  handlevalue = e => {
    e.preventDefault()
    var arr
    arr = {
      section_name: e.target.section.value
    }

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(arr)
    var ResponseList = urls.SECTION + id + '/'

    axios
      .put(ResponseList, arr, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Updated successfully',
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
        // alert("Updated Successfully");
      })
      .catch((error) => {
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
        <Form onSubmit={this.handlevalue}>
          <Grid className='student-addStudent-segment1'>
            <Grid.Row>
              <Grid.Column
                computer={7}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <label>Section*</label>
                <input
                  name='section'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ section: e.target.value })
                  }
                  placeholder='Section'
                  value={this.state.section}
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
          {/* <Button  type='submit' value='submit'></Button> */}
        </Form>
      </React.Fragment>
    )
  }
}

export default (withRouter(editSection))
