import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core'

import * as actionTypes from '../../store/actions'

const OtherFeeConcession = ({
  session,
  alert,
  user,
  getData,
  erp,
  fetchListConcession,
  listOtherFeeConcession,
  moduleId,
  branchId
}) => {
  // const [value, setValue] = useState(false)
  useEffect(() => {
    if (getData && erp.length >= 10 && session) {
      console.log('Fee Concession')
      fetchListConcession(session, erp, alert, user, branchId, moduleId)
      // setValue(true)
    } else {
      alert.warning('Select Required Fields')
    }
  }, [getData, erp, session, alert, fetchListConcession, user])

  const getfeeDetails = () => {
    let feeList = null
    feeList = listOtherFeeConcession.map((val, index) => (
      <TableRow key={val.id}>
        <TableCell align='left'>{index + 1}</TableCell>
        <TableCell align='left'>{val.other_fee_installments && val.other_fee_installments.other_fee && val.other_fee_installments.other_fee.fee_type_name ? val.other_fee_installments.other_fee.fee_type_name : ''}</TableCell>
        <TableCell align='left'>{val.other_fee_installments && val.other_fee_installments.installment_name ? val.other_fee_installments.installment_name : ''}</TableCell>
        <TableCell align='left'>{val.concession_amount ? val.concession_amount : 0}</TableCell>
        <TableCell align='left'>{val.concession_type_name && val.concession_type_name.type_name ? val.concession_type_name.type_name : ''}</TableCell>
        <TableCell align='left'>{val.concession_date ? val.concession_date : ''}</TableCell>
        <TableCell align='left'>{val.concession_given_by ? val.concession_given_by : ''}</TableCell>
        <TableCell align='left'>{val.remarks ? val.remarks : ''}</TableCell>
        <TableCell align='left'>
          {val.added_by && val.added_by.first_name ? val.added_by.first_name : val.updated_by && val.updated_by.first_name ? val.updated_by.first_name : ''}
        </TableCell>
        <TableCell align='left'>Approved By Accountant</TableCell>
        <TableCell align='left'>{val.added_by && val.added_by.first_name ? val.added_by.first_name : ''}</TableCell>
      </TableRow>
    ))
    return feeList
  }

  const otherFeeTable = () => {
    let data = null
    if (listOtherFeeConcession && listOtherFeeConcession.length > 0) {
      data = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>S.No</TableCell>
              <TableCell align='left'>Fee Type Name</TableCell>
              <TableCell align='left'>Installment Name</TableCell>
              <TableCell align='left'>Concession Amount</TableCell>
              <TableCell align='left'>Concession Name</TableCell>
              <TableCell align='left'>Concession Date</TableCell>
              <TableCell align='left'>Concession Given By</TableCell>
              <TableCell align='left'>Concession Remarks</TableCell>
              <TableCell align='left'>Request From</TableCell>
              <TableCell align='left'>Request Status</TableCell>
              <TableCell align='left'>Approved By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getfeeDetails()}
          </TableBody>
        </Table>
      )
    } else {
      data = (
        <div>No Records Found !!!</div>
      )
    }
    return data
  }

  // const otherFeeTable = useCallback(() => {
  //   let data = null
  //   if (listOtherFeeConcession && listOtherFeeConcession.length > 0) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell align='left'>S.No</TableCell>
  //             <TableCell align='left'>Fee Type Name</TableCell>
  //             <TableCell align='left'>Installment Name</TableCell>
  //             <TableCell align='left'>Concession Amount</TableCell>
  //             <TableCell align='left'>Concession Name</TableCell>
  //             <TableCell align='left'>Concession Date</TableCell>
  //             <TableCell align='left'>Concession Given By</TableCell>
  //             <TableCell align='left'>Concession Remarks</TableCell>
  //             <TableCell align='left'>Request From</TableCell>
  //             <TableCell align='left'>Request Status</TableCell>
  //             <TableCell align='left'>Approved By</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getfeeDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   } else {
  //     data = (
  //       <div>No Records Found !!!</div>
  //     )
  //   }
  //   return data
  // }, [listOtherFeeConcession])

  return (
    <React.Fragment>
      <Typography variant='h5'>Other Fee Concessions</Typography>
      <div style={{ overflow: 'auto' }}>
        {otherFeeTable()}
      </div>
    </React.Fragment>
  )
}

OtherFeeConcession.propTypes = {
  session: PropTypes.string.isRequired,
  alert: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.string.isRequired,
  getData: PropTypes.bool.isRequired,
  erp: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  listOtherFeeConcession: state.finance.accountantReducer.concessionDetails.otherFeeConList
})

const mapDispatchToProps = dispatch => ({
  fetchListConcession: (session, erp, alert, user, branch, moduleId) => dispatch(actionTypes.fetchOtherFeeConcessionList({ session, erp, alert, user, branch, moduleId }))
})

export default connect(mapStateToProps, mapDispatchToProps)(OtherFeeConcession)
