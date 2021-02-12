import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles, Grid, CircularProgress } from '@material-ui/core/'
import Icon from '@material-ui/core/Icon'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Button from '@material-ui/core/Button'

import Select from 'react-select'

import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from './accountToClass.module.css'

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

let accToClassState = null
class AccountToClass extends Component {
  state = {
    showModal: false,
    showDeleteModal: false,
    // currentSession: null,
    currentBranch: null,
    currentFeeType: null,
    currentFeeAcc: null,
    currentGrade: null,
    newFeeAcc: null,
    newFeeAccName: ''
  }

  componentDidMount () {
    if (this.accToClassState !== null) {
      this.setState(accToClassState)
    }
    if (this.props.currentSession) {
      this.fetchBranchHandler()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentSession !== this.props.currentSession) {
      this.fetchBranchHandler()
    }
  }

  modalCloseHandler = () => {
    this.setState({
      showModal: false
    })
  }

  modalShowHandler = (gradeId, feeId) => {
    this.setState({
      showModal: true,
      currentGrade: gradeId,
      currentFeeAcc: feeId
    }, () => {
      this.props.fetchFeeAccToBranch(this.props.currentSession, this.state.currentBranch.id, this.state.currentGrade, this.props.alert, this.props.user)
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  deleteModalShowHandler = (gradeId, feeAccId) => {
    this.setState({
      showDeleteModal: true,
      currentGrade: gradeId,
      currentFeeAcc: feeAccId
    })
  }

  fetchBranchHandler = () => {
    this.props.fetchBranches(this.props.currentSession, this.props.alert, this.props.user)
    // this.setState({
    //   currentSession: e.value
    // })
  }

  branchChangeHandler = (e) => {
    this.props.fetchFeeTypes(this.props.currentSession, e.value, this.props.alert, this.props.user)
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    })
  }

  feeTypeChangeHandler = (e) => {
    this.setState({
      currentFeeType: {
        id: e.value,
        fee_type_name: e.label
      }
    })
  }

  fetchAccClasshMappingHandler = () => {
    if (!this.state.currentBranch || !this.state.currentFeeType || !this.props.currentSession) {
      this.props.alert.warning('Please Select All The Mandatory Fields')
      return
    }
    this.props.fetchFeeAccounts(this.state.currentBranch.id, this.state.currentFeeType.id, this.props.alert, this.props.user)
    accToClassState = this.state
  }

  selectAccountHandler = (e) => {
    this.setState({
      newFeeAcc: e.value,
      newFeeAccName: e.label
    })
  }

  assignAccountHandler = () => {
    const {
      currentBranch,
      currentFeeType,
      currentFeeAcc,
      currentGrade,
      newFeeAcc,
      newFeeAccName
    } = this.state
    this.props.addFeeAccToClass(this.props.currentSession, currentBranch.id, currentGrade, currentFeeType.id, currentFeeAcc, newFeeAcc, newFeeAccName, this.props.alert, this.props.user)
    this.setState({
      showModal: false
    })
  }

  deleteAccHandler = () => {
    const {
      currentBranch,
      currentFeeType,
      currentFeeAcc,
      currentGrade } = this.state
    this.props.deleteFeeAccToClass(this.props.currentSession, currentBranch.id, currentGrade, currentFeeType.id, currentFeeAcc, this.props.alert, this.props.user)
    this.setState({
      showDeleteModal: false
    })
  }

  render () {
    let accClassList = null
    if (this.props.accToClassMapping.length) {
      accClassList = this.props.accToClassMapping.map(accClass => {
        return (
          <div className={classes.accClassMapping__class} key={accClass.id}>
            <div className={classes.accClassMapping__classInfo}>
              <div className={classes.accClassMapping__className}>{accClass.grade}</div>
              <div className={classes.accClassMapping__icon}><Icon className={this.props.classes.icon} color='secondary'
                onClick={() => { this.modalShowHandler(accClass.id, accClass.fee_account_name ? accClass.fee_account_name.id : null) }} >add_circle</Icon></div>
            </div>
            <div className={classes.accClassMapping__classAccInfo}>
              <div className={classes.accClassMapping__accInfo}>
                <div className={classes.accClassMapping__accName}>{accClass.fee_account_name ? accClass.fee_account_name.fee_account_name : ''}</div>
                <div className={classes.accClassMapping__dlt}>
                  {accClass.fee_account_name ? <DeleteOutlinedIcon className={this.props.classes.root} onClick={() => this.deleteModalShowHandler(accClass.id, accClass.fee_account_name ? accClass.fee_account_name.id : null)} /> : null}
                </div>
              </div>
            </div>
          </div>
        )
      })
    }

    let feeList = null
    if (this.props.accToClassMapping.length) {
      feeList = (
        <article className={classes.accClassMapping}>
          <div className={classes.accClassMapping__header}>
            <h4 className={classes.accClassMapping__headingSmall}>Grade</h4>
            <h4 className={classes.accClassMapping__headingBig}>Fee Account Name</h4>
          </div>
          <div className={classes.accClassMapping__body}>
            {accClassList}

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
            options={
              (this.props.feeAccountsToBranch.length)
                ? this.props.feeAccountsToBranch.map(acc => ({
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
            <Button color='primary' variant='contained' onClick={this.deleteAccHandler}>Delete</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button color='secondary' variant='outlined' onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    return (
      <React.Fragment>
        <div>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                value={this.state.currentBranch ? ({
                  value: this.state.currentBranch.id,
                  label: this.state.currentBranch.branch_name
                }) : null}
                options={
                  this.props.branches.length
                    ? this.props.branches.map(branch => ({
                      value: branch.branch.id,
                      label: branch.branch.branch_name
                    }))
                    : []
                }
                onChange={this.branchChangeHandler}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Fee Type*</label>
              <Select
                placeholder='Select Fee Type'
                value={this.state.currentFeeType ? ({
                  value: this.state.currentFeeType.id,
                  label: this.state.currentFeeType.fee_type_name
                }) : null}
                options={
                  this.props.feeList.length
                    ? this.props.feeList.map(fee => ({
                      value: fee.id,
                      label: fee.fee_type_name
                    }))
                    : []
                }
                onChange={this.feeTypeChangeHandler}
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                color='primary'
                variant='contained'
                style={{ marginTop: '20px' }}
                onClick={this.fetchAccClasshMappingHandler}
              >Get</Button>
            </Grid>
          </Grid>
          {feeList}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </div>
        {modal}
        {deleteModal}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  feeList: state.finance.accToClass.feeList,
  accToClassMapping: state.finance.accToClass.accToClassMapping,
  feeAccountsToBranch: state.finance.accToClass.feeAccountsToBranch,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchFeeTypes: (session, branchId, alert, user) => dispatch(actionTypes.fetchFeeTypes({ session, branchId, alert, user })),
  fetchFeeAccounts: (branchId, feeId, alert, user) => dispatch(actionTypes.fetchClassAccMapping({ branchId, feeId, alert, user })),
  fetchFeeAccToBranch: (session, branchId, gradeId, alert, user) => dispatch(actionTypes.fetchFeeAccountToBranch({ session, branchId, gradeId, alert, user })),
  addFeeAccToClass: (session, branchId, gradeId, feeTypeId, feeAccId, newFeeAcc, newFeeAccName, alert, user) => dispatch(actionTypes.addFeeAccToClass({ session, branchId, gradeId, feeTypeId, feeAccId, newFeeAcc, newFeeAccName, alert, user })),
  deleteFeeAccToClass: (session, branchId, gradeId, feeTypeId, feeAccId, alert, user) => dispatch(actionTypes.deleteClassAccMapping({ session, branchId, gradeId, feeTypeId, feeAccId, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AccountToClass)))
