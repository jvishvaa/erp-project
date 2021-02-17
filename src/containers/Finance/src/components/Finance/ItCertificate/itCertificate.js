import React, { Component } from 'react'
import { Button, withStyles, Grid ,TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
  TablePagination} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
// import ReactTable from 'react-table'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions/index'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import Modal from '../../../ui/Modal/modal'
import classes from './itCertificate.module.css'
import Layout from '../../../../../Layout'

// import { urls } from '../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  }
})

class ItCertificate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      sessionData: null,
      branchData: null,
      branchId: null,
      showAddFeeTypeModal: false,
      addFeeTypeList: null,
      showDeleteFeeTypeModal: null,
      itcID: null,
      page: 0,
      rowsPerPage: 10
    }
  }

  componentDidMount () {

  }

  componentDidUpdate () {
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage:+event.target.value
    })
    this.setState({
      page: 0
    })
  }

  dateChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAcademicyear = (e) => {
    console.log('acad years', this.props.session)
    this.setState({ session: e.value, branchData: [], sessionData: e }, () => {
      this.props.fetchBranches(this.state.session, this.props.alert, this.props.user)
    })
  }

  branchHandler = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  itcHandler = () => {
    this.props.fetchItcList(this.state.session, this.state.branchId, this.props.alert, this.props.user)
  }

  renderFeeTypeTable = () => {
    let dataToShow = []
    dataToShow = this.props.itcList.map((val, i) => {
      return {
        id: val.id,
        sl: i + 1,
        feeType: val.fee_type_name ? val.fee_type_name : '',
        delete: <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => this.showDeleteFeeTypeHandler(val.id)} />
      }
    })
    return dataToShow
  }

  addModalHideHandler = () => {
    this.setState({ showAddFeeTypeModal: false })
  }

  addModalShowHandler = () => {
    this.props.fetchAllFeeType(this.state.session, this.state.branchId, this.props.alert, this.props.user)
    this.setState({ showAddFeeTypeModal: true })
  }

  addFeeTypeHandler = (e) => {
    this.setState({ addFeeTypeList: e })
  }

  deleteModalHandler = () => {
    this.setState({ showDeleteFeeTypeModal: false })
  }

  deleteFeeTypeHandler = () => {
    console.log(this.state.itcID)
    this.props.deleteITCLIst(this.state.session, this.state.branchId, this.state.itcID, this.props.alert, this.props.user)
    this.deleteModalHandler()
  }

  showDeleteFeeTypeHandler = (id) => {
    this.setState({
      showDeleteFeeTypeModal: true,
      itcID: id
    })
  }

  saveFeeType = () => {
    if (this.state.addFeeTypeList) {
      let feeTypeArr = this.state.addFeeTypeList.map(fee => (
        fee.value
      ))

      let data = {
        academic_year: this.state.session,
        branch: this.state.branchId,
        fee_type: feeTypeArr
      }
      this.props.saveFeeType(data, this.props.alert, this.props.user)
      this.addModalHideHandler()
    } else {
      this.props.alert.warning('Select Fee Type')
    }
  }

  render () {
    // let { classes } = this.props
    console.log('the fee typelist', this.props.feeTypeList)
    let feeTypeListTable = null
    let addFeeTypeModal = null
    let deleteFeeTypeModal = null
    let addButton = null
    if (this.props.itcList) {
      // feeTypeListTable = (<ReactTable
      //   // pages={Math.ceil(this.props.viewBanksList.count / 20)}
      //   data={this.renderFeeTypeTable()}
      //   manual
      //   columns={[
      //     {
      //       Header: 'Sl no.',
      //       accessor: 'sl',
      //       inputFilterable: true,
      //       exactFilterable: true,
      //       sortable: true
      //       // style: {
      //       //   maxWidth: '20px'
      //       // }
      //     },
      //     {
      //       Header: 'Fee Type',
      //       accessor: 'feeType',
      //       inputFilterable: true,
      //       exactFilterable: true,
      //       sortable: true
      //     },
      //     {
      //       Header: 'Delete',
      //       accessor: 'delete',
      //       inputFilterable: true,
      //       exactFilterable: true,
      //       sortable: true
      //     }
      //   ]}
      //   filterable
      //   sortable
      //   defaultPageSize={10}
      //   showPageSizeOptions={false}
      //   className='-striped -highlight'
      //   // Controlled props
      //   // page={this.state.page}
      //   // Callbacks
      //   // onPageChange={page => this.pageChangeHandler(page)}
      // />)
    }

    if (this.state.showAddFeeTypeModal) {
      addFeeTypeModal = (
        <Modal open={this.state.showAddFeeTypeModal} click={this.addModalHideHandler} medium>
          <h3 className={classes.modal__heading}>Add Fee Type</h3>
          <hr />
          <Select
            placeholder='Select Fee type'
            isMulti
            // value={this.state.sessionData ? this.state.sessionData : null}
            options={
              this.props.feeTypeList
                ? this.props.feeTypeList.map(fee => ({
                  value: fee.id,
                  label: fee.fee_type_name
                }))
                : []
            }
            onChange={this.addFeeTypeHandler}
          />
          <div className={classes.modal__deletebutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.saveFeeType}
            >
              Save
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.addModalHideHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    if (this.state.showDeleteFeeTypeModal) {
      deleteFeeTypeModal = (
        <Modal open={this.state.showDeleteFeeTypeModal} click={this.deleteModalHandler} small>
          <h3 className={classes.modal__heading}>Delete Fee Type</h3>
          <hr />
          <div className={classes.modal__deletebutton}>
            <Button
              color='secondary'
              variant='contained'
              onClick={this.deleteFeeTypeHandler}
            >
              Delete
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.deleteModalHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }

    if (this.props.showAddButton) {
      addButton = (
        <Button
          variant='contained'
          color='primary'
          style={{ marginTop: '25px' }}
          // disabled={!this.state.session || !this.state.branchId || !this.state.gradeId || !this.state.fromDate || !this.state.toDate}
          onClick={this.addModalShowHandler}
        >
        Add Fee Type
        </Button>
      )
    }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='8'
              className='student-section-inputField'>
            </Grid>
            <Grid item xs='4'
              className='student-section-inputField'>
              {addButton}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'
              className='student-section-inputField'
            >
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                value={this.state.sessionData ? this.state.sessionData : null}
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            <Grid item xs='3' >
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                value={this.state.branchData}
                options={
                  this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.branch.id,
                      label: branch.branch.branch_name
                    }))
                    : []
                }
                onChange={this.branchHandler}
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                // disabled={!this.state.session || !this.state.branchId || !this.state.gradeId || !this.state.fromDate || !this.state.toDate}
                onClick={this.itcHandler}
              >
                GET
              </Button>
            </Grid>
          </Grid>
        {deleteFeeTypeModal}
        {/* {feeTypeListTable} */}
        {
          <React.Fragment>
            { this.props.itcList && this.props.itcList.length > 0 ?
            <React.Fragment>
            <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sr</TableCell>
                      <TableCell> Fee type</TableCell>
                      <TableCell> Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.itcList && this.props.itcList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell> { val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                      <TableCell> <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => this.showDeleteFeeTypeHandler(val.id)} /> </TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.itcList && this.props.itcList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
              </React.Fragment>
              :[] }
            </React.Fragment>
        }
        {addFeeTypeModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  feeTypeList: state.finance.itc.feeTypeList,
  itcList: state.finance.itc.itcList,
  showAddButton: state.finance.itc.showAddButton,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchAllFeeType: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeType({ session, branchId, alert, user })),
  fetchItcList: (session, branchId, alert, user) => dispatch(actionTypes.fetchItcList({ session, branchId, alert, user })),
  saveFeeType: (data, alert, user) => dispatch(actionTypes.saveFeeType({ data, alert, user })),
  deleteITCLIst: (session, branch, id, alert, user) => dispatch(actionTypes.deleteITCList({ session, branch, id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ItCertificate)))
