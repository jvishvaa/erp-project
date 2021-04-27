import React, {
  useEffect,
  useState
} from 'react'
import { withStyles, Grid,
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Stepper, StepLabel, Step, Button, TextField
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import TablePaginationActions from '../../TablePaginationAction'
import Modal from '../../../../ui/Modal/modal'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  item: {
    margin: '15px'
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
})

const StoreItemStatus = ({ classes, session, erp, history, fetchDispatchDetails, dataLoading, orderStatusList, alert, user, fetchOrderStatus, sendExchangeDetails }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [reasonData, setReasonData] = useState(null)
  const [transId, setTransId] = useState(null)
  const [skuCode, setSkuCode] = useState(null)
  // const [studentId, setStudentId] = useState(null)
  const [desp, setDesp] = useState('')
  // const [activeStep, setActiveStep] = useState(0)
  const steps = ['Paid', 'Dispatched', 'Delivered']
  useEffect(() => {
    // hi
    fetchOrderStatus(session, erp, rowsPerPage || 30, page || 1, alert, user)
  }, [alert, erp, page, rowsPerPage, fetchOrderStatus, session, user])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  const showModalHandler = (transId, skuCode) => {
    setTransId(transId)
    setSkuCode(skuCode)
    setShowModal(!showModal)
  }

  // const showDetailModalHandler = (transId, skuCode, stuId) => {
  //   fetchDispatchDetails(transId, skuCode, stuId, alert, user)
  // }

  const orderListTable = () => {
    if (orderStatusList && orderStatusList.results.length) {
      return (
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Transaction ID</TableCell>
                  <TableCell align='center'>Item Name</TableCell>
                  <TableCell align='center'>SKU</TableCell>
                  <TableCell align='center'>Amount</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Exchange</TableCell>
                  {/* <TableCell align='center'>Dispatch Details</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderStatusList.results.map((row, index) => (
                  <TableRow key={index + 1}>
                    <TableCell align='center'>{row.transaction_id ? row.transaction_id : '-'}</TableCell>
                    <TableCell align='center'>{row.item && row.item.item_name ? row.item.item_name : '-'}</TableCell>
                    <TableCell align='center'>{row.item && row.item.sku_code ? row.item.sku_code : '-'}</TableCell>
                    <TableCell align='center'>{row.amount ? row.amount : '-'}</TableCell>
                    <TableCell align='center'>
                      <Stepper activeStep={row.order_status === '2' ? 1 : row.order_status === '3' ? 2 : row.order_status === '4' ? 3 : 0} alternativeLabel>
                        {steps.map(label => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </TableCell>
                    <TableCell align='center'>
                      <Button variant='outlined' color='primary' disabled={row.is_exchange || row.order_status !== '4'} onClick={() => showModalHandler(row.transaction_id, row.item && row.item.sku_code)}>{row.is_exchange ? 'Exchange Initiated' : 'Exchange'}</Button>
                    </TableCell>
                    {/* <TableCell align='center'>
                      <Button variant='outlined' color='primary' onClick={() => showDetailModalHandler(row.transaction_id, row.item && row.item.sku_code, row.student)}>Details</Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+orderStatusList.count / (+rowsPerPage || 30))}`}
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    rowsPerPage={rowsPerPage || 30}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'Rows per page' }
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </div>
      )
    } else {
      return (
        <div style={{ margin: '20px', fontSize: '16px' }}>
          No Records
        </div>
      )
    }
  }

  const hideInfoModalHandler = () => {
    setShowModal(!showModal)
    setDesp('')
    setReasonData(null)
  }

  const reasonHandler = (e) => {
    setReasonData(e)
  }

  const despHandler = (e) => {
    setDesp(e.target.value)
  }

  const exchangeHandler = () => {
    // send the exchange data
    let body = {
      transaction_id: transId,
      sku_code: skuCode,
      erp: erp,
      reason: reasonData.label,
      description: desp
    }
    sendExchangeDetails(body, alert, user)
    hideInfoModalHandler()
  }

  const modalHandler = () => {
    return (
      <Modal open={showModal} click={hideInfoModalHandler} medium>
        <h3 style={{ textAlign: 'center' }}>Exchange Details</h3>
        <hr />
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs={4}>
            <label>Reason*</label>
            <Select
              placeholder='Select Reason'
              value={reasonData || null}
              options={[
                {
                  label: 'Size is wrong',
                  value: 1
                },
                {
                  label: 'Poor Quality',
                  value: 2
                },
                {
                  label: 'Damaged Product',
                  value: 3
                },
                {
                  label: 'Wrong Item received',
                  value: 4
                }
              ]}
              onChange={reasonHandler}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='desp'
              label='Description'
              type='text'
              variant='outlined'
              value={desp || ''}
              className={classes.textField}
              onChange={despHandler}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant='outlined' onClick={exchangeHandler} disabled={!desp || !reasonData}>
              Exchange
            </Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className={classes.item} xs={3}>
          Order Status List
        </Grid>
      </Grid>
      {orderStatusList && orderStatusList.results && orderStatusList.results.length ? orderListTable() : 'No Data'}
      {showModal ? modalHandler() : ''}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

StoreItemStatus.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  orderStatusList: state.finance.accountantReducer.storeItemStatus.orderStatusList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchOrderStatus: (session, erp, pageSize, page, alert, user) => dispatch(actionTypes.fetchOrderStatus({ session, erp, pageSize, page, alert, user })),
  sendExchangeDetails: (body, alert, user) => dispatch(actionTypes.sendExchangeDetails({ body, alert, user })),
  fetchDispatchDetails: (transId, skuCode, studentId, alert, user) => dispatch(actionTypes.fetchDispatchDetails({ transId, skuCode, studentId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(StoreItemStatus)))
