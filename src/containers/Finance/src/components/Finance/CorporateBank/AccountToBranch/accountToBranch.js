import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/'
import Icon from '@material-ui/core/Icon'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
// import { Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import Select from 'react-select'

import classes from './accountToBranch.module.css'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
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

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}

let moduleId = null
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Banks & Fee Accounts' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Manage Bank & Fee Accounts') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId= item.child_id
          // })
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

let accToBranchState = null

class AccToBranch extends Component {
  state = {
    showModal: false,
    showDeleteModal: false,
    assignFeeAccounts: [],
    deleteMapId: null,
    deleteAccId: null,
    addMapId: null,
    addBranchId: null,
    addBranchName: null
  }

  componentDidMount () {
    if (accToBranchState) {
      this.setState(accToBranchState)
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
    accToBranchState = this.state
    this.props.fetchFeeAccToBrnch(this.props.currentSession, this.props.alert, this.props.user, moduleId)
  }

  // sessionChangeHandler = (e) => {
  //   this.setState({
  //     currentSession: e.value
  //   })
  // }
  remaingFeeAccountHandler = (mapId) => {
    this.props.fetchRemainingFeeAccToBranch(this.props.currentSession, mapId, this.props.alert, this.props.user)
  }

  modalCloseHandler = () => {
    this.setState({
      showModal: false,
      addMapId: null,
      addBranchId: null,
      addBranchName: null
    })
  }

  modalShowHandler = (mapId, branchId, branchName) => {
    this.setState({
      showModal: true,
      addMapId: mapId,
      addBranchId: branchId,
      addBranchName: branchName
    }, () => {
      this.remaingFeeAccountHandler(mapId)
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      deleteAccId: null,
      deleteMapId: null
    })
  }

  deleteModalShowHandler = (mapId, accId) => {
    this.setState({
      showDeleteModal: true,
      deleteAccId: accId,
      deleteMapId: mapId
    })
  }

  selectAccountHandler = (e) => {
    this.setState({
      assignFeeAccounts: e
    })
  }

  deleteFeeAccountHandler = () => {
    this.props.deleteFeeAccount(this.state.deleteMapId, this.state.deleteAccId, this.props.alert, this.props.user)
    this.setState({
      showDeleteModal: false,
      deleteAccId: null,
      deleteMapId: null
    })
  }

  assignAccountHandler = () => {
    if (this.state.assignFeeAccounts.length === 0) {
      this.props.alert.warning('Please Assign Some Fee Accounts')
      return
    }
    const feeAccounts = this.state.assignFeeAccounts.map(acc => {
      return {
        id: acc.value,
        'fee_account_name': acc.label
      }
    })
    const branch = {
      id: this.state.addBranchId,
      'branch_name': this.state.addBranchName
    }
    this.props.addFeeAccounts(this.state.addMapId, feeAccounts, branch, this.props.alert, this.props.user)
    this.setState({
      showModal: false,
      addMapId: null,
      addBranchId: null,
      addBranchName: null,
      assignFeeAccounts: []
    })
  }

  render () {
    let feeAccBranchList = null
    let feeAccToBranch = null
    if (this.props.feeAccToBranchMapping.length) {
      feeAccBranchList = this.props.feeAccToBranchMapping.map(result => {
        return (
          <div className={classes.accBrnchMapping__branch} key={result.id}>
            <div className={classes.accBrnchMapping__branchInfo}>
              <div className={classes.accBrnchMapping__branchName}>{result.branch.branch_name}</div>
              <div className={classes.accBrnchMapping__icon}><AddCircleOutlineIcon className={this.props.classes.icon} color='secondary'
                onClick={() => { this.modalShowHandler(result.id, result.branch.id, result.branch.branch_name) }} ></AddCircleOutlineIcon></div>
            </div>
            <div className={classes.accBrnchMapping__brnchAccInfo}>
              {result.fee_account_name.map((account, index) => {
                return (
                  <div className={classes.accBrnchMapping__accInfo} key={index}>
                    <div className={classes.accBrnchMapping__accName}>{account.fee_account_name}</div>
                    <div className={classes.accBrnchMapping__dlt}>
                      <DeleteOutlinedIcon className={this.props.classes.root} onClick={() => this.deleteModalShowHandler(result.id, account.id)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })

      feeAccToBranch = (
        <article className={classes.accBrnchMapping}>
          <div className={classes.accBrnchMapping__header}>
            <h4 className={classes.accBrnchMapping__headingSmall}>Branch</h4>
            <h4 className={classes.accBrnchMapping__headingBig}>Fee Account Name</h4>
          </div>
          <div className={classes.accBrnchMapping__body}>
            {feeAccBranchList}
          </div>
        </article>
      )
    }

    let modal = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.modalCloseHandler}>
          <h3 className={classes.modal__heading}>Assign Fee Accounts</h3>
          <hr />
          <Select
            placeholder='Select Fee Account'
            isMulti
            options={
              this.props.remainingFeeAccToBrnch.length
                ? this.props.remainingFeeAccToBrnch.map(acc => ({
                  value: acc.id,
                  label: acc.fee_account_name
                }))
                : []
            }
            onChange={this.selectAccountHandler}
          />
          <div className={classes.modal__button}>
            <Button color='primary' variant='contained' onClick={this.assignAccountHandler}>Assign</Button>
          </div>
        </Modal>
      )
    }
    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classes.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classes.modal__deletebutton}>
            <Button color='secondary' variant='contained' onClick={this.deleteFeeAccountHandler}>Delete</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button color='primary' variant='contained' onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    return (
      <div className={classes.feeContainer}>
        {feeAccToBranch}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {modal}
        {deleteModal}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  feeAccToBranchMapping: state.finance.accToBranch.feeAccToBranchMapping,
  remainingFeeAccToBrnch: state.finance.accToBranch.remainingFeeAccForBrnch,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchFeeAccToBrnch: (session, alert, user, moduleId) => dispatch(actionTypes.fetchFeeAccountBranchMapping({ session, alert, user, moduleId })),
  fetchRemainingFeeAccToBranch: (session, mapId, alert, user) => dispatch(actionTypes.fetchRemainingFeeAcc({ session, mapId, alert, user })),
  deleteFeeAccount: (mapId, accId, alert, user) => dispatch(actionTypes.deleteFeeAccountBranchMapping({ mapId, accId, alert, user })),
  addFeeAccounts: (mapId, feeAccounts, branch, alert, user) => dispatch(actionTypes.addFeeAccountsToBranch({ mapId, feeAccounts, branch, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AccToBranch)))
