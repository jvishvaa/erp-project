import React, { Component } from 'react'
import { withStyles, Grid, TextField, Button, Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core/'
// import { OpenInNew, Assignment } from '@material-ui/icons/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from './deleteModal.module.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  }
})

class CurrFeeTypeAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      erp: this.props.erp,
      feeType: null,
      feeTypeAmount: null,
      dueDate: null,
      allowAccToEdit: true,
      changeType: null
    }
  }

  componentDidMount () {
    this.props.fetchMiscFeeList(this.props.session, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
    this.props.fetchStudentMiscDetails(this.props.session, this.props.erp, this.props.alert, this.props.user, this.props.moduleId, this.props.branchId)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.erpNo === this.props.erpNo &&
        nextProps.session === this.props.session &&
        nextProps.getData === this.props.getData &&
        this.props.transactions === nextProps.transactions &&
        this.props.dataLoading === nextProps.data) {
      return false
    }
    return nextProps.getData
  }

  componentWillReceiveProps (nextProps) {
    const { erp, feeType, feeTypeAmount, dueDate } = this.state
    if (!erp || !feeType || !feeTypeAmount || !dueDate) {
      if (nextProps.studentMiscFee && nextProps.studentMiscFee.length > 0) {
        console.log('inside 1st props eill')
        nextProps.studentMiscFee.map((student) => {
          this.setState({
            feeType: {
              label: student.other_fee && student.other_fee.fee_type_name ? student.other_fee.fee_type_name : '',
              value: student.other_fee && student.other_fee.id ? student.other_fee.id : ''
            },
            feeTypeAmount: student.other_fee && student.other_fee.amount ? student.other_fee.amount : 0,
            dueDate: student.due_date ? student.due_date : '',
            allowAccToEdit: student.other_fee && student.other_fee.allow_accountant_to_edit ? student.other_fee.allow_accountant_to_edit : false
          })
        })
      }
    }

    if (nextProps.miscDetails && Object.keys(nextProps.miscDetails)) {
      console.log('inside 2nd will receive props: ', nextProps.miscDetails)
      this.setState({
        feeType: {
          label: nextProps.miscDetails.fee_type_name ? nextProps.miscDetails.fee_type_name : '',
          value: nextProps.miscDetails.id ? nextProps.miscDetails.id : ''
        },
        feeTypeAmount: nextProps.miscDetails.amount ? nextProps.miscDetails.amount : 0,
        dueDate: nextProps.miscDetails.due_date ? nextProps.miscDetails.due_date : '',
        allowAccToEdit: nextProps.miscDetails.allow_accountant_to_edit ? nextProps.miscDetails.allow_accountant_to_edit : false
      })
    }
  }

  feeTypeHandler = (e) => {
    console.log('feetType:', e)
    this.setState({
      feeType: e
    }, () => {
      this.props.fetchMiscDetails(this.props.session, e.value, this.props.alert, this.props.user)
    })
  }

  handleEditChange= (e) => {
    switch (e.target.id) {
      case 'fee_type_amount': {
        const amountValue = e.target.value
        if (amountValue < 0) {
          this.props.alert.warning('Value should be greater the 0!')
          return
        }
        this.setState({
          feeTypeAmount: amountValue
        })
        break
      }
      case 'due_date': {
        this.setState({
          dueDate: e.target.value
        })
        break
      }
      default: {
      }
    }
  }

  changeTypeHandler = (e) => {
    this.setState({
      changeType: e
    })
  }

  saveHandler = () => {
    const { erp, feeType, feeTypeAmount, dueDate, changeType } = this.state
    let data = {
      session_year: this.props.session,
      erp_code: +erp,
      id: feeType.value,
      amount: +feeTypeAmount || 0,
      due_date: dueDate,
      update: changeType && changeType.value ? changeType.value : ''
    }
    this.props.saveStudentMiscType(data, this.props.alert, this.props.user)
    // this.props.fetchStudentMiscDetails(this.props.session, this.props.erp, this.props.alert, this.props.user)
  }

  render () {
    const { feeType, feeTypeAmount, dueDate, allowAccToEdit } = this.state
    let studentMiscTable = null
    if (this.props.studentMiscFee && this.props.studentMiscFee.length > 0) {
      studentMiscTable = (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Fee Type Name</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.studentMiscFee && this.props.studentMiscFee.length > 0
                ? this.props.studentMiscFee.map((row) => {
                  return (
                    <TableRow>
                      <TableCell>{row.other_fee && row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                      <TableCell>{row.other_fee && row.paid_amount ? row.paid_amount : 0}</TableCell>
                      <TableCell>{row.other_fee && row.balance ? row.balance : 0}</TableCell>
                    </TableRow>
                  )
                })
                : 'No Data'}
            </TableBody>
          </Table>
        </Paper>
      )
    }
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <label>Select Fee Type*</label>
            <Select
              placeholder='Select Misc Type'
              value={this.state.feeType ? this.state.feeType : null}
              options={
                this.props.miscList && this.props.miscList.length
                  ? this.props.miscList.map(feeAcc => ({
                    value: feeAcc.id,
                    label: feeAcc.fee_type_name
                  }))
                  : []
              }
              onChange={(e) => { this.feeTypeHandler(e) }}
            />
          </Grid>
          <Grid item xs={4}>
            <label>Due Date*</label>
            <TextField
              id='due_date'
              // label='Due Date'
              type='date'
              // className={classes.textField}
              disabled
              value={this.state.dueDate || ''}
              onChange={(e) => { this.handleEditChange(e) }}
              margin='normal'
              variant='outlined'
              // disabled={!allowAccToEdit}
            />
          </Grid>
          <Grid item xs={4}>
            <label>Fee Amount Balance*</label>
            <TextField
              id='fee_type_amount'
              // label='Fee Amount'
              type='number'
              min='0'
              disabled={!allowAccToEdit}
              // className={classes.textField}
              value={this.state.feeTypeAmount || ''}
              onChange={(e) => { this.handleEditChange(e) }}
              margin='normal'
              variant='outlined'
            />
          </Grid>
          <Grid item xs={4}>
            <label>Add/Replace*</label>
            <Select
              placeholder='Add/Replace'
              value={this.state.changeType ? this.state.changeType : null}
              options={[
                {
                  label: 'Add',
                  value: 1
                },
                {
                  label: 'Replace',
                  value: 2
                }
              ]}
              isDisabled={!allowAccToEdit}
              onChange={(e) => { this.changeTypeHandler(e) }}
            />
          </Grid>
          <Grid item xs={4} style={{ marginTop: 20 }}>
            <Button style={{ marginTop: '10px' }} color='primary' disabled={!feeType || !feeTypeAmount || !dueDate} variant='contained' onClick={this.saveHandler}>Save</Button>
          </Grid>
        </Grid>
        {studentMiscTable}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  miscList: state.finance.accountantReducer.currFeeTypeAcc.miscList,
  studentMiscFee: state.finance.accountantReducer.currFeeTypeAcc.studentMiscFee,
  miscDetails: state.finance.accountantReducer.currFeeTypeAcc.miscDetails
})

const mapDispatchToProps = dispatch => ({
  fetchMiscFeeList: (session, alert, user, moduleId, branchId) => dispatch(actionTypes.fetchMiscFeeList({ session, alert, user, moduleId, branchId })),
  fetchStudentMiscDetails: (session, erp, alert, user, moduleId, branchId) => dispatch(actionTypes.fetchStudentMiscDetails({ session, erp, alert, user, moduleId, branchId })),
  saveStudentMiscType: (data, alert, user) => dispatch(actionTypes.saveStudentMiscType({ data, alert, user })),
  fetchMiscDetails: (session, miscId, alert, user) => dispatch(actionTypes.fetchMiscDetails({ session, miscId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(CurrFeeTypeAcc)))
