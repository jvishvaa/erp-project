import React, { Component } from 'react'
import { Grid, Button, Fab, TableHead,
  TableBody,
  TableCell,
  TableRow, 
  TablePagination, Table, } from '@material-ui/core/'
import {
  // Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'

import Select from 'react-select'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import classes from './deleteModal.module.css'

import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import Modal from '../../../ui/Modal/modal'
import ReceiptSettingsEdit from './RecieptSettingEdit'
import ReceiptSettingAdd from './ReceiptSettingAdd'
import Layout from '../../../../../Layout'

class ReceiptSettings extends Component {
  state = {
    sessionData: '',
    branchData: '',
    showModal: false,
    id: null,
    prefix: '',
    subHeader: '',
    header: '',
    footer: '',
    subFooter: '',
    showAddModal: false,
    isActive: false,
    deleteId: null,
    showDeleteModal: false,
    page: 0,
    rowsPerPage: 10
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
  showModalHandler = (id, header, prefix, footer, subFooter, subHeader, isActive) => {
    this.setState({
      showModal: true,
      id: id,
      prefix: prefix || '',
      footer: footer || '',
      subFooter: subFooter || '',
      subHeader: subHeader || '',
      header: header || '',
      isActive: isActive || false
    })
  }

  modalInputChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false,
      showAddModal: false,
      showDeleteModal: false
    })
  }

  AddModalClickHandler = () => {
    this.setState({
      showAddModal: true
    })
  }

  academicYearHandler = (e) => {
    this.setState({ sessionData: e }, () => {
      this.props.fetchBranches(this.state.sessionData.value, this.props.alert, this.props.user)
    })
  }
  branchDataHandler = (e) => {
    this.setState({ branchData: e })
  }
  buttonHandler = (e) => {
    if (this.state.sessionData.value && this.state.branchData.value) {
      this.props.fetchListReceipts(this.state.sessionData.value, this.state.branchData.value, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Select All Required fields')
    }
  }
  checkChangeHandler = event => {
    this.setState({
      isActive: event.target.checked
    })
  }
  clearaddProps = e => {
    this.setState({
      footer: '',
      subFooter: '',
      header: '',
      subHeader: '',
      prefix: '',
      isAcive: false
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
  deleteHandler = (id) => {
    this.props.deleteReceiptSettingList(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }
  returnEditHandler = () => {
    this.setState({
      showModal: false
    })
  }
  renderTable = () => {
    let dataToShow = []
    dataToShow = this.props.receiptlists.map((val, i) => {
      // console.log('from map function', val)
      return {
        Sr: i + 1,
        prefix: val.prefix ? val.prefix : '',
        footer: val.receipt_footer ? val.receipt_footer : '',
        subFooter: val.receipt_sub_footer ? val.receipt_sub_footer : '',
        subHeader: val.receipt_sub_header ? val.receipt_sub_header : '',
        payslipheader: val.payslip_header ? val.payslip_header : '',
        isActive: val.is_active ? 'Active' : 'Inactive',
        Edit: (
          <div style={{ cursor: 'pointer', textAlign: 'center', marginTop: '-9px' }}>
            <Fab
              color='primary'
              size='small'
              onClick={() => this.showModalHandler(val.id, val.payslip_header, val.prefix, val.receipt_footer, val.receipt_sub_footer, val.receipt_sub_header, val.is_active)}
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
            style={{ cursor: 'pointer', marginTop: '-9px' }}
          >
            <DeleteIcon />
          </Fab>
        )
      }
    })
    return dataToShow
  }
  render () {
    // let receiptSettingsTable = null
    // if (this.props.receiptlists && this.props.receiptlists) {
    //   receiptSettingsTable = (
    //     <ReactTable
    //     // pages={Math.ceil(this.props.viewBanksList.count / 20)}
    //       data={this.renderTable()}
    //       manual
    //       columns={[
    //         {
    //           Header: 'Sr',
    //           accessor: 'Sr',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Prefix',
    //           accessor: 'prefix',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: ' Header',
    //           accessor: 'payslipheader',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Sub Header',
    //           accessor: 'subHeader',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Footer',
    //           accessor: 'footer',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Sub Footer',
    //           accessor: 'subFooter',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Is Active',
    //           accessor: 'isActive',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Edit',
    //           accessor: 'Edit',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Delete',
    //           accessor: 'Delete',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         }
    //       ]}
    //       filterable
    //       sortable
    //       defaultPageSize={this.renderTable().length + 1}
    //       showPageSizeOptions={false}
    //       className='-striped -highlight'
    //       // Controlled props
    //       // page={this.state.page}
    //       // Callbacks
    //       // onPageChange={page => this.pageChangeHandler(page)}
    //     />
    //   )
    // }
    let modal = null
    if (this.state.showModal) {
      const {
        id,
        header,
        subHeader,
        footer,
        subFooter,
        prefix,
        sessionData,
        branchData,
        isActive
      } = this.state
      modal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler}>
          <ReceiptSettingsEdit
            id={id}
            acadId={sessionData.value}
            branchId={branchData.value}
            footer={footer}
            header={header}
            subFooter={subFooter}
            subHeader={subHeader}
            prefix={prefix}
            isActive={isActive}
            alert={this.props.alert}
            user={this.props.user}
            close={this.hideModalHandler}
            changeHandler={this.modalInputChangeHandler}
            checkHandler={this.checkChangeHandler}
            returnHandler={this.returnEditHandler}
          />
        </Modal>
      )
    }
    let addModal = null
    if (this.state.showAddModal) {
      const {
        id,
        header,
        subHeader,
        footer,
        subFooter,
        prefix,
        sessionData,
        branchData
      } = this.state
      addModal = (
        <Modal open={this.state.showAddModal} click={this.hideModalHandler}>
          <ReceiptSettingAdd
            id={id}
            acadId={sessionData.value}
            branchId={branchData.value}
            footer={footer}
            subFooter={subFooter}
            header={header}
            subHeader={subHeader}
            prefix={prefix}
            alert={this.props.alert}
            user={this.props.user}
            close={this.hideModalHandler}
            changeHandler={this.modalInputChangeHandler}
            clearProps={this.clearaddProps}
          />
        </Modal>
      )
    }
    let delModal = null
    if (this.state.showDeleteModal) {
      delModal = (
        <Modal open={this.state.showDeleteModal} click={this.hideModalHandler} small>
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
              onClick={this.deleteModalCloseHandler}
              variant='contained'
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }
    return (
      <Layout >
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='8' />
          { this.state.sessionData && this.state.branchData
            ? <Grid item xs='4'>
              {/* <div style={{ cursor: 'pointer' }}>
                <Fab
                  color='primary'
                  size='small'
                  onClick={this.AddModalClickHandler}
                >
                  <AddIcon />
                </Fab>
              </div> */}
              <Button
                onClick={this.AddModalClickHandler}
                color='primary'
                variant='contained'
              >
              ADD Receipt Settings
              </Button>
            </Grid>
            : null
          }
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session && this.props.session.session_year.length > 0
                  ? this.props.session.session_year.map((session) => ({ value: session, label: session }))
                  : []}
              onChange={this.academicYearHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              options={
                this.props.branchPerSession && this.props.branchPerSession.length > 0
                  ? this.props.branchPerSession.map((branch) => ({
                    value: branch.branch.id ? branch.branch.id : '',
                    label: branch.branch.branch_name ? branch.branch.branch_name : ''
                  }))
                  : []}
              value={this.state.branchData ? this.state.branchData : null}
              onChange={this.branchDataHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              onClick={this.buttonHandler}
              color='primary'
              style={{ marginTop: '20px' }}
              variant='contained'
            >
                    Get
            </Button>
          </Grid>
          {this.props.receiptlists && this.props.receiptlists.length > 0
            ? <React.Fragment>
              {this.props.receiptlists && this.props.receiptlists.length > 0 ?
              <Grid item xs='12'>
                {/* {receiptSettingsTable} */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell>Prefix</TableCell>
                      <TableCell> Header</TableCell>
                      <TableCell> Sub Header</TableCell>
                      <TableCell> Footer</TableCell>
                      <TableCell>Sub Footer</TableCell>
                      <TableCell>Is Active</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.receiptlists && this.props.receiptlists.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                     <TableCell>{val.prefix ? val.prefix : ''}</TableCell>
                      <TableCell>{ val.payslip_header ? val.payslip_header : ''}</TableCell>
                      <TableCell> {val.receipt_sub_header ? val.receipt_sub_header : ''}</TableCell>
                      <TableCell> {val.receipt_footer ? val.receipt_footer : ''}</TableCell>
                      <TableCell>{val.receipt_sub_footer ? val.receipt_sub_footer : ''}</TableCell>
                      <TableCell>{val.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell> <div style={{ cursor: 'pointer', textAlign: 'center', marginTop: '-9px' }}>
            <Fab
              color='primary'
              size='small'
              onClick={() => this.showModalHandler(val.id, val.payslip_header, val.prefix, val.receipt_footer, val.receipt_sub_footer, val.receipt_sub_header, val.is_active)}
            >
              <EditIcon />
            </Fab>
          </div></TableCell>
          <TableCell>
          <Fab
            color='primary'
            size='small'
            onClick={() => this.deleteModalShowHandler(val.id)}
            style={{ cursor: 'pointer', marginTop: '-9px' }}
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
                count={this.props.receiptlists && this.props.receiptlists.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              </Grid>
              : [] }
            </React.Fragment> : null}
          {addModal}
          {modal}
          {delModal}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </Grid>
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branchPerSession: state.finance.common.branchPerSession,
  receiptlists: state.finance.receiptSettings.receiptSettingsList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchListReceipts: (session, branch, alert, user) => dispatch(actionTypes.fetchReceiptSettingsList({ session, branch, alert, user })),
  deleteReceiptSettingList: (id, alert, user) => dispatch(actionTypes.deleteReceiptSettingList({ id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptSettings)
