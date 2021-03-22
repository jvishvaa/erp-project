import React, { Component } from 'react'
import Select from 'react-select'
import { Grid, Button, Divider, Paper, Table, TableRow, TableHead, TableCell, TableBody, TextField, TablePagination,
  FormControlLabel, Checkbox, withStyles, Fab } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Edit as EditIcon } from '@material-ui/icons/'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from './deleteModal.module.css'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
})
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId = null
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Fee Type' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Curricular Fee Type') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId = item.child_id
          // })
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
class CurrFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      branch: null,
      id: null,
      showAddmodal: false,
      feeTypeName: null,
      feeTypeAmount: null,
      feeAccount: null,
      startDate: null,
      dueDate: null,
      endDate: null,
      isMisc: true,
      isEditable: true,
      isEditModal: false,
      showDeleteModal: false,
      page: 0,
      rowsPerPage: 10,
      moduleId: null
    }
  }

  componentDidMount () {
  
  }
  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  };

  handleAcademicyear = (e) => {
    this.setState({
      session: e,
      branch: null
    }, () => {
      this.props.fetchBranches(this.state.session.value, this.props.alert, this.props.user, moduleId)
    })
  }

  changehandlerbranch = (e) => {
    this.setState({
      branch: e
    })
  }

  getHandler = () => {
    const { session, branch } = this.state
    if (session && branch) {
      this.props.fetchCurrFeeList(session.value, branch.value, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('select session and branch!')
    }
  }

  showAddHandler = () => {
    this.setState({
      showAddmodal: true
    }, () => {
      this.props.fetchAllFeeAccounts(this.state.session.value, this.state.branch.value, this.props.alert, this.props.user)
    })
  }

  hideAddModalHandler = () => {
    this.setState({
      showAddmodal: false,
      isEditModal: false,
      id: null,
      feeTypeName: null,
      feeTypeAmount: null,
      feeAccount: {
        label: null,
        value: null
      },
      startDate: null,
      dueDate: null,
      endDate: null,
      isMisc: true,
      isEditable: true,
      grades: null
    })
  }

  showEditHandler = (data) => {
    this.setState({
      showAddmodal: true,
      isEditModal: true,
      id: data.id ? data.id : '',
      feeTypeName: data.fee_type_name ? data.fee_type_name : '',
      feeTypeAmount: data.amount ? data.amount : 0,
      feeAccount: {
        label: data.fee_account && data.fee_account.fee_account_name ? data.fee_account.fee_account_name : '',
        value: data.fee_account && data.fee_account.id ? data.fee_account.id : ''
      },
      startDate: data.start_date ? data.start_date : '',
      dueDate: data.due_date ? data.due_date : '',
      endDate: data.end_date ? data.end_date : '',
      // isMisc: data.is_misc,
      isEditable: data.allow_accountant_to_edit
    }, () => {
      this.props.fetchAllFeeAccounts(this.state.session.value, this.state.branch.value, this.props.alert, this.props.user)
    })
  }

  handleEditChange= (e) => {
    switch (e.target.id) {
      case 'fee_type_name': {
        this.setState({
          feeTypeName: e.target.value
        })
        break
      }
      case 'fee_type_amount': {
        this.setState({
          feeTypeAmount: e.target.value
        })
        break
      }
      case 'start_date': {
        this.setState({
          startDate: e.target.value
        })
        break
      }
      case 'due_date': {
        this.setState({
          dueDate: e.target.value
        })
        break
      }
      case 'end_date': {
        this.setState({
          endDate: e.target.value
        })
        break
      }
      default: {
      }
    }
  }

  feeAccountHandler = (e) => {
    console.log('fee acc', e)
    this.setState({
      feeAccount: {
        label: e.label,
        value: e.value
      }
    })
  }

  handleCheckbox = (e) => {
    switch (e.target.value) {
      // case 'isMisc': {
      //   this.setState({
      //     isMisc: e.target.checked
      //   })
      //   break
      // }
      case 'isEditable': {
        this.setState({
          isEditable: e.target.checked
        })
        break
      }
      default: {
      }
    }
  }

  addHandler = () => {
    const { id, isEditModal, startDate, endDate, dueDate, branch, session, feeTypeName, feeTypeAmount, feeAccount, isEditable } = this.state
    console.log(this.state)
    if (dueDate && startDate && endDate && feeAccount && feeTypeName && feeTypeAmount) {
      let data = {
        session_year: session.value,
        branch: branch.value,
        id: id,
        due_date: dueDate || '',
        start_date: startDate || '',
        end_date: endDate || '',
        fee_account: feeAccount && feeAccount.value ? feeAccount.value : '',
        is_misc: true,
        fee_type_name: feeTypeName || '',
        sub_type: feeTypeName || '',
        amount: +feeTypeAmount || 0,
        is_transport_fee: false,
        has_installments: false,
        allow_accountant_to_edit: isEditable
      }
      if (feeTypeName && feeAccount) {
        if (isEditModal) {
          this.props.updateCurrFeeList(data, this.props.alert, this.props.user)
          this.hideAddModalHandler()
        } else {
          this.props.addCurrFeeList(data, this.props.alert, this.props.user)
          this.hideAddModalHandler()
        }
      }
    } else {
      this.props.alert.warning('Fill all required Fields!')
    }
  }

  showDeleteHandler = (id) => {
    this.setState({
      showDeleteModal: true,
      id: id
    })
  }

  hideDeleteModalHandler = () => {
    this.setState({
      showDeleteModal: false,
      id: null
    })
  }
  handleEditChange= (e) => {
    switch (e.target.id) {
      case 'fee_type_name': {
        this.setState({
          feeTypeName: e.target.value
        })
        break
      }
      case 'fee_type_amount': {
        if (e.target.value >= 0) {
          this.setState({
            feeTypeAmount: e.target.value
          })
        }
        break
      }
      case 'start_date': {
        this.setState({
          startDate: e.target.value
        })
        break
      }
      case 'due_date': {
        this.setState({
          dueDate: e.target.value
        })
        break
      }
      case 'end_date': {
        this.setState({
          endDate: e.target.value
        })
        break
      }
      default: {
      }
    }
  }

  deleteHandler = () => {
    this.props.deleteCurrFeeList(this.state.id, this.props.alert, this.props.user)
    this.hideDeleteModalHandler()
  }

  render () {
    const { currList } = this.props
    const { session, branch, showAddmodal } = this.state
    let addFeeModal = null
    if (showAddmodal) {
      addFeeModal = (
        <Modal open={showAddmodal} click={this.hideAddModalHandler} large>
          <h3 className={classes.modal__heading}>Add Curricular Fee Type</h3>
          <Divider />
          <Grid container spacing={3} style={{ flexGrow: 1, padding: 10 }}>
            <Grid item xs={4}>
              <label>Fee Type Name*</label>
              <TextField
                id='fee_type_name'
                label='Fee Type Name'
                className={classes.textField}
                value={this.state.feeTypeName || ''}
                onChange={(e) => { this.handleEditChange(e) }}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <label>Fee Amount*</label>
              <TextField
                id='fee_type_amount'
                label='Fee Amount'
                type='number'
                className={classes.textField}
                value={this.state.feeTypeAmount || ''}
                onChange={(e) => { this.handleEditChange(e) }}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <label>Start Date*</label>
              <TextField
                id='start_date'
                // label='Start Date'
                type='date'
                className={classes.textField}
                value={this.state.startDate || ''}
                onChange={(e) => { this.handleEditChange(e) }}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <label>Due Date*</label>
              <TextField
                id='due_date'
                // label='Due Date'
                type='date'
                className={classes.textField}
                value={this.state.dueDate || ''}
                onChange={(e) => { this.handleEditChange(e) }}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <label>End Date*</label>
              <TextField
                id='end_date'
                // label='End Date'
                type='date'
                className={classes.textField}
                value={this.state.endDate || ''}
                onChange={(e) => { this.handleEditChange(e) }}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <label>Fee Accountant*</label>
              <Select
                placeholder='Select Fee Account'
                value={this.state.feeAccount ? this.state.feeAccount : null}
                options={
                  this.props.viewFeeAccList && this.props.viewFeeAccList.length
                    ? this.props.viewFeeAccList.map(feeAcc => ({
                      value: feeAcc.id,
                      label: feeAcc.fee_account_name
                    }))
                    : []
                }
                onChange={(e) => { this.feeAccountHandler(e) }}
              />
            </Grid>
            {/* <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isMisc}
                    onChange={(e) => { this.handleCheckbox(e) }}
                    value='isMisc'
                    color='primary'
                  />
                }
                label='Is Misc fee?'
              />
            </Grid> */}
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isEditable}
                    onChange={(e) => { this.handleCheckbox(e) }}
                    value='isEditable'
                    color='primary'
                  />
                }
                label='Is Accountant Editable?'
              />
            </Grid>
            <Grid item xs={4}>
              <div className={classes.modal__deletebutton}>
                <Button color='primary' variant='contained' onClick={this.addHandler}>Save</Button>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className={classes.modal__remainbutton}>
                <Button color='primary' variant='contained' onClick={this.hideAddModalHandler}>Go Back</Button>
              </div>
            </Grid>
          </Grid>

          <div className={classes.modal__deletebutton}>
            <Button color='primary' variant='contained' onClick={this.addHandler}>Save</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button color='primary' variant='contained' onClick={this.hideAddModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let currFeeTable = null
    if (currList && currList.length > 0) {
      currFeeTable = (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Fee Type Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Fee Account</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Due Date</TableCell>
                {/* <TableCell>Is Misc Type</TableCell> */}
                <TableCell>Accountant editable</TableCell>
                <TableCell>Edit</TableCell>
                {/* <TableCell>Delete</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {currList && currList.length > 0
                ? currList && currList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                  return (
                    <TableRow>
                      <TableCell>{row.fee_type_name ? row.fee_type_name : ''}</TableCell>
                      <TableCell>{row.amount ? row.amount : 0}</TableCell>
                      <TableCell>{row.fee_account && row.fee_account.fee_account_name ? row.fee_account.fee_account_name : ''}</TableCell>
                      <TableCell>{row.start_date ? row.start_date : ''}</TableCell>
                      <TableCell>{row.end_date ? row.end_date : ''}</TableCell>
                      <TableCell>{row.due_date ? row.due_date : ''}</TableCell>
                      {/* <TableCell>{row.is_misc ? 'Yes' : 'No'}</TableCell> */}
                      <TableCell>{row.allow_accountant_to_edit ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Fab
                          color='primary'
                          size='small'
                          onClick={(e) => { this.showEditHandler(row, true) }}
                        >
                          <EditIcon />
                        </Fab>
                      </TableCell>
                      {/* <TableCell><Delete style={{ cursor: 'pointer' }} onClick={(e) => { this.showDeleteHandler(row.id) }} /></TableCell> */}
                    </TableRow>
                  )
                })
                : 'No Data'}
            </TableBody>
          </Table>
          <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.currList && currList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
        </Paper>
      )
    }

    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.hideDeleteModalHandler} small>
          <h3 className={classes.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classes.modal__deletebutton}>
            <Button color='secondary' variant='contained' onClick={this.deleteHandler}>Delete</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button color='primary' variant='contained' onClick={this.hideDeleteModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: '15px' }}>
          <Grid item xs='10' />
          <Grid item xs={2}>
            {session && branch
              ? <Button variant='contained' color='primary' onClick={() => { this.showAddHandler() }}>
                ADD FEE
              </Button>
              : null}
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: '15px' }}>
          <Grid item xs={4}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={session || null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs={4}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={branch || null}
              options={
                this.props.branchValue
                  ? this.props.branchValue.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }
              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs={3}>
            <Button style={{ marginTop: '20px' }} variant='contained' color='primary' onClick={() => { this.getHandler() }}>
              GET
            </Button>
          </Grid>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {addFeeModal}
        {deleteModal}
        {currFeeTable}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branchValue: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader,
  currList: state.finance.currFeeType.currList,
  viewFeeAccList: state.finance.viewFeeAccounts.viewFeeAccList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId})),
  fetchCurrFeeList: (session, branch, alert, user) => dispatch(actionTypes.fetchCurrFeeList({ session, branch, alert, user })),
  fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user })),
  addCurrFeeList: (pay, alert, user) => dispatch(actionTypes.addCurrFeeList({ pay, alert, user })),
  updateCurrFeeList: (pay, alert, user) => dispatch(actionTypes.updateCurrFeeList({ pay, alert, user })),
  deleteCurrFeeList: (id, alert, user) => dispatch(actionTypes.deleteCurrFeeList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(CurrFeeType)))
