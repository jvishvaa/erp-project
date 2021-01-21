import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
// import ReactTable from 'react-table'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import TextArea from './textArea'
import { urls } from '../../urls'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

class NewAdmittedStudents extends Component {
  constructor () {
    super()
    this.aGradeId = []
    this.state = {
      pointOfContact: false,
      fatherCheckbox: false,
      motherCheckbox: false,
      guardianCheckbox: false,
      showReactTable: false,
      contactPoint: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
changehandlerbranch = (e) => {
  this.setState({ branch: e.value, gradevalue: [] })
  this.props.gradeMapBranch(e.value)
};
changehandlergrade = event => {
  // this.setState({ grade: e.value })
  console.log(event, 'eeeeeee')
  let aGradeIds = []
  event.forEach(function (grade) {
    aGradeIds.push(grade.value)
  })
  this.setState({ aGradeId: aGradeIds, gradevalue: event })
  console.log(aGradeIds, 'grade')
  console.log('grade', aGradeIds)
};
changehandlerrole = e => {
  this.setState({ role: e.label, valueRole: e })
};
changehandlersmstypes = e => {
  this.setState({ smsType: e.value, valueSmsTypes: e })
};
handleAcademicyear = e => {
  console.log('acad years', this.props.session)
  this.setState({ session: e.value, sessionData: e })
}

handleSubmit () {
  var data = []

  if (this.state.role === 'Student' && !this.state.aGradeId.length) {
    this.setState({ aGradeId: null })
    this.props.alert.warning('Select atleast one grade')
    return
  }

  if (this.state.role === 'Student' && !this.state.aGradeId.forEach(function (aGradeId) {
    data.push({
      grade_id: aGradeId
    })
  })) {
    console.log(this.state.session, 'thusss')
    console.log(this.state.sessionData)
  }
  let { message, branch, aGradeId, session, studentType, contactPoint, smsType, role, gender, transport, category } = this.state

  let obj = {
    message,
    branch_id: branch,
    sms_type: smsType,
    user_type: role,
    grade_id: JSON.stringify(aGradeId).substr(1).slice(0, -1),
    gender: gender,
    using_transport: transport,
    stay_category: category,
    academic_year: session,
    admisssion_type: studentType,
    point_of_contacts: contactPoint

  }

  axios
    .post(urls.NEWSTUDENT, JSON.stringify(obj), {
      headers: {
        'Authorization': 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'

      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.alert.success('Created')
      } else {
        this.props.alert.error('Error occured')
      }
    })
    .catch(error => {
      this.props.alert.error('Error occureds')
      console.log(error)
    })
}
handleStudentCount = (state) => {
  let { state: { category, gender, transport, branch, aGradeId, session, studentType } } = this
  var path = urls.NEWSTUDENTFILTER + '?'
  path += branch ? 'branch_id=' + branch + '&' : ''
  path += aGradeId ? 'grade_id=' + (JSON.stringify(aGradeId)).substr(1).slice(0, -1) + '&' : ''
  path += studentType ? 'admisssion_type=' + studentType + '&' : ''
  path += gender ? 'gender=' + gender + '&' : ''
  path += transport ? 'using_transport=' + transport + '&' : ''
  path += category ? 'stay_category=' + category + '&' : ''
  path += session ? 'academic_year=' + session + '&' : ''

  axios.get(path, {
    headers: {
      'Authorization': 'Bearer ' + this.props.user
    }
  }).then((res) => {
    console.log(res, 'ressss')
    if (res.status === 200) {
      this.setState({ studentData: res.data.students_count,
        showReactTable: true,

        loading: false })
      console.log(this.state.studentData, 'dataa')
    }
  })
    .catch(e => console.log(e))
}
handleChange = name => event => {
  console.log(event.target.checked)
  if (name === 'point_of_contact') {
    if (event.target.checked) {
      this.setState({ pointOfContact: true, fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: false, contactPoint: [1, 2, 3] })
    } else {
      this.setState({ pointOfContact: false })
    }
  } else {
    switch (name) {
      case 'father' : this.state.pointOfContact === false && this.setState({ fatherCheckbox: !this.state.fatherCheckbox, contactPoint: this.state.contactPoint.indexOf(1) === -1 ? [...this.state.contactPoint, 1] : this.state.contactPoint }); break
      case 'mother' : this.state.pointOfContact === false && this.setState({ motherCheckbox: !this.state.motherCheckbox, contactPoint: this.state.contactPoint.indexOf(2) === -1 ? [...this.state.contactPoint, 2] : this.state.contactPoint }); break
      case 'guardian' : this.state.pointOfContact === false && this.setState({ guardianCheckbox: !this.state.guardianCheckbox, contactPoint: this.state.contactPoint.indexOf(3) === -1 ? [...this.state.contactPoint, 3] : this.state.contactPoint }); break
    }
  }
  this.setState({ [name]: event.target.checked })
  this.setState({ checkbox: this.state.checkbox })
}

render () {
  console.log(this.state.contactPoint, 'poc')
  console.log(this.state.pointOfContact, 'pocwww')
  const { classes } = this.props
  console.log(this.state.studentData, 'studentdata')

  let rolesNotRequired = [
    'Teacher_applicant',
    'Applicant',
    'Planner',
    'Principal',
    'FinanceAccountant',
    'Academic Coordinator',
    'Admin',
    'BDM',
    'FOE',
    'Subjecthead',
    'Reviewer',
    'Teacher',
    'FinanceAdmin '
  ]

  return (
    <React.Fragment>
      <Grid container>

        <Grid.Row>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={16}
            className='student-section-inputField'
          >
            <label>Branch*</label>
            <OmsSelect
              placeholder='Select Branch'
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              change={this.changehandlerbranch}
            />
          </Grid.Column>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={5}
            className='student-section-inputField'
          >

            <label>User Types*</label>
            <OmsSelect
              placeholder='Select User Types'
              options={this.props.roles
                ? this.props.roles
                  .filter(
                    role =>
                      !rolesNotRequired.includes(role.role_name)
                  )
                  .map(role => ({
                    value: role.id,
                    label: role.role_name
                  }))
                : []}

              // defaultvalue={this.state.gradevalue}
              change={this.changehandlerrole}
              defaultValue={this.state.valueRole}
              error={this.state.roleError}

            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={16}
            className='student-section-inputField'
          >
            <label>Grade*</label>
            <OmsSelect
              placeholder='Select Grade'
              isMulti
              options={this.props.grades
                ? this.props.grades.map(grade => ({
                  value: grade.grade.id,
                  label: grade.grade.grade
                }))
                : []}
              change={this.changehandlergrade}
              defaultValue={this.state.gradevalue}

            />
          </Grid.Column>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={5}
            className='student-section-inputField'
          >
            <label>SMS Types*</label>
            <OmsSelect
              placeholder='Select SMS Types'
              options={this.props.smsTypes
                ? this.props.smsTypes.map(smsType => ({
                  value: smsType,
                  label: smsType
                }))
                : []}
              defaultValue={this.state.valueSmsTypes}
              change={this.changehandlersmstypes}

            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={5}
            className='student-section-inputField'
          >
            <label>Academic Year*</label>
            <OmsSelect
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : ''}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              change={this.handleAcademicyear}
            />
          </Grid.Column>
        </Grid.Row>

        <form style={{ display: this.state.role === 'Student' || this.state.role === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
          <Grid container className={classes.root} spacing={16}>

            <FormControl component='fieldset' className={classes.formControl}>

              <b><FormLabel>Select Gender</FormLabel></b>
              <RadioGroup
                aria-label='Select Gender'
                // className={classes.group}
                value={this.state.type}
                onChange={this.handleTypeChange}
              >
                <p>
                  <FormControlLabel value='All' onClick={e => this.setState({ gender: 'All' })}control={<Radio checked={this.state.gender === 'All'} />} label='All' />
                  <FormControlLabel value={'Male'} onClick={e => this.setState({ gender: 'Male' })} control={<Radio checked={this.state.gender === 'Male'} />} label='Male' />
                  <FormControlLabel value='Female' onClick={e => this.setState({ gender: 'Female' })} control={<Radio checked={this.state.gender === 'Female'} />} label='Female' />
                </p>

              </RadioGroup>

            </FormControl>

            <FormControl component='fieldset' className={classes.formControl}>
              <b><FormLabel>Select Transport</FormLabel></b>
              <RadioGroup
                aria-label='Select Transport'
                value={this.state.type}
                onChange={this.handleTypeChange}
              >
                <p>
                  <FormControlLabel value='All' onClick={e => this.setState({ transport: 'All' })}control={<Radio checked={this.state.transport === 'All'} />} label='All' />
                  <FormControlLabel value='True' onClick={e => this.setState({ transport: 'True' })} control={<Radio checked={this.state.transport === 'True'} />} label='True' />
                  <FormControlLabel value='False' onClick={e => this.setState({ transport: 'False' })} control={<Radio checked={this.state.transport === 'False'} />} label='False' />
                </p>
              </RadioGroup>
            </FormControl>

            <FormControl component='fieldset' className={classes.formControl}>
              <b><FormLabel> Select Category</FormLabel></b>
              <RadioGroup
                aria-label='Select Category'
                value={this.state.type}
                onChange={this.handleTypeChange}
              >
                <p>
                  <FormControlLabel value='All' onClick={e => this.setState({ category: 'All' })}control={<Radio checked={this.state.category === 'All'} />} label='All' />
                  <FormControlLabel value='Day Scholar' onClick={e => this.setState({ category: 'Day Scholar' })}control={<Radio checked={this.state.category === 'Day Scholar'} />} label='Day Scholar' />
                  <FormControlLabel value='Residential' onClick={e => this.setState({ category: 'Residential' })}control={<Radio checked={this.state.category === 'Residential'} />} label='Residential' />
                </p>
              </RadioGroup>

            </FormControl>
          </Grid>
        </form>
        <form style={{ display: this.state.role === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
          <FormControl component='fieldset' className={classes.formControl}>
            {/* <th><FormLabel component='legend'>Select Gender</FormLabel></th> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.pointOfContact}
                  onChange={this.handleChange('point_of_contact')}
                  value='checkedB'
                  color='primary'
                />
              }
              label='Point of Contact'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.fatherCheckbox}
                  onChange={this.handleChange('father')}
                  value='checkedB'
                  color='primary'

                />
              }
              label='Father'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.motherCheckbox}
                  onChange={this.handleChange('mother')}
                  value='checkedB'
                  color='primary'
                />
              }
              label='Mother'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.guardianCheckbox}
                  onChange={this.handleChange('guardian')}
                  value='checkedB'
                  color='primary'
                />
              }
              label='Guardian'
            />
          </FormControl>
        </form>
        <Grid container className={classes.root} spacing={16}>
          <FormControl component='fieldset' className={classes.formControl}>

            <b><FormLabel>Student Type</FormLabel></b>
            <RadioGroup
              aria-label='Student Type'
              // className={classes.group}
              value={this.state.type}
              onChange={this.handleTypeChange}
            >
              <p>
                <FormControlLabel value='Newly joined students' onClick={e => this.setState({ studentType: 'Newly joined students' })}control={<Radio checked={this.state.studentType === 'Newly joined students'} />} label='Newly joined students' />
                <FormControlLabel value='Existing students' onClick={e => this.setState({ studentType: 'Existing students' })} control={<Radio checked={this.state.studentType === 'Existing students'} />} label='Existing students' />
              </p>

            </RadioGroup>

          </FormControl>
        </Grid>

      </Grid>

      <Grid container>
        <Grid item>
          <Button variant='outlined' width='30' color='primary' className={classes.button} onClick={this.handleStudentCount}>
        Get Students Count
          </Button>
        </Grid>
        {this.state.showReactTable
          ? <Grid item>Student Count:

            {'Count' && this.state.studentData }
          </Grid>
          : null}
      </Grid>
      <TextArea onChange={val => this.setState({ message: val })} maxLength={320} />
      <div style={{ padding: '20px' }}>
        <Button variant='outlined' color='primary' className={classes.button} onClick={this.handleSubmit}>
        Send SMS
        </Button>
      </div>

    </React.Fragment>
  )
}
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  roles: state.roles.items,
  grades: state.gradeMap.items,
  smsTypes: state.smsTypes.items,
  user: state.authentication.user,
  session: state.academicSession.items

})
const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: dispatch(apiActions.listSmsTypes()),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))

})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(NewAdmittedStudents)))
