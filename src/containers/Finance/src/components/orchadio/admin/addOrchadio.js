import React, { useState, useEffect } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import {
  Grid,
  Tooltip,
  IconButton,
  Divider,
  TextField,
  Button,
  makeStyles,
  Typography,
  CircularProgress as FileProgress

} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import {
  HighlightOffOutlined as CloseIcon,
  AddCircleOutline as AddIcon,
  // EditOutlined as EditIcon,
  CloudUpload as UploadIcon,
  // AlarmOn as CheckIcon,
  CheckCircleOutline
  //

} from '@material-ui/icons'

import axios from 'axios'
import moment from 'moment'
// import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiActions } from '../../../_actions'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'
import {
  secondsToTime,
  // getSparseDate,
  getParsedDate,
  getFormattedDate,
  getFormattedHrsMnts
} from '../../../utils'

import styles from './orchadioAdmin.styles'

const allowedExtensions = ['ogg', 'mpeg', 'wav', 'mp3']
const useStyles = makeStyles(styles)

const AddOrchadio = ({
  isExisting,
  user,
  alert
}) => {
  const [dateTime, setDateTime] = useState([new Date()])
  const [existingDateTime, setExistingDateTime] = useState([])
  const [candidates, setCandidates] = useState([{}])
  const [existingCandidates, setExistingCandidates] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [file, setFile] = useState(null)
  const [fileDuration, setFileDuration] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [avlStatus, setAvlStatus] = useState([false])
  const [albumName, setAlbumName] = useState(null)
  const [assignProgramTo, setAssignProgramTo] = useState(null)
  const [key, setKey] = useState(0)
  const assignProgramToList = [
    { label: 'Orchids', value: '0' },
    { label: 'College', value: '1' },
    { label: 'Broadcast', value: '2' }
  ]

  const dispatch = useDispatch()
  const branches = useSelector(state => state.branches.items)
  const classes = useStyles()

  useEffect(() => {
    dispatch(apiActions.listBranches())
  }, [ dispatch ])

  useEffect(() => {
    let timer
    if (file) {
      const audio = document.createElement('audio')
      audio.src = URL.createObjectURL(file)
      setShowProgress(true)
      timer = setTimeout(() => {
        if (audio.readyState === 4) {
          setFileDuration(audio.duration)
        }
        setShowProgress(false)
      }, 2000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [file])

  // const getDateAndTime = (givenDate) => {
  //   const selectedDate = new Date(givenDate)
  //   const year = selectedDate.getFullYear()
  //   const month = (selectedDate.getMonth() + 1).toString().padStart(2, 0)
  //   const date = (selectedDate.getDate()).toString().padStart(2, 0)
  //   const hours = (selectedDate.getHours()).toString().padStart(2, 0)
  //   const minutes = (selectedDate.getMinutes()).toString().padStart(2, 0)

  //   const dateToSend = `${year}-${month}-${date}`
  //   const time = `${hours}:${minutes}`

  //   return [dateToSend, time]
  // }

  const dateTimeChangeHandler = (date, index) => {
    const _date = new Date(date)
    console.log('Dated++++', _date.getFullYear(), _date.getMonth(), _date.getHours(), _date.getMinutes())
    const newDateTime = isExisting ? [...existingDateTime] : [...dateTime]
    newDateTime[index] = date
    isExisting ? setExistingDateTime(newDateTime) : setDateTime(newDateTime)
  }

  const branchChangeHandler = (event) => {
    setSelectedBranch(event.value)
  }

  const assignToChangeHandler = (event) => {
    setAssignProgramTo(event.value)
  }

  const removeRowHandler = (index, id, type) => {
    if (!isExisting) {
      if (type === 'candidate') {
        const newList = candidates.filter((_, i) => index !== i)
        setCandidates(newList)
        return
      }
      const newDateTime = dateTime.filter((_, i) => index !== i)
      setDateTime(newDateTime)
      const newAvlList = avlStatus.filter((_, i) => index !== i)
      setAvlStatus(newAvlList)
      return
    }

    if (type === 'candidate') {
      const newList = existingCandidates.filter((_, i) => index !== i)
      setExistingCandidates(newList)
      return
    }
    const newDateTime = existingDateTime.filter((_, i) => index !== i)
    setExistingDateTime(newDateTime)
    // axios.delete(`${urls.OnlineClassdateTime}xxxx?online_class_resource_link_id=${id}`, {
    //   headers: {
    //     Authorization: 'Bearer ' + user
    //   }
    // }).then(() => {
    //   const newLink = existingDateTime.filter((item) => +item.id !== +id)
    //   setExistingDateTime(newLink)
    //   alert.success('Record Deleted Successfully')
    // }).catch(err => {
    //   console.error(err)
    //   alert.warning('Failed to perform action')
    // })
  }

  const addRowHandler = (type) => {
    if (type === 'candidate') {
      const newList = [...candidates, {}]
      setCandidates(newList)
      return
    }
    const lastIndex = dateTime.length - 1
    const date = moment(dateTime[lastIndex]).add(fileDuration + 60, 'seconds')
    const newLink = [...dateTime, date.toDate()]
    const newAvlStatus = [...avlStatus, false]
    setAvlStatus(newAvlStatus)
    setDateTime(newLink)
  }

  // const editRowHandler = (i) => {
  //   const newexistingDateTime = [...existingDateTime]
  //   const record = { ...newexistingDateTime[i], isEditable: true }
  //   newexistingDateTime[i] = record
  //   setExistingDateTime(newexistingDateTime)
  // }

  const candidateListHandler = (e, i) => {
    const newList = isExisting ? [...existingCandidates] : [...candidates]
    const candidate = { ...newList[i] }
    candidate.name = e.target.value
    newList[i] = candidate
    isExisting ? setExistingCandidates(newList) : setCandidates(newList)
  }

  const uploadFileHandler = (e) => {
    const newFile = e.target.files[0]
    console.log('new File++++', newFile, secondsToTime(1820))
    if (newFile) {
      const tempArr = newFile.name.split('.')
      const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported'
      if (!allowedExtensions.includes(ext)) {
        alert.warning('Unsupported File Type')
        return
      }
      setFile(newFile)
      setDateTime([new Date()])
      setAvlStatus([])
    }
  }

  // const checkAvalabilityHandler = (i) => {
  //   const [date, time] = getDateAndTime(dateTime[i])
  //   const body = {
  //     schedule: [
  //       {
  //         date,
  //         time
  //       }
  //     ],
  //     duration: duration * 60
  //   }
  //   const newAvlStatus = [...avlStatus]
  //   axios.post(`${urls.OrchadioAvailability}`, body, {
  //     headers: {
  //       Authorization: `Bearer ${user}`
  //     }
  //   }).then(res => {
  //     if (res.data) {
  //       if (res.data.success === 'true') {
  //         alert.success('Slots Available')
  //         newAvlStatus[i] = true
  //         setAvlStatus(newAvlStatus)
  //       } else {
  //         newAvlStatus[i] = false
  //         setAvlStatus(newAvlStatus)
  //         res.data.data.forEach(err => alert.warning(err))
  //       }
  //     }
  //   }).catch(err => {
  //     console.error(err)
  //     newAvlStatus[i] = false
  //     setAvlStatus(newAvlStatus)
  //     alert.warning('Something Went Wrong')
  //   })
  // }

  const submitHandler = () => {
    const schedule = dateTime.map(dt => {
      // const [year, month, date, hours, minutes] = getSparseDate(dt)
      const [year, month, date, hours, minutes] = getParsedDate(dt)
      return {
        date: getFormattedDate(year, month, date),
        time: getFormattedHrsMnts(hours, minutes)
      }
    })

    const filterCandidate = candidates
      .filter(cdt => cdt.name)
      .map(cdt => cdt.name)
    if (!selectedBranch) {
      alert.warning('Branch Is Required')
      return
    }
    if (!albumName) {
      alert.warning('Album Name Is required')
      return
    }
    if (filterCandidate.length === 0) {
      alert.warning('Minimum 1 Candidate Required')
      return
    }
    if (+duration <= 0) {
      alert.warning('Correct Duration is required')
      return
    }
    if (!assignProgramTo) {
      alert.warning('Assigning is required')
      return
    }

    const formData = new FormData()
    formData.set('candidates', filterCandidate.join(', '))
    formData.set('program_name', albumName)
    formData.set('branch', selectedBranch)
    formData.set('duration', duration * 60)
    formData.set('file', file)
    formData.set('no_of_schedule', schedule.length)
    formData.set('program_for', assignProgramTo)
    schedule.forEach((item, index) => {
      formData.append(`schedule${index}`, JSON.stringify(item))
    })

    axios.post(`${urls.OrchadioList}`, formData, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    }).then(res => {
      if (res.data) {
        if (res.data.success === 'true') {
          alert.success('Successfully Scheduled')
          resetForm()
        } else {
          res.data.data.forEach(err => alert.warning(err))
        }
      }
    }).catch(err => {
      console.error(err)
      alert.warning('Something Went Wrong')
    })
  }

  const resetForm = () => {
    setSelectedBranch(null)
    setAlbumName(null)
    setAssignProgramTo(null)
    setFile(null)
    setFileDuration(0)
    setDuration(0)
    setDateTime([new Date()])
    setAvlStatus([false])
    setCandidates([{}])
    setExistingDateTime([])
    setExistingCandidates([])
    setKey(key + 1)
  }

  const getScheduleData = (resources) => {
    const addResourceSchedule = resources.map((item, i) => (
      <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }} key={`item-${i}`}>
        <Grid item xs={5} md={4}>
          <KeyboardDatePicker
            margin='normal'
            label='Select Date'
            format='dd/MM/yyyy'
            name='date'
            value={item}
            onChange={(date) => dateTimeChangeHandler(date, i)}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </Grid>
        <Grid item xs={5} md={4}>
          <KeyboardTimePicker
            margin='normal'
            id='time-picker'
            label='Pick Time'
            value={item}
            onChange={(date) => dateTimeChangeHandler(date, i)}
            KeyboardButtonProps={{
              'aria-label': 'change time'
            }}
          />
        </Grid>
        {
          (i > 0 || isExisting) && (
            <Grid item xs={3} md={1}>
              <Tooltip title='Remove'>
                <IconButton onClick={() => removeRowHandler(i, item.id)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )
        }
        {
          !isExisting && (
            <Grid item xs={3} md={1}>
              <Tooltip title='Add New'>
                <IconButton onClick={addRowHandler}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )
        }
        {/* <Grid xs={3} md={1}>
          <Tooltip title='Check Availability'>
            <IconButton onClick={() => checkAvalabilityHandler(i)}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </Grid> */}
        <Grid xs={3} md={1}>
          { avlStatus[i] && <CheckCircleOutline style={{ color: green[500] }} />}
        </Grid>
        <Grid xs={12}>
          <Divider />
        </Grid>
      </Grid>
    ))
    return addResourceSchedule
  }

  const getCandidateList = (candidateList) => {
    const list = candidateList.map((item, i) => (
      <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }} key={`item-${i}`}>
        <Grid item xs={4}>
          <TextField
            value={item.name || ''}
            onChange={(e) => candidateListHandler(e, i)}
            fullWidth
            label='Student Name'
          />
        </Grid>
        {
          (i > 0 || isExisting) && (
            <Grid item xs={4} md={1}>
              <Tooltip title='Remove'>
                <IconButton onClick={() => removeRowHandler(i, item.id, 'candidate')}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )
        }
        {
          !isExisting && (
            <Grid item xs={4} md={1}>
              <Tooltip title='Add New'>
                <IconButton onClick={() => addRowHandler('candidate')}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )
        }
        <Grid xs={12}>
          <Divider />
        </Grid>
      </Grid>
    ))

    return list
  }

  const getFileList = (arg) => {
    let fileList
    if (Array.isArray(arg)) {
      fileList = arg[0]
    } else {
      fileList = arg
    }

    fileList = (
      <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }}>
        <Grid item xs={10} md={5}>
          <Typography
            variant='h6'
            style={{ fontWeight: 'lighter' }}
          >
            {file.name}
          </Typography>
        </Grid>
        <Grid item xs={2} md={2}>
          {showProgress
            ? <FileProgress />
            : <Typography
              variant='body1'
              style={{ fontWeight: 'lighter' }}
            >
              {secondsToTime(fileDuration)}
            </Typography>
          }
        </Grid>
      </Grid>
    )

    return fileList
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems='flex-end'>
        <Grid item xs={10} md={4}>
          <OmsSelect
            label={'Branch'}
            options={branches ? branches.map(branch => ({
              value: branch.id,
              label: branch.branch_name
            }))
              : []
            }
            change={branchChangeHandler}
            classes={classes.branchSelect}
            key={key}
          />
        </Grid>
        <Grid item xs={10} md={4}>
          <TextField
            value={albumName || ''}
            fullWidth
            required
            onChange={(e) => setAlbumName(e.target.value)}
            label='Album Name'
          />
        </Grid>
        <Grid item xs={10} md={4}>
          <OmsSelect
            label={'Assign to'}
            options={assignProgramToList}
            change={assignToChangeHandler}
            classes={classes.branchSelect}
            key={key}
          />
        </Grid>
      </Grid>
      <Divider style={{
        marginTop: '15px'
      }} />
      <Typography
        variant='h5'
        style={{
          textAlign: 'center',
          marginTop: '15px',
          fontWeight: 'lighter',
          textDecoration: 'underline'
        }}
        color='primary'
      >
        File Upload
      </Typography>
      {file && getFileList(file)}

      {/* <Link onClick={e => handleShareLink(e)}>hello</Link> */}
      <div className={classes.uploadButton}>
        <Button
          color='primary'
          variant='contained'
          size='large'
          startIcon={<UploadIcon />}
        >
          Upload File
          <input
            type='file'
            className={classes.fileInput}
            onChange={uploadFileHandler}
            accept='audio/*'
            key={key}
          />
        </Button>

      </div>
      {
        (
          isExisting ||
          (
            file &&
            fileDuration > 0 &&
            !showProgress
          )) && (
          <React.Fragment>
            <Divider style={{ marginTop: '20px' }} />
            <Typography
              variant='h5'
              style={{
                textAlign: 'center',
                marginTop: '15px',
                fontWeight: 'lighter',
                textDecoration: 'underline'
              }}
              color='primary'
            >
              Date And Time
            </Typography>
          </React.Fragment>
        )
      }
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {
          (file && fileDuration > 0 && !showProgress && (
            <Grid container style={{ marginTop: '25px', marginBottom: '20px' }}>
              <Grid xs={6}>
                <TextField
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  fullWidth
                  type='number'
                  label='Duration in minute'
                />
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))
        }
        {
          isExisting && getScheduleData(existingDateTime)
        }
        {
          (file && fileDuration > 0 && !showProgress && getScheduleData(dateTime))
        }
      </MuiPickersUtilsProvider>
      {
        (
          isExisting ||
          (
            file &&
            fileDuration > 0 &&
            !showProgress
          )) && (
          <React.Fragment>
            <Typography
              variant='h5'
              style={{
                textAlign: 'center',
                marginTop: '25px',
                fontWeight: 'lighter',
                textDecoration: 'underline'
              }}
              color='primary'
            >
              Candidate Names
            </Typography>
          </React.Fragment>
        )
      }
      {
        isExisting && getCandidateList(existingCandidates)
      }
      {
        (file && fileDuration > 0 && !showProgress && getCandidateList(candidates))
      }
      <Button
        color='primary'
        variant='contained'
        style={{
          display: 'block',
          marginTop: '25px'
        }}
        onClick={submitHandler}
      >
        {isExisting ? 'Update' : 'Schedule'}
      </Button>
    </React.Fragment>
  )
}

export default AddOrchadio
