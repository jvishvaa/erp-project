import React, {
  useEffect
  // useState
} from 'react'
import { withStyles,
  Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow
  // TextField
} from '@material-ui/core/'
// import { Edit } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import RequestShuffle from './requestShuffle'
// import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
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

const RejectedRequestView = ({ classes, history, dataLoading, fetchBranchTransaction, branchPendingList, alert, user }) => {
  useEffect(() => {
    const { session, branchId, status } = history.location
    // Update the document title using the browser API
    if (session && branchId && status) {
      fetchBranchTransaction(session.value, branchId, status, alert, user)
    }
  }, [alert, fetchBranchTransaction, history.location, user])

  const rejectedTableHandler = () => {
    let table = null
    if (branchPendingList && branchPendingList.length) {
      table = (
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request Date</TableCell>
                <TableCell>Transaction Id</TableCell>
                <TableCell>Enrllment Code</TableCell>
                <TableCell>Ref Code/ Admn No</TableCell>
                {/* <TableCell>Roll No</TableCell> */}
                <TableCell>Student Name</TableCell>
                <TableCell>class</TableCell>
                <TableCell>Request From</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Changed By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branchPendingList.map((row) => (
                <TableRow>
                  <TableCell>{row.request_date ? row.request_date : ''}</TableCell>
                  <TableCell>{row.transaction_id ? row.transaction_id : ''}</TableCell>
                  <TableCell>{row.student && row.student.erp ? row.student.erp : ''}</TableCell>
                  <TableCell>123456</TableCell>
                  <TableCell>{row.student && row.student.name ? row.student.name : ''}</TableCell>
                  <TableCell>class 4th >> sec A</TableCell>
                  <TableCell>{row.request_by && row.request_by.first_name ? row.request_by.first_name : ''}</TableCell>
                  <TableCell>{row.request_reason ? row.request_reason : ''}</TableCell>
                  <TableCell>{row.changed_remarks ? row.changed_remarks : ''}</TableCell>
                  <TableCell>changed by name</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    } else {
      table = (
        <div style={{ margin: '20px', fontSize: '16px' }}>No Records Available</div>
      )
    }
    return table
  }

  return (
    <Layout>
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {rejectedTableHandler()}
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

RejectedRequestView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
  // session: PropTypes.array.isRequired,
  // studentShuffle: PropTypes.array.isRequired
  // props: PropTypes.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  branchPendingList: state.finance.feePayChange.branchPendingList
})

const mapDispatchToProps = dispatch => ({
  fetchBranchTransaction: (session, branchId, status, alert, user) => dispatch(actionTypes.fetchBranchTransaction({ session, branchId, status, alert, user }))
  // sendApproveReject: (data, alert, user) => dispatch(actionTypes.sendApproveReject({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(RejectedRequestView)))
