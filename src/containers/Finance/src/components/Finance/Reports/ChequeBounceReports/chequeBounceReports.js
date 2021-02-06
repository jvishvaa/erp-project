import React, {
  useEffect,
  useState
} from 'react'
import { withStyles,
  Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button
  // TextField
} from '@material-ui/core/'
// import { Notifications, CheckCircle, Cancel, DeleteForever } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  item: {
    margin: '15px'
  },
  btn: {
    margin: '5px',
    '&:hover': {
      backgroundColor: '#8B008B',
      color: '#fff'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  margin: {
    margin: theme.spacing * 1
  }
})

const ChequeBounceReports = ({ classes, session, branches, fetchBranches, downloadBounceReports, downloadReportsBounce, showBounce, history, dataLoading, bounceReportList, alert, user, chequeBounceList }) => {
  const [sessionYear, setSession] = useState(null)
  const [roleState, setRole] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  // const [accReasonToApprove, setAccReason] = useState({})

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const role = userProfile.personal_info.role.toLowerCase()
    setRole(role)
  }, [])

  const handleAcademicyear = (e) => {
    // console.log('acad years', e)
    setSession(e)
    if (roleState === 'financeadmin') {
      fetchBranches(e.value, alert, user)
      // fetch banks
    }
  }

  const changehandlerbranch = (e) => {
    setBranchId(e)
  }

  const fromDateHandler = (e) => {
    setFromDate(e.target.value)
  }

  const toDateHandler = (e) => {
    setToDate(e.target.value)
  }

  const selectBranch = (e) => {
    if (roleState === 'financeadmin') {
      return (
        <Grid item xs={3} className={classes.item}>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={branchId || ''}
            options={
              branches.length && branches
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }

            onChange={(e) => { changehandlerbranch(e) }}
          />
        </Grid>
      )
    }
  }

  const fetchReportHandler = () => {
    // fetch show list
    if (!sessionYear || !fromDate || !toDate) {
      alert.warning('Fill all the Fields!')
    } else {
      chequeBounceList(roleState, sessionYear && sessionYear.value, branchId && branchId.value, fromDate, toDate, alert, user)
    }
  }

  const downloadReports = () => {
    // do the call
    downloadBounceReports(roleState, 'ChequeBounceReport.xlsx', sessionYear, branchId, fromDate, toDate, alert, user)
    // downloadReportsBounce()
  }

  // useEffect(() => {
  //   if (sessionRed) {
  //     setSession(sessionRed)
  //   }
  // }, [sessionRed, setSession])

  const countTable = () => {
    let table = null
    if (bounceReportList && bounceReportList.length) {
      table = (
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right'>Student Name</TableCell>
                <TableCell align='right'>Grade & Section</TableCell>
                <TableCell align='right'>Student Status</TableCell>
                <TableCell align='right'>Payment Mode</TableCell>
                <TableCell align='right'>Bank Name</TableCell>
                <TableCell align='right'>Branch Name</TableCell>
                <TableCell align='right'>Cheque Number</TableCell>
                <TableCell align='right'>Date Of Cheque</TableCell>
                <TableCell align='right'>Cancelled Date</TableCell>
                <TableCell align='right'>Amount</TableCell>
                <TableCell align='right'>Receipt Number</TableCell>
                <TableCell align='right'>Receipt Date</TableCell>
                <TableCell align='right'>Post Dated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bounceReportList.map((row) => (
                <TableRow>
                  <TableCell align='right'>{row.student && row.student.name ? row.student.name : ''}</TableCell>
                  <TableCell align='right'>{row.student && row.student.grade ? row.student.grade.grade : ''} >> {row.student && row.student.section ? row.student.section.section_name : ''}</TableCell>
                  <TableCell align='right'>{row.student && row.student.is_active ? 'Active' : 'InActive'}</TableCell>
                  <TableCell align='right'>Cheque</TableCell>
                  <TableCell align='right'>{row.bank_name ? row.bank_name : ''}</TableCell>
                  <TableCell align='right'>{row.bank_branch ? row.bank_branch : ''}</TableCell>
                  <TableCell align='right'>{row.cheque_number ? row.cheque_number : ''}</TableCell>
                  <TableCell align='right'>{row.date_of_cheque ? row.date_of_cheque : ''}</TableCell>
                  <TableCell align='right'>{row.cancelled_date ? row.cancelled_date : ''}</TableCell>
                  <TableCell align='right'>{row.amount ? row.amount : ''}</TableCell>
                  <TableCell align='right'>{row.receipt_number ? row.receipt_number : ''}</TableCell>
                  <TableCell align='right'>{row.date_of_receipt ? row.date_of_receipt : ''}</TableCell>
                  <TableCell align='right'>{row.is_post_dated ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    }
    // else {
    //   table = (
    //     <div style={{ margin: '20px', fontSize: '16px' }}>
    //       No Data
    //     </div>
    //   )
    // }
    return table
  }

  return (
    <Layout>
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={3} className={classes.item}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
            value={sessionYear || null}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={handleAcademicyear}
          />
        </Grid>
        {selectBranch()}
        <Grid item xs={3} className={classes.item}>
          <label>From Date*</label>
          <input
            type='date'
            value={fromDate || null}
            onChange={(e) => { fromDateHandler(e) }}
            className='form-control'
            name='startDate'
            id='startDate'
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <label>To Date*</label>
          <input
            type='date'
            value={toDate || null}
            className='form-control'
            name='endDate'
            id='endDate'
            onChange={(e) => { toDateHandler(e) }}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Button style={{ backgroundColor: '#8B008B', color: '#fff', marginTop: '17px' }} varient='contained' onClick={() => { fetchReportHandler() }}>
            GET
          </Button>
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {showBounce
            ? <Button style={{ backgroundColor: '#8B008B', color: '#fff', marginTop: '17px' }} varient='contained' onClick={() => { downloadReports() }}>
            Download Report
            </Button>
            : null
          }
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {countTable()}
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

ChequeBounceReports.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
  // session: PropTypes.array.isRequired,
  // requestList: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.multipleBranchPerSession,
  bounceReportList: state.finance.bounceReports.chequeBounceReportList,
  showBounce: state.finance.bounceReports.showBounce,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  chequeBounceList: (role, session, branchId, fromDate, toDate, alert, user) => dispatch(actionTypes.chequeBounceList({ role, session, branchId, fromDate, toDate, alert, user })),
  downloadBounceReports: (role, reportName, session, branchId, fromDate, toDate, alert, user) => dispatch(actionTypes.downloadChequeBounceReports({ role, reportName, session, branchId, fromDate, toDate, alert, user })),
  downloadReportsBounce: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ChequeBounceReports)))
