import React, { Component } from 'react'
import { Grid, Divider } from 'semantic-ui-react'
import { withStyles, Button, Table, Paper, TableBody, Modal,  TableCell, TableHead, TableRow, FormControlLabel, Checkbox, TextField, Switch } from '@material-ui/core/'
import CancelIcon from '@material-ui/icons/Cancel'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import Modal from '../../../../ui/Modal/modal'
import { urls } from '../../../../urls'
import '../../../css/staff.css'
import '../managePayment/makePayment.css'
import * as actionTypes from '../../store/actions'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})
// const display = {
//   display: 'block'
// }
// const hide = {
//   display: 'none'
// }
const Accept = {
  color: 'green'
}
const Rejected = {
  color: 'red'
}
const Pending = {
  color: 'blue'
}
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const BranchIdBangalore = [ 10, 8, 7, 57, 12, 18, 17, 21, 27, 24, 67, 72, 81, 82, 92, 77, 69, 14 ]
const BranchIdMumbai = [70, 26, 3, 15, 11, 13, 22, 4, 67, 41, 5, 6, 73, 76]

class MakePayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      todayDate: '',
      agreeTerms: false,
      select: false,
      makePaymentDetails: [],
      amountToBePaid: {},
      checkedAccount: null,
      checkedInstallments: [],
      isSelected: {},
      feeType: {},
      checkedPrint: false,
      isOpen: false,
      partialAmount: {},
      dataObj: {},
      statusMakePyments: {},
      isModelData: false,
      allDataDetails: [],
      imgView: '',
      showImg: false,
      isWalletAgree: false,
      cancelModal: false,
      cancelRemark: '',
      feeTypes: '',
      otherFee: '',
      installId: '',
      otherFeeinstId: '',
      upiId: '',
      studentId: null
    }
    this.currBrnch = JSON.parse(localStorage.getItem('userDetails')).branch_id
    this.erp = JSON.parse(localStorage.getItem('userDetails')).erp
  }
  componentDidMount () {
    console.log(this.props.sessionYear, this.props.getList)
    this.props.fetchNormalWallet(this.props.sessionYear, this.props.erp, this.props.alert, this.props.user)
    this.todayDate()
    if (this.props.sessionYear || this.props.status) {
      this.props.statusMakePaymentList(this.props.sessionYear, this.props.erp, this.props.alert, this.props.user)
    }
    if (this.props.getList && this.props.sessionYear) {
      this.props.fetchListMakePayment(this.props.sessionYear, this.props.alert, this.props.user)
      // this.props.fetchWalletInfo(this.props.sessionYear, this.props.erp, this.props.alert, this.props.user)
      this.props.isPartialPay(this.props.sessionYear, this.props.gradeId, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Please fill All madatory Filled')
    }
  }
  changedHandler = name => event => {
    const amount = this.calculateTotal()
    if (amount === 0) {
      this.props.alert.warning('Can not Proceed with 0 Amount!')
    } else {
      this.setState({ [name]: event.target.checked })
    }
  }
  componentDidUpdate (prevProps) {
    console.log('did update: ', this.state.isSelected, this.state.partialAmount)
    if ((prevProps.sessionYear !== this.props.sessionYear && this.props.getList)) {
      this.props.fetchListMakePayment(this.props.sessionYear, this.props.alert, this.props.user)
    } else if (this.props.paymentStatus && this.props.orderId && this.props.amount) {

    }
  }

  agreeWalletPayment = (event) => {
    console.log('agree wallet: ', event.target.checked)
    this.setState((prevState) => ({
      isWalletAgree: !prevState.isWalletAgree
    }))
  }

  todayDate = () => {
    let today = new Date()
    let dd = today.getDate()
    console.log(today.getMonth())
    let mm = monthNames[today.getMonth()] // January is 0!
    let yyyy = today.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    today = dd + ' ' + mm + ',' + yyyy
    this.setState({ todayDate: today }, console.log(this.state.todayDate))
  }

  partialAmountHandler = (e, id) => {
    console.log('e and id', e, id)
    let ppValid = true
    let { partialAmount } = this.state

    const rowData = this.props.makePaymentList[0].Installments_data.filter(list => (list.id === id))
    rowData.map(validate => {
      if ((validate.balance < +e.target.value) && (+e.target.value > 0)) {
        this.props.alert.warning('Amount cant be greater than balance!')
        ppValid = false
        return false
      }
    })

    if (ppValid) {
      this.setState({ partialAmount: { ...partialAmount, [id]: +e.target.value } })
    } // 1908010049
  }

  handleSubmitPayment = e => {
    const dataArr = Object.keys(this.state.isSelected).map(item => (
      this.state.isSelected[item]
    )).reduce((arr, item) => {
      if (item.length) {
        arr = [...arr, ...item]
      }
      return arr
    }, [])
    console.log('dataArr: ', dataArr)
    const dataObj = dataArr.reduce((obj, item) => {
      if (item.isOtherFee) {
        obj.otherFee.push({
          id: item.id,
          amount: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? this.state.partialAmount[item.id] : item.amount,
          other_fee_installments: item.installmentId,
          other_fee: item.feeTypeId,
          balance: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? item.amount - this.state.partialAmount[item.id] : 0
        })
      } else {
        obj.normalFee.push({
          id: item.id,
          amount: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? this.state.partialAmount[item.id] : item.amount,
          balance: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? item.amount - this.state.partialAmount[item.id] : 0,
          fee_type: item.feeTypeId,
          installment_id: item.installmentId
        })
      }
      return obj
    }, {
      otherFee: [],
      normalFee: []
    })
    let wal = null
    if (this.props.walletInfo.length) {
      wal = {
        wallet_agree: this.state.isWalletAgree,
        wallet_data: this.props.walletInfo[0],
        payment_mode: 6,
        wallet_amount_taken: this.state.isWalletAgree && this.props.walletInfo.length && (this.calculateTotal() <= this.props.walletInfo[0].reaming_amount) ? this.calculateTotal() : this.state.isWalletAgree && (this.calculateTotal() >= this.props.walletInfo[0].reaming_amount) ? this.props.walletInfo[0].reaming_amount : 0
      }
    }
    this.props.history.replace({
      pathname: '/fee_payment/',
      state: {
        session_year: this.props.sessionYear,
        student: this.props.erp,
        date_of_payment: new Date().toISOString().substr(0, 10),
        current_date: new Date().toISOString().substr(0, 10),
        normal_fee_amount: dataObj.normalFee,
        other_fee_amount: dataObj.otherFee,
        fee_account_id: this.state.checkedAccount,
        is_partial_payment: !!Object.keys(this.state.partialAmount).length,
        // total_paid_amount: this.calculateTotal(),
        total_paid_amount: this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount >= this.calculateTotal()) ? +(this.calculateTotal()).toFixed(2) : this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount < this.calculateTotal()) ? +(this.calculateTotal() - this.props.walletInfo[0].reaming_amount).toFixed(2) : this.calculateTotal(),
        ...this.props.walletInfo.length && this.state.isWalletAgree ? wal : null
      },
      user: this.props.user,
      url: this.props.walletInfo.length && this.state.isWalletAgree && (this.props.walletInfo[0].reaming_amount >= this.calculateTotal()) ? urls.CreateMakePaymentAcc : urls.AirpayPayment
    })
    // this.props.makePayment(data, this.props.alert, this.props.user)
  }

  componentWillUnmount () {
    this.props.clearUnrelevantData()
  }

  handleCheckBox = (event, feeTypeVal, index, installmentsIds) => {
    console.log('feeTypeVal', feeTypeVal)
    if (!event.target.checked) {
      console.log(this.calculateTotal())
      const isSelected = { ...this.state.isSelected }
      const amountToBePaid = { ...this.state.amountToBePaid }
      amountToBePaid[feeTypeVal] = 0
      isSelected[feeTypeVal] = []
      this.setState({
        // checkedInstallments: [],
        isSelected,
        amountToBePaid
      })
      return
    }
    const isSelected = { ...this.state.isSelected }
    console.log(this.state.isSelected)
    const relativeIndex = this.getRelativeIndex(feeTypeVal, index)
    const selectedElements = this.state.feeType[feeTypeVal].filter((item, i) => (
      i <= (relativeIndex) && (item.upload_status !== 2)
    )).map(item => ({
      id: item.id,
      isOtherFee: item.is_other_fee,
      amount: item.balance,
      installmentId: item.installments_id,
      feeTypeId: item.fee_type_id,
      balance: item.balance
    }))
    console.log('selected ele: ', selectedElements)
    isSelected[feeTypeVal] = selectedElements
    console.log('isselected: ', isSelected)
    const changedAmount = isSelected[feeTypeVal].reduce((acc, item) => {
      return acc + item.amount
    }, 0)
    console.log('changedAmount', changedAmount)
    const amountToBePaid = { ...this.state.amountToBePaid }
    amountToBePaid[feeTypeVal] = changedAmount
    console.log('amountToBePaid', amountToBePaid)
    this.setState({
      isSelected,
      amountToBePaid
    })
  }

  handleClick = () => {
    this.setState({ modelData: false })
  }

  isCheckedValue = (feeType, id, isPending, statusData) => {
    return this.state.isSelected[feeType].find(item => +item.id === +id)
  }

  getRelativeIndex = (feeType, index, installmentsId) => {
    const relativeIndex = this.props.makePaymentList.filter((item) => (
      item.fee_account_id === this.state.checkedAccount
    ))[0].Installments_data.filter((item, i) => {
      return ((item.fee_type === feeType) && (i <= index))
    }).length
    console.log(relativeIndex)
    return relativeIndex - 1
  }
  onAccountChangeHandler = (e) => {
    const checkedStatus = e.target.checked
    if (checkedStatus) {
      const selectedAccType = this.props.makePaymentList.filter(item => +item.fee_account_id === +e.target.id)[0]
      const isSelected = selectedAccType.Installments_data.reduce((acc, item) => {
        if (!acc.hasOwnProperty(item.fee_type)) {
          acc[item.fee_type] = []
        }
        return acc
      }, {})
      const amountToBePaid = Object.keys(isSelected).reduce((acc, item) => {
        acc[item] = 0
        return acc
      }, {})
      const feeType = selectedAccType.Installments_data.reduce((acc, item) => {
        if (!acc.hasOwnProperty(item.fee_type)) {
          acc[item.fee_type] = []
        }
        acc[item.fee_type].push({ ...item })
        return acc
      }, {})
      const checkedId = +e.target.id
      this.setState({
        checkedAccount: checkedId,
        isSelected,
        feeType,
        amountToBePaid
      }, () => {
        console.log('Checkd Acc', this.state.checkedAccount)
      })
    }
  }

  calculateTotal = () => {
    // let pay = this.state.selectedTotal
    // const data = this.props.feeDetailsList.filter(list => (list.id === id))

    // let partialAmt = 0
    // // adding and removing the total amount to be paid
    // data.map(amt => {
    //   partialAmt = parseInt(this.state.partialAmount[id]) ? parseInt(this.state.partialAmount[id]) : amt.balance
    //   if (e.target.checked) {
    //     // pay += amt.balance
    //     pay += partialAmt
    //   } else {
    //     // pay -= partialAmt
    //     pay -= partialAmt
    //   }
    // })
    // if (pay === 0) {
    //   // removed disableNext
    //   this.setState({ selectedTotal: pay })
    // } else if (pay > 0) {
    //   this.setState({ selectedTotal: pay })
    // }
    // const amt = Object.keys(this.state.amountToBePaid).reduce((sum, item) => {
    //   console.log('amt item: ', item, this.state.amountToBePaid[item])
    //   sum += this.state.amountToBePaid[item]
    //   return sum
    // }, 0)
    let { isSelected, partialAmount } = this.state
    let amt = 0
    for (const property in isSelected) {
      console.log(`this is for in: ${property}: ${isSelected[property]}`)
      console.log(property)
      console.log(isSelected)
      if (isSelected[property].length) {
        for (let i = 0; i <= isSelected[property].length; i++) {
          if (isSelected[property][i]) {
            console.log(isSelected)
            console.log('inside normal for and if : ', isSelected[property][i], parseInt(partialAmount[isSelected[property][i].id]), partialAmount.keys)
            amt += Object.keys(partialAmount).length && parseInt(partialAmount[isSelected[property][i].id]) ? parseInt(partialAmount[isSelected[property][i].id]) : isSelected[property][i].amount
          }
        }
      }
    }
    console.log('amount:::::::::', amt)
    return amt
  }
  handleClickViewDetails = (installmentsId) => {
    // this.props.statusMakePaymentList(this.props.sessionYear, this.props.erp, this.props.alert, this.props.user)
    console.log(this.state.isModelData)
    this.props.status.map(items => {
      if (items.installments != null) {
        if (items.installments.id === installmentsId) {
          this.setState(prevState => ({
            allDataDetails: [...prevState.allDataDetails, items],
            isModelData: true
          }))
        }
      } else {
        if (items.other_fee_installments.id === installmentsId) {
          console.log('hii nitu singh k12', installmentsId, items.other_fee_installments.id)
          this.setState(prevState => ({
            allDataDetails: [...prevState.allDataDetails, items],
            isModelData: true
          }))
        }
      }
    })
  }

  getCheckedAccFeeList = () => {
    let list
    if (this.props.makePaymentList.length) {
      let checkedAccountData = null
      checkedAccountData = this.props.makePaymentList.filter(ele => {
        return ele.fee_account_id === this.state.checkedAccount
      })
      checkedAccountData = checkedAccountData.length > 0 && { ...checkedAccountData[0] }
      if (!checkedAccountData) {
        return
      }
      list = checkedAccountData.Installments_data.map((inst, i) => {
        console.log(inst)
        return (
          <React.Fragment>
            <TableRow hover >
              <TableCell>
                <input
                  type='checkbox'
                  style={{ width: '20px', height: '20px' }}
                  checked={this.isCheckedValue(inst.fee_type, inst.id, inst.installments_id)}
                  onChange={(event) => { this.handleCheckBox(event, inst.fee_type, i, inst.installments_id) }}
                  disabled={(this.state.isSelected[inst.fee_type].length - 1) > this.getRelativeIndex(inst.fee_type, i, inst.installments_id) || inst.upload_status === 2}
                />
              </TableCell>
              <TableCell>{inst.installments_name}</TableCell>
              <TableCell>{inst.fee_type}</TableCell>
              <TableCell>{inst.installment_amount}</TableCell>
              <TableCell>{inst.amount_paid}</TableCell>
              <TableCell>{inst.balance}</TableCell>
              <TableCell>{inst.discount ? inst.discount : 0}</TableCell>
              <TableCell>{inst.fine_amount ? inst.fine_amount : 0}</TableCell>
              <TableCell>{inst.due_date}</TableCell>
              <TableCell>
                {this.props.isPartial
                  ? <input
                    name='partialAmount'
                    type='number'
                    className='form-control'
                    min='0'
                    id={inst.id}
                    style={{ width: '100px' }}
                    readOnly={this.isCheckedValue(inst.fee_type, inst.id)}
                    onChange={(e) => this.partialAmountHandler(e, inst.id)}
                    value={this.state.partialAmount[inst.id] ? this.state.partialAmount[inst.id] : inst.balance}
                  />
                  : 'No'}
              </TableCell>
              {/* <TableCell style={{ color: 'blue' }}>
                {inst.upload_status === 2 ? 'Pending' : 'N/A'}
              </TableCell>
              <TableCell>
                <Button
                  color='primary' variant='contained'
                  onClick={() => this.handleClickViewDetails(inst.installments_id)}>
                     View
                </Button>
              </TableCell> */}
            </TableRow>
          </React.Fragment>
        )
      })
    } else {
      list = 'No Data'
    }
    return list
  }

  handleClickAgree = (e) => {
    if (!this.state.agreeTerms) {
      this.setState({
        isOpen: true,
        agreeTerms: true
      })
    } else {
      this.setState({
        isOpen: false,
        agreeTerms: false
      })
    }
  };

  handleUploadPayment = () => {
    const dataArr = Object.keys(this.state.isSelected).map(item => (
      this.state.isSelected[item]
    )).reduce((arr, item) => {
      if (item.length) {
        arr = [...arr, ...item]
      }
      return arr
    }, [])
    console.log('dataArr: ', dataArr)
    const dataObj = dataArr.reduce((obj, item) => {
      if (item.isOtherFee) {
        obj.otherFee.push({
          id: item.id,
          amount: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? this.state.partialAmount[item.id] : item.amount
        })
      } else {
        obj.normalFee.push({
          id: item.id,
          amount: Object.keys(this.state.partialAmount).length && this.state.partialAmount[item.id] ? this.state.partialAmount[item.id] : item.amount
        })
      }
      return obj
    }, {
      otherFee: [],
      normalFee: []
    })
    return this.props.history.push({
      pathname: '/finance/upload_file',
      state: { dataObj: dataObj, total_paid_amount: this.calculateTotal(), fee_account_id: this.state.checkedAccount }
    })
  }
  handleClickClose = () => {
    this.setState({
      isModelData: false,
      allDataDetails: []
    })
  }
  handleClickImg = (image) => {
    this.setState({
      imgView: image,
      showImg: true
    })
  }
  imageModalHandler = () => {
    this.setState({ showImg: false })
  }

  cancelRemarkHandler = (e) => {
    this.setState({ cancelRemark: e.target.value })
  }
  proceedPaymentHandler = () => {
    if (this.state.cancelRemark) {
      const data = {
        fee_type: this.state.feeTypes,
        other_fee: this.state.otherFee,
        installments: this.state.installId,
        other_fee_installments: this.state.otherFeeinstId,
        rejected_reason: this.state.cancelRemark,
        academic_year: this.props.sessionYear && this.props.sessionYear.value,
        transction_id: this.state.upiId,
        id: this.state.studentId
      }

      this.props.cancelPaymentStudent(data, this.props.alert, this.props.user)
      this.props.fetchListMakePayment(this.props.sessionYear, this.props.alert, this.props.user)

      this.setState({
        cancelModal: false,
        isModelData: false,
        cancelRemark: '',
        allDataDetails: []
      })
    } else {
      this.props.alert.warning('Fill the Remark to Proceed!')
    }
  }

  rejectPaymentHandler = (feetype, otherfee, inst, otherInstId, stu, id, upi) => {
    this.setState({
      feeTypes: feetype,
      otherFee: otherfee,
      otherFeeinstId: inst,
      upiId: upi,
      studentId: id,
      cancelModal: true,
      isModelData: false,
      allDataDetails: []

    })
  }

  hideCancelModalHandler = (e) => {
    this.setState({ cancelModal: false })
  }
  render () {
    console.log(this.state.allDataDetails)
    let changeCancelModal = null
    if (this.state.cancelModal) {
      changeCancelModal = (
        <Modal open={this.state.cancelModal} click={this.hideCancelModalHandler} small>
          <React.Fragment>
            <p style={{ textAlign: 'center', fontSize: '16px' }}>Do You want to Reject ?</p>
            <Grid container spacing={3} style={{ padding: 15, marginLeft: '2px' }}>
              <Grid item xs={4}>
                <TextField
                  id='remark'
                  type='text'
                  required
                  InputLabelProps={{ shrink: true }}
                  value={this.state.cancelRemark || ' '}
                  onChange={this.cancelRemarkHandler}
                  margin='dense'
                  variant='outlined'
                  label='remark'
                  style={{ padding: '0rem', textAlign: 'center', marginLeft: 30 }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ marginTop: '5px' }}
                  onClick={this.proceedPaymentHandler}
                >
                    Proceed
                </Button>
              </Grid>
              <Grid item xs='4'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.hideCancelModalHandler}
                >
                    Go Back
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Modal>
      )
    }
    let { classes } = this.props
    let ImgModal = null
    if (this.state.showImg) {
      ImgModal = (
        <Modal style={{ overflow: 'scroll' }} open={this.state.showImg} click={this.imageModalHandler}>
          <React.Fragment>
            <Button
              variant='contained'
              color='primary'
              style={{ position: 'fixed', bottom: '1%', right: '1%' }}
              onClick={this.imageModalHandler}
            >
              Go Back
            </Button>
            <img src={this.state.imgView} alt='payment_screenshot' />
          </React.Fragment>
        </Modal>
      )
    }
    const hideCancelModalHandler = () => {
      this.setState({
        isModelData: false,
        allDataDetails: []
      })
    }
    var modal = null
    if (this.state.isModelData) {
      modal = (<Modal open={this.state.isModelData} click={hideCancelModalHandler} large>
        <div>
          <div>
            <Button color='primary' style={{ float: 'right', top: 'fixed' }}> <CancelIcon onClick={this.handleClickClose} /> </Button>
          </div>
          <div>
            <h1 style={{ textAlign: 'center', color: '#900C3F' }}>All Details</h1>
            <div className='modal-content'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell style={{ fontSize: '16px' }}>Fee Type </TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Upi Id</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Installment Amount</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Installment Name</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Paid Date</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Payment Screenshot</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Status</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Remark</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>Reject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.allDataDetails
                    ? this.state.allDataDetails.map((val) => {
                      return (
                        <TableRow>
                          <TableCell />
                          <TableCell>{val.installments_amount ? val.fee_type && val.fee_type.fee_type_name : ''} {val.other_fee_installment_amount ? val.other_fee && val.other_fee.fee_type_name : ''}</TableCell>
                          <TableCell>{val.transction_id ? val.transction_id : ' ' }</TableCell>
                          <TableCell> {val.installments_amount ? val.installments_amount : val.other_fee_installment_amount} </TableCell>
                          <TableCell> {val.installments_amount ? val.installments.installment_name : val.other_fee_installments ? val.other_fee_installments.installment_name : null} </TableCell>
                          <TableCell>{val.paid_date ? val.paid_date : 'NA'}</TableCell>
                          <TableCell><Button
                            variant='contained'
                            color='primary'
                            onClick={() => this.handleClickImg(val.payment_screenshot)}
                          >
                              View image
                          </Button> </TableCell>
                          <TableCell style={val.is_paid_done ? Accept : !val.is_paid_done && !val.is_rejected ? Pending : val.is_rejected ? Rejected : null}>{val.is_paid_done ? 'Paid' : !val.is_paid_done && !val.is_rejected ? 'Pending' : val.is_rejected ? 'Rejected' : null }</TableCell>
                          <TableCell>{val.is_paid_done ? val.remarks : val.is_rejected ? val.rejected_reason : null }</TableCell>
                          <TableCell>
                            <Button
                              variant='contained'
                              color='secondary'
                              disabled={val.is_rejected}
                              style={{ marginTop: 20 }}
                              onClick={() => this.rejectPaymentHandler(val.fee_type && val.fee_type.id, val.other_fee && val.other_fee.id, val.installments && val.installments.id, val.other_fee_installments && val.other_fee_installments.id, val.student && val.student.id, val.id, val.transction_id)}
                            >
                            REJECT
                            </Button></TableCell>
                        </TableRow>
                      )
                    }) : null
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Modal>
      )
    }

    return (
      <Grid >
        <Grid.Row>
          <Grid.Column computer={16} style={{ padding: '30px' }}>
            <div>
              {this.props.makePaymentList && this.props.makePaymentList.length
                ? this.props.makePaymentList.map((val, i) => {
                  return (
                    <div key={val.fee_account_id}>
                      <input type='radio' onChange={this.onAccountChangeHandler} id={`${val.fee_account_id}`} name='account' /> &nbsp;
                      <label>{val.fee_account_name}</label> <br />
                    </div>
                  )
                }) : null}
            </div>
            <Divider />
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>.</TableCell>
                      <TableCell>Installment Name</TableCell>
                      <TableCell>Fee Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Paid Amount</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Concession</TableCell>
                      <TableCell>Fine Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Partial Payment</TableCell>
                      {/* <TableCell>Status</TableCell>
                      <TableCell>Uploaded Details</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.getCheckedAccFeeList()}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment> <br />

            <Grid container spacing={1} border={1} flex-wrap>
              <Grid item xs={4} sm={3} style={{ marginLeft: '3%' }}>
                <div>
                  <div style={{ fontSize: '15px', marginTop: '-20px' }}><label>Amount to be paid : </label> &nbsp; {this.props.walletInfo.length && this.state.isWalletAgree && (this.calculateTotal() > this.props.walletInfo[0].reaming_amount) ? this.calculateTotal() - this.props.walletInfo[0].reaming_amount : this.calculateTotal()}</div>
                  {/* <br /> */}
                  <label style={{ marginTop: '-20px' }}>Date</label> <input type='text' value={this.state.todayDate} readOnly />
                  {this.props.walletInfo.length && this.props.walletInfo[0].reaming_amount > 0
                    ? <div style={{ height: 90, marginTop: 15, marginBottom: 15 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.isWalletAgree}
                            onChange={this.agreeWalletPayment}
                            // disabled={this.state.total + this.state.shippingAmount > this.props.walletInfo[0].total_amount}
                            color='primary'
                          />
                        }
                        label='Pay using Wallet Amount'
                      />
                      <h4 style={{ marginTop: 0 }}>Total available balance: {this.props.walletInfo[0].reaming_amount}</h4>
                      {this.state.isWalletAgree ? <h4 style={{ marginTop: 0 }}>Remaining wallet balance: {this.props.walletInfo[0].reaming_amount <= this.calculateTotal() ? 0 : this.props.walletInfo[0].reaming_amount - this.calculateTotal()}</h4> : ''}
                    </div>
                    : ''}
                </div>
              </Grid>
              {
                BranchIdBangalore.includes(this.currBrnch)
                  ? <Grid item xs={8} sm={6}>
                    <Paper style={{ fontSize: '14px', marginTop: '-20px' }}><h3 style={{ textAlign: 'center', color: '#880E4F', marginBottom: '-2px' }}>Payment with O% EMI Cost.</h3> You can pay the entire academic fee in Nine EMIs at zero interest zero processing fee i.e No additional <br /> cost through our partner Finance Peer.
                      <a href='tel:+022-48977992/7259714309'> You can also reach us  at 022-48977992/7259714309</a> or <br /> <a href='mailto:support@financepeer.co? subject=subject text'>support@financepeer.com</a>. Click on link for more details: <a href='https://www.financepeer.co/' target='blank'> www.financepeer.co</a>.
                    </Paper>
                  </Grid> : null
              }
              {
                BranchIdMumbai.includes(this.currBrnch)
                  ? <Grid item xs={8} sm={6}>
                    <Paper style={{ fontSize: '14px', marginTop: '-20px' }}><h3 style={{ textAlign: 'center', color: '#880E4F', marginBottom: '-2px' }}>Payment with O% EMI Cost.</h3> Parents can pay their entire fee in 10 equal Monthly Installments at No Extra Cost i.e. 0% Interest<br />  and 0 Processing Fee cost through our partner grayquest.
                    Click on the GrayQuest option in the <br /> Manage Payment section OR Contact GrayQuest on <a href='tel:+022-48931822'>022-48931822</a> or<a href='mailto:support@grayquest.com? subject=subject text'>support@grayquest.com</a>.<br /> Click on Link for more details:<a href='https://www.grayquest.com/signup' target='blank'> www.grayquest.com</a>.
                   Get complimentary benefits   with partners <br />like PVR, Smaaash, Imagica, and 25+ others through <a href='https://tinyurl.com/gqplus' target='blank'>https://tinyurl.com/gqplus</a>.
                    </Paper>
                  </Grid> : null
              }
            </Grid>

            <Grid.Row>
              {
                (this.calculateTotal() > 0)
                  ? <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                    style={{ marginTop: '-40px' }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.agreeTerms}
                          onChange={this.handleClickAgree}
                          color='primary'
                        />
                      }
                      label='I / We Agree Terms and Conditions'
                    />
                  </Grid.Column> : null
              }
            </Grid.Row>
            <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                className='student-section-inputField'
              >
                <label>Terms &amp; Conditions :</label>
                <div style={{ color: 'red' }}>
                  <p>1. Please be informed that additional transaction
                     charges are applicable. For more information
                      please contact your school administrator.</p>
                  <p>2. LetsEduvate will not store any of
                     your Bank credentials / Card details.
                      The system will redirect you to concerned
                       Bank pages only to complete your transaction.</p>
                  <p>3. No refund(s)/ No Cancellations are allowed for the transactions done
                    through this channel.</p>
                  <p>4. In case of any dispute regarding the payments, you are requested to
                    contact school administrator.</p>
                  <p>5. Terms and conditions include Online Payment Fee charges, Refund Policy,
                    Privacy Policy, Withdrawal from School, Governing Law, Jurisdiction etc.</p>
                </div>
              </Grid.Column>
            </Grid.Row>

          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column computer={6}>
            <Button color='primary' variant='contained'
              disabled={!this.state.agreeTerms || this.calculateTotal() <= 0}
              onClick={this.handleSubmitPayment}>
              Continue
            </Button>
          </Grid.Column>
          <Grid.Column computer={6}>
            {/* <Button color='primary'
              variant='contained'
              disabled={!this.state.agreeTerms}
              onClick={this.handleUploadPayment}>
              Already Transfered To Orchids Account
            </Button> */}
          </Grid.Column>
        </Grid.Row>
        <div>
          {modal}
        </div>
        <div>
          {ImgModal}
        </div>
        <div>
          {changeCancelModal}
        </div>
        <div>
          {changeCancelModal}
        </div>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  makePaymentList: state.finance.studentManagePayment.studentMakePaymentList,
  paymentStatus: state.finance.studentManagePayment.confirmPayment,
  orderId: state.finance.studentManagePayment.orderId,
  amount: state.finance.studentManagePayment.amount,
  // walletInfo: state.finance.studentManagePayment.walletInfo,
  isPartial: state.finance.studentManagePayment.isPartial,
  walletInfo: state.finance.makePayAcc.walletInfo,
  status: state.finance.studentManagePayment.status
})

const mapDispatchToProps = dispatch => ({
  fetchListMakePayment: (session, alert, user) => dispatch(actionTypes.fetchMakePaymentList({ session, alert, user })),
  clearUnrelevantData: () => dispatch({ type: actionTypes.CLEAR_UNRELEVANT_DATA }),
  makePayment: (data, alert, user) => dispatch(actionTypes.makePaymentStudent({ data, alert, user })),
  cancelPaymentStudent: (data, alert, user) => dispatch(actionTypes.cancelPaymentStudent({ data, alert, user })),
  isPartialPay: (session, gradeId, alert, user) => dispatch(actionTypes.isPartialPay({ session, gradeId, alert, user })),
  statusMakePaymentList: (session, erp, alert, user) => dispatch(actionTypes.statusMakePaymentList({ session, erp, alert, user })),
  fetchNormalWallet: (session, erp, alert, user) => dispatch(actionTypes.fetchNormalWallet({ session, erp, alert, user }))
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(MakePayment)))
