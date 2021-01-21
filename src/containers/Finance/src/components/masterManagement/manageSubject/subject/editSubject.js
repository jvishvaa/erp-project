import React, { Component } from 'react'
import { Form, Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import '../../../css/staff.css'
import { AlertMessage } from '../../../../ui'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'

class EditStudent extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      subjectname: '',
      subjectdescription: '',
      data: [],
      is_optional: false
    }
  }

  componentDidMount () {
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var UpdateSubject = urls.SUBJECT + id + '/'
    axios
      .get(UpdateSubject, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        var arr = res['data']
        var that = this
        that.setState({
          subjectname: arr.subject_name,
          subjectdescription: arr.subject_description,
          is_optional: arr.is_optional
        })

        console.log('state', that.state)
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.SUBJECT, error)
      })
  }

  changehandlerbranch = e => {
    console.log(e.value)
    this.setState({
      branch: e.label
    })
  };

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  };

  handlevalue = e => {
    e.preventDefault()
    var arr

    arr = {
      subject_name: e.target.subjectname.value,
      subject_description: e.target.subjectdescription.value,
      is_optional: this.state.is_optional
    }

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(id)
    var ResponseList = urls.SUBJECT + id + '/'

    axios
      .put(ResponseList, arr, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        //  alert("Subject Updated Successfully");
        this.setState({
          alertMessage: {
            messageText: 'Subject updated Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
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
        <Grid>
          <Grid.Row>
            <Grid.Column computer={4} mobile={15} tablet={10}>
              Subject Information
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
                <label>Subject Name*</label>
                <input
                  name='subjectname'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ subjectname: e.target.value })
                  }
                  placeholder='Subject Name'
                  value={this.state.subjectname}
                />
              </Grid.Column>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <label>Subject Description*</label>
                <input
                  name='subjectdescription'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ subjectdescription: e.target.value })
                  }
                  placeholder='Subject Description'
                  value={this.state.subjectdescription}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.is_optional}
                      onChange={this.changedHandler('is_optional')}
                      color='primary'
                    />
                  }
                  label='Is Optional'
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
                <Button
                  primary
                  onClick={this.props.history.goBack}
                  type='button'
                >
                  Return
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(EditStudent)
