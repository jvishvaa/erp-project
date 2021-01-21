import React, { useState, useEffect, useCallback } from 'react'
import {
  Grid,
  withStyles,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'

import styles from './unassignFeeRequest.style'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const UnassignFeeRequests = ({
  classes,
  session,
  alert,
  user,
  dataLoading,
  fetchBranches,
  branches,
  history,
  fetchUnassignRequests,
  unassignedList,
  clearProps,
  sessionValue,
  branchValue
}) => {
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')

  // setting value for acad & branch
  // useEffect(() => {
  //   if (sessionValue) {
  //     setSelectedYear(sessionValue)
  //   }
  //   // if (sessionValue && branchValue) {
  //   //   console.log('branchValue', branchValue)
  //   //   setSelectedBranch(branchValue)
  //   // }
  // }, [sessionValue])

  useEffect(() => {
    setSelectedBranch('')
  }, [selectedYear])

  useEffect(() => {
    if (selectedYear) {
      fetchBranches(selectedYear.value, alert, user)
    }
  }, [selectedYear, fetchBranches, alert, user])

  // useEffect(() => {
  //   if (selectedYear && selectedBranch) {
  //     fetchUnassignRequests(selectedYear.value, selectedBranch.value, alert, user)
  //   }
  // }, [fetchUnassignRequests, selectedYear, selectedBranch, alert, user])

  // for unmount
  useEffect(() => {
    return () => {
      clearProps()
    }
  }, [clearProps])

  const academicYearChangeHandler = (e) => {
    setSelectedYear(e)
  }

  const branchChangeHandler = (e) => {
    setSelectedBranch(e)
  }

  const getApprovalResults = useCallback(() => {
    if (selectedYear && selectedBranch) {
      fetchUnassignRequests(selectedYear, selectedBranch, alert, user)
    } else {
      alert.warning('Select Required Fields')
    }
  }, [fetchUnassignRequests, selectedYear, selectedBranch, alert, user])

  const approvalRequestHandler = (id) => {
    history.push({
      pathname: '/finance/approval_request',
      state: {
        branch: id,
        session: selectedYear.value
      }
    })
  }

  const pendingRequestHandler = (id) => {
    history.push({
      pathname: '/finance/pending_request',
      state: {
        branch: id,
        session: selectedYear.value
      }
    })
  }

  const rejectedRequestHandler = (id) => {
    history.push({
      pathname: '/finance/rejected_request',
      state: {
        branch: id,
        session: selectedYear.value
      }
    })
  }

  const getTableDetails = () => {
    let tableRows = null
    if (unassignedList && unassignedList.length > 0) {
      tableRows = unassignedList.map((val, index) => (
        <TableRow>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left'>{val.branch && val.branch.branch_name ? val.branch.branch_name : ''}</TableCell>
          <TableCell align='left' className={classes.anchorStyle} onClick={() => pendingRequestHandler(val.branch.id)}>
            {val.pending ? val.pending : 0}
          </TableCell>
          <TableCell align='left' className={classes.anchorStyle} onClick={() => approvalRequestHandler(val.branch.id)}>
            {val.approved ? val.approved : 0}
          </TableCell>
          <TableCell align='left' className={classes.anchorStyle} onClick={() => rejectedRequestHandler(val.branch.id)}>
            {val.rejected ? val.rejected : 0}
          </TableCell>
        </TableRow>
      ))
    } else {
      tableRows = 'No Records Found  !!!'
    }
    return tableRows
  }

  const feeRequestTable = () => {
    let data = null
    if (unassignedList && unassignedList.length > 0) {
      data = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>S.No</TableCell>
              <TableCell align='left'>Branch Name</TableCell>
              <TableCell align='left'>Pending</TableCell>
              <TableCell align='left'>Approved</TableCell>
              <TableCell align='left'>Rejected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getTableDetails()}
          </TableBody>
        </Table>
      )
    }
    return data
  }

  // const feeRequestTable = useCallback(() => {
  //   let data = null
  //   if (unassignedList && unassignedList.length > 0) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell align='left'>S.No</TableCell>
  //             <TableCell align='left'>Branch Name</TableCell>
  //             <TableCell align='left'>Pending</TableCell>
  //             <TableCell align='left'>Approved</TableCell>
  //             <TableCell align='left'>Rejected</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getTableDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [unassignedList])

  return (
    <React.Fragment>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={4} md={4} xs={12}>
          <label>Academic Year*</label>
          <Select
            className={classes.textField}
            placeholder='Select Year'
            value={selectedYear || ''}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={academicYearChangeHandler}
          />
        </Grid>
        <Grid item sm={4} md={4} xs={12}>
          <label>Branch*</label>
          <Select
            className={classes.textField}
            placeholder='Select Branch'
            value={selectedBranch || ''}
            options={
              branches && branches.length > 0
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }
            onChange={branchChangeHandler}
          />
        </Grid>
        <Grid item sm={4} md={4} xs={12}>
          <Button
            style={{ marginTop: '20px', padding: 8 }}
            color='primary'
            size='small'
            variant='contained'
            onClick={getApprovalResults}
          >
              Get
          </Button>
        </Grid>
      </Grid>
      <div style={{ overflow: 'auto' }}>
        {feeRequestTable()}
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

UnassignFeeRequests.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.multipleBranchPerSession,
  unassignedList: state.finance.unassignFeerequest.feeRequestLists,
  branchValue: state.finance.unassignFeerequest.branch,
  sessionValue: state.finance.unassignFeerequest.session,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchUnassignRequests: (session, branch, alert, user) => dispatch(actionTypes.fetchUnassignedRequestList({ session, branch, alert, user })),
  clearProps: () => dispatch(actionTypes.clearUnassignProps())
  // fetchBranchAtAcc: (user, alert) => dispatch(actionTypes.fetchBranchAtAcc({ user, alert }))
  // fetchFeeStructureList: (erp, alert, user) => dispatch(actionTypes.fetchFeeStructureList({ erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(UnassignFeeRequests)))
