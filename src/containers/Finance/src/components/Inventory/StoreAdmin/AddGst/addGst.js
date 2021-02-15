import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import {
  withStyles,
  Grid,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core/'
// import { AddCircle, DeleteForever } from '@material-ui/icons'

import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'
// import { FilterInnerComponent, filterMethod } from '../../../Finance/FilterInnerComponent/filterInnerComponent'
// import classesCSS from './kit.module.css'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
    backgroundColor: '#2196f3',
    marginTop: '0px',
    '&:hover': {
      backgroundColor: '#1a8cff'
    }
  },
  divIcon: {
    paddingTop: '30px'
  },
  icon: {
    color: '#2196f3',
    fontWeight: 'bolder',
    fontSize: 30,
    '&:hover': {
      color: '#1a8cff',
      cursor: 'pointer'
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: 'rgb(225, 0, 80)'
  },
  container: {
    padding: '20px 40px'
  },
  header: {
    fontSize: 16
  }
})

const AddGst = ({ classes, session, branches, alert, user, fetchBranches, fetchGstList, gstList, addGstList, dataLoading }) => {
  const [sessionData, setSessionData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [multiBranch, setMultiBranch] = useState([])
  const [gst, setGst] = useState(null)
  const [storeHead, setStoreHead] = useState(null)
  const [storeAddress, setStoreAddress] = useState(null)
  const [stateName, setStateName] = useState(null)
  const [stateCode, setStateCode] = useState(null)

  useEffect(() => {

  }, [])

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setBranchData(null)
    fetchBranches(e.value, alert, user)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
  }

  const openAddModalHandler = () => {
    setMultiBranch([])
    setGst(null)
    setStoreHead(null)
    setStoreAddress(null)
    setStateName(null)
    setStateCode(null)
    setShowModal(!showModal)
  }

  const changeMultibranch = (e) => {
    console.log(e)
    setMultiBranch(e)
  }

  const handleGst = (e) => {
    if (e.target.value < 0) {
      alert.warning('Input Value should not less then zero!')
    } else {
      setGst(e.target.value)
    }
  }

  const handleStateName = (e) => {
    setStateName(e.target.value)
  }

  const handleStateCode = (e) => {
    setStateCode(e.target.value)
  }

  const handleStoreAddress = (e) => {
    setStoreAddress(e.target.value)
  }
  const handleStoreHead = (e) => {
    setStoreHead(e.target.value)
  }

  const getGstHandler = () => {
    // hit fetch api
    if (!sessionData || !branchData) return alert.warning('Select Session and branch')
    fetchGstList(sessionData.value, branchData.value, user, alert)
  }

  const addGstHandler = () => {
    // hit add api
    if (!sessionData || !multiBranch.length || !gst || gst < 0 || stateCode < 0 || !stateCode || !stateName || !storeHead || !storeAddress) return alert.warning('fill all fields')
    let branchIds = multiBranch.map(branch => branch.value)
    let body = {
      academic_year: sessionData.value,
      branch: branchIds,
      gst_no: gst,
      store_head: storeHead,
      store_address: storeAddress,
      state_name: stateName,
      state_code: stateCode
    }
    addGstList(body, user, alert)
    setShowModal(!showModal)
  }

  const gstTable = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Gst No
                  </TableCell>
                  <TableCell>
                    Is Active
                  </TableCell>
                  <TableCell>
                    State Name
                  </TableCell>
                  <TableCell>
                    State Code
                  </TableCell>
                  <TableCell>
                    Store Header
                  </TableCell>
                  <TableCell>
                    Store Address
                  </TableCell>
                  <TableCell>
                    Created Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gstList.length
                  ? gstList.map((row) => {
                    return (
                      <TableRow>
                        <TableCell>{row.gst_no}</TableCell>
                        <TableCell>{row.is_active ? 'Active' : 'InActive'}</TableCell>
                        <TableCell>{row.state ? row.state : ''}</TableCell>
                        <TableCell>{row.state_code ? row.state_code : ''}</TableCell>
                        <TableCell>{row.store_header ? row.store_header : ''}</TableCell>
                        <TableCell>{row.store_address ? row.store_address : ''}</TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    )
                  })
                  : null}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  const modal = () => {
    return (
      <React.Fragment>
        <Modal open={showModal} style={{ width: '40%', padding: '10px 20px' }} click={openAddModalHandler} medium>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                isMulti
                value={multiBranch}
                options={
                  branches.length
                    ? branches.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
                    : []
                }
                onChange={changeMultibranch}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='gst'
                label='GST'
                type='text'
                min='0'
                variant='outlined'
                value={gst}
                // className={classes.textField}
                style={{ zIndex: 0 }}
                onChange={handleGst}
                InputLabelProps={{ shrink: true }}
                // InputLabelProps={{ classes: { outlined: 'zIndex: 0' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField type='text' style={{ zIndex: 0 }} InputLabelProps={{ shrink: true }} variant='outlined' value={storeHead || ''} label='Store Receipt Head' onChange={handleStoreHead} />
            </Grid>
            <Grid item xs={6}>
              <TextField type='text' style={{ zIndex: 0 }} InputLabelProps={{ shrink: true }} variant='outlined' value={storeAddress || ''} label='Store Address' onChange={handleStoreAddress} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='state'
                label='State Name'
                style={{ zIndex: 0 }}
                type='text'
                variant='outlined'
                value={stateName || ''}
                // className={classes.textField}
                onChange={handleStateName}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='stateCode'
                label='State Code'
                type='number'
                min='0'
                variant='outlined'
                style={{ zIndex: 0 }}
                value={stateCode || ''}
                // className={classes.textField}
                onChange={handleStateCode}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant='contained'
                color='primary'
                // style={{ marginTop: '20px' }}
                disabled={!multiBranch.length || !gst}
                onClick={addGstHandler}
              >ADD GST</Button>
            </Grid>
          </Grid>
        </Modal>
      </React.Fragment>
    )
  }

  return (
    <Layout>
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <label className={classes.header}>
            State Wise GST
          </label>
        </Grid>
        <Grid item xs={2}>
          {sessionData
            ? <Button
              variant='contained'
              color='primary'
              // style={{ marginTop: '20px' }}
              onClick={openAddModalHandler}
            >ADD GST</Button>
            : null}
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
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={branchData}
            options={
              branches.length
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }
            onChange={changehandlerbranch}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={getGstHandler}
          >GET</Button>
        </Grid>
      </Grid>
      { gstList.length ? gstTable() : null }
      { showModal ? modal() : null }
      { dataLoading ? <CircularProgress open /> : null }
    </div>
    </Layout>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader,
  gstList: state.inventory.storeAdmin.addGst.gstList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGstList: (session, branch, user, alert) => dispatch(actionTypes.fetchGstList({ session, branch, user, alert })),
  addGstList: (body, user, alert) => dispatch(actionTypes.addGstList({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddGst))
