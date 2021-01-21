import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid, TextArea } from 'semantic-ui-react'
import { Card, CardContent, Button, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import axios from 'axios'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from '../questbox/config/combination'
import { urls } from '../../urls'
import './canvas.css'

class UploadEbook extends Component {
  constructor () {
    super()
    this.state = {
      grade_id: '',
      subject_id: '',
      file: '',
      ebookName: '',
      ebookDescription: '',
      ebookType: '',
      gSelectKey: new Date().getTime(),
      loading: false

    }
  }

onDrop = (file) => {
  this.setState({ file })
}
handleChange = (e) => {
  this.setState({ ebookType: e.target.value })
};
onChange = (data) => {
  for (let key in data) {
    this.setState({ [key]: data[key] })
  }
}

handleUpload = () => {
  this.setState({
    loading: true
  })
  const { grade_id: gradeId, ebookType: etype, subject_id: subjectId, file, ebookName, ebookDescription } = this.state
  let formData = new FormData()
  formData.append('files', file[0])
  formData.append('ebook_name', ebookName)
  formData.append('ebook_description', ebookDescription)
  formData.append('grade_id', gradeId)
  formData.append('ebook_type', etype)
  formData.append('subject_id', subjectId)
  axios.post(urls.EBOOK, formData, {
    headers: {
      Authorization: 'Bearer ' + this.props.user,
      'Content-Type': 'multipart/formData'
    }
  })
    .then(res => {
      this.props.alert.success(res.data)
      this.setState({
        gradeId: '',
        subjectId: '',
        file: '',
        ebookName: '',
        ebookDescription: '',
        ebookType: '',
        gSelectKey: new Date().getTime(),
        loading: false
      }, () => [])
    })
    .catch(error => {
      this.setState({
        loading: false
      })
      console.log(error)
      this.props.alert.error('Something went wrong')
    })
}

render () {
  const files = this.state.file &&
  this.state.file.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))
  let { grade_id: gradeId, ebookType: etype, subject_id: subjectId, file, ebookDescription, ebookName, loading } = this.state
  return (
    <div style={{ padding: '30px' }}>
      <Grid.Row style={{ marginBottom: '20px' }}>
        <FormControl className='formControl'>
          <InputLabel>Ebook Type</InputLabel>
          <Select
            className='selectEbookType'
            value={this.state.ebookType}
            onChange={this.handleChange}
          >
            <MenuItem value={'General'}>General Ebook</MenuItem>
            <MenuItem value={'Curriculum'}>Curriculum Ebook</MenuItem>
          </Select>
        </FormControl>
      </Grid.Row>
      <Grid.Row style={{ marginBottom: '20px' }}>
        <GSelect key={this.state.gSelectKey} variant={'selector'} onChange={this.onChange} config={COMBINATIONS} />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column
          computer={5}
          mobile={16}
          tablet={5}
        >
          {/* <Input
            placeholder='Ebook Name'
            onChange={(e) => { this.setState({ ebookName: e.target.value }) }}
            value={this.state.ebookName}
            required
            style={{ width: 300 }}

          /> */}
          <input
            placeholder='Ebook Name'
            onChange={(e) => {
              this.setState({ ebookName: e.target.value })
            }}
            value={this.state.ebookName}
            className='ebook__title'
            maxLength='100'
          />
        </Grid.Column>
        <Grid.Column
          computer={5}
          mobile={16}
          tablet={5}
          style={{ marginTop: 20 }}
        >
          <TextArea
            onChange={e => {
              this.setState({ ebookDescription: e.target.value })
            }}
            className='form-control'
            required
            name='description'
            autoHeight
            placeholder='Ebook Description'
            value={this.state.ebookDescription}
            style={{ minHeight: 100, width: 300 }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ padding: '20px 0px' }}>
        <label>Select File<sup>*</sup></label>
        <Dropzone onDrop={this.onDrop}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject
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
                <input {...getInputProps()} />
                <div>
                  {isDragAccept && 'All files will be accepted'}
                  {isDragReject && 'Some files will be rejected'}
                  {!isDragActive && 'Drop your files here.'}
                </div>
                {files}
              </CardContent>
            </Card>
          )}
        </Dropzone>
      </Grid.Row>
      <Grid.Row>
        <Button disabled={!gradeId || !etype || !subjectId || !file || !ebookDescription || !ebookName || loading} variant='contained' onClick={this.handleUpload}>Upload</Button>
      </Grid.Row>
    </div>
  )
}
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

// export default UploadEbook
export default connect(
  mapStateToProps
)(withRouter(UploadEbook))
