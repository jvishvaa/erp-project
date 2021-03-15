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

const ApprovalRequest = ({
  classes,
  location,
  history,
  alert,
  user,
  dataLoading,
  fetchApprovalList,
  approvedList
}) => {
  const [showModal, setShowModal] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})

  useEffect(() => {
    const {
      branch,
      session
    } = location.state
    if (branch && session) {
      console.log('Pending Called', branch, session)
      fetchApprovalList(session, branch, alert, user)
    } else {
      history.replace({
        pathname: '/finance/unassign_feeRequest'
      })
    }
  }, [fetchApprovalList, history, location, alert, user])

  const getStudentModal = (id) => {
    const currentList = approvedList.filter(val => val.id === id)[0]
    setCurrentStudent(currentList)
    setShowModal(true)
  }

  const hideStudentModalHandler = () => {
    setShowModal(false)
  }

  const getApprovedDetails = () => {
    let tableRows = null
    if (approvedList && approvedList.length > 0) {
      tableRows = approvedList.map((val, index) => (
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
            Approved
          </TableCell>
        </TableRow>
      ))
    } else if (approvedList && approvedList.length === 0) {
      tableRows = 'No Records Found !!!'
    }
    return tableRows
  }

  const approvalRequestTable = () => {
    let data = null
    if (approvedList) {
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
            {getApprovedDetails()}
          </TableBody>
        </Table>
      )
    } else {
      data = 'No Records Found'
    }
    return data
  }

  // const approvalRequestTable = useCallback(() => {
  //   let data = null
  //   if (approvedList) {
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
  //           {getApprovedDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [approvedList])

  let studentModal = null
  if (showModal && currentStudent) {
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
      <div style={{ overflow: 'auto' }}>
        {approvalRequestTable()}
      </div>
      {studentModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

ApprovalRequest.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  approvedList: state.finance.unassignFeerequest.approvalReqList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchApprovalList: (session, branch, alert, user) => dispatch(actionTypes.fetchApprovedReqList({ session, branch, alert, user }))
  // clearProps: () => dispatch(actionTypes.clearUnassignProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ApprovalRequest)))
