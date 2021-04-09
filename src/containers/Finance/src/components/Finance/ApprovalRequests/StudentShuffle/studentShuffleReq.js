import React, { useState, useEffect, useCallback } from 'react'
import {
  Grid,
  withStyles
} from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'

import styles from './studentShuffleReq.styles'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Pending from './Components/pendingReq'
import Approval from './Components/approvalReq'
import Rejected from './Components/rejectedReq'
import Layout from '../../../../../../Layout'


const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Approvals/Requests' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Student Shuffle Requests') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

const StudentShuffleReq = ({
  classes,
  alert,
  user,
  session,
  branches,
  fetchBranches,
  dataLoading,
  fetchPendingList,
  pendingreq,
  fetchApprovalList,
  fetchRejectedList
}) => {
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const statusDetails = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' }
  ]

  // useEffect(() => {
  //   setSelectedBranch('')
  // }, [selectedYear])

  useEffect(() => {
    if (selectedYear) {
      fetchBranches(selectedYear.value, alert, user, moduleId)
    }
  }, [selectedYear, fetchBranches, alert, user])

  const academicYearChangeHandler = (e) => {
    setSelectedYear(e)
    fetchBranches(e && e.value, alert, user, moduleId)
  }

  const branchChangeHandler = (e) => {
    setSelectedBranch(e)
  }

  const statusChangeHandler = (e) => {
    setSelectedStatus(e)
  }

  useEffect(() => {
    if (selectedYear && selectedBranch && selectedStatus.value === 1) {
      fetchPendingList(selectedYear, selectedBranch, alert, user)
    } else if (selectedYear && selectedBranch && selectedStatus.value === 2) {
      fetchApprovalList(selectedYear, selectedBranch, alert, user)
    } else if (selectedYear && selectedBranch && selectedStatus.value === 3) {
      fetchRejectedList(selectedYear, selectedBranch, alert, user)
    }
  }, [selectedYear, selectedBranch, selectedStatus, fetchPendingList, fetchApprovalList, fetchRejectedList, alert, user])

  const statusSwitch = useCallback(() => {
    let result = null
    if (selectedYear && selectedBranch && selectedStatus.value === 1) {
      result = (
        <Pending
          currentSession={selectedYear}
          currentBranch={selectedBranch}
          alert={alert}
          user={user}
        />
      )
    } else if (selectedYear && selectedBranch && selectedStatus.value === 2) {
      result = (
        <Approval
          currentSession={selectedYear}
          currentBranch={selectedBranch}
          alert={alert}
          user={user}
        />
      )
    } else if (selectedYear && selectedBranch && selectedStatus.value === 3) {
      result = (
        <Rejected
          currentSession={selectedYear}
          currentBranch={selectedBranch}
          alert={alert}
          user={user}
        />
      )
    }
    return result
  }, [selectedYear, selectedBranch, selectedStatus, alert, user])

  return (
    <Layout>
    <React.Fragment>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={3} md={3} xs={12}>
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
        <Grid item sm={3} md={3} xs={12}>
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
        <Grid item sm={3} md={3} xs={12}>
          <label>Status*</label>
          <Select
            className={classes.textField}
            placeholder='Select Status'
            value={selectedStatus || ''}
            options={
              statusDetails && statusDetails.length > 0
                ? statusDetails.map(status => ({
                  value: status.id ? status.id : '',
                  label: status.name ? status.name : ''
                }))
                : []
            }
            onChange={statusChangeHandler}
          />
        </Grid>
        {/* <Grid item sm={3} md={3} xs={12}>
          <Button
            className={classes.addButton}
            style={{ marginTop: '28px' }}
            color='primary'
            size='small'
            variant='contained'
            // onClick={getApprovalResults}
          >
              Get
          </Button>
        </Grid> */}
      </Grid>
      <div style={{ overflow: 'auto' }}>
        {statusSwitch()}
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

StudentShuffleReq.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.multipleBranchPerSession,
  pendingreq: state.finance.studentShuffle.pendingLists,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchPendingList: (session, branch, alert, user) => dispatch(actionTypes.fetchShufflePendingReq({ session, branch, alert, user })),
  fetchApprovalList: (session, branch, alert, user) => dispatch(actionTypes.fetchShuffleApprLists({ session, branch, alert, user })),
  fetchRejectedList: (session, branch, alert, user) => dispatch(actionTypes.fetchShuffleRejectLists({ session, branch, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StudentShuffleReq))
