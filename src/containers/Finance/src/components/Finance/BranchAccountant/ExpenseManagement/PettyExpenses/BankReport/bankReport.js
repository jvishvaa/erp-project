import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Typography,
  Divider,
  Grid,
  withStyles,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from '@material-ui/core'

import {
  ArrowDownwardOutlined as ArrowIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router'
import styles from './bankReport.styles'
import * as actionTypes from '../../../../store/actions'
import { generateExcel } from '../../../../../../utils'

const BankReport = ({ user, alert, session, classes, ...props }) => {
  const [academicSession, setAcademicSession] = useState(null)
  const getBankStatements = () => {
    const bankId = props.match.params.id
    if (!academicSession || !bankId) {
      alert.warning('Please Provide All Data')
      return
    }
    props.fetchBankStatement(academicSession, bankId, user, alert)
  }

  const createExcel = () => {
    if (!props.bankStatements || !props.bankStatements.transactions.length) {
      alert.warning('No Data to generate Excel')
      return
    }
    const columns = [
      {
        Header: 'Month',
        accessor: 'month'
      },
      {
        Header: 'Debit Amount',
        accessor: 'debit'
      },
      {
        Header: 'Credit Amount',
        accessor: 'credit'
      },
      {
        Header: 'Closing Balance',
        accessor: 'closing'
      }
    ]

    const excelData = props.bankStatements.transactions.map(item => ({
      month: item.month || '',
      debit: item.debit_amount || 0,
      credit: item.credit_amount || 0,
      closing: item.closing_balance || 0
    }))

    const fileName = `Bank-${academicSession}-report`

    const data = {
      fileName,
      columns,
      excelData
    }
    generateExcel(data)
  }

  return (
    <div className={classes.container}>
      <Typography variant='h5' className={classes.header}>
        Bank Report
      </Typography>
      <Divider className={classes.divider} />
      <Grid container alignItems='center' spacing={16}>
        <Grid item xs={4}>
          <TextField
            label='Financial Year'
            select
            value={academicSession || ''}
            margin='normal'
            variant='outlined'
            required
            fullWidth
            onChange={(e) => setAcademicSession(e.target.value)}
          >
            {session.length
              ? session.map(item => (
                <MenuItem key={item.session_year} value={item.session_year}>
                  {item.session_year}
                </MenuItem>
              )) : []}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={getBankStatements}
          >
            Get
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container justify='space-between'>
        <Grid item xs={2}>
          <Typography variant='h6'>Opening Balance: {props.bankStatements && props.bankStatements.opening_balance}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant='outlined' color='primary' onClick={createExcel}>
            <ArrowIcon />
            Import
          </Button>
        </Grid>
      </Grid>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Closing Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.bankStatements && props.bankStatements.transaction && props.bankStatements.transactions.map((item, index) => {
              return (
                <TableRow key={item.month}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.month}</TableCell>
                  <TableCell>{item.debit_amount}</TableCell>
                  <TableCell>{item.credit_amount}</TableCell>
                  <TableCell>{item.closing_balance}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.finance.common.financialYear,
  bankStatements: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.bankStatements
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear()),
  fetchBankStatement: (session, bankId, user, alert) => dispatch(actionTypes.fetchBankStatement({ session, bankId, user, alert }))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BankReport)))
// export default BankReport
