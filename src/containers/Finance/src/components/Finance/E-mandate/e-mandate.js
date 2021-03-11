import React, { useState } from 'react'

import {
  TextField,
  Grid,
  Button,
  // Table,
  // TableCell,
  // TableRow,
  // TableHead,
  // TableBody
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
TablePagination,
  CircularProgress
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'
import Layout from '../../../../../Layout'


const EMandate = ({ session, dataLoadingStatus, fetchBranches, branches, todayDetail, updateDomainName, dailyDetail, dailyEMandateDetails, todayEMandateDetails, alert, setDomainDetails, listDomainName, user, domainNames, createDomainName }) => {
  const [sessionData, setSessionData] = useState('')
  const [domainModel, setDomainModel] = useState(false)
  const [domainName, setDomainName] = useState('')
  // const [amount, setAmount] = useState('')
  // const [date, setDate] = useState('')
  // const [endDate, setEndDate] = useState('')
  // const [selectedDomain, setSelectedDomain] = useState(null)
  const [showDomainDetail, setShowDomainDetail] = useState(false)
  const [editDomainModal, setEditDomainModal] = useState(false)
  // const [todayDetails, setTodayDetails] = useState(false)
  // const [dailyDetails, setDailyDetails] = useState(false)
  const [updateDomName, setUpdateDomName] = useState('')
  const [domId, setDomId] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentBranch, setCurrentBranch] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setShowDomainDetail(false)
    fetchBranches(e && e.value, alert, user)
  }

  const getHandler = (e) => {
    setShowDomainDetail(true)
    listDomainName(sessionData && sessionData.value, user, alert)
  }

  const hideDetailsModal = (e) => {
    setDomainModel(false)
  }

  const domainNameHandler = (e) => {
    setDomainName(e.target.value)
  }

  const addDomainHandler = () => {
    if (!sessionData) {
      alert.warning('Select Year!')
    }
    if (sessionData && currentBranch) {
      const data = {
        academic_year: sessionData && sessionData.value,
        // branch_name: domainName
        branch:{
          id:currentBranch && currentBranch.value,
          branch_name: currentBranch && currentBranch.label
        }
      }
      createDomainName(data, user, alert)
      setDomainModel(false)
      setDomainName('')
      // setShowDomainDetail(false)
    } else {
      alert.warning('Enter Branch Name!')
    }
  }

  const changehandlerbranch = (e) => {
    setCurrentBranch(e)
  }
  let addDomainModal = null
  if (domainModel) {
    addDomainModal = (
      <Modal open={domainModel} click={hideDetailsModal} medium>
        <h3 style={{ textAlign: 'center' }}>Add Branch</h3>
        <hr />
        <Grid container spacing={3} style={{ padding: 10 }} >
          {/* <Grid item xs={6}>
            <TextField
              id='branch_name'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={domainName}
              onChange={domainNameHandler}
              //   margin='dense'
              variant='outlined'
              label='Branch Name'
            />
          </Grid> */}
          <Grid item xs={6}>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                // isMulti
                value={currentBranch ? currentBranch : ''}
                options={
                  branches.length
                    ? branches.map(branch => ({
                      value: branch.branch.id,
                      label: branch.branch.branch_name
                    }))
                    : []
                }
                onChange={changehandlerbranch}
              />
            </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={addDomainHandler}
            >Add</Button>
          </Grid>
        </Grid>

      </Modal>
    )
  }

  const editDomainNameHandler = (e) => {
    setUpdateDomName(e.target.value)
  }
  const editDomainHandler = () => {
    setEditDomainModal(false)
    if (updateDomName) {
      const data = {
        id: domId,
        branch_name: updateDomName
      }
      updateDomainName(data, user, alert)
    } else {
      setEditDomainModal(true)
      alert.warning('Enter Branch Name!')
    }
  }

  const hideEditDetailsModal = () => {
    setEditDomainModal(false)
  }

  let editDomainModals = null
  if (editDomainModal) {
    editDomainModals = (
      <Modal open={editDomainModal} click={hideEditDetailsModal} medium>
        <h3 style={{ textAlign: 'center' }}>Update Branch Name</h3>
        <hr />
        <Grid container spacing={3} style={{ padding: 10 }} >
          <Grid item xs={6}>
            <TextField
              id='branch_name'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={updateDomName}
              onChange={editDomainNameHandler}
              //   margin='dense'
              variant='outlined'
              label='Branch Name'
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={editDomainHandler}
            >UPDATE</Button>
          </Grid>
        </Grid>

      </Modal>
    )
  }
  // const hideTodayDetailsModal = () => {
  //   setTodayDetails(false)
  // }

  // let todayDeatilsModal = null
  // if (todayDetails) {
  //   todayDeatilsModal = (
  //     <Modal open={todayDetails} click={hideTodayDetailsModal} medium>
  //       <h3 style={{ textAlign: 'center' }}>Today Details</h3>
  //       <hr />
  //       <Table>
  //         <TableRow >
  //           <TableHead>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell />
  //             <TableCell style={{ fontSize: 14 }}>Domain Name</TableCell>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell />
  //             <TableCell />
  //             <TableCell style={{ fontSize: 14 }}>Amount</TableCell>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell />
  //           </TableHead>

  //         </TableRow>
  //         <TableBody>
  //           <div>
  //             {todayDetail && todayDetail.map((val) => {
  //               return (
  //                 <TableRow >
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell >{val.branch_name && val.branch_name.branch_name}</TableCell>
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell > {val.amount}</TableCell>
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                 </TableRow>
  //               )
  //             })}
  //           </div>
  //         </TableBody>
  //       </Table>

  //     </Modal>
  //   )
  // }

  // const hideDailyDetailsModal = () => {
  //   setDailyDetails(false)
  // }

  // let dailyDeatilsModal = null
  // if (dailyDetails) {
  //   dailyDeatilsModal = (
  //     <Modal open={dailyDetails} click={hideDailyDetailsModal} medium>
  //       <h3 style={{ textAlign: 'center' }}>Daily Details</h3>
  //       <hr />
  //       <Table>
  //         <TableRow >
  //           <TableHead>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell style={{ fontSize: 14 }}>Domain Name</TableCell>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell style={{ fontSize: 14 }}>Total User</TableCell>
  //             <TableCell />
  //             <TableCell />
  //             <TableCell style={{ fontSize: 14 }}>Total Amount</TableCell>
  //             <TableCell />
  //             <TableCell />
  //           </TableHead>

  //         </TableRow>
  //         <TableBody>
  //           <div>
  //             {dailyDetail && dailyDetail.map((val) => {
  //               return (
  //                 <TableRow >
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell >{val.branch_name && val.branch_name.branch_name}</TableCell>
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell > {val.total_count_user}</TableCell>
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell > {val.total_amount}</TableCell>
  //                   <TableCell />
  //                   <TableCell />
  //                   <TableCell />
  //                 </TableRow>
  //               )
  //             })}
  //           </div>
  //         </TableBody>
  //       </Table>

  //     </Modal>
  //   )
  // }

  const openDomanModel = () => {
    setDomainModel(true)
  }

  const openEditDomanModel = (id, name) => {
    setEditDomainModal(true)
    setDomId(id)
    setUpdateDomName(name)
  }
  // const dateHandler = (e) => {
  //   if (e.target.value > endDate && endDate) {
  //     setDate('')
  //     alert.warning('Billing Start Date should be less than End Date ')
  //   } else {
  //     setDate(e.target.value)
  //   }
  // }

  // const endDateHandler = (e) => {
  //   if (e.target.value < date) {
  //     setEndDate('')
  //     alert.warning('Billing End Date should be greater than Start Date ')
  //   } else {
  //     setEndDate(e.target.value)
  //   }
  // }

  // const amountHandler = (e) => {
  //   setAmount(e.target.value)
  // }
  // const selectDomainHandler = (e) => {
  //   setSelectedDomain(e)
  // }
  // const domainDetailsHandler = (e) => {
  //   if (amount && date && endDate && selectedDomain && sessionData) {
  //     const data = {
  //       branch_name: selectedDomain && selectedDomain.value,
  //       amount: amount,
  //       academic_year: sessionData && sessionData.value,
  //       billing_start_date: date,
  //       billing_end_date: endDate
  //     }
  //     setDomainDetails(data, user, alert)
  //     setSelectedDomain('')
  //     setAmount('')
  //     setDate('')
  //     setEndDate('')
  //     console.log('data', data)
  //   } else {
  //     alert.warning('Fill all the required Fields!')
  //   }
  // }
  // const getTodayHandler = () => {
  //   if (sessionData) {
  //     todayEMandateDetails(sessionData && sessionData.value, user, alert)
  //     setTodayDetails(true)
  //   } else {
  //     alert.warning('Select Year!')
  //   }
  // }
  // const getDailyHandler = () => {
  //   if (sessionData) {
  //     dailyEMandateDetails(sessionData && sessionData.value, user, alert)
  //     setDailyDetails(true)
  //   } else {
  //     alert.warning('Select Year!')
  //   }
  // }
  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = domainNames && domainNames.map((val, i) => {
      return {
        domain: val.branch_name && val.branch_name ? val.branch_name : '',
        created: val.createdAt.split('T') ? val.createdAt.split('T')[0] : '',
        edit: <Button
          variant='contained'
          color='primary'
          onClick={() => openEditDomanModel(val.id, val.branch_name)}
        >EDIT</Button>
      }
    })
    return dataToShow
  }

  // let studentErpTable = null

  // studentErpTable = <ReactTable
  //   style={{ marginTop: 60, textAlign: 'center' }}
  //   data={renderStudentErpTable()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'Branch Name',
  //       accessor: 'domain',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'CreatedAt',
  //       accessor: 'created',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Edit',
  //       accessor: 'edit',
  //       filterable: false,
  //       sortable: true
  //     }
  //   ]}
  //   filterable
  //   sortable
  //   defaultPageSize={20}
  //   showPageSizeOptions={false}
  //   className='-striped -highlight'
  // />

  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={9} />
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={openDomanModel}
          >ADD Branch</Button>
        </Grid>
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
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={getHandler}
          >GET</Button>
        </Grid>
      </Grid>
      {/* { showDomainDetail
        ? <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs={3}>
            <label>Domain Name*</label>
            <Select
              placeholder='Select Domain'
              value={selectedDomain}
              options={
                domainNames
                  ? domainNames.map((r) => ({
                    value: r.id,
                    label: r.branch_name }))
                  : []
              }
              onChange={selectDomainHandler}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='amount'
              type='number'
              required
              InputLabelProps={{ shrink: true }}
              value={amount}
              onChange={amountHandler}
              style={{ marginTop: 18 }}
              margin='dense'
              variant='outlined'
              label='Amount'
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='date'
              type='date'
              required
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={dateHandler}
              style={{ marginTop: 18 }}
              margin='dense'
              variant='outlined'
              label='Billing Start Date'
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='date'
              type='date'
              required
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={endDateHandler}
              style={{ marginTop: 18 }}
              margin='dense'
              variant='outlined'
              label='Billing End Date'
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={domainDetailsHandler}
            >Add Domain Details</Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={getTodayHandler}
            >Today Details</Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={getDailyHandler}
            >Daily Details</Button>
          </Grid>
        </Grid> : []} */}
      {addDomainModal}
      {editDomainModals}
      {/* {showDomainDetail ? studentErpTable : []} */}
      {
         <React.Fragment>
         <Table>
            <TableHead>
              <TableRow>
                <TableCell>Branch Name</TableCell>
                <TableCell> CreatedAt</TableCell>
                <TableCell> Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {domainNames && domainNames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
              return (
            <TableRow>
               <TableCell> { val.branch && val.branch ? val.branch : ''}</TableCell>
                {/* <TableCell>{ val.id} </TableCell> */}
                <TableCell>{val.createdAt.split('T') ? val.createdAt.split('T')[0] : ''}</TableCell>
                <TableCell><Button
          variant='contained'
          color='primary'
          onClick={() => openEditDomanModel(val.id, val.branch_name)}
        >EDIT</Button>
        </TableCell>
            </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={domainNames && domainNames.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
  </React.Fragment>
      }
      {/* {todayDeatilsModal}
      {dailyDeatilsModal} */}
      {dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoadingStatus: state.finance.common.dataLoader,
  domainNames: state.finance.eMandateReducer.domainNames,
  dailyDetail: state.finance.eMandateReducer.dailyDetails,
  todayDetail: state.finance.eMandateReducer.todayDetails,
  branches: state.finance.common.branchPerSession,
  updatedDomainName: state.finance.eMandateReducer.updatedDomainName
})

const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  updateDomainName: (data, user, alert) => dispatch(actionTypes.updateDomainName({ data, user, alert })),
  dailyEMandateDetails: (session, user, alert) => dispatch(actionTypes.dailyEMandateDetails({ session, user, alert })),
  todayEMandateDetails: (session, user, alert) => dispatch(actionTypes.todayEMandateDetails({ session, user, alert })),
  createDomainName: (data, user, alert) => dispatch(actionTypes.createDomainName({ data, user, alert })),
  listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
  setDomainDetails: (data, user, alert) => dispatch(actionTypes.setDomainDetails({ data, user, alert })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((EMandate))
