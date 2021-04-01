import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'

import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../../store/actions/index'
import feeReceiptss from '../../../Receipts/feeReceiptss'
import { urls } from '../../../../../urls'
import customClasses from './chequePayments.module.css'
import Modal from '../../../../../ui/Modal/modal'
import ChequeBounce from './chequeBounce'

const styles = theme => ({
  button: {
    borderRadius: '5px',
    backgroundColor: '#2196f3',
    padding: '2px !important',
    '&:hover': {
      backgroundColor: '#0b7dda'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  buttonGreen: {
    borderRadius: '5px',
    backgroundColor: '#4caf50',
    padding: '2px !important',
    marginTop: '10px !important',
    '&:hover': {
      backgroundColor: '#5fb962'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  buttonRed: {
    borderRadius: '5px',
    backgroundColor: '#e53935',
    padding: '2px !important',
    marginTop: '10px !important',
    '&:hover': {
      backgroundColor: '#b71c1c'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  }
})
class ChequePayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showBounceModal: false,
      transBounceModalId: null,
      chequeBounce: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('here i amm after update: ', nextProps)
    if (nextProps.erpNo === this.props.erpNo &&
        nextProps.session === this.props.session &&
        nextProps.getData === this.props.getData &&
        this.props.chequeTransactions === nextProps.chequeTransactions &&
        this.props.dataLoading === nextProps.data) {
      return false
    }
    return nextProps.getData
  }

  componentDidMount () {
    const erpLength = (this.props.erpNo + '').length
    if (!this.props.erpNo || !this.props.session || !this.props.getData) {
      return
    }
    const {
      erpNo,
      session,
      alert,
      user,
      branchId,
      moduleId
    } = this.props
    this.props.fetchChequeTransaction(erpNo, session, user, alert, branchId, moduleId)
  }

  componentDidUpdate (prevProps) {
    console.log('the receivede data: ', this.props.chequeResponse)
    const erpLength = (this.props.erpNo + '').length
    if (!this.props.erpNo || !this.props.session || !this.props.getData) {
      return
    }
    if (this.props.erpNo === prevProps.erpNo && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    const {
      erpNo,
      session,
      alert,
      user,
      branchId,
      moduleId
    } = this.props
    if (this.props.getData && (erpNo !== prevProps.erpNo || session !== prevProps.session || this.props.getData)) {
      this.props.fetchChequeTransaction(erpNo, session, user, alert, branchId, moduleId)
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('nextProps: ', nextProps)
  //   if (nextProps.chequeResponse) {
  //     const {
  //       erpNo,
  //       session,
  //       alert,
  //       user
  //     } = this.props
  //     this.props.fetchChequeTransaction(erpNo, session, user, alert)
  //   }
  // }

  getPdfData = (transactionId) => {
    return (axios.get(`${urls.FeeTransactionReceipt}?transaction_id=${transactionId}&academic_year=${this.props.session}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async (transactionId, isCancelled) => {
    try {
      const response = await this.getPdfData(transactionId)
      feeReceiptss(response.data, isCancelled)
    } catch (e) {
      console.log(e)
      this.props.alert.warning('Something Went Wrong')
    }
  }

  showBounceModalHandler = (id, bounce) => {
    this.setState({ transBounceModalId: id, showBounceModal: true, chequeBounce: bounce })
  }

  hideBounceModalHandler = () => {
    this.setState({ showBounceModal: false }, () => {
      // const {
      //   erpNo,
      //   session,
      //   alert,
      //   user
      // } = this.props
      // this.props.fetchChequeTransaction(erpNo, session, user, alert)
    })
  }

  render () {
    const { classes } = this.props
    let transactionTable = null
    let transactionData = null
    let bounceModal = null

    if (this.state.showBounceModal) {
      bounceModal = (
        <Modal open={this.state.showBounceModal} click={this.hideBounceModalHandler} large>
          <h3 className={classes.modal__heading}>Cheque Bounce</h3>
          <hr />
          <ChequeBounce close={this.hideBounceModalHandler} chequeBounce={this.state.chequeBounce} transId={this.state.transBounceModalId} erp={this.props.erpNo} session={this.props.session} alert={this.props.alert} user={this.props.user} branchId={this.props.branchId}/>
        </Modal>
      )
    }

    if (this.props.chequeTransactions && this.props.chequeTransactions.length) {
      transactionData = this.props.chequeTransactions.map((transaction, index) => {
        let feeTotal = 0
        return (
          <div className={customClasses.table__bodyRecords} key={transaction.transaction_id}>
            <div className={customClasses.table__bodySno}>{index + 1}</div>
            <div className={customClasses.table__bodyChqNo}>{transaction.cheque_number}</div>
            <div className={customClasses.table__bodyChqDate}>{transaction.cheque_date}</div>
            <div className={customClasses.table__bodyTranId}>{transaction.transaction_id}</div>
            <div className={customClasses.table__bodyRcptDate}>{transaction['ReceiptDate']}</div>
            <div className={customClasses.table__bodyRecon}>{transaction.is_bounced ? 'Bounced' : 'N/A'}</div>
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
                {/* <Button disabled={transaction.is_bounced || transaction.is_cancelled} variant='extended' color='primary' className={classes.button}>
                  <span style={{ color: 'white', marginRight: '5px', fontSize: '1rem', fontWeight: 'normal' }}>Edit</span>
                  <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}></Icon>
                </Button> */}
                <Button variant='extended' color='primary' className={classes.buttonGreen} onClick={() => this.generatePdf(transaction.transaction_id, (transaction.is_bounced || transaction.is_cancelled))}>
                  <span style={{ color: 'white', marginRight: '5px', fontSize: '1rem', fontWeight: 'normal' }}>Print</span>
                  <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}></Icon>
                </Button>
                <Button variant='extended' color='primary' className={classes.buttonRed} onClick={() => { this.showBounceModalHandler(transaction.transaction_id, transaction.is_bounced) }}>
                  <span style={{ color: 'white', marginRight: '5px', fontSize: '1rem', fontWeight: 'normal' }}>{ transaction.is_bounced ? 'Edit Bounce Details' : 'Bounce' }</span>
                  <Icon className={classes.rightIcon} style={{ color: 'white', fontSize: '1.2rem' }}></Icon>
                </Button>
              </div>
            </div>
          </div>
        )
      })
    }
    // let cond = true
    if (this.props.chequeTransactions && this.props.chequeTransactions.length) {
      transactionTable = (
        <div className={customClasses.table}>
          <div className={customClasses.table__head}>Cheque Payments</div>
          <div className={customClasses.table__heading}>
            <div className={customClasses.table__headingSno}>S.No</div>
            <div className={customClasses.table__headingChqNo}>Cheque No.</div>
            <div className={customClasses.table__headingChqDate}>Cheque Date</div>
            <div className={customClasses.table__headingTranId}>Transaction ID</div>
            <div className={customClasses.table__headingRcptDate}>Receipt Date</div>
            <div className={customClasses.table__headingRecon}>Reconciliation Status</div>
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
            {transactionData}
          </div>
        </div>
      )
    }
    return (
      <div>
        {transactionTable}
        {bounceModal}
        <hr />
        <div className={customClasses.totalAmount}>
          <p>Total Amount: {this.props.chequeTotal ? this.props.chequeTotal : 0}</p>
        </div>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  chequeTransactions: state.finance.accountantReducer.chequePayment.allChequeTransactions,
  chequeTotal: state.finance.accountantReducer.chequePayment.total,
  chequeResponse: state.finance.accountantReducer.chequePayment.sentData,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  fetchChequeTransaction: (erpNo, session, user, alert, branchId, moduleId) => dispatch(actionTypes.fetchAccountantChequeTransaction({ erpNo, session, user, alert, branchId, moduleId }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChequePayment))
