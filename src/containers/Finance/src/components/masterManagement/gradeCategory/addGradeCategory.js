
import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AlertMessage } from '../../../ui'
import { urls } from '../../../urls'
import '../../css/staff.css'

class AddGradeCategory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      grade_category: ''
    }
  }

  handleGradeCategory = (e) => {
    this.setState({
      grade_category: e.target.value
    })
  }

  handlevalue =(e) => {
    e.preventDefault()

    var ResponseList = urls.GRADECATEGORY

    axios
      .post(ResponseList, this.state, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Added GradeCategory Successfully',
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
        console.log(error)
        console.log("Error: Couldn't fetch data from " + urls.GRADECATEGORY)
        this.setState({
          alertMessage: {
            messageText: ' Grade category already exists.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  }

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handlevalue} style={{ paddingLeft: '20px' }}>
          <Form.Group >
            <Form.Field width={5}>
              <label>Grade Category*</label>
              <input name='grade_category' type='text' className='form-control' onChange={(e) => this.setState({ grade_category: e.target.value })} placeholder='Grade Category' value={this.state.grade_category} />
            </Form.Field>
          </Form.Group>

          <Form.Group className='formargin' style={{ paddingBottom: '20px' }}>
            <Form.Field width={5}>
              <Button type='submit'
                disabled={!this.state.grade_category}
                color='green'>Save</Button>
              <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withRouter(AddGradeCategory))
