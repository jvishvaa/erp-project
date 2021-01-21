/* eslint-disable camelcase */
import React, { Component } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Lock, LockOpen, Info } from '@material-ui/icons'
import { Button, Modal, Card } from '@material-ui/core'
// import { debounce } from 'throttle-debounce'
import _ from 'lodash'
import { urls } from '../../../urls'

export class Tab2Contents extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentPage: 0,
      pageSize: 10,
      studentTablePageSize: 30,
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
      evaluationSequenceId: '',
      showLockedStatus: false,
      debouncingInstances: new Map(),
      dropDownOptions: [],
      isDropDown: false
    }

    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.textInput = React.createRef()
    this.delayedCallback = _.debounce((studentInfo, value) => {
      this.updateStudentInfo(studentInfo, value)
    }, 1000)
    this.callToSpecificDebouncingInstance = this.callToSpecificDebouncingInstance.bind(this)
  }

  callToSpecificDebouncingInstance (studentInfo, value) {
    let { debouncingInstances } = this.state
    if (debouncingInstances.has(studentInfo.student_id)) {
      debouncingInstances.get(studentInfo.student_id)(studentInfo, value)
    } else {
      debouncingInstances.set(studentInfo.student_id, _.debounce((studentInfo, value) => {
        this.updateStudentInfo(studentInfo, value)
      }, 2000))
      debouncingInstances.get(studentInfo.student_id)(studentInfo, value)
    }
  }

  /**
   * @param subjectMappingId(recieved from parent component : gradebook)
   * As the component recieves subjectMappingId the getCriteriaDetails function is invoked
   */
  componentWillReceiveProps ({ selectedData, selectedTermId, role }) {
    if (JSON.stringify(selectedData) !== JSON.stringify(this.props.selectedData)) {
      if (selectedData.section_mapping_id && (role === 'Teacher' || role === 'LeadTeacher' || role === 'AcademicCoordinator')) {
        this.setState({ loading: true }, () => {
          this.getCriteriaDetails()
        })
      } else if (selectedData.acad_branch_grade_mapping_id && (role !== 'Teacher' && role !== 'LeadTeacher' && role !== 'AcademicCoordinator')) {
        this.setState({ loading: true }, () => {
          this.getCriteriaDetails()
        })
      }
    }
  }

  /**
   * Gets all the students belonging to that particular subject mapping id scholastic type selected
   */
  getStudentDetails = () => {
    const { currentStudentTablePage, scholasticId = '', evaluationSequenceId = '', studentTablePageSize } = this.state
    const { role, criteriaType } = this.props
    let path = `?page_number=${currentStudentTablePage + 1}&page_size=${studentTablePageSize}&grade_evaluation_sequence_id=${evaluationSequenceId}&term_id=${this.props.selectedTermId}&grade_evaluation_id=${scholasticId}&criteria_type=${criteriaType}&`
    if (role === 'Teacher' || role === 'LeadTeacher' || role === 'AcademicCoordinator') {
      path += `section_mapping_id=${this.props.selectedData.section_mapping_id}`
    } else {
      path += `mapping_acad_grade=${this.props.selectedData.acad_branch_grade_mapping_id}`
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

  combineCriterias = (res) => {
    const criteriasToCombine = ['weight', 'height']
    const heightAndWeight = res.data.grade_book_criteria_details.filter(criteria => {
      return criteriasToCombine.indexOf(criteria.gradebook_evaluation_category) > -1
    })
    const removeCriteriasToCombine = res.data.grade_book_criteria_details.filter(criteria => {
      return criteriasToCombine.indexOf(criteria.gradebook_evaluation_category) === -1
    })

    const combinedCriterias = heightAndWeight.length
      ? [{ gradebook_evaluation_category: 'height and weight',
        heightAndWeight,
        lock_status: heightAndWeight[0].lock_status
      }, ...removeCriteriasToCombine]
      : res.data.grade_book_criteria_details

    this.setState({
      scholasticData: combinedCriterias,
      loading: false,
      totalPages: res.data.total_pages })
  }

  /**
   * Used to get different scholastic details
   */
  getCriteriaDetails = () => {
    const { currentPage, pageSize } = this.state
    const { role, criteriaType } = this.props
    let path = `?page_number=${currentPage + 1}&page_size=${pageSize}&criteria_type=${criteriaType}&term_id=${this.props.selectedTermId}&`

    if (role === 'Teacher' || role === 'LeadTeacher' || role === 'AcademicCoordinator') {
      path += `section_mapping_id=${this.props.selectedData.section_mapping_id}`
    } else {
      path += `mapping_acad_grade=${this.props.selectedData.acad_branch_grade_mapping_id}`
    }
    axios.get(`${urls.GRADEBOOK}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.combineCriterias(res)
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
        if (res.data.length === 1) {
          this.setState({ open: true, sequenceOpen: false }, () => {
            this.handleGradebookSequenceClick(res.data[0])
          })
        } else {
          this.setState({ sequenceOpen: true, sequences: res.data })
        }
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
  handleClick = (data) => {
    const { id, lock_status: isLocked, gradebook_evaluation_category: evaluationCategory } = data
    if (evaluationCategory === 'height and weight') {
      // const ids = data.heightAndWeight.map(category => {
      //   return category.id
      // })
      const lock = data.heightAndWeight[0].lock_status
      // this.setState({ studentTableLoader: true, scholasticId: ids, currentStudentTablePage: 0, studentData: [], isSelectedGradebookCategoryLocked: JSON.parse(lock), sequences: '', evaluationCategory }, () => {
      //   this.getGradebookEvaluationSequences()
      // })
      this.setState({ studentTableLoader: true, currentStudentTablePage: 0, studentData: [], isSelectedGradebookCategoryLocked: JSON.parse(lock), sequences: '', evaluationCategory: 'height and weight', open: true, scholasticId: '', evaluationSequenceId: '' }, () => {
        this.getStudentDetails()
      })
    } else {
      this.setState({ studentTableLoader: true, scholasticId: id, currentStudentTablePage: 0, studentData: [], isSelectedGradebookCategoryLocked: JSON.parse(isLocked), sequences: '', evaluationCategory }, () => {
        this.getGradebookEvaluationSequences()
      })
    }
    // this.setState({ showModal: true, sequenceOpen: true, studentTableLoader: true, scholasticId: id, currentStudentTablePage: 0, studentData: [], isSelectedGradebookCategoryLocked: JSON.parse(isLocked), sequences: '', evaluationCategory }, () => {
    //   this.getGradebookEvaluationSequences()
    // })
  }

  updateStudentInfo = (studentInfo, value, property) => {
    const { criteriaType, isDropDown } = this.state
    let formData = new FormData()
    formData.append('student_id', studentInfo.student_id)
    formData.append('gradebook_evaluation_criteria', this.state.scholasticId || '')
    let pattern = new RegExp('^(A|AB)$', 'i')
    console.log(value, criteriaType)
    if (this.props.criteriaType !== 'Gameskill') {
      value = pattern.test(value) && !isDropDown ? 'AB' : value
    }
    console.log(value)
    formData.append(criteriaType, value)
    formData.append('term_id', this.props.selectedTermId)
    formData.append('grade_evaluation_sequence_id', this.state.evaluationSequenceId)
    if (this.props.role !== 'Subjecthead') {
      formData.append('mapping_acad_grade', this.props.selectedData.acad_branch_grade_mapping_id)
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

  handleInputChange = (value, info, index, property) => {
    let newStudentData = this.state.studentData
    if (!newStudentData[index].grade_criteria_details.length) {
      newStudentData[index].grade_criteria_details[0] = { [property]: value }
    } else {
      newStudentData[index].grade_criteria_details[0][property] = value
    }
    this.setState({ studentData: newStudentData, showSavingStatus: true, criteriaType: property }, () => {
      // this['textInput' + index].focus()
      let value = this.state.studentData[index].grade_criteria_details[0][property]
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
  renderEditable (studentInfo, index, evaluationCategory) {
    const { isSelectedGradebookCategoryLocked } = this.state
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
            studentInfo.grade_criteria_details[0][evaluationCategory]
              ? studentInfo.grade_criteria_details[0][evaluationCategory]
              : ''}
          style={{ width: 150, height: 34, borderRadius: 3 }}
          onChange={
            (e) => {
              let propertiesToExludeZero = ['inter_school_participation', 'inter_orchids_participation', 'orchids_premier_league']
              let pattern
              if (propertiesToExludeZero.indexOf(evaluationCategory) > -1) {
                if (e.target.value.startsWith('0')) {
                  pattern = new RegExp('^(([1-9]+[.]?([1-9]+)?))$', 'i')
                } else {
                  pattern = new RegExp('^(([0-9]+[.]?([0-9]+)?))$', 'i')
                }
              } else {
                pattern = new RegExp('^(A|AB|([0-9]+[.]?([0-9]+)?))$', 'i')
              }

              let isValid = pattern.test(e.target.value)
              if (isValid || e.target.value === '') {
                this.handleInputChange(e.target.value, studentInfo, index, evaluationCategory)
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

  renderSelector = (studentInfo, index, property) => {
    const { dropDownOptions, studentData, isSelectedGradebookCategoryLocked } = this.state
    return <div style={{ padding: '0 8px' }}>
      <select
        disabled={this.props.isGlobalLocked || this.props.isBranchLocked || isSelectedGradebookCategoryLocked}
        onChange={(e) => {
          this.handleInputChange(e.target.value, studentInfo, index, property)
        }}
      >
        <option selected={''} value=''>NA</option>
        {dropDownOptions.map(option => {
          return (
            <option
              selected={
                studentData[index].grade_criteria_details.length && option.label === studentData[index].grade_criteria_details[0][property]
              }
            >{option.label}
            </option>)
        })}
      </select>
    </div>
  }

  setGradebookCategoryLock = (criteriaData) => {
    let formData = new FormData()
    if (criteriaData.gradebook_evaluation_category === 'height and weight') {
      const ids = criteriaData.heightAndWeight.map(criteria => {
        return criteria.id
      })
      formData.append('gradebook_criteria_id', ids)
    } else {
      formData.append('gradebook_criteria_id', criteriaData.id)
    }
    formData.append('lock_status', criteriaData.lock_status === true ? 'False' : 'True')
    formData.append('term_id', this.props.selectedTermId)
    formData.append('branch_id', this.props.selectedData.branch_id)
    if (this.props.role !== 'Subjecthead') {
      formData.append('mapping_acad_grade', this.props.selectedData.acad_branch_grade_mapping_id)
    } else {
      formData.append('branch_id', this.props.selectedData.branch_id)
    }
    // formData.append('mapping_acad_grade', this.props.selectedData.acad_branch_grade_mapping_id)
    axios.post(urls.LockGradebook, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        this.setState({ loading: true }, () => {
          this.getCriteriaDetails()
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

  getDropDownChoices = (id) => {
    axios.get(urls.COSCHOLASTICCHOICES, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ dropDownOptions: res.data.skill_gradings,
          open: true,
          studentTableLoader: true,
          evaluationSequenceId: id }, () => {
          this.getStudentDetails()
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleGradebookSequenceClick = (sequence) => {
    // eslint-disable-next-line camelcase
    const { id, gradebook_evaluation_criteria } = sequence
    const { dropdown, is_dropdown } = gradebook_evaluation_criteria
    if (this.props.criteriaType !== 'Gameskill' || this.props.gradeName === 'Grade 9') {
      const dropDownOptions = is_dropdown
        ? Object.keys(dropdown).map((key) => {
          return { label: key, value: key }
        }) : []
      this.setState({ open: true,
        studentTableLoader: true,
        evaluationSequenceId: id,
        isDropDown: is_dropdown,
        dropDownOptions }, () => {
        this.getStudentDetails()
      })
    } else {
      this.getDropDownChoices(id)
    }
  }

  render () {
    const { pageSize, scholasticData, totalPages, currentPage, currentStudentTablePage, open, studentData, totalStudentTablePages, showSavingStatus, sequenceOpen, isSelectedGradebookCategoryLocked, showLockedStatus, isDropDown, evaluationCategory, studentTablePageSize } = this.state
    const { isGlobalLocked, isBranchLocked, criteriaType } = this.props
    const columns = [
      {
        Header: 'SL_NO',
        id: 'sln',
        width: 100,
        Cell: row => {
          let { currentPage, pageSize } = this.state
          return (pageSize * currentPage + (row.index + 1))
        }
      },
      {
        Header: 'Gradebook Evaluation Category',
        Cell: ({ original }) => {
          return <Button variant={'outlined'} onClick={() => {
            this.handleClick(original)
          }}>{original.gradebook_evaluation_category}</Button>
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

    const studentTableColumns = [
      {
        Header: 'SL_NO',
        id: 'sln',
        width: 100,
        Cell: row => {
          let { currentStudentTablePage, studentTablePageSize } = this.state
          return (studentTablePageSize * currentStudentTablePage + (row.index + 1))
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
      }
    ]

    let cols = criteriaType !== 'Gameskill' || this.props.gradeName === 'Grade 9'
      ? evaluationCategory === 'height and weight'
        ? [...studentTableColumns,
          {
            Header: 'Height',
            Cell: (props) => {
              let { original, index } = props
              return this.renderEditable(original, index, 'height')
            }
          },
          {
            Header: 'Weight',
            Cell: (props) => {
              let { original, index } = props
              return this.renderEditable(original, index, 'weight')
            }
          }
        ]
        : [...studentTableColumns, {
          Header: evaluationCategory ? evaluationCategory.toUpperCase() : '',
          Cell: (props) => {
            let { original, index } = props
            return isDropDown ? this.renderSelector(original, index, this.state.evaluationCategory) : this.renderEditable(original, index, this.state.evaluationCategory)
          }
        }]
      : [...studentTableColumns,
        {
          Header: 'Technical Level',
          Cell: (props) => {
            let { original, index } = props
            return this.renderSelector(original, index, 'technical_level')
          }
        },
        {
          Header: 'Tactical Level',
          Cell: (props) => {
            let { original, index } = props
            return this.renderSelector(original, index, 'tactical_level')
          }
        },
        {
          Header: 'Physical Level',
          Cell: (props) => {
            let { original, index } = props
            return this.renderSelector(original, index, 'physical_level')
          }
        },
        {
          Header: 'Overall Performance',
          Cell: (props) => {
            let { original, index } = props
            return this.renderSelector(original, index, 'overall_performance')
          }
        }
      ]

    return (
      <div>
        <ReactTable
          manual
          data={scholasticData || []}
          columns={columns}
          page={currentPage}
          pages={totalPages}
          onPageChange={(page) => {
            this.setState({ currentPage: page, loading: true }, () => {
              this.getCriteriaDetails()
            })
          }}
          defaultPageSize={pageSize}
          loading={this.state.loading}
          onFetchData={() => { console.log('hello') }}
          className='gradebook__cont'
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
                columns={cols}
                page={currentStudentTablePage}
                pages={totalStudentTablePages}
                onPageChange={(page) => {
                  this.setState({ currentStudentTablePage: page, studentTableLoader: true }, () => {
                    this.getStudentDetails()
                  })
                }}
                defaultPageSize={studentTablePageSize}
                loading={this.state.studentTableLoader}
                className='gradebook__cont'
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
                      <Button onClick={() => { this.handleGradebookSequenceClick(sequence) }}>Click here</Button>
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

export default Tab2Contents
