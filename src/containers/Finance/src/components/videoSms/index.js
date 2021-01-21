import React, { useState } from 'react'
import {
  Typography,
  Divider,
  makeStyles,
  Button,
  Grid,
  TextField
} from '@material-ui/core'
import {
  CloudUpload as UploadIcon,
  HighlightOffOutlined as CloseIcon
} from '@material-ui/icons'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { fileUploadStyles, fileUploadButton } from './videoSms.styles'
import { urls } from '../../urls'

const allowedExtensions = ['mp4', 'mkv', 'webm']

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
        disabled={otherProps.disabled}
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
  alert
}) => {
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState('')

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
    if (files.length === 0 || message.length === 0) {
      alert.warning('1 File and Message is required')
      return
    }
    const formData = new FormData()
    formData.append('communication_file', files[0])
    formData.append('communication_content', message)
    axios.post(urls.VideoMessageCommunication, formData, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      alert.success('Submitted Successfully')
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
      <Divider />
      <Grid container>
        <Grid item xs={12} md={6}>
          <TextField
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            margin='normal'
            rows={6}
            label='Message'
            placeholder='Type your message here'
            inputProps={{ maxLength: 500, border: '0px' }}
            variant='outlined'
            fullWidth
            style={{ marginTop: '20px' }}
            InputLabelProps={{ shrink: true }}
          />
          <p>Allowed Characters Left : {500 - message.length} </p>
        </Grid>
      </Grid>
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
        accept='video/*'
        disabled={files.length > 0}
      />
      <div className={classes.submitButton}>
        <Button
          color='primary'
          variant='contained'
          onClick={submitFilesHandler}
        >
          Submit
        </Button>
      </div>
      <Typography variant='caption' className={classes.note}>
        *** Accepted Files are: Video
      </Typography>
    </div>
  )
}

export default FileUpload
