import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import { withStyles, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core/'
// import axios from 'axios'
import { Grid } from 'semantic-ui-react'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../../store/actions/index'
// import feeReceipts from '../../../Receipts/feeReceipts'
// import { urls } from '../../../../../urls'
// import customClasses from './chequePayments.module.css'

const styles = theme => ({
  button: {
    borderRadius: '5px',
    backgroundColor: '#2196f3',
    padding: '2px !important',
    '&:hover': {
      backgroundColor: '#0b7dda'
    }
  },
  buttonRed: {
    borderRadius: '5px',
    backgroundColor: '#e53935',
    padding: '2px !important',
    marginTop: '10px !important',
    '&:hover': {
      backgroundColor: '#b71c1c'
    }
  }
})
class ChequeBounce extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showBounceFields: false,
      bounceDate: new Date().toLocaleDateString(),
      bounceAmount: 0,
      bounceReason: '',
      transId: null
    }
  }
  componentDidMount () {
    // console.log('helloo from bounce!', this.props.chequeId)
    this.props.fetchChequeBounce(this.props.erp, this.props.transId, this.props.user, this.props.alert)
  }

  showBounceFieldsHandler = () => {
    this.setState({ showBounceFields: !this.state.showBounceFields })
  }

  sendBounceHandler = () => {
    console.log('sending the data')
    let data = {
      transaction_id: this.props.chequeBounceData[0].transaction_id,
      academic_year: this.props.session,
      erp: this.props.erp,
      amount: this.state.bounceAmount,
      reason: this.state.bounceReason
    }
    this.props.saveChequeBounce(this.props.chequeBounce, data, this.props.user, this.props.alert)
    this.props.close()
  }

  render () {
    const { classes } = this.props
    let bounceTable = null
    let bounceFields = null
    if (this.props.chequeBounceData) {
      // console.log('the data from cheque Bounce', this.props.chequeBounceData)
      bounceTable = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cheque No</TableCell>
              <TableCell>MICR Code</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>ERP</TableCell>
              <TableCell>Class/Section</TableCell>
              <TableCell>Transaction Id</TableCell>
              <TableCell>Receipt Date</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Mark As Bounce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.chequeBounceData.map((row) => {
              return (
                <React.Fragment>
                  <TableRow hover >
                    <TableCell><div style={{ width: '70px' }}>{row.cheque_number}</div></TableCell>
                    <TableCell>{row.micr_code}</TableCell>
                    <TableCell><div style={{ width: '80px' }}>{row.date_of_cheque}</div></TableCell>
                    <TableCell><div style={{ width: '80px' }}>{row.student && row.student.name ? row.student.name : ''}</div></TableCell>
                    <TableCell>{row.student && row.student.erp}</TableCell>
                    <TableCell>{row.student && row.student.grade && row.student.grade.grade} >> {row.student && row.student.acad_section_mapping && row.student.acad_section_mapping.section}</TableCell>
                    <TableCell><div style={{ width: '80px' }}>{row.transaction_id}</div></TableCell>
                    <TableCell><div style={{ width: '70px' }}>{row.date_of_receipt}</div></TableCell>
                    <TableCell><div style={{ width: '50px' }}>{row.amount}</div></TableCell>
                    <TableCell><Button primary className={classes.buttonRed} style={{ cursor: 'pointer', color: '#fff' }} onClick={() => { this.showBounceFieldsHandler() }}> Mark As Bounce</Button></TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      )
    } else {
      bounceTable = (
        'No Data'
      )
    }

    if (this.state.showBounceFields) {
      bounceFields = (
        <div style={{ marginLeft: '20px', padding: '20px' }}>
          <Grid>
            {this.props.chequeBounceData.map((row) => {
              // this.setState({ transId: row.transaction_id })
              return (
                // <div>
                <Grid.Row>
                  <Grid.Column computer={4}>
                    Check number: {row.cheque_number}
                  </Grid.Column>
                  <Grid.Column computer={4}>
                    Check Amount: {row.amount}
                  </Grid.Column>
                  <Grid.Column computer={4}>
                    Bank Name: {row.bank_name}
                  </Grid.Column>
                  <Grid.Column computer={4}>
                    Branch Name: {row.bank_branch}
                  </Grid.Column>
                </Grid.Row>
                // </div>
              )
            })}
            <Grid.Row>
              <Grid.Column computer={4}>
                <label>Bounce Date:</label>
                {this.state.bounceDate}
              </Grid.Column>
              <Grid.Column computer={4}>
                <label>Cheque Bounce Reason: </label>
                <input
                  name='bounceReason'
                  type='text'
                  className='form-control'
                  onChange={e =>
                    this.setState({ bounceReason: e.target.value })
                  }
                  placeholder='Bounce Reason'
                  value={this.state.bounceReason}
                />
              </Grid.Column>
              <Grid.Column computer={4}>
                <label>Cheque Bounce Amount: </label>
                <input
                  name='bounceAmount'
                  type='number'
                  className='form-control'
                  onChange={e =>
                    this.setState({ bounceAmount: e.target.value })
                  }
                  placeholder='Bounce Amount'
                  value={this.state.bounceAmount}
                />
              </Grid.Column>
              <Grid.Column computer={4}>
                <div style={{ marginTop: '20px' }}>
                  <Button
                    primary
                    className={classes.button}
                    disabled={!this.state.bounceReason || this.state.bounceAmount === 0}
                    onClick={this.sendBounceHandler}
                    style={{ color: '#fff' }}>
                    Save
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )
    }
    return (
      <div>
        {/* {transactionTable} */}
        {/* <div className={customClasses.totalAmount}>
          <p>Total Amount: {this.props.chequeTransactions ? this.props.chequeTransactions.total : 0}</p>
        </div> */}
        {bounceTable}
        {bounceFields}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  chequeBounceData: state.finance.accountantReducer.chequePayment.chequeBounceData,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  fetchChequeBounce: (erp, transId, user, alert) => dispatch(actionTypes.fetchChequeBounce({ erp, transId, user, alert })),
  saveChequeBounce: (chequeBounce, data, user, alert) => dispatch(actionTypes.saveChequeBounce({ chequeBounce, data, user, alert }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChequeBounce))
