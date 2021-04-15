import React, {
  useEffect,
  useMemo
} from 'react'
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  withStyles,
  Grid
} from '@material-ui/core'
import CardActionArea from '@material-ui/core/CardActionArea'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { apiActions } from '../../../../../_actions'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  cardWrapper: {
    maxWidth: 300,
    margin: 10
  },
  item: {
    margin: 10
  },
  card: {
    minWidth: 300,
    maxWidth: 300,
    backgroundColor: '#ffff88'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

const AccountantDashboard = ({
  classes,
  fetchPostDateCount,
  countPostDate,
  history,
  dataLoading,
  alert,
  user,
  fetchBranchData,
  branchData,
  fetchBranch,
  branchList,
  switchBranch,
  switchBranchStatus,
  checkReturn,
  checkReturnStatus,
  onlinePendingAdmissionData,
  returnAdmin,
  returnAdminData,
  getPendingOnlineAdmission
}) => {
  const bull = <span className={classes.bullet}>•</span>
  useEffect(() => {
    if (user) {
      fetchBranchData(alert, user)
      fetchBranch(alert, user)
      fetchPostDateCount(alert, user)
      checkReturn(alert, user)
      getPendingOnlineAdmission(alert, user)
    }
  }, [user, fetchBranchData, fetchPostDateCount, fetchBranch, checkReturn, alert, getPendingOnlineAdmission])

  useEffect(() => {
    if (switchBranchStatus) {
      window.location.reload()
    }

    if (returnAdminData) {
      localStorage.setItem('user_profile', JSON.stringify(returnAdminData))
      history.push({
        pathname: '/'
      })
      window.location.reload()
    }
  })
  const card2buttonHandler = (e) => {
    history.push({
      pathname: '/finance/onlineAdmissions'
    })
  }
  const clickHandler = (e) => {
    history.push({
      pathname: '/finance/postDateChequeCount'
    })
  }

  const changeBranchHandler = (e) => {
    if (user) {
      switchBranch(alert, user, e.value)
    }
  }

  const showTotalCount = useMemo(() => {
    return countPostDate && countPostDate.TotalCheque ? countPostDate.TotalCheque : 0
  }, [countPostDate])

  const showTomoCount = useMemo(() => {
    return countPostDate && countPostDate.TotalchequeTodayTommorrow ? countPostDate.TotalchequeTodayTommorrow : 0
  }, [countPostDate])

  const checkAdminClickHandler = () => {
    returnAdmin(alert, user)
    // console.log('hello')
  }

  const selectSwitchBranch = () => (
    <div>
      <label>Switch Branch</label>
      <Select
        style={{ display: 'none' }}
        placeholder='Select Branch'
        options={
          branchList ? branchList.map((branch) =>
            ({ value: branch.id, label: branch.branch_name })) : []
        }
        // onChange={(e) => switchBranch(alert, user, e.value)}
        onChange={(e) => { changeBranchHandler(e) }}
      />
    </div>
  )
  return (
    <React.Fragment>
      <Typography variant='h5' align='center'>Accountant Dashboard</Typography>
      <Typography variant='h6' align='center'>({branchData && branchData.branch_name})</Typography>
      <Grid container spacing={3} justify='space-between' style={{ padding: 15 }}>
        <Grid item xs={3} className={classes.item}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                Post Dated Cheque Count
              </Typography>
              <Typography variant='h6' component='h2'>
                {/* Total Cheque Count {bull} {countPostDate && countPostDate.TotalCheque ? countPostDate.TotalCheque : 0} */}
                Total PDC Count {bull} {showTotalCount}

              </Typography>
              <Typography variant='h6' component='h2'>
                {/* Upcoming Count {bull} {countPostDate && countPostDate.TotalchequeTodayTommorrow ? countPostDate.TotalchequeTodayTommorrow : 0} */}
                Today & Tomorrow PDC Count {bull} {showTomoCount}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small' onClick={(e) => { clickHandler(e) }}>Click for More</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          {checkReturnStatus && <Button color='primary' onClick={checkAdminClickHandler}>Switch to admin</Button>}
          {branchList.length !== 0 && selectSwitchBranch()}
        </Grid>
        <Grid item xs={6} className={classes.spacing}>
          <Card className={classes.card} style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', border: '5px solid skyBlue', marginLeft: 10 }}>
            <CardActionArea style={{ backgroundColor: 'coral' }} onClick={card2buttonHandler}>
              <CardContent>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
            Pending Admissions
                </Typography>
                <Typography variant='h6' className={classes.count_title} component='h6'>
                  <br />
                    Total Pending Admissions : { onlinePendingAdmissionData && onlinePendingAdmissionData.count }
                </Typography>
                <br />
                <br />
                <br />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

AccountantDashboard.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  countPostDate: state.finance.accountantReducer.financeAccDashboard.countPostDate,
  dataLoading: state.finance.common.dataLoader,
  branchData: state.finance.accountantReducer.financeAccDashboard.branchData,
  branchList: state.finance.accountantReducer.financeAccDashboard.branchList,
  switchBranchStatus: state.finance.accountantReducer.financeAccDashboard.switchBranchStatus,
  checkReturnStatus: state.finance.accountantReducer.financeAccDashboard.checkReturnStatus,
  returnAdminData: state.finance.accountantReducer.financeAccDashboard.returnAdminData,
  onlinePendingAdmissionData: state.finance.financeAdminDashBoard.onlinePendingAdmissionData
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getPendingOnlineAdmission: (alert, user) => dispatch(actionTypes.getPendingOnlineAdmission({ alert, user })),
  fetchPostDateCount: (alert, user) => dispatch(actionTypes.fetchPostDateCount({ alert, user })),
  fetchBranchData: (alert, user) => dispatch(actionTypes.fetchAccountantBranch({ alert, user })),
  fetchBranch: (alert, user) => dispatch(actionTypes.fetchBranch({ alert, user })),
  switchBranch: (alert, user, value) => dispatch(actionTypes.switchBranch({ alert, user, value })),
  checkReturn: (alert, user) => dispatch(actionTypes.checkReturn({ alert, user })),
  returnAdmin: (alert, user) => dispatch(actionTypes.returnAdmin({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AccountantDashboard)))
