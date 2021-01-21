import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import ReactTable from 'react-table'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles, Stepper, Step, StepLabel, Typography } from '@material-ui/core'
// import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import TextArea from './textArea'

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

class ClassWiseSms extends Component {
  constructor () {
    super()
    this.aGradeId = []
    this.state = {
      pointOfContact: false,
      fatherCheckbox: false,
      motherCheckbox: false,
      guardianCheckbox: false,
      activeStep: 0,
      skipped: new Set(),
      contactPoint: [],
      selectedStudents: new Set()
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.changehandlerdepartment = this.changehandlerdepartment.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.getSteps = this.getSteps.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
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

  getSteps () {
    return ['Enter required fields', `Select ${this.state.role}`]

    // if (this.state.gender) {
    //   return ['Enter required fields', 'Select Student']
    // } else {
    //   return ['Enter required fields', 'Select Teacher']
  }

  getStepContent (step) {
    switch (step) {
      case 0:
        return 'Select campaign settings...'
      case 1:
        return 'What is an ad group anyways?'
      case 2:
        return 'This is the bit I really care about!'
      default:
        return 'Unknown step'
    }
  }
  // //////////////////////////////////////stepper//////////////////
  isStepOptional = step => step === 1;

  handleNext = () => {
    const { activeStep, branch, gradevalue, aGradeId, role, smsType } = this.state
    if (activeStep === 0) {
      if (!branch || (role !== 'Student' && !gradevalue) || (role === 'Student' && !aGradeId) || !role || !smsType) {
        this.props.alert.warning('Please enter required fields')
      } else {
        this.setState({
          activeStep: activeStep + 1
        })
      }
    } else {
      this.setState({
        activeStep: activeStep + 1
      })
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  };

  handleSkip = () => {
    const { activeStep } = this.state
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep: state.activeStep + 1,
        skipped
      }
    })
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };

