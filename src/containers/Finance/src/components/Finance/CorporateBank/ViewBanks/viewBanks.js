import React, { Component } from 'react'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Fab, Grid, Table, TableCell, TableRow, TableHead, TableBody, TablePagination } from '@material-ui/core/'

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import {
  Edit as EditIcon
} from '@material-ui/icons'
// import { FilterInnerComponent, filterMethod } from '../FilterInnerComponent/filterInnerComponent'
import Modal from '../../../../ui/Modal/modal'
// import { OmsFilterTable } from '../../../../ui'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import AddBanks from './addBanks'
import EditBanks from './editBanks'
import classes from './viewBanks.module.css'

// const ViewBanks = {
//   namespace: 'View Banks'
// }
let viewBanksState = null

export class ViewBanks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      branchId: null,
      currentBranch: null,
      session: null,
      grades: [],
      showTable: false,
      showModal: false,
      showAddModal: false,
      rowId: null,
      data: [],
      field: [],
      showAddButton: false,
      showDeleteModal: false,
      deleteId: null,
      page: 0,
      rowsPerPage: 10
    }
    this.handleClickFeeData = this.handleClickFeeData.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.changehandlerbranch = this.changehandlerbranch.bind(this)
    this.addModalShowHandler = this.addModalShowHandler.bind(this)
  }

  componentDidMount () {
    if (viewBanksState !== null) {
      this.setState(viewBanksState)
    }

    if (this.props.currentSession) {
      this.fetchBranchHandler()
    }
  }

  componentDidUpdate () {
    // console.log('update func', this.props.viewBanksList)
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

  fetchBranchHandler = () => {
    this.props.fetchBranches(this.props.currentSession, this.props.alert, this.props.user)
  }

  changehandlerbranch = (e) => {
    // this.setState({ branchId: e.value, branchData: e })
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    })
  }

  handleClickFeeData = (e) => {
    if (!this.props.currentSession) {
      this.props.alert.warning('Select Academic Year')
    } else if (!this.state.currentBranch) {
      this.props.alert.warning('Select Branch')
    }

    if (this.props.currentSession && this.state.currentBranch) {
      this.props.fetchViewBanks(this.props.currentSession, this.state.currentBranch.id, this.props.alert, this.props.user)
      this.setState({ showTable: true, showAddButton: true }, () => { viewBanksState = this.state })
      // this.renderTable()
    }
  }

  deleteHandler = () => {
    this.props.deletedBank(this.state.deleteId, this.props.alert, this.props.user)
    this.hideDeleteModalHandler()
    // var updatedList = urls.Finance + this.state.deleteId + '/' + 'deletebankaccountinfo/'
  }

  modalShowHandler = (rowId, fullRowData) => {
    this.setState({
      showModal: true,
      rowId: rowId
    })
  }

  addModalShowHandler = () => {
    this.setState({
      showAddModal: true
    })
  }

  addModalHideHandler = () => {
    this.setState({
      showAddModal: false
    })
  }

  modalCloseHandler = () => {
    this.setState({
      showModal: false
    })
  }

  hideDeleteModalHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  showDeleteModalHandler = (id) => {
    this.setState({
      showDeleteModal: true,
      deleteId: id
    })
  }

  renderTable = () => {
    // console.log('from render method!!!')
    let dataToShow = []
    dataToShow = this.props.viewBanksList.map((val, i) => {
      return {
        Sr: i + 1,
        id: val.id,
        bank_name: val.bank_name ? val.bank_name : '',
        bank_branch_name: val.bank_branch_name ? val.bank_branch_name : '',
        AccountNumber: val.AccountNumber ? val.AccountNumber : '',
        bank_nick_name: val.bank_nick_name ? val.bank_nick_name : '',
        description: val.description ? val.description : '',
        bankType: val.is_income_account === true ? 'income' : val.is_expenses_account === true ? 'expense' : 'petty',
        cheque_bounce_amount: val.cheque_bounce_amount ? val.cheque_bounce_amount : '',
        logo_url: val.logo_url ? val.logo_url : '',
        Edit: (
          <Fab
            color='primary'
            variant='contained'
            size='small'
            onClick={() => { this.modalShowHandler(val.id, val) }}
          >
            <EditIcon />
          </Fab>
        )
        // Delete: (
        //   <Button
        //     icon='delete'
        //     basic
        //     onClick={() => { this.showDeleteModalHandler(val.id) }}
        //   />
        // )
      }
    })
    return dataToShow
  }

  render () {
    let addModal = null
    let modal = null
    // rajneesh
    // let deleteModal = null
    // let viewBankTable = null

    // if (this.props.viewBanksList.length > 0) {
    //   viewBankTable = (<ReactTable
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
    //         Header: 'Bank Name',
    //         accessor: 'bank_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Bank Branch',
    //         accessor: 'bank_branch_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Account No',
    //         accessor: 'AccountNumber',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Nick Name',
    //         accessor: 'bank_nick_name',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Description',
    //         accessor: 'description',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Bank Type',
    //         accessor: 'bankType',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Cheque Bounce Amount',
    //         accessor: 'cheque_bounce_amount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Logo URL',
    //         accessor: 'logo_url',
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

    if (this.state.showAddModal) {
      addModal = (
        <Modal open={this.state.showAddModal} click={this.addModalHideHandler}>
          <h3 className={classes.modal__heading}>Add Bank</h3>
          <hr />
          <AddBanks close={this.addModalHideHandler} alert={this.props.alert} session={this.props.currentSession} branch={this.state.currentBranch.id} />
        </Modal>
      )
    }
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.modalCloseHandler}>
          <h3 className={classes.modal__heading}>Edit Bank</h3>
          <hr />
          <EditBanks row={this.state.rowId} close={this.modalCloseHandler} session={this.props.currentSession} branch={this.state.currentBranch.id} accountDetails={this.props.viewBanksList} alert={this.props.alert} getDetails={this.editedValueHandler} />
        </Modal>
      )
    }
    // if (this.state.showDeleteModal) {
    //   deleteModal = (
    //     <Modal open={this.state.showDeleteModal} click={this.hideDeleteModalHandler} small>
    //       <h3 className={classes.modal__heading}>Are You Sure?</h3>
    //       <hr />
    //       <div className={classes.modal__deletebutton}>
    //         <Button negative onClick={this.deleteHandler}>Delete</Button>
    //       </div>
    //       <div className={classes.modal__remainbutton}>
    //         <Button primary onClick={this.hideDeleteModalHandler}>Go Back</Button>
    //       </div>
    //     </Modal>
    //   )
    // }
    return (
      <React.Fragment>
        <div>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='4'>
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
            <Grid item xs='4'>
              <Button
                color='primary'
                variant='contained'
                style={{ marginTop: '20px' }}
                onClick={this.handleClickFeeData}
              >
                  Get
              </Button>
            </Grid>
            <Grid item xs='4'>
              {this.state.showAddButton
                ? <Button color='primary' variant='contained' onClick={this.addModalShowHandler}>Add Bank</Button>
                : null}
            </Grid>
            {this.state.showTable === true
              ? <React.Fragment>
                <Grid item xs='12'>
                  {/* <OmsFilterTable
                    filterTableData={ViewBanks}
                    tableData={this.state.data}
                    tableFields={this.state.field}
                  /> */}
                  {/* {viewBankTable} */}
                  <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Bank Name</TableCell>
                      <TableCell> Branch Name</TableCell>
                      <TableCell> Account No</TableCell>
                      <TableCell> Nick Name</TableCell>
                      <TableCell> Description</TableCell>
                      <TableCell> Bank Type</TableCell>
                      <TableCell> Cheque Bounce Amount</TableCell>
                      <TableCell> Logo Url</TableCell>
                      <TableCell> Edit </TableCell>
                      <TableCell> Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.viewBanksList && this.props.viewBanksList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.bank_name ? val.bank_name : ''}</TableCell>
                      <TableCell> {val.bank_branch_name ? val.bank_branch_name : ''}</TableCell>
                      <TableCell> { val.AccountNumber ? val.AccountNumber : ''} </TableCell>
                      <TableCell>{ val.bank_nick_name ? val.bank_nick_name : ''} </TableCell>
                      <TableCell> {val.description ? val.description : ''} </TableCell>
                      <TableCell> {val.is_income_account === true ? 'income' : val.is_expenses_account === true ? 'expense' : 'petty'}</TableCell>
          <TableCell>{val.cheque_bounce_amount ? val.cheque_bounce_amount : ''}</TableCell>
          <TableCell>{val.logo_url ? val.logo_url : ''}</TableCell>
          <TableCell>{<Fab
            color='primary'
            variant='contained'
            size='small'
            onClick={() => { this.modalShowHandler(val.id, val) }}
          >
            <EditIcon />
          </Fab>}</TableCell>
          <TableCell></TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.viewBanksList && this.props.viewBanksList.length}
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
        {/* {deleteModal} */}
        {addModal}
        {modal}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.finance.common.branchPerSession,
  viewBanksList: state.finance.viewBanks.viewBanksList,
  dataLoading: state.finance.common.dataLoader
  // session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchViewBanks: (session, branchId, alert, user) => dispatch(actionTypes.fetchViewBanks({ session, branchId, alert, user })),
  deletedBank: (row, alert, user) => dispatch(actionTypes.deleteBank({ row, alert, user }))
  // loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(ViewBanks)))
