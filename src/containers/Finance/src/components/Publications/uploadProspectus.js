import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, TextField, Card,
  CardContent, Button } from '@material-ui/core'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'

class Prospectus extends Component {
  constructor () {
    super()
    this.state = {
      message: '',
      file: ''
    }
  }
  onDrop = (file) => {
    this.setState({ file })
  };

  uploadProspectus = () => {
    let formData = new FormData()
    formData.append('to_publish', 'true')
    formData.append('title', this.state.message)
    formData.append('newsletter_type', 'prospectus')
    formData.append('file', this.state.file[0])
    formData.append('zone_id', '5')
    axios.post(urls.ViewProspectus, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        this.props.alert.success(res.data.status)
        this.setState({ file: '',
          message: '' })
      })
      .catch(error => {
        this.setState({
          loading: false,
          file: '',
          message: ''
        })
        console.log(error)
        this.props.alert.error(error.response.data.error)
      })
  }
  render () {
    const { file, message } = this.state
    const files =
    this.state.file &&
    this.state.file.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    return (
      <React.Fragment>
        <Grid container>
          <Grid style={{ marginTop: '20px', marginLeft: '31px' }}>
            <TextField
              label='Title'
              fullWidth
              placeholder='Enter Title here'
              type='text'
              onChange={e => this.setState({ message: e.target.value })}
              inputProps={{ maxLength: 100, border: '0px' }}
              value={this.state.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6} md={4} style={{ position: 'relative', marginTop: '49px', marginLeft: '27px' }}>
            <label >Upload File</label>
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
                    <input {...getInputProps()} accept='.pdf' />
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
          </Grid>
        </Grid>
        <Grid>
          <Button variant='contained' color='primary' disabled={!file || !message} style={{ marginLeft: '28px', marginTop: '16px' }} size='small' onClick={() => this.uploadProspectus(this.state.page || 1)}>
          UPLOAD
          </Button>
        </Grid>

      </React.Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  branch: state.branches.items,
  grade: state.gradeMap.items
})

const mapDispatchToProps = dispatch => ({
  branchList: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prospectus)
