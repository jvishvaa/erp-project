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
class StudentDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      studentDetails: {
        firstName: null,
        middleName: null,
        lastName: null,
        class: null,
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
        classGroup: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.studentDetails)
    this.props.getStudentDetail(this.state.studentDetails)
    console.log(this.props.classGroupList)
  }

  componentDidMount () {
    if (this.props.studentdetails) {
      const newstudentDetails = { ...this.props.studentdetails }
      this.setState({
        studentDetails: newstudentDetails })
    }
    this.props.fetchGradeList(this.props.alert, this.props.user)
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
        newstudentDetails['class'] = event.value
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
        console.log('This is api call', this.state.studentDetails.academicyear, this.props.alert, this.props.user, event.value)
        this.props.fetchAllSectionsPerGrade(this.state.studentDetails.academicyear, this.props.alert, this.props.user, event.value)
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

  render () {
    const { classes } = this.props
    console.log('in student details')
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                // value={this.state.academicyear ? this.state.academicyear : null}
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
                  { value: 'RTE', label: 'RTE' }
                ]}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>First Name*</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                value={this.state.studentDetails.firstName ? this.state.studentDetails.firstName : null}
                fullWidth
                required
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='firstName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Middle Name</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                value={this.state.studentDetails.middleName ? this.state.studentDetails.middleName : null}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='middleName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Last Name</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                value={this.state.studentDetails.lastName ? this.state.studentDetails.lastName : null}
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
                // value={this.state.class ? this.state.class : null}
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
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='date'
                margin='dense'
                fullWidth
                required
                value={this.state.studentDetails.dateOfBir ? this.state.studentDetails.dateOfBir : null}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='dateOfBir' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Date Of Admission</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='date'
                margin='dense'
                fullWidth
                value={this.state.studentDetails.dateofAdm ? this.state.studentDetails.dateofAdm : null}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='dateofAdm' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Ref/Adm. Number</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                value={this.state.studentDetails.refadmNum ? this.state.studentDetails.refadmNum : null}
                onChange={this.studentDetailsInputHandler}
                variant='outlined'
                name='refadmNum' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Residential Phone</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                value={this.state.studentDetails.residentialphone ? this.state.studentDetails.residentialphone : null}
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
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.common.gradeList,
  sectionList: state.finance.common.sectionsPerGrade,
  classGroupList: state.finance.common.groups
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  fetchClassGroup: (alert, user) => dispatch(actionTypes.fetchClassGroup({ alert, user })),
  fetchAllSectionsPerGrade: (session, alert, user, gradeId) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, alert, user, gradeId }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentDetailsFormAcc)))
