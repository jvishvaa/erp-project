import React, { useState } from 'react'
import axios from 'axios'
import { Button, Grid, AppBar, CardContent, Card, Typography } from '@material-ui/core'
import { GetApp, Clear } from '@material-ui/icons'
import Dropzone from 'react-dropzone'
import { urls } from '../../urls'
import ExcelError from './classErrors'

const guidlines = [
  'Please use the template given below for upload. Click on the Template Button to download it.',
  'All the fields present in the template need to be filled for creating the classes.',
  'You can create a maximum of 100 class at a time.',
  'For date, the format should be like DD/MM/YYYY . Eg. For 28th May 2020, enter 28/05/2020',
  'For time, use the 24 Hour format like HH:MM:SS . Eg. for 2:30PM, enter 14:30:00 It is mandatory to enter seconds as well.',
  'You can assign a class to multiple groups by entering group names separated by commas. Eg Grade1_Section1, Grade1_Section2, Grade3_Section3',
  'Email ID of the Tutor should be valid.(It is case sensitive)',
  'If you are creating multiple class for the same Tutor, make sure those classes do not overlap.'
]
export default function BulkClassCreation (props) {
  const [listOfErr, setListOfErr] = useState([])
  const [files, setFiles] = useState([])
  const [foundErr, setFoundErr] = useState(false)
  const [openModel, setOpenModel] = useState(false)
  const [firstStepValidationErr, setFirststepValidationErr] = useState([])
  const [loader, setLoader] = useState(false)
  const [ignore, setIgnore] = useState(false)
  const [notCreatedClass, setNotCreatedClass] = useState([])
  const [errAfterCreation, setErrAfterCreation] = useState(false)
  const [isDownload, setIsDownload] = useState(false)

  const uploadExcel = (ignore, isDownload) => {
    let uploadUrl = urls.ExcelDownloadForGuestStudent
    let formdata = new FormData()

    formdata.set('excel_file', files[0])
    if (ignore) {
      formdata.set('ignore_errors', 'true')
    }

    if (errAfterCreation && isDownload) {
      formdata.set('errors', JSON.stringify(notCreatedClass))
      formdata.set('is_download', 'true')
    }
    setLoader(true)
    axios.post(uploadUrl, formdata, {
      responseType: ignore || errAfterCreation ? 'arraybuffer' : 'json',

      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      if (errAfterCreation && isDownload) {
        setFoundErr(false)
        setOpenModel(false)
        setLoader(false)
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var linkForExcel = document.createElement('a')
        linkForExcel.href = window.URL.createObjectURL(blob)
        linkForExcel.download = 'Not_Created_Class_Lists.xls'
        linkForExcel.click()
        props.alert.success('Non created classes downloaded successfully')
        setErrAfterCreation(false)
        setIsDownload(false)
        setNotCreatedClass([])
      } else {
        setOpenModel(false)
        setFiles('')
        setFoundErr(false)
        setListOfErr([])
        setFirststepValidationErr([])
        setNotCreatedClass([])
        setErrAfterCreation(false)
        props.alert.success('Class creation is successfull.')
      }
    }).catch(err => {
      setLoader(false)
      console.log(err.response.data, ignore, err.response, notCreatedClass.length)
      if (ignore) {
        const blob = new Blob([err.response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'Ignored_Error_Lists.xls'
        link.click()
        props.alert.warning('Classes are created partially. Please use the downloaded excel to correct them and upload again.')
        setIgnore(false)
      } else if (err.response && err.response.data && err.response.status) {
        setFoundErr(true)
        if (err.response.data.hasOwnProperty('after_validation')) {
          setNotCreatedClass(err.response.data.error)
          setErrAfterCreation(err.response.data.after_validation)
          props.alert.warning('Classes are created partially. Click on the view errors and download the excel.')
        } else if (!err.response.data.hasOwnProperty('after_validation') && err.response.data.length) {
          let validStep = err.response && err.response.data.some(function (obj) {
            return 'message' in obj
          })

          if (validStep) {
            setFirststepValidationErr(err.response.data)
          } else {
            setListOfErr(err.response.data)
          }
          props.alert.error('Found some invalid data in excel file. Please correct them to create class')
        } else {
          props.alert.error('Something went wrong')
          setErrAfterCreation(false)
          setNotCreatedClass([])
          setFirststepValidationErr([])
          setListOfErr([])
          setOpenModel(false)
          setFoundErr(false)
          setIgnore(false)
          setIsDownload(false)
        }
      }
    })
  }

  const firstTemplate = () => {
    const template = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/online_class/bulk_class_template/Bulk_class_template.xlsx'
    window.open(template, '_blank')
  }

  const isExcelFormat = (files) => {
    if (files[0].name.match(/.(xls|xlsx|xlsm|xlsb|odf)$/i)) {
      return true
    }
    return false
  }

  const onDrop = (files) => {
    setFoundErr(false)
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
    setNotCreatedClass([])
    setErrAfterCreation(false)
  }

  const getFileNameAndSize = (files) => {
    if (files.length) {
      const fileName = files && files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
          <Clear
            className='clear__files'
            onClick={(event) => {
              event.stopPropagation()
              setFiles([])
              setListOfErr([])
              setFoundErr(false)
              setFirststepValidationErr([])
              setNotCreatedClass([])
              setErrAfterCreation(false)
            }}
          />
        </li>
      ))
      return fileName
    }
    return null
  }

  const handleErrors = () => {
    if (listOfErr.length > 0) {
      setIgnore(true)
      uploadExcel(true, false)
    } else if (notCreatedClass.length > 0) {
      setIsDownload(true)
      setErrAfterCreation(true)
      uploadExcel(false, true)
    }
  }

  return (
    <React.Fragment>
      <div style={{ height: '75vh' }}>

        <Grid container spacing={3}>
          <Grid item xs={12} >
            <AppBar position='absolute' color='default' style={{ padding: 10, 'margin-left': '10px' }}>

              <div >

                <Dropzone onDrop={onDrop}>
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept
                  }) => (
                    <div>

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

                          <input {...getInputProps()} accept='.xls,.xlsx,.xlsm,.xlsb,.odf' />
                          <div>
                            {isDragAccept && 'Only excel files will be accepted'}
                            {!isDragActive && 'Drag and drop or Upload an excel'}

                          </div>
                          {getFileNameAndSize(files)}

                        </CardContent>
                      </Card>

                    </div>
                  )}
                </Dropzone>
              </div>

            </AppBar>
          </Grid>
          <Grid >

            <Typography style={{ color: 'black', 'font-style': 'bold', 'font-size': '31px', 'font-variant': 'all-small-caps', 'margin-top': '7.5%', 'margin-left': '4%' }}>Guidelines</Typography>

            <ul>
              {
                guidlines.map((guide, index) => {
                  return (
                    <li style={{ width: 'auto', 'font-family': 'sans-serif', 'font-size': 'large', 'list-style-type': 'none', 'margin-left': '4%', color: index % 2 === 0 ? 'indianred' : 'green' }}>{guide}</li>
                  )
                })
              }
            </ul>
            <div style={{ display: 'flex', 'margin-top': '2%' }}>
              <Button variant='contained' color='primary' onClick={() => firstTemplate()} style={{ 'margin-left': '4%', 'margin-top': '3px' }}startIcon={<GetApp />}>Template</Button>
              &nbsp;&nbsp;&nbsp;

              <Button variant='contained' disabled={loader || !files.length || errAfterCreation} color='primary'onClick={() => uploadExcel(ignore, isDownload)} style={{ 'margin-left': '2%', 'margin-top': '3px' }}>Upload</Button>
          &nbsp;&nbsp;&nbsp;
              {
                foundErr || listOfErr.length || firstStepValidationErr.length ? <Button variant='contained' color='secondary' style={{ height: 'fit-content', 'margin-left': '2%', 'margin-top': '3px' }} onClick={() => setOpenModel(!openModel)}>View errors</Button>
                  : ''
              }

              <ExcelError loadingStatus={loader} open={openModel} toggle={() => setOpenModel(!openModel)} errorList={listOfErr} firstValidationErrors={firstStepValidationErr} ignoreErrorCase={() => handleErrors()} notCreatedClass={notCreatedClass} />

            </div>

          </Grid>

          <Grid />

        </Grid>
      </div>
    </React.Fragment>
  )
}
