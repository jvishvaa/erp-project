import React, { useState, useEffect, useCallback, useRef } from 'react'
import ReactTable from 'react-table'
import {
  Button,
  AppBar,
  Tabs,
  Tab,
  TextField,
  Switch,
  Grid,
  IconButton,
  Tooltip
} from '@material-ui/core'
import {
  MenuBook as SubmissionIcon,
  FileCopy as UploadHomeworkIcon,
  PostAdd as UploadResourceIcon,
  LocalLibraryOutlined as QuizIcon,
  Launch,
  AttachFile as AttachFileIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import ClearIcon from '@material-ui/icons/Clear'
import { urls } from '../../../urls'
import UploadModal from './uploadModal'
// import RecordingsModal from './recordingsModal'
import QuizModal from './quizModal'
import { OmsSelect, Modal } from '../../../ui'
// import { COMBINATIONS } from './gSelector'
// import GSelect from '../../../_components/globalselector'
import { apiActions } from '../../../_actions'
import '../OnlineClass.css'
import AssignQuestionPaper from './AssignQuestionPaper'

const AllotedClasses = ({
  alert,
  ...props
}) => {
  const [pageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(0)
  const [classes, setClasses] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const [isTabDisabled, setIsTabDisabled] = useState(true)
  //  const { token } = JSON.parse(localStorage.getItem('user_profile')).personal_info
  const [gSelectKey, setgSelectKey] = useState(new Date().getTime())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([])
  const [selectorData, setSelectorData] = useState('')
  const [fetchCancelledClassesOnly, setfetchCancelledClasses] = useState(false)
  const [clearCount, setClearCount] = useState(0)
  const [classId, setClassId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [isQuizModal, setIsQuizModal] = useState(false)
  const token = useRef(null)
  const [fetchClassesAssignsToGuestudentsOnly, setfetchClassesAssignsToGuestudentsOnly] = useState(false)
  const [gradeIds, setGradeId] = useState([])

  // recordings related states
  // const [showRecordings, setShowRecordings] = useState(false)
  // const [recordedFiles, setRecordedFiles] = useState([])
  // const [loadingFiles, setLoadingFiles] = useState(false)
  const [modalVariant, setModalVariant] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  // const { branch_id: userBranchId } = JSON.parse(localStorage.getItem('user_profile'))
  // const allowedBranchIdsToLaunchQuiz = [19, 8]

  // recording related functions

  // const showRecordingsFor = (id) => {
  //   setLoadingFiles(true)
  //   // 60 52
  //   axios.get(`${urls.GetOnlineClassFiles}?zoom_meeting_id=${id}`, {
  //     headers: {
  //       Authorization: 'Bearer ' + token.current
  //     }
  //   })
  //     .then(res => {
  //       setRecordedFiles(res.data)
  //       setLoadingFiles(false)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       logError(err)
  //     })
  //   setShowRecordings(true)
  // }
  // const handleRecordingsToggle = () => {
  //   setShowRecordings(!showRecordings)
  // }

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    if (userProfile) {
      token.current = userProfile.personal_info.token
    }
  }, [])

  const logError = useCallback((err) => {
    let { message = 'Failed to connect to server', response: { data: { status: messageFromDev } = {} } = {} } = err || {}
    if (messageFromDev) {
      alert.error(`${messageFromDev}`)
    } else if (message) {
      alert.error(`${message}`)
    } else {
      console.log('Failed', err)
    }
  }, [alert])

  const getClasses = useCallback(() => {
    setLoading(true)
    let path = `${urls.TeacherOnlineClass}?page_number=${currentPage + 1}&page_size=${pageSize}&is_completed=${currentTab !== 0 ? 'True' : 'False'}&is_cancelled=${fetchCancelledClassesOnly ? 'True' : 'False'}&is_guest_student=${fetchClassesAssignsToGuestudentsOnly ? 'True' : 'False'}&is_download=False`
    if (Object.keys(selectorData).length) {
      const { branch_acad_id: branchId, acad_branch_grade_mapping_id: gradeId } = selectorData
      if (gradeId) {
        path += `&grade_id=${gradeId}`
      } else {
        path += `&branch_acad_id=${branchId}`
      }
    }
    if (gradeIds.length) {
      path += `&grade_id=${gradeIds}`
    }

    if (selectedSubjectIds.length) {
      path += `&subject_ids=${selectedSubjectIds}`
    }

    if (startDate && endDate) {
      path += `&start_date=${startDate}&end_date=${endDate}`
    }

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + token.current
      }
    })
      .then(res => {
        setClasses(res.data.data)
        setLoading(false)
        setTotalPages(res.data.total_pages)
        setIsTabDisabled(false)
      })
      .catch(err => {
        setLoading(false)
        setIsTabDisabled(false)
        logError(err)
      })
  }, [currentPage, pageSize, currentTab, fetchCancelledClassesOnly, fetchClassesAssignsToGuestudentsOnly, selectorData, gradeIds, selectedSubjectIds, startDate, endDate, logError])

  useEffect(() => {
    if (currentPage === 0 && clearCount) {
      getClasses()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCount])

  useEffect(() => {
    getClasses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTab, fetchCancelledClassesOnly, fetchClassesAssignsToGuestudentsOnly])

  const getFormattedDate = () => {
    const date = new Date()
    let dateStr =
    date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2) + ' ' +
      ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2) + ':' +
      ('00' + date.getSeconds()).slice(-2)
    return dateStr
  }

  const isJoinTime = (joinTime, endTime) => {
    const currentTime = getFormattedDate()
    if (currentTime > joinTime && currentTime < endTime) {
      return true
    }
    return false
  }

  const handleJoin = (id) => {
    const path = `${urls.TeacherJoinClass}?zoomMeetingId=${id}&is_taken=true`
    axios.post(path, '', {
      headers: {
        Authorization: 'Bearer ' + token.current
      }
    })
      .then(res => {
        const { presenter_url: presenterUrl } = res.data
        window.open(presenterUrl, '_blank')
      })
      .catch(err => {
        console.log(err)
        logError(err)
      })
  }

  const hasClassEnded = (endTime) => {
    const currentTime = getFormattedDate()
    if (currentTime > endTime) {
      return true
    }
    return false
  }

  const handleDownloadExcel = (id) => {
    axios.get(`${urls.OnlineclassAttendeeList}?zoomMeetingId=${id}&type=excel`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + token.current
      }
    })
      .then(res => {
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'online_class_attendance_report.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
        logError(err)
      })
  }

  const handleTabChange = (value, tab) => {
    setCurrentTab(tab)
    setLoading(true)
    setCurrentPage(0)
    setIsTabDisabled(true)
  }

  const handleUploadResources = (id, type) => {
    setClassId(id)
    setIsModalOpen(true)
    setModalType(type)
  }

  const handleUploadQuiz = (id, variant, index) => {
    setSelectedIndex(index)
    setClassId(id)
    setIsQuizModal(true)
    setModalVariant(variant)
  }

  // const onGlobalSelectorChange = (data) => {
  //   setSelectorData(data)
  // }

  const handleClickGrade = (gradeValues) => {
    // setSelectedSubjectIds([])
    setSelectorData('')
    let gradeIds = []
    gradeValues.forEach(function (grade) {
      gradeIds.push(grade.value)
    })
    setGradeId(gradeIds)
  }
  const handleClickSubject = (event) => {
    let subjectIds = []
    event.forEach(function (subject) {
      subjectIds.push(subject.value)
    })
    setSelectedSubjectIds(subjectIds)
  }

  const handleChangeDate = (value, type) => {
    if (value === '') {
      setStartDate('')
      setEndDate('')
    } else if (type === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const submissionClickHandler = (id) => {
    const { history } = props
    history.push({
      pathname: '/teacher-report/viewHomeworkSubmission',
      state: {
        id,
        isOnlineClass: true
      }
    })
  }

  const handleBulkExcelDownload = () => {
    let path = `${urls.TeacherOnlineClass}?is_completed=${currentTab !== 0 ? 'True' : 'False'}&is_cancelled=${'False'}&is_download=True`
    if (Object.keys(selectorData).length) {
      const { branch_acad_id: branchId, acad_branch_grade_mapping_id: gradeId } = selectorData
      if (gradeId) {
        path += `&grade_id=${gradeId}`
      } else {
        path += `&branch_acad_id=${branchId}`
      }
    }

    if (selectedSubjectIds.length) {
      path += `&subject_ids=${selectedSubjectIds}`
    }

    if (startDate && endDate) {
      path += `&start_date=${startDate}&end_date=${endDate}`
    }

    if (fetchClassesAssignsToGuestudentsOnly) {
      path += `&is_guest_student=True&page_number=${currentPage + 1}&page_size=${pageSize}`
      if (gradeIds.length) {
        path += `&grade_id=${gradeIds}`
      }
    }

    axios.get(path, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + token.current
      }
    })
      .then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'online_class_attendance_report.xls'
        link.click()
        link.remove()
      })
      .catch(err => {
        console.log(err)
        logError(err)
      })
  }

  const clearData = () => {
    setgSelectKey(new Date().getTime())
    setSelectorData('')
    setSelectedSubjectIds([])
    setStartDate('')
    setEndDate('')
    if (currentPage === 0) {
      setClearCount(clearCount + 1)
    } else {
      setCurrentPage(0)
    }
  }

  const handleAssignQuestionPaper = () => {
    const classesCopy = classes
    classesCopy[selectedIndex]['online_class']['quiz_question_paper'] = true
    setClasses(classesCopy)
  }

  const columns = [
    {
      Header: 'SL_NO',
      id: 'sln',
      width: 100,
      Cell: row => {
        return <div style={{ textAlign: 'center' }}>{(pageSize * currentPage + (row.index + 1))}</div>
      }
    },
    {
      Header: 'Title',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.online_class.title}</div>
      }
    },
    {
      Header: 'Subject',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.online_class.subject.subject_name}</div>
      }
    },
    {
      Header: 'Start Time',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.online_class.start_time}</div>
      }
    },
    {
      Header: 'Zoom Email',
      width: 200,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.presenter.email}</div>
      }
    },
    {
      Header: 'Join Class',
      Cell: ({ original, index }) => {
        return <div style={{ textAlign: 'center' }}>
          <Button
            size='small'
            variant='contained'
            color='primary'
            disabled={!isJoinTime(classes[index].online_class.join_time, classes[index].online_class.end_time) || original.is_canceled}
            onClick={() => { handleJoin(original.id) }}
          >
            {hasClassEnded(classes[index].online_class.end_time) ? 'Class ended' : 'Join'}
          </Button>
        </div>
      }
    },
    {
      Header: 'Status',
      show: currentTab !== 1,
      width: 200,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.is_canceled ? 'Class Canceled' : ''}</div>
      }
    },

    {
      Header: 'Group Name',
      show: fetchClassesAssignsToGuestudentsOnly,

      Cell: ({ original }) => {
        let values = [ original.online_class.groups ].filter((item) => item != null)[0]
        return <div>{values ? values.map((item, index) => <li>{item}</li>) : ''}</div>
      }
    },
    {
      Header: 'Attendee List',
      show: currentTab !== 0,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={() => { props.history.push(`/online_class/attendee_list/${original.id}`) }}
          >
           Attendee List
          </Button>
        </div>
      }
    },
    {
      Header: 'Download Excel',
      show: false,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={() => { handleDownloadExcel(original.id) }}
          >
              Download Excel
          </Button>
        </div>
      }
    },
    // {
    //   Header: 'Recordings',
    //   show: currentTab !== 0,
    //   Cell: ({ original }) => {
    //     return <div style={{ textAlign: 'center' }}>
    //       <Button
    //         variant='contained'
    //         color='primary'
    //         onClick={() => { showRecordingsFor(original.id) }}
    //       >
    //           View
    //       </Button>
    //     </div>
    //   }
    // },
    {
      Header: 'Actions',
      width: currentTab === 0 ? 250 : 300,
      Cell: ({ original, index }) => {
        return (
          <div>
            <Tooltip title='Upload Resources'>
              <IconButton
                onClick={() => { handleUploadResources(original.online_class.id, 'resource') }}
              >
                <UploadResourceIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Upload Homework'>
              <IconButton
                onClick={() => { handleUploadResources(original.online_class.id, 'homework') }}
              >
                <UploadHomeworkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Upload Quiz'>
              <IconButton
                onClick={() => { handleUploadQuiz(original.online_class.id, 'UPLOAD_QUIZ') }}
              >
                <QuizIcon />
              </IconButton>
            </Tooltip>
            { currentTab !== 0 ? (<Tooltip title='View Submission'>
              <IconButton
                onClick={() => { submissionClickHandler(original.online_class.id) }}
              >
                <SubmissionIcon />
              </IconButton>
            </Tooltip>) : '' }
            {
              <React.Fragment>
                <Tooltip title='Attach Question Paper'>
                  <IconButton
                    onClick={() => { handleUploadQuiz(original.online_class.id, 'ATTACH_QP', index) }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Launch quiz'>
                  <Link
                    className={!original.online_class.quiz_question_paper ? 'online__class--disabled-link' : 'online__class--enabled-link'}
                    to={`/quiz/start/${original.online_class.id}`}
                    target='_blank'
                  >
                    <IconButton
                      disabled={!original.online_class.quiz_question_paper}
                    >
                      <Launch />
                    </IconButton>
                  </Link>
                </Tooltip>
              </React.Fragment>
            }

          </div>
        )
      }
    }
  ]

  let uploadModal = null
  if (isModalOpen) {
    uploadModal = (
      <Modal
        open={isModalOpen}
        click={() => setIsModalOpen(false)}
        large
      >
        <UploadModal
          id={classId}
          onClose={() => setIsModalOpen(false)}
          alert={alert}
          type={modalType}
        />
      </Modal>
    )
  }

  let quizModal
  if (isQuizModal) {
    quizModal = (
      <Modal
        open={isQuizModal}
        click={() => setIsQuizModal(false)}
      >
        {
          modalVariant === 'ATTACH_QP'
            ? <AssignQuestionPaper
              id={classId}
              onClose={() => {
                setIsQuizModal(false)
                setSelectedIndex(null)
              }}
              alert={alert}
              handleAssignQuestionPaper={handleAssignQuestionPaper}
            />
            : <QuizModal
              id={classId}
              onClose={() => setIsQuizModal(false)}
              alert={alert}
            />
        }

      </Modal>
    )
  }
  // console.log('I am beig called******')
  const toggleGueststudent = () => {
    setgSelectKey(new Date().getTime())
    setSelectedSubjectIds([])
    setSelectorData('')
    setGradeId([])
    setfetchClassesAssignsToGuestudentsOnly(!fetchClassesAssignsToGuestudentsOnly)
  }
  console.log(props)

  return (
    <div>
      <div position='static' color='default' style={{ marginBottom: 20, padding: '10px 10px 0px 10px', backgroundColor: '#f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', zIndex: 9999 }}>
          {
            fetchClassesAssignsToGuestudentsOnly ? <div style={{ margin: '0px 10px' }}>
              {/* <GSelect key={gSelectKey} config={COMBINATIONS} variant={'filter'} onChange={onGlobalSelectorChange} /> */}
              <OmsSelect
                label='Grade'
                key={gSelectKey}
                placeholder='Select..'
                isMulti
                options={
                  props.grades
                    ? props.grades.map(grade => ({
                      value: grade.id,
                      label: grade.grade
                    }))
                    : []
                }
                change={handleClickGrade}
              />
            </div> : ' '}
          <div style={{ margin: '0px 10px' }}>
            <OmsSelect
              label='Subject'
              key={gSelectKey}
              placeholder='Select..'
              isMulti
              options={
                props.subject
                  ? props.subject.map(subject => ({
                    value: subject.id,
                    label: subject.subject_name
                  }))
                  : []
              }
              change={handleClickSubject}
            />
          </div>

          <div style={{ margin: '10px 10px' }}>
            <TextField
              value={startDate}
              id='start-date'
              label='From date'
              type='date'
              InputLabelProps={{
                shrink: true
              }}
              onChange={(event) => { handleChangeDate(event.target.value, 'start') }}
            />
            {/* <Input
              type='date'
              value={startDate}
              onChange={(e) => { handleChangeDate(e.target.value, 'start') }}
            /> */}
          </div>
          <div style={{ margin: '10px 10px' }}>
            <TextField
              value={endDate}
              id='end-date'
              label='To date'
              type='date'
              InputLabelProps={{
                shrink: true
              }}
              onChange={(event) => {
                handleChangeDate(event.target.value, 'end')
              }}
            />
            {/* <Input
              type='date'
              value={endDate}
              onChange={(e) => { handleChangeDate(e.target.value, 'end') }}
            /> */}
          </div>
          <div style={{ margin: '15px 10px' }}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              disabled={!gradeIds.length && !selectedSubjectIds.length && !Object.keys(selectorData).length && (!startDate || !endDate)}

              // disabled={!selectedSubjectIds.length && !Object.keys(selectorData).length && (!startDate || !endDate)}
              onClick={getClasses}
            >
            Get Classes
            </Button>
          </div>
          <div style={{ margin: '15px 10px' }}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              disabled={!gradeIds.length && !selectedSubjectIds.length && !Object.keys(selectorData).length && (!startDate || !endDate)}

              // disabled={!selectedSubjectIds.length && !Object.keys(selectorData).length && (!startDate || !endDate)}
              onClickCapture={handleBulkExcelDownload}
            >
            Download Bulk Excel
            </Button>
          </div>

          <div style={{ margin: '10px 10px' }}>
            <Button
              style={{ margin: 5 }}
              onClick={clearData}
              variant='outlined'
              color='primary'
              size='small'
            >
              <ClearIcon />
            Clear
            </Button>
          </div>
        </div>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label='simple tabs example'>
              <Tab label='Upcoming Classes' disabled={isTabDisabled} />
              <Tab label='Completed Classes' disabled={isTabDisabled} />
            </Tabs>
          </Grid>
          <Grid item style={{ marginLeft: 30 }}>
          View Cancelled Classes only
            <Switch color='primary'
              onClick={() => {
                setCurrentPage(0)
                setfetchCancelledClasses(!fetchCancelledClassesOnly)
              }}
            />
          </Grid>

          <Grid item style={{ marginLeft: 30 }}>
          View Classes Assign to Gueststudent
            <Switch color='primary'
              onClick={() => {
                toggleGueststudent()
              }}
            />
          </Grid>
        </Grid>
      </div>
      <AppBar position='static' color='default' style={{ marginBottom: 20 }} />
      <ReactTable
        manual
        data={classes || []}
        columns={columns}
        page={currentPage}
        pages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page)
          setLoading(true)
        }}
        defaultPageSize={pageSize}
        loading={loading}
      />
      {uploadModal}
      {quizModal}
      {/* <RecordingsModal showRecordings={showRecordings} handleRecordingsToggle={handleRecordingsToggle} loadingFiles={loadingFiles} recordedFiles={recordedFiles} /> */}
    </div>
  )
}

const mapStateToProps = state => ({
  subject: state.subjects.items,
  grades: state.grades.items

})

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects()),
  listGrades: dispatch(apiActions.listGrades())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllotedClasses))
