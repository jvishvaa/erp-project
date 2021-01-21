import React, { Component } from 'react'
import { Table, Form } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import Dropzone from 'react-dropzone'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'
import Switch from '@material-ui/core/Switch'
import Grid from '@material-ui/core/Grid'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { AlertMessage, OmsSelect } from '../../../ui'
import { apiActions } from '../../../_actions'
import AuthService from '../../AuthService'

class studentUploadData extends Component {
  constructor () {
    super()
    this.state = { datafile: [],
      percentCompleted: 0,
      formData: new FormData(),
      checkedA: true,
      checkedB: true
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

  handleChangeSwitch (event, v, val) {
    console.log(event, 'event')
    console.log(v, 'v event')
    console.log(val, 'val event')
    if (v === false) {
      this.setState({ checkedA: false })
    } else {
      this.setState({ checkedA: true })
    }
  }

  handleUpload = () => {
    let { formData } = this.state
    this.state.files &&
      this.state.files.forEach((file, index) => {
        formData.append('datafile', file)
      })
    formData.append('status', this.state.checkedA)
    axios
      .post(urls.StudentUpdatedExcelUpload, formData, {
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
    window.location.href = urls.StudentUploadExcel
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
          {/* <FormControlLabel
            label='Inactive'
            // control
          /> */}
          <FormGroup row>
            <Grid component='label' container alignItems='center' spacing={1}>
              <Grid item>InActive</Grid>
              <Grid item>
                <Switch
                  checked={this.state.checkedA}
                  onChange={(e, v) => this.handleChangeSwitch(e, v)}
                  value='true'
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </Grid>
              <Grid item>Active</Grid>
            </Grid>
            {/* <FormControlLabel control={this.state.checkedA} label='InActive' />
            <FormControlLabel
              label='Active Students'
              control={
                <Switch
                  checked={this.state.checkedA}
                  onChange={(e, v) => this.handleChangeSwitch(e, v)}
                  value='true'
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              }
            // label='Active'
            /> */}
          </FormGroup>
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
                <Table.HeaderCell>S No</Table.HeaderCell>
                <Table.HeaderCell>Branch Name</Table.HeaderCell>
                <Table.HeaderCell>Enrollment Code</Table.HeaderCell>
                <Table.HeaderCell>References Code</Table.HeaderCell>
                <Table.HeaderCell>GR Number(Unique)</Table.HeaderCell>

                <Table.HeaderCell>Date Of Admission</Table.HeaderCell>
                <Table.HeaderCell>Roll No</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Gender</Table.HeaderCell>
                <Table.HeaderCell>ClassName</Table.HeaderCell>

                <Table.HeaderCell>Section</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Transport</Table.HeaderCell>
                {/* <Table.HeaderCell>Category</Table.HeaderCell> */}
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>ClassGroupName</Table.HeaderCell>
                <Table.HeaderCell>Point Of Contact</Table.HeaderCell>

                <Table.HeaderCell>Student Living With</Table.HeaderCell>
                <Table.HeaderCell>OtherName</Table.HeaderCell>
                <Table.HeaderCell>OtherClass</Table.HeaderCell>
                <Table.HeaderCell>OtherSchool</Table.HeaderCell>
                <Table.HeaderCell>Is Parent VIP</Table.HeaderCell>
                <Table.HeaderCell>Applicable Parent</Table.HeaderCell>
                <Table.HeaderCell>FirstName</Table.HeaderCell>
                <Table.HeaderCell>MiddleName</Table.HeaderCell>
                <Table.HeaderCell>LastName</Table.HeaderCell>

                {/* <Table.HeaderCell>Father Office</Table.HeaderCell> */}
                <Table.HeaderCell>PhotoUpload</Table.HeaderCell>
                <Table.HeaderCell>MobileNumber</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Admitted Class</Table.HeaderCell>
                <Table.HeaderCell>Father Designation</Table.HeaderCell>
                <Table.HeaderCell>Father Alternate EmailID</Table.HeaderCell>
                <Table.HeaderCell>Father Business Name</Table.HeaderCell>

                <Table.HeaderCell>Father Office</Table.HeaderCell>
                <Table.HeaderCell>Father Traits</Table.HeaderCell>
                <Table.HeaderCell>Father Photo</Table.HeaderCell>
                <Table.HeaderCell>Mother Designation</Table.HeaderCell>
                <Table.HeaderCell>Mother Alternate EmailID</Table.HeaderCell>
                <Table.HeaderCell>Mother Business Name)</Table.HeaderCell>

                <Table.HeaderCell>Mother Office</Table.HeaderCell>
                <Table.HeaderCell>Mother Traits</Table.HeaderCell>
                <Table.HeaderCell>Mother Photo</Table.HeaderCell>
                <Table.HeaderCell>Permanent Address</Table.HeaderCell>

                <Table.HeaderCell>Transport Pickup Route Name</Table.HeaderCell>

                <Table.HeaderCell>Transport Pickup Stop</Table.HeaderCell>
                <Table.HeaderCell>Transport Drop Route Name</Table.HeaderCell>
                <Table.HeaderCell>Transport Drop Stop</Table.HeaderCell>

                <Table.HeaderCell>Siblings</Table.HeaderCell>

                <Table.HeaderCell>I LANGUAGE</Table.HeaderCell>
                <Table.HeaderCell>II LANGUAGE</Table.HeaderCell>
                <Table.HeaderCell>III LANGUAGE</Table.HeaderCell>
                <Table.HeaderCell>IV LANGUAGE</Table.HeaderCell>

                <Table.HeaderCell>Previous Admission No</Table.HeaderCell>
                <Table.HeaderCell>Qualified Exam rank</Table.HeaderCell>
                <Table.HeaderCell>Is Lunch Available</Table.HeaderCell>

                <Table.HeaderCell>Admission No/Reference code</Table.HeaderCell>
                <Table.HeaderCell>GR / EMIS / STS (unique No.)</Table.HeaderCell>

                <Table.HeaderCell>SmartCard No</Table.HeaderCell>
                <Table.HeaderCell>Previous Admission No</Table.HeaderCell>
                <Table.HeaderCell>Roll No</Table.HeaderCell>

                <Table.HeaderCell>Home / ClassGroup</Table.HeaderCell>
                <Table.HeaderCell>Student Segment</Table.HeaderCell>
                <Table.HeaderCell>Hall Ticket No</Table.HeaderCell>
                <Table.HeaderCell>Father EmailID</Table.HeaderCell>

                <Table.HeaderCell>Mother EmailID</Table.HeaderCell>
                <Table.HeaderCell>Guardian EmailID</Table.HeaderCell>
                <Table.HeaderCell>Father Mobile No</Table.HeaderCell>
                <Table.HeaderCell>Mother Mobile No</Table.HeaderCell>
                <Table.HeaderCell>Guardian Mobile No</Table.HeaderCell>

                <Table.HeaderCell>Sibling Mobile No</Table.HeaderCell>
                <Table.HeaderCell>Village or City</Table.HeaderCell>
                <Table.HeaderCell>District</Table.HeaderCell>
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>Zip code</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Nick Name</Table.HeaderCell>

                <Table.HeaderCell>Nationality</Table.HeaderCell>
                <Table.HeaderCell>Religion</Table.HeaderCell>
                <Table.HeaderCell>Mother Tongue</Table.HeaderCell>
                <Table.HeaderCell>Caste</Table.HeaderCell>
                <Table.HeaderCell>Subcaste</Table.HeaderCell>
                <Table.HeaderCell>Previous School</Table.HeaderCell>
                <Table.HeaderCell>Previous Class</Table.HeaderCell>
                <Table.HeaderCell>Previous Marks(%)</Table.HeaderCell>

                <Table.HeaderCell>Student Aadhaar Number</Table.HeaderCell>
                <Table.HeaderCell>Student Passport Number</Table.HeaderCell>
                <Table.HeaderCell>Student Passport Issue Place</Table.HeaderCell>
                <Table.HeaderCell>Student Passport Validity</Table.HeaderCell>
                <Table.HeaderCell>Student Visa Number</Table.HeaderCell>

                <Table.HeaderCell>Student Visa Expiry Date</Table.HeaderCell>
                <Table.HeaderCell>Father Aadhaar Number</Table.HeaderCell>
                <Table.HeaderCell>Mother Aadhaar Number</Table.HeaderCell>
                <Table.HeaderCell>Father PAN Card</Table.HeaderCell>
                <Table.HeaderCell>Mother PAN Card</Table.HeaderCell>

                <Table.HeaderCell>Father Annual Income</Table.HeaderCell>
                <Table.HeaderCell>Father Business Name</Table.HeaderCell>
                <Table.HeaderCell>Mother Annual Income</Table.HeaderCell>
                <Table.HeaderCell>Mother Business Name</Table.HeaderCell>
                <Table.HeaderCell>Father Occupation</Table.HeaderCell>
                <Table.HeaderCell>Father Qualification</Table.HeaderCell>
                <Table.HeaderCell>Mother Occupation</Table.HeaderCell>

                <Table.HeaderCell>Mother Qualification</Table.HeaderCell>
                <Table.HeaderCell>Father Blood Group</Table.HeaderCell>
                <Table.HeaderCell>Mother Blood Group</Table.HeaderCell>
                <Table.HeaderCell>Student Blood Group</Table.HeaderCell>
                <Table.HeaderCell>Father DOB</Table.HeaderCell>
                <Table.HeaderCell>Mother DOB</Table.HeaderCell>
                <Table.HeaderCell>Marriage Anniversary</Table.HeaderCell>
                <Table.HeaderCell>Father Employee ID</Table.HeaderCell>

                <Table.HeaderCell>Father Office Landline Number</Table.HeaderCell>
                <Table.HeaderCell>Father Office Address</Table.HeaderCell>
                <Table.HeaderCell>Mother Employee ID</Table.HeaderCell>
                <Table.HeaderCell>Mother Office Landline Number</Table.HeaderCell>
                <Table.HeaderCell>Mother Office Address</Table.HeaderCell>

                <Table.HeaderCell>Guardian Name</Table.HeaderCell>
                <Table.HeaderCell>Guardian Mobile Number</Table.HeaderCell>
                <Table.HeaderCell>Guardian Occupation</Table.HeaderCell>
                <Table.HeaderCell>Guardian EmailID</Table.HeaderCell>
                <Table.HeaderCell>Guardian Alternate EmailID</Table.HeaderCell>

                <Table.HeaderCell>Guardian Relationship</Table.HeaderCell>
                <Table.HeaderCell>Sibling1 Name</Table.HeaderCell>
                <Table.HeaderCell>Sibling1 Occupation</Table.HeaderCell>
                <Table.HeaderCell>Sibling1 Mobile Number</Table.HeaderCell>
                <Table.HeaderCell>Sibling2 Name</Table.HeaderCell>
                <Table.HeaderCell>Sibling2 Occupation</Table.HeaderCell>
                <Table.HeaderCell>Sibling2 Mobile Number</Table.HeaderCell>
                <Table.HeaderCell>Sibling3 Name</Table.HeaderCell>

                <Table.HeaderCell>Sibling4 Name</Table.HeaderCell>
                <Table.HeaderCell>Father Name</Table.HeaderCell>
                <Table.HeaderCell>Father Height</Table.HeaderCell>
                <Table.HeaderCell>Father Weight</Table.HeaderCell>

                <Table.HeaderCell>Mother Name</Table.HeaderCell>
                <Table.HeaderCell>Mother Height</Table.HeaderCell>
                <Table.HeaderCell>Mother Weight</Table.HeaderCell>
                <Table.HeaderCell>Favourite Colour</Table.HeaderCell>
                <Table.HeaderCell>Favourite Rhyme</Table.HeaderCell>
                <Table.HeaderCell>Favourite Activity</Table.HeaderCell>
                <Table.HeaderCell>Student Hobbies</Table.HeaderCell>
                <Table.HeaderCell>Student Talent</Table.HeaderCell>
                <Table.HeaderCell>Father SmartCardNo</Table.HeaderCell>

                <Table.HeaderCell>Mother SmartCardNo</Table.HeaderCell>
                <Table.HeaderCell>Gurdian SmartCardNo</Table.HeaderCell>
                <Table.HeaderCell>Student StateGovernmentNo</Table.HeaderCell>
                <Table.HeaderCell>FamilyID</Table.HeaderCell>
                <Table.HeaderCell>Father Country Code</Table.HeaderCell>

                <Table.HeaderCell>Father WhatsAppNo</Table.HeaderCell>
                <Table.HeaderCell>Mother Country Code</Table.HeaderCell>
                <Table.HeaderCell>Mother WhatsAppNo</Table.HeaderCell>
                <Table.HeaderCell>Father FaceBookID</Table.HeaderCell>
                <Table.HeaderCell>Mother FaceBookID</Table.HeaderCell>
                <Table.HeaderCell>Father TwitterID</Table.HeaderCell>
                <Table.HeaderCell>Mother TwitterID</Table.HeaderCell>

                <Table.HeaderCell>Father InstagramID</Table.HeaderCell>
                <Table.HeaderCell>Mother InstagramID</Table.HeaderCell>

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
)(withRouter(studentUploadData))
