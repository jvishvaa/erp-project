import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { apiActions } from '../../../_actions'
// import * as actionTypes from '../store/actions'

const AirpayResponse = ({ history }) => {
  const [transId, setTransId] = useState('')
  const [aptransId, setApTransId] = useState('')
  const [amount, setAmount] = useState('')
  const [transStatus, setTransStatus] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    console.log('history', history)
    const urlParams = new URLSearchParams(window.location.search)
    const transId = urlParams.get('TRANSACTIONID')
    const apTransId = urlParams.get('APTRANSACTIONID')
    const amount = urlParams.get('AMOUNT')
    const transStatus = urlParams.get('TRANSACTIONSTATUS')
    const message = urlParams.get('MESSAGE')
    setTransId(transId)
    setApTransId(apTransId)
    setAmount(amount)
    setTransStatus(transStatus)
    setMessage(message)
    console.log('param', urlParams)
    console.log('Param++', transId, apTransId, amount, transStatus, message)
  }, [history])
  const goBackHandler = () => {
    // this.props.history.replace('/dashboard')
    history.replace('/dashboard/')
  }
  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <div>
          <p style={{ textAlign: 'center' }}><b>TRANSACTION</b></p>
          <p>TRANSACTION ID : {transId}</p>
          <p>APTRANSACTION ID :{aptransId}</p>
          <p>AMOUNT : {amount}</p>
          <p>TRANSACTION STATUS : {transStatus}</p>
          <p>MESSAGE : {message}</p>
          <div style={{ width: '40px', margin: 'auto' }}><button onClick={goBackHandler}>Home</button></div>
        </div>
      </div>
    </React.Fragment>
  )
}
const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AirpayResponse)))
