import React, { useState, useEffect } from 'react'

import {
  TextField,
  Grid,
  Button,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
CircularProgress,
TablePagination
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table' // rajneesh
// import 'react-table/react-table.css' // rajneesh
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'

const BillingDetails = ({ dataLoadingStatus, alert, todayEMandateDetails, setDomainDetails, todayDetail, fetchBranches, user, domainNames, branches, session }) => {
  // const [selectedDomain, setSelectedDomain] = useState(null)
  const [sessionData, setSessionData] = useState({
    value: '2020-21',
    label: '2020-21'
  })
  const [todayDetails, setTodayDetails] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [role, setRole] = useState('')
  const [updateamount, setUpdateAmount] = useState('')
  const [updatedate, setUpdateDate] = useState('')
  const [updateendDate, setUpdateEndDate] = useState('')
  const [rowId, setRowId] = useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const selectDomainHandler = (e) => {
  //   setSelectedDomain(e)
  // }
  useEffect(() => {
    let role = ''
    role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    setRole(role)
  }, [])
  useEffect(() => {
    if (role === 'FinanceAdmin' || role === 'FinanceAccountant') {
      let branch
      todayEMandateDetails(branch, sessionData && sessionData.value, role, user, alert)
      setShowTable(true)
    }
  }, [alert, role, sessionData, todayEMandateDetails, user])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setShowTable(false)
  }
  console.log('nitu', branches)
  const getHandler = (e) => {
    // setShowDomainDetail(true)
    let branch
    todayEMandateDetails(branch, sessionData && sessionData.value, role, user, alert)
    // listDomainName(sessionData && sessionData.value, user, alert)
    fetchBranches(sessionData && sessionData.value, alert, user)
    setShowTable(true)
  }

  const editModalHandler = (id, amount, start, end) => {
    setRowId(id)
    setUpdateAmount(amount)
    setUpdateDate(start)
    setUpdateEndDate(end)
    setEditModal(true)
  }

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = todayDetail && todayDetail.map((val, i) => {
      return {
        domain: val.branch && val.branch.branch_name ? val.branch.branch_name : '',
        amount: val.amount ? val.amount : '',
        start_date: val.billing_start_date ? val.billing_start_date : '',
        end_date: val.billing_end_date ? val.billing_end_date : '',
        edit: <Button
          variant='contained'
          color='primary'
          onClick={() => editModalHandler(val.branch && val.branch.id, val.amount, val.billing_start_date, val.billing_end_date)}
        >EDIT</Button>
      }
    })
    return dataToShow
  }

  // let todayDeatilsModal = null
  // if (todayDetails) {
  //   todayDeatilsModal = (
  //     <React.Fragment>
  //       <hr />
  //       <Table>
  //         <TableRow >
  //           <TableHead>
  //             <TableCell style={{ fontSize: 16 }}>Domain Name</TableCell>
  //             <TableCell style={{ fontSize: 16 }}>Amount Per Student</TableCell>
  //             <TableCell style={{ fontSize: 16 }}>Billing Start Date</TableCell>
  //             <TableCell style={{ fontSize: 16 }}>Billing End Date</TableCell>
  //           </TableHead>
  //         </TableRow>
  //         <TableBody>
  //           <div>
  //             {todayDetail && todayDetail.map((val) => {
  //               return (
  //                 <TableRow >
  //                   <TableCell >{val.domain_name && val.domain_name.domain_name}</TableCell>
  //                   <TableCell > {val.amount}</TableCell>
  //                   <TableCell >{val.billing_start_date}</TableCell>
  //                   <TableCell > {val.billing_end_date}</TableCell>
  //                 </TableRow>
  //               )
  //             })}
  //           </div>
  //         </TableBody>
  //       </Table>
  //     </React.Fragment>

  //   )
  // }
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
  //       Header: 'Amount Per Student',
  //       accessor: 'amount',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Billing Start Date',
  //       accessor: 'start_date',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Billing End Date',
  //       accessor: 'end_date',
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

  const getTodayHandler = () => {
    if (sessionData) {
      setTodayDetails(true)
      let newDate = new Date()
      // let date = newDate.getDate()
      let month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
      let year = newDate.getFullYear()
      console.log('today')
      // setEnddate(date + '/' + month + '/' + year)
      // setStartdate(10 + '/' + month + '/' + year)
      // setDate(e.target.value)
      // if (month <= 11) {
      //   if (year + '-' + month + '-' + 10 < year + '/' + month + '/' + date) {
      setEndDate(year + '-' + month + '-' + 10)
      //   } else {
      //     setEndDate(year + '-' + month + 1 + '-' + 10)
      //   }
      // } else {
      //   if (year + '-' + month + '-' + 10 < year + '/' + month + '/' + date) {
      //     setEndDate(year + '-' + month + '-' + 10)
      //   } else {
      //     setEndDate(year + '-' + 0 + 1 + '-' + 10)
      //   }
      // }
      console.log('date', year + '-' + 0 + 1 + '-' + 10)
    } else {
      alert.warning('Select Year!')
    }
    fetchBranches(sessionData && sessionData.value, alert, user)
  }

  const dateHandler = (e) => {
    // if (e.target.value > endDate && endDate) {
    // setDate('')
    // alert.warning('Billing Start Date should be less than End Date ')
    // } else {
    //   setDate(e.target.value)
    // }
    setDate(e.target.value)
    // let newDate = new Date()
    // let date = newDate.getDate()
    // let month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
    // let year = newDate.getFullYear()
    console.log('today')
    // setEnddate(date + '/' + month + '/' + year)
    // setStartdate(10 + '/' + month + '/' + year)
    // setDate(e.target.value)
    let months = e.target.value && e.target.value.split('-')[1]
    // < 10
    // ? '0' + e.target.value.split('-')[1] : e.target.value.split('-')[1]
    let year = e.target.value && e.target.value.split('-')[0]
    if (months <= 11) {
      if (e.target.value < endDate) {
        if (e.target.value.split('-')[2] < 10) {
        //   setUpdateEndDate(year + '-' + months + '-' + 10)
        // } else {
          console.log('qsd', e.target.value.split('-')[2], endDate.split[2])
          setEndDate(year + '-' + months + '-' + 10)
        } else {
          if (months < 10) {
            setEndDate(year + '-' + ('0' + (+months + 1)) + '-' + 10)
          } else {
            setEndDate(year + '-' + (+months + 1) + '-' + 10)
          }
        }
      } else {
        // if (e.target.value.split('-')[2] < 10) {
        if (e.target.value.split('-')[2] < 10) {
          console.log('q1', e.target.value.split('-')[2], endDate.split[2])
          setEndDate(year + '-' + months + '-' + 10)
        } else {
          if (months < 10) {
            setEndDate(year + '-' + ('0' + (+months + 1)) + '-' + 10)
            console.log('q2', year + '-' + ('0' + (+months + 1)) + '-' + 10)
          } else {
            setEndDate(year + '-' + (+months + 1) + '-' + 10)
          }
        }
        // } else {
        //   if (e.target.value.split('-')[2] < 10) {
        //     setEndDate(year + '-' + months + '-' + 10)
        //   } else {
        //     setEndDate(year + '-' + (+months + 1) + '-' + 10)
        //   }
        // }
      }
    } else {
      if (e.target.value < endDate) {
      //   setUpdateEndDate(year + '-' + months + '-' + 10)
      // } else {
        if (e.target.value.split('-')[2] < 10) {
          setEndDate(year + '-' + months + '-' + 10)
        } else {
          setEndDate(year + '-' + (+months - 11) + '-' + 10)
        }
      } else {
        if (e.target.value.split('-')[2] < 10) {
          setEndDate(year + '-' + months + '-' + 10)
        } else {
          setEndDate((+year + 1) + '-' + '0' + (+months - 11) + '-' + 10)
        }
      }
    }
  }

  const endDateHandler = (e) => {
    if (e.target.value < date) {
      // setEndDate('')
      alert.warning('Billing End Date should be greater than Start Date ')
    } else {
      setEndDate(e.target.value)
    }
  }

  const amountHandler = (e) => {
    if (e.target.value <= 0) {
      alert.warning('Amount should be greater then zero!')
      setAmount('')
    } else {
      setAmount(e.target.value)
    }
  }
  const selectDomainHandler = (e) => {
    setSelectedDomain(e)
  }

  const hideTodayDetailsModal = () => {
    setTodayDetails(false)
    setAmount(null)
    setDate('')
    setSelectedDomain('')
  }

  const domainDetailsHandler = (e) => {
    if (amount && date && endDate && selectedDomain && sessionData) {
      const data = {
        branch: selectedDomain && selectedDomain.value,
        amount: amount,
        academic_year: sessionData && sessionData.value,
        billing_start_date: date,
        billing_end_date: endDate
      }
      setDomainDetails(data, user, alert)
      setSelectedDomain('')
      setAmount('')
      setDate('')
      // setEndDate('')
      setTodayDetails(false)
      console.log('data', data)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }

  let todayDeatilsModal = null
  if (todayDetails) {
    todayDeatilsModal = (
      <Modal open={todayDetails} click={hideTodayDetailsModal} large>
        <React.Fragment>
          <h3 style={{ textAlign: 'center' }}>ADD BILLING CYCLE</h3>
          <hr />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3}>
              <label>Branch Name*</label>
              <Select
                placeholder='Select Branch'
                value={selectedDomain}
                options={
                  branches.length
                    ? branches.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
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
                label='Amount(₹)/Student/Month'
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
              >Add </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }

  const updatedateHandler = (e) => {
    // if (e.target.value > endDate && endDate) {
    //   setUpdateDate('')
    //   alert.warning('Billing Start Date should be less than End Date ')
    // } else {
    //   setUpdateDate(e.target.value)
    // }
    setUpdateDate(e.target.value)
    // setDate(e.target.value)
    // let newDate = new Date()
    // let date = newDate.getDate()
    // let month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
    // let year = newDate.getFullYear()
    console.log('today')
    // setEnddate(date + '/' + month + '/' + year)
    // setStartdate(10 + '/' + month + '/' + year)
    // setDate(e.target.value)
    let months = e.target.value && e.target.value.split('-')[1]
    // < 10
    // ? '0' + e.target.value.split('-')[1] : e.target.value.split('-')[1]
    let year = e.target.value && e.target.value.split('-')[0]
    if (months <= 11) {
      if (e.target.value < endDate) {
        if (e.target.value.split('-')[2] < 10) {
        //   setUpdateEndDate(year + '-' + months + '-' + 10)
        // } else {
          console.log('qsd', e.target.value.split('-')[2], endDate.split[2])
          setUpdateEndDate(year + '-' + months + '-' + 10)
        } else {
          if (months < 10) {
            setUpdateEndDate(year + '-' + ('0' + (+months + 1)) + '-' + 10)
          } else {
            setUpdateEndDate(year + '-' + (+months + 1) + '-' + 10)
          }
        }
      } else {
        // if (e.target.value.split('-')[2] < 10) {
        if (e.target.value.split('-')[2] < 10) {
          console.log('q1', e.target.value.split('-')[2], endDate.split[2])
          setUpdateEndDate(year + '-' + months + '-' + 10)
        } else {
          if (months < 10) {
            setUpdateEndDate(year + '-' + ('0' + (+months + 1)) + '-' + 10)
            console.log('q2', year + '-' + ('0' + (+months + 1)) + '-' + 10)
          } else {
            setUpdateEndDate(year + '-' + (+months + 1) + '-' + 10)
          }
        }
        // } else {
        //   if (e.target.value.split('-')[2] < 10) {
        //     setEndDate(year + '-' + months + '-' + 10)
        //   } else {
        //     setEndDate(year + '-' + (+months + 1) + '-' + 10)
        //   }
        // }
      }
    } else {
      if (e.target.value < endDate) {
      //   setUpdateEndDate(year + '-' + months + '-' + 10)
      // } else {
        if (e.target.value.split('-')[2] < 10) {
          setUpdateEndDate(year + '-' + months + '-' + 10)
        } else {
          setUpdateEndDate(year + '-' + (+months - 11) + '-' + 10)
        }
      } else {
        if (e.target.value.split('-')[2] < 10) {
          setUpdateEndDate(year + '-' + months + '-' + 10)
        } else {
          setUpdateEndDate((+year + 1) + '-' + '0' + (+months - 11) + '-' + 10)
        }
      }
    }
  }

  const updateendDateHandler = (e) => {
    if (e.target.value < updatedate) {
      // setUpdateEndDate('')
      alert.warning('Billing End Date should be greater than Start Date ')
    } else {
      setUpdateEndDate(e.target.value)
    }
  }

  const updateamountHandler = (e) => {
    if (e.target.value <= 0) {
      alert.warning('Amount should be greater then zero!')
      setAmount('')
    } else {
      setUpdateAmount(e.target.value)
    }
  }

  const updatedomainDetailsHandler = (e) => {
    if (updateamount && updatedate && updateendDate && sessionData) {
      const data = {
        // domain_name: selectedDomain && selectedDomain.value,
        branch: rowId,
        amount: updateamount,
        academic_year: sessionData && sessionData.value,
        billing_start_date: updatedate,
        billing_end_date: updateendDate
      }
      setDomainDetails(data, user, alert)
      // setSelectedDomain('')
      setUpdateAmount('')
      setUpdateDate('')
      setUpdateEndDate('')
      setEditModal(false)
      console.log('data', data)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }

  const hideEditDetailsModal = () => {
    setEditModal(false)
  }

  let editDeatilsModal = null
  if (editModal) {
    editDeatilsModal = (
      <Modal open={editModal} click={hideEditDetailsModal} large>
        <React.Fragment>
          <h3 style={{ textAlign: 'center' }}>UPDATE BILLING CYCLE</h3>
          <hr />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3}>
              <TextField
                id='amount'
                type='number'
                required
                InputLabelProps={{ shrink: true }}
                value={updateamount}
                onChange={updateamountHandler}
                style={{ marginTop: 18 }}
                margin='dense'
                variant='outlined'
                label='Amount(₹)/Student'
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='date'
                type='date'
                required
                InputLabelProps={{ shrink: true }}
                value={updatedate}
                onChange={updatedateHandler}
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
                value={updateendDate}
                onChange={updateendDateHandler}
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
                onClick={updatedomainDetailsHandler}
              >UPDATE </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }
  return (
    <div>
      <Grid container spacing={3} style={{ padding: 15 }}>
        {role !== 'FinanceAdmin' && role !== 'FinanceAccountant'
          ? <React.Fragment>
            <Grid item xs={9} />
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 18 }}
                onClick={getTodayHandler}
              >ADD BILLING CYCLE</Button>
            </Grid>
          </React.Fragment>
          : []}
        {role !== 'FinanceAdmin' && role !== 'FinanceAccountant'
          ? <React.Fragment>
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
          </React.Fragment>
          : [] }
      </Grid>
      {/* {todayDeatilsModal} */}
      {/* {showTable ? studentErpTable : []} */}
      { showTable ? 
        <React.Fragment>
               <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch Name</TableCell>
                      <TableCell> Amount Per Student</TableCell>
                      <TableCell> Billing Start Date</TableCell>
                      <TableCell> Billing End Date</TableCell>
                      <TableCell> Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {todayDetail && todayDetail.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { val.branch && val.branch.branch_name ? val.branch.branch_name : ''}</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.amount ? val.amount : ''}</TableCell>
                      <TableCell>{val.billing_start_date ? val.billing_start_date : ''} </TableCell>
                      <TableCell>{val.billing_end_date ? val.billing_end_date : ''} </TableCell>
                      <TableCell> {<Button
          variant='contained'
          color='primary'
          onClick={() => editModalHandler(val.branch && val.branch.id, val.amount, val.billing_start_date, val.billing_end_date)}
        >EDIT</Button>} </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={todayDetail && todayDetail.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
        </React.Fragment>
        : [] }
      {todayDeatilsModal}
      {editDeatilsModal}
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
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  // listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  todayEMandateDetails: (branch, session, role, user, alert) => dispatch(actionTypes.todayEMandateDetails({ branch, session, role, user, alert })),
  setDomainDetails: (data, user, alert) => dispatch(actionTypes.setDomainDetails({ data, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)((BillingDetails))
