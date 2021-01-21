import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'
import { OmsSelect, AlertMessage } from '../../../../ui'
import '../../../css/staff.css'

class AddGrade extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      grade: '',
      grade_category: ''
    }
    this.handleChangeGradeCategory = this.handleChangeGradeCategory.bind(this)
  }

  handleChangeGradeCategory = event => {
    console.log(event)
    this.setState({
      grade_category: event.value
    })
  }

  handlevalue = (e) => {
    e.preventDefault()
    if (!e.target.grade.value) {
      this.setState({
        alertMessage: {
          messageText: 'Enter grade',
          variant: 'warning',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      return
    }
    this.setState({
      grade: e.target.grade.value
    })
    axios
      .post(urls.GRADE, this.state,
        { headers: { Authorization: 'Bearer ' + this.auth_token } })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
        // alert("Successfully added Grade");
          this.setState({
            alertMessage: {
              messageText: 'Successfully added grade',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        } else {
        // alert("Unknown status code" + res.data);
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
        console.log(error.response.data)
        if (error.response.status === 400) {
          this.setState({
            alertMessage: {
              messageText: 'Grade already exists.',
              variant: 'error',
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
  }

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue} style={{ padding: '20px' }}>
          <Form.Group >
            <Form.Field width={5}>
              <label>Grade Category*</label>
              <OmsSelect
                options={this.props.gradeCategory ? this.props.gradeCategory.map((gradeCategory) => ({ value: gradeCategory.id, label: gradeCategory.grade_category })) : []}
                change={this.handleChangeGradeCategory}
              />
            </Form.Field>
            <Form.Field width={5}>
              <label >Grade*</label>
              <input name='grade' onChange={(e) => this.setState({ grade: e.target.value })} value={this.state.grade} type='text' className='form-control' placeholder='Enter Grade' />
            </Form.Field>
          </Form.Group>

          <Form.Group className='formargin1' width={12}>
            <Button onClick={this.click} type='submit'
              disabled={!this.state.grade_category ||
              !this.state.grade}
              color='green'>Save</Button>
            <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  gradeCategory: state.gradeCategory.items
})

const mapDispatchToProps = dispatch => ({
  loadGradeCategory: dispatch(apiActions.listGradeCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddGrade))
