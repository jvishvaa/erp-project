import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Radio, Button, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
import '../../../css/staff.css'
// import classes from './viewBanks.module.css'

class EditBanks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editData: {},
      bank_name: null,
      bank_branch_name: null,
      AccountNumber: null,
      bank_nick_name: null,
      description: null,
      bankType: null,
      cheque_bounce_amount: null,
      logo_url: null
    }
  }

  componentDidMount () {
    let currentData = this.props.accountDetails.filter(val => val.id === this.props.row)
    console.log('edit banksss', currentData)
    currentData.forEach(arr => {
      this.setState((state) => ({
        editData: arr,
        bank_name: arr.bank_name ? arr.bank_name : '',
        bank_branch_name: arr.bank_branch_name ? arr.bank_branch_name : '',
        AccountNumber: arr.AccountNumber ? arr.AccountNumber : '',
        bank_nick_name: arr.bank_nick_name ? arr.bank_nick_name : '',
        description: arr.description ? arr.description : '',
        bankType: arr.is_income_account ? 'income' : arr.is_expenses_account ? 'expense' : 'petty',
        cheque_bounce_amount: arr.cheque_bounce_amount ? arr.cheque_bounce_amount : '',
        logo_url: arr.logo_url ? arr.logo_url : ''
      }))
    })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      id: this.props.row,
      academic_year: this.props.session,
      branch: this.props.branch,
      bank_name: this.state.bank_name,
      bank_branch_name: this.state.bank_branch_name,
      AccountNumber: this.state.AccountNumber,
      bank_nick_name: this.state.bank_nick_name,
      description: this.state.description,
      bank_type: this.state.bankType,
      cheque_bounce_amount: this.state.cheque_bounce_amount,
      logo_url: this.state.logo_url
    }
    this.props.editedBank(data, this.props.row, this.props.alert, this.props.user)
    this.props.close()
  }
  // validation of account number
  accountNumberChangeHandler = (e) => {
    if (e.target.value.length > 16) {
      this.props.alert.warning('Maximum Character Allowed : 16')
      return
    }
    this.setState({ AccountNumber: e.target.value })
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

  render () {
    return (
      <React.Fragment>
        <Form>
          <Grid container spacing={3} style={{ padding: 15 }} >
            <Grid item xs='5'>
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
              <label>Account Number</label>
              <input
                name='AccountNumber'
                type='text'
                className='form-control'
                onChange={this.accountNumberChangeHandler}
                placeholder='Account Number'
                value={this.state.AccountNumber}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Nick Name</label>
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
              <label>Description</label>
              <input
                name='description'
                type='text'
                className='form-control'
                onChange={(e) =>
                  this.setState({ description: e.target.value })
                }
                placeholder='Description'
                value={this.state.description}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Check Bounce Amount</label>
              <input
                name='cheque_bounce_amount'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ cheque_bounce_amount: e.target.value })
                }
                placeholder='Bank Nick Name'
                value={this.state.cheque_bounce_amount}
              />
            </Grid>

            <Grid item xs='5'>
              <label>Logo URL</label>
              <input
                name='logo_url'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ logo_url: e.target.value })
                }
                placeholder='Logo URL'
                value={this.state.logo_url}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ padding: 15 }} >
            <Grid item xs='3'>
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
              <Button variant='contained' color='primary' onClick={this.handlevalue}>
                  Update
              </Button>
              {/* <Button primary onClick={this.props.history.goBack} type="button">Return</Button> */}
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
  editedBank: (data, row, alert, user) => dispatch(actionTypes.editBank({ data, row, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditBanks)))
