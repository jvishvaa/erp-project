import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core/'

import { Form, Divider } from 'semantic-ui-react'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// import classes from './receiptRanges.module.css'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import '../../css/staff.css'

class EditReceipt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sequence_no: '',
      receiptType: [],
      feeAccount: [],
      branchValue: [],
      fee_accountValue: {},
      range_from: '',
      is_active: false
    }
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  handleFeeAccount = (e) => {
    const feeAccount = {
      id: e.value,
      fee_account_name: e.label
    }
    this.setState({
      fee_accountValue: feeAccount
    })
  }

  handlevalue = e => {
    e.preventDefault()
    console.log('clicked')
    if (this.state.range_from > this.state.range_to) {
      this.props.alert.warning('Invalid Range')
      return
    }
    var data = {
      branch: this.state.branch,
      academic_year: this.state.academic_year,
      fee_account: this.state.fee_accountValue,
      receipt_type: this.state.receipt_type,
      range_from: this.state.range_from,
      range_to: this.state.range_to,
      sequence_no: this.state.sequence_no,
      is_active: this.state.is_active
    }
    console.log('data : ', data)
    this.props.updateReceipts(this.props.id, data, this.props.alert, this.props.user)
    this.props.close()
  }

  rangeHandler = (e) => {
    const finalRange = e.target.value
    if (finalRange < 0) {
      this.props.alert.warning('Value should be greater then 0!')
    }
    this.setState({ range_to: finalRange })
    // let rangeFrom = document.getElementById('range_from').value
    // let rangeTo = document.getElementById('range_to').value
    // console.log('rangefrom', rangeFrom)
    // if (rangeFrom > rangeTo) {
    //   this.props.alert.warning('Invalid Range')
    //   this.setState({ range_to: '' })
    // }
  }

  changeRangeFromHandler = e => {
    const initialRange = e.target.value
    if (initialRange < 0) {
      this.props.alert.warning('Value should be greater then 0!')
    }
    this.setState({ range_from: initialRange })
  }

  changeSequenceNoHandler = e => {
    this.setState({ sequence_no: e.target.value })
  }

  componentDidMount () {
    this.props.fetchFeeAccount(this.props.acadId, this.props.branchId, this.props.alert, this.props.user)
    let currentData = this.props.receiptLists.filter(val => val.id === this.props.id)
    console.log('currentData: ', currentData)
    currentData.forEach(arr => {
      this.setState({
        range_from: arr.range_from ? arr.range_from : '',
        range_to: arr.range_to ? arr.range_to : '',
        sequence_no: arr.sequence_no ? arr.sequence_no : '',
        is_active: arr.is_active ? arr.is_active : false,
        academic_year: this.props.acadId ? this.props.acadId : '',
        fee_accountValue: arr.fee_account ? arr.fee_account : '',
        branchValue: this.props.branchId ? this.props.branchId : ''
      }, () => {
        console.log('Mounting states: ', this.state.fee_accountValue)
      })
    })
  }

  render () {
    // console.log('state', this.state)
    return (
      <React.Fragment>
        <Form onSubmit={this.handlevalue}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='10'>
              <label className='student-addStudent-segment1-heading'>
                          Edit Receipt Ranges
              </label>
            </Grid>
          </Grid>
          <Divider />
          <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label>Fee Account</label>
              <Select
                placeholder='Fee Account'
                options={
                  this.props.feeAccounts
                    ? this.props.feeAccounts.map(fee => ({
                      value: fee.id,
                      label: fee.fee_account_name
                    }))
                    : []
                }
                value={{
                  value: this.state.fee_accountValue.id,
                  label: this.state.fee_accountValue.fee_account_name
                }}

                onChange={this.handleFeeAccount}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Sequence No.</label>
              <input
                name='sequence_no'
                type='number'
                className='form-control'
                onChange={this.changeSequenceNoHandler}
                placeholder='sequence_no'
                value={this.state.sequence_no}
              />
            </Grid>

            <Grid item xs='5'>
              <label>Range From</label>
              <input
                name='range_from'
                type='number'
                className='form-control'
                onChange={this.changeRangeFromHandler}
                placeholder='range_from'
                id='range_from'
                value={this.state.range_from}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Range To</label>
              <input
                name='range_to'
                type='number'
                className='form-control'
                min={parseInt(this.state.range_from) + 1}
                onChange={this.rangeHandler}
                placeholder='range_to'
                id='range_to'
                value={this.state.range_to}
              />
            </Grid>
            <Grid item xs='5'>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('is_active', e)}
                checked={this.state.is_active}
              /> &nbsp; Active
            </Grid>
            <div style={{ margin: '0 auto' }}>
              <Button
                type='submit'
                color='primary'
                variant='contained'
                // className={classes.update_button}
              >
                    Update
              </Button>
              <Button
                color='primary'
                variant='outlined'
                style={{ marginLeft: 20 }}
                onClick={this.props.close}
                type='button'
                // className={classes.return_button}
              >Return</Button>
            </div>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  receiptLists: state.finance.receiptRangesLists.receiptList,
  feeAccounts: state.finance.receiptRangesLists.feeAccPerBrnch
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchFeeAccount: (session, branch, alert, user) => dispatch(actionTypes.fetchFeeAccountPerBranch({ session, branch, alert, user })),
  updateReceipts: (id, data, alert, user) => dispatch(actionTypes.updateReceiptRanges({ id, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditReceipt)))
