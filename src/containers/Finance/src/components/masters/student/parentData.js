import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import 'react-phone-number-input/style.css'
import axios from 'axios'
import { InternalPageStatus } from '../../../ui'
import { urls } from '../../../urls'
import InputElements from './InputElems'

const InputElems = new InputElements()
const styles = theme => InputElems.styles(theme)

const fatherInputElems = [
  { 'label': 'Name', 'name': 'father_name', 'value': '', 'type': 'text', 'required': true },
  { 'label': 'Email', 'name': 'father_email', 'value': '', 'type': 'email', 'required': false },
  { 'label': 'Mobile Number', 'name': 'father_mobile', 'value': '', 'type': 'number', 'required': true },
  { 'label': 'Aadhaar Number', 'name': 'father_aadhaar_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Date of Birth', 'name': 'father_dob', 'value': '', 'type': 'date', 'required': false },
  { 'label': 'Marriage Anniversary', 'name': 'father_marriage_anniversary', 'value': '', 'type': 'date', 'required': false },
  { 'label': 'Blood Group', 'name': 'father_blood_group', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Address', 'name': 'address', 'value': '', 'type': 'textarea', 'required': true },
  { 'label': 'Qualification', 'name': 'father_qualification', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Occupation', 'name': 'father_occupation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Business Name', 'name': 'father_business_name', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Designation', 'name': 'father_designation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Employee id', 'name': 'father_employee_id', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Office', 'name': 'father_office', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Office Landline Number', 'name': 'father_office_landline_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Annual Income', 'name': 'father_annual_income', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Office Address', 'name': 'father_office_address', 'value': '', 'type': 'textarea', 'required': false },
  { 'label': 'Alternate Email', 'name': 'father_alt_email_id', 'value': '', 'type': 'email', 'required': false },
  { 'label': 'Traits', 'name': 'father_traits', 'value': '', 'type': 'text', 'required': false }
]

const motherInputElems = [
  { 'label': 'Name', 'name': 'mother_name', 'value': '', 'type': 'text', 'required': true },
  { 'label': 'Email', 'name': 'mother_email', 'value': '', 'type': 'email', 'required': false },
  { 'label': 'Mobile Number', 'name': 'mother_mobile', 'value': '', 'type': 'number', 'required': true },
  { 'label': 'Aadhaar Number', 'name': 'mother_aadhaar_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Date of Birth', 'name': 'mother_dob', 'value': '', 'type': 'date', 'required': false },
  { 'label': 'Blood Group', 'name': 'mother_blood_group', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Address', 'name': 'mother_address', 'value': '', 'type': 'textarea', 'required': true },
  { 'label': 'Qualification', 'name': 'mother_qualification', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Occupation', 'name': 'mother_occupation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Business Name', 'name': 'mother_business_name', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Designation', 'name': 'mother_designation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Employee Id', 'name': 'mother_employee_id', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Alternate Email', 'name': 'mother_alt_email_id', 'value': '', 'type': 'email', 'required': false },
  { 'label': 'Office', 'name': 'mother_office', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Office Landline Number', 'name': 'mother_office_landline_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Office Address', 'name': 'mother_office_address', 'value': '', 'type': 'textarea', 'required': false },
  { 'label': 'Annual Income', 'name': 'mother_annual_income', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Traits', 'name': 'mother_traits', 'value': '', 'type': 'text', 'required': false }
]

const guardianInputElems = [
  { 'label': 'Name', 'name': 'guardian_name', 'value': '', 'type': 'text', 'required': true },
  { 'label': 'Email', 'name': 'guardian_email', 'value': '', 'type': 'email', 'required': false },
  { 'label': 'Mobile Number', 'name': 'guardian_mobile', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Aadhaar Number', 'name': 'guardian_aadhaar_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Date of Birth', 'name': 'guardian_dob', 'value': '', 'type': 'date', 'required': false },
  { 'label': 'Blood Group', 'name': 'guardian_blood_group', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Address', 'name': 'guardian_address', 'value': '', 'type': 'textarea', 'required': true },
  { 'label': 'Qualification', 'name': 'guardian_qualification', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Occupation', 'name': 'guardian_occupation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Business Name', 'name': 'guardian_business_name', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Designation', 'name': 'guardian_designation', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Employee id', 'name': 'guardian_employee_id', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Alternate Email Id', 'name': 'guardian_alt_mail_id', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Office', 'name': 'guardian_office', 'value': '', 'type': 'text', 'required': false },
  { 'label': 'Office Landline Number', 'name': 'guardian_office_landline_number', 'value': '', 'type': 'number', 'required': false },
  { 'label': 'Office Address', 'name': 'guardian_office_address', 'value': '', 'type': 'textarea', 'required': false },
  { 'label': 'Annual Income', 'name': 'guardian_annual_income', 'value': '', 'type': 'number', 'required': false }
]

class ParentInputForm extends React.Component {
  constructor (props) {
    super(props)
    this.InputElements = new InputElements({ classes: props.classes })
    this.state = {
      activeStep: 0,
      fatherInputElems,
      motherInputElems,
      guardianInputElems
    }
  }

  getStudentId=() => {
    let studentId = window.localStorage.getItem('studentId')
    let { mode } = this.props
    if (!studentId && mode === 'ADD') {
      this.props.handleReset()
    }
    this.setState({ studentId })
  }

  componentWillMount () {
    let { match: { params: { id } }, mode } = this.props
    this.role = (JSON.parse(localStorage.getItem('user_profile')).personal_info.role)
    if (mode === 'EDIT') {
      let path = urls.FatherDetails + id + '/'
      this.setState({ isValueRequired: true, studentId: id, method: 'put', path })
      this.getstudentBasicData(id)
    } else if (mode === 'ADD') {
      this.setState({ method: 'post', path: null })
      this.getStudentId()
    }
  }

  getstudentBasicData = (studentId) => {
    let { fatherInputElems, motherInputElems, guardianInputElems } = this.state
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
            let data = resdata['parent']
            if (!Object.keys(data).length) { this.setState({ loading: false }); return } // if there is no parent related data
            let fatherFormData = new FormData()
            let motherFormData = new FormData()
            let guardianFormData = new FormData()
            let fatherPhotoPreview = null
            if (data.father_photo && !data.father_photo.includes('no-img.jpg')) {
              fatherPhotoPreview = data.father_photo
            }
            let motherPhotoPreview = null
            if (data.mother_photo && !data.mother_photo.includes('no-img.jpg')) {
              motherPhotoPreview = data.mother_photo
            }
            let guardianPhotoPreview = null
            if (data.guardian_photo && !data.guardian_photo.includes('no-img.jpg')) {
              guardianPhotoPreview = data.father_photo
            }
            fatherInputElems.map(item => {
              item['value'] = data[item['name']]
              if (item['value']) fatherFormData.set(item['name'], item['value'])
              else fatherFormData.set(item['name'], '')
            })
            motherInputElems.map(item => {
              item['value'] = data[item['name']]
              if (item['value']) motherFormData.set(item['name'], item['value'])
              else motherFormData.set(item['name'], '')
            })
            guardianInputElems.map(item => {
              item['value'] = data[item['name']]
              if (item['value']) guardianFormData.set(item['name'], item['value'])
              else guardianFormData.set(item['name'], '')
            })
            this.setState({
              fatherInputElems,
              motherInputElems,
              guardianInputElems,
              dataArrived: true,
              fatherFormData,
              motherFormData,
              guardianFormData,
              fatherPhotoPreview,
              motherPhotoPreview,
              guardianPhotoPreview,
              loading: false
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

  makeFormData = (e, formName) => {
    let { currentTarget } = e
    let form = []
    currentTarget = [ ...Object.values(currentTarget) ]
    currentTarget.forEach(item => {
      let { name, value, nodeName, type, required } = item
      if (!name || (name && !name.length)) { return }
      if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
        form.push({ name, value, type, required })
      }
    })
    let formData = new FormData()
    form.forEach(input => {
      formData.set(input.name, input.value)
    })
    this.setState({ [formName]: formData })
    if (formName === 'fatherFormData') {
      fatherInputElems.forEach(input => {
        input.value = formData.get(input.name)
      })
      this.setState({ [formName]: formData, fatherInputElems })
    } else if (formName === 'motherFormData') {
      motherInputElems.forEach(input => {
        input.value = formData.get(input.name)
      })
      this.setState({ [formName]: formData, motherInputElems })
    } else if (formName === 'guardianFormData') {
      guardianInputElems.forEach(input => {
        input.value = formData.get(input.name)
      })
      this.setState({ [formName]: formData, guardianInputElems })
    }
  }

  getSteps () {
    return ['Father Details', 'Mother Details', 'Guardian Details']
  }

  getStepContent (step, classes) {
    let { loading, isFetchFailed } = this.state
    let { mode } = this.props

    if (mode === 'EDIT' && loading) { return <InternalPageStatus label='loading...' /> }

    if (mode === 'EDIT' && isFetchFailed) { return <InternalPageStatus label='Failed to fetch data' loader={false} /> }

    const fatherPhoto = this.state.father_photo &&
    this.state.father_photo.map(fatherPhoto => (
      <li key={fatherPhoto.name}>
        {fatherPhoto.name} - {fatherPhoto.size} bytes
      </li>
    ))
    const motherPhoto = this.state.mother_photo &&
    this.state.mother_photo.map(motherPhoto => (
      <li key={motherPhoto.name}>
        {motherPhoto.name} - {motherPhoto.size} bytes
      </li>
    ))
    const guardianPhoto = this.state.guardian_photo &&
    this.state.guardian_photo.map(guardianPhoto => (
      <li key={guardianPhoto.name}>
        {guardianPhoto.name} - {guardianPhoto.size} bytes
      </li>
    ))
    let { fatherInputElems, motherInputElems, guardianInputElems, fatherFormData,
      motherFormData, guardianFormData, isAxiosTouched = false, isValueRequired, dataArrived,
      fatherPhotoPreview, motherPhotoPreview, guardianPhotoPreview } = this.state

    switch (step) {
      case 0:
        return <React.Fragment>
          <form onChange={e => this.makeFormData(e, 'fatherFormData')} className={classes.container} noValidate autoComplete='off' >
            {this.InputElements.render(fatherInputElems.map(item => {
              if (this.role === 'Student' && (item.name === 'father_mobile')) {
                item.disabled = true
              }
              return item
            }), fatherFormData, isAxiosTouched, isValueRequired, dataArrived)}
            {dataArrived ? this.setState({ dataArrived: false }) : null}
            <div className={classes.textField} style={{ display: 'inline' }}>
              <Dropzone onDrop={fatherPhoto => this.setState({ father_photo: fatherPhoto })}>
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
                      {fatherPhotoPreview ? <img src={fatherPhotoPreview} width={170} /> : ''}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </div>
          </form>
        </React.Fragment>
      case 1:
        return <React.Fragment>
          <form style={{ width: '85vw' }} onChange={e => this.makeFormData(e, 'motherFormData')} className={classes.container} noValidate autoComplete='off' >
            {this.InputElements.render(motherInputElems.map(item => {
              if (this.role === 'Student' && (item.name === 'mother_mobile')) {
                item.disabled = true
              }
              return item
            }), motherFormData, isAxiosTouched, isValueRequired, dataArrived)}
            {dataArrived ? this.setState({ dataArrived: false }) : null}
            <div>
              <Dropzone onDrop={motherPhoto => this.setState({ mother_photo: motherPhoto })}>
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
                        {!isDragActive && 'Drop your Upload Mother Photo here.'}
                      </div>
                      {motherPhoto}
                      {motherPhotoPreview ? <img src={motherPhotoPreview} width={170} /> : ''}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </div>
          </form>
        </React.Fragment>
      case 2:
        return <React.Fragment>
          <form onChange={e => this.makeFormData(e, 'guardianFormData')} className={classes.container} noValidate autoComplete='off' >
            {this.InputElements.render(guardianInputElems.map(item => {
              if (this.role === 'Student' && (item.name === 'guardian_mobile')) {
                item.disabled = true
              }
              return item
            }), guardianFormData, isAxiosTouched, isValueRequired, dataArrived)}
            {dataArrived ? this.setState({ dataArrived: false }) : null}
            <div>
              <Dropzone onDrop={guardianPhoto => this.setState({ guardian_photo: guardianPhoto })}>
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
                      {guardianPhotoPreview ? <img src={guardianPhotoPreview} width={170} /> : ''}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </div>
          </form>
        </React.Fragment>
      default:
        return 'Unknown step'
    }
  }

  handleNext = incrementCond => {
    let { activeStep, studentId, method = 'post', path } = this.state
    let isLastStep = (activeStep === (this.getSteps().length - 1))
    if (incrementCond === 'skip') {
      activeStep += isLastStep ? (-activeStep) : 1
      this.setState({ activeStep })
      return
    }
    let fatherFormData = this.setFormData('fatherFormData')
    let motherFormData = this.setFormData('motherFormData')
    let guardianFormData = this.setFormData('guardianFormData')
    if (!studentId) {
      studentId = window.localStorage.getItem('studentId')
    }
    if (activeStep === 0 && fatherFormData) {
      this.setState({ isAxiosTouched: true })
      let isValid = this.InputElements.validate(fatherInputElems, fatherFormData, true)
      if (!isValid) { this.props.alert.error('Please enter required fields'); return }
      path = path || urls.FatherDetails + studentId + '/'
      axios[method](path, fatherFormData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState(state => ({
              activeStep: state.activeStep + 1, isAxiosTouched: false
            }))
            this.props.alert.success('Father details updated successfully')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (activeStep === 1 && motherFormData) {
      this.setState({ isAxiosTouched: true })
      let isValid = this.InputElements.validate(motherInputElems, motherFormData, true)
      if (!isValid) { this.props.alert.error('Please enter required fields'); return }
      path = urls.MotherDetails + studentId + '/'
      axios[method](path, motherFormData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState(state => ({
              activeStep: state.activeStep + 1, isAxiosTouched: false
            }))
            this.props.alert.success('Mother details updated successfully')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (activeStep === 2 && guardianFormData) {
      this.setState({ isAxiosTouched: true })
      let isValid = this.InputElements.validate(guardianInputElems, guardianFormData, true)
      if (!isValid) { this.props.alert.error('Please enter required fields'); return }
      path = urls.GuardianDetails + studentId + '/'
      axios[method](path, guardianFormData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState(state => ({
              activeStep: state.activeStep + 1, isAxiosTouched: false
            }))
          }
          this.props.handleNext()
          this.props.alert.success('Guardian Details updated successfully')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }

  setFormData = formDataName => {
    let { state } = this
    let formData = state[formDataName] || new FormData()
    if (formDataName === 'fatherFormData') {
      state.father_photo && state.father_photo.forEach(fatherphoto => {
        formData.append('father_photo', fatherphoto)
      })
    } else if (formDataName === 'motherFormData') {
      this.state.mother_photo && this.state.mother_photo.forEach(motherphoto => {
        formData.append('mother_photo', motherphoto)
      })
    } else if (formDataName === 'guardianFormData') {
      this.state.guardian_photo && this.state.guardian_photo.forEach(guardianphoto => {
        formData.append('guardian_photo', guardianphoto)
      })
    }
    this.setState({ [formDataName]: formData })
    return formData
  }

  render () {
    const { classes, mode } = this.props
    const steps = this.getSteps()
    const { activeStep, loading, isFetchFailed } = this.state
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{this.getStepContent(index, classes)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={e => this.handleNext('skip')}
                      className={classes.button}
                    >
                        Skip
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={e => this.handleNext('save')}
                      className={classes.button}
                      disabled={(mode === 'EDIT' && loading) || (mode === 'EDIT' && isFetchFailed)}
                    >
                      {'Save & contine'}
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

ParentInputForm.propTypes = {
  classes: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(ParentInputForm)))
