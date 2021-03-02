import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Button, Typography, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import * as actionTypes from '../../store/actions'
import AssignedStudents from './assignedStudents'
import UnassignedStudents from './unassignedStudents'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'


const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    borderRadius: 4
  }
})

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
}

class AssignOtherFees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gradeId: null,
      sectionData: [],
      sectionId: [],
      gradeData: [],
      session: null,
      sessionData: [],
      otherFeeId: null,
      otherFeeData: [],
      due_date: '',
      value: 'one',
      getList: false
    }
  }

  // componentDidMount () {
  //   this.props.fetchOtherFees(this.props.alert, this.props.user)
  // }

  gradeHandler = (e) => {
    console.log(e.value)
    this.setState({ gradeId: e.value, gradeData: e }, () => {
      this.props.fetchAllSections(this.state.session, this.state.gradeId, this.props.alert, this.props.user)
    })
  }

  sectionHandler = (e) => {
    let sectionIds = []
    e.forEach(section => {
      sectionIds.push(section.value)
    })
    this.setState({ sectionId: sectionIds, sectionData: e })
  }

  otherFeeHandler = (e) => {
    this.setState({
      otherFeeId: e.value,
      otherFeeData: e
    }, () => {
      if (this.state.session) {
        this.props.checkIsMisc(this.state.session, this.state.otherFeeId, this.props.alert, this.props.user)
      } else {
        this.props.alert.warning('Select Session year!')
      }
    })
  }

  dueDateHandler = (e) => {
    this.setState({
      due_date: e.target.value
    })
  }

  getStudentList = () => {
    if (!this.state.session ||
      !this.state.otherFeeId ||
      !this.state.gradeId ||
      !this.state.sectionId) {
      this.props.alert.warning('Select All Fields')
      return false
    }
    this.setState({ getList: true })
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchAllGrades(e.value, this.props.alert, this.props.user)
    this.props.fetchOtherFees(e.value, this.props.alert, this.props.user)
  }

  render () {
    let tabView = null
    if (this.state.getList) {
      tabView = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='Assigned Students' />
              <Tab value='two' label='Unassigned Students' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer>
            <AssignedStudents
              sessionId={this.state.session}
              otherFeeId={this.state.otherFeeId}
              gradeId={this.state.gradeId}
              sectionId={this.state.sectionId}
              isMisc={this.props.isMisc && this.props.isMisc.key}
              alert={this.props.alert}
              user={this.props.user}
              getState={this.state.getList}
            />
          </TabContainer>}
          {this.state.value === 'two' && <TabContainer>
            <UnassignedStudents
              sessionId={this.state.session}
              otherFeeId={this.state.otherFeeId}
              gradeId={this.state.gradeId}
              sectionId={this.state.sectionId}
              isMisc={this.props.isMisc && this.props.isMisc.key}
              alert={this.props.alert}
              getState={this.state.getList}
              user={this.props.user}
            />
          </TabContainer>}
        </React.Fragment>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session ? this.props.session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={this.state.gradeData ? this.state.gradeData : ''}
              options={
                this.props.gradeData
                  ? this.props.gradeData.map(grades => ({
                    value: grades.grade.id,
                    label: grades.grade.grade
                  }))
                  : []
              }
              onChange={this.gradeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Section*</label>
            <Select
              placeholder='Select Section'
              value={this.state.sectionData ? this.state.sectionData : ''}
              isMulti
              options={
                this.props.sectionData
                  ? this.props.sectionData.filter(ele => ele.section !== null).map(sec => ({
                    value: sec.section && sec.section.id ? sec.section.id : '',
                    label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                  }))
                  : []
              }
              onChange={this.sectionHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Other Fee*</label>
            <Select
              placeholder='Select Other Fee'
              value={this.state.otherFeeData ? this.state.otherFeeData : ''}
              options={
                this.props.otherFeesList && this.props.otherFeesList.length
                  ? this.props.otherFeesList.map(fee => ({
                    value: fee.id,
                    label: fee.fee_type_name
                  }))
                  : []
              }
              onChange={this.otherFeeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <div>
              <Button
                variant='contained'
                color='primary'
                onClick={this.getStudentList}>
              GET Student List
              </Button>
            </div>
          </Grid>
        </Grid>
        <br />
        <div>
          {tabView}
        </div>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  gradeData: state.finance.accountantReducer.changeFeePlan.gradeData,
  session: state.academicSession.items,
  sectionData: state.finance.common.sectionsPerGrade,
  otherFeesList: state.finance.accountantReducer.listOtherFee.listOtherFees,
  isMisc: state.finance.accountantReducer.listOtherFee.isMisc,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchAllGrades: (session, alert, user) => dispatch(actionTypes.fetchAllGrades({ session, alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, gradeId, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchOtherFees: (session, alert, user) => dispatch(actionTypes.fetchListtOtherFee({ session, alert, user })),
  checkIsMisc: (session, otherFeeId, alert, user) => dispatch(actionTypes.checkIsMisc({ session, otherFeeId, alert, user })),
  clearProps: () => dispatch(actionTypes.clearingAllProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AssignOtherFees)))
