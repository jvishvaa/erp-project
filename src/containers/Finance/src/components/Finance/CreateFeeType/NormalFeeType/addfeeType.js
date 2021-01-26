import React, { Component } from 'react'
// import Select from 'react-select'
import { Checkbox, FormControlLabel, Button, Grid, Divider } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
// import '../../../css/staff.css'

class AddFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      is_concession_applicable: false,
      is_service_based: false,
      is_pro_rata: false,
      is_allow_partial_amount: false,
      is_activity_based_fee: false,
      is_refundable_fee: false,
      show_transaction_in_parent_login: false,
      alertMessage: '',
      branchData: [],
      branchIds: [],
      fee_type_name: ''
    }
    this.handlevalue = this.handlevalue.bind(this)
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  componentDidMount () {
    this.props.fetchBranches(this.props.acadId, this.props.alert, this.props.user)
  }

  changehandlerbranch = (e) => {
    let branchIds = []
    e.forEach(function (branch) {
      branchIds.push(branch.value)
    })
    this.setState({ branchIds: branchIds, branchData: e })
  }

  feeTypeChangeHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  priorityChangeHandler = e => {
    this.setState({ priority: e.target.value })
  }

  handlevalue = () => {
    if (this.state.branchIds.length > 0 && this.state.fee_type_name) {
      var data = {
        academic_year: this.props.acadId,
        branch: this.state.branchIds,
        fee_type_name: this.state.fee_type_name,
        priority: this.state.priority,
        is_concession_applicable: this.state.is_concession_applicable,
        is_service_based: this.state.is_service_based,
        is_pro_rata: this.state.is_pro_rata,
        is_allow_partial_amount: this.state.is_allow_partial_amount,
        is_activity_based_fee: this.state.is_activity_based_fee,
        is_refundable_fee: this.state.is_refundable_fee,
        show_transaction_in_parent_login: this.state.show_transaction_in_parent_login
      }
      this.props.addedNormalFeeList(data, this.props.alert, this.props.user)
      this.props.close()
    } else {
      this.props.alert.warning('Select Required Fields')
    }
  }

  render () {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 10 }}>
          <Grid item xs={12}>
            <label className='student-addStudent-segment1-heading'>
              Create Normal Fee Type
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} style={{ padding: 10, flexGrow: 1 }}>
          <Grid item xs={12}>
            <label>Branch*</label>
            {/* <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              isMulti
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={this.changehandlerbranch}
            /> */}
          </Grid>
          <Grid item xs={6}>
            <label>Fee Type Name</label>
            <input
              name='fee_type_name'
              type='text'
              className='form-control'
              onChange={this.feeTypeChangeHandler}
              placeholder='Fee Type Name'
              value={this.state.fee_type_name}
            />
          </Grid>
          <Grid item xs={6}>
            <label>Priority</label>
            <input
              name='priority'
              type='number'
              min='1'
              className='form-control'
              onChange={this.priorityChangeHandler}
              placeholder='priority'
              value={this.state.priority}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_concession_applicable}
                  onChange={this.changedHandler('is_concession_applicable')}
                  color='primary'
                />
              }
              label='Concession Applicable'
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_service_based}
                  onChange={this.changedHandler('is_service_based')}
                  color='primary'
                />
              }
              label='Service Based'
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_pro_rata}
                  onChange={this.changedHandler('is_pro_rata')}
                  color='primary'
                />
              }
              label='Pro Rata'
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_allow_partial_amount}
                  onChange={this.changedHandler('is_allow_partial_amount')}
                  color='primary'
                />
              }
              label='Partial_Amount'
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_activity_based_fee}
                  onChange={this.changedHandler('is_activity_based_fee')}
                  color='primary'
                />
              }
              label='Activity Based Fee'
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.show_transaction_in_parent_login}
                  onChange={this.changedHandler('show_transaction_in_parent_login')}
                  color='primary'
                />
              }
              label='Transaction In Parent Login'
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.show_transaction_in_parent_login}
                  onChange={this.changedHandler('show_transaction_in_parent_login')}
                  color='primary'
                />
              }
              label='Transaction In Parent Login'
            />
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item xs={4}>
            <div>
              <Button
                color='primary'
                variant='contained'
                onClick={this.handlevalue}
              >
              Create
              </Button>
              <Button
                color='secondary'
                variant='contained'
                style={{ marginLeft: 20 }}
                onClick={this.props.close}
              >
              Return
              </Button>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.finance.common.branchPerSession
})

const mapDispatchToProps = dispatch => ({
  addedNormalFeeList: (data, alert, user) => dispatch(actionTypes.addNormalFeeList({ data, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddFeeType)))
