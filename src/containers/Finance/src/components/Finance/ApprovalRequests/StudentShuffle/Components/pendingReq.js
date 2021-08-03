import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Typography,
  Divider,
  Grid
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import styles from './pendingReq.styles'
import Modal from '../../../../../ui/Modal/modal'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const PendingReq = ({
  classes,
  currentSession,
  currentBranch,
  dataLoading,
  alert,
  user,
  pendingreq,
  fetchStdFee,
  totalAmount,
  stdFeeDetails,
  history,
  rejectReq,
  fetchPendingList,
  rejectRes
}) => {
  const [showModal, setShowModal] = useState(false)
  const [stdErp, setErp] = useState('')
  const [shuffleId, setShuffleId] = useState('')
  const [remarks, setRemarks] = useState('')
  const [stdName, setStdName] = useState('')

  useEffect(() => {
    if (rejectRes) {
      fetchPendingList(currentSession, currentBranch, alert, user)
      setRemarks('')
    }
  }, [rejectRes, fetchPendingList, currentSession, currentBranch, alert, user])

  const remarksChangeHandler = (e) => {
    setRemarks(e.target.value)
  }

  const getPendingModal = (id, erp, name) => {
    setErp(erp)
    fetchStdFee(id, alert, user)
    setShuffleId(id)
    setStdName(name)
    setShowModal(true)
  }

  const hideReqModalHandler = () => {
    setShowModal(false)
  }

  const approvalRequest = (stdErp) => {
    if (remarks) {
      history.push({
        pathname: '/finance/approve_pendingRequest',
        state: {
          erp: stdErp,
          shuffleId: shuffleId,
          nrmlFeeAmt: totalAmount.normalfee_paid_amount,
          othrFeeAmt: totalAmount.otherfee_paid_amount,
          concessionAmt: totalAmount.concession_amount,
          Remarks: remarks
        }
      })
    } else {
      alert.warning('Enter Remarks')
    }
  }

  const rejectRequests = (id) => {
    if (remarks) {
      const data = {
        remarks: remarks,
        studentshuffle_id: id
      }
      rejectReq(data, alert, user)
      hideReqModalHandler()
    } else {
      alert.warning('Enter Remarks')
    }
  }

  const getTableDetails = () => {
    let tableRows = null
    if (pendingreq && pendingreq.length > 0) {
      tableRows = pendingreq.map((val, index) => (
        <TableRow key={val.id}>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left'>{val.erp ? val.erp : ''}</TableCell>
          <TableCell align='left'>{val.student_name ? val.student_name : ''}</TableCell>
          <TableCell align='left'>
            {val.branch_from && val.branch_from.branch_name ? val.branch_from.branch_name : ''}
            {val.grade_from && val.grade_from.grade ? val.grade_from.grade : ''}
          </TableCell>
          <TableCell align='left'>
            {val.branch_to && val.branch_to.branch_name ? val.branch_to.branch_name : ''}
            {val.grade_to && val.grade_to.grade ? val.grade_to.grade : ''}
          </TableCell>
          <TableCell align='left'>{val.reason ? val.reason : ''}</TableCell>
          <TableCell align='left'>{val.shuffle_initiated_by && val.shuffle_initiated_by.first_name ? val.shuffle_initiated_by.first_name : ''}</TableCell>
          <TableCell align='left'>{val.shuffle_initiation_date ? val.shuffle_initiation_date : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status ? val.to_approve_status : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status_date ? val.to_approve_status_date : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status_remarks ? val.to_approve_status_remarks : ''}</TableCell>
          <TableCell align='left'>
            <Button
              className={classes.addButton}
              color='primary'
              size='large'
              variant='outlined'
              onClick={() => getPendingModal(val.id, val.erp, val.student_name)}
            >
              Approval/Reject
            </Button>
          </TableCell>
        </TableRow>
      ))
    } else if (pendingreq && pendingreq.length === 0) {
      tableRows = 'No Records Found !!!'
    }
    return tableRows
  }

  const getFeeRows = () => {
    let tableData = null
    if (stdFeeDetails.Fees && stdFeeDetails.Fees.length > 0) {
      tableData = stdFeeDetails.Fees.map((val, index) => (
        <TableRow key={val.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.fee_type && val.fee_type.fee_type_name ? val.fee_type.fee_type_name : ''}</TableCell>
          <TableCell>{val.installments && val.installments.installment_name ? val.installments.installment_name : ''}</TableCell>
          <TableCell>{val.installments && val.installments.installment_amount ? val.installments.installment_amount : 0}</TableCell>
          <TableCell>{val.discount ? val.discount : 0}</TableCell>
          <TableCell>{val.fine_amount ? val.fine_amount : 0}</TableCell>
          <TableCell>{val.amount_paid ? val.amount_paid : 0}</TableCell>
          <TableCell>{val.balance ? val.balance : 0}</TableCell>
        </TableRow>
      ))
    } else if (stdFeeDetails.Fees && stdFeeDetails.Fees.length === 0) {
      tableData = 'No records Found !!!'
    }
    return tableData
  }

  const getOthrFeeRows = () => {
    let othrRows = null
    if (stdFeeDetails.OtherFees && stdFeeDetails.OtherFees.length > 0) {
      othrRows = stdFeeDetails.OtherFees.map((val, index) => (
        <TableRow key={val.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.other_fee && val.other_fee.fee_type_name ? val.other_fee.fee_type_name : ''}</TableCell>
          <TableCell>{val.other_fee_installments && val.other_fee_installments.installment_name ? val.other_fee_installments.installment_name : ''}</TableCell>
          <TableCell>{val.other_fee_installments && val.other_fee_installments.installment_amount ? val.other_fee_installments.installment_amount : 0}</TableCell>
          <TableCell>{val.discount ? val.discount : 0}</TableCell>
          <TableCell>{val.fine ? val.fine : 0}</TableCell>
          <TableCell>{val.paid_amount ? val.paid_amount : 0}</TableCell>
          <TableCell>{val.balance ? val.balance : 0}</TableCell>
        </TableRow>
      ))
    } else if (stdFeeDetails.OtherFees && stdFeeDetails.OtherFees.length === 0) {
      othrRows = 'No records Found !!!'
    }
    return othrRows
  }

  const getOthrFeeDetails = () => {
    let othrFee = null
    if (stdFeeDetails && stdFeeDetails.OtherFees) {
      othrFee = (
        <div style={{ border: '1px solid black' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Other Fee</TableCell>
                <TableCell>Installment Name</TableCell>
                <TableCell>Installment Amount</TableCell>
                <TableCell>Concession</TableCell>
                <TableCell>Fine Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getOthrFeeRows()}
            </TableBody>
          </Table>
        </div>
      )
    }
    return othrFee
  }

  const getFeeDetails = () => {
    let data = null
    if (stdFeeDetails && stdFeeDetails.Fees) {
      data = (
        <div style={{ border: '1px solid black' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Fee Type</TableCell>
                <TableCell>Installment Name</TableCell>
                <TableCell>Installment Amount</TableCell>
                <TableCell>Concession</TableCell>
                <TableCell>Fine Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFeeRows()}
            </TableBody>
          </Table>
        </div>
      )
      return data
    }
  }

  // const getFeeDetails = useCallback(() => {
  //   let data = null
  //   if (stdFeeDetails) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Sr.</TableCell>
  //             <TableCell>Fee Type</TableCell>
  //             <TableCell>Installment</TableCell>
  //             <TableCell>Fee Amount</TableCell>
  //             <TableCell>Concession</TableCell>
  //             <TableCell>Fine Amount</TableCell>
  //             <TableCell>Paid Amount</TableCell>
  //             <TableCell>Balance</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getFeeRows()}
  //         </TableBody>
  //       </Table>
  //     )
  //     return data
  //   }
  // }, [stdFeeDetails])

  const pendingTable = () => {
    let data = null
    if (currentSession && currentBranch && pendingreq) {
      data = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>S.No</TableCell>
              <TableCell align='left'>Enrollment Code(Old)</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Shuffled From</TableCell>
              <TableCell align='left'>Shuffled To</TableCell>
              <TableCell align='left'>Shuffled Information</TableCell>
              <TableCell align='left'>Request Initiated By</TableCell>
              <TableCell align='left'>Request Date</TableCell>
              <TableCell align='left'>Approved Status</TableCell>
              <TableCell align='left'>Approved Date</TableCell>
              <TableCell align='left'>Approved Remarks</TableCell>
              <TableCell align='left'>Approve/Reject</TableCell>
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

  // const pendingTable = useCallback(() => {
  //   let data = null
  //   if (currentSession && currentBranch && pendingreq) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell align='left'>S.No</TableCell>
  //             <TableCell align='left'>Enrollment Code(Old)</TableCell>
  //             <TableCell align='left'>Name</TableCell>
  //             <TableCell align='left'>Shuffled From</TableCell>
  //             <TableCell align='left'>Shuffled To</TableCell>
  //             <TableCell align='left'>Shuffled Information</TableCell>
  //             <TableCell align='left'>Request Initiated By</TableCell>
  //             <TableCell align='left'>Request Date</TableCell>
  //             <TableCell align='left'>Approved Status</TableCell>
  //             <TableCell align='left'>Approved Date</TableCell>
  //             <TableCell align='left'>Approved Remarks</TableCell>
  //             <TableCell align='left'>Approve/Reject</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getTableDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [currentSession, currentBranch, pendingreq])

  let pendingModal = null
  // if (showModal && totalAmount) {
  if (showModal) {
    pendingModal = (
      <Modal open={showModal} click={hideReqModalHandler} large style={{ padding: '15px' }}>
        <Typography variant='h5' style={{ marginBottom: '10px' }} align='center'>Student Shuffle Details</Typography>
        <Divider className={classes.divider} />
        <div style={{ position: 'relative' }}>
          <Grid container spacing={2} className={classes.root} alignItems='center' justify='center'>
            <Grid item sm={3} md={3} xs={12}>
              <label>ERP :</label>&nbsp;{stdErp || ''}
            </Grid>
            <Grid item sm={3} md={3} xs={12}>
              <label>Student Name :</label>&nbsp;{stdName || ''}
            </Grid>
            <Grid item sm={3} md={3} xs={12}>
              <label>Academic Year :</label>&nbsp;{currentSession.value || ''}
            </Grid>
            <Grid item sm={3} md={3} xs={12}>
              <label>Branch :</label>&nbsp;{currentBranch.label || ''}
            </Grid>
          </Grid>
          <div style={{ overflow: 'auto', marginBottom: '20px' }}>
            <label style={{ padding: '20px', fontSize: '18px' }}>Normal Fee List</label>
            <Divider />
            {getFeeDetails()}
            <label style={{ fontSize: '18px' }}>Total Paid Amount :</label>&nbsp;{totalAmount.normalfee_paid_amount || 0}
          </div>
          <div style={{ overflow: 'auto', marginBottom: '20px' }}>
            <label style={{ padding: '20px', fontSize: '18px' }}>Other Fee List</label>
            <Divider />
            {getOthrFeeDetails()}
            <label style={{ fontSize: '18px' }}>Total Paid Amount :</label>&nbsp;{totalAmount.otherfee_paid_amount || 0}
          </div>
          <Grid container spacing={2} className={classes.root} alignItems='center' justify='center'>
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
          <div style={{ position: 'absolute', right: '20px', marginBottom: '15px' }}>
            <Button
              className={classes.approvalButton}
              color='primary'
              size='large'
              variant='outlined'
              onClick={() => approvalRequest(stdErp)}
            >
              Approve
            </Button>
            <Button
              className={classes.approvalButton}
              color='secondary'
              size='large'
              variant='outlined'
              onClick={() => rejectRequests(shuffleId)}
            >
              Reject
            </Button>
            <Button
              className={classes.approvalButton}
              size='large'
              variant='outlined'
              onClick={hideReqModalHandler}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      <div style={{ overflow: 'auto' }}>
        {pendingTable()}
      </div>
      {pendingModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

PendingReq.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  currentSession: PropTypes.instanceOf(Object).isRequired,
  currentBranch: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  pendingreq: state.finance.studentShuffle.pendingLists,
  stdFeeDetails: state.finance.studentShuffle.studFeeDeatils,
  totalAmount: state.finance.studentShuffle.totalPaidAmount,
  rejectRes: state.finance.studentShuffle.rejectReqres,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchPendingList: (session, branch, alert, user) => dispatch(actionTypes.fetchShufflePendingReq({ session, branch, alert, user })),
  fetchStdFee: (studentId, alert, user) => dispatch(actionTypes.fetchStudentFeeDetails({ studentId, alert, user })),
  rejectReq: (data, alert, user) => dispatch(actionTypes.rejectShuffleRequest({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(PendingReq)))
