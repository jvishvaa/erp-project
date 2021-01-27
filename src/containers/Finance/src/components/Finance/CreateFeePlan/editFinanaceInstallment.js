import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import Select from 'react-select'
import { Button, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import '../../css/staff.css'

class EditFeeInstallment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      due_date: '',
      installment_percentage: 0,
      installment_start_date: '',
      installment_end_date: '',
      feeAccountData: [],
      fine_amount: false,
      feeAcountValue: '',
      feeAccount: {},
      installment_name: ''
    }
  }

  componentDidMount () {
    let currentInstallment = this.props.installmentList.filter(val => val.id === this.props.id)
    console.log(this.props.id, '-------------------id----------------')
    console.log(currentInstallment)
    currentInstallment.forEach((val) => {
      this.setState((state) => ({
        sessionId: val.academic_year ? val.academic_year : '',
        installment_percentage: val.installment_percentage ? val.installment_percentage : 0,
        installment_name: val.installment_name ? val.installment_name : '',
        installment_amount: val.installment_amount ? val.installment_amount : '',
        due_date: val.due_date ? val.due_date : '',
        installment_start_date: val.installment_start_date ? val.installment_start_date : '',
        installment_end_date: val.installment_end_date ? val.installment_end_date : '',
        fine_amount: val.fine_amount ? val.fine_amount : false,
        feeAccount: val.fee_account
      }), () => {
        console.log('SetState ----', this.state.installment_name)
      })
    })
    console.log('user inside modal +++ ', this.props.user)
    this.props.feeAccountList(this.props.acadId, this.props.alert, this.props.user)
  }

  // feeAccountInfo = () => {
  //   axios
  //     .get(urls.FeeAccountBranches + '?academic_year=' + session, {
  //       headers: {
  //         Authorization: 'Bearer ' + this.props.user
  //       }
  //     })
  //     .then(res => {
  //       var arr = res.data
  //       // console.log(arr)
  //       arr.forEach((val) => {
  //         this.setState({ feeAccountData: val.fee_account_name })
  //       })
  //     })
  //     .catch(function (error) {
  //       console.log("Error: Couldn't fetch data from " + urls.FeeAccountBranches + error)
  //     })
  // }

  handleEndDate = (e) => {
    this.setState({ installment_end_date: e.target.value })
    var startDate = document.getElementById('installment_start_date').value
    var endDate = document.getElementById('installment_end_date').value
    if (Date.parse(startDate) >= Date.parse(endDate)) {
      this.props.alert.warning('End Date should be greater than start data')
      this.setState({ installment_end_date: '' })
    }
  }

  handleFeeAcount = e => {
    console.log('acc', e)
    const feeAccount = {
      id: e.value,
      fee_account_name: e.label
    }
    this.setState({
      feeAccount: feeAccount
    })
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  startDateHandler = e => {
    this.setState({ installment_start_date: e.target.value })
  }
  editInstNameHandler = e => {
    this.setState({ installment_name: e.target.value })
  }

  dueDateHandler = e => {
    this.setState({ due_date: e.target.value })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      id: parseInt(this.props.id),
      installment_percentage: this.state.installment_percentage,
      installment_name: this.state.installment_name,
      installment_amount: this.state.installment_amount,
      due_date: this.state.due_date,
      installment_start_date: this.state.installment_start_date ? this.state.installment_start_date : null,
      installment_end_date: this.state.installment_end_date ? this.state.installment_end_date : null,
      fine_amount: this.state.fine_amount,
      fee_account: this.state.feeAccount
    }
    this.props.updateIndividualInstallment(this.props.id, data, this.props.alert, this.props.user)
    this.props.close()
    // var updatedList = urls.Finance + this.props.id + '/updateinstallmentsrecords/'
    // axios
    //   .put(updatedList, data, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     console.log(res)
    //     if (res.status == "200") {
    //       this.props.alert.success('Created Successfully')
    //       this.props.close()
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //     console.log("Error: Couldn't fetch data from " + urls.NormalFeeType)
    //   })
  }

  render () {
    return (
      <React.Fragment>
        <Form onSubmit={this.handlevalue}>
          <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
            <Grid item xs='8'>
              <label className='student-addStudent-segment1-heading'>
                            Edit Installments
              </label>
            </Grid>
            <Grid item xs='6'>
              <label>Installment Name :</label>
              {/* {this.state.installment_name} */}
              <input
                name='installment_name'
                type='text'
                className='form-control'
                onChange={this.editInstNameHandler}
                placeholder='inst_name'
                value={this.state.installment_name}
              />
              ({parseFloat(this.state.installment_percentage).toFixed(2)}%)
              <br /> <label>Installment amount :</label> {this.state.installment_amount}
            </Grid>

            <Grid item xs='6'>
              <label>Set Due Date</label>
              <input
                name='due_date'
                type='date'
                className='form-control'
                onChange={this.dueDateHandler}
                placeholder='due_date'
                value={this.state.due_date}
              />
            </Grid>
            <Grid item xs='6'>
              <label>Installment Start Date</label>
              <input
                name='installment_start_date'
                type='date'
                id='installment_start_date'
                className='form-control'
                onChange={this.startDateHandler}
                placeholder='Installment Start Date'
                value={this.state.installment_start_date}
              />
            </Grid>
            <Grid item xs='6'>
              <label>Installment End Date</label>
              <input
                name='installment_end_date'
                type='date'
                id='installment_end_date'
                className='form-control'
                onChange={this.handleEndDate}
                placeholder='Installment End Date'
                value={this.state.installment_end_date}
              />
            </Grid>

            <Grid item xs='6'>
              <label>Fee Account</label>
              <Select
                placeholder='Select Fee Account'
                options={
                  this.props.feeAccountListFromAcadId.length
                    ? this.props.feeAccountListFromAcadId[0].fee_account_name.map(feeList => ({
                      value: feeList.id ? feeList.id : '',
                      label: feeList.fee_account_name ? feeList.fee_account_name : ''
                    }))
                    : []
                }
                onChange={this.handleFeeAcount}
                value={{
                  value: this.state.feeAccount.id,
                  label: this.state.feeAccount.fee_account_name
                }}
              />
            </Grid>
            <Grid item xs='6'>
              <input
                type='checkbox'
                onChange={(e) => this.changedHandler('fine_amount', e)}
                checked={this.state.fine_amount}
              /> &nbsp; Fine Amount

            </Grid>
            <Grid item xs='8'>
              <Button
                type='submit'
                color='primary'
                variant='contained'
              >
                      Update
              </Button>
              <Button
                color='primary'
                variant='outlined'
                onClick={this.props.close}
                type='space-between'
              >
                      Return
              </Button>
            </Grid>
          </Grid>
        </Form>
        {this.props.editDataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  installmentList: state.finance.feePlan.feeInstallments,
  feeAccountListFromAcadId: state.finance.feePlan.feeAccountListFromAcadId
  // editDataLoading: state.finance.common.dataLoader,
})

const mapDispatchToProps = dispatch => ({
  feeAccountList: (acadId, alert, user) => dispatch(actionTypes.feeAccountListFromAcadId({ acadId, alert, user })),
  updateIndividualInstallment: (installmentId, data, alert, user) => dispatch(actionTypes.updateInstallmentRecord({ installmentId, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditFeeInstallment)))
