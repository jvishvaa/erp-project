
import React, { useEffect, useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { ListItemText, List, ListItem, ListSubheader, Divider } from '@material-ui/core'
import { NoteAddRounded, Visibility, LaunchRounded, CloseRounded, GetAppRounded } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { fileUploadButton } from '../resourceModal.styles'

import { urls } from '../../../../urls'
import MediaListItem from './mediaListItem'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, handleClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions)

function CircularProgressWithLabel (props) {
  return (
    <Box position='relative' display='inline-flex'>
      <CircularProgress variant='static' {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography variant='h5' component='div' color='textSecondary'>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

// CustomButton component
function CustomFileUpload (props) {
  const useStylesButton = makeStyles(fileUploadButton)
  const classes = useStylesButton()
  const { className, ...otherProps } = props
  return (
    <div className={[classes.wrapper, className].join(' ')}>
      <Button
        color='primary'
        fullWidth
      >
          Add Submission <NoteAddRounded />
        <input type='file' className={classes.fileInput} {...otherProps} />
      </Button>
    </div>
  )
}

export const HomeworkStudentModal = ({ id, onClose, isOpen = true, alert, files, setFiles }) => {
  const [description, setDescription] = useState('')
  const [homeworkFiles, setHomeworkFiles] = useState([])
  const [studentSubmissions, setStudentSubmissions] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [somethingWentWrong, setSomethingWentWrong] = useState(false)
  const user = useSelector(state => state.authentication.user)
  const allowedExtensions = ['ogg', 'mpeg', 'wav', 'mp3', 'mp4', 'mkv', 'webm', 'png', 'jpeg', 'jpg', 'pdf']
  useEffect(() => {
    const resMetaInfo = {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }
    let url
    url = urls.OnlineClassHomeworkUpload
    setIsLoading(true)
    axios.get(
      `${url}?id=${id}`,
      resMetaInfo
    ).then(response => {
      if (!Array.isArray(response.data.data)) {
        const data = response.data.data
        const homeworks = data.homework
        const studentSubmissions = data.student_submission
        const homework = homeworks[0]
        const homeworkFiles = homeworks[0].homeworkfile
        const description = homework.description
        setDescription(description)
        setStudentSubmissions(studentSubmissions)
        setHomeworkFiles(homeworkFiles)
        setFiles([])
        setIsLoading(false)
      } else {
        setSomethingWentWrong(true)
        setIsLoading(false)
        if (response.data.message === 'No homework assigned') {
          setMessage('No homework assigned')
        }
      }
    }).catch(err => {
      console.log(err)
      setSomethingWentWrong(true)
      setIsLoading(false)
    })
  }, [id, setFiles, user])

  const reload = () => {
    const resMetaInfo = {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }
    let url
    url = urls.OnlineClassHomeworkUpload
    setIsLoading(true)
    setSomethingWentWrong(false)
    axios.get(
      `${url}?id=${id}`,
      resMetaInfo
    ).then(response => {
      if (!Array.isArray(response.data.data)) {
        const data = response.data.data
        const homeworks = data.homework
        const studentSubmissions = data.student_submission
        const homework = homeworks[0]
        const homeworkFiles = homeworks[0].homeworkfile
        const description = homework.description
        setDescription(description)
        setStudentSubmissions(studentSubmissions)
        setHomeworkFiles(homeworkFiles)
        setFiles([])
        setIsLoading(false)
      } else {
        setSomethingWentWrong(true)
        setIsLoading(false)
        if (response.data.message === 'No homework assigned') {
          setMessage('No homework assigned')
        }
      }
    }).catch(err => {
      console.log(err)
      setSomethingWentWrong(true)
      setIsLoading(false)
    })
  }

  const uploadFileHandler = (e) => {
    console.log('File uploaded')
    if (e.target.files[0]) {
      const tempArr = e.target.files[0].name.split('.')
      const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported'
      if (!allowedExtensions.includes(ext)) {
        alert.warning('Unsupported File Type')
        return
      }
      const newFiles = [...files, e.target.files[0]]
      console.log('New File', newFiles)
      setFiles(newFiles)
    }
  }
  const removeFileHandler = (i) => {
    const newFiles = files.filter((_, index) => index !== i)
    setFiles(newFiles)
  }

  const submitFilesHandler = () => {
    if (files.length === 0 && homeworkFiles.length !== 0) {
      alert.warning('Minimum 1 file is required')
      return
    }
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files`, files[index])
    })
    formData.set('online_class_id', id)
    setIsUploading(true)
    axios.post(urls.HomeWorkSubmission, formData, {
      headers: {
        Authorization: 'Bearer ' + user
      },
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted)
      }
    }).then(response => {
      setIsUploading(false)
      alert.success('Work Submitted Successfully')
      reload()
    }).catch(err => {
      console.error(err)
      setIsUploading(false)
      alert.warning((err.response &&
        err.response.data &&
        err.response.data.status &&
        err.response.data.status[0].status) ||
        'Something Went Wrong')
    })
  }

  return (
    <div>
      <Dialog maxWidth='lg' fullWidth onClose={onClose} aria-labelledby='customized-dialog-title' open={isOpen}>
        <DialogTitle id='customized-dialog-title' handleClose={onClose}>
          Homework
        </DialogTitle>
        <DialogContent dividers>
          {(isUploading || isLoading || somethingWentWrong) && <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, width: '100%', height: '100%', background: 'white', zIndex: 100 }} >
            {isUploading && <><CircularProgressWithLabel size={72} value={progress} /> <div style={{ padding: 16 }}>Uploading...</div></>}
            {isLoading && <><CircularProgress size={72} /><div style={{ padding: 16 }}>Loading...</div></>}
            {somethingWentWrong && <><div style={{ padding: 16 }}>Oops! {message || 'Something went wrong.'}.</div> <Button autoFocus onClick={reload} color='primary'>
           Try again
            </Button></>}
          </div>}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <List
                subheader={
                  <ListSubheader component='div' id='nested-list-subheader'>
                      Files
                  </ListSubheader>
                }>
                {homeworkFiles.map((homeworkFile) => {
                  const splittedPath = homeworkFile.homework.split('/')
                  let fileName = splittedPath[splittedPath.length - 1]
                  return (
                    <MediaListItem reload={reload} allowAttempt id={homeworkFile.id} fileName={fileName} source={homeworkFile.homework} />
                  )
                })}
                {homeworkFiles.length === 0 && 'No Files'}
              </List>
              <List
                subheader={
                  <ListSubheader component='div' id='nested-list-subheader'>
                    Description
                  </ListSubheader>
                }>
                <ListItem ><ListItemText primary={description} /></ListItem>
              </List>
              <List
                subheader={
                  <ListSubheader component='div' id='nested-list-subheader'>
                    Help
                  </ListSubheader>
                }>
                <ListItem >&nbsp;&nbsp;<Visibility />&nbsp;&nbsp;-&nbsp;&nbsp;<ListItemText primary={'View'} /></ListItem>
                <ListItem >&nbsp;&nbsp;<LaunchRounded />&nbsp;&nbsp;-&nbsp;&nbsp;<ListItemText primary={'Attempt Online'} /></ListItem>
                <ListItem >&nbsp;&nbsp;<CloseRounded />&nbsp;&nbsp;-&nbsp;&nbsp;<ListItemText primary={'Remove'} /></ListItem>
                <ListItem >&nbsp;&nbsp;<GetAppRounded />&nbsp;&nbsp;-&nbsp;&nbsp;<ListItemText primary={'Download'} /></ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List
                subheader={
                  <ListSubheader component='div' id='nested-list-subheader'>
                    Submissions
                  </ListSubheader>
                }>
                {studentSubmissions.map((studentSubmission) => {
                  const splittedPath = studentSubmission.submission.split('/')
                  let fileName = splittedPath[splittedPath.length - 1]

                  return (
                    <MediaListItem fileName={fileName} source={studentSubmission.submission} />
                  )
                })}
                {studentSubmissions.length === 0 && 'No Submissions Yet. Add Files To Submit'}
                <Divider />
                {
                  files.map((file, i) => {
                    let fileName = file.name
                    return (
                      <MediaListItem index={i} onRemove={() => removeFileHandler(i)} fileName={fileName} source={URL.createObjectURL(file)} />
                    )
                  })
                }
              </List>
              <CustomFileUpload
                onChange={uploadFileHandler}
                isMobile={window.isMobile}
                accept='image/*, audio/*, video/*, application/pdf'
              />
              ** Supported formats are jpeg, png, jpg, mp4, mp3, pdf.
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {files.length > 0 && <Button disabled={isLoading || isUploading} autoFocus onClick={submitFilesHandler} color='primary'>
           Save changes
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  )
}
