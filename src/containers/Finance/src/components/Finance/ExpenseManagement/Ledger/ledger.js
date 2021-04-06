import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import Select from 'react-select'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import AddIcon from '@material-ui/icons/Add'

import {
  TextField,
  Button,
  Typography,
  Divider,
  Grid,
  withStyles
} from '@material-ui/core'

import classes from './ledger.module.css'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  icon: {
    margin: theme.spacing(2),
    color: '#327ddf',
    marginTop: '0px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  editIcon: {
    color: 'rgb(61, 61, 61)',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  deleteIcon: {
    color: 'rgb(61, 61, 61)',
    marginLeft: '5px !important',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  headerButton: {
    position: 'absolute',
    right: '20px',
    height: '35px'
  },
  ledgerButton: {
    marginTop: '26px !important',
    position: 'absolute',
    right: '20px',
    height: '35px'
  },
  primaryButton: {
    color: 'white',
    backgroundColor: '#2196f3',
    '&:hover': {
      backgroundColor: '#1e82d4'
    }
  },
  negativeButton: {
    color: 'white',
    backgroundColor: 'rgb(225, 0, 80)',
    '&:hover': {
      backgroundColor: 'rgb(201, 25, 86)'
    }
  },
  modalHeader: {
    textAlign: 'center',
    fontWeight: 'lighter'
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)

  }
})

class Ledger extends Component {
  state = {
    ledgerAddModal: false,
    showDeleteModal: false,
    accHeadDeleteId: null,
    accountHeadModal: false,
    selectedAccType: null,
    accHeadName: null,
    ledgerId: null,
    ledgerName: null,
    ledgerRemark: '',
    ledgerActive: false,
    entryUpdateModal: false,
    updatedLedgerName: '',
    updatedRemarks: '',
    updatedOpeningBalance: 0,
    deleteType: '',
    deleteId: null,
    editHeadModal: false,
    updatedHeadName: null,
    updatedHeadType: null,
    updatedHeadId: null,
    headerId: null,
    ledgerTypeModal: false,
    ledgerTypeName: null
  }
  componentDidMount () {
    if (this.props.ledgerList.length === 0) {
      this.props.fetchLedgerList(this.props.user, this.props.alert)
    }
  }

  componentDidUpdate() {
    console.log("===> expense main list: ", this.props.ledgerList)
  }

  showLedgerTypeModal = () => {
    this.setState({
      ledgerTypeModal: true
    })
  }

  hideLedgerTypeModal = () => {
    this.setState({
      ledgerTypeModal: false
    })
  }

  ledgerTypeNameChangeHandler = (e) => {
    this.setState({
      ledgerTypeName: e.target.value
    })
  }

  showLedgerAddModal = (id) => {
    this.setState({
      ledgerAddModal: true,
      updatedHeadId: id
    })
  }

  hideLedgerAddModal = () => {
    this.setState({
      ledgerAddModal: false,
      updatedHeadId: null
    })
  }

  showAccountHeadModal = () => {
    this.setState({
      accountHeadModal: true
    })

    this.props.fetchLedgerList(this.props.user, this.props.alert)
  }

  hideAccountHeadModal = () => {
    this.setState({
      accountHeadModal: false
    })
  }

  showEditHeadModalHandler = (name, type, id) => {
    const typeObj = this.props.ledgerTypeList.filter(item => item.id === type)[0]
    console.log('TYPE OBJ ++++++++', typeObj)
    this.setState({
      updatedHeadName: name,
      updatedHeadType: { ...typeObj },
      updatedHeadId: id,
      editHeadModal: true
    })
  }

  hideEditHeadModalHandler = () => {
    this.setState({
      updatedHeadName: null,
      updatedHeadType: null,
      updatedHeadId: null,
      editHeadModal: false
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      deleteType: '',
      deleteId: null,
      ledgerId: null
    })
  }

  deleteModalShowHandler = (type, headId, id) => {
    this.setState({
      showDeleteModal: true,
      deleteType: type,
      deleteId: headId,
      ledgerId: id
    })
  }

  deleteHandler = () => {
    switch (this.state.deleteType) {
      case 'accountHead': {
        this.props.deleteAccHeader(this.state.deleteId, this.props.user, this.props.alert)
        this.deleteModalCloseHandler()
        break
      }
      case 'ledger': {
        this.props.deleteLedgerEntry(this.state.deleteId, this.state.ledgerId, this.props.user, this.props.alert)
        this.deleteModalCloseHandler()
        break
      }
      default: {
        this.props.alert('Cannot Be Deleted')
      }
    }
  }