  // isStepSkipped (step) {
  //   return this.state.skipped.has(step)
  // }
  // //////////////////////////////////////stepper -end//////////////////
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
    handleTypeChange = event => {
      this.setState({ type: event.target.value })
      console.log('eventtt', event.target)
    }
    changehandlerdepartment = (e, value) => {
      this.setState({ department: e.value, valueDepartment: e })
    };
    handleAdd () {
      var data = []

      // var that = this

      if (this.state.role === 'Student' && !this.state.aGradeId.length) {
        this.setState({ aGradeId: null })
        this.props.alert.warning('Select atleast one grade')
        return
      }

      if (this.state.role === 'Student' && !this.state.aGradeId.forEach(function (aGradeId) {
        data.push({
          mapping_grade: aGradeId
        })
      })) { console.log(this.state, 'thusss') }
      let { selectedStudents: selStds, selectedTeachers: selTtds = new Set(), message, branch, aGradeId, smsType, role, gender, transport, category, department, contactPoint } = this.state
      console.log(this.state, 'this.styate')
      var formData = new FormData()
      formData.append('message', message)
      formData.append('branch_id', branch)
      formData.append('gender', gender)
      formData.append('using_transport', transport)
      formData.append('stay_category', category)
      formData.append('sms_type', smsType)
      formData.append('user_type', role)
      formData.append('mapping_grade', aGradeId)
      formData.append('department_id', department)
      formData.append('point_of_contact', contactPoint)

      let obj = {
        message,
        branch_id: branch,
        sms_type: smsType,
        user_type: role,
        mapping_grade: aGradeId,
        gender: gender,
        using_transport: transport,
        stay_category: category,
        department_id: department,
        point_of_contact: contactPoint
      }
      if (role === 'Student' || role === 'Parent') {
        obj['student_ids'] = [...selStds]
      } else if (role === 'Teacher') {
        obj['teacher_ids'] = [...selTtds]
      }

      axios
        .post(urls.CreateSms, JSON.stringify(obj), {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            // 'Content-Type': 'multipart/formData'
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
    onSelectAllClick = event => {
      if (event.target.checked) {
        this.setState(state => ({ selected: state.data.map(n => n.id) }))
        return
      }
      this.setState({ selected: [] })
    };

    fetchData = (state, instance) => {
      this.setState({ loading: true })
      if (this.state.role === 'Student' || this.state.role === 'Parent') { this.getStudents(state) } else { this.getTeachers(state) }
    }
    returnGrade = (id) => {
      let x = ' '
      console.log(id, 'iddd')
      console.log(this.props.grades)
      this.props.grades.forEach((v) => {
        console.log(v.grade.id, id)
        if (v.grade.id === id) {
          x = v.grade.grade
        }
      })
      console.log(x, 'xxx')
      return x
    }

    getStudents = (state) => {
      let { state: { category, gender, transport, branch, aGradeId, pageSize = 5, pageNumber = 1 } } = this
      var path = urls.STUDENTFILTER + '?'
      // path += pagenumber ? 'page_number=' + (state.page + 1) : ''
      path += category ? 'stay_category=' + category + '&' : ''
      path += gender ? 'gender=' + gender + '&' : ''
      path += transport ? 'using_transport=' + transport + '&' : ''
      path += branch ? 'branch_id=' + branch + '&' : ''
      path += aGradeId ? 'grade_id=' + (JSON.stringify(aGradeId)).substr(1).slice(0, -1) + '&' : ''
      path += pageSize ? 'page_size=' + state.pageSize + '&' : ''
      path += pageNumber ? 'page_number=' + (state.page + 1) : ''

      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      }).then((res) => {
        console.log(res, 'ressss')
        if (res.status === 200) {
          this.setState({ studentData: res.data.student_data,
            pages: res.data.total_page_count,
            pageNumber: res.data.current_page,
            loading: false })
          console.log(this.state.studentData, 'dataa')
        }
      })
        .catch(e => console.log(e))
    }
    getTeachers = (state) => {
      let { state: { branch, department } } = this
      var path = urls.TEACHERFILTER + '?'
      // path += pagenumber ? 'page_number=' + (state.page + 1) : ''
      path += branch ? 'branch_id=' + branch + '&' : ''
      path += department ? 'department_id=' + department + '&' : ''

      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      }).then((res) => {
        console.log(res, 'ressss')
        if (res.status === 200) {
          this.setState({ teacherData: res.data
          })
          console.log(this.state.teacherData, 'dataa')
        }
      })
        .catch(e => console.log(e))
    }
    render () {
      console.log(this.props.grades)

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
        'Reviewer'
      ]
      console.log(this.state.teacherData, 'datatttt')
      let { selectedStudents: selStds = new Set() } = this.state
      let { selectedTeachers: selTtds = new Set() } = this.state
      console.log(selStds)
      console.log(selTtds)
      // const { onSelectAllClick } = this.props
      const studentColumns = [

        {
          id: 'checkbox',
          Header: () => {
            let { studentData = [] } = this.state
            return <input type='checkbox' onChange={e => {
              let checked = e.target.checked
              let { selectedStudents: selStds = new Set(), studentData = [] } = this.state
              if (checked) {
                selStds = new Set(...[studentData.map(st => (st.id))])
              } else {
                selStds = new Set()
              }
              this.setState({ selectedStudents: selStds })
            }} checked={(selStds.size === studentData.length)} />
          },
          accessor: props => {
            var stId = props.id
            console.log(stId)
            return (<input type='checkbox' onChange={e => {
              let { selectedStudents: selStds = new Set() } = this.state
              let checked = e.target.checked
              if (checked) {
                selStds.add(stId)
              } else {
                selStds.delete(stId)
              }
              this.setState({ selectedStudents: selStds })
              // if (selStds.has(stId)) {
              //   selStds.delete(stId)
              // } else {
              //   selStds.add(stId)
              // }
            }} checked={selStds.has(stId)} />)
          }
        },
        {
          Header: 'Student Name',
          accessor: 'name'
        },
        {
          Header: 'ERP',
          accessor: 'erp'
        },
        {
          Header: 'Grade',
          accessor: 'grade',
          Cell: props => {
            console.log(props)
            return <span className='number'>{this.returnGrade(props.row.grade) ? this.returnGrade(props.row.grade) : 'NIL'}</span>
          }
        },
        {
          Header: 'Category',
          accessor: 'stay_category'
        }

      ]
      const teacherColumns = [
        {
          id: 'checkbox',
          Header: () => {
            let { teacherData = [] } = this.state
            return <input type='checkbox' onChange={e => {
              let checked = e.target.checked

              let { teacherData = [] } = this.state
              if (checked) {
                selTtds = new Set(...[teacherData.map(st => (st.id))])
              } else {
                selTtds = new Set()
              }

              this.setState({ selectedTeachers: selTtds })
            }} checked={(selTtds.size === teacherData.length)} />
          },
          accessor: props => {
            var ttId = props.id
            console.log(ttId)
            return (<input type='checkbox' onChange={e => {
              let { selectedTeachers: selTtds = new Set() } = this.state
              let checked = e.target.checked
              if (checked) {
                selTtds.add(ttId)
              } else {
                selTtds.delete(ttId)
              }

              this.setState({ selectedTeachers: selTtds })
              // if (selStds.has(stId)) {
              //   selStds.delete(stId)
              // } else {
              //   selStds.add(stId)
              // }
            }} checked={selTtds.has(ttId)} />)
          }
        },
        {
          Header: 'Teacher Name',
          accessor: 'name'
        },
        {
          Header: 'ERP',
          accessor: 'erp_code'
        },
        {
          Header: 'Designation',
          accessor: 'designation.designation_name'
        }
      ]

      const { classes } = this.props
      const steps = this.getSteps()
      const { activeStep } = this.state
      console.log('sms tyes', this.props.smsTypes)
      let { totalPages } = this.state
      console.log(totalPages)
      return (
        <React.Fragment>
          {/* stepper start */}
          <div className={classes.root}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                // if (this.isStepOptional(index)) {
                //   labelProps.optional = <Typography variant='caption'>Optional</Typography>
                // }
                // if (this.isStepSkipped(index)) {
                //   props.completed = false
                // }
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>

          </div>
          {/* stepper end */}
          {activeStep === 0
            ? <div>
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
                  <Grid.Column style={{ display: this.state.role === 'Teacher' ? 'none' : 'block' }} noValidate autoComplete='off'
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >
                    {/* <form style={{ display: this.state.role === 'Teacher' ? 'none' : 'block' }} className={classes.container} noValidate autoComplete='off'> */}
                    {/* <label>Grade*</label> */}
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

                <Grid.Column

                  computer={5}
                  mobile={16}
                  tablet={5}
                  className='student-section-inputField'
                >
                  <form style={{ display: this.state.role === 'Teacher' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>

                    <label>Select Department</label>
                    <OmsSelect
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
                    />
                  </form>
                </Grid.Column>

                <form style={{ display: this.state.role === 'Student' || this.state.role === 'Parent' ? 'block' : 'none' }} className={classes.container} noValidate autoComplete='off'>
                  <Grid container className={classes.root} spacing={16}>

                    <FormControl component='fieldset' className={classes.formControl}>

                      <th><FormLabel>Select Gender</FormLabel></th>
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
                      <th><FormLabel>Select Transport</FormLabel></th>
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
                      <th><FormLabel> Select Category</FormLabel></th>
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
              </Grid>
            </div>

            : null}
          <div>
            {activeStep === steps.length ? (
              <div>
                {this.state.loading ? <Typography className={classes.instructions}>
                  Loading....
                </Typography> : <Button
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>}
              </div>
            ) : (
              <div>
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
                    className={classes.button}
                    onClick={this.handleNext}
                  >
                    {activeStep === steps.length - 1 ? 'Next' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {activeStep === 1
            ? <div>

              {this.state.isSeletedStudents ? (this.state.role === 'Student' || this.state.role === 'Parent' ? <ReactTable
                manual
                onFetchData={this.fetchData}
                loading={this.state.loading}
                pages={this.state.pages}
                id='table1'
                defaultPageSize={5}
                showPageSizeOptions
                data={this.state.studentData ? this.state.studentData : []}
                // loading={loading}
                onSelectAllClick={this.onSelectAllClick}
                columns={studentColumns} />

                : <ReactTable
                  manual
                  onFetchData={this.fetchData}
                  defaultPageSize={false}
                  showPageSizeOptions
                  data={this.state.teacherData ? this.state.teacherData : []}
                  // loading={loading}
                  columns={teacherColumns} />
              ) : null}

              <form className={classes.container} noValidate autoComplete='off'>

                <FormControl component='fieldset' className={classes.formControl}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.checkbox}
                        onChange={() => {
                          // this.setState(({ isSeletedStudents }) => ({ isSeletedStudents: !isSeletedStudents }), e => {
                          //   if (this.state.isSeletedStudents) {
                          //     this.getStudents()
                          //   }
                          // })
                          this.setState(({ isSeletedStudents }) => ({ isSeletedStudents: !isSeletedStudents }))
                        }}
                        value='checkedB'
                        color='primary'

                      />
                    }
                    label={this.state.role === 'Student' || this.state.role === 'Parent' ? 'For Selected Students Only' : 'For Selected Teachers' + ' Only'}
                  />
                </FormControl>
              </form>

              <TextArea onChange={val => this.setState({ message: val })} maxLength={320} />

              <div style={{ padding: '20px' }}>
                <Button variant='outlined' color='primary' className={classes.button} onClick={this.handleAdd}>
        Send Message
                </Button>
              </div>

            </div>
            : null}
        </React.Fragment>

      )
    }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  grades: state.gradeMap.items,
  roles: state.roles.items,
  user: state.authentication.user,
  smsTypes: state.smsTypes.items,
  department: state.department.items

})
const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: dispatch(apiActions.listSmsTypes()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  loadDepartment: dispatch(apiActions.listDepartments())

})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(ClassWiseSms)))
