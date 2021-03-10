import React, { useEffect, useState } from 'react'
import {
  TextField,
  Grid,
  Button,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TablePagination
  // Modal
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { connect } from 'react-redux'
import Modal from '../../../ui/Modal/modal'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Layout from '../../../../../Layout'

const selectStyles = {
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  menu: provided => ({ ...provided, zIndex: '9999 !important' })
}

const CustomerDeatils = ({ setCustomerDetails, user, alert, fetchBranches, domainNames, branches, customerDetails, updateCustDetails, custDetails, getCustomerDetails, listDomainName, session }) => {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [sessionData, setSessionData] = useState({
    value: '2020-21',
    label: '2020-21'
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [notekey1, setKeyNote1] = useState('')
  const [notekey2, setKeyNote2] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [role, setRole] = useState('')
  const [editShowModal, setEditShowModal] = useState(false)
  const [updateName, setUpdateName] = useState('')
  const [updateEmail, setUpdateEmail] = useState('')
  const [updateNumber, setUpdateNumber] = useState('')
  const [domainId, setDomainId] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // listDomainName(sessionData && sessionData.value, user, alert)
    fetchBranches(sessionData && sessionData.value, alert, user)
    // let role = ''
    // role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    // setRole(role)
    // let role = ''
    // role = JSON.parse(localStorage.getItem('userDetails')).user_role
    // role = JSON.parse(localStorage.getItem('userDetails')).role_details.user_role
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const role = userProfile.personal_info.role.toLowerCase()
    setRole(role)
  }, [user, alert, listDomainName, sessionData, fetchBranches])

  useEffect(() => {
    if (role === 'financeadmin' || role === 'financeaccountant') {
      let branch
      getCustomerDetails(branch, sessionData && sessionData.value, role, user, alert)
      setShowTable(true)
    }
  }, [role, getCustomerDetails, sessionData, user, alert])

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

  const customerDetailsHandler = (e) => {
    if (selectedDomain && name && email && number) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        if (number && number.length === 10) {
          const data = {
            branch: selectedDomain && selectedDomain.value,
            academic_year: sessionData && sessionData.value,
            name: name,
            email: email,
            contact: number,
            note_key_1: notekey1,
            note_key_2: notekey2
          }
          setCustomerDetails(data, user, alert)
          setSelectedDomain('')
          setName('')
          setEmail('')
          setNumber(null)
          console.log('data', data)
          setShowModal(false)
        } else {
          alert.warning('Contact number should be of 10 digits!')
        }
      } else {
        alert.warning('You have entered an invalid email address!')
      }
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }
  // console.log(name, email, number, notekey1, notekey2, selectedDomain)
  const createCustomerDetailsHandler = (e) => {
    setShowModal(true)
  }

  const hideDetailsModal = () => {
    setShowModal(false)
  }

  let customerDetModal = null
  if (showModal) {
    customerDetModal = (
      <Modal open={showModal} click={hideDetailsModal} large>
        <React.Fragment>
        <h3 style={{ textAlign: 'center' }}>Add Customer Details</h3>
        <hr />
        <Grid container spacing={1} style={{ padding: 10, background: 'white' }} >
          <Grid item xs={3}>
            <label> Branch Name*</label>
            <Select
              placeholder='Select Branch'
              value={selectedDomain}
              styles={selectStyles}
              // styles={{ marginTop: 40, width: '40px' }}
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
          <Grid item xm={6} md={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={customerDetailsHandler}
            >Create Customer Details</Button>
          </Grid>
        </Grid>
        </React.Fragment>
      </Modal>
    )
  }

  const getDetailsHandler = () => {
    if (sessionData) {
      let branch
      getCustomerDetails(branch, sessionData && sessionData.value, role, user, alert)
      setShowTable(true)
    } else {
      alert.warning('Select Year!')
    }
  }

  const editCusDetailsHandler = (id, name, email, contact) => {
    setDomainId(id)
    setEditShowModal(true)
    setUpdateName(name)
    setUpdateEmail(email)
    setUpdateNumber(contact)
  }

  const updateHandleNameChange = (e) => {
    setUpdateName(e.target.value)
  }

  const updateHandleEmailChange = (e) => {
    setUpdateEmail(e.target.value)
  }

  const updateHandleNumberChange = (e) => {
    setUpdateNumber(e.target.value)
  }

  const updateCustomerDetailsHandler = () => {
    if (updateName && updateEmail && updateNumber) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(updateEmail)) {
        if (updateNumber && updateNumber.length === 10) {
          const data = {
            id: domainId,
            name: updateName,
            email: updateEmail,
            contact: updateNumber
          }
          updateCustDetails(data, user, alert)
          console.log('data', data)
          setEditShowModal(false)
        } else {
          alert.warning('Contact number should be of 10 digits!')
        }
      } else {
        alert.warning('You have entered an invalid email address!')
      }
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }
  const hideEditDetailsModal = () => {
    setEditShowModal(false)
  }

  let editcustomerDetModal = null
  if (editShowModal) {
    editcustomerDetModal = (
      <Modal open={editShowModal} click={hideEditDetailsModal} large>
        <h3 style={{ textAlign: 'center' }}>Edit Customer Details</h3>
        <hr />
        <Grid container spacing={1} style={{ padding: 10 }} >
          <Grid item xm={6} md={3}>
            <TextField
              id='name'
              type='text'
              required
              style={{ marginTop: '18px' }}
              InputLabelProps={{ shrink: true }}
              value={updateName}
              onChange={updateHandleNameChange}
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
              value={updateEmail}
              onChange={updateHandleEmailChange}
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
              value={updateNumber}
              onChange={updateHandleNumberChange}
              margin='dense'
              variant='outlined'
              label='Phone Number'
            />
          </Grid>
          <Grid item xm={6} md={3}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 18 }}
              onClick={updateCustomerDetailsHandler}
            >UPDATE</Button>
          </Grid>
        </Grid>

      </Modal>
    )
  }
  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = custDetails && custDetails.map((val, i) => {
      return {
        domain: val.branch && val.branch.branch_name ? val.branch.branch_name : val.branch,
        name: val.name ? val.name : '',
        email: val.email ? val.email : '',
        contact: val.contact ? val.contact : '',
        edit: <Button
          variant='contained'
          color='primary'
          onClick={() => editCusDetailsHandler(val.id, val.name, val.email, val.contact)}
        >EDIT CUSTOMER DETAILS</Button>
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
  //       Header: 'Customer Name',
  //       accessor: 'name',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'E-Mail',
  //       accessor: 'email',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Number',
  //       accessor: 'contact',
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
      <Grid container spacing={1} style={{ padding: 10 }} >
        {role !== 'financeadmin' && role !== 'financeaccountant'
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
        {role !== 'financeadmin' && role !== 'financeaccountant'
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
            <Grid item xm={6} md={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 18 }}
                onClick={getDetailsHandler}
              >GET</Button>
            </Grid>
          </React.Fragment>
          : [] }
      </Grid>
      {customerDetModal}
      {editcustomerDetModal}
      {/* {showTable ? studentErpTable : []} */}
      {
        showTable ?
        <React.Fragment>
                 <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch Name</TableCell>
                      <TableCell> Customer Name</TableCell>
                      <TableCell> E-Mail</TableCell>
                      <TableCell> Number</TableCell>
                      <TableCell> Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {custDetails && custDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> {val.branch && val.branch.branch_name ? val.branch.branch_name : val.branch}</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.name ? val.name : ''}</TableCell>
                      <TableCell>{val.email ? val.email : ''} </TableCell>
                      <TableCell>{val.contact ? val.contact : ''} </TableCell>
                      <TableCell> <Button
          variant='contained'
          color='primary'
          onClick={() => editCusDetailsHandler(val.id, val.name, val.email, val.contact)}
        >EDIT CUSTOMER DETAILS</Button> </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={custDetails && custDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
        </React.Fragment>
        : []}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  // domainNames: state.finance.eMandateReducer.domainNames,
  branches: state.finance.common.branchPerSession,
  custDetails: state.finance.eMandateReducer.custDetails,
  updatedCusData: state.finance.eMandateReducer.updatedCusData,
  customerDetails: state.finance.eMandateReducer.customerDetails
})

const mapDispatchToProps = (dispatch) => ({
  updateCustDetails: (data, user, alert) => dispatch(actionTypes.updateCustDetails({ data, user, alert })),
  getCustomerDetails: (branch, session, role, user, alert) => dispatch(actionTypes.getCustomerDetails({ branch, session, role, user, alert })),
  setCustomerDetails: (data, user, alert) => dispatch(actionTypes.setCustomerDetails({ data, user, alert })),
  // listDomainName: (session, user, alert) => dispatch(actionTypes.listDomainName({ session, user, alert })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((CustomerDeatils))
