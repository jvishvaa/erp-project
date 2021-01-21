
import React, { Component } from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { LinearProgress, Checkbox, Button } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { withRouter } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import '../../../css/staff.css'
import { AlertMessage } from '../../../../ui'
import { urls } from '../../../../urls'
import AuthService from '../../../AuthService'

var formData = new FormData()
class AddBranch extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      is_central: false,
      is_school: false,
      files: [],
      percentCompleted: 0,
      is_internal: false

    }
    this.onDrop = this.onDrop.bind(this)
  }

  handleCentral = (e) => {
  // console.log(e.target.checked)
    formData.append('is_central', e.target.checked)
  }
  handleSchool =(e) => {
    formData.append('is_school', e.target.checked)
  }
  handleIsInternal=(e) => {
    formData.append('is_internal', e.target.checked)
  }
  handleLogo = (e) => {
    var excel = e.target.files[0]
    formData.append('logo', excel)
    this.setState({ logo: excel })
  }
  changeBranch = (e) => {
    formData.set('branch_name', e.target.value)
    this.setState({ branch_name: e.target.value })
  }
  branchCode = (e) => {
    formData.set('branch_code', e.target.value)
    this.setState({ branch_code: e.target.value })
  }
  address =(e) => {
    formData.set('address', e.target.value)
    this.setState({ address: e.target.value })
  }

  handleSubmit = (e) => {
    // console.log(JSON.stringify(this.state));
    console.log(formData)
    this.state.files &&
      this.state.files.forEach((file, index) => {
        formData.append('file', file)
      })
    axios
      .post(urls.BRANCH, formData, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token,
          'Content-Type': 'multipart/formData'
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          console.log('i am progress', percentCompleted)
          if (percentCompleted === 100) {
            this.setState({ percentCompleted: 0 })
          }
        }

      })
      .then(res => {
        console.log(res)
        // alert("Branch Added");
        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: 'Branch added successfully',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        } else {
          this.setState({
            alertMessage: {
              messageText: 'Error: Something went wrong, please try again.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 409) {
          this.setState({
            alertMessage: {
              messageText: 'Branch code exist. Enter different branch code.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        } else {
          this.setState({
            alertMessage: {
              messageText: 'Error: Something went wrong, please try again.',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
  }
  onDrop (files) {
    console.log('inside drop')
    this.state.files
      ? this.setState({
        files: files
      })
      : this.setState({ files: files })
  };

  render () {
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))

    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onSubmit={this.handleSubmit} style={{ paddingLeft: '30px' }}>
          <Form.Group>
            <Form.Field width={5}>
              <label >Branch Name*</label>
              <input onChange={this.changeBranch} name='branch_name' placeholder='Branch Name' />
            </Form.Field>
            <Form.Field width={5}>
              <label >Branch Code*</label>
              <input onChange={this.branchCode} name='branch_code' pattern='[a-zA-Z0-9!@#$%^*_|]{0,3}' placeholder='Branch Code' />
            </Form.Field>
            <Form.Field width={5}>
              <label >Address*</label>
              <input onChange={this.address} name='address' placeholder='Address' />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={5}>
              <label>Upload Logo(image file)</label>
              {/* <div>
                <input onChange={this.handleLogo} type='file' />
              </div> */}
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
              {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted}
            </Form.Field>
          </Form.Group>

          <Form.Group>
            <Form.Field computer={5} mobile={6} tablet={8}>

              <label>Central*</label>
              <Checkbox onChange={this.handleCentral} checkbox={this.state.is_central} color='primary' />
            </Form.Field>
            <Form.Field computer={5} mobile={6} tablet={8}>

              <label> &nbsp;School*</label>
              <Checkbox onChange={this.handleSchool} checkbox={this.state.is_school} color='primary' />
            </Form.Field>
            <Form.Field computer={5} mobile={6} tablet={8}>

              <label> &nbsp;Is internal*</label>
              <Checkbox onChange={this.handleIsInternal} checkbox={this.state.is_internal} color='primary' />
            </Form.Field>
          </Form.Group>

          <div className='formargin' style={{ paddingBottom: '20px' }}>
            <Button type='submit'
              disabled={!this.state.branch_name ||
            !this.state.branch_code ||
          !this.state.address}
              color='green'>Save</Button>

            <Button primary onClick={this.props.history.goBack} type='button'>Return</Button>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default (withRouter(AddBranch))
