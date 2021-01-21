/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react'
import axios from 'axios'

// import { makeStyles } from '@material-ui/core/styles'

import { Button, Grid, AppBar, CardContent, Card } from '@material-ui/core'
import { GetApp } from '@material-ui/icons'

import Dropzone from 'react-dropzone'
import { urls } from '../../urls'
import ExcelError from './excelError'

// const useStyles = makeStyles(theme => ({
//   typography: {
//     padding: theme.spacing(2)
//   }
// }))

export default function CreateClassByExcel (props) {
  console.log(props)
  // const classes = useStyles()

  const [listOfErr, setListOfErr] = useState([])
  const [files, setFiles] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [isExcel, setIsExcel] = useState(true)
  const [foundErr, setFoundErr] = useState(false)
  // const [anchorEl, setAnchorEl] = React.useState(null)
  const [openModel, setOpenModel] = useState(false)
  const [firstStepValidationErr, setFirststepValidationErr] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)

  // const downloadTemplate = (event) => {
  //   setAnchorEl(event.currentTarget)
  // }

  const uploadExcel = () => {
    let uploadUrl = urls.ExcelDownloadForGuestStudent
    let formdata = new FormData()
    formdata.set('excel_file', files[0])
    setLoader(true)
    axios.post(uploadUrl, formdata, {

      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      setLoader(false)
      props.alert.success(res.status)
    }).catch(err => {
      setLoader(false)
      if (err.response && err.response.data) {
        let validStep
        if (typeof (err.response.data) === 'object') {
          validStep = err.response && err.response.data.some(function (obj) {
            return 'message' in obj
          })
        }

        setFoundErr(true)
        if (validStep) {
          if (typeof (err.response.data) === 'object') {
            setFirststepValidationErr(err.response.data)
          }
        } else {
          if (typeof (err.response.data) === 'object') {
            setListOfErr(err.response.data)
          }
        }
        props.alert.error('Found some errors,while class creation')
      }
    })
  }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  const firstTemplate = () => {
    const template1 = `https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/online_class/bulk_class_template/bulk_class_template.xlsx`
    const win = window.open(template1, '_blank')
    if (win !== null) {
      win.focus()
    }
  }

  const isExcelFormat = (files) => {
    if (files[0].name.match(/.(xls|xlsx|xlsm|xlsb|odf)$/i)) {
      setIsExcel(true)
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
    setFirststepValidationErr([])
    setListOfErr([])
  }

  const getFileNameAndSize = (files) => {
    if (files.length) {
      const fileName = files && files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
      return fileName
    }
    return null
  }

  const handleIgnoreError = () => {
    let uploadUrl = urls.ExcelDownloadForGuestStudent
    let formdata = new FormData()
    formdata.set('excel_file', files[0])
    formdata.set('ignore_errors', 'true')
    setLoading(true)
    axios.post(uploadUrl, formdata, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      setLoading(false)
      props.alert.success(res.status)
    }).catch(err => {
      setLoading(false)
      const blob = new Blob([err.response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      var link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'ignored_error_lists.xls'
      link.click()
      props.alert.error('Found error')
    })
  }
  // const open = Boolean(anchorEl)

  // const id = open ? 'simple-popover' : undefined

  return (
    <React.Fragment>
      <div >

        <Grid container spacing={3}>
          <AppBar position='absolute' color='default' style={{ padding: 10 }}>

            <Grid item xs={12} >
              <div>

                <Button variant='outlined' color='primary' onClick={() => firstTemplate()} style={{ 'margin-top': '10px', 'margin-left': '10px' }}startIcon={<GetApp />}>Download template</Button>

                {/* <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                >
                  <Typography className={classes.typography} onClick={() => firstTemplate()}>First template</Typography>
                  <Typography className={classes.typography}>Second template</Typography>

                </Popover> */}

              </div>
            </Grid>
          </AppBar>

          <Grid style={{ padding: 20 }}>
            <div style={{ marginTop: '25%' }}>
              <label style={{ display: 'block', marginBottom: 20 }}>Drop or Select your excel file to create class</label>
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
                      borderStyle: 'dotted',
                      padding: 30
                    }}
                    {...getRootProps()}
                    className='dropzone'
                  >
                    <CardContent>
                      <input {...getInputProps()} accept='.xls,.xlsx,.xlsm,.xlsb,.odf' />
                      <div>
                        {isDragAccept && 'Only excel files will be accepted'}
                        {!isDragActive && 'Drag and drop or Upload an excel'}
                      </div>
                      {getFileNameAndSize(files)}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
              <div style={{ display: 'flex' }}>
                <Button variant='contained' disabled={loader} color='primary'onClick={() => uploadExcel()} style={{ 'margin-left': '8%', 'margin-top': '10px' }}>Upload</Button>
                &nbsp;&nbsp;&nbsp;
                {
                  foundErr ? <Button variant='contained' color='secondary' style={{ height: 'fit-content', 'margin-top': '10px' }} onClick={() => setOpenModel(!openModel)}>View errors</Button>
                    : ''
                }
              </div>
              <ExcelError loadingStatus={loading} open={openModel} toggle={() => setOpenModel(!openModel)} errorList={listOfErr} firstValidationErrors={firstStepValidationErr} ignoreErrorCase={() => handleIgnoreError()} />
            </div>
          </Grid>

          <Grid />

        </Grid>
      </div>
    </React.Fragment>
  )
}
