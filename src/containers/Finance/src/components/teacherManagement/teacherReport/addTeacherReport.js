import React from 'react'
import { Grid, Menu } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { connect } from 'react-redux'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Divider from '@material-ui/core/Divider'
import { urls } from '../../../urls'
import { OmsSelect, ProfanityFilter } from '../../../ui'

const styles = theme => ({
  root: {
    width: '100%'
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

class AddTeacherReport extends React.Component {
  constructor () {
    super()
    this.state = {
      recap: '',
      classWork: '',
      homeWork: '',
      summary: '',
      supportMaterials: '',
      disableButton: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.getMicroItems = this.getMicroItems.bind(this)
    this.getLessonItems = this.getLessonItems.bind(this)
  }

  state = { activeItem: 'bio' };

  componentDidMount () {
    var userProfile = JSON.parse(localStorage.getItem('user_profile'))
    var mappingDetails = userProfile.academic_profile
    if (mappingDetails.length > 0) {
      if (!window.isMobile) {
        this.getLessonPlan(mappingDetails[0])
      }
      this.setState({ grade_section_subject: mappingDetails, activeItem: 0 })
    }
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onDrop (files) {
    this.state.files
      ? this.setState({
        files: [...this.state.files, ...files]
      })
      : this.setState({ files: files })
  }

  handleItemClick = (index, option) => {
    console.log(index)
    console.log(option)
    this.setState({
      activeItem: index,
      recap: '',
      classWork: '',
      summary: '',
      supportMaterials: '',
      homeWork: '',
      files: []
    })
    if (!window.isMobile) {
      this.getLessonPlan(this.state.grade_section_subject[index])
    }
  }
   Recap = () => {
     let{ recap } = this.state
     if (!recap) {
       this.setState({ recapError: true })
       return true
     }
   }
   ClassWork = () => {
     let{ classWork } = this.state
     if (!classWork) {
       this.setState({ classWorkError: true })
       return true
     }
   }
  Summary = () => {
    let{ summary } = this.state
    if (!summary) {
      this.setState({ summaryError: true })
      return true
    }
  }
 SupportMaterials= () => {
   let{ supportMaterials } = this.state
   if (!supportMaterials) {
     this.setState({ supportMaterialsError: true })
     return true
   }
 }
  HomeWork = () => {
    let{ homeWork } = this.state
    if (!homeWork) {
      this.setState({ homeWorkError: true })
      return true
    }
  }

     handleSubmit = e => {
       this.setState({
         classWorkError: false,
         recapError: false,
         summaryError: false,
         supportMaterialsError: false,
         homeWorkError: false
       })

       let RecapValue = this.Recap()
       let ClassWorkValue = this.ClassWork()
       let SummaryValue = this.Summary()
       let SupportMaterialsValue = this.SupportMaterials()
       let HomeWorkValue = this.HomeWork()

       if (RecapValue || ClassWorkValue || SummaryValue || SupportMaterialsValue || HomeWorkValue) {
         return
       }

       this.setState({ disableButton: true })
       var mappingDetails = this.state.grade_section_subject
       var reportOf = mappingDetails[this.state.activeItem]
       var formData = new FormData()
       formData.append('branch_id', reportOf.branch_id)
       formData.append('grade_id', reportOf.grade_id)
       formData.append('section_id', reportOf.section_id)
       formData.append('subject_ids', reportOf.subject_id)
       formData.append('recap', this.state.recap)
       formData.append('summary', this.state.summary)
       formData.append('classwork', this.state.classWork)
       formData.append('homework', this.state.homeWork)
       formData.append('support_materials', this.state.supportMaterials)
       this.state.files &&
      this.state.files.forEach((file, index) => {
        formData.append('file' + index, file)
      })

       axios
         .post(urls.Report, formData, {
           headers: {
             Authorization: 'Bearer ' + this.props.user,
             'content-type': 'multipart/form-data'
           },
           onUploadProgress: (progressEvent) => {
             let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
             this.setState({ percentCompleted })
             console.log('i am progress', percentCompleted)
             if (percentCompleted === 100) {
               this.setState({ percentCompleted: 0 })
             }
           }
         })
         .then(res => {
           if (res.status === 200 || res.status === 201) {
             this.props.alert.success('Report Added Successfully')
           }
           this.setState({
             disableButton: false,
             recap: '',
             classWork: '',
             summary: '',
             supportMaterials: '',
             homeWork: ''
           })
         })
         .catch(error => {
           this.props.alert.error('Error Occured')
           console.log(error)
           this.props.alert.error(error.response.data)
         })
     }

     getLessonPlan (selectedData) {
       axios
         .get(urls.TeacherReportLessonPlanMicroSchedule, {
           params: selectedData,
           headers: {
             Authorization: 'Bearer ' + this.props.user
           }
         })
         .then(res => {
           if (res.status === 200) {
             if (typeof (res.data) !== 'string') {
               this.setState({
                 lessonData: res.data.lesson_plan,
                 microData: res.data.micro_scheduleP
               })
             }
           } else if (res.status === 204) {
           // this.props.alert.error('Microschdeule data not found')
           } else {
             this.props.alert.error('Error Occured')
           }
         })
         .catch(error => {
           console.log(error)
           if (error.response && error.response.status !== 500) {
             this.props.alert.error(String(error.response))
           } else {
             this.props.alert.error('Unable to get microshedule and lesson plan data')
           }
         })
     }

     getMicroItems (id, seq) {
       axios
         .get(urls.TeacherReportLessonPlanMicroSchedule + '?micro_id=' + id + '&seq_no=' + seq, {
           headers: {
             Authorization: 'Bearer ' + this.props.user
           }
         })
         .then(res => {
           if (res.status === 200) {
             if (typeof (res.data) !== 'string') {
               this.setState({ microData: res.data.micro_schedule })
             }
           } else if (res.status === 204) {
             this.props.alert.error('Microschdeule data not found')
           } else {
             this.props.alert.error('Error Occured')
           }
         })
         .catch(error => {
           console.log(error)
           if (error.response && error.response.status !== 500) {
             this.props.alert.error(String(error.response))
           } else {
             this.props.alert.error('Unable to get microshedule data')
           }
         })
     }

     getLessonItems (id, seq) {
       axios
         .get(urls.TeacherReportLessonPlanMicroSchedule + '?lesson_id=' + id + '&seq_no=' + seq, {
           headers: {
             Authorization: 'Bearer ' + this.props.user
           }
         })
         .then(res => {
           if (res.status === 200) {
             if (typeof (res.data) !== 'string') {
               this.setState({ lessonData: res.data.lesson_plan })
             }
           } else if (res.status === 204) {
             this.props.alert.error('Lesson plan data not found')
           } else {
             this.props.alert.error('Error Occured')
           }
         })
         .catch(error => {
           console.log(error)
           if (error.response && error.response.status !== 500) {
             this.props.alert.error(String(error.response))
           } else {
             this.props.alert.error('Unable to get lesson plan data')
           }
         })
     }

     isValidItem = (item, selectedItem) => {
       // eslint-disable-next-line no-debugger
       //  const { branch_id, grade_id, section_id, subject_id } = item
       //  debugger
       let arr = selectedItem.value.split('/').map(Number)
       let branchId = arr[0]
       let gradeId = arr[1]
       let sectionId = arr[2]
       let subjectId = arr[3]
       if (branchId === item.branch_id && gradeId === item.grade_id && sectionId === item.section_id && subjectId === item.subject_id) {
         return true
       }
     }

     getData = (e) => {
       this.setState({ [e.target.name]: e.target.value })
     }

     render () {
       const { classes } = this.props
       let { lessonData, microData, classWorkError, recapError, summaryError, supportMaterialsError, homeWorkError, recap, classWork, summary, supportMaterials, homeWork } = this.state
       console.log(this.state.grade_section_subject)
       const files =
      this.state.files &&
      this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
       return (
         <React.Fragment>
           {this.state.grade_section_subject
             ? <Grid>
               {window.isMobile && <Grid.Row style={{ marginLeft: 20, maxWidth: 'calc(100vw - 40px)', zIndex: 1200 }}>
                 <OmsSelect change={(option) => this.handleItemClick(this.state.grade_section_subject.findIndex(i => this.isValidItem(i, option)), option)} options={Array.isArray(this.state.grade_section_subject) &&
                    this.state.grade_section_subject.map((mapping, index) => ({
                      value: String(mapping.branch_id) + '/' + String(mapping.grade_id) + '/' + String(mapping.section_id) + '/' + String(mapping.subject_id),
                      label: String(mapping.grade_name) + '/' + String(mapping.section_name) + '/' + String(mapping.subject_name)
                    }))} />
               </Grid.Row>}
               <Grid.Row>
                 {!window.isMobile && <Grid.Column width={!window.isMobile ? 3 : 4}>
                   <Menu
                     fluid
                     vertical
                     pointing
                     secondary
                     attached={false}
                     color={'red'}
                   >
                     {Array.isArray(this.state.grade_section_subject) &&
                    this.state.grade_section_subject.map((mapping, index) => (
                      <Menu.Item
                        name={
                          String(mapping.grade_name) +
                          '/' +
                          String(mapping.section_name) +
                          '/' +
                          String(mapping.subject_name)
                        }
                        value={
                          String(mapping.branch_id) +
                          '/' +
                          String(mapping.grade_id) +
                          '/' +
                          String(mapping.section_id) +
                          '/' +
                          String(mapping.subject_id)
                        }
                        active={this.state.activeItem === index}
                        onClick={() => this.handleItemClick(index)}
                      />
                    ))}
                   </Menu>
                 </Grid.Column>}

                 <Grid.Column style={{ marginLeft: window.isMobile ? 20 : 0 }} width={!window.isMobile ? 3 : 14}>
                   <Grid.Row>
                     <OmsSelect
                       placeholder='Select Chapter *'
                       fluid
                       search
                       selection
                       options={
                         this.props.grades
                           ? this.props.grades.map(grades => ({
                             value: grades.id,
                             label: grades.grade
                           }))
                           : null
                       }
                       change={this.handleClickChapters}
                     />
                   </Grid.Row>
                   <Grid.Row>
                     <ProfanityFilter isMultiline name='recap' onChange={this.getData} label='Recap of Previous Class' value={recap} />
                     {recapError && (
                       <Typography style={{ color: 'red' }}>Add recap of previous class</Typography>
                     )}<br /><br />
                   </Grid.Row>
                   <Grid.Row>
                     <ProfanityFilter isMultiline name='classWork' onChange={this.getData} label='Details of classwork' value={classWork} />
                     {classWorkError && (
                       <Typography style={{ color: 'red' }}>Add Details of classWork</Typography>
                     )}<br /><br />
                   </Grid.Row>
                   <Grid.Row>
                     <ProfanityFilter isMultiline name='summary' onChange={this.getData} label='End Summary Check' value={summary} />
                     {summaryError && (
                       <Typography style={{ color: 'red' }}>Add summary</Typography>
                     )}<br /><br />
                   </Grid.Row>
                   <Grid.Row>
                     <ProfanityFilter isMultiline name='supportMaterials' onChange={this.getData} label='Experiments/demos/videos any other tools used' value={supportMaterials} />
                     {supportMaterialsError && (
                       <Typography style={{ color: 'red' }}>Add supportMaterials</Typography>
                     )}<br /><br />
                   </Grid.Row>
                   <Grid.Row>
                     <ProfanityFilter isMultiline name='homeWork' onChange={this.getData} label='Homework Given' value={homeWork} />
                     {homeWorkError && (
                       <Typography style={{ color: 'red' }}>Add homeWork</Typography>
                     )}<br /><br />
                   </Grid.Row>
                   <Grid.Row>
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
                               {!isDragActive && 'Please attach any videos / images / documents you want to attach. '}
                             </div>
                             {files}
                           </CardContent>
                         </Card>
                       )}
                     </Dropzone>
                   </Grid.Row>
                   {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted > 0 && this.state.percentCompleted}
                   <br />
                   <Grid.Row>
                     {/* on submit of this button report should get added */}
                     <Button
                       variant='contained'
                       color='primary'
                       onClick={this.handleSubmit}
                       disabled={this.state.disableButton}
                     >
                    Add Report
                     </Button>
                   </Grid.Row>
                 </Grid.Column>
                 { !window.isMobile && <Grid.Column width={4}>
                   <div className={classes.root}>
                     <ExpansionPanel>
                       <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                         <div className={classes.column}>
                           <Typography className={classes.heading}>LessonPlan</Typography>
                         </div>
                       </ExpansionPanelSummary>
                       {lessonData
                         ? <div>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Lesson Outcome
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.lesson_outcome}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Set Introduction
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.set_introduction}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Content Strategy
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.content_strategy}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Activity
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.activity}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Winding Up
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.winding_up}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              ClassWork
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.class_work}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              HomeWork
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.home_work}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Done
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {lessonData.is_done ? 'Yes' : 'No'}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <Divider />
                           <ExpansionPanelActions>
                             <Button
                               size='small'
                               onClick={e => this.getLessonItems(
                                 lessonData.lesson_plan,
                                 lessonData.class_sequence_no - 1
                               )}
                             >
                            Previous
                             </Button>
                             <Button
                               size='small'
                               onClick={e => this.getLessonItems(
                                 lessonData.lesson_plan,
                                 lessonData.class_sequence_no + 1

                               )}

                             >
                            Next
                             </Button>
                           </ExpansionPanelActions>
                         </div>
                         : <div style={{ padding: '3px' }}>No Lesson plan data available</div>}
                     </ExpansionPanel>
                   </div>
                 </Grid.Column>}
                 { !window.isMobile && <Grid.Column width={4}>
                   <div className={classes.root}>
                     <ExpansionPanel>
                       <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                         <div className={classes.column}>
                           <Typography className={classes.heading}>Microschedule</Typography>
                         </div>
                       </ExpansionPanelSummary>
                       {microData
                         ? <div>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                            ClassWork Details
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.cw_details}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              End Summary
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.end_summary}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Experiments
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.exp_demo}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Home Work
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.homework}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Document
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.document.map(doc => {
                                   return (
                                     <a href={doc.media_file} target='_blank' className={classes.link}>
                                       {doc.file_name.split('/')[doc.file_name.split('/').length - 1]}
                                     </a>
                                   )
                                 })}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <ExpansionPanelDetails className={classes.details}>
                             <div className={classes.column}>
                               <Typography variant='caption'>
                              Media
                               </Typography>
                             </div>
                             <div className={classNames(classes.column, classes.helper)}>
                               <Typography variant='caption'>
                                 {microData.media.map(doc => {
                                   return (
                                     <a href={doc.media_file} target='_blank' className={classes.link}>
                                       {doc.file_name.split('/')[doc.file_name.split('/').length - 1]}
                                     </a>
                                   )
                                 })}
                               </Typography>
                             </div>
                           </ExpansionPanelDetails>
                           <Divider />
                           <ExpansionPanelActions>
                             <Button
                               size='small'
                               onClick={e => this.getMicroItems(
                                 microData.ms,
                                 microData.sequence_no - 1
                               )}
                             >
                            Previous
                             </Button>
                             <Button
                               size='small'
                               onClick={e => this.getMicroItems(
                                 microData.ms,
                                 microData.sequence_no + 1
                               )}
                             >
                            Next
                             </Button>
                           </ExpansionPanelActions>
                         </div>
                         : <div style={{ padding: '3px' }}>No Microschedule data available</div> }
                     </ExpansionPanel>
                   </div>
                 </Grid.Column>}
               </Grid.Row>
             </Grid>
             : <h3 style={{ padding: '10px' }}>No Mapping Assigned</h3>}
         </React.Fragment>
       )
     }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

AddTeacherReport.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddTeacherReport))
