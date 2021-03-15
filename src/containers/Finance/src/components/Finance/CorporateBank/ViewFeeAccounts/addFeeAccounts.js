import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormControlLabel, Checkbox, Button, Grid } from '@material-ui/core/'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
// import { apiActions } from '../../../../_actions'
// import '../../css/staff.css'

class AddFeeAccounts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      can_be_shown_reports: false,
      is_trust: false,
      is_expenses_account: false,
      branchId: '',
      fee_account_name: null,
      prefix: null,
      receipt_sub_header: null,
      receipt_footer: null,
      payslip_header: null
    }
    this.handlevalue = this.handlevalue.bind(this)
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [], sessionValue: e })
    axios
      .get(urls.MiscFeeClass + '?session_year=' + e.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (+res.status === 200) {
          // console.log(res.data);
          this.setState({ branchValue: res.data })
        }
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.MiscFeeClass + 'error' + error)
      })
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      academic_year: this.props.session,
      branch: this.props.branch,
      fee_account_name: this.state.fee_account_name,
      prefix: this.state.prefix,
      receipt_sub_header: this.state.receipt_header,
      receipt_footer: this.state.receipt_footer,
      payslip_header: this.state.payslip_header,
      can_be_shown_reports: this.state.can_be_shown_reports,
      is_trust: this.state.is_trust,
      is_expenses_account: this.state.is_expenses_account
    }
    this.props.addFeeAccounts(data, this.props.alert, this.props.user)
    this.props.close()
  }

  render () {
    return (
      <React.Fragment>
        <Form>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='4'>
              <label className='student-addStudent-segment1-heading'>
                            Add Fee Account
              </label>
            </Grid>
          </Grid>
          <Divider />
          <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='4'>
              <label>Fee Account Name</label>
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
            <Grid item xs='4'>
              <label>Prefix</label>
              <input
                name='prefix'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ prefix: e.target.value })
                }
                placeholder='Prefix'
                value={this.state.prefix}
              />
            </Grid>
            <Grid item xs='4'>
              <label>Receipt sub header </label>
              <input
                name='receipt_header'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ receipt_header: e.target.value })
                }
                placeholder='Receipt header'
                value={this.state.receipt_header}
              />
            </Grid>
            <Grid item xs='4'>
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
            <Grid item xs='4'>
              <label> payslip header </label>
              <input
                name='payslip_header'
                type='text'
                className='form-control'
                onChange={e =>
                  this.setState({ payslip_header: e.target.value })
                }
                placeholder='payslip header'
                value={this.state.payslip_header}
              />
            </Grid>
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='4'>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.can_be_shown_reports}
                      onChange={this.changedHandler('can_be_shown_reports')}
                      color='primary'
                    />
                  }
                  label='Shown Reports'
                />

              </Grid>
              <Grid item xs='4'>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.is_trust}
                      onChange={this.changedHandler('is_trust')}
                      color='primary'
                    />
                  }
                  label='Trust'
                />

              </Grid>
            </Grid>
            <Grid item xs='4'>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_expenses_account}
                    onChange={this.changedHandler('is_expenses_account')}
                    color='primary'
                  />
                }
                label='Expenses Account'
              />

            </Grid>
            <Grid item xs='4'>
              <Button
                variant='contained'
                color='primary'
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
  addFeeAccounts: (data, alert, user) => dispatch(actionTypes.addFeeAccounts({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddFeeAccounts)))
