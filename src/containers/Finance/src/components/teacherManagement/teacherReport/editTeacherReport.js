import React from 'react'
import {
// Segment,
// Form,
// TextArea,
// Icon,
// Label,

} from 'semantic-ui-react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dropzone from 'react-dropzone'
import Typography from '@material-ui/core/Typography'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import classNames from 'classnames'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withRouter } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
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
const VerticalTabs = withStyles(theme => ({
  flexContainer: {
    flexDirection: 'column'
  },
  indicator: {
    display: 'none'
  }
}))(Tabs)
const MyTab = withStyles(theme => ({
  selected: {
    color: 'tomato',
    borderRight: '2px solid tomato'
  }
}))(Tab)
class EditTeacherReport extends React.Component {
  constructor () {
    super()
    this.state = {
      reportId: null,
      disabledButton: false,
      recap: '',
      classWork: '',
      homeWork: '',
      summary: '',
      supportMaterials: '',
      chaptersId: '',
      GetchapterId: '',
      GetchapterName: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.getLessonItems = this.getLessonItems.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.getChapters = this.getChapters.bind(this)
  }

  componentDidMount () {
    // make an axios call with the reportId and get all the details
    this.setState({ reportId: this.props.match.params.id })
    var reportId = this.props.match.params.id
    axios
      .get(urls.Report + '?report_id=' + reportId + '&deleted=False', {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'content-type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data.reports, 'reports', response.data.reports[0].recap)
        // // eslint-disable-next-line no-debugger
        // debugger
        this.setState({ recap: response.data.reports[0].recap,
          classWork: response.data.reports[0].classswork,
          homeWork: response.data.reports[0].homework,
          supportMaterials: response.data.reports[0].support_materials,
          summary: response.data.reports[0].summary,
          reportId: response.data.reports[0].id,
          media: response.data.reports[0].media,
          GetchapterId: response.data.reports[0].chapter && response.data.reports[0].chapter.id,
          GetchapterName: response.data.reports[0].chapter && { value: response.data.reports[0].chapter.id, label: response.data.reports[0].chapter.chapter_name }
        })
        this.getChapters(response.data.reports[0].branch_grade.grade, response.data.reports[0].subjectmapping.subject)
      })
      .catch(error => {
        console.log(error)
        this.props.alert.warning('No daily diary reports found for the selected data')
      })
  }

  handleSubmit = e => {
    this.setState({ disabledButton: true })
    var formData = new FormData()
    formData.append('recap', this.state.recap)
    formData.append('summary', this.state.summary)
    formData.append('classwork', this.state.classWork)
    formData.append('homework', this.state.homeWork)
    formData.append('support_materials', this.state.supportMaterials)
    formData.append('report_id', this.state.reportId)
    formData.append('chapter_id', this.state.GetchapterId || '')
    this.state.files &&
    this.state.files.forEach((file, index) => {
      formData.append('file' + index, file)
    })

    axios
      .put(urls.Report, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'content-type': 'multipart/form-data'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Report Updated Successfully')
        }
        this.setState({ disabledButton: false })
      })
      .catch(error => {
        console.log(error)
      })
  }
  getData = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
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

  onDrop (files) {
    this.state.files
      ? this.setState({
        files: [...this.state.files, ...files]
      })
      : this.setState({ files: files })
  }
  getChapters = (gradeId, subjectId) => {
    axios.get(`${urls.Chapter}?subject_id=${subjectId}&grade_id=${gradeId}&is_academic=True`)
      .then(res => {
        console.log(res.data.length)
        console.log(res.data)
        if (typeof res.data === 'object' && res.data.length) {
          this.setState({ chaptersId: res.data, hideSelector: true })
        } else if (res.data === 'Chapter Data not found') {
          console.log(res.data)
          this.setState({ chaptersId: '', hideSelector: false })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  handleClickChapters = event => {
    this.setState({ GetchapterId: event.value })
    this.setState({ GetchapterName: event })
  }

  render () {
    console.log(this.state.recap)
    const { classes } = this.props
    let { recapError, lessonData, microData, classWorkError,
      classWork, summaryError, supportMaterialsError, homeWorkError, recap, summary, supportMaterials, homeWork } = this.state
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    let x = true
    if (x) {
      return (
        <Grid container>
          <Grid xs={7} item>
            <Grid container>
              {window.isMobile ? <Grid item>
                <Grid style={{ padding: 8 }} item>
                  <OmsSelect change={(option) => this.handleItemClick(this.state.grade_section_subject.findIndex(i => this.isValidItem(i, option)), option)} options={Array.isArray(this.state.grade_section_subject) &&
                 this.state.grade_section_subject.map((mapping, index) => ({
                   value: String(mapping.branch_id) + '/' + String(mapping.grade_id) + '/' + String(mapping.section_id) + '/' + String(mapping.subject_id),
                   label: String(mapping.grade_name) + '/' + String(mapping.section_name) + '/' + String(mapping.subject_name)
                 }))} />
                </Grid>
                <Grid item>
                  <Grid container style={{ padding: 16 }} spacing={8}>
                    <Grid xs={12} item>
                      {this.state.hideSelector && <OmsSelect
                        placeholder='Selected Chapter '
                        fluid
                        search
                        selection
                        options={
                          this.state.chaptersId
                            ? this.state.chaptersId.map(chap => ({
                              value: chap.id,
                              label: chap.chapter_name
                            }))
                            : null
                        }
                        defaultValue={this.state.GetchapterName}
                        change={this.handleClickChapters}
                      />}
                    </Grid>

                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='recap' onChange={this.getData} label='Recap of Previous Class' value={recap} />
                      {recapError && (
                        <Typography style={{ color: 'red' }}>Add recap of previous class</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='classWork' onChange={this.getData} label='Details of classwork' value={classWork} />
                      {classWorkError && (
                        <Typography style={{ color: 'red' }}>Add Details of classWork</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='summary' onChange={this.getData} label='End Summary Check' value={summary} />
                      {summaryError && (
                        <Typography style={{ color: 'red' }}>Add summary</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='supportMaterials' onChange={this.getData} label='Experiments/demos/videos any other tools used' value={supportMaterials} />
                      {supportMaterialsError && (
                        <Typography style={{ color: 'red' }}>Add supportMaterials</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='homeWork' onChange={this.getData} label='Homework Given' value={homeWork} />
                      {homeWorkError && (
                        <Typography style={{ color: 'red' }}>Add homeWork</Typography>
                      )}
                    </Grid>

                    <Grid xs={12} item>
                      {this.state.media
                        ? this.state.media.length > 0 && this.state.media.map((file, index) => <Button target={'blank'} href={file.media_file}>File {index + 1}</Button>)
                        : 'No File'}
                    </Grid>
                    {/* <Link
                        onClick={() => { this.props.history.push(`/teacher-report/edit/${id}`) }}
                      >click here to view File</Link> */}

                    {/* {
                  id: 'view',
                  Header: 'View Paper',
                  accessor: props => {
                    return (
                      <Link
                        onClick={() => { this.props.history.push(`/questbox/view_questionPaper_detail/${props.id}`) }}
                      >click here to view paper</Link>
                    )
                  }
                }, */}
                    <Grid xs={12} item>
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
                    </Grid>
                    <Grid item>
                      {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted > 0 && this.state.percentCompleted}
                    </Grid>
                    <Grid item>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={this.handleSubmit}
                        disabled={this.state.disableButton}
                      >
                 Update Report
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid> : <Grid container>
                <Grid item xs={2}>
                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    <VerticalTabs
                      value={this.state.activeItem}
                      onChange={this.handleChange}
                    >
                      {Array.isArray(this.state.grade_section_subject) &&
                 this.state.grade_section_subject.map((mapping, index) => (
                   <MyTab onClick={() => this.handleItemClick(index)} label={String(mapping.grade_name) +
             '/' +
             String(mapping.section_name) +
             '/' +
             String(mapping.subject_name)} />))}
                    </VerticalTabs>
                  </div>
                </Grid>
                <Grid item>
                  <Grid container spacing={8}>
                    <Grid xs={12} item>
                      {this.state.hideSelector && <OmsSelect
                        placeholder='Select Chapter'
                        label='Selected Chapter'
                        fluid
                        search
                        selection
                        options={
                          this.state.chaptersId
                            ? this.state.chaptersId.map(chap => ({
                              value: chap.id,
                              label: chap.chapter_name
                            }))
                            : null
                        }
                        defaultValue={this.state.GetchapterName}
                        value={this.state.GetchapterName}
                        change={this.handleClickChapters}
                      />}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='recap' onChange={this.getData} label='Recap of Previous Class' value={recap} />
                      {recapError && (
                        <Typography style={{ color: 'red' }}>Add recap of previous class</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='classWork' onChange={this.getData} label='Details of classwork' value={classWork} />
                      {classWorkError && (
                        <Typography style={{ color: 'red' }}>Add Details of classWork</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='summary' onChange={this.getData} label='End Summary Check' value={summary} />
                      {summaryError && (
                        <Typography style={{ color: 'red' }}>Add summary</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='supportMaterials' onChange={this.getData} label='Experiments/demos/videos any other tools used' value={supportMaterials} />
                      {supportMaterialsError && (
                        <Typography style={{ color: 'red' }}>Add supportMaterials</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      <ProfanityFilter isMultiline name='homeWork' onChange={this.getData} label='Homework Given' value={homeWork} />
                      {homeWorkError && (
                        <Typography style={{ color: 'red' }}>Add homeWork</Typography>
                      )}
                    </Grid>
                    <Grid xs={12} item>
                      {this.state.media
                        ? this.state.media.length > 0 && this.state.media.map((file, index) => <Button target={'blank'} href={file.media_file}>File {index + 1}</Button>)
                        : 'No File'}
                    </Grid>
                    <Grid xs={12} item>
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
                    </Grid>
                    <Grid item>
                      {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted > 0 && this.state.percentCompleted}
                    </Grid>
                    <Grid item>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={this.handleSubmit}
                        disabled={this.state.disableButton}
                      >
                 Update Report
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>}
            </Grid>
          </Grid>
          <Grid xs={5} item>
            <Grid container>
              <Grid item>
                <Grid item>
                  { !window.isMobile && <Grid style={{ padding: 16 }} item>
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
                  </Grid>}
                </Grid>
                <Grid item>
                  { !window.isMobile && <Grid style={{ padding: 16 }} container>
                    <Grid item>
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
                    </Grid>

                  </Grid>}
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      )
      // return (
      //   window.isMobile ? <Grid container>

      //   </Grid>
      // )
    }
    // return (
    //   <React.Fragment>
    //     <Grid>
    //       <Grid.Column stretched width={10}>
    //         <Segment>
    //           <Label>
    //             <Icon name='sync' /> Recap of previous class
    //           </Label>
    //           <br />
    //           <Form>
    //             <TextArea
    //               onChange={e => this.handleChange(e)}
    //               name='recap'
    //               placeholder='Recap of previous class'
    //               value={this.state.recap}
    //             />
    //           </Form>
    //         </Segment>
    //         <Segment>
    //           <Label>
    //             <Icon name='play' /> Details of classwork
    //           </Label>
    //           <br />
    //           <Form>
    //             <TextArea
    //               onChange={e => this.handleChange(e)}
    //               name='classWork'
    //               placeholder='Details of classwork'
    //               value={this.state.classWork}
    //             />
    //           </Form>
    //         </Segment>
    //         <Segment>
    //           <Label>
    //             <Icon name='bullseye' /> End Summary Check
    //           </Label>
    //           <br />
    //           <Form>
    //             <TextArea
    //               onChange={e => this.handleChange(e)}
    //               name='summary'
    //               placeholder='End Summary Check'
    //               value={this.state.summary}
    //             />
    //           </Form>
    //         </Segment>
    //         <Segment>
    //           <Label>
    //             <Icon name='settings' /> Experiments/demos/videos any other
    //               tools used
    //           </Label>
    //           <br />
    //           <Form>
    //             <TextArea
    //               onChange={e => this.handleChange(e)}
    //               name='supportMaterials'
    //               placeholder='Experiments/demos/videos any other tools used'
    //               value={this.state.supportMaterials}
    //             />
    //           </Form>
    //         </Segment>
    //         <Segment>
    //           <Label>
    //             <Icon name='home' /> Homework Given
    //           </Label>
    //           <br />
    //           <Form>
    //             <TextArea
    //               onChange={e => this.handleChange(e)}
    //               name='homeWork'
    //               placeholder='Homework Given'
    //               value={this.state.homeWork}
    //             />
    //           </Form>
    //         </Segment>
    //         {/* on submit of this button report should get added */}
    //         <Button
    //           color='blue'
    //           onClick={this.handleSubmit}
    //           disabled={this.state.disabledButton}
    //         >
    //           Update Report
    //         </Button>
    //       </Grid.Column>
    //       <Grid.Column stretched width={5}>
    //         <Form>
    //           <TextArea placeholder='Microschedule and lesson plan details comes here' />
    //         </Form>
    //       </Grid.Column>
    //     </Grid>
    //   </React.Fragment>
    // )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches())
})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(EditTeacherReport)))
