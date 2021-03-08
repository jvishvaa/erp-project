import React, { Component } from 'react'
import { connect } from 'react-redux'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  // Typography,
  // Divider,
  Button,
  // Icon,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core/'
import Select from 'react-select'
import zipcelx from 'zipcelx'
import { withRouter } from 'react-router'

import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import classess from './deleteModal.module.css'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'scroll'
  },
  downloadFormat: {
    color: theme.palette.primary.main,
    position: 'absolute',
    right: '15px',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})

class AddOtherFees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentFeeAccount: '',
      feeTypeName: '',
      subFeeTypeName: '',
      session: '',
      sessionData: [],
      branchId: '',
      branchData: [],
      amount: '',
      dueDate: '',
      transport_other_fee: false,
      startDate: '',
      endDate: '',
      is_installment: false,
      installmentList: false,
      numberOfRows: '',
      installPercentage: [],
      installAmountValue: [],
      isBulkUpload: false,
      bulkFile: null
    }
    this.tableRef = React.createRef()
  }

  componentDidMount () {
    if (!this.props.location.state.currentYear.value || !this.props.location.state.currentBranch.value) {
      // console.log('Redirect')
      // console.log()
      // console.log('Redirect', this.props.location.state.currentYear.value, this.props.location.state.currentBranch.value)
      this.props.alert.warning('Select Academic Year & Branch')
      this.props.history.push({
        pathname: '/feeType/OtherFeeType'
      })
    } else {
      // console.log('Inside Add Other fee')
      // console.log('Inside Add Other fee', this.props.location.state.currentYear.value, this.props.location.state.currentBranch.value)
      this.setState({
        sessionData: this.props.location.state.currentYear,
        session: this.props.location.state.currentYear.value,
        branchData: this.props.location.state.currentBranch,
        branchId: this.props.location.state.currentBranch.value
      }, () => {
        this.props.fetchFeeAccount(this.state.sessionData.value, this.state.branchData.value, this.props.alert, this.props.user)
      })
    }
  }

  componentWillUnmount () {
    this.props.clearProps()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.installmentResponse) {
      this.props.history.push({
        pathname: '/feeType/OtherFeeType'
      })
    }
  }

  // componentDidUpdate (prevProps, prevState) {
  //   if (this.props.installmentResponse) {
  //     this.props.clearProps()
  //   }
  // }

  downloadSample = () => {
    const headers = [
      {
        value: 'Other Fee',
        type: 'string'
      },
      {
        value: 'Total Amount',
        type: 'string'
      },
      {
        value: 'Installment Name',
        type: 'string'
      },
      {
        value: '1st Installment',
        type: 'string'
      },
      {
        value: 'Due date',
        type: 'string'
      },
      {
        value: 'Start Date',
        type: 'string'
      },
      {
        value: 'End Date',
        type: 'string'
      },
      {
        value: 'Installment Name',
        type: 'string'
      },
      {
        value: '2nd Installment',
        type: 'string'
      },
      {
        value: 'Due date',
        type: 'string'
      },
      {
        value: 'Start Date',
        type: 'string'
      },
      {
        value: 'End Date',
        type: 'string'
      },
      {
        value: 'Installment Name',
        type: 'string'
      },
      {
        value: '3rd Installment',
        type: 'string'
      },
      {
        value: 'Due date',
        type: 'string'
      },
      {
        value: 'Start Date',
        type: 'string'
      },
      {
        value: 'End Date',
        type: 'string'
      },
      {
        value: 'Fine_Amount',
        type: 'string'
      },
      {
        value: 'is_transport_fee',
        type: 'string'
      },
      {
        value: 'is_misc',
        type: 'string'
      }
    ]
    const config = {
      filename: 'other_fee_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user)
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
    this.props.fetchFeeAccount(this.state.session, e.value, this.props.alert, this.props.user)
  }

  feeAccountChangeHandler = (e) => {
    this.setState({
      currentFeeAccount: e
    })
  }

  feeTypeHandler = (e) => {
    this.setState({
      feeTypeName: e.target.value
    })
  }

  subFeeTypeHandler = (e) => {
    this.setState({
      subFeeTypeName: e.target.value
    })
  }

  changeDueDateHandler = (e) => {
    this.setState({
      dueDate: e.target.value
    })
  }

  changeStartDateHandler = (e) => {
    this.setState({
      startDate: e.target.value
    })
  }

  changeendDateHandler = (e) => {
    this.setState({
      endDate: e.target.value
    })
  }

  amountHandler = (e) => {
    this.setState({
      amount: e.target.value
    })
    let amount = document.getElementById('amount').value
    if (amount < 1) {
      this.props.alert.warning('Invalid Amount')
      this.setState({ amount: '' })
    }
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  deleteModalShowHandler = () => {
    this.setState({ showDeleteModal: true })
  }

  deleteModalCloseHandler = () => {
    this.setState({ showDeleteModal: false })
  }

  deleteInstallHandler = () => {
    // TODO: delete the installment
    const {
      session,
      branchId,
      feeTypeName
    } = this.state
    const {
      alert,
      user
    } = this.props
    if (session && branchId && feeTypeName) {
      this.props.deleteInstallments(session, branchId, feeTypeName, alert, user)
      this.deleteModalCloseHandler()
      this.setState({
        numberOfRows: ''
      })
    } else {
      alert.warning('Select Required fields')
    }
    // this.props.deleteInstallments(this.props.alert, this.props.user)
    // this.deleteModalCloseHandler()
  }

  // validation of installment amounts
  installAmountHandler = (e) => {
    let amt = e.target.value
    let percentage = 0
    let totalAmt = this.state.amount
    console.log('amt', amt)
    console.log('totalAmt outside', totalAmt)
    if (+amt <= +totalAmt) {
      console.log('totalAmt inside', totalAmt)
      percentage = (amt / totalAmt) * 100
      percentage = +percentage.toFixed(2)
    } else {
      this.props.alert.warning('Entered Amount is greater than Total Amount!')
    }
    let cent = [...this.state.installPercentage]
    cent[e.target.id] = percentage
    console.log('cent', cent)

    let installmentAmt = [...this.state.installAmountValue]
    installmentAmt[e.target.id] = amt
    console.log('installmentAmt', installmentAmt)
    this.setState({ installAmountValue: installmentAmt, installPercentage: cent }, () => {
      console.log('amount', this.state.amount)
      console.log('installAmountValue', this.state.installAmountValue)
      console.log('installPercentage', this.state.installPercentage)
    })
  }

  // validation of installment Percentage
  installCentHandler = (e) => {
    let percent = e.target.value
    let amt = 0
    let totalAmt = this.state.amount
    if (percent <= 100) {
      amt = (totalAmt / 100) * percent
      amt = +amt.toFixed(2)
      console.log('amt', amt)

      let installmentAmt = [...this.state.installAmountValue]
      installmentAmt[e.target.id] = amt
      console.log('installmentAmt', installmentAmt)

      let cent = [...this.state.installPercentage]
      cent[e.target.id] = percent
      console.log('cent', cent)
      this.setState({ installPercentage: cent, installAmountValue: installmentAmt }, () => {
        console.log('amount', this.state.amount)
        console.log('installAmountValue', this.state.installAmountValue)
        console.log('installPercentage', this.state.installPercentage)
      })
    } else {
      this.props.alert.warning('Entered percent is greater than 100!')
    }
  }

  scrollDownHandler = () => {
    const objDiv = this.tableRef.current
    objDiv.scrollTop = objDiv.scrollHeight
  }

  // generating rows to add installments
  handleRow = e => {
    this.setState({
      numberOfRows: e.value,
      installPercentage: [],
      installAmountValue: []
    })
  }

  createRowsHandler = (loop) => {
    let table = []
    for (let i = 0; i < loop; i++) {
      table.push(
        <TableRow hover>
          <TableCell>
            {i + 1}
          </TableCell>
          <TableCell>
            <input
              name='installment_name'
              style={{ width: '100px' }}
              type='text'
              className='form-control'
              placeholder='installment Name'
            />
          </TableCell>
          <TableCell>
            <input
              style={{ width: '100px' }}
              name='installment_amount'
              // min='1'
              type='number'
              className='form-control'
              placeholder='installment amount'
              id={i}
              value={this.state.installAmountValue[i]}
              onChange={this.installAmountHandler}
            />
          </TableCell>
          <TableCell>
            <input
              name='installment_percentage'
              style={{ width: '80px' }}
              type='number'
              className='form-control'
              placeholder='installment percentage'
              value={this.state.installPercentage[i]}
              id={i}
              // readOnly
              onChange={this.installCentHandler}
            />
          </TableCell>
          <TableCell>
            {/* <div style={{ width: '200px' }}> */}
            <input
              name='start_date'
              type='date'
              className='form-control'
              placeholder='start date'
            />
            {/* </div> */}

          </TableCell>
          <TableCell>
            <input
              name='due_date'
              type='date'
              className='form-control'
              placeholder='due date'
            // style={{ width: '200px' }}
            />
          </TableCell>
          <TableCell>
            <input
              name='end_date'
              type='date'
              className='form-control'
              placeholder='end date'
            // style={{ width: '200px' }}
            />
          </TableCell>
          <TableCell>
            <div style={{ width: '200px' }} onClick={this.scrollDownHandler}>
              <Select
                name='feeAccountInfo'
                placeholder='Select Fee Account'
                defaultValue={this.state.currentFeeAccount ? ({
                  value: this.state.currentFeeAccount.value,
                  label: this.state.currentFeeAccount.label
                }) : null}
                options={
                  this.props.feeAccounts.length
                    ? this.props.feeAccounts.map(feeList => ({
                      value: feeList.id,
                      label: feeList.fee_account_name
                    }))
                    : []
                }
                onChange={this.feeAccountChangeHandler}
              />
            </div>
          </TableCell>
          <TableCell>
            <input
              name='fine_money'
              type='checkbox'
            />
          </TableCell>
        </TableRow>
      )
    }
    return table
  }

  fileChangeHandler = (event) => {
    console.log('my file: ', event.target.files[0])
    const file = event.target.files[0]
    this.setState({
      bulkFile: file
    })
  }

  handleBulkUpload = () => {
    const form = new FormData()
    form.set('academic_year', this.state.session)
    form.set('branch', this.state.branchId)
    form.set('fee_account', this.state.currentFeeAccount.value)
    form.append('file', this.state.bulkFile)
    this.props.uploadBulkFees(form, this.props.alert, this.props.user)
  }

  handleSubmitOtherFees = () => {
    let data = {
      branch: this.state.branchId,
      amount: this.state.amount,
      due_date: this.state.dueDate,
      fee_account: this.state.currentFeeAccount.value,
      fee_type_name: this.state.feeTypeName,
      is_transport_fee: this.state.transport_other_fee,
      session_year: this.state.session,
      sub_type: this.state.subFeeTypeName,
      start_date: this.state.startDate,
      end_date: this.state.endDate,
      has_installments: this.state.is_installment
    }
    this.props.saveOtherFeeInstallments(data, this.props.alert, this.props.user)
  }

  // sending new installments to backend
  saveInstallments = (totalAmt) => {
    if (!this.state.currentFeeAccount || !this.state.branchId || !this.state.session ||
      !this.state.feeTypeName || !this.state.subFeeTypeName || !this.state.startDate || !this.state.endDate ||
      !this.state.amount || !this.state.dueDate) {
      this.props.alert.warning('Select Required fields')
      return
    }
    // query selecting all the fields
    let installData = []; let arrCheckbox = []; let isValid = false; let amount = 0
    const installName = document.querySelectorAll('[name=installment_name]')
    const installAmount = document.querySelectorAll('[name=installment_amount]')
    const installPerc = document.querySelectorAll('[name=installment_percentage]')
    const installDueDate = document.querySelectorAll('[name=due_date]')
    const installStartDate = document.querySelectorAll('[name=start_date]')
    const installEndDate = document.querySelectorAll('[name=end_date]')
    const installFeeAcc = document.querySelectorAll('[name=feeAccountInfo]')
    const installFine = document.querySelectorAll('input[type=checkbox]')
    console.log('fee account', installFeeAcc)
    // capturing fines in an array
    installFine.forEach((v) => {
      if (v.checked) {
        arrCheckbox.push(true)
      } else {
        arrCheckbox.push(false)
      }
    })

    // checking if it's 1 installment or more and date validation
    for (let i = 0; i < this.state.numberOfRows; i++) {
      if ((Date.parse(installStartDate[i].value) < Date.parse(installDueDate[i].value)) && (Date.parse(installDueDate[i].value) < Date.parse(installEndDate[i].value))) {
        installData.push({
          installment_name: installName[i].value,
          installment_amount: installAmount[i].value,
          installment_percentage: installPerc[i].value,
          due_date: installDueDate[i].value,
          installment_start_date: installStartDate[i].value,
          installment_end_date: installEndDate[i].value,
          fee_account: String(installFeeAcc[i].value),
          fine_amount: arrCheckbox[i]
        })
      } else {
        this.props.alert.warning('Date selection is incorrect!!!')
        return false
      }
    }

    // // checking if percentage is 100
    // for (var i in this.state.installPercentage) { total += +this.state.installPercentage[i] }

    // if (total > 100 || total < 100) {
    //   this.props.alert.warning('Check the amounts entered!')
    //   return false
    // }

    // checking for amount
    for (let i in this.state.installAmountValue) { amount += +this.state.installAmountValue[i] }
    // const totalFeeAmt = this.state.amount
    console.log('totalAmt', totalAmt)
    console.log('amount', amount)
    if (+totalAmt !== +amount) {
      this.props.alert.warning('Check the amounts entered!')
      return false
    }

    // checking if fee account is selected from dropdown
    for (let i = 0; i < installFeeAcc.length; i++) {
      if (installFeeAcc[i].value === '') {
        isValid = false
        this.props.alert.warning(' please Select Fee Account!')
        return false
      } else {
        isValid = true
      }
    }

    if (isValid) {
      let finaldata = {
        branch: this.state.branchId,
        amount: this.state.amount,
        due_date: this.state.dueDate,
        fee_account: this.state.currentFeeAccount.value,
        fee_type_name: this.state.feeTypeName,
        is_transport_fee: this.state.transport_other_fee,
        session_year: this.state.session,
        sub_type: this.state.subFeeTypeName,
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        has_installments: this.state.is_installment,
        numberOfInstallments: parseInt(this.state.numberOfRows),
        installments: installData
      }
      this.props.saveOtherFeeInstallments(finaldata, this.props.alert, this.props.user)
      // this.props.clearProps()
      // this.setState({
      //   currentFeeAccount: '',
      //   feeTypeName: '',
      //   subFeeTypeName: '',
      //   dueDate: '',
      //   transport_other_fee: false,
      //   startDate: '',
      //   endDate: '',
      //   is_installment: false,
      //   installmentList: false,
      //   numberOfRows: '',
      //   installPercentage: [],
      //   installAmountValue: [],
      //   amount: ''
      // })
    }
  }

  checkInstallmenthandler = () => {
    const {
      branchId,
      session,
      feeTypeName,
      dueDate,
      startDate,
      endDate,
      amount,
      subFeeTypeName
    } = this.state
    const {
      user,
      alert
    } = this.props
    if (session && branchId && feeTypeName && dueDate && startDate && endDate && amount && subFeeTypeName) {
      this.props.checkInstallments(session, branchId, feeTypeName, alert, user)
      this.setState({
        installmentList: true,
        numberOfRows: ''
      })
    } else {
      // alert.warning('Select Required fields')
    }
  }

  render () {
    let { classes } = this.props

    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button variant='outlined' color='secondary' onClick={this.deleteInstallHandler}>Delete</Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button variant='outlined' color='primary' onClick={this.deleteModalCloseHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }

    let checkInstallmentsButton = null
    if (this.state.is_installment) {
      checkInstallmentsButton = (
        <Button
          primary
          style={{ padding: '10px 20px', marginTop: '10px' }}
          onClick={this.checkInstallmenthandler}
          color='primary'
          size='small'
          variant='contained'
        >Check For Installments</Button>
      )
    }

    let installmentDetails = null
    if (this.props.otherFeeInstallments.length > 0 && this.state.is_installment) {
      installmentDetails = this.props.otherFeeInstallments.map((row, index) => {
        return (
          <TableRow hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div style={{ width: '80px' }}>
                {row.installment_name ? row.installment_name : ''}
              </div>
            </TableCell>
            <TableCell>{row.installment_amount ? row.installment_amount : '' }</TableCell>
            <TableCell>{row.installment_percentage ? row.installment_percentage : ''}</TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.installment_start_date ? row.installment_start_date : ''}</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.due_date ? row.due_date : '' }</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.installment_end_date ? row.installment_end_date : ''}</div></TableCell>
            <TableCell><div style={{ width: '80px' }}>{row.fee_account && row.fee_account.fee_account_name ? row.fee_account.fee_account_name : ''}</div></TableCell>
            <TableCell>{row.fine_amount ? 'Yes' : 'No'}</TableCell>
            <TableCell>No Actions</TableCell>
            {/* <TableCell>
              <div onClick={() => this.showEditModalHandler(row.id, row.academic_year)} style={{ cursor: 'pointer' }}>
                <Button basic>
                  <Button.Content>
                    <Icon name='edit' />
                  </Button.Content>
                </Button>
              </div>
            </TableCell> */}
          </TableRow>
        )
      })
    }

    let installmentsDetails = null
    if (this.props.otherFeeInstallments && this.props.otherFeeInstallments.length > 0 && this.state.is_installment && this.props.confirmInstallment) {
      installmentsDetails = (
        <React.Fragment>
          <label>Installment Details</label>
          <DeleteOutlinedIcon style={{ float: 'right', cursor: 'pointer' }} onClick={this.deleteModalShowHandler} />
          <label style={{ float: 'right' }}>Delete Installment Details </label>

          <div className={classes.tableWrapper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr</TableCell>
                  <TableCell width={{ width: '200px' }}>Installment Name</TableCell>
                  <TableCell>Installment Amount</TableCell>
                  <TableCell>Installment Percentage</TableCell>
                  <TableCell>Installment Start Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Installment End Date</TableCell>
                  <TableCell>Fee Account</TableCell>
                  <TableCell>Fine Amount</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {installmentDetails}
              </TableBody>
            </Table>
          </div>
        </React.Fragment>
      )
    } else if (this.props.otherFeeInstallments && this.props.otherFeeInstallments.length === 0 && this.state.is_installment && this.props.confirmInstallment) {
      installmentsDetails = (
        <React.Fragment>
          <div style={{ width: '400px' }}>
            <label>Create Installment</label>
            <Select
              placeholder='Select Number of Installments'
              options={
                [
                  {
                    label: '1 Installment',
                    value: '1'
                  },
                  {
                    label: '2 Installments',
                    value: '2'
                  },
                  {
                    label: '3 Installments',
                    value: '3'
                  },
                  {
                    label: '4 Installments',
                    value: '4'
                  },
                  {
                    label: '5 Installments',
                    value: '5'
                  },
                  {
                    label: '6 Installments',
                    value: '6'
                  },
                  {
                    label: '7 Installments',
                    value: '7'
                  },
                  {
                    label: '8 Installments',
                    value: '8'
                  },
                  {
                    label: '9 Installments',
                    value: '9'
                  },
                  {
                    label: '10 Installments',
                    value: '10'
                  },
                  {
                    label: '11 Installments',
                    value: '11'
                  },
                  {
                    label: '12 Installments',
                    value: '12'
                  }
                ]
              }
              onChange={this.handleRow}
            />
          </div>
          <div className={classes.tableWrapper} ref={this.tableRef}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.</TableCell>
                  <TableCell>Installment Name</TableCell>
                  <TableCell>Installment Amount</TableCell>
                  <TableCell>Installment Percentage</TableCell>
                  <TableCell>Installment Start Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Installment End Date</TableCell>
                  <TableCell>Fee Account</TableCell>
                  <TableCell>Fine Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.numberOfRows
                  ? this.createRowsHandler(this.state.numberOfRows)
                  : null
                }
              </TableBody>
            </Table>
          </div>
          <br />
          <Button
            onClick={() => this.saveInstallments(this.state.amount)}
            primary
            style={{ padding: '10px 20px', marginTop: '10px' }}
            color='primary'
            size='small'
            variant='contained'
          >
            Save
          </Button>
        </React.Fragment>
      )
    }

    // if (this.props.installmentResponse) {
    //   this.props.clearProps()
    //   this.setState({
    //     currentFeeAccount: '',
    //     feeTypeName: '',
    //     subFeeTypeName: '',
    //     dueDate: '',
    //     transport_other_fee: false,
    //     startDate: '',
    //     endDate: '',
    //     is_installment: false,
    //     installmentList: false,
    //     numberOfRows: '',
    //     installPercentage: [],
    //     installAmountValue: [],
    //     amount: ''
    //   })
    // }

    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: '10px' }}>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session ? this.props.session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={(e) => this.handleAcademicyear(e)}
            />
          </Grid>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={(e) => this.changehandlerbranch(e)}
            />
          </Grid>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
            <label>Fee Account</label>
            <Select
              placeholder='Select Fee Account'
              value={this.state.currentFeeAccount ? ({
                value: this.state.currentFeeAccount.value,
                label: this.state.currentFeeAccount.label
              }) : null}
              options={
                this.props.feeAccounts && this.props.feeAccounts.length
                  ? this.props.feeAccounts.map(fee => ({ value: fee.id, label: fee.fee_account_name })
                  ) : []}
              onChange={this.feeAccountChangeHandler}
            />
          </Grid>
          <Grid item sm={3} md={3} xs={12} style={{ padding: '17px 10px' }}>
            <FormControlLabel
              style={{ marginTop: '10px' }}
              control={
                <Checkbox
                  checked={this.state.isBulkUpload}
                  onChange={(e) => this.changedHandler('isBulkUpload', e)}
                  color='primary'
                />
              }
              label='Bulk Upload Excel'
            />
          </Grid>
          {this.state.isBulkUpload
            ? <React.Fragment>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <TextField
                  id='file_upload'
                  margin='dense'
                  type='file'
                  required
                  variant='outlined'
                  // className={classes.textField}
                  inputProps={{ accept: '.xlsx' }}
                  helperText={(
                    <span>
                      <span>Upload Excel Sheet</span>
                      <span
                        className={classes.downloadFormat}
                        onClick={this.downloadSample}
                        onKeyDown={() => { }}
                        role='presentation'
                      >
                        Download Format
                      </span>
                    </span>
                  )}
                  onChange={(e) => { this.fileChangeHandler(e) }}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <Button
                  primary
                  style={{ padding: '10px 20px' }}
                  onClick={this.handleBulkUpload}
                  color='primary'
                  size='small'
                  variant='contained'
                  disabled={!this.state.currentFeeAccount || !this.state.branchId || !this.state.session || !this.state.bulkFile}
                >Upload Other Fee</Button>
              </Grid>
            </React.Fragment>
            : <React.Fragment>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>Other Fee Name</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Other Fee Name'
                  value={this.state.feeTypeName}
                  onChange={this.feeTypeHandler}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>Sub Other Fee Type</label>
                <input
                  type='text'
                  placeholder='Sub Fee Type'
                  className='form-control'
                  value={this.state.subFeeTypeName}
                  onChange={this.subFeeTypeHandler}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>Amount</label>
                <input
                  type='number'
                  name='amount'
                  min='1'
                  id='amount'
                  className='form-control'
                  placeholder='Amount'
                  value={this.state.amount}
                  onChange={this.amountHandler}
                />
              </Grid>

              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  style={{ padding: '5px', width: '100%' }}
                  min='1'
                  id='startDate'
                  placeholder='Start Date'
                  value={this.state.startDate}
                  onChange={this.changeStartDateHandler}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>Due Date</label>
                <input
                  type='date'
                  name='dueDate'
                  min='1'
                  id='amount'
                  className='form-control'
                  placeholder='Due Date'
                  value={this.state.dueDate}
                  onChange={this.changeDueDateHandler}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '10px' }}>
                <label>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  style={{ padding: '5px', width: '100%' }}
                  min='1'
                  id='endDate'
                  placeholder='End Date'
                  value={this.state.endDate}
                  onChange={this.changeendDateHandler}
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '17px 10px' }}>
                <FormControlLabel
                  style={{ marginTop: '10px' }}
                  control={
                    <Checkbox
                      checked={this.state.transport_other_fee}
                      onChange={(e) => this.changedHandler('transport_other_fee', e)}
                      color='primary'
                    />
                  }
                  label='Transport Fee'
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '17px 10px' }}>
                <FormControlLabel
                  style={{ marginTop: '10px' }}
                  control={
                    <Checkbox
                      checked={this.state.is_installment}
                      onChange={(e) => this.changedHandler('is_installment', e)}
                      color='primary'
                    />
                  }
                  label='Installment'
                />
              </Grid>
              <Grid item sm={3} md={3} xs={12} style={{ padding: '17px 10px' }}>
                {checkInstallmentsButton}
              </Grid>
            </React.Fragment>}
        </Grid>
        <div
          style={{ margin: '0 auto', padding: '30px 0px' }}
        >
          <Button
            primary
            style={{ padding: '10px 20px' }}
            onClick={this.handleSubmitOtherFees}
            color='primary'
            size='small'
            variant='contained'
            disabled={!this.state.currentFeeAccount || !this.state.branchId || !this.state.session ||
              !this.state.feeTypeName || !this.state.subFeeTypeName || !this.state.startDate || !this.state.endDate ||
              !this.state.amount || !this.state.dueDate || this.state.is_installment}
          >Add Other Fee</Button>
        </div>
        <Grid container spacing={3} style={{ padding: '10px' }} justify='center' alignItems='center'>
          <Grid item xs={11} style={{ padding: '10px' }} justify='center' alignItems='center'>
            {installmentsDetails}
          </Grid>
        </Grid>
        {deleteModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  session: state.academicSession.items,
  user: state.authentication.user,
  feeAccounts: state.finance.accountantReducer.listOtherFee.adminFeeAccount,
  confirm: state.finance.accountantReducer.listOtherFee.addOtherConfirm,
  otherFeeInstallments: state.finance.accountantReducer.listOtherFee.otherFeeInstallment,
  confirmInstallment: state.finance.accountantReducer.listOtherFee.installmentStatus,
  installmentResponse: state.finance.accountantReducer.listOtherFee.newInstallmentRes,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  fetchFeeAccount: (session, branch, alert, user) => dispatch(actionTypes.fetchAdminFeeAccount({ session, branch, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  addOtherFees: (data, alert, user) => dispatch(actionTypes.addAccountantOtherFee({ data, alert, user })),
  checkInstallments: (session, branch, feeName, alert, user) => dispatch(actionTypes.checkOtherFeesInstallment({ session, branch, feeName, alert, user })),
  assignInstallment: (data, alert, user) => dispatch(actionTypes.assignInstallmentOtherFees({ data, alert, user })),
  saveOtherFeeInstallments: (data, alert, user) => dispatch(actionTypes.saveInstallmentOtherFees({ data, alert, user })),
  uploadBulkFees: (body, alert, user) => dispatch(actionTypes.uploadBulkFees({ body, alert, user })),
  deleteInstallments: (session, branch, feeName, alert, user) => dispatch(actionTypes.deleteOtherFeesInstallments({ session, branch, feeName, alert, user })),
  clearProps: () => dispatch(actionTypes.clearingAllProps())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AddOtherFees)))
