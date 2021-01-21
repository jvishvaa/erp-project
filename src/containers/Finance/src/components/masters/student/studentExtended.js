import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import StudentInputForm from './studentData'
import ParentInputForm from './parentData'
import { apiActions } from '../../../_actions'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

function getSteps () {
  return ['Student details', 'Parent details', 'Success']
}

function getStepContent (step, state, _this) {
  let { branchId, gradeId, sectionId, mode } = state
  switch (step) {
    case 0:
      return <StudentInputForm mode={mode} branchId={branchId} gradeId={gradeId} sectionId={sectionId} handleNext={_this.handleNext} alert={_this.props.alert} />
    case 1:
      return <ParentInputForm mode={mode} branchId={branchId} gradeId={gradeId} sectionId={sectionId} handleNext={_this.handleNext} handleReset={_this.handleReset} alert={_this.props.alert} />
    case 2:
      window.localStorage.removeItem('studentId')
      return <div><div style={{ display: 'flex', height: '25vw' }}><p style={{ margin: 'auto' }}>Student Data {mode === 'ADD' ? 'Added' : 'Edited'} Success fully</p></div></div>
    default:
      return 'Unknown step'
  }
}

class StudentExtended extends React.Component {
  constructor () {
    super()
    this.state = {
      activeStep: 0,
      skipped: new Set(),
      branchItems: []
    }
  }

