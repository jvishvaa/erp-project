import React, { useState, useEffect } from 'react'
import {
  Typography,
  Divider,
  withStyles,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import styles from './approvalRequest.styles'
import Modal from '../../../../../ui/Modal/modal'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const RejectedRequest = ({
  classes,
  location,
  history,
  alert,
  user,
  dataLoading,
  fetchRejectedList,
  rejectedList
}) => {
  const [showModal, setShowModal] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})

  useEffect(() => {
    const {
      branch,
      session
    } = location.state
    if (branch && session) {
      fetchRejectedList(session, branch, alert, user)
    } else {
      history.replace({
        pathname: '/finance/unassign_feeRequest'
      })
    }
  }, [fetchRejectedList, history, location, alert, user])

  const getStudentModal = (id) => {
    const currentList = rejectedList.filter(val => val.id === id)[0]
    setCurrentStudent(currentList)
    setShowModal(true)
  }

  const hideStudentModalHandler = () => {
    setShowModal(false)
  }

  const getRejectedDetails = () => {
    let tableRows = null
    if (rejectedList && rejectedList.length > 0) {
      tableRows = rejectedList.map((val, index) => (
        <TableRow onClick={() => getStudentModal(val.id)}>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left'>{val.student && val.student.erp ? val.student.erp : ''}</TableCell>
          <TableCell align='left'>{val.student && val.student.name ? val.student.name : ''}</TableCell>
          <TableCell align='left'>
            {val.student && val.student.acad_branch_mapping && val.student.acad_branch_mapping.grade.grade}&nbsp;>>&nbsp;
            {val.student && val.student.acad_section_mapping && val.student.acad_section_mapping.section_name}
          </TableCell>
          <TableCell align='left'>{val.request_code ? val.request_code : ''}</TableCell>
          <TableCell align='left'>{val.request_send_date ? val.request_send_date : ''}</TableCell>
          <TableCell align='left'>{val.fee_type_amount ? val.fee_type_amount : 0}</TableCell>
          <TableCell align='left'>
            Rejected
          </TableCell>
        </TableRow>
      ))
    } else if (rejectedList && rejectedList.length === 0) {
      tableRows = 'No Records Found !!!'
    }
    // tableRows = (
    //   <TableRow onClick={getStudentModal}>
    //     <TableCell align='left'>S.No</TableCell>
    //     <TableCell align='left'>Enrollment Code</TableCell>
    //     <TableCell align='left'>Name</TableCell>
    //     <TableCell align='left'>Class</TableCell>
    //     <TableCell align='left'>Request Code</TableCell>
    //     <TableCell align='left'>Request Sent Date</TableCell>
    //     <TableCell align='left'>Amount</TableCell>
    //     <TableCell align='left'>Rejected</TableCell>
    //   </TableRow>
    // )
    return tableRows
  }

  const rejectedRequestTable = () => {
    let data = null
    if (rejectedList) {
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
              <TableCell align='left'>Approve Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRejectedDetails()}
          </TableBody>
        </Table>
      )
    } else {
      data = 'No Records Found'
    }
    return data
  }

  // const rejectedRequestTable = useCallback(() => {
  //   let data = null
  //   if (rejectedList) {
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
  //             <TableCell align='left'>Approve Status</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getRejectedDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [rejectedList])

  let studentModal = null
  if (showModal) {
    studentModal = (
      <Modal open={showModal} click={hideStudentModalHandler} large style={{ padding: '15px' }}>
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
      {/* <Typography variant='h5' align='center'>Rejected Requests</Typography>
      <Divider className={classes.divider} /> */}
      <div style={{ overflow: 'auto' }}>
        {rejectedRequestTable()}
      </div>
      {studentModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

RejectedRequest.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  rejectedList: state.finance.unassignFeerequest.rejectedReqList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchRejectedList: (session, branch, alert, user) => dispatch(actionTypes.fetchRejectedReqList({ session, branch, alert, user }))
  // clearProps: () => dispatch(actionTypes.clearUnassignProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(RejectedRequest)))
