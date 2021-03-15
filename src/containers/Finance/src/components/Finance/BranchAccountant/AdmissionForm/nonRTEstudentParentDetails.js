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

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Admission Form') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

class NonRTEStudentParentDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      studentParentDetails: {
        fatherName: null,
        fatherphone: null,
        fatheremail: null,
        fatherqualification: null,
        fatheroccupation: null,
        motherName: null,
        motherphone: null,
        motheremail: null,
        motherqualification: null,
        motheroccupation: null,
        guName: null,
        guPhone: null,
        guEmail: null,
        guOccupation: null,
        guQualification: null,
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
    console.log('===received props', nextProps.studentDetailsForAdmission)
    if (nextProps.studentDetailsForAdmission) {
      const newstudentParentDetails = { ...this.state.studentParentDetails }
      newstudentParentDetails['fatherName'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.father_name ? nextProps.studentDetailsForAdmission.parent.father_name : ''
      newstudentParentDetails['fatherphone'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.father_mobile_no ? nextProps.studentDetailsForAdmission.parent.father_mobile_no : ''
      newstudentParentDetails['fatheremail'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.father_email ? nextProps.studentDetailsForAdmission.parent.father_email : ''
      newstudentParentDetails['motherName'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.mother_name ? nextProps.studentDetailsForAdmission.parent.mother_name : ''
      newstudentParentDetails['motherphone'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.mother_mobile_no ? nextProps.studentDetailsForAdmission.parent.mother_mobile_no : ''
      newstudentParentDetails['motheremail'] = nextProps.studentDetailsForAdmission.parent && nextProps.studentDetailsForAdmission.parent.mother_email ? nextProps.studentDetailsForAdmission.parent.mother_email : ''
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
        if (event.target.value.length <= 10) {
          newstudentParentDetails['fatherphone'] = event.target.value
        } else {
          this.props.alert.warning('Cant Exceed 10 digits')
        }
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
        if (event.target.value.length <= 10) {
          newstudentParentDetails['motherphone'] = event.target.value
        } else {
          this.props.alert.warning('Cant Exceed 10 digits')
        }
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
      case 'guName': {
        newstudentParentDetails['guName'] = event.target.value
        break
      }
      case 'guPhone': {
        if (event.target.value.length <= 10) {
          newstudentParentDetails['guPhone'] = event.target.value
        } else {
          this.props.alert.warning('Cant Exceed 10 digits')
        }
        break
      }
      case 'guEmail': {
        newstudentParentDetails['guEmail'] = event.target.value
        break
      }
      case 'guQualification': {
        newstudentParentDetails['guQualification'] = event.target.value
        break
      }
      case 'guOccupation': {
        newstudentParentDetails['guOccupation'] = event.target.value
        break
      }
      case 'siblingClass': {
        newstudentParentDetails['siblingClass'] = event.target.value
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
              <TextField
                type='text'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                margin='dense'
                fullWidth
                required
                value={this.state.studentParentDetails.fatherName}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Phone No*</label>
              <TextField
                type='number'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                value={this.state.studentParentDetails.fatherphone}
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
                value={this.state.studentParentDetails.fatheremail}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Qualification</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
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
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Name</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherName}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Phone No*</label>
              <TextField
                type='number'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.motherphone}
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
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Qualification</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
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
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Name</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.guName}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='guName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Phone No*</label>
              <TextField
                type='number'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentParentDetails.guPhone}
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='guPhone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian E-mail</label>
              <TextField
                type='email'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='guEmail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Qualification</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='guQualification' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Occupation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='guOccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Point Of Contact*</label>
              <div style={{ marginTop: '14px' }}>
                <Select
                  placeholder='Select'
                  name='pointOfContact'
                  onChange={(e) => { this.studentParentDroponHandler(e, 'poc') }}
                  options={[
                    { value: '1', label: 'Father' },
                    { value: '2', label: 'Mother' },
                    { value: '3', label: 'Guardian' }
                  ]}
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
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NonRTEStudentParentDetailsFormAcc)))
