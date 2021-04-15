import React, { useEffect, useState, useCallback } from 'react'
// import ReactTable from 'react-table'
import { Button } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import CancelIcon from '@material-ui/icons/Cancel'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
// import 'react-table/react-table.css'
import './Wallet.css'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'

function AllStudentTransection (props) {
  let currBrnch = JSON.parse(localStorage.getItem('user_profile'))
  const [ allTransactions, setallTransactions ] = useState()
  const [ moreDetails, setMoreDetails ] = useState(false)
  const [ modelData, setModelData ] = useState()

  const handleClick = (props) => {
    if (moreDetails) {
      setMoreDetails(false)
    } else {
      setMoreDetails(true)
    }
    setModelData(allTransactions[props.index])
  }
  const columns = [{
    Header: 'Transaction Id',
    accessor: 'TransactionId'
  },
  {
    Header: 'Fee Type',
    accessor: 'fee_type_name'
  },
  {
    Header: 'Amount',
    accessor: 'amount'
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'More Details',
    accessor: 'more',
    Cell: props => {
      return (
        <Button color='primary' onClick={() => { handleClick(props) }} style={{ fontSize: '20px' }}> more</Button>
      )
    }
  }
  ]
  const display = {
    display: 'block'
  }
  const hide = {
    display: 'none'
  }
  var modal = []
  if (modelData) {
    modal.push(
      <div className='modal-container' style={moreDetails ? display : hide}>
        <div>
          <Button color='primary' style={{ float: 'right', top: 'fixed' }}> <CancelIcon onClick={handleClick} /> </Button>
        </div>
        <div>
          <h1 style={{ textAlign: 'center', color: '#900C3F' }}>All Details</h1>
          <div className='modal-content'>
            <p>TransactionId : {modelData.transaction_id} </p>
            <p> Amount : {modelData.amount} </p>
            <p> Installment Name : {modelData.installment.installment_name} </p>
            <p> Fee Type : {modelData.fee_type.fee_type_name} </p>
            <p> Payment Choice : {modelData.payment_choice === '1' ? 'Cash' : 'NA' || modelData.payment_choice === '2' ? 'Cheque' : 'NA' || modelData.payment_choice === '3' ? 'Internet' : 'NA' || modelData.payment_choice === '4' ? 'Swipe' : 'NA' || modelData.payment_choice === '5' ? 'Online' : 'NA'} </p>
            <p> Added By : {modelData.added_by.first_name} </p>
            <p> Paid Date : {modelData.paid_date} </p>
            <p> Other Fee : {modelData.other_fee ? modelData.other_fee : 'NA' } </p>
            <p> Other Installment Fee : {modelData.other_fee_inst ? modelData.other_fee_inst : 'NA' } </p>
            <p> Updated By  : {modelData.updated_by ? modelData.updated_by : 'NA' } </p>
          </div>
        </div>
      </div>
    )
  }
  const isUpdated = useCallback(() => {
    if (currBrnch.current_acad_session) {
      let url = `${urls.AllStudentTransection}?academic_year=${currBrnch.current_acad_session}&branch=${currBrnch.branch_id}&grade=${currBrnch.grade_id}&student=${currBrnch.student_id}`
      axios
        .get(url, {
          headers: {
            'Authorization': 'Bearer ' + props.user
          }
        })
        .then(res => {
          setallTransactions(res.data.credited_info)
        })
        .catch(error => {
          props.alert.error('Error Occured')
          console.log(error)
        })
    }
  }, [currBrnch.current_acad_session, currBrnch.branch_id, currBrnch.grade_id, currBrnch.student_id, props.user, props.alert])
  useEffect(() => {
    isUpdated()
  }, [isUpdated])
  var data = []
  if (allTransactions) {
    for (var i = 0; i < allTransactions.length; i++) {
      let temp = {}
      temp['TransactionId'] = allTransactions[i].transaction_id
      temp['fee_type_name'] = allTransactions[i].fee_type.fee_type_name
      temp['amount'] = <div> &#8377;{allTransactions[i].amount}</div>
      temp['status'] = 'success'
      temp['more'] = 'more'
      data.push(temp)
    }
  }
  return (
    <div>
      {
        // allTransactions
        //   ? <ReactTable
        //     style={{ fontSize: '20px', textAlign: 'center', fontWeight: 'bold', textShadow: '2px 2px white', fontStyle: 'italic' }}
        //     data={data}
        //     columns={columns}
        //     defaultPageSize={4}
        //     pageSizeOptions={[2, 4, 6, 10]}
        //   /> : <div style={{ alignItems: 'center' }}> <CircularProgress /></div> //rajneesh
      }
      { modal }
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
})
export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AllStudentTransection)))
