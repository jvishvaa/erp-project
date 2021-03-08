import React, { Component } from 'react'
// import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { withStyles, Button, Icon } from '@material-ui/core/'
// import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import '../../../css/staff.css'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
// import { apiActions } from '../../../../_actions'
import feeReceipts from '../../Receipts/feeReceipts'
// import storeReceipts from '../../../Inventory/Receipts/storePaymentReceipt' // rajneesh
import customClasses from './managePayment.module.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  button: {
    borderRadius: '5px',
    backgroundColor: '#2196f3',
    padding: '2px !important',
    '&:hover': {
      backgroundColor: '#0b7dda'
    }
  },
  buttonGreen: {
    borderRadius: '5px',
    backgroundColor: '#4caf50;',
    padding: '2px !important',
    marginTop: '10px !important',
    '&:hover': {
      backgroundColor: '#5fb962'
    }
  }
})

class AllTransactions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      transactionsDetails: []
    }
  }

  componentDidMount () {
    // this.allTransactionsDetails()
    // console.log('-------props---------', this.props.user)
    if (this.props.getList && this.props.sessionYear) {
      this.props.fetchAccountantTransaction(this.props.sessionYear, this.props.user, this.props.alert)
    } else {
      this.props.alert.warning('Please fill All madatory Filled')
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('------------prevProps-----------', prevProps)
    // console.log('sessionYear-------------', this.props.sessionYear)
    if (prevProps.sessionYear !== this.props.sessionYear && this.props.getList) {
      this.props.fetchAccountantTransaction(this.props.sessionYear, this.props.user, this.props.alert)
    }
  }

  allTransactionsDetails = () => {
    axios
      .get(urls.StudentAllTransactions, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.data.results)
        if (+res.status === 200) {
          this.setState({ transactionsDetails: res.data.results })
        }
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.StudentAllTransactions + error)
      })
  }

  // Generation of PDF Start
  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.props.sessionYear}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  getKitPdfData = (transactionId) => {
    return (axios.get(`${urls.StoreReceiptPdfData}?transaction_id=${transactionId}&academic_year=${this.props.sessionYear}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async (transactionId, isCancelled, isKit) => {
    try {
      if (isKit) {
        const response = await this.getKitPdfData(transactionId)
        // storeReceipts(response.data) // rajneesh
      } else {
        const response = await this.getPdfData(transactionId)
        feeReceipts(response.data, isCancelled)
      }
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Something Went Wrong')
    }
  }

  render () {
    const { classes } = this.props
    let allTransactionTable = null
    let allTransactionDetails = null
    if (this.props.allTransactionsList && this.props.allTransactionsList.results.length) {
      allTransactionDetails = this.props.allTransactionsList.results.map((transaction, index) => {
        let feeTotal = 0
        return (
          <div className={customClasses.table__bodyRecords} key={transaction.transaction_id}>
            <div className={customClasses.table__bodySno}>{index + 1}</div>
            <div className={customClasses.table__bodyTranId} style={{ overflow: 'auto' }}>{transaction.transaction_id}</div>
            <div className={customClasses.table__bodyRcptNo}>{transaction.RecepitNo}</div>
            <div className={customClasses.table__bodyDate}>{transaction.date_of_payment}</div>
            <div className={customClasses.table__bodyPymntMd}>{transaction.payment_mode}</div>
            <div className={customClasses.table__bodyFee}>
              {transaction.Fee_type.map((fee, i) => {
                feeTotal += fee.paid_amount
                return (
                  <div className={customClasses.table__bodyFeeTyp} key={i + fee['fee-type-installment']}>
                    <div className={customClasses.table__bodyFeeTypItem}>{fee['fee-type-installment']}</div>
                    <div className={customClasses.table__bodyAmnt}>{fee.paid_amount}</div>
                  </div>
                )
              })}
            </div>
            <div className={customClasses.table__bodyTotal}>{feeTotal}</div>
            <div className={customClasses.table__bodyActn}>
              <div>
                <Button variant='extended' color='primary' className={classes.buttonGreen} onClick={() => this.generatePdf(transaction.transaction_id, transaction.is_cancelled, transaction.kit_payment)}>
                  <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'normal', textAlign: 'center' }}>Print</span>
                  <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}></Icon>
                </Button>
              </div>
            </div>
          </div>
        )
      })
    }
    if (this.props.allTransactionsList && this.props.allTransactionsList.results.length) {
      allTransactionTable = (
        <div className={customClasses.table}>
          <div className={customClasses.table__head}>All Payments</div>
          <div className={customClasses.table__heading}>
            <div className={customClasses.table__headingSno}>S.No</div>
            <div className={customClasses.table__headingTranId}>Transaction Id</div>
            <div className={customClasses.table__headingRcptNo}>Receipt No</div>
            <div className={customClasses.table__headingDate}>Date Of Payment</div>
            <div className={customClasses.table__headingPymntMd}>Payment Mode</div>
            <div className={customClasses.table__headingFee}>
              <div className={customClasses.table__headingFeeTyp}>
                <div className={customClasses.table__headingFeeTypItem} >Fee Type</div>
                <div className={customClasses.table__headingAmnt}>Amount Paid</div>
              </div>
            </div>
            <div className={customClasses.table__headingTotal}>Total</div>
            <div className={customClasses.table__headingActn}>Action</div>
          </div>
          <div className={customClasses.table__body}>
            {allTransactionDetails}
          </div>
        </div>
      )
    }
    return (
      <div>
        {allTransactionTable}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  allTransactionsList: state.finance.accountantReducer.payment.allTransactions
})

const mapDispatchToProps = dispatch => ({
  // fetchListAllTransactions: (alert, user) => dispatch(actionTypes.fetchAllTransactionsList({ alert, user }))
  fetchAccountantTransaction: (session, user, alert) => dispatch(actionTypes.fetchAccountantTransaction({ session, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AllTransactions)))
