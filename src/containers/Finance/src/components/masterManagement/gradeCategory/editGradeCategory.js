
import React, { Component } from 'react'
import {
  Form
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { AlertMessage } from '../../../ui'
import '../../css/staff.css'
import { urls } from '../../../urls'

class EditGradeCategory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      grade_category: ''
    }
  }

  componentDidMount () {
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var UpdateSubject = urls.GRADECATEGORY + id + '/'
    axios
      .get(UpdateSubject, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var arr = res['data']
        var that = this
        console.log(arr.grade_category)
        that.setState({
          grade_category: arr.grade_category
        })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADECATEGORY, error)
      })
  }

  handlevalue = e => {
    e.preventDefault()
    this.setState({
      grade_category: e.target.grade_category.value
    })

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(this.state)
    var ResponseList = urls.GRADECATEGORY + id + '/'

    axios
      .put(ResponseList, this.state, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({
            alertMessage: {
              messageText: 'Updated GradeCategory Successfully',
              variant: 'success',
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
              this.setState({ alertMessage: null }, error)
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
          <Form.Group>
            <Form.Field width={5}>
              <label>Grade Category*</label>
              <input
                name='grade_category'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ grade_category: e.target.value })
                }
                placeholder='Grade'
                value={this.state.grade_category}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group className='formargin' style={{ paddingbottom: '20px' }}>
            <Form.Field width={5}>
              <Button type='submit' color='green'>
                  Update
              </Button>
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

export default connect(mapStateToProps)(withRouter(EditGradeCategory))
