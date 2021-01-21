/* eslint-disable camelcase */
import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Info } from '@material-ui/icons'
import _ from 'lodash'
import { urls } from '../../../urls'
import './gradebook.css'

export class Tab3Contents extends Component {
  constructor () {
    super()
    this.state = {
      loading: false,
      subjectMappingId: '',
      currentPage: 0,
      pageSize: 30,
      showSavingStatus: false,
      remarkedData: [],
      isTheatre: false,
      showLockedStatus: false
    }
    this.textInput = React.createRef()
    this.delayedCallback = _.debounce((studentInfo, property, value) => {
      this.updateStudentInfo(studentInfo, property, value)
    }, 2000)
  }

  componentWillReceiveProps ({ selectedData, selectedTermId, role }) {
    if (selectedData.section_mapping_id && (role === 'Teacher' || role === 'LeadTeacher' || role === 'AcademicCoordinator')) {
      this.setState({ loading: true }, () => {
        this.getStudentRemarkedData()
      })
    } else if (selectedData.acad_branch_grade_mapping_id && (role !== 'Teacher' && role !== 'LeadTeacher' && role !== 'AcademicCoordinator')) {
      this.setState({ loading: true }, () => {
        this.getStudentRemarkedData()
      })
    }
  }

  componentDidMount () {
    if (this.props.selectedData.subject_mapping_id || this.props.selectedData.acad_branch_grade_mapping_id) {
      this.setState({ loading: true, subjectMappingId: this.props.selectedData.subject_mapping_id }, () => {
        this.getStudentRemarkedData()
      })
    }
  }

  updateStudentInfo = (studentInfo, property, value) => {
    let formData = new FormData()

    formData.append('student_id', studentInfo.student_id)
    formData.append('term_id', this.props.selectedTermId)
    formData.append('branch_id', this.props.selectedData.branch_id)

    if (this.props.role !== 'Subjecthead') {
      formData.append('subject_mapping_id', this.state.subjectMappingId)
    } else {
      formData.append('branch_id', this.props.selectedData.branch_id)
    }
    formData.append([property], value)
    axios.post(urls.TeacherRemarksAttendance, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        this.setState({ showSavingStatus: false })
      })
      .catch(error => {
        this.setState({ showSavingStatus: false })
        if (error.response && error.response.status === 409) {
          this.props.alert.error('Board Number already exist')
        } else {
          this.props.alert.error('Failed to update details')
        }
      })
  }

  getStudentRemarkedData = () => {
    const { currentPage, pageSize } = this.state
    let path = `?page_number=${currentPage + 1}&page_size=${pageSize}&term_id=${this.props.selectedTermId}&`

    if (this.props.role === 'Teacher' || this.props.role === 'LeadTeacher' || this.props.role === 'AcademicCoordinator') {
      path += `section_mapping_id=${this.props.selectedData.section_mapping_id}`
    } else {
      path += `mapping_acad_grade=${this.props.selectedData.acad_branch_grade_mapping_id}`
    }

    axios.get(`${urls.TeacherRemarksAttendance}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ remarkedData: res.data.students_data, loading: false, totalPages: res.data.total_pages, showLockedStatus: true })
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  handleInputChange = (e, studentInfo, property, index) => {
    let inputVal = e.target.value

    let { remarkedData = [] } = this.state
    let studentData = remarkedData[index] || {}
    studentData = { ...studentData, [property]: inputVal }
    remarkedData[index] = studentData
    this.setState({ remarkedData, showSavingStatus: true }, () => {
      this['textInput' + index + property].focus()
      let value = inputVal
      if (property === 'attendance' && String(inputVal).startsWith('-1')) {
        this.props.alert.error('Invlaid number')
        return
      }
      this.delayedCallback(studentInfo, property, value)
    })
  }

  renderInputTextfield (studentInfo, property, index, editableType) {
    let data = this.state.remarkedData[index] || {}
    let propertyValue = data ? data[property] : ''
    return (
      <React.Fragment>

        {property === 'remarks' ? <div style={{ zIndex: 9999, padding: 0 }}><textarea
          disabled={this.props.isGlobalLocked || this.props.isBranchLocked}
          id={'textInput' + index + property}
          className='rendered-input'
          value={propertyValue || ''}
          style={{ width: '100%', height: 70, borderRadius: 3, zIndex: 9999 }}
          onChange={(e) => {
            console.log('hello')
            this.handleInputChange(e, studentInfo, property, index)
          }}
          ref={(input) => { this['textInput' + index + property] = input }}
        />  </div>
          : <div style={{ zIndex: 9999, padding: 0 }}>
            <input
              type={property === 'board_no' ? 'text' : 'number'}
              disabled={this.props.isGlobalLocked || this.props.isBranchLocked}
              id={'textInput' + index + property}
              className='rendered-input'
              value={propertyValue || ''}
              style={{ width: '150px', height: 34, borderRadius: 3 }}
              onChange={(e) => {
                console.log('hello')
                this.handleInputChange(e, studentInfo, property, index)
              }}
              ref={(input) => { this['textInput' + index + property] = input }}
            />
          </div>
        }

      </React.Fragment>
    )
  }

  getColumnOutput = (original, assessmentType, index, editableType) => {
    return this.renderInputTextfield(original, assessmentType, index, editableType)
  }

  render () {
    const { remarkedData, loading, currentPage, totalPages = 1, showSavingStatus, showLockedStatus } = this.state
    let columns = [
      {
        Header: 'SL_NO',
        id: 'sln',
        width: 150,
        Cell: row => {
          let { currentPage, pageSize } = this.state
          return (pageSize * currentPage + (row.index + 1))
        }
      },
      {
        Header: 'Student Name',
        width: 300,
        accessor: 'student_name'
      },
      {
        Header: 'Remarks',
        width: 250,
        className: 'gradebook_remarks',
        Cell: (props) => {
          let { original, index } = props
          return this.getColumnOutput(original, 'remarks', index, 'textarea')
        }
      },
      {
        Header: 'Attendance',
        width: 200,
        className: 'gradebook_remarks',
        Cell: (props) => {
          let { original, index } = props
          return this.getColumnOutput(original, 'attendance', index, 'inputbox')
        }
      }
    ]
    if (this.props.gradeName === 'Grade 9' || this.props.gradeName === 'Grade 10') {
      columns = [...columns,
        {
          Header: 'Board Registration Number',
          width: 200,
          className: 'gradebook_remarks',
          Cell: (props) => {
            let { original, index } = props
            return this.getColumnOutput(original, 'board_no', index, 'inputbox')
          }
        }]
    }
    return (
      <div style={{ position: 'relative', height: 500 }}>
        { showSavingStatus ? <p style={{ position: 'absolute', top: -220, left: '45%', border: '1px solid white', color: 'white', padding: '5px 10px', zIndex: 999 }}>saving...</p> : ''}
        {
          ((this.props.isGlobalLocked || this.props.isBranchLocked) && showLockedStatus)
            ? <span style={{ display: 'flex', marginBottom: 20 }}>
              <Info />
              <h5 style={{ margin: '5px 0 0 5px' }}>Gradebook Lock has been set. Student details cannot be edited.</h5>
            </span>
            : ''
        }
        <ReactTable
          style={{ height: '100%' }}
          manual
          data={remarkedData || []}
          columns={columns}
          page={currentPage}
          onPageChange={(page) => { this.setState({ currentPage: page, loading: true }, () => { this.getStudentRemarkedData() }) }}
          defaultPageSize={this.state.pageSize}
          loading={loading}
          pages={totalPages}
        />
      </div>
    )
  }
}

export default Tab3Contents
