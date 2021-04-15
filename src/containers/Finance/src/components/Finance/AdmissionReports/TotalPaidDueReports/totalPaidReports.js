import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { FormControlLabel, Checkbox, Button, Grid } from '@material-ui/core/'

import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

// const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]

class TotalPaidReports extends Component {
  state = {
    session: '',
    sessionData: [],
    branchId: '',
    selectedBranches: null,
    valueGrade: [],
    gradeData: [],
    installmentIds: [],
    selectedInstallments: [],
    selectedFeeTypes: '',
    feeTypeIds: [],
    selectedTypes: [],
    typesId: '',
    active: false,
    inactive: false,
    allStudents: false,
    selectedFeeTypeAndinst: [],
    feeInstId: '',
    selectedStudentStatus: { value: 1, label: 'All Students' },
    studentStatusId: '',
    role: '',
    selectedFeePlan: '',
    feePlanId: []
  }
  componentDidMount () {
    // this.todayDate()
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const role = userProfile.personal_info.role.toLowerCase()
    this.setState({
      role
    }, () => {
      if (this.state.role === 'financeaccountant') {
        this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    // console.log('------nextprops----------', nextProps)
    // console.log('-----state------', this.state)
    // if (this.state.confirmStatus) {
    //   this.setState({
    //     sessionData: [],
    //     selectedBranches: [],
    //     feeAccData: [],
    //     trnsData: [],
    //     paymentModeData: [],
    //     today: true,
    //     startDate: '',
    //     endDate: '',
    //     typeData: []
    //   })
    // }
  }
  handleAcademicyear = (e) => {
    this.setState({ session: e.value, selectedBranches: [], sessionData: e }, () => {
      if (this.state.role === 'financeaccountant') {
        // this.props.fetchFeeAccounts(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
        this.props.fetchGrades(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
        // this.props.fetchFeeTypes(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
      } else {
        this.props.fetchBranches(e.value, this.props.alert, this.props.user)
      }
    })
  }
  changehandlerbranch = (e) => {
    this.setState({
      branchId: e.value,
      selectedBranches: e,
      valueGrade: [],
      selectedFeeTypes: []
    }, () => {
      this.props.fetchGrades(this.state.session, this.state.branchId, this.props.alert, this.props.user)
      // this.props.fetchFeeTypes(this.state.session, this.state.branchId, this.props.alert, this.props.user)
    })
  }
  handleClickGrade = event => {
    const allLabel = event.filter(event => {
      return event.label === 'All Grades'
    })
    let aMapIds = []
    if (allLabel.length === 1) {
      const allGrades = {
        value: 'all',
        label: 'All Grades'
      }
      const allGradeIds = this.props.grades.map(ele => ele.grade.id).filter(ele => ele !== 'all')
      this.setState({
        gradeData: allGradeIds,
        valueGrade: allGrades
      })
    } else {
      event.forEach((grdae) => {
        aMapIds.push(grdae.value)
      })
      this.setState({
        gradeData: aMapIds,
        valueGrade: event
      })
    }
  }
  changeFeeTypeHandler = (e) => {
    this.setState({
      selectedFeeTypes: e
    })
  }
  changeTypeHandler = (e) => {
    this.setState({
      selectedTypes: e,
      typesId: e.value
    })
  }
  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked }, () => {
    })
  }
  changeStudentStatusHandler = (e) => {
    this.setState({
      selectedStudentStatus: e,
      studentStatusId: e.value
    })
  }
  getReport = () => {
    if (!this.state.session || this.state.valueGrade.length < 1 ||
      !this.state.selectedFeeTypes || !this.state.typesId
    ) {
      this.props.alert.warning('Select All Required Fields')
      return
    }
    let data = {}
    if (this.state.role === 'financeaccountant') {
      data = {
        academic_year: this.state.session,
        branches: [this.props.branchAtAcc.branch],
        grades: this.state.gradeData,
        fee_types: this.state.selectedFeeTypes.value,
        type: this.state.typesId,
        student_status: this.state.selectedStudentStatus.value,
        active: this.state.active,
        inactive: this.state.inactive,
        allStudents: this.state.allStudents
      }
    } else {
      data = {
        academic_year: this.state.session,
        branches: [this.state.branchId],
        grades: this.state.gradeData,
        fee_types: this.state.selectedFeeTypes.value,
        type: this.state.typesId,
        student_status: this.state.selectedStudentStatus.value,
        active: this.state.active,
        inactive: this.state.inactive,
        allStudents: this.state.allStudents
      }
    }
    // if (this.state.active) {
    //   data.active = this.state.active
    // } else if (this.state.inactive) {
    //   data.inactive = this.state.inactive
    // } else if (this.state.allStudents) {
    //   data.allStudents = this.state.allStudents
    // }
    this.props.downloadReports('AdmTotalPaidReports.xlsx', urls.DownloadAdmTotalPdreports, data, this.props.alert, this.props.user)
    this.props.clearProps()
    this.setState({
      sessionData: [],
      selectedBranches: [],
      valueGrade: [],
      selectedFeePlan: [],
      selectedFeeTypes: [],
      selectedInstallments: [],
      active: false,
      inactive: false,
      allStudents: false,
      selectedTypes: [],
      selectedFeeTypeAndinst: [],
      selectedStudentStatus: []
    })
  }
  render () {
    let selectBranch = null
    const { role } = this.state
    if (role === 'financeadmin') {
      selectBranch = (
        <Grid item xs={4} style={{ padding: '15px' }}>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={this.state.selectedBranches ? this.state.selectedBranches : ''}
            options={
              this.state.selectedbranchIds !== 'all' ? this.props.branches.length && this.props.branches
                ? this.props.branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : [] : []
            }

            onChange={this.changehandlerbranch}
          />
        </Grid>
      )
    }
    return (
      <React.Fragment>
        <div style={{ padding: '15px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                value={this.state.sessionData ? this.state.sessionData : null}
                id='academic_year'
                options={
                  this.props.session ? this.props.session.session_year.map((session) =>
                    ({ value: session, label: session })) : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            {selectBranch}
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Grade*</label>
              <Select
                placeholder='Select Grade'
                isMulti
                id='grade'
                options={
                  this.state.valueGrade.value !== 'all' ? this.props.grades
                    ? this.props.grades.map(grades => ({
                      value: grades.grade ? grades.grade.id : '',
                      label: grades.grade ? grades.grade.grade : ''
                    }))
                    : [] : []
                }
                value={this.state.valueGrade}
                onChange={this.handleClickGrade}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Fee Types*</label>
              <Select
                placeholder='Fee Types'
                id='fee_types'
                value={this.state.selectedFeeTypes ? this.state.selectedFeeTypes : ''}
                options={
                  [
                    { value: 1, label: 'Application Fee' },
                    { value: 2, label: 'Registration Fee' }
                  ]
                }
                onChange={this.changeFeeTypeHandler}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '20px 15px' }}>
              {!this.state.inactive && !this.state.allStudents ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.active}
                    onChange={(e) => this.changedHandler('active', e)}
                    color='primary'
                  />
                }
                label='Active'
              /> : null}
              {!this.state.active && !this.state.allStudents ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.inactive}
                    onChange={(e) => this.changedHandler('inactive', e)}
                    color='primary'
                  />
                }
                label='InActive'
              /> : null}
              {!this.state.active && !this.state.inactive ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.allStudents}
                    onChange={(e) => this.changedHandler('allStudents', e)}
                    color='primary'
                  />
                }
                label='All Students'
              /> : null}
            </Grid>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Types*</label>
              <Select
                placeholder='Types'
                value={this.state.selectedTypes ? this.state.selectedTypes : ''}
                options={
                  [
                    {
                      value: 1,
                      label: 'Day Scholar'
                    },
                    {
                      value: 2,
                      label: 'Residential'
                    }
                  ]
                }
                onChange={this.changeTypeHandler}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Students Status*</label>
              <Select
                placeholder='Select Students Type'
                value={this.state.selectedStudentStatus ? this.state.selectedStudentStatus : ''}
                id='student_status'
                options={
                  [
                    {
                      value: 1,
                      label: 'All Students'
                    },
                    {
                      value: 2,
                      label: 'Due Students'
                    }
                  ]
                }
                onChange={this.changeStudentStatusHandler}
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ margin: '0 auto', marginTop: '60px', paddingBottom: '60px' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={this.getReport}>
            Download Report
          </Button>
        </div>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  branchAtAcc: state.finance.common.branchAtAcc,
  grades: state.finance.common.multGradesPerBranch,
  installments: state.finance.totalPaidDueReports.multInstallmentList,
  feeTypes: state.finance.totalPaidDueReports.multFeeTypes,
  feePlans: state.finance.totalPaidDueReports.multFeePlans,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGrades: (session, branch, alert, user) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, alert, user })),
  fetchInstallments: (data, alert, user) => dispatch(actionTypes.fetchInstallmentListPerFeeType({ data, alert, user })),
  fetchFeeTypes: (session, branch, grade, feePlanId, alert, user) => dispatch(actionTypes.fetchFeeTypesPaidReportsPerBranch({ session, branch, grade, feePlanId, alert, user })),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user })),
  fetchFeePlanNames: (session, branch, grades, alert, user) => dispatch(actionTypes.fetchFeePlanNames({ session, branch, grades, alert, user })),
  clearProps: () => dispatch(actionTypes.clearTotalPaidProps())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TotalPaidReports)
