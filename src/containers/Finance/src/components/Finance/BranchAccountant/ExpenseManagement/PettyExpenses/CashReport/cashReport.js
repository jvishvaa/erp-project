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
import styles from './cashReport.styles'
import * as actionTypes from '../../../../store/actions'
// import { generateExcel } from '../../../../../../utils'
import Layout from '../../../../../../../../Layout'

const CashReport = ({ user, alert, session, classes, ...props }) => {
  const [academicSession, setAcademicSession] = useState(null)
  const getCashStatements = () => {
    if (!academicSession) {
      alert.warning('Please Provide All Data')
      return
    }
    props.fetchCashStatement(academicSession, user, alert)
  }

  const createExcel = () => {
    if (!props.cashStatements || !props.cashStatements.transactions.length) {
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

    const excelData = props.cashStatements.transactions.map(item => ({
      month: item.month || '',
      debit: item.debit_amount || 0,
      credit: item.credit_amount || 0,
      closing: item.closing_balance || 0
    }))

    const fileName = `Cash-${academicSession}-report`

    const data = {
      fileName,
      columns,
      excelData
    }
    // generateExcel(data)
  }

  return (
    <Layout>
    <div className={classes.container}>
      <Typography variant='h5' className={classes.header}>
        Cash Report
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
            onClick={getCashStatements}
          >
            Get
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container justify='space-between'>
        <Grid item xs={2}>
          <Typography variant='h6'>Opening Balance: {props.cashStatements && props.cashStatements.opening_balance}</Typography>
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
            {props.cashStatements && props.cashStatements.transactions && props.cashStatements.transactions.map((item, index) => {
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
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.finance.common.financialYear,
  cashStatements: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.cashStatements
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear()),
  fetchCashStatement: (session, user, alert) => dispatch(actionTypes.fetchCashStatement({ session, user, alert }))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CashReport)))
// export default BankReport
