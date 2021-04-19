import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
// import { Paper } from '@material-ui/core/'
import { Button, Fab, Grid, Table, TableHead, TableRow, TableBody, TableCell, TablePagination } from '@material-ui/core/'
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
// import axios from 'axios'
// import ReactTable from 'react-table' //rajneesh
// import 'react-table/react-table.css'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { OmsFilterTable } from '../../../../ui'
// import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
// import { urls } from '../../../../urls'
import EditFeeAccount from './editFeeAccounts'
import AddFeeAccount from './addFeeAccounts'
// import Layout from '../../../../../../Layout'
import classes from '../ViewBanks/viewBanks.module.css'

// const ViewAccounts = {
//   namespace: 'View Fee Accounts'
// }

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

let viewFeeAccState = null

class ViewFeeAccounts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      branchId: null,
      currentBranch: null,
      session: null,
      showEditModal: false,
      showAddButton: false,
      showAddModal: false,
      showDeleteModal: false,
      deleteId: null,
      data: [],
      field: [],
      editFeeAccid: null,
      page: 0,
      rowsPerPage: 10
    }
    this.handleClickFeeData = this.handleClickFeeData.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.showDeleteModalHandler = this.showDeleteModalHandler.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
  }

  componentDidMount () {
    if (viewFeeAccState !== null) {
      this.setState(viewFeeAccState)
    }

    if (this.props.currentSession) {
      this.fetchBranchHandler()
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
  fetchBranchHandler = (e) => {
    this.props.fetchBranches(this.props.currentSession, this.props.alert, this.props.user, moduleId)
    // this.setState({ branchId: e.value, branchData: e })
  }

  changehandlerbranch = (e) => {
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    })
  }

    showEditModalHandler = (id) => {
      this.setState({
        showEditModal: true,
        editFeeAccid: id
      })
    }

    showAddModalHandler = () => {
      this.setState({
        showAddModal: true
      })
    }

    hideModalHandler = () => {
      this.setState({
        showEditModal: false,
        showAddModal: false
      })
    }

    handleClickFeeData = (e) => {
      if (!this.props.currentSession) {
        this.props.alert.warning('Select Academic Year')
      } else if (!this.state.currentBranch) {
        this.props.alert.warning('Select Branch')
      }

      if (this.props.currentSession && this.state.currentBranch) {
        this.props.fetchAllFeeAccounts(this.props.currentSession, this.state.currentBranch.id, this.props.alert, this.props.user, moduleId)
        this.setState({ showTable: true, showAddButton: true }, () => { viewFeeAccState = this.state })
      }
      // this.renderTable()
    }

    deleteHandler = () => {
      // var updatedList = urls.Finance + this.state.deleteId + '/' + 'editfeeaccountinfo/'
      const data = this.props.viewFeeAccList.filter(list => list.id === this.state.deleteId)[0]
      const deleteData = {
        fee_account_name: data.fee_account_name ? data.fee_account_name : '',
        id: this.state.deleteId,
        prefix: data.prefix ? data.prefix : '',
        receipt_sub_header: data.receipt_sub_header ? data.receipt_sub_header : '',
        receipt_footer: data.receipt_footer ? data.receipt_footer : '',
        payslip_header: data.payslip_header ? data.payslip_header : '',
        can_be_shown_reports: data.can_be_shown_reports === 'Yes',
        is_trust: data.is_trust === 'Yes',
        is_expenses_account: data.is_expense_account === 'Yes',
        is_delete: true
      }
      this.props.deleteFeeAccounts(deleteData, this.state.deleteId, this.props.alert, this.props.user)
      this.hideDeleteModalHandler()
      // axios
      //   .put(updatedList, deleteData, {
      //     headers: {
      //       Authorization: 'Bearer ' + this.props.user
      //     }
      //   })
      //   .then(res => {
      //     this.props.alert.warning('Deleted Successfully!')
      //     const feeList = [...this.state.data]
      //     const index = feeList.findIndex(ele => {
      //       return ele.id === this.state.deleteId
      //     })
      //     const modifiedList = feeList.filter((ele, i) => index !== i).map((ele, i) => {
      //       const newEle = { ...ele }
      //       newEle.Sr = i + 1
      //       return newEle
      //     })

      //     this.setState({ data: [...modifiedList] })
      //     this.hideDeleteModalHandler()
      //   })
      //   .catch((error) => {
      //   })
    };

    renderTable = () => {
      let dataToShow = []
      dataToShow = this.props.viewFeeAccList.map((val, i) => {
        return {
          Sr: i + 1,
          id: val.id ? val.id : '',
          fee_account_name: val.fee_account_name ? val.fee_account_name : '',
          prefix: val.prefix ? val.prefix : '',
          receipt_sub_header: val.receipt_sub_header ? val.receipt_sub_header : '',
          receipt_footer: val.receipt_footer ? val.receipt_footer : '',
          payslip_header: val.payslip_header ? val.payslip_header : '',
          can_be_shown_reports: val.can_be_shown_reports ? 'Yes' : 'No',
          is_trust: val.is_trust ? 'Yes' : 'No',
          is_expenses_account: val.is_expenses_account ? 'Yes' : 'No',
          Edit: (
            <Fab
              color='primary'
              variant='contained'
              size='small'
              onClick={() => this.showEditModalHandler(val.id)}
            >
              <EditIcon />
            </Fab>
          ),
          Delete: (
            <Fab
              color='primary'
              variant='contained'
              size='small'
              onClick={() => { this.showDeleteModalHandler(val.id) }}
            >
              <DeleteIcon />
            </Fab>
          )
        }
      })
      return dataToShow
      // this.setState({
      //   data: feelist,
      //   field: feetable
      // })
    }

      showDeleteModalHandler = (id) => {
        this.setState({ showDeleteModal: true, deleteId: id })
      }

      hideDeleteModalHandler = () => {
        this.setState({ showDeleteModal: false })
      }

      render () {
        let editModal = null; let addModal = null; let feeAccTable = null
        let deleteModal = null;
        if (this.state.showEditModal) {
          editModal = (
            <Modal open={this.state.showEditModal} click={this.hideModalHandler}>
              <EditFeeAccount id={this.state.editFeeAccid} accountDetails={this.props.viewFeeAccList} giveData={this.getBackTheUpdatedDataHandler} alert={this.props.alert} close={this.hideModalHandler} />
            </Modal>
          )
        }

        if (this.state.showAddModal) {
          addModal = (
            <Modal open={this.state.showAddModal} click={this.hideModalHandler}>
              <AddFeeAccount giveData={this.getBackTheAddedDataHandler} alert={this.props.alert} close={this.hideModalHandler} branch={this.state.currentBranch.id} session={this.props.currentSession} />
            </Modal>
          )
        }
        if (this.state.showDeleteModal) {
          deleteModal = (
            <Modal open={this.state.showDeleteModal} click={this.hideDeleteModalHandler} small>
              <h3 className={classes.modal__heading}>Are You Sure?</h3>
              <hr />
              <div className={classes.modal__deletebutton}>
                <Button negative onClick={this.deleteHandler}>Delete</Button>
              </div>
              <div className={classes.modal__remainbutton}>
                <Button primary onClick={this.hideDeleteModalHandler}>Go Back</Button>
              </div>
            </Modal>
          )
        }
        // if (this.props.viewFeeAccList.length > 0) {
        //   feeAccTable = (<ReactTable
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
        //         Header: 'Fee Account Name',
        //         accessor: 'fee_account_name',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Prefix',
        //         accessor: 'prefix',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'receipt Sub Header',
        //         accessor: 'receipt_sub_header',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Receipt Footer',
        //         accessor: 'receipt_footer',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Payslip Header',
        //         accessor: 'payslip_header',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Show Reports',
        //         accessor: 'can_be_shown_reports',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Is Trusty',
        //         accessor: 'is_trust',
        //         inputFilterable: true,
        //         exactFilterable: true,
        //         sortable: true
        //       },
        //       {
        //         Header: 'Is Expense Account',
        //         accessor: 'is_expenses_account',
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
        //       }
        //       // {
        //       //   Header: 'Delete',
        //       //   accessor: 'Delete',
        //       //   inputFilterable: true,
        //       //   exactFilterable: true,
        //       //   sortable: true,
        //       //   style: {
        //       //     paddingTop: '5px'
        //       //   }
        //       // }
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
        return (
          // <Layout>
          <React.Fragment>
            <div>
              <Grid container spacing={3} style={{ padding: 15 }}>
                <Grid item xs='8' />
                <Grid item xs='4'>
                  {this.state.showAddButton
                    ? <Button onClick={this.showAddModalHandler} color='primary' variant='contained'>
                        Add Fee Accounts
                    </Button>
                    : null
                  }

                </Grid>
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
                    onChange={this.changehandlerbranch}
                  />
                </Grid>
                <Grid item xs='3'>
                  <Button
                    color='primary'
                    variant='contained'
                    style={{ marginTop: '20px' }}
                    onClick={this.handleClickFeeData}
                  >
                      Get
                  </Button>
                </Grid>
                {this.state.showTable
                  ? <React.Fragment>
                    <Grid item xs='12'>
                      {/* <OmsFilterTable
                        filterTableData={ViewAccounts}
                        tableData={this.state.data}
                        tableFields={this.state.field}
                      /> */}
                      {/* {feeAccTable} */}

                      <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell>Fee Account Name</TableCell>
                      <TableCell> Prefix</TableCell>
                      <TableCell> Receipt Sub Header</TableCell>
                      <TableCell> Receipt Footer</TableCell>
                      <TableCell> Payslip Header</TableCell>
                      <TableCell> Show Reports</TableCell>
                      <TableCell> Is Trusty</TableCell>
                      <TableCell> Is Expense Account</TableCell>
                      <TableCell> Edit </TableCell>
                      <TableCell> Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.viewFeeAccList && this.props.viewFeeAccList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.fee_account_name ? val.fee_account_name : ''}</TableCell>
                      <TableCell> {val.prefix ? val.prefix : ''}</TableCell>
                      <TableCell> {val.receipt_sub_header ? val.receipt_sub_header : ''} </TableCell>
                      <TableCell>{ val.receipt_footer ? val.receipt_footer : ''} </TableCell>
                      <TableCell> {val.payslip_header ? val.payslip_header : ''} </TableCell>
                      <TableCell> {val.can_be_shown_reports ? 'Yes' : 'No'}</TableCell>
          <TableCell>{val.is_trust ? 'Yes' : 'No'}</TableCell>
          <TableCell>{val.is_expenses_account ? 'Yes' : 'No'}</TableCell>
          <TableCell>{<Fab
              color='primary'
              variant='contained'
              size='small'
              onClick={() => this.showEditModalHandler(val.id)}
            >
              <EditIcon />
            </Fab>}</TableCell>
          <TableCell> 
          <Fab
              color='primary'
              variant='contained'
              size='small'
              onClick={() => { this.showDeleteModalHandler(val.id) }}
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
                count={this.props.viewFeeAccList && this.props.viewFeeAccList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
                    </Grid>
                  </React.Fragment>
                  : null
                }

              </Grid>
            </div>
            {this.props.dataLoading ? <CircularProgress open /> : null}
            {deleteModal}
            {editModal}
            {addModal}
          </React.Fragment>
          // </Layout>
        )
      }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.finance.common.branchPerSession,
  viewFeeAccList: state.finance.viewFeeAccounts.viewFeeAccList,
  dataLoading: state.finance.common.dataLoader
  // session: state.academicSession.items
})
const mapDispatchToProps = dispatch => ({
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchAllFeeAccounts: (session, branchId, alert, user, moduleId) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user, moduleId })),
  deleteFeeAccounts: (deleteData, deleteId, alert, user) => dispatch(actionTypes.deleteFeeAccounts({ deleteData, deleteId, alert, user }))
  // loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(ViewFeeAccounts)))
