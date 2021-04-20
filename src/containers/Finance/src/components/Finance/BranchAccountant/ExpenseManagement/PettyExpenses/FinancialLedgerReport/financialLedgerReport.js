import React, { useState } from 'react'
import {
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  withStyles,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from '@material-ui/core'

import {
  ArrowDownward as ArrowIcon
} from '@material-ui/icons'

import { connect } from 'react-redux'

import styles from './financialLedgerReport.styles'
import * as actionTypes from '../../../../store/actions'
import generateExcel from '../../../../../../utils/generateExcel'
import Layout from '../../../../../../../../Layout'

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Expanse Management' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Petty Cash Expense') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

const FinancialLedgerReport = ({ classes, session, alert, user, recData, ...props }) => {
  const [academicSession, setAcademicSession] = useState(null)

  const getLedgerReport = () => {
    if (!academicSession) {
      alert.warning('Please Fill All Fields')
      return
    }
    props.fetchLedgerReport(academicSession, recData && recData.branch, user, alert)
  }

  const createExcel = () => {

    if (!props.ledgerReport || !props.ledgerReport.ledger_report.length) {
      alert.warning('No Data To generate Excel')
      return
    }

    const monthHead = props.ledgerReport.month_list.map(item => (
      {
        Header: item,
        accessor: item
      }
    ))

    const columns = [
      {
        Header: 'Ledger Head',
        accessor: 'ledger_head'
      },
      ...monthHead
    ]

    const excelData = props.ledgerReport.ledger_report.map(item => ({
      ledger_head: item.ledger_head,
      ...props.ledgerReport.month_list.reduce((acc, ele) => {
        acc[ele] = item[ele]
        return acc
      }, {})
    }))

    const fileName = `FinancialLedgerReport_${academicSession}`

    const data = {
      fileName,
      excelData,
      columns
    }
    generateExcel(data)
  }

  let table = null

  if (props.ledgerReport &&
    props.ledgerReport.month_list.length &&
    props.ledgerReport.ledger_report.length
  ) {
    table = (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Ledger Name</TableCell>
            {props.ledgerReport.month_list.map(item => (
              <TableCell key={item}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.ledgerReport.ledger_report.map((item, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.ledger_head}</TableCell>
              {props.ledgerReport.month_list.map(key => (
                <TableCell key={key}>{item[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Layout>
    <div className={classes.container}>
      <Grid container alignItems='center' spacing={3} style={{ padding: 15 }}>
        <Grid item xs={4}>
          <TextField
            label='Financial Year'
            select
            // className={classes.firstTextField}
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
            onClick={getLedgerReport}
          >
            Get
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container justify='flex-end'>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={createExcel}
          >
            <ArrowIcon />
            Import
          </Button>
        </Grid>
      </Grid>
      {table}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.finance.common.financialYear,
  ledgerReport: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.financialLedgerReport,
  recData: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.sendData
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear(moduleId)),
  fetchLedgerReport: (session, branch, user, alert) => dispatch(actionTypes.fetchFinancialLedgerReport({ session, branch, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FinancialLedgerReport))
