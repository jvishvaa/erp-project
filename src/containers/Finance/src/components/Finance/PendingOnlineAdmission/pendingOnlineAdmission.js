import React, { useEffect, useState } from 'react'

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
import Select from 'react-select'

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
// import ReactTable from 'react-table'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Layout from '../../../../../Layout'
// import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Online Admissions') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

const OnlineAdmission = ({ dataLoadingStatus, branches, fetchBranches, getPendingOnlineAdmission, onlinePendingAdmissionData, alert, user, session }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sessions, setSession] = useState('')
  const [selectedBranches, setSelectedBranches] = useState('')
  const [display, setDisplay] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // useEffect(() => {
  //   getPendingOnlineAdmission(alert, user)
  // }, [alert, getPendingOnlineAdmission, user])

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

  const handleAcademicyear = (e) => {
    console.log('acad years', session)
      setSession(e)
      fetchBranches(e.value, alert, user, moduleId)
      setDisplay(false)
      setSelectedBranches('')
  }

  const changehandlerbranch = (e) => {
    // this.props.fetchGrades(this.props.alert, this.props.user, moduleId, e.value, this.state.session)
    setSelectedBranches(e)
    if (e && session) {
    getPendingOnlineAdmission(sessions?.value, e?.value, alert, user)
    setDisplay(true)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }

  return (
    <Layout>
      <Grid container spacing={3} style={{ padding: '15px' }}>      
      <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={sessions ? sessions : ''}
              options={
                session
                  ? session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={handleAcademicyear}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              // isMulti
              placeholder='Select Branch'
              value={selectedBranches ? selectedBranches : ''}
              options={
                branches.length && branches
                  ? branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }

              onChange={changehandlerbranch}
            />
          </Grid>
     </Grid>
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        {display ?
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
         : []}
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
  // branches: state.finance.common.branchPerSession,
  onlinePendingAdmissionData: state.finance.financeAdminDashBoard.onlinePendingAdmissionData,
  branches: state.finance.common.branchPerSession,
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  getPendingOnlineAdmission: (session, branch, alert, user) => dispatch(actionTypes.getPendingOnlineAdmission({session, branch, alert, user })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
})

export default connect(mapStateToProps, mapDispatchToProps)((OnlineAdmission))
