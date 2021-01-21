import React, { Component } from 'react'
import { AppBar, Button, Grid, Card, CardContent, Typography } from '@material-ui/core'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import ErrorList from './ErrorList'
import { urls } from '../../urls'

const guidlines = [
  '1. Group names should be in lower case.',
  '2. Standard format for group name is as follows:',
  '"{grade}_section x" where, {grade} is Grade of guest student.',
  'grade mentioned in grade column and {grade} should be same.',
  'section spelling should be as mentioned, followed by a space.x can be any positive whole number (except zero).',
  '3. Valid group name examples:',
  'grade 2_section 01, grade 1_section 001, nursery_section 04 etc.',
  '4. Invalid group name examples:',
  'I. grade2_section 01 - Invalid due to absense of space between grade and 2, does not match with standard grade format i.e grade 2.',
  'II. grade 1section 001 - Inavlid due to absense of "_".',
  'III. nursery_section04 - Invalid due to absense of space between section and the number.',
  'IV. nursery_sevtion 04 - Invalid due to spelling mistake in group name.'
]
class CreateGroup extends Component {
    state={
      files: [],
      isOpen: false,
      errorList: [],
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      isUploading: false,
      count: 0
    }

    isExcelFormat = (files) => {
      if (files[0].name.match(/.(xls|xlsx|xlsm|xlsb|odf)$/i)) {
        return true
      }
      return false
    }

    handleUpload = (ignore) => {
      const { files, personalInfo, errorList, count } = this.state
      const formData = new FormData()
      formData.append('excel_file', files[0])
      formData.append('ignore_errors', ignore)
      this.setState({ errorList: ignore ? errorList : [], isUploading: true }, () => {
        axios.post(urls.CreateGroupOnlineClass, formData, {
          responseType: ignore ? 'arraybuffer' : 'json',
          headers: {
            Authorization: 'Bearer ' + personalInfo.token,
            'Content-Type': 'multipart/formData'
          }
        })
          .then(res => {
            if (!ignore) {
              this.props.alert.success(res.data.status)
            } else if (ignore) {
              const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
              var link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = 'error_list.xls'
              link.click()
              this.props.alert.success('Upload successfull & downloaded excel with all the errors')
            }
            this.setState({ errorList: [], files: [], isUploading: false, isOpen: false, count: count + 1 })
          })
          .catch(err => {
            let { response: { data: { status } = {}, data } = [], message } = err
            if (data && data.length > 0 && Array.isArray(data)) {
              this.setState({ errorList: data.flat() })
              this.props.alert.error('Found some invalid data in excel file. Please correct them and upload again to create group')
            } else if (!status && message) {
              this.props.alert.error('Something went wrong')
            }
            this.setState({ isUploading: false, checked: false })
          })
      })
    }

    onDrop = (files) => {
      if (!this.isExcelFormat(files)) {
        this.props.alert.warning('Please select only excel file format')
        return
      } else if (files.length > 1) {
        this.props.alert.warning('You can select only one file at a time')
        return
      }
      this.setState({ files: files, errorList: [] })
    }

    getFileNameAndSize = (files) => {
      if (files.length) {
        const fileName = this.state.files && this.state.files.map(file => (
          <li key={file.name}>
            {file.name} - {file.size} bytes
          </li>
        ))
        return fileName
      }
      return null
    }

    showError = () => {
      this.setState({ isOpen: true })
    }

    downloadTemplate = () => {
      const s3FileLink = `https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/class_group/group_creation.xlsx`
      const win = window.open(s3FileLink, '_blank')
      if (win !== null) {
        win.focus()
      }
    }

    uploadIgnoringErrors = () => {
      this.setState({ isIgnore: true }, () => {
        this.handleUpload(true)
      })
    }

    render () {
      const { files, isOpen, errorList, isUploading, count } = this.state
      return (
        <div>
          <AppBar position='static' color='default' style={{ padding: 10 }}>
            <Grid>
              <Button variant='contained' color='primary' onClick={this.downloadTemplate}>Download Template</Button>
            </Grid>
          </AppBar>
          <Grid>
            <Typography style={{ color: 'black', 'font-style': 'bold', 'font-size': '31px', 'font-variant': 'all-small-caps', 'margin-top': '1.5%', 'margin-left': '4%' }}>Guidelines</Typography>

            <ul>
              {
                guidlines.map((guide, index) => {
                  return (
                    <li style={{ width: 'auto', 'font-family': 'sans-serif', 'font-size': 'large', 'list-style-type': 'none', 'margin-left': '4%', color: index % 2 === 0 ? 'indianred' : 'green' }}>{guide}</li>
                  )
                })
              }
            </ul>
          </Grid>
          <Grid style={{ padding: 20 }}>
            <div style={{ marginTop: 30 }}>
              <label className='online__class--form-label' style={{ display: 'block', marginBottom: 20 }}>Drop or Select your excel file to group guest students</label>
              <Dropzone onDrop={this.onDrop}>
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
                      {this.getFileNameAndSize(files)}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </div>
          </Grid>
          <Grid>
            <Button variant='contained' color='primary' onClick={() => { this.handleUpload(false) }} style={{ marginLeft: 20, marginTop: 20 }} disabled={!files.length || isUploading}>
              {isUploading ? 'Uploading Please wait...' : 'Upload'}
            </Button>
            {
              errorList.length
                ? <Button onClick={this.showError} variant='contained' color='secondary' style={{ marginLeft: 20, marginTop: 20 }}>View Invalid Data</Button>
                : ''
            }
            <ErrorList count={count} isUploading={isUploading} uploadIgnoringErrors={this.uploadIgnoringErrors} resultData={errorList} openmodal={isOpen} toggle={(e) => this.setState({ isOpen: !isOpen })} />
          </Grid>
        </div>
      )
    }
}

export default CreateGroup
