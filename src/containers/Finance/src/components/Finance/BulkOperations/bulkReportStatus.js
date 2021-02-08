import React, { useState, useLayoutEffect, useEffect } from 'react'
import {
  Grid, Button, withStyles, Paper, Table, TableRow, TableCell, TableBody, TableFooter, TablePagination, TableHead
} from '@material-ui/core'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import TablePaginationActions from '../TablePaginationAction'
import Layout from '../../../../../Layout'

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
  container: {
    width: '95%',
    margin: 'auto',
    marginTop: '5px'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  downloadFormat: {
    color: theme.palette.primary.main,
    position: 'absolute',
    right: '15px',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})

const BulkReportStatus = ({ classes, reports, session, branches, bulkReportList, alert, user, fetchBranches, fetchBulkReportStatus, statusList, dataLoaded, dataLoading }) => {
  const [sessionData, setSessionData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    if ((page || rowsPerPage) && sessionData && reportType) {
      fetchBulkReportStatus(sessionData && sessionData.value, branchData && branchData.value, reportType && reportType.value, isAdmin, page + 1, rowsPerPage || 10, user, alert)
    }
  }, [page, rowsPerPage, sessionData, branchData, alert, user, isAdmin, fetchBulkReportStatus, reportType])

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setBranchData(null)
    if (isAdmin) {
      fetchBranches(e.value, alert, user)
    }
    bulkReportList(user, alert)
  }

  const changehandlerbranch = (e) => {
    setReportType(null)
    setBranchData(e)
  }
  const changeReportHandler = (e) => {
    setReportType(e)
  }
  const getReportStatus = () => {
    // fetching report status
    if (!sessionData || !reportType) {
      alert.warning('Select All fields!')
      return
    }
    fetchBulkReportStatus(sessionData && sessionData.value, branchData && branchData.value, reportType && reportType.value, isAdmin, page + 1, rowsPerPage || 10, user, alert)
  }

  const handleChangePage = (event, newPage) => {
    console.log('change page: ', event, newPage)
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  const Wait = () => (
    <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#FFA500', margin: '0 auto' }} />
  )
  const Failed = () => (
    <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#ff0000', margin: '0 auto' }} />
  )
  const Completed = () => (
    <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#7CFC00', margin: '0 auto' }} />
  )
  const getStatusHandler = () => {
    return (
      <Grid container spacing={8}>
        <Grid item className={classes.item} style={{ display: 'flex', justifyContent: 'space-around' }} xs={6}>
          <div><Wait /> {'Pending'}</div>
          <div><Failed /> {'Failed'}</div>
          <div><Completed /> {'Completed'}</div>
        </Grid>
        <Grid item className={classes.item} xs={12}>
          <Paper style={{ marginTop: 15, width: '100%' }}>
            <Table className={classes.root}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Branch</TableCell>
                  <TableCell align='center'>Report Type</TableCell>
                  <TableCell align='center'>Uploaded Date</TableCell>
                  <TableCell align='center'>Report Status</TableCell>
                  <TableCell align='center'>Download File</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusList && statusList.results.length
                  ? (statusList.results.map((row) => {
                    return (
                      <TableRow>
                        <TableCell align='center'>{row.branch && row.branch.branch_name}</TableCell>
                        <TableCell align='center'>{row.report_type}</TableCell>
                        <TableCell align='center'>{row.uploaded_date}</TableCell>
                        <TableCell align='center'>{row.report_status === 'Pending' ? <Wait /> : row.report_status === 'Failed' ? <Failed /> : <Completed />}</TableCell>
                        <TableCell align='center'>{row.download_file && row.download_file.length ? <a href={row.download_file} target='_blank'>{row.download_file.substr(row.download_file.lastIndexOf('/') + 1)}</a> : 'NA'}</TableCell>
                      </TableRow>
                    )
                  }))
                  : null}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+statusList.count / (+rowsPerPage || 10))}`}
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    rowsPerPage={rowsPerPage || 10}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' }
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }

  return (
    <Layout>   
      <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        {isAdmin
          ? <Grid item xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={branchData}
              options={
                branches.length
                  ? branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }
              onChange={changehandlerbranch}
            />
          </Grid>
          : null}
        <Grid item xs={3}>
          <label>Report Type*</label>
          <Select placeholder='Select Report' value={reportType} onChange={changeReportHandler}
            options={
              reports.length
                ? reports.map(reportList => ({
                  value: reportList.id ? reportList.id : '',
                  label: reportList.report_name ? reportList.report_name : ''
                }))
                : []
            }
          />
        </Grid>
        <Grid item xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={false} onClick={getReportStatus} className={classes.btn}>GET</Button>
        </Grid>
      </Grid>
      {(statusList && statusList.results && statusList.results.length) ? getStatusHandler() : null}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
 
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader,
  statusList: state.finance.bulkOperation.reportStatusList,
  reports: state.finance.bulkOperation.bulkReportList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchBulkReportStatus: (sessionYear, branch, reportType, isAdmin, page, pageSize, user, alert) => dispatch(actionTypes.fetchBulkReportStatus({ sessionYear, branch, reportType, isAdmin, page, pageSize, user, alert })),
  bulkReportList: (user, alert) => dispatch(actionTypes.bulkReportList({ user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(BulkReportStatus)))
