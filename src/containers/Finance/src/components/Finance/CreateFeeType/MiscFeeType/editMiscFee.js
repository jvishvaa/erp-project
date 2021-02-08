import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import { Button, Grid } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'

class EditMiscFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alertMessage: '',
      fee_type_name: null,
      is_multiple_records_allow: false,
      individual_student_wise: false,
      allow_partial_payments: false,
      can_be_group: false,
      is_allow_remarks: false,
      allow_excess_amount: false,
      is_last_year_due: false,
      is_advance_fee: false,
      is_parent_enable: false,
      set_due_date: null
    }
  }

  componentDidMount () {
    console.log('alert---------------', this.props.alert)
    let currentData = this.props.miscFeeList.filter(val => val.id === this.props.id)
    currentData.forEach(arr => {
      console.log(arr)
      this.setState({
        fee_type_name: arr.fee_type_name ? arr.fee_type_name : '',
        is_multiple_records_allow: arr.is_multiple_records_allow ? arr.is_multiple_records_allow : false,
        individual_student_wise: arr.individual_student_wise ? arr.individual_student_wise : false,
        allow_partial_payments: arr.allow_partial_payments ? arr.allow_partial_payments : false,
        can_be_group: arr.can_be_group ? arr.can_be_group : false,
        is_allow_remarks: arr.is_allow_remarks ? arr.is_allow_remarks : false,
        allow_excess_amount: arr.allow_excess_amount ? arr.allow_excess_amount : false,
        is_last_year_due: arr.is_last_year_due ? arr.is_last_year_due : false,
        is_advance_fee: arr.is_advance_fee ? arr.is_advance_fee : false,
        is_parent_enable: arr.is_parent_enable ? arr.is_parent_enable : false,
        set_due_date: arr.set_due_date ? arr.set_due_date : ''
      })
    })
  }

  dueDateHandler = e => {
    this.setState({ set_due_date: e.target.value })
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  feeTypeNameHandler = e => {
    this.setState({ fee_type_name: e.target.value })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      fee_type_name: this.state.fee_type_name,
      set_due_date: this.state.set_due_date,
      is_multiple_records_allow: this.state.is_multiple_records_allow,
      individual_student_wise: this.state.individual_student_wise,
      allow_partial_payments: this.state.allow_partial_payments,
      can_be_group: this.state.can_be_group,
      is_allow_remarks: this.state.is_allow_remarks,
      allow_excess_amount: this.state.allow_excess_amount,
      is_last_year_due: this.state.is_last_year_due,
      is_advance_fee: this.state.is_advance_fee,
      show_transaction_in_parent_login: this.state.show_transaction_in_parent_login,
      is_parent_enable: this.state.is_parent_enable
    }
    this.props.updateListMiscFee(this.props.id, data, this.props.alert, this.props.user)
    this.props.close()
  }

  render () {
    return (
      <Form>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label className='student-addStudent-segment1-heading'>
                      Edit Misc Fee Type
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
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
          <Grid item xs='5'>
            <label>Set Due Date</label>
            <input
              name='set_due_date'
              type='date'
              className='form-control'
              onChange={this.dueDateHandler}
              placeholder='set_due_date'
              value={this.state.set_due_date}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_multiple_records_allow}
              onChange={(e) => this.changedHandler('is_multiple_records_allow', e)}
            /> &nbsp; multiple records allo
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.individual_student_wise}
              onChange={(e) => this.changedHandler('individual_student_wise', e)}
            /> &nbsp; individual student wise
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.allow_partial_payments}
              onChange={(e) => this.changedHandler('allow_partial_payments', e)}
            /> &nbsp; allow partial payments
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.can_be_group}
              onChange={(e) => this.changedHandler('can_be_group', e)}
            /> &nbsp; can be group
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_allow_remarks}
              onChange={(e) => this.changedHandler('is_allow_remarks', e)}
            /> &nbsp; allow remarks
          </Grid>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.allow_excess_amount}
              onChange={(e) => this.changedHandler('allow_excess_amount', e)}
            /> &nbsp; allow excess amount

          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <input
              type='checkbox'
              checked={this.state.is_last_year_due}
              onChange={(e) => this.changedHandler('is_last_year_due', e)}
            /> &nbsp; last year due

          </Grid>
          <Grid item xs='5'>

            <input
              type='checkbox'
              checked={this.state.is_advance_fee}
              onChange={(e) => this.changedHandler('is_advance_fee', e)}
            /> &nbsp; advance fee

          </Grid>
          <Grid item xs='5'>

            <input
              type='checkbox'
              checked={this.state.is_parent_enable}
              onChange={(e) => this.changedHandler('is_parent_enable', e)}
            /> &nbsp; parent enable

          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item xs='5'>
            <div>
              <Button variant='contained' color='primary' onClick={this.handlevalue}>
                    Update
              </Button>
              <Button color='secondary' variant='contained' style={{ marginLeft: 20 }} onClick={this.props.close} type='button'>Return</Button>
            </div>

          </Grid>
        </Grid>
      </Form>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  miscFeeList: state.finance.miscFee.miscFeeList
})

const mapDispatchToProps = dispatch => ({
  updateListMiscFee: (id, data, alert, user) => dispatch(actionTypes.updateMiscFeeList({ id, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditMiscFeeType)))
