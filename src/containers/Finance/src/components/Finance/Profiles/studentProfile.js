import React, { Component } from 'react'
import { Paper, withStyles, Button, Grid, TextField } from '@material-ui/core'
import axios from 'axios'
import { Edit } from '@material-ui/icons/'
import Switch from '@material-ui/core/Switch'
import Select from 'react-select'
import customClasses from './studentProfile.module.css'
import { urls } from '../../../urls'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import Modal from '../../../ui/Modal/modal'

const styles = theme => ({
  paper: {
    // paddingTop: '50px',
    height: '250px',
    maxHeight: '250px',
    overflowY: 'auto',
    dataLoading: false
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%'
  }
})
class StudentProfile extends Component {
  state= {
    studentData: null,
    imageSrc: null,
    showEditModal: false,
    mode: null,
    studentName: null,
    studentAddress: null,
    fatherName: null,
    fatherNumber: null,
    emailId: null,
    secondLang: null,
    thirdLang: null,
    subjects: null,
    shiftChoice: '',
    typeChoice: '',
    isTypeChoiceDisabled: false
  }

  fetchStudentPic = (url = null) => {
    if (!url) {
      return
    }
    this.setState({
      dataLoading: true
    }, () => {
      axios
        .get(
          urls.BASE + url,
          { responseType: 'arraybuffer',
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }
        )
        .then(response => {
          const base64 = window.btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
          this.setState({ imageSrc: 'data:;base64,' + base64, dataLoading: false })
        }).catch(err => {
          console.log(err)
          this.setState({
            dataLoading: false
          })
        })
    })
  }

