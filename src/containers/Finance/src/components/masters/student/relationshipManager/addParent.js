import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import Card from '@material-ui/core/Card'
// import Dropzone from 'react-dropzone'
// import IconButton from '@material-ui/core/IconButton'
// import { CardHeader, CardContent } from '@material-ui/core'
// import CloseButton from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import { CardHeader, CardContent, Button, Grid } from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import axios from 'axios'
import { urls } from '../../../../urls'
// import { recomposeColor } from '@material-ui/core/styles'

export default function AddParent (props) {
  const { show } = props
  // const [fatheruploadphoto, setFatherUploadphoto] = useState({})
  // const [motheruploadphoto, setMotherUploadphoto] = useState({})
  // const [guardianuploadphoto, setGuardianUploadphoto] = useState({})
  const [formdata, setformdata] = useState({

    erp: '',
    father_name: '',
    father_mobile_number: '',
    father_whatsapp_number: '',
    father_email: '',
    mother_name: '',
    mother_mobile_number: '',
    mother_whatsapp_number: '',
    mother_email: '',
    guardian_name: '',
    guardian_mobile_number: '',
    guardian_whatsapp_number: '',
    guardian_email: '',
    occupation: '',
    address: '',
    contact_details: '',
    work_designation: '',
    qualification: '',
    date_of_birth: new Date('2014-08-18T21:11:54'),
    email: '',
    aadhar_no: '',
    annual_income: '',
    organisation_work: '',
    office_address: ''
    // traits: '',
    // parent_of: ''
    // mother_photo: {},
    // father_photo: {},
    // guardian_photo: {}

  })
  const [dateOfbirth, setDateOfBirth] = useState(formdata.date_of_birth)
  // const [Motherphoto, setMotherphoto] = useState([])
  // const [Fatherphoto, setFatherphoto] = useState([])
  // const [Guardianphoto, setGuardianphoto] = useState([])

  // const mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
  // const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  // const number = /^-{0,1}\d+$/
  // const [close, setClosed] = useState(true)

  function setForm (event) {
    const newFormFielddata = {
      ...formdata
    }
    console.log(formdata, newFormFielddata)
    newFormFielddata[event.target.name] = event.target.value
    setformdata(newFormFielddata)
  }

  // function set (photo) {
  //   // setFatherUploadphoto(photo)

  //   setformdata({ father_photo: photo })
  // }

  function handleValidationData (formdata) {
    const mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (formdata.erp && formdata.father_email.match(mailFormat) && formdata.father_mobile_number.match(mobileFormat) && formdata.mother_mobile_number.match(mobileFormat) && formdata.father_name && formdata.father_whatsapp_number.match(mobileFormat) && formdata.mother_whatsapp_number.match(mobileFormat) && formdata.guardian_email.match(mailFormat) && formdata.contact_details && formdata.guardian_mobile_number.match(mobileFormat) && formdata.guardian_whatsapp_number.match(mobileFormat) && formdata.occupation && formdata.office_address && formdata.organisation_work && formdata.qualification && formdata.annual_income && formdata.aadhar_no && formdata.email.match(mailFormat) && formdata.date_of_birth) {
      return true
    } else {
      return false
    }
  }
  function renderTextField (label, type, name, value) {
    return (
      <TextField
        // required fullWidth
        id='standard'
        label={label}
        onChange={setForm}
        value={value}
        type={type}
        name={name}
        autoComplete={type}
        InputLabelProps={{ shrink: true }}
        margin='normal'
        variant='outlined'
        error={!value}
        helperText={!value ? 'please fill the required field' : ' '}
      />)
  }
  function onSave (data) {
    axios.post(urls.ASSIGNSTUDENTTOPARENT + props.student.id, data, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(data => {
      props.onSave()
      props.alert.success('successfully saved')
    })
      .catch((error) => {
        props.alert.error('An error occured while creating the parent, please check your data for any error.' + 'error' + JSON.stringify(error.response.data))
      })
  }

  // function onDrop (event, photo) {
  //   if (photo === 'fatherPhoto') {
  //     setFatherphoto(event)
  //   }
  //   if (photo === 'motherPhoto') {
  //     setMotherphoto(event)
  //   }
  //   if (photo === 'guardianPhoto') {
  //     setGuardianphoto(event)
  //   }
  // }
  // function renderPhoto (Photo) {
  //   console.log(Photo)
  //   if (Photo === 'fatherPhoto') {
  //     var fatherphoto = Fatherphoto &&
  // Fatherphoto.map(fatherPhoto => (
  //   <li key={fatherPhoto.name}>
  //     {fatherPhoto.name} - {fatherPhoto.size} bytes
  //   </li>
  // ))
  //     // set(fatherphoto)
  //     return fatherphoto
  //   }
  //   if (Photo === 'motherPhoto') {
  //     var motherphoto = Motherphoto &&
  // Motherphoto.map(motherPhoto => (
  //   <li key={motherPhoto.name}>
  //     {motherPhoto.name} - {motherPhoto.size} bytes
  //   </li>
  // ))
  //     // setMotherUploadphoto(motherphoto)
  //     return motherphoto
  //   }
  //   if (Photo === 'guardianPhoto') {
  //     var guardianphoto = Guardianphoto &&
  //     Guardianphoto.map(guardianPhoto => (
  //       <li key={guardianPhoto.name}>
  //         {guardianPhoto.name} - {guardianPhoto.size} bytes
  //       </li>
  //     ))
  //     // setGuardianUploadphoto(guardianphoto)
  //     return guardianphoto
  //   }
  // }

  // function renderPhotoField (Photo) {
  //   return (
  //     <div>
  //       <Dropzone onDrop={(e) => { onDrop(e, Photo) }}>
  //         {({
  //           getRootProps,
  //           getInputProps,
  //           isDragActive,
  //           isDragAccept,
  //           isDragReject
  //         }) => (
  //           <Card
  //             elevation={0}
  //             style={{
  //               marginTop: 16,
  //               marginBottom: 16,
  //               border: '1px solid black',
  //               borderStyle: 'dotted'
  //             }}
  //             {...getRootProps()}
  //             className='dropzone'
  //           >
  //             <CardContent>
  //               <input {...getInputProps()} />
  //               <div>
  //                 {isDragAccept && 'All' + ' ' + Photo + ' ' + 'will be accepted'}
  //                 {isDragReject && 'Some' + ' ' + Photo + ' ' + 'will be rejected'}
  //                 {!isDragActive && 'Drop your Upload' + ' ' + Photo + ' ' + 'Photo here.'}
  //               </div>
  //               {renderPhoto(Photo)}
  //             </CardContent>
  //           </Card>
  //         )}
  //       </Dropzone>
  //     </div>)
  // }
  // console.log(formdata, 'show')
  return <div>
    <Modal
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
      open={show}
      onClose={props.toggle}
    >

      <Card style={{
        position: 'fixed',
        top: '5%',
        left: '10%',
        width: '80vw',
        height: '80vh',
        overflow: 'auto'
      }}
      >
        <CardHeader
          title='Parent Details'
        />
        <form>
          <CardContent>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('ERP', 'number', 'erp', formdata.erp)}
              </Grid>
              <Grid item>
                {renderTextField('Father Name', 'text', 'father_name', formdata.father_name)}
              </Grid>
              <Grid item>
                {renderTextField('Father Mobile Number', 'number', 'father_mobile_number', formdata.father_mobile_number)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Father Whatsapp Number', 'number', 'father_whatsapp_number', formdata.father_whatsapp_number)}
              </Grid>

              <Grid item>
                {renderTextField('Father Email', 'email', 'father_email', formdata.father_email)}
              </Grid>

              <Grid item>
                {renderTextField('Mothers Mobile Number', 'number', 'mother_mobile_number', formdata.mother_mobile_number)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Mother Name', 'text', 'mother_name', formdata.mother_name)}

              </Grid>
              <Grid item>
                {renderTextField('Mother Whatsapp Number', 'number', 'mother_whatsapp_number', formdata.mother_whatsapp_number)}

              </Grid>

              <Grid item>
                {renderTextField('Mother Email', 'email', 'mother_email', formdata.mother_email)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Guardian Name', 'text', 'guardian_name', formdata.guardian_name)}
              </Grid>
              <Grid item>
                {renderTextField('Guardian Mobile Number', 'number', 'guardian_mobile_number', formdata.guardian_mobile_number)}
              </Grid>
              <Grid item>
                {renderTextField('Guardian whatsapp Number', 'number', 'guardian_whatsapp_number', formdata.guardian_whatsapp_number)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Contact Details', 'number', 'contact_details', formdata.contact_details)}
              </Grid>
              <Grid item>
                {renderTextField('Occupation', 'text', 'occupation', formdata.occupation)}
              </Grid>
              <Grid item>
                {renderTextField('Address', 'text', 'address', formdata.address)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Email', 'email', 'email', formdata.email)}
              </Grid>

              <Grid item>
                {renderTextField('Qualification', 'text', 'qualification', formdata.qualification)}
              </Grid>
              <Grid item>
                {renderTextField('Aadhar Number', 'number', 'aadhar_no', formdata.aadhar_no)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('Annual Income', 'number', 'annual_income', formdata.annual_income)}
              </Grid>
              <Grid item>
                {renderTextField('Office Address', 'text', 'office_address', formdata.office_address)}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    disableFuture
                    labelFunc={(e) => {
                      return e.format('DD/MM/YYYY')
                    }}
                    label='Date of birth'
                    onChange={(e) => {
                      setDateOfBirth(e)
                      setForm({
                        target: {
                          value: e,
                          name: 'date_of_birth'
                        }
                      })
                    }}
                    value={dateOfbirth}
                    error={!dateOfbirth}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                {renderTextField('organisation_work', 'text', 'organisation_work', formdata.organisation_work)}
              </Grid>
              <Grid item>
                {renderTextField('Guardian Email', 'email', 'guardian_email', formdata.guardian_email)}
              </Grid>
              <Grid item>
                {renderTextField('Work Designation', 'text', 'work_designation', formdata.work_designation)}
              </Grid>
            </Grid>
            {/* <Grid spacing={4} container>
              <Grid item> {renderPhotoField('fatherPhoto')}</Grid>
              <Grid item> {renderPhotoField('motherPhoto')}</Grid>
              <Grid item> {renderPhotoField('guardianPhoto')}</Grid>
            </Grid> */}
            <Grid spacing={4} container>
              <Grid item>
                <Button
                  onClick={() => handleValidationData(formdata) ? onSave({ ...formdata, date_of_birth: moment(formdata.date_of_birth).format('YYYY-MM-DD') }) : props.alert.error('please fill required field')}
                  variant='contained'
                  color='primary'
                >
            save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => props.onCancel()}
                  variant='contained'
                  color='secondary'
                >
            cancel
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>

    </Modal>
  </div>
}
