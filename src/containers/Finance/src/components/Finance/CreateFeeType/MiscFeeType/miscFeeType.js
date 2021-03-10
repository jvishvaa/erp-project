import React, { Component } from 'react'
// import { Divider } from 'semantic-ui-react'
import { Button, Fab, Grid } from '@material-ui/core/'
import { Table, TableRow, TableCell, TableBody, TableHead,
} from '@material-ui/core/'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import { OmsFilterTable } from '../../../../ui'
import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import '../../../css/staff.css'
import classes from './deleteModal.module.css'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import EditMiscFee from './editMiscFee'
import AddMiscFee from './addMiscFee'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Modal from '../../../../ui/Modal/modal'
import Layout from '../../../../../../Layout'
import TablePagination from '@material-ui/core/TablePagination'

let feeTypeState = null
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
class MiscFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showModal: false,
      showAddFeeModal: false,
      showDeleteModal: false,
      id: null,
      data: [],
      feeDetails: [],
      sessionData: null,
      branchData: [],
      showAddButton: false,
      start_date: '',
      end_date: '',
      store: false,
      feeAcc: '',
      page: 0,
      rowsPerPage: 10,
      moduleId: null,
    }
    this.handleClickFeeData.bind(this)
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
  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

 
  showModalHandler = (id, sDate, eDate, s, feeAcc) => {
    this.setState({
      showModal: true,
      id: id,
      start_date: sDate,
      end_date: eDate,
      store: s,
      feeAcc: feeAcc
    })
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false,
      showAddFeeModal: false
    })
  }

  showAddFeeModal = () => {
    this.setState({
      showAddFeeModal: true
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

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [], sessionData: e }, () => {
      console.log(this.state.sessionData)
    })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, this.state.moduleId)
  }

  handleClickFeeData = (e) => {
    if (!this.state.session) {
      this.props.alert.warning('Select Academic Year')
      return
    } else if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
      return
    }
    // this.renderTable()
    this.props.fetchMiscFeeList(this.state.session, this.state.branchId, this.props.alert, this.props.user)
    if (this.state.session && this.state.branchId) {
      this.setState({ showTable: true, showAddButton: true }, () => { feeTypeState = this.state })
    }
  }

  deleteHandler = () => {
    console.log(this.state.deleteId)
    this.props.deleteMiscFee(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  componentDidMount () {
    if (feeTypeState) {
      this.setState(feeTypeState)
    }
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Fee Type' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Misc. Fee Type') {
              // setModuleId(item.child_id);
              // setModulePermision(true);
              this.setState({
                moduleId: item.child_id
              })
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
  }

  // renderTable = () => {
  //   let dataToShow = []
  //   dataToShow = this.props.miscFeeList.map((val, i) => {
  //     return {
  //       Sr: i + 1,
  //       id: val.id ? val.id : '',
  //       fee_type_name: val.fee_type_name ? val.fee_type_name : '',
  //       is_multiple_records_allow: val.is_multiple_records_allow ? 'Yes' : 'No',
  //       individual_student_wise: val.individual_student_wise ? 'Yes' : 'No',
  //       allow_partial_payments: val.allow_partial_payments ? 'Yes' : 'No',
  //       can_be_group: val.can_be_group ? 'Yes' : 'No',
  //       is_allow_remarks: val.is_allow_remarks ? 'Yes' : 'No',
  //       allow_excess_amount: val.allow_excess_amount ? 'Yes' : 'No',
  //       is_last_year_due: val.is_last_year_due ? 'Yes' : 'No',
  //       is_advance_fee: val.is_advance_fee ? 'Yes' : 'No',
  //       is_parent_enable: val.is_parent_enable ? 'Yes' : 'No',
  //       set_due_date: val.set_due_date ? val.set_due_date : '',
  //       Edit: (
  //         <Fab size='small' color='primary' variant='contained' onClick={() => this.showModalHandler(val.id, val.start_date, val.end_date, val.is_store_related, val.fee_account && val.fee_account)}>
  //           <EditIcon />
  //         </Fab>
  //       ),
  //       Delete: (
  //         <Fab size='small' color='primary' variant='contained' onClick={() => this.deleteModalShowHandler(val.id)}>
  //           <DeleteIcon />
  //         </Fab>
  //       )
  //     }
  //   })
  //   return dataToShow
  // }

  render () {
    // let viewFeeTable = null
    // if (this.props.miscFeeList.length > 0) {
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
    //         Header: 'Multiple Records Allow',
    //         accessor: 'is_multiple_records_allow',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Individual Student Wise',
    //         accessor: 'individual_student_wise',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Partial Payments',
    //         accessor: 'allow_partial_payments',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Can Be Group',
    //         accessor: 'can_be_group',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Remarks',
    //         accessor: 'is_allow_remarks',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Excess Amount',
    //         accessor: 'allow_excess_amount',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Last Year Due',
    //         accessor: 'is_last_year_due',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Advance Fee',
    //         accessor: 'is_advance_fee',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Parent Enable',
    //         accessor: 'is_parent_enable',
    //         inputFilterable: true,
    //         exactFilterable: true,
    //         sortable: true
    //       },
    //       {
    //         Header: 'Due Date',
    //         accessor: 'set_due_date',
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
    //           paddingTop: '10px'
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
          <EditMiscFee id={this.state.id} alert={this.props.alert} sessions={this.state.sessionData}
            branch={this.state.branchData} branchIdss={this.state.branchId} feeAccs={this.state.feeAcc} start_date={this.state.start_date} end_dates={this.state.end_date} store={this.state.store} close={this.hideModalHandler} />
        </Modal>
      )
    }
    let addFeeModal = null
    if (this.state.showAddFeeModal) {
      addFeeModal = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler}>
          <AddMiscFee
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
              <Grid item xs='2'>
                <Button color='primary' variant='contained' onClick={this.showAddFeeModal}> Add Fee </Button>
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
                this.props.branches
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
              style={{ marginTop: 20 }}
              onClick={this.handleClickFeeData}
            >
                    Get
            </Button>
          </Grid>
          {this.state.showTable ? <React.Fragment>
            <Grid item xs='12'>
              {/* <OmsFilterTable
                    filterTableData={NormalFee}
                    tableData={feeList}
                    tableFields={this.state.field}
                  /> */}
              {/* {viewFeeTable} */}
              <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Fee Type Name</TableCell>
                      <TableCell> Multiple Records Allow</TableCell>
                      <TableCell> Individual Student Wise</TableCell>
                      <TableCell> Partial Payments</TableCell>
                      <TableCell> Can Be Group</TableCell>
                      <TableCell> Remarks</TableCell>
                      <TableCell> Excess Amount</TableCell>
                      <TableCell> Last Year Due</TableCell>
                      <TableCell>Advance Fee</TableCell>
                      <TableCell>Parent Enable</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.miscFeeList && this.props.miscFeeList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      <TableCell>{ val.is_multiple_records_allow ? 'Yes' : 'No'} </TableCell>
                      <TableCell>{val.individual_student_wise ? 'Yes' : 'No'} </TableCell>
                      <TableCell> { val.allow_partial_payments ? 'Yes' : 'No'} </TableCell>
                      <TableCell> {val.can_be_group ? 'Yes' : 'No'} </TableCell>
                      <TableCell>{val.is_allow_remarks ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.allow_excess_amount ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.is_last_year_due ? 'Yes' : 'No'}</TableCell>
                      <TableCell> {val.is_advance_fee ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{val.is_parent_enable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{val.set_due_date ? val.set_due_date : ''}</TableCell>
                      <TableCell>
          <Fab size='small' color='primary' variant='contained' onClick={() => this.showModalHandler(val.id, val.start_date, val.end_date, val.is_store_related, val.fee_account && val.fee_account)}>
            <EditIcon />
          </Fab>
        </TableCell>
                      <TableCell>
          <Fab size='small' color='primary' variant='contained' onClick={() => this.deleteModalShowHandler(val.id)}>
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
                count={this.props.miscFeeList && this.props.miscFeeList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
          </React.Fragment> : null}

        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
        {modal}
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
  miscFeeList: state.finance.miscFee.miscFeeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchMiscFeeList: (session, branch, alert, user) => dispatch(actionTypes.fetchListMiscFee({ session, branch, alert, user })),
  deleteMiscFee: (id, alert, user) => dispatch(actionTypes.deleteMiscFeeList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(MiscFeeType)))
