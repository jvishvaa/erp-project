import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  TablePagination,
  Button,
  Grid,
  Divider,
  withStyles,
  Switch,
  Checkbox,
  CircularProgress,
  Modal
} from '@material-ui/core'

import {
  ArrowDownwardOutlined as ArrowIcon
} from '@material-ui/icons'

import styles from './ledgerReport.styles'
// import { CircularProgress, Modal } from '../../../../../../ui' //rajneesh
import * as actionTypes from '../../../../store/actions'
// import { TablePaginationAction } from '../../../../../../utils' // rajneesh
import { urls } from '../../../../../../urls'
import LedgerInfo from './ledgerInfo'
import Layout from '../../../../../../../../Layout'

const LedgerReport = ({ classes,
  session,
  user,
  alert,
  fetchLedgerRecord,
  fetchLedgerName,
  fetchLedgerReport,
  fetchReceiptHeader,
  receiptHeader,
  ledgerTypeList,
  downloadReports,
  ...props }) => {
  const [academicSession, setAcademicSession] = useState(null)
  const [ledgerType, setLedgerType] = useState(null)
  const [ledgerHead, setLedgerHead] = useState(null)
  const [ledgerName, setLedgerName] = useState(null)
  // const [txnType, setTxnType] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)// const excelData = props.ledgerReportList.results.map(item => {
  //   const ledgers = item.add_ledger.map(item => item.ledger_name ? item.ledger_name.ledger_account : '').join(', ')
  //   return {
  //     transaction_id: item.transaction_id || '',
  //     voucher_no: item.voucher_no || '',
  //     amount: item.total_amount || '',
  //     date: item.date || '',
  //     ledgers: ledgers || '',
  //     paid_to: (item.paid_to && item.paid_to.party_name) || '',
  //     bank: (item.bank_name && item.bank_name.bank_name) || '',
  //     cheque_no: item.cheque_no || '',
  //     cheque_date: item.cheque_date || '',
  //     approved_by: item.approved_by || '',
  //     mode: item.payment_mode || '',
  //     is_active: item.is_active ? 'Yes' : 'No'
  //   }
  // })
  const [page, setPage] = useState(1)// const excelData = props.ledgerReportList.results.map(item => {
  //   const ledgers = item.add_ledger.map(item => item.ledger_name ? item.ledger_name.ledger_account : '').join(', ')
  //   return {
  //     transaction_id: item.transaction_id || '',
  //     voucher_no: item.voucher_no || '',
  //     amount: item.total_amount || '',
  //     date: item.date || '',
  //     ledgers: ledgers || '',
  //     paid_to: (item.paid_to && item.paid_to.party_name) || '',
  //     bank: (item.bank_name && item.bank_name.bank_name) || '',
  //     cheque_no: item.cheque_no || '',
  //     cheque_date: item.cheque_date || '',
  //     approved_by: item.approved_by || '',
  //     mode: item.payment_mode || '',
  //     is_active: item.is_active ? 'Yes' : 'No'
  //   }
  // })
  const [txnModal, setTxnModal] = useState(false)
  const [txnData, setTxnData] = useState(null)
  const [ledgerChecked, setLedgerChecked] = useState(false)
  const [dateChecked, setDateChecked] = useState(false)

  useEffect(() => {
    if (academicSession) {
      // for receipt headers and subheader in voucher PDF
      fetchReceiptHeader(academicSession, user, alert)
    }
  }, [academicSession,
    fetchReceiptHeader,
    user,
    alert])

  useEffect(() => {
    if (ledgerType) {
      fetchLedgerRecord(ledgerType, user, alert)
    }
  }, [ledgerType,
    fetchLedgerRecord,
    user,
    alert])

  useEffect(() => {
    if (ledgerHead) {
      fetchLedgerName(ledgerHead, user, alert)
    }
  }, [ledgerHead, fetchLedgerName, user, alert])

  useEffect(() => {
    if (page > 1) {
      fetchLedgerReport(academicSession,
        ledgerType,
        ledgerHead,
        ledgerName,
        fromDate,
        toDate,
        user,
        alert)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fetchLedgerReport])

  const ledgerCheckHandler = (e) => {
    if (!e.target.checked) {
      setLedgerHead(null)
      setLedgerName(null)
      setLedgerType(null)
    }
    setLedgerChecked(e.target.checked)
  }

  // console.log('Props In BAnK Report', props)
  const dateCheckHandler = (e) => {
    if (!e.target.checked) {
      setFromDate(null)
      setToDate(null)
    }
    setDateChecked(e.target.checked)
  }

  const ledgerTypeChangeHandler = (e) => {
    setLedgerType(e.target.value)
    setLedgerName(null)
    setLedgerHead(null)
  }

  const ledgerHeadChangeHandler = (e) => {
    setLedgerHead(e.target.value)
    setLedgerName(null)
  }

  const handleActiveInactive = (e, id) => {
    props.setActiveInactive(id, e.target.checked, user, alert)
  }

  const fetchLedgerHandler = () => {
    if (!academicSession ||
      (ledgerChecked && (!ledgerName || !ledgerHead || !ledgerType)) ||
      (dateChecked && (!toDate || !fromDate))) {
      alert.warning('Fill all the required fields')
      return
    }
    fetchLedgerReport(
      academicSession,
      ledgerType,
      ledgerHead,
      ledgerName,
      fromDate,
      toDate,
      page,
      user,
      alert
    )
    setPage(1)
  }

  function handleChangePage (event, newPage) {
    setPage(newPage + 1)
  }

  function showTxnModal (data) {
    setTxnModal(true)
    setTxnData(data)
  }

  function createExcel () {
    // if (!props.ledgerReportList || !props.ledgerReportList.results.length) {
    //   alert.warning('No Data to Generate Excel')
    //   return
    // }
    // const columns = [
    //   {
    //     Header: 'TransactionId',
    //     accessor: 'transaction_id'
    //   },
    //   {
    //     Header: 'Voucher No',
    //     accessor: 'voucher_no'
    //   },
    //   {
    //     Header: 'Amount',
    //     accessor: 'amount'
    //   },
    //   {
    //     Header: 'Payment Mode',
    //     accessor: 'mode'
    //   },
    //   {
    //     Header: 'Date',
    //     accessor: 'date'
    //   },
    //   {
    //     Header: 'Ledgers',
    //     accessor: 'ledgers'
    //   },
    //   {
    //     Header: 'Paid To',
    //     accessor: 'paid_to'
    //   },
    //   {
    //     Header: 'Bank',
    //     accessor: 'bank'
    //   },
    //   {
    //     Header: 'Cheque No',
    //     accessor: 'cheque_no'
    //   },
    //   {
    //     Header: 'Cheque Date',
    //     accessor: 'cheque_date'
    //   },
    //   {
    //     Header: 'Approved By',
    //     accessor: 'approved_by'
    //   },
    //   {
    //     Header: 'Active',
    //     accessor: 'is_active'
    //   }
    // ]

    // const excelData = props.ledgerReportList.results.reduce((acc, item) => {
    //   const arr = item.add_ledger.map(ledger => ({
    //     transaction_id: item.transaction_id || '',
    //     voucher_no: item.voucher_no || '',
    //     amount: ledger.amount || 0,
    //     date: item.date || '',
    //     ledgers: (ledger.ledger_name && ledger.ledger_name.ledger_account) || '',
    //     paid_to: (item.paid_to && item.paid_to.party_name) || '',
    //     bank: (item.bank_name && item.bank_name.bank_name) || '',
    //     cheque_no: item.cheque_no || '',
    //     cheque_date: item.cheque_date || '',
    //     approved_by: item.approved_by || '',
    //     mode: item.payment_mode || '',
    //     is_active: item.is_active ? 'Yes' : 'No'
    //   }))
    //   return [...acc, ...arr]
    // }, [])
    // console.log('Excel Data', excelData)
    // const data = {
    //   fileName: 'Ledger Report',
    //   columns,
    //   excelData
    // }

    // generateExcel(data)
    if (academicSession) {
      const data = {
        academic_year: academicSession,
        ledger_type: ledgerType,
        ledger_head: ledgerHead,
        ledger_name: ledgerName,
        from_date: fromDate,
        to_date: toDate
      }
      downloadReports('LedgerReport.xlsx', urls.pettyReport, data, alert, user)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }

  let reportList = null
  if (props.ledgerReportList && props.ledgerReportList.results) {
    console.log('ledger main data: ', props.ledgerReportList.results)
    reportList = (

      <TableBody>
        {props.ledgerReportList.results.map((item) => {
          return (
            <TableRow key={item.id} hover classes={{ hover: classes.hover }}
              onClick={() => showTxnModal({
                transactionId: item.transaction_id,
                voucherNo: item.voucher_no,
                date: item.date,
                ledgerData: item.add_ledger,
                attachments: item.attachments,
                totalAmount: item.total_amount,
                bankName: item.bank_name && item.bank_name.bank_name,
                chequeNo: item.cheque_no,
                chequeDate: item.cheque_date,
                paidTo: item.paid_to && item.paid_to.party_name,
                paymentMode: item.payment_mode,
                approvedBy: item.approved_by,
                narration: item.narration,
                payslipHeader: receiptHeader[0].payslip_header,
                payslipSubHeader: receiptHeader[0].receipt_sub_header,
                user,
                alert
              })}
            >
              <TableCell>{item.transaction_id}</TableCell>
              <TableCell>{item.voucher_no}</TableCell>
              <TableCell size='small'>{item.total_amount}</TableCell>
              <TableCell size='small'>{item.payment_mode}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell component='tr'>
                {item.add_ledger.map((ele, index) => {
                  let customClass = {}
                  if (index === item.add_ledger.length - 1) {
                    customClass = { root: classes.tableLastCell }
                  }
                  return (
                    <TableRow>
                      <TableCell classes={customClass}>{ele.ledger_name && ele.ledger_name.ledger_account}</TableCell>
                    </TableRow>
                  )
                })}
              </TableCell>
              <TableCell>{item.paid_to && item.paid_to.party_name}</TableCell>
              <TableCell>{item.approved_by}</TableCell>
              <TableCell>
                {item.attachments && item.attachments.length > 0 && item.attachments.map((val) => {
                  return (
                    <div>
                      <TableCell><a href={val.file}>{val.file && val.file.split('/')[8]}</a></TableCell>
                    </div>
                  )
                })}
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.is_active}
                  disabled={!item.is_active}
                  onChange={(e) => handleActiveInactive(e, item.id)}
                  onClick={(e) => e.stopPropagation()}
                  // value="checkedA"
                  // inputProps={{ 'aria-label': 'secondary checkbox' }}
                  color='primary'
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }
  const hideModal = () => {
   
      setTxnModal(false)
  
  }

  let modal = null
  if (txnModal) {
    modal = (
      <Modal open={txnModal} onClose={hideModal}  click={() => setTxnModal(false)} style={{ padding: '10px', overflow: 'hidden', width: 1300,   display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'}}>
       <div style={{ background: 'white'}} >
        <LedgerInfo data={txnData}  download={props.downloadAttachments} />
        </div>
      </Modal>
    )
  }

  return (
    <Layout>
    <div className={classes.mainContainer}>
      <Grid container spacing={3} style={{ padding: 15 }} alignItems='center'>
        <Grid item xs={12} md={3}>
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
        {
          ledgerChecked ? (
            <React.Fragment>
              <Grid item xs={12} md={3}>
                <TextField
                  label='Ledger Type'
                  required
                  select
                  // className={classes.firstTextField}
                  value={ledgerType || ''}
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={ledgerTypeChangeHandler}
                >
                  {ledgerTypeList.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.ledger_type_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label='Ledger Head'
                  required
                  select
                  // className={classes.firstTextField}
                  value={ledgerHead || ''}
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={ledgerHeadChangeHandler}
                >
                  {props.leadgerHeadList.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.account_head_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label='Ledger Name'
                  required
                  select
                  // className={classes.firstTextField}
                  value={ledgerName || ''}
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={(e) => setLedgerName(e.target.value)}
                >
                  {props.ledgerNameList.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.ledger_account}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </React.Fragment>
          ) : null
        }
        {/* <Grid item xs={12} md={3}>
          <TextField
            label='Transaction Type'
            required
            select
            // className={classes.firstTextField}
            value={txnType || ''}
            margin='normal'
            variant='outlined'
            fullWidth
            onChange={(e) => setTxnType(e.target.value)}
          >
            {TXN_TYPE.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}
        {
          dateChecked ? (
            <React.Fragment>
              <Grid item xs={12} md={3}>
                <TextField
                  label='From Date'
                  required
                  type='date'
                  value={fromDate || ' '}
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label='To Date'
                  type='date'
                  required
                  value={toDate || ' '}
                  margin='normal'
                  variant='outlined'
                  fullWidth
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ) : null
        }
        <Grid item xs={12} md={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={fetchLedgerHandler}
          >
            Get
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            checked={ledgerChecked}
            onChange={ledgerCheckHandler}
            value='ledggerChecked'
            color='primary'
          />
          <span>Filter By Ledger Type</span>
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            checked={dateChecked}
            onChange={dateCheckHandler}
            value='dateChecked'
            color='primary'
          />
          <span>Filter By Date</span>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container justify='flex-end'>
        <Grid item xs={2}>
          <Button variant='contained' color='primary' onClick={createExcel}>
            <ArrowIcon />
            Import
          </Button>
        </Grid>
      </Grid>
      <div className={classes.tableContainer}>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Id</TableCell>
                <TableCell>Voucher No</TableCell>
                <TableCell size='small'>Amount</TableCell>
                <TableCell size='small'>Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Ledger</TableCell>
                <TableCell>Paid To</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Attachments</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            {reportList}
            <TableFooter>
              <TableRow classes={{ root: classes.footerRow }}>
                <TablePagination
                  rowsPerPageOptions={[50]}
                  classes={{ root: classes.paginationRoot }}
                  colSpan={3}
                  count={props.ledgerReportList ? +props.ledgerReportList.count : 1}
                  rowsPerPage={50}
                  page={page - 1}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={handleChangePage}
                  // onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  // ActionsComponent={TablePaginationAction}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
      {modal}
      {props.dataLoading ? <CircularProgress open /> : null}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.finance.common.financialYear,
  dataLoading: state.finance.common.dataLoader,
  ledgerTypeList: state.finance.common.ledgerType,
  leadgerHeadList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.ledgerHeadList,
  ledgerNameList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.ledgerNameList,
  ledgerReportList: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.ledgerReportList,
  receiptHeader: state.finance.accountantReducer.expenseMngmtAcc.pettyExpenses.receiptHeader
})

const mapDispatchToProps = (dispatch) => ({
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear()),
  loadLedgerType: dispatch(actionTypes.fetchLedgerType()),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchLedgerRecord: (ledgerType, user, alert) => dispatch(actionTypes.fetchLedgerRecord({ ledgerType, user, alert })),
  fetchLedgerName: (headId, user, alert) => dispatch(actionTypes.fetchLedgerName({ headId, user, alert })),
  fetchLedgerReport: (academicSession, ledgerType, ledgerHead, ledgerName, fromDate, toDate, page, user, alert) => dispatch(actionTypes.fetchLedgerReport({ academicSession, ledgerType, ledgerHead, ledgerName, fromDate, toDate, page, user, alert })),
  setActiveInactive: (id, status, user, alert) => dispatch(actionTypes.setTxnActiveInactive({ id, status, user, alert })),
  downloadAttachments: (urls, user, alert) => dispatch(actionTypes.downloadLedgerAttachment({ urls, user, alert })),
  fetchReceiptHeader: (session, user, alert) => dispatch(actionTypes.fetchReceiptHeader({ session, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LedgerReport))
