import React, { Component } from 'react'
import { Grid, Form } from 'semantic-ui-react'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  withStyles,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Input
} from '@material-ui/core/'
import { apiActions } from '../../../_actions'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'

var addRowData = []
var newData = []
var updatedId = []

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
})

class ViewLessonPlan extends Component {
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
    this.onSubmit = this.onSubmit.bind(this)
    this.handleAddContent = this.handleAddContent.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    if (this.userProfile.academic_profile.length > 0) {
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
      if (this.userProfile.personal_info.role === 'Teacher') {
        this.setState({ valueBranch: branchData })
        this.handleBranchChange(branchData[0])
      }
    } else {
      this.props.alert.error('No mapping has been assigned')
    }
  }

  handleMode (event, mode) {
    this.setState({ mode })
  }

  handleBranchChange (e) {
    this.setState({
      branch: e.value,
      valueBranch: e,
      subjectData: [],
      gradeData: [],
      valueGrade: [],
      sectionData: [],
      valueSection: [],
      valueSubject: []
    })
    let gradeData = []
    let subjectData = []
    let sectionData = []
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
    this.setState({ gradeData: gradeData, sectionData: sectionData, subjectData: subjectData })
  }

  handleGradeChange (e) {
    this.setState({ grade: e.value, valueGrade: e, valueSection: [], valueSubject: [] })
    let subjectData = []
    let sectionData = []
    let map = new Map()
    if (this.userProfile.personal_info.role === 'Teacher') {
      for (const item of this.mappindDetails) {
        if (
          !map.has(item.section_id) &&
          item.grade_id === e.value &&
          item.branch_id === this.state.branch
        ) {
          map.set(item.section_id, true) // set any value to Map
          sectionData.push({
            value: item.section_id,
            label: item.section_name
          })
        }
      }
    } else if (this.userProfile.personal_info.role === 'Planner' || this.userProfile.personal_info.role === 'Subjecthead') {
      sectionData = this.props.sections.map(section => ({
        value: section.id,
        label: section.section_name
      }))
    }
    for (const item of this.mappindDetails) {
      if (
        !map.has(item.subject_id) &&
        item.grade_id === e.value &&
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

  onSubmit () {
    let { branch, grade, subject, section } = this.state
    if (!branch) {
      this.props.alert.error('Select Branch')
      return false
    } else if (!grade) {
      this.props.alert.error('Select Grade')
      return false
    } else if (!section) {
      this.props.alert.error('Select Section')
      return false
    } else if (!subject) {
      this.props.alert.error('Select Subject')
      return false
    }
    axios
      .get(
        `${
          urls.LessonPlan
        }?branch_id=${branch}&grade_id=${grade}&subject_id=${subject}&section_id=${section}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            lessonPlan: res.data.lesson_plan,
            lessonPlanData: res.data.lesson_plan_item
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(res => {
        this.props.alert.error('Error Occured')
      })
  }

  onChangeHandler (id, event) {
    if (!updatedId.includes(id)) {
      updatedId.push(id)
    }
    let prevdata = this.state.lessonPlanData
    prevdata.forEach(function (data) {
      if (data.id === id) {
        data[event.target.name] = event.target.value
      }
    })
    this.setState({ lessonPlanData: prevdata, updated: true })
  }

  handleAdd = () => {
    let rowNumber = addRowData.length
    let content = {
      lesson_outcome: (
        <Input
          type='text'
          name='lesson_outcome'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      set_introduction: (
        <Input
          type='text'
          name='set_introduction'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      content_strategy: (
        <Input
          type='text'
          name='content_strategy'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      activity: (
        <Input
          type='text'
          name='activity'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      winding_up: (
        <Input
          type='text'
          name='winding_up'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      class_work: (
        <Input
          type='text'
          name='class_work'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      ),
      home_work: (
        <Input
          type='text'
          name='home_work'
          onChange={e => this.handleAddContent(rowNumber, e)}
          style={{ width: '15rem' }}
        />
      )
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

  handleAddContent = (num, event) => {
    if (newData[num]) {
      newData[num][event.target.name] = event.target.value
    } else {
      newData.splice(num, 0, { [event.target.name]: event.target.value })
    }
    this.setState({ newData: newData, added: true })
  }

  handleUpdate = () => {
    let {
      branch,
      grade,
      subject,
      section,
      newData,
      added,
      updated,
      lessonPlan
    } = this.state
    var lessonData = this.state.lessonPlanData
    var data = {}
    var error = false
    newData &&
      newData.forEach(data => {
        if (Object.keys(data).length < 7) {
          this.props.alert.error('Fill all the data')
          error = true
        } else {
          data['lesson_plan'] = lessonPlan.id
        }
      })
    if (error) return false
    if (updated && added) {
      let length = this.state.lessonPlanData.length
      newData.forEach(lesson => {
        lesson['class_sequence_no'] = length + 1
        length++
      })
      updatedId.forEach(function (id) {
        let obj = lessonData.filter(data => data.id === id)
        newData.push(obj[0])
      })
      data = { item_data: newData }
    } else if (updated) {
      let aLesson = []
      updatedId.forEach(function (id) {
        let obj = lessonData.filter(data => data.id === id)
        aLesson.push(obj[0])
      })
      data = { item_data: aLesson }
    } else if (added) {
      let length = this.state.lessonPlanData.length
      newData.forEach(lesson => {
        lesson['class_sequence_no'] = length + 1
        length++
      })
      data = { item_data: newData }
    }
    if (added || updated) {
      axios
        .post(
          `${
            urls.LessonPlan
          }?branch_id=${branch}&grade_id=${grade}&subject_id=${subject}&section_id=${section}`,
          data,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }
        )
        .then(res => {
          if (res.status === 201) {
            this.props.alert.success('Added Lesson Plan Successfully')
            this.setState({
              newData: [],
              newRow: [],
              updated: false,
              added: false
            })
            updatedId = []
            addRowData = []
            if (res.data.posted_item) {
              let lessonPlanData = this.state.lessonPlanData ? this.state.lessonPlanData : []
              res.data.posted_item[0].forEach(function (data) {
                lessonPlanData.push(data)
              })
              this.setState((state, props) => ({
                lessonPlanData: lessonPlanData
              }))
            }
            if (res.data.updated_item) {
              let lessonPlanData = this.state.lessonPlanData
              res.data.updated_item.forEach(function (data) {
                let index = lessonPlanData.findIndex(
                  plan => plan.id === data.id
                )
                lessonPlanData.splice(index, 1, data)
              })
              this.setState((state, props) => ({
                lessonPlanData: lessonPlanData
              }))
            }
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }

  render () {
    let { mode, lessonPlan, lessonPlanData, branchData, subjectData, gradeData, sectionData,
      newRow, valueBranch } = this.state
    let { classes } = this.props
    return (
      <React.Fragment>
        <div >
          {this.userProfile.personal_info.role === 'Teacher' ? (
            <Grid>
              <Grid.Row>
                <Grid.Column
                  computer={3}
                  style={{ display: 'flex', margin: 'auto' }}
                >
                  <ToggleButtonGroup
                    value={mode}
                    onChange={this.handleMode}
                    exclusive
                    style={{ width: '125px' }}
                  >
                    <ToggleButton value='view'> View </ToggleButton>
                    <ToggleButton value='edit'> Edit </ToggleButton>
                  </ToggleButtonGroup>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ) : (
            ''
          )}
          <Form style={{ padding: '50px' }}>
            <Form.Group>
              <Form.Field width={4}>
                <label style={{ display: 'inline-block' }}>Branch*</label>
                <OmsSelect
                  defaultValue={valueBranch}
                  placeholder='Select Branch'
                  name='branch'
                  change={this.handleBranchChange}
                  options={branchData}
                  disabled={this.userProfile.personal_info.role === 'Teacher'}
                />
              </Form.Field>

              <Form.Field width={4}>
                <label style={{ display: 'inline-block' }}>Grade*</label>
                <OmsSelect
                  placeholder='Select Grade'
                  change={this.handleGradeChange}
                  options={gradeData}
                  defaultValue={this.state.valueGrade}
                />
              </Form.Field>
              <Form.Field width={4}>
                <label style={{ display: 'inline-block' }}>Section*</label>
                <OmsSelect
                  defaultValue={this.state.valueSection}
                  placeholder='Select Section'
                  change={(e) =>
                    this.setState({ section: e.value, valueSection: e, valueSubject: [] })
                  }
                  options={sectionData}
                />
              </Form.Field>
              <Form.Field width={4}>
                <label style={{ display: 'inline-block' }}>Subject*</label>
                <OmsSelect
                  defaultValue={this.state.valueSubject}
                  placeholder='Select Subject'
                  change={(e) =>
                    this.setState({ subject: e.value, valueSubject: e })
                  }
                  options={subjectData}
                />
              </Form.Field>
              <Form.Field
                width={3}
                className='student-section-viewCalendar-Button'
              >
                <Button onClick={this.onSubmit}>Get Lesson Plan</Button>
              </Form.Field>
            </Form.Group>
          </Form>
          {lessonPlan && (
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Sr.</TableCell>
                      <TableCell align='center'>Learning Outcome</TableCell>
                      <TableCell align='center'>Set Induction</TableCell>
                      <TableCell align='center'>Content Strategy</TableCell>
                      <TableCell align='center'>Activity</TableCell>
                      <TableCell align='center'>Winding Up</TableCell>
                      <TableCell align='center'>Class Work</TableCell>
                      <TableCell align='center'>Home Work</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mode === 'view' ? (
                      lessonPlanData ? (
                        lessonPlanData.map((row, index) => {
                          return (
                            <TableRow>
                              <TableCell>{++index}</TableCell>
                              <TableCell>{row.lesson_outcome}</TableCell>
                              <TableCell>{row.set_introduction}</TableCell>
                              <TableCell>{row.content_strategy}</TableCell>
                              <TableCell>{row.activity}</TableCell>
                              <TableCell>{row.winding_up}</TableCell>
                              <TableCell>{row.class_work}</TableCell>
                              <TableCell>{row.home_work}</TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align='center'>
                            <p> No data to display </p>
                          </TableCell>
                        </TableRow>
                      )
                    ) : lessonPlanData ? (
                      lessonPlanData.map((row, index) => {
                        return (
                          <TableRow>
                            <TableCell align='center'>
                              {++index}
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.lesson_outcome}
                                name='lesson_outcome'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.set_introduction}
                                name='set_introduction'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.content_strategy}
                                name='content_strategy'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.activity}
                                name='activity'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.winding_up}
                                name='winding_up'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.class_work}
                                name='class_work'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                            <TableCell align='center'>
                              <Input
                                type='text'
                                value={row.home_work}
                                name='home_work'
                                onChange={e => this.onChangeHandler(row.id, e)}
                                style={{ width: '15rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align='center'>
                          <p>No data added yet. Add one.</p>
                        </TableCell>
                      </TableRow>
                    )}
                    {mode === 'edit' && newRow
                      ? newRow.map((v, i) => {
                        return (
                          <TableRow>
                            <TableCell align='center'>{++i}</TableCell>
                            <TableCell align='center'>{v.lesson_outcome}</TableCell>
                            <TableCell align='center'>{v.set_introduction}</TableCell>
                            <TableCell align='center'>{v.content_strategy}</TableCell>
                            <TableCell align='center'>{v.activity}</TableCell>
                            <TableCell align='center'>{v.winding_up}</TableCell>
                            <TableCell align='center'>{v.class_work}</TableCell>
                            <TableCell align='center'>{v.home_work}</TableCell>
                          </TableRow>
                        )
                      })
                      : null}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment>
          )}
          {mode === 'edit' && lessonPlan && (
            <div style={{ padding: '20px' }}>
              <Button onClick={this.handleAdd}> ADD </Button>
              <Button onClick={this.handleRemove}> Remove </Button>
              <Button onClick={this.handleUpdate}> Update </Button>
            </div>
          )}
        </div>
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
)(withRouter(withStyles(styles)(ViewLessonPlan)))
