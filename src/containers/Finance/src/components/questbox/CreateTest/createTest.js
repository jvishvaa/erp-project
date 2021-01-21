import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'

import SearchIcon from '@material-ui/icons/Search'
import {
  Grid,
  Button, Stepper, Step, StepLabel, withStyles, Typography, ListItem, List
} from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import PSelect from '../../../_components/pselect'
import Exporter from '../../../_components/pselect/exporter'
import { urls } from '../../../urls'
import { Toolbar } from '../../../ui'
import { apiActions } from '../../../_actions'
import Card from './card'
import { COMBINATIONS } from './configCreateTest'
import { COMBINATION } from './globalSelectConfig'

import GSelect from '../../../_components/globalselector'

const update = require('immutability-helper')

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  drawerPaper: {
    width: '500px'
  }
})
function getSteps () {
  return ['Enter required fields', 'Select assessments', 'Assign To', 'Select sequence']
}
// const teacherAllowedRoles = [
//   { label: 'Student', value: '13' }
// ]
// const plannerAllowedRoles = [
//   { label: 'Student', value: '3' },
//   { label: 'Teacher', value: '1' }

// ]
// const subjectHeadAllowedRoles = [
//   { label: 'Planner', value: '13' },
//   { label: 'Teacher', value: '1' }
// ]
const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  } })(MuiExpansionPanel)
const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiExpansionPanelDetails)
const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  }
})(MuiExpansionPanelSummary)

let continueStep
class CreateTest extends Component {
  constructor () {
    super()
    this.state = {
      selectedAssessments: [],
      assessmentData: [],
      allowedRoles: [],
      selectorData: {},
      activeStep: 0,
      skipped: new Set(),
      loading: true,
      page: 0,
      rowsPerPage: 5,
      sideDrawer: false,
      allowRoles: []

    }

    this.handleCreateTest = this.handleCreateTest.bind(this)
    this.getAssessments = this.getAssessments.bind(this)
    this.handleTick = this.handleTick.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.filterTableData = this.filterTableData.bind(this)
  }
  changehandlerbranch = (e) => {
    this.props.gradeMapBranch(e.value)
    this.setState({ branchId: e.value, selectedGraade: e }, () => {
      this.getAssessments()
    })
  };

  changehandlergrade = (e) => {
    this.props.sectionMap(e.value)
    this.setState({ gradeId: e.gradeId, selectedGrade: e }, () => {
      this.getAssessments()
    })
  };

  changehandlersection = (e) => {
    this.setState({ sectionId: e.sectionId, selectedSection: e }, () => {
      this.getAssessments()
    })
  }
  getPath = (path, reactTableState = {}) => {
    let { page = 0, pageSize = 5 } = reactTableState
    // let { branchId, sectionId, gradeId } = this.state
    let { selectorData: { branch_id: branchId, grade_id: gradeId, section_id: sectionId }
    // , testType
    } = this.state
    let queryParams = new Map([
      ['page', (page + 1)],
      ['page_size', pageSize],
      ['branch_id', branchId],
      ['grade_id', gradeId],
      ['section_id', sectionId]
      // ['assessment_type', testType.value]
    ])
    path += '?'
    queryParams.forEach((val, key) => {
      if (val) { path += key + '=' + val + '&' }
    })
    this.setState({ pageNumber: page, pageSize })
    return path
  }
  getAssessments (reactTableState) {
    let urlPath = this.getPath(urls.Assessment, reactTableState)
    this.setState({ loading: true })
    axios
      .get(urlPath, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        let data = []
        console.clear()
        if (res.status === 200) {
          if (Array.isArray(res.data.assessments)) {
            res.data.assessments.forEach((val) => {
              data.push({
                checked: false,
                // uniqueTestId: val.unique_test_id,
                id: val.id ? val.id : '',
                assessment_name: val.name_assessment ? val.name_assessment : '',
                subject: val.subject ? val.subject : '',
                created_by: val.created_by ? val.created_by : '',
                grade: val.grade ? val.grade : ''
              })
            })
            this.setState({ assessmentData: data, loading: false, pages: res.data.total_page_count, totalAssessments: data.total_assessment_count })
          } else if (typeof (res.data) === 'string') {
            this.props.alert.error(res.data)
            this.setState({ loading: false })
          }
        } else {
          this.setState({ loading: false })
          this.props.alert.error('stts code err')
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log('assessment data', error)
        this.props.alert.error('Something went wrong, please try again')
      })
  }
  handleTick (e, id) {
    let { selectedAssessments, assessmentData } = this.state
    if (e.target.checked) {
      selectedAssessments.push(id)
    } else {
      let index = selectedAssessments.indexOf(id)
      selectedAssessments.splice(index, 1)
    }
    assessmentData.forEach(obj => (obj.checked = false))
    let selectedASSFullObjs = []
    assessmentData.map(obj => {
      selectedAssessments.forEach(item => {
        if (item === obj.id) {
          selectedASSFullObjs.push(obj)
          obj.checked = true
        }
      })
    })
    this.setState({ selectedAssessments, selectedASSFullObjs, assessmentData })
  }

