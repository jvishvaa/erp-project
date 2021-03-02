import React, { useState, useEffect } from 'react'

import { Grid, Button, CircularProgress,  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TablePagination } from '@material-ui/core'
// import Select from 'react-select'
// import ReactTable from 'react-table'
import Select from 'react-select'
// import 'react-table/react-table.css'
// import zipcelx from 'zipcelx'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
// import Modal from '../../../ui/Modal/modal'
// import { CircularProgress } from '../../../ui'
import BillingReceipts from '../Receipts/billingDetailsReceipts'
import Layout from '../../../../../Layout'

const DailyBillingDetailsPage = ({ dataLoadingStatus, totalBillingDetails, domain, sessionData, qwerty, alert, todayEMandateDetails, totalBillingDetai, totalBillingDetail, listDomainName, user, domainNames, session }) => {
  const [data, setData] = useState([])
  const [dataDateWsie, setDataDateWsie] = useState([])
  const [month, setMonth] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let role = ''
    // role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    // role = JSON.parse(localStorage.getItem('userDetails')).user_role
    role = JSON.parse(localStorage.getItem('userDetails')).role_details.user_role
    setRole(role)
  }, [])

  useEffect(() => {
    console.log('qwerty', totalBillingDetai)
    console.log('qaz', totalBillingDetai)
    if (totalBillingDetai) {
      let data = totalBillingDetai
      let arr1 = data[0]
      let arr2 = data.shift()
      console.log('aar1 aar2', arr1, arr2)
      setData(arr1)
      setDataDateWsie(data)
      console.log('old', data)
      console.log(data)
    }
  }, [qwerty, totalBillingDetai])

  useEffect(() => {
    if (totalBillingDetail) {
      setDataDateWsie(totalBillingDetail)
      console.log('new', totalBillingDetail)
    }
  }, [totalBillingDetail])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = dataDateWsie && dataDateWsie && dataDateWsie.map((val, i) => {
      return {
        domain: val.date ? val.date && val.date.split('T')[0] : '',
        amount: val.active_user ? val.active_user : 'NA',
        paid_amount: val.amount_per_user ? '₹' + val.amount_per_user : 'NA',
        total_amount: val.amount ? '₹' + val.amount.toFixed(2) : 'NA'
      }
    })
    return dataToShow
  }

  // let studentErpTable = null

  // studentErpTable = <ReactTable
  //   style={{ marginTop: 30, textAlign: 'center' }}
  //   data={renderStudentErpTable()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'Billing Date',
  //       accessor: 'domain',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Total Active User Per Day',
  //       accessor: 'amount',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Per Month User Amount',
  //       accessor: 'paid_amount',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Total Amount',
  //       accessor: 'total_amount',
  //       filterable: false,
  //       sortable: true
  //     }
  //   ]}
  //   filterable
  //   sortable
  //   defaultPageSize={5}
  //   showPageSizeOptions={false}
  //   className='-striped -highlight'
  // /> // rajneesh
  const goBackHandler = () => {
    window.location.replace('/finance/dailybillingdeatils')
  }

  const monthHandler = (e) => {
    setMonth(e)
    totalBillingDetails(role, sessionData && sessionData.value, domain && domain.value, e.value, user, alert)
    setDataDateWsie([])
  }

  const downloadBilllingDetails = () => {
    BillingReceipts(dataDateWsie)
    // const headers = [
    //   {
    //     value: 'Billing Date',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Total Active User Per day',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Per Month User Amount',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Total Paid Amount',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Total Amount',
    //     type: 'string'
    //   }
    // ]

    // const body = dataDateWsie.map(val => {
    //   return ([
    //     {
    //       value: val.date && val.date.split('T')[0],
    //       type: 'string'
    //     },
    //     {
    //       value: val.active_user,
    //       type: 'string'
    //     },
    //     {
    //       value: '₹' + val.amount_per_user,
    //       type: 'string'
    //     },
    //     {
    //       value: val.total_paid_amount ? val.total_paid_amount : '0',
    //       type: 'string'
    //     },
    //     {
    //       value: '₹' + val.amount.toFixed(2),
    //       type: 'string'
    //     }
    //   ])
    // })
    // console.log('body: ', body)
    // // const body = [
    // //   {
    // //     value: promoted,
    // //     type: 'string'
    // //   }
    // // ]
    // const config = {
    //   filename: month ? 'Monthly_Billing_Details' : 'Daily_Billing_Details',
    //   sheet: {
    //     data: [headers, ...body]
    //   }
    // }
    // zipcelx(config)
    // if (dataDateWsie && dataDateWsie.length > 0) {
    //   alert.success('Downloaded Successfully!')
    // }
  }

  console.log(data)
  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: 15 }} >
        <Grid item xs={7} style={{ }}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={goBackHandler}
          >  GO BACK</Button>
        </Grid>
        <Grid item xs={3}>
          <label>Monthly Billing Details*</label>
          <Select
            placeholder='Select Month'
            value={month}
            options={[
              {
                label: 'January',
                value: 'January'
              },
              {
                label: 'February',
                value: 'February'
              },
              {
                label: 'March',
                value: 'March'
              },
              {
                label: 'April',
                value: 'April'
              },
              {
                label: 'May',
                value: 'May'
              },
              {
                label: 'June',
                value: 'June'
              },
              {
                label: 'July',
                value: 'July'
              },
              {
                label: 'August',
                value: 'August'
              },
              {
                label: 'September',
                value: 'September'
              },
              {
                label: 'October',
                value: 'October'
              },
              {
                label: 'November',
                value: 'November'
              },
              {
                label: 'December',
                value: 'December'
              }
            ]}
            onChange={monthHandler}
          />
        </Grid>
        <Grid item xs={2} style={{ }}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={downloadBilllingDetails}
          >  DOWNLOAD PDF</Button>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-around' }}>
          <p style={{ fontSize: 18 }}>FROM DATE : {data && data.start_date}</p>
          <p style={{ fontSize: 18 }}>TO DATE : {data && data.end_date && data.end_date.split('T')[0]}</p>
        </Grid>
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }} >
          <Grid item xs={8} style={{ display: 'flex', justifyContent: 'space-around', borderStyle: 'solid', background: 'purple' }}>
            <p style={{ fontSize: 18 }}>DOMAIN : {data && data.branch_name}</p>
            <p style={{ fontSize: 18 }}>CUSTOMER ID:{data && data.customer_id}</p>
            {/* <p style={{ fontSize: 18 }}>NAME :</p> */}
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
          <p style={{ fontSize: 18 }}>TOTAL BILLS : {totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_amount && '₹' + totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_amount.toFixed(2) ? totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_amount && '₹' + totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_amount.toFixed(2) : '0'}</p>
          {/* <p style={{ fontSize: 18 }}>TOTAL USER : {totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1].total_active_user}</p> */}
          <p style={{ fontSize: 18 }}>PREVIOUS DUE : {((totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_amount) - (totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1] && +totalBillingDetai[totalBillingDetai.length - 1].total_paid_amount === null ? 0 : totalBillingDetai && totalBillingDetai[totalBillingDetai.length - 1] && totalBillingDetai[totalBillingDetai.length - 1].total_paid_amount)).toFixed(2)}</p>
        </Grid>
        <Grid item xs={12} style={{ margin: 'auto' }}>
          {/* {studentErpTable} */}
          {
        <React.Fragment>
        <Table>
           <TableHead>
             <TableRow>
               <TableCell>Billing Date</TableCell>
               <TableCell> Total Active User Per Day</TableCell>
               <TableCell> Per Month User Amount</TableCell>
               <TableCell> Total Amount</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
           {dataDateWsie && dataDateWsie && dataDateWsie.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
             return (
           <TableRow>
              <TableCell> {val.date ? val.date && val.date.split('T')[0] : ''}</TableCell>
               {/* <TableCell>{ val.id} </TableCell> */}
               <TableCell>{val.active_user ? val.active_user : 'NA'} </TableCell>
               <TableCell>{ val.amount_per_user ? '₹' + val.amount_per_user : 'NA'
} </TableCell>
               <TableCell> {val.amount ? '₹' + val.amount.toFixed(2) : 'NA'}</TableCell>
           </TableRow>
             )
           })}
         </TableBody>
       </Table>
       <TablePagination
         rowsPerPageOptions={[10, 25, 100]}
         component="div"
         count={dataDateWsie && dataDateWsie && dataDateWsie.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onChangePage={handleChangePage}
         onChangeRowsPerPage={handleChangeRowsPerPage}
       />
 </React.Fragment>
          }
        </Grid>
        {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontSize: 18 }}>TOTAL BILLS :</p>
        </Grid> */}
      </Grid>
      {/* {todayDeatilsModal} */}
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
  domainNames: state.finance.eMandateReducer.domainNames,
  totalBillingDetail: state.finance.eMandateReducer.totalBillingDetails
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  totalBillingDetails: (role, session, domain, month, user, alert) => dispatch(actionTypes.totalBillingDetails({ role, session, domain, month, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)((DailyBillingDetailsPage))
