import React, { Component } from 'react'
import { Grid, Radio, Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'

class editStudent extends Component {
  constructor (props) {
    super()
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
  }

  componentDidMount () {
    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role

    let _this = this
    if (this.props.match.params.id) {
      axios
        .get(urls.Student + this.props.match.params.id + '/', {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res.data[0], 'Some student dqata')
          res = res.data[0]
          _this.setState({
            name: res.student.name,
            erp: res.student.erp,
            roll_no: res.student.roll_no,
            admission_year: res.student.admission_year,
            admission_number: res.student.admission_number,
            gr_number: res.student.gr_number,
            admission_date: res.student.admission_date,
            gender: res.student.gender,
            stay_category: res.student.stay_category,
            date_of_birth: res.student.date_of_birth,
            aadhar_number: res.student.aadhar_number,
            address: res.student.address,
            using_transport: res.student.using_transport,
            session: res.student.session,
            grade: res.student.acad_branch_mapping,
            branch: res.student.branch,
            section: res.student.acad_section_mapping,
            first_lang: res.student.first_lang ? res.student.first_lang : '',
            second_lang: res.student.second_lang ? res.student.second_lang : '',
            third_lang: res.student.third_lang ? res.student.third_lang : '',
            fourth_lang: res.student.fourth_lang ? res.student.fourth_lang : '',
            father_name: res.parent && res.parent.father_name,
            father_mobile: res.parent && res.parent.father_mobile,
            father_email: res.parent && res.parent.father_email,
            mother_name: res.parent && res.parent.mother_name,
            mother_mobile: res.parent && res.parent.mother_mobile,
            mother_email: res.parent && res.parent.mother_email,
            genderSelected: [
              { value: res.student.gender, label: res.student.gender }
            ],
            stayCategory: [
              {
                value: res.student.stay_category,
                label: res.student.stay_category
              }
            ]
          })
          this.props.branches &&
            Number.isInteger(res.student.branch) &&
            this.setState((state, props) => ({
              branchSelected: props.branches
                .filter(branch => branch.id === res.student.branch)
                .map(branch => ({
                  value: branch.id,
                  label: branch.branch_name
                }))
            }))
          this.props.subject &&
            Number.isInteger(res.student.first_lang) &&
            this.setState((state, props) => ({
              firstLangSelected: props.subject
                .filter(subject => subject.id === res.student.first_lang)
                .map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))
            }))
          this.props.subject &&
            Number.isInteger(res.student.second_lang) &&
            this.setState((state, props) => ({
              secLangSelected: props.subject
                .filter(subject => subject.id === res.student.second_lang)
                .map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))
            }))
          this.props.subject &&
            Number.isInteger(res.student.third_lang) &&
            this.setState((state, props) => ({
              thirdLangSelected: props.subject
                .filter(subject => subject.id === res.student.third_lang)
                .map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))
            }))
          this.props.subject &&
            Number.isInteger(res.student.fourth_lang) &&
            this.setState((state, props) => ({
              fourthLangSelected: props.subject
                .filter(subject => subject.id === res.student.fourth_lang)
                .map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))
            }))
          this.handleClickBranch({ value: res.student.branch })
          this.handleClickGrade({ value: res.student.acad_branch_mapping })
        })
        .catch(function (error) {
          console.log("Error: Couldn't fetch data from " + urls.Student, error)
        })
    }
  }

  handleClickBranch = event => {
    this.setState({ branch: event.value })
    if (event.label) {
      this.setState({ branchSelected: event })
    }
    axios
      .get(urls.GradeMapping + '?branch=' + event.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({
          gradeData: res.data
        })
        Number.isInteger(this.state.grade) &&
          this.setState(state => ({
            gradeSelected: res.data
              .filter(grade => grade.id === state.grade)
              .map(grade => ({ value: grade.id, label: grade.grade.grade }))
          }))
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  };

  handleClickGrade (event) {
    this.setState({ grade: event.value, gradeSelected: event })
    axios
      .get(
        urls.SectionMapping + '?acad_branch_grade_mapping_id=' + event.value,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        this.setState({
          sectionData: res.data
        })
        Number.isInteger(this.state.section) &&
          this.setState(state => ({
            sectionSelected: res.data
              .filter(section => section.id === state.section)
              .map(section => ({
                value: section.id,
                label: section.section.section_name
              }))
          }))
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.SectionMapping, error)
      })
  }

  handleFormChange = e => {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  transport = () => {
    this.setState(state => ({
      using_transport: !state.using_transport
    }))
  };

  handleSubmit = () => {
    axios
      .put(urls.Student + this.props.match.params.id + '/', this.state, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (
          res.data === 'Edit student parent successfully' ||
          res.status === '201'
        ) {
          this.props.alert.success('Edited data sucessfully')
        } else {
          this.props.alert.error(
            'Error: Something went wrong, please try again.'
          )
        }
      })
      .catch(function (error) {
        console.log("Error: Couldn't put data to " + urls.Student, error)
      })
  };

  handleUsersRole = () => {
    if (this.role === 'Principal') { return true } return false
  }

  render () {
    let {
      gradeData,
      sectionData,
      branchSelected,
      gradeSelected,
      sectionSelected
    } = this.state
    return (
      <React.Fragment>
        <Form onChange={this.handleFormChange}>
          <Grid container>
            <Grid.Row>
              <Grid.Column
                computer={8}
                mobile={16}
                tablet={10}
                className='student-addStudent-StudentSection'
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={6} mobile={15} tablet={10}>
                      Student Information
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid className='student-addStudent-segment1'>
                  <Grid.Row>
                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={16}
                      className='student-section-inputField'
                    >
                      <label>Branch*</label>
                      {this.props.branches && (
                        <Select
                          options={this.props.branches.map(branch => ({
                            value: branch.id,
                            label: branch.branch_name
                          }))}
                          value={branchSelected}
                          isDisabled={this.handleUsersRole()}
                          onChange={this.handleClickBranch}
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={16}
                      className='student-section-inputField'
                    >
                      <label>Grade*</label>
                      {gradeData && (
                        <Select
                          options={gradeData.map(grade => ({
                            value: grade.id,
                            label: grade.grade.grade
                          }))}
                          value={gradeSelected}
                          onChange={this.handleClickGrade}
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={16}
                      className='student-section-inputField'
                    >
                      <label>Section*</label>
                      {sectionData && (
                        <Select
                          options={sectionData.map(section => ({
                            value: section.id,
                            label: section.section.section_name
                          }))}
                          value={sectionSelected}
                          onChange={state =>
                            this.setState({
                              section: state.value,
                              sectionSelected: state
                            })
                          }
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Student Name*</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Student Name'
                        name='name'
                        value={this.state.name}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Roll Number</label>
                      <input
                        type='number'
                        className='form-control'
                        placeholder='Roll Number'
                        name='roll_no'
                        value={this.state.roll_no}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Aadhaar Number</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Adhar Number'
                        name='aadhar_number'
                        value={this.state.aadhar_number}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Address</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Address'
                        name='address'
                        value={this.state.address}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Date Of Admission</label>
                      <input
                        type='date'
                        className='form-control'
                        name='admission_date'
                        value={this.state.admission_date}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Date Of Birth</label>
                      <input
                        type='date'
                        className='form-control'
                        name='date_of_birth'
                        value={this.state.date_of_birth}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Enrollment Code*</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enrollment Code'
                        name='erp'
                        value={this.state.erp}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Admission Number</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Admission Number'
                        name='admission_number'
                        value={this.state.admission_number}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Gr Number</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Gr Number'
                        name='gr_number'
                        value={this.state.gr_number}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Gender</label>
                      <Select
                        options={[
                          { value: 'female', label: 'female' },
                          { value: 'male', label: 'male' }
                        ]}
                        value={this.state.genderSelected}
                        onChange={state =>
                          this.setState({
                            gender: state.value,
                            genderSelected: state
                          })
                        }
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Category</label>
                      <Select
                        options={[
                          { value: 'Residential', label: 'Residential' },
                          { value: 'Day Scholar', label: 'Day Scholar' }
                        ]}
                        value={this.state.stayCategory}
                        onChange={state =>
                          this.setState({
                            stay_category: state.value,
                            stayCategory: state
                          })
                        }
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Using Transport</label>
                      <Form.Field>
                        <Radio
                          onChange={this.transport}
                          checked={this.state.using_transport}
                          toggle
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>

              <Grid.Column
                computer={8}
                mobile={16}
                tablet={10}
                className='student-addStudent-parentSection'
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={6} mobile={15} tablet={10}>
                      Parent Information
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Grid className='student-addStudent-segment1'>
                  <Grid.Row>
                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Father Name</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Father Name'
                        name='father_name'
                        value={this.state.father_name}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Father Mobile</label>
                      <input
                        type='tel'
                        className='form-control'
                        maxLength='10'
                        placeholder='Father Mobile'
                        name='father_mobile'
                        value={this.state.father_mobile}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Father Email*</label>
                      <input
                        type='email'
                        className='form-control'
                        maxLength='10'
                        placeholder='Father Email'
                        name='father_email'
                        value={this.state.father_email}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Mother Name</label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Mother Name'
                        name='mother_name'
                        value={this.state.mother_name}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Mother Mobile</label>
                      <input
                        type='tel'
                        className='form-control'
                        maxLength='10'
                        placeholder='Mother Mobile'
                        name='mother_mobile'
                        value={this.state.mother_mobile}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField1'
                    >
                      <label>Mother Email</label>
                      <input
                        type='email'
                        className='form-control'
                        placeholder='Mother Email'
                        name='mother_email'
                        value={this.state.mother_email}
                      />
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Language1</label>
                      {this.props.subject && (
                        <Select
                          options={this.props.subject.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))}
                          value={this.state.firstLangSelected}
                          onChange={state =>
                            this.setState({
                              first_lang: state.value,
                              firstLangSelected: state
                            })
                          }
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Language2</label>
                      {this.props.subject && (
                        <Select
                          options={this.props.subject.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))}
                          value={this.state.secLangSelected}
                          onChange={state =>
                            this.setState({
                              second_lang: state.value,
                              secLangSelected: state
                            })
                          }
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Language3</label>
                      {this.props.subject && (
                        <Select
                          options={this.props.subject.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))}
                          value={this.state.thirdLangSelected}
                          onChange={state =>
                            this.setState({
                              third_lang: state.value,
                              thirdLangSelected: state
                            })
                          }
                        />
                      )}
                    </Grid.Column>

                    <Grid.Column
                      computer={16}
                      mobile={16}
                      tablet={10}
                      className='student-section-inputField'
                    >
                      <label>Language4</label>
                      {this.props.subject && (
                        <Select
                          options={this.props.subject.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))}
                          value={this.state.fourthLangSelected}
                          onChange={state =>
                            this.setState({
                              fourth_lang: state.value,
                              fourthLangSelected: state
                            })
                          }
                        />
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column
                computer={16}
                mobile={16}
                tablet={15}
                className='student-section-addstaff-button'
              >
                <Button
                  onClick={this.handleSubmit}
                  color='green'
                >
                  Save
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
const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  designations: state.designations.items,
  roles: state.roles.items,
  departments: state.department.items,
  subject: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadDesignation: dispatch(apiActions.listDesignations()),
  loadRoles: dispatch(apiActions.listRoles()),
  loadDepartment: dispatch(apiActions.listDepartments()),
  loadSubject: dispatch(apiActions.listSubjects())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(editStudent))
