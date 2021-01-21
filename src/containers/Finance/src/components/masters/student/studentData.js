import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'semantic-ui-react'
import { withStyles } from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper'
import { withRouter } from 'react-router-dom'
import { CountryRegionData } from 'react-country-region-selector'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import { connect } from 'react-redux'
import { apiActions } from '../../../_actions'
import { OmsSelect, InternalPageStatus } from '../../../ui'
import { urls } from '../../../urls'
import InputElements from './InputElems'
import { store } from '../../../_helpers'

const InputElems = new InputElements()
const styles = theme => InputElems.styles(theme)

var regex = /^[0-9\b]+$/
class StudentInputForm extends React.Component {
  constructor (props) {
    super(props)
    this.InputElements = new InputElements({ classes: props.classes })
    const studentInputElements = [
      { 'name': 'name', 'label': 'Student Name', 'value': '', 'type': 'text', 'required': true },
      { 'name': 'roll_no',
        'label': 'Roll Number',
        'value': '',
        'type': 'text',
        'maxLength': '2',
        'required': true

      },
      { 'name': 'erp', 'label': 'Enrollment Code', 'value': '', 'type': 'number', 'required': true },
      { 'name': 'gr_number', 'label': 'General Number', 'value': '', 'type': 'number', 'required': false },
      { 'name': 'admission_number', 'label': 'Admission number', 'value': '', 'type': 'text', 'required': false },
      { 'name': 'stay_category', 'label': 'Category', 'value': '', 'type': null, 'required': true },
      { 'name': 'gender', 'label': 'Gender', 'value': '', 'type': null, 'required': true },
      { 'name': 'admission_date', 'label': 'Date Of Admission', 'value': '', 'type': 'date', 'required': true },
      { 'name': 'date_of_birth', 'label': 'Date of Birth', 'value': '', 'type': 'date', 'required': true },
      { 'name': 'aadhar_number', 'label': 'AADHAR Number', 'value': '', 'type': 'number', 'required': false },
      { 'name': 'password', 'label': 'Password', 'type': 'password', 'required': true },
      { 'name': 'address', 'label': 'Address', 'value': '', 'type': 'textarea', 'required': true },
      { 'name': 'first_lang_id', 'label': 'First Language', 'value': '', 'type': null, 'required': false },
      { 'name': 'second_lang_id', 'label': 'Second Language', 'value': '', 'type': null, 'required': false },
      { 'name': 'third_lang_id', 'label': 'Third Language', 'value': '', 'type': null, 'required': false },
      { 'name': 'fourth_lang_id', 'label': 'Fourth Language', 'value': '', 'type': null, 'required': false }
    ]
    const extendedInputElements = [
      { 'name': 'first_name', 'label': 'First Name', 'required': true, 'value': '', 'type': 'text' },
      { 'name': 'middle_name', 'label': 'Middle Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'last_name', 'label': 'Last Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'nick_name', 'label': 'Nick Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'siblings', 'label': 'Siblings', 'required': false, 'value': '', 'type': 'number' },
      { 'name': 'reference_Code', 'label': 'Reference Code', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'place_of_birth', 'label': 'Place Of Birth', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'mother_tongue', 'label': 'Mother Tongue', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'blood_group', 'label': 'Blood Group', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'student_living_with', 'label': 'Student Living With', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'passport_number', 'label': 'Passport Number', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'passport_issue_place', 'label': 'Passport Issue Place', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'visa_expiry_date', 'label': 'Visa Expiry Date', 'required': false, 'value': '', 'type': 'date' },
      { 'name': 'passport_validity', 'label': 'Passport Validity', 'required': false, 'value': '', 'type': 'date' },
      { 'name': 'visa_number', 'label': 'Visa Number', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'caste', 'label': 'Caste', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'sub_caste', 'label': 'Sub Caste', 'required': false, 'value': '', 'type': 'text' },
      // { 'name': 'point_of_contact', 'label': 'Point of Contact', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'point_of_contact', 'label': 'Point of Contact', 'required': false, 'value': '', 'type': null },
      { 'name': 'other_name', 'label': 'Other Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'other_class', 'label': 'Other Grade', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'other_school', 'label': 'Other School', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'previous_school', 'label': 'Previous School', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'previous_admission_no', 'label': 'Previous Admission Number', 'required': false, 'value': '', 'type': 'number' },
      { 'name': 'previous_class', 'label': 'Previous Grade', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'previous_class_marks', 'label': 'Previous Class Marks', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'qualified_exam_rank', 'label': 'Qualified Exam Rank', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'drop_route_name', 'label': 'Drop Route Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'drop_stop', 'label': 'Drop Stop', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'pickup_route_name', 'label': 'Pickup Route Name', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'pickup_stop', 'label': 'Pickup Stop', 'required': false, 'value': '', 'type': 'text' },
      { 'name': 'class_group_name', 'label': 'Class Group Name', 'required': false, 'value': '', 'type': null },
      { 'name': 'nationality', 'label': 'Nationality', 'required': false, 'value': '', 'type': null },
      { 'name': 'religion', 'label': 'Religion', 'required': false, 'value': '', 'type': 'text' }
    ]
    this.state = {
      activeStep: 0,
      transport: false,
      CountryRegionData,
      studentInputElems: studentInputElements,
      extendedInputELems: extendedInputElements,
      gender: 'male',
      stayCategory: 'Residential',
      called: false,
      islanguage: 'True'
    }
  }
  componentWillMount () {
    this.getPointOfContact()
  }
  componentDidMount () {
    this.props.listSubjects(null, 'True')
    var { match: { params: { id } }, mode } = this.props
    if (id) this.setState({ studentId: id, method: 'PUT' })
    else this.setState({ method: 'POST' })
    if (mode === 'EDIT') {
      this.setState({ isValueRequired: true, studentId: id, mode, method: 'PUT' })
      // this.getstudentBasicData(id)
    } else if (mode === 'ADD') {
      this.setState({ method: 'POST' })
    }
    this.getClassGroups()
    let prevState = store.getState().subjects
    store.subscribe(() => {
      let state = store.getState()
      if (state.subjects.items !== prevState.items) {
        if (!this.state.called && mode === 'EDIT') {
          this.getstudentBasicData(id)
          this.setState({ called: true })
        }
      }
    })
  }

  componentDidUpdate (prevProps) {
    let { match: { params: { id } } } = this.props
    // Typical usage (don't forget to compare props):
    if ((this.props.mode !== prevProps.mode) && this.props.mode === 'EDIT') {
      this.getstudentBasicData(id)
    }
    console.log('tex', id)
  }

  getstudentBasicData = (studentId) => {
    let { studentInputElems, extendedInputELems } = this.state
    let path = urls.Student + studentId + '/'
    this.setState({ loading: true }, () => {
      axios
        .get(path, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            let resdata = res.data[0]
            if (typeof (resdata) === 'string') { this.props.alert.error(resdata); return }
            let data = resdata['student']
            let gender = data.gender
            let stayCategory = data.stay_category
            let studentPhotoPreview
            if (!data.student_photo.includes('no-img.jpg')) {
              studentPhotoPreview = urls.BASE + data.student_photo
            }
            var user = JSON.parse(localStorage.getItem('user_profile'))
            this.role = user.personal_info.role
            let formDataStudent = new FormData()
            studentInputElems.map(item => {
              console.log(studentInputElems['required'], 'map')
              if (item['name'] === 'erp') item['disabled'] = true
              if (this.role === 'Student') {
                if (item['name'] === 'admission_number') item['disabled'] = true
                if (item['name'] === 'roll_no') item['disabled'] = true
                if (item['name'] === 'gr_number') item['disabled'] = true
                if (item['name'] === 'admission_date') item['disabled'] = true
                if (item['name'] === 'gender')item['disabled'] = true
                if (item['name'] === 'password') item['disabled'] = true
              }
              if (item['name'] === 'password') item['required'] = false
              item['value'] = data[item['name']]
              if (item['value']) formDataStudent.set(item['name'], item['value'])
              else formDataStudent.set(item['name'], '')
            })
            let {
              first_lang: language1Id,
              second_lang: language2Id,
              third_lang: language3Id,
              fourth_lang: language4Id,
              using_transport: transport
            } = data
            data = { ...resdata['student_extended'], ...resdata['student_history'], ...resdata['student_transport'] }
            let classGroupName = data.class_group_name
            let nationality = data.nationality
            this.setPointOfContact(data.point_of_contact)
            let formDataEntended = new FormData()
            extendedInputELems.map(item => {
              if (this.role === 'Student') {
                if (item['name'] === 'stay_category')item['disabled'] = true
                if (item['name'] === 'class_group_name') item['disabled'] = true
                if (item['name'] === 'drop_route_name') item['disabled'] = true
                if (item['name'] === 'drop_stop') item['disabled'] = true
                if (item['name'] === 'pickup_route_name') item['disabled'] = true
                if (item['name'] === 'pickup_stop') item['disabled'] = true
                if (item['name'] === 'point_of_contact') item['disabled'] = true
                if (item['name'] === 'reference_Code') item['disabled'] = true
              }
              item['value'] = data[item['name']]
              if (item['value']) formDataEntended.set(item['name'], item['value'])
              else formDataEntended.set(item['name'], '')
            })
            this.handleLanguageUpdate(language1Id, 0)
            this.handleLanguageUpdate(language2Id, 1)
            this.handleLanguageUpdate(language3Id, 2)
            this.handleLanguageUpdate(language4Id, 3)
            this.setState({
              studentFormData: formDataStudent,
              extendedFormData: formDataEntended,
              dataArrived: true,
              nationality,
              studentInputElems,
              extendedInputELems,
              classGroupName,
              language1Id,
              language2Id,
              language3Id,
              language4Id,
              gender,
              stayCategory,
              transport,
              studentPhotoPreview,
              loading: false
            })
          } else {
            console.error(`api ${path} returned with status code ${res.status}`)
            this.setState({ loading: false, isFetchFailed: true })
          }
        })
        .catch(e => {
          this.setState({ loading: false, isFetchFailed: true })
        }

        )
    })
  }

  getClassGroups = () => {
    axios
      .get(urls.LISTCLASSGROUPTYPE, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ classGroups: res.data })
        }
      })
      .catch(er => console.log(er))
  }
  getPointOfContact = () => {
    axios
      .get(urls.PointOfContact, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pointOfContactChoices: res.data })
        }
      })
      .catch(e => console.log(e))
  }

  getSteps () {
    return ['Student information', 'Student extended data']
  }

  makeFormData = (e, formName) => {
    let { currentTarget } = e
    let form = []
    var { studentInputElems = [], extendedInputELems = [] } = this.state
    currentTarget = [ ...Object.values(currentTarget) ]
    currentTarget.forEach(item => {
      let { name, value, nodeName, type, required, maxLength, error } = item

      if (name === 'roll_no') {

      }
      if (!name || (name && !name.length)) { return }
      if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
        form.push({ name, value, type, required, maxLength, error })
      }
      console.log(maxLength)
    })
    let formData = new FormData()
    // let validate = {}
    form.forEach(input => {
      formData.set(input.name, input.value)
      // validate[input.name] = { ...input }
    })
    if (formName === 'studentFormData') {
      studentInputElems.forEach(input => {
        input.value = formData.get(input.name)

        console.log(input.value, 'val')
      })
      this.setState({ [formName]: formData, studentInputElems })
      console.log(studentInputElems.map(dt => dt.value))
      // if (input.name === 'roll_no') {
      //   if (!input.value.match(regex)) {
      //     this.props.alert.error('Roll Number Accepts Only Numbers')
      //   }
      // }
    } else if (formName === 'extendedFormData') {
      extendedInputELems.forEach(input => {
        input.value = formData.get(input.name)
      })
      this.setState({ [formName]: formData, extendedInputELems })
    }
    // this.setState({ [formName]: formData, [formName + 'Validate']: validate })
  }

  setPointOfContact = (value) => {
    let pointOfContact = value

    let { pointOfContactChoices = undefined } = this.state
    if (Array.isArray(pointOfContactChoices) && pointOfContactChoices.length && pointOfContact && pointOfContact !== 'undefined') {
      console.log(typeof (pointOfContactChoices[0].id), typeof (pointOfContact))
      let choice = pointOfContactChoices.filter(poc => poc.id === pointOfContact)
      if (choice.length) {
        choice = choice[0].choice
        this.setState({ pointOfContact: { value: pointOfContact, label: choice } })
      }
    }
  }

  handleLanguageUpdate = (event, index) => {
    if (event) {
      if (event && event.value) {
        this.setState({ ['language' + (index)]: { value: event.value, label: event.label } })
      } else {
        this.setState({ ['language' + (index)]: { value: this.props.subjects.filter(item => item.id === event)[0].id, label: this.props.subjects.filter(item => item.id === event)[0].subject_name } })
      }
    }
  }

  getStepContent (step) {
    const { classes, mode } = this.props
    const studentPhoto = this.state.student_photo &&
    this.state.student_photo.map(studentPhoto => (
      <li key={studentPhoto.name}>
        {studentPhoto.name} - {studentPhoto.size} bytes
      </li>
    ))
    let { studentInputElems, extendedInputELems, studentFormData, extendedFormData,
      isAxiosTouched, isValueRequired, dataArrived, studentPhotoPreview, loading, isFetchFailed } = this.state

    if (mode === 'EDIT' && loading) { return <InternalPageStatus label='loading...' /> }

    if (mode === 'EDIT' && isFetchFailed) { return <InternalPageStatus label='Failed to fetch data' loader={false} /> }

    switch (step) {
      case 0:
        return <React.Fragment>
          <form className={classes.container} noValidate onChange={e => this.makeFormData(e, 'studentFormData')} autoComplete='off'>
            {this.InputElements.render(studentInputElems, studentFormData, isAxiosTouched, isValueRequired, dataArrived)}
            {dataArrived ? this.setState({ dataArrived: false }) : null}
            <div className={classes.textField} style={{ display: 'inline-block' }}>
              <br />
              <OmsSelect
                label='Stay Category'
                placeholder='Select Category'
                name='stay_category'
                options={[
                  { value: 'Residential', label: 'Residential' },
                  { value: 'Day Scholar', label: 'Day Scholar' }
                ]}
                defaultValue={{ value: this.state.stayCategory, label: this.state.stayCategory }}
                change={({ value }) => this.setState({ stayCategory: value })}
                disabled={this.role === 'Student'}
              />
            </div>
            <div className={classes.textField} style={{ display: 'inline-block' }}>
              <br />
              <OmsSelect
                label='Gender'
                placeholder='Select Gender'
                name='gender'
                options={[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'other', label: 'Other' }
                ]}
                defaultValue={{ value: this.state.gender, label: (this.state.gender).charAt(0).toUpperCase() + this.state.gender.slice(1) }}
                change={(state) => this.setState({ gender: state.value })}
                disabled={this.role === 'Student'}
              />
            </div>
            {['First', 'Second', 'Third', 'Fourth'].map((item, index) => {
              return <div
                className={classes.textField}
                style={{ display: 'inline-block' }}
                key={index}
              >
                <br />
                <OmsSelect
                  label={item + ' Language'}
                  placeholder={item + ' Language'}
                  classes={classes.textField}
                  name={'language' + (index + 1)}
                  {...mode === 'EDIT' ? { defaultValue: this.state[`language${index}`] } : {}}
                  options={
                    this.props.subjects
                      ? this.props.subjects.map(subject => ({
                        value: subject.id,
                        label: subject.subject_name
                      }))
                      : []
                  }
                  change={(e) => this.handleLanguageUpdate(e, index)}
                />
                <br />
              </div>
            })}
            <div className={classes.textField} style={{ display: 'inline-block' }}>
              <label>Using Transport :</label>
              <br />
              <Radio
                onChange={e => this.setState(({ transport: tp }) => ({ transport: !tp }))}
                checked={this.state.transport}
                toggle />
            </div>
            <div className={classes.textField} style={{ display: 'inline-block' }}>
              <label>
                Upload Student Photo<sup>*</sup>
              </label>
              <br />
              <Dropzone onDrop={studentPhoto => this.setState({ student_photo: studentPhoto })}>
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
                      {studentPhotoPreview ? <img src={studentPhotoPreview} width={150} /> : ''}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </div>
          </form>
        </React.Fragment>

      case 1:
        return (
          <React.Fragment>
            <form className={classes.container} noValidate onChange={e => this.makeFormData(e, 'extendedFormData')} autoComplete='off'>
              {this.InputElements.render(extendedInputELems, extendedFormData, isAxiosTouched, isValueRequired, dataArrived)}
              {dataArrived ? this.setState({ dataArrived: false }) : null}
              <div className={classes.textField} style={{ display: 'inline-block' }}>
                <br />
                <OmsSelect
                  label='Class group'
                  placeholder='Group name'
                  name='class_group_name'
                  defaultValue={{ value: this.state.classGroupName, label: this.state.classGroupName }}
                  options={this.state.classGroups && this.state.classGroups.map(item => ({ label: item, value: item }))}
                  change={({ value }) =>
                    this.setState({ classGroupName: value })}
                  disabled={this.role === 'Student'}
                />
                <br />
              </div>

              <div className={classes.textField} style={{ display: 'inline-block' }}>
                <br />
                <OmsSelect
                  label='Point of Contact'
                  placeholder='Point of Contact'
                  name='point of contact'
                  defaultValue={this.state.pointOfContact}
                  options={
                    this.state.pointOfContactChoices
                      ? this.state.pointOfContactChoices.map(poc => ({
                        value: poc.id,
                        label: poc.choice
                      }))
                      : []
                  } change={({ value, label }) =>
                    this.setState({ pointOfContact: { value, label } })}
                />
                <br />
              </div>
              <div className={classes.textField} style={{ display: 'inline-block' }}>
                <br />
                <OmsSelect
                  label='Nationality'
                  placeholder='Nationality'
                  name='nationality'
                  defaultValue={{ value: this.state.nationality, label: this.state.nationality }}
                  options={this.state.CountryRegionData && this.state.CountryRegionData.map(item => ({ label: item[0], value: item[0] }))}
                  change={({ value }) =>
                    this.setState({ nationality: value })}
                />
                <br />
              </div>

              <div className={classes.textField} style={{ display: 'inline-block' }}>
                <label>Is parent VIP :</label>
                <br />
                <Radio
                  onChange={e => this.setState(({ is_parent_vip: tp }) => ({ is_parent_vip: !tp }))}
                  toggle />
              </div>
            </form>
          </React.Fragment>)
      default:
        return 'Unknown step'
    }
  }

  setFormData = () => {
    let { state, props } = this
    let { studentFormData: formData, transport } = state
    formData.set('branchId', props.branchId)
    formData.set('gradeId', props.gradeId)
    formData.set('sectionId', props.sectionId)
    formData.set('gender', state.gender)
    formData.set('stay_category', state.stayCategory ? state.stayCategory : '')
    formData.set('first_lang_id', state.language0 ? state.language0.value : '')
    formData.set('second_lang_id', state.language1 ? state.language1.value : '')
    formData.set('third_lang_id', state.language2 ? state.language2.value : '')
    formData.set('fourth_lang_id', state.language3 ? state.language3.value : '')
    formData.set('transport', transport === true ? 'True' : 'False')
    this.setState({ studentFormData: formData })
    this.state.student_photo && this.state.student_photo.forEach(studentphoto => {
      formData.append('student_photo', studentphoto)
    })
    return formData
  }

  callAxiosPost = (method, path, formData) => {
    axios[method](path, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      } }
    )
      .then(res => {
        if (res.status === 201) {
          let { student_id: studentId } = res.data
          this.setState({ studentId, isAxiosTouched: false })
          window.localStorage.setItem('studentId', studentId)
        }
        this.setState(state => ({
          activeStep: state.activeStep + 1
        }))
        console.log(res.data, 'fa')
        console.log(formData, 'f1')

        this.props.alert.success('Students added successfully')
      })
      .catch((error) => {
        console.log(error)
        if (error.response && error.response.status === 409) {
          this.props.alert.error(error.response.data)
        }
      })
  }

  handleNext = incrementCond => {
    console.log('clcicked nxt')

    let { activeStep, studentId, extendedInputELems, extendedFormData, studentInputElems,
      studentFormData, method, path } = this.state

    let { mode } = this.props
    if ((incrementCond === 'skip' && studentId && mode === 'ADD') ||
      (mode === 'EDIT' && incrementCond === 'skip')) {
      if (activeStep === 1) {
        this.setState({ activeStep: 0 })
        return
      }
      this.setState(state => ({
        activeStep: state.activeStep + 1
      }))
      return
    }
    if (activeStep === 0) {
      console.log('studentFormData', studentFormData)
      let { props } = this
      if (!props.branchId) { this.props.alert.error('Please Select Branch'); return }
      if (!props.gradeId) { this.props.alert.error('Please Select Grade'); return }
      if (!props.sectionId) { this.props.alert.error('Please Select Section'); return }
      if (!studentFormData) { this.props.alert.error('Please enter required fields'); return }
      let formData = this.setFormData()
      if (!formData) { this.props.alert.error('Please enter required fields'); return }
      this.setState({ isAxiosTouched: true })
      let isValid = this.InputElements.validate(studentInputElems, studentFormData, true)
      if (!isValid) { this.props.alert.error('Please enter required fields'); return }
      if (mode === 'ADD') {
        this.callAxiosPost('post', urls.NewStudent, formData)
        console.log(formData, 'form')
      } else if (mode === 'EDIT') {
        console.log(studentInputElems)

        studentInputElems.map(dt => {
          if (dt.name === 'roll_no') {
            if (!dt.value.match(regex)) {
              if (dt.value === '' || dt.value === null) {
                this.props.alert.warning('Your roll number is missing, please conatct higer authority')
              }
              if (this.role !== 'Student') {
                this.props.alert.error('Roll Number Accepts Only Numbers')
              }
            } else {
              this.callAxiosPost('put', path || (urls.NewStudent + studentId + '/'), formData)
            }
          }
        }
        )
      }
    } else if (activeStep === 1) {
      let formData = this.handleFinish()
      this.setState({ isAxiosTouched: true })
      let isValid = this.InputElements.validate(extendedInputELems, extendedFormData, true)
      if (!isValid) { this.props.alert.error('Please enter required fields'); return }
      if (isValid && formData) {
        let { studentId } = this.state
        if (!studentId) {
          studentId = window.localStorage.getItem('studentId')
        }
        path = path || urls.NewStudentExtended + studentId + '/'
        axios({
          url: path,
          method: method,
          data: formData,
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
          .then(res => {
            if (res.status === 200) {
              this.setState(state => ({
                activeStep: state.activeStep + 1
              }))
              this.setState({ isAxiosTouched: false })
              this.props.handleNext()
              this.props.alert.success('Student information added successfully')
            }
          })
          .catch((error) => (console.log(error)))
      }
    }
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  };

  handleFinish=() => {
    let { state } = this
    let { extendedFormData: formData = new FormData(), is_parent_vip: isParentVip } = state
    formData.set('class_group_name', state.classGroupName || undefined)
    formData.set('nationality', state.nationality || undefined)
    let { pointOfContact = {} } = state
    formData.set('point_of_contact', pointOfContact.value || undefined)
    // formData.set('religion', state.religion || undefined)
    formData.set('is_parent_vip', isParentVip === true ? 'True' : 'False')
    return formData
  }

  render () {
    const { classes, subjects, mode } = this.props
    const steps = this.getSteps()
    console.log(this.state.formData, 'data')
    const { loading, isFetchFailed, activeStep, language1Id, language1Items = [], language2Id, language2Items = [], language3Id, language3Items = [], language4Id, language4Items = [] } = this.state
    let selectedLang1 = language1Id && subjects && subjects.filter(subject => (language1Id === subject.id)).map(subject => ({ label: subject.subject_name, value: subject.id }))
    // selectedLangs
    if ((language1Id && subjects && language1Items.length === 0) || (Array.isArray(this.state.language1Items) && Array.isArray(selectedLang1) && this.state.language1Items.length > 0 && this.state.language1Items[0].id !== selectedLang1[0].id)) {
      this.setState({ language1Items: selectedLang1 })
    }
    let selectedLang2 = language2Id && subjects && subjects.filter(subject => (language2Id === subject.id)).map(subject => ({ label: subject.subject_name, value: subject.id }))
    language2Id && subjects && language2Items.length === 0 && this.setState({ language2Items: selectedLang2 })
    let selectedLang3 = language3Id && subjects && subjects.filter(subject => (language3Id === subject.id)).map(subject => ({ label: subject.subject_name, value: subject.id }))
    language3Id && subjects && language3Items.length === 0 && this.setState({ language3Items: selectedLang3 })
    let selectedLang4 = language4Id && subjects && subjects.filter(subject => (language4Id === subject.id)).map(subject => ({ label: subject.subject_name, value: subject.id }))
    if ((language4Id && subjects && language4Items.length === 0) || (Array.isArray(this.state.language4Items) && Array.isArray(selectedLang4) && this.state.language4Items.length > 0 && this.state.language4Items[0].value !== selectedLang4[0].value)) { this.setState({ language4Items: selectedLang4 }) }

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{this.getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    {
                      ((this.state.studentId && this.props.mode === 'ADD') || this.props.mode === 'EDIT')
                        ? <Button
                          variant='contained'
                          color='primary'
                          onClick={e => this.handleNext('skip')}
                          className={classes.button}
                        >
                      Skip
                        </Button>
                        : null
                    }
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={e => this.handleNext('save')}
                      className={classes.button}
                      disabled={(mode === 'EDIT' && loading) || (mode === 'EDIT' && isFetchFailed)}
                    >
                      {'Save & continue'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    )
  }
}

StudentInputForm.propTypes = {
  classes: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  listSubjects: (gardeId, islanguage) => dispatch(apiActions.listSubjects(null, islanguage))
})

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items,
  sidebaropen: state.view.sidebar
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(StudentInputForm)))
