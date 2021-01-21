import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import { Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import ReactTable from 'react-table'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import IconButton from '@material-ui/core/IconButton/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import _ from 'lodash'
import { withStyles, Paper, Stepper, Step, StepLabel, Typography, StepContent, Toolbar,
  Card, CardActions, CardContent, Chip } from '@material-ui/core'
import moment from 'moment'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import { OmsSelect } from '../../ui'

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
  },
  card: {
    margin: '5%'
  }
})

class ViewCircular extends React.Component {
  constructor () {
    super()
    this.state = {
      numPages: null,
      pageNumber: 1,
      skipped: new Set(),
      activeStep: 0,
      branchData: [],
      pdf: [],
      showReactTable: false,
      gradevalue: []
    }

    this.getSectionData = this.getSectionData.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.getSteps = this.getSteps.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
    this.getCircularStudent = this.getCircularStudent.bind(this)
  }

  componentDidMount () {
    // var sectionMapId, gradeValue
    this.mappindDetails = this.userProfile.academic_profile
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Student') {
      this.mappingDetails = this.userProfile
      this.setState({
        branch: this.mappingDetails.branch_id,
        grade: this.mappingDetails.grade_id,
        section: this.mappingDetails.section_mapping_id
      }, () => this.getCircularStudent())
    } else {
      this.role = this.userProfile.personal_info.role
      let academicProfile = this.userProfile.academic_profile
      // this.props.gradeMapBranch(academicProfile.branch_id)
      if (this.role === 'Principal' || this.role === 'BDM') {
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
        console.log(branchDataAssigned, 'dtttttattatatt')
      }
    }

