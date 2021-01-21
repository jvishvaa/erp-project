import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Lock, LockOpen, Info } from '@material-ui/icons'
import { Button, Modal, Card } from '@material-ui/core'
// import { debounce } from 'throttle-debounce'
import _ from 'lodash'
import { urls } from '../../../urls'

export class Tab1Contents extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentPage: 0,
      pageSize: 30,
      studentData: [],
      open: false,
      sequenceOpen: false,
      scholasticData: [],
      subjectMappingId: '',
      loading: false,
      totalPages: 1,
      totalStudentTablePages: 1,
      studentTableLoader: false,
      currentTablePage: 0,
      currentStudentTablePage: 0,
      selectedStudent: null,
      showSavingStatus: false,
      isSelectedGradebookCategoryLocked: undefined,
      sequences: [],
      evaluationSequenceId: null,
      showLockedStatus: false,
      debouncingInstances: new Map(),
      criteriaType: '',
      examType: 'first'
    }

    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.textInput = React.createRef()
    this.delayedCallback = _.debounce((studentInfo, value) => {
      this.updateSecuredMarks(studentInfo, value)
    }, 1000)
    this.callToSpecificDebouncingInstance = this.callToSpecificDebouncingInstance.bind(this)
  }

  callToSpecificDebouncingInstance (studentInfo, value) {
    let { debouncingInstances } = this.state
    if (debouncingInstances.has(studentInfo.student_id)) {
      debouncingInstances.get(studentInfo.student_id)(studentInfo, value)
    } else {
      debouncingInstances.set(studentInfo.student_id, _.debounce((studentInfo, value) => {
        this.updateSecuredMarks(studentInfo, value)
      }, 2000))
      debouncingInstances.get(studentInfo.student_id)(studentInfo, value)
    }
  }

  /**
   * @param subjectMappingId(recieved from parent component : gradebook)
   * As the component recieves subjectMappingId the getScholasticData function is invoked
   */
  componentWillReceiveProps ({ selectedData, selectedTermId, role }) {
    if (JSON.stringify(selectedData) !== JSON.stringify(this.props.selectedData)) {
      if (selectedData.subject_mapping_id && role !== 'Subjecthead') {
        this.setState({ loading: true, subjectMappingId: selectedData.subject_mapping_id }, () => {
          this.getScholasticData()
        })
      } else if (selectedData.acad_branch_grade_mapping_id && role === 'Subjecthead') {
        this.setState({ loading: true }, () => {
          this.getScholasticData()
        })
      } else {
        this.setState({ scholasticData: [] })
      }
    }
  }

  /**
   * Executed when the component is mounted
   */
  componentDidMount () {
    if (this.props.selectedData.subject_mapping_id || this.props.selectedData.acad_branch_grade_mapping_id) {
      this.setState({ loading: true, subjectMappingId: this.props.selectedData.subject_mapping_id }, () => {
        this.getScholasticData()
      })
    }
  }

  /**
   * Gets all the students belonging to that particular subject mapping id scholastic type selected
   */
  getStudentDetails = () => {
    const { currentStudentTablePage, subjectMappingId, pageSize, scholasticId, evaluationSequenceId, examType } = this.state
    const { role } = this.props

    let path = `?page_number=${currentStudentTablePage + 1}&page_size=${pageSize}&grade_evaluation_sequence_id=${evaluationSequenceId}&term_id=${this.props.selectedTermId}&grade_evaluation_id=${scholasticId}&criteria_type=Normal&exam_type=${examType}`

    if (role === 'Teacher' || role === 'LeadTeacher' || role === 'AcademicCoordinator') {
      path += `&section_mapping_id=${this.props.selectedData.section_mapping_id}&subject_mapping_id=${subjectMappingId}`
    } else if (role === 'Subjecthead') {
      path += `&mapping_acad_grade=${this.props.selectedData.acad_branch_grade_mapping_id}&subject_id=${this.props.selectedData.subject_id}`
    } else {
      path += `&subject_mapping_id=${subjectMappingId}`
    }

    axios.get(`${urls.STUDENTGRADEBOOK}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then((res) => {
        this.setState({ studentData: res.data.students_data, totalStudentTablePages: res.data.total_pages, studentTableLoader: false, showLockedStatus: true })
      })
      .catch(err => {
        console.log(err)
        this.setState({ studentTableLoader: false })
      })
  }

  /**
   * Used to get different scholastic details
   */
  getScholasticData = () => {
    const { currentTablePage, pageSize, subjectMappingId } = this.state
    const { selectedData } = this.props
    let path = ''
    if (this.props.role !== 'Subjecthead') {
      path = `?subject_mapping_id=${subjectMappingId}&page_number=${currentTablePage + 1}&page_size=${pageSize}&term_id=${this.props.selectedTermId}&criteria_type=Normal`
    } else {
      path = `?subject_id=${selectedData.subject_id}&mapping_acad_grade=${selectedData.acad_branch_grade_mapping_id}&page_number=${currentTablePage + 1}&page_size=${pageSize}&term_id=${this.props.selectedTermId}&criteria_type=Normal`
    }
    axios.get(`${urls.GRADEBOOK}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ scholasticData: res.data.grade_book_criteria_details, loading: false, totalPages: res.data.total_pages })
      })
      .catch(error => {
        console.log(error)
        this.setState({ loading: false })
      })
  }

  /**
   * Used to close the modal
   * And sets the selectedStudent property in the state as null
   */
  handleClose = () => {
    this.setState({ open: false, selectedStudent: null, currentStudentTablePage: 0, showLockedStatus: false })
  }

  getGradebookEvaluationSequences = () => {
    axios.get(`${urls.GRADEBOOKEVALUATIONSEQUENCE}?grade_book_evaluation_id=${this.state.scholasticId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ sequences: res.data })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Failed to load Gradebook Sequences')
      })
  }

  /**
   * Invoked when the scholastic is clicked
   * Receives the scholastic id as parameter
   */
  handleClick = ({ id, lock_status: isLocked, criteria_type: criteriaType }) => {
    this.setState({ showModal: true, sequenceOpen: true, studentTableLoader: true, scholasticId: id, currentPage: 0, studentData: [], isSelectedGradebookCategoryLocked: JSON.parse(isLocked), sequences: '', criteriaType }, () => {
      this.getGradebookEvaluationSequences()
    })
  }

  updateSecuredMarks = (studentInfo, value) => {
    let formData = new FormData()
    formData.append('student_id', studentInfo.student_id)
    formData.append('gradebook_evaluation_criteria', this.state.scholasticId)
    let pattern = new RegExp('^(A|AB)$', 'i')
    // isAbsent
    value = pattern.test(value) ? 'AB' : value
    formData.append('secured_score', value)
    formData.append('term_id', this.props.selectedTermId)
    formData.append('grade_evaluation_sequence_id', this.state.evaluationSequenceId)
    formData.append('exam_type', this.state.examType)
    if (this.props.role !== 'Subjecthead') {
      formData.append('subject_mapping_id', this.state.subjectMappingId)
    } else {
      formData.append('branch_id', this.props.selectedData.branch_id)
    }
    axios.post(urls.STUDENTGRADEBOOK, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        this.setState({ showSavingStatus: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ showSavingStatus: false })
        this.props.alert.error('Failed to update details')
      })
  }

  handleInputChange = (event, info, index) => {
    event.persist()
    let newStudentData = this.state.studentData
    if (!newStudentData[index].grade_criteria_details.length) {
      newStudentData[index].grade_criteria_details[0] = { secured_score: event.target.value }
    } else {
      newStudentData[index].grade_criteria_details[0].secured_score = event.target.value
    }
    this.setState({ studentData: newStudentData, showSavingStatus: true }, () => {
      this['textInput' + index].focus()
      let value = this.state.studentData[index].grade_criteria_details[0].secured_score
      this.callToSpecificDebouncingInstance(info, value)
      // this.delayedCallback(info, value)
    })
  }

  /**
   * Rendered inside the student react-table
   * Rendered for each student(to update the particalar student's secured marks)
   * @param studentInfo
   * @returns input field to update the student's secured marks
   */
  renderEditable (studentInfo, index) {
    const { isSelectedGradebookCategoryLocked, criteriaType } = this.state
    const { isGlobalLocked, isBranchLocked } = this.props
    return (
      <React.Fragment>
        <input
          type='text'
          id={'textInput' + index}
          className='rendered-input'
          disabled={isGlobalLocked || isSelectedGradebookCategoryLocked || isBranchLocked}
          value={
            studentInfo.grade_criteria_details &&
            studentInfo.grade_criteria_details.length &&
            studentInfo.grade_criteria_details[0] &&
            studentInfo.grade_criteria_details[0].secured_score
              ? studentInfo.grade_criteria_details[0].secured_score
              : ''}
          style={{ width: 150, height: 34, borderRadius: 3 }}
          onChange={
            (e) => {
              // eslint-disable-next-line no-useless-escape
              let pattern
              if (criteriaType === 'Competition') {
                pattern = new RegExp('^(A|AB|[-]|[-]?([0-9]+[.]?([0-9]+)?))$', 'i')
              } else {
                pattern = new RegExp('^(A|AB|([0-9]+[.]?([0-9]+)?))$', 'i')
              }
              let isValid = pattern.test(e.target.value)
              if (isValid || e.target.value === '') {
                this.handleInputChange(e, studentInfo, index)
              } else {
                this.props.alert.error('Incorrect Value')
              }
            }
          }
          ref={(input) => { this['textInput' + index] = input }}
        />
      </React.Fragment>
    )
  }

  setGradebookCategoryLock = (criteriaData) => {
    let formData = new FormData()
    formData.append('lock_status', criteriaData.lock_status === true ? 'False' : 'True')
    formData.append('gradebook_criteria_id', criteriaData.id)
    formData.append('term_id', this.props.selectedTermId)
    formData.append('branch_id', this.props.selectedData.branch_id)
    if (this.role === 'Subjecthead') {
      formData.append('subject_id', this.props.selectedData.subject_id)
    } else {
      formData.append('subject_mapping_id', this.props.selectedData.subject_mapping_id)
    }
    formData.append('mapping_acad_grade', this.props.selectedData.acad_branch_grade_mapping_id)
    axios.post(urls.LockGradebook, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        this.setState({ loading: true }, () => {
          this.getScholasticData()
        })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Failed to set lock')
      })
  }

  handleSequenceClose = () => {
    this.setState({ sequenceOpen: false })
  }

  handleGradebookSequenceClick = (id) => {
    this.setState({ open: true, studentTableLoader: true, evaluationSequenceId: id }, () => {
      this.getStudentDetails()
    })
  }

  render () {
    const { pageSize, scholasticData, totalPages, currentTablePage, currentStudentTablePage, open, studentData, totalStudentTablePages, showSavingStatus, sequenceOpen, isSelectedGradebookCategoryLocked, showLockedStatus } = this.state
    const { isGlobalLocked, isBranchLocked, gradeName } = this.props
    const columns = [
      {
        Header: 'SL_NO',
        id: 'sln',
        width: 100,
        Cell: row => {
          let { currentTablePage, pageSize } = this.state
          return (pageSize * currentTablePage + (row.index + 1))
        }
      },
      {
        Header: 'Gradebook Evaluation Category',
        Cell: ({ original }) => {
          return <Button variant={'outlined'} onClick={() => { this.handleClick(original) }}>{original.gradebook_evaluation_category}</Button>
        }
      },
      {
        Header: 'Lock/Unlock',
        Cell: ({ original }) => {
          return (
            this.role === 'Subjecthead' || this.role === 'Admin'
              ? <Button
                variant='outlined'
                style={{ padding: 2 }}
                onClick={() => { this.setGradebookCategoryLock(original) }}
                disabled={this.props.isGlobalLocked || this.props.isBranchLocked}
              >
                { JSON.parse(original.lock_status)
                  ? <span style={{ display: 'flex', padding: '0px 5px' }}><Lock />Unlock</span>
                  : <span style={{ display: 'flex', padding: '0px 5px' }}><LockOpen />Lock</span>
                }
              </Button> : ''
          )
        }
      }
    ]
    return (
      <div>
        <ReactTable
          manual
          data={scholasticData || []}
          columns={columns}
          page={currentTablePage}
          pages={totalPages}
          onPageChange={(page) => {
            this.setState({ currentTablePage: page, loading: true }, () => {
              this.getScholasticData()
            })
          }}
          defaultPageSize={5}
          loading={this.state.loading}
        />
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={open}
          onClose={this.handleClose}
        >
          <div>
            { showSavingStatus ? <p style={{ position: 'absolute', top: 10, left: '45%', border: '1px solid white', color: 'white', padding: '5px 10px' }}>saving...</p> : ''}
            <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>
              {
                (isGlobalLocked || isSelectedGradebookCategoryLocked || isBranchLocked) && showLockedStatus
                  ? <span style={{ display: 'flex', marginBottom: 20 }}>
                    <Info />
                    <h5 style={{ margin: '5px 0 0 5px' }}>Gradebook Lock has been set. Student details cannot be edited.</h5>
                  </span>
                  : ''
              }
              <ReactTable
                manual
                style={{ width: '100%' }}
                data={studentData || []}
                columns={
                  [
                    {
                      Header: 'SL_NO',
                      id: 'sln',
                      width: 100,
                      Cell: row => {
                        let { currentStudentTablePage, pageSize } = this.state
                        return (pageSize * currentStudentTablePage + (row.index + 1))
                      }
                    },
                    {
                      Header: 'Student ID',
                      accessor: 'student_id'
                    },
                    {
                      Header: 'Student Name',
                      accessor: 'student_name'
                    },
                    {
                      Header: 'ERP',
                      accessor: 'erp'
                    },
                    {
                      Header: 'Secured Marks',
                      Cell: (props) => {
                        let { original, index } = props
                        return this.renderEditable(original, index)
                      }
                    }
                  ]
                }
                page={currentStudentTablePage}
                pages={totalStudentTablePages}
                onPageChange={(page) => {
                  this.setState({ currentStudentTablePage: page, studentTableLoader: true }, () => {
                    this.getStudentDetails()
                  })
                }}
                defaultPageSize={pageSize}
                loading={this.state.studentTableLoader}
              />
            </div>
          </div>
        </Modal>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={sequenceOpen}
          onClose={this.handleSequenceClose}
        >
          <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>
            <h2 style={{ textAlign: 'center' }}>Select Gradebook Evaluation Sequence</h2>
            {
              !this.state.sequences ? (
                <p style={{ position: 'absolute', top: '50%', left: '50%' }}>Loading...</p>
              ) : (
                this.state.sequences.length ? (
                  this.state.sequences.map(sequence => {
                    return <Card style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                      <h4>{sequence.grade_book_sequence.toUpperCase()}</h4>
                      <span>
                        <Button
                          onClick={() => {
                            this.setState({ examType: 'first' }, () => {
                              this.handleGradebookSequenceClick(sequence.id)
                            })
                          }}
                          variant='outlined'
                          style={{ marginRight: 10 }}
                        >
                        Enter Marks
                        </Button>
                        {
                          gradeName === 'Grade 9'
                            ? <Button
                              variant='outlined'
                              onClick={() => {
                                this.setState({ examType: 'second' }, () => {
                                  this.handleGradebookSequenceClick(sequence.id)
                                })
                              }}>
                            Enter Improvement Test Marks
                            </Button>
                            : ''
                        }
                      </span>
                    </Card>
                  })
                ) : <h3 style={{ marginTop: 30 }}>No sequences found</h3>
              )
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default Tab1Contents
