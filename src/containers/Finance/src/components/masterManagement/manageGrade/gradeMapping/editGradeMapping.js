import React, { Component } from 'react'
import {
  Form,
  Container,
  Grid,
  Segment,
  Breadcrumb
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'
import { OmsSelect, RouterButton, AlertMessage } from '../../../../ui'

class editGradeMapping extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      data: []

    }
    this.handleChangeGradeCategory = this.handleChangeGradeCategory.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.handleChangeGradeCategory = this.handleChangeGradeCategory.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.changehandlerbranch({ value: academicProfile.branch_id, label: academicProfile.branch }) })
    }

    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    var UpdateGradeMapping = urls.GradeMapping + id + '/'
    axios
      .get(UpdateGradeMapping, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        var arr = res['data']
        var that = this
        console.log(arr)
        that.setState({})

        console.log(that.state)
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
      })
  }

  handleChangeGradeCategory = e => {
    console.log(e.value)
    this.setState({
      gradeLabel: e.label,
      gradeValue: e.value
    })
  };

  changehandlerbranch = e => {
    console.log(e.value)
    this.setState({
      branchLabel: e.label,
      branchValue: e.value
    })
  };

  handlevalue = e => {
    e.preventDefault()
    var url = window.location.href
    var spl = url.split('?')
    var id = spl[1]
    console.log(this.state)
    var ResponseList = urls.GRADE + id + '/'
    axios
      .put(ResponseList, this.state, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        //   alert("Updated Successfully");
        this.setState({
          alertMessage: {
            messageText: 'Updated Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong. please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null }, error)
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
      <div className='student-section'>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <label className='student-heading'>Update Grade Mapping</label>&nbsp;
        <Breadcrumb size='mini' className='student-breadcrumb'>
          <Breadcrumb.Section link>Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>Grade List</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Grade</Breadcrumb.Section>
        </Breadcrumb>
        <Container className='student-section-studentDetails'>
          <Segment.Group>
            <Segment>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={4} mobile={15} tablet={10}>
                    Grade Information
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment className='student-addStudent-segment1'>
              <Form onSubmit={this.handlevalue}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      computer={6}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Branch*</label>
                      <p />
                    </Grid.Column>
                    <Grid.Column
                      computer={6}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Grade*</label>
                      <OmsSelect
                        defaultValue={
                          this.props.gradeCategory
                            ? [this.props.gradeCategory[0].grade_category]
                            : { value: '1', label: 'hello' }
                        }
                        options={
                          this.props.gradeCategory
                            ? this.props.gradeCategory.map(gradeCategory => ({
                              value: gradeCategory.id,
                              label: gradeCategory.grade_category
                            }))
                            : null
                        }
                        change={this.handleChangeGradeCategory}
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
                      <label>Branch*</label>
                      {this.role === 'Principal'
                        ? <input
                          type='text'
                          value={this.state.branch_name}
                          disabled
                          className='form-control'
                          placeholder='Branch'
                        /> : (
                          <OmsSelect
                            defaultValue={this.state.id}
                            options={
                              this.props.branches
                                ? this.props.branches.map(branch => ({
                                  value: branch.id,
                                  label: branch.branch_name
                                }))
                                : null
                            }
                            value={
                              this.role === 'Principal' &&
                                        this.state.currentPrincipalBranch
                            }
                            isDisabled={this.role === 'Principal'}
                            change={this.changehandlerbranch}
                          />
                        )}

                    </Grid.Column>
                    <Grid.Column
                      computer={6}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Grade*</label>
                      <OmsSelect
                        defaultValue={
                          this.props.gradeCategory
                            ? [this.props.gradeCategory[0].grade_category]
                            : { value: '1', label: 'hello' }
                        }
                        options={
                          this.props.gradeCategory
                            ? this.props.gradeCategory.map(gradeCategory => ({
                              value: gradeCategory.id,
                              label: gradeCategory.grade_category
                            }))
                            : null
                        }
                        change={this.handleChangeGradeCategory}
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
                      <RouterButton
                        value={{
                          label: 'Return',
                          color: 'blue',
                          href: '/gradeMapping'
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                {/* <Button  type='submit' value='submit'></Button> */}
              </Form>
            </Segment>
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  gradeCategory: state.gradeCategory.items
})
const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  loadGradeCategory: dispatch(apiActions.listGradeCategories())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editGradeMapping)