    if (this.role === 'Teacher') {
      let mappingDetails = this.userProfile.academic_profile[0]
      this.setState({
        branch: mappingDetails.branch_id,
        branchData: { value: mappingDetails.branch_id, label: mappingDetails.branch_name }
      })
      this.changehandlerbranch({ value: mappingDetails.branch_id, label: mappingDetails.branch_name })
      // this.props.gradeMapBranch(mappingDetails.branch_id)
    }
  }

  getSteps () {
    return this.role === 'Student' ? []
      : ['Select Branch', 'Select Grade', 'Select Section', 'Select Role']
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
      default:
        return 'Unknown step'
    }
  }

  isStepOptional = step => {
    if (this.role === 'Principal' || this.role === 'Admin' || this.role === 'Teacher' || this.role === 'BDM') {
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
      desciptionError: false,
      messageError: false,
      fileError: false
    })
    const { activeStep = 0, role, gradevalue, gradeData } = this.state
    if (activeStep === 1) {
      console.log(gradeData, 'grade')
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

    let { skipped } = this.state

    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  }

  handleBack = () => {
    const { activeStep = 0, gradevalue } = this.state
    if (activeStep === 3) {
      console.log(gradevalue, 'grade')
      if (gradevalue.length > 1) {
        this.setState({ activeStep: activeStep - 2 })
        return
      }
    }
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
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
  }

  isStepSkipped (step) {
    return this.state.skipped.has(step)
    // return false
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, branchData: e, valueSection: [], gradevalue: [] })

    let gradeData = []
    this.setState({ branch: e.value, gradevalue: [] })
    this.props.gradeMapBranch(e.value)
    if (this.role === 'Teacher') {
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.grade_id) && item.branch_id === e.value) {
          map.set(item.grade_id, true) // set any value to Map
          gradeData.push({
            value: item.grade_id,
            label: item.grade_name
          })
        }
      }
      this.setState({ gradeData: gradeData, gradevalue: [], valueSection: [], branchData: e })
    }
  }

  changeHandlerGrade = event => {
    // this.setState({ grade: e.value })
    let aGradeIds = []
    event.forEach(function (grade) {
      aGradeIds.push(grade.value)
    })

    if (this.role === 'Teacher') {
      let sections = []
      event.forEach(grade => {
        return this.mappindDetails.filter(mapping => mapping.grade_id === grade.value).map((mapping) => {
          sections.push({
            value: mapping.section_mapping_id,
            label: mapping.section_name
          })
        })
      })
      sections = _.uniqBy(sections, 'value')
      console.log(sections)
      this.setState({ sectionData: sections, gradeValue: event, gradevalue: event })
    } else {
      this.props.sectionMap(aGradeIds[0])
      this.setState({ gradevalue: aGradeIds, gradeValue: event, sectionValue: [], sectionData: [] })
      console.log(aGradeIds, 'grade')
      console.log('grade', aGradeIds)
    }
  }

  changeHandlerSection (event) {
    let sectionId = []
    event.map(section => {
      sectionId.push(section.value)
    })
    this.setState({ sectionValue: event, sectionMapId: sectionId, flagSection: false })
  }

  getSectionData (sectionId) {
    this.setState({ sectionMapId: sectionId })
  }

  changehandlerrole = e => {
    this.setState({ role: e.label, valueRole: e })
  }

  getFiles () {
    this.setState({ sectionError: '', showReactTable: true })
    this.getCircular()
  }

  getCircular () {
    let{ sectionMapId, gradevalue, gradeValue, branchData } = this.state
    let url = urls.CircularV1
    let{ role } = this.state
    if (sectionMapId && sectionMapId.length > 0) {
      url = url + '?section_mapping_ids=' + (JSON.stringify(sectionMapId)).substr(1).slice(0, -1)
    } else if (gradevalue && gradevalue.length > 0) {
      let gradeIds = []
      console.log(gradeValue)
      gradeValue.forEach(item => gradeIds.push(this.role === 'Teacher' ? item.value : item.gradeId))
      console.log(gradeIds)
      url = url + '?grade_ids=' + (this.role === 'Student' ? JSON.stringify(gradevalue).substr(1).slice(0, -1) : gradeIds) + '&branch_id=' + branchData.value
    } else {
      url = url + '?branch_id=' + branchData.value
    }

    axios
      .get(url + '&role=' + role, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pdf: res.data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  getCircularStudent () {
    let { section } = this.state
    axios
      .get(urls.CircularV1 + '?section_mapping_ids=' + JSON.stringify(section) +
        '&role=' + this.role, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pdf: res.data, showReactTable: true })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document
    this.setState({
      numPages,
      pageNumber: 1
    })
  }

  handleDelete (id) {
    axios
      .delete(urls.CircularV1 + id + '/', {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Circular deleted')
          let data = this.state.pdf
          let index = data.findIndex(data => data.id === id)
          data.splice(index, 1)
          this.setState({ pdf: data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
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
      'StoreManager'
    ]

    let { sectionValue, flagSection, sectionMapId, sectionError, branchError,
      sectionSelectionMessage, pdf } = this.state
    this.currentRole = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    return (
      <React.Fragment>
        {
          this.role === 'Student'
            ? <div className={classes.root}>
              {pdf && pdf.length > 0 && pdf.map(circular => {
                return (
                  <Card className={classes.card} key={circular.id}>
                    <CardContent>
                      <Typography variant='h6' color='textSecondary'>
                        {circular.circular_name}
                      </Typography>
                      <Typography color='textSecondary'>
                        {circular.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <React.Fragment>
                        {circular.media && circular.media.length > 0 &&
                        circular.media.map((file, index) => {
                          return <Chip
                            key={index}
                            clickable
                            onClick={e => window.open(file.file_content)}
                            label='View File'
                            color='secondary'
                            style={{ backgroundColor: '#5d1049' }}
                          />
                        })}
                        {circular.time_stamp &&
                        <Chip
                          label={moment(circular.time_stamp).format('MMMM Do YYYY, h:mm:ss a')}
                        />}
                      </React.Fragment>
                    </CardActions>
                  </Card>

                )
              })
              }
            </div>
            : ''
        }
        <Toolbar
        />
        {this.role !== 'Student'
          ? <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                // if (this.isStepOptional(index)) {
                //   labelProps.optional = <Typography variant='caption'>Optional</Typography>
                // }
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
                            disabled={this.role === 'Principal' || this.role === 'Teacher'}
                            change={this.changehandlerbranch}
                            defaultValue={this.state.branchData}
                          />
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
                            options={this.role === 'Teacher' ? this.state.gradeData : this.props.grades
                              ? this.props.grades.map(grade => ({
                                value: grade.id,
                                label: grade.grade.grade,
                                gradeId: grade.grade.id
                              }))
                              : []
                            }
                            isMulti
                            change={e => this.changeHandlerGrade(e)}
                            disabled={this.props.gradeLoading}
                            defaultValue={this.state.gradeValue}

                          />
                        </React.Fragment>
                        : ''
                      }
                      {index === 2
                        ? <React.Fragment>
                          <OmsSelect
                            label={'Section'}
                            options={this.role === 'Teacher' ? this.state.sectionData : this.props.sections
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
                        : ''}
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
                            change={this.changehandlerrole}
                            defaultValue={this.state.valueRole}
                            error={this.state.roleError}
                          />
                        </React.Fragment>
                        : ''
                      }
                      <div className={classes.actionsContainer}>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                          >
                        Back
                          </Button>
                          {this.isStepOptional(activeStep) && this.state.gradevalue.length === 0 && (
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
                <Typography>All steps completed - you&apos;re finished</Typography>

                <Button onClick={this.getFiles}style={{ position: 'relative', left: '30px' }}> Get Circular </Button>
              </Paper>
            )}
            {this.state.showReactTable && <ReactTable
              columns={[
                {
                  Header: 'Circular Name',
                  accessor: 'circular_name'
                },
                {
                  Header: 'Description',
                  accessor: 'description'
                },
                {
                  Header: 'File Name',
                  Cell: (props) => { return Array.isArray(props.original.media) && props.original.media.length > 0 ? <a target='_blank' href={props.original.media[0].file_content}>View File</a> : '' }
                },
                {
                  Header: 'Uploaded Date',
                  Cell: (props) => { return moment(props.original.time_stamp).format('MMMM Do YYYY, h:mm:ss a') }
                },
                {
                  id: 'x',
                  Header: 'Actions',
                  accessor: data => {
                    return (
                      <div>
                        <IconButton
                          aria-label='Delete'
                          onClick={e => this.handleDelete(data.id)}
                          className={classes.margin}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </div>
                    )
                  }
                }
              ]}
              data={this.state.pdf}
              defaultPageSize={5}
              showPageSizeOptions={false}
            />}
          </div>
          : ''
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  roles: state.roles.items,
  gradeLoading: state.gradeMap.loading,
  sectionLoading: state.sectionMap.loading

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
)(withRouter(withStyles(styles)(ViewCircular)))
