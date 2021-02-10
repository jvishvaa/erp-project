import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles, Grid, Fab, CircularProgress, Modal } from '@material-ui/core/'
// import {  } from '@material-ui/icons'
import {
  Edit as EditIcon,
  AddToPhotos
} from '@material-ui/icons'
// import Icon from '@material-ui/core/Icon'
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
// import { Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import Select from 'react-select'

import classes from './accountToStore.module.css'
import * as actionTypes from '../../store/actions'
// import Modal from '../../../../ui/Modal/modal'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import { apiActions } from '../../../../_actions'

const styles = theme => ({
  root: {
    color: theme.palette.text.primary
  },
  icon: {
    margin: theme.spacing.unit,
    color: '#327ddf',
    marginTop: '0px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
})

let accToStoreState = null

class AccToBranch extends Component {
  state = {
    showAddModal: false,
    // showDeleteModal: false,
    assignFeeAccounts: null,
    // deleteMapId: null,
    // deleteAccId: null,
    addMapId: null,
    addBranchId: null,
    feeAcc: [],
    showAddAccmodal: false,
    currentBranch: null,
    currentFeeAcc: null,
    currentFeeAccount: null,
    assignFeeAccountsId: null
    // addBranchName: null
  }

  componentDidMount () {
    if (accToStoreState) {
      this.setState(accToStoreState)
    }
    if (this.props.currentSession) {
      this.fetchAccBranchMappingHandler()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentSession !== this.props.currentSession) {
      this.fetchAccBranchMappingHandler()
    }
  }

   fetchAccBranchMappingHandler = () => {
     if (this.props.currentSession === null) {
       this.props.alert.warning('Please Fill All Fields')
       return
     }
     accToStoreState = this.state
     this.props.fetchFeeAccToBrnch(this.props.currentSession, this.props.alert, this.props.user)
   }

  modalCloseHandler = () => {
    this.setState({
      showAddModal: false,
      addMapId: null,
      addBranchId: null,
      feeAcc: [],
      assignFeeAccounts: null
      // addBranchName: null
    })
  }

  modalShowHandler = (mapId, branchId, acc) => {
    console.log(acc)
    const fee = {
      value: acc.id,
      label: acc.fee_account_name
    }
    console.log('currentFeeAccount', mapId)
    this.setState({
      showAddModal: true,
      addMapId: mapId,
      addBranchId: branchId,
      assignFeeAccounts: fee,
      currentFeeAccount: mapId
      // addBranchName: branchName
    }, () => {
      this.props.fetchAllFeeAccounts(this.props.currentSession, this.state.addBranchId, this.props.alert, this.props.user)
    })
  }
  addModalShowHandler = (session) => {
    this.setState({
      showAddAccmodal: true
    }, () => {
      this.props.fetchBranches(session, this.props.alert, this.props.user)
    })
  }

  hideAddModalhandler = () => {
    this.setState({
      showAddAccmodal: false,
      currentBranch: null,
      currentFeeAcc: null
    })
  }

  selectAccountHandler = (e) => {
    console.log(e)
    this.setState({
      assignFeeAccounts: e
    })
    this.setState({
      assignFeeAccountsId: e.value
    })
  }

  changehandlerbranch = (e) => {
    this.setState({
      currentBranch: e
    }, () => {
      this.props.fetchAllFeeAccounts(this.props.currentSession, this.state.currentBranch.value, this.props.alert, this.props.user)
    })
  }

  selectCurrentAccountHandler = (e) => {
    this.setState({
      currentFeeAcc: e
    })
  }

  addDetailsHandler = () => {
    const {
      currentBranch,
      currentFeeAcc
    } = this.state
    if (!currentBranch && !currentFeeAcc) {
      this.props.alert.warning('Select All Required Fields')
      return
    }
    const data = {
      academic_year: this.props.currentSession,
      branch: currentBranch && currentBranch.value,
      fee_account_store: currentFeeAcc && currentFeeAcc.value
    }
    console.log(data)
    this.props.adddFeeAccounts(data, this.props.alert, this.props.user)
    this.hideAddModalhandler()
  }

  assignAccountHandler = (acc) => {
    const {
      assignFeeAccounts,
      addBranchId
    } = this.state
    if (!assignFeeAccounts) {
      this.props.alert.warning('Select Fee Account')
      return
    }
    const data = {
      academic_year: this.props.currentSession,
      branch: addBranchId,
      fee_account_store: assignFeeAccounts.value,
      old_fee_account_store: this.state.currentFeeAccount && this.state.currentFeeAccount
    }
    console.log(data)
    console.log('currentAcc', this.props.currentFeeAccount)
    this.props.updateFeeAccounts(data, this.props.alert, this.props.user)
  }
  activeToggleHandler = (e, r) => {
    // const {
    // } = this.state
    if (r.is_active) {
      const data = {
        session_year: this.props.currentSession,
        branch: e.branch.id,
        fee_account_store: r.id,
        is_active: true
      }
      this.props.activeInactiveAccount(data, this.props.alert, this.props.user)
    } else {
      const data = {
        session_year: this.props.currentSession,
        branch: e.branch.id,
        fee_account_store: r.id,
        is_active: false
      }
      this.props.activeInactiveAccount(data, this.props.alert, this.props.user)
    }
    // this.fetchAccBranchMappingHandler()
  }

  render () {
    let feeAccBranchList = null
    let feeAccToBranch = null
    if (this.props.feeAccToStoreMapping.length > 0) {
      feeAccBranchList = this.props.feeAccToStoreMapping.map(result => {
        return (

          <div className={classes.accBrnchMapping__branch} key={result.id}>
            <div className={classes.accBrnchMapping__branchInfo}>
              <div className={classes.accBrnchMapping__branchName}>{result.branch && result.branch.branch_name ? result.branch.branch_name : ''}</div>
            </div>
            {result.store_fee_account && result.store_fee_account.map(res => {
              return (
                <React.Fragment>
                  <div className={classes.accBrnchMapping__branch_Account}>
                    <div className={classes.accBrnchMapping__accInfo} key={result.id}>
                      <div>{ res.fee_account_name ? res.fee_account_name : ''}</div>
                    </div>
                    <div className={classes.accBrnchMapping__toggleInfo} key={result.id}>
                      {/* <div className={classes.accBrnchMapping__tgglbutton}> */}
                      <div
                        style={{ marginLeft: '-2px', marginTop: '-5px' }}

                        className={res.is_active ? [classes.storeFeeAcc__activeToggleBtn, classes.btnColorBlue].join(' ') : [classes.storeFeeAcc__activeToggleBtn, classes.btnColorRed].join(' ')}
                        onClick={() => { this.activeToggleHandler(result, res) }}
                      >
                        {res.is_active ? 'Active' : 'InActive'}
                      </div>
                      {/* </div> */}
                    </div>
                    <div className={classes.accBrnchMapping__AddInfo} key={result.id}>
                      <div className={classes.accBrnchMapping__button}>
                        <Fab
                          color='primary'
                          size='small'
                          onClick={() => { this.modalShowHandler(res.id || '', result.branch && result.branch.id, result.store_fee_account || '') }}
                        >
                          <EditIcon />
                        </Fab>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        )
      })

      feeAccToBranch = (
        <article className={classes.accBrnchMapping}>
          <div className={classes.accBrnchMapping__header}>
            <h4 className={classes.accBrnchMapping__headingBranch}>Branch</h4>
            <h4 className={classes.accBrnchMapping__headingAcc}>Fee Account Name</h4>
            <h4 className={classes.accBrnchMapping__headingToggle}>Action</h4>
            <h4 className={classes.accBrnchMapping__headingAdd}>Edit</h4>
          </div>
          <div className={classes.accBrnchMapping__body}>
            {feeAccBranchList}
          </div>
        </article>
      )
    }

    let addModal = null
    if (this.state.showAddAccmodal) {
      addModal = (
        <Modal open={this.state.showAddAccmodal} medium click={this.hideAddModalhandler}>
          <h3 className={classes.modal__heading}>Map Store Fee Accounts</h3>
          <hr />
          <Grid container style={{ padding: '15px' }}>
            <Grid item xs={6}>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                // isMulti
                value={this.state.currentBranch ? this.state.currentBranch : ''}
                options={
                  this.props.branches.length
                    ? this.props.branches.map(branch => ({
                      value: branch.branch.id,
                      label: branch.branch.branch_name
                    }))
                    : []
                }
                onChange={this.changehandlerbranch}
              />
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: '20px' }}>
              <label>Fee Account*</label>
              <Select
                placeholder='Select Fee Account'
                // isMulti
                value={this.state.currentFeeAcc ? this.state.currentFeeAcc : ''}
                options={
                  this.props.viewFeeAccList && this.props.viewFeeAccList && this.props.viewFeeAccList.length
                    ? this.props.viewFeeAccList.map(acc => ({
                      value: acc.id,
                      label: acc.fee_account_name
                    }))
                    : []
                }
                onChange={this.selectCurrentAccountHandler
                }
              />
            </Grid>
          </Grid>
          <div className={classes.modal__button}>
            <Button color='primary' variant='contained' onClick={this.addDetailsHandler}>Add</Button>
          </div>
        </Modal>
      )
    }

    let modal = null
    if (this.state.showAddModal) {
      modal = (
        <Modal open={this.state.showAddModal} medium click={this.modalCloseHandler}>
          <h3 className={classes.modal__heading}>Add/Edit Fee Accounts</h3>
          <hr />
          <Select
            placeholder='Select Fee Account'
            // isMulti
            // value={this.state.assignFeeAccounts ? { value: this.state.assignFeeAccounts.id ? this.state.assignFeeAccounts.id : '', label: this.state.assignFeeAccounts.fee_account_name ? this.state.feeAcc.fee_account_name : '' }
            //   : []}
            value={this.state.assignFeeAccounts ? this.state.assignFeeAccounts : []}
            options={
              this.props.viewFeeAccList && this.props.viewFeeAccList && this.props.viewFeeAccList.length
                ? this.props.viewFeeAccList.map(acc => ({
                  value: acc.id,
                  label: acc.fee_account_name
                }))
                : []
            }
            onChange={this.selectAccountHandler}
          />
          <div className={classes.modal__button}>
            <Button color='primary' variant='contained' onClick={this.assignAccountHandler}>Update</Button>
          </div>
        </Modal>
      )
    }

    return (
      <div className={classes.feeContainer}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', fontSize: '18px', marginright: '30px' }}>
          <AddToPhotos className={this.props.classes.icon} color='secondary'
            onClick={() => { this.addModalShowHandler(this.props.currentSession) }} />
          <label>Add Branch</label>
        </div>
        {feeAccToBranch}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {modal}
        {addModal}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  feeAccToStoreMapping: state.finance.accToStore.feeAccToStoreMapping,
  viewFeeAccList: state.finance.viewFeeAccounts.viewFeeAccList,
  remainingFeeAccToBrnch: state.finance.accToBranch.remainingFeeAccForBrnch,
  // currentFeeAccount: state.finance.receiptRangesLists.feeAccPerBrnch,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchFeeAccToBrnch: (session, alert, user) => dispatch(actionTypes.fetchStoreBranchMapping({ session, alert, user })),
  fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user })),
  updateFeeAccounts: (data, alert, user) => dispatch(actionTypes.updateFeeAccountStoreMap({ data, alert, user })),
  adddFeeAccounts: (data, alert, user) => dispatch(actionTypes.addStoreFeeAccount({ data, alert, user })),
  activeInactiveAccount: (data, alert, user) => dispatch(actionTypes.activeInactiveAccount({ data, alert, user })),
  // addFeeAccounts: (mapId, feeAccounts, branch, alert, user) => dispatch(actionTypes.addFeeAccountsToBranch({ mapId, feeAccounts, branch, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AccToBranch)))
