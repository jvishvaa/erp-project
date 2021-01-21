import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
// import Select from 'react-select'
// import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Radio, Button, Grid } from '@material-ui/core/'
import * as actionTypes from '../../store/actions'
// import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'
// import { urls } from '../../../../urls'

class AddBanks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      is_income_account: false,
      is_expenses_account: false,
      bankType: '',
      branchData: [],
      sessionValue: [],
      bank_name: null,
      bank_branch_name: null,
      AccountNumber: null,
      bank_nick_name: null,
      description: null,
      cheque_bounce_amount: null,
      logo_url: null
    }
    this.handlevalue = this.handlevalue.bind(this)
  }

  componentDidMount () {
    console.log('Add banks buds', this.props.currentSession)
  }

  bankTypeHandler = (event) => {
    if (event.target.value === 'income') {
      this.setState({
        bankType: event.target.value
      })
    } else if (event.target.value === 'expense') {
      this.setState({
        bankType: event.target.value
      })
    } else if (event.target.value === 'petty') {
      this.setState({
        bankType: event.target.value
      })
    }
  }

  handlevalue = e => {
    e.preventDefault()
    console.log('clicked')
    let data = {
      academic_year: this.props.session,
      branch: this.props.branch,
      bank_name: this.state.bank_name,
      bank_branch_name: this.state.bank_branch_name,
      AccountNumber: this.state.AccountNumber,
      bank_nick_name: this.state.bank_nick_name,
      description: this.state.description,
      cheque_bounce_amount: this.state.cheque_bounce_amount,
      logo_url: this.state.logo_url,
      bank_type: this.state.bankType
      // is_income_account: this.state.is_income_account,
      // is_expenses_account: this.state.is_expenses_account
    }
    this.props.addedBanks(data, this.props.alert, this.props.user)
    this.props.close()
  }

  accountNumberChangeHandler = (e) => {
    if (e.target.value.length > 16) {
      this.props.alert.warning('Maximum Character Allowed : 16')
      return
    }
    this.setState({ AccountNumber: e.target.value })
  }

  render () {
    return (
      <React.Fragment>
        <Form>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5' >
              <label>Bank Name</label>
              <input
                name='bank_name'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ bank_name: e.target.value })
                }
                placeholder='Bank Name'
                value={this.state.bank_name}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Branch Name</label>
              <input
                name='bank_branch_name'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ bank_branch_name: e.target.value })
                }
                placeholder='Branch Name'
                value={this.state.bank_branch_name}
              />
            </Grid>

            <Grid item xs='5'>
              <label>Account No. </label>
              <input
                name='AccountNumber'
                type='number'
                className='form-control'
                min='0'
                onChange={this.accountNumberChangeHandler}
                placeholder='Account no'
                value={this.state.AccountNumber}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Bank nick name</label>
              <input
                name='bank_nick_name'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ bank_nick_name: e.target.value })
                }
                placeholder='Bank Nick Name'
                value={this.state.bank_nick_name}
              />
            </Grid>

            <Grid item xs='5'>
              <label> Description </label>
              <input
                name='description'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ description: e.target.value })
                }
                placeholder='Description'
                value={this.state.description}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Cheque Bounce Amount</label>
              <input
                name='cheque_bounce_amount'
                type='number'
                min='0'
                className='form-control'
                onChange={e =>
                  this.setState({ cheque_bounce_amount: e.target.value })
                }
                placeholder='Cheque Bounce Amount'
                value={this.state.cheque_bounce_amount}
              />
            </Grid>

            <Grid item xs='5'>
              <label> Logo Url </label>
              <input
                name='logo_url'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ logo_url: e.target.value })
                }
                placeholder='Logo Url'
                value={this.state.logo_url}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='2'>
              <strong>Bank Type:</strong>
            </Grid>
            <Grid item xs='3'>
              <label>Income Acc</label>
              <Radio
                checked={this.state.bankType === 'income'}
                onChange={this.bankTypeHandler}
                value='income'
                name='radio-button-demo'
                aria-label='income'
              />
            </Grid>
            <Grid item xs='3'>
              <label>Expense Acc</label>
              <Radio
                checked={this.state.bankType === 'expense'}
                onChange={this.bankTypeHandler}
                value='expense'
                name='radio-button-demo'
                aria-label='expense'
              />
            </Grid>
            <Grid item xs='3'>
              <label>Petty Cash</label>
              <Radio
                checked={this.state.bankType === 'petty'}
                onChange={this.bankTypeHandler}
                value='petty'
                name='radio-button-demo'
                aria-label='petty'
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                color='primary'
                variant='contained'
                disabled={!this.state.bankType}
                onClick={this.handlevalue}
              >
                  Create
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
  // session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  // loadSession: dispatch(apiActions.listAcademicSessions())
  addedBanks: (data, alert, user) => dispatch(actionTypes.addBank({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddBanks)))
