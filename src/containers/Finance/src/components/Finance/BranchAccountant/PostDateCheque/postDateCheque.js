import React, { Component } from 'react'
import { Button, withStyles, TextField, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@material-ui/core/'
import { Info } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import Modal from '../../../../ui/Modal/modal'
// import { OmsSelect } from '../../../../ui'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from './pdc.module.css'
import Student from '../../Profiles/studentProfile'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250
  }
})
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Approvals/Requests' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Post Dated cheque') {
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
class PostDateCheque extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      sessionData: null,
      gradeId: null,
      gradeData: null,
      toDate: null,
      fromDate: null,
      todayDate: null,
      pdcShowModal: false,
      studentInfoId: null,
      selectedBranches: '',
    }
    // this.handleAcademicyear = this.handleAcademicyear.bind(this)
  }

  componentDidMount () {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 // January is 0!
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd
    this.setState({ todayDate: today })
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Student' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Post Dated Cheque') {
              // setModuleId(item.child_id);
              // setModulePermision(true);
              this.setState({
                moduleId: item.child_id
              })
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
  }

  handleAcademicyear = (e) => {
    // console.log('acad years', this.props.session)
    this.setState({ session: e.value, sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
  }

  gradeHandler = (e) => {
    console.log(e.value)
    this.setState({ 
    gradeId: e.value,
    gradeData: e
    })
  }

  fromDateHandler = (e) => {
    this.setState({ fromDate: e.target.value })
    // if (Date.parse(e.target.value) > Date.parse(this.state.todayDate)) {
    //   this.props.alert.warning('Selected Date is Incorrect!')
    //   this.setState({ fromDate: null })
    //   return false
    // } else {
    //   this.setState({ fromDate: e.target.value })
    // }
  }

  toDateHandler = (e) => {
    this.setState({ toDate: e.target.value })
    // if (this.state.fromDate) {
    //   if (Date.parse(this.state.fromDate) > Date.parse(e.target.value) || Date.parse(e.target.value) > Date.parse(this.state.todayDate)) {
    //     this.props.alert.warning('Selected Date is Incorrect!')
    //     this.setState({ toDate: null })
    //     return false
    //   } else {
    //     this.setState({ toDate: e.target.value })
    //   }
    // } else {
    //   this.props.alert.warning('select From Date Buddy!')
    // }
  }

  pdcHandler = () => {
    if (this.state.session && this.state.gradeData && this.state.fromDate && this.state.toDate && this.state.selectedBranches) {
      this.props.fetchPdc(this.state.session, this.state.gradeId, this.state.fromDate, this.state.toDate, this.state.selectedBranches && this.state.selectedBranches.value, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Fill all the Fields!')
    }
  }

  showInfoModalHandler = (studentId) => {
    this.setState({ pdcShowModal: true, studentInfoId: studentId })
  }

  hideInfoModalHandler = () => {
    this.setState({ pdcShowModal: false })
  }
  changehandlerbranch = (e) => {
    this.props.fetchGrades(this.state.session, this.props.alert, this.props.user, moduleId, e.value)
    // this.props.fetchGrades(this.state.session, this.props.alert, this.props.user, moduleId, e.value)
    this.setState({ selectedBranches: e})
  }
  render () {
    // let { classes } = this.props
    let pdcModal = null

    if (this.state.pdcShowModal) {
      pdcModal = (
        <Modal open={this.state.pdcShowModal} click={this.hideInfoModalHandler} large>
          <h3 className={classes.modal__heading}>Student PDC Info</h3>
          <hr />
          {this.props.pdcDetails.map((row) => {
            if (row.id === this.state.studentInfoId) {
              return (
                <React.Fragment>
                  <Student erp={row.student.erp} user={this.props.user} alert={this.props.alert} />
                  <Grid container spacing={3} style={{ padding: '20px' }}>
                    <Grid item xs='3'>
                        Transaction ID : {row.transaction_id}
                    </Grid>
                    <Grid item xs='3'>
                        Receipt No : {row.receipt_number}
                    </Grid>
                    <Grid item xs='3'>
                        Date Of Receipt : {row.date_of_receipt}
                    </Grid>
                    <Grid item xs='3'>
                        Date Of Cheque : {row.date_of_cheque}
                    </Grid>
                    <Grid item xs='3'>
                        Cheque No : {row.cheque_number}
                    </Grid>
                    <Grid item xs='3'>
                        Name On Cheque : {row.name_on_cheque}
                    </Grid>
                    <Grid item xs='3'>
                        Amount : {row.amount}
                    </Grid>
                    <Grid item xs='3'>
                        IFSC : {row.ifsc_code}
                    </Grid>
                    <Grid item xs='3'>
                        MICR : {row.micr_code}
                    </Grid>
                    <Grid item xs='3'>
                        Bank Name : {row.bank_name}
                    </Grid>
                    <Grid item xs='3'>
                        Bank Branch : {row.bank_branch}
                    </Grid>
                  </Grid>
                </React.Fragment>
              )
            }
          })}
        </Modal>
      )
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3' >
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.selectedBranches}
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }
              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={this.state.gradeData}
              options={
                this.props.gradeList
                  ? this.props.gradeList.map(grades => ({
                    value: grades.grade.id,
                    label: grades.grade.grade
                  }))
                  : []
              }
              onChange={this.gradeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <form className={classes.container} noValidate>
              <TextField
                id='startDate'
                label='From Date'
                type='date'
                variant='outlined'
                className={classes.textField}
                onChange={this.fromDateHandler}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </form>
          </Grid>
          <Grid item xs='3'>
            <form className={classes.container} noValidate>
              <TextField
                id='endDate'
                label='To Date'
                type='date'
                variant='outlined'
                className={classes.textField}
                onChange={this.toDateHandler}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </form>
          </Grid>
          <Grid item xs='3'>
            <Button
              variant='contained'
              color='primary'
              // disabled={!this.state.session || !this.state.branchId || !this.state.gradeId || !this.state.fromDate || !this.state.toDate}
              onClick={this.pdcHandler}
            >
                GET
            </Button>
          </Grid>
        </Grid>
        {this.props.pdcDetails
          ? <Grid conatiner spacing={3}>
            <Grid item xs='12'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date Of Receipt</TableCell>
                    <TableCell>Date Of Cheque</TableCell>
                    <TableCell>Cheque Number</TableCell>
                    <TableCell>Info</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.pdcDetails.map((row) => {
                    return (
                      <React.Fragment>
                        <TableRow hover >
                          <TableCell><div style={{ width: '100px'}}>{row.student.name}</div></TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell style={{textAlign: 'center'}}>{row.date_of_receipt}</TableCell>
                          <TableCell>{row.date_of_cheque}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{row.cheque_number}</TableCell>
                          <TableCell><Info style={{ cursor: 'pointer'}} onClick={() => this.showInfoModalHandler(row.id)} /></TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          : null}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {pdcModal}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  // gradeData: state.finance.accountantReducer.pdc.gradeData,
  pdcDetails: state.finance.accountantReducer.pdc.pdcList,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  gradeList: state.finance.common.gradeList,
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchGrades: (session, alert, user, moduleId, branch) => dispatch(actionTypes.fetchGradeList({ session, alert, user, moduleId, branch })),
  // fetchGrades: (session, alert, user, moduleId, branch) => dispatch(actionTypes.fetchGrades({ session, alert, user, moduleId, branch })),
  fetchPdc: (session, grade, fromDate, toDate, branch, alert, user) => dispatch(actionTypes.fetchPdc({ session, grade, fromDate, toDate, branch, alert, user })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(PostDateCheque)))
