import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Grid } from '@material-ui/core/'

import * as actionTypes from '../../store/actions'

// import '../../css/staff.css'

class editFeeAccounts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fee_account_name: '',
      prefix: '',
      receipt_header: '',
      receipt_footer: '',
      payslip_header: '',
      is_shown_reports: false,
      is_trust: false,
      is_expense_account: false
    }
  }

  componentDidMount () {
    let currentData = this.props.accountDetails.filter(val => val.id === this.props.id)
    console.log(currentData)
    currentData.forEach(arr => {
      this.setState((state) => ({
        fee_account_name: arr.fee_account_name ? arr.fee_account_name : '',
        prefix: arr.prefix ? arr.prefix : '',
        receipt_header: arr.receipt_sub_header ? arr.receipt_sub_header : '',
        receipt_footer: arr.receipt_footer ? arr.receipt_footer : '',
        payslip_header: arr.payslip_header ? arr.payslip_header : '',
        is_shown_reports: arr.can_be_shown_reports,
        is_trust: arr.is_trust,
        is_expense_account: arr.is_expenses_account
      }))
    })
  }

  componentDidUpdate () {
    console.log('state from edit fee', this.state)
  }

    changedHandler = (name, event) => {
      this.setState({ [name]: event.target.checked })
    }

    handlevalue = e => {
      console.log('clicked')
      e.preventDefault()
      if (this.state.fee_account_name && (this.state.is_shown_reports || this.state.is_trust || this.state.is_expense_account)) {
        var data = {
          fee_account_name: this.state.fee_account_name,
          id: this.props.id,
          prefix: this.state.prefix,
          receipt_sub_header: this.state.receipt_header,
          receipt_footer: this.state.receipt_footer,
          payslip_header: this.state.payslip_header,
          can_be_shown_reports: this.state.is_shown_reports ? this.state.is_shown_reports : false,
          is_trust: this.state.is_trust ? this.state.is_trust : false,
          is_expenses_account: this.state.is_expense_account ? this.state.is_expense_account : false
        }
        console.log('handled value', data)
        this.props.editFeeAccounts(data, this.props.id, this.props.alert, this.props.user)
        this.props.close()
      } else {
        this.props.alert.warning('Fill all the Required Fields!')
      }
    }

    render () {
      return (
        <React.Fragment>
          <Form>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='12'>
                <label className='student-addStudent-segment1-heading'>
                              Edit Fee Accounts
                </label>
              </Grid>
              <Grid item xs='5'>
                <label>Fee Account Name*</label>
                <input
                  name='fee_account_name'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ fee_account_name: e.target.value })
                  }
                  placeholder='Fee Account Name'
                  value={this.state.fee_account_name}
                />
              </Grid>
              <Grid item xs='5'>
                <label>Prefix</label>
                <input
                  name='prefix'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ prefix: e.target.value })
                  }
                  placeholder='prefix'
                  value={this.state.prefix}
                />
              </Grid>
              <Grid item xs='5'>
                <label>Receipt Sub Header</label>
                <input
                  name='receipt_header'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ receipt_header: e.target.value })
                  }
                  placeholder='Receipt Header'
                  value={this.state.receipt_header}
                />
              </Grid>
              <Grid item xs='5'>
                <label>Receipt Footer</label>
                <input
                  name='receipt_footer'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ receipt_footer: e.target.value })
                  }
                  placeholder='Receipt Footer'
                  value={this.state.receipt_footer}
                />
              </Grid>
              <Grid item xs='5'>
                <label>Pay slip header</label>
                <input
                  name='payslip_header'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ payslip_header: e.target.value })
                  }
                  placeholder='Pay Slip header'
                  value={this.state.payslip_header}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }} >
              <Grid item xs='4'>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_shown_reports', e)}
                  checked={this.state.is_shown_reports}
                /> &nbsp; Shown Reports*
              </Grid>
              <Grid item xs='4'>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_trust', e)}
                  checked={this.state.is_trust}
                /> &nbsp; Trust*
              </Grid>
              <Grid item xs='4'>
                <input
                  type='checkbox'
                  onChange={(e) => this.changedHandler('is_expense_account', e)}
                  checked={this.state.is_expense_account}
                /> &nbsp; Expense Account*
              </Grid>
              <Grid item xs='4'>
                <Button variant='contained' color='primary' onClick={this.handlevalue}>
                              Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        </React.Fragment>
      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  editFeeAccounts: (data, id, alert, user) => dispatch(actionTypes.editFeeAccounts({ data, id, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(editFeeAccounts)))
