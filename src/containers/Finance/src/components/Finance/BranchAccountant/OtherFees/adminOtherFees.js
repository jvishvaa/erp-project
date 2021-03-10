import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  // Typography,
  // Divider,
  withStyles,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from '@material-ui/core/'
import Select from 'react-select'
import { DeleteOutlined, Edit, Info } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'

import * as actionTypes from '../../store/actions'
import EditOtherFee from './editOtherFee'
import classess from './deleteModal.module.css'
import { apiActions } from '../../../../_actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'scroll'
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
// let feeState = null

class AdminOtherFees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: '',
      sessionData: [],
      branchId: '',
      branchData: [],
      showInstModal: false,
      instId: '',
      showDeleteModal: false,
      otherFee: '',
      showEditModal: false,
      otherFeeId: '',
      showEditInstaModal: false,
      instaId: null,
      instaName: '',
      moduleId: null
    }
  }

  // componentDidMount () {
  //   if (feeState) {
  //     this.setState(feeState)
  //   }
  // }
  componentDidMount () {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Transport Fees' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Add Transport Fees') {
              // setModuleId(item.child_id);
              // setModulePermision(true);
              this.setState({
                moduleId: item.child_id
              })
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
  }

  componentWillUnmount () {
    this.props.clearProps()
  }

  handleAcademicyear = (e) => {
    // console.log(e)
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, this.state.moduleId)
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  addotherFeesHandler = () => {
    const {
      sessionData,
      branchData
    } = this.state
    if (sessionData.value && branchData.value) {
      this.props.history.push({
        pathname: '/feeType/add_otherFee',
        state: {
          currentYear: sessionData,
          currentBranch: branchData
        }
      })
    }
  }

  getOtherFees = () => {
    const {
      session,
      branchId
    } = this.state
    if (!session || !branchId) {
      this.props.alert.warning('Select Required Fields')
    } else {
      this.props.fetchOtherFees(session, branchId, this.props.alert, this.props.user)
      // feeState = this.state
    }
  }

  showEditModalHandler = (id) => {
    this.setState({
      showEditModal: true,
      otherFeeId: id
    })
  }

  hideEditModalHandler = () => {
    this.setState({
      showEditModal: false
    })
  }

  deleteModalShowHandler = () => {
    this.setState({ showDeleteModal: true })
  }

  deleteModalCloseHandler = () => {
    this.setState({ showDeleteModal: false })
  }

  showInstaModalHandler = (id, name) => {
    this.setState({
      showInstModal: true,
      instId: id,
      otherFee: name
    }, () => {
      this.props.instLists(this.state.session, this.state.branchData.label, this.state.instId, this.props.alert, this.props.user)
    })
  }

  hideInstModalHandler = () => {
    this.setState({
      showInstModal: false
    })
  }

  deleteInstallHandler = () => {
    // TODO: delete the installment
    const {
      session,
      branchId,
      instId
      // otherFee
    } = this.state
    const {
      alert,
      user
    } = this.props
    if (session && branchId && instId) {
      this.props.deleteInstallments(session, branchId, instId, alert, user)
      this.deleteModalCloseHandler()
      this.hideInstModalHandler()
    } else {
      alert.warning('Select Required fields')
    }
  }

  showEditInstaModalHandler = (id, name) => {
    console.log(id)
    this.setState({
      instaId: id,
      instaName: name,
      showEditInstaModal: true
    })
  }

  hideEditInstaModalHandler = () => {
    this.setState({
      instaId: null,
      instaName: '',
      showEditInstaModal: false
    })
  }

  handleInstaName = (e) => {
    this.setState({
      instaName: e.target.value
    })
  }

  editInstalNameHandler = () => {
    // set id and name from state
    let body = {
      id: this.state.instaId,
      installment_name: this.state.instaName
    }
    this.props.updateOtherFeeInstaName(body, this.props.alert, this.props.user)
    this.hideEditInstaModalHandler()
  }

  render () {
    let { classes } = this.props

    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideEditModalHandler}>
          <EditOtherFee
            acadId={this.state.session}
            branchId={this.state.branchId}
            otherFeeId={this.state.otherFeeId}
            erpNo={this.props.erp}
            alert={this.props.alert}
            user={this.props.user}
            close={this.hideEditModalHandler}
          />
        </Modal>
      )
    }

    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small style={{ border: '1px solid black' }}>
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button variant='outlined' color='secondary' onClick={this.deleteInstallHandler}>Delete</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button variant='outlined' color='primary' onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let instaEditModal = null
    if (this.state.showEditInstaModal) {
      instaEditModal = (
        <Modal open={this.state.showEditInstaModal} click={this.hideEditInstaModalHandler} medium style={{ zIndex: 9999, padding: 15 }}>
          <h3 className={classess.modal__heading}>Edit Installment Name</h3>
          <hr />
          <TextField
            id='instaName'
            label='Name'
            type='text'
            variant='outlined'
            value={this.state.instaName}
            style={{ width: '300px' }}
            onChange={(e) => this.handleInstaName(e)}
            InputLabelProps={{ shrink: true }}
            // InputLabelProps={{ classes: { outlined: 'zIndex: 0' } }}
          />
          <div className={classess.modal__deletebutton}>
            <Button variant='contained' color='secondary' disabled={this.state.instaName.length === 0} onClick={this.editInstalNameHandler}>Update</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button variant='contained' color='primary' onClick={this.hideEditInstaModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let instdetails = null
    if (this.props.installmentLists && this.props.installmentLists.length > 0) {
      instdetails = this.props.installmentLists.map((fee, index) => {
        return (
          <React.Fragment>
            <TableRow>
              <TableCell align='center'>{index + 1}</TableCell>
              <TableCell align='center'>{fee.installment_name ? fee.installment_name : ''}</TableCell>
              <TableCell align='center'>{fee.installment_start_date ? fee.installment_start_date : ''}</TableCell>
              <TableCell align='center'>{fee.due_date ? fee.due_date : ''}</TableCell>
              <TableCell align='center'>{fee.installment_end_date ? fee.installment_end_date : ''}</TableCell>
              <TableCell align='center'>{fee.installment_amount ? fee.installment_amount : ''}</TableCell>
              <TableCell>
                <Edit id='editOtherFeeInsta' style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.showEditInstaModalHandler(fee.id, fee.installment_name)} />
              </TableCell>
              {/* <TableCell align='center'>Delete</TableCell> */}
            </TableRow>
          </React.Fragment>
        )
      })
    }

    let instModal = null
    if (this.state.showInstModal) {
      instModal = (
        <Modal open={this.state.showInstModal} click={this.hideInstModalHandler}>
          <div style={{ padding: '30px' }}>
            <label>Installment Details</label>
            <DeleteOutlined style={{ float: 'right', cursor: 'pointer' }} onClick={this.deleteModalShowHandler} />
            <label style={{ float: 'right' }}>Delete Installment Details </label>
            <div className={classes.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>S.No</TableCell>
                    <TableCell align='center'>Installment Name</TableCell>
                    <TableCell align='center'>Installment Start Date</TableCell>
                    <TableCell align='center'>Installment Due Date</TableCell>
                    <TableCell align='center'>Installment End Date</TableCell>
                    <TableCell align='center'>Installment Amount</TableCell>
                    <TableCell align='center'>Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instdetails}
                </TableBody>
              </Table>
            </div>
          </div>
        </Modal>
      )
    }

    let feeDetails = null
    if (this.props.otherFees && this.props.otherFees.length > 0) {
      feeDetails = this.props.otherFees.map((fee, index) => {
        return (
          <React.Fragment>
            <TableRow>
              <TableCell align='center'>{index + 1}</TableCell>
              <TableCell align='center'>
                {fee.fee_type_name ? fee.fee_type_name : 'NA'}
              </TableCell>
              <TableCell align='center'>{fee.fee_account && fee.fee_account.fee_account_name ? fee.fee_account.fee_account_name : ''}</TableCell>
              <TableCell align='center'>{fee.sub_type ? fee.sub_type : ''}</TableCell>
              <TableCell align='center'>{fee.start_date ? fee.start_date : ''}</TableCell>
              <TableCell align='center'>{fee.due_date ? fee.due_date : ''}</TableCell>
              <TableCell align='center'>{fee.end_date ? fee.end_date : ''}</TableCell>
              <TableCell align='center'>{fee.amount ? fee.amount : ''}</TableCell>
              <TableCell align='center' style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.showInstaModalHandler(fee.id, fee.fee_type_name)}>
                <Info />
              </TableCell>
              <TableCell>
                <Edit id='editOtherFee' style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.showEditModalHandler(fee.id)} />
              </TableCell>
              {/* <TableCell align='center'>Delete</TableCell> */}
            </TableRow>
          </React.Fragment>
        )
      })
    }

    let otherFeesList = null
    if (this.props.otherFees && this.props.otherFees.length > 0) {
      otherFeesList = (
        <div className={classes.tableWrapper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>S.No</TableCell>
                <TableCell align='center'>Other Fee Name</TableCell>
                <TableCell align='center'>Fee Account</TableCell>
                <TableCell align='center'>Sub Fee Type</TableCell>
                <TableCell align='center'>Start Date</TableCell>
                <TableCell align='center'>Due Date</TableCell>
                <TableCell align='center'>End Date</TableCell>
                <TableCell align='center'>Amount</TableCell>
                <TableCell align='center'>Info</TableCell>
                <TableCell align='center'>Edit</TableCell>
                {/* <TableCell align='center'>Delete</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {feeDetails}
            </TableBody>
          </Table>
        </div>
      )
    }

    return (
      <Layout>      
      <React.Fragment>
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '15px' }}>
            <Button
              primary
              style={{ padding: '10px 20px', marginTop: 20 }}
              onClick={this.addotherFeesHandler}
              color='primary'
              size='small'
              variant='contained'
            >
              Add Other Fees
            </Button>
          </div>
        </div>
        <Grid container spacing={3} style={{ padding: '10px' }}>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session ? this.props.session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={(e) => this.handleAcademicyear(e)}
            />
          </Grid>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={(e) => this.changehandlerbranch(e)}
            />
          </Grid>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px', marginTop: '20px' }}>
            <Button
              primary
              style={{ padding: '10px 20px' }}
              onClick={this.getOtherFees}
              color='primary'
              size='small'
              variant='contained'
            >
              Get Other Fees
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: '10px' }} justify='center' alignItems='center'>
          <Grid item xs={11} style={{ padding: '10px' }} justify='center' alignItems='center'>
            {otherFeesList}
          </Grid>
        </Grid>
        {instaEditModal}
        {editModal}
        {instModal}
        {deleteModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  session: state.academicSession.items,
  user: state.authentication.user,
  otherFees: state.finance.accountantReducer.listOtherFee.adminOtherfees,
  branches: state.finance.common.branchPerSession,
  installmentLists: state.finance.accountantReducer.listOtherFee.listInstallments,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchOtherFees: (session, branch, alert, user) => dispatch(actionTypes.fetchAdminOtherFees({ session, branch, alert, user })),
  deleteInstallments: (session, branch, feeName, alert, user) => dispatch(actionTypes.deleteOtherFeesInstallments({ session, branch, feeName, alert, user })),
  instLists: (session, branch, otherFee, alert, user) => dispatch(actionTypes.fetchInstallmentLists({ session, branch, otherFee, alert, user })),
  clearProps: () => dispatch(actionTypes.clearingAllProps()),
  updateOtherFeeInstaName: (body, alert, user) => dispatch(actionTypes.updateOtherFeeInstaName({ body, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AdminOtherFees)))
