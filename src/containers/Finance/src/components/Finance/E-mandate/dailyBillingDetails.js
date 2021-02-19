import React, { useState, useEffect } from 'react'

import {
//   TextField,
  Grid,
  Button,
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
import Modal from '../../../ui/Modal/modal'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
// import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'
import DailyBillingDetailsPage from './dailyDetails'

const DailyBillingDetails = ({ dataLoadingStatus, alert, fetchBranches, todayEMandateDetails, branches, domainDailyBillStatus, domainDailyBillGenerateStatus, totalBillingDetail, totalBillingDetails, listDomainName, user, domainNames, session }) => {
  // const [selectedDomain, setSelectedDomain] = useState(null)
  const [sessionData, setSessionData] = useState('')
  // const [domainDetails, setDomainDetails] = useState(false)
  // const [domainName, setDomainName] = useState(false)
  //   const [amount, setAmount] = useState('')
  //   const [date, setDate] = useState('')
  //   const [endDate, setEndDate] = useState('')
  //   const [selectedDomain, setSelectedDomain] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [ShowDailyDetPage, setShowDailyDetPage] = useState(false)
  const [hide, setHide] = useState(true)
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [domainDailyBillStatuss, setDomainDailyBillStatus] = useState([])
  // const [data, setData] = useState([])
  // const [endDate, setEnddate] = useState(null)
  // const [startDate, setStartdate] = useState(null)
  const [role, setRole] = useState('')
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
    if (totalBillingDetail && totalBillingDetail.length > 0) {
      let data2 = totalBillingDetail
      let data1 = []
      data1.push(data2[0])
      setData(data1)
      console.log('qas', data1)
    }
  }, [totalBillingDetail])

  useEffect(() => {
    if (domainDailyBillStatus && domainDailyBillStatus.length > 0) {
      setDomainDailyBillStatus(domainDailyBillStatus)
    }
  }, [domainDailyBillStatus])

  useEffect(() => {
    if (role === 'FinanceAdmin' || role === 'FinanceAccountant') {
      // listDomainName(sessionData && sessionData.value, user, alert)
      totalBillingDetails(role, '2020-21', 3, user, alert)
      setShowTable(true)
    }
  }, [alert, listDomainName, role, sessionData, totalBillingDetails, user])

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
    // listDomainName(e.value, user, alert)
    fetchBranches(e && e.value, alert, user)
  }

  const getHandler = (e) => {
    // setShowDomainDetail(true)
    if (sessionData && selectedDomain) {
      totalBillingDetails(role, sessionData && sessionData.value, selectedDomain && selectedDomain.value, user, alert)
      setShowTable(true)
    } else {
      alert.warning('Select the required Fields!')
    }
  }

  const selectDomainHandler = (e) => {
    setSelectedDomain(e)
    setData([])
    setShowTable(false)
  }
  // const domainDeatilHandler = (name) => {
  // setDomainDetails(true)
  // let newDate = new Date()
  // let date = newDate.getDate()
  // let month = newDate.getMonth() + 1
  // let year = newDate.getFullYear()
  // console.log('today')
  // setEnddate(date + '/' + month + '/' + year)
  // setStartdate(10 + '/' + month + '/' + year)
  // setDomainName(name)
  // }
  const showTodayDetailPage = () => {
    // setShowDailyDetPage(true)
    // window.open('/finance/dailybillingdeatilspage')
    // window.location.assign('/finance/dailybillingdeatilspage')
    setShowTable(false)
    setHide(false)
    setShowDailyDetPage(true)
  }

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = totalBillingDetail && totalBillingDetail.length > 0 && data && data.map((val, i) => {
      return {
        domain: val.branch_name ? val.branch_name : '',
        amount: totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_amount.toFixed(2) ? totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount && '₹' + totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount.toFixed(2) : '0',
        paid_amount: totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount.toFixed(2) ? totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount.toFixed(2) : '0',
        daily_details: <Button
          variant='contained'
          color='primary'
          style={{ marginTop: -5 }}
          onClick={showTodayDetailPage}
        >DAILY Billing DETAILS</Button>
      }
    })
    return dataToShow
  }

  // const hidedomainDetailsModal = () => {
  //   setDomainDetails(false)
  // }

  // let domainDeatilsModal = null
  // if (domainDetails) {
  //   domainDeatilsModal = (
  //     <React.Fragment>
  //       <Modal open={domainDetails} click={hidedomainDetailsModal} small>
  //         <React.Fragment>
  //           <h3 style={{ textAlign: 'center' }}>Domain Details</h3>
  //           <hr />
  //           <Table>
  //             <TableHead>
  //               <TableRow >
  //                 <TableCell style={{ fontSize: 14 }}>Domain Name</TableCell>
  //                 <TableCell style={{ fontSize: 14 }}>Billing Start Date</TableCell>
  //                 <TableCell style={{ fontSize: 14 }}>Billing End Date</TableCell>
  //               </TableRow>
  //             </TableHead>
  //             <TableBody>
  //               <TableRow >
  //                 <TableCell >{domainName}</TableCell>
  //                 <TableCell >{startDate}</TableCell>
  //                 <TableCell > {endDate}</TableCell>
  //               </TableRow>
  //             </TableBody>
  //           </Table>
  //         </React.Fragment>
  //       </Modal>
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
  //       Header: 'Total Amount',
  //       accessor: 'amount',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Paid Amount',
  //       accessor: 'paid_amount',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Daily Details',
  //       accessor: 'daily_details',
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

  //   const getTodayHandler = () => {
  //     if (sessionData) {
  //       setTodayDetails(true)
  //     } else {
  //       alert.warning('Select Year!')
  //     }
  //   }

  //   const dateHandler = (e) => {
  //     if (e.target.value > endDate && endDate) {
  //       setDate('')
  //       alert.warning('Billing Start Date should be less than End Date ')
  //     } else {
  //       setDate(e.target.value)
  //     }
  //   }

  //   const endDateHandler = (e) => {
  //     if (e.target.value < date) {
  //       setEndDate('')
  //       alert.warning('Billing End Date should be greater than Start Date ')
  //     } else {
  //       setEndDate(e.target.value)
  //     }
  //   }

  //   const amountHandler = (e) => {
  //     if (e.target.value <= 0) {
  //       alert.warning('Amount should be greater then zero!')
  //       setAmount('')
  //     } else {
  //       setAmount(e.target.value)
  //     }
  //   }
  //   const selectDomainHandler = (e) => {
  //     setSelectedDomain(e)
  //   }

  //   const hideTodayDetailsModal = () => {
  //     setTodayDetails(false)
  //   }

  //   const domainDetailsHandler = (e) => {
  //     if (amount && date && endDate && selectedDomain && sessionData) {
  //       const data = {
  //         domain_name: selectedDomain && selectedDomain.value,
  //         amount: amount,
  //         academic_year: sessionData && sessionData.value,
  //         billing_start_date: date,
  //         billing_end_date: endDate
  //       }
  //       setDomainDetails(data, user, alert)
  //       setSelectedDomain('')
  //       setAmount('')
  //       setDate('')
  //       setEndDate('')
  //       setTodayDetails(false)
  //       console.log('data', data)
  //     } else {
  //       alert.warning('Fill all the required Fields!')
  //     }
  //   }

  //   let todayDeatilsModal = null
  //   if (todayDetails) {
  //     todayDeatilsModal = (
  //       <Modal open={todayDetails} click={hideTodayDetailsModal} large>
  //         <React.Fragment>
  //           <h3 style={{ textAlign: 'center' }}>ADD BILLING CYCLE</h3>
  //           <hr />
  //           <Grid container spacing={3} style={{ padding: 15 }}>
  //             <Grid item xs={3}>
  //               <label>Domain Name*</label>
  //               <Select
  //                 placeholder='Select Domain'
  //                 value={selectedDomain}
  //                 options={
  //                   domainNames
  //                     ? domainNames.map((r) => ({
  //                       value: r.id,
  //                       label: r.domain_name }))
  //                     : []
  //                 }
  //                 onChange={selectDomainHandler}
  //               />
  //             </Grid>
  //             <Grid item xs={3}>
  //               <TextField
  //                 id='amount'
  //                 type='number'
  //                 required
  //                 InputLabelProps={{ shrink: true }}
  //                 value={amount}
  //                 onChange={amountHandler}
  //                 style={{ marginTop: 18 }}
  //                 margin='dense'
  //                 variant='outlined'
  //                 label='Amount(₹)/Student'
  //               />
  //             </Grid>
  //             <Grid item xs={3}>
  //               <TextField
  //                 id='date'
  //                 type='date'
  //                 required
  //                 InputLabelProps={{ shrink: true }}
  //                 value={date}
  //                 onChange={dateHandler}
  //                 style={{ marginTop: 18 }}
  //                 margin='dense'
  //                 variant='outlined'
  //                 label='Billing Start Date'
  //               />
  //             </Grid>
  //             <Grid item xs={3}>
  //               <TextField
  //                 id='date'
  //                 type='date'
  //                 required
  //                 InputLabelProps={{ shrink: true }}
  //                 value={endDate}
  //                 onChange={endDateHandler}
  //                 style={{ marginTop: 18 }}
  //                 margin='dense'
  //                 variant='outlined'
  //                 label='Billing End Date'
  //               />
  //             </Grid>
  //             <Grid item xs={3}>
  //               <Button
  //                 variant='contained'
  //                 color='primary'
  //                 style={{ marginTop: 18 }}
  //                 onClick={domainDetailsHandler}
  //               >Add </Button>
  //             </Grid>
  //           </Grid>
  //         </React.Fragment>
  //       </Modal>
  //     )
  //   }
  const generateDailyBillingHandler = () => {
    // const data = {

    // }
    // domainDailyBillGenerateStatus(data, user, alert)
    alert.warning('To Generate Daily Billing Please Click on Generate Daily Bill!')
    setShowModal(true)
    setDomainDailyBillStatus([])
  }

  const hideBillingDetailsModal = () => {
    setShowModal(false)
    setDomainDailyBillStatus([])
  }

  const generateBillingHandler = () => {
    const data = {

    }
    domainDailyBillGenerateStatus(data, user, alert)
  }

  const generateDailyBill = (id) => {
    const data = {
      branch: id
    }
    domainDailyBillGenerateStatus(data, user, alert)
  }

  let billingDeatilsModal = null
  if (showModal) {
    billingDeatilsModal = (
      <Modal open={showModal} click={hideBillingDetailsModal} large>
        <React.Fragment>
          <h3 style={{ textAlign: 'center' }}>Generate Daily Billing Details</h3>
          <hr />
          <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }} >
            <Grid item xs={5} />
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 15, marginBottom: 15 }}
                onClick={generateBillingHandler}
              >Generate Daily Billing</Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 15, marginBottom: 15 }}
                onClick={hideBillingDetailsModal}
              >Go Back</Button>
            </Grid>
          </Grid>
          <hr />
          {domainDailyBillStatuss && domainDailyBillStatuss.length
            ? <Table>
              <TableHead>
                <TableRow style={{ textAlign: 'center' }}>
                  <TableCell />
                  <TableCell style={{ fontSize: 15 }}>Branch</TableCell>
                  <TableCell style={{ fontSize: 15 }}>Total Amount</TableCell>
                  <TableCell style={{ fontSize: 15 }}>Generate Daily Billing</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domainDailyBillStatuss && domainDailyBillStatuss.length > 0 && domainDailyBillStatuss.map((val) => {
                  return (
                    <TableRow>
                      <TableCell />
                      <TableCell> {val.branch && val.branch.branch_name}</TableCell>
                      <TableCell> {val.total_amount && val.total_amount.toFixed(2)}</TableCell>
                      <TableCell>{!val.is_daily_bill_calculated ? <Button
                        variant='contained'
                        color='primary'
                        // style={{ marginTop: 18 }}
                        onClick={() => generateDailyBill(val.branch && val.branch.id)}
                      >Generate Daily Bill</Button> : <p style={{ fontsize: 16, color: 'green' }}>Already Generatred</p>}
                      </TableCell>
                    </TableRow>
                  )
                })
                }
              </TableBody>
            </Table>
            : []}
        </React.Fragment>
      </Modal>
    )
  }
  return (
    <div>
      {ShowDailyDetPage ? <h2 style={{ textAlign: 'center' }}>Daily Billing Details</h2> : [] }
      {hide
        ? <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={9} />
            {role !== 'FinanceAdmin' && role !== 'FinanceAccountant'
              ? <React.Fragment>
                <Grid item xs={3}>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginTop: 18 }}
                    onClick={generateDailyBillingHandler}
                  >Generate Billing</Button>
                </Grid>
              </React.Fragment>

              : [] }
          </Grid>
          {role !== 'FinanceAdmin' && role !== 'FinanceAccountant'
            ? <div>
              <Grid container spacing={3} style={{ padding: 15 }}>
                {/* {role !== 'FinanceAdmin'
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
          : []} */}
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
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginTop: 18 }}
                    onClick={getHandler}
                  >GET</Button>
                </Grid>
              </Grid>
            </div>
            : [] }
        </React.Fragment>
        : [] }
      {/* {domainDeatilsModal} */}
      {ShowDailyDetPage && totalBillingDetail ? <DailyBillingDetailsPage sessionData={sessionData}
        totalBillingDetai={totalBillingDetail}
        domain={selectedDomain}
        user={user}
        alert={alert}
      /> : [] }
      {/* {ShowDailyDetPage ? <DailyBillingDetailsPage /> : []} */}
      {/* {totalBillingDetail && totalBillingDetail.length > 0 && showTable ? studentErpTable : []} */} // rajneesh
      { totalBillingDetail && totalBillingDetail.length > 0 && showTable ?
        <React.Fragment>
        <Table>
           <TableHead>
             <TableRow>
               <TableCell>Branch Name</TableCell>
               <TableCell> Total Amount</TableCell>
               <TableCell> Paid Amount</TableCell>
               <TableCell> Daily Details</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
           {totalBillingDetail && totalBillingDetail.length > 0 && data && data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
             return (
           <TableRow>
              <TableCell> { val.branch_name ? val.branch_name : ''}</TableCell>
               {/* <TableCell>{ val.id} </TableCell> */}
               <TableCell>{totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_amount.toFixed(2) ? totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount && '₹' + totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_amount.toFixed(2) : '0'}</TableCell>
               <TableCell>{totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount.toFixed(2) ? totalBillingDetail && totalBillingDetail[totalBillingDetail.length - 1] && totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount && '₹' + totalBillingDetail[totalBillingDetail.length - 1].total_paid_amount.toFixed(2) : '0'
} </TableCell>
               <TableCell> <Button
          variant='contained'
          color='primary'
          style={{ marginTop: -5 }}
          onClick={showTodayDetailPage}
        >DAILY Billing DETAILS</Button> </TableCell>
           </TableRow>
             )
           })}
         </TableBody>
       </Table>
       <TablePagination
         rowsPerPageOptions={[10, 25, 100]}
         component="div"
         count={totalBillingDetail && totalBillingDetail.length > 0 && data && data.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onChangePage={handleChangePage}
         onChangeRowsPerPage={handleChangeRowsPerPage}
       />
 </React.Fragment>
      : [] }
      { billingDeatilsModal }
      {/* {todayDeatilsModal} */}
      {dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoadingStatus: state.finance.common.dataLoader,
  todayDetail: state.finance.eMandateReducer.todayDetails,
  domainNames: state.finance.eMandateReducer.domainNames,
  totalBillingDetail: state.finance.eMandateReducer.totalBillingDetails,
  domainDailyBillStatus: state.finance.eMandateReducer.domainDailyBillStatus,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  domainDailyBillGenerateStatus: (data, user, alert) => dispatch(actionTypes.domainDailyBillGenerateStatus({ data, user, alert })),
  // listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
  totalBillingDetails: (role, session, domain, user, alert) => dispatch(actionTypes.totalBillingDetails({ role, session, domain, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)((DailyBillingDetails))
