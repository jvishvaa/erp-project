import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import { Button } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import * as actionTypes from '../../store/actions'
import classes from './registrationFee.module.css'

class AddRegistrationFee extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeTypeName: '',
      amount: 0
    }
  }

  componentDidMount = (e) => {
    if (this.props.feeType === 'Registration Fee Type') {
      this.setState({
        feeTypeName: 'Registration Fee'
      })
    } else {
      this.setState({
        feeTypeName: 'Application Fee'
      })
    }
  }

  changehandlerFeeTypeName = (e) => {
  //   if (this.props.feeType === 'Registration Fee Type') {
  //   this.setState({
  //     feeTypeName: 'Registration Fee'
  //   })
  // } else {
  //   this.setState({
  //     feeTypeName: 'Registration Fee'
  //   })
  // }
  }

  changehandlerAmount = (e) => {
    this.setState({
      amount: e.target.value
    })
  }
  updateRegistrationType = () => {
    if (+this.state.amount <= 0 || this.state.feeTypeName === '') {
      this.props.alert.warning('Fill all fields!')
      return
    }
    let data = {
      academic_year: this.props.acadId,
      branch: [this.props.branchId],
      fee_type_name: this.state.feeTypeName,
      amount: +this.state.amount,
      type: this.props.typeId
    }
    this.props.addFeeTypes(data, this.props.alert, this.props.user)
    this.props.close()
  }

  render () {
    return (
      <React.Fragment>
        <h3 className={classes.modal__heading}>Add Registration/Application Fee Type</h3>
        <hr />
        <div style={{ width: '70%', margin: 'auto', marginBottom: '10px' }}>
          <label>Fee Type Name</label>
          <input
            placeholder='Fee Type Name'
            type='text'
            // disabled={true}
            className='form-control'
            value={this.state.feeTypeName}
            onChange={this.changehandlerFeeTypeName}
          />
        </div>
        <div style={{ width: '70%', margin: 'auto', marginBottom: '10px' }}>
          <label>Amount</label>
          <input
            placeholder='Amount'
            type='number'
            min='1'
            className='form-control'
            value={this.state.amount}
            onChange={this.changehandlerAmount}
          />
        </div>
        <div>
          <span style={{ float: 'right', marginRight: '30px' }}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.updateRegistrationType}
            >
              Add
            </Button>
          </span>
        </div>
        <br />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addFeeTypes: (data, alert, user) => dispatch(actionTypes.addRegistrationFeeType({ data, alert, user }))
})

export default connect(null, mapDispatchToProps)((withRouter(AddRegistrationFee)))
