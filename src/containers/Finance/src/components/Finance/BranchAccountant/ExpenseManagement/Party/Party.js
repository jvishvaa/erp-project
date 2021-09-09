import React, { useEffect, useState, useReducer } from 'react'
import { connect } from 'react-redux'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  withStyles,
  Button,
  Divider,
  TextField,
  Grid,
  Typography,
  Modal,
  CircularProgress
} from '@material-ui/core'

import {
  Edit,
  Delete
} from '@material-ui/icons'

import * as actionTypes from '../../../store/actions'
import styles from './party.styles'
import Layout from '../../../../../../../Layout'
import Select from 'react-select'
// import { Modal, CircularProgress } from '../../../../../ui'



const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Expanse Management' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Petty Cash Expense') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
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

const initialState = {
  editName: null,
  editPhone: null,
  editGst: null,
  editPan: null,
  editAddress: null,
  editId: null,
  session: {
    label: '2021-22',
    value: '2021-22'
  }
}

const editReducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        editName: action.payload.name,
        editPhone: action.payload.phone,
        editGst: action.payload.gst,
        editPan: action.payload.pan,
        editAddress: action.payload.address,
        editId: action.payload.id
      }
    }
    case 'NAME': {
      return {
        ...state,
        editName: action.payload.name
      }
    }
    case 'PAN': {
      return {
        ...state,
        editPan: action.payload.pan
      }
    }
    case 'GST': {
      return {
        ...state,
        editGst: action.payload.gst
      }
    }
    case 'PHONE': {
      return {
        ...state,
        editPhone: action.payload.phone
      }
    }
    case 'ADDRESS': {
      return {
        ...state,
        editAddress: action.payload.address
      }
    }
    case 'EMPTY' : {
      return {
        editName: null,
        editPhone: null,
        editGst: null,
        editPan: null,
        editAddress: null
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

const Party = ({ user, alert, fetchPartyList, classes, sessions, fetchBranches, handleAcademicyear, changehandlerbranch, branches, selectedbranchIds, ...props }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [pan, setPan] = useState(null)
  const [gst, setGst] = useState(null)
  const [address, setAddress] = useState(null)

  const [editState, dispatch] = useReducer(editReducer, initialState)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [sessionData, setSessionData] = useState('')
  const [selectedBranches, setSelectedBranches] = useState('')
  const [session, setSession] = useState('')
  useEffect(() => {
    // fetchPartyList(user, alert)
  }, [fetchPartyList, user, alert])

  handleAcademicyear = (e) => {
    setSessionData(e)
    setSession(e.value)
    // this.setState({ session: e.value, sessionData: e}, () => {
    fetchBranches(e.value, alert, user, moduleId)
    // })
  }

  changehandlerbranch = (e) => {
    // this.props.fetchGrades(this.props.alert, this.props.user, moduleId, e.value, this.state.session)
    // this.setState({ selectedBranches: e})
    setSelectedBranches(e)
   fetchPartyList(user, alert, session, e?.value)
  }
  let circularProgress = null
  if (props.dataLoading) {
    circularProgress = (
      <CircularProgress />
    )
  }

  const addPartyHandler = () => {
    if (!name ||
      !phone ||
      !address ||
      !phone.length ||
      !name.length ||
      !address.length) {
      alert.warning('Please Fill all Required Fields')
      return
    }
    if (phone.length !== 10) {
      alert.warning('Phone Number should be of 10 Digits')
      return
    }
    props.saveParty(name, phone, gst, pan, address, user, alert, selectedBranches && selectedBranches.value)
    setShowAddModal(false)
  }

  const showEditModalHandler = (id, name, contact, gst, pan, address) => {
    // setEditId(id)
    dispatch({
      type: 'INIT',
      payload: {
        id,
        name,
        gst,
        pan,
        address,
        phone: contact
      }
    })
    setShowEditModal(true)
  }

  const hideEditModalHandler = () => {
    dispatch({
      type: 'EMPTY'
    })
    setShowEditModal(false)
  }

  const showDeleteModalHandler = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const editPartyHandler = () => {
    if (!editState.editName ||
      !editState.editPhone ||
      !editState.editAddress ||
      !editState.editPhone.length ||
      !editState.editName.length ||
      !editState.editAddress.length) {
      alert.warning('Please Fill all Required Fields')
      return
    }
    if (editState.editPhone.length !== 10) {
      alert.warning('Phone Number should be of 10 Digits')
    }
    const {
      editId,
      editName,
      editPhone,
      editGst,
      editPan,
      editAddress
    } = editState

    props.editParty(editId, editName, editPhone, editGst, editPan, editAddress, user, alert)
    setShowEditModal(false)
  }

  const deletePartyHandler = () => {
    props.deleteParty(deleteId, user, alert)
    setShowDeleteModal(false)
  }

  let addModal = null
  if (showAddModal) {
    addModal = (
      <div >
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}  style={{ maxWidth: '700px', minHeight: '400px', display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', margin: 'auto'}}>
        <React.Fragment>
        <Grid container spacing={8} style={{ background: 'white' }}>
          <Grid item xs={12} md={12}>
        <Typography variant='h4' className={classes.modalHeader}>Add Party</Typography>
        <Divider className={classes.divider} />
        </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              required
              label='Name'
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              required
              label='Contact No.'
              type='number'
              value={phone || ''}
              onChange={(e) => setPhone(e.target.value)}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='GST No.'
              value={gst || ''}
              onChange={(e) => setGst(e.target.value)}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='PAN No.'
              value={pan || ''}
              onChange={(e) => setPan(e.target.value)}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label='Address'
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
              className={classes.textField}
              margin='normal'
              variant='outlined'
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12} md={6}>
          <Button
          style={{ marginTop: '40px'}}
            variant='contained'
            color='primary'
            className={classes.modalButton}
            onClick={addPartyHandler}
          >Save</Button>
      </Grid>
        </Grid>
        </React.Fragment>
      </Modal>
      </div>
    )
  }

  let editModal = null
  if (showEditModal) {
    editModal = (
      <Modal open={showEditModal} onClose={hideEditModalHandler} style={{ maxWidth: '700px', minHeight: '400px', display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', margin: 'auto'}}>
        <React.Fragment >
        <Grid container spacing={8} style={{ background: 'white'}}>
        <Grid item xs={12} md={12}>
        <Typography variant='h4' className={classes.modalHeader}>Edit Party</Typography>
        <Divider className={classes.divider} />
        </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label='Name'
              value={editState.editName || ''}
              onChange={(e) => dispatch({
                type: 'NAME',
                payload: {
                  name: e.target.value
                }
              })}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label='Contact No.'
              type='number'
              value={editState.editPhone || ''}
              onChange={(e) => dispatch({
                type: 'PHONE',
                payload: {
                  phone: e.target.value
                }
              })}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='GST No.'
              value={editState.editGst || ''}
              onChange={(e) => dispatch({
                type: 'GST',
                payload: {
                  gst: e.target.value
                }
              })}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='PAN No.'
              value={editState.editPan || ''}
              onChange={(e) => dispatch({
                type: 'PAN',
                payload: {
                  pan: e.target.value
                }
              })}
              className={classes.textField}
              margin='normal'
              fullWidth
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label='Address'
              value={editState.editAddress || ''}
              onChange={(e) => dispatch({
                type: 'ADDRESS',
                payload: {
                  address: e.target.value
                }
              })}
              className={classes.textField}
              margin='normal'
              variant='outlined'
              fullWidth
              multiline
            />
          </Grid>
        <Grid item xs={6} md={6}>
          <Button
          style={{ marginTop: '20px'}}
            variant='contained'
            color='primary'
            // className={classes.modalButton}
            onClick={editPartyHandler}
          >Update</Button>
        </Grid>
        </Grid>
        </React.Fragment>
      </Modal>
    )
  }

  let deleteModal = null
  if (showDeleteModal) {
    deleteModal = (<Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} style={{ maxWidth: '700px', minHeight: '400px', display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', margin: 'auto'}}>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: '15', background: 'white' }}>   
        <Grid item xs='12'> 
        <Typography variant='h4' className={classes.modalHeader}>Delete Party</Typography>
      <Divider className={classes.divider} />
      </Grid>  
      <Grid item xs='3'> 
      </Grid>
      <Grid item xs='4'> 
        <Button
          // className={classes.backBtn}
          variant='contained'
          color='primary'
          onClick={() => setShowDeleteModal(false)}
        >Go Back</Button>
        </Grid>
        <Grid item xs='4'> 
        <Button
          // className={classes.deleteBtn}
          variant='contained'
          color='secondary'
          onClick={deletePartyHandler}
        >Delete</Button>
        </Grid>
      </Grid>
      </React.Fragment>
    </Modal>)
  }

  return (
    <Layout>
    <React.Fragment>
    <Grid container spacing={3} style={{ padding: 15 }}>
      <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={sessionData ? sessionData : ''}
              options={
                sessions
                  ? sessions && sessions.map(session => ({
                    value: session?.session_year,
                    label: session?.session_year
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
                selectedbranchIds !== 'all' ? branches.length && branches
                  ? branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : [] : []
              }

              onChange={changehandlerbranch}
            />
          </Grid>
          </Grid>
  <Grid container spacing={3} style={{ padding: 15 }}>
    <Grid item xs ='10'>

    </Grid>
    <Grid item xs ='2'>
        <Button
          variant='contained'
          color='primary'
          // className={classes.button}
          onClick={() => setShowAddModal(true)}
        >
          Add Party
        </Button>
        </Grid>
  </Grid>
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Party Name</TableCell>
            <TableCell>Contact Number</TableCell>
            <TableCell>PAN No.</TableCell>
            <TableCell>GST No.</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.partyList.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.party_name || ''}</TableCell>
              <TableCell>{item.contact_no || ''}</TableCell>
              <TableCell>{item.pan_no || ''}</TableCell>
              <TableCell>{item.gstin_no || ''}</TableCell>
              <TableCell>{item.address_no || ''}</TableCell>
              <TableCell>
                <Edit
                  className={classes.editIcon}
                  onClick={() => showEditModalHandler(item.id, item.party_name, item.contact_no, item.gstin_no, item.pan_no, item.address_no)}
                />
                <Delete
                  className={classes.deleteIcon}
                  onClick={() => showDeleteModalHandler(item.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {circularProgress}
      {addModal}
      {editModal}
      {deleteModal}
    </React.Fragment>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  partyList: state.finance.accountantReducer.expenseMngmtAcc.party.partyList,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  sessions: state.finance.common.financialYear,
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear(moduleId)),
  fetchPartyList: (user, alert, session, branch) => dispatch(actionTypes.partyList({ user, alert, session, branch })),
  saveParty: (name, contact, gst, pan, address, user, alert, branch) => dispatch(actionTypes.saveParty({ name, contact, gst, pan, address, user, alert, branch })),
  editParty: (id, name, contact, gst, pan, address, user, alert) => dispatch(actionTypes.editParty({ id, name, contact, gst, pan, address, user, alert })),
  deleteParty: (id, user, alert) => dispatch(actionTypes.deleteParty({ id, user, alert })),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Party))
