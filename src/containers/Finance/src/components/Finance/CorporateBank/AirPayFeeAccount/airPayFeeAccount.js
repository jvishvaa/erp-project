import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles, Paper, Grid, Table, TableHead, TableBody, TableRow, TableCell, TextField, Checkbox, FormControlLabel } from '@material-ui/core/'
// import { Button } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'

import Select from 'react-select'

import classes from './airPayFeeAccount.module.css'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import { apiActions } from '../../../../_actions'

const styles = theme => ({
  root: {
    color: theme.palette.text.primary
  }
})

let AirPayState = null

class AirPayFeeAccount extends Component {
  state = {
    showModal: false,
    currentBranch: null,
    feeAccount: {
      label: null,
      value: null
    },
    username: null,
    password: null,
    mercid: null,
    secret: null,
    isActive: false
  }

  componentDidMount () {
    if (AirPayState) {
      this.setState(AirPayState)
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
    AirPayState = this.state
    this.props.fetchBranches(this.props.currentSession, this.props.alert, this.props.user)
    console.log('fetched from air pay!')
  }

  changehandlerbranch = (e) => {
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    }, () => {
      // do the air pay get call
      this.props.fetchAirPayList(this.props.currentSession, this.state.currentBranch.id, this.props.alert, this.props.user)
    })
  }

  feeAccountHandler = (e) => {
    console.log('feeAccountHandlers: ', e)
    this.setState({
      feeAccount: {
        label: e.label,
        value: e.value
      }
    })
  }

  // sessionChangeHandler = (e) => {
  //   this.setState({
  //     currentSession: e.value
  //   })
  // }

  modalCloseHandler = () => {
    this.setState({
      showModal: false
    })
  }

  modalShowHandler = () => {
    this.setState({
      showModal: true,
      feeAccount: {
        label: null,
        value: null
      },
      username: null,
      password: null,
      secret: null,
      mercid: null
    }, () => {
      // this.remaingFeeAccountHandler(mapId)
      this.props.fetchAllFeeAccounts(this.props.currentSession, this.state.currentBranch.id, this.props.alert, this.props.user)
    })
  }

  modalFieldHandler = (e) => {
    console.log('the ids: ', e.target.id)
    switch (e.target.id) {
      case 'username': {
        this.setState({
          username: e.target.value
        })
        break
      }
      case 'password': {
        this.setState({
          password: e.target.value
        })
        break
      }
      case 'secret': {
        this.setState({
          secret: e.target.value
        })
        break
      }
      case 'mercid': {
        this.setState({
          mercid: e.target.value
        })
        break
      }
      default: {

      }
    }
  }

  handleActiveRequest = (e) => {
    this.setState({
      isActive: e.target.checked
    })
  }

  assignAccountHandler = () => {
    let data = {
      fee_account: this.state.feeAccount.value,
      username: this.state.username,
      password: this.state.password,
      secret: this.state.secret,
      mercid: this.state.mercid,
      is_active: this.state.isActive
    }
    this.props.postAirPayFeeAccount(data, this.props.alert, this.props.user)
    this.modalCloseHandler()
  }

  showEditModalHandler = (editRow) => {
    console.log('edit now: ', editRow)
    this.setState({
      showModal: true,
      feeAccount: {
        label: editRow.fee_account.fee_account_name,
        value: editRow.fee_account.id
      },
      username: editRow.username,
      password: editRow.password,
      secret: editRow.secret,
      mercid: editRow.mercid,
      isActive: editRow.is_active
    })
  }

  render () {
    console.log('the list: ', this.props.viewAirPay)
    const { viewAirPay } = this.props
    let modal = null
    let airPayTable = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.modalCloseHandler}>
          <h3 className={classes.modal__heading}>Add Air Pay Account</h3>
          <hr />
          <Grid container spacing={16} style={{ padding: '25px' }}>
            <Grid item xs={4}>
              <TextField
                id='username'
                value={this.state.username || ''}
                label='Username'
                type='text'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  this.modalFieldHandler(e)
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='password'
                value={this.state.password || ''}
                label='Password'
                type='text'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  this.modalFieldHandler(e)
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='secret'
                value={this.state.secret || ''}
                label='Secret'
                type='text'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  this.modalFieldHandler(e)
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='mercid'
                value={this.state.mercid || ''}
                label='Merc Id'
                type='text'
                variant='outlined'
                // defaultValue={this.state.todayDate}
                className={classes.textField}
                onChange={(e) => {
                  this.modalFieldHandler(e)
                }}
              />
            </Grid>
            <Grid item xs={4} style={{ width: '200px' }}>
              <label>Fee Account</label>
              <Select
                placeholder='Fee Account'
                value={this.state.feeAccount ? this.state.feeAccount : null}
                options={
                  this.props.viewFeeAccList && this.props.viewFeeAccList.length
                    ? this.props.viewFeeAccList.map(feeAcc => ({
                      value: feeAcc.id,
                      label: feeAcc.fee_account_name
                    }))
                    : []
                }
                onChange={this.feeAccountHandler}
              />
            </Grid>
            <Grid item xs={4}>
              {/* is active */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isActive}
                    onChange={this.handleActiveRequest}
                    value='isAct'
                    inputProps={{
                      'aria-label': 'primary checkbox'
                    }}
                  />
                }
                label='Is Active'
              />
            </Grid>
          </Grid>
          <div className={classes.modal__button}>
            <Button primary disabled={!this.state.feeAccount || !this.state.username || !this.state.password || !this.state.secret || !this.state.mercid} onClick={this.assignAccountHandler}>Assign</Button>
          </div>
        </Modal>
      )
    }

    if (this.state.currentBranch && viewAirPay) {
      airPayTable = (
        <div style={{ marginTop: '30px' }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fee Account</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Secret</TableCell>
                  <TableCell>merc id</TableCell>
                  <TableCell>is Active</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewAirPay && viewAirPay.length > 0
                  ? viewAirPay.map((row) => {
                    return (
                      <TableRow>
                        <TableCell>{row.fee_account && row.fee_account.fee_account_name ? row.fee_account.fee_account_name : ''}</TableCell>
                        <TableCell>{row.username ? row.username : ''}</TableCell>
                        <TableCell>{row.password ? row.password : ''}</TableCell>
                        <TableCell>{row.secret ? row.secret : ''}</TableCell>
                        <TableCell>{row.mercid ? row.mercid : ''}</TableCell>
                        <TableCell>{row.is_active ? 'Active' : 'InActive'}</TableCell>
                        <TableCell>{
                          <Button
                            icon='edit'
                            basic
                            onClick={() => { this.showEditModalHandler(row) }}
                          />
                        }</TableCell>
                      </TableRow>
                    )
                  })
                  : 'No Data'}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }

    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={4}>
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
              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs={4} style={{ marginTop: '20px', marginLeft: '20px' }}>
            {this.state.currentBranch
              ? <Button primary onClick={this.modalShowHandler}>Add</Button>
              : null}
          </Grid>
        </Grid>
        {airPayTable}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {modal}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  viewAirPay: state.finance.airPayFeeAccount.viewAirPay,
  viewFeeAccList: state.finance.viewFeeAccounts.viewFeeAccList,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchAirPayList: (session, branchId, alert, user) => dispatch(actionTypes.fetchAirPayList({ session, branchId, alert, user })),
  postAirPayFeeAccount: (data, alert, user) => dispatch(actionTypes.postAirPayFeeAccount({ data, alert, user })),
  fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AirPayFeeAccount)))
