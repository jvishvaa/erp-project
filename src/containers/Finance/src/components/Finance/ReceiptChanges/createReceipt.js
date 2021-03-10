import React, { Component } from 'react'
import { Button, Fab, Grid, TableBody, TableCell, Table, TableRow, TableHead, TablePagination } from '@material-ui/core/'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'

import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'

// import { OmsFilterTable } from '../../../ui'
import classes from './deleteModal.module.css'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Modal from '../../../ui/Modal/modal'
import '../../css/staff.css'
import EditReceipt from './editReceipt'
import AddReceipt from './addReceipt'
import Layout from '../../../../../Layout'

// const ReceiptRange = {
//   namespace: 'Misc Fee'
// }
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId = null 
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Settings' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Create Receipt Ranges') {
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

class CreateReceipt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      receiptData: [],
      branchValue: [],
      showTable: false,
      showEditModal: false,
      showAddModal: false,
      receiptDetails: [],
      data: [],
      field: [],
      sessionData: null,
      showAddButton: false,
      showDeleteModal: false,
      deleteId: null,
      page: 0,
      rowsPerPage: 10,
      moduleId: null
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  }
  showEditModalHandler = (id) => {
    this.setState({
      showEditModal: true,
      id: id
    })
  }

  showAddModalHandler = () => {
    this.setState({
      showAddModal: true
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

  hideModalHandler = () => {
    this.setState({
      showEditModal: false,
      showAddModal: false
    })
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  handleClickSessionYear = (e) => {
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
  }

  changeReceiptType = (e) => {
    this.setState({ recType: e.value })
  }
  handleClickReceiptData = (e) => {
    if (!this.state.session) {
      this.props.alert.warning('Select Academic Year')
    } else if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
    } else if (!this.state.recType) {
      this.props.alert.warning('Select Receipt Type')
    }
    this.renderTable()
    this.props.fetchListReceipt(this.state.session, this.state.branchId, this.state.recType, this.props.alert, this.props.user)
    if (this.state.session && this.state.branchId && this.state.recType) {
      this.setState({ showTable: true, showAddButton: true })
    }
  }

  deleteHandler = () => {
    this.props.deleteReceipts(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  renderTable = () => {
    let dataToShow = []
    dataToShow = this.props.receiptLists.map((val, i) => {
      return {
        Sr: ++i,
        // id: val.id ? val.id : '',
        // feeAccountList: val.fee_account ? val.fee_account : '',
        fee_account_name: val.fee_account.fee_account_name ? val.fee_account.fee_account_name : '',
        range_from: val.range_from ? val.range_from : '',
        range_to: val.range_to ? val.range_to : '',
        sequence_no: val.sequence_no ? val.sequence_no : '',
        is_active: val.is_active ? 'Active' : 'Inactive',
        Edit: (
          <div style={{ cursor: 'pointer' }}>
            <Fab
              color='primary'
              className={classes.button}
              size='small'
              onClick={() => this.showEditModalHandler(val.id)}
            >
              <EditIcon />
            </Fab>
          </div>
        ),
        Delete: (
          <Fab
            color='primary'
            className={classes.button}
            size='small'
            onClick={() => this.deleteModalShowHandler(val.id)}
          >
            <DeleteIcon />
          </Fab>
        )
      }
    })
    return dataToShow
  }

  componentDidMount () {
    // axios
    //   .get(urls.ReceiptType, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     // console.log(res.data.results);
    //     this.setState({ receiptType: res.data.results })
    //   })
    //   .catch((error) => {
    //     this.props.alert.error('Something Went Wrong')
    //     console.log("Error: Couldn't fetch data from " + urls.ReceiptType + error)
    //   })
  }

  render () {
    console.log('---list---------', this.props.receiptLists)
    // let receiptList = null
    // if (this.props.receiptLists.length > 0) {
    //   receiptList = (<ReactTable
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
    //         Header: 'Fee Account',
    //         accessor: 'fee_account_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Range From',
    //         accessor: 'range_from',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Range To',
    //         accessor: 'range_to',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Sequence No',
    //         accessor: 'sequence_no',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Status',
    //         accessor: 'is_active',
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
    //           display: 'flex',
    //           margin: 'auto'
    //         }
    //       },
    //       {
    //         Header: 'Delete',
    //         accessor: 'Delete',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true,
    //         style: {
    //           display: 'flex',
    //           margin: 'auto'
    //         }
    //       }
    //     ]}
    //     filterable
    //     sortable
    //     defaultPageSize={this.renderTable().length}
    //     showPageSizeOptions={false}
    //     className='-striped -highlight'
    //     // Controlled props
    //     // page={this.state.page}
    //     // Callbacks
    //     // onPageChange={page => this.pageChangeHandler(page)}
    //   />)
    // }
    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <Modal open={this.state.showEditModal} click={this.hideModalHandler}>
          <EditReceipt id={this.state.id} acadId={this.state.session} branchId={this.state.branchId} alert={this.props.alert} close={this.hideModalHandler} />
        </Modal>
      )
    }
    let addModal = null
    if (this.state.showAddModal) {
      addModal = (
        <Modal open={this.state.showAddModal} click={this.hideModalHandler}>
          <AddReceipt
            acadId={this.state.session}
            branchId={this.state.branchId}
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
              onClick={this.deleteHandler}
              variant='contained'
            >
              Delete
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button
              variant='contained'
              color='primary'
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
          <Grid item xs='9' />
          {this.state.showAddButton
            ? <Grid item xs='3'>
              <div style={{ cursor: 'pointer' }}>
                <Button
                  variant='contained'
                  color='primary'
                  className={classes.button}
                  startIcon={<AddIcon />}
                  onClick={this.showAddModalHandler}
                >
                    Add Receipt
                </Button>
              </div>
            </Grid>
            : ''}
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.sessionData ? ({
                value: this.state.sessionData.value,
                label: this.state.sessionData.label
              }) : null}
              options={
                this.props.session && this.props.session.session_year.length
                  ? this.props.session.session_year.map(session => ({ value: session, label: session })
                  ) : []}
              onChange={this.handleClickSessionYear}
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

              onChange={(e) => this.changehandlerbranch(e)}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Receipt type*</label>
            <Select
              placeholder='Receipt Type'
              options={
                [
                  {
                    value: 2,
                    label: 'Manual'
                  },
                  {
                    value: 1,
                    label: 'Online'
                  }
                ]
              }

              onChange={this.changeReceiptType}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              style={{ marginTop: 17 }}
              onClick={this.handleClickReceiptData}
            >
              Show Details
            </Button>
          </Grid>
          {this.state.showTable
            ? <React.Fragment>
              <Grid item xs='12'>
                {/* {receiptList} */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Fee Account</TableCell>
                      <TableCell> Range From</TableCell>
                      <TableCell> Range To</TableCell>
                      <TableCell> Sequence No</TableCell>
                      <TableCell> Status</TableCell>
                      <TableCell> Edit</TableCell>
                      <TableCell> Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.receiptLists && this.props.receiptLists.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.fee_account.fee_account_name ? val.fee_account.fee_account_name : ''}</TableCell>
                      <TableCell> {val.range_from ? val.range_from : ''}</TableCell>
                      <TableCell>{val.range_to ? val.range_to : ''} </TableCell>
                      <TableCell> { val.sequence_no ? val.sequence_no : ''} </TableCell>
                      <TableCell> {val.is_active ? 'Active' : 'Inactive'} </TableCell>
                      <TableCell> <div style={{ cursor: 'pointer' }}>
            <Fab
              color='primary'
              className={classes.button}
              size='small'
              onClick={() => this.showEditModalHandler(val.id)}
            >
              <EditIcon />
            </Fab>
          </div></TableCell>
                      <TableCell>  <Fab
            color='primary'
            className={classes.button}
            size='small'
            onClick={() => this.deleteModalShowHandler(val.id)}
          >
            <DeleteIcon />
          </Fab></TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.receiptLists && this.props.receiptLists.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              </Grid>
            </React.Fragment>
            : null}
          {this.props.dataLoading ? <CircularProgress open /> : null}
          {editModal}
          {addModal}
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
  receiptLists: state.finance.receiptRangesLists.receiptList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchListReceipt: (session, branch, receiptType, alert, user) => dispatch(actionTypes.fetchReceiptRanges({ session, branch, receiptType, alert, user })),
  deleteReceipts: (id, alert, user) => dispatch(actionTypes.deleteReceiptFeeList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(CreateReceipt)))
