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

import { fileUploadStyles, fileUploadButton } from './fileUpload.styles'

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
  title,
  alert,
  isMobile,
  onUpload,
  onDelete,
  onSubmit,
  allowedExtensions
}) => {
  const [files, setFiles] = useState([])
  const classes = useStyles()

  const uploadFileHandler = (e) => {
    onUpload(e)
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

  return (
    <div className={classes.container}>
      <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.heading}>
        {title}
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
          onClick={onSubmit}
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
