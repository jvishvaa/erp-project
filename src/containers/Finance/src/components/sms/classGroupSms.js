import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import ReactTable from 'react-table'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import { withRouter } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles, Stepper, Step, StepLabel, Button } from '@material-ui/core/'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import TextArea from './textArea'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})
function getSteps () {
  return ['Enter required fields', 'Select students']
}

class ClassGroupSms extends Component {
  constructor () {
    super()
    this.state = { activeStep: 0,
      selectedStudents: new Set(),
      pages: -1 }
    this.aGradeId = []
    this.handleSectionChange = this.handleSectionChange.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    console.log(academicProfile)
    if (this.role === 'Principal' || this.role === 'FOE') {
      this.setState({
        branch: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id })
    }
  }
  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, gradevalue: [] })
    this.props.gradeMapBranch(e.value)
    console.log(this)
    this.getClassGroups(e.value)
  }

  handleChange = name => event => {
    console.log(event.target.checked)
    if (name === 'point_of_contact') {
      if (event.target.checked) {
        this.setState({ pointOfContact: true, fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: false, contactPoint: [1, 2, 3] })
      } else {
        this.setState({ pointOfContact: false })
      }
    } else {
      if (event.target.checked) {
        this.setState({ fatherCheckbox: true, motherCheckbox: false, guardianCheckbox: false, contactPoint: [1] })
      } else if (event.target.checked) {
        this.setState({ fatherCheckbox: false, motherCheckbox: true, guardianCheckbox: false, contactPoint: [2] })
      } else if (event.target.checked) {
        this.setState({ fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: true, contactPoint: [3] })
      } else if (event.target.checked) {
        this.setState({ fatherCheckbox: true, motherCheckbox: true, guardianCheckbox: false, contactPoint: [1, 2] })
      } else if (event.target.checked) {
        this.setState({ fatherCheckbox: true, motherCheckbox: false, guardianCheckbox: true, contactPoint: [1, 3] })
      } else if (event.target.checked) {
        this.setState({ fatherCheckbox: true, motherCheckbox: false, guardianCheckbox: true, contactPoint: [2, 3] })
      }

      // switch (name) {
      //   case 'father' : this.state.pointOfContact === false && this.setState({ fatherCheckbox: !this.state.fatherCheckbox, contactPoint: 1 }); break
      //   case 'mother' : this.state.pointOfContact === false && this.setState({ motherCheckbox: !this.state.motherCheckbox, contactPoint: 2 }); break
      //   case 'guardian' : this.state.pointOfContact === false && this.setState({ guardianCheckbox: !this.state.guardianCheckbox, contactPoint: 3 }); break
      // }
    }
    this.setState({ [name]: event.target.checked })
  }

  getClassGroups = branchId => {
    let path = urls.BranchClassGroup
    path = path + '?branch_id=' + branchId
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ ClassGroups: res.data })
        }
      })
      .catch(er => console.log(er))
  }

  changehandlergrade = event => {
    this.setState({ gradeId: event.value, valueGrade: event, valueSection: [] })
    this.props.sectionMap(event.value)
  }

  handleSectionChange (event) {
    let aSection = []
    event.map(section => {
      aSection.push(section.value)
    })
    this.setState({ aGradeMapId: aSection })
  }

  changehandlerrole = e => {
    this.setState({ rolename: e.label, valueRole: e })
  }

  changehandlersmstypes = e => {
    this.setState({ smsType: e.value, valueSmsTypes: e })
  }
  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }
  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }
  fetchData = (state, instance) => {
    this.setState({ loading: true })
    this.getStudents(state)
  }
  getStudents=(state) => {
    let { state: { branch, aGradeMapId, classGroup, pageSize = 5, pageNumber = 1 } } = this

    var path = urls.StudentFilter + '?'
    path += branch ? 'branch_id=' + branch + '&' : ''
    path += aGradeMapId ? 'acad_section_mapping=' + (JSON.stringify(aGradeMapId)).substr(1).slice(0, -1) + '&' : ''
    path += classGroup ? 'class_group=' + classGroup + '&' : ''
    path += pageSize ? 'page_size=' + state.pageSize + '&' : ''
    path += pageNumber ? 'page_number=' + (state.page + 1) : ''
    axios
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((response) => {
        let data = response.data
        this.setState({ studentData: data.student_data, pages: data.total_page_count, pageNumber: data.current_page, loading: false })
      }).catch(e => {
        console.log('errorHar', e)
      })
  }
  handleNext = () => {
    // var url = ''
    console.log(this)
    let { state: { message, branch, aGradeMapId, smsType, rolename, classGroup, activeStep, selectedStudents } } = this
    if (activeStep === 0) {
      if (!branch || !aGradeMapId || !message || !rolename || !smsType || !classGroup) {
        this.props.alert.error('Please enter required fields')
        return
      }
    } else if (activeStep === 1) {
      if (selectedStudents.size === 0) {
        this.props.alert.error('Minimum one student must be selected')
        return
      } else {
        // url = urls.ClassGroupSms + '?student_ids=' + JSON.stringify(selectedStudents)
        this.sendMessage()
      }
    }
    this.setState({
      activeStep: activeStep + 1
    })
    let steps = getSteps()
    if (activeStep === (steps.length - 1)) {
      //      this.handleCreateTest()
    }
  }

  sendMessage = () => {
    // let url = ''
    let { message, branch, aGradeMapId, smsType, rolename, classGroup, contactPoint, isAllSelected, selectedStudents } = this.state

    let obj = {
      message,
      branch_id: branch,
      sms_type: smsType,
      user_type: rolename,
      class_group_id: classGroup,
      point_of_contact: contactPoint,
      acad_sectionmapping: aGradeMapId
    }
    if (isAllSelected) {
      obj['acad_branch_grade_mapping'] = [...aGradeMapId]
    } else {
      obj['students'] = JSON.stringify([...selectedStudents])
    }

    axios
      .post(urls.ClassGroupSms, obj, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success(' ********SMS Send Successfully ********')
        } else {
          this.props.alert.error('Error occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }

  render () {
    const columns = [
      {
        id: 'checkbox',
        Header: () => {
          let { studentData = [], isAllSelected } = this.state
          return <React.Fragment>
            <h5>Select All
              <input
                type='checkbox'
                checked={isAllSelected}
                onChange={({ target: { checked } }) => {
                  this.setState(state => ({
                    selectedStudents: checked ? new Set([...studentData.map(st => st.id)]) : new Set(),
                    isAllSelected: checked
                  }))
                }
                }
              />
            </h5>
          </React.Fragment>
        },
        accessor: props => {
          let { selectedStudents = new Set(), isAllSelected } = this.state
          return (<input
            type='checkbox'
            checked={selectedStudents.has(props.id) || isAllSelected}
            onChange={({ target: { checked } }) => {
              let { selectedStudents = new Set() } = this.state
              if (checked) {
                selectedStudents.add(props.id)
              } else {
                selectedStudents.delete(props.id)
              }
              this.setState({ selectedStudents })
            }

            }
          />)
        }
      },
      {
        Header: 'Student Name',
        accessor: 'name'
      },
      {
        Header: 'Branch',
        accessor: 'branch.branch_name'
      },
      {
        Header: 'Grade',
        accessor: 'grade.grade'
      }
    ]
    const { activeStep } = this.state
    const { classes } = this.props
    const steps = getSteps()
    console.log(this.state.activeStep === 0)
    let { ClassGroups } = this.state
    console.log(this.state.selectedStudents)
    return (
      <div>
        {/* <Form onSubmit={this.handleSubmit} id='formReset'> */}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {}
            const labelProps = {}
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === 0
          ? <Grid container>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <label>Branch*</label>
                <OmsSelect
                  placeholder='Select Branch'
                  options={
                    this.props.branches
                      ? this.props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : []
                  }
                  disabled={this.role === 'Principal' || this.role === 'FOE'}
                  change={this.changehandlerbranch}
                  defaultValue={this.state.branchValue}
                />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>Grade*</label>
                <OmsSelect
                  placeholder='Select Grade'
                  // isMulti
                  options={this.props.grades
                    ? this.props.grades.map(grade => ({
                      value: grade.id,
                      label: grade.grade.grade
                    }))
                    : []}
                  defaultvalue={this.state.gradevalue}
                  change={this.changehandlergrade}

                />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>Section*</label>
                <OmsSelect
                  placeholder='Select Section'
                  isMulti
                  options={
                    this.props.sections
                      ? this.props.sections.map(section => ({
                        value: section.id,
                        label: section.section.section_name
                      }))
                      : []
                  }
                  value={this.state.sectionValue}
                  change={this.handleSectionChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>User Types*</label>
                <OmsSelect
                  placeholder='Select User Types'
                  options={[{ label: 'Student', value: 'Student' }, { label: 'Parent', value: 'Parent' }]}

                  // defaultvalue={this.state.gradevalue}
                  change={this.changehandlerrole}
                  defaultValue={this.state.valueRole}
                  error={this.state.roleError}

                />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>Class Groups*</label>
                <OmsSelect
                  placeholder='Class Group'
                  options={ClassGroups
                    ? ClassGroups.map(cg => ({
                      value: cg.id,
                      label: cg.class_group_name
                    }))
                    : []
                  }
                  change={e => this.setState({ classGroup: e.value })}
                />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>SMS Types*</label>
                <OmsSelect
                  placeholder='Select SMS Types'
                  options={this.props.smsTypes
                    ? this.props.smsTypes.map(smsType => ({
                      value: smsType,
                      label: smsType
                    }))
                    : []}
                  defaultvalue={this.state.valueSmsTypes}
                  change={this.changehandlersmstypes}

                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <TextArea onChange={val => this.setState({ message: val })} maxLength={320} />
                {/* <TextField
                  required
                  id='standard-full-width'
                  label='Message'
                  onChange={(e) => this.setState({ message: e.target.value })}
                  rows={8}
                  placeholder='Message'
                  fullWidth
                  multiline
                  margin='normal'
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                /> */}
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <form style={{ display: this.state.rolename === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
                  <FormControl component='fieldset' className={classes.formControl}>
                    {/* <th><FormLabel component='legend'>Select Gender</FormLabel></th> */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.pointOfContact}
                          onChange={this.handleChange('point_of_contact')}
                          value='checkedB'
                          color='primary'
                        />
                      }
                      label='Point of Contact'
                    />
                    <Grid.Row>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >
                        <FormControl component='fieldset' className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.fatherCheckbox}
                                onChange={this.handleChange('father')}
                                value='checkedB'
                                color='primary'
                              />
                            }
                            label='Father'
                          />
                        </FormControl>
                      </Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >
                        <FormControl component='fieldset' className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.motherCheckbox}
                                onChange={this.handleChange('mother')}
                                value='checkedB'
                                color='primary'
                              />
                            }
                            label='Mother'
                          />
                        </FormControl></Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >
                        <FormControl component='fieldset' className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.guardianCheckbox}
                                onChange={this.handleChange('guardian')}
                                value='checkedB'
                                color='primary'
                              />
                            }
                            label='Guardian'
                          />
                        </FormControl>
                      </Grid.Column>
                    </Grid.Row>
                  </FormControl>
                </form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
              >
                      Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleNext}
              >
                {activeStep === steps.length + 1 ? 'Finish' : 'Next'}
              </Button>
            </Grid.Row>
            : ''
          </Grid>
          : ''
        }
        {activeStep === 1
          ? <React.Fragment>
            <Grid.Column
              computer={4}
              mobile={16}
              tablet={5}
            >
              <InputBase className={classes.input} onChange={(e) => { this.setState({ queryString: e.target.value }) }} placeholder='Search Assessments' />
              <IconButton className={classes.iconButton} aria-label='Search'>
                <SearchIcon />
              </IconButton>
              {/* <div>
                <input type='checkbox' checked={this.state.allCheck} onChange={e => this.handleSelectAll(e)} />
                <label>select all</label>
              </div> */}
              <ReactTable
                id='table1'
                loading={this.state.loading}
                defaultPageSize={5}
                onFetchData={this.fetchData}
                data={this.state.studentData}
                // data={data}
                pages={this.state.pages}
                manual
                columns={columns} />
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                >
              Back
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </Grid.Column>
          </React.Fragment>
          : ''
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  grades: state.gradeMap.items,
  roles: state.roles.items,
  user: state.authentication.user,
  smsTypes: state.smsTypes.items,
  sections: state.sectionMap.items,
  students: state.student && state.student.success ? state.student.success : []

})
const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: dispatch(apiActions.listSmsTypes()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listStudents: (sectionId, pageId = 1) => dispatch(apiActions.listStudents(sectionId, pageId))
})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(ClassGroupSms)))
