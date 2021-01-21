import React, { useState } from 'react'
import {
  Typography,
  Divider,
  makeStyles,
  Button,
  Grid
} from '@material-ui/core'
import {
  CloudUpload as UploadIcon,
  HighlightOffOutlined as CloseIcon
} from '@material-ui/icons'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { fileUploadStyles, fileUploadButton } from './fileUpload.styles'
import { urls } from '../../urls'

const allowedExtensions = ['ogg', 'mpeg', 'wav', 'mp3', 'mp4', 'mkv', 'webm', 'png', 'jpeg', 'jpg', 'pdf', 'mov', 'heic']

const useStylesButton = makeStyles(fileUploadButton)

const CustomFileUpload = (props) => {
  const classes = useStylesButton()
  const { className, ...otherProps } = props
  return (
    <div className={[classes.wrapper, className].join(' ')}>
      <Button
        color='primary'
        variant='contained'
        size={otherProps.isMobile ? 'small' : 'large'}
        startIcon={<UploadIcon />}
      >
        Upload File
        <input type='file' className={classes.fileInput} {...otherProps} />
      </Button>
    </div>
  )
}

const FileRow = (props) => {
  const { file, onClose, className } = props
  return (
    <div className={className}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h6'>
            {file.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <CloseIcon onClick={onClose} />
        </Grid>
      </Grid>
      <Divider />
    </div>
  )
}

const useStyles = makeStyles(fileUploadStyles)

const FileUpload = ({
  teacherReportId,
  alert,
  onClose,
  isMobile
}) => {
  const [files, setFiles] = useState([])
  const classes = useStyles()

  const user = useSelector(state => state.authentication.user)

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      const tempArr = e.target.files[0].name.split('.')
      const ext = tempArr.length ? tempArr[tempArr.length - 1] : 'unsupported'
      if (!allowedExtensions.includes(ext)) {
        alert.warning('Unsupported File Type')
        return
      }
      const newFiles = [...files, e.target.files[0]]
      setFiles(newFiles)
    }
  }

  const removeFileHandler = (i) => {
    const newFiles = files.filter((_, index) => index !== i)
    setFiles(newFiles)
  }

  const submitFilesHandler = () => {
    if (files.length === 0) {
      alert.warning('Minimum 1 file is required')
      return
    }
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files`, files[index])
    })
    formData.set('teacher_report_id', teacherReportId)
    console.log('++++++', formData)
    axios.post(urls.HomeWorkSubmission, formData, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      alert.success('Work Submitted Successfully')
      setTimeout(() => {
        onClose()
      }, 500)
    }).catch(err => {
      console.error(err)
      alert.warning((err.response &&
        err.response.data &&
        err.response.data.status &&
        err.response.data.status[0].status) ||
        'Something Went Wrong')
    })
  }

  return (
    <div className={classes.container}>
      <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.heading}>
        Upload Work Files
      </Typography>
      <Divider />
      {
        files.map((file, i) => (
          <FileRow
            file={file}
            onClose={() => removeFileHandler(i)}
            className={classes.fileRow}
          />
        ))
      }
      <CustomFileUpload
        className={classes.uploadButton}
        onChange={uploadFileHandler}
        isMobile={isMobile}
        accept='image/*, audio/*, video/*, application/pdf'
      />
      <div className={classes.submitButton}>
        <Button
          color='primary'
          variant='contained'
          onClick={submitFilesHandler}
          size={isMobile ? 'small' : 'large'}
        >
          Submit
        </Button>
      </div>
      <Typography variant='caption' className={classes.note}>
        *** Accepted Files are: Images, PDF, Audio and Video
      </Typography>
    </div>
  )
}

export default FileUpload
