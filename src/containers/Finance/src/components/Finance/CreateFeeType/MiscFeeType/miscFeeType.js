import React, { Component } from 'react'
// import { Divider } from 'semantic-ui-react'
import { Button, Fab, Grid } from '@material-ui/core/'
import { Table, TableRow, TableCell, TableBody, TableHead
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

let feeTypeState = null

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
      showAddButton: false
    }
    this.handleClickFeeData.bind(this)
    // this.deleteHandler = this.deleteHandler.bind(this)
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  showModalHandler = (id) => {
    this.setState({
      showModal: true,
      id: id
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
    this.props.fetchBranches(e.value, this.props.alert, this.props.user)
  }

  handleClickFeeData = (e) => {
    if (!this.state.session) {
      this.props.alert.warning('Select Academic Year')
      return
    } else if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
      return
    }
    this.renderTable()
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
  }

  renderTable = () => {
    let dataToShow = []
    dataToShow = this.props.miscFeeList.map((val, i) => {
      return {
        Sr: i + 1,
        id: val.id ? val.id : '',
        fee_type_name: val.fee_type_name ? val.fee_type_name : '',
        is_multiple_records_allow: val.is_multiple_records_allow ? 'Yes' : 'No',
        individual_student_wise: val.individual_student_wise ? 'Yes' : 'No',
        allow_partial_payments: val.allow_partial_payments ? 'Yes' : 'No',
        can_be_group: val.can_be_group ? 'Yes' : 'No',
        is_allow_remarks: val.is_allow_remarks ? 'Yes' : 'No',
        allow_excess_amount: val.allow_excess_amount ? 'Yes' : 'No',
        is_last_year_due: val.is_last_year_due ? 'Yes' : 'No',
        is_advance_fee: val.is_advance_fee ? 'Yes' : 'No',
        is_parent_enable: val.is_parent_enable ? 'Yes' : 'No',
        set_due_date: val.set_due_date ? val.set_due_date : '',
        Edit: (
          <Fab size='small' color='primary' variant='contained' onClick={() => this.showModalHandler(val.id)}>
            <EditIcon />
          </Fab>
        ),
        Delete: (
          <Fab size='small' color='primary' variant='contained' onClick={() => this.deleteModalShowHandler(val.id)}>
            <DeleteIcon />
          </Fab>
        )
      }
    })
    return dataToShow
  }

  render () {
    let viewFeeTable = null
    if (this.props.miscFeeList.length > 0) {
      viewFeeTable = (<ReactTable
        // pages={Math.ceil(this.props.viewBanksList.count / 20)}
        data={this.renderTable()}
        manual
        columns={[
          {
            Header: 'Sr',
            accessor: 'Sr',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Fee Type Name',
            accessor: 'fee_type_name',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Multiple Records Allow',
            accessor: 'is_multiple_records_allow',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Individual Student Wise',
            accessor: 'individual_student_wise',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Partial Payments',
            accessor: 'allow_partial_payments',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Can Be Group',
            accessor: 'can_be_group',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Remarks',
            accessor: 'is_allow_remarks',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Excess Amount',
            accessor: 'allow_excess_amount',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Last Year Due',
            accessor: 'is_last_year_due',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Advance Fee',
            accessor: 'is_advance_fee',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Parent Enable',
            accessor: 'is_parent_enable',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Due Date',
            accessor: 'set_due_date',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            Header: 'Edit',
            accessor: 'Edit',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
            style: {
              paddingTop: '10px'
            }
          },
          {
            Header: 'Delete',
            accessor: 'Delete',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
            style: {
              paddingTop: '5px',
              paddingLeft: '29px'
            }
          }
        ]}
        filterable
        sortable
        defaultPageSize={10}
        showPageSizeOptions={false}
        className='-striped -highlight'
        // Controlled props
        // page={this.state.page}
        // Callbacks
        // onPageChange={page => this.pageChangeHandler(page)}
      />)
    }

    let modal = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler}>
          <EditMiscFee id={this.state.id} alert={this.props.alert} close={this.hideModalHandler} />
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
                  {this.props.miscFeeList && this.props.miscFeeList.map((val, i) => { 
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
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchMiscFeeList: (session, branch, alert, user) => dispatch(actionTypes.fetchListMiscFee({ session, branch, alert, user })),
  deleteMiscFee: (id, alert, user) => dispatch(actionTypes.deleteMiscFeeList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(MiscFeeType)))
