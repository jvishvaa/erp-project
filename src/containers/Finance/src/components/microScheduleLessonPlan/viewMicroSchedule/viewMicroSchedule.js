import React, { Component } from 'react'
import { Grid, Form, Input } from 'semantic-ui-react'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles, Button, Table, TableHead, TableBody, TableRow,
  TableCell } from '@material-ui/core/'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'
import { apiActions } from '../../../_actions'

var addRowData = []
var newData = []
var updatedId = []
var formData = new FormData()
var newFormData = new FormData()

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
})

class ViewMicroSchedule extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: 'view',
      updated: false,
      added: false
    }
    this.handleMode = this.handleMode.bind(this)
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.handleSubjectChange = this.handleSubjectChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeHandlerFile = this.onChangeHandlerFile.bind(this)
    this.handleAddContent = this.handleAddContent.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    this.mappindDetails = this.userProfile.academic_profile
    console.log(this.mappindDetails, 'mappp')
    if (this.mappindDetails.length === 0) {
      console.log('errrrrr')
      this.props.alert.error('No mapping has been assigned')
    } else if (this.userProfile.academic_profile.length > 0) {
      this.mappindDetails = this.userProfile.academic_profile
      let branchData = []
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true) // set any value to Map
          branchData.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }

      this.setState({ branchData: branchData })
      if (this.role === 'Teacher') {
        this.handleBranchChange(branchData[0])
        this.setState({ valueBranch: branchData })
      }
    } else {
      this.props.alert.error('No mapping has been assigned')
    }
  }
  handleMode (event, mode) {
    this.setState({ mode })
  }

  handleBranchChange (event) {
    this.setState({
      branch: event.value,
      valueBranch: event,
      subjectData: [],
      gradeData: [],
      valueGrade: [],
      sectionData: [],
      valueSection: [],
      valueSubject: []
    })
    let gradeData = []; let map = new Map()
    for (const item of this.mappindDetails) {
      if (!map.has(item.grade_id) && item.branch_id === event.value) {
        map.set(item.grade_id, true) // set any value to Map
        gradeData.push({
          value: item.grade_id,
          label: item.grade_name
        })
      }
    }
    this.setState({ gradeData: gradeData })
  }

  handleGradeChange (event) {
    this.setState({
      grade: event.value,
      valueGrade: event,
      valueSection: [],
      valueSubject: []
    })
    let subjectData = []
    let sectionData = []
    let map = new Map()
    if (this.role === 'Teacher') {
      for (const item of this.mappindDetails) {
        if (
          !map.has(item.section_id) &&
          item.grade_id === event.value &&
          item.branch_id === this.state.branch
        ) {
          map.set(item.section_id, true) // set any value to Map
          sectionData.push({
            value: item.section_id,
            label: item.section_name
          })
        }
      }
    } else if (this.role === 'Planner' || this.role === 'Subjecthead') {
      sectionData = this.props.sections.map(section => ({
        value: section.id,
        label: section.section_name
      }))
    }
    for (const item of this.mappindDetails) {
      if (
        !map.has(item.subject_id) &&
        item.grade_id === event.value &&
        item.branch_id === this.state.branch
      ) {
        map.set(item.subject_id, true) // set any value to Map
        subjectData.push({
          value: item.subject_id,
          label: item.subject_name
        })
      }
    }
    this.setState({ subjectData: subjectData, sectionData: sectionData })
  }

  handleSubjectChange (event) {
    this.setState({ subject: event.value })
  }

  onSubmit () {
    this.validation()
    let { branch, grade, subject } = this.state
    if (branch && grade && subject) {
      axios
        .get(`${urls.MicroSchedule}?branch_id=${branch}&grade_id=${grade}&subject_id=${subject}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({ microScheduleData: res.data })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  onChangeHandler (id, event) {
    if (!updatedId.includes(id)) {
      updatedId.push(id)
    }
    let prevdata = this.state.microScheduleData
    prevdata.forEach(function (data) {
      if (data.id === id) {
        data[event.target.name] = event.target.value
      }
    })
    this.setState({ microScheduleData: prevdata, updated: true })
  }

  onChangeHandlerFile (id, event) {
    if (!updatedId.includes(id)) {
      updatedId.push(id)
    }
    let prevdata = this.state.microScheduleData
    prevdata.forEach(function (data) {
      if (data.id === id) {
        let name = event.target.name + data.sequence_no
        formData.set(name, event.target.files[0])
      }
    })
    this.setState({ updated: true })
  }

  handleAdd = () => {
    let rowNumber = addRowData.length + this.state.microScheduleData.length + 1
    let content = {
      detailsClasswork: <Input type='text' name='cw_details' onChange={e => this.handleAddContent(e, rowNumber)} />,
      summary: <Input type='text' name='end_summary' onChange={e => this.handleAddContent(e, rowNumber)} />,
      expgiven: <Input type='text' name='exp_demo' onChange={e => this.handleAddContent(e, rowNumber)} />,
      homework: <Input type='text' name='homework' onChange={e => this.handleAddContent(e, rowNumber)} />,
      videos: <Input type='file' name='media' onChange={e => this.handleFileUpload(e, rowNumber)} />,
      pdf: <Input type='file' name='doc' onChange={e => this.handleFileUpload(e, rowNumber)} />
    }
    addRowData.push(content)
    this.setState({ newRow: addRowData })
  }

  handleRemove = () => {
    let arrayIndex = addRowData.length - 1
    newData.splice(arrayIndex)
    if (newData.length === 0) {
      this.setState({ added: false })
    }
    addRowData.pop()
    this.setState({ newRow: addRowData })
  }

  handleAddContent = (event, num) => {
    if (!newData[num]) {
      newData[num] = { 'sequence_no': num }
    }
    newData[num][event.target.name] = event.target.value
    this.setState({ newData: newData, added: true })
  }

  handleFileUpload = (event, num) => {
    let name = event.target.name + num
    newFormData.append(name, event.target.files[0])
    this.setState({ added: true })
  }

  handleUpdate = () => {
    var error = false
    var microData = []
    let { branch, grade, subject, newData, added, updated, microScheduleData } = this.state
    if (!(this.validation())) { return false }
    if (added) {
      newFormData.set('branch_id', branch)
      newFormData.set('grade_id', grade)
      newFormData.set('subject_id', subject)
      for (var i = microScheduleData.length + 1; i < newData.length; i++) {
        microData.push(newData[i])
        if (Object.keys(newData[i]).length < 5) {
          this.props.alert.error('Fill all the data')
          error = true
        } else {
          let doc = 'doc' + i
          let med = 'media' + i
          if (!(newFormData.has(doc) && newFormData.has(med))) {
            this.props.alert.error('Upload all files')
            error = true
          }
        }
      }
      newFormData.set('micro_schedule_details', JSON.stringify(microData))
      if (error) { return false }
      axios
        .post(urls.MicroSchedule, newFormData, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }
        })
        .then((res) => {
          if (res.status === 201) {
            this.props.alert.success('Added Microschedule Successfully')
            newFormData = new FormData()
            addRowData = []
            newData = []
            let msData = this.state.microScheduleData ? this.state.microScheduleData : []
            console.log(msData)
            res.data.forEach(data => {
              msData.push(data[0])
            })
            this.setState(state => ({
              microScheduleData: msData,
              newData: [],
              newRow: [],
              added: false
            }))
          } else {
            this.props.alert.error('res.data')
          }
        })
        .catch((error) => {
          console.log(error.response)
          this.props.alert.error(error.toString())
        })
    }
    if (updated) {
      let microData = this.state.microScheduleData
      let microschedule = []
      formData.set('branch_id', branch)
      formData.set('grade_id', grade)
      formData.set('subject_id', subject)
      formData.set('micro_schedule_id', microData[0].ms)
      updatedId.forEach(id => {
        let obj = microData.filter(data => data.id === id)[0]
        if (!(formData.has('doc' + obj.sequence_no) && formData.has('media' + obj.sequence_no))) {
          this.props.alert.error('Upload all files')
          error = true
          return false
        }
        obj['microschedule_item_id'] = obj.id
        delete obj.document
        delete obj.media
        delete obj.ms
        microschedule.push(obj)
      })
      formData.set('micro_schedule_details', JSON.stringify(microschedule))
      if (error) { return false }
      axios
        .put(urls.MicroSchedule, formData, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }
        })
        .then((res) => {
          if (res.status === 200) {
            this.props.alert.success('Updated Micro schedule Successfully')
            formData = new FormData()
            let microData = this.state.microScheduleData
            res.data[0].ms_item.forEach(data => {
              let index = microData.findIndex(
                micro => micro.id === data.id
              )
              microData.splice(index, 1, data)
            })
            this.setState(state => ({
              microScheduleData: microData,
              updated: false
            }))
            updatedId = []
          } else {
            // this.props.alert.error('Error Occured')
            this.props.alert.error(JSON.stringify(res.data))
          }
        })
        .catch((error) => {
          console.log(error.response)
          this.props.alert.error(error.response)
          // this.props.alert.error('Error Occured')
        })
    }
  }

  validation () {
    let { branch, grade, subject } = this.state
    if (!branch) {
      this.props.alert.error('Select Branch')
      return false
    } else if (!grade) {
      this.props.alert.error('Select Grade')
      return false
    } else if (!subject) {
      this.props.alert.error('Select Subject')
      return false
    } else {
      return true
    }
  }

  render () {
    let { mode, microScheduleData, branchData, subjectData, gradeData, newRow, valueBranch,
      valueGrade } = this.state
    console.log(branchData, 'branc')
    let { classes } = this.props
    return (
      <React.Fragment>
        {this.role !== 'Teacher'
          ? <Grid>
            <Grid.Row>
              <Grid.Column computer={3} style={{ display: 'flex', margin: 'auto' }}>
                <ToggleButtonGroup
                  value={mode}
                  onChange={this.handleMode}
                  exclusive style={{ width: '125px' }}
                >
                  <ToggleButton value='view'> View </ToggleButton>
                  <ToggleButton value='edit'> Edit </ToggleButton>
                </ToggleButtonGroup>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          : ''
        }
        <Form style={{ padding: '50px' }}>
          <Form.Group>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }} >Branch*</label>
              <OmsSelect
                placeholder='Select Branch'
                name='branch'
                change={this.handleBranchChange}
                options={branchData}
                disabled={this.role === 'Teacher'}
                defaultValue={valueBranch}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }} >Grade*</label>
              <OmsSelect
                placeholder='Select Grade'
                change={this.handleGradeChange}
                options={gradeData}
                defaultValue={valueGrade}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label style={{ display: 'inline-block' }} >Subject*</label>
              <OmsSelect
                placeholder='Select Subject'
                change={this.handleSubjectChange}
                options={subjectData}
              />
            </Form.Field>
            <Form.Field width={3} className='student-section-viewCalendar-Button'>
              <Button onClick={this.onSubmit}>Get Schedule</Button>
            </Form.Field>
          </Form.Group>
        </Form>
        {microScheduleData &&
        <React.Fragment>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.</TableCell>
                  <TableCell>Details of classwork done</TableCell>
                  <TableCell>End Summary check</TableCell>
                  <TableCell>Experiments/demos/videos any other tools used</TableCell>
                  <TableCell>Homework Given</TableCell>
                  <TableCell>Videos</TableCell>
                  <TableCell>PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mode === 'view'
                  ? microScheduleData.length > 0
                    ? microScheduleData.map((row, index) => {
                      return (
                        <TableRow>
                          <TableCell>{++index}</TableCell>
                          <TableCell>{row.cw_details}</TableCell>
                          <TableCell>{row.end_summary}</TableCell>
                          <TableCell>{row.exp_demo}</TableCell>
                          <TableCell>{row.homework}</TableCell>
                          <TableCell><a href={row.media.length > 0 ? row.media[0].media_file : ''} target='_blank'>{row.media.length > 0 ? row.media[0].file_name : '' } </a></TableCell>
                          <TableCell><a href={row.document.length > 0 ? row.document[0].media_file : ''} target='_blank'>{row.document.length > 0 ? row.document[0].file_name : '' } </a></TableCell>
                        </TableRow>
                      )
                    }) : <TableRow>
                      <TableCell colSpan={8} align='center' >
                        <p> No data to display </p></TableCell>
                    </TableRow>
                  : (microScheduleData ? microScheduleData.map((row, index) => {
                    return (
                      <TableRow>
                        <TableCell>{++index}</TableCell>
                        <TableCell>
                          <Input type='text' value={row.cw_details} name='cw_details' onChange={e => this.onChangeHandler(row.id, e)} />
                        </TableCell>
                        <TableCell>
                          <Input type='text' value={row.end_summary} name='end_summary' onChange={e => this.onChangeHandler(row.id, e)} />
                        </TableCell>
                        <TableCell>
                          <Input type='text' value={row.exp_demo} name='exp_demo' onChange={e => this.onChangeHandler(row.id, e)} />
                        </TableCell>
                        <TableCell>
                          <Input type='text' value={row.homework} name='homework' onChange={e => this.onChangeHandler(row.id, e)} />
                        </TableCell>
                        <TableCell>
                          <Input type='file' name='media' onChange={e => this.onChangeHandlerFile(row.id, e)} />
                        </TableCell>
                        <TableCell>
                          <Input type='file' name='doc' onChange={e => this.onChangeHandlerFile(row.id, e)} />
                        </TableCell>
                      </TableRow>
                    )
                  })
                    : <TableRow>
                      <TableCell colSpan={8} align='center'>
                        <p>No data added yet. Add one.</p>
                      </TableCell>
                    </TableRow>
                  )
                }
                {mode === 'edit' &&
                  newRow ? newRow.map((v, i) => {
                    return (
                      <TableRow>
                        <TableCell>{++i}</TableCell>
                        <TableCell>{v.detailsClasswork}</TableCell>
                        <TableCell>{v.summary}</TableCell>
                        <TableCell>{v.expgiven}</TableCell>
                        <TableCell>{v.homework}</TableCell>
                        <TableCell>{v.videos}</TableCell>
                        <TableCell>{v.pdf}</TableCell>
                      </TableRow>
                    )
                  }) : ''
                }
              </TableBody>
            </Table>
          </div>
          {mode === 'edit' && <div style={{ padding: '20px' }}>
            <Button onClick={this.handleAdd}> ADD </Button>
            <Button onClick={this.handleRemove}> Remove </Button>
            <Button onClick={this.handleUpdate}> Update </Button>
          </div>}
        </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  sections: state.sections.items
})

const mapDispatchToProps = dispatch => ({
  listSection: dispatch(apiActions.listSections())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(ViewMicroSchedule)))
