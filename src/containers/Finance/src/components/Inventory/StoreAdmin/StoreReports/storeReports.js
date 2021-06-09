import React, {
  useEffect,
  useState,
  useLayoutEffect
} from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { urls } from '../../../../urls'
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
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
})

const StoreReports = ({ classes, session, history, dataLoading, fetchBranchLists, branches, alert, user, fetchStoreReport, downloadReports }) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' })
  const [branch, setBranch] = useState(null)
  const [date, setDate] = useState({ label: 'Today', value: 1 })
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [wise, setWise] = useState({ label: 'Branch Wise', value: 1 })
  const [dateWise, setDateWise] = useState({ label: 'Consolidate Datewise', value: 1 })
  const [isAccountant, setIsAccountant] = useState(false)

  useLayoutEffect(() => {
    // const role = (JSON.parse(localStorage.getItem('userDetails'))).personal_info.role
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
      const role = userProfile && userProfile?.personal_info && userProfile?.personal_info?.role?.toLowerCase()
    if (role === 'FinanceAccountant') {
      setIsAccountant(true)
    }
  }, [])
  useEffect(() => {
    // if (!isAccountant) {
      if (sessionYear) {
        fetchBranchLists(sessionYear.value, alert, user)
      }
    // }
  }, [alert, fetchBranchLists, isAccountant, sessionYear, user])

  const handleSession = (e) => {
    setSession(e)
    setBranch(null)
  }

  const handleBranch = (e) => {
    setBranch(e)
  }

  const handleDate = (e) => {
    setDate(e)
  }

  const handleWise = (e) => {
    setWise(e)
  }
  const handleDateWise = (e) => {
    setDateWise(e)
  }

  const showReportHandler = () => {
    // if (!isAccountant && (!sessionYear || !branch || !date || !wise)) {
      if (!sessionYear || !branch || !date || !wise) {
      alert.warning('Fill all the Fields!')
    } else {
    // fetch report
    // this.props.downloadReports('TotalPaidReports.xlsx', urls.DownloadTotalPaidReports, data, this.props.alert, this.props.user)
      let storeUrl = null
      // if (!isAccountant) {
        if (date.value === 4) {
          storeUrl = `${urls.StoreReport}?session_year=${sessionYear.value}&branch=${branch.value}&date=${date.value}&from_date=${startDate}&to_date=${endDate}&type=${wise.value}&formats=${dateWise.value}`
        } else {
          storeUrl = `${urls.StoreReport}?session_year=${sessionYear.value}&branch=${branch.value}&date=${date.value}&type=${wise.value}&formats=${dateWise.value}`
        }
      // } else {
        // if (date.value === 4 && isAccountant) {
        //   storeUrl = `${urls.StoreReport}?session_year=${sessionYear.value}&date=${date.value}&from_date=${startDate}&to_date=${endDate}&formats=${dateWise.value}`
        // } else {
        //   storeUrl = `${urls.StoreReport}?session_year=${sessionYear.value}&date=${date.value}&formats=${dateWise.value}`
        // }
      // }
      // if (!isAccountant) {
        if (session && branch) {
          if (date.value <= 3 || (startDate && endDate)) {
            // fetchStoreReport(sessionYear, branch, date, startDate, endDate, wise, dateWise, alert, user)
            downloadReports('StoreReport.xlsx', storeUrl, alert, user)
          } else {
            alert.warning('Select From and To date!')
          }
        } else {
          alert.warning('Select branch!')
        }
      // } else {
      //   if (date.value <= 3 || (startDate && endDate)) {
      //     // fetchStoreReport(sessionYear, branch, date, startDate, endDate, wise, dateWise, alert, user)
      //     downloadReports('StoreReport.xlsx', storeUrl, alert, user)
      //   } else {
      //     alert.warning('Select From and To date!')
      //   }
      // }
    }
  }

  return (
    <Layout>
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className={classes.item} xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
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
        {/* { isAccountant ? [] */}
          : <Grid item className={classes.item} xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={branch || ''}
              options={
                branches.length
                  ? branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              onChange={(e) => handleBranch(e)}
            />
          </Grid>
        {/* } */}
        <Grid item className={classes.item} xs={3}>
          <label>Date*</label>
          <Select
            placeholder='Select Date'
            value={date || ''}
            options={[
              {
                label: 'Today',
                value: 1
              },
              {
                label: 'Last 7 Days',
                value: 2
              },
              {
                label: 'Last 30 Days',
                value: 3
              },
              {
                label: 'Between Dates',
                value: 4
              }
            ]}
            onChange={(e) => handleDate(e)}
          />
        </Grid>
        {date && date.value === 4
          ? <React.Fragment>
            <Grid item className={classes.item} xs={3}>
              <label>Start Date*</label><br />
              <TextField
                id='start_date'
                value={startDate || ''}
                // label='Start Date:'
                type='date'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  setStartDate(e.target.value)
                }}
              />
            </Grid>
            <Grid item className={classes.item} xs={3}>
              <label>End Date*</label><br />
              <TextField
                id='end_date'
                value={endDate || ''}
                // label='End Date'
                type='date'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  setEndDate(e.target.value)
                }}
              />
            </Grid>
          </React.Fragment>
          : null}
        {/* { isAccountant ? [] */}
          : <Grid item className={classes.item} xs={3} style={{ marginTop: '30px' }}>
            {/* <label>Wise*</label> */}
            <Select
              placeholder='Select Wise'
              value={wise || ''}
              options={[
                {
                  label: 'Branch Wise',
                  value: 1
                },
                {
                  label: 'Vendor Wise',
                  value: 2
                }
              ]}
              onChange={(e) => handleWise(e)}
            />
          </Grid>
        {/* } */}
        <Grid item className={classes.item} xs={3} style={{ marginTop: '30px' }}>
          {/* <label>Wise*</label> */}
          <Select
            placeholder='Select Date Wise'
            value={dateWise || ''}
            options={[
              {
                label: 'Consolidate Datewise',
                value: 1
              },
              {
                label: 'Kit Wise',
                value: 2
              },
              {
                label: 'Detailed',
                value: 3
              },
              {
                label: 'Item Wise',
                value: 4
              },
              {
                label: 'Gender Wise',
                value: 5
              }
            ]}
            onChange={(e) => handleDateWise(e)}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <Button color='primary' variant='contained' style={{ marginTop: '20px' }} onClick={() => { showReportHandler() }} disabled={!session}>Show Report</Button>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

StoreReports.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  // branches: state.finance.common.branchPerSession,
  branches: state.inventory.storeAdmin.storeReport.branchList,
  storeReportList: state.inventory.storeAdmin.storeReport.storeReportList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  // fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchBranchLists: (session, alert, user) => dispatch(actionTypes.fetchBranchLists({ session, alert, user })),
  fetchStoreReport: (session, branch, date, startDate, endDate, wise, dateWise, alert, user) => dispatch(actionTypes.fetchStoreReport({ session, branch, date, startDate, endDate, wise, dateWise, alert, user })),
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(StoreReports)))
