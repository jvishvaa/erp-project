import React, {
  // useEffect,
  useLayoutEffect,
  useState,
  useEffect
  // useMemo
} from 'react'
import { withStyles, Grid, Button, TextField,
  Paper, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
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
  approve: {
    backgroundColor: '#008000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  reject: {
    backgroundColor: '#FF0000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B0000'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  }
})

let branchStored = null
let fromDateStored = null
let toDateStored = null
let acadStored = null
let reportStored = null
let storedDates = null
const TotalFormCount = ({ classes,
  session,
  history,
  dataLoading,
  fetchFormCount,
  formCount,
  alert,
  user,
  downloadReports,
  // fetchBranches,
  fetchBranchList,
  branchLists,
  ...props }) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' })
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [showTable, setShowTable] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedDates, setSelectedDates] = useState(null)
  const [displayDateRange, setDisplayDateRange] = useState(false)

  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
      // if (branchStored && role === 'FinanceAdmin') {
      //   setSelectedBranch(branchStored)
      //   setFromDate(fromDateStored)
      //   setToDate(toDateStored)
      // }
      // fetchBranches(sessionYear.value, alert, user)
      fetchBranchList(sessionYear.value, alert, user)
    }
  }, [alert, sessionYear.value, fetchBranchList, user])

  useEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (branchStored && role === 'FinanceAdmin') {
      setSelectedBranch(branchStored)
    }
    if (fromDateStored) {
      setFromDate(fromDateStored)
    }
    if (toDateStored) {
      setToDate(toDateStored)
    }
    if (acadStored) {
      setSession(acadStored)
    }
    if (reportStored) {
      setSelectedReport(reportStored)
    }
    if (storedDates) {
      setSelectedDates(storedDates)
    }
  }, [])

  // useEffect(() => {
  //   const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
  //   if (sessionYear && fromDate && toDate && role !== 'FinanceAdmin') {
  //     console.log('Wihout admin +++++++')
  //     fetchFormCount(sessionYear.value, null, fromDate, toDate, alert, user)
  //   } else if (sessionYear && fromDate && toDate && (role === 'FinanceAdmin') && selectedBranch) {
  //     fetchFormCount(sessionYear.value, selectedBranch.value, fromDate, toDate, alert, user)
  //   }
  // }, [sessionYear, fromDate, toDate, alert, user, fetchFormCount, selectedBranch])

  const handleSession = (e) => {
    acadStored = e
    setSession(e)
    setSelectedBranch(null)
    setShowTable(false)
    // fetchBranches(e.value, alert, user)
    fetchBranchList(e.value, alert, user)
  }

  const handleBranch = (e) => {
    setSelectedBranch(e)
    setShowTable(false)
    branchStored = e
  }
  const handleReportType = (e) => {
    setSelectedReport(e)
    reportStored = e
  }

  const handleSelectDate = (e) => {
    if (e.value === 4) {
      setDisplayDateRange(true)
    }
    if (e.value === 1 || e.value === 2 || e.value === 3 || e.value === 5) {
      setDisplayDateRange(false)
    }
    setSelectedDates(e)
    storedDates = e
    setToDate(null)
    setFromDate(null)
  }

  const setFromDateHandler = (e) => {
    setFromDate(e.target.value)
    setShowTable(false)
    fromDateStored = e.target.value
  }

  const setToDateHandler = (e) => {
    setToDate(e.target.value)
    setShowTable(false)
    toDateStored = e.target.value
  }

  const downloadTotalExcel = () => {
    // download the excel
    let totalFormCountUrl = null

    totalFormCountUrl = `${urls.CountAppRegReport}?academic_year=${sessionYear.value}&from_date=${fromDate}&to_date=${toDate}&select_date=${selectedDates.value}&select_report=${selectedReport.value}&branch=${selectedBranch && selectedBranch.value}`
    downloadReports('total_form_report.xlsx', totalFormCountUrl, alert, user)
  }

  const getCount = () => {
    setShowTable(true)
    if (displayDateRange) {
      const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
      if (sessionYear && fromDate && toDate && selectedReport && selectedDates && role !== 'FinanceAdmin') {
        console.log('Wihout admin +++++++')
        fetchFormCount(sessionYear.value, null, fromDate, toDate, selectedReport.value, selectedDates.value, alert, user)
      } else if (sessionYear && fromDate && toDate && (role === 'FinanceAdmin') && selectedBranch && selectedReport && selectedDates) {
        fetchFormCount(sessionYear.value, selectedBranch.value, fromDate, toDate, selectedReport.value, selectedDates.value, alert, user)
      }
    } else {
      const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
      if (sessionYear && selectedReport && selectedDates && role !== 'FinanceAdmin') {
        console.log('Wihout admin +++++++')
        fetchFormCount(sessionYear.value, null, fromDate, toDate, selectedReport.value, selectedDates.value, alert, user)
      } else if (sessionYear && (role === 'FinanceAdmin') && selectedBranch && selectedReport && selectedDates) {
        fetchFormCount(sessionYear.value, selectedBranch.value, fromDate, toDate, selectedReport.value, selectedDates.value, alert, user)
      }
    }
  }

  const showAppListHandler = (result) => {
    if (sessionYear) {
      history.push({
        pathname: '/finance/appformlist',
        state: {
          session: sessionYear.value,
          fromDate: fromDate,
          toDate: toDate,
          selectedReport: selectedReport && selectedReport.value,
          selectedDates: selectedDates && selectedDates.value,
          isAdmin,
          branch: isAdmin ? result && result.branch.id : null
        }
      })
    } else {
      alert.warning('select all fields')
    }
  }
  const showRegListHandler = (result) => {
    if (sessionYear) {
      history.push({
        pathname: '/finance/regformlist',
        state: {
          session: sessionYear.value,
          fromDate: fromDate,
          toDate: toDate,
          selectedReport: selectedReport && selectedReport.value,
          selectedDates: selectedDates && selectedDates.value,
          isAdmin,
          branch: isAdmin ? result && result.branch.id : null
        }
      })
    } else {
      alert.warning('select all fields')
    }
  }
  const showAdmListHandler = (result) => {
    if (sessionYear) {
      history.push({
        pathname: '/finance/admformlist',
        state: {
          session: sessionYear.value,
          fromDate: fromDate,
          toDate: toDate,
          selectedReport: selectedReport && selectedReport.value,
          selectedDates: selectedDates && selectedDates.value,
          isAdmin,
          branch: isAdmin ? result && result.branch.id : null
        }
      })
    } else {
      alert.warning('select all fields')
    }
  }

  let tableData = null

  if (formCount && formCount.length > 0) {
    tableData = formCount.map(result => {
      return (
        <TableRow>
          {selectedReport && selectedReport.value === 1
            ? <React.Fragment>
              <TableCell className='total' style={{ cursor: 'pointer' }} align='center' onClick={() => showAppListHandler(result)}>{result.branch && result.branch.branch_name}</TableCell>
              <TableCell className='total' style={{ cursor: 'pointer' }} align='center' onClick={() => showAppListHandler(result)}>{result.application }</TableCell>
              <TableCell className='total' style={{ cursor: 'pointer' }} align='center' onClick={() => showRegListHandler(result)}>{result.registration }</TableCell>
              <TableCell className='total' style={{ cursor: 'pointer' }} align='center' onClick={() => showAdmListHandler(result)}>{result.admission}</TableCell>
            </React.Fragment>
            : <React.Fragment>
              <TableCell className='total' align='center'>{result.date }</TableCell>
              <TableCell className='total' align='center'>{result.application }</TableCell>
              <TableCell className='total' align='center'>{result.registration }</TableCell>
              <TableCell className='total' align='center'>{result.admission}</TableCell>
            </React.Fragment>
          }
        </TableRow>
      )
    })
  }

  const formCountTableHandler = (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            { selectedReport && selectedReport.value === 1 ? <TableCell align='center'>Branch</TableCell> : <TableCell align='center'>Date</TableCell> }
            <TableCell align='center'>Total Application</TableCell>
            <TableCell align='center'>Total Registration</TableCell>
            <TableCell align='center'>Total Admission</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData}
        </TableBody>
      </Table>
    </Paper>
  )

  return (
    <React.Fragment>
      <Grid container direction='row' justify='flex-end' spacing={8}>
        <Grid item style={{ marginTop: 15 }} xs={3}>
          <Button variant='outlined' disabled={!sessionYear || !selectedReport || !selectedDates} onClick={() => { downloadTotalExcel() }} className={classes.btn}>Download Excel Reports</Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
            id='year'
            value={sessionYear || ''}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={(e) => handleSession(e)}
          />
        </Grid>
        {isAdmin ? (
          <Grid item className={classes.item} xs={3}>
            <label>Branch*</label><br />
            <Select
              placeholder='Select Branch'
              value={selectedBranch}
              options={
                branchLists
                  ? branchLists.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }

              onChange={handleBranch}
            />
          </Grid>
        ) : null}
        <Grid item className={classes.item} xs={3}>
          <label>Report Type*</label><br />
          <Select
            placeholder='Report Type'
            value={selectedReport}
            options={[
              {
                value: 1,
                label: 'Branch Wise'
              },
              {
                value: 2,
                label: 'Date Wise'
              }

            ]}

            onChange={handleReportType}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <label>Select Dates*</label><br />
          <Select
            placeholder='Select Branch'
            value={selectedDates}
            options={[
              {
                value: 1,
                label: 'Today'
              },
              {
                value: 2,
                label: 'Last 7 Days'
              },
              {
                value: 3,
                label: 'Last 30 Days'
              },
              {
                value: 4,
                label: 'Date Range'
              },
              {
                value: 5,
                label: 'Till Date'
              }
            ]}

            onChange={handleSelectDate}
          />
        </Grid>
        {displayDateRange
          ? <React.Fragment>
            <Grid item className={classes.item} xs={3}>
              {/* <label>From Date*</label> */}
              <TextField
                id='from_date'
                type='date'
                required
                InputLabelProps={{ shrink: true }}
                // className={classes.textField}
                value={fromDate || ''}
                onChange={(e) => { setFromDateHandler(e) }}
                margin='normal'
                variant='outlined'
                label='From Date'
              />
            </Grid>
            <Grid item className={classes.item} xs={3}>
              {/* <label>To Date*</label> */}
              <TextField
                id='to_date'
                type='date'
                required
                InputLabelProps={{ shrink: true }}
                // className={classes.textField}
                value={toDate || ''}
                onChange={(e) => { setToDateHandler(e) }}
                margin='normal'
                variant='outlined'
                label='To Date'
              />
            </Grid>
          </React.Fragment>
          : []}
        <Grid item className={classes.item} xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={!selectedDates} onClick={() => { getCount() }} className={classes.btn}>GET</Button>
        </Grid>
      </Grid>
      {formCount && showTable ? formCountTableHandler : ''}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

TotalFormCount.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  formCount: state.finance.accountantReducer.totalFormCount.formCount,
  branchLists: state.finance.accountantReducer.totalFormCount.branchList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchFormCount: (session, branch, fromDate, toDate, report, dates, alert, user) => dispatch(actionTypes.fetchFormCount({ session, branch, fromDate, toDate, report, dates, alert, user })),
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user })),
  fetchBranchList: (branch, alert, user) => dispatch(actionTypes.fetchBranchList({ branch, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(TotalFormCount)))
