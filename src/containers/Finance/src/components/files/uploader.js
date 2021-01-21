import React from 'react'

import { connect } from 'react-redux'

import axios from 'axios'

import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import { Modal } from '@material-ui/core'

import CloseButton from '@material-ui/icons/Close'

// import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from '../videoUpload/config/combination'

import { urls } from '../../urls'

class Uploader extends React.Component {
  constructor () {
    super()
    this.state = {
      files: [],
      grade_id: ''
    }
    this.onDrop = this.onDrop.bind(this)
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }
  componentDidMount () {
    let userProfile = JSON.parse(localStorage.getItem('user_profile'))
    if (userProfile.personal_info.role !== 'Subjecthead') {
      this.props.loadGrades()
    }
    // } else {
    //   let mappings = userProfile.academic_profile.reduce(function (r, a) {
    //     r[a.branch_id] = r[a.branch_id] || { branch_id: a.branch_id, branch_name: a.branch_name, children: {} }
    //     r[a.branch_id].children[a.grade_id] = r[a.branch_id].children[a.grade_id] || { grade_id: a.grade_id, grade_name: a.grade_name, children: {} }
    //     r[a.branch_id].children[a.grade_id].children[a.subject_id] = r[a.branch_id].children[a.grade_id].children[a.subject_id] || { subject_id: a.subject_id, subject_name: a.subject_name }
    //     return r
    //   }, Object.create(null))
    //   console.log(mappings)
    //   this.setState({ mappings })
    // }
  }

  handleSave = (e) => {
    let { subject_id: subject, grade_id: grade, id: chapter, files } = this.state
    var formData = new FormData()
    if ((subject && grade) && (chapter && files.length)) {
      if (this.props.type === 'academic') {
        formData.append('subject', subject)
        formData.append('grade', grade)
        formData.append('chapter', chapter)
      }
    }
    console.log(files, 'fillll')
    files && files.forEach(file => {
      formData.append('file', file)
    })
    formData.append('type', this.props.type)
    if (files.length > 0) {
      axios
        .post(urls.FileUpload, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.setState({ percentCompleted })
            console.log('i am progesss ', percentCompleted)
            if (percentCompleted === 100) {
              this.setState({ percentCompleted: 0 })
            }
          }
        })
        .then(res => {
          console.log(res, 'rs')
          /* global alert */
          alert('Uploaded Successfully')
          this.setState({ subject_id: '', grade_id: '', id: '', files: [] })
          this.props.toggle()
        })
        .catch(error => {
          console.log(error.response, 'er')
          if (error.response.status === 400) {
            alert('Grade matching query does not exist')
          } else if (error.response.status === 409) {
            alert('File Already Exist')
          }
          this.setState({ subject_id: '', grade_id: '', id: '', files: [] })
          this.props.toggle()

          console.log(error)
        })
    } else {
      window.alert('No file selected')
    }
  }
  onDrop (files) {
    console.log(files, 'file')
    this.state.files
      ? this.setState({
        files: files
      })
      : this.setState({ files: files })
  }

  onChange = (data) => {
    console.log(data)
    for (let prop in data) {
      this.setState({ [prop]: data[prop] })
    }
  }

  render () {
    let { open, type, toggle } = this.props
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    // let { mappings, grade } = this.state
    return <div>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={open}
        onClose={toggle}>
        <Card style={{
          position: 'fixed',
          top: '20%',
          left: '20%',
          width: '50vw',
          height: 'auto',
          overflow: 'visible'
        }}>
          <CardHeader
            action={
              <IconButton>
                <CloseButton onClick={toggle} />
              </IconButton>
            }
            title='Upload File'
          />
          <CardContent>
            {type === 'academic' && <Grid container style={{ height: 'auto' }}>
              <Grid item>
                <GSelect config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />
              </Grid>
            </Grid>}
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
                    marginTop: 16,
                    marginBottom: 16,
                    border: '1px solid black',
                    borderStyle: 'dotted',
                    width: '100%'
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
            <Button onClick={this.handleSave} variant='outlined' component='span'>
          Upload
            </Button>
          </CardContent>
        </Card>
      </Modal></div>
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items
})

const mapDispatchToProps = dispatch => ({
  loadGrades: () => dispatch(apiActions.listGrades())
})
export default connect(mapStateToProps, mapDispatchToProps)(Uploader)
