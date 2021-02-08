import React, {
  // useEffect,
  useLayoutEffect,
  useState,
  useEffect
  // useMemo
} from 'react'
import { withStyles, Grid
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import NormalSms from './normalSms'
import ClassWiseSms from './classWiseSms'
import BulkSms from './bulkSmsSender'
import DefaulterSms from './defaulterSms'
import Layout from '../../../../../../Layout'

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
  }
})

let branchStored = null
let fromDateStored = null
let toDateStored = null
let acadStored = null

const CommunicationSMS = ({ classes,
  session,
  history,
  dataLoading,
  dataLoaded,
  fetchFormCount,
  formCount,
  alert,
  user,
  downloadReports,
  fetchBranches,
  ...props }) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' })
  const [smsType, setSmsType] = useState(null)
  // const [toDate, setToDate] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
      // if (branchStored && role === 'FinanceAdmin') {
      //   setSelectedBranch(branchStored)
      //   setFromDate(fromDateStored)
      //   setToDate(toDateStored)
      // }
      fetchBranches(sessionYear.value, alert, user)
    }
  }, [alert, sessionYear.value, fetchBranches, user])

  useEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (branchStored && role === 'FinanceAdmin') {
      setSelectedBranch(branchStored)
    }
    if (fromDateStored) {
      // setFromDate(fromDateStored)
    }
    if (toDateStored) {
      // setToDate(toDateStored)
    }
    if (acadStored) {
      setSession(acadStored)
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
    setSmsType(null)
    // setShowTable(false)
    fetchBranches(e.value, alert, user)
  }

  const handleBranch = (e) => {
    setSelectedBranch(e)
    setSmsType(null)
    // setShowTable(false)
    branchStored = e
  }

  const handleSmsType = (e) => {
    setSmsType(e)
  }

  // const getCount = () => {
  //   setShowTable(true)
  //   const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
  //   if (sessionYear && fromDate && toDate && role !== 'FinanceAdmin') {
  //     console.log('Wihout admin +++++++')
  //     fetchFormCount(sessionYear.value, null, fromDate, toDate, alert, user)
  //   } else if (sessionYear && fromDate && toDate && (role === 'FinanceAdmin') && selectedBranch) {
  //     fetchFormCount(sessionYear.value, selectedBranch.value, fromDate, toDate, alert, user)
  //   }
  // }

  return (
    <Layout>
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 25 }}>
        <Grid item xs={3}>
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
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={selectedBranch}
              options={
                props.branches
                  ? props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={handleBranch}
            />
          </Grid>
        ) : null}
        <Grid item className={classes.item} xs={3}>
          <label>SMS Type*</label>
          <Select
            placeholder='Select SMS Type'
            value={smsType}
            options={[
              {
                label: 'Normal SMS',
                value: 1
              },
              {
                label: 'ClassWise SMS',
                value: 2
              },
              {
                label: 'Bulk SMS',
                value: 3
              },
              {
                label: 'Defaulter SMS',
                value: 4
              }
            ]}
            onChange={handleSmsType}
          />
        </Grid>
        {smsType && smsType.value === 1 && <NormalSms alert={alert} user={user} />}
        {smsType && smsType.value === 2 && <ClassWiseSms session={sessionYear.value} branch={selectedBranch && selectedBranch.value} isAdmin={isAdmin} alert={alert} user={user} />}
        {smsType && smsType.value === 3 && <BulkSms session={sessionYear.value} branch={selectedBranch && selectedBranch.value} alert={alert} user={user} dataLoading={dataLoading} dataLoaded={dataLoaded} />}
        {smsType && smsType.value === 4 && <DefaulterSms session={sessionYear.value} branch={selectedBranch && selectedBranch.value} isAdmin={isAdmin} alert={alert} user={user} />}
        {/* <Grid item className={classes.item} xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={!fromDate || !toDate} onClick={() => { getCount() }} className={classes.btn}>GET</Button>
        </Grid> */}
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

CommunicationSMS.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(CommunicationSMS)))
