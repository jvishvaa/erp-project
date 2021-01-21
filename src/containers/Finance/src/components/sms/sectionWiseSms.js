import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import axios from 'axios'
import ReactTable from 'react-table'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import { withRouter } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles, Stepper, Step, StepLabel, Button } from '@material-ui/core/'
import { Send } from '@material-ui/icons'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import TextArea from './textArea'
// import { student } from '../../_reducers/student.reducer'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})
function getSteps () {
  return ['Enter required fields', 'Select students']
}
class SectionWiseSms extends Component {
  constructor () {
    super()
    this.aGradeId = []
    this.state = { activeStep: 0, selectedTeachers: new Set() }
    this.handleSectionChange = this.handleSectionChange.bind(this)
    this.changehandlergrade = this.changehandlergrade.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
    this.props.listBranches()
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    console.log(academicProfile)
    if (this.role === 'Principal' || this.role === 'FOE') {
      this.setState({
        branch: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.students) {
      // eslint-disable-next-line no-debugger
      // debugger
    }
    if (Array.isArray(nextProps.students) && nextProps.students.length > 0 && this.props.students.length === 0) {
      console.log('Updated', this.props.students, nextProps.students)
      this.filterTableData(nextProps.students)

      return true
    }
    return true
  }
  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, gradevalue: [] })
    this.props.gradeMapBranch(e.value)
  };
  changehandlergrade = event => {
    this.setState({ aGradeId: event.value, valueGrade: event, valueSection: [] })
    this.props.sectionMap(event.value)
  }

  handleSectionChange (event) {
    let aSection = []
    event.map(section => {
      aSection.push(section.value)
    })
    this.setState({ sectionData: aSection })
  }

    changehandlerrole = e => {
      this.setState({ rolename: e.label, valueRole: e })
    };
    changehandlersmstypes = e => {
      this.setState({ smsType: e.value, valueSmsTypes: e })
    };
    changehandlerdepartment = (e, value) => {
      this.setState({ department: e.value, valueDepartment: e })
    };
    fetchData = (state, instance) => {
      this.setState({ loading: true })
      this.getStudents(state)
    }
    handleBack = () => {
      this.setState(state => ({
        activeStep: state.activeStep - 1
      }))
    }
    handleNext = () => {
      let { branch, aGradeId, sectionData, gender, message, rolename, smsType, department, selectedTeachers, transport, category } = this.state
      let activeStep = this.state.activeStep
      if (activeStep === 0) {
        if (rolename === 'Teacher') {
          if (!branch || !department || !message || !rolename || !smsType) {
            this.props.alert.error('Please enter required fields')
            return
          } else {
            axios
              .get(urls.SectionWiseSms + '?branch_id=' + this.state.branch + '&department_id=' + this.state.department, {
                headers: {
                  Authorization: 'Bearer ' + this.props.user
                }
              })
              .then(res => {
                if (res.status === 200) {
                  if (typeof (res.data) !== 'string') {
                    this.setState({ teacherData: res.data })
                  }
                } else if (res.status === 204) {
                  this.props.alert.error('no staff found')
                } else {
                  this.props.alert.error('Error Occured')
                }
              })
              .catch(error => {
                console.log(error)
                if (error.response && error.response.status !== 500) {
                  this.props.alert.error(String(error.response))
                } else {
                  this.props.alert.error('Unable to get staff data')
                }
              })
          }
        } else if (rolename === 'Student' | rolename === 'Parent') {
          if (!branch || !aGradeId || !message || !rolename || !smsType || !gender || !sectionData || !transport || !category) {
            this.props.alert.error('Please enter requireds fields')
          } else {
            axios
              .get(urls.StudentFilter + '?branch_id=' + this.state.branch + '&acad_branch_grade_mapping_id=' + this.state.aGradeId +
              '&acad_section_mapping_id=' + this.state.sectionData + '&using_transport=' +
              this.state.transport + '&gender=' + this.state.gender + '&stay_category=' + this.state.category + '&page_number=' + 1 + '&page_size=' + 5
              , {
                headers: {
                  Authorization: 'Bearer ' + this.props.user
                }
              })
              .then(res => {
                if (res.status === 200) {
                  if (typeof (res.data) !== 'string') {
                    this.setState({ StudentData: res.data.student_data, response: res.data })
                  }
                } else if (res.status === 204) {
                  this.props.alert.error('no student found')
                } else {
                  this.props.alert.error('Error Occured')
                }
              })
              .catch(error => {
                if (error.response && error.response.status !== 500) {
                  this.props.alert.error(String(error.response))
                } else {
                  this.props.alert.error('Unable to get student data')
                }
              })
          }
        } else if (activeStep === 1) {
          if (selectedTeachers.size === 0) {
            this.props.alert.error('Minimum one Staff must be selected')
            return
          } else {
            this.props.alert.error('Minimum one Student must be selected')
          }
        }
        this.setState({
          activeStep: activeStep + 1
        })
        let steps = getSteps()
        if (activeStep === (steps.length - 1)) {
        }
      }
    };
    handleAdd () {
      if (this.state.rolename === 'Teacher') {
        console.log(this.state, 'thusss')
        let { message, branch, smsType, rolename, selectedTeachers } = this.state
        console.log(this.state, 'this.styate')
        var formData = new FormData()
        formData.append('message', message)
        formData.append('branch_id', branch)
        formData.append('sms_type', smsType)
        formData.append('user_type', rolename)
        let obj = {
          message,
          branch_id: branch,
          sms_type: smsType,
          user_type: rolename,
          teacher_ids: JSON.stringify([...selectedTeachers])
        }

        axios
          .post(urls.SectionWiseSms, JSON.stringify(obj), {
            headers: {
              'Authorization': 'Bearer ' + this.props.user,
              'Content-Type': 'application/json'

            }
          })
          .then(res => {
            if (res.status === 200) {
              this.props.alert.success('Message Sent')
            } else {
              this.props.alert.error('Error occured')
            }
          })
          .catch(error => {
            this.props.alert.error('Error occured')
            console.log(error)
          })
      } else if (this.state.rolename === 'Student') {
        var formData1 = new FormData()
        console.log(this.state, 'thusss')
        let { message, branch, smsType, rolename, selectedStudents, aGradeId } = this.state
        console.log(this.state, 'this.styate')
        formData1.append('message', message)
        formData1.append('branch_id', branch)
        formData1.append('sms_type', smsType)
        formData1.append('user_type', rolename)
        formData1.append('acad_branch_grade_mapping', aGradeId)
        let obj = {
          message,
          branch_id: branch,
          sms_type: smsType,
          user_type: rolename,
          students: JSON.stringify([...selectedStudents])
        }
        console.log(obj, 'i amammmm student obj')
        axios
          .post(urls.SectionWiseSms, JSON.stringify(obj), {
            headers: {
              'Authorization': 'Bearer ' + this.props.user,
              'Content-Type': 'application/json'

            }
          })
          .then(res => {
            if (res.status === 200) {
              this.props.alert.success('Message Sent')
            } else {
              this.props.alert.error('Error occured')
            }
          })
          .catch(error => {
            this.props.alert.error('Error occured')
            console.log(error)
          })
      } else if (this.state.rolename === 'Parent') {
        var formData2 = new FormData()
        let { message, branch, smsType, rolename, selectedStudents, aGradeId, contactPoint } = this.state
        formData2.append('message', message)
        formData2.append('branch_id', branch)
        formData2.append('sms_type', smsType)
        formData2.append('user_type', rolename)
        formData2.append('acad_branch_grade_mapping', aGradeId)
        formData2.append('point_of_contacts', contactPoint)
        let obj = {
          message,
          branch_id: branch,
          sms_type: smsType,
          user_type: rolename,
          point_of_contacts: JSON.stringify(contactPoint),
          students: JSON.stringify([...selectedStudents])
        }
        console.log(obj, 'i am parenttttttttobj')
        axios
          .post(urls.SectionWiseSms, JSON.stringify(obj), {
            headers: {
              'Authorization': 'Bearer ' + this.props.user,
              'Content-Type': 'application/json'

            }
          })
          .then(res => {
            if (res.status === 200) {
              this.props.alert.success('Message Sent')
            } else {
              this.props.alert.error('Error occured')
            }
          })
          .catch(error => {
            this.props.alert.error('Error occured')
            console.log(error)
          })
      }
    }
      handleChange = name => event => {
        console.log(event.target.checked)
        if (name === 'point_of_contact') {
          if (event.target.checked) {
            this.setState({ pointOfContact: true, fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: false, contactPoint: [1, 2, 3] })
          } else {
            this.setState({ pointOfContact: false })
          }
        } else if (name === 'father') {
          if (event.target.checked) {
            this.setState({ fatherCheckbox: true, motherCheckbox: false, guardianCheckbox: false, contactPoint: [1] })
          } else {
            this.setState({ fatherCheckbox: false })
          }
        } else if (name === 'mother') {
          if (event.target.checked) {
            this.setState({ fatherCheckbox: false, motherCheckbox: true, guardianCheckbox: false, contactPoint: [2] })
          } else {
            this.setState({ motherCheckbox: false })
          }
        } else if (name === 'guardian') {
          if (event.target.checked) {
            this.setState({ fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: true, contactPoint: [3] })
          } else {
            this.setState({ guardianCheckbox: false })
          }
        } else if (name === 'father' && name === 'mother') {
          if (event.target.checked) {
            this.setState({ fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: true, contactPoint: [1, 2] })
          } else {
            this.setState({ fatherCheckbox: false, motherCheckbox: false })
          }
        } else if (name === 'guardian' && name === 'father') {
          if (event.target.checked) {
            this.setState({ fatherCheckbox: false, motherCheckbox: false, guardianCheckbox: true, contactPoint: [3, 1] })
          } else {
            this.setState({ guardianCheckbox: false, fatherCheckbox: false })
          }
        } else if (event.target.checked) {
          this.setState({ fatherCheckbox: true, motherCheckbox: false, guardianCheckbox: true, contactPoint: [2, 3] })
        }

        this.setState({ [name]: event.target.checked })
      }
    ;
      render () {
        let { selectedStudents = new Set() } = this.state
        const studentColumns = [
          {
            id: 'checkbox',
            Header: () => { return 'Selected ' + (selectedStudents.size) },
            accessor: props => {
              let { selectedStudents = new Set() } = this.state
              return (<input
                type='checkbox'
                checked={selectedStudents.has(props.id)}
                onChange={({ target: { checked } }) => {
                  if (checked) {
                    selectedStudents.add(props.id)
                  } else {
                    selectedStudents.delete(props.id)
                  }
                  this.setState({ selectedStudents })
                }}
              />)
            }
          },
          {
            Header: 'Student Name',
            accessor: 'name'
          },
          {
            Header: 'Erpcode',
            accessor: 'erp'
          },
          {
            Header: 'Point_of_contact',
            accessor: 'contact_no'
          },
          {
            Header: 'Section',
            accessor: 'section'
          },
          {
            Header: 'Grade',
            accessor: 'grade.grade'
          }
        ]
        const staffColumns = [
          {
            id: 'checkbox',
            Header: () => { return 'Selected ' + (this.state.selectedTeachers.size) },
            accessor: props => {
              let { selectedTeachers = new Set() } = this.state
              return (<input
                type='checkbox'
                checked={selectedTeachers.has(props.id)}
                onChange={({ target: { checked } }) => {
                  if (checked) {
                    selectedTeachers.add(props.id)
                  } else {
                    selectedTeachers.delete(props.id)
                  }
                  this.setState({ selectedTeachers })
                }}
              />)
            }
          },
          {
            Header: 'Staff Name',
            accessor: 'name'
          },
          {
            Header: 'Erpcode',
            accessor: 'erp'
          },
          {
            Header: 'Staff Type',
            accessor: 'designation.designation_name'
          }
        ]
        const { activeStep } = this.state
        const { classes } = this.props
        const steps = getSteps()
        console.log(this.state.activeStep === 0)
        console.log('sms tyes', this.props.smsTypes)
        return (
          <div>
            {/* <Form onSubmit={this.handleSubmit} id='formReset'> */}
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            {activeStep === 0
              ? <Grid container>
                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >
                    <label>User Types*</label>
                    <OmsSelect
                      placeholder='Select User Types'
                      options={[{ label: 'Student', value: 'Student' }, { label: 'Parent', value: 'Parent' }, { label: 'Teacher', value: 'Teacher' }]}
                      change={this.changehandlerrole}
                      defaultValue={this.state.valueRole}
                      error={this.state.roleError}

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
                      defaultvalue={this.state.valueSmsTypes}
                      change={this.changehandlersmstypes}

                    />
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >
                    <TextArea onChange={val => this.setState({ message: val })} maxLength={320} />
                  </Grid.Column>
                </Grid.Row>
                {(this.state.rolename === 'Student' || this.state.rolename === 'Parent') &&
                <Grid.Row>
                  <React.Fragment>
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
                        disabled={this.role === 'Principal' || this.role === 'FOE'}
                        change={this.changehandlerbranch}
                        defaultValue={this.state.branchValue}
                      />
                    </Grid.Column>
                    <Grid.Column
                      computer={5}
                      mobile={16}
                      tablet={5}
                      className='student-section-inputField'
                    >
                      <label>Grade*</label>
                      <OmsSelect
                        placeholder='Select Grade'
                        options={this.props.grades
                          ? this.props.grades.map(grade => ({
                            value: grade.id,
                            label: grade.grade.grade
                          }))
                          : []}
                        defaultvalue={this.state.gradevalue}
                        change={this.changehandlergrade}

                      />
                    </Grid.Column>
                    <Grid.Column
                      computer={5}
                      mobile={16}
                      tablet={5}
                      className='student-section-inputField'
                    >
                      <label>Section*</label>
                      <OmsSelect
                        placeholder='Select Section'
                        isMulti
                        options={
                          this.props.sections
                            ? this.props.sections.map(section => ({
                              value: section.id,
                              label: section.section.section_name
                            }))
                            : []
                        }
                        value={this.state.sectionValue}
                        change={this.handleSectionChange}
                      />
                    </Grid.Column>
                  </React.Fragment>
                </Grid.Row>}
                <Grid.Row>
                  {this.state.rolename === 'Teacher' && <React.Fragment>
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
                        disabled={this.role === 'Principal' || this.role === 'FOE'}
                        change={this.changehandlerbranch}
                      />
                    </Grid.Column>
                    <Grid.Column
                      computer={5}
                      mobile={16}
                      tablet={5}
                      className='student-section-inputField'
                    >
                      <label>Faculty*</label>
                      <OmsSelect
                        placeholder='Select Faculty'
                        change={this.changehandlerdepartment}
                        defaultValue={this.state.valueDepartment}
                        options={
                          this.props.department
                            ? this.props.department.map(department => ({
                              value: department.id,
                              label: department.department_name
                            }))
                            : []
                        }
                        error={this.state.departmentError}
                        value={this.state.gradevalue}
                        onChange={this.changehandlerdepartment}
                      />
                    </Grid.Column></React.Fragment>}
                </Grid.Row>

                <Grid.Row>
                  <form style={{ display: this.state.rolename === 'Student' || this.state.rolename === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
                    <Grid container className={classes.root} spacing={16}>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >

                        <FormControl component='fieldset' className={classes.formControl}>
                          <th><FormLabel component='legend'>Select Gender</FormLabel></th>
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
                      </Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >

                        <FormControl component='fieldset' className={classes.formControl}>
                          <FormLabel component='legend'>Select Transport</FormLabel>
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
                      </Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={5}
                        className='student-section-inputField'
                      >
                        <FormControl component='fieldset' className={classes.formControl}>
                          <FormLabel component='legend'> Select Category</FormLabel>
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
                      </Grid.Column>
                    </Grid>
                  </form>
                </Grid.Row>
                <Grid.Row>
                  <form style={{ display: this.state.rolename === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
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
                      <Grid.Row>
                        <Grid.Column
                          computer={5}
                          mobile={16}
                          tablet={5}
                          className='student-section-inputField'
                        >
                          <FormControl component='fieldset' className={classes.formControl}>
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
                          </FormControl>
                        </Grid.Column>
                        <Grid.Column
                          computer={5}
                          mobile={16}
                          tablet={5}
                          className='student-section-inputField'
                        >
                          <FormControl component='fieldset' className={classes.formControl}>
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
                          </FormControl></Grid.Column>
                        <Grid.Column
                          computer={5}
                          mobile={16}
                          tablet={5}
                          className='student-section-inputField'
                        >
                          <FormControl component='fieldset' className={classes.formControl}>
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
                        </Grid.Column>
                      </Grid.Row>
                    </FormControl>
                  </form>
                </Grid.Row>

                <React.Fragment>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={this.handleNext}
                    >
                      {activeStep === steps.length + 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </React.Fragment>
              </Grid>
              : ''
            }
            {activeStep === 1
              ? <React.Fragment>
                <Grid.Column
                  computer={4}
                  mobile={16}
                  tablet={5}
                >
                  <InputBase className={classes.input} onChange={(e) => { this.setState({ queryString: e.target.value }) }} placeholder='Search Assessments' />
                  <IconButton className={classes.iconButton} aria-label='Search'>
                    <SearchIcon />
                  </IconButton>
                  <div>
                    <input
                      type='checkbox'
                      checked={this.state.rolename === 'Student'
                        ? this.state.StudentData && this.state.selectedStudents ? (this.state.selectedStudents.size === this.state.StudentData.length) : false
                        : this.state.teacherData ? (this.state.selectedTeachers.size === this.state.teacherData.length) : false
                      }
                      onChange={({ target: { checked } }) => {
                        let { teacherData = [], rolename, StudentData = [] } = this.state
                        var selectedRoleIds
                        var data = []
                        data = rolename === 'Student' ? StudentData : teacherData
                        if (checked) {
                          selectedRoleIds = new Set(data.map(role => role.id))
                        } else {
                          selectedRoleIds = new Set()
                        }
                        this.setState({ [rolename === 'Student' ? 'selectedStudents' : 'selectedTeachers']: selectedRoleIds })
                      }} />
                    <label>select all</label>
                  </div>
                  {this.state.rolename === 'Teacher' &&
                  <ReactTable
                    id='table1'
                    loading={this.state.loading}
                    defaultPageSize={5}
                    data={this.state.teacherData}
                    pages={this.state.pages}
                    manual
                    columns={staffColumns} />}
                  {this.state.rolename === 'Student' | this.state.rolename === 'Parent' &&
                  <ReactTable
                    id='table1'
                    loading={this.state.loading}
                    defaultPageSize={5}
                    data={this.state.StudentData}
                    // data={data}
                    columns={studentColumns} />
                  }
                  <div style={{ padding: '20px' }}>
                    <Button variant='outlined' color='primary' className={classes.button} onClick={this.handleAdd}>
                      <Send />
        Send Message
                    </Button>
                  </div>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={this.handleNext}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </Grid.Column>
              </React.Fragment>
              : ''
            }
          </div>
        )
      }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  grades: state.gradeMap.items,
  roles: state.roles.items,
  user: state.authentication.user,
  section: state.sections.items,
  gradeLoading: state.gradeMap.loading,
  sections: state.sectionMap.items,
  smsTypes: state.smsTypes.items,
  department: state.department.items,
  students: state.student && state.student.success ? state.student.success : []

})
const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: dispatch(apiActions.listSmsTypes()),
  loadDepartment: dispatch(apiActions.listDepartments()),
  listBranches: () => dispatch(apiActions.listBranches()),
  listSections: dispatch(apiActions.listSections()),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  listStudents: (sectionId, pageId = 1) => dispatch(apiActions.listStudents(sectionId, pageId))
})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(SectionWiseSms)))
