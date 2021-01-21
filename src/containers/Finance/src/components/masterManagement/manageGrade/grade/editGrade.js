import React, { Component } from 'react'
import Select from 'react-select'
import { Form, Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../../css/staff.css'
import { AlertMessage } from '../../../../ui'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'

class EditGrade extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      gradeTest: '',
      data: []
    }
    this.handleChangeGradeCategory = this.handleChangeGradeCategory.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('receiveprops: data: componentWillReceiveProps', nextProps)
    console.log('receiveprops: data: cat', nextProps.gradeCategory)

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var UpdateSubject = urls.GRADE + id + '/'
    var that = this

    axios
      .get(UpdateSubject, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        var arr = res['data']
        console.log('dataarr', arr)
        that.setState({
          gradeCategory: nextProps.gradeCategory
        })

        nextProps.gradeCategory.forEach(element => {
          if (element.id === arr.grade_category) {
            console.log('/data', element)
            that.setState({
              gradeid: arr.id,
              gradeTest: arr.grade,
              gradecat: { value: element.id, label: element.grade_category }
              // gradecat: element.id,
            })
          }
        })

        console.log(that.state)
      })
      .catch(function (error) {
        console.log('dataerror1', error)
        console.log("Error: Couldn't fetch data from " + urls.GRADE)
      })
  }

  handleChangeGradeCategory = e => {
    console.log(e.value)
    //   this.setState({
    //       gradeCategoryLabel:e.label,
    //       gradeCategoryValue:e.value
    //   })
    this.setState({
      gradecat: { value: e.value, label: e.label }
    })
  };

  handlevalue = e => {
    e.preventDefault()
    if (!e.target.grade.value) {
      this.setState({
        alertMessage: {
          messageText: 'Enter Grade and Grade category',
          variant: 'warning',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      return
    }
    this.setState({
      gradeTest: e.target.grade.value
    })

    console.log(this.state)
    var ResponseList = urls.GRADE + this.state.gradeid + '/'
    var _this = this
    axios
      .put(
        ResponseList,
        {
          grade: _this.state.gradeTest,
          grade_category: _this.state.gradecat.value
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.auth_token
          }
        }
      )
      .then(res => {
        console.log(res)
        this.setState({
          alertMessage: {
            messageText: 'Updated grade successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        console.log('dataerrore', error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
        console.log("Error: Couldn't fetch data from " + urls.GRADE)
      })
  };

  //    click = () =>{
  /// /       console.log("clicked");
  //       var url= window.location.href;
  //       var spl = url.split('?');
  //       var id= spl[1];
  //       console.log(id);
  //        var updatedList = urls.Subject + id + "/";
  //
  //      axios
  //         .put(updatedList, {
  //           headers: {
  //             Authorization: "Bearer " + this.auth_token
  //           }
  //         })
  //         .then((res) => {
  //          console.log(res);
  //          alert("Updated Successfully");
  //
  //         })
  //         .catch(function(error) {
  //           console.log("Error: Couldn't fetch data from " + urls.GRADE);
  //         });
  //
  //    }

  render () {
    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column computer={4} mobile={15} tablet={10}>
              Grade Information
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Form onSubmit={this.handlevalue}>
          <Grid className='student-addStudent-segment1'>
            <Grid.Row>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={6}
                className='student-section-inputField'
              >
                <label>Select Grade Category*</label>
                <Select
                  value={this.state.gradecat}
                  options={
                    this.state.gradeCategory
                      ? this.state.gradeCategory.map(gradeCategory => ({
                        value: gradeCategory.id,
                        label: gradeCategory.grade_category
                      }))
                      : []
                  }
                  onChange={this.handleChangeGradeCategory}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={6}
                className='student-section-inputField'
              >
                <label>Grade*</label>
                <input
                  name='grade'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ gradeTest: e.target.value })
                  }
                  placeholder='Grade'
                  value={this.state.gradeTest}
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
          {/* <Button  type='submit' value='submit'></Button> */}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditGrade))
