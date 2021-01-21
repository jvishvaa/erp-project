import React, { useEffect } from 'react'

import {
  Grid
  // Table,
  // TableCell,
  // TableRow,
  // TableHead,
  // TableBody,

} from '@material-ui/core'

// import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
// import Modal from '../../../ui/Modal/modal'
import { CircularProgress } from '../../../ui'

const OnlineAdmission = ({ dataLoadingStatus, onlinePendingAdmissionData, getPendingOnlineAdmission, alert, airpayPayment, todayEMandateDetails, setDomainDetails, todayDetail, fetchBranches, user, domainNames, branches, session }) => {
  useEffect(() => {
    getPendingOnlineAdmission(alert, user)
  }, [alert, getPendingOnlineAdmission, user])

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = onlinePendingAdmissionData && onlinePendingAdmissionData.data && onlinePendingAdmissionData.data.map((val, i) => {
      return {
        sno: i + 1,
        appBranch: val.application_branch ? val.application_branch : '',
        app: val.application_number ? val.application_number : '',
        status: val.status,
        amount: val.amount ? val.amount : '',
        date: val.date ? val.date : ''
      }
    })
    return dataToShow
  }
  let studentErpTable = null

  studentErpTable = <ReactTable
    style={{ textAlign: 'center' }}
    data={renderStudentErpTable()}
    // manual
    columns={[
      {
        Header: 'SNO',
        accessor: 'sno',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      },
      {
        Header: 'Application Branch',
        accessor: 'appBranch',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      },
      {
        Header: 'Application Number',
        accessor: 'app',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      },
      {
        Header: 'Status',
        accessor: 'status',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      },
      {
        Header: 'Date',
        accessor: 'date',
        // inputFilterable: true,
        // exactFilterable: true,
        filterable: false,
        sortable: true
      }
    ]}
    filterable
    sortable
    defaultPageSize={20}
    showPageSizeOptions={false}
    className='-striped -highlight'
  // Controlled props
  // page={this.state.page}
  // Callbacks
  // onPageChange={page => this.pageChangeHandler(page)}
  />

  return (
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={12}>
          {studentErpTable}
        </Grid>
      </Grid>
      {dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoadingStatus: state.finance.common.dataLoader,
  todayDetail: state.finance.eMandateReducer.todayDetails,
  // domainNames: state.finance.eMandateReducer.domainNames
  branches: state.finance.common.branchPerSession,
  onlinePendingAdmissionData: state.finance.financeAdminDashBoard.onlinePendingAdmissionData
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getPendingOnlineAdmission: (alert, user) => dispatch(actionTypes.getPendingOnlineAdmission({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((OnlineAdmission))
