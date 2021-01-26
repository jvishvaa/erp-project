/* eslint-disable camelcase */
import React, { Component } from 'react'
// import {  } from 'semantic-ui-react'
import { Button, Grid, Divider } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import '../../../css/staff.css'

class EditFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.state = {
      fee_type_name: '',
      priority: 0,
      is_concession_applicable: false,
      is_service_based: false,
      is_profooter_rata: false,
      is_allow_partial_amount: false,
      is_activity_based_fee: false,
      is_refundable_fee: false,
      show_transaction_in_parent_login: false
    }
    let currentData = this.props.normalFeeList.filter(val => val.id === this.props.id)
    currentData.forEach(arr => {
      this.setState((state) => ({
        fee_type_name: arr.fee_type_name ? arr.fee_type_name : '',
        priority: Number.isInteger(arr.priority) ? arr.priority : '',
        is_concession_applicable: arr.is_concession_applicable ? arr.is_concession_applicable : false,
        is_service_based: arr.is_service_based ? arr.is_service_based : false,
        is_profooter_rata: arr.is_pro_rata ? arr.is_pro_rata : false,
        is_allow_partial_amount: arr.is_allow_partial_amount ? arr.is_allow_partial_amount : false,
        is_activity_based_fee: arr.is_activity_based_fee ? arr.is_activity_based_fee : false,
        is_refundable_fee: arr.is_refundable_fee ? arr.is_refundable_fee : false,
        show_transaction_in_parent_login: arr.show_transaction_in_parent_login ? arr.show_transaction_in_parent_login : false
      }))
    })
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  priorityHandler = e => {
    this.setState({ priority: e.target.value })
  }

  feeTypeNameHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  handlevalue = (e) => {
    const {
      fee_type_name,
      priority,
      is_concession_applicable,
      is_service_based,
      is_profooter_rata,
      is_allow_partial_amount,
      is_activity_based_fee,
      is_refundable_fee,
      show_transaction_in_parent_login
    } = this.state

    if (fee_type_name) {
      var data = {
        fee_type_name: fee_type_name,
        priority: priority,
        is_concession_applicable: is_concession_applicable,
        is_service_based: is_service_based,
        is_pro_rata: is_profooter_rata,
        is_allow_partial_amount: is_allow_partial_amount,
        is_activity_based_fee: is_activity_based_fee,
        is_refundable_fee: is_refundable_fee,
        show_transaction_in_parent_login: show_transaction_in_parent_login
      }
      this.props.updatedNormalFeeList(this.props.id, data, this.props.alert, this.props.user)
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
              Edit Normal Fee Type
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} style={{ padding: 10, flexGrow: 1 }}>
          <Grid item xs={6}>
            <label>Fee Type Name</label>
            <input
              name='fee_type_name'
              type='text'
              className='form-control'
              onChange={this.feeTypeNameHandler}
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
              onChange={this.priorityHandler}
              placeholder='Priority'
              value={this.state.priority}
            />
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_concession_applicable', e)}
                checked={this.state.is_concession_applicable}
              />
              Concession Applicable
            </label>
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_service_based', e)}
                checked={this.state.is_service_based}
              />
              Service Based
            </label>
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_profooter_rata', e)}
                checked={this.state.is_profooter_rata}
              />
              Pro Rata
            </label>
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_allow_partial_amount', e)}
                checked={this.state.is_allow_partial_amount}
              />
              Allow Partial Amount
            </label>
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_activity_based_fee', e)}
                checked={this.state.is_activity_based_fee}
              />
              Activity Based Fee
            </label>
          </Grid>
          <Grid item xs={4}>
            <label>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_refundable_fee', e)}
                checked={this.state.is_refundable_fee}
              /> Refundable Fee
            </label>
          </Grid>
          <Grid item xs={12}>
            <label>
              <input
                type='checkbox'
                checked={this.state.show_transaction_in_parent_login}
                onChange={(e) => this.changedHandler('show_transaction_in_parent_login', e)}
              />
              Show Transaction in Parent login
            </label>
          </Grid>
          <Grid item xs={6}>
            <Button color='secondary' variant='contained' onClick={this.props.close}>Return</Button>
          </Grid>
          <Grid item xs={6}>
            <Button color='primary' variant='contained' onClick={this.handlevalue}>
              Update
            </Button>
          </Grid>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  normalFeeList: state.finance.normalFee.normalFeeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  updatedNormalFeeList: (id, data, alert, user) => dispatch(actionTypes.editNormalFeeList({ id, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditFeeType)))