  showEntryUpdateModalHandler = (headerId, id, name, remarks, status) => {
    this.setState({
      entryUpdateModal: true,
      ledgerId: id,
      updatedLedgerName: name,
      updatedRemarks: remarks,
      ledgerActive: status,
      headerId: headerId
    })
  }

  hideEntryUpdateModalHandler = () => {
    this.setState({
      entryUpdateModal: false,
      ledgerId: null,
      updatedLedgerName: '',
      updatedRemarks: '',
      ledgerActive: false,
      headerId: null
    })
  }

  accHeadTypeChangeHandler = (event) => {
    this.setState({
      selectedAccType: {
        id: event.value,
        name: event.label
      }
    })
  }

  accHeadTypeEditchangeHandler = (event) => {
    this.setState({
      updatedHeadType: {
        id: event.value,
        ledger_type_name: event.label
      }
    })
  }

  inputChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  ledgerStatusChangeHandler = (event) => {
    this.setState({
      ledgerActive: event.target.checked
    })
  }
  addAccHeaderHandler = () => {
    if (!this.state.accHeadName || !this.state.accHeadName.length || !this.state.selectedAccType) {
      this.props.alert.warning('Please Fill all Data')
      return
    }
    this.props.addAccHeader(this.state.accHeadName.trim(), this.state.selectedAccType.id, this.props.user, this.props.alert)
    this.setState({
      accountHeadModal: false,
      accHeadName: null,
      selectedAccType: null
    })
  }

  editAccHeaderHandler = () => {
    if (!this.state.updatedHeadName || !this.state.updatedHeadName.length || !this.state.updatedHeadType) {
      this.props.alert.warning('Please Fill all Data')
      return
    }
    this.props.editAccHeader(this.state.updatedHeadId, this.state.updatedHeadName.trim(), this.state.updatedHeadType.id, this.props.user, this.props.alert)
    this.setState({
      updatedHeadId: null,
      updatedHeadName: null,
      updatedHeadType: null,
      editHeadModal: false
    })
  }

  addLedgerEntryHandler = () => {
    if (!this.state.ledgerName) {
      this.props.alert.warning('Enter Ledger Name')
      return
    }
    const {
      updatedHeadId,
      ledgerRemark,
      ledgerName
    } = this.state
    this.props.addLedgerEntry(updatedHeadId, ledgerName, ledgerRemark, this.props.user, this.props.alert)
    console.log('addinggggg')
    this.setState({
      updatedHeadId: null,
      ledgerName: null,
      ledgerRemark: '',
      ledgerAddModal: false
    })
  }

  updateLedgerEntryHandler = () => {
    if (!this.state.updatedLedgerName) {
      this.props.alert.warning('Enter Ledger Name')
      return
    }
    const {
      ledgerId,
      updatedLedgerName,
      updatedRemarks,
      ledgerActive,
      headerId
    } = this.state
    this.props.updateLedgerEntry(headerId, ledgerId, updatedLedgerName, updatedRemarks, ledgerActive, this.props.user, this.props.alert)
    this.hideEntryUpdateModalHandler()
  }

  addLedgerTypeHandler = () => {
    const {
      ledgerTypeName
    } = this.state
    if (!ledgerTypeName) {
      this.props.alert.warning('Fill All Fields')
      return
    }
    this.props.addLedgerType(ledgerTypeName, this.props.user, this.props.alert)
    this.setState({
      ledgerTypeName: null
    })
  }

