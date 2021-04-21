import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Fab,
  Grid
} from '@material-ui/core/'
import {
  Add as AddIcon,
  Edit as EditIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Modal from '../../../ui/Modal/modal'
import classess from './deleteModal.module.css'
import * as actionTypes from '../store/actions'
import '../../css/staff.css'
import EditConcessionSettings from './editConcession'
import AddConcessionSettings from './addConcession'
import ManageFees from './manageFees'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})


let concessionSettingsState = null

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId = null

if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Concession' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Concession Settings') {
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
class ConcessionSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      concessionData: [],
      showModal: false,
      showAddFeeModal: false,
      showManageFee: false,
      concessionId: null,
      concessionName: null,
      data: [],
      field: [],
      concessionTypeId: null,
      showAddConcTypeModal: false,
      showDeleteModal: false
    }
  }

  showModalHandler = (id) => {
    this.setState({
      showModal: true,
      id: id
    })
  }

  showAddConcModalHandler = () => {
    this.setState({
      showAddConcTypeModal: true
    })
  }

  showAddFeeModalHandler = () => {
    this.setState({
      showAddFeeModal: true
    })
  }

  showManageFeeModalHandler = (id, name, typeId) => {
    this.setState({
      concessionId: id,
      showManageFee: true,
      concessionName: name,
      concessionTypeId: typeId,
      type_name: ''
    })
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false,
      showAddFeeModal: false,
      showManageFee: false,
      showAddConcTypeModal: false
    })
  }

  componentDidMount () {
    if (concessionSettingsState) {
      this.setState({
        concessionSettingsState
      })
    }

    if (!this.props.listConcessions.length && !this.props.listConcessionTypes) {
      this.props.fetchConcessions(this.props.alert, this.props.user, moduleId)
      this.props.fetchConcessionTypes(this.props.alert, this.props.user)
      concessionSettingsState = this.state
    }
  }

  handleConcessionType = () => {
    let data = {
      type_name: this.state.type_name
    }
    this.props.addedConcessionTypes(data, this.props.alert, this.props.user)
    this.hideModalHandler()
    this.setState({ type_name: '' })
  }

  concessionTypeHandler = (e) => {
    this.setState({
      type_name: e.target.value
    })
  }

  deleteModalShowHandler = (id) => {
    this.setState({
      showDeleteModal: true,
      deleteId: id
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  deleteHandler = () => {
    // this.props.deleteConcessionFeeType(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  render () {
    let { classes } = this.props
    let modal = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler}>
          <EditConcessionSettings id={this.state.id} alert={this.props.alert} close={this.hideModalHandler} />
        </Modal>
      )
    }
    let addConcTypeModal = null
    if (this.state.showAddConcTypeModal) {
      addConcTypeModal = (
        <Modal
          style={{ height: '200px' }}
          open={this.state.showAddConcTypeModal}
          click={this.hideModalHandler}
          medium
        >
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
              <div style={{ margin: '0 auto' }}>
                <h3>Add Concession Type</h3>
              </div>
            </Grid>
            <Divider />
            <Grid item xs='8'>
              <label>Concession Type</label>
              <input
                type='text'
                name='type_name'
                className='form-control'
                placeholder='Concession Type'
                value={this.state.type_name}
                onChange={this.concessionTypeHandler}
              />
            </Grid>
          </Grid>
          <div
            style={{ margin: '0 auto', paddingLeft: '20px' }}
          >
            <Button
              color='primary'
              variant='contained'
              onClick={this.handleConcessionType}
              disabled={!this.state.type_name}
            >Add Concession Type</Button>
          </div>
        </Modal>
      )
    }
    let addConcession = null
    if (this.state.showAddFeeModal) {
      addConcession = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler}>
          <AddConcessionSettings alert={this.props.alert} close={this.hideModalHandler} />
        </Modal>
      )
    }
    let manageFee = null
    if (this.state.showManageFee) {
      manageFee = (
        <Modal open={this.state.showManageFee} click={this.hideModalHandler}>
          <ManageFees
            concessionId={this.state.concessionId}
            concessionName={this.state.concessionName}
            concessionTypeId={this.state.concessionTypeId}
            dataLoading={this.props.dataLoading}
            alert={this.props.alert}
            deleteModalShowHandler={this.deleteModalShowHandler}
            close={this.hideModalHandler}
          />
        </Modal>
      )
    }
    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal
          style={{ zIndex: '1400' }}
          open={this.state.showDeleteModal}
          click={this.deleteModalCloseHandler}
          small
        >
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button
              color='secondary'
              onClick={this.deleteHandler}
              variant='contained'
            >
              Delete
            </Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.deleteModalCloseHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='7' />
          <Grid item xs='5'>
            <span style={{ cursor: 'pointer' }}>
              <Button
                color='primary'
                variant='contained'
                startIcon={<AddIcon />}
                onClick={this.showAddFeeModalHandler}
              >
                      Add Concession
              </Button>
            </span> &nbsp;
            <span style={{ cursor: 'pointer' }}>
              <Button
                color='primary'
                variant='contained'
                startIcon={<AddIcon />}
                onClick={this.showAddConcModalHandler}
              >
                      Add Concession Type
              </Button>
            </span>
          </Grid>
          <React.Fragment>
            <div className={classes.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr</TableCell>
                    <TableCell>Concession Name</TableCell>
                    <TableCell>Concession Type</TableCell>
                    <TableCell>Adjust Type</TableCell>
                    <TableCell>Minimum Payable Amount</TableCell>
                    <TableCell>Concession Percentage</TableCell>
                    <TableCell>Branch Max Concession</TableCell>
                    <TableCell>Fixed Amount</TableCell>
                    <TableCell>Adjust Order</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Manage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.listConcessions && this.props.listConcessions.length
                    ? this.props.listConcessions.map((row, i) => {
                      return (
                        <React.Fragment>
                          <TableRow hover >
                            <TableCell>{++i}</TableCell>
                            <TableCell>{row.concession_name ? row.concession_name : ''}</TableCell>
                            <TableCell>{row.concession_type ? row.concession_type.type_name : ''}</TableCell>
                            <TableCell>{row.adjustment_type
                              ? row.adjustment_type === '1' ? 'Automatic'
                                : row.adjustment_type === '2' ? 'Manual'
                                  : row.adjustment_type === '3' ? 'Fixed' : ''
                              : ''}</TableCell>
                            <TableCell>{row.min_amount ? Math.round(row.min_amount) : '0'}</TableCell>
                            <TableCell>{row.automatic_concession_percentage ? Math.round(row.automatic_concession_percentage) : '0'}</TableCell>
                            <TableCell>{row.branch_level_limit_amount ? Math.round(row.branch_level_limit_amount) : '0'}</TableCell>
                            <TableCell>{row.Fixed_amount ? Math.round(row.Fixed_amount) : '0'}</TableCell>
                            <TableCell>{row.adjustment_order
                              ? row.adjustment_order === '1' ? 'Ascending'
                                : row.adjustment_order === '2' ? 'Descending'
                                  : row.adjustment_order === '3' ? 'Installment Wise Percentage' : ''
                              : ''}</TableCell>
                            <TableCell>
                              <Fab
                                color='primary'
                                size='small'
                                onClick={() => this.showModalHandler(row.id)}
                              >
                                <EditIcon />
                              </Fab>
                            </TableCell>
                            <TableCell>
                              <Button
                                color='primary'
                                variant='contained'
                                style={{ width: '200px' }}
                                onClick={() => { this.showManageFeeModalHandler(row.id, row.concession_type.type_name, row.concession_type.id) }}
                              >Manage Fee Type</Button>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      )
                    }) : 'no data'}
                </TableBody>
              </Table>
            </div>
          </React.Fragment>
        </Grid>
        {modal}
        {addConcession}
        {manageFee}
        {addConcTypeModal}
        {deleteModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  listConcessions: state.finance.concessionSettings.listConcessions,
  listConcessionTypes: state.finance.concessionSettings.listConcessionType,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchConcessions: (alert, user, moduleId) => dispatch(actionTypes.fetchListConcessionSettings({ alert, user, moduleId })),
  fetchConcessionTypes: (alert, user) => dispatch(actionTypes.fetchListConcessionTypes({ alert, user })),
  addedConcessionTypes: (data, alert, user) => dispatch(actionTypes.addConcessionTypes({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ConcessionSettings)))
