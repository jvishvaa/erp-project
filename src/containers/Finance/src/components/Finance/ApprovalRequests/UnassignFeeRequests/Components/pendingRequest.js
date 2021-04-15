import React, { useState, useEffect } from 'react'
import {
  Typography,
  Divider,
  withStyles,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Grid
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import styles from './approvalRequest.styles'
import Modal from '../../../../../ui/Modal/modal'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const PendingRequest = ({
  classes,
  location,
  history,
  fetchPendingList,
  dataLoading,
  alert,
  user,
  pendingList,
  approveRequest,
  rejectRequest
}) => {
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    const {
      branch,
      session
    } = location.state
    if (branch && session) {
      fetchPendingList(session, branch, alert, user)
    } else {
      history.replace({
        pathname: '/finance/unassign_feeRequest'
      })
    }
  }, [fetchPendingList, history, location, alert, user])

  const getPendingModal = (id) => {
    const currentList = pendingList.filter(val => val.id === id)[0]
    // console.log(currentList)
    setCurrentStudent(currentList)
    setShowPendingModal(true)
  }

  const hidePendingModalHandler = () => {
    setShowPendingModal(false)
    setRemarks('')
  }

  const remarksChangeHandler = (e) => {
    setRemarks(e.target.value)
  }

  const getStudentDetails = (id) => {
    const currentList = pendingList.filter(val => val.id === id)[0]
    // console.log(currentList)
    setCurrentStudent(currentList)
    setShowStudentModal(true)
  }

  const hideStudentModalHandler = () => {
    setShowStudentModal(false)
  }

  const getPendingDetails = () => {
    let tableRows = null
    if (pendingList && pendingList.length > 0) {
      tableRows = pendingList.map((val, index) => (
        <TableRow>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left' className={classes.anchorStyle} onClick={() => getStudentDetails(val.id)}>{val.student && val.student.erp ? val.student.erp : ''}</TableCell>
          <TableCell align='left'>{val.student && val.student.name ? val.student.name : ''}</TableCell>
          <TableCell align='left'>
            {val.student && val.student.acad_branch_mapping && val.student.acad_branch_mapping.grade.grade}&nbsp;>>&nbsp;
            {val.student && val.student.acad_section_mapping && val.student.acad_section_mapping.section_name}
          </TableCell>
          <TableCell align='left'>{val.request_code ? val.request_code : ''}</TableCell>
          <TableCell align='left'>{val.request_send_date ? val.request_send_date : ''}</TableCell>
          <TableCell align='left'>{val.fee_type_amount ? val.fee_type_amount : 0}</TableCell>
          <TableCell align='left'>
            <Button
              className={classes.addButton}
              color='primary'
              size='large'
              variant='outlined'
              onClick={() => getPendingModal(val.id)}
            >
              Approval/Reject
            </Button>
          </TableCell>
        </TableRow>
      ))
    } else if (pendingList && pendingList.length === 0) {
      tableRows = 'No Records Found !!!'
    }
    return tableRows
  }

  const pendingRequestTable = () => {
    let data = null
    if (pendingList) {
      data = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>S.No</TableCell>
              <TableCell align='left'>Enrollment Code</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Class</TableCell>
              <TableCell align='left'>Request Code</TableCell>
              <TableCell align='left'>Request Sent Date</TableCell>
              <TableCell align='left'>Amount</TableCell>
              <TableCell align='left'>Approve/Reject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPendingDetails()}
          </TableBody>
        </Table>
      )
    } else {
      data = 'No Records Found'
    }
    return data
  }

  // const pendingRequestTable = useCallback(() => {
  //   let data = null
  //   if (pendingList) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell align='left'>S.No</TableCell>
  //             <TableCell align='left'>Enrollment Code</TableCell>
  //             <TableCell align='left'>Name</TableCell>
  //             <TableCell align='left'>Class</TableCell>
  //             <TableCell align='left'>Request Code</TableCell>
  //             <TableCell align='left'>Request Sent Date</TableCell>
  //             <TableCell align='left'>Amount</TableCell>
  //             <TableCell align='left'>Approve/Reject</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getPendingDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [pendingList])

  const approvalRequest = (id) => {
    const data = {
      academic_year: location.state.session,
      branch: location.state.branch,
      student_id: currentStudent.student.id,
      fee_type: currentStudent.fee_type.id,
      remarks: remarks,
      approved: 1
    }
    approveRequest(id, data, alert, user)
    hidePendingModalHandler()
  }

  const rejectRequests = (id) => {
    const data = {
      academic_year: location.state.session,
      branch: location.state.branch,
      student_id: currentStudent.student.id,
      fee_type: currentStudent.fee_type.id,
      remarks: remarks,
      rejected: 2,
      approved: 0
    }
    rejectRequest(id, data, alert, user)
    hidePendingModalHandler()
  }

  let pendingModal = null
  if (showPendingModal && currentStudent) {
    pendingModal = (
      <Modal open={showPendingModal} click={hidePendingModalHandler} large style={{ padding: '15px' }}>
        <Typography variant='h5' align='center'>Fee Unassign Request</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={4} className={classes.root}>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Student Name :</label>&nbsp;{currentStudent.student && currentStudent.student.name ? currentStudent.student.name : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Class :</label>&nbsp;{currentStudent.student && currentStudent.student.acad_branch_mapping && currentStudent.student.acad_branch_mapping.grade.grade}&nbsp;>>
            &nbsp;{currentStudent.student && currentStudent.student.acad_section_mapping && currentStudent.student.acad_section_mapping.section_name}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Fee Type :</label>&nbsp;{currentStudent.fee_type && currentStudent.fee_type.fee_type_name ? currentStudent.fee_type.fee_type_name : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Fee Amount :</label>&nbsp;{currentStudent.fee_type_amount ? currentStudent.fee_type_amount : 0}
          </Grid>
          <Grid item sm={10} md={10} xs={12}>
            <label className={classes.modalHeading}>Remarks :</label>
            <div>
              <textarea
                style={{ width: '100%' }}
                rows='5'
                name='remarks'
                type='text'
                value={remarks || ''}
                onChange={remarksChangeHandler}
              />
            </div>
          </Grid>
        </Grid>
        <div style={{ position: 'absolute', bottom: '25px', right: '30px' }}>
          <Button
            className={classes.approvalButton}
            color='primary'
            size='large'
            variant='outlined'
            onClick={() => approvalRequest(currentStudent.id)}
          >
            Approval
          </Button>
          <Button
            className={classes.approvalButton}
            color='secondary'
            size='large'
            variant='outlined'
            onClick={() => rejectRequests(currentStudent.id)}
          >
            Reject
          </Button>
          <Button
            className={classes.approvalButton}
            size='large'
            variant='outlined'
            onClick={hidePendingModalHandler}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    )
  }

  let studentModal = null
  if (showStudentModal && currentStudent) {
    studentModal = (
      <Modal open={showStudentModal} click={hideStudentModalHandler} large style={{ padding: '15px' }}>
        <Typography variant='h5' align='center'>Student Details</Typography>
        <Divider className={classes.divider} />
        <Grid container spacing={4} className={classes.root}>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Branch :</label>&nbsp;{currentStudent.branch && currentStudent.branch.branch_name ? currentStudent.branch.branch_name : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Reason :</label>&nbsp;{currentStudent.reason ? currentStudent.reason : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Request Sent By :</label>&nbsp;{currentStudent.erp ? currentStudent.erp : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Fee Type :</label>&nbsp;{currentStudent.fee_type && currentStudent.fee_type.fee_type_name ? currentStudent.fee_type.fee_type_name : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Approved By :</label>&nbsp;{currentStudent.approved_by && currentStudent.approved_by.first_name ? currentStudent.approved_by.first_name : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Approved Date :</label>&nbsp;{currentStudent.approved_date ? currentStudent.approved_date : ''}
          </Grid>
          <Grid item sm={6} md={6} xs={12} style={{ marginBottom: '15px' }}>
            <label className={classes.modalHeading}>Remarks :</label>&nbsp;{currentStudent.remark ? currentStudent.remark : ''}
          </Grid>
        </Grid>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      <div style={{ overflow: 'auto' }}>
        {pendingRequestTable()}
      </div>
      {pendingModal}
      {studentModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

PendingRequest.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  pendingList: state.finance.unassignFeerequest.pendingReqList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchPendingList: (session, branch, alert, user) => dispatch(actionTypes.fetchPendingReqList({ session, branch, alert, user })),
  approveRequest: (id, data, alert, user) => dispatch(actionTypes.approveUnassignFeeReq({ id, data, alert, user })),
  rejectRequest: (id, data, alert, user) => dispatch(actionTypes.rejectUnassignFeeReq({ id, data, alert, user }))
  // clearProps: () => dispatch(actionTypes.clearUnassignProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(PendingRequest)))
