import React, { Component } from 'react'
import { Table, Form } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { Button } from '@material-ui/core/'

import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { AlertMessage, OmsSelect } from '../../../ui'
import { apiActions } from '../../../_actions'
import AuthService from '../../AuthService'

class AddStudentExcel extends Component {
  constructor () {
    super()
    this.state = { datafile: [],
      percentCompleted: 0,
      formData: new FormData()
    }
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.onDrop = this.onDrop.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal' || this.role === 'BDM' || this.role === 'FOE') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleChangeBranch({ value: academicProfile.branch_id }) })
    }
  }

  handleChangeBranch = event => {
    let { formData } = this.state
    formData.set('branchId', event.value)
    this.setState({ branchId: event.value, formData })
  };

  onDrop (files) {
    console.log('inside drop')
    this.state.files
      ? this.setState({
        files: files
      })
      : this.setState({ files: files })
  };

  handleUpload = () => {
    let { formData } = this.state
    this.state.files &&
      this.state.files.forEach((file, index) => {
        formData.append('datafile', file)
      })
    axios
      .post(urls.StudentExcelUpload, formData, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          console.log('i am in side progress', percentCompleted)
          if (percentCompleted === 100) {
            this.setState({ percentCompleted: 0 })
          }
        },
        'Content-Type': 'multipart/form-data'
      })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({
            alertMessage: {
              messageText: res.data,
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
        if (error.response.status === 400) {
          this.setState({
            alertMessage: {
              messageText: error.response.data,
              variant: 'warning',
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
  };

  onClick () {
    window.location.href = urls.StudentExcel
  }

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
        <Form style={{ paddingLeft: '10px' }}>
          <Form.Field width={4}>
            <label>Branch*</label>
            {this.role === 'Principal' || this.role === 'BDM' || this.role === 'FOE'
              ? <input
                type='text'
                value={this.state.branch_name}
                disabled
                className='form-control'
                placeholder='Branch'
              /> : (
                <OmsSelect
                  defaultValue={this.state.id}
                  options={
                    this.props.branches
                      ? this.props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : null
                  }
                  value={
                    this.role === 'Principal' | this.role === 'BDM' &&
                  this.state.currentPrincipalBranch
                  }
                  disabled={this.role === 'Principal' || this.role === 'BDM' || this.role === 'FOE'}
                  change={this.handleChangeBranch}
                />
              )}
          </Form.Field>
        </Form>
        <br />
        <br />
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
        {this.state.percentCompleted > 0 && <LinearProgress variant={'determinate'} value={this.state.percentCompleted} /> } {this.state.percentCompleted > 0 && this.state.percentCompleted}
        {/* <div className='inputfile'>
          <input
            onChange={this.handleChangeFileUpload}
            type='file'
            accept='.xls,.xlsb,.xlsm,.xlsx'
          />
        </div> */}
        <div id='tablecontent'>
          <Table collapsing celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.HeaderCell>Roll Number</Table.HeaderCell>
                <Table.HeaderCell>Adhar Number</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Grade</Table.HeaderCell>
                <Table.HeaderCell>Class Group</Table.HeaderCell>
                <Table.HeaderCell>Section</Table.HeaderCell>
                <Table.HeaderCell>Date of Admission</Table.HeaderCell>
                <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                <Table.HeaderCell>Enrollment Code</Table.HeaderCell>
                <Table.HeaderCell>Admission Number</Table.HeaderCell>
                <Table.HeaderCell>Gr Number</Table.HeaderCell>
                <Table.HeaderCell>Gender</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Using Transport</Table.HeaderCell>
                <Table.HeaderCell>Father Name</Table.HeaderCell>
                <Table.HeaderCell>Father Mobile</Table.HeaderCell>
                <Table.HeaderCell>Father Email</Table.HeaderCell>
                <Table.HeaderCell>Mother Name</Table.HeaderCell>
                <Table.HeaderCell>Mother Mobile</Table.HeaderCell>
                <Table.HeaderCell>Mother Email</Table.HeaderCell>
                <Table.HeaderCell>Language 1</Table.HeaderCell>
                <Table.HeaderCell>Language 2</Table.HeaderCell>
                <Table.HeaderCell>Language 3</Table.HeaderCell>
                <Table.HeaderCell>Language 4</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </div>
        <br />
        <div style={{ padding: '10px' }}>
          <Button disabled={!this.state.files} onClick={this.handleUpload} color='green' >
            Upload
          </Button>
          <Button color='blue' onClick={this.onClick}>
            Download Template
          </Button>
          <Button
            primary
            onClick={this.props.history.goBack}
            type='button'
          >
            Return
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items
})
const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddStudentExcel))
