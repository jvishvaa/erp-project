import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withStyles, FormControlLabel, Table, TableBody, TableCell,
  TableHead, TableRow, Checkbox, Button, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../Layout'
import '../../css/staff.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId = null
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Fee Plan' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'View Fee Plan') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId= item.child_id
          // })
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
class AddFeePlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeplan_name: '',
      new_admission: true,
      existing_students: true,
      limitedTime: false,
      startDate: null,
      endDate: null,
      plan: [],
      Amount: '',
      feeType: [],
      showDetail: false,
      is_compulsory: false,
      showTable: false,
      tableData: [],
      is_new_admission: false,
      is_regular: false,
      is_rte: false,
      is_specialchild: false,
      is_dayscholar: false,
      is_afternoonbatch: false,
      yearApplicable: [],
      yearApplicableId: [],
      sessionData: null
    }
  }

  changehandlerbranch = (e) => {
    // this.props.gradeMapBranch(e.value)
    this.setState({ branchId: e.value, valueGrade: [], branchData: e })
    this.props.fetchGrades(this.state.session, e.value, this.props.alert, this.props.user, moduleId)
    this.props.fetchFeeTypes(this.state.session, e.value, this.props.alert, this.props.user)
    this.props.fetchFeePlanApplicable(e.value, this.props.alert, this.props.user)
  }

  handleClickFee = (e) => {
    this.setState({ FeeId: e.value, FeeLabel: e.label, FeeData: e })
  }

  yearApplicableHandler = (e) => {
    let aIds = []
    e && e.forEach(function (year) {
      aIds.push(year.value)
    })
    this.setState({ yearApplicableId: aIds })
    // this.setState({ yearApplicableId: e.value }, ()=> {
    // })
  }

  handleClickGrade = event => {
    let aMapIds = []
    event && event.forEach((grdae) => {
      aMapIds.push(grdae.value)
    })
    this.setState({ gradeData: aMapIds, valueGrade: event })
  }

  feePlanNameHandler = e => {
    this.setState({ feeplan_name: e.target.value })
  }

  amountChangeHandler = e => {
    if (e.target.value > 0) {
      this.setState({
        Amount: e.target.value
      })
    } else {
      this.props.alert.warning('Invalid Amount!')
    }
  }

  handleClickSessionYear = (e) => {
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
  }

  handleEndDate = (e) => {
    this.setState({ endDate: e.target.value })
    var startDate = document.getElementById('startDate').value
    var endDate = document.getElementById('endDate').value
    if (Date.parse(startDate) >= Date.parse(endDate)) {
      this.setState({
        alertMessage: {
          messageText: 'End date should be greater than Start date',
          variant: 'error',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      this.setState({ endDate: '' })
    }
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  startDateHandler = e => {
    this.setState({ startDate: e.target.value })
  }

  handlevalue = () => {
    var data = {
      branch: this.state.branchId,
      academic_year: this.state.session,
      grades: this.state.gradeData,
      fee_plan_name: this.state.feeplan_name,
      is_new_admission: this.state.is_new_admission,
      is_regular: this.state.is_regular,
      is_rte: this.state.is_rte,
      is_specialchild: this.state.is_specialchild,
      is_dayscholar: this.state.is_dayscholar,
      is_afternoonbatch: this.state.is_afternoonbatch,
      date_from: this.state.startDate,
      date_to: this.state.endDate,
      is_this_a_limited_plan: this.state.limitedTime,
      years_applicable_to: this.state.yearApplicableId
    }
    this.props.CreateFee(data, this.props.alert, this.props.user)
    this.setState({ showDetail: true })
  }
  handleSubmit = () => {
    var data2 = []
    var data = {
      fee_type: this.state.FeeId,
      amount: this.state.Amount,
      is_compulsory: this.state.is_compulsory,
      branch: this.state.branchId,
      academic_year: this.state.session,
      fee_plan_name: this.state.feeplan_name
    }
    data2.push({
      fee_type: this.state.FeeLabel,
      amount: this.state.Amount,
      is_compulsory: this.state.is_compulsory
    })
    this.setState({ tableData: data2 })
    this.props.CreateFeeTypeMap(data, this.props.alert, this.props.user)
    this.setState({
      showTable: true, FeeData: [], Amount: '', is_compulsory: false
    })
  }

  render () {
    let { classes } = this.props
    return (
      <Layout>
      <React.Fragment>
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Session'
                value={this.state.sessionData ? ({
                  value: this.state.sessionData.value,
                  label: this.state.sessionData.label
                }) : null}
                options={
                  this.props.session && this.props.session.session_year.length
                    ? this.props.session.session_year.map(session => ({ value: session, label: session })
                    ) : []}
                onChange={this.handleClickSessionYear}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                value={this.state.branchData}
                options={
                  this.props.branches.length && this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
                    : []
                }

                onChange={this.changehandlerbranch}
              />
            </Grid>
          </Grid>
          <Grid item xs='3'>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              isMulti
              options={
                this.props.grades
                  ? this.props.grades.map(grades => ({
                    value: grades.grade ? grades.grade.id : '',
                    label: grades.grade ? grades.grade.grade : ''
                  }))
                  : []
              }
              value={this.state.valueGrade}
              onChange={this.handleClickGrade}
            />
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label>Fee Plan Name*</label>
              <input
                name='feeplan_name'
                type='text'
                className='form-control'
                onChange={this.feePlanNameHandler}
                placeholder='Fee Plan Name'
                value={this.state.feeplan_name}
              />
            </Grid>
            <Grid item xs='3'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.limitedTime}
                    onChange={this.changedHandler('limitedTime')}
                    color='primary'
                  />
                }
                label='Is this a limited period time ?'
              />
            </Grid>
          </Grid>
          <Grid item xs='3'>
            <label>Year Applicable To*</label>
            <Select
              placeholder='Select Year'
              isMulti
              options={
                this.props.yearApplicable && this.props.yearApplicable.length > 0
                  ? this.props.yearApplicable.map(year => ({
                    value: year.id,
                    label: year.session_year
                  }))
                  : []
              }
              onChange={this.yearApplicableHandler}
            />
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            {this.state.limitedTime
              ? <React.Fragment>
                <Grid item xs='3'>
                  <label>Start Date</label>
                  <input
                    type='date'
                    value={this.state.startDate}
                    onChange={this.startDateHandler}
                    className='form-control'
                    name='startDate'
                    id='startDate'
                  />
                </Grid>
                <Grid item xs='3'>
                  <label>End Date</label>

                  <input
                    type='date'
                    value={this.state.endDate}
                    className='form-control'
                    name='endDate'
                    id='endDate'
                    onChange={this.handleEndDate}
                  />
                </Grid>
              </React.Fragment>
              : ''}
          </Grid>
          <Grid item xs='12'>
            <label>Plan Applicable To* :</label> &nbsp;
            {this.state.is_regular ? ''
              : <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_new_admission}
                    onChange={this.changedHandler('is_new_admission')}
                    color='primary'
                  />
                }
                label='New Admission'
              />
            }

            {this.state.is_new_admission ? ''
              : <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_regular}
                    onChange={this.changedHandler('is_regular')}
                    color='primary'
                  />
                }
                label='Regular'
              />
            }

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_rte}
                  onChange={this.changedHandler('is_rte')}
                  color='primary'
                />
              }
              label='RTE'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_specialchild}
                  onChange={this.changedHandler('is_specialchild')}
                  color='primary'
                />
              }
              label='Special Child'
            />
            {this.state.is_afternoonbatch ? ''
              : <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_dayscholar}
                    onChange={this.changedHandler('is_dayscholar')}
                    color='primary'
                  />
                }
                label='Day Scholar'
              />
            }
            {this.state.is_dayscholar ? ''
              : <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_afternoonbatch}
                    onChange={this.changedHandler('is_afternoonbatch')}
                    color='primary'
                  />
                }
                label='Afternoon Batch'
              />
            }

          </Grid>
          <Grid container justify='center'>
            <Grid item xs='4'>
              <Button
                color='primary'
                variant='contained'
                disabled={!this.state.session || !this.state.branchId || !this.state.gradeData ||
                  !this.state.feeplan_name
                }
                onClick={this.handlevalue}
              >Create Fee Plan</Button>
            </Grid>
          </Grid>
          {this.state.showTable
            ? <React.Fragment>
              <div className={classes.tableWrapper}>
                <label style={{ paddingLeft: '20px', fontSize: '20px' }}>Last Added</label>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fee Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Is Compulsory</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.tableData.map((row) => {
                      return (
                        <React.Fragment>
                          <TableRow hover >
                            <TableCell>{row.fee_type}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                            <TableCell>{row.is_compulsory ? 'Yes' : 'No'}</TableCell>
                          </TableRow>
                        </React.Fragment>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment> : null}
          <Grid container spacing={3} style={{ padding: 15 }}>
            {this.state.showDetail
              ? <React.Fragment>
                <Grid item xs='12'>
                  <label style={{ fontSize: '20px' }}>Available Fee Type</label>
                </Grid>
                <Grid item xs='3'>
                  <label>Fee Type</label>
                  <Select
                    placeholder='Select Fee Type'
                    value={this.state.FeeData}
                    options={this.props.feeTypes ? this.props.feeTypes.map((fee) => ({ value: fee.id, label: fee.fee_type_name })) : []
                    }
                    onChange={this.handleClickFee}
                  />
                </Grid>
                <Grid item xs='3'>
                  <label>Amount</label>
                  <input
                    name='Amount'
                    type='number'
                    min='0'
                    className='form-control'
                    onChange={this.amountChangeHandler}
                    placeholder='Amount'
                    value={this.state.Amount}
                  />
                </Grid>
                <Grid item xs='3'>
                  <label>Is this fee type compulsory</label>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.is_compulsory}
                        onChange={this.changedHandler('is_compulsory')}
                        color='primary'
                      />
                    }
                    label='is_compulsory'
                  />
                </Grid>
                <Grid item xs='12'>
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={() => { this.handleSubmit() }}
                    disabled={!this.state.FeeId || !this.state.Amount}
                  >Submit</Button>
                </Grid>
              </React.Fragment>
              : null}
            {this.props.dataLoading ? <CircularProgress open /> : null}
          </Grid>
        </Grid>
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  grades: state.finance.common.gradesPerBranch,
  yearApplicable: state.finance.feePlan.feePlanYearApplicable,
  feeTypes: state.finance.feePlan.feeTypePerBranch,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchGrades: (session, branch, alert, user, moduleId) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, alert, user, moduleId })),
  fetchFeeTypes: (session, branch, alert, user) => dispatch(actionTypes.fetchFeeTypesPerBranch({ session, branch, alert, user })),
  fetchFeePlanApplicable: (branch, alert, user) => dispatch(actionTypes.fetchFeePlanYearApplicable({ branch, alert, user })),
  CreateFee: (data, alert, user) => dispatch(actionTypes.createFeePlan({ data, alert, user })),
  CreateFeeTypeMap: (data, alert, user) => dispatch(actionTypes.createFeePlanTypeMap({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AddFeePlan)))
