import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import { Button, Grid } from '@material-ui/core/'

import * as actionTypes from '../store/actions'
// import classes from './concession.module.css'
// import '../../css/staff.css'

class EditConcessionSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      concession_type: [],
      concessionTypeId: '',
      concessionType: {},
      automatic_manual_fixed: '',
      percentageValue: false,
      manualAmount: false,
      fixedAmount: false,
      fixed_amount: '',
      adjustmentOrder: '',
      branch_level_concession_limit_amount: '',
      concession_percentage: '',
      concAdjustmentOrder: {},
      concAdjustmentType: {}
    }
  }

  concessionTypeHandler = e => {
    const concession = {
      id: e.value,
      type_name: e.label
    }
    this.setState({
      concessionType: concession
    })
  }

  adjusmentOrderHandler = e => {
    const adjustment = {
      value: e.value,
      label: e.label
    }
    this.setState({
      concAdjustmentOrder: adjustment
    })
  }

  handleSubmitConcession = () => {
    let data = {
      id: this.props.id,
      concession_type: this.state.concessionType.id,
      concession_name: this.state.concession_name,
      adjustment_type: this.state.concAdjustmentType.value,
      adjust_order: this.state.concAdjustmentOrder.value
    }
    if (this.state.percentageValue) {
      data.concession_percentage = this.state.concession_percentage
    } else if (this.state.manualAmount) {
      data.branch_level_concession_limit_amount = this.state.branch_level_concession_limit_amount
    } else {
      data.fixed_amount = this.state.fixed_amount
    }
    this.props.updateConcession(data, this.props.alert, this.props.user)
    this.props.close()
  }

  concessionDetails = () => {
    let currentData = this.props.listConcessions && this.props.listConcessions.length
      ? this.props.listConcessions.filter(val => val.id === this.props.id)
      : this.props.alert.error('Something Went Wrong')
    currentData.forEach(val => {
      this.setState({
        concession_name: val.concession_name ? val.concession_name : '',
        concessionType: val.concession_type ? val.concession_type : '',
        concAdjustmentOrder: val.adjustment_order
          ? val.adjustment_order === '1' ? { value: '1', label: 'Ascending' }
            : val.adjustment_order === '2' ? { value: '2', label: 'Descending' }
              : val.adjustment_order === '3' ? { value: '3', label: 'Installment Wise Percentage' } : ''
          : '',
        fixed_amount: val.Fixed_amount ? Math.round(val.Fixed_amount) : '',
        concession_percentage: val.automatic_concession_percentage ? Math.round(val.automatic_concession_percentage) : '',
        branch_level_concession_limit_amount: val.branch_level_limit_amount ? Math.round(val.branch_level_limit_amount) : '',
        concAdjustmentType: val.adjustment_type
          ? val.adjustment_type === '1' ? { value: '1', label: 'Automatic(On percentage wise)' }
            : val.adjustment_type === '2' ? { value: '2', label: 'Manual' }
              : val.adjustment_type === '3' ? { value: '3', label: 'Fixed Amount' } : ''
          : '',
        percentageValue: val.adjustment_type ? val.adjustment_type === '1' : false,
        manualAmount: val.adjustment_type
          ? val.adjustment_type === '2' : false,
        fixedAmount: val.adjustment_type
          ? val.adjustment_type === '3' : false
      })
    })
  }

  handleAutomaticManualFixed = e => {
    const amount = {
      value: e.value,
      label: e.label
    }
    this.setState({
      concAdjustmentType: amount
    }, () => {
      if (this.state.concAdjustmentType.value === '1') {
        console.log('entered', this.state.concAdjustmentType.value)
        this.setState({ percentageValue: true, manualAmount: false, fixedAmount: false })
      } else if (this.state.concAdjustmentType.value === '2') {
        console.log('entered', this.state.concAdjustmentType.value)
        this.setState({ manualAmount: true, percentageValue: false, fixedAmount: false })
      } else if (this.state.concAdjustmentType.value === '3') {
        console.log('entered', this.state.concAdjustmentType.value)
        this.setState({ fixedAmount: true, manualAmount: false, percentageValue: false })
      }
    })

    // this.setState({ automatic_manual_fixed: e.value })
  }

  concessionPercentageHandler = e => {
    // if (e.target.value < 1) {
    //   this.props.alert.warning('Invalid Per')
    //   return
    // }
    this.setState({ concession_percentage: e.target.value })
  }

  manualAmountHandler = e => {
    if (e.target.value < 1) {
      this.props.alert.warning('Invalid Amount')
      return
    }
    this.setState({ branch_level_concession_limit_amount: e.target.value })
  }

  fixedAmountHandler = e => {
    if (e.target.value < 1) {
      this.props.alert.warning('Invalid Amount')
      return
    }
    this.setState({ fixed_amount: e.target.value })
  }

  concessionNameHandler = e => {
    this.setState({ concession_name: e.target.value })
  }

  componentDidMount () {
    this.concessionDetails()
  }

  render () {
    console.log('---props-----------------', this.props.listConcessionTypes && this.props.listConcessionTypes.concession_type)
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='10'>
            <label className='student-addStudent-segment1-heading'>
                    Edit Concession Settings
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label>Concession Type*</label>
            <Select
              placeholder='Select Concession Type'
              name='concessionType'
              options={
                this.props.listConcessionTypes && this.props.listConcessionTypes.concession_type && this.props.listConcessionTypes.concession_type.length
                  ? this.props.listConcessionTypes.concession_type.map(concession => ({
                    value: concession.id,
                    label: concession.type_name
                  }))
                  : []
              }
              value={{
                value: this.state.concessionType.id,
                label: this.state.concessionType.type_name
              }}
              onChange={this.concessionTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Concession Name*</label>
            <input
              name='concession_name'
              placeholder='Concession Name'
              type='text'
              className='form-control'
              onChange={this.concessionNameHandler}
              value={this.state.concession_name}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Automatic/Manual/Fixed*</label>
            <Select
              placeholder='Select ..'
              name='automaticManualFixed'
              id='autoManual'
              options={
                [
                  {
                    value: '1',
                    label: 'Automatic(On percentage wise)'
                  },
                  {
                    value: '2',
                    label: 'Manual'
                  },
                  {
                    value: '3',
                    label: 'Fixed Amount'
                  }
                ]
              }
              value={{
                value: this.state.concAdjustmentType.value,
                label: this.state.concAdjustmentType.label
              }}
              onChange={this.handleAutomaticManualFixed}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Adjustment Order*</label>
            <Select
              placeholder='Select Adjustment Order'
              name='adjustmentOrder'
              options={
                [
                  {
                    value: '1',
                    label: 'Ascending'
                  },
                  {
                    value: '2',
                    label: 'Descending'
                  },
                  {
                    value: '3',
                    label: 'Installment Wise Percentage'
                  }
                ]
              }
              value={{
                value: this.state.concAdjustmentOrder.value,
                label: this.state.concAdjustmentOrder.label
              }}
              onChange={this.adjusmentOrderHandler}
            />
          </Grid>
          {this.state.percentageValue
            ? <Grid item xs='5'>
              <label>Concession Percentage*</label>
              <input
                name='concession_percentage'
                placeholder='Concession Percentage'
                type='number'
                min='1'
                className='form-control'
                onChange={this.concessionPercentageHandler}
                value={this.state.concession_percentage}
              />
            </Grid>
            : null}
          {this.state.manualAmount
            ? <Grid item xs='5'>
              <label>Branch level concession limit amount*</label>
              <input
                name='branch_level_concession_limit_amount'
                placeholder='Concession Limit Amount'
                type='number'
                min='1'
                className='form-control'
                onChange={this.manualAmountHandler}
                value={this.state.branch_level_concession_limit_amount}
              />
            </Grid>
            : null}
          {this.state.fixedAmount
            ? <Grid item xs='5'>
              <label>Fixed Amount*</label>
              <input
                name='fixed_amount'
                placeholder='Fixed Amount'
                type='number'
                min='1'
                className='form-control'
                onChange={this.fixedAmountHandler}
                value={this.state.fixed_amount}
              />
            </Grid>
            : null}
          <Grid item xs='5'>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              onClick={this.handleSubmitConcession}
            >
            Update
            </Button>
            <Button
              color='primary'
              variant='outlined'
              style={{ marginLeft: '20px' }}
              onClick={this.props.close}
              type='button'
            >
            Go Back
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  listConcessions: state.finance.concessionSettings.listConcessions,
  listConcessionTypes: state.finance.concessionSettings.listConcessionType
})

const mapDispatchToProps = dispatch => ({
  updateConcession: (data, alert, user) => dispatch(actionTypes.updateListConcessionSettings({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditConcessionSettings)))
