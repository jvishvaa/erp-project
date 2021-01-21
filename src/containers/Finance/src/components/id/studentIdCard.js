/* eslint-disable no-debugger */
import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Button, Stepper, Step, StepLabel } from '@material-ui/core/'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import ReactTable from 'react-table'
import { OmsSelect, InternalPageStatus } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import IdCardPreview from './studentIdCardPreview'

const keeperOption = [
  { label: 'Student', value: 'student' },
  { label: 'Mother', value: 'mother' },
  { label: 'Father', value: 'father' },
  { label: 'Guardian', value: 'guardian' }
]

function getSteps () {
  return ['Enter required fields', 'Select students', 'Preview']
}

class StudentIdCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      studentArr: [],
      allCheck: false,
      activeStep: 0,
      selectedStudent: []
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    // this.handleClick = this.handleClick.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.changehandlergrade = this.changehandlergrade.bind(this)
    this.changehandlersection = this.changehandlersection.bind(this)
    this.handleSelectAll = this.handleSelectAll.bind(this)
    this.getIdCardData = this.getIdCardData.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.students) {
    }
    if (Array.isArray(nextProps.students) && nextProps.students.length > 0 && this.props.students.length === 0) {
      this.filterTableData(nextProps.students)
      return true
    }
    return true
  }

  componentDidMount () {
    this.props.loadBranches()
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    if (this.role === 'Principal' || this.role === 'AcademicCoordinator') {
      this.setState({
        aBranchId: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id })
    }
  }

  changehandlerbranch = (e) => {
    this.setState({
      branch: e.value,
      branchValue: e,
      gradevalue: [],
      sectionvalue: [],
      studentvalue: [],
      selectedStudent: []
    })
    this.props.gradeMapBranch(e.value)
  }

  changehandlergrade = (e) => {
    this.setState({
      grade: e.value,
      gradevalue: e,
      sectionvalue: [],
      studentvalue: [],
      selectedStudent: []
    })
    this.props.sectionMap(e.value)
  }

  changehandlersection = (e) => {
    this.setState({
      sectionMapping: e.value,
      sectionvalue: e,
      studentValue: [],
      selectedStudent: []
    })
    this.props.listStudents(e.value)
  }

  changehandlestudent = event => {
    let aStudent = []
    event.forEach(student => {
      aStudent.push(student.value)
    })
    this.setState({ studentValue: aStudent })
  }

  getIdCardData () {
    let { sectionMapping, keeper, selectedStudent, allCheck } = this.state
    let url = urls.StudentIdcard + '?keeper=' + keeper
    if (allCheck) {
      url = url + '&section_mapping=' + sectionMapping
    } else {
      url = url + '&student_ids=' + JSON.stringify(selectedStudent)
    }
    this.setState({ isStudnetDataForIdLoading: true })
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((response) => {
        this.setState({ studnetDataForId: response.data, isStudnetDataForIdLoading: false })
      }).catch(e => {
        this.setState({ isStudnetDataForIdLoading: false, studnetDataForId: null })
      })
  }

  // handleClick () {
  //   const { studnetDataForId, keeper } = this.state
  //   const title = ''
  //   const footer = (
  //     <React.Fragment>
  //     </React.Fragment>
  //   )
  //   const header = (
  //     <React.Fragment>
  //     </React.Fragment>
  //   )
  //   const component = (
  //     studnetDataForId && studnetDataForId.students && studnetDataForId.students.length > 0 &&
  //     studnetDataForId.students.map(student => {
  //       return (
  //         <div style={{ pageBreakAfter: 'always' }}>
  //           {/* <Template student={student} data={studnetDataForId} keeper={keeper} /> */}
  //         </div>
  //       )
  //     })
  //   )
  //   // PdfGenerator({ title, header, component, footer })
  //   console.log({ title, header, component, footer, keeper })
  // }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }

  handleTick (e, id) {
    let { selectedStudent, studentArr } = this.state
    if (e.target.checked) {
      this.filterTableData(this.props.students, false, [id, ...selectedStudent])
      selectedStudent = [...selectedStudent, id]
    } else {
      let index = selectedStudent.indexOf(id)
      selectedStudent.splice(index, 1)
      this.filterTableData(this.props.students, false, [...selectedStudent])
    }
    if (selectedStudent.length === 0) {
      this.setState({ allCheck: false })
    }
    // logic for making obj.checked = false
    this.setState({ selectedStudent, studentArr })
  }

  handleNext = () => {
    const { branch, grade, sectionMapping, keeper, selectedStudent, activeStep } = this.state
    if (activeStep === 0) {
      if (!branch || !grade || !sectionMapping || !keeper) {
        this.props.alert.error('Please enter required fields')
        return
      }
      this.setState({ activeStep: activeStep + 1 })
    } else if (activeStep === 1) {
      if (selectedStudent.length === 0) {
        this.props.alert.error('Minimum one student must be selected')
        return
      }
      this.setState({ activeStep: activeStep + 1 })
      this.getIdCardData()
    } else if (activeStep === 2) {
      // this.handleClick()

    }
  }

  handleSelectAll (event) {
    let aSelectedStudent = []
    if (event.target.checked) {
      aSelectedStudent = [...this.props.students.map(student => student.id)]
      this.filterTableData(this.props.students, true)
    } else {
      this.filterTableData(this.props.students, false)
    }
    this.setState({ selectedStudent: aSelectedStudent, allCheck: event.target.checked })
  }
  getIdCardPreview = () => {
    let { studnetDataForId, keeper, isStudnetDataForIdLoading } = this.state
    if (isStudnetDataForIdLoading) {
      return <InternalPageStatus label={<p style={{ textAlign: 'center' }}>Loading...<br /><small>This may take few minutes to load</small></p>} />
    } else if (studnetDataForId === null) {
      return <InternalPageStatus label='Failed to fetch data' loader={false} />
    } else if (studnetDataForId && isStudnetDataForIdLoading === false) {
      return (<IdCardPreview
        studnetDataForId={studnetDataForId}
        getIdCardData={this.getIdCardData}
        keeper={keeper}
        alert={this.props.alert}
      />)
    }
  }
  render () {
    const { activeStep, selectedStudent, branchValue, gradevalue,
      sectionvalue, keeperValue } = this.state
    const columns = [
      {
        id: 'checkbox',
        Header: () => { return 'Selected ' + (selectedStudent ? selectedStudent.length : 0) },
        accessor: props => {
          return (<input
            type='checkbox'
            checked={props.checked}
            onChange={(e) => { this.handleTick(e, props.id) }}
          />)
        }
      },
      {
        Header: 'Student Name',
        accessor: 'name'
      },
      {
        Header: 'Student Enrollment',
        accessor: 'erp'
      }
    ]
    const steps = getSteps()
    return (
      <div>
        <Stepper activeStep={activeStep}>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === 0
          ? <Grid container>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={5}
              >
                <OmsSelect
                  label='Branch'
                  name='branch'
                  placeholder='Select Branch'
                  options={
                    this.props.branches
                      ? this.props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : []
                  }
                  // { console.log(branchValue), 'branch valueeeee' }
                  defaultValue={branchValue}
                  disabled={this.role === 'Principal' || this.role === 'AcademicCoordinator'}
                  change={this.changehandlerbranch}
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={5}
              >
                <OmsSelect
                  label='Grade'
                  name='grade'
                  placeholder='Grade'
                  options={this.props.grades
                    ? this.props.grades.map(grade => ({
                      value: grade.id,
                      label: grade.grade.grade
                    }))
                    : []}
                  defaultValue={gradevalue}
                  change={this.changehandlergrade}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={5}
              >
                <OmsSelect
                  label='Section'
                  name='section'
                  placeholder='Section'
                  options={this.props.sections
                    ? this.props.sections.map(section => ({
                      value: section.id,
                      label: section.section.section_name
                    }))
                    : []}
                  defaultValue={sectionvalue}
                  change={this.changehandlersection}
                />
              </Grid.Column>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={5}
              >
                <OmsSelect
                  label='ID Card Keeper'
                  name='designtype'
                  placeholder='Select Keeper'
                  change={e => this.setState({ keeper: e.value, keeperValue: e })}
                  options={keeperOption}
                  defaultValue={keeperValue}
                />
              </Grid.Column>
            </Grid.Row>
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
              <div>
                &nbsp;<input type='checkbox' checked={this.state.allCheck} onChange={e => this.handleSelectAll(e)} />
                &nbsp;<label>Select all</label>
              </div>
              <ReactTable
                id='table1'
                loading={this.props.isStudentDataLoading}
                defaultPageSize={5}
                data={this.state.finalData}
                columns={columns}
              />
            </Grid.Column>
          </React.Fragment>
          : ''
        }
        {activeStep === 2
          ? this.getIdCardPreview()
          : ''
        }
        <React.Fragment>
          <Button
            disabled={activeStep === 0}
            onClick={this.handleBack}
          >
            Back
          </Button>
          {/* <Button
            variant='contained'
            color='primary'
            onClick={this.handleNext}
            disabled={activeStep === steps.length - 1
              ? (!(studnetDataForId && studnetDataForId.students && studnetDataForId.students.length > 0) || isStudnetDataForIdLoading)
              : false
            }
          >
            {activeStep === steps.length - 1 ? 'Download All' : 'Next'}
          </Button> */}
          {activeStep === steps.length - 1 ? '' : <Button
            variant='contained'
            color='primary'
            onClick={this.handleNext}
            // disabled={activeStep === steps.length - 1
            //   ? (!(studnetDataForId && studnetDataForId.students && studnetDataForId.students.length > 0) || isStudnetDataForIdLoading)
            //   : false
            // }
          >
            Next
          </Button> }
        </React.Fragment>
      </div>
    )
  }

  filterTableData = (students, checkedAll, selected = []) => {
    let data = students.length
      ? students.map(st => ({
        name: st.name,
        id: st.id,
        erp: st.erp,
        checked: checkedAll || selected.includes(st.id)
      }))
      : []
    let { queryString } = this.state
    if (queryString && queryString.length) {
      return this.setState({ finalData: data.filter(student => student.name.includes(queryString)) })
    } else {
      return this.setState({ finalData: data })
    }
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  students: state.student && state.student.success ? state.student.success : [],
  isStudentDataLoading: state.student && state.student.loading ? state.student.loading : false
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadMapId => dispatch(apiActions.getSectionMapping(acadMapId)),
  listStudents: (sectionId, pageId = 1) => dispatch(apiActions.listStudents(sectionId, 'True', pageId))
})

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StudentIdCard)))
