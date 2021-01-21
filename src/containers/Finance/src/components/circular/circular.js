import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import {
//   // Input,
//   // TextArea,
//   Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import Dropzone from 'react-dropzone'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import { withStyles, Paper, Stepper, Step, StepLabel, Typography, StepContent } from '@material-ui/core'

import CardContent from '@material-ui/core/CardContent'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import { OmsSelect, ProfanityFilter } from '../../ui'

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
// var formData = new FormData()

// getSteps()
// getStepContent()
class Circular extends React.Component {
  constructor () {
    super()
    this.state = { files: [],
      percentCompleted: 0,
      skipped: new Set(),
      gradevalue: []
    }
    this.uploadFiles = this.uploadFiles.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.changeHandlerGrade = this.changeHandlerGrade.bind(this)
    this.changeHandlerSection = this.changeHandlerSection.bind(this)
    this.getSteps = this.getSteps.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    // this.props.gradeMapBranch(academicProfile.branch_id)

    console.log(academicProfile)
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branchData: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id, label: academicProfile.branch })
    } else if (this.role === 'BDM') {
      let branchDataAssigned = []
      let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
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

    // this.role = this.userProfile.personal_info.role
    // this.mappindDetails = this.userProfile.academic_profile
    // this.props.gradeMapBranch(this.mappindDetails.branch_id)

    // this.setState({
    //   branchData: { value: this.mappindDetails.branch_id, label: this.mappindDetails.branch }
    // })
    this.circularId = this.props.match.params.id
    if (this.circularIdV1) {
      axios
        .get(urls.CircularId + this.circularId, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            let sectionId = []
            res.data.sections.map(data => {
              sectionId.push(data.id)
            })
            this.setState({
              flagGrade: true,
              flagSection: true,
              sectionMapId: sectionId,
              selectedGrade: res.data.sections[0].branch_grade_acad_session_mapping,
              circularName: res.data.circular_name,
              DesciptionValue: res.data.description
            })
            this.props.sectionMap(res.data.sections[0].branch_grade_acad_session_mapping)
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error('Error Occured')
          console.log(error)
        })
    }
  }

  getSteps () {
    return ['Select Branch', 'Select Grade', 'Select Section', 'Select Role', 'Upload File']
  }

  getStepContent (step) {
    switch (step) {
      case 0:
        return `Select Branch to send message`
      case 1:
        return `Select Grade`
      case 2:
        return `Select Section`
      case 3:
        return `Select the Role`
      case 4:
        return `Provide name of the Circular`
      default:
        return 'Unknown step'
    }
  }
  isStepOptional = step => {
    console.log(this.role, 'role')
    if (this.role === 'Principal' || this.role === 'Admin' || this.role === 'BDM') {
      return step === 2 || step === 1
    }
  }

  handleNext = () => {
    this.setState({
      branchError: false,
      sectionSelectionMessage: false,
      sectionError: false,
      studentSelectionMessage: false,
      studentError: false,
      nameError: false,
      messageError: false,
      fileError: false
    })
    const { activeStep = 0, role, circularName, gradevalue, files } = this.state
    if (activeStep === 1) {
      console.log(gradevalue, 'grade')
      if (gradevalue.length > 1) {
        this.setState({ activeStep: activeStep + 2 })
        return
      }
    }
    if (activeStep === 3) {
      if (!role) {
        this.props.alert.warning('Please enter required fields')

        return
      }
    }
    if (activeStep === 4) {
      if (!circularName) {
        this.setState({ nameError: 'Enter Circular Name' })
        return
      }

      if (!files || (files && files.length === 0)) {
        this.setState({ fileError: 'Select atleast one file to upload' })
        return
      }
    }

    let { skipped } = this.state

    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  };

  handleBack = () => {
    const { activeStep = 0, gradevalue } = this.state

    if (activeStep === 3) {
      if (gradevalue.length > 1) {
        this.setState({ activeStep: activeStep - 2 })
        return
      }
    }
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  };

  handleSkip = () => {
    const { activeStep } = this.state

    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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
  }

  isStepSkipped (step) {
    return this.state.skipped.has(step)
    // return false
  }
  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, gradevalue: [], branchData: e })
    this.props.gradeMapBranch(e.value)
  };

  changeHandlerGrade = event => {
    // this.setState({ grade: e.value })
    console.log(event, 'eeeeeee')
    let aGradeIds = []
    event.forEach(function (grade) {
      aGradeIds.push(grade.value)
    })
    this.props.sectionMap(aGradeIds[0])
    this.setState({ gradevalue: aGradeIds, gradeValue: event, sectionValue: [] })
    console.log(aGradeIds, 'grade')
    console.log('grade', aGradeIds)
  };

  changeHandlerSection (event) {
    let sectionId = []
    event.map(section => {
      sectionId.push(section.value)
    })
    this.setState({ sectionValue: event, sectionMapId: sectionId, flagSection: false })
  }
  changehandlerrole = e => {
    this.setState({ role: e.label, valueRole: e })
  };

  uploadFiles () {
    this.setState({ fileError: '', sectionError: '', nameError: '' })
    let { branchData, files, sectionMapId, circularName, DescriptionValue, gradevalue, gradeValue, role } = this.state
    console.log(gradeValue, 'grade')
    if (!circularName) {
      this.setState({ nameError: 'Enter Circular Name' })
      return
    }

    if (!files || (files && files.length === 0)) {
      this.setState({ fileError: 'Select atleast one file to upload' })
      return
    }
    let formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file' + i, files[i])
    }
    formData.append('circular_name', circularName)
    formData.append('description', DescriptionValue)
    formData.append('role', role)
    if (sectionMapId && sectionMapId.length > 0) {
      formData.append('section_mapping_ids', JSON.stringify(sectionMapId).substr(1).slice(0, -1))
    } else if (gradevalue && gradevalue.length > 0) {
      console.log(gradeValue, 'grade')
      let gradeIds = []
      gradeValue.forEach(item => gradeIds.push(item.gradeId))
      console.log(gradeIds)
      formData.append('grade_ids', this.role === 'Student' ? JSON.stringify(gradevalue).substr(1).slice(0, -1) : gradeIds)
      formData.append('branch_id', branchData.value)
    } else {
      formData.append('branch_id', branchData.value)
    }
    if (this.circularId) {
      formData.append('circular_id', this.circularId)
      axios
        .put(urls.CircularV1, formData, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }
        })
        .then(res => {
          // if(){}
          if (String(res.status).startsWith(String(2))) {
            this.props.alert.success('Circulars Updated Successfully')
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error(error.response.data)
          console.log(error)
        })
    } else {
      axios
        .post(urls.CircularV1, formData, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.setState({ percentCompleted })
            console.log('i am progesss ', percentCompleted)
            if (percentCompleted === 100) {
              this.setState({ percentCompleted: 0 })
            }
          }
        })
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            this.props.alert.success('Circulars Uploaded Successfully')
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error(error.response.data)
          console.log(error)
        })
    }
  }
  onDrop (files) {
    console.log('inside drop')
    this.state.files
      ? this.setState({
        files: files
      })
      : this.setState({ files: files })
  };

  getData = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    const { classes } = this.props

    const steps = this.getSteps()
    const { activeStep } = this.state

    let rolesNotRequired = [
      'Teacher_applicant',
      'Applicant',
      'Planner',
      'Principal',
      'FinanceAccountant',
      'Academic Coordinator',
      'Admin',
      'BDM',
      'FOE',
      'Subjecthead',
      'Reviewer',
      'Parent',
      'FinanceAdmin',
      'EA',
      'StoreAdmin',
      'StoreManager'
    ]
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    let { branchData, fileError, sectionError, gradeValue,
      sectionValue, selectedGrade, sectionMapId, flagGrade, flagSection, branchError, sectionSelectionMessage, nameError } = this.state
    return (
      <React.Fragment>

        <div className={classes.root}>
          <Stepper activeStep={activeStep}orientation='vertical'>
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
                  <StepContent>
                    <Typography>{this.getStepContent(index)}</Typography>
                    {index === 0
                      ? <React.Fragment>
                        <OmsSelect
                          label={'Branch'}
                          options={this.role === 'BDM'
                            ? this.state.branchDataAssigned
                            : this.props.branches
                              ? this.props.branches.map(branch => ({
                                value: branch.id,
                                label: branch.branch_name
                              }))
                              : []
                          }
                          disabled={this.role === 'Principal'}
                          change={this.changehandlerbranch}
                          defaultValue={branchData}
                        />
                        {/* //   defaultValue={branchData}
                        //   disabled
                        // /> */}
                        {branchError && (
                          <Typography style={{ color: 'red' }}>Select Branch</Typography>
                        )}

                      </React.Fragment>
                      : ''}
                    {index === 1
                      ? <React.Fragment>
                        {sectionSelectionMessage &&
                        <Typography style={{ color: 'red' }}>
                          Select only one branch if you want to assign message to sections/students or skip this step
                        </Typography>
                        }
                        <OmsSelect
                          label={'Grade'}
                          options={this.props.grades
                            ? this.props.grades.map(grade => ({
                              value: grade.id,
                              label: grade.grade.grade,
                              gradeId: grade.grade.id
                            }))
                            : []
                          }
                          change={e => this.changeHandlerGrade(e)}
                          disabled={this.props.gradeLoading}
                          defaultValue={flagGrade
                            ? this.props.grades
                              ? this.props.grades.filter(grade => grade.grade.id === selectedGrade)
                                .map(grade => ({
                                  value: grade.id,
                                  label: grade.grade.grade,
                                  gradeId: grade.grade.id
                                }))[0] : []
                            : gradeValue}
                          isMulti
                        />
                      </React.Fragment> : ''}
                    {index === 2

                      ? <React.Fragment>

                        <OmsSelect
                          label={'Section'}
                          options={this.props.sections
                            ? this.props.sections.map(section => ({
                              value: section.id,
                              label: section.section.section_name
                            }))
                            : []
                          }
                          change={e => this.changeHandlerSection(e)}
                          disabled={this.props.sectionLoading}
                          defaultValue={flagSection
                            ? this.props.sections
                              ? this.props.sections.filter(section => sectionMapId.includes(section.id))
                                .map(section => ({
                                  value: section.id,
                                  label: section.section.section_name
                                }))
                              : []
                            : sectionValue}
                          isMulti
                        />
                        {sectionError && (
                          <Typography style={{ color: 'red' }}>Select Section</Typography>
                        )}
                      </React.Fragment>
                      : ''
                    }
                    {index === 3
                      ? <React.Fragment>
                        <OmsSelect
                          label={'Role'}
                          options={this.props.roles
                            ? this.props.roles
                              .filter(
                                role =>
                                  !rolesNotRequired.includes(role.role_name)
                              )
                              .map(role => ({
                                value: role.id,
                                label: role.role_name
                              }))
                            : []}

                          // defaultvalue={this.state.gradevalue}
                          change={this.changehandlerrole}
                          defaultValue={this.state.valueRole}
                          error={this.state.roleError}

                        />

                      </React.Fragment>
                      : ''
                    }
                    {index === 4
                      ? <React.Fragment>
                        <ProfanityFilter name='circularName' onChange={this.getData} label='Title' />
                        <br />
                        {nameError && (
                          <p style={{ color: 'red' }}>Enter Title</p>
                        )}
                        <br />
                        <ProfanityFilter name='DescriptionValue' onChange={this.getData} label='Enter Description' isMultiline />
                        <br />

                        <Dropzone onDrop={this.onDrop}>
                          {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject
                          }) => (
                            <Card
                              elevation={0}
                              style={{
                                marginTop: 16,
                                marginBottom: 16,
                                border: '1px solid black',
                                borderStyle: 'dotted'
                              }}
                              {...getRootProps()}
                              className='dropzone'
                            >
                              <CardContent>
                                <input {...getInputProps()} />
                                <div>
                                  {isDragAccept && 'All files will be accepted'}
                                  {isDragReject && 'Some files will be rejected'}
                                  {!isDragActive && 'Drop your files here.'}
                                </div>
                                {files}
                              </CardContent>
                            </Card>
                          )}
                        </Dropzone>
                        {fileError && (
                          <p style={{ color: 'red' }}>
                          Select atleast one file to send message
                          </p>
                        )}
                      </React.Fragment>
                      : ''
                    }
                    {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted > 0 && this.state.percentCompleted}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}

                        >
                        Back
                        </Button>
                        { this.isStepOptional(activeStep) && this.state.gradevalue.length === 0 && (
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={this.handleSkip}
                            className={classes.button}
                            style={{ position: 'relative', left: '20px', marginTop: '10px' }}
                          >
                          Skip
                          </Button>
                        )}
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={this.handleNext}
                          className={classes.button}
                          style={{ position: 'relative', left: '40px', marginTop: '10px' }}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              {this.state.percentCompleted > 0 &&
              <LinearProgress
                variant={'determinate'}
                value={this.state.percentCompleted}
              />
              }
              <Typography style={{ textAlign: 'center' }}>All steps completed - you&apos;re finished</Typography>

              <Button disabled={!this.state.files} onClick={this.uploadFiles} style={{ position: 'relative', left: '30px' }}>
                Upload Circular
              </Button>
            </Paper>
          )}
        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  sections: state.sectionMap.items,
  sectionLoading: state.sectionMap.loading,
  roles: state.roles.items

})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId)),
  loadRoles: dispatch(apiActions.listRoles())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Circular)))
