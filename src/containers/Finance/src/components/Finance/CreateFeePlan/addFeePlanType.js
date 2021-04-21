import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { withStyles, Button, Grid, Divider } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import Select from 'react-select'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import '../../css/staff.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class AddFeePlanType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeplanTypeList: [],
      is_compulsory: false,
      FeeId: '',
      amount: ''
    }
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  changeAmountHandler = (e) => {
    this.setState({ amount: e.target.value })
    let amount = document.getElementById('amount').value
    if (amount < 1) {
      this.props.alert.warning('Invalid Amount')
      this.setState({ amount: '' })
    }
  }

  componentDidMount () {
    this.props.feeplanTypeList(this.props.feeId, this.props.alert, this.props.user)
  }

  handleClickFeeType = e => {
    this.setState({ FeeId: e })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      fee_plan_name: this.props.location.state,
      is_compulsory: this.state.is_compulsory,
      fee_type_name: this.state.FeeId,
      amount: this.state.amount
    }
    this.props.feeCreateFeeType(data, this.props.alert, this.props.user)
    this.props.close()
    // axios
    //   .post(urls.CreateFeeTypeMapping, data, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     if (res.status == "201") {
    //       this.props.alert.success('Added Successfully')
    //       this.props.close()
    //     }
    //   })
    //   .catch(function (error) {
    //   })
  }

  render () {
    return (
      <React.Fragment>
        <Form>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs='8'>
              <label className='student-addStudent-segment1-heading'>
                        Add Fee Type
              </label>
            </Grid>
          </Grid>
          <Divider />

          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs='5'>
              <label>Fee Type</label>
              <Select
                placeholder='Select Fee Type'
                options={
                  this.props.feeTypePerPlan.length
                    ? this.props.feeTypePerPlan.map(feeList => ({
                      value: feeList.id,
                      label: feeList.fee_type_name
                    }))
                    : []
                }
                onChange={this.handleClickFeeType}
              />
            </Grid>
            <Grid item xs='8'>
              <label>Is this fee type compulsory?</label><br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.is_compulsory}
                    onChange={this.changedHandler('is_compulsory')}
                    color='primary'
                  />
                }
                label='is_compulsory'
              />
            </Grid>
            <Grid item xs='5'>
              <label>Amount</label>
              <input
                name='Amount'
                type='number'
                className='form-control'
                min='1'
                id='amount'
                onChange={this.changeAmountHandler}
                placeholder='Amount'
                value={this.state.amount}
              />
            </Grid>
            <Grid item xs='8'>
              <Button
                style={{ marginRight: '10px'}}
                onClick={this.handlevalue}
                color='primary'
                variant='contained'
                disabled={!this.state.FeeId || !this.state.amount}
              >
                      Create
              </Button>
              <Button
                color='primary'
                variant='contained'
                onClick={this.props.history.goBack}
                type='button'
              >
                      Return
              </Button>
            </Grid>
          </Grid>
        </Form>
        {this.props.dataLoadings ? <CircularProgress open /> : null}
      </React.Fragment>

    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  feeTypePerPlan: state.finance.feePlan.feePlanTypeList
  // dataLoadings: state.finance.common.dataLoader,
})

const mapDispatchToProps = dispatch => ({
  feeplanTypeList: (feeId, alert, user) => dispatch(actionTypes.feePlanTypeList({ feeId, alert, user })),
  feeCreateFeeType: (data, alert, user) => dispatch(actionTypes.createFeeType({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AddFeePlanType)))
