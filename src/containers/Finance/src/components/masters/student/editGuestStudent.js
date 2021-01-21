import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import {
  Button,
  Grid,
  Divider,
  Typography,
  // Modal,
  Paper,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  TablePagination,
  IconButton
} from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import TextField from '@material-ui/core/TextField'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withRouter } from 'react-router'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import CloseIcon from '@material-ui/icons/Close'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import { urls } from '../../../urls'
// import { OmsSelect as Select } from '../../../ui'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from './combination'
import Modal from '../../../ui/Modal/modal'
import Loader from '../../discussion_form/loader'
// /oms/src/components/OnlineClass/combination'

class EditGuestStudent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      name: '',
      nameError: false,
      mailError: false,
      address: '',
      gender: 'male',
      selectedDate: '1998-01-10',
      activeStep: 0,
      loading: true,
      ShowTimer: true,
      ResendOtpButton: true,
      sendingData: false,
      gradestu: '',
      page: 0,
      rowsPerPage: 5,
      tabelData: '',
      selectedGroupid: '',
      loadingData: false,
      open: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  setFormData = () => {
    let { state, props } = this
    let { studentFormData: formData } = state
    formData.set('gradeId', props.gradeId)
    formData.set('gender', state.gender)
    this.setState({ studentFormData: formData })
    return formData
  }
  componentDidMount () {
    let a = window.location.href
    let id = a.split('/')[6]
    console.log(id)
    // this.setState({ id: id })
    this.setState({ id: this.props.match.params.id })
    this.getGuestStudentData(id)
  }
  getGuestStudentData = (guestStudentId) => {
    // let { guestStudentInputElems } = this.state
    let path = urls.ListGuestStudent + '?guest_student_id=' + guestStudentId
    this.setState({ loading: true }, () => {
      axios
        .get(path, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            console.log(res.data)
            let resdata = res.data.data[0]
            this.setState({ gender: resdata.gender,
              name: resdata.name,
              address: resdata.address,
              email: resdata.email_address,
              phoneNumber: resdata.phone_number,
              gradestu: resdata.grade.id,
              grade: resdata.grade.grade,
              dateOfBirth: resdata.date_of_birth,
              city: resdata.city,
              school: resdata.school,
              pincode: resdata.pincode
            })
          } else {
            console.error(`api ${path} returned with status code ${res.status}`)
            this.setState({ loading: false, isFetchFailed: true })
          }
        })
        .catch(e => {
          this.setState({ loading: false, isFetchFailed: true })
        })
    })
  }
  handleChange (e) {
    const { name, value } = e.target
    this.setState(
      {
        [name]: value
      }
    )
  }

  onChange =(e) => {
    this.setState({ gradeId: e.grade_id })
    if (e.grade_id) {
      this.getGroupListData(e.grade_id)
    }
  }

  handleDateChange (update) {
    console.log(update)
    this.setState({ dateOfBirth: update.format('YYYY-MM-DD') })
  }

  handlegender = (event) => {
    this.setState({ gender: event.target.value })
  }

  handleaddress = (event) => {
    this.setState({ address: event.target.value })
  };
  handleSave () {
    let { name, email, gradestu, phoneNumber, address, gender, dateOfBirth, city, pincode, school, gradeId } = this.state
    let data = {
      name: name,
      email_address: email,
      address: address,
      grade_id: gradeId || gradestu,
      gender: gender,
      phone_number: phoneNumber,
      date_of_birth: dateOfBirth,
      city: city,
      pincode: pincode,
      school: school
    }
    axios
      .put(urls.ListGuestStudent + this.state.id + '/', data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let { status } = res.data
          this.props.alert.success(`${status}`)
          this.props.history.goBack()
        } else {
          this.props.alert.error('Error occured')
        }
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          let a = error.response.data
          if (a) {
            this.props.alert.error('Error')
          }
        }
      })
  }

  functionToAssignGroupId (status) {
    this.setState({ loadingData: true })
    let formData = new FormData()
    formData.append('id', this.state.id)
    formData.append('grade_id', this.state.gradeId)
    if (status === false) {
      formData.append('group_id', this.state.selectedGroupid)
    }
    formData.append('is_skip', status)
    axios
      .post(urls.addStudentGroupApi, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let { status } = res.data
          this.props.alert.success(`${status}`)
          this.setState({ loadingData: false })
          this.handleClose()
          this.setState({ gradeId: '' })
          this.getGuestStudentData(this.state.id)
        } else {
          this.props.alert.error('Error occured')
        }
      }).catch(error => {
        this.setState({ loadingData: false })
        if (error.response && error.response.status === 404) {
          let a = error.response.data
          if (a) {
            this.props.alert.error('Error')
          }
        }
      })
  }

  handleClose = () => {
    this.setState({ open: false })
    this.setState({ page: 0 })
    this.setState({ rowperpage: 5 })
  }

  handleGroupId (data) {
    this.setState({ selectedGroupid: data })
  }

  getPaginationData (page, rowperpage) {
    this.setState({ loadingData: true })
    let url = urls.ClassGroupList + '?page_size=' + rowperpage + '&page_no=' + (Number(page || 0) + 1) + '&grade_id=' + this.state.gradeId + '&is_download=' + 'False'
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ tabelData: res.data })
        this.setState({ loadingData: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ loadingData: false })
        this.props.alert.error('Unable to load data')
      })
  }

  handleChangePage (event, newPage) {
    this.setState({ page: newPage })
    this.getPaginationData(newPage, this.state.rowsPerPage)
  }

  handleChangeRowsPerPage (event) {
    this.setState({ rowsPerPage: event.target.value })
    this.setState({ page: 0 })
    this.getPaginationData(0, event.target.value)
  }

  firstPageChange () {
    this.setState({ page: 0 })
    this.getPaginationData(0, this.state.rowsPerPage)
  }

  lastPageChange (lastPage) {
    this.setState({ page: lastPage })
    this.getPaginationData(lastPage, this.state.rowsPerPage)
  };

  getGroupListData (ids) {
    this.setState({ loadingData: true })
    let url = urls.ClassGroupList + '?page_size=' + this.state.rowsPerPage + '&page_no=' + (Number(this.state.page || 0) + 1) + '&grade_id=' + ids + '&is_download=' + 'False'
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ tabelData: res.data })
        this.setState({ loadingData: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ loadingData: false })
        this.props.alert.error('Unable to load data')
      })
  }

  modalOpen () {
    let modal = null
    modal = (
      <>
        <Modal
          open={this.state.open}
          click={this.handleClose}
          large
        >
          <Paper style={{ padding: '5px' }}>
            <Grid container>
              <Grid item md={12} xs={12} sm={12}>
                <Typography style={{ padding: '5px', float: 'left' }} variant='h5'>Group Data</Typography>
                <IconButton style={{ padding: '5px', float: 'right' }} variant='h5' onClick={() => this.handleClose()}><CloseIcon /></IconButton>
              </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} style={{ padding: '5px' }}>
              {this.state.loadingData === true &&
              <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                <Loader />
              </Grid>
              }
              {/* {this.state.loadingData === false &&
              <> */}
              <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                {this.state.tabelData && this.state.tabelData.data.length === 0 &&
                <Typography variant='h5' style={{ color: 'blue', textAlign: 'center', marginTop: '20px' }}>Records not found</Typography>
                }
                {this.state.tabelData && this.state.tabelData.data.length !== 0 &&
                  <>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell float='left'>
                            <Typography>S.No</Typography>
                          </TableCell>
                          <TableCell float='left'>
                            <Typography>Select Group</Typography>
                          </TableCell>
                          <TableCell float='left'>
                            <Typography>Grade</Typography>
                          </TableCell>
                          <TableCell float='left'>
                            <Typography>Group Name</Typography>
                          </TableCell>
                          <TableCell float='left'>
                            <Typography>Group Count</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.tabelData && this.state.tabelData.data.length !== 0 && this.state.tabelData.data.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell float='left'>
                              <Typography>{index + 1}</Typography>
                            </TableCell>
                            <TableCell float='left'>
                              <FormControl component='fieldset'>
                                <RadioGroup aria-label='gender' name='gender1' value={parseInt(this.state.selectedGroupid)} onChange={e => this.handleGroupId(e.target.value)}>
                                  <FormControlLabel value={item.id} control={<Radio />} />
                                </RadioGroup>
                              </FormControl>
                            </TableCell>
                            <TableCell float='left'>
                              <Typography>{item.grade.grade || ''}</Typography>
                            </TableCell>
                            <TableCell float='left'>
                              <Typography>{item.group_name || ''}</Typography>
                            </TableCell>
                            <TableCell float='left'>
                              <Typography>{item.member_count || ''}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TablePagination
                            colSpan={6}
                            labelDisplayedRows={() => `Page ${this.state.page + 1} of ${+this.state.tabelData.total_pages}`}
                            rowsPerPageOptions={[5, 10, 20, 30]}
                            count={+this.state.tabelData.count}
                            rowsPerPage={parseInt(this.state.rowsPerPage) || 5}
                            page={parseInt(this.state.page)}
                            SelectProps={{
                              inputProps: { 'aria-label': 'Rows per page' }
                            }}
                            onChangePage={(e, newPage) => this.handleChangePage(e, newPage)}
                            onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e)}
                          />
                          <TableCell style={{ marginTop: '13px' }}>
                            <IconButton
                              onClick={() => this.firstPageChange()}
                              disabled={this.state.page === 0 || this.state.page === 1}
                            >
                              <FirstPageIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => this.lastPageChange(this.state.tabelData.total_pages - 1)}
                              disabled={this.state.page === (+this.state.tabelData.total_pages - 1)}
                            >
                              <LastPageIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                }
              </Grid>
              <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                <Button color='primary' variant='contained' onClick={() => this.setState({ selectedGroupid: '' })} disabled={!this.state.selectedGroupid} >Clear Selected Group</Button> &nbsp;&nbsp;
                <Button color='primary' variant='contained' disabled={!this.state.selectedGroupid} onClick={() => this.functionToAssignGroupId(false)}>Assign Group</Button>&nbsp;&nbsp;
                <Button color='primary' variant='contained' disabled={this.state.selectedGroupid} onClick={() => this.functionToAssignGroupId(true)}>Skip</Button>
              </Grid>
              {/* </>
              } */}
            </Grid>
          </Paper>
        </Modal>
      </>
    )
    return modal
  }

  render () {
    return (
      <div>
        <React.Fragment>
          <div>
            <FormControl margin='normal' style={{ width: '200px', paddingLeft: '10px' }}>
              <FormLabel component='legend'>Name</FormLabel>
              <Input type='text' name='name' label='Name' onChange={this.handleChange} placeholder='Name' value={this.state.name ? this.state.name : []} />
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '70px' }}>
              <FormLabel>Grade</FormLabel>
              <Input value={this.state.gradeId ? [] : this.state.grade} />
              <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
            </FormControl>
            {this.state.gradeId && <Button variant='contained' color='primary' onClick={() => this.setState({ open: true })}>Assign Group</Button>}
            <FormControl component='fieldset' margin='normal' style={{ width: 'auto', paddingLeft: '120px' }}>
              <FormLabel component='legend'>Gender</FormLabel>
              <RadioGroup
                aria-label='gender'
                name='gender'
                value={this.state.gender}
                defaultValue={this.state.gender}
                onChange={this.handlegender}
              >
                <FormControlLabel value='male' control={<Radio />} label='Male' />
                <FormControlLabel value='female' control={<Radio />} label='Female' />
                <FormControlLabel value='other' control={<Radio />} label='Other' />
              </RadioGroup>
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '120px' }}>
              {/* */}
              <FormLabel>Date Of Birth</FormLabel>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  style={{ margin: 8 }}
                  // label='Date of Birth *'
                  value={this.state.dateOfBirth}
                  onChange={this.handleDateChange}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </div>
          <div>

            <FormControl margin='normal' style={{ width: '200px', paddingLeft: '10px' }} >
              {/* <InputLabel htmlFor='email'>Your Email </InputLabel> */}
              <FormLabel> Email id</FormLabel>
              <Input width='auto' name='email' type='email' onChange={this.handleChange} placeholder='Enter Email' value={this.state.email ? this.state.email : []} />
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '70px' }}>
              <FormLabel> Mobile Number</FormLabel>
              <Input type='number' name='phoneNumber' onChange={this.handleChange} placeholder='Enter Mobile'value={this.state.phoneNumber ? this.state.phoneNumber : []} />
              {this.state.phoneNumber ? this.state.phoneNumber.length === 10
                ? <p style={{ color: 'green' }}>Valid</p>
                : <p style={{ color: 'red' }}>Must be a valid contact number</p> : ''
              }
              {this.state.phoneNumber ? this.state.phoneNumber.length > 10
                ? <p style={{ color: 'red' }}>Invalid</p>
                : <p style={{ color: 'red' }} /> : ''
              }
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '120px' }}>
              <FormLabel>Address</FormLabel>
              <TextField
                id='standard-multiline-flexible'
                multiline
                rowsMax='4'
                placeholder='Enter Address'
                value={this.state.address}
                onChange={this.handleaddress}
                // className={classes.textField}
                margin='normal'
              />

            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '80px' }}>
              <FormLabel>City</FormLabel>
              <Input type='text' name='city' onChange={this.handleChange} placeholder='City' value={this.state.city ? this.state.city : []} />
            </FormControl>
          </div>
          <div>
            <FormControl margin='normal' style={{ width: '200px', paddingLeft: '10px' }}>
              <FormLabel> School </FormLabel>
              <Input type='text' name='school' onChange={this.handleChange} placeholder='School Name' value={this.state.school ? this.state.school : []} />
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '70px' }}>
              <FormLabel> Pincode </FormLabel>
              <Input type='number' name='pincode' onChange={this.handleChange} placeholder='Pincode' value={this.state.pincode ? this.state.pincode : []} />
            </FormControl>
          </div>
          <div>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '120px' }}>
              <Button color='primary' variant='contained' type='submit' onClick={this.handleSave} disabled={this.state.gradeId}> Save</Button>
            </FormControl>
            <FormControl margin='normal' style={{ width: 'auto', paddingLeft: '120px' }}>
              <Button color='secondary' variant='contained' type='submit'
                primary
                onClick={this.props.history.goBack}
              // type='button'
              >
                  Return
              </Button>
            </FormControl>
          </div>
        </React.Fragment>
        {this.modalOpen()}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items

})
export default connect(mapStateToProps)(withRouter(EditGuestStudent))
