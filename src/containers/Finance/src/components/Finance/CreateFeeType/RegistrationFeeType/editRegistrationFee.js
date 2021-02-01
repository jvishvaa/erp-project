import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Grid } from '@material-ui/core/'

import Select from 'react-select'
// import { Button } from '@material-ui/core/'

import * as actionTypes from '../../store/actions'
import classes from './registrationFee.module.css'

class EditRegistrationFee extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeTypeName: '',
      amount: 0,
      feeAccount: {
        label: null,
        value: null
      }
    }
  }

  componentDidMount () {
    const { acadId, branchId, alert, user } = this.props
    this.props.fetchAllFeeAccounts(acadId, branchId, alert, user)
    if (!this.props.acadId || !this.props.branchId || !this.props.typeId) {
      this.props.alert.warning('Unable to load')
      this.props.close()
      return
    }
    let currentData = this.props.feeTypes.filter(val => val.id === this.props.id)
    currentData.forEach(arr => {
      this.setState({
        feeTypeName: arr.fee_type_name ? arr.fee_type_name : '',
        amount: arr.amount ? arr.amount : '',
        feeAccount: {
          label: arr.fee_account && arr.fee_account.fee_account_name ? arr.fee_account.fee_account_name : null,
          value: arr.fee_account && arr.fee_account.id ? arr.fee_account.id : null
        }
      })
    })
  }

  changehandlerFeeTypeName = (e) => {
    this.setState({
      feeTypeName: e.target.value
    })
  }

  changehandlerAmount = (e) => {
    this.setState({
      amount: e.target.value
    })
  }

  feeAccountHandler = (e) => {
    console.log('feeAccountHandlers: ', e)
    this.setState({
      feeAccount: {
        label: e.label,
        value: e.value
      }
    })
  }

  updateRegistrationType = () => {
    if (this.state.amount && this.state.feeTypeName) {
      let data = {
        academic_year: this.props.acadId,
        branch: this.props.branchId,
        fee_type_name: this.state.feeTypeName,
        fee_account_id: this.state.feeAccount.value,
        amount: this.state.amount,
        type: this.props.typeId
      }
      console.log(data)
      this.props.updateFeeType(this.props.id, data, this.props.alert, this.props.user)
      this.props.close()
    } else {
      this.props.alert.warning('Enter The Required Fields')
    }
  }

  render () {
    return (
      <React.Fragment>
        <h3 className={classes.modal__heading}>Edit Registration/Application Fee Type</h3>
        <hr />
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label>Fee Type Name</label>
            <input
              placeholder='Fee Type Name'
              type='text'
              className='form-control'
              value={this.state.feeTypeName}
              onChange={this.changehandlerFeeTypeName}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Amount</label>
            <input
              placeholder='Fee Type Name'
              type='number'
              min='1'
              className='form-control'
              value={this.state.amount}
              onChange={this.changehandlerAmount}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Fee Account</label>
            <Select
              placeholder='Select Fee Account'
              value={this.state.feeAccount ? this.state.feeAccount : null}
              options={
                this.props.viewFeeAccList && this.props.viewFeeAccList.length
                  ? this.props.viewFeeAccList.map(feeAcc => ({
                    value: feeAcc.id,
                    label: feeAcc.fee_account_name
                  }))
                  : []
              }

              onChange={this.feeAccountHandler}
            />
          </Grid>
        </Grid>
        <div className={classes.modal__updatebutton}>
          <Button
            color='primary'
            variant='contained'
            onClick={this.updateRegistrationType}
          >
            Update
          </Button>
        </div>
        <div className={classes.modal__remainbutton}>
          <Button
            color='primary'
            variant='contained'
            onClick={this.props.close}
          >
            Go Back
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  feeTypes: state.finance.registrationFeeType.feeTypesList,
  viewFeeAccList: state.finance.viewFeeAccounts.viewFeeAccList
})

const mapDispatchToProps = dispatch => ({
  updateFeeType: (id, data, alert, user) => dispatch(actionTypes.updateRegistrationFeeType({ id, data, alert, user })),
  fetchAllFeeAccounts: (session, branchId, alert, user) => dispatch(actionTypes.fetchAllFeeAccounts({ session, branchId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditRegistrationFee)))
