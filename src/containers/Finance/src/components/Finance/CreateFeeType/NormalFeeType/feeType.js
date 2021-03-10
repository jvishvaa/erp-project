import React, { Component } from 'react'
import { Button, Fab, Grid, Table, TableRow, TableCell, TableBody, TableHead
} from '@material-ui/core/'
import TablePagination from '@material-ui/core/TablePagination'
import Layout from '../../../../../../Layout';
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import '../../../css/staff.css'
import classes from './deleteModal.module.css'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import EditFeeTypes from './editFeeType'
import AddNormalFee from './addfeeType'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

let feeTypeState = null
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Fee Type' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Normal Fee Type') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
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
class FeeType extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showModal: false,
      showAddFeeModal: false,
      showDeleteModal: false
      // moduleId: ''
    }
    this.handleClickFeeData.bind(this)
    this.handleAcademicyear.bind(this)
    // this.deleteHandler = this.deleteHandler.bind(this)
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

  handleClickFeeData = (e) => {
    // if (!this.state.session) {
    //   this.props.alert.warning('Select Academic Year')
    //   return
    // } else if (!this.state.branch) {
    //   this.props.alert.warning('Select Branch')
    //   return
    // }
    this.props.fetchNormalFeeList(this.state.session, this.state.branch && this.state.branch.id, this.props.alert, this.props.user)
    if (this.state.session && this.state.branch.id) {
      this.setState({ showTable: true, showAddButton: true }, () => { feeTypeState = this.state })
    }
  }

  deleteHandler = () => {
    this.props.deleteNormalFeeList(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  renderTable = () => {
    let dataToShow = []
    console.log("render table: ", this.props.normalFeeList)
    dataToShow = this.props.normalFeeList.map((val, i) => {
      return {
        Sr: i + 1,
        id: val.id ? val.id : '',
        fee_type_name: val.fee_type_name ? val.fee_type_name : '',
        priority: Number.isInteger(val.priority) ? val.priority : '',
        is_concession_applicable: val.is_concession_applicable ? 'Yes' : 'No',
        is_service_based: val.is_service_based ? 'Yes' : 'No',
        is_pro_rata: val.is_pro_rata ? 'Yes' : 'No',
        is_allow_partial_amount: val.is_allow_partial_amount ? 'Yes' : 'No',
        is_activity_based_fee: val.is_activity_based_fee ? 'Yes' : 'No',
        is_refundable_fee: val.is_refundable_fee ? 'Yes' : 'No',
        show_transaction_in_parent_login: val.show_transaction_in_parent_login ? 'Yes' : 'No',
        Edit: (
          <Fab
            color='primary'
            size='small'
            onClick={() => this.showModalHandler(val.id)}
          >
            <EditIcon />
          </Fab>
        ),
        Delete: (
          <Fab
            color='primary'
            size='small'
            onClick={() => this.deleteModalShowHandler(val.id)}
            // startIcon={}
          >
            <DeleteIcon />
          </Fab>
        )
      }
    })
    return dataToShow
  }

  componentDidMount () {
    if (feeTypeState) {
      this.setState(feeTypeState)
    }
    // if (NavData && NavData.length) {
    //   NavData.forEach((item) => {
    //     if (
    //       item.parent_modules === 'Fee Type' &&
    //       item.child_module &&
    //       item.child_module.length > 0
    //     ) {
    //       item.child_module.forEach((item) => {
    //         if (item.child_name === 'Normal Fee Type') {
    //           // setModuleId(item.child_id);
    //           // setModulePermision(true);
    //           this.setState({
    //             moduleId: item.child_id
    //           })
    //           console.log('id+', item.child_id)
    //         } else {
    //           // setModulePermision(false);
    //         }
    //       });
    //     } else {
    //       // setModulePermision(false);
    //     }
    //   });
    // } else {
    //   // setModulePermision(false);
    // }
  }

  render () {
    // let viewFeeTable = null
    // if (this.props.normalFeeList && this.props.normalFeeList.length > 0) {
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
    //         sortable: true
    //       },
    //       {
    //         Header: 'Fee Type Name',
    //         accessor: 'fee_type_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Priority',
    //         accessor: 'priority',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Concession Applicable',
    //         accessor: 'is_concession_applicable',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Service Based',
    //         accessor: 'is_service_based',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Pro Rata',
    //         accessor: 'is_pro_rata',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Partial Amount',
    //         accessor: 'is_allow_partial_amount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Activity Based Fee',
    //         accessor: 'is_activity_based_fee',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Refundable Fee',
    //         accessor: 'is_refundable_fee',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Transaction In Parent Login',
    //         accessor: 'show_transaction_in_parent_login',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Edit',
    //         accessor: 'Edit',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           paddingTop: '5px'
    //         }
    //       },
    //       {
    //         Header: 'Delete',
    //         accessor: 'Delete',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           paddingTop: '5px',
    //           paddingLeft: '29px'
    //         }
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={10}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     // page={this.state.page}
    //     // Callbacks
    //     // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }
    let modal = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler}>
          <EditFeeTypes
            id={this.state.id}
            alert={this.props.alert}
            close={this.hideModalHandler}
          />
        </Modal>
      )
    }
    let addFeeModal = null
    if (this.state.showAddFeeModal) {
      addFeeModal = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler}>
          <AddNormalFee
            acadId={this.state.session}
            // branchId={this.state.branch.id}
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
            <Button color='secondary' variant='contained' onClick={this.deleteHandler}>Delete</Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button color='primary' variant='contained' onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          {this.state.sessionData
            ? <React.Fragment>
              <Grid item xs='10' />
              <Grid item xs={2}>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={this.showAddFeeModal}
                  startIcon={<AddIcon />}
                >
                Add Fee
                </Button>
              </Grid>
            </React.Fragment>
            : ''}
        </Grid>
        <Grid container spacing={3} style={{ flexGrow: 1, padding: 15 }}>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              options={
                this.props.branches && this.props.branches.length
                  ? this.props.branches && this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              color='primary'
              variant='contained'
              style={{ marginTop: 20 }}
              onClick={this.handleClickFeeData}
            >
              Get
            </Button>
          </Grid>
          <Grid item xs={12}>
            {/* {this.state.showTable && this.props.normalFeeList && this.props.normalFeeList.length
              ? viewFeeTable
              : null} */}
              {/* {'Aman' + this.props.normalFeeList } */}
              {this.state.showTable ? 
              <React.Fragment>
              <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Fee Type Name</TableCell>
                      <TableCell> Priority</TableCell>
                      <TableCell> Concession Applicable</TableCell>
                      <TableCell> Service Based</TableCell>
                      <TableCell> Pro Rata</TableCell>
                      <TableCell> Partial Amount</TableCell>
                      <TableCell> Activity Based Fee</TableCell>
                      <TableCell> Refundable Fee</TableCell>
                      <TableCell>Transaction In Parent Login </TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.normalFeeList && this.props.normalFeeList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      <TableCell>{Number.isInteger(val.priority) ? val.priority : ''} </TableCell>
                      <TableCell>{val.is_concession_applicable ? 'Yes' : 'No'} </TableCell>
                      <TableCell> { val.is_service_based ? 'Yes' : 'No'} </TableCell>
                      <TableCell> {val.is_pro_rata ? 'Yes' : 'No'} </TableCell>
                      <TableCell>{val.is_allow_partial_amount ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.is_activity_based_fee ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.is_refundable_fee ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.show_transaction_in_parent_login ? 'Yes' : 'No' }</TableCell>
                      <TableCell> <Fab
            color='primary'
            size='small'
            onClick={() => this.showModalHandler(val.id)}
          >
            <EditIcon />
          </Fab></TableCell>
                      <TableCell>
                      <Fab
            color='primary'
            size='small'
            onClick={() => this.deleteModalShowHandler(val.id)}
            // startIcon={}
          >
            <DeleteIcon />
          </Fab>
                      </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
                <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.normalFeeList && this.props.normalFeeList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              </React.Fragment>
              : []}
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
          {modal}
          {addFeeModal}
          {deleteModal}
        </Grid>
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  normalFeeList: state.finance.normalFee.normalFeeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchNormalFeeList: (session, branch, alert, user) => dispatch(actionTypes.fetchListNormalFee({ session, alert, branch, user })),
  deleteNormalFeeList: (id, alert, user) => dispatch(actionTypes.deleteNormalFeeList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(FeeType)))
