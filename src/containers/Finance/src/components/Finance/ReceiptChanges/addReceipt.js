import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import { Button, Grid } from '@material-ui/core/'

import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'

import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import '../../css/staff.css'

class AddReceipt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sequence_no: '',
      receiptType: [],
      feeAccount: [],
      branchValue: [],
      fee_account: {},
      range_from: '',
      is_active: false,
      alertMessage: ''
    }
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleFeeAccount = (e) => {
    this.setState({ fee_account: e.value, feeAccountData: e })
  }

  changeReceiptType = (e) => {
    this.setState({ recType: e.value, receiptTypeData: e })
  }

  rangeHandler = (e) => {
    this.setState({ range_to: e.target.value })
    // let rangeFrom = document.getElementById('range_from').value
    // let rangeTo = document.getElementById('range_to').value
    // if (rangeFrom > rangeTo) {
    //   this.props.alert.warning('Invalid Range')
    //   this.setState({ range_to: '' })
    // }
  }

  changeRangeFromHandler = e => {
    this.setState({ range_from: e.target.value, range_to: parseInt(e.target.value) + 1 })
  }

  handlevalue = e => {
    e.preventDefault()
    if (this.state.range_from > this.state.range_to) {
      this.props.alert.warning('Invalid Range')
      return
    }
    var data = {
      branch: this.props.branchId,
      academic_year: this.props.acadId,
      fee_account: this.state.feeAccountData,
      receipt_type: this.state.recType,
      range_from: parseInt(this.state.range_from),
      range_to: parseInt(this.state.range_to),
      sequence_no: this.state.sequence_no,
      is_active: this.state.is_active
    }
    this.props.addReceipts(data, this.props.alert, this.props.user)
    this.props.close()
  }

  changeSequenceNoHandler = e => {
    this.setState({ sequence_no: e.target.value })
  }

  componentDidMount () {
    this.props.fetchFeeAccount(this.props.acadId, this.props.branchId, this.props.alert, this.props.user)
  }

  render () {
    return (
      <React.Fragment>
        <Form onSubmit={(e) => { this.handlevalue(e) }}>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='10'>
              <label className='student-addStudent-segment1-heading'>
                          Add Receipt Ranges
              </label>
            </Grid>
          </Grid>
          <Divider />
          <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label>Fee Account</label>
              <Select
                placeholder='Fee Account'
                value={this.state.feeAccountData}
                options={
                  this.props.feeAccounts
                    ? this.props.feeAccounts.map(fee => ({
                      value: fee.id,
                      label: fee.fee_account_name
                    }))
                    : []
                }
                onChange={this.handleFeeAccount}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Receipt type*</label>
              <Select
                placeholder='Receipt Type'
                value={this.state.receiptTypeData}
                options={
                  [
                    {
                      value: 2,
                      label: 'Manual'
                    },
                    {
                      value: 1,
                      label: 'Online'
                    }
                  ]
                }

                onChange={this.changeReceiptType}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Range From</label>
              <input
                name='range_from'
                type='number'
                className='form-control'
                min='0'
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
                min={parseInt(this.state.range_from) + 1}
                className='form-control'
                onChange={this.rangeHandler}
                placeholder='range_to'
                id='range_to'
                value={this.state.range_to}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Sequence No.</label>
              <input
                name='sequence_no'
                type='number'
                min='0'
                className='form-control'
                onChange={this.changeSequenceNoHandler}
                placeholder='sequence_no'
                value={this.state.sequence_no}
              />
            </Grid>
            <Grid item xs='5'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_active}
                    onChange={this.changedHandler('is_active')}
                    color='primary'
                  />
                }
                label='is_active'
              />
            </Grid>
            <div
              style={{ margin: '0 auto' }}
            >
              <Button
                type='submit'
                color='primary'
                variant='contained'
                style={{ marginRight: '10px' }}
                disabled={!this.state.recType || !this.state.recType || !this.state.range_from ||
                              !this.state.range_to || !this.state.sequence_no
                }
              >
                    Create
              </Button>
              <Button
                color='secondary'
                onClick={this.props.close}
                type='button'
                variant='contained'
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
  feeAccounts: state.finance.receiptRangesLists.feeAccPerBrnch
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchFeeAccount: (session, branch, alert, user) => dispatch(actionTypes.fetchFeeAccountPerBranch({ session, branch, alert, user })),
  addReceipts: (data, alert, user) => dispatch(actionTypes.addReceiptRanges({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddReceipt)))