  fetchStudentProfile = () => {
    this.setState({ dataLoading: true }, () => {
      axios.get(`${urls.StudentsInfo}?erp_code=${this.props.erp}&academic_year=${this.props.session}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(response => {
        this.setState({
          studentData: response.data,
          dataLoading: false
        }, () => {
          this.fetchStudentPic(response && response.data[0] && response.data[0].student_photo)
        })
      }).catch(err => {
        // console.log('Something is wrong')
        console.log(err)
        this.setState({
          dataLoading: false
        })
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          this.props.alert.warning(err.response.data.err_msg)
        } else {
          this.props.alert.warning('Something Went Wrong!')
        }
      })
    })
  }

  componentDidMount () {
    const erpString = this.props.erp + ''
    // if (erpString.length === 14) {
      this.fetchStudentProfile()
    // }
  }

  componentDidUpdate (prevProps, prevState) {
    const erpString = this.props.erp + ''
    if (this.props.erp !== prevProps.erp && erpString.length === 14) {
      this.fetchStudentProfile()
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('nextProps: ', nextProps.studentData)
  }

  showEditStudentHandler = () => {
    const { studentData } = this.state
    this.setState({
      showEditModal: true,
      mode: studentData && studentData.parent_access ? studentData.parent_access : null,
      studentName: studentData && studentData.student_name ? studentData.student_name : null,
      fatherName: studentData && studentData.father_name ? studentData.father_name : null,
      fatherNumber: studentData && studentData.father_mobile ? studentData.father_mobile : null,
      studentAddress: studentData && studentData.student_Address ? studentData.student_Address : null,
      emailId: studentData && studentData.email_id ? studentData.email_id : null,
      secondLang: studentData.second_lang && studentData.second_lang.id ? {
        label: studentData.second_lang && studentData.second_lang.second_lang,
        value: studentData.second_lang && studentData.second_lang.id
      } : '',
      thirdLang: studentData.third_lang && studentData.third_lang.id ? {
        label: studentData.third_lang && studentData.third_lang.third_lang,
        value: studentData.third_lang && studentData.third_lang.id
      } : '',
      dataLoading: true,
      typeChoice: studentData && studentData.type_choices ? {
        label: studentData && studentData.type_choices.label,
        value: studentData && studentData.type_choices.value
      } : '',
      shiftChoice: studentData && studentData.shift_choices ? {
        label: studentData && studentData.shift_choices.label,
        value: studentData && studentData.shift_choices.value
      } : '',
      isTypeChoiceDisabled: studentData && studentData.is_type_choice_disable
    }, () => {
      if (!this.state.subjects) {
        axios
          .get(urls.SubjectStoreUrl + '?academic_year=' + this.props.session + '&erp=' + this.props.erp, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }).then(response => {
            console.log(response.data)
            const newSubArr = [...response.data]
            newSubArr.unshift({ id: 'none', subject_name: 'none' })
            console.log(newSubArr)
            this.setState({
              subjects: newSubArr
            })
          }).catch(error => {
            console.log(error)
            this.props.alert.warning('Unable to load Subjects')
          })
      }
      this.setState({
        dataLoading: false
      })
    })
  }

  hideEditStudentHandler = () => {
    this.setState({
      showEditModal: false
    })
  }

  handleSwitch = (e) => {
    // console.log('switch state', e.target.checked)
    this.setState({
      mode: e.target.checked
    })
  }

  handleChangeEmailId = (e) => {
    this.setState({
      emailId: e.target.value
    })
  }

  handleEditChange= (event) => {
    switch (event.target.id) {
      case 'student_name': {
        this.setState({
          studentName: event.target.value
        })
        break
      }
      case 'father_name': {
        this.setState({
          fatherName: event.target.value
        })
        break
      }
      case 'father_number': {
        this.setState({
          fatherNumber: event.target.value
        })
        break
      }
      case 'address': {
        this.setState({
          studentAddress: event.target.value
        })
        break
      }
      default: {
      }
    }
  }

  handleSecondLang = (e) => {
    this.setState({
      secondLang: e
    })
  }

  handleThirdLang = (e) => {
    this.setState({
      thirdLang: e
    })
  }

  handleShiftChoice = (e) => {
    this.setState({
      shiftChoice: e
    })
  }

  handleTypeChoice = (e) => {
    this.setState({
      typeChoice: e
    })
  }

  saveStudentData = () => {
    // send edit data
    this.setState({
      dataLoading: true
    }, () => {
      const { studentName, studentAddress, fatherName, fatherNumber, shiftChoice, typeChoice, mode, emailId, secondLang, thirdLang } = this.state
      let data = {
        // erp: this.props.erp,
        student_name: studentName,
        student_Address: studentAddress,
        father_name: fatherName,
        father_mobile: fatherNumber,
        parent_access: mode,
        email_id: emailId,
        second_lang: secondLang.value ? secondLang.value : 'none',
        third_lang: thirdLang.value ? thirdLang.value : 'none',
        shift_choice: shiftChoice && shiftChoice.value ? shiftChoice && shiftChoice.value : '',
        type_choice: typeChoice && typeChoice.value ? typeChoice && typeChoice.value : ''
      }
      axios
        .put(`${urls.StudentsInfo}?erp_code=${this.props.erp}&academic_year=${this.props.session}`, data, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then(response => {
          if (response.status === 200) {
            this.props.alert.success('Successfully Saved')
            const newStudentData = { ...this.state.studentData }
            newStudentData['student_name'] = response.data.student_name
            newStudentData['student_Address'] = response.data.student_Address
            newStudentData['father_name'] = response.data.father_name
            newStudentData['father_mobile'] = response.data.father_mobile
            newStudentData['parent_access'] = response.data.parent_access
            newStudentData['email_id'] = response.data.email_id
            newStudentData['second_lang'] = response.data.second_lang
            newStudentData['third_lang'] = response.data.third_lang
            newStudentData['shift_choices'] = response.data.shift_choices
            newStudentData['type_choices'] = response.data.type_choices
            newStudentData['is_type_choice_disable'] = response.data.is_type_choice_disable
            this.setState({
              studentData: newStudentData,
              dataLoading: false
            }, () => {
              this.hideEditStudentHandler()
            })
          }
        }).catch(err => {
          // this.props.alert.warning('Unable to load data')
          this.setState({
            dataLoading: false
          })
          if (err.response && (err.response.status === 400 || err.response.status === 404)) {
            this.props.alert.warning(err.response.data.err_msg)
          } else {
            this.props.alert.warning('Something Went Wrong!')
          }
          console.log(err)
        })
    })
  }

  render () {
    // console.log('theStudentData: ', this.state.studentData)
    const { classes } = this.props
    const isErpPresent = (this.props.erp + '').length === 14
    const containerClass = isErpPresent ? customClasses.mainContainer : customClasses.noContainer
    const { showEditModal, studentName, studentAddress, fatherName, fatherNumber, mode, emailId,
      secondLang, thirdLang, subjects
    } = this.state
    let studentDetails = null
    let editModal = null
    if (showEditModal) {
      editModal = (
        <Modal open={showEditModal} large style={{ height: '520px' }} click={this.hideEditStudentHandler}>
          <h3 className={customClasses.modal__heading}>Edit Student Details</h3>
          <hr />
          <div className={customClasses.modal__content}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <TextField
                  id='student_name'
                  label='Student Name'
                  className={classes.textField}
                  value={studentName}
                  onChange={(e) => { this.handleEditChange(e) }}
                  margin='normal'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id='father_name'
                  label='Father Name'
                  className={classes.textField}
                  value={fatherName}
                  onChange={(e) => { this.handleEditChange(e) }}
                  margin='normal'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id='father_number'
                  label='Father Number'
                  type='number'
                  className={classes.textField}
                  value={fatherNumber}
                  onChange={(e) => { this.handleEditChange(e) }}
                  margin='normal'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id='address'
                  label='Address'
                  className={classes.textField}
                  value={studentAddress}
                  onChange={(e) => { this.handleEditChange(e) }}
                  margin='normal'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id='email_id'
                  type='email'
                  label='Father Email Id'
                  className={classes.textField}
                  value={emailId}
                  onChange={(e) => { this.handleChangeEmailId(e) }}
                  margin='normal'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={3} style={{ paddingTop: '20px' }}>
                Parent Portal Access:
                <Switch
                  checked={mode}
                  onChange={(e) => { this.handleSwitch(e) }}
                  // defaultChecked={studentData.is_active}
                  // value="checkedA"
                  // inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                {mode ? 'Active' : 'InActive'}
              </Grid>
              <Grid item xs={3} style={{ paddingTop: '20px' }}>
                Second Lang:
                <Select
                  placeholder='Not Assigned'
                  value={secondLang || null}
                  options={
                    subjects
                      ? subjects.filter((lang) => lang.is_second_language || lang.id === 'none').map(lang => ({
                        value: lang.id,
                        label: lang.subject_name
                      }))
                      : []
                  }
                  onChange={(e) => this.handleSecondLang(e)}
                />
              </Grid>
              <Grid item xs={3} style={{ paddingTop: '20px' }}>
                Third Lang:
                <Select
                  placeholder='Not Assigned'
                  value={thirdLang || null}
                  options={
                    subjects
                      ? subjects.filter((lang) => lang.is_third_language || lang.id === 'none').map(lang => ({
                        value: lang.id,
                        label: lang.subject_name
                      }))
                      : []
                  }
                  onChange={(e) => this.handleThirdLang(e)}
                />
              </Grid>
              <Grid item xs={3} style={{ paddingTop: '20px' }}>
                Shift Of Student:
                <Select
                  placeholder='Shift Of Student '
                  value={this.state.shiftChoice || null}
                  options={
                    [
                      {
                        label: 'Day Scholar',
                        value: 1
                      },
                      {
                        label: 'Day Scholar-Shift 2',
                        value: 2
                      }
                    ]
                  }
                  onChange={(e) => this.handleShiftChoice(e)}
                />
              </Grid>
              <Grid item xs={3} style={{ paddingTop: '20px' }}>
                Type Of Student:
                <Select
                  placeholder='Type Of Student'
                  isDisabled={this.state.isTypeChoiceDisabled}
                  value={this.state.typeChoice || null}
                  options={
                    [
                      {
                        label: 'RTE',
                        value: 1
                      },
                      {
                        label: 'Regular',
                        value: 2
                      },
                      {
                        label: 'Regular-Staff',
                        value: 3
                      },
                      {
                        label: 'Regular-FreeShip',
                        value: 4
                      },
                      {
                        label: 'Regular-GEI',
                        value: 5
                      }
                    ]
                  }
                  onChange={(e) => this.handleTypeChoice(e)}
                />
              </Grid>
            </Grid>
          </div>
          <div className={customClasses.modal__deletebutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.saveStudentData}>Save</Button>
          </div>
          <div className={customClasses.modal__remainbutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.hideEditStudentHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    console.log('student', this.state.studentData)
    if (this.state.studentData && isErpPresent) {
      studentDetails = (
        <Paper className={classes.paper}>
          <div className={customClasses.photoContainer}>
            <img src={this.state.studentData.student_photo} alt='Student Profile'
              style={{ height: '100%', width: '100%' }} />
          </div>
          <div className={customClasses.studentDetails}>
            <div>Student Name : <strong>{this.state.studentData.student_name}</strong></div>
            <div>ERP Code : <strong>{this.state.studentData.student_erp}</strong></div>
            <div>Date Of Birth : <strong>{this.state.studentData.date_of_birth}</strong></div>
            <div>Grade : <strong>{this.state.studentData.grade + ' (' + this.state.studentData.section + ')'}</strong></div>
            <div><Edit style={{ cursor: 'pointer' }} onClick={() => { this.showEditStudentHandler() }} /></div>
          </div>
          <div className={customClasses.studentDetails}>
            <div>Email Id : <strong>{this.state.studentData.email_id}</strong></div>
          </div>
          <div className={customClasses.seperator} />
          <div className={customClasses.otherDetails}>
            <div className={customClasses.parentalContainer}>
              <h3 style={{ fontWeight: 'lighter',
                textAlign: 'center' }}>Parental Details</h3>
              <div className={customClasses.parentalContainerInfo}>
                <div>Father Name : <strong>{this.state.studentData.father_name}</strong></div>
                <hr />
                <div>Father Mobile : <strong>{this.state.studentData.father_mobile}</strong></div>
                <hr />
                <div>Mother Name : <strong>{this.state.studentData.mother_name}</strong></div>
                <hr />
                <div>Mother Mobile: <strong>{this.state.studentData.mother_mobile}</strong></div>
                <hr />
                <div>Segment : <strong /></div>
                <hr />
                <div>Staff Kid : <strong /></div>
                <hr />
                <div>Address : <strong>{this.state.studentData.student_Address}</strong></div>
              </div>
            </div>
            <div className={customClasses.admissionContainer}>
              <h3 style={{ fontWeight: 'lighter',
                textAlign: 'center' }}>Admission Details</h3>
              <div className={customClasses.admissionInfo}>
                <div className={customClasses.admissionInfoCol1}>
                  <div>Admission No : <strong /></div>
                  <hr />
                  <div>Admission Date : <strong>{this.state.studentData.admission_date}</strong></div>
                  <hr />
                  <div>Status : <strong>{this.state.studentData.is_active ? 'Active' : 'Inactive'}</strong></div>
                  <hr />
                  <div>Student Join In : <strong /></div>
                  <hr />
                  <div>Parent Access : <strong>{this.state.studentData.parent_access ? 'Active' : 'Inactive'}</strong></div>
                  <hr />
                  <div>Advanced Fee : <strong /></div>
                  <hr />
                  <div>Promoted Status : <strong /></div>
                </div>
                <div className={customClasses.admissionInfoCol2}>
                  <div>Category : <strong>{this.state.studentData.is_dayscholar ? 'Day Scholar' : this.state.studentData.is_afternoonbatch ? 'After Noon Batch' : ''}</strong></div>
                  <hr />
                  <div>RTE : <strong>{this.state.studentData.is_rte ? 'Yes' : 'No'}</strong></div>
                  <hr />
                  <div>Special Child : <strong>{this.state.studentData.is_specialchild ? 'Yes' : 'No'}</strong></div>
                  <hr />
                  <div>Transport : <strong>{this.state.studentData.using_transport ? 'Transport Availed' : 'No Transport Availed'}</strong></div>
                  <hr />
                  <div>2nd Lang : <strong>{this.state.studentData.second_lang && this.state.studentData.second_lang.second_lang ? this.state.studentData.second_lang.second_lang : 'not assigned'}</strong></div>
                  <hr />
                  <div>3rd Lang : <strong>{this.state.studentData.third_lang && this.state.studentData.third_lang.third_lang ? this.state.studentData.third_lang.third_lang : 'not assigned'}</strong></div>
                  <hr />
                  <div>Shift Of Student : <strong>{this.state.studentData.shift_choices && this.state.studentData.shift_choices.label ? this.state.studentData.shift_choices.label : ''}</strong></div>
                  <hr />
                  <div>Type Of Student : <strong>{this.state.studentData.type_choices && this.state.studentData.type_choices.label ? this.state.studentData.type_choices.label : ''}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      )
    }
    return (
      <div className={containerClass}>
        {studentDetails}
        {editModal}
        {this.state.dataLoading ? <CircularProgress open /> : null}
      </div>
    )
  }
}

export default (withStyles(styles)(StudentProfile))