  handleCreateTest () {
    let exporter = new Exporter()

    this.role = this.userProfile.personal_info.role
    let { testName, testType, allowedRoles: roles, selectedASSFullObjs, startDate, endDate } = this.state
    this.user_id = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    let selectedAssessments = selectedASSFullObjs && selectedASSFullObjs.map(item => item.id)

    let allowedRoles = roles.map(obj => obj.value)
    let payLoad = {}

    payLoad = { test_name: testName, test_type: testType.value, allowed_roles: allowedRoles, assessmentId: selectedAssessments, start_date: startDate, end_date: endDate, sectionmapping_id: this.state.usePowerSelector ? exporter.getSections() : this.state.section_mapping }

    this.setState({ loading: true })

    axios.post(urls.OnlineTest, JSON.stringify(payLoad), {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })

      .then(res => {
        if (res.status === 201) {
          this.props.alert.success('Test created')
          this.setState({ selectedAssessments: [],
            allowedRoles: [],
            activeStep: 0,
            testName: null,
            testType: null,
            skipped: new Set() })
        } else {
          this.props.alert.error('stts code err')
          this.setState({ activeStep: 2, loading: false })
        }
      })

      .catch(e => { this.props.alert.error('Something went wrong please try again'); this.setState({ activeStep: 2, loading: false }) })
  }
  handleNext = () => {
    this.setState({ sectionError: false,
      gradeError: false,
      branchError: false })
    const { activeStep, testName, valueBranch, section, mappingGrade, testType, allowedRoles, selectedAssessments, startDate, endDate } = this.state
    continueStep = allowedRoles.filter(item => item.label === 'Student')

    if (activeStep === 0) {
      if (!testName || !testType || !allowedRoles.length || !startDate || !endDate) {
        this.props.alert.warning('Please enter required fields')
        return
      }
    } else if (activeStep === 1) {
      if (!selectedAssessments.length) {
        this.props.alert.warning('Minimum one assessment must be selected')
        return
      }
    } else if (activeStep === 2 && continueStep.length > 0) {
      if (!valueBranch && !this.state.usePowerSelector) {
        this.setState({ branchError: true })
        return
      }
      if (!mappingGrade && !this.state.usePowerSelector) {
        this.setState({ gradeError: true })
        return
      }
      if (!section && !this.state.usePowerSelector) {
        this.setState({ sectionError: true })
        return
      }
    }
    this.setState({
      activeStep: activeStep + 1
    })

    let steps = getSteps()

    if (activeStep === (steps.length - 1)) {
      this.handleCreateTest()
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  };
  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };
  getToolBar = () => {
    let { classes } = this.props
    return (
      <Toolbar
        floatRight={<Grid container>
          <InputBase className={classes.input} onChange={(e) => { this.setState({ queryString: e.target.value }) }} placeholder='Search Assessments' />
          <IconButton className={classes.iconButton} aria-label='Search'>
            <SearchIcon />
          </IconButton>
        </Grid>}
      >
        <Grid container>
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          </Grid>

        </Grid>
      </Toolbar>
    )
  }
  onChangeForGettingAssessments = (data, ...others) => {
    // getting names for branch,grade and section
    others && others.map(name => {
      return ({
        branchData: name[0] && name[0].filter(i => {
          if (i.branch_id.toString() === data.branch_id) {
            this.setState({ branch_name: i.branch_name })
            return i.branch_name
          }
        }),
        gradeData: name[1] && name[1].filter(i => {
          if (i.acad_branch_grade_mapping_id.toString() === data.acad_branch_grade_mapping_id) {
            this.setState({ grade_name: i.grade_name })
            return i.grade_name
          }
        }),
        sectionData: name[2] && name[2].filter(i => {
          if (i.section_mapping_id.toString() === data.section_mapping_id) {
            this.setState({ section_name: i.section_name })
            return i.section_name
          }
        })

      })
    })
    this.setState({ valueBranch: data.branch_id, grade: data.grade_id })

    if (data.acad_branch_grade_mapping_id) {
      this.setState({ mappingGrade: data.acad_branch_grade_mapping_id })
    }
    const sectionMappindIds = []
    if (data.section_mapping_id) {
      let res = data.section_mapping_id.split(',')
      res.forEach(curr => {
        sectionMappindIds.push(Number(curr))
      })
      this.setState({ section_mapping: sectionMappindIds, section: sectionMappindIds })
    }
  }

