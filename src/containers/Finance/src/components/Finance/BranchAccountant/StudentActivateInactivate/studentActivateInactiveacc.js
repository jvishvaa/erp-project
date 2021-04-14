/* eslint-disable indent */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, Button, TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import zipcelx from 'zipcelx'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  modalDeletebutton: {
    bottom: '5px',
    right: '10px',
    backgroundColor: '#cc0000',
    display: 'inlineBlock',
    position: 'absolute'
  },
  modalRemainbutton: {
    bottom: '5px',
    left: '10px',
    backgroundColor: '#009900',
    display: 'inlineBlock',
    position: 'absolute'
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'student' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Active/Inactive') {
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
class StudentActivateInactiveAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      searchBox: null,
      updaterow: null,
      remark: null,
      studentInfo: {
        branch: null,
        grade: '5',
        section: null,
        academicyear: '2019-20',
        status: 'True',
        request_by_relative: null
      },
      selectedBranches:''
    }
  }
  componentDidMount () {
    // this.props.fetchGradeList(this.props.alert, this.props.user)
  }
  downloadStu = () => {
    const headers = [
      {
        value: 'Student Name',
        type: 'string'
      },
      {
        value: 'Enrollment Code',
        type: 'string'
      },
      {
        value: 'Admission Number',
        type: 'string'
      },
      {
        value: 'Date Of Birth',
        type: 'string'
      },
      {
        value: 'Gender',
        type: 'string'
      }
    ]

    const body = this.props.activeStudentList.map(stu => {
      return ([
        {
          value: stu.name ? stu.name : '-',
          type: 'string'
        },
        {
          value: stu.erp ? stu.erp : '-',
          type: 'string'
        },
        {
          value: stu.admission_number ? stu.admission_number : '-',
          type: 'string'
        },
        {
          value: stu.date_of_birth ? stu.date_of_birth : '-',
          type: 'string'
        },
        {
          value: stu.gender ? stu.gender : '-',
          type: 'string'
        }
      ])
    })
    console.log('body: ', body)
    // const body = [
    //   {
    //     value: promoted,
    //     type: 'string'
    //   }
    // ]
    const config = {
      filename: 'student_list',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }
  rowDisplayHandler (data) {
    if (data.is_active === true) {
      return (<div>
        <Button color='primary' onClick={(e) => { this.showInfoModalRejectHandler(e, data) }}>Inactivate</Button>
      </div>)
    } else {
      return (<div>
        <Button color='primary' onClick={(e) => { this.showInfoModalAcceptHandler(e, data) }}>Reactivate</Button>
      </div>)
    }
  }

  remarkInputHandler= (event) => {
    this.setState({
      remark: event.target.value
    })
  }

  handleGetButton = (e) => {
    this.props.getActiveStudentDetails(this.props.alert, this.props.user, this.state.studentInfo.grade, this.state.studentInfo.section, this.state.studentInfo.academicyear, this.state.studentInfo.status, this.state.selectedBranches?.value)
  }

  showInfoModalRejectHandler = (event, data) => {
    this.setState({ showRejectModal: true })
    console.log(data)
    this.setState({ updaterow: data })
    console.log(this.state.updaterow)
    this.props.fetchAllPayment(this.props.alert, this.props.user, data.erp, this.state.studentInfo.academicyear, this.state.selectedBranches && this.state.selectedBranches.value, moduleId)
  }

  showInfoModalAcceptHandler = (event, data) => {
    this.setState({ showAcceptModal: true })
    console.log(data)
    this.setState({ updaterow: data })
    console.log(this.state.updaterow)
    // this.props.fetchAllPayment(this.props.alert, this.props.user, data.erp, this.state.studentInfo.academicyear)
  }

  hideInfoModalHandler= () => {
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
  }

  approveRequestHandler= () => {
    console.log(this.state.updaterow)
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
    const body = {
      academic_year: this.state.studentInfo.academicyear,
      is_active: false,
      erp: this.state.updaterow.erp,
      remarks: this.state.remark,
      request_by_relative: this.state.studentInfo.request_by_relative,
      branch_id:this.state.selectedBranches?.value
    }
    this.props.postStudentActivateInactivate(body, this.props.user, this.props.alert)
    this.setState({ updaterow: '' })
  }
  rejectRequestHandler= () => {
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
    const body = {
      request_by_relative: this.state.studentInfo.request_by_relative,
      academic_year: this.state.studentInfo.academicyear,
      is_active: true,
      erp: this.state.updaterow.erp,
      remarks: this.state.remark
    }
    this.props.postStudentActivateInactivate(body, this.props.user, this.props.alert)
    this.setState({ updaterow: '' })
  }

  studentDropdonHandler= (event, name) => {
    const newstudentInfo = { ...this.state.studentInfo }
    switch (name) {
      case 'status': {
        newstudentInfo['status'] = event.value
        break
      }
      case 'class': {
        newstudentInfo['grade'] = event.value
        break
      }
      case 'section': {
        newstudentInfo['section'] = event.value
        break
      }
      case 'academicyear': {
        newstudentInfo['academicyear'] = event.value
        break
      }
      case 'request_by_relative': {
        newstudentInfo['request_by_relative'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentInfo: newstudentInfo
    }, () => {
      if (name === 'status') {
      } else if (name === 'class') {
        this.props.fetchAllSectionsPerGrade(this.state.studentInfo.academicyear, this.props.alert, this.props.user, event.value, this.state.selectedBranches?.value, moduleId)
      } else if (name === 'section') {
      } else if (name === 'academicyear') {
        this.props.fetchBranches(event.value, this.props.alert, this.props.user, moduleId)
      }
    })
  }
  changehandlerbranch = (e) => {
    this.props.fetchGradeList(this.state.studentInfo.academicyear, e &&e.value, this.props.alert, this.props.user, moduleId)
    this.setState({ selectedBranches: e})
  }
  render () {
    const { classes } = this.props
    let installmentTable = null
    if (this.props.feeStructure.length > 0) {
      installmentTable = (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Installment</TableCell>
                <TableCell>Feetype</TableCell>
                <TableCell>Fee account</TableCell>
                <TableCell>Fee Amount</TableCell>
                {/* <TableCell>Concession</TableCell> */}
                <TableCell>Paid Amount</TableCell>
                <TableCell>Fine Amount</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.feeStructure.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell>{row.installments.installment_name ? row.installments.installment_name : '-'}</TableCell>
                    <TableCell>{row.fee_type.fee_type_name ? row.fee_type.fee_type_name : '-'}</TableCell>
                    <TableCell>{row.fee_type.fee_account_name ? row.fee_type.fee_account_name : '-'}</TableCell>
                    <TableCell>{row.installments.installment_amount ? row.installments.installment_amount : '-'}</TableCell>
                    <TableCell>{row.amount_paid ? row.amount_paid : '0'}</TableCell>
                    <TableCell>{row.fine_amount ? row.fine_amount : '0'}</TableCell>
                    <TableCell>{row.installments.due_date ? row.installments.due_date : '-'}</TableCell>
                    {/* <TableCell>
                    <input
                      name='concession'
                      type='number'
                      className='form-control'
                      value={this.state.concessionRequestAmount}
                      onChange={(e) => { this.concessionAmountHandler(e, row.balance) }} />
                  </TableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )
    } else if (this.props.feeStructure.length === 0) {
      installmentTable = (
        <h3>No Installment Records Found</h3>
      )
    }
    let acceptModal = null
    if (this.state.showAcceptModal) {
      acceptModal = (
        <Modal open={this.state.showAcceptModal} click={this.hideInfoModalHandler} large>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.spacing}>
                <h4>Name: {this.state.updaterow.name}</h4>
                <h4>Class: {this.state.updaterow.acad_branch_mapping.grade.grade}</h4>
                <br />
                <label>Remark: </label>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid item xs={3} className={classes.spacing}>
                  <TextField
                    type='text'
                    margin='dense'
                    fullWidth
                    required
                    // value={ this.state.studentParentDetails.fatherphone}
                    onChange={this.remarkInputHandler}
                    variant='outlined'
                    name='certificateName' />
                  {/* <br />
                <label>Reactivation Effective Date: </label>
                <TextField
                  type='date'
                  margin='dense'
                  fullWidth
                  required
                  // onChange={this.studentDetailsInputHandler}
                  variant='outlined'
                  name='effectiveDate' /> */}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
          <Grid container justify='space-between' spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3}>
              <Button color='primary' variant='contained' onClick={this.rejectRequestHandler}>Save</Button>
            </Grid>
            <Grid item xs={3}>
              <Button color='primary' variant='outlined' onClick={this.hideInfoModalHandler}>Go Back</Button>
            </Grid>
          </Grid>
        </Modal>
      )
    }
    let rejectModal = null
    if (this.state.showRejectModal) {
      rejectModal = (
        <Modal open={this.state.showRejectModal} click={this.hideInfoModalHandler} large>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.spacing}>
                <h4>Name: {this.state.updaterow.name}</h4>
                <h4>Class: {this.state.updaterow.acad_branch_mapping.grade.grade}</h4>
                <br />
                <label>Request By:</label>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid item xs={3} className={classes.spacing}>
                  <Select
                    placeholder='Select'
                    name='requestby'
                    options={[
                      { value: 'father', label: 'Father' },
                      { value: 'mother', label: 'Mother' }
                    ]}
                    onChange={(e) => { this.studentDropdonHandler(e, 'request_by_relative') }}
                  />
                </Grid>
                <Grid item xs={4} className={classes.spacing}>
                  <label>Remark: </label>
                  <TextField
                    type='text'
                    margin='dense'
                    fullWidth
                    required
                    // value={this.state.studentParentDetails.fatherphone}
                    onChange={this.remarkInputHandler}
                    variant='outlined'
                    name='certificateName' />
                  <br />
                  <br />
                  {/* <label>Inactivation Effective Date: </label>
                <TextField
                  type='date'
                  margin='dense'
                  fullWidth
                  required
                  // onChange={this.studentDetailsInputHandler}
                  variant='outlined'
                  name='effectiveDate' /> */}
                </Grid>
              </Grid>
            </Grid>
            <div>
              {installmentTable}
            </div>
          </React.Fragment>
          <Grid container justify='space-between' spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3}>
              <div>
                <Button color='primary' variant='contained' onClick={this.approveRequestHandler}>Save</Button>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div>
                <Button color='primary' variant='outlined' onClick={this.hideInfoModalHandler}>Go Back</Button>
              </div>
            </Grid>
          </Grid>
        </Modal>
      )
    }
    let studentTable = null
    if (this.props.activeStudentList.length > 0) {
      studentTable = (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Enrollment Code</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Request</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.activeStudentList.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell>{row.name ? row.name : '-'}</TableCell>
                    <TableCell>{row.erp ? row.erp : '-'}</TableCell>
                    <TableCell>{row.admission_number ? row.admission_number : '-'}</TableCell>
                    <TableCell>{row.date_of_birth ? row.date_of_birth : '-'}</TableCell>
                    <TableCell>{row.gender ? row.gender : '-'}</TableCell>
                    <TableCell>{this.rowDisplayHandler(row)}</TableCell>
                    {/* <TableCell>
                    <input
                      name='concession'
                      type='number'
                      className='form-control'
                      value={this.state.concessionRequestAmount}
                      onChange={(e) => { this.concessionAmountHandler(e, row.balance) }} />
                  </TableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )
            }
    // else if (this.props.activeStudentList.length === 0 && this.state.studentInfo.section) {
    //   studentTable = (
    //     <h3>No Records Found</h3>
    //   )
    // }

    return (
      <Layout>
      <React.Fragment>
        <div>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs={3}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                defaultValue={{ label: '2019-20', value: '2019-20' }}
                name='academicyear'
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={(e) => { this.studentDropdonHandler(e, 'academicyear') }}
              />
            </Grid>
            <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              // isMulti
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
            <Grid item xs={3}>
              <label>Status</label>
              <Select
                placeholder='Select'
                name='status'
                defaultValue={{ label: 'Active', value: 'True' }}
                options={[
                  { value: 'True', label: 'Active' },
                  { value: 'False', label: 'Inactive' }
                ]}
                onChange={(e) => { this.studentDropdonHandler(e, 'status') }}
              />
            </Grid>
            <Grid item xs={3}>
              <label>Grade</label>
              <Select
                placeholder='Select'
                // value={this.state.class ? this.state.class : null}
                options={this.props.gradeList ? this.props.gradeList.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                  : []
                }
                name='class'
                onChange={(e) => { this.studentDropdonHandler(e, 'class') }}
              />
            </Grid>
            <Grid item xs={3}>
              <label>Section</label>
              <Select
                placeholder='Select'
                name='section'
                // value={this.state.section ? this.state.section : null}
                options={this.props.sectionList ? this.props.sectionList.map(sec => ({
                  value: sec.section.id,
                  label: sec.section.section_name
                })) : []
                }
                onChange={(e) => { this.studentDropdonHandler(e, 'section') }}
              />
            </Grid>
            <Grid item xs={3}>
              <div style={{ marginTop: '23px', marginLeft: '15px' }}>
                <Button variant='contained' disabled={!this.state.studentInfo.section} onClick={this.handleGetButton} color='primary'>GET
                </Button>
              </div>
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                onClick={this.downloadStu}
                style={{ marginTop: '20px', float: 'right', marginBottom: 10 }}
                >
                DOWNLOAD Excel</Button>
            </Grid>
          </Grid>
          {studentTable}
          {acceptModal}
          {rejectModal}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </div>
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  activeStudentList: state.finance.accountantReducer.studentactivateInactivate.activeStudentList,
  gradeList: state.finance.common.gradeList,
  sectionList: state.finance.common.sectionsPerGrade,
  feeStructure: state.finance.accountantReducer.studentactivateInactivate.feeStructure,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  getActiveStudentDetails: (alert, user, grade, section, session, status, branch) => dispatch(actionTypes.getActiveStudentDetails({ alert, user, grade, section, session, status, branch })),
  getInActiveStudentDetails: (alert, user, grade, section, session) => dispatch(actionTypes.getInActiveStudentDetails({ alert, user, grade, section, session })),
  fetchGradeList: (session, branch, alert, user, moduleId) => dispatch(actionTypes.fetchGradeList({session, branch, alert, user, moduleId })),
  fetchAllSectionsPerGrade: (session, alert, user, gradeId, branch, moduleId) => dispatch(actionTypes.fetchAllSectionsPerGrade({ session, alert, user, gradeId, branch, moduleId })),
  fetchAllPayment: (alert, user, erp, session, branchId, moduleId) => dispatch(actionTypes.fetchAllPayment({ alert, user, erp, session, branchId, moduleId })),
  postStudentActivateInactivate: (data, user, alert) => dispatch(actionTypes.postStudentActivateInactivate({ data, user, alert })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentActivateInactiveAcc)))
