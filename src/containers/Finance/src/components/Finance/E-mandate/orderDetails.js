import React, { useEffect, useState } from 'react'
import {
  Grid,
  Button,
  TextField,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
TablePagination
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Modal from '../../../ui/Modal/modal'
import { Razorpay } from '../PaymentGateways'
import Layout from '../../../../../Layout'
// import { Razorpay } from '../PaymentGateways'
// import { Razorpay } from '../PaymentGateways'
const selectStyles = {
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  menu: provided => ({ ...provided, zIndex: '9999 !important' })
}

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'E-Mandate' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Add Order Details') {
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


const OrderDetails = ({ getDomainNameWithCusId, domainNames, fetchBranches, branches, payment, history, orderPayment, user, alert, createOrderDetails, listCustomerDetails, listCustomerDetailsId, session, orderDetails, getOrderDetails }) => {
  const [domainName, setDomainName] = useState('')
  const [sessionData, setSessionData] = useState()
  const [paymnetMethod, setPaymnetMethod] = useState('')
  // const [isNetbankingMethod, setIsNetbankingMethod] = useState(false)
  const [isCreateOrderModel, setIsCreateOrderModel] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [accountType, setAccountType] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [role, setRole] = useState('')
  const [order, setOrder] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [customerId, setCustomerId] = useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [allNetbankingData, setAllNetbankingData] = useState({})

  useEffect(() => {
    // let role = ''
    // role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    // role = JSON.parse(localStorage.getItem('userDetails')).role_details.user_role
    // console.log('role+', JSON.parse(localStorage.getItem('role_details')))
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const role = userProfile.personal_info.role.toLowerCase()
    setRole(role)
    getDomainNameWithCusId(sessionData && sessionData.value, user, alert)
    fetchBranches(sessionData && sessionData.value, alert, user, moduleId)
  }, [alert, fetchBranches, getDomainNameWithCusId, session, sessionData, user])

  useEffect(() => {
    if (role === 'financeadmin' || role === 'financeaccountant') {
      let branch
      getOrderDetails(branch, sessionData && sessionData.value, role, user, alert)
      setShowTable(true)
    }
  }, [role, getOrderDetails, sessionData, user, alert])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  const handleDomainNameChange = (e) => {
    setDomainName(e)
    setPaymnetMethod('')
  }

  // console.log(listCustomerDetailsId)

  const handlePaymentMethodChange = (e) => {
    listCustomerDetails(domainName && domainName.value, user, alert)
    setPaymnetMethod(e)
    // setIsNetbankingMethod(true)
    // setIsCreateOrderModel(false)
  }

  const handleBeneficieryName = (e) => {
    setBeneficiaryName(e.target.value)
  }

  const handleAccountNumber = (e) => {
    setAccountNumber(e.target.value)
  }

  const handleAccountType = (e) => {
    if (listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id) {
      setCustomerId(listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id ? listCustomerDetailsId[0].customer_id : '')
      setAccountType(e)
    } else {
      setPaymnetMethod('')
      alert.warning('Please Select Another Branch Name!')
    }
  }

  const handleIfscCode = (e) => {
    setIfscCode(e.target.value)
  }

  const orderDetailsHandler = (e) => {
    var reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/
    if (domainName && paymnetMethod && accountType && beneficiaryName && ifscCode && accountNumber && listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id) {
      if (ifscCode && ifscCode.length === 11) {
        if (ifscCode.match(reg)) {
          const data = {
            branch: domainName && domainName.value,
            amount: 0,
            currency: 'INR',
            finance_year: sessionData && sessionData.value,
            customer_id: listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id ? listCustomerDetailsId[0].customer_id : '',
            auth_type: paymnetMethod.value,
            account_number: accountNumber,
            account_type: accountType && accountType.value,
            beneficiary_name: beneficiaryName,
            ifsc_code: ifscCode.toLocaleUpperCase()
          }
          createOrderDetails(data, user, alert)
          console.log('data', data)
          setIsCreateOrderModel(false)
        } else {
          alert.warning('You entered invalid IFSC code!')
        }
      } else {
        alert.warning('IFSC code should be of 11 digits!')
      }
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }

  const getHandler = (e) => {
    let branch
    getOrderDetails(branch, sessionData && sessionData.value, role, user, alert)
    setShowTable(true)
  }
  console.log(orderDetails)

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setShowTable(false)
  }
  const hideCreateModel = () => {
    setIsCreateOrderModel(false)
  }
  const openCreateOrderModel = () => {
    setIsCreateOrderModel(true)
  }
  let createOrderDetailsModel = []
  if (isCreateOrderModel) {
    createOrderDetailsModel = (
      <Modal open={isCreateOrderModel} click={hideCreateModel} large>
        <h3 style={{ textAlign: 'center' }}> Add Payment Details</h3>
        <hr />
        <Grid container spacing={3} style={{ padding: 10 }} >
          <Grid item xs={4}>
            <label>Branch Name*</label>
            <Select
              placeholder='Select Branch Name'
              styles={selectStyles}
              value={domainName}
              options={
                branches.length
                  ? branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }
              onChange={handleDomainNameChange}
            />
          </Grid>
          <Grid item xs={4}>
            <label>Payment Mode*</label>
            <Select
              placeholder='Select Payment'
              styles={selectStyles}
              value={paymnetMethod}
              options={[
                {
                  value: 'debitcard',
                  label: 'debitcard'
                },
                {
                  value: 'netbanking',
                  label: 'netbanking'
                }
              ]}
              onChange={handlePaymentMethodChange}
            />
          </Grid>
          <Grid item xs={4}>
            <label>Account Type*</label>
            <Select
              placeholder='Account Type'
              styles={selectStyles}
              value={accountType}
              options={[
                {
                  value: 'saving',
                  label: 'saving'
                },
                {
                  value: 'current',
                  label: 'current'
                }
              ]}
              onChange={handleAccountType}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='Customer Id'
              type='text'
              required
              disabled
              InputLabelProps={{ shrink: true }}
              value={customerId}
              //   margin='dense'
              variant='outlined'
              label='Customer Id'
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='beneficiary_name'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={beneficiaryName}
              onChange={handleBeneficieryName}
              //   margin='dense'
              variant='outlined'
              label='Beneficiary Name'
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='account_number'
              type='number'
              required
              InputLabelProps={{ shrink: true }}
              value={accountNumber}
              onChange={handleAccountNumber}
              //   margin='dense'
              variant='outlined'
              label='Account Number'
            />
          </Grid>
          {/* <Grid item xs={3}>
            <TextField
              id='account_type'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={accountType}
              onChange={handleAccountType}
              //   margin='dense'
              variant='outlined'
              label='Account Type'
            />
          </Grid> */}
          <Grid item xs={3}>
            <TextField
              id='ifsc_code'
              type='text'
              required
              InputLabelProps={{ shrink: true }}
              value={ifscCode}
              onChange={handleIfscCode}
              //   margin='dense'
              variant='outlined'
              label='IFSC Code'
            />
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={orderDetailsHandler}
            >Create Order Details</Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }
  const paymentHandler = (customer, order) => {
    if (!customer) {
      alert.warning('Customer Id not Present!')
    }
    if (!order) {
      alert.warning('Order Id not Present!')
    }
    // const cus = customer
    // const ord = order
    if (customer && order) {
      // const data = {
      //   customer_id: customer,
      //   order_id: order
      // }
      // orderPayment(customer, order, user, alert)
      // window.location.replace('/razorpay/')
      setOrder(order)
      setCustomer(customer)
      // const { customer, order, alert, user } = history.location
    }
  }

  const renderOrderDetails = () => {
    let dataToShow = []
    dataToShow = orderDetails && orderDetails.map((val, i) => {
      return {
        domain: val.branch && val.branch.branch_name ? val.branch.branch_name : val.branch,
        BeneficieryName: val.beneficiary_name && val.beneficiary_name ? val.beneficiary_name : '',
        AccountNumber: val.account_number && val.account_number ? val.account_number : '',
        AccountType: val.account_type && val.account_type ? val.account_type : '',
        ifscCode: val.ifsc_code && val.ifsc_code ? val.ifsc_code : '',
        customer_id: val.customer_id ? val.customer_id : '',
        order_id: val.razorpay_order_id ? val.razorpay_order_id : '',
        status: val.is_authentication_payment_done ? <span style={{ color: 'green', fontWeight: 'bold' }}>Done</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Not Done</span>,
        CreateLink: val.is_authentication_payment_done ? <span style={{ color: 'green', fontWeight: 'bold' }}>Already Done </span> : (role === 'FinanceAdm' || role === 'financeaccountant') ? <Button variant='contained' color='primary' onClick={() => paymentHandler(val.customer_id, val.razorpay_order_id)} style={{ marginTop: '-5px', marginLeft: '-10px' }}>{(role !== 'financeadmin' || role !== 'financeaccountant') ? 'pay first payment' : 'Create Link'}</Button> : ''
        // Update: <Button variant='contained' color='primary' style={{ marginTop: '-5px' }}> Update </Button>
      }
    })
    return dataToShow
  }

  // let studentOrderDeatilsTable = null
  // studentOrderDeatilsTable = (role !== 'FinanceAdmin' && role !== 'FinanceAccountant') ? <ReactTable
  //   style={{ marginTop: 60, textAlign: 'center', fontWeight: 'bold' }}
  //   data={renderOrderDetails()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'Branch Name',
  //       accessor: 'domain',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Beneficiary Name',
  //       accessor: 'BeneficieryName',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Account Number',
  //       accessor: 'AccountNumber',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Account Type',
  //       accessor: 'AccountType',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'IFSC Code',
  //       accessor: 'ifscCode',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Customer Id',
  //       accessor: 'customer_id',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Order Id',
  //       accessor: 'order_id',
  //       filterable: false,
  //       sortable: true
  //     },
  //     // {
  //     //   Header: role !== 'FinanceAdmin' ? 'Create Order Link' : 'Authentication payment',
  //     //   accessor: 'CreateLink',
  //     //   filterable: false,
  //     //   sortable: true
  //     // },
  //     {
  //       Header: 'Authentication Payment Status',
  //       accessor: 'status',
  //       filterable: false,
  //       sortable: true
  //     }
  //     // {
  //     //   Header: 'Update',
  //     //   accessor: 'Update',
  //     //   filterable: false,
  //     //   sortable: true
  //     // }
  //   ]}
  //   filterable
  //   sortable
  //   defaultPageSize={20}
  //   showPageSizeOptions={false}
  //   className='-striped -highlight'
  // /> : <ReactTable
  //   style={{ marginTop: 60, textAlign: 'center', fontWeight: 'bold' }}
  //   data={renderOrderDetails()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'Branch Name',
  //       accessor: 'domain',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Beneficiey Name',
  //       accessor: 'BeneficieryName',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Account Number',
  //       accessor: 'AccountNumber',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Account Type',
  //       accessor: 'AccountType',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'IFSC Code',
  //       accessor: 'ifscCode',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Customer Id',
  //       accessor: 'customer_id',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Order Id',
  //       accessor: 'order_id',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: (role !== 'FinanceAdmin' && role !== 'FinanceAccountant') ? 'Create Order Link' : 'Authentication payment',
  //       accessor: 'CreateLink',
  //       filterable: false,
  //       sortable: true
  //     }
  //     // {
  //     //   Header: 'Update',
  //     //   accessor: 'Update',
  //     //   filterable: false,
  //     //   sortable: true
  //     // }
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
      <Grid container spacing={1} style={{ padding: 10 }} >
        {(role !== 'financeadmin' && role !== 'financeaccountant')
          ? <React.Fragment>
            <Grid item xs={9} />
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 18 }}
                onClick={openCreateOrderModel}
              >Create Order Details</Button>
            </Grid>
          </React.Fragment>

          : []}
        {(role !== 'financeadmin' && role !== 'financeaccountant')
          ? <React.Fragment>
            <Grid item xm={4} md={4}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Academic Year'
                styles={selectStyles}
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
              >GET Order Details</Button>
            </Grid>
          </React.Fragment>
          : []}
      </Grid>
      {/* {paymentNetbankingMethodModal} */}
      {/* {showTable ? studentOrderDeatilsTable : []} */} 
      {
          <React.Fragment>
          <Table>
             <TableHead>
               <TableRow>
                 <TableCell>Branch Name</TableCell>
                 <TableCell> Beneficiary Name</TableCell>
                 <TableCell> Account Number</TableCell>
                 <TableCell> Account Type</TableCell>
                 <TableCell>IFSC Code</TableCell>
                 <TableCell>Customer Id</TableCell>
                 <TableCell>Order Id</TableCell>
                 <TableCell>Authentication Payment Status</TableCell>
                 <TableCell>{(role !== 'financeadmin' && role !== 'financeaccountant') ? 'Create Order Link' : 'Authentication payment'}</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
             {orderDetails && orderDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
               return (
             <TableRow>
                <TableCell> { val.branch && val.branch.branch_name ? val.branch.branch_name : ''}</TableCell>
                 {/* <TableCell>{ val.id} </TableCell> */}
                 <TableCell>{val.beneficiary_name && val.beneficiary_name ? val.beneficiary_name : ''}</TableCell>
                 <TableCell>{ val.account_number && val.account_number ? val.account_number : ''} </TableCell>
                 <TableCell>{val.account_type && val.account_type ? val.account_type : ''} </TableCell>
                 <TableCell>{val.ifsc_code && val.ifsc_code ? val.ifsc_code : ''}</TableCell>
                 <TableCell>{val.customer_id ? val.customer_id : ''}</TableCell>
                 <TableCell>{ val.razorpay_order_id ? val.razorpay_order_id : ''}</TableCell>
                 <TableCell>{val.is_authentication_payment_done ? <span style={{ color: 'green', fontWeight: 'bold' }}>Done</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Not Done</span>}</TableCell>
                 <TableCell>{val.is_authentication_payment_done ? <span style={{ color: 'green', fontWeight: 'bold' }}>Already Done </span> : (role === 'financeadmin' || role === 'financeaccountant') ? <Button variant='contained' color='primary' onClick={() => paymentHandler(val.customer_id, val.razorpay_order_id)} style={{ marginTop: '-5px', marginLeft: '-10px' }}>{(role === 'financeadmin' || role === 'F_acc') ? 'pay first payment' : 'Create Link' }</Button> : ''}</TableCell>
             </TableRow>
               )
             })}
           </TableBody>
         </Table>
         <TablePagination
           rowsPerPageOptions={[10, 25, 100]}
           component="div"
           count={orderDetails && orderDetails.length}
           rowsPerPage={rowsPerPage}
           page={page}
           onChangePage={handleChangePage}
           onChangeRowsPerPage={handleChangeRowsPerPage}
         />
         </React.Fragment>
      }
      {order && customer ? <Razorpay
        order={order}
        customer={customer}
        user={user}
        alert={alert}
      /> : []}
      {createOrderDetailsModel}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  listCustomerDetailsId: state.finance.eMandateReducer.listCustomerDetails,
  domainNames: state.finance.eMandateReducer.getDomainNameWithCusId,
  orderDetails: state.finance.eMandateReducer.getOrderDetails,
  createOrder: state.finance.eMandateReducer.createOrderrDetails,
  session: state.academicSession.items,
  payment: state.finance.eMandateReducer.payment,
  history: PropTypes.instanceOf(Object).isRequired,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = (dispatch) => ({
  // orderPayment: (customer, order, user, alert) => dispatch(actionTypes.orderPayment({ customer, order, user, alert })),
  listCustomerDetails: (id, user, alert) => dispatch(actionTypes.listCustomerDetails({ id, user, alert })),
  createOrderDetails: (data, user, alert) => dispatch(actionTypes.createOrderDetails({ data, user, alert })),
  getDomainNameWithCusId: (session, user, alert) => dispatch(actionTypes.getDomainNameWithCusId({ session, user, alert })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  getOrderDetails: (branch, session, role, user, alert) => dispatch(actionTypes.getOrderDetails({ branch, session, role, user, alert })),
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId))
})

export default connect(mapStateToProps, mapDispatchToProps)((OrderDetails))