  onChange = (data, ...mappingData) => {
    // getting names for branch,grade and section
    mappingData && mappingData.map(name => {
      return ({
        branchData: name[0] && name[0].filter(i => {
          if (i.branch_id.toString() === data.branch_id) {
            this.setState({ tbranch_name: i.branch_name })
            return i.branch_name
          }
        }),
        gradeData: name[1] && name[1].filter(i => {
          if (i.grade_id.toString() === data.grade_id) {
            this.setState({ tgrade_name: i.grade_name })
            return i.grade_name
          }
        }),
        sectionData: name[2] && name[2].filter(i => {
          if (i.section_id.toString() === data.section_id) {
            this.setState({ tsection_name: i.section_name })
            return i.section_name
          }
        }) })
    })
    let { selectorData } = this.state
    console.log(selectorData, data, 'data')
    this.setState({ selectorData: data }, () => {
      this.getAssessments()
    })
  }

  openDrawer=() => {
    this.setState({
      sideDrawer: true })
  }

  viewData=() => {
    let { allowedRoles: roles } = this.state
    let allowedRoles = roles.map(obj => obj.label)

    // if student,then show section mapping in view summary
    if (!allowedRoles.includes('Student')) {
      return (<React.Fragment>
        <h1 style={{ color: '#5d1049', textAlign: 'center' }}>Summary</h1>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}>Entered Fields</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ListItem > <h5>TestName:</h5>&nbsp;{this.state.testName ? this.state.testName : ''}</ListItem>
              <ListItem > <h5>TestType:</h5> &nbsp; {this.state.testType && this.state.testType.label ? this.state.testType.label : ''}</ListItem>
              <ListItem> <h5>Start Date:</h5>&nbsp; {this.state.startDate ? this.state.startDate : ''}</ListItem>
              <ListItem> <h5>End Date:</h5>  &nbsp; {this.state.endDate ? this.state.endDate : ''}</ListItem>
              <List> <h5 style={{ 'padding-top': 'inherit', 'padding-left': '20px' }}>Allowed Roles:</h5>&nbsp;{this.state.allowedRoles && this.state.allowedRoles.map((role, index) => (
                <ListItem>{index + 1}.&nbsp;{role.label}</ListItem>))}</List>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}>Selected Assessments</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ListItem><h5>Branch Name:</h5>&nbsp;{this.state.tbranch_name ? this.state.tbranch_name : ''}</ListItem>
              <ListItem><h5>Grade Name:</h5>&nbsp;{this.state.tgrade_name ? this.state.tgrade_name : ''}</ListItem>
              <ListItem><h5>Section Name:</h5>&nbsp;{this.state.tsection_name ? this.state.tsection_name : ''}</ListItem>

              <List> <h5 style={{ 'padding-top': 'inherit', 'padding-left': '20px' }}>Assessment Names:</h5>{this.state.selectedASSFullObjs && this.state.selectedASSFullObjs.map((item, index) => (
                <ListItem>{index + 1}.&nbsp;{item.assessment_name}</ListItem>))}</List>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </React.Fragment>)
    } else {
      return (<React.Fragment>
        <h1 style={{ color: '#5d1049', textAlign: 'center' }}>Summary</h1>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}>Entered Fields</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ListItem > <h5>TestName:</h5>&nbsp;{this.state.testName ? this.state.testName : ''}</ListItem>
              <ListItem > <h5>TestType:</h5> &nbsp; {this.state.testType && this.state.testType.label ? this.state.testType.label : ''}</ListItem>
              <ListItem> <h5>Start Date:</h5>&nbsp; {this.state.startDate ? this.state.startDate : ''}</ListItem>
              <ListItem> <h5>End Date:</h5>  &nbsp; {this.state.endDate ? this.state.endDate : ''}</ListItem>
              <List> <h5 style={{ 'padding-top': 'inherit', 'padding-left': '20px' }}>Allowed Roles:</h5>&nbsp;{this.state.allowedRoles && this.state.allowedRoles.map((role, index) => (
                <ListItem>{index + 1}.&nbsp;{role.label}</ListItem>))}</List>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}>Selected Assessments</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ListItem><h5>Branch Name:</h5>&nbsp;{this.state.tbranch_name ? this.state.tbranch_name : ''}</ListItem>
              <ListItem><h5>Grade Name:</h5>&nbsp;{this.state.tgrade_name ? this.state.tgrade_name : ''}</ListItem>
              <ListItem><h5>Section Name:</h5>&nbsp;{this.state.tsection_name ? this.state.tsection_name : ''}</ListItem>

              <List> <h5 style={{ 'padding-top': 'inherit', 'padding-left': '20px' }}>Assessment Names:</h5>{this.state.selectedASSFullObjs && this.state.selectedASSFullObjs.map((item, index) => (
                <ListItem>{index + 1}.&nbsp;{item.assessment_name}</ListItem>))}</List>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}>Assigned To</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ListItem><h5>Branch Name:</h5>&nbsp;{this.state.branch_name ? this.state.branch_name : ''}</ListItem>
              <ListItem><h5>Grade Name:</h5>&nbsp;{this.state.grade_name ? this.state.grade_name : ''}</ListItem>
              <ListItem><h5>Section Name:</h5>&nbsp;{this.state.section_name ? this.state.section_name : ''}</ListItem>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary aria-controls='panel1d-content' id='panel1d-header'>
            <Typography style={{ color: '#5d1049' }}> Assigned Mapped data</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <List> {this.props.filter && this.props.filter.data &&
            Object.values(this.props.filter.data.itemData).map((value, index) => (
              <div> <ListItem >{index + 1}. <strong style={{ color: '#5d1049' }}>Branch:  &nbsp;</strong>{value.branch}, &nbsp;<strong style={{ color: '#5d1049' }}>Grade: &nbsp;</strong> {value.grade} , &nbsp; <strong style={{ color: '#5d1049' }}>Section: &nbsp;</strong>:{value.name}</ListItem>
              </div>

            ))}</List>

            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </React.Fragment>)
    }
  }
  getCanTakeTestRoles= () => {
    let allowedRoles = []
    let loggedUserRole = this.role
    let { roles: rolesFromProps = [] } = this.props
    const rolesAndAllowedRoles = {
      'Planner': ['Teacher', 'Student'],
      'Subjecthead': ['Teacher', 'Planner', 'Student'],
      'Teacher': ['Student'],
      'for_all_other_logged_in_roles': ['Teacher', 'Student', 'Subjecthead', 'Planner']
    }
    const loggedUserAllowedRoles = rolesAndAllowedRoles[loggedUserRole] || rolesAndAllowedRoles['for_all_other_logged_in_roles']
    allowedRoles = rolesFromProps.filter(role => loggedUserAllowedRoles.includes(role.role_name)).map(role => ({ value: role.id, label: role.role_name }))
    return allowedRoles
  }
  render () {
    let { pages = (-1) } = this.state
    this.role = this.userProfile.personal_info.role

    const columns = [
      {
        id: 'srNo',
        Header: 'sr no',
        Cell: row => {
          let { pageNumber, pageSize } = this.state
          return (pageSize * pageNumber + (row.index + 1))
        },
        width: 40
      },
      {
        id: 'checkbox',
        Header: () => { return 'Selected ' + (this.state.selectedAssessments ? this.state.selectedAssessments.length : 0) },
        accessor: props => {
          return (<input type='checkbox' checked={props.checked} onChange={(e) => { console.log(props); this.handleTick(e, props.id) }} />)
        }
      },
      {
        Header: 'Assessment Name',
        accessor: 'assessment_name'
      },
      {
        Header: 'Grade',
        accessor: 'grade'
      },
      {
        Header: 'Subject',
        accessor: 'subject'
      }, {
        Header: 'Created by',
        accessor: 'created_by'
      }]
    const { classes } = this.props

    const steps = getSteps()
    const { activeStep } = this.state
    const { gradeError, sectionError, branchError } = this.state

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {}
              const labelProps = {}
              console.log(label, 'getting steps values')

              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
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

                    {activeStep === steps.length - 1 ? 'Create Test' : activeStep === steps.length - 2 && continueStep.length < 1 ? 'Skip' : 'Next'}

                  </Button>
                  {activeStep === steps.length - 1
                    ? <Button onClick={this.openDrawer}>View summary</Button>
                    : ''}

                  <Drawer
                    anchor='right'
                    classes={{
                      paper: classes.drawerPaper
                    }}
                    open={this.state.sideDrawer}
                    onClose={() => { this.setState({ sideDrawer: false }) }}
                    onOpen={() => { this.setState({ sideDrawer: true }) }}
                  >

                    {this.viewData()}
                  </Drawer>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '2%' }} >
          {this.state.activeStep === 0
            ? <Grid container spacing={1} >
              <Grid item xs>
                <label>Test Name:</label>
                <input
                  value={this.state.testName ? this.state.testName : ''}
                  type='text'
                  placeholder='Enter Test Name'
                  className='form-control'
                  name='testName'
                  onChange={(e) => { this.setState({ testName: e.target.value }) }}
                />
              </Grid>
              <Grid item xs>
                <label>Test of Type:</label>
                <Select
                  value={this.state.testType ? this.state.testType : {}}
                  onChange={(e) => { this.setState({ testType: e }) }}
                  placeholder={'Select tag'}
                  options={[
                    { label: 'Practice', value: 'Practice' },
                    { label: 'Normal', value: 'Normal' }
                  ]}
                />
              </Grid>
              <Grid item xs>
                <label>Allowed roles:</label>
                <Select
                  value={this.state.allowedRoles}
                  placeholder={'Select Allowed Roles'}
                  options={this.getCanTakeTestRoles()}
                  onChange={(e) => { this.setState({ allowedRoles: e }) }}
                  isMulti
                />

              </Grid>
              <Grid item xs style={{ marginTop: 2 }}>
                <label>Start date:</label><br />
                <input
                  type='date'
                  min={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()} value={this.state.startDate}
                  onChange={e => this.setState({ startDate: e.target.value })} />
              </Grid>
              <Grid item xs style={{ marginTop: 2, marginRight: 400 }}>
                <label>End date:</label><br />
                <input type='date' value={this.state.endDate} min={this.state.startDate} disabled={!this.state.startDate} onChange={e => this.setState({ endDate: e.target.value })} />
              </Grid>
            </Grid> : ''}
          {this.state.activeStep === 1
            ? <React.Fragment>
              {this.getToolBar()}
              <ReactTable
                id='table1'
                onFetchData={reactTableState => { this.getAssessments(reactTableState) }}
                defaultPageSize={5}
                loading={this.state.loading}
                pages={pages}
                manual
                showPageSizeOptions
                data={this.filterTableData()}
                columns={columns} />
            </React.Fragment>
            : ''}
          {this.state.activeStep === 2 && continueStep.length > 0 ? <React.Fragment>
            <Grid style={{ padding: '0px' }}>
              {/* <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
              > */}

              {branchError && (
                <Typography style={{ color: 'red' }}>Select Branch</Typography>
              )}
              {/* </Grid.Column> */}

              {/* <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              > */}

              {gradeError && (
                <Typography style={{ color: 'red' }}>Select grade</Typography>
              )}
              {/* </Grid.Column> */}
              {/*
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              > */}

              {sectionError && (
                <Typography style={{ color: 'red' }}>Select section</Typography>
              )}
              {/* </Grid.Column> */}
            </Grid>
            <Grid>
              <GSelect config={COMBINATION} variant={'selector'} onChange={this.onChangeForGettingAssessments} />
            </Grid>
            <Grid style={{ justifyContent: 'center' }}>
              <span>or</span>
            </Grid>
            <Grid style={{ justifyContent: 'center' }}>
              <PSelect section onClick={() => {
                this.setState({ usePowerSelector: true })
              }} />

            </Grid>
          </React.Fragment> : '' }
          {this.state.activeStep === 3
            ? <React.Fragment>
              <div>
                {this.state.selectedASSFullObjs && this.state.selectedASSFullObjs.map((item, i) => (
                  <Card
                    key={item.id}
                    index={i}
                    id={item.id}
                    text={item.assessment_name}
                    deleteItem={this.handleRemove}
                    moveCard={this.moveCard}
                  />
                ))}
              </div>
            </React.Fragment>
            : ''}
        </div>
      </React.Fragment>
    )
  }
  filterTableData = () => {
    let { assessmentData, queryString } = this.state
    if (!assessmentData) { return [] }
    if (!queryString) { return assessmentData }
    return assessmentData.filter(obj => obj.assessment_name.includes(queryString))
  }
  handleRemove = (id) => {
    this.handleTick({ target: { checked: false } }, id)
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { selectedASSFullObjs } = this.state
    const dragCard = selectedASSFullObjs[dragIndex]

    this.setState(
      update(this.state, {
        selectedASSFullObjs: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    )
  }
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  section: state.sectionMap.items,
  subjects: state.subjects.items,
  user: state.authentication.user,
  roles: state.roles.items,
  filter: state.filter
})
const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadMapId => dispatch(apiActions.getSectionMapping(acadMapId)),
  listBranches: dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listSections: dispatch(apiActions.listSections()),
  loadRoles: dispatch(apiActions.listRoles())
})
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(CreateTest)))
