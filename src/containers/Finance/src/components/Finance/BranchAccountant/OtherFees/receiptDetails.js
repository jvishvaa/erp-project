import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Select from 'react-select'
import { withStyles, Radio, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core/'
import { Info } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import '../../../css/staff.css'
// import MakePayment from './makePayment'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class ReceiptDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPayment: 'a',
      selectedReceipt: 'online',
      todayDate: '',
      isOnlineReceipt: false,
      isChequePaper: false,
      isInternetPaper: false,
      isCreditPaper: false,
      isTrans: false,
      confirm: false,
      currentData: [],
      payment: {
        cheque: {
          chequeNo: null,
          chequeDate: null,
          // searchBy: null,
          ifsc: null,
          micr: null,
          chequeName: null,
          chequeBankName: null,
          chequeBankBranch: null
        },
        internet: {
          internetDate: null,
          remarks: null
        },
        credit: {
          digits: null,
          creditDate: null,
          approval: null,
          bankName: null,
          creditRemarks: null
        },
        isOnline: true,
        isOffline: false,
        transid: null,
        receiptNo: null,
        receiptOnline: null,
        dateOfPayment: null
      }
    }
    this.handlePayment = this.handlePayment.bind(this)
    this.handleReceipt = this.handleReceipt.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.internetDataHandler = this.internetDataHandler.bind(this)
    this.creditDataHandler = this.creditDataHandler.bind(this)
    this.handleReceiptData = this.handleReceiptData.bind(this)
    this.creditTypeHandler = this.creditTypeHandler.bind(this)
    // this.paymentDate = this.paymentDate.bind(this)
  }

  componentDidMount () {
    console.log('-----data----------------', this.props.erp, this.props.session)
    this.props.getMesaage(this.props.session, this.props.erp, this.props.alert, this.props.user)
    let currentData = this.props.otherFeesList.filter(val => val.id === this.props.otherFeeId)
    this.setState({
      currentData: currentData
    })
    console.log(currentData)
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 // January is 0!
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd
    this.setState({ todayDate: today })
    this.setState(Object.assign(this.state.payment, { dateOfPayment: today }))
  }

  // componentWillMount() {
  //     this.initialState = this.state
  // }

  componentDidUpdate () {
    console.log('--------New State------------')
    console.log(this.state.payment)
  }

    handlePayment = event => {
      if (event.target.value === 'b') {
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: true,
          isInternetPaper: false,
          isCreditPaper: false,
          isTrans: false
        })
      } else if (event.target.value === 'c') {
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: true,
          isCreditPaper: false,
          isTrans: true
        })
      } else if (event.target.value === 'd') {
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: true,
          isTrans: false
        })
      } else if (event.target.value === 'a') {
        this.setState({
          selectedPayment: event.target.value,
          isChequePaper: false,
          isInternetPaper: false,
          isCreditPaper: false,
          isTrans: false
        })
      }
    };

    handleReceipt = event => {
      this.setState({ selectedReceipt: event.target.value })
      if (event.target.value === 'manual') {
        // this.setState({payment.isOffline : true})
        this.setState({ isOnlineReceipt: true })
        this.state.payment.isOffline = true
        this.state.payment.isOnline = false
      } else {
        this.setState({ isOnlineReceipt: false })
        this.state.payment.isOffline = false
        this.state.payment.isOnline = true
      }
    };

    chequeDataHandler = (event) => {
      const newPayment = { ...this.state.payment }
      const newCheque = { ...newPayment.cheque }
      switch (event.target.name) {
        case 'chequeNo': {
          // validation can be done here.
          newCheque['chequeNo'] = event.target.value
          break
        }
        case 'chequeDate': {
          newCheque['chequeDate'] = event.target.value
          break
        }
        case 'chequeName': {
          newCheque['chequeName'] = event.target.value
          break
        }
        case 'ifsc': {
          newCheque['ifsc'] = event.target.value
          break
        }
        case 'micr': {
          newCheque['micr'] = event.target.value
          break
        }
        case 'chequeBankName': {
          newCheque['chequeBankName'] = event.target.value
          break
        }
        case 'chequeBankBranch': {
          newCheque['chequeBankBranch'] = event.target.value
          break
        }
        default: {

        }
      }
      newPayment.cheque = newCheque
      this.setState({
        payment: newPayment
      })
    }

    internetDataHandler = (event) => {
      const newPayment = { ...this.state.payment }
      const newinternet = { ...newPayment.internet }
      switch (event.target.name) {
        case 'internetDate': {
          newinternet['internetDate'] = event.target.value
          break
        }
        case 'remarks': {
          newinternet['remarks'] = event.target.value
          break
        }
        default: {

        }
      }
      newPayment.internet = newinternet
      this.setState({
        payment: newPayment
      })
    }

    creditDataHandler= (event) => {
      const newPayment = { ...this.state.payment }
      const newcredit = { ...newPayment.credit }
      switch (event.target.name) {
        case 'creditDate': {
          newcredit['creditDate'] = event.target.value
          break
        }
        case 'digits': {
          newcredit['digits'] = event.target.value
          break
        }
        case 'approval': {
          newcredit['approval'] = event.target.value
          break
        }
        case 'bankName': {
          newcredit['bankName'] = event.target.value
          break
        }
        case 'creditRemarks': {
          newcredit['creditRemarks'] = event.target.value
          break
        }
        default: {

        }
      }
      newPayment.credit = newcredit
      this.setState({
        payment: newPayment
      })
    }

    creditTypeHandler = (event) => {
      this.state.payment.credit.credit = event.value
    }

    handleReceiptData = (event) => {
      switch (event.target.name) {
        case 'receiptNo': {
          this.setState(Object.assign(this.state.payment, { receiptNo: event.target.value }))
          break
        }
        case 'receiptOnline': {
          this.setState(Object.assign(this.state.payment, { receiptOnline: event.target.value }))
          break
        }
        case 'transid': {
          this.setState(Object.assign(this.state.payment, { transid: event.target.value }))
          break
        }
        case 'dateOfPayment': {
          this.setState(Object.assign(this.state.payment, { dateOfPayment: event.target.value }))
          break
        }
        default: {

        }
      }
    }

    // dopHandler = () => {

    // }

    dataIsSuitableToSend = (data) => {
      let suited = true
      Object.keys(data).forEach((keys) => {
        if (data[keys] === null) {
          // this.setState({validation : false}, ()=>{return false})
          suited = false
          return undefined
        }
      })
      return suited
    }

    handleConfirm = (event) => {
      let dataToSend = null
      if (this.state.isChequePaper) {
        if (!this.dataIsSuitableToSend(this.state.payment.cheque)) {
          this.props.alert.warning('Please Fill all the fields')
          this.setState({ confirm: false })
          return
        }
        dataToSend = {
          mode: 2,
          // payment: {...this.state.payment.cheque},
          payment: { ...this.state.payment },
          current_date: this.state.todayDate
        }
      } else if (this.state.isInternetPaper) {
        if (!this.dataIsSuitableToSend(this.state.payment.internet)) {
          this.props.alert.warning('Please Fill all the fields')
          this.setState({ confirm: false })
          return
        }
        dataToSend = {
          mode: 3,
          // payment: {...this.state.payment.internet},
          payment: { ...this.state.payment },
          current_date: this.state.todayDate
        }
      } else if (this.state.isCreditPaper) {
        if (!this.dataIsSuitableToSend(this.state.payment.credit)) {
          this.props.alert.warning('Please Fill all the fields')
          this.setState({ confirm: false })
          return
        }
        dataToSend = {
          mode: 4,
          // payment: {...this.state.payment.credit},
          payment: { ...this.state.payment },
          current_date: this.state.todayDate
        }
      } else {
        dataToSend = {
          mode: 1,
          payment: { ...this.state.payment },
          current_date: this.state.todayDate
        }
      }

      // if (this.state.isOnline) {
      //   if (!this.state.payment.receiptNo) {
      //     this.props.alert.warning('Please Fill Receipt number')
      //     return false
      //   }
      // } else
      // if (this.state.isOffline) {
      //   if (!this.state.payment.receiptNo) {
      //     this.props.alert.warning('Please Fill all the field')
      //     return false
      //   }
      // }
      if (!this.state.payment.receiptNo && this.state.isOnlineReceipt) {
        this.props.alert.warning('Please fill all the fields!')
        return false
      }

      if (this.state.dateOfPayment === null) {
        this.props.alert.warning('Please select date of payment')
        return false
      }

      if (event.target.checked) {
        this.setState({ confirm: true }, () => {
          this.props.getDetail(this.state.confirm, dataToSend)
        })
      } else {
        this.setState({ confirm: false }, () => {
          this.props.getDetail(this.state.confirm)
        })
      }
    }

    render () {
      // let { classes } = this.props
      // const { classes } = this.props;
      console.log('-------message-----------', this.props.rangeMessage)
      let longText
      if (this.props.rangeMessage && this.props.rangeMessage.manual.length > 0 && this.state.isOnlineReceipt) {
        longText = (
          this.props.rangeMessage.manual.map(val => {
            console.log('------value-----', val)
            return (
              <p style={{ fontWeight: 'bold', fontSize: '15px' }}>Range is between {val.range_from ? val.range_from : ''} & {val.range_to ? val.range_to : ''}</p>
            )
          })
        )
      } else if (this.props.rangeMessage && this.props.rangeMessage.online.length > 0 && !this.state.isOnlineReceipt) {
        longText = (
          this.props.rangeMessage.online.map(val => {
            console.log('------value-----', val)
            return (
              <p style={{ fontWeight: 'bold', fontSize: '15px' }}>Range is between {val.range_from ? val.range_from : ''} & {val.range_to ? val.range_to : ''}</p>
            )
          })
        )
      } else {
        longText = 'Receipt Number is not assigned'
      }
      return (
        <Grid style={{ padding: '25px' }}>
          <Grid.Row>
            <Grid.Column computer={16} className='student-addStudent-StudentSection'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Account</TableCell>
                    <TableCell>Fee Type Name</TableCell>
                    <TableCell>Sub Type</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <React.Fragment>
                    {this.state.currentData
                      ? this.state.currentData.map((row, i) => {
                        return (
                          <TableRow>
                            <TableCell>{row.other_fee.fee_account ? row.other_fee.fee_account.fee_account_name : ''}</TableCell>
                            <TableCell>{row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                            <TableCell>{row.other_fee.sub_type ? row.other_fee.sub_type : ''}</TableCell>
                            <TableCell>{row.due_date ? row.due_date : ''}</TableCell>
                            <TableCell>{row.paid_amount ? row.paid_amount : 0}</TableCell>
                            <TableCell>{row.other_fee.amount ? row.other_fee.amount : 0}</TableCell>
                            <TableCell>{row.balance ? row.balance : 0}</TableCell>
                          </TableRow>
                        )
                      })
                      : null
                    }

                  </React.Fragment>
                </TableBody>
              </Table>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column computer={16}>
              <div style={{ fontSize: '16px' }}>
                  Total Selected Amount: {this.props.amountToBePaid}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Payment Mode:</strong>
            </Grid.Column>
            <Grid.Column computer={3}>
              <Radio
                checked={this.state.selectedPayment === 'a'}
                onChange={this.handlePayment}
                value='a'
                name='radio-button-demo'
                aria-label='Cash'
              /> Cash
            </Grid.Column>
            <Grid.Column computer={3}>
              <Radio
                checked={this.state.selectedPayment === 'b'}
                onChange={this.handlePayment}
                value='b'
                name='radio-button-demo'
                aria-label='Cash'
              /> Cheque
            </Grid.Column>
            <Grid.Column computer={4}>
              <Radio
                checked={this.state.selectedPayment === 'c'}
                onChange={this.handlePayment}
                value='c'
                name='radio-button-demo'
                aria-label='Cash'
              /> Internet Payment
            </Grid.Column>
            <Grid.Column computer={4}>
              <Radio
                checked={this.state.selectedPayment === 'd'}
                onChange={this.handlePayment}
                value='d'
                name='radio-button-demo'
                aria-label='Cash'
              /> Credit / Debit Card
            </Grid.Column>
          </Grid.Row>
          {this.state.isChequePaper === true
            ? <Grid.Row>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
                <Grid.Column computer={4} style={{ flexGrow: 2 }}>
                  <label>Cheque No.</label>
                  <input
                    name='chequeNo'
                    type='number'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeNo ? this.state.payment.cheque.chequeNo : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Cheque Date.</label>
                  <input
                    name='chequeDate'
                    type='date'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeDate ? this.state.payment.cheque.chequeDate : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                {/* <Grid.Column computer={4}>
                            <label>Search By</label>
                            <input
                                name='searchBy'
                                type='dropdown'
                                className='form-control'
                                style={{ width: '200px' }}
                                value={this.state.payment.cheque.searchBy ? this.state.payment.cheque.searchBy : ''}
                                onChange={this.chequeDataHandler} />
                        </Grid.Column> */}
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>IFSC</label>
                  <input
                    name='ifsc'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.ifsc ? this.state.payment.cheque.ifsc : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>MICR Code</label>
                  <input
                    name='micr'
                    type='number'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.micr ? this.state.payment.cheque.micr : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Name on Cheque</label>
                  <input
                    name='chequeName'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeName ? this.state.payment.cheque.chequeName : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Bank Name</label>
                  <input
                    name='chequeBankName'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeBankName ? this.state.payment.cheque.chequeBankName : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Bank Branch</label>
                  <input
                    name='chequeBankBranch'
                    type='text'
                    className='form-control'
                    style={{ width: '200px' }}
                    value={this.state.payment.cheque.chequeBankBranch ? this.state.payment.cheque.chequeBankBranch : ''}
                    onChange={this.chequeDataHandler} />
                </Grid.Column>
              </div>
            </Grid.Row>

            : null
          }
          {this.state.isInternetPaper === true
            ? <Grid.Row>
              <Grid.Column computer={4}>
                <label>Date: </label>
                <input
                  name='internetDate'
                  type='date'
                  className='form-control'
                  style={{ width: '200px' }}
                  value={this.state.payment.internet.internetDate ? this.state.payment.internet.internetDate : ''}
                  onChange={this.internetDataHandler} />
              </Grid.Column>
              <Grid.Column computer={4}>
                <label>Remarks.</label>
                <input
                  name='remarks'
                  type='text'
                  className='form-control'
                  value={this.state.payment.internet.remarks ? this.state.payment.internet.remarks : ''}
                  style={{ width: '200px' }}
                  onChange={this.internetDataHandler} />
              </Grid.Column>
            </Grid.Row>
            : null}
          {this.state.isCreditPaper === true
            ? <Grid.Row>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
                <Grid.Column computer={4} style={{ flexGrow: 2, marginRight: '15px' }}>
                  <label>Credit*</label>
                  <Select
                    onChange={this.creditTypeHandler}
                    name='credit'
                    // value={{
                    //     value: 2,
                    //     label: "Debit"
                    // }}
                    options={[
                      {
                        value: 1,
                        label: 'Credit'
                      },
                      {
                        value: 2,
                        label: 'Debit'
                      }
                    ]}
                  />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Credit Date</label>
                  <input
                    name='creditDate'
                    type='date'
                    className='form-control'
                    value={this.state.payment.credit.creditDate ? this.state.payment.credit.creditDate : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Card Last 4 Digits*</label>
                  <input
                    name='digits'
                    type='number'
                    className='form-control'
                    value={this.state.payment.credit.digits ? this.state.payment.credit.digits : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Approval Code.</label>
                  <input
                    name='approval'
                    type='number'
                    className='form-control'
                    value={this.state.payment.credit.approval ? this.state.payment.credit.approval : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Bank Name.</label>
                  <input
                    name='bankName'
                    type='text'
                    className='form-control'
                    value={this.state.payment.credit.bankName ? this.state.payment.credit.bankName : ''}

                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
                <Grid.Column computer={4} style={{ flexGrow: 1 }}>
                  <label>Remarks.</label>
                  <input
                    name='creditRemarks'
                    type='text'
                    className='form-control'
                    value={this.state.payment.credit.creditRemarks ? this.state.payment.credit.creditRemarks : ''}
                    onChange={this.creditDataHandler}
                    style={{ width: '200px' }} />
                </Grid.Column>
              </div>
            </Grid.Row>
            : null}
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Receipt Type:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              <Radio
                checked={this.state.selectedReceipt === 'online'}
                onChange={this.handleReceipt}
                value='online'
                name='online'
                aria-label='Cash'
              /> Online
            </Grid.Column>
            <Grid.Column computer={3}>
              <Radio
                checked={this.state.selectedReceipt === 'manual'}
                onChange={this.handleReceipt}
                value='manual'
                name='manual'
                aria-label='Cash'
              /> Manual
            </Grid.Column>
          </Grid.Row>
          {this.state.isTrans === true
            ? <Grid.Row>
              <Grid.Column computer={2}>
                <strong>Transaction ID*:</strong>
              </Grid.Column>
              <Grid.Column computer={4}>
                <input
                  name='transid'
                  type='text'
                  className='form-control'
                  value={this.state.payment.transid ? this.state.payment.transid : ''}
                  onChange={this.handleReceiptData}
                  style={{ width: '200px' }} />
              </Grid.Column>
            </Grid.Row>
            : null
          }
          {this.state.isOnlineReceipt ? <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Receipt Number:</strong>
            </Grid.Column>
            <Grid.Column computer={3}>
              <input
                name='receiptNo'
                type='number'
                className='form-control'
                value={this.state.payment.receiptNo ? this.state.payment.receiptNo : ''}
                onChange={this.handleReceiptData}
                style={{ width: '200px' }} />
            </Grid.Column>
            <Grid.Column computer={4}>
              <Tooltip TransitionComponent={Zoom} title={longText}>
                <Button style={{ maxWidth: '300' }}><Info /></Button>
              </Tooltip>
            </Grid.Column>
          </Grid.Row> : null}
          {/* displayed only if opted manual */}
          {/* {this.state.isOnlineReceipt === true
            ? <Grid.Row>
              <Grid.Column computer={2}>
                <strong>Receipt Number online:</strong>
              </Grid.Column>
              <Grid.Column computer={3}>
                <input
                  name='receiptOnline'
                  type='number'
                  className='form-control'
                  value={this.state.payment.receiptOnline ? this.state.payment.receiptOnline : ''}
                  onChange={this.handleReceiptData}
                  style={{ width: '200px' }} />
              </Grid.Column>
            </Grid.Row>
            : null
          } */}
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Date of Payment:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              <input
                name='dateOfPayment'
                type='date'
                className='form-control'
                style={{ width: '200px' }}
                value={this.state.payment.dateOfPayment ? this.state.payment.dateOfPayment : this.state.todayDate}
                onChange={this.handleReceiptData} />
              {/* <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p> */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={2}>
              <strong>Current Date:</strong>
            </Grid.Column>
            <Grid.Column computer={4}>
              {/* <input type="text" value= readonly /> */}
              <p style={{ fontSize: '16px' }}>{this.state.todayDate}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <input type='checkbox'
                name='confirm'
                onChange={this.handleConfirm}
                checked={this.state.confirm} />
                Confirm Payment Details
            </Grid.Column>
          </Grid.Row>
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </Grid>
      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  otherFeesList: state.finance.accountantReducer.listOtherFee.accountantOtherFees,
  rangeMessage: state.finance.accountantReducer.listOtherFee.receiptRangeMessage,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  getMesaage: (session, erp, alert, user) => dispatch(actionTypes.receiptMessage({ session, erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ReceiptDetails)))
