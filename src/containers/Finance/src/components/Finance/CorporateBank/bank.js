import React, { Component } from 'react'
// import { Button } from 'semantic-ui-react'
import { withStyles, Button, CircularProgress } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import Icon from '@material-ui/core/Icon'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
// import '../../css/staff.css'
import * as actionTypes from '../store/actions/index'
import Modal from '../../../ui/Modal/modal'
// import CircularProgress from '../../../ui/CircularProgress/circularProgress'

import classes from './bank.module.css'

let bankState = null

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  icon: {
    margin: theme.spacing.unit,
    color: '#327ddf',
    marginTop: '0px',
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

class Bank extends Component {
  constructor (props) {
    super(props)
    this.state = {
      assignBankModal: false,
      assignFeeModal: false,
      selectedBranch: null,
      selectedBanks: [],
      selectedMappingId: null,
      selectedBankMapId: null,
      selectedFeeAccount: null
    }
  }

  componentDidMount () {
    if (bankState !== null) {
      this.setState(bankState)
    }
    if (this.props.currentSession) {
      this.fetchBankDetailsHandler()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.currentSession !== prevProps.currentSession) {
      this.fetchBankDetailsHandler()
    }
  }

  fetchBankDetailsHandler = () => {
    if (this.props.currentSession === null) {
      this.props.alert.warning('Please Enter All Fields')
      return
    }
    this.props.fetchBankDetails(this.props.currentSession, this.props.user, this.props.alert)
    // bankState = this.state
  }

  assignBankModalShowHandler = (branchId) => {
    this.setState({
      assignBankModal: true,
      selectedBranch: branchId
    }, () => {
      this.props.fetchRemainingBanks(this.props.currentSession, branchId, this.props.user, this.props.alert)
    })
  }

  assignBankModalHideHandler = () => {
    this.setState({
      assignBankModal: false,
      selectedBranch: null
    })
  }

  assignFeeModalShowHandler = (mappingId, bankMapId, branchId) => {
    this.setState({
      assignFeeModal: true,
      selectedBranch: branchId,
      selectedBankMapId: bankMapId,
      selectedMappingId: mappingId
    }, () => {
      this.props.fetchFeeAccounts(branchId, this.props.user, this.props.alert, this.props.currentSession)
    })
  }

  assignFeeModalHideHandler = () => {
    this.setState({
      assignFeeModal: false,
      selectedBranch: null
    })
  }

  selectFeeAccountChangeHandler = (e) => {
    this.setState({
      selectedFeeAccount: e
    })
  }

  selectBankChangeHandler = (e) => {
    this.setState({
      selectedBanks: e
    })
  }

  assignBankHandler = () => {
    const {
      selectedBranch,
      selectedBanks
    } = this.state
    if (!selectedBanks.length) {
      this.props.alert.warning('Please Select Banks')
    return
    }
    this.props.assignBank(this.props.currentSession, selectedBranch, selectedBanks, this.props.user, this.props.alert)
    this.setState({
      assignBankModal: false
    })
  }

  assignFeeAccountHandler = () => {
    const {
      selectedBankMapId,
      selectedMappingId,
      selectedFeeAccount
    } = this.state

    const {
      currentSession,
      user,
      alert
    } = this.props

    if (!selectedBankMapId || !selectedMappingId || !selectedFeeAccount) {
      alert.warning('Please Fill All Fields')
      return
    }

    this.props.assignFeeAccount(currentSession, selectedMappingId, selectedBankMapId, selectedFeeAccount.value, user, alert)
    this.setState({
      assignFeeModal: false
    })
  }

  activeToggleHandler = (mapId, bankMapId, status) => {
    this.props.setActiveInactie(this.props.currentSession, mapId, bankMapId, status, this.props.user, this.props.alert)
  }

  render () {
    let branchList = null
    if (this.props.bankDetails.length) {
      branchList = this.props.bankDetails.map((branchItem, index) => {
        return (<div className={classes.corporateBank__body} key={branchItem.id}>
          <div className={classes.corporateBank__bodySerial}>{(index + 1) + '.'}</div>
          <div className={classes.corporateBank__bodyBranch}>
            <div className={classes.corporateBank__bodyBranchName}>{branchItem.branch ? branchItem.branch.branch_name : ''}</div>
            <div className={classes.corporateBank__bodyBranchIcon}><AddCircleOutlineIcon className={this.props.classes.icon} color='secondary'
              onClick={() => { this.assignBankModalShowHandler(branchItem.branch.id) }} ></AddCircleOutlineIcon>
            </div>
          </div>
          <div className={classes.corporateBank__bodyBankList}>
            {branchItem.bank_fee_mapping.map(mapping => {
              return (
                <div className={classes.corporateBank__bodyBankListItem} key={mapping.id}>
                  <div className={classes.corporateBank__bodyBankName}>{mapping.bank_name.bank_name}</div>
                  <div className={classes.corporateBank__bodyBankAccount}>
                    <div className={classes.corporateBank__bodyBankAccountNo}>{mapping.bank_name.AccountNumber ? mapping.bank_name.AccountNumber : ''}</div>
                    <div className={classes.corporateBank__bodyBankAccountIcon}><AddCircleOutlineIcon className={this.props.classes.icon} color='secondary'
                      onClick={() => { this.assignFeeModalShowHandler(branchItem.id, mapping.id, branchItem.branch.id) }} ></AddCircleOutlineIcon>
                    </div>
                  </div>
                  <div className={classes.corporateBank__bodyFeeAccount}>{mapping.fee_account_name && mapping.fee_account_name.fee_account_name ? mapping.fee_account_name.fee_account_name : ''}</div>
                  <div className={classes.corporateBank__bodyAction}>
                    <div className={mapping.action ? [classes.corporateBank__activeToggleBtn, classes.btnColorBlue].join(' ') : [classes.corporateBank__activeToggleBtn, classes.btnColorRed].join(' ')}
                      onClick={() => { this.activeToggleHandler(branchItem.id, mapping.id, mapping.action) }}>
                      {mapping.action ? 'Active' : 'InActive'}
                    </div>
                  </div>
                </div>
              )
            })}
            {branchItem.bank_fee_mapping.length === 0 ? (
              <div className={classes.corporateBank__bodyBankListItem} style={{ 'height': '47px' }}>
                <div className={classes.corporateBank__bodyBankName} />
                <div className={classes.corporateBank__bodyBankAccount}>
                  <div className={classes.corporateBank__bodyBankAccountNo} />
                  <div className={classes.corporateBank__bodyBankAccountIcon} />
                </div>
                <div className={classes.corporateBank__bodyFeeAccount} />
                <div className={classes.corporateBank__bodyAction}>
                  <div />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        )
      })
    }

    let allBankAndAcc = null
    if (this.props.bankDetails.length) {
      allBankAndAcc = (<div className={classes.corporateBank}>
        <div className={classes.corporateBank__header}>
          <div className={classes.corporateBank__headerSerial}>S.No</div>
          <div className={classes.corporateBank__headerBranch}>Branches</div>
          <div className={classes.corporateBank__headerBankList}>
            <div className={classes.corporateBank__headerBankName}>Bank Name</div>
            <div className={classes.corporateBank__headerBankAccount}>Account No</div>
            <div className={classes.corporateBank__headerFeeAccount}>Fee Account</div>
            <div className={classes.corporateBank__headerAction}>Action</div>
          </div>
        </div>
        {branchList}
      </div>
      )
    }

    let assignBank = null
    if (this.state.assignBankModal) {
      assignBank = (<Modal open={this.state.assignBankModal} click={this.assignBankModalHideHandler}>
        <h3 className={classes.modal__heading}>Assign Bank Accounts</h3>
        <hr />
        <Select
          placeholder='Select Fee Account'
          isMulti
          options={
            (this.props.remainingBanks.length)
              ? this.props.remainingBanks.map(bank => ({
                value: bank.id,
                label: bank.bank_name,
                accNumber: bank.AccountNumber
              }))
              : []
          }
          onChange={this.selectBankChangeHandler}
        />
        <div className={classes.modal__button}>
          <Button color='primary' variant='contained' onClick={this.assignBankHandler}>Assign</Button>
        </div>
      </Modal>)
    }

    let assignFeeAccounts = null
    if (this.state.assignFeeModal) {
      assignFeeAccounts = (<Modal open={this.state.assignFeeModal} click={this.assignFeeModalHideHandler}>
        <h3 className={classes.modal__heading}>Assign Fee Accounts</h3>
        <hr />
        <Select
          placeholder='Select Fee Account'
          options={
            (this.props.feeAccounts.length && this.props.feeAccounts[0].fee_account_name)
              ? this.props.feeAccounts[0].fee_account_name.map(acc => ({
                value: acc.id,
                label: acc.fee_account_name
              }))
              : []
          }
          onChange={this.selectFeeAccountChangeHandler}
        />
        <div className={classes.modal__button}>
          <Button color='primary' variant='contained' onClick={this.assignFeeAccountHandler}>Assign</Button>
        </div>
      </Modal>)
    }
    return (
      <div className={classes.bankContainer}>
        <div>
          {allBankAndAcc}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </div>
        <div >
          {assignBank}
        </div>
        {assignFeeAccounts}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  bankDetails: state.finance.bank.bankDetails,
  feeAccounts: state.finance.bank.feeAccounts,
  dataLoading: state.finance.common.dataLoader,
  remainingBanks: state.finance.bank.remainingBanks
})

const mapDispatchToProps = (dispatch) => ({
  fetchFeeAccounts: (branchId, user, alert, session) => dispatch(actionTypes.fetchFeeAccounts({ branchId, session, user, alert })),
  fetchBankDetails: (session, user, alert) => dispatch(actionTypes.fetchBankDetails({ session, user, alert })),
  fetchRemainingBanks: (session, branchId, user, alert) => dispatch(actionTypes.fetchRemainingBanks({ session, branchId, user, alert })),
  assignBank: (session, branchId, banks, user, alert) => dispatch(actionTypes.assignBanks({ session, branchId, banks, user, alert })),
  assignFeeAccount: (session, mappingId, bankMapId, feeAccId, user, alert) => dispatch(actionTypes.assignFeeAccount({ session, mappingId, bankMapId, feeAccId, user, alert })),
  setActiveInactie: (session, mappingId, bankMapId, status, user, alert) => dispatch(actionTypes.setActiveInactive({ session, mappingId, bankMapId, status, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Bank)))
