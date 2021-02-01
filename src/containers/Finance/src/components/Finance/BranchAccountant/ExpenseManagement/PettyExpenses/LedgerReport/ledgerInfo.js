import React from 'react'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  Grid,
  Divider,
  withStyles,
  Button
} from '@material-ui/core'
import {
  ArrowDownwardOutlined as ArrowIcon
} from '@material-ui/icons'
import voucherPdf from '../../../../Receipts/voucherPdf'
import styles from './ledgerInfo.styles'

const LedgerInfo = ({ data, classes, ...props }) => {
  const generateVoucherPdf = () => {
    if (data) {
      voucherPdf(data)
    }
  }
  return (
    <React.Fragment>
      <Typography variant='h4' className={classes.header}>Transaction Details</Typography>
      <div className={classes.downloadWrapper}>
        <Button className={classes.downloadBtn} onClick={generateVoucherPdf}><ArrowIcon /> Download</Button>
      </div>
      <Divider className={classes.divider} />
      <Grid container>
        <Grid item xs={3}>
          Transaction Id :
        </Grid>
        <Grid>
          {data.transactionId || ''}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          Date :
        </Grid>
        <Grid>
          {data.date || ''}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          Paid To :
        </Grid>
        <Grid>
          {data.paidTo || ''}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          Total Amount :
        </Grid>
        <Grid>
          {data.totalAmount || 0}
        </Grid>
      </Grid>
      {data.bankName && (
        <Grid container>
          <Grid item xs={3}>
          Bank Name :
          </Grid>
          <Grid>
            {data.bankName || ''}
          </Grid>
        </Grid>
      )}
      {
        data.chequeNo && (
          <Grid container>
            <Grid item xs={3}>
            Cheque Number :
            </Grid>
            <Grid>
              {data.chequeNo || ''}
            </Grid>
          </Grid>
        )
      }
      {
        data.chequeDate && (
          <Grid container>
            <Grid item xs={3}>
            Cheque Date :
            </Grid>
            <Grid>
              {data.chequeDate || ''}
            </Grid>
          </Grid>
        )
      }
      {
        data.attachments && data.attachments.length && (
          <Grid container>
            <Grid item xs={3}>
              <div
                className={classes.downloadLink}
                onClick={() => props.download(data.attachments, data.user, data.alert)}
              >Download Attachments</div>
            </Grid>
          </Grid>
        )
      }

      <Divider className={classes.divider} />
      <Typography variant='h5' className={classes.tableHeader}>Ledger Data</Typography>
      <Table>
        <TableHead>
          <TableCell>S.no</TableCell>
          <TableCell>Ledger Type</TableCell>
          <TableCell>Ledger Head</TableCell>
          <TableCell>Ledger Name</TableCell>
          <TableCell>Narration</TableCell>
          <TableCell>Amount</TableCell>
        </TableHead>
        <TableBody>
          {data.ledgerData.map((item, index) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.ledger_type && item.ledger_type.ledger_type_name}</TableCell>
                <TableCell>{item.ledger_head && item.ledger_head.account_head_name}</TableCell>
                <TableCell>{item.ledger_name && item.ledger_name.ledger_account}</TableCell>
                <TableCell>{item.narration}</TableCell>
                <TableCell>{item.amount}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

export default withStyles(styles)(LedgerInfo)
