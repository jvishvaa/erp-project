import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField, Radio } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'

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
class UpdateStudentDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      studentDetails: {
        firstName: null,
        middleName: null,
        lastName: null,
        class: {
          label: null,
          value: null
        },
        gender: 'male',
        academicyear: null,
        studentsegment: null,
        section: null,
        dateOfBir: null,
        dateofAdm: null,
        refadmNum: null,
        residentialphone: null,
        transport: 'false',
        howdidYouKnow: null,
        classGroup: null,
        enrollment_code: null,
        category: null
      }
    }
  }

  // componentWillReceiveProps (prevProps) {
  //   console.log('received props', prevProps)
  // }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.admissionrecordbyerp)
    if (nextProps.admissionrecordbyerp) {
      const newstudentDetails = { ...this.state.studentDetails }
      newstudentDetails['firstName'] = nextProps.admissionrecordbyerp.name ? nextProps.admissionrecordbyerp.name : null
      newstudentDetails['middleName'] = nextProps.admissionrecordbyerp.middle_name ? nextProps.admissionrecordbyerp.middle_name : null
      newstudentDetails['lastName'] = nextProps.admissionrecordbyerp.last_name ? nextProps.admissionrecordbyerp.last_name : null
      newstudentDetails['refadmNum'] = nextProps.admissionrecordbyerp.admission_number ? nextProps.admissionrecordbyerp.admission_number : null
      newstudentDetails['dateOfBir'] = nextProps.admissionrecordbyerp.date_of_birth ? nextProps.admissionrecordbyerp.date_of_birth : null
      newstudentDetails['classGroup'] = nextProps.admissionrecordbyerp.class_group_name ? nextProps.admissionrecordbyerp.class_group_name : null
      newstudentDetails['gender'] = nextProps.admissionrecordbyerp.gender ? nextProps.admissionrecordbyerp.gender : null
      newstudentDetails['dateofAdm'] = nextProps.admissionrecordbyerp.admission_date ? nextProps.admissionrecordbyerp.admission_date : null
      newstudentDetails['residentialphone'] = nextProps.admissionrecordbyerp.contact_no ? nextProps.admissionrecordbyerp.contact_no : null
      newstudentDetails['transport'] = nextProps.admissionrecordbyerp.using_transport ? nextProps.admissionrecordbyerp.using_transport.toString() : null
      newstudentDetails['enrollment_code'] = nextProps.admissionrecordbyerp.erp ? nextProps.admissionrecordbyerp.erp : null
      newstudentDetails['category'] = nextProps.admissionrecordbyerp.stay_category ? nextProps.admissionrecordbyerp.stay_category : null
      console.log(nextProps.admissionrecordbyerp.stay_category)
      this.setState({
        studentDetails: newstudentDetails })
    } else {
      const newstudentDetails = { ...this.state.studentDetails }
      newstudentDetails['firstName'] = null
      newstudentDetails['dateOfBir'] = null
      // newstudentDetails['class'] = nextProps.admissionrecordbyerp.opting_class ? { label: nextProps.admissionrecordbyerp.opting_class.grade, value: nextProps.admissionrecordbyerp.opting_class.id } : null
      newstudentDetails['gender'] = null
      newstudentDetails['residentialphone'] = null
      newstudentDetails['enrollment_code'] = null

      this.setState({
        studentDetails: newstudentDetails })
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.studentDetails)
    this.props.getStudentDetail(this.state.studentDetails)
    console.log(this.props.studentPrefillDetails)
    console.log(this.props.classGroupList)
  }

  componentDidMount () {
    console.log('alertttt', this.props.alert)
    this.props.fetchGradeList(this.props.alert, this.props.user, moduleId)
    this.props.fetchClassGroup(this.props.alert, this.props.user)
  }

  handleGender = event => {
    const newstudentDetails = { ...this.state.studentDetails }
    if (event.target.value === 'male') {
      newstudentDetails['gender'] = event.target.value
    } else if (event.target.value === 'female') {
      newstudentDetails['gender'] = event.target.value
    }
    this.setState({
      studentDetails: newstudentDetails })
  }

  handleTransport = event => {
    const newstudentDetails = { ...this.state.studentDetails }
    if (event.target.value === 'true') {
      newstudentDetails['transport'] = event.target.value
    } else if (event.target.value === 'false') {
      newstudentDetails['transport'] = event.target.value
    }
    this.setState({
      studentDetails: newstudentDetails })
  }

  studentDetailsDropdonHandler= (event, name) => {
    console.log('student detail handler', event, name)
    const newstudentDetails = { ...this.state.studentDetails }
    console.log(event.value)
    switch (name) {
      case 'academicyear': {
        newstudentDetails['academicyear'] = event.value
        break
      }
      case 'studentsegment': {
        newstudentDetails['studentsegment'] = event.value
        break
      }
      case 'class': {
        newstudentDetails['class'] = event
        break
      }
      case 'section': {
        newstudentDetails['section'] = event.value
        break
      }
      case 'classgroup': {
        newstudentDetails['classGroup'] = event.value
        break
      }
      case 'category': {
        newstudentDetails['category'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentDetails: newstudentDetails
    }, () => {
      if (name === 'class') {
        console.log('This is api call', this.state.studentDetails.academicyear, this.props.alert, this.props.user, event.value)
        this.props.fetchAllSectionsPerGrade(this.state.studentDetails.academicyear, this.props.alert, this.props.user, event.value, moduleId)
      }
    })
  }

  studentDetailsInputHandler= (event) => {
    const newstudentDetails = { ...this.state.studentDetails }
    switch (event.target.name) {
      case 'firstName': {
        newstudentDetails['firstName'] = event.target.value
        break
      }
      case 'middleName': {
        newstudentDetails['middleName'] = event.target.value
        break
      }
      case 'lastName': {
        newstudentDetails['lastName'] = event.target.value
        break
      }
      case 'dateOfBir': {
        newstudentDetails['dateOfBir'] = event.target.value
        break
      }
      case 'dateofAdm': {
        newstudentDetails['dateofAdm'] = event.target.value
        break
      }
      case 'refadmNum': {
        newstudentDetails['refadmNum'] = event.target.value
        break
      }
      case 'residentialphone': {
        newstudentDetails['residentialphone'] = event.target.value
        break
      }
      case 'howdidYouKnow': {
        newstudentDetails['howdidYouKnow'] = event.target.value
        break
      }
      case 'EnrollmentCode': {
        newstudentDetails['enrollment_code'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentDetails: newstudentDetails
    })
  }

  render () {
    console.log('from nonRTE: ', this.props.studentDetailsForAdmission)
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Enrollment Code</label>
              <TextField
                type='text'
                disabled
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                value={this.state.studentDetails.enrollment_code ? this.state.studentDetails.enrollment_code : ''}
                name='EnrollmentCode' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Category</label>
              <Select
                placeholder='Select'
                name='category'
                value={{ label: this.state.studentDetails.category ? this.state.studentDetails.category : '', value: this.state.studentDetails.category ? this.state.studentDetails.category : '' }}
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'category') }}
                options={[
                  { value: 'Day Scholar', label: 'Day Scholar' },
                  { value: 'Residential', label: 'Residential' }
                  // { value: 'Hostel', label: 'Hostel' }
                ]}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>First Name*</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                value={this.state.studentDetails.firstName ? this.state.studentDetails.firstName : ''}
                name='firstName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Middle Name</label>
              <TextField label='Middle Name'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentDetails.middleName ? this.state.studentDetails.middleName : ''}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='middleName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Last Name</label>
              <TextField label='Last Name'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentDetails.lastName ? this.state.studentDetails.lastName : ''}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='lastName' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <strong>Gender:</strong>
              <Grid item xs={12}>
                <Radio
                  checked={this.state.studentDetails.gender === 'male'}
                  value='male'
                  name='gender-boy'
                  onChange={this.handleGender}
                  aria-label='boy'
                /> Boy
                <Radio
                  checked={this.state.studentDetails.gender === 'female'}
                  value='female'
                  name='gender-girl'
                  onChange={this.handleGender}
                  aria-label='girl'
                /> Girl
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Date Of Birth*</label>
              <TextField
                type='date'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                required
                value={this.state.studentDetails.dateOfBir ? this.state.studentDetails.dateOfBir : ''}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='dateOfBir' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Date Of Admission</label>
              <TextField
                type='date'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentDetails.dateofAdm ? this.state.studentDetails.dateofAdm : ''}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='dateofAdm' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Residential Phone</label>
              <TextField label='Residential Phone'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentDetails.residentialphone ? this.state.studentDetails.residentialphone : ''}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='residentialphone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <strong>Transport:</strong>
              <Grid item xs={12}>
                <Radio
                  name='transport-yes'
                  aria-label='transport'
                  checked={this.state.studentDetails.transport === 'true'}
                  value='true'
                  onChange={this.handleTransport}
                /> Yes
                <Radio
                  value='false'
                  name='transport-no'
                  aria-label='transport'
                  checked={this.state.studentDetails.transport === 'false'}
                  onChange={this.handleTransport}
                /> No
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Class Group</label>
              <Select
                placeholder='Select'
                name='classgroup'
                value={{ label: this.state.studentDetails.classGroup ? this.state.studentDetails.classGroup : '', value: this.state.studentDetails.classGroup ? this.state.studentDetails.classGroup : '' }}
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'classgroup') }}
                options={this.props.classGroupList ? this.props.classGroupList.map(group => ({
                  value: group,
                  label: group
                }))
                  : []
                }
              />
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
  gradeList: state.finance.common.gradeList,
  sectionList: state.finance.common.sectionsPerGrade,
  classGroupList: state.finance.common.groups,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchGradeList: (alert, user, moduleId) => dispatch(actionTypes.fetchGradeList({ alert, user, moduleId })),
  fetchClassGroup: (alert, user) => dispatch(actionTypes.fetchClassGroup({ alert, user })),
  fetchAllSectionsPerGrade: (session, alert, user, gradeId, moduleId) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, alert, user, gradeId, moduleId }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateStudentDetailsFormAcc)))
