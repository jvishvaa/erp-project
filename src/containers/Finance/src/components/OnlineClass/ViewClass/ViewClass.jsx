import React, { useState, useEffect, useCallback } from 'react'
import ReactTable from 'react-table'
import { makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Modal from '@material-ui/core/Modal'
import { Button, Tabs, Tab, Grid, IconButton, Tooltip, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { withRouter } from 'react-router'
import ClearIcon from '@material-ui/icons/Clear'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import { Link } from 'react-router-dom'
import {
  MenuBook as SubmissionIcon,
  FileCopy as UploadHomeworkIcon,
  PostAdd as UploadResourceIcon,
  LocalLibraryOutlined as QuizIcon,
  AttachFile as AttachFileIcon,
  Launch
} from '@material-ui/icons'

// import { Input } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'
import { urls } from '../../../urls'
import { OmsSelect, Modal as UploadModalWrapper } from '../../../ui'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../../_components/globalselector'
import { apiActions } from '../../../_actions'
import '../OnlineClass.css'
// import RecordingsModal from './recordingsModal'
import UploadModal from './uploadModal'
import QuizModal from './quizModal'
import AssignQuestionPaper from './AssignQuestionPaper'

function rand () {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle () {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  expanded: {
    margin: '0 auto'
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  textFieldArea: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: '100%',
    height: 'auto'
  },
  btn: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }
}))
const ViewClass = (props) => {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [classes, setClasses] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  const token = userProfile.personal_info.token
  const [isTabDisabled, setIsTabDisabled] = useState(true)
  const auditAccessRoles = ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator', 'Subjecthead', 'Planner', 'LeadTeacher', 'Online Class Admin']
  const cancelAccessRoles = ['Principal', 'Admin', 'EA Academics', 'AcademicCoordinator']
  const userRole = userProfile.personal_info.role
  const userEmail = userProfile.personal_info.email
  const canAudit = auditAccessRoles.includes(userRole)
  const canCancel = cancelAccessRoles.includes(userRole)
  const [fetchCancelledClassesOnly, setfetchCancelledClasses] = useState(false)
  const [fetchClassesAssignsToGuestudentsOnly, setfetchClassesAssignsToGuestudentsOnly] = useState(false)
  // const [ischecked, setChecked] = useState(false)
  const [userId, setUserId] = useState(undefined)
  const [isCanceling, setCanceling] = useState(undefined)
  const [remark, setRemark] = useState(undefined)
  const [open, setOpen] = React.useState(false)
  const textAreaRef = React.useRef(null)
  const classesStyles = useStyles()
  const [cancelId, setCancelId] = React.useState(undefined)
  const [classesCount, setClassesCount] = React.useState(undefined)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([])
  const [selectorData, setSelectorData] = useState('')
  const [gSelectKey, setgSelectKey] = useState(new Date().getTime())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bulkDownload, setBulkDownload] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [clearCount, setClearCount] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(0)
  // recordings related states
  // const [showRecordings, setShowRecordings] = useState(false)
  // const [recordedFiles, setRecordedFiles] = useState([])
  // const [loadingFiles, setLoadingFiles] = useState(false)
  const [classId, setClassId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [isQuizModal, setIsQuizModal] = useState(false)
  // const allowedBranchIdsToLaunchQuiz = [19, 8]
  const assignQuestionPaperAccessRoles = ['Principal', 'Admin', 'AcademicCoordinator', 'Planner', 'LeadTeacher']

  const [modalVariant, setModalVariant] = useState(null)

  const [gradeIds, setGradeId] = useState([])

  // recording related functions

  // const showRecordingsFor = (id) => {
  //   setLoadingFiles(true)
  //   // 60 52
  //   axios.get(`${urls.GetOnlineClassFiles}?zoom_meeting_id=${id}`, {
  //     headers: {
  //       Authorization: 'Bearer ' + token
  //     }
  //   })
  //     .then(res => {
  //       setRecordedFiles(res.data)
  //       setLoadingFiles(false)
  //     })
  //     .catch(err => {
  //       logError(err)
  //     })
  //   setShowRecordings(true)
  // }
  // const handleRecordingsToggle = () => {
  //   setShowRecordings(!showRecordings)
  // }

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle)
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const { page, size, presentTab } = getSearchParams()
    if (page && size) {
      setCurrentPage(Number(page) - 1)
      setPageSize(10)
      setCurrentTab(Number(presentTab))
    } else {
      props.history.push(`?size=${10}&page=${1}&presentTab=${0}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getClasses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTab, fetchCancelledClassesOnly, fetchClassesAssignsToGuestudentsOnly])

  const quizModalHandler = useCallback(() => {
    setIsQuizModal(false)
  }, [])

  const getSearchParams = () => {
    let { location: { search = '' } = {} } = props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }

  const getClasses = () => {
    setLoading(true)
    const { presentTab = 0, page = 1 } = getSearchParams()
    if ((Number(presentTab) === currentTab) && (Number(currentPage + 1) === Number(page))) {
      let path = `${urls.TeacherOnlineClass}?page_number=${currentPage + 1}&page_size=${pageSize}&is_completed=${currentTab !== 0 ? 'True' : 'False'}&is_cancelled=${fetchCancelledClassesOnly ? 'True' : 'False'}&is_guest_student=${fetchClassesAssignsToGuestudentsOnly ? 'True' : 'False'}&is_download=False`

      if (Object.keys(selectorData).length) {
        const { branch_acad_id: branchId, acad_branch_grade_mapping_id: gradeId } = selectorData

        if (gradeId) {
          path += `&acad_branch_grade_mapping_id=${gradeId}`
        } else {
          path += `&branch_acad_id=${branchId}`
        }
      }
      console.log(selectorData)
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
          Authorization: 'Bearer ' + token
        }
      })
        .then(res => {
          console.log(res.data.data)
          setClasses(res.data.data)
          setLoading(false)
          setTotalPages(res.data.total_pages)
          setIsTabDisabled(false)
          setUserId(res.data.user_id)

          let { count } = res.data || {}
          setClassesCount(count)
        })
        .catch(err => {
          logError(err)
          setLoading(false)
          setIsTabDisabled(false)
        })
    }
  }
  const cancelClass = (classId, remark) => {
    if (!cancelId || !remark || remark === '') {
      props.alert.warning('Please provide the reason for cancel')
      return
    }
    setCanceling(true)
    axios.delete(`${urls.CancelOnlineClass}?classIds=${String(classId)}&remark=${remark}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        // setClasses(res.data.data)
        setCanceling(false)
        handleClose()
        props.alert.success(res.data.status)
        getClasses()
      })
      .catch(err => {
        // handleClose()
        // getClasses()
        setCanceling(false)
        logError(err)
      })
  }

  const logError = (err, alertType = 'error') => {
    let { message, response: { data: { status: messageFromDev, err_msg: middleWareMsg } = {} } = {} } = err || {}
    let alertMsg
    if (messageFromDev) {
      alertMsg = messageFromDev
    } else if (middleWareMsg) {
      alertMsg = middleWareMsg
    } else if (message) {
      alertMsg = message
    } else {
      alertMsg = 'Failed to connect to server'
    }
    props.alert[alertType](`${alertMsg}`)
  }

  const handleDownloadExcel = (id) => {
    axios.get(`${urls.OnlineclassAttendeeList}?zoomMeetingId=${id}&type=excel`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + token
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
        logError(err)
      })
  }
  const handleHostAClass = (id) => {
    const path = `${urls.TeacherJoinClass}?zoomMeetingId=${id}&is_taken=true`
    axios.post(path, '', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        const { presenter_url: presenterUrl } = res.data
        window.open(presenterUrl, '_blank')
      })
      .catch(err => {
        logError(err)
      })
  }
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

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [remark])

  const isJoinTime = (joinTime, endTime) => {
    const currentTime = getFormattedDate()
    if (currentTime > joinTime && currentTime < endTime) {
      return true
    }
    return false
  }

  const hasClassEnded = (endTime) => {
    const currentTime = getFormattedDate()
    if (currentTime > endTime) {
      return true
    }
    return false
  }

  const handleUploadResources = (id, type) => {
    setClassId(id)
    setIsModalOpen(true)
    setModalType(type)
  }

  const handleUploadQuiz = (id, variant) => {
    setClassId(id)
    setIsQuizModal(true)
    setModalVariant(variant)
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

  const handleExpansion = (index) => (event, isExpanded) => {
    const classesCopy = classes
    classesCopy[index]['expanded'] = isExpanded
    setClasses(classesCopy)
  }

  const columns = [
    {
      Header: 'SL_NO',
      id: 'sln',
      width: 100,
      Cell: ({ original, index }) => {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
          {
            original.online_class.is_assigned_to_parent
              ? <SupervisorAccountIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: '#eb8f83' }} />
              : ''
          }
          <span style={{ marginTop: original.online_class.is_assigned_to_parent ? 10 : 0, fontWeight: 'bold' }}>{(pageSize * currentPage + (index + 1))}</span>
        </div>
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
      width: 150,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.online_class.start_time}</div>
      }
    },
    {
      Header: 'Duration',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.online_class.duration}-mins</div>
      }
    },
    {
      Header: 'Created By',
      Cell: (props) => {
        let { original: { online_class: { created_by_label: createdByLabel } = {}, created_by: createdBy } = {} } = props
        createdByLabel = createdByLabel && typeof (createdByLabel) === 'string' ? createdByLabel.replace('-', '\n') : createdByLabel

        return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{createdByLabel || createdBy}</div>
      }
    },
    {
      Header: 'Audit / Host',
      show: currentTab === 0,
      className: 'extendTableRowHeight',
      Cell: ({ original }) => {
        let { id, is_canceled: isCanceled,
          join_url: joinUrl,
          tutor,
          online_class: { join_time: joinTime, end_time: endTime } = {} } = original || {}
        const isClassEnded = hasClassEnded(endTime)
        const canHostClass = tutor === userId
        const notJoinTime = !isJoinTime(joinTime, endTime)
        if (isCanceled) {
          return <div style={{ textAlign: 'center' }} key={id}>Class Canceled</div>
        } else if (isClassEnded) {
          return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }} key={id}>Class Ended</div>
        } else {
          if (notJoinTime && !canHostClass && canAudit) {
            return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }} key={id}>{`Can audit after\n${joinTime}`}</div>
          }
          return <div style={{ textAlign: 'center' }}>
            {canHostClass
              ? <Button
                key={id}
                style={{ whiteSpace: 'pre-line' }}
                size='small'
                variant='contained'
                color='primary'
                disabled={notJoinTime}
                onClick={() => {
                  if (canHostClass) {
                    handleHostAClass(original.id)
                  }
                }}
              >
                Host class
              </Button>
              : canAudit
                ? <Button
                  key={id}
                  style={{ whiteSpace: 'pre-line' }}
                  size='small'
                  variant='contained'
                  color='primary'
                  disabled={notJoinTime}
                  onClick={() => {
                    if (canAudit) {
                      window.open(joinUrl, '_blank')
                    }
                  }}
                >
                  {`Audit ${notJoinTime ? `\n( Can audit at ${joinTime} )` : ''}`}
                </Button>
                : 'No Access to Audit'}
          </div>
        }
      }
    },
    {
      Header: 'Cancel class',
      width: 150,
      show: currentTab === 0 && canCancel && !fetchCancelledClassesOnly,
      Cell: (props) => {
        let { original, id, online_class: { join_time: joinTime, end_time: endTime } = {} } = props
        isJoinTime(joinTime, endTime)
        console.log(original)
        if (original.is_canceled) {
          return <div style={{ textAlign: 'center' }} key={id}>Class Canceled</div>
        } else if (isJoinTime(joinTime, endTime)) {
          return <div style={{ textAlign: 'center' }} key={id}>Can not cancel class after join time</div>
        } else if (!original.is_canceled) {
          return <div style={{ textAlign: 'center' }}>
            <Button
              size='small'
              disabled={isCanceling}
              variant='outlined'
              className={classesStyles.btn}
              color='secondary'
              onClick={() => {
                handleOpen()
                setCancelId(original.online_class.id)
              }} >
            Cancel Class
            </Button>
          </div>
        }
      }
    },
    {
      Header: 'Attendee List',
      width: 120,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={() => {
              currentTab === 0 ? props.history.push(`/online_class/attendee_list/${original.id}/?show=true`) : props.history.push(`/online_class/attendee_list/${original.id}/`)
            }}
          >
              Attendee List
          </Button>
        </div>
      }
    },
    {
      Header: 'Excel Download',
      show: false,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={() => { handleDownloadExcel(original.id) }}
          >
              Download Excel
          </Button>
        </div>
      }
    },
    {
      Header: 'Status',
      show: currentTab === 0 || (currentTab === 1 && fetchCancelledClassesOnly),
      className: 'extendTableRowHeight',
      width: 180,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>{original.is_canceled ? `Class Cancelled: ${original.online_class.remarks || '\nNo remarks found'}` : ''}</div>
      }
    },
    {
      Header: 'Group Name',
      show: fetchClassesAssignsToGuestudentsOnly,
      className: 'extendTableRowHeight',
      Cell: ({ original }) => {
        let values = [ original.online_class.groups ].filter((item) => item != null)[0]
        return <div>{values ? values.map((item, index) => <li>{item}</li>) : ''}</div>
      }
    },
    {
      Header: 'Tutor Email',
      width: 180,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{original.tutor_email ? original.tutor_email : ''}</div>
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
      Header: 'Zoom meeting Id',
      show: currentTab === 0,
      className: 'extendTableRowHeight',
      width: 180,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{original.meeting_id ? original.meeting_id : ''}</div>
      }
    },
    {
      Header: 'Actions',
      width: currentTab === 0 ? 250 : 300,
      Cell: ({ original }) => {
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
              assignQuestionPaperAccessRoles.includes(userRole) || userRole === 'Admin'
                ? <React.Fragment>
                  <Tooltip title='Attach Question Paper'>
                    <IconButton
                      onClick={() => { handleUploadQuiz(original.online_class.id, 'ATTACH_QP') }}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
                : ''
            }
            <Tooltip title='Launch quiz'>
              <Link
                className={
                  (original.online_class.quiz_question_paper &&
                  original.tutor_email === userEmail)
                    ? 'online__class--enabled-link' : 'online__class--disabled-link'}
                to={`/quiz/start/${original.online_class.id}`}
                target='_blank'
              >
                <IconButton
                  disabled={!original.online_class.quiz_question_paper ||
                    original.tutor_email !== userEmail}
                >
                  <Launch />
                </IconButton>
              </Link>
            </Tooltip>

          </div>
        )
      }
    },
    {
      Header: 'Join Limit',
      className: 'extendTableRowHeight',
      width: 180,
      Cell: (props) => {
        const { original: { online_class: onlineClass } = {} } = props || {}
        return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{onlineClass.guest_students_attendee_count ? onlineClass.guest_students_attendee_count : onlineClass.join_limit}</div>
      }
    },
    {
      Header: 'Description',
      className: 'extendTableRowHeight',
      width: 300,
      style: { 'whiteSpace': 'unset', height: 'auto' },
      Cell: (props) => {
        const { original: { online_class: onlineClass } = {}, index } = props || {}
        return <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
          {
            onlineClass.description
              ? <ExpansionPanel expanded={props.original.expanded} onChange={handleExpansion(index)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography className={classes.heading}>Click here to view description</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    {onlineClass.description ? onlineClass.description : ''}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              : ''
          }

        </div>
      }
    }
  ]

  const handleTabChange = (value, tab) => {
    setCurrentTab(tab)
    setLoading(true)
    setCurrentPage(0)
    setIsTabDisabled(true)
    props.history.push(`?size=${10}&page=${1}&presentTab=${tab}`)
  }
  const getClassCount = (tab) => {
    if (tab === currentTab && !loading) {
      return classesCount !== undefined ? `- ${classesCount}` : ''
    } else {
      return ''
    }
  }

  const onGlobalSelectorChange = (data, others) => {
    setSelectorData(data)
  }

  const handleClickSubject = (event) => {
    let subjectIds = []
    event.forEach(function (subject) {
      subjectIds.push(subject.value)
    })
    setSelectedSubjectIds(subjectIds)
  }

  useEffect(() => {
    if (currentPage === 0 && clearCount) {
      getClasses()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCount])

  const clearData = () => {
    setgSelectKey(new Date().getTime())
    setSelectorData('')
    setSelectedSubjectIds([])
    setGradeId([])
    setStartDate('')
    setEndDate('')
    if (currentPage === 0) {
      setClearCount(clearCount + 1)
    } else {
      setCurrentPage(0)
    }
    props.history.push(`?size=${10}&page=${1}&presentTab=${currentTab}`)
  }

  const handleGetClass = () => {
    props.history.push(`?size=${10}&page=${1}&presentTab=${currentTab}`)
    if (currentPage === 0) {
      getClasses()
    } else {
      setCurrentPage(0)
    }
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

  const handleBulkExcelDownload = () => {
    let path = `${urls.TeacherOnlineClass}?is_completed=${currentTab !== 0 ? 'True' : 'False'}&is_cancelled=${fetchCancelledClassesOnly ? 'True' : 'False'}&is_download=True`
    if (Object.keys(selectorData).length) {
      const { branch_acad_id: branchId, acad_branch_grade_mapping_id: gradeId } = selectorData
      if (gradeId) {
        path += `&acad_branch_grade_mapping_id=${gradeId}`
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
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'online_class_attendance_report.xls'
        link.click()
        link.remove()
        setBulkDownload(false)
      })
      .catch(err => {
        logError(err)
        setBulkDownload(false)
      })
  }

  const handleClickGrade = (gradeValues) => {
    // setSelectedSubjectIds([])
    setSelectorData('')
    let gradeIds = []
    gradeValues.forEach(function (grade) {
      gradeIds.push(grade.value)
    })
    setGradeId(gradeIds)
  }

  const toggleGueststudent = () => {
    setgSelectKey(new Date().getTime())
    setSelectedSubjectIds([])
    setSelectorData('')
    setGradeId([])
    setfetchClassesAssignsToGuestudentsOnly(!fetchClassesAssignsToGuestudentsOnly)
  }

  const handleAssignQuestionPaper = () => {
    setIsQuizModal(false)
  }

  let uploadModal = null
  if (isModalOpen) {
    uploadModal = (
      <UploadModalWrapper
        open={isModalOpen}
        click={() => setIsModalOpen(false)}
        large
      >
        <UploadModal
          id={classId}
          onClose={() => setIsModalOpen(false)}
          alert={props.alert}
          type={modalType}
        />
      </UploadModalWrapper>
    )
  }

  let quizModal
  if (isQuizModal) {
    quizModal = (
      <UploadModalWrapper
        open={isQuizModal}
        click={quizModalHandler}
      >
        {
          modalVariant === 'ATTACH_QP'
            ? <AssignQuestionPaper
              id={classId}
              onClose={() => {
                setIsQuizModal(false)
                // setSelectedIndex(null)
              }}
              alert={props.alert}
              handleAssignQuestionPaper={handleAssignQuestionPaper}
            />
            : <QuizModal
              id={classId}
              onClose={() => setIsQuizModal(false)}
              alert={props.alert}
            />
        }
      </UploadModalWrapper>
    )
  }

  return (
    <div>
      <div position='static' color='default' style={{ marginBottom: 20, padding: '10px 10px 0px 10px', backgroundColor: '#f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', zIndex: 9999 }}>
          {!fetchClassesAssignsToGuestudentsOnly ? <div style={{ margin: '0px 10px' }}>
            <GSelect key={gSelectKey} config={COMBINATIONS} variant={'filter'} onChange={onGlobalSelectorChange} />
          </div>
            : <div style={{ margin: '0px 10px' }}>
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
                // defaultValue={subjectData.valueSubject}
                change={handleClickGrade}
              />
            </div>
          }
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
              // defaultValue={subjectData.valueSubject}
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
              onClick={handleGetClass}
            >
            Get Classes
            </Button>
          </div>

          <div style={{ margin: '15px 10px' }}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              disabled={(!gradeIds.length && !selectedSubjectIds.length && !Object.keys(selectorData).length && (!startDate || !endDate)) || bulkDownload}
              onClick={() => {
                setBulkDownload(true)
                handleBulkExcelDownload()
              }}
            >
              {bulkDownload ? 'Please wait... This might take a while' : 'Download Excel'}
            </Button>
          </div> :

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
              <Tab label={`Upcoming Classes ${getClassCount(0)}`} disabled={isTabDisabled} />
              <Tab label={`Completed Classes ${getClassCount(1)}`} disabled={isTabDisabled} />
            </Tabs>
          </Grid>

          <Grid item style={{ marginLeft: 30 }}>
          View Cancelled Classes only
            <Switch color='primary'
              onClick={() => {
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
      <div className='color__indicator--container'>
        <div>
          <span className='color__indicator--green' />
          <Typography variant='h6' style={{ display: 'inline-block' }}>Optional Class</Typography>
        </div>
        <div>
          <SupervisorAccountIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: '#eb8f83' }} />
          <Typography variant='h6' style={{ display: 'inline-block' }}>Class assigned to Parents</Typography>
        </div>
      </div>
      <div style={{ zIndex: 1 }}>
        <ReactTable
          manual
          data={classes || []}
          columns={columns}
          page={currentPage}
          pages={totalPages}
          showPageSizeOptions={false}
          onPageChange={(page) => {
            setCurrentPage(page)
            props.history.push(`?size=${10}&page=${page + 1}&presentTab=${currentTab}`)
          }}
          defaultPageSize={pageSize}
          loading={loading}
          style={{ zIndex: 0 }}
          getTrProps={(state, rowInfo, column, instance) => {
            const { original: { online_class: onlineClass } = {} } = rowInfo || {}
            return {
              style: {
                background: onlineClass && onlineClass.is_optional ? 'linear-gradient(to right bottom, #9DFFBE, #fff)' : 'white'
              }
            }
          }
          }
        />
      </div>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={open}
        onClose={handleClose}

      >
        <div style={modalStyle} className={classesStyles.paper}>
          <TextField

            ref={textAreaRef}
            required
            key='Reason'
            type='textarea'
            className={classesStyles.textFieldArea}
            multiline
            label='Please Provide Reason'
            placeholder='Please Provide Reason'
            margin='normal'
            variant='outlined'
            value={remark || ''}
            onChange={e => {
              setRemark(e.target.value)
            }}
          />
          <br />
          <Button
            size='small'
            disabled={isCanceling}
            variant='outlined'
            color='secondary'
            onClick={() => { cancelClass(cancelId, remark) }}
          >              Cancel Class
          </Button>
        </div>
      </Modal>
      {/* <RecordingsModal showRecordings={showRecordings} handleRecordingsToggle={handleRecordingsToggle} loadingFiles={loadingFiles} recordedFiles={recordedFiles} /> */}
      {uploadModal}
      {quizModal}
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
)(withRouter(ViewClass))
