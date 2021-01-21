import React from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core'
import { connect } from 'react-redux'

import styles from './pendingReq.styles'
// import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const RejectedReq = ({
  classes,
  dataLoading,
  currentSession,
  currentBranch,
  rejectedReq
}) => {
  const getTableDetails = () => {
    let tableRows = null
    if (rejectedReq && rejectedReq.length > 0) {
      tableRows = rejectedReq.map((val, index) => (
        <TableRow key={val.id}>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left'>{val.erp ? val.erp : ''}</TableCell>
          <TableCell align='left'>{val.student_name ? val.student_name : ''}</TableCell>
          <TableCell align='left'>
            {val.branch_from && val.branch_from.branch_name ? val.branch_from.branch_name : ''}&nbsp;>>
            {val.grade_from && val.grade_from.grade ? val.grade_from.grade : ''}
          </TableCell>
          <TableCell align='left'>
            {val.branch_to && val.branch_to.branch_name ? val.branch_to.branch_name : ''}&nbsp;>>
            {val.grade_to && val.grade_to.grade ? val.grade_to.grade : ''}
          </TableCell>
          <TableCell align='left'>{val.reason ? val.reason : ''}</TableCell>
          <TableCell align='left'>{val.shuffle_initiated_by && val.shuffle_initiated_by.first_name ? val.shuffle_initiated_by.first_name : ''}</TableCell>
          <TableCell align='left'>{val.shuffle_initiation_date ? val.shuffle_initiation_date : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status ? val.to_approve_status : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status_date ? val.to_approve_status_date : ''}</TableCell>
          <TableCell align='left'>{val.to_approve_status_remarks ? val.to_approve_status_remarks : ''}</TableCell>
          <TableCell align='left'>
            Rejected
          </TableCell>
        </TableRow>
      ))
    } else if (rejectedReq && rejectedReq.length === 0) {
      tableRows = 'No Records Found !!!'
    }
    return tableRows
  }

  const rejectedTable = () => {
    let data = null
    if (currentSession && currentBranch && rejectedReq) {
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

  // const rejectedTable = useCallback(() => {
  //   let data = null
  //   if (currentSession && currentBranch && rejectedReq) {
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
  // }, [currentSession, currentBranch, rejectedReq])

  return (
    <React.Fragment>
      <div style={{ overflow: 'auto' }}>
        {rejectedTable()}
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

RejectedReq.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  currentSession: PropTypes.instanceOf(Object).isRequired,
  currentBranch: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  rejectedReq: state.finance.studentShuffle.rejectedLists,
  dataLoading: state.finance.common.dataLoader
})

// const mapDispatchToProps = dispatch => ({
//   fetchPendingList: (session, branch, alert, user) => dispatch(actionTypes.fetchShufflePendingReq({ session, branch, alert, user }))
// })

export default connect(mapStateToProps)(withStyles(styles)(RejectedReq))
