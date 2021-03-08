import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actionTypes from '../../store/actions'
import '../../../css/staff.css'
import { urls } from '../../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class FeeDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeDetailsData: []
    }
  }

  componentDidMount () {
    if (this.props.getList && this.props.sessionYear) {
      // console.log('stuu: ', )
      let erpValue = JSON.parse(localStorage.getItem('userDetails')).erp
      this.props.fetchRefundValue(erpValue, this.props.sessionYear, this.props.alert, this.props.user)
      this.props.fetchListFeeDetails(this.props.sessionYear, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Please fill All madatory Filled')
    }
  }

  componentDidUpdate (prevProps) {
    console.log('------------prevProps-----------', prevProps)
    console.log('sessionYear-------------', this.props.sessionYear)
    if (prevProps.sessionYear !== this.props.sessionYear && this.props.getList) {
      this.props.fetchListFeeDetails(this.props.sessionYear, this.props.alert, this.props.user)
    }
  }

  feeDetails = () => {
    axios
      .get(urls.StudentFeeDetails + '?academic_year=' + this.props.sessionYear, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        // console.log("amount",res.data[0].total)
        if (+res.status === 200) {
          this.setState({ feeDetailsData: res.data })
        }
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.StudentFeeDetails + error)
      })
  }

  render () {
    let { classes } = this.props
    let feeData = null
    let feeAmount = null
    if (this.props.listFeeDetails && this.props.listFeeDetails.length) {
      feeData = (
        this.props.listFeeDetails.map((row, i) => {
          let reAmount = 0
          if (this.props.refund.length) {
            this.props.refund.map((refund) => {
              if (row.installments && row.installments.id === refund.installment) {
                reAmount = refund.amount
              }
            })
          }
          return (
            <React.Fragment>
              <TableRow hover >
                <TableCell>{++i}</TableCell>
                <TableCell>{row.fee_type.fee_type_name}</TableCell>
                {/* <TableCell>{row.fee_type_amount}</TableCell> */}
                <TableCell>{row.discount}</TableCell>
                <TableCell>{row.installments && row.installments.installment_amount ? row.installments.installment_amount : 0}</TableCell>
                <TableCell>{reAmount}</TableCell>
                <TableCell>{row.amount_paid ? row.amount_paid : 0}</TableCell>
                <TableCell>{row.balance}</TableCell>
              </TableRow>
            </React.Fragment>
          )
        })
      )
      feeAmount = (
        <React.Fragment>
          <TableRow hover >
            <TableCell colSpan={3}>Total Amount</TableCell>
            {/* <TableCell>{this.props.listFeeDetails[0].total ? this.props.listFeeDetails[0].total : 0}</TableCell> */}
            <TableCell>{this.props.listFeeDetails ? this.props.listFeeDetails[0].total : 0}</TableCell>
          </TableRow>
        </React.Fragment>
      )
    } else {
      feeData = 'No Data'
    }
    return (

      <Grid >
        <Grid.Row>
          <Grid.Column computer={16} style={{ padding: '30px' }}>
            <Grid.Row>
              <Grid.Column
                computer={12}
                mobile={16}
                tablet={12}
                className='student-section-inputField'
              >
                <React.Fragment>
                  <div className={classes.tableWrapper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.</TableCell>
                          <TableCell>Fee Type</TableCell>
                          {/* <TableCell>Amount To Be Paid</TableCell> */}
                          <TableCell>Discount</TableCell>
                          <TableCell>Installment Amount</TableCell>
                          <TableCell>Refund</TableCell>
                          <TableCell>Paid Amount</TableCell>
                          <TableCell>Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {feeData}
                        {feeAmount}
                      </TableBody>
                    </Table>
                  </div>
                </React.Fragment>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  listFeeDetails: state.finance.studentManagePayment.feeDetailsList,
  refund: state.finance.feeStructure.refund
})

const mapDispatchToProps = dispatch => ({
  fetchListFeeDetails: (session, alert, user) => dispatch(actionTypes.fetchFeeDetailsList({ session, alert, user })),
  fetchRefundValue: (erp, session, alert, user) => dispatch(actionTypes.fetchRefundValue({ erp, session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(FeeDetails)))
