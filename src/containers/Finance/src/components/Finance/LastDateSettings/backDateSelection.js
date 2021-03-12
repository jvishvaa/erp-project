import React, { Component } from 'react'
import { withStyles, Button, Grid, Table, TableCell, TableRow, TableHead, TableBody, TablePagination } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
// import Select from 'react-select'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
// import ReactTable from 'react-table'
import Edit from '@material-ui/icons/Edit'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions/index'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import Modal from '../../../ui/Modal/modal'
import classes from './lastDate.module.css'
// import BackDateSelection from './backDateSelection'
// import ConcessionLastDate from './concessionLastDate'
// import { urls } from '../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  }
})

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
        if (item.child_name === 'Last Date Settings') {
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

class BackDateSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSession: null,
      showActionModal: false,
      backDateEditId: null,
      paymentBackDate: null,
      pettyBackDate: null,
      page: 0,
      rowsPerPage: 10

    }
  }

  componentDidMount () {
    if (this.props.session) {
      this.props.fetchBackDate(this.props.session, this.props.alert, this.props.user)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.session !== prevProps.session) {
      // I will make a fetch request
      this.props.fetchBackDate(this.props.session, this.props.alert, this.props.user)
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

  showActionModalHandler = (id) => {
    this.setState({ showActionModal: true, backDateEditId: id })
  }

  hideActionModalHandler = () => {
    this.setState({ showActionModal: false })
  }

  paylastDateHandler = (e) => {
    this.setState({ paymentBackDate: e.target.value })
  }

  pettylastDateHandler = (e) => {
    this.setState({ pettyBackDate: e.target.value })
  }

  renderBackDateTable = () => {
    let dataToShow = []
    dataToShow = this.props.backDateList.map((val, i) => {
      return {
        id: val.id,
        sl: i + 1,
        branchName: val.branch.branch_name ? val.branch.branch_name : '',
        payments_back_date: val.payments_back_date ? val.payments_back_date : 'Not set',
        petty_cash_back_date: val.petty_cash_back_date ? val.petty_cash_back_date : 'Not set',
        action: <Edit style={{ cursor: 'pointer' }} onClick={() => { this.showActionModalHandler(val.id) }} />
      }
    })
    return dataToShow
  }

  saveBackDate = () => {
    if (this.state.backDateEditId) {
      let data = {
        id: this.state.backDateEditId,
        payments_back_date: this.state.paymentBackDate,
        petty_cash_back_date: this.state.pettyBackDate
      }
      this.props.saveBackDate(data, this.state.backDateEditId, this.props.alert, this.props.user)
    }
    this.hideActionModalHandler()
  }

  render () {
    // let { classes } = this.props
    // console.log('back Date', this.props.backDateList)
    // let backDateTable = null
    // if (this.props.backDateList) {
    //   backDateTable = (
    //     <ReactTable
    //     // pages={Math.ceil(this.props.viewBanksList.count / 20)}
    //       data={this.renderBackDateTable()}
    //       manual
    //       columns={[
    //         {
    //           Header: 'Sl no.',
    //           accessor: 'sl',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //           // style: {
    //           //   maxWidth: '20px'
    //           // }
    //         },
    //         {
    //           Header: 'Branch Name',
    //           accessor: 'branchName',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Payments Back Date',
    //           accessor: 'payments_back_date',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Petty Cash Back Date',
    //           accessor: 'petty_cash_back_date',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         },
    //         {
    //           Header: 'Actions',
    //           accessor: 'action',
    //           inputFilterable: true,
    //           exactFilterable: true,
    //           sortable: true
    //         }
    //       ]}
    //       filterable
    //       sortable
    //       defaultPageSize={10}
    //       showPageSizeOptions={false}
    //       className='-striped -highlight'
    //       // Controlled props
    //       // page={this.state.page}
    //       // Callbacks
    //       // onPageChange={page => this.pageChangeHandler(page)}
    //     />
    //   )
    // }

    let actionModal = null
    if (this.state.showActionModal) {
      actionModal = (
        <Modal open={this.state.showActionModal} click={this.hideActionModalHandler} medium>
          <h3 className={classes.modal__heading}>Enter Back Date</h3>
          <hr />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='6'>
              <label>Payment Back Date</label>
              <input
                name='backDate'
                type='number'
                className='form-control'
                style={{ width: '200px', marginRight: '10px' }}
                onChange={(e) => { this.paylastDateHandler(e) }} />
            </Grid>
            <Grid item xs='6'>
              <label style={{ marginLeft: '20px' }}>Petty Cash Back Date</label>
              <input
                name='pettybackDate'
                type='number'
                className='form-control'
                style={{ width: '200px', marginLeft: '20px' }}
                onChange={(e) => { this.pettylastDateHandler(e) }} />
            </Grid>
          </Grid>
          <div className={classes.modal__deletebutton}>
            <Button
              onClick={this.saveBackDate}
              color='primary'
              variant='contained'
            >
              Save
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.hideActionModalHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }

    return (
      <React.Fragment>
        <React.Fragment>
        <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Sl No</TableCell>
                      <TableCell> Branch Name</TableCell>
                      <TableCell> Payments Back Date</TableCell>
                      <TableCell> Petty Cash Back Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.backDateList && this.props.backDateList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> { i + 1 }</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{ val.branch.branch_name ? val.branch.branch_name : ''}</TableCell>
                      <TableCell> {val.payments_back_date ? val.payments_back_date : 'Not set'}</TableCell>
                      <TableCell> {val.petty_cash_back_date ? val.petty_cash_back_date : 'Not set'}</TableCell>
                      <TableCell><Edit style={{ cursor: 'pointer' }} onClick={() => { this.showActionModalHandler(val.id) }} /></TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.props.backDateList && this.props.backDateList.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
        </React.Fragment>
        {actionModal}
        {/* {backDateTable} */}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  backDateList: state.finance.lastDateSettings.backDateList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBackDate: (session, alert, user) => dispatch(actionTypes.fetchBackDate({ session, alert, user })),
  saveBackDate: (data, id, alert, user) => dispatch(actionTypes.saveBackDate({ data, id, alert, user }))

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(BackDateSelection)))
