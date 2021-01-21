import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import { withStyles, Paper, Typography, Stepper, Step, StepLabel, StepContent, Button,
  Input, Checkbox } from '@material-ui/core/'
import { urls } from '../../urls'
// import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../_components/globalselector'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
})

function getSteps () {
  return ['Select Branch', 'Select Students', 'Write Message']
}

function getStepContent (step) {
  console.log(step, 'steps')

  switch (step) {
    case 0:
      return `Select Branch/Grade and Section to send message`
    case 1:
      return `Select Students associated with the section to send message`
    case 2:
      return `Provide message details and content`
    default:
      return 'Unknown step'
  }
}

class Message extends React.Component {
  constructor () {
    super()
    this.state = {
      activeStep: 0,
      skipped: new Set(),
      files: [],
      percentCompleted: 0,
      selectedStudentId: []
    }
    this.changeHandlerBranch = this.changeHandlerBranch.bind(this)
    this.changeHandlerGrade = this.changeHandlerGrade.bind(this)
    this.changeHandlerSection = this.changeHandlerSection.bind(this)
    this.handleChangeCheck = this.handleChangeCheck.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.onDrop = this.onDrop.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount () {
    if (this.role !== 'Admin') {
      let branchId, branchName
      let array = []
      if (this.role === 'Principal') {
        branchId = this.userProfile.academic_profile.branch_id
        branchName = this.userProfile.academic_profile.branch
      } else if (this.role === 'BDM') {
        branchId = this.userProfile.academic_profile.branch_id
        branchName = this.userProfile.academic_profile.branch
      } else if (this.role === 'Teacher' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator') {
        this.mappindDetails = this.userProfile.academic_profile
        let map = new Map()
        for (const item of this.mappindDetails) {
          if (!map.has(item.branch_id)) {
            map.set(item.branch_id, true)
            branchId = item.branch_id
            branchName = item.branch_name
          }
        }
      }
      array.push(branchId)
      this.setState({
        branchId: array,
        valueBranch: { value: branchId, label: branchName }
      })
    }
    this.messageId = this.props.match.params.id
    if (this.messageId) {
      axios
        .get(urls.Message + '?id=' + this.messageId, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              title: res.data[0].title,
              message: res.data[0].message
            })
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

  changeHandlerBranch (event) {
    let ids = []
    event.forEach(branch => ids.push(branch.value))
    this.setState({
      branchId: ids,
      valueBranch: event,
      valueSection: [],
      valueGrade: []
    })
  }

  changeHandlerGrade (event) {
    this.setState({ valueGrade: event, valueSection: [] })
    if (this.role === 'Teacher' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator') {
      let obj = this.props.grades.filter(grades => grades.grade.id === event.value)
      if (obj.length > 0) {
        this.props.sectionMap(obj[0].id)
      }
      let sectionData = []
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.section_id) && item.grade_id === event.value) {
          map.set(item.section_id, true)
          sectionData.push({
            value: item.section_id,
            label: item.section_name
          })
        }
      }
      this.setState({ sectionData: sectionData })
    } else {
      this.props.sectionMap(event.value)
    }
  }

  changeHandlerSection (event) {
    let ids = []
    event.forEach(selectedSection => {
      if ((this.role === 'Teacher' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator') && this.props.section) {
        let obj = this.props.section.filter(
          section => section.section.id === selectedSection.value
        )
        ids.push(obj[0].id)
      } else {
        ids.push(selectedSection.value)
      }
    })
    this.setState({ sectionId: ids, valueSection: event })
  }

  handleChangeCheck (event, id) {
    let dataCopy = this.state.data
    let student = dataCopy.filter((student) => student.erp === id)[0]
    this.setState({ data: dataCopy })
    if (event.target.checked) {
      this.state.selectedStudentId.push(id)
      console.log(this.state.selectedStudentId)
      student['isChecked'] = true
    } else {
      if (this.state.selectedStudentId.includes(id)) {
        this.state.selectedStudentId.splice(this.state.selectedStudentId.indexOf(id), 1)
      }
      student['isChecked'] = false
    }
    this.setState({ data: dataCopy })
  }

  handleNext = () => {
    this.setState({
      branchError: false,
      sectionSelectionMessage: false,
      sectionError: false,
      studentSelectionMessage: false,
      studentError: false,
      titleError: false,
      messageError: false
      // fileError: false
    })
    const { activeStep } = this.state
    console.log(activeStep, 'step')
    const { selectorData } = this.state
    console.log(selectorData.acadsectionmapping, 'datat')
    // if (activeStep === 0) {
    // let { branchId } = this.state
    // if (!branchId) {
    //   this.setState({ branchError: true })
    //   return
    // }
    // if (branchId.length === 1) {
    //   this.props.gradeMapBranch(branchId)
    //   if (this.role === 'Teacher' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator') {
    //     let gradeData = []
    //     let map = new Map()
    //     for (const item of this.mappindDetails) {
    //       if (!map.has(item.grade_id) && item.branch_id === branchId[0]) {
    //         map.set(item.grade_id, true)
    //         gradeData.push({
    //           value: item.grade_id,
    //           label: item.grade_name
    //         })
    //       }
    //     }
    //     this.setState({ gradeData: gradeData, valueGrade: [], valueSection: [] })
    //   }
    // }
    //  else {
    //   this.setState({ sectionSelectionMessage: true })
    // }
    // }
    // if (activeStep === 0) {
    let { acadsectionmapping } = this.state
    if (!acadsectionmapping) {
      this.setState({ sectionError: true })
      return
    }

    // if (acadsectionmapping.length === 1) {
    axios
      .get(urls.Student + '?acadsectionmapping=' + selectorData.acadsectionmapping, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var studentData = []
        res.data.result.forEach(function (student, index) {
          let obj = {
            sr: index + 1,
            student_id: student.id,
            name: student.name,
            roll: student.roll_no,
            erp: student.erp,
            isChecked: false
          }
          studentData.push(obj)
        })
        this.setState({ data: studentData })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.Student, error)
      })
    // }
    // else {
    //   this.setState({ studentSelectionMessage: true })
    // }
    // } else
    if (activeStep === 2) {
      if (this.state.selectedStudentId.length === 0) {
        this.setState({ studentError: true })
        return
      }
    } else if (activeStep === getSteps().length - 1) {
      let { title, message } = this.state
      if (!title) {
        this.setState({ titleError: true })
        return
      }
      if (!message) {
        this.setState({ messageError: true })
        return
      }
      // if (!files || files.length === 0) {
      //   this.setState({ fileError: true })
      //   return
      // }
    }
    let { skipped } = this.state
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  }

  handleNextt = () => {
    this.setState({
      branchError: false,
      sectionSelectionMessage: false,
      sectionError: false,
      studentSelectionMessage: false,
      studentError: false,
      titleError: false,
      messageError: false,
      gradeError: false
      // fileError: false
    })
    const { activeStep } = this.state
    if (activeStep === 0) {
      let { selectorData } = this.state
      if (!selectorData.acadsectionmapping && this.role === 'Teacher' && this.role === 'LeadTeacher') {
        this.setState({ sectionError: true })
        return
      }
    }
    if (activeStep === 0) {
      const { selectorData } = this.state
      if (selectorData.acadsectionmapping) {
        axios
          .get(urls.Student + '?acadsectionmapping=' + selectorData.acadsectionmapping, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            console.log(res, 'res')

            var studentData = []
            res.data.result.forEach(function (student, index) {
              let obj = {
                sr: index + 1,
                student_id: student.id,
                name: student.name,
                roll: student.roll_no,
                erp: student.erp,
                isChecked: false
              }
              studentData.push(obj)
            })
            this.setState({ data: studentData })
          })
          .catch(error => {
            console.log("Error: Couldn't fetch data from " + urls.Student, error)
          })
      } else {
        this.setState({ studentSelectionMessage: true })
      }
    }
    if (activeStep === 1) {
      if (this.state.selectedStudentId.length === 0) {
        this.setState({ studentError: true })
        return
      }
    }
    let { skipped } = this.state
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  }
  onDrop (files = []) {
    if (files.length) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        let val = ['jpg', 'jpeg', 'gif', 'png', 'doc', 'docx', 'xls', 'xlsx',
          'ppt', 'txt', 'pdf', 'html',
          'htm', 'odt', 'ods', 'pptx', 'jpeg', 'gif', 'png', 'tiff',
          'bmp', 'aac', 'mp3', 'mp4', 'wav', 'wma', 'dts', 'aiff', 'asf', 'flac',
          'adpcm', 'dsd', 'lpcm', 'ogg', 'mpeg-1', 'mpeg-2', 'mpeg-4', 'avi', 'mov', 'avchd', 'mkv', '3gp', 'flv', 'wmv']
        let fileName = files[fileIndex].name
        let extension = fileName.split('.')[fileName.split('.').length - 1]
        if (extension) {
          let isValidExtension = val.includes(extension.toLowerCase())
          if (isValidExtension === true) {
            files[fileIndex]['customKey_isvalidExtention'] = true
          } else {
            let msg = 'Invalid file extension of file: ' + fileName
            this.props.alert.error(msg)
          }
        } else {
          let msg = 'please upload a file with extension: ' + fileName
          this.props.alert.error(msg)
        }
      }
      files = files.filter(file => file['customKey_isvalidExtention'] === true)
      files = files.map(file => {
        delete file['customKey_invalidExtention']
        return file
      })
      this.setState({ files })
    }
  };

  handleBack = () => {
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

  isStepOptional = step => {
    if (this.role === 'Teacher' || this.role === 'LeadTeacher' || this.role === 'AcademicCoordinator') {
      return step === 1
    } else { return step === 1 }
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
      valueGrade: [],
      valueSection: [],
      data: [],
      title: '',
      message: '',
      files: [],
      selectedStudentId: []
    })
    console.log(this.state.selectedStudentId)
    if (this.role === 'Admin') {
      this.setState({
        valueBranch: [],
        branchId: null
      })
    }
  }

  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }

  handleSubmit = () => {
    let { title, message, branchId, sectionId, skipped, files } = this.state
    let aDummy = JSON.stringify([])
    var formData = new FormData()
    for (var i = 0; i < files.length; i++) {
      formData.append('media_files', files[i])
    }
    formData.append('title', title)
    formData.append('message', message)
    formData.append('uploaded_by', this.userProfile.personal_info.user_id)
    if (!skipped.has(2)) {
      formData.append('student_erps', JSON.stringify(this.state.selectedStudentId))
      formData.append('grade_sections', aDummy)
      formData.append('acad_branches', aDummy)
    } else if (!skipped.has(1)) {
      formData.append('student_erps', aDummy)
      formData.append('grade_sections', JSON.stringify(sectionId))
      formData.append('acad_branches', aDummy)
    } else {
      formData.append('student_erps', aDummy)
      formData.append('grade_sections', aDummy)
      formData.append('acad_branches', JSON.stringify(branchId))
    }

    axios
      .post(urls.Message, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          if (percentCompleted === 100) {
            this.setState({ percentCompleted: 0 })
          }
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Message Uploaded Successfully')
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  onChange = (data) => {
    console.log(data, 'data')

    // this.setState({ absenteesRollNoList: [], absenteesCount: 0, data: [], studentData: [], showTable: false, showTableUpdate: false
    // })
    this.setState({ selectorData: { acadsectionmapping: data.section_mapping_id, acadsectionmapping_id: data.section_mapping_id, branch_id: data.branch_id, acad_branch_grade_mapping_id: data.acad_branch_grade_mapping_id } }, () => console.log(this.state.selectorData))
  }
  render () {
    console.log(this.state.data)
    const files = this.state.files &&
      this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    const { classes } = this.props
    const steps = getSteps()
    const { activeStep, data,
      // gradeData, sectionData, valueGrade, valueSection,
      // sectionSelectionMessage,
      studentSelectionMessage,
      //  sectionError,
      studentError, titleError, messageError, message, title } = this.state
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((label, index) => {
            console.log(index, 'indexx')
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
                  <Typography>{getStepContent(index)}</Typography>
                  {index === 0
                    ? <React.Fragment>
                      <Grid style={{ marginLeft: 4 }} item>
                        <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
                      </Grid>
                      {/* <OmsSelect
                        label={'Branch'}
                        options={this.props.branches
                          ? this.props.branches.map((branch) => ({
                            value: branch.id,
                            label: branch.branch_name }))
                          : []
                        }
                        defaultValue={valueBranch}
                        isMulti
                        change={this.changeHandlerBranch}
                        disabled={this.props.branchLoading || this.role !== 'Admin'}
                      /> */}
                      {this.state.sectionError && (
                        <Typography style={{ color: 'red' }}>Select Section</Typography>
                      )}
                    </React.Fragment>
                    : ''}
                  {index === 1
                    ? <React.Fragment>
                      {/* {this.state.sectionSelectionMessage &&
                        <Typography style={{ color: 'red' }}>
                          Select only one branch if you want to assign message to sections/students or skip this step
                        </Typography>
                      } */}
                      {studentSelectionMessage &&
                      <Typography style={{ color: 'red' }}>
                        Select  one section if you want to assign message to particular students or skip this step
                      </Typography>
                      }

                      {data && !studentSelectionMessage &&
                      <ReactTable style={{ maxWidth: '300px' }}
                        data={data}
                        columns={[
                          {
                            Header: 'Select',
                            accessor: d => (
                              <Checkbox
                                onChange={e => this.handleChangeCheck(e, d.erp)}
                                checked={d.isChecked}
                              />
                            ),
                            id: 'check'
                          },
                          {
                            Header: 'Sr.',
                            accessor: 'sr'
                          },
                          {
                            Header: 'Student Name',
                            accessor: 'name',
                            filterable: true
                          },
                          {
                            Header: 'Roll Number',
                            accessor: 'roll'
                          },
                          {
                            Header: 'ERP',
                            accessor: 'erp'
                          }
                        ]}
                        pageSize={data.length}
                        className='-striped -highlight'
                        showPagination={false}
                      />}
                      {studentError && (
                        <Typography style={{ color: 'red' }}>Select Student</Typography>
                      )}
                    </React.Fragment>
                    : ''
                  }
                  {/*
                  { index === 1
                    ? <React.Fragment>
                      {studentSelectionMessage &&
                      <Typography style={{ color: 'red' }}>
                        Select only one section if you want to assign message to particular students or skip this step
                      </Typography>
                      }

                      {data &&
                      <ReactTable style={{ maxWidth: '300px' }}
                        data={data}
                        columns={[
                          {
                            Header: 'Select',
                            accessor: d => (
                              <Checkbox
                                onChange={e => this.handleChangeCheck(e, d.erp)}
                                checked={d.isChecked}
                              />
                            ),
                            id: 'check'
                          },
                          {
                            Header: 'Sr.',
                            accessor: 'sr'
                          },
                          {
                            Header: 'Student Name',
                            accessor: 'name',
                            filterable: true
                          },
                          {
                            Header: 'Roll Number',
                            accessor: 'roll'
                          },
                          {
                            Header: 'ERP',
                            accessor: 'erp'
                          }
                        ]}
                        pageSize={data.length}
                        className='-striped -highlight'
                        showPagination={false}
                      />}
                      {studentError && (
                        <Typography style={{ color: 'red' }}>Select Student</Typography>
                      )}
                    </React.Fragment>
                    : ''
                  } */}
                  {index === 2
                    ? <React.Fragment>
                      <Input
                        fullWidth
                        placeholder='Enter Message Title here'
                        type='text'
                        onChange={e => this.setState({ title: e.target.value })}
                        value={title}
                      /> <br />
                      {titleError && (
                        <p style={{ color: 'red' }}>Enter Title</p>
                      )}
                      <Input
                        fullWidth
                        placeholder='Enter Message here'
                        type='text'
                        onChange={e => this.setState({ message: e.target.value })}
                        value={message}
                      /> <br />
                      {messageError && (
                        <p style={{ color: 'red' }}>Enter Message</p>
                      )}
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
                      {/* {fileError && (
                        <p style={{ color: 'red' }}>
                          Select atleast one file to send message
                        </p>
                      )} */}
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
                      {this.isStepOptional(activeStep) && (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={this.handleSkip}
                          className={classes.button}
                        >
                          Skip
                        </Button>
                      )}
                      {/* {(this.state.selectorData && this.state.selectorData.acad_branch_grade_mapping_id &&
                      this.state.selectorData.acadsectionmapping)
                        ? <Button
                          variant='contained'
                          color='primary'
                          onClick={this.handleNextt}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button> : ''} */}
                      { (this.state.selectorData && this.state.selectorData.branch_id && this.state.selectorData.acad_branch_grade_mapping_id &&
                     !this.state.selectorData.acadsectionmapping)

                        ? <Button
                          variant='contained'
                          color='primary'
                          onClick={this.handleNextt}
                          className={classes.button}
                          disabled

                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}

                        </Button> : (this.state.selectorData && this.state.selectorData.branch_id)
                          ? <Button
                            variant='contained'
                            color='primary'
                            onClick={this.handleNextt}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                          : ''
                      }
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
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleSubmit}
              className={classes.button}
            >
              Send Message
            </Button>
          </Paper>
        )}
      </div>
    )
  }
}

Message.propTypes = {
  classes: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  branchLoading: state.branches.loading,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  section: state.sectionMap.items,
  sectionLoading: state.sectionMap.loading,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listSubjects: () => dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Message)))
