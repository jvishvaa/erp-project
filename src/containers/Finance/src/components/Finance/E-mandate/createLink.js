import React, { useState, useEffect } from 'react'
import {
  TextField,
  Grid,
  Button
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { connect } from 'react-redux'
// import Modal from '../../../ui/Modal/modal'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Layout from '../../../../../Layout'


const selectStyles = {
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  menu: provided => ({ ...provided, zIndex: '9999 !important' })
}

const CreateLink = ({ setCustomerDetails, user, alert, domainNames, branches, fetchBranches, createLinkStatus, createLink, listCustomerDetails, listCustomerDetailsId, customerDetails, updateCustDetails, custDetails, getCustomerDetails, listDomainName, session }) => {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [sessionData, setSessionData] = useState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [notekey1, setKeyNote1] = useState('')
  const [notekey2, setKeyNote2] = useState('')
  //   const [showModal, setShowModal] = useState(true)
  //   const [domainName, setDomainName] = useState('')
  const [paymnetMethod, setPaymnetMethod] = useState('')
  // const [amount, setAmount] = useState(null)
  // const [isNetbankingMethod, setIsNetbankingMethod] = useState(false)
  //   const [isCreateOrderModel, setIsCreateOrderModel] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [accountType, setAccountType] = useState('')
  const [type, setType] = useState('')
  //   const [showTable, setShowTable] = useState(false)
  //   const [role, setRole] = useState('')
  //   const [order, setOrder] = useState(null)
  //   const [customer, setCustomer] = useState(null)
  //   const [customerId, setCustomerId] = useState('')
  //   const [showTable, setShowTable] = useState(true)
  //   const [role, setRole] = useState('')
  //   const [editShowModal, setEditShowModal] = useState(false)
  //   const [updateName, setUpdateName] = useState('')
  //   const [updateEmail, setUpdateEmail] = useState('')
  //   const [updateNumber, setUpdateNumber] = useState('')
  //   const [domainId, setDomainId] = useState(null)

  useEffect(() => {
    // listDomainName(sessionData && sessionData.value, user, alert)
    fetchBranches(sessionData && sessionData.value, alert, user)
    //   let role = ''
    //   role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    //   setRole(role)
  }, [user, alert, listDomainName, sessionData, fetchBranches])

  useEffect(() => {
    if (createLinkStatus === 201) {
      setName('')
      setEmail('')
      setNumber('')
      setKeyNote1('')
      setKeyNote2('')
      setPaymnetMethod('')
      setBeneficiaryName('')
      setAccountType('')
      setAccountNumber('')
      setIfscCode('')
      setType('')
      setSelectedDomain('')
    }
  }, [createLinkStatus])

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    // setShowTable(false)
  }

  const handleDomainNameChange = (e) => {
    setSelectedDomain(e)
  }
  const handleNameChange = (e) => {
    setName(e.target.value)
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }
  const handleNumberChange = (e) => {
    setNumber(e.target.value)
  }
  const handleKeyNote1Change = (e) => {
    setKeyNote1(e.target.value)
  }
  const handleKeyNote2Change = (e) => {
    setKeyNote2(e.target.value)
  }

  //   const customerDetailsHandler = (e) => {
  //     if (selectedDomain && name && email && number) {
  //       if (number && number.length === 10) {
  //         const data = {
  //           domain_name: selectedDomain && selectedDomain.value,
  //           //   academic_year: sessionData && sessionData.value,
  //           name: name,
  //           email: email,
  //           contact: number,
  //           note_key_1: notekey1,
  //           note_key_2: notekey2
  //         }
  //         setCustomerDetails(data, user, alert)
  //         setSelectedDomain('')
  //         setName('')
  //         setEmail('')
  //         setNumber(null)
  //         console.log('data', data)
  //         // setShowModal(false)
  //       } else {
  //         alert.warning('Contact number should be of 10 digits!')
  //       }
  //     } else {
  //       alert.warning('Fill all the required Fields!')
  //     }
  //   }

  //   const handleDomainNameChange = (e) => {
  //     setDomainName(e)
  //     // setPaymnetMethod('')
  //   }

  // console.log(listCustomerDetailsId)

  const handlePaymentMethodChange = (e) => {
    listCustomerDetails(selectedDomain && selectedDomain.value, user, alert)
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
    // if (listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id) {
    //   setCustomerId(listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id ? listCustomerDetailsId[0].customer_id : '')
    setAccountType(e)
    // } else {
    //   setPaymnetMethod('')
    //   alert.warning('Please Select Another Domain Name!')
    // }
  }

  const handleIfscCode = (e) => {
    setIfscCode(e.target.value)
  }
  const notifyType = (e) => {
    setType(e)
  }

  //   const orderDetailsHandler = (e) => {
  //     if (selectedDomain && paymnetMethod && accountType && beneficiaryName && ifscCode && accountNumber && listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id) {
  //       if (ifscCode && ifscCode.length === 11) {
  //         const data = {
  //           domain_name: selectedDomain && selectedDomain.value,
  //           amount: 0,
  //           currency: 'INR',
  //           //   finance_year: sessionData && sessionData.value,
  //           customer_id: listCustomerDetailsId && listCustomerDetailsId[0] && listCustomerDetailsId[0].customer_id ? listCustomerDetailsId[0].customer_id : '',
  //           auth_type: paymnetMethod.value,
  //           account_number: accountNumber,
  //           account_type: accountType && accountType.value,
  //           beneficiary_name: beneficiaryName,
  //           ifsc_code: ifscCode.toLocaleUpperCase()
  //         }
  //         // createOrderDetails(data, user, alert)
  //         console.log('data', data)
  //         // setIsCreateOrderModel(false)
  //       } else {
  //         alert.warning('IFSC code should be of 11 digits!')
  //       }
  //     } else {
  //       alert.warning('Fill all the required Fields!')
  //     }
  //   }
  // const amountHandler = (e) => {
  //   if (e.target.value <= 0) {
  //     alert.warning('Amount should be greater then zero!')
  //     setAmount('')
  //   } else {
  //     setAmount(e.target.value)
  //   }
  // }

  const createLinkHandler = () => {
    var reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/
    if (name && email && number && sessionData && selectedDomain && beneficiaryName && accountType && accountNumber && ifscCode && type && notekey1 && notekey2) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        if (number && number.length === 10) {
          if (ifscCode.match(reg)) {
            const data = {
              'customer': {
                'name': name,
                'email': email,
                'contact': number
              },
              'branch': selectedDomain && selectedDomain.value,
              'academic_year': sessionData && sessionData.value,
              //   'type': 'link',
              // 'amount': 0,
              //   'currency': 'INR',
              //   'description': '12 p.m. Meals',
              'subscription_registration': {
              // 'first_payment_amount': amount,
                'method': 'emandate',
                'auth_type': paymnetMethod && paymnetMethod.value,
                // 'expire_at': 1580480689,
                // 'max_amount': 50000,
                'bank_account': {
                  'beneficiary_name': beneficiaryName,
                  'account_number': accountNumber,
                  'account_type': accountType && accountType.value,
                  'ifsc_code': ifscCode
                }
              },
              //   'receipt': 'Receipt no. 1',
              //   'expire_by': 1880480689,
              'sms_notify': type.value === 'sms_notify' ? 1 : 0,
              'email_notify': type.value === 'email_notify' ? 1 : 0,
              'notes': {
                'note_key 1': notekey1,
                'note_key 2': notekey2
              }
            }
            console.log('data', data)
            createLink(data, user, alert)
          } else {
            alert.warning('You entered invalid IFSC code')
          }
        } else {
          alert.warning('Contact number should be of 10 digits!')
        }
      } else {
        alert.warning('You have entered an invalid email address!')
      }
      if (createLinkStatus === 201) {
        setName('')
        setEmail('')
        setNumber('')
        setKeyNote1('')
        setKeyNote2('')
        setPaymnetMethod('')
        setBeneficiaryName('')
        setAccountType('')
        setAccountNumber('')
        setIfscCode('')
        setType('')
        setSelectedDomain('')
      }
    } else {
      alert.warning('Fill all the  required Fields!')
    }
  }
  return (
    <Layout>
    <div>
      <h3 style={{ textAlign: 'center' }}>Add Customer Details</h3>
      {/* <hr /> */}
      <Grid container spacing={1} style={{ padding: 10 }} >
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            styles={selectStyles}
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
            styles={selectStyles}
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
        <Grid item xm={6} md={3}>
          <TextField
            id='name'
            type='text'
            required
            style={{ marginTop: '18px' }}
            InputLabelProps={{ shrink: true }}
            value={name}
            onChange={handleNameChange}
            margin='dense'
            variant='outlined'
            label='Enter Name'
          />
        </Grid>
        <Grid item xm={6} md={3}>
          <TextField
            id='email'
            type='text'
            required
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: '18px' }}
            value={email}
            onChange={handleEmailChange}
            margin='dense'
            variant='outlined'
            label='Enter email'
          />
        </Grid>
        <Grid item xm={6} md={3}>
          <TextField
            id='number'
            type='number'
            required
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: '18px' }}
            value={number}
            onChange={handleNumberChange}
            margin='dense'
            variant='outlined'
            label='Phone Number'
          />
        </Grid>
        <Grid item xm={6} md={3}>
          <TextField
            id='note_key_1'
            type='text'
            required
            InputLabelProps={{ shrink: true }}
            value={notekey1}
            onChange={handleKeyNote1Change}
            margin='dense'
            variant='outlined'
            label='note_key_1'
          />
        </Grid>
        <Grid item xm={6} md={3}>
          <TextField
            id='note_key_2'
            type='text'
            required
            InputLabelProps={{ shrink: true }}
            value={notekey2}
            onChange={handleKeyNote2Change}
            margin='dense'
            variant='outlined'
            label='note_key_2'
          />
        </Grid>
        {/* <Grid item xm={6} md={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={customerDetailsHandler}
          >Create Customer Details</Button>
        </Grid> */}
      </Grid>
      <h3 style={{ textAlign: 'center' }}> Add Payment Details</h3>
      {/* <hr /> */}
      <Grid container spacing={3} style={{ padding: 10 }} >
        {/* <Grid item xs={4}>
          <label>Domain Name*</label>
          <Select
            placeholder='Select Domain Name'
            value={domainName}
            options={
              domainNames
                ? domainNames.map((r) => ({
                  value: r.id,
                  label: r.domain_name }))
                : []
            }
            onChange={handleDomainNameChange}
          />
        </Grid> */}
        {/* <Grid item xs={3}>
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
            label='Amount(₹)'
          />
        </Grid> */}
        <Grid item xs={4}>
          <label>Payment Mode*</label>
          <Select
            placeholder='Select Payment'
            value={paymnetMethod}
            styles={selectStyles}
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
                value: 'savings',
                label: 'savings'
              },
              {
                value: 'current',
                label: 'current'
              }
            ]}
            onChange={handleAccountType}
          />
        </Grid>
        {/* <Grid item xs={3}>
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
        </Grid> */}
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
        <Grid item xs={3}>
          <label>Notify Type*</label>
          <Select
            placeholder='Select Month'
            styles={selectStyles}
            value={type}
            options={[
              {
                label: 'sms_notify',
                value: 'sms_notify'
              },
              {
                label: 'email_notify',
                value: 'email_notify'
              }
            ]}
            onChange={notifyType}
          />
        </Grid>
        {/* <Grid item xs={4} /> */}
        {/* <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={orderDetailsHandler}
          >Create Order Details</Button>
        </Grid> */}
      </Grid>
      <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }} >
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginBottom: 15 }}
            onClick={createLinkHandler}
          >Create Link</Button>
        </Grid>
      </Grid>
      {/* <Grid container spacing={1} style={{ padding: 10 }} >
        {role !== 'FinanceAdmin'
          ? <React.Fragment>
            <Grid item xs={9} />
            <Grid item xs={3} >
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 18 }}
                onClick={createCustomerDetailsHandler}
              >Create Customer Details</Button>
            </Grid>
          </React.Fragment>
          : [] }
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
      </Grid> */}
      {/* {customerDetModal} */}
      {/* {editcustomerDetModal}
      {showTable ? studentErpTable : []} */}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  domainNames: state.finance.eMandateReducer.domainNames,
  custDetails: state.finance.eMandateReducer.custDetails,
  updatedCusData: state.finance.eMandateReducer.updatedCusData,
  customerDetails: state.finance.eMandateReducer.customerDetails,
  listCustomerDetailsId: state.finance.eMandateReducer.listCustomerDetails,
  createLinkStatus: state.finance.eMandateReducer.createLinkStatus,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = (dispatch) => ({
  createLink: (data, user, alert) => dispatch(actionTypes.createLink({ data, user, alert })),
  listCustomerDetails: (id, user, alert) => dispatch(actionTypes.listCustomerDetails({ id, user, alert })),
  updateCustDetails: (data, user, alert) => dispatch(actionTypes.updateCustDetails({ data, user, alert })),
  getCustomerDetails: (session, user, alert) => dispatch(actionTypes.getCustomerDetails({ session, user, alert })),
  setCustomerDetails: (data, user, alert) => dispatch(actionTypes.setCustomerDetails({ data, user, alert })),
  // listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((CreateLink))
