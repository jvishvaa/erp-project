import React, { useState } from 'react'

import {
  Grid,
  Button,
  TextField,
  // Table,
  // TableCell,
  // TableRow,
  // TableHead,
  // TableBody,
  CircularProgress
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
// import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'
import Layout from '../../../../../Layout'

const OnlinePayment = ({ dataLoadingStatus, alert, airpayPayment, todayEMandateDetails, setDomainDetails, todayDetail, fetchBranches, user, domainNames, branches, session }) => {
  // const [selectedDomain, setSelectedDomain] = useState(null)
  const [payMode, setPayMode] = useState(null)
  //   const [showTable, setShowTable] = useState(false)
  const [text, setText] = useState('')

  const handleClickSessionYear = (e) => {
    setPayMode(e)
    // setShowTable(false)
    setText('')
  }

  const getSubmitHandler = (e) => {
    if (payMode && text) {
    //   if (payMode && payMode.value === 'Airpay') {
      const data = {
        TRANSACTIONID: text
      }
      airpayPayment(data, payMode, alert, user)
    //   }
    } else {
      alert.warning('Fill the required Fields!')
    }
  }

  const textFieldHandler = (e) => {
    setText(e.target.value)
  }

  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <React.Fragment>
          <Grid item xs={3}>
            <label>Payment Gateway*</label>
            <Select
              placeholder='Select Payment Gateway'
              value={payMode}
              options={
                [
                  {
                    value: 'Airpay',
                    label: 'Airpay'
                  },
                  {
                    value: 'Hdfc',
                    label: 'Hdfc'
                  },
                  {
                    value: 'Axis',
                    label: 'Axis'
                  }
                ]
              }
              onChange={handleClickSessionYear}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='amount'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={text}
              onChange={textFieldHandler}
              style={{ marginTop: 18 }}
              margin='dense'
              variant='outlined'
              label='Merchant Txn Id'
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={getSubmitHandler}
            >SUBMIT</Button>
          </Grid>
        </React.Fragment>
      </Grid>
      {dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoadingStatus: state.finance.common.dataLoader,
  todayDetail: state.finance.eMandateReducer.todayDetails,
  // domainNames: state.finance.eMandateReducer.domainNames
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  airpayPayment: (data, payMode, alert, user) => dispatch(actionTypes.airpayPayment({ data, payMode, alert, user }))
  // listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
//   fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
//   todayEMandateDetails: (branch, session, role, user, alert) => dispatch(actionTypes.todayEMandateDetails({ branch, session, role, user, alert })),
//   setDomainDetails: (data, user, alert) => dispatch(actionTypes.setDomainDetails({ data, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)((OnlinePayment))
