import React, { Component } from 'react'
// import { Divider } from 'semantic-ui-react'
import { Button, Fab, Grid, Table, TableRow, TableCell, TableBody, TableHead, TablePagination } from '@material-ui/core/'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'

import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/staff.css'
import classes from './deleteModal.module.css'
import { apiActions } from '../../../../_actions'
import EditFeeTypes from './editRegistrationFee'
import AddFeeTypes from './addregistrationFee'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

// let feeTypeState = null
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
        if (item.child_name === 'App/Reg Fee Type') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId= item.child_id
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
class RegistrationFee extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showModal: false,
      showAddFeeModal: false,
      showDeleteModal: false,
      deleteId: null,
      id: null,
      data: [],
      feeDetails: [],
      branch: '',
      branchData: [],
      session: null,
      sessionData: null,
      showAddButton: false,
      currentFeetype: '',
      page: 0,
      rowsPerPage: 10,
      moduleId: null

    }
    this.handleClickFeeData.bind(this)
    this.handleAcademicyear.bind(this)
    // this.deleteHandler = this.deleteHandler.bind(this)
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
  showModalHandler = (id) => {
    this.setState({
      showModal: true,
      id: id
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

  showAddFeeModal = () => {
    this.setState({
      showAddFeeModal: true
    })
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false,
      showAddFeeModal: false
    })
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [], sessionData: e }, () => {
      this.props.fetchBranches(this.state.session, this.props.alert, this.props.user, moduleId)
    })
  }

  changehandlerbranch = (e) => {
    this.setState({
      branch: {
        id: e.value,
        branch_name: e.label
      },
      branchData: e
    })
  }

  changehandlerFeeType = (e) => {
    this.setState({
      currentFeetype: e
    })
  }

  handleClickFeeData = () => {
    if (!this.state.session || this.state.branchData.length < 0 || !this.state.currentFeetype) {
      this.props.alert.warning('Select All Fields')
      return
    }
    this.props.fetchFeeTypes(this.state.session, this.state.branch.id, this.state.currentFeetype.value, this.props.alert, this.props.user)
    // if (this.state.session && this.state.branch.id) {
    this.setState({ showTable: true, showAddButton: true })
    // }
  }

  deleteHandler = () => {
    this.props.deleteRegistrationFeeType(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  renderTable = () => {
    let dataToShow
    if (this.props.feeTypes.length > 0) {
      dataToShow = this.props.feeTypes.map((val, i) => {
        return {
          Sr: i + 1,
          fee_type_name: val.fee_type_name ? val.fee_type_name : '',
          fee_account: val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : '-Assign Fee Account-',
          amount: val.amount ? val.amount : 0,
          Edit: (
            <div style={{ cursor: 'pointer' }}>
              <Fab
                color='primary'
                size='small'
                onClick={() => this.showModalHandler(val.id)}
              >
                <EditIcon />
              </Fab>
            </div>
          ),
          Delete: (
            <Fab
              color='primary'
              size='small'
              onClick={() => this.deleteModalShowHandler(val.id)}
            >
              <DeleteIcon />
            </Fab>
          )
        }
      })
    } else {
      dataToShow = 'No Records Found !!!'
    }
    return dataToShow
  }

  // componentDidMount () {
  //   if (feeTypeState) {
  //     this.setState(feeTypeState)
  //   }
  // }

  render () {
    // let viewFeeTable = null
    // if (this.props.feeTypes.length > 0) {
    //   viewFeeTable = (<ReactTable
    //     // pages={Math.ceil(this.props.viewBanksList.count / 20)}
    //     data={this.renderTable()}
    //     manual
    //     columns={[
    //       {
    //         Header: 'Sr',
    //         accessor: 'Sr',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center'
    //         }
    //       },
    //       {
    //         Header: 'Fee Type Name',
    //         accessor: 'fee_type_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center'
    //         }
    //       },
    //       {
    //         Header: 'Fee Account',
    //         accessor: 'fee_account',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center'
    //         }
    //       },
    //       {
    //         Header: 'Amount',
    //         accessor: 'amount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center'
    //         }
    //       },
    //       {
    //         Header: 'Edit',
    //         accessor: 'Edit',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center',
    //           marginBottom: '5px'
    //         }
    //       },
    //       {
    //         Header: 'Delete',
    //         accessor: 'Delete',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           textAlign: 'center'
    //         }
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={this.renderTable().length + 1}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     // page={this.state.page}
    //     // Callbacks
    //     // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }
    let editModal = null
    if (this.state.showModal) {
      editModal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler} medium style={{ overflowX: 'hidden' }}>
          <EditFeeTypes
            id={this.state.id}
            acadId={this.state.session}
            branchId={this.state.branch.id}
            typeId={this.state.currentFeetype.value}
            alert={this.props.alert}
            close={this.hideModalHandler}
          />
        </Modal>
      )
    }
    let addFeeModal = null
    if (this.state.showAddFeeModal) {
      addFeeModal = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler} medium style={{ overflowX: 'hidden' }}>
          <AddFeeTypes
            acadId={this.state.session}
            branchId={this.state.branchData.value}
            typeId={this.state.currentFeetype.value}
            user={this.props.user}
            alert={this.props.alert}
            close={this.hideModalHandler}
          />
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
            <Button
              color='secondary'
              variant='contained'
              onClick={this.deleteHandler}
            >
              Delete
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
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
        <Grid container spacing={3} style={{ padding: 10 }}>
          {this.state.sessionData && this.state.branchData && this.state.currentFeetype
            ? <React.Fragment>
              <Grid item xs='10' />
              <Grid item xs='2'>
                <div style={{ cursor: 'pointer' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.showAddFeeModal}
                    startIcon={<AddIcon />}
                  >
                        Add Fee
                  </Button>
                </div>
              </Grid>
            </React.Fragment>
            : null}
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session ? this.props.session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={this.handleAcademicyear}
            />

          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
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
          <Grid item xs='3'>
            <label>Fee Type*</label>
            <Select
              placeholder='Select Fee Type'
              value={this.state.currentFeetype ? this.state.currentFeetype : null}
              options={
                [
                  {
                    value: 1,
                    label: 'Registration Fee Type'
                  },
                  {
                    value: 2,
                    label: 'Application Fee Type'
                  }
                ]
              }

              onChange={this.changehandlerFeeType}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              style={{ marginTop: 20 }}
              onClick={this.handleClickFeeData}
            >
                    Get
            </Button>
          </Grid>
          {this.state.showTable && this.props.feeTypes.length
            ? <Grid item xs='12'>
              {/* {viewFeeTable} */}
              {/* {this.state.showTable ?  */}
              <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Fee Type Name</TableCell>
                      <TableCell> Fee Account</TableCell>
                      <TableCell> Amount</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.feeTypes && this.props.feeTypes.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      <TableCell>{val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : '-Assign Fee Account-'} </TableCell>
                      <TableCell>{val.amount } </TableCell>
                      <TableCell><div style={{ cursor: 'pointer' }}>
              <Fab
                color='primary'
                size='small'
                onClick={() => this.showModalHandler(val.id)}
              >
                <EditIcon />
              </Fab>
            </div></TableCell>
                      <TableCell>
                      <Fab
              color='primary'
              size='small'
              onClick={() => this.deleteModalShowHandler(val.id)}
            >
              <DeleteIcon />
            </Fab>       </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.feeTypes && this.props.feeTypes.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              {/* : []} */}
            </Grid> : null}

        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {editModal}
        {addFeeModal}
        {deleteModal}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  feeTypes: state.finance.registrationFeeType.feeTypesList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchFeeTypes: (session, branch, type, alert, user) => dispatch(actionTypes.fetchListRegistrationFeeType({ session, branch, type, alert, user })),
  deleteRegistrationFeeType: (id, alert, user) => dispatch(actionTypes.deleteRegistrationFeeType({ id, alert, user }))

})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(RegistrationFee)))
