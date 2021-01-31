import React, { Component } from 'react'
import { withStyles, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
// import Select from 'react-select'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import ReactTable from 'react-table'
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

class ConcessionLastDate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showActionModal: false,
      concessionEditId: null,
      concessionLastDate: null
    }
  }

  componentDidMount () {
    // this.fetchConcessionLastDate(this.props.session, this.props.alert, this.props.user)
    console.log('did mount from concession last date')
    if (this.props.session) {
      this.props.fetchConcessionLastDate(this.props.session, this.props.alert, this.props.user)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.session !== prevProps.session) {
      // I will make a fetch request
      console.log('inside did update', this.props.session)
      this.props.fetchConcessionLastDate(this.props.session, this.props.alert, this.props.user)
    }
  }

  showActionModalHandler = (id) => {
    this.setState({ showActionModal: true, concessionEditId: id })
  }

  hideActionModalHandler = () => {
    this.setState({ showActionModal: false })
  }

  lastDateHandler = (e) => {
    this.setState({ concessionLastDate: e.target.value })
  }

  saveLastDate = () => {
    // action call for edit and save
    if (this.state.concessionLastDate) {
      // action call
      let data = {
        id: this.state.concessionEditId,
        concession_last_date: this.state.concessionLastDate
      }
      this.props.saveConcessionLastDate(data, this.state.concessionEditId, this.props.alert, this.props.user)
    }
    this.hideActionModalHandler()
  }

  renderConcessionTable = () => {
    let dataToShow = []
    dataToShow = this.props.concessionLastDateList.map((val, i) => {
      return {
        id: val.id,
        sl: i + 1,
        branchName: val.branch.branch_name ? val.branch.branch_name : '',
        lastDate: val.concession_last_date ? val.concession_last_date : 'Date not set',
        action: <Edit style={{ cursor: 'pointer' }} onClick={() => { this.showActionModalHandler(val.id) }} />
      }
    })
    return dataToShow
  }

  render () {
    // let { classes } = this.props
    let concessionTable = null
    if (this.props.concessionLastDateList) {
      concessionTable = (
        <ReactTable
        // pages={Math.ceil(this.props.viewBanksList.count / 20)}
          data={this.renderConcessionTable()}
          manual
          columns={[
            {
              Header: 'Sl no.',
              accessor: 'sl',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
              // style: {
              //   maxWidth: '20px'
              // }
            },
            {
              Header: 'Branch Name',
              accessor: 'branchName',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Concession Last Date',
              accessor: 'lastDate',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              Header: 'Actions',
              accessor: 'action',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
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
        />
      )
    }

    let actionModal = null
    if (this.state.showActionModal) {
      actionModal = (
        <Modal open={this.state.showActionModal} click={this.hideActionModalHandler} small>
          <h3 className={classes.modal__heading}>Change Date</h3>
          <hr />
          <div>
            <input
              name='lastDate'
              type='date'
              className='form-control'
              style={{ width: '200px', marginLeft: '10px' }}
              value={this.state.concessionLastDate ? this.state.concessionLastDate : ''}
              onChange={(e) => { this.lastDateHandler(e) }} />
          </div>
          <div className={classes.modal__deletebutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.saveLastDate}
            >
              Save
            </Button>
          </div>
          <div className={classes.modal__remainbutton}>
            <Button
              color='primary'
              variant='outlined'
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
        {concessionTable}
        {actionModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  concessionLastDateList: state.finance.lastDateSettings.concessionLastDateList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchConcessionLastDate: (session, alert, user) => dispatch(actionTypes.fetchConcessionLastDate({ session, alert, user })),
  saveConcessionLastDate: (data, id, alert, user) => dispatch(actionTypes.saveConcessionLastDate({ data, id, alert, user }))

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ConcessionLastDate)))
