import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { apiActions } from '../../../../_actions'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  spacingForDropDown: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  outlined: {
    zIndex: 0
  }
})
class UpdateStudentParentDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.pocOptions = [
      { value: '1', label: 'Father' },
      { value: '2', label: 'Mother' },
      { value: '3', label: 'Guardian' }
    ]
    this.state = {
      seesion: null,
      studentParentDetails: {
        fatherName: null,
        fatherphone: null,
        fatheremail: null,
        fatherqualification: null,
        fatheroccupation: null,
        fatherorganisation: null,
        fatherdesignation: null,
        fatherdob: null,
        marriageAniversory: null,
        fatherAadhar: null,
        motherName: null,
        motherphone: null,
        motheremail: null,
        motherqualification: null,
        motheroccupation: null,
        motherOrganisation: null,
        motherDesignation: null,
        motherDob: null,
        motherAadharno: null,
        poc: null,
        siblingClass: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.studentParentDetails)
    this.props.getStudentParentDetail(this.state.studentParentDetails)
  }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.admissionrecordbyerp)
    if (nextProps.admissionrecordbyerp) {
      console.log('this is printed chandan')
      const newstudentParentDetails = { ...this.state.studentParentDetails }
      newstudentParentDetails['fatherName'] = nextProps.admissionrecordbyerp.father_name ? nextProps.admissionrecordbyerp.father_name : ''
      newstudentParentDetails['fatherphone'] = nextProps.admissionrecordbyerp.father_mobile ? nextProps.admissionrecordbyerp.father_mobile : ''
      // newstudentDetails['class'] = nextProps.admissionrecordbyerp.opting_class ? { label: nextProps.admissionrecordbyerp.opting_class.grade, value: nextProps.admissionrecordbyerp.opting_class.id } : null
      newstudentParentDetails['fatheremail'] = nextProps.admissionrecordbyerp.father_email ? nextProps.admissionrecordbyerp.father_email : ''
      newstudentParentDetails['fatherqualification'] = nextProps.admissionrecordbyerp.father_qualification ? nextProps.admissionrecordbyerp.father_qualification : ''
      newstudentParentDetails['fatheroccupation'] = nextProps.admissionrecordbyerp.father_occupation ? nextProps.admissionrecordbyerp.father_occupation : ''
      newstudentParentDetails['fatherorganisation'] = nextProps.admissionrecordbyerp.father_business_name ? nextProps.admissionrecordbyerp.father_business_name : ''
      newstudentParentDetails['fatherdesignation'] = nextProps.admissionrecordbyerp.father_designation ? nextProps.admissionrecordbyerp.father_designation : ''
      newstudentParentDetails['fatherdob'] = nextProps.admissionrecordbyerp.father_dob ? nextProps.admissionrecordbyerp.father_dob : null
      newstudentParentDetails['marriageAniversory'] = nextProps.admissionrecordbyerp.father_marriage_anniversary ? nextProps.admissionrecordbyerp.father_marriage_anniversary : null
      newstudentParentDetails['fatherAadhar'] = nextProps.admissionrecordbyerp.father_aadhaar_number ? nextProps.admissionrecordbyerp.father_aadhaar_number : null
      newstudentParentDetails['motherName'] = nextProps.admissionrecordbyerp.mother_name ? nextProps.admissionrecordbyerp.mother_name : ''
      newstudentParentDetails['motherphone'] = nextProps.admissionrecordbyerp.mother_mobile ? nextProps.admissionrecordbyerp.mother_mobile : ''
      newstudentParentDetails['motheremail'] = nextProps.admissionrecordbyerp.mother_email ? nextProps.admissionrecordbyerp.mother_email : ''
      newstudentParentDetails['motherqualification'] = nextProps.admissionrecordbyerp.mother_qualification ? nextProps.admissionrecordbyerp.mother_qualification : ''
      newstudentParentDetails['motheroccupation'] = nextProps.admissionrecordbyerp.mother_occupation ? nextProps.admissionrecordbyerp.mother_occupation : ''
      newstudentParentDetails['motherOrganisation'] = nextProps.admissionrecordbyerp.mother_business_name ? nextProps.admissionrecordbyerp.mother_business_name : ''
      newstudentParentDetails['motherDesignation'] = nextProps.admissionrecordbyerp.mother_designation ? nextProps.admissionrecordbyerp.mother_designation : ''
      newstudentParentDetails['motherDob'] = nextProps.admissionrecordbyerp.motherDob ? nextProps.admissionrecordbyerp.motherDob : null
      newstudentParentDetails['motherAadharno'] = nextProps.admissionrecordbyerp.mother_aadhaar_number ? nextProps.admissionrecordbyerp.mother_aadhaar_number : ''
      newstudentParentDetails['poc'] = nextProps.admissionrecordbyerp.point_of_contact ? nextProps.admissionrecordbyerp.point_of_contact : null
      newstudentParentDetails['siblingClass'] = nextProps.admissionrecordbyerp.siblings ? nextProps.admissionrecordbyerp.siblings : null

      this.setState({
        studentParentDetails: newstudentParentDetails })
    }
  }

  studentParentDroponHandler= (event, name) => {
    console.log(event, name)
    const newstudentParentDetails = { ...this.state.studentParentDetails }
    switch (name) {
      case 'poc': {
        newstudentParentDetails['poc'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentParentDetails: newstudentParentDetails
    })
  }

  studentParentInputHandler= (event) => {
    console.log(event.target.name)
    const newstudentParentDetails = { ...this.state.studentParentDetails }
    switch (event.target.name) {
      case 'fatherName': {
        newstudentParentDetails['fatherName'] = event.target.value
        break
      }
      case 'fatherphone': {
        newstudentParentDetails['fatherphone'] = event.target.value
        break
      }
      case 'fatheremail': {
        newstudentParentDetails['fatheremail'] = event.target.value
        break
      }
      case 'fatherqualification': {
        newstudentParentDetails['fatherqualification'] = event.target.value
        break
      }
      case 'fatheroccupation': {
        newstudentParentDetails['fatheroccupation'] = event.target.value
        break
      }
      case 'motherName': {
        newstudentParentDetails['motherName'] = event.target.value
        break
      }
      case 'motherphone': {
        newstudentParentDetails['motherphone'] = event.target.value
        break
      }
      case 'motheremail': {
        newstudentParentDetails['motheremail'] = event.target.value
        break
      }
      case 'motherqualification': {
        newstudentParentDetails['motherqualification'] = event.target.value
        break
      }
      case 'motheroccupation': {
        newstudentParentDetails['motheroccupation'] = event.target.value
        break
      }
      case 'siblingClass': {
        newstudentParentDetails['siblingClass'] = event.target.value
        break
      }
      case 'fatherorganisation': {
        newstudentParentDetails['fatherorganisation'] = event.target.value
        break
      }
      case 'fatherdesignation': {
        newstudentParentDetails['fatherdesignation'] = event.target.value
        break
      }
      case 'fatherdob': {
        newstudentParentDetails['fatherdob'] = event.target.value
        break
      }
      case 'marriageAniversory': {
        newstudentParentDetails['marriageAniversory'] = event.target.value
        break
      }
      case 'fatherAadhar': {
        newstudentParentDetails['fatherAadhar'] = event.target.value
        break
      }
      case 'motherOrganisation': {
        newstudentParentDetails['motherOrganisation'] = event.target.value
        break
      }
      case 'motherDesignation': {
        newstudentParentDetails['motherDesignation'] = event.target.value
        break
      }
      case 'motherDob': {
        newstudentParentDetails['motherDob'] = event.target.value
        break
      }
      case 'motherAadharno': {
        newstudentParentDetails['motherAadharno'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentParentDetails: newstudentParentDetails
    })
  }

  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Name*</label>
              <TextField label='Father Name'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                value={this.state.studentParentDetails.fatherName ? this.state.studentParentDetails.fatherName : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Phone No*</label>
              <TextField
                type='phone'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                value={this.state.studentParentDetails.fatherphone ? this.state.studentParentDetails.fatherphone : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherphone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father E-mail</label>
              <TextField
                type='email'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatheremail ? this.state.studentParentDetails.fatheremail : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Qualification</label>
              <TextField label='Father Qualification'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatherqualification ? this.state.studentParentDetails.fatherqualification : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherqualification' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Occupation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatheroccupation ? this.state.studentParentDetails.fatheroccupation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Organization</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatherorganisation ? this.state.studentParentDetails.fatherorganisation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherorganisation' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Designation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatherdesignation ? this.state.studentParentDetails.fatherdesignation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherdesignation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father DOB</label>
              <TextField
                type='date'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatherdob ? this.state.studentParentDetails.fatherdob : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherdob' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Marriage Anniversary Date</label>
              <TextField
                type='date'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.marriageAniversory ? this.state.studentParentDetails.marriageAniversory : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='marriageAniversory' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Aadhar No</label>
              <TextField label='Father Aadhar No'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.fatherAadhar ? this.state.studentParentDetails.fatherAadhar : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherAadhar' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Name</label>
              <TextField label='Mother Name'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherName ? this.state.studentParentDetails.motherName : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Phone No*</label>
              <TextField
                type='phone'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                value={this.state.studentParentDetails.motherphone ? this.state.studentParentDetails.motherphone : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherphone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother E-mail</label>
              <TextField
                type='email'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motheremail ? this.state.studentParentDetails.motheremail : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Qualification</label>
              <TextField label='Mother Qualification'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherqualification ? this.state.studentParentDetails.motherqualification : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherqualification' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Occupation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motheroccupation ? this.state.studentParentDetails.motheroccupation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Organization</label>
              <TextField label='Mother Qualification'
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                value={this.state.studentParentDetails.motherOrganisation ? this.state.studentParentDetails.motherOrganisation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherOrganisation' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Designation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherDesignation ? this.state.studentParentDetails.motherDesignation : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherDesignation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother DOB</label>
              <TextField
                type='date'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherDob ? this.state.studentParentDetails.motherDob : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherDob' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Aadhar No</label>
              <TextField label='Mother Aadhar No'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherAadharno ? this.state.studentParentDetails.motherAadharno : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherAadharno' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Point Of Contact</label>
              <div style={{ marginTop: '14px' }}>
                <Select
                  placeholder='Select'
                  name='pointOfContact'
                  onChange={(e) => { this.studentParentDroponHandler(e, 'poc') }}
                  options={this.pocOptions}
                  value={{ value: this.state.studentParentDetails.poc ? this.state.studentParentDetails.poc : '', label: this.pocOptions[this.pocOptions.map(function (e) { return e.value }).indexOf(this.state.studentParentDetails.poc ? this.state.studentParentDetails.poc : '1')].label }}
                />
              </div>
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling Class</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.siblingClass ? this.state.studentParentDetails.siblingClass : ''}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='siblingClass' />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateStudentParentDetailsFormAcc)))
