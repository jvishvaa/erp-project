import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField, Radio, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Modal from '../../../../ui/Modal/modal'
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
console.log('module iD outside', moduleId)
class NonRTEStudentDetailsFormAcc extends Component {
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
        gender: null,
        academicyear: null,
        studentsegment: null,
        section: null,
        dateOfBir: null,
        dateofAdm: new Date().toISOString().substr(0, 10),
        refadmNum: null,
        residentialphone: null,
        transport: 'false',
        howdidYouKnow: null,
        classGroup: null,
        regModal: false
      }
    }
  }

  // componentWillReceiveProps (prevProps) {
  //   console.log('received props', prevProps)
  // }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.studentDetailsForAdmission)
    if (nextProps.studentDetailsForAdmission) {
      const newstudentDetails = { ...this.state.studentDetails }
      newstudentDetails['dateOfBir'] = nextProps.studentDetailsForAdmission.date_of_birth ? nextProps.studentDetailsForAdmission.date_of_birth : null
      newstudentDetails['firstName'] = nextProps.studentDetailsForAdmission.student_name ? nextProps.studentDetailsForAdmission.student_name : null
      // newstudentDetails.class['label'] = this.state.studentDetails.class && this.state.studentDetails.class.label ? this.state.studentDetails.class.label : nextProps.studentDetailsForAdmission.opting_class && nextProps.studentDetailsForAdmission.opting_class.grade ? nextProps.studentDetailsForAdmission.opting_class.grade : ''
      // newstudentDetails.class['value'] = this.state.studentDetails.class && this.state.studentDetails.class.value ? this.state.studentDetails.class.value : nextProps.studentDetailsForAdmission.opting_class && nextProps.studentDetailsForAdmission.opting_class.id ? nextProps.studentDetailsForAdmission.opting_class.id : ''
      newstudentDetails.class['label'] = nextProps.studentDetailsForAdmission.opting_class && nextProps.studentDetailsForAdmission.opting_class.grade ? nextProps.studentDetailsForAdmission.opting_class.grade : ''
      newstudentDetails.class['value'] = nextProps.studentDetailsForAdmission.opting_class && nextProps.studentDetailsForAdmission.opting_class.id ? nextProps.studentDetailsForAdmission.opting_class.id : ''
      newstudentDetails['academicyear'] = nextProps.studentDetailsForAdmission.academic_year && nextProps.studentDetailsForAdmission.academic_year.session_year ? nextProps.studentDetailsForAdmission.academic_year.session_year : null
      newstudentDetails['residentialphone'] = nextProps.studentDetailsForAdmission.phone ? nextProps.studentDetailsForAdmission.phone : null
      newstudentDetails['gender'] = +nextProps.studentDetailsForAdmission.gender === 1 ? 'male' : 'female'
      newstudentDetails.regDate = nextProps.studentDetailsForAdmission.registration_date || new Date()

      if (nextProps.studentDetailsForAdmission && nextProps.studentDetailsForAdmission.error && nextProps.studentDetailsForAdmission.error.length) {
        this.setState({
          showModal: false,
          studentDetails: newstudentDetails
        })
      } else {
        this.setState({
          studentDetails: newstudentDetails
        })
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    this.props.getStudentDetail(this.state.studentDetails)
    console.log('prev prop and next: ', prevProps, prevState)
    if (prevProps.studentDetailsForAdmission && prevProps.studentDetailsForAdmission.opting_class && !this.props.sectionList.length) {
      this.props.fetchAllSectionsPerGrade(this.state.studentDetails.academicyear, this.props.alert, this.props.user, this.state.studentDetails.class.value, moduleId, this.props.branch)
    }
  }

  componentDidMount () {
    console.log('module iD mount', moduleId)
    this.props.fetchGradeList(this.props.alert, this.props.user, moduleId, this.props.branch)
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
        // newstudentDetails['class'] = event
        newstudentDetails.class['value'] = event.value
        newstudentDetails.class['label'] = event.label
        // console.log('class: ', event)
        // newstudentDetails.class['label'] = event.label
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
      default: {

      }
    }
    this.setState({
      studentDetails: newstudentDetails
    }, () => {
      if (name === 'class') {
        // console.log('This is api call', this.state.studentDetails.academicyear, this.props.alert, this.props.user, event.value)
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
      default: {

      }
    }
    this.setState({
      studentDetails: newstudentDetails
    })
  }

  hideRegModalHanlder = () => {
    this.setState({ showModal: false })
  }

  goBackHandler = () => {
    this.setState({ showModal: false })
    window.history.back()
  }

  render () {
    const { classes } = this.props
    let regModal

    if (this.state.showModal) {
      regModal = (
        <Modal open={this.state.showModal} small click={this.hideRegModalHanlder}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
              <p>Message :{this.props.studentDetailsForAdmission.error}</p>
            </Grid>
          </Grid>
          <Grid container justify='space-between' alignItems='flex-end' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12' />
            <Grid item xs='3'>
              <Button
                color='primary'
                size='small'
                variant='contained'
                onClick={this.goBackHandler}
              >
              Go Back
              </Button>
            </Grid>
            <Grid item xs='3'>
              <Button
                color='secondary'
                size='small'
                variant='contained'
                onClick={this.hideRegModalHanlder}
              >
              Proceed
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )
    }
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Academic*</label>
              <Select
                placeholder='Select Year'
                value={{ value: this.state.studentDetails.academicyear, label: this.state.studentDetails.academicyear }}
                name='academicyear'
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'academicyear') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Student Segment</label>
              <Select
                placeholder='Select'
                name='studentsegment'
                // value={this.state.studentsegment ? this.state.studentsegment : null}
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'studentsegment') }}
                options={[
                  { value: 'non RTE', label: 'Non RTE' }
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
                value={this.state.studentDetails.firstName}
                name='firstName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Middle Name</label>
              <TextField label='Middle Name'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.studentDetails.middleName}
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
                value={this.state.studentDetails.lastName}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='lastName' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Class*</label>
              <Select
                placeholder='Select'
                isDisabled
                // defaultValue={{ value: this.state.studentDetails.class.id, label: this.state.studentDetails.class.grade }}
                value={{ value: this.state.studentDetails.class ? this.state.studentDetails.class.value : null, label: this.state.studentDetails.class ? this.state.studentDetails.class.label : null }}
                options={this.props.gradeList ? this.props.gradeList.map(grades => ({
                  value: grades.id,
                  label: grades.grade
                }))
                  : []
                }
                name='class'
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'class') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Section*</label>
              <Select
                placeholder='Select'
                name='section'
                // value={this.state.section ? this.state.section : null}
                options={this.props.sectionList ? this.props.sectionList.map(sec => ({
                  value: sec.section.id,
                  label: sec.section.section_name
                })) : []
                }
                onChange={(e) => { this.studentDetailsDropdonHandler(e, 'section') }}
              />

            </Grid>
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
                value={this.state.studentDetails.dateOfBir}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='dateOfBir' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>*Date Of Admission</label>
              <TextField
                type='date'
                margin='dense'
                inputProps={{ min: this.state.studentDetails.regDate }}
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                value={this.state.studentDetails.dateofAdm ? this.state.studentDetails.dateofAdm : null}
                name='dateofAdm' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Ref/Adm. Number</label>
              <TextField label='Ref/Adm. Number'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='refadmNum' />
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
            {/* <Grid item xs={3} className={classes.spacing}>
              <label>How did you come to know about us?*</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                required
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='howdidYouKnow' />
            </Grid> */}
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Class Group</label>
              <Select
                placeholder='Select'
                name='classgroup'
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
        {regModal}
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
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchGradeList: (alert, user, moduleId, branch) => dispatch(actionTypes.fetchGradeList({ alert, user, moduleId, branch })),
  fetchClassGroup: (alert, user) => dispatch(actionTypes.fetchClassGroup({ alert, user })),
  fetchAllSectionsPerGrade: (session, alert, user, gradeId, moduleId, branch) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, alert, user, gradeId, moduleId, branch }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NonRTEStudentDetailsFormAcc)))
