import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
// import axios from 'axios'
import { withStyles, Button, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel, Checkbox } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// import { urls } from '../../../../urls'
import '../../../css/staff.css'
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../store/actions'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
class OtherFee extends Component {
  constructor (props) {
    super(props)
    this.state = {
      todayDate: '',
      agreeTerms: false,
      listOtherFee: [],
      isSelectedPayments: [],
      isDisabled: [],
      amountToBePaid: null
    }
  }

  componentDidMount () {
    this.todayDate()
    if (this.props.getList && this.props.sessionYear) {
      this.props.fetchListOtherFees(this.props.sessionYear, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Please fill All madatory Filled')
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.sessionYear !== this.props.sessionYear && this.state.getList) {
      this.props.fetchListOtherFees(this.props.sessionYear, this.props.alert, this.props.user)
    }
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleCheckbox = (e, id) => {
    let amount = 0
    let feeAccIds = ''
    let ids = ''
    const checkedIndex = this.props.studentOtherFee.findIndex(ele => {
      return ele.other_fee.id === id
    })
    const allCheckedIndexes = this.props.studentOtherFee.map((ele, index) => {
      if (index === checkedIndex && e.target.checked) {
        amount += ele.other_fee.amount
        feeAccIds = ele.other_fee.fee_account.id
        ids = ele.other_fee.id
        return true
      }
      return false
    })
    const isDisabled = this.props.studentOtherFee.map((ele, index) => {
      if (index === checkedIndex && e.target.checked) {
        return true
      }
      return false
    })

    this.setState({
      isSelectedPayments: allCheckedIndexes,
      isDisabled,
      amountToBePaid: amount,
      feeAccIds: feeAccIds,
      ids: ids
    })
    // // this.setState({ [name]: e.target.checked });
  }

  handleSubmitPayment = () => {
    var data = [{
      id: this.state.ids,
      fee_account_id: this.state.feeAccIds,
      total_paid_amount: this.state.amountToBePaid
    }]
  }

  todayDate = () => {
    let today = new Date()
    let dd = today.getDate()
    let mm = monthNames[today.getMonth() + 1] // January is 0!
    let yyyy = today.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    today = dd + ' ' + mm + ',' + yyyy
    this.setState({ todayDate: today })
  }

  render () {
    let { classes } = this.props
    return (

      <Grid >
        <Grid.Row>
          <Grid.Column computer={16} style={{ padding: '30px' }}>
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.</TableCell>
                      <TableCell>Fee Account</TableCell>
                      <TableCell>Fee Type Name</TableCell>
                      <TableCell>Sub Type</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.studentOtherFee.length
                      ? this.props.studentOtherFee.map((row, i) => {
                        return (
                          <React.Fragment>
                            <TableRow hover >
                              <TableCell>
                                <input
                                  type='checkbox'
                                  style={{ width: '20px', height: '20px' }}
                                  checked={this.state.isSelectedPayments[i]}
                                  onChange={(e) => this.handleCheckbox(e, row.other_fee.id)}
                                  disabled={this.state.isDisabled[i]}
                                />
                              </TableCell>
                              <TableCell>{row.other_fee.fee_account ? row.other_fee.fee_account.fee_account_name : ''}</TableCell>
                              <TableCell>{row.other_fee ? row.other_fee.fee_type_name : ''}</TableCell>
                              <TableCell>{row.other_fee ? row.other_fee.sub_type : ''}</TableCell>
                              <TableCell>{row.other_fee ? row.other_fee.amount : ''}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        )
                      })
                      : 'no data'}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment> <br />

            <Grid.Row className='student-section-inputField'>
              <label>Amount to be paid : </label> &nbsp; {this.state.amountToBePaid ? this.state.amountToBePaid : 0}
              <br />
              <label>Date</label> <input type='text' value={this.state.todayDate} readOnly />
            </Grid.Row>

            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.agreeTerms}
                      onChange={this.changedHandler('agreeTerms')}
                      color='primary'
                    />
                  }
                  label='I / We Agree terms and conditions'
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>Note :</label>
                <div style={{ color: 'red' }}>
                  <p>1. Please be informed that additional transaction charges are applicable.
                    For more information please contact your school administrator.</p>
                  <p>2. MyClassboard will not store any of your Bank credentials / Card details.
                    The system will redirect you to concerned Bank pages only to complete your
                    transaction.</p>
                  <p>3. No refund(s)/ No Cancellations are allowed for the transactions done
                    through this channel.</p>
                  <p>4. In case of any dispute regarding the payments, you are requested to
                    contact school administrator.</p>
                  <p>5. Terms and conditions include Online Payment Fee charges, Refund Policy,
                    Privacy Policy, Withdrawal from School, Governing Law, Jurisdiction etc.</p>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column
                computer={4}
                mobile={16}
                tablet={15}
                className='student-section-addstaff-button'
              >
                <Button
                  type='submit'
                  primary
                  disabled={!this.state.agreeTerms}
                  onClick={this.handleSubmitPayment}
                >
                  Continue
                </Button>
              </Grid.Column>
            </Grid.Row>

          </Grid.Column>
        </Grid.Row>
        {/* {this.props.dataLoadings ? <CircularProgress open /> : null} */}
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  studentOtherFee: state.finance.studentManagePayment.studentOtherFeeList,
  dataLoadings: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchListOtherFees: (session, alert, user) => dispatch(actionTypes.fetchOtherFeeList({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(OtherFee)))