  componentDidMount () {
    let { match: { path, params: { id } } } = this.props
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile
    if (this.role === 'FOE' || this.role === 'Principal') {
      let branchData = { value: this.academicProfile.branch_id, label: this.academicProfile.branch }
      this.setState({
        branchIdentity: branchData,
        branchId: this.academicProfile.branch_id
      })
      this.handleClickBranch(branchData)
    } else if (this.role === 'BDM') {
      let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
      let branchDataAssigned = []
      let map = new Map()
      for (const item of branchsAssigned) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true)
          branchDataAssigned.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }
      this.setState({ branchDataAssigned })
    }
    if ((path === '/student/edit/:id' || path === '/studentIdCard/:id') && id) {
      this.setState({ mode: 'EDIT', studentId: id })
      this.getStudentDetails(id)
    } else {
      this.setState({ mode: 'ADD' })
    }
  }

  getStudentDetails=(id) => {
    let path = urls.Student + id + '/'
    axios
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let branchId = res.data[0]['student']['branch']
          let gradeId = res.data[0]['student']['acad_branch_mapping']
          let sectionId = res.data[0]['student']['acad_section_mapping']
          let actualGradeId = res.data[0]['student']['grade']
          let actualSectionId = res.data[0]['student']['section']['id']
          let userId = res.data[0]['student']['user']
          this.handleClickBranch({ value: branchId })
          this.handleClickGrade({ value: gradeId })
          this.props.gradeMapBranch(branchId)
          this.props.sectionMap(gradeId)
          this.setState({ branchId, gradeId, sectionId, actualGradeId, actualSectionId, userId })
        }
      })
  }

  handleClickBranch = (event) => {
    this.setState({ branchId: event.value, gradeValue: null, valueSection: null, gradeId: null })
    this.props.gradeMapBranch(event.value)
  }

  handleClickGrade = (event) => {
    this.setState({ gradeId: event.value, valueGrade: event, valueSection: null, sectionId: null })
    this.props.sectionMap(event.value)
  }

  isStepOptional = step => step === 1;

  handleNext = () => {
    const { activeStep } = this.state
    let { skipped } = this.state
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  };
  handleReset=() => {
    this.setState({ activeStep: 0 })
  }

  handleSkip = () => {
    const { activeStep } = this.state
    if (!this.isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep: state.activeStep + 1,
        skipped
      }
    })
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };

  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }
  switchUser = (userId) => {
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

  render () {
    console.log(this.role)

    const { classes, branches, grades, section } = this.props
    const steps = getSteps()
    const { activeStep, branchId, branchItems = [], gradeItems = [], sectionItems = [],
      gradeId, actualSectionId, mode, sectionId, branchIdentity, actualGradeId } = this.state
    let selectedBranch = branchId && branches && branches.filter(branch => (branchId === branch.id)).map(branch => ({ label: branch.branch_name, value: branch.id }))
    console.log(selectedBranch, 'selectedBranch', branchId)

    let selectedGrade = gradeId && grades && grades.filter(grade => {
      if (grade.grade && (grade.grade.grade && grade.grade.id)) {
        if (actualGradeId === grade.grade.id) {
          console.log(grade, gradeId, 'All Datas for grade')
          return true
        } else {
          return false
        }
      } else {
        console.log(grade, 'grade with Issue')
        return false
      }
    }).map(grades => {
      return ({ label: grades.grade.grade, value: grades.grade.id })
    })
    console.log(selectedGrade, 'selectedGrade', gradeId, grades)

    let selectedSection = actualSectionId && section && section.filter(section => {
      if (section.section && (section.section.section_name && section.section.id)) {
        if (actualSectionId === section.section.id) {
          console.log(section, actualSectionId, 'All Datas for section')
          return true
        } else {
          return false
        }
      } else {
        console.log(section, 'Section with Issue')
        return false
      }
    }).map(section => {
      console.log(section, 'Selected section')
      return ({ label: section.section.section_name, value: section.section.id })
    })
    console.log(actualSectionId, selectedSection, sectionItems, sectionId, section, 'section data')

    if ((branchId && branches && branchItems.length === 0) || (Array.isArray(this.state.branchItems) && Array.isArray(selectedBranch) && this.state.branchItems.length > 0 && this.state.branchItems[0].value !== selectedBranch[0].value)) {
      this.setState({ branchItems: selectedBranch })
    }

    if ((gradeId && grades && gradeItems.length === 0) || (Array.isArray(this.state.gradeItems) && Array.isArray(selectedGrade) && this.state.gradeItems.length > 0 && this.state.gradeItems[0].value !== selectedGrade[0].value)) {
      this.setState({ gradeItems: selectedGrade })
    }
    if ((actualSectionId && section && sectionItems.length === 0 && selectedSection.length) || (Array.isArray(this.state.sectionItems) && Array.isArray(selectedSection) && this.state.sectionItems.length > 0 && selectedSection.length > 0 && this.state.sectionItems[0].id !== selectedSection[0].id)) {
      this.setState({ sectionItems: selectedSection })
    }
    return (
      <React.Fragment>
        <div style={{ paddingLeft: 30, display: 'flex', flexWrap: 'wrap', backgroundColor: 'rgb(228,228,228)' }}>
          {/* <Toolbar> */}
          {this.role === 'Principal' || this.role === 'FOE'
            ? <OmsSelect
              label={'Branch'}
              disabled
              // placeholder='Select Branch'
              defaultValue={branchIdentity}
            />
            : <OmsSelect
              label={'Branch'}
              // disabled={this.role === 'Student'}
              disabled={this.role}
              // options={this.role === 'BDM'
              //   ? this.state.branchDataAssigned
              //   : this.props.branches
              //     ? this.props.branches.map(branch => ({
              //       value: branch.id,
              //       label: branch.branch_name
              //     }))
              //     : []
              // }
              options={this.role
                ? this.state.branchDataAssigned
                : this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              // placeholder='Select Branch'
              change={this.handleClickBranch}
              {...mode === 'EDIT' ? { defaultValue: { ...branchItems[0] } } : {}}
            />
          }
          <OmsSelect
            label={'Grade'}
            // disabled={this.role === 'Student'}
            disabled={this.role}

            change={this.handleClickGrade}
            options={
              this.props.grades
                ? this.props.grades.map(grades => ({
                  value: grades.id,
                  gradeId: grades.grade.id,
                  label: grades.grade.grade
                }))
                : []
            }
            {...mode === 'EDIT' ? { defaultValue: { ...gradeItems[0] } } : {}}
            // placeholder='Select Grade'
          />

          <OmsSelect
            label={'Section'}
            disabled={this.role !== 'Admin'}
            {...mode === 'EDIT' ? { defaultValue: { ...sectionItems[0] } } : {}}
            options={
              this.props.section
                ? this.props.section.map(section => ({
                  value: section.id,
                  label: section.section && section.section.section_name,
                  sectionId: section.section && section.section.id
                }))
                : []
            }
            change={(e) => {
              this.setState({ sectionId: e.value, valueSection: e, sectionItems: [e] })
            }}
            // placeholder='Select Section'
          />
          {/* </Toolbar> */}

        </div>
        {this.state
          ? <div id='stepperStudentAddEdit' className={classes.root}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                if (this.isStepOptional(index)) {
                  labelProps.optional = <Typography variant='caption'>Optional</Typography>
                }
                if (this.isStepSkipped(index)) {
                  props.completed = false
                }
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={this.handleReset()} className={classes.button}>
                Reset
                  </Button>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep, this.state, this)}
                  </Typography>
                  <div>
                    {mode === 'EDIT' ? <React.Fragment>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                      Back
                      </Button>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => this.switchUser(this.state.userId)}
                        className={classes.button}
                      >
                         Switch to Student
                      </Button>
                    </React.Fragment> : null}
                    {(mode === 'ADD' && activeStep === steps.length - 1)
                      ? <Button
                        disabled={activeStep === 0}
                        variant='contained'
                        color='primary'
                        onClick={e => this.setState({ activeStep: 0 })}
                        className={classes.button}
                      >
                      Add New student
                      </Button> : null
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
          : null
        }
      </React.Fragment>
    )
  }
}

StudentExtended.propTypes = {
  classes: PropTypes.object
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  subject: state.subjects.items,
  user: state.authentication.user,
  student: state.student,
  grades: state.gradeMap.items,
  section: state.sectionMap.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  // addStudent: studentData => dispatch(apiActions.addStudent(studentData)),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId, true))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(StudentExtended)))
