import React, { useEffect } from 'react'

import {
  Grid,
  // Table,
  // TableCell,
  // TableRow,
  // TableHead,
  // TableBody,
  TableHead,
  TableBody,
  TableCell,
  TableRow, 
  TablePagination, Table,
   CircularProgress
} from '@material-ui/core'

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
// import ReactTable from 'react-table'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Layout from '../../../../../Layout'
// import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'

const OnlineAdmission = ({ dataLoadingStatus, onlinePendingAdmissionData, getPendingOnlineAdmission, alert, airpayPayment, todayEMandateDetails, setDomainDetails, todayDetail, fetchBranches, user, domainNames, branches, session }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
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
  // let studentErpTable = null

  // studentErpTable = <ReactTable
  //   style={{ textAlign: 'center' }}
  //   data={renderStudentErpTable()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'SNO',
  //       accessor: 'sno',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Application Branch',
  //       accessor: 'appBranch',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Application Number',
  //       accessor: 'app',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Status',
  //       accessor: 'status',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Amount',
  //       accessor: 'amount',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Date',
  //       accessor: 'date',
  //       // inputFilterable: true,
  //       // exactFilterable: true,
  //       filterable: false,
  //       sortable: true
  //     }
  //   ]}
  //   filterable
  //   sortable
  //   defaultPageSize={20}
  //   showPageSizeOptions={false}
  //   className='-striped -highlight'
  // // Controlled props
  // // page={this.state.page}
  // // Callbacks
  // // onPageChange={page => this.pageChangeHandler(page)}
  // />

  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={12}>
          {/* {studentErpTable} */}
          <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell>Application Branch</TableCell>
                      <TableCell> Application Number</TableCell>
                      <TableCell> Status</TableCell>
                      <TableCell> Amount</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  {onlinePendingAdmissionData && onlinePendingAdmissionData.data && onlinePendingAdmissionData.data.length > 0 ?
                  <TableBody>
                  {onlinePendingAdmissionData && onlinePendingAdmissionData.data && onlinePendingAdmissionData.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                     <TableCell>{val.application_branch ? val.application_branch : ''}</TableCell>
                      <TableCell>{ val.application_number ? val.application_number : ''}</TableCell>
                      <TableCell> {val.status}</TableCell>
                      <TableCell> {val.amount ? val.amount : ''}</TableCell>
                      <TableCell>{val.date ? val.date : ''}</TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
                   : '' }
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={onlinePendingAdmissionData && onlinePendingAdmissionData.data && onlinePendingAdmissionData.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
        </Grid>
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
  branches: state.finance.common.branchPerSession,
  onlinePendingAdmissionData: state.finance.financeAdminDashBoard.onlinePendingAdmissionData
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getPendingOnlineAdmission: (alert, user) => dispatch(actionTypes.getPendingOnlineAdmission({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((OnlineAdmission))
