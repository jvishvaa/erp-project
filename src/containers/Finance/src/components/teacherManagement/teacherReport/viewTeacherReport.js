import React, { Component } from 'react'
import {
  Form,
  Grid

} from 'semantic-ui-react'
import { DateRangePicker } from 'react-date-range'
import { connect } from 'react-redux'
import axios from 'axios'
import { Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import IconButton from '@material-ui/core/IconButton/IconButton'
import HistoryIcon from '@material-ui/icons/History'
import EditIcon from '@material-ui/icons/Edit'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import moment from 'moment'
import { apiActions } from '../../../_actions'
import { urls } from '../../../urls'
import { OmsFilterTable, OmsSelect } from '../../../ui'
import '../../css/staff.css'

const teacherReport = {
  namespace: 'Teacher Report'
}

var tableFields = [
  {
    name: 'date',
    displayName: 'Date'
  },
  {
    name: 'subjectName',
    displayName: 'Subject Name'
  },
  {
    name: 'teacherName',
    displayName: 'Teacher Name'
  },
  {
    name: 'recap_of_prev_class',
    displayName: 'Recap Of Previous Class'
  },
  {
    name: 'details_of_classWork',
    displayName: 'Details Of Class Work'
  },
  {
    name: 'end_summary_check',
    displayName: 'End Summary Check'
  },
  {
    name: 'experiments_demos_videos',
    displayName: 'Experiments/ Demos/ Videos/ Any other tools used'
  },
  {
    name: 'homeworkGiven',
    displayName: 'Homework Given'
  },
  {
    name: 'media_file',
    displayName: 'Media'
  },
  {
    name: 'history',
    displayName: 'History'
  }
]

tableFields.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class GetTeacherReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectionRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
        list: []
      }
    }
    this.deleteHandler = this.deleteHandler.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.changehandlergrade = this.changehandlergrade.bind(this)
    this.changehandlersection = this.changehandlersection.bind(this)
    this.getReport = this.getReport.bind(this)
    this.loadGradesByRole = this.loadGradesByRole.bind(this)
  }

  componentDidMount () {
    this.mappindDetails = this.userProfile.academic_profile
    this.role = this.userProfile.personal_info.role

    console.log(this.role)

    if (this.userProfile.personal_info.role.toString() === 'Subjecthead') {
      this.mappindDetails = this.userProfile.academic_profile
      let subjectData = []
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.subject_id)) {
          map.set(item.subject_id, true)
          subjectData.push({
            value: item.subject_id,
            label: item.subject_name
          })
        }
      }
      this.setState({ subjects: subjectData })
    } else if (this.userProfile.personal_info.role.toString() === 'Admin') {
      axios
        .get(urls.SUBJECT, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (Array.isArray(res.data)) {
            let subjects = []
            for (let i = 0; i < res.data.length; i++) {
              subjects[i] = {
                value: res.data[i].id,
                label: res.data[i].subject_name
              }
            }
            this.setState({ subjects })
          }
          if (typeof res.data === 'string') {
            this.props.alert.warning(res.data)
          }
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
          console.log(error)
        })
    }
    if (this.role === 'Admin' || this.role === 'Subjecthead') {
      this.props.loadBranches()
    } else if (this.role === 'Principal') {
      let mappingDetailsPrinci = this.userProfile.academic_profile
      this.changehandlerbranch({ value: mappingDetailsPrinci.branch_id, label: mappingDetailsPrinci.branch })
    } else if (this.role === 'Teacher') {
      let mappingDetails = this.userProfile.academic_profile[0]
      if (mappingDetails) {
        this.changehandlerbranch({ value: mappingDetails.branch_id, label: mappingDetails.branch_name })
      } else {
        this.props.alert.error('No mappings provided to you')
      }
    } else {
      let branchData = []
      let map = new Map()
      if (Array.isArray(this.mappindDetails)) {
        for (const item of this.mappindDetails) {
          if (!map.has(item.branch_id)) {
            map.set(item.branch_id, true) // set any value to Map
            branchData.push({ value: item.branch_id, label: item.branch_name })
          }
        }
        this.setState({ branchData: branchData })
      }
    }
    this.props.listSubjects()
  }

  handleSelect = ranges => {
    var selectionRange = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection'
    }
    this.setState({ selectionRange: selectionRange })
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, valueSection: [], valueGrade: [] })
    let gradeData = []
    if (this.role === 'Admin' || this.role === 'Subjecthead') {
      this.props.gradeMapBranch(e.value)
    } else if (this.role === 'Principal') {
      this.props.gradeMapBranch(e.value)
      console.clear()
      console.log(e.label)
      this.setState({ valueBranch: { label: e.label, value: e.value } })
    } else {
      console.log('changed branch')
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
      this.setState({ gradeData: gradeData, valueGrade: [], valueSection: [], valueBranch: e })
    }
  }

  changehandlergrade = (e) => {
    this.setState({ grade: e.value, valueGrade: e, valueSection: [] })
    this.getSubjectsForSUBHEAD(e.value)
    let sectionData = []
    let subjectData = []
    let map = new Map()
    console.log('role', this.role)
    if (this.role === 'Principal' || this.role === 'Admin') {
      let grade = this.props.grades.filter(grades => grades.grade.id === e.value)
      this.props.sectionMap(grade[0].id)
    } else if (this.role === 'Teacher') {
      console.log('Teacher', e)
      for (const item of this.mappindDetails) {
        console.log(item, e.value)
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
          subjectData.push({
            value: item.subject_id,
            label: item.subject_name
          })
          console.log(subjectData)
        }
      }
    } else if (this.role === 'Planner' || this.role === 'Subjecthead') {
      console.log('blablah')
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
    }
    this.setState({ subjectData, sectionData, valueGrade: e })
  }

  changehandlersection = (e) => {
    let subjectData = []
    let sectionData = []
    let map = new Map()
    if (this.role === 'Admin') {
      sectionData = e
    } else if (this.userProfile.personal_info.role === 'Teacher') {
      subjectData = this.mappindDetails.filter(item => {
        return (item.section_id === e.value && this.state.valueGrade.value === item.grade_id && item.branch_id === this.state.branch)
      }).map(item => ({
        value: item.subject_id,
        label: item.subject_name
      }))
      sectionData = [e]
    } else if (this.role === 'Planner' || this.role === 'Subjecthead') {
      sectionData = this.props.sections.map(section => ({
        value: section.id,
        label: section.section_name
      }))
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
    } else if (this.role === 'Principal') {
      sectionData = [e]
    }
    this.setState({ subjectData, section: sectionData })
  }
  getSubjectsForSUBHEAD = (gradeId) => {
    // var sectionData = []
    console.log('my func called', gradeId)
    var subjectData = []
    var map = new Map()
    if (this.role === 'Subjecthead') {
      // sectionData = this.props.sections.map(section => ({
      //   value: section.id,
      //   label: section.section_name
      // }))
      for (const item of this.mappindDetails) {
        if (
          !map.has(item.subject_id) &&
          item.grade_id === gradeId &&
          item.branch_id === this.state.branch
        ) {
          map.set(item.subject_id, true) // set any value to Map
          subjectData.push({
            value: item.subject_id,
            label: item.subject_name
          })
        }
      }
      console.log('my func called', subjectData)
      this.setState({ subjectData })
    }
  }
  getReport = () => {
    let { branch, grade, section, subject, subjectData, selectionRange } = this.state

    if (!section && this.role === 'Teacher') {
      this.props.alert.warning('Select section')
    }

    if (!branch) {
      this.props.alert.error('Select Branch')
      return
    } else if (!grade) {
      this.props.alert.error('Select Grade')
      return
    } else if (!section && (this.role === 'Teacher' || this.role === 'Planner')) {
      if (this.role !== 'Planner') {
        if (!subjectData) {
          this.props.alert.error('Select Subject')
          return
        }
      }
    } else if (!selectionRange) {
      this.props.alert.error('Select Date Range')
      return
    } else if (!subject && this.role === 'Subjecthead') {
      this.props.alert.error('Select Subject')
      return
    }
    if (branch && grade && subjectData && selectionRange) {
      let parameter
      let subjectIds = []

      if (this.role === 'Principal' || this.role === 'Admin' || this.role === 'Planner') {
        this.props.subjects.forEach(sub => subjectIds.push(sub.id))
      } else if (this.role === 'Subjecthead') {
        subjectData.forEach((obj) => {
          subjectIds.push(obj.id)
        })
      } else if (this.role === 'Teacher') {
        subjectData.forEach((obj) => {
          subjectIds.push(obj.value)
        })
      }
      let startDate = moment(selectionRange.startDate).format('YYYY-MM-DD')
      let endDate = moment(selectionRange.endDate).format('YYYY-MM-DD')
      console.log(section)
      console.log(subjectIds)
      if (this.role === 'Admin') {
        parameter = `?branch_id=${branch}&grade_id=${grade}&section_id=${section.value}&subject_ids=${subjectIds}&from_date=${startDate}&to_date=${endDate}`
      } else if (this.role === 'Teacher' || this.role === 'Principal') {
        parameter = `?branch_id=${branch}&grade_id=${grade}&section_id=${section[0].value}&subject_ids=${subjectIds}&from_date=${startDate}&to_date=${endDate}`
      } else if (this.role === 'Planner') {
        parameter = `?branch_id=${branch}&grade_id=${grade}&subject_ids=${this.state.subjectData[0].value}&from_date=${startDate}&to_date=${endDate}`
      } else if (this.role === 'Subjecthead') {
        parameter = `?branch_id=${branch}&grade_id=${grade}&subject_ids=${[subject]}&from_date=${startDate}&to_date=${endDate}`
      }

      var tableData = []
      axios
        .get(urls.Report + parameter, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          res.data.forEach((reportData, dataIndex) => {
            let subjectName
            this.props.subjects.forEach(function (subject) {
              if (subject.id === reportData.subjectmapping.subject) {
                subjectName = subject.subject_name
              }
            })
            tableData.push({
              date: reportData.which_day
                ? moment(reportData.which_day).format('DD/MM/YYYY h:mm:ss')
                : '',
              subjectName: subjectName,
              teacherName: reportData.added_by
                ? reportData.added_by.first_name
                : '',
              recap_of_prev_class: reportData.recap
                ? reportData.recap
                : '',
              details_of_classWork: reportData.classswork
                ? reportData.classswork
                : '',
              end_summary_check: reportData.summary
                ? reportData.summary
                : '',
              experiments_demos_videos: reportData.support_materials
                ? reportData.support_materials
                : '',
              homeworkGiven: reportData.homework
                ? reportData.homework
                : '',
              media_file: reportData.media
                ? reportData.media.length > 0 && reportData.media.map((file, index) => <Button target={'blank'} href={file.media_file}>File {index + 1}</Button>)
                : '',
              history: (
                <div>
                  <IconButton
                    aria-label='History'
                    onClick={e => {
                      e.stopPropagation()
                      this.props.history.push(
                        '/teacherHistory/' + reportData.id
                      )
                    }}
                  >
                    <HistoryIcon fontSize='small' />
                  </IconButton>{' '}

                  <IconButton
                    aria-label='Edit'
                    onClick={e => {
                      e.stopPropagation()
                      this.props.history.push(
                        '/teacher-report/edit/' + reportData.id
                      )
                    }}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>

                  <IconButton
                  // {console.log(this.role)}
                  // {(this.role === 'Subjecthead' || this.role === 'Planner' || this.role === 'Principal') ? <IconButton
                    aria-label='Delete'
                    onClick={(e) => this.deleteHandler(reportData.id, dataIndex)}
                  > {console.log('I am principal')}
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                  {/* : ''} */}
                </div>
              )

            })
          })
          this.setState({ tableData: tableData })
        })
    }
  }
  deleteHandler = (id, index) => {
    console.log(id)
    var updatedList = urls.Report + String(id) + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        },
        body: {
          id
        }
      })
      .then((res) => {
        this.props.alert.success('Deleted Teacher report Successfully')
        let { tableData } = this.state
        delete tableData[index]
        this.setState({ tableData })
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.Report, error)
      })
  }

  loadGradesByRole = () => {
    let role = this.role
    if (role === 'Teacher' || role === 'Planner') {
      return this.state.gradeData
    } else {
      return this.props.grades ? this.props.grades.map(grades => ({
        value: grades.grade.id,
        label: grades.grade.grade
      })) : []
    }
  }

  render () {
    let { branchData, sectionData, tableData, valueBranch } = this.state
    return (
      <React.Fragment>
        <Form style={{ padding: '20px' }}>
          <Form.Group>
            <Form.Field required width={5}>
              <label>Branch</label>
              <OmsSelect
                options={this.role === 'Admin' || this.role === 'Subjecthead'
                  ? this.props.branches
                    ? this.props.branches.map((branch) => ({
                      value: branch.id,
                      label: branch.branch_name }))
                    : []
                  : branchData
                }
                defaultValue={valueBranch}
                placeholder='Select Branch'
                change={this.changehandlerbranch}
                error={this.state.branchError}
                disabled={this.role === 'Principal' || this.role === 'Teacher'}
              />
            </Form.Field>
            <Form.Field required width={5}>
              <label>Grade</label>
              <OmsSelect
                placeholder='Select Grade'
                options={this.loadGradesByRole()}
                change={this.changehandlergrade}
                defaultValue={this.state.valueGrade}
                error={this.state.gradeError}
              />
            </Form.Field>
            <Form.Field required width={6}>
              {this.role === 'Planner' || this.role === 'Subjecthead' ? (
                <React.Fragment>
                  <label>Subject</label>
                  <OmsSelect
                    defaultValue={this.state.valueSubject}
                    placeholder='Select Subject'
                    change={(e) =>
                      this.setState({ subject: e.value, valueSubject: e })
                    }
                    options={this.state.subjectData}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <label>Section</label>
                  <OmsSelect
                    placeholder='Select Section'
                    options={this.props.section
                      ? this.props.section.map(section => ({
                        value: section.section.id,
                        label: section.section.section_name
                      }))
                      : sectionData}
                    change={this.changehandlersection}
                    defaultValue={this.state.section}
                    error={this.state.sectionError}
                  />
                </React.Fragment>
              )}
            </Form.Field>
          </Form.Group>
          <br />
          <label>Select Range*</label>
          <br />
          <DateRangePicker
            ranges={[this.state.selectionRange]}
            onChange={this.handleSelect}
          />
          <Form.Group>
            <Form.Field className='teacherdate' />
            <Form.Field width={4}>
              <Button onClick={this.getReport} primary>
                Get Report
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={12}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                filterTableData={teacherReport}
                tableData={tableData}
                tableFields={tableFields}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  section: state.sectionMap.items,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listSubjects: () => dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GetTeacherReport))
