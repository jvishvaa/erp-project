import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Grid, Dropdown } from 'semantic-ui-react'
import {
  withStyles,
  CardActions,
  Divider,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanel,
  Button,
  Typography
} from '@material-ui/core/'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Select from 'react-select'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { OmsSelect } from '../../../ui'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '33.33%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
})

const StyledExpansionPanel = withStyles({
  root: {
    borderRadius: '0px!important',
    border: '1px solid rgba(0,0,0,0.0)',
    padding: '0 30px',
    boxShadow: '0 0 0 0 rgba(255, 105, 135, .3)'
  }
})(ExpansionPanel)

class EditStaff extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      add1: false,
      staffName: '',
      staffAddress: '',
      staffMobile: '',
      staffEmail: '',
      staffERPCode: '',
      staffPassword: '',
      branchId: '',
      branchName: '',
      isFetching: true,
      mappedGrades: {},
      mappings: {},
      rows: 1,
      firstTime: true,
      filteredSelectedSubjects: [],
      fixedSubjects: [],
      mappedSections: {},
      mappedSubjects: {}
    }
    this.onSelectBranch = this.onSelectBranch.bind(this)
    this.generateMappings = this.generateMappings.bind(this)
    this.onSelectSection = this.onSelectSection.bind(this)
    this.onChangeMappingsPanel = this.onChangeMappingsPanel.bind(this)
    this.generateMappingPanel = this.generateMappingPanel.bind(this)
  }

  componentDidMount () {
    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    if (this.role === 'Subjecthead') {
      this.props.listSubjects()
    }
    console.log('im hereee fadfa')
    var UpdateStaff = urls.Staff + this.props.match.params.id + '/'
    axios
      .get(UpdateStaff, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res, 'edit staffff')
        var arr = res['data']['staff_details'][0]
        this.setState({
          staffName: arr.user && arr.user.first_name ? arr.user.first_name : '',
          staffAddress: arr.address ? arr.address : '',
          staffMobile: arr.contact_no ? arr.contact_no : '',
          staffEmail: arr.user && arr.user.email ? arr.user.email : '',
          staffERPCode: arr.erp_code ? arr.erp_code : '',
          isFetching: false,
          roleId: res['data'].role_id ? res['data'].role_id : null,
          branch: arr.branch_fk
            ? { value: arr.branch_fk.id, label: arr.branch_fk.branch_name }
            : '',
          department: arr.department_fk
            ? {
              value: arr.department_fk.id,
              label: arr.department_fk.department_name
            }
            : '',
          designation: arr.designation
            ? {
              value: arr.designation.id,
              label: arr.designation.designation_name
            }
            : '',
          role: res.data.role_id
            ? {
              value: res.data.role_id,
              text:
                  this.props.roles &&
                  this.props.roles
                    .filter(role => res.data.role_id === role.id)
                    .map(role => role.role_name)[0]
            }
            : { value: '', label: '' }
        })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Staff + error)
      })
  }

  onSelectBranch (branchId, value) {
    let mappingData = {
      [value]: { branch_id: branchId },
      ...this.state.mappings
    }
    axios
      .get(urls.GradeMapping + '?branch=' + branchId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.data)
        this.setState({ mappedGrades: this.state.role.text === 'Teacher' ? { data: res.data } : { ...this.state.mappedGrades, [value]: res.data }, mappings: mappingData })
      })
  }
  onChangeSubjectHeadMapping = (selectedSubjects, action) => {
    let filteredSelectedSubjects = this.state.filteredSelectedSubjects
    if (action.action === 'select-option') {
      filteredSelectedSubjects.push(action.option.value)
    } else {
      if (action.removedValue && filteredSelectedSubjects.indexOf(action.removedValue.value) !== -1) {
        filteredSelectedSubjects.splice(filteredSelectedSubjects.indexOf(action.removedValue.value), 1)
      }
    }
    this.state.fixedSubjects.forEach(fixedSubject => {
      let exists = false
      console.log('Checking...')
      selectedSubjects.forEach(subject => {
        if (fixedSubject.value === subject.value) {
          exists = true
        }
      })

      if (!exists) {
        selectedSubjects.push(fixedSubject)
      } else {
        console.log('Subject exists', fixedSubject)
      }
    })
    this.setState({ selectedSubjects, filteredSelectedSubjects })
  }
  onSelectGrade = (value, i) => {
    let mapping
    let mappingData = {
      ...this.state.mappings,
      [i]: {
        branch_id: this.state.mappings[i] && this.state.mappings[i].branch_id,
        grade_id: value
      }
    }
    this.setState({ mappings: mappingData })
    if (this.state.role.text !== 'Teacher') {
      mapping = this.state.mappedGrades[i]
        .filter(grade => grade.grade.id === value)
        .map(grade => grade.id)[0]
    } else {
      mapping = this.state.mappedGrades.data
        .filter(grade => grade.grade.id === value)
        .map(grade => grade.id)[0]
    }

    axios
      .get(urls.SectionMapping + '?acad_branch_grade_mapping_id=' + mapping, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        let mappedSections = res.data.map(section => ({
          value: section.section.id,
          text: section.section.section_name
        }))
        this.setState({ mappedSections: { ...this.state.mappedSections, [i]: mappedSections } })
      })
    axios
      .get(urls.SubjectMapping + '?acad_branch_grade_mapping_id=' + mapping, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        let mappedSubjects = res.data.map(subject => ({
          value: subject.subject.id,
          text: subject.subject.subject_name
        }))
        this.setState({ mappedSubjects: { ...this.state.mappedSubjects, [i]: mappedSubjects } })
      })
  }

  onSelectSection (value, i) {
    let mappingData = {
      ...this.state.mappings,
      [i]: {
        branch_id: this.state.mappings[i].branch_id,
        grade_id: this.state.mappings[i].grade_id,
        section_id: value
      }
    }
    this.setState({ mappings: mappingData })
  }

  onSelectSubject (value, i) {
    let mappingData
    if (this.state.role.text === 'Teacher') {
      mappingData = {
        ...this.state.mappings,
        [i]: {
          branch_id: this.state.mappings[i].branch_id,
          grade_id: this.state.mappings[i].grade_id,
          section_id: this.state.mappings[i].section_id,
          subjects: value
        }
      }
    } else if (this.state.role.text === 'Planner') {
      mappingData = {
        ...this.state.mappings,
        [i]: {
          branch_id: this.state.mappings[i].branch_id,
          grade_id: this.state.mappings[i].grade_id[0]
            ? this.state.mappings[i].grade_id[0].id
            : this.state.mappings[i].grade_id,
          subjects: value
        }
      }
    } else if (this.state.role.text === 'Subjecthead') {
      let subjectId = value
      this.setState({ subjectId })
    }
    this.setState({ mappings: mappingData, subject_id: this.state.subjectId })
  }

  onChangeMappingsPanel (expanded) {
    let props = this.props
    let _this = this
    if (expanded) {
      _this.setState({ importedMappings: {} })
      if (this.state.role.text === 'Teacher') {
        axios
          .get(`${urls.Staff}?user_id=${this.props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            _this.setState({ importedMappings: res.data.academic_profile })
          })
      } else if (this.state.role.text === 'Planner' || this.state.role.text === 'Subjecthead') {
        axios
          .get(`${urls.Staff}${this.props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            let importedMappings = res.data.staff_details[0].acad_branch_mapping.map(
              mapping => {
                let subjectId = res.data.staff_details[0].subject_mapping.filter(
                  smapping =>
                    smapping.branch_grade_acad_session_mapping === mapping.id
                )[0] && res.data.staff_details[0].subject_mapping.filter(
                  smapping =>
                    smapping.branch_grade_acad_session_mapping === mapping.id
                )[0].subject
                return {
                  branch_id: mapping.branch,
                  branch_name: props.branches.filter(
                    branch => branch.id === mapping.branch
                  )[0] && props.branches.filter(
                    branch => branch.id === mapping.branch
                  )[0].branch_name,
                  grade_id: mapping.grade,
                  grade_name: props.grades.filter(
                    grade => grade.id === mapping.grade
                  )[0] && props.grades.filter(
                    grade => grade.id === mapping.grade
                  )[0].grade,
                  subject_id: subjectId,
                  subject_name: props.subjects.filter(subject => subject.id === subjectId)
                    .length > 0
                    ? props.subjects.filter(
                      subject => subject.id === subjectId
                    )[0].subject_name
                    : subjectId
                }
              }
            )
            if (importedMappings === null) {
              importedMappings = [this.props.subjects]
            }
            _this.setState({ importedMappings }, () => {
              if (!_this.state.importedMappings || !_this.props.subjects || !Array.isArray(_this.state.importedMappings)) { _this.setState({ temporaryMappings: [] }) }
              let fs
              if (this.state.importedMappings.length > 0) {
                fs = _this.props.subjects.filter(sub => {
                  let x = _this.state.importedMappings.filter(element => element.subject_id !== sub.id).length
                  return !!x
                }
                )
                fs = fs.map(item => ({ text: item.subject_name, value: item.id }))
                _this.setState({ temporaryMappings: fs })
              } else {
                fs = this.props.subjects.map(item => ({ text: item.subject_name, value: item.id }))
                _this.setState({ temporaryMappings: fs })
              }
            })
          })
      }
    }
  }

  generateMappings (role) {
    let { rows, importedMappings } = this.state
    let mapping = []
    let row = []
    if (importedMappings) {
      if (Object.keys(importedMappings).length !== 0) {
        if (role === 'Subjecthead') {
          importedMappings = _.uniqBy(importedMappings, function (e) {
            return e.subject_id
          })
          let selectedSubjects = importedMappings.map(mapping => mapping.subject_name)
          let unSelectedSubjects = this.props.subjects.filter(subject => {
            return !selectedSubjects.includes(subject.subject_name)
          }).map(subject => ({
            value: subject.id,
            label: subject.subject_name
          }))
          selectedSubjects = this.props.subjects.filter(subject => {
            return selectedSubjects.includes(subject.subject_name)
          }).map(subject => ({
            value: subject.id,
            label: subject.subject_name
          }))
          if (!this.state.selectedSubjects) {
            this.setState({ selectedSubjects, fixedSubjects: selectedSubjects })
          }
          mapping = [<Grid.Row>
            <OmsSelect
              defaultValue={this.state.selectedSubjects}
              options={this.props.subjects.map(subject => ({
                value: subject.id,
                label: subject.subject_name
              }))}
              isMulti
              isClearable={unSelectedSubjects}
              change={this.onChangeSubjectHeadMapping}
            />
          </Grid.Row>]
        } else {
          mapping = importedMappings.map(mapping => {
            return (
              <Grid.Row>
                {this.props.branches && role !== 'Subjecthead' && (
                  <Grid.Column computer={3} mobile={16} tablet={10}>
                    <input type='text' value={mapping.branch_name} disabled />
                  </Grid.Column>
                )}
                {
                  role !== 'Subjecthead' ? <Grid.Column computer={3}>
                    <input type='text' value={mapping.grade_name} disabled />
                  </Grid.Column> : null
                }
                {mapping.section_name && (
                  <Grid.Column computer={3} mobile={16} tablet={10}>
                    <input type='text' value={mapping.section_name} />
                  </Grid.Column>
                )}
                <Grid.Column computer={3}>
                  <input type='text' value={mapping.subject_name} />
                </Grid.Column>
              </Grid.Row>
            )
          })
        }
      } else if (role === 'Subjecthead') {
        mapping = [<Grid.Row>
          <OmsSelect
            defaultValue={this.state.selectedSubjects}
            options={this.props.subjects.map(subject => ({
              value: subject.id,
              label: subject.subject_name
            }))}
            isMulti
            change={this.onChangeSubjectHeadMapping}
          />
        </Grid.Row>]
      }
    }
    for (let i = 1; i <= rows; i++) {
      if (role === 'Teacher') {
        if (this.state.branch && i === rows && this.state.firstTime) {
          let { value } = this.state.branch
          this.onSelectBranch(value, i)
          this.setState({ firstTime: false })
        }
        console.log(this.state.mappedGrades)
        row = (
          <Grid.Row>
            {this.props.branches && (
              <Grid.Column computer={4} mobile={16} tablet={10}>
                <Select
                  placeholder='Select Branch'
                  // onChange={
                  //   this.onSelectBranch()
                  // }
                  value={this.state.branch}
                  options={this.props.branches.map(branch => ({
                    value: branch.id,
                    text: branch.branch_name
                  }))}
                  isDisabled
                />
              </Grid.Column>
            )}
            <Grid.Column computer={4} mobile={16} tablet={10}>
              <Dropdown
                placeholder='Select Grades'
                fluid
                search
                selection
                onChange={(e, { value }) => this.onSelectGrade(value, i)}
                value={this.state.mappings[i] && this.state.mappings[i].grade_id}
                options={this.state.mappedGrades && Array.isArray(this.state.mappedGrades[this.state.role.text === 'Teacher' ? 'data' : i]) && this.state.mappedGrades[this.state.role.text === 'Teacher' ? 'data' : i].map(item => ({
                  value: item.grade.id,
                  text: item.grade.grade
                }))
                }
              />
            </Grid.Column>

            <Grid.Column computer={4} mobile={16} tablet={10}>
              <Dropdown
                placeholder='Select Sections'
                fluid
                search
                selection
                onChange={(e, { value }) => this.onSelectSection(value, i)}
                options={this.state.mappedSections[i] && this.state.mappedSections[i]}
                value={this.state.mappings[i] && this.state.mappings[i].section_id}
                // disabled={!this.grade_id}
              />
            </Grid.Column>
            <Grid.Column computer={4} mobile={16} tablet={10}>
              <Dropdown
                onChange={(e, { value }) => this.onSelectSubject(value, i)}
                placeholder='Select Subject'
                fluid
                search
                multiple
                selection
                options={this.state.mappedSubjects[i] && this.state.mappedSubjects[i]}
                value={this.state.mappings[i] && this.state.mappings[i].subjects}
              />
            </Grid.Column>
            <Grid.Column computer={4} mobile={16} tablet={10}>
              {i === rows && (
                <Button
                  type='button'
                  onClick={() => this.setState({ firstTime: true,
                    rows: this.state.rows + 1 })}
                  color='blue'
                >
                  Add
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        )
        mapping.push(row)
      } else if (role === 'Planner') {
        row = (
          <Grid.Row>
            {this.props.branches && (
              <Grid.Column computer={4} mobile={16} tablet={10}>
                <Dropdown
                  placeholder='Select Branch'
                  onChange={(e, { value }) => this.onSelectBranch(value, i)}
                  fluid
                  search
                  selection
                  options={this.props.branches.map(branch => ({
                    value: branch.id,
                    text: branch.branch_name
                  }))}
                />
              </Grid.Column>
            )}
            <Grid.Column computer={4} mobile={16} tablet={10}>
              <Dropdown
                placeholder='Select Grades'
                fluid
                search
                selection
                onChange={(e, { value }) => this.onSelectGrade(value, i)}
                options={this.state.mappedGrades && Array.isArray(this.state.mappedGrades[this.state.role.text === 'Teacher' ? 'data' : i]) && this.state.mappedGrades[this.state.role.text === 'Teacher' ? 'data' : i].map(item => ({
                  value: item.grade.id,
                  text: item.grade.grade
                }))
                }
              />
            </Grid.Column>
            <Grid.Column computer={4} mobile={16} tablet={10}>
              <Dropdown
                onChange={(e, { value }) => this.onSelectSubject(value, i)}
                placeholder='Select Subject'
                fluid
                search
                multiple
                selection
                options={this.state.mappedSubjects && this.state.mappedSubjects[i]}
              />
            </Grid.Column>
            <Grid.Column computer={4} mobile={16} tablet={10}>
              {i === rows && (
                <Button
                  type='button'
                  onClick={() => this.setState({ firstTime: true, rows: this.state.rows + 1 })}
                  color='blue'
                >
                  Add
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        )
        mapping.push(row)
      }
    }
    return mapping
  }

  handlevalue = e => {
    e.preventDefault()
    console.log('Clicked save button')
    var arr = {
      name: e.target.staffname.value,
      contact_no: e.target.mobile.value,
      role_id: this.state.role.value,
      address: e.target.address.value,
      erp_code: e.target.erpcode.value,
      // need to change following data as per api changes
      user: {
        password: e.target.password.value,
        first_name: e.target.staffname.value,
        email: e.target.email.value
      },
      department_fk: {
        id: this.state.department ? this.state.department.value : ''
      },
      branch_fk: { id: this.state.branch ? this.state.branch.value : '' },
      designation: {
        id: this.state.designation ? this.state.designation.value : ''
      }
    }
    console.log(this.state.role.text)
    if (this.state.role.text !== 'Subjecthead') {
      arr['branch_grade_mapping'] = Object.keys(this.state.mappings)
        .filter(item => {
          try {
            if (this.state.mappings[item].subjects) return true
          } catch (err) {
            return false
          }
          return false
        })
        .map(item => this.state.mappings[item])
    } else {
      arr['subject_id'] = this.state.filteredSelectedSubjects
      console.log(arr['subject_id'])
    }
    var ResponseList = urls.Staff + this.props.match.params.id + '/'
    axios
      .put(ResponseList, arr, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.setState({ isFetching: false })
        this.props.alert.success('Updated Successfully')
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.Staff, error)
        this.props.alert.error(
          'Error: Something went wrong, please try again.'
        )
      })
  };

  generateMappingPanel () {
    let { classes } = this.props
    let rolesWithMapping = ['Teacher', 'Planner', 'Subjecthead']
    if (rolesWithMapping.includes(this.state.role.text)) {
      return (
        <StyledExpansionPanel
          onChange={(e, expanded) => this.onChangeMappingsPanel(expanded)}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.column}>
              <Typography className={classes.heading}>Mappings</Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <React.Fragment>
              <Grid>{this.generateMappings(this.state.role.text)}</Grid>
            </React.Fragment>
          </ExpansionPanelDetails>
        </StyledExpansionPanel>
      )
    } else {
      return null
    }
  }

  switchUser = (userId) => {
    this.props.alert.success('success')
    axios.post(urls.LOGIN, {
      user_id: userId
    }, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      localStorage.setItem('user_profile', JSON.stringify(res.data))
      localStorage.setItem('id_token', res.data.personal_info.token)
      window.location.assign('/')
    })
  }

  handleUsersRole = () => {
    if (this.role === 'Principal' || this.role === 'EA Academics' || this.role === 'AcademicCoordinator') { return true } return false
  }

  render () {
    let { isFetching } = this.state
    let { classes } = this.props
    this.props.departments &&
      !this.state.department &&
      this.setState({
        department: {
          value: this.props.departments[0].id,
          label: this.props.departments[0].department_name
        }
      })
    return isFetching ? (
      <div>Loading...</div>
    ) : (
      <React.Fragment>
        <Form onSubmit={this.handlevalue}>
          <StyledExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.column}>
                <Typography className={classes.heading}>
                      Staff Details
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Grid style={{ backgroundColor: 'transparent' }} />
              <Grid style={{ backgroundColor: 'transparent' }}>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField'
                  >

                    <label>Branch*</label>
                    {this.props.branches && (
                      <Select
                        options={this.props.branches.map(branch => ({
                          value: branch.id,
                          label: branch.branch_name
                        }))}
                        value={this.state.branch}
                        isDisabled={this.handleUsersRole()}
                        onChange={branch => this.setState({ branch })}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField'
                  >
                    <label>Designation*</label>
                    {this.props.designations && (
                      <Select
                        options={this.props.designations.map(
                          designation => ({
                            value: designation.id,
                            label: designation.designation_name
                          })
                        )}
                        value={this.state.designation}
                        onChange={designation =>
                          this.setState({ designation })
                        }
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column
                    computer={4}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField'
                    style={{ marginTop: '18px' }}
                  >
                    <Button
                      variant='contained'
                      className={classes.button}
                      color='primary'
                      onClick={() => this.switchUser(this.props.match.params.id)}
                      type='button'
                    >
                            Switch To This User
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField'
                  >
                    <label>Role*</label>
                    {this.props.roles && (
                      <Dropdown
                        fluid
                        search
                        selection
                        options={this.props.roles.map(role => ({
                          value: role.id,
                          text: role.role_name
                        }))}
                        text={this.state.role.text}
                        onChange={role => this.setState({ role })}
                        disabled
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField'
                  >
                    <label>Department*</label>
                    {this.props.departments && (
                      <Select
                        options={this.props.departments.map(department => ({
                          value: department.id,
                          label: department.department_name
                        }))}
                        value={this.state.department}
                        onChange={department =>
                          this.setState({ department })
                        }
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>Staff Name*</label>
                    <input
                      name='staffname'
                      type='text'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffName: e.target.value })
                      }
                      placeholder='Staff Name'
                      value={this.state.staffName}
                    />
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>Address*</label>
                    <input
                      name='address'
                      type='text'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffAddress: e.target.value })
                      }
                      placeholder='Address'
                      value={this.state.staffAddress}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>Mobile*</label>
                    <input
                      name='mobile'
                      type='tel'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffMobile: e.target.value })
                      }
                      maxLength='10'
                      placeholder='Mobile'
                      value={this.state.staffMobile}
                    />
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>Email*</label>
                    <input
                      name='email'
                      type='email'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffEmail: e.target.value })
                      }
                      placeholder='Email'
                      autoComplete='off'
                      value={this.state.staffEmail}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>ERP Code*</label>
                    <input
                      name='erpcode'
                      type='text'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffERPCode: e.target.value })
                      }
                      placeholder='ERP Code'
                      value={this.state.staffERPCode}
                    />
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={10}
                    className='student-section-inputField1'
                  >
                    <label>Password*</label>
                    <input
                      name='password'
                      type='password'
                      autoComplete='new-password'
                      className='form-control'
                      onChange={e =>
                        this.setState({ staffPassword: e.target.value })
                      }
                      placeholder='Password'
                      value={this.state.staffPassword}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </ExpansionPanelDetails>
          </StyledExpansionPanel>
          {this.generateMappingPanel()}
          <Divider />
          <CardActions>
            <Button
              disabled={
                !this.state.branch ||
                    !this.state.department ||
                    !this.state.designation ||
                    !this.state.role ||
                    !this.state.staffName ||
                    !this.state.staffAddress ||
                    !this.state.staffMobile ||
                    !this.state.staffEmail ||
                    !this.state.staffERPCode
              }
              variant='contained'
              className={classes.button}
              type='submit'
              onClick={this.click}
              color='green'
            >
                  Save
            </Button>
            <Button
              variant='contained'
              className={classes.button}
              color='secondary'
              onClick={this.props.history.goBack}
              type='button'
            >
                  Return
            </Button>
          </CardActions>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  designations: state.designations.items,
  roles: state.roles.items,
  departments: state.department.items,
  user: state.authentication.user,
  grades: state.grades.items,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadDesignation: dispatch(apiActions.listDesignations()),
  loadRoles: dispatch(apiActions.listRoles()),
  loadDepartment: dispatch(apiActions.listDepartments()),
  listGrades: dispatch(apiActions.listGrades()),
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(EditStaff)))
