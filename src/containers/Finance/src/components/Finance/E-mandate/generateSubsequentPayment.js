import React, { useState } from 'react'
import {
  Grid,
  Button
} from '@material-ui/core'
import Select from 'react-select'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'

const GenerateSubsequentPayment = ({ user, alert, getGenerateSubsequent, generateSubsequentPayment, getGenerateSubsequents, session }) => {
  const [sessionData, setSessionData] = useState({
    value: '2020-21',
    label: '2020-21'
  })
  const [showTable, setShowTable] = useState(false)

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setShowTable(false)
  }

  const getDetailsHandler = () => {
    if (sessionData) {
      getGenerateSubsequents(sessionData && sessionData.value, user, alert)
      setShowTable(true)
    } else {
      alert.warning('Select Year!')
    }
  }

  const subsequentPaymentHandle = (id) => {
    console.log(id)
    const data = {
      branch: id
    }
    generateSubsequentPayment(data, user, alert)
  }

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = getGenerateSubsequent && getGenerateSubsequent.map((val, i) => {
      return {
        domain: val.branch && val.branch.branch_name ? val.branch.branch_name : '',
        name: val.name && val.name ? val.name : '',
        email: val.email && val.email ? val.email : '',
        contact: val.contact && val.contact ? val.contact : '',
        customerId: val.customer_id && val.customer_id ? val.customer_id : '',
        Payment: <Button variant='contained' color='primary' style={{ marginTop: '-5px' }} onClick={() => subsequentPaymentHandle(val.branch && val.branch.id)}> Payment </Button>
      }
    })
    return dataToShow
  }

  let studentErpTable = null
  studentErpTable = <ReactTable
    style={{ marginTop: 60, textAlign: 'center' }}
    data={renderStudentErpTable()}
    // manual
    columns={[
      {
        Header: 'Branch Name',
        accessor: 'domain',
        filterable: false,
        sortable: true
      },
      {
        Header: 'Customer Name',
        accessor: 'name',
        filterable: false,
        sortable: true
      },
      {
        Header: 'Customer Email',
        accessor: 'email',
        filterable: false,
        sortable: true
      },
      {
        Header: 'Contact',
        accessor: 'contact',
        filterable: false,
        sortable: true
      },
      {
        Header: 'Customer Id',
        accessor: 'customerId',
        filterable: false,
        sortable: true
      },
      {
        Header: 'Make Payment',
        accessor: 'Payment',
        filterable: false,
        sortable: true
      }
    ]}
    filterable
    sortable
    defaultPageSize={10}
    showPageSizeOptions={false}
    className='-striped -highlight'
  />

  return (
    <div>
      <Grid container spacing={1} style={{ padding: 10 }} >
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        <Grid item xm={6} md={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={getDetailsHandler}
          >GET</Button>
        </Grid>
      </Grid>
      {showTable ? studentErpTable : []}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  getGenerateSubsequent: state.finance.eMandateReducer.getSubsequentPayment
})

const mapDispatchToProps = (dispatch) => ({
  generateSubsequentPayment: (data, user, alert) => dispatch(actionTypes.generateSubsequentPayment({ data, user, alert })),
  getGenerateSubsequents: (session, user, alert) => dispatch(actionTypes.getGenerateSubsequents({ session, user, alert })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((GenerateSubsequentPayment))
