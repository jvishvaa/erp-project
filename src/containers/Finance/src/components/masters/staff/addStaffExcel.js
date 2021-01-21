import React, { Component } from 'react'
import { Table, Form, Input } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import Dropzone from 'react-dropzone'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import _ from 'lodash'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { OmsSelect } from '../../../ui'

// eslint-disable-next-line camelcase
var staff_file = new FormData()

class AddStaffExcel extends Component {
  constructor () {
    super()
    this.state = {
      files: [],
      percentCompleted: 0,
      error: false,
      errors: []

    }
    this.onDrop = this.onDrop.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.excel = this.excel.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()
    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal' || this.role === 'BDM' || this.role === 'EA Academics') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleChange({ value: academicProfile.branch_id }) })
    }
  }

  handleChange = (e) => {
    this.setState({ branchId: e.value })
  }

  onDrop (files = []) {
    if (files.length) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        let val = ['xls', 'xlsx']
        let fileName = files[fileIndex].name
        let extension = fileName.split('.')[fileName.split('.').length - 1]
        if (extension) {
          let isValidExtension = val.includes(extension.toLowerCase())
          if (isValidExtension === true) {
            files[fileIndex]['customKey_isvalidExtention'] = true
          } else {
            let msg = 'Invalid file extension of file: ' + fileName
            this.props.alert.error(msg)
          }
        } else {
          let msg = 'please upload a file with extension: ' + fileName
          this.props.alert.error(msg)
        }
      }
      files = files.filter(file => file['customKey_isvalidExtention'] === true)
      files = files.map(file => {
        delete file['customKey_invalidExtention']
        return file
      })
      this.setState({ files })
    }
  };

  excel = () => {
    let { files } = this.state

    if (!files || files.length === 0) {
      this.props.alert.error('Drop file to be uploaded')
      return
    }
    files && files.forEach(file => {
      staff_file.append('file', file)
    })

    axios
      .post(urls.StaffBulkUpload, staff_file, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          if (percentCompleted === 100) {
            this.setState({ percentCompleted: 0 })
          }
        }
      })
      .then(res => {
        if (res.status === 201) {
          this.props.alert.success('All staffs have been created successfully’')
        }
        if (res.status === 206) {
          this.setState({
            errors: this.serializeErrors(res.data.error)

          })
          this.props.alert.error('Error in file data format')
        }
        if (res.status === 200) {
          this.setState({
            errors: this.serializeErrors(res.data.error),
            message: res.data.error

          })
          this.props.alert.error('Staffs created partially')
        }
      }

      )

      .catch((error) => {
        if (error.response.status !== 401) {
          this.props.alert.error('something went wrong')
        }

        if (error.response.status === 401) {
          this.props.alert.error('You are not authorized to create staff')
        }
      })
  }

  serializeErrors (error) {
    let errors = {}

    if (!Array.isArray(error)) {
      Object.keys(error).forEach(row => {
        let rowData = error[row]
        if (rowData.length === undefined) {
          if (!Array.isArray(rowData)) {
            Object.keys(rowData).forEach(field => {
              let fieldErrors = [...rowData[field]]
              if (errors[row]) {
                errors[row] = [...errors[row], {
                  field,
                  errors: fieldErrors
                }]
              } else {
                errors[row] = [{
                  field,
                  errors: fieldErrors
                }]
              }
            })
          }
        }
      })
    }

    return errors
  }

  onClick () {
    window.location.href = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/staff/Add_staff_template.xlsx'
  }
  clearErrorMessage=() => {
    this.setState({
      message: '',
      errors: ''
    })
  }

  render () {
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    let { message } = this.state

    return (
      <React.Fragment>
        <Form style={{ paddingLeft: '10px' }}>
          <Form.Field width={6}>
            <label>Branch*</label>
            {this.role === 'Principal' || this.role === 'BDM' || this.role === 'EA Academics'
              ? <Input
                type='text'
                value={this.state.branch_name}
                disabled
                className='form-control'
                placeholder='Branch'
              /> : (
                <OmsSelect
                  options={
                    this.props.branches
                      ? this.props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : []
                  }
                  isDisabled={this.role === 'Principal' || this.role === 'BDM' || this.role === 'EA Academics'}
                  change={e => this.setState({ branchId: e.value })}
                />
              )}
          </Form.Field>
        </Form>
        <div style={{ padding: '10px' }}>
          <Dropzone onClick={this.clearErrorMessage} onDrop={this.onDrop}>
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
          {this.state.percentCompleted > 0 &&
            <LinearProgress
              variant={'determinate'}
              value={this.state.percentCompleted}
            /> && this.state.percentCompleted
          }
        </div>

        <div id='tablecontent'>
          <Table collapsing celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Branch*</Table.HeaderCell>
                <Table.HeaderCell>Role*</Table.HeaderCell>
                <Table.HeaderCell>Academic Year*</Table.HeaderCell>
                <Table.HeaderCell>ERP</Table.HeaderCell>
                <Table.HeaderCell>Designation*</Table.HeaderCell>
                <Table.HeaderCell>Department*</Table.HeaderCell>
                <Table.HeaderCell>Name*</Table.HeaderCell>
                <Table.HeaderCell>Mobile*</Table.HeaderCell>
                <Table.HeaderCell>Email*</Table.HeaderCell>
                <Table.HeaderCell>Alternate Email</Table.HeaderCell>
                <Table.HeaderCell>Password*</Table.HeaderCell>
                <Table.HeaderCell>Address*</Table.HeaderCell>
                <Table.HeaderCell>Date of Joining*</Table.HeaderCell>
                <Table.HeaderCell>Emergency Number</Table.HeaderCell>
                <Table.HeaderCell>Qulification</Table.HeaderCell>

              </Table.Row>
            </Table.Header>
          </Table>
        </div>
        <br />
        <div style={{ padding: '10px' }}>
          <Button className='btn' disabled={!this.state.files} onClick={this.excel} >Upload</Button>
          <Button className='btn1' onClick={this.onClick}>Download Template</Button>
          <Button className='btn1' onClick={this.props.history.goBack} >Return</Button>
        </div>

        {
          Object.keys(this.state.errors).length > 0
            ? <h2 style={{ color: 'red', paddingLeft: '20px' }}>Failed to upload, check below</h2>
            : ''
        }
        {

          this.state.errors && Object.keys(this.state.errors).length > 0 ? Object.keys(this.state.errors).map(row => {
            return <React.Fragment>

              <ul>

                <li>{row}<ul>
                  {
                    this.state.errors[row].map(error => {
                      return <li><h5 style={{ display: 'inline-block' }}>{error.field} </h5>: &nbsp; &nbsp;{error.errors.map(error => error)}</li>
                    })
                  }
                </ul>
                </li>
              </ul>
            </React.Fragment>
          }) : ''
        }
        { message && Object.values(message).map(row => {
          return <React.Fragment>

          </React.Fragment>
        })
        }
        {message ? <h2 style={{ color: 'red', paddingLeft: '20px' }}>Failed to upload, check below</h2>
          : ''}
        {message && Object.values(message).map((row, index) => {
          return (<div>
            <div style={{ paddingLeft: '20px' }}>
              <ul>

                <li>Row {index + 2}<ul>

                  {
                    Array.isArray(row) && row.map(err => {
                      return <li style={{ paddingBottom: '15px' }}>{err}</li>
                    })
                  }
                </ul>
                </li>
              </ul>
            </div>
          </div>)
        })}

      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddStaffExcel))