  accountHeadAddModal = (type) => {
    const accountHeadModal = (
      <Modal open={this.state.accountHeadModal} click={this.hideAccountHeadModal} medium>
        <h2 style={{ textAlign: 'center', marginTop: '5px' }}>Add Account Head</h2>
        <hr />
        <div style={{ width: '100%', paddingLeft: '20px' }}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label>Account Head Name :</label>
              <input type='text'
                className={classes.modal_accHeaderInput}
                value={this.state.accHeadName ? this.state.accHeadName : ''}
                onChange={this.inputChangeHandler}
                name='accHeadName'
              />
            </Grid>
            <Grid item xs='5'>
              <label>Account Header Type</label>
              <Select
                placeholder='Select Type'
                value={this.state.selectedAccType ? ({
                  value: this.state.selectedAccType.id,
                  label: this.state.selectedAccType.name
                }) : null}
                options={
                  this.props.ledgerTypeList.map(type => ({ value: type.id, label: type.ledger_type_name })
                  )}
                onChange={this.accHeadTypeChangeHandler}
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ position: 'relative' }}>
          <Button variant='contained' color='primary'
            className={this.props.classes.headerButton}
            onClick={this.addAccHeaderHandler}>
            Assign
          </Button>
        </div>
      </Modal>
    )
    return accountHeadModal
  }

  accountHeadEditModal = () => {
    const accountHeadModal = (
      <Modal open={this.state.editHeadModal} click={this.hideEditHeadModalHandler} medium>
        <h2 style={{ textAlign: 'center', marginTop: '5px' }}>Update Account Head</h2>
        <hr />
        <div style={{ width: '100%', paddingLeft: '20px' }}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label>Account Head Name :</label>
              <input type='text'
                className={classes.modal_accHeaderInput}
                value={this.state.updatedHeadName ? this.state.updatedHeadName : ''}
                onChange={this.inputChangeHandler}
                name='updatedHeadName'
              />
            </Grid>
            <Grid item xs='5'>
              <label>Account Header Type</label>
              <Select
                placeholder='Select Type'
                value={this.state.updatedHeadType ? ({
                  value: this.state.updatedHeadType.id,
                  label: this.state.updatedHeadType.ledger_type_name
                }) : null}
                options={
                  this.props.ledgerTypeList.map(type => ({ value: type.id, label: type.ledger_type_name })
                  )}
                onChange={this.accHeadTypeEditchangeHandler}
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ position: 'relative' }}>
          <Button variant='contained' color='primary'
            className={this.props.classes.headerButton}
            onClick={this.editAccHeaderHandler}>
            Update
          </Button>
        </div>
      </Modal>
    )
    return accountHeadModal
  }

  render () {
    let accountHeadModal = null
    if (this.state.accountHeadModal) {
      accountHeadModal = this.accountHeadAddModal()
    }

    let accountHeadEditModal = null
    if (this.state.editHeadModal) {
      accountHeadEditModal = this.accountHeadEditModal()
    }

    let ledgerType = null
    if (this.state.ledgerTypeModal) {
      ledgerType = (
        <Modal small
          open={this.state.ledgerTypeModal}
          click={this.hideLedgerTypeModal}
          style={{ padding: '8px' }}
        >
          <Typography variant='h6'
            className={this.props.classes.modalHeader}>
            Add Ledger Type
          </Typography>
          <Divider className={this.props.classes.divider} />
          <TextField
            id='outlined-name'
            label='Ledger Type Name'
            fullWidth
            value={this.state.ledgerTypeName || ''}
            onChange={this.ledgerTypeNameChangeHandler}
            margin='normal'
            variant='outlined'
          />
          <div>
            <Button
              variant='contained'
              color='primary'
              onClick={this.addLedgerTypeHandler}
              style={{ display: 'block', margin: 'auto' }}
            >Save</Button>
          </div>
        </Modal>
      )
    }

    let ledgerAddModal = null
    if (this.state.ledgerAddModal) {
      ledgerAddModal = (
        <Modal open={this.state.ledgerAddModal} click={this.hideLedgerAddModal} medium>
          <h2 style={{ textAlign: 'center', marginTop: '5px' }}>Add Ledger Entry</h2>
          <hr />
          <div style={{ width: '100%', paddingLeft: '20px' }}>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='5'>
                <label>Ledger Name :</label>
                <input type='text'
                  className={classes.modal_accHeaderInput}
                  placeholder='Ledger Name'
                  value={this.state.ledgerName}
                  onChange={this.inputChangeHandler}
                  name='ledgerName'
                />
              </Grid>
              <Grid item xs='5'>
                <label>Opening Balance :</label>
                <input
                  type='number'
                  className={classes.modal_accHeaderInput}
                  value={this.state.updatedOpeningBalance}
                  onChange={this.inputChangeHandler}
                  name='updatedOpeningBalance'
                />
              </Grid>
              <Grid item xs='5'>
                <label>Remarks :</label>
                <input type='text'
                  className={classes.modal_accHeaderInput}
                  value={this.state.ledgerRemark}
                  placeholder='Remarks'
                  onChange={this.inputChangeHandler}
                  name='ledgerRemark'
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ position: 'relative' }}>
            <Button variant='contained' color='primary'
              className={this.props.classes.headerButton}
              onClick={this.addLedgerEntryHandler}
            >
              Assign
            </Button>
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
            <Button className={this.props.classes.negativeButton} onClick={this.deleteHandler}>Delete</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button className={this.props.classes.primaryButton} onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let entryUpdateModal = null
    if (this.state.entryUpdateModal) {
      entryUpdateModal = (
        <Modal open={this.state.entryUpdateModal} click={this.hideEntryUpdateModalHandler}>
          <h2 style={{ textAlign: 'center', marginTop: '5px' }}>Update Ledger Entry</h2>
          <hr />
          <div style={{ width: '100%', paddingLeft: '20px' }}>
            <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
              <Grid item xs='5'>
                <label>Ledger Name :</label>
                <input type='text'
                  className={classes.modal_accHeaderInput}
                  value={this.state.updatedLedgerName}
                  onChange={this.inputChangeHandler}
                  name='updatedLedgerName'
                />
              </Grid>

              <Grid item xs='5'>
                <label>Opening Balance :</label>
                <input
                  type='number'
                  className={classes.modal_accHeaderInput}
                  value={this.state.updatedOpeningBalance}
                  onChange={this.inputChangeHandler}
                  name='updatedOpeningBalance'
                />
              </Grid>
              <Grid item xs='5'>
                <label>Remarks :</label>
                <input type='text'
                  className={classes.modal_accHeaderInput}
                  value={this.state.updatedRemarks}
                  onChange={this.inputChangeHandler}
                  name='updatedRemarks'
                />
              </Grid>
              <Grid item xs='5'>
                <input type='checkbox'
                  checked={this.state.ledgerActive}
                  onChange={this.ledgerStatusChangeHandler}
                />
                <label style={{ marginLeft: '10px' }}>Active :</label>
              </Grid>
            </Grid>
          </div>
          <div style={{ position: 'relative' }}>
            <Button variant='contained' color='primary'
              className={this.props.classes.headerButton}
              onClick={this.updateLedgerEntryHandler}>
              Update
            </Button>
          </div>
        </Modal>
      )
    }

    let ledgerList = null
    if (this.props.ledgerList.length) {
      ledgerList = this.props.ledgerList.map((item, index) => {
        const appliedClasses = [classes.ledger__bodyLedgerListItem, classes.ledger__bodyLedgerListItemEmpty]
        return (<div className={classes.ledger__body} key={item.id}>
          <div className={classes.ledger__bodySerial}>{(index + 1) + '.'}</div>
          <div className={classes.ledger__bodyAccountHead}>
            <div className={classes.ledger__bodyAccountHeadName}>
              <div>{item.account_head_name}</div>
              <div className={classes.ledger__bodyAccountHeadType}><p style={{ display: 'inline-block' }}>{item.ledger_type && item.ledger_type.ledger_type_name}</p></div>
            </div>
            <div className={classes.ledger__bodyAccountHeadIcon}><AddIcon className={classes.icon} color='secondary'
              onClick={() => this.showLedgerAddModal(item.id)} ></AddIcon>
            </div>
            <div className={classes.ledger__bodyAccountHeadEdtIcon}><EditIcon color='secondary' className={classes.editIcon}
              onClick={() => this.showEditHeadModalHandler(item.account_head_name, item.ledger_type && item.ledger_type.id, item.id)} ></EditIcon>
            </div>
            <div className={classes.ledger__bodyAccountHeadDltIcon}><DeleteForeverIcon color='secondary' className={classes.deleteIcon}
              onClick={() => this.deleteModalShowHandler('accountHead', item.id)}>delete</DeleteForeverIcon>
            </div>
          </div>
          <div className={classes.ledger__bodyLedgerList}>
            {item.sub_header && item.sub_header.map(subItem => {
              return (
                <div className={classes.ledger__bodyLedgerListItem} key={subItem.id}>
                  <div className={classes.ledger__bodyLedgerAcc}>{subItem.ledger_account}</div>
                  <div className={classes.ledger__bodyLedgerRemarks}>
                    <div className={classes.ledger__bodyLedgerRemarksNo}>{subItem.remarks ? subItem.remarks : ''}</div>
                  </div>
                  <div className={classes.ledger__bodyLedgerStatus}>{subItem.ledger_status ? 'Active' : 'Inactive'}</div>
                  <div className={classes.ledger__bodyAction}>
                    {/* <div className={mapping.action ? [classes.ledger__activeToggleBtn, classes.btnColorBlue].join(' ') : [classes.ledger__activeToggleBtn, classes.btnColorRed].join(' ')}
                      onClick={() => { this.activeToggleHandler(branchItem.id, mapping.id, mapping.action) }}>
                      {mapping.action ? 'Active' : 'InActive'}
                    </div> */}
                    <div>
                      <EditIcon className={classes.editIcon} color='secondary'
                        onClick={() => this.showEntryUpdateModalHandler(item.id, subItem.id, subItem.ledger_account, subItem.remarks, subItem.ledger_status)}
                      ></EditIcon>
                      <DeleteForeverIcon color='secondary' className={classes.deleteIcon}
                        onClick={() => this.deleteModalShowHandler('ledger', item.id, subItem.id)} ></DeleteForeverIcon>
                    </div>
                  </div>
                </div>
              )
            })}
            {item.sub_header.length === 0 ? (
              <div className={appliedClasses.join(' ')}>
                <div className={classes.ledger__bodyLedgerAcc} />
                <div className={classes.ledger__bodyLedgerRemarks}>
                  <div className={classes.ledger__bodyLedgerRemarksNo} />
                  <div className={classes.ledger__bodyLedgerRemarksIcon} />
                </div>
                <div className={classes.ledger__bodyLedgerStatus} />
                <div className={classes.ledger__bodyAction}>
                  <div />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        )
      })
    }

    let allLedger = null
    if (this.props.ledgerList.length) {
      allLedger = (<div className={classes.ledger}>
        <div className={classes.ledger__header}>
          <div className={classes.ledger__headerSerial}>S.No</div>
          <div className={classes.ledger__headerAccountHead}>Account Head</div>
          <div className={classes.ledger__headerLedgerList}>
            <div className={classes.ledger__headerLedgerAcc}>Ledger Account</div>
            <div className={classes.ledger__headerRemarks}>Remarks/Description</div>
            <div className={classes.ledger__headerLedgerStatus}>Ledger Status</div>
            <div className={classes.ledger__headerAction}>Action</div>
          </div>
        </div>
        {ledgerList}
        {ledgerAddModal}
      </div>
      )
    }

    return (
      <Layout>
      <div className={classes.ledgerContainer}>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <Button variant='contained' color='primary' onClick={this.showLedgerTypeModal}>
                Add Ledger Type
            </Button>
          </Grid>
          <Grid item xs='3'>
            <Button variant='contained' color='primary' onClick={this.showAccountHeadModal}>
                Add Account Head
            </Button>
          </Grid>
        </Grid>
        {allLedger}
        {deleteModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {accountHeadModal}
        {ledgerAddModal}
        {entryUpdateModal}
        {accountHeadEditModal}
        {ledgerType}
      </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  ledgerTypeList: state.finance.common.ledgerType,
  ledgerList: state.finance.expenseMngmt.ledger.ledgerList,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = (dispatch) => ({
  loadLedgerType: dispatch(actionTypes.fetchLedgerType()),
  fetchLedgerList: (user, alert) => dispatch(actionTypes.fetchLedgerList({ user, alert })),
  addAccHeader: (headName, type, user, alert) => dispatch(actionTypes.addLedgerAccHead({ headName, type, user, alert })),
  deleteAccHeader: (headId, user, alert) => dispatch(actionTypes.deleteLedgerHead({ headId, user, alert })),
  editAccHeader: (headId, headName, type, user, alert) => dispatch(actionTypes.editLedgerHead({ headId, headName, type, user, alert })),
  addLedgerEntry: (headId, ledgerName, remarks, user, alert) => dispatch(actionTypes.addLedgerEntry({ headId, ledgerName, remarks, user, alert })),
  updateLedgerEntry: (headId, id, ledgerName, remarks, status, user, alert) => dispatch(actionTypes.editLedgerEntry({ headId, id, ledgerName, remarks, status, user, alert })),
  deleteLedgerEntry: (headId, id, user, alert) => dispatch(actionTypes.deleteLedgerEntry({ headId, id, user, alert })),
  addLedgerType: (typeName, user, alert) => dispatch(actionTypes.addLedgerType({ typeName, user, alert }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Ledger))
