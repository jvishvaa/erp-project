import React, {
  useEffect,
  useState
} from 'react'
import { withStyles,
  Grid, Badge,
  Button, Paper, Table, TableBody, TableCell, TableHead, TableRow
  // TextField
} from '@material-ui/core/'
import { Notifications, CheckCircle, Cancel, DeleteForever } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../_actions'
// import RequestShuffle from './requestShuffle'
// import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import PendingRequests from './pendingRequestView'
import ApprovedRequestView from './approvedRequestView'
import RejectedRequestView from './rejectedRequestView'
import CancelledRequestView from './cancelledRequestView'
import Layout from '../../../../../Layout'

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

const FeePaymentChangeRequests = ({ classes, session, history, dataLoading, requestList, sessionRed, alert, user, fetchEditRequests }) => {
  const [sessionYear, setSession] = useState(null)
  // const [shuffleStatus, setShuffleStatus] = useState({ label: 'Pending', value: 1 })
  // const [accReasonToApprove, setAccReason] = useState({})

  useEffect(() => {
    // console.log('reason Data: ', studentShuffle)
    if (sessionRed) {
      setSession(sessionRed)
    }
  }, [sessionRed, setSession])

  useEffect(() => {
    if (sessionYear) {
      fetchEditRequests(sessionYear, alert, user)
    }
  }, [fetchEditRequests, sessionYear, alert, user])

  const handleAcademicyear = (e) => {
    // console.log('acad years', e)
    setSession(e)
  }

  const pendingRequestHandler = (id) => {
    console.log('calling pending ')
    history.push({
      pathname: '/finance/Approval/Requests/PendingPaymentRequests',
      session: sessionYear,
      branchId: id,
      status: 'Pending'
    })
  }

  const approvedRequestHandler = (id) => {
    console.log('calling pending ')
    history.push({
      pathname: '/finance/Approval/Requests/ApprovedPaymentRequests',
      session: sessionYear,
      branchId: id,
      status: 'Updated'
    })
  }
  const rejectedRequestHandler = (id) => {
    console.log('calling pending ')
    history.push({
      pathname: '/finance/Approval/Requests/RejectedPaymentRequests',
      session: sessionYear,
      branchId: id,
      status: 'Rejected'
    })
  }
  const cancelledRequestHandler = (id) => {
    console.log('calling pending ')
    history.push({
      pathname: '/finance/Approval/Requests/CancelledPaymentRequests',
      session: sessionYear,
      branchId: id,
      status: 'Cancelled'
    })
  }

  const countTable = () => {
    let table = null
    if (requestList && requestList.length) {
      table = (
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right'>Location Name</TableCell>
                <TableCell align='right'>Branch Name</TableCell>
                <TableCell align='right'>Pending</TableCell>
                <TableCell align='right'>Approved</TableCell>
                <TableCell align='right'>Rejected</TableCell>
                <TableCell align='right'>Cancelled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestList.map((row) => (
                <TableRow>
                  <TableCell align='right'>{row.branch_city ? row.branch_city : ''}</TableCell>
                  <TableCell align='right'>{row.branch_name ? row.branch_name : ''}</TableCell>
                  <TableCell align='right'>
                    <Button color='primary' open={<PendingRequests />} className={classes.btn} onClick={() => pendingRequestHandler(row.branch_id)}>
                      <Badge color='secondary' badgeContent={row.Pending ? row.Pending : 0} className={classes.margin}>
                        <Notifications />
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell align='right'>
                    <Button color='primary' open={<ApprovedRequestView />} className={classes.btn} onClick={() => approvedRequestHandler(row.branch_id)}>
                      <Badge color='secondary' badgeContent={row.Approved ? row.Approved : 0} className={classes.margin}>
                        <CheckCircle />
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell align='right'>
                    <Button color='primary' open={<RejectedRequestView />} className={classes.btn} onClick={() => rejectedRequestHandler(row.branch_id)}>
                      <Badge color='secondary' badgeContent={row.Rejected ? row.Rejected : 0} className={classes.margin}>
                        <DeleteForever />
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell align='right'>
                    <Button color='primary' open={<CancelledRequestView />} className={classes.btn} onClick={() => cancelledRequestHandler(row.branch_id)}>
                      <Badge color='secondary' badgeContent={row.Cancelled ? row.Cancelled : 0} className={classes.margin}>
                        <Cancel />
                      </Badge>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    }
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
            value={sessionYear || sessionRed || null}
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

FeePaymentChangeRequests.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  // session: PropTypes.array.isRequired,
  requestList: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  requestList: state.finance.feePayChange.requestList,
  dataLoading: state.finance.common.dataLoader,
  sessionRed: state.finance.feePayChange.sessionRed
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchEditRequests: (session, alert, user) => dispatch(actionTypes.fetchEditRequests({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(FeePaymentChangeRequests)))
