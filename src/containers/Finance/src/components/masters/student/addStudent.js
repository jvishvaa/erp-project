import React, { Component } from 'react'
import { Grid, Form, Radio, Input, Message } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import 'react-phone-number-input/style.css'
import { urls } from '../../../urls'
import '../../css/staff.css'
import { apiActions } from '../../../_actions'
import { AlertMessage, OmsSelect } from '../../../ui'

class AddStudent extends Component {
  constructor (props) {
    super()
    this.state = {
      transport: 'False',
      errorList: [],
      student_photo: [],
      mother_photo: [],
      father_photo: [],
      guardian_photo: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.onDropStudent = this.onDropStudent.bind(this)
    this.onDropMother = this.onDropMother.bind(this)
    this.onDropFather = this.onDropFather.bind(this)
    this.onDropGuardian = this.onDropGuardian.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal' || this.role === 'FOE') {
      this.setState({
        branchId: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleClickBranch({ value: academicProfile.branch_id }) })
    } else if (this.role === 'BDM') {
      let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
      let branchData = []
      let map = new Map()
      for (const item of branchsAssigned) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true)
          branchData.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }
      this.setState({ branchData })
      console.log(branchData, 'dattaat')
    }
  }

  handleFormChange = e => {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  onDropStudent (studentPhoto) {
    this.state.student_photo
      ? this.setState({
        student_photo: studentPhoto
      })
      : this.setState({ student_photo: studentPhoto })
  }

  onDropMother (motherPhoto) {
    this.state.mother_photo
      ? this.setState({
        mother_photo: motherPhoto
      })
      : this.setState({ mother_photo: motherPhoto })
  }

  onDropFather (fatherPhoto) {
    this.state.father_photo
      ? this.setState({
        father_photo: fatherPhoto
      })
      : this.setState({ father_photo: fatherPhoto })
  }

  onDropGuardian (guardianPhoto) {
    this.state.guardian_photo
      ? this.setState({
        guardian_photo: guardianPhoto
      })
      : this.setState({ guardian_photo: guardianPhoto })
  }

  handleSubmit = e => {
    this.setState({ errorList: [] }, () => this.errorHandling())
    this.error = false
    this.setState({
      errorList: [],
      error: false,
      branchError: false,
      gradeError: false,
      sectionError: false,
      studentNameError: false,
      rollNoError: false,
      aadharNoError: false,
      addressError: false,
      admissionDateError: false,
      birthDateError: false,
      erpError: false,
      admissionNoError: false,
      grNoError: false,
      genderError: false,
      catError: false,
      fatherNameError: false,
      fatherMobileError: false,
      fatherEmailError: false,
      motherNameError: false,
      motherMobileError: false,
      motherEmailError: false,
      passwordError: false,
      guardianNameError: false,
      guardianMobileError: false,
      guardianEmailError: false,
      lang1Error: false,
      lang2Error: false,
      lang3Error: false,
      lang4Error: false
    })
  };

  errorHandling () {
    if (!this.state.password || this.state.password === '') {
      this.inputErrorMessage('passwordError', 'Enter Password')
    }
    if (!this.state.guardian_email || this.state.guardian_email === '') {
      this.inputErrorMessage(' guardianEmailError', "Enter  guardian's email")
    }
    if (!this.state.guardian_mobile || this.state.guardian_mobile === '') {
      this.inputErrorMessage(' guardianMobileError', "Enter  guardian's mobile")
    }
    if (!this.state.guardian_name || this.state.guardian_name === '') {
      this.inputErrorMessage(' guardianNameError', "Enter  guardian's name")
    }
    if (!this.state.mother_email || this.state.mother_email === '') {
      this.inputErrorMessage('motherEmailError', "Enter mother's email")
    }
    if (!this.state.mother_mobile || this.state.mother_mobile === '') {
      this.inputErrorMessage('motherMobileError', "Enter mother's mobile")
    }
    if (!this.state.mother_name || this.state.mother_name === '') {
      this.inputErrorMessage('motherNameError', "Enter mother's name")
    }
    if (!this.state.father_email || this.state.father_email === '') {
      this.inputErrorMessage('fatherEmailError', "Enter father's email")
    }
    if (!this.state.father_mobile || this.state.father_mobile === '') {
      this.inputErrorMessage('fatherMobileError', "Enter father's mobile")
    }
    if (!this.state.father_name || this.state.father_name === '') {
      this.inputErrorMessage('fatherNameError', "Enter father's name")
    }
    if (!this.state.category || this.state.category === '') {
      this.inputErrorMessage('catError', 'Select Category')
    }
    if (!this.state.gender || this.state.gender === '') {
      this.inputErrorMessage('genderError', 'Select Gender')
    }
    if (!this.state.gr_no || this.state.gr_no === '') {
      this.inputErrorMessage('grNoError', 'Enter GR Number')
    }
    if (!this.state.admission_no || this.state.admission_no === '') {
      this.inputErrorMessage('admissionNoError', 'Enter Admission Number')
    }
    if (!this.state.enrollment_code || this.state.enrollment_code === '') {
      this.inputErrorMessage('erpError', 'Enter Enrollment Code')
    }
    if (!this.state.dob || this.state.dob === '') {
      this.inputErrorMessage('birthDateError', 'Select date of Birth')
    }
    if (!this.state.date_of_admission || this.state.date_of_admission === '') {
      this.inputErrorMessage('admissionDateError', 'Select date of Admission')
    }
    if (this.state.date_of_admission < this.state.dob) {
      let errorList = this.state.errorList
      errorList.push('Select appropriate dates')
      this.setState({ errorList: errorList })
      this.error = true
    }
    if (!this.state.address || this.state.address === '') {
      this.inputErrorMessage('addressError', 'Enter Address')
    }
    if (!this.state.aadhar_no || this.state.aadhar_no === '') {
      this.inputErrorMessage('aadharNoError', 'Enter Aadhar Number')
    }
    if (!this.state.roll_no || this.state.roll_no === '') {
      this.inputErrorMessage('rollNoError', 'Enter Roll Number')
    }
    if (!this.state.student_name || this.state.student_name === '') {
      this.inputErrorMessage('studentNameError', 'Enter Student Number')
    }
    if (!this.state.branchId || this.state.branchId === null) {
      this.inputErrorMessage('branchError', 'Select Branch')
    }
    if (!this.state.gradeId || this.state.gradeId === null) {
      this.inputErrorMessage('gradeError', 'Select Grade')
    }
    if (!this.state.sectionId || this.state.sectionId === null) {
      this.inputErrorMessage('sectionError', 'Select Section')
    }
    if (!this.state.language1) {
      this.inputErrorMessage('lang1Error', 'Select First Language')
    }
    if (!this.state.language2) {
      this.inputErrorMessage('lang2Error', 'Select Second Language')
    }
    if (!this.state.language3) {
      this.inputErrorMessage('lang3Error', 'Select Third Language')
    }
    if (!this.state.language4) {
      this.inputErrorMessage('lang4Error', 'Select Fourth Language')
    }
    if (
      this.state.language1 === this.state.language2 ||
      this.state.language1 === this.state.language3 ||
      this.state.language1 === this.state.language4 ||
      this.state.language2 === this.state.language3 ||
      this.state.language2 === this.state.language4 ||
      this.state.language3 === this.state.language4
    ) {
      let errorList = this.state.errorList
      errorList.push('Select Different Languages')
      this.setState({ errorList: errorList })
      this.error = true
    }
    if (!this.error) {
      console.log(this.state)
      var formData = new FormData()
      // let data = this.state
      this.setState({ erpExists: false })
      formData.append('student_name', this.state.student_name)
      formData.append('branchId', this.state.branchId)
      formData.append('gradeId', this.state.gradeId)
      formData.append('sectionId', this.state.sectionId)
      formData.append('roll_no', this.state.roll_no)
      formData.append('aadhar_no', this.state.aadhar_no)
      formData.append('address', this.state.address)
      formData.append('date_of_admission', this.state.date_of_admission)
      formData.append('dob', this.state.dob)
      formData.append('enrollment_code', this.state.enrollment_code)
      formData.append('admission_no', this.state.admission_no)
      formData.append('gr_no', this.state.gr_no)
      formData.append('gender', this.state.gender)
      formData.append('category', this.state.category)
      formData.append('transport', this.state.transport)
      formData.append('father_name', this.state.father_name)
      formData.append('father_mobile', this.state.father_mobile)
      formData.append('father_email', this.state.father_email)
      formData.append('mother_name', this.state.mother_name)
      formData.append('mother_mobile', this.state.mother_mobile)
      formData.append('mother_email', this.state.mother_email)
      formData.append('guardian_name', this.state.guardian_name)
      formData.append('guardian_email', this.state.guardian_email)
      formData.append('guardian_mobile', this.state.guardian_mobile)
      formData.append('student_photo', [])
      formData.append('mother_photo', [])
      formData.append('father_photo', [])
      formData.append('guardian_photo', [])
      formData.append('password', this.state.password)
      formData.append('language1', this.state.language1)
      formData.append('language2', this.state.language2)
      formData.append('language3', this.state.language3)
      formData.append('language4', this.state.language4)

      this.state.student_photo && this.state.student_photo.forEach(studentphoto => {
        formData.set('student_photo', studentphoto)
      })
      this.state.mother_photo && this.state.mother_photo.forEach(motherphoto => {
        formData.set('mother_photo', motherphoto)
      })
      this.state.father_photo && this.state.father_photo.forEach(fatherphoto => {
        formData.set('father_photo', fatherphoto)
      })
      this.state.guardian_photo && this.state.guardian_photo.forEach(guardianphoto => {
        formData.set('guardian_photo', guardianphoto)
      })

      axios
        .post(urls.Student, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }

        })
        .then(res => {
          console.log('Status', res.status)
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
                messageText: 'Student not created',
                variant: 'error',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
          }
        })
        .catch(error => {
          if (error.response.status === 409) {
            this.setState({ erpExists: true })
          } else {
            this.setState({
              alertMessage: {
                messageText: 'Student not created',
                variant: 'error',
                reset: () => {
                  this.setState({ alertMessage: null })
                }
              }
            })
          }
          console.log("Error: Couldn't fetch data from " + urls.Teacher, error)
        })

      // this.props.addStudent(this.state)
    } else {
      window.scrollTo(0, 0)
    }
  }

  inputErrorMessage (field, value) {
    let errorList = this.state.errorList
    errorList.push(value)
    this.setState({ [field]: true, errorList: errorList })
    this.error = true
  }

  handleClickBranch = event => {
    this.setState({ branchId: event.value, valueGrade: [], valueSection: [] })
    this.props.gradeMapBranch(event.value)
  };

  handleClickGrade (event) {
    this.setState({ gradeId: event.value, valueGrade: event, valueSection: [] })
    this.props.sectionMap(event.value)
  };

  transport = (e, i) => {
    if (i.checked) {
      this.setState({ transport: 'True' })
    } else {
      this.setState({ transport: 'False' })
    }
  };

  render () {
    const studentPhoto = this.state.student_photo &&
    this.state.student_photo.map(studentPhoto => (
      <li key={studentPhoto.name}>
        {studentPhoto.name} - {studentPhoto.size} bytes
      </li>
    ))

    const motherPhoto = this.state.mother_photo &&
    this.state.mother_photo.map(motherPhoto => (
      <li key={motherPhoto.name}>
        { motherPhoto.name} - { motherPhoto.size} bytes
      </li>
    ))

    const fatherPhoto = this.state.father_photo &&
    this.state.father_photo.map(fatherPhoto => (
      <li key={fatherPhoto.name}>
        {fatherPhoto.name} - {fatherPhoto.size} bytes
      </li>
    ))

    const guardianPhoto = this.state.guardian_photo &&
    this.state.guardian_photo.map(guardianPhoto => (
      <li key={guardianPhoto.name}>
        {guardianPhoto.name} - {guardianPhoto.size} bytes
      </li>
    ))
    this.props.student &&
      this.props.student.success === 'Added student' &&
      this.props.alert.success('Added student')

    return (
      <React.Fragment>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Form onChange={this.handleFormChange} onSubmit={this.handleSubmit}>
          <Grid>
            {this.state.errorList.length > 0 && (
              <Grid.Row>
                <Grid.Column computer={6} mobile={15} tablet={10}>
                  <Message
                    negative
                    compact
                    header='There was some errors with your submission'
                    list={this.state.errorList}
                  />
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Branch</label>
                  {this.role === 'Principal' || this.role === 'FOE'
                    ? <OmsSelect
                      defaultValue={
                        [{ label: this.state.branch_name, value: this.state.branchId }]
                      }
                      disabled
                    />
                    : <OmsSelect
                      options={
                        this.props.branches
                          ? this.props.branches.map(branch => ({
                            value: branch.id,
                            label: branch.branch_name
                          }))
                          : []
                      }
                      change={this.handleClickBranch}
                    />
                  }
                  {this.state.branchError && (
                    <p style={{ color: 'red' }}>Select Branch</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Grade</label>
                  <OmsSelect
                    change={this.handleClickGrade}
                    defaultValue={this.state.valueGrade}
                    options={
                      this.props.grades
                        ? this.props.grades.map(grades => ({
                          value: grades.id,
                          label: grades.grade.grade
                        }))
                        : []
                    }
                    placeholder='Select Grade'
                  />
                  {this.state.gradeError && (
                    <p style={{ color: 'red' }}>Select Grade</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Section</label>
                  <OmsSelect
                    defaultValue={this.state.valueSection}
                    options={
                      this.props.section
                        ? this.props.section.map(section => ({
                          value: section.id,
                          label: section.section.section_name
                        }))
                        : []
                    }
                    change={(e) =>
                      this.setState({ sectionId: e.value, valueSection: e })
                    }
                    placeholder='Select Section'
                  />
                  {this.state.sectionError && (
                    <p style={{ color: 'red' }}>Select Section</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Student Name</label>
                  <Input
                    type='text'
                    name='student_name'
                    placeholder='Student Name'
                    error={this.state.studentNameError}
                  />
                  {this.state.studentNameError && (
                    <p style={{ color: 'red' }}>Enter student Name</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Roll Number</label>
                  <Input
                    type='number'
                    name='roll_no'
                    placeholder='Roll Number'
                    error={this.state.rollNoError}
                  />
                  {this.state.rollNoError && (
                    <p style={{ color: 'red' }}>Enter Roll Number</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Aadhar Number</label>
                  <Input
                    type='text'
                    name='aadhar_no'
                    placeholder='Aadhaar Number'
                    error={this.state.aadharNoError}
                  />
                  {this.state.aadharNoError && (
                    <p style={{ color: 'red' }}>Enter Aadhar Number</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Address</label>
                  <Input
                    type='text'
                    name='address'
                    placeholder='Address'
                    error={this.state.addressError}
                  />
                  {this.state.addressError && (
                    <p style={{ color: 'red' }}>Enter Address</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Date Of Admission</label>
                  <Input
                    type='date'
                    name='date_of_admission'
                    error={this.state.admissionDateError}
                  />
                  {this.state.admissionDateError && (
                    <p style={{ color: 'red' }}>Select Date of Admission</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Date Of Birth</label>
                  <Input
                    type='date'
                    name='dob'
                    error={this.state.birthDateError}
                  />
                  {this.state.birthDateError && (
                    <p style={{ color: 'red' }}>Select Date of Birth</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Enrollment Code</label>
                  <Input
                    type='text'
                    name='enrollment_code'
                    placeholder='Enrollment Code'
                    maxLength={12}
                    ref={c => (this.inputRefErp = c)}
                    error={
                      this.state.erpError ||
                      (this.props.student &&
                        this.props.student.error === 'Conflict' &&
                        this.inputRefErp.focus())
                    }
                  />
                  {this.state.erpError && (
                    <p style={{ color: 'red' }}>Enter Enrollment Code</p>
                  )}
                  {this.props.student &&
                    this.props.student.error === 'Conflict' && (
                    <p style={{ color: 'red' }}>
                        ERP code already exists
                    </p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Admission Number</label>
                  <Input
                    type='text'
                    name='admission_no'
                    placeholder='Admission Number'
                    error={this.state.admissionNoError}
                  />
                  {this.state.admissionNoError && (
                    <p style={{ color: 'red' }}>Enter Admission Number</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Gr Number</label>
                  <Input
                    type='text'
                    name='gr_no'
                    placeholder='Gr Number'
                    error={this.state.grNoError}
                  />
                  {this.state.grNoError && (
                    <p style={{ color: 'red' }}>Enter GR Number</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Gender</label>
                  <OmsSelect
                    placeholder='Select Gender'
                    options={[
                      { value: 'female', label: 'Female' },
                      { value: 'male', label: 'Male' }
                    ]}
                    change={(state) =>
                      this.setState({ gender: state.value })}
                  />
                  {this.state.genderError && (
                    <p style={{ color: 'red' }}>Enter Gender</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Category</label>
                  <OmsSelect
                    placeholder='Select Category'
                    options={[
                      { value: 'Residential', label: 'Residential' },
                      { value: 'Day Scholar', label: 'Day Scholar' }
                    ]}
                    change={(state) =>
                      this.setState({ category: state.value })}
                  />
                  {this.state.catError && (
                    <p style={{ color: 'red' }}>Enter Category</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Using Transport</label>
                  <Form.Field>
                    <Radio style={{ border: '1px solid black', borderRadius: '25px' }}
                      onChange={this.transport}
                      toggle />
                  </Form.Field>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column computer={6} mobile={15} tablet={10}>
                Parent Information
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Father Name</label>
                  <Input
                    type='text'
                    name='father_name'
                    placeholder='Father Name'
                    error={this.state.fatherNameError}
                  />
                  {this.state.fatherNameError && (
                    <p style={{ color: 'red' }}>Enter father's name</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Father Mobile</label>
                  <PhoneInput
                    type='tel'
                    name='father_mobile'
                    className='form-control'
                    value={this.state.father_mobile}
                    onChange={state =>
                      this.setState({ father_mobile: state })
                    }
                    maxLength={15}
                    placeholder='Father Mobile'
                  />
                  {this.state.fatherMobileError && (
                    <p style={{ color: 'red' }}>Enter father's mobile</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Father Email</label>
                  <Input
                    type='email'
                    name='father_email'
                    placeholder='Father Email'
                    error={this.state.fatherEmailError}
                  />
                  {this.state.fatherEmailError && (
                    <p style={{ color: 'red' }}>Enter father's email</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Mother Name</label>
                  <Input
                    type='text'
                    name='mother_name'
                    placeholder='Mother Name'
                    error={this.state.motherNameError}
                  />
                  {this.state.motherNameError && (
                    <p style={{ color: 'red' }}>Enter mother's name</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Mother Mobile</label>
                  <PhoneInput
                    type='tel'
                    name='mother_mobile'
                    className='form-control'
                    value={this.state.mother_mobile}
                    onChange={state =>
                      this.setState({ mother_mobile: state })
                    }
                    maxLength={15}
                    placeholder='Mother Mobile'
                  />
                  {this.state.motherMobileError && (
                    <p style={{ color: 'red' }}>Enter mother's mobile</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field>
                  <label>Mother Email</label>
                  <Input
                    type='email'
                    name='mother_email'
                    placeholder='Mother Email'
                    error={this.state.motherEmailError}
                  />
                  {this.state.motherEmailError && (
                    <p style={{ color: 'red' }}>Enter mother's email</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Guardian Name</label>
                  <Input
                    type='text'
                    name='guardian_name'
                    placeholder='Guardian Name'
                    error={this.state.guardianNameError}
                  />
                  {this.state.guardianNameError && (
                    <p style={{ color: 'red' }}>Enter guardian's name</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Guardian  Mobile</label>
                  <PhoneInput
                    type='tel'
                    name='guardian_mobile'
                    className='form-control'
                    value={this.state.guardian_mobile}
                    onChange={state =>
                      this.setState({ guardian_mobile: state })
                    }
                    maxLength={15}
                    placeholder='Guardian Mobile'
                  />
                  {this.state.guardianMobileError && (
                    <p style={{ color: 'red' }}>Enter guardian's mobile</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Guardian Email</label>
                  <Input
                    type='email'
                    name='guardian_email'
                    placeholder='Guardian Email'
                    error={this.state.guardianEmailError}
                  />
                  {this.state.guardianEmailError && (
                    <p style={{ color: 'red' }}>Enter guardian's email</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>
                Upload Mother Photo<sup>*</sup>
                </label>
                <br />
                <Dropzone onDrop={this.onDropMother}>
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
                          {isDragAccept && 'All mother_photo will be accepted'}
                          {isDragReject && 'Some mother_photo will be rejected'}
                          {!isDragActive && 'Drop mother_photo here.'}
                        </div>
                        {motherPhoto}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>
                Upload Father Photo<sup>*</sup>
                </label>
                <br />
                <Dropzone onDrop={this.onDropFather}>
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
                          {isDragAccept && 'All father_photo will be accepted'}
                          {isDragReject && 'Some father_photo will be rejected'}
                          {!isDragActive && 'Drop your father_photo here.'}
                        </div>
                        {fatherPhoto}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>
                      Upload Guardian Photo<sup>*</sup>
                </label>
                <br />
                <Dropzone onDrop={this.onDropGuardian}>
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
                          {isDragAccept && 'All guardian_photo will be accepted'}
                          {isDragReject && 'Some guardian_photo will be rejected'}
                          {!isDragActive && 'Drop your guardian_photo here.'}
                        </div>
                        {guardianPhoto}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField1'
              >
                <Form.Field required>
                  <label>Password</label>
                  <Input
                    type='password'
                    name='password'
                    placeholder='Password'
                    error={this.state.passwordError}
                  />
                  {this.state.passwordError && (
                    <p style={{ color: 'red' }}>Enter Password</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>First Language</label>
                  <OmsSelect
                    placeholder='Select First Language'
                    options={
                      this.props.subject
                        ? this.props.subject.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    }
                    change={(state) =>
                      this.setState({ language1: state.value })}
                  />
                  {this.state.lang1Error && (
                    <p style={{ color: 'red' }}>Select First Language</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Second Language</label>
                  <OmsSelect
                    placeholder='Select Second Language'
                    options={
                      this.props.subject
                        ? this.props.subject.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    }
                    change={(state) =>
                      this.setState({ language2: state.value })}
                  />
                  {this.state.lang2Error && (
                    <p style={{ color: 'red' }}>Select Second Language</p>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Third Language</label>
                  <OmsSelect
                    placeholder='Select Third Language'
                    options={
                      this.props.subject
                        ? this.props.subject.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    }
                    change={(state) =>
                      this.setState({ language3: state.value })}
                  />
                  {this.state.lang3Error && (
                    <p style={{ color: 'red' }}>Select Third Language</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
                className='student-section-inputField'
              >
                <Form.Field required>
                  <label>Fourth Language</label>
                  <OmsSelect
                    placeholder='Select Fourth Language'
                    options={
                      this.props.subject
                        ? this.props.subject.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    }
                    change={(state) =>
                      this.setState({ language4: state.value })}
                  />
                  {this.state.lang4Error && (
                    <p style={{ color: 'red' }}>Select Fourth Language</p>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={10}
                className='student-section-inputField1'
              >
                <label>
                      Upload Student Photo<sup>*</sup>
                </label>
                <br />
                <Dropzone onDrop={this.onDropStudent}>
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
                          {isDragAccept && 'All student_photo will be accepted'}
                          {isDragReject && 'Some student_photo will be rejected'}
                          {!isDragActive && 'Drop your student_photo here.'}
                        </div>
                        {studentPhoto}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={16}
                mobile={16}
                tablet={15}
                className='student-section-addstaff-button'
              >
                <Button type='submit' color='green'>
                  Save
                </Button>
                <Button
                  primary
                  onClick={this.props.history.goBack}
                  type='button'
                >
                  Return
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  subject: state.subjects.items,
  user: state.authentication.user,
  student: state.student,
  grades: state.gradeMap.items,
  section: state.sectionMap.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  addStudent: studentData => dispatch(apiActions.addStudent(studentData)),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddStudent))
