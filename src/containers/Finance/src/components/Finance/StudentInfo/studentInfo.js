import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, Button } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import AutoSuggest from '../../../ui/AutoSuggest/autoSuggest'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

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
  }
})

class StudentInfoAdm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      searchBox: null,
      studentInfo: {
        branch: null,
        grade: null,
        section: null,
        academicyear: null
      }
    }
  }
  componentDidMount () {
    this.props.listBranches()
    this.props.fetchGradeList(this.props.alert, this.props.user)
  }

  studentInfoDropdonHandler= (event, name) => {
    console.log('student Info Handler', event, name)
    const newstudentInfo = { ...this.state.studentInfo }
    console.log(event.value)
    switch (name) {
      case 'branch': {
        newstudentInfo['branch'] = event.value
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
      default: {

      }
    }
    this.setState({
      studentInfo: newstudentInfo
    }, () => {
      if (name === 'branch') {
        console.log('api called', this.state.studentInfo.branch)
        this.props.fetchGradesPerBranch(this.props.alert, this.props.user, this.state.studentInfo.academicyear, this.state.studentInfo.branch)
      } else if (name === 'class') {
        console.log('api called')
        this.props.fetchAllSectionsPerGradeAsAdmin(this.state.studentInfo.academicyear, this.props.alert, this.props.user, event.value, this.state.studentInfo.branch)
      }
    })
  }

  searchByStudentnoHandler = (e, selected) => {
    this.setState({ searchBox: e.target.value }, () => {
      if (this.state.searchBox.length >= 3) {
        this.props.fetchErpSuggestionsStudentName(this.props.alert, this.props.user, this.state.studentInfo.academicyear, this.state.studentInfo.grade, this.state.studentInfo.section, this.state.studentInfo.branch, this.state.searchBox)
      }
    })
  }

  handleGetButton = (e) => {
    this.props.fetchStudentInfoForAdmin(this.props.alert, this.props.user, this.state.studentInfo.academicyear, this.state.studentInfo.grade, this.state.studentInfo.section, this.state.studentInfo.branch)
  }

  render () {
    let searchBox = null
    if (this.state.studentInfo.branch) {
      searchBox = (
        <div>
          <AutoSuggest
            label='Search'
            // style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.searchBox || ''}
            onChange={this.searchByStudentnoHandler}
            margin='dense'
            variant='outlined'
            data={this.props.regNoSuggestion && this.props.regNoSuggestion.length > 0 ? this.props.regNoSuggestion.map(item => ({ value: item.registration_number ? item.registration_number : '', label: item.registration_number ? item.registration_number : '' })) : []}
          />
        </div>
      )
    }
    let studentTable = null
    if (this.props.studentSearchForAdmin.length > 0) {
      studentTable = (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SNo</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Enrollment Code</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Gr Number</TableCell>
                <TableCell>Date Of Admission</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Aadhar Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.studentSearchForAdmin.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell>{row.id ? '-' : '-'}</TableCell>
                    <TableCell>{row.name ? row.name : '-'}</TableCell>
                    <TableCell>{row.erp ? row.erp : '-'}</TableCell>
                    <TableCell>{row.admission_number ? row.admission_number : '-'}</TableCell>
                    <TableCell>{row.gr_number ? row.gr_number : '-'}</TableCell>
                    <TableCell>{row.admission_date ? row.admission_date : '-'}</TableCell>
                    <TableCell>{row.date_of_birth ? row.date_of_birth : '-'}</TableCell>
                    <TableCell>{row.gender ? row.gender : '-'}</TableCell>
                    <TableCell>{row.roll_no ? row.roll_no : '-'}</TableCell>
                    <TableCell>{row.aadhar_number ? row.aadhar_number : '-'}</TableCell>
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
    // else if (this.props.studentSearchForAdmin.length === 0) {
    //   studentTable = (
    //     <h3>            No Records Found</h3>
    //   )
    // }
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                // value={this.state.academicyear ? this.state.academicyear : null}
                name='academicyear'
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={(e) => { this.studentInfoDropdonHandler(e, 'academicyear') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Branch</label>
              <Select
                placeholder='Select'
                name='branch'
                // value={this.state.section ? this.state.section : null}
                options={this.props.branches ? this.props.branches.map(branch => ({
                  value: branch.id,
                  label: branch.branch_name
                })) : []
                }
                onChange={(e) => { this.studentInfoDropdonHandler(e, 'branch') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Grade</label>
              <Select
                placeholder='Select'
                // value={this.state.class ? this.state.class : null}
                options={this.props.gradesPerBranch ? this.props.gradesPerBranch.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                  : []
                }
                name='class'
                onChange={(e) => { this.studentInfoDropdonHandler(e, 'class') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Section</label>
              <Select
                placeholder='Select'
                name='section'
                // value={this.state.section ? this.state.section : null}
                options={this.props.sectionsPerGradeAdmin ? this.props.sectionsPerGradeAdmin.map(sec => ({
                  value: sec.section.id,
                  label: sec.section.section_name
                })) : []
                }
                onChange={(e) => { this.studentInfoDropdonHandler(e, 'section') }}
              />
            </Grid>
            <Grid item xs={3}>
              <div style={{ marginTop: '27px', marginLeft: '15px' }}>
                <Button variant='contained' disabled={!this.state.studentInfo.branch} onClick={this.handleGetButton} color='primary'>GET
                </Button>
              </div>
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              {searchBox}
            </Grid>
            {this.props.dataLoading ? <CircularProgress open /> : null}
          </Grid>
          {studentTable}
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  sectionsPerGradeAdmin: state.finance.common.sectionsPerGradeAdmin,
  branch: state.finance.common.branchAtAcc,
  branches: state.branches.items,
  studentSearchForAdmin: state.finance.common.studentSearchForAdmin,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  listBranches: () => dispatch(apiActions.listBranches()),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId) => dispatch(apiActions.getSectionMapping(acadMapId)),
  fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user })),
  fetchErpSuggestionsStudentName: (alert, user, session, grade, section, branch, erp) => dispatch(actionTypes.fetchErpSuggestionsStudentName({ alert, user, session, grade, section, branch, erp })),
  fetchStudentInfoForAdmin: (alert, user, session, grade, section, branch) => dispatch(actionTypes.fetchStudentInfoForAdmin({ alert, user, session, grade, section, branch }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentInfoAdm)))
