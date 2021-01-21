/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Grid, Button, SwipeableDrawer, Paper, Table, TableBody, TableHead, TableRow, TableCell, Typography, Switch, AppBar, Card, CardContent, Modal, Checkbox } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CircularProgress from '@material-ui/core/CircularProgress'
import CancelIcon from '@material-ui/icons/Cancel'
import CreatableSelect from 'react-select'
// import _ from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { apiActions } from '../../../_actions'
import { qBUrls, urls } from '../../../urls'
import GSelect from '../../../_components/globalselector'
import PSelect from '../../../_components/pselect'
import Exporter from '../../../_components/pselect/exporter'
import { COMBINATIONS } from './configuration'
import { OmsSelect } from '../../../ui'
import AssignStudents from './AssignStudents'

import '../OnlineClass.css'

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow)

const CreateClass = (props) => {
  const maxAttendeeLimit = 300
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [starttime, setStarttime] = useState(new Date())
  const [title, setTitle] = useState('')
  const [attendeeLimit, setAttendeeLimit] = useState(300)
  const [duration, setDuration] = useState()
  const [presenterEmailCount] = useState(1)
  // eslint-disable-next-line no-unused-vars //TODO:
  const [isFormValid, setIsValidForm] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [subjectId, setSubjectId] = useState('')
  const [emailAddresses, setEmailAddress] = useState([])
  const [selectorData, setSelectorData] = useState({})
  const [year, setYear] = useState('2019-20')
  const [tutoremail, setTutoremail] = useState('')
  const [tutoremailVerifying, setTutoremailVerifying] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [AttendenceLimitError, setAttendeeLimitError] = useState(false)
  const [presenterEmailAddress, setPresenterEmailAddress] = useState([])
  const [studentDataCount, setStudentDataCount] = useState(0)
  const [showPresentEmail, setshowPresentEmail] = useState(false)
  const [dateStartTime, setDateStartTime] = useState(new Date())
  const [tutorEmail, settutemail] = useState([])
  const [emailVerify, setEmailVerified] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const role = JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  const [studentSelections, setStudentSelection] = useState({})
  const [isDisabled, setSubmitDisabled] = useState(false)
  const [tutorOccupiedClasses, setTutorOccupiedClasses] = useState([])
  const [joinLimit, setJoinLimit] = useState('')
  const [key, setKey] = useState(0)
  const [isGuestStudent, setIsGuestStudent] = useState(false)
  const [isExcel, setIsExcel] = useState(false)
  const [gradeId, setGradeId] = useState([])
  const [isPowerSelectorUsed, setIsPowerSelectorUsed] = useState(false)
  const webinarSubjects = ['NEET']
  const [maxJoinLimit, setMaxJoinLimit] = useState('')
  const [assignClassTo, setAssignClassTo] = useState([])
  const [files, setFiles] = useState([])
  const [showErrorList, setShowErrorList] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [groups, setGroups] = useState([])
  const [groupIds, setGroupIds] = useState([])
  const [isOptional, setIsOptional] = useState(false)
  const [description, setDescription] = useState('')
  const [isAssignedToAllBranches, setIsAssignedToAllBranches] = useState(false)
  const [isAssignedToParent, setIsAssignedToParent] = useState(false)
  const assignedTo = isOptional || isAssignedToAllBranches ? ['Student'] : ['Student', 'GuestStudent']

  useEffect(() => {
    setDateStartTime(getFormattedDate(new Date()))
  }, [])

  useEffect(() => {
    setEmailVerified(false)
    if (tutoremail && !isDisabled) {
      verifyTutorEmail()
    }
    // getPresenterEmail(starttime)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starttime, duration, selectedDate])

  useEffect(() => {
    if (props.resetForm) {
      setSubmitDisabled(false)
      setSelectedDate(new Date())
      setStarttime(new Date())
      setTitle('')
      setTutoremail('')
      setDuration('')
      setEmailVerified(false)
      setKey(key + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetForm])

  useEffect(() => {
    setSubmitDisabled(false)
  }, [props.isDisabled])

  useEffect(() => {
    axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      let{ acad_session: academicyear } = res.data
      setYear(academicyear)
    }).catch(err => {
      logError(err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user])

  const getFormatedTime = (time) => {
    const date = time
    let dateStr =
      ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2) + ':' +
      ('00')
    return dateStr
  }

  const getFormattedDate = (date) => {
    // returns date in yyyy-mm-dd hh:mm:ss
    // const date = new Date()
    let dateStr =
  date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
  ('00' + date.getDate()).slice(-2) + ' ' +
  ('00' + date.getHours()).slice(-2) + ':' +
  ('00' + date.getMinutes()).slice(-2) + ':' +
  ('00' + date.getSeconds()).slice(-2)
    return dateStr
  }

  const logError = (err) => {
    let { message = 'Failed to connect to server', response: { data: { status: messageFromDev } = {} } = {} } = err || {}
    if (messageFromDev) {
      props.alert.error(`${messageFromDev}`)
    } else if (message) {
      props.alert.error(`${message}`)
    } else {
      console.log('Failed', err)
    }
  }

  const getPresenterEmail = (timevalue) => {
    var date = moment(selectedDate).format('YYYY-MM-DD')
    const startTime = date + ' ' + getFormatedTime(timevalue)
    setDateStartTime(startTime)
    if (duration) {
      axios.get(`${qBUrls.PresenterEmail}?start_time=${startTime}&duration=${duration}`, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setPresenterEmailAddress(res.data)
        // setPresenterEmailCount(1)
        setshowPresentEmail(true)
      }).catch(err => {
        logError(err)
      })
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    // reset time when date changes
    const currentDate = new Date()
    if (date.getDate() <= currentDate.getDate() && !isBetweenNonSchedulingTime(date)) {
      setStarttime(new Date())
    }
  }

  const toggleDrawer = (open) => event => {
    setDrawer(open)
  }

  const getStudentIds = (data) => {
    setStudentSelection(data)
  }

  const getStudentData = (selectData) => {
    let { branch_id: branchId, acad_branch_grade_mapping_id: gradeMapId, section_mapping_id: sectionMapId } = selectData
    // var value = ''
    let formdata = new FormData()
    var paramsname = ''
    if (branchId && !gradeMapId && !sectionMapId) {
      paramsname = 'branch_id'
      formdata.append('branch_id', branchId)
    } else if (gradeMapId && branchId && !sectionMapId) {
      paramsname = 'mapping_acad_grade'
      formdata.append('mapping_acad_grade', gradeMapId)
    } else if (sectionMapId && gradeMapId && branchId) {
      paramsname = 'section_mapping'
      formdata.append('section_mapping', sectionMapId)
    } else if (sectionMapId) {
      paramsname = 'section_mapping'
      formdata.append('section_mapping', sectionMapId)
    }

    if (paramsname) {
      axios.post(`${qBUrls.StudentCount}`, formdata, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // setStudentData(res.data)
        setStudentDataCount(res.data)
      }).catch(err => {
        logError(err)
      })
    } else {
      setStudentDataCount(0)
    }
  }

  const handleGSelect = (data) => {
    setSelectorData(data)
    props.updateSelectorData(data)
    getStudentData(data)
    setStudentSelection({})
  }

  const handlePowerSelector = (data) => {
    const exporter = new Exporter()
    let { filter: { data: { itemData = {} } = {} } = {} } = props
    const sectionMappingIds = Object.values(itemData).map(item => item.id).join(',')
    if (sectionMappingIds !== '') {
      const selectedData = { section_mapping_id: sectionMappingIds }
      setSelectorData(selectedData)
      getStudentData(selectedData)
      setIsPowerSelectorUsed(true)
      props.updateSelectorData(selectedData)
    } else {
      setIsPowerSelectorUsed(false)
    }
  }

  const handleInputChange = (value, setState) => {
    if (setState === setAttendeeLimit) {
      setState(value)
      if (value <= maxAttendeeLimit && value !== 0) {
        setAttendeeLimitError(false)
        setAttendeeLimit(value)
      } else {
        setAttendeeLimitError(true)
      }
      setEmailAddress([])
      // setSelectedDropDoownEmail('')
    } else if (setState === setJoinLimit) {
      if (Number(value) <= maxJoinLimit || Number(value) === 500 || Number(value) === 1000) {
        setState(value)
      }
    } else {
      setState(value)
    }
  }

  const handleGrade = (data) => {
    const gradeIds = data.map(role => {
      return role.value
    })
    setGradeId(gradeIds)
  }

  const handleSubject = (subject) => {
    const { label, value } = subject
    if (webinarSubjects.includes(label)) {
      setMaxJoinLimit(100)
    } else {
      setMaxJoinLimit(300)
    }
    setSubjectId(value)
    setJoinLimit('')
  }

  const renderInputField = (inputType, label, value, setState, isDisabled = false, placeHolder) => {
    return (
      <Grid item xs={12} sm={6} md={4}>

        <div>
          <label className='online__class--form-label'>{label}</label>
          <input
            placeholder={placeHolder}
            disabled={isDisabled}
            min='0'
            type={inputType}
            className='form-control'
            value={value}
            onChange={({ target }) => { handleInputChange(target.value, setState, label) }}
          /></div>

      </Grid>
    )
  }

  const handleTutorEmailAddress = (e, index) => {
    setTutoremail(e.target.value)
    setEmailVerified(false)
    setTutorOccupiedClasses([])
    if (!tutorEmail[index]) {
      tutorEmail.splice(index, 0, e.target.value)
    } else {
      tutorEmail[index] = e.target.value
    }
  }

  const verifyTutorEmail = (showError) => {
    const email = tutorEmail[0]
    if (email && email.length > 0 && starttime && !isBetweenNonSchedulingTime(starttime)) {
      let date = moment(selectedDate).format('YYYY-MM-DD')
      const startTime = date + ' ' + getFormatedTime(starttime)
      setTutorOccupiedClasses([])
      setTutoremailVerifying(true)
      axios.get(`${qBUrls.VerifyTutorEmail}?tutor_email=${email}&start_time=${startTime}&duration=${duration}&is_optional=${isOptional ? 'True' : 'False'}`, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setEmailVerified(true)
        setTutoremailVerifying(false)
      }).catch(err => {
        let { data: { occupied_classes_data: occupiedClassesData = [] } = {} } = err.response || {}
        setTutorOccupiedClasses(occupiedClassesData)
        setEmailVerified(false)
        setTutoremailVerifying(false)
        logError(err)
      })
    } else if (isBetweenNonSchedulingTime(starttime)) {
      setEmailVerified(false)
      if (showError) {
        window.alert(' Classes cannot be scheduled between 9PM and 6AM. Please check the Start Time.')
      }
    } else {
      setEmailVerified(false)
      // window.alert('please verify email')
    }
  }

  const handleBlur = (e) => {
    // eslint-disable-next-line no-unused-vars
    const { value } = e.target
    const isValid = value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    if (isValid) {
      verifyTutorEmail(true)
    }
  }

  const renderEmailFields = (value) => {
    console.log(value)
    const inputs = []
    for (let i = 0; i < Number(presenterEmailCount); i++) {
      inputs.push(
        <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0' }}>
          <label className='online__class--form-label'>Tutor Email</label><br />
          <input
            placeholder='Email'
            min='0'
            type='text'
            className='form-control'
            style={{ width: 500, display: 'inline' }}
            onChange={(e) => { handleTutorEmailAddress(e, i) }}
            onBlur={handleBlur}
            disabled={!duration}
            value={tutoremail}
          />
          {
            emailVerify
              ? <CheckCircleOutlineIcon style={{ color: 'green', fontSize: 20 }} />
              : tutoremailVerifying ? <span>Verifying....</span>
                : ''
          }

          {tutoremail && !(tutoremail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) ? <span style={{ color: 'red', marginLeft: '20px' }}>Please Enter valid email</span> : ''}
          <div>
            {(tutorOccupiedClasses && Array.isArray(tutorOccupiedClasses) && tutorOccupiedClasses.length)
              ? <React.Fragment>
                <Typography variant='h6' style={{ margin: '10px 0px', color: 'red' }}>Tutor Occupied with following classes, Please schedule accordingly</Typography>
                <Paper style={{ width: '70%' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align='center'>Title</StyledTableCell>
                        <StyledTableCell align='center'>Start Time</StyledTableCell>
                        <StyledTableCell align='center'>End Time</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tutorOccupiedClasses && Array.isArray(tutorOccupiedClasses) && tutorOccupiedClasses.map(occupiedClass => {
                        let { stat_time_stamp: startTimeStamp, end_time_stamp: endTimeStamp, class_title: classTitle } = occupiedClass
                        return <StyledTableRow key={classTitle}>
                          <StyledTableCell align='center'>{classTitle}</StyledTableCell>
                          <StyledTableCell align='center'>{startTimeStamp ? new Date(startTimeStamp).toDateStringWithAMPM() : 'Sorry, Unable to parse time'}</StyledTableCell>
                          <StyledTableCell align='center'>{endTimeStamp ? new Date(endTimeStamp).toDateStringWithAMPM() : 'Sorry, Unable to parse time'}</StyledTableCell>
                        </StyledTableRow>
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </React.Fragment>
              : ''}
          </div>
        </Grid>
      )
    }
    return inputs
  }

  const isBetweenNonSchedulingTime = (value) => {
    const nonSchedulingStartTime = '21:00:00'
    const nonSchedulingEndTime = '05:59:00'
    const hours = value.getHours()
    const minutes = value.getMinutes()
    const selectedTime = ('00' + hours).slice(-2) + ':' +
    ('00' + minutes).slice(-2) + ':' +
    ('00')

    if (selectedTime < nonSchedulingStartTime && selectedTime > nonSchedulingEndTime) {
      return false
    }
    return true
  }

  const handleTimeInHrChange = (value) => {
    if (!isNaN(value.getHours())) {
      if (!isBetweenNonSchedulingTime(value)) {
        // if(selectedDate is today then time must grter than currenthous)
        const currentDate = new Date()
        if (selectedDate.getDate() === currentDate.getDate()) {
          if (value.getHours() >= currentDate.getHours()) {
            setStarttime(value)
          } else {
            props.alert.error('Start time hours should be greater than current hour')
          }
        } else {
          setStarttime(value)
        }
      } else {
        window.alert(' Classes cannot be scheduled between 9PM and 6AM. Please check the Start Time.')
      }
    } else {
      setStarttime(value)
    }
  }

  const renderStartTime = (label, value, setState) => {
    return (<Grid item xs={12} sm={6} md={3}>
      <label className='online__class--form-label'>{label}</label>
      <KeyboardTimePicker
        style={{ display: 'block' }}
        id='time-picker'
        value={starttime}
        onChange={handleTimeInHrChange}
        KeyboardButtonProps={{
          'aria-label': 'change time'
        }}
      />
    </Grid>)
  }

  function handlevalidate () {
    let { branch_id: branchId, acad_branch_grade_mapping_id: gradeMapId, section_mapping_id: sectionMapId } = selectorData
    if (selectedDate && starttime && title && (assignClassTo.length) && attendeeLimit && subjectId && joinLimit && (branchId || gradeMapId || sectionMapId || gradeId.length || files.length || isAssignedToAllBranches)) {
      if (gradeMapId) {
        branchId = ''
      }
      if (sectionMapId) {
        branchId = ''
        gradeMapId = ''
      }

      const ids = studentSelections.objects && studentSelections.objects.map(student => {
        return student.id
      })
      var date = moment(selectedDate).format('YYYY-MM-DD')
      const startTime = date + ' ' + getFormatedTime(starttime)

      const dataforCreaeClass = {
        startTime: startTime,
        duration: duration,
        title: title,
        attendeelimit: attendeeLimit,
        // presenterEmail: presenterEmail,
        tutorEmail: tutorEmail,
        subjectId: subjectId,
        gradeMap: gradeMapId,
        sectionMap: sectionMapId,
        sectionmapping: sectionMapId,
        branchId: branchId,
        studentsIds: ids || '',
        joinLimit: joinLimit,
        role: assignClassTo,
        gradeId: gradeId,
        isPowerSelector: isPowerSelectorUsed,
        isExcel,
        files,
        groups: groupIds,
        isOptional: isOptional ? 'True' : 'False',
        description: description,
        isAssignedToAllBranches: isAssignedToAllBranches,
        isAssignedToParent: isAssignedToParent ? 'True' : 'False'
      }
      if ((studentDataCount && studentDataCount.student_count && studentDataCount.student_count <= attendeeLimit && emailVerify) || ((gradeId || isExcel || isAssignedToAllBranches) && emailVerify)) {
        props.handleSubmit(dataforCreaeClass)
      } else {
        if (studentDataCount && studentDataCount.student_count <= 0) {
          props.alert.error('Number of students found were 0. Please reselect accordingly')
          setSubmitDisabled(false)
        } else if (!emailVerify) {
          props.alert.error(`enter valid email`)
          setSubmitDisabled(false)
        } else if (studentDataCount && studentDataCount.student_count > maxJoinLimit) {
          // props.alert.error(`No of students(${studentDataCount.student_count}) Exceeded ${maxJoinLimit}, please select student's accordingly`)
          props.handleSubmit(dataforCreaeClass)
          // setSubmitDisabled(false)
        } else {
          props.alert.error('Something went wrong....')
          setSubmitDisabled(false)
        }
      }
    } else {
      setIsValidForm(false)
      setShowErrorMessage(true)
      setSubmitDisabled(false)
    }
  }

  const handleExcel = (e) => {
    const { checked } = e.target
    setIsExcel(checked)
    setIsGuestStudent(false)
    setSelectorData({})
    // setAssignClassTo([])
    setGradeId('')
    setGroupIds([])
    setGroups([])
    setKey(key + 1)
    setFiles([])
    setIsAssignedToAllBranches(false)
  }

  const handelAssignRoles = (allRoles) => {
    // eslint-disable-next-line no-debugger
    // debugger
    if (!Array.isArray(allRoles)) {
      allRoles = [allRoles]
    }
    if (allRoles.length) {
      const roles = allRoles.map(role => {
        return role.value
      })
      console.log(roles, 'role')

      if (roles.length === 1 && roles.includes('GuestStudent')) {
        setIsGuestStudent(true)
        setSelectorData({})
        setStudentSelection({})
        setGradeId('')
        setGroupIds([])
        setGroups([])
      } else {
        setGradeId('')
        setGroupIds([])
        setGroups([])
        setIsGuestStudent(false)
        setStudentSelection({})
        // setSelectorData({})
      }
      setAssignClassTo(roles)
    } else {
      setIsGuestStudent(false)
      setSelectorData({})
      setAssignClassTo([])
      setKey(key + 1)
      setGroupIds([])
      setGroups([])
    }
  }

  const getFileNameAndSize = (fileList) => {
    if (fileList.length) {
      const fileName = fileList && fileList.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
          <ClearIcon
            className='clear__files'
            onClick={(event) => {
              event.stopPropagation()
              setFiles([])
              props.resetErpErrors()
            }}
          />
        </li>
      ))
      return fileName
    }
    return null
  }

  const isExcelFormat = (files) => {
    if (files[0].name.match(/.(xls|xlsx|xlsm|xlsb|odf)$/i)) {
      return true
    }
    return false
  }

  const onDrop = (files) => {
    if (!isExcelFormat(files)) {
      props.alert.warning('Please select only excel file format')
      return
    } else if (files.length > 1) {
      props.alert.warning('You can select only one file at a time')
      return
    }
    setFiles(files)
  }

  const handleDownloadTemplate = () => {
    const s3FileLink = `https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/onlineclass/excel_template/excel_template.xlsx`
    const win = window.open(s3FileLink, '_blank')
    if (win !== null) {
      win.focus()
    }
  }

  const handleGroup = (data) => {
    const groupIds = data.map(group => {
      return group.value
    })
    setGroupIds(groupIds)
  }

  useEffect(() => {
    if (gradeId.length) {
      setShowLoader(true)
      getGroups()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeId])

  const getGroups = () => {
    axios.get(`${urls.ViewGroupOnlineClass}?grade_ids=${gradeId}`, {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // eslint-disable-next-line no-debugger
        const { data } = res.data
        setGroups(data)
        setShowLoader(false)
      })
      .catch(err => {
        logError(err)
      })
  }

  const handleOptional = (event) => {
    const { checked } = event.target
    if (checked) {
      setIsGuestStudent(false)
    }
    setStudentSelection({})
    setGradeId('')
    setIsGuestStudent(false)
    setSelectorData({})
    setAssignClassTo([])
    setKey(key + 1)
    setGroupIds([])
    setGroups([])
    setIsOptional(checked)
    settutemail([])
    setEmailVerified(false)
    setTutoremail('')
    setDescription('')
  }

  const handleAssignToParents = (event) => {
    const { checked } = event.target
    setIsAssignedToParent(checked)
  }

  const handleAllBranches = (event) => {
    const { checked } = event.target
    setIsAssignedToAllBranches(checked)
    setStudentSelection({})
    setGradeId('')
    setIsGuestStudent(false)
    setSelectorData({})
    setAssignClassTo([])
    setKey(key + 1)
    setGroupIds([])
    setGroups([])
    settutemail([])
    setEmailVerified(false)
    setTutoremail('')
  }

  return (
    <div>
      <AppBar position='static' color='default' style={{ padding: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <Switch color='primary'
              disabled={isDisabled || props.isDisabled}
              checked={isExcel}
              onClick={(e) => {
                props.resetErpErrors()
                handleExcel(e)
              }}
            />
            <Typography style={{ display: 'inline', fontSize: 16 }}>Create this class by uploading excel</Typography>
          </Grid>

          {
            isExcel
              ? <Grid item xs={12} sm={3} md={3}>
                <Button variant='contained' color='primary' style={{ marginLeft: 10 }} onClick={handleDownloadTemplate} >Download Excel Template</Button>
              </Grid>
              : ''
          }

          <Grid item xs={12} sm={4} md={4}>
            <Checkbox
              checked={isOptional}
              onChange={handleOptional}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <Typography style={{ display: 'inline', fontSize: 16 }}>
              Mark this class as optional
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Checkbox
              checked={isAssignedToParent}
              onChange={handleAssignToParents}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <Typography style={{ display: 'inline', fontSize: 16 }}>
              Assign this class to parents
            </Typography>
          </Grid>
        </Grid>
      </AppBar>
      <div style={{ padding: 20 }}>
        {
          showErrorMessage && !isFormValid
            ? <h3 style={{ color: 'red' }}>*Please fill all the fields</h3>
            : ''
        }

        <Grid container spacing={2} className='online__class--grid-container'>
          {renderInputField('text', 'Title :', title, setTitle)}
          {renderInputField('number', 'Duration (in min) :', duration, setDuration)}
          <Grid item xs={12} sm={4} md={4}>
            <OmsSelect
              // key={key}
              label='Subject'
              options={
                props.subjects
                  ? props.subjects.map(subject => ({
                    value: subject.id,
                    label: subject.subject_name
                  }))
                  : []
              }
              // defaultValue={this.state.sub}
              change={handleSubject}
            />
          </Grid>
          {renderInputField('number', 'Join Limit :', joinLimit, setJoinLimit, false, maxJoinLimit ? `You can enter 500 or 1000 or between 1-${maxJoinLimit}` : '')}

          {
            isOptional
              ? <Grid item xs={12} sm={6} md={4}>
                <div>
                  <label className='online__class--form-label'>{'Description (optional) :'}</label>
                  <br />
                  <textarea id='text_area' rows='4' cols='50' value={description} onChange={(e) => {
                    handleInputChange(e.target.value, setDescription)
                  }} />
                </div>
              </Grid>
              : ''
          }
        </Grid>
        <Grid container spacing={2} className='online__class--grid-container'>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12} sm={6} md={3}>
              <label className='online__class--form-label'>Pick date range</label>
              <KeyboardDatePicker
                style={{ display: 'block' }}
                disableToolbar
                variant='inline'
                format='dd/MM/yyyy'
                id='date-picker-inline'
                value={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
              />
            </Grid>
            {renderStartTime('Start time(in hr)', starttime, setStarttime)}
          </MuiPickersUtilsProvider>
        </Grid>
        {
          !isExcel
            ? <Grid container className='online__class--grid-container' style={{ position: 'relative' }}>
              <Checkbox
                checked={isAssignedToAllBranches}
                onChange={handleAllBranches}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <Typography variant='h5' style={{ display: 'inline', position: 'absolute', top: 5, left: 40 }} >
              Assign this class to all branches, grades and sections
              </Typography>
            </Grid>
            : ''
        }
        <Grid container className='online__class--grid-container'>
          {renderEmailFields(emailAddresses.tutorEmail)}
          {
            !isExcel
              ? <Grid xs={12} sm={4} md={4}>
                <label className='online__class--form-label'>Assign to</label>
                <OmsSelect
                  isMulti
                  placeholder='Select'
                  options={assignedTo
                    ? assignedTo.map(role => ({
                      value: role,
                      label: role
                    }))
                    : []}
                  change={handelAssignRoles}
                  key={key}
                />
              </Grid>
              : <Grid xs={12} sm={4} md={4}>
                <label className='online__class--form-label'>Assign to</label>
                <OmsSelect
                  placeholder='Select'
                  options={assignedTo
                    ? assignedTo.map(role => ({
                      value: role,
                      label: role
                    }))
                    : []}
                  change={handelAssignRoles}
                />
              </Grid>
          }
        </Grid>
        {
          !isExcel && !isAssignedToAllBranches
            ? <React.Fragment>
              {
                !isGuestStudent
                  ? <Grid container spacing={4} className='online__class--grid-container'>
                    <Grid item>
                      <GSelect key={key} variant={'selector'} config={COMBINATIONS} onChange={handleGSelect} />
                    </Grid>

                    {role === 'Admin' || role === 'Online Class Admin'
                      ? <React.Fragment>

                        <Grid item className='online__class--padding-20'>OR</Grid>
                        <Grid item className='online__class--padding-20'>
                          <PSelect key={props.count} section onClick={(e) => { handlePowerSelector(e) }} />
                        </Grid>
                      </React.Fragment>
                      : ''}
                    <Grid item>
                      {
                        studentDataCount
                          ? <Button variant='contained' style={{ backgroundColor: '#b2dfdb' }} onClick={() => { setDrawer(true) }}>Filter students</Button>
                          : ''
                      }
                    </Grid>
                  </Grid>
                  : ''
              }
              <Grid container spacing={2} className='online__class--grid-container'>
                {
                  isGuestStudent
                    ? <React.Fragment>
                      <Grid item xs={12} sm={5} md={5}>
                        <OmsSelect
                          isMulti
                          key={key}
                          label='Grade'
                          options={
                            props.grades
                              ? props.grades.map(grade => ({
                                value: grade.id,
                                label: grade.grade
                              }))
                              : []
                          }
                          // defaultValue={this.state.sub}
                          change={handleGrade}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={5}>
                        <label className='online__class--form-label'>Search/Select Group</label>
                        <CreatableSelect
                          isMulti
                          isDisabled={!groups.length && !gradeId.length}
                          onChange={handleGroup}
                          options={groups}
                          noOptionsMessage={() => {
                            if (groups.length) {
                              return 'No more groups'
                            } else {
                              return 'No groups found for this grade'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} md={2}>
                        {
                          showLoader
                            ? <CircularProgress style={{ marginTop: 15 }} />
                            : ''
                        }

                      </Grid>
                    </React.Fragment>
                    : ''
                }
              </Grid>
            </React.Fragment>
            : ''
        }
        <Grid container spacing={2} className='online__class--grid-container'>
          {
            isExcel
              ? <Grid item xs={12} sm={6} md={4} style={{ position: 'relative' }}>
                <label className='online__class--form-label'>Upload Excel</label>
                <Dropzone onDrop={onDrop}>
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept
                  }) => (
                    <Card
                      elevation={0}
                      style={{
                        border: '1px solid black',
                        borderStyle: 'dotted'
                      }}
                      {...getRootProps()}
                      className='dropzone'
                    >
                      <CardContent>
                        <input {...getInputProps()} accept='.xlsx, .xls, .xlsm, .xlsb, .odf' />
                        <div>
                          {isDragAccept && 'Only excel files will be accepted'}
                          {!isDragActive && 'Drag and drop or Click here to select an excel file'}
                        </div>
                        {getFileNameAndSize(files)}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid>
              : ''
          }
          <Grid item xs={12} sm={6} md={4}>
            {
              // isExcel
              props.errorErps.length && isExcel
                ? <Button variant='contained' color='secondary' style={{ marginTop: 30 }} onClick={() => { setShowErrorList(true) }}>View Invalid ERPS</Button>
                : ''
            }
            {
              showErrorList
                ? <Modal
                  open={showErrorList}
                  onClose={() => { setShowErrorList(false) }}
                >
                  <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>
                    <CancelIcon className='clear__files' style={{ float: 'right', marginBottom: 20 }} onClick={() => { setShowErrorList(false) }} />
                    <Table aria-label='customized table' style={{ width: '100%' }}>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell style={{ textAlign: 'center' }}>
                            <Typography variant='h6'>List of errors</Typography>
                          Please correct these ERP's or Username and Upload again to create a class</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          props.errorErps.map(row => {
                            return <StyledTableRow>
                              <StyledTableCell style={{ textAlign: 'center' }} component='th' scope='row'>
                                {row}
                              </StyledTableCell>
                            </StyledTableRow>
                          })
                        }
                      </TableBody>
                    </Table>
                  </div>
                </Modal>
                : ''
            }
          </Grid>
        </Grid>

        <Grid container>
          <Button
            disabled={(isDisabled || props.isDisabled)}
            variant='contained'
            color='primary'
            onClick={(e) => {
              props.resetErpErrors()
              setSubmitDisabled(true)
              handlevalidate()
            }}
          >{
              (isDisabled || props.isDisabled) ? 'Creating Class Please wait' : 'Create Class'
            }
          </Button>
        </Grid>
        <Grid container>
          <SwipeableDrawer
            anchor='right'
            open={drawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <AssignStudents alert={props.alert} selectorData={props.selectorData} getStudentIds={getStudentIds} selections={studentSelections} />
          </SwipeableDrawer>
        </Grid>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    roles: state.roles.items,
    user: state.authentication.user,
    branches: state.branches.items,
    subjects: state.subjects.items,
    student: state.student,
    grades: state.grades.items,
    sections: state.sectionMap.items,
    filter: state.filter
  }
}

const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles()),
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listGrades: dispatch(apiActions.listGrades()),
  listSections: () => dispatch(apiActions.listSections()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId) => dispatch(apiActions.getSectionMapping(acadMapId))

})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateClass))
