import React, { useState, useEffect } from 'react'
import {
  Button,
  // Fab,
  //   withStyles
  Table, TableBody, TableRow, TableCell, TableHead, TextField
} from '@material-ui/core'
import { Info } from '@material-ui/icons'
import 'react-table/react-table.css'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import { connect } from 'react-redux'
import zipcelx from 'zipcelx'
import * as actionTypes from '../store/actions'
import Modal from '../../../ui/Modal/modal'
import { apiActions } from '../../../_actions'
import { urls } from '../../../urls'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

const ExtraAmtAdjust = ({ classes, session, branches, fetchBranches, feeStructure, deleteWalletUnusedAmount, notUsedWalletAmtList, fetchWalletAmtNotUsed, addWalletAmount, fetchFeeStructureListErp, fetchTransDetails, unassignStudent, downloadReports, transactionDetails, fetchWalletAmount, WalletAmtDetails, sendValidRequest, fetchGradesPerBranch, fetchAllSectionsPerGradeAsAdmin, alert, user, dataLoading, gradesPerBranch, sections }) => {
  const [sessionData, setSessionData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [requestWalletAmt, setRequestWalletAmt] = useState(false)
  const [showWalletDeatilTable, setShowWalletDeatilTable] = useState(false)
  const [transInfoModel, setTransInfoModel] = useState(false)
  const [searchErp, setErpsearch] = useState(null)
  const [filterWalletErp, setFilterWalletErp] = useState(null)
  const [remaningAmount, setRemaningAmount] = useState(null)
  const [feeDisplay, setFeeDisplay] = useState(false)
  const [amount, setAmount] = useState({})
  const [feeType, setFeeType] = useState(null)
  const [instName, setInsName] = useState(null)
  const [amtPaid, setAmtPaid] = useState(null)
  const [transId, setTransId] = useState(null)
  const [amountWallet, setAmountWallet] = useState(null)
  const [fieldId, setFieldId] = useState(null)
  // const [paidDate, setPaidDate] = useState(null) // const [fullReportData, setFullReportData] = useState([])
  const [erp, setErp] = useState(null)
  const [showDeleteModal, setshowDeleteModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [deleteAmount, setDeleteAmount] = useState(null)
  const [deleteRemark, setDeleteRemark] = useState('')
  const [deleteInstId, setDeleteInstId] = useState(null)
  const [walletUnusedAmt, setWalletUnusedAmt] = useState(null)
  // const [show, setShow] = useState(true)
  useEffect(() => {
    setFilterWalletErp(WalletAmtDetails)
    console.log(WalletAmtDetails)
  }, [WalletAmtDetails])
  // useEffect(() => {
  //   if (transactionDetails && transactionDetails.debited_info && transactionDetails.credited_info) {
  //     let fullData = []
  //     fullData = transactionDetails && transactionDetails.debited_info
  //     let fullData1 = []
  //     fullData1 = transactionDetails && transactionDetails.credited_info
  //     fullData.push(...fullData1)
  //     setFullReportData(fullData)
  //   } else if (transactionDetails && transactionDetails.debited_info) {
  //     let fullData = []
  //     fullData = transactionDetails && transactionDetails.debited_info
  //     setFullReportData(fullData)
  //   } else if (transactionDetails && transactionDetails.credited_info) {
  //     let fullData = []
  //     fullData = transactionDetails && transactionDetails.credited_info
  //     setFullReportData(fullData)
  //   }
  // }, [transactionDetails])
  const handleClickSessionYear = (e) => {
    setSessionData(e)
    fetchBranches(e.value, alert, user)
    setBranchData(null)
    setGradeData(null)
    setShowWalletDeatilTable(false)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    fetchGradesPerBranch(alert, user, sessionData.value, e.value)
    setGradeData(null)
    setShowWalletDeatilTable(false)
  }
  const gradeHandler = (e) => {
    console.log(e.value)
    setGradeData(e)
    setShowWalletDeatilTable(false)
    fetchAllSectionsPerGradeAsAdmin(sessionData.value, alert, user, e && e.value, branchData.value)
  }
  const validHandler = () => {
    if (sessionData && gradeData && branchData) {
      setShowWalletDeatilTable(true)
      fetchWalletAmount(sessionData && sessionData.value, branchData && branchData.value, gradeData && gradeData.value, alert, user)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }
  const hideRequestWalletAmtHandler = () => {
    setRequestWalletAmt(false)
  }
  const WalletRequestAmtHandler = () => {
    if (sessionData && branchData && gradeData) {
      const data = {
        academic_year: sessionData && sessionData.value,
        branch: branchData && branchData.value,
        grade: gradeData && gradeData.value
      }
      sendValidRequest(data, alert, user)
      setRequestWalletAmt(false)
    } else {
      alert.warning('Fill all the required Fields!')
    }
  }
  const WalletReportHandler = () => {
    if (sessionData && gradeData && branchData) {
      downloadReports('WalletReport.xlsx', `${urls.WalletAmountReport}?academic_year=${sessionData && sessionData.value}&branch=${branchData && branchData.value}&grade=${gradeData && gradeData.value}`, alert, user)
    } else {
      alert.warning('Select all Required Field!')
    }
  }
  const walletAmtRequestHandler = () => {
    setRequestWalletAmt(true)
  }
  let reqWalletAmtModal = null
  if (requestWalletAmt) {
    reqWalletAmtModal = (
      <Modal open={requestWalletAmt} click={hideRequestWalletAmtHandler} large>
        <React.Fragment>
          <Grid container spacing={3} wrap='wrap'style={{ padding: '15px' }}>
            <Grid item xs={3}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Academic Year'
                value={sessionData}
                options={
                  session
                    ? session.session_year.map((session) => ({
                      value: session,
                      label: session }))
                    : []
                }
                onChange={handleClickSessionYear}
              />
            </Grid>
            <Grid item xs={3}>
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                value={branchData}
                options={
                  branches.length
                    ? branches.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
                    : []
                }
                onChange={changehandlerbranch}
              />
            </Grid>
            <Grid item xs={3}>
              <label>Grades*</label>
              <Select
                placeholder='Select Grade'
                value={gradeData}
                options={
                  gradesPerBranch
                    ? gradesPerBranch.map(grades => ({
                      value: grades.grade.id,
                      label: grades.grade.grade
                    }))
                    : []
                }
                onChange={gradeHandler}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={WalletRequestAmtHandler}
              >Request Wallet Amount</Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }
  const showInstaModalHandler = (student, remAmount) => {
    setRemaningAmount(remAmount)
    setTransInfoModel(true)
    fetchTransDetails(sessionData && sessionData.value, branchData && branchData.value, gradeData && gradeData.value, student, alert, user)
  }
  const hideWalletInfoModelHandler = () => {
    setTransInfoModel(false)
  }
  const transInfoDownloadHandler = () => {
    const headers = [
      {
        value: 'Fee Type Name',
        type: 'string'
      },
      {
        value: 'Installment Name',
        type: 'string'
      },
      {
        value: 'Transaction Id',
        type: 'string'
      },
      {
        value: 'Paid Date',
        type: 'string'
      },
      {
        value: 'Payment Choice',
        type: 'string'
      },
      {
        value: 'Amount(₹)',
        type: 'string'
      },
      // {
      //   value: 'Other Fee',
      //   type: 'string'
      // },
      // {
      //   value: 'Other Fee Installment',
      //   type: 'string'
      // },
      {
        value: 'Added By',
        type: 'string'
      },
      {
        value: 'Status',
        type: 'string'
      },
      {
        value: 'Remark',
        type: 'string'
      }
    ]
    const body = transactionDetails && +transactionDetails.credited_info.length >= 0 && transactionDetails.credited_info.map((val) => {
      return ([
        {
          value: (val.fee_type && val.fee_type.fee_type_name) || (val.other_fee && val.other_fee.fee_type_name),
          type: 'string'
        },
        {
          value: (val.installment && val.installment.installment_name) || (val.other_fee_inst && val.other_fee_inst.installment_name),
          type: 'string'
        },
        {
          value: val.transaction_id,
          type: 'string'
        },
        {
          value: val.paid_date,
          type: 'string'
        },
        {
          value: val.payment_choice === '1' ? 'Cash' : val.payment_choice === '2' ? 'Cheque' : val.payment_choice === '3' ? 'Internet' : val.payment_choice === '4' ? 'Swipe' : val.payment_choice === '5' ? 'Online' : val.payment_choice === '6' ? 'Wallet' : '',
          type: 'string'
        },
        {
          value: '+ ₹' + val.amount,
          type: 'string'
        },
        // {
        //   value: val.other_fee,
        //   type: 'string'
        // },
        // {
        //   value: val.other_fee_inst,
        //   type: 'string'
        // },
        // {
        //   value: val.other_fee,
        //   type: 'string'
        // },
        // {
        //   value: val.other_fee_inst,
        //   type: 'string'
        // },
        {
          value: val.added_by && val.added_by.first_name,
          type: 'string'
        },
        {
          value: 'Added',
          type: 'string'
        },
        {
          value: val.remarks,
          type: 'string'
        }
      ])
    })
    const body1 = transactionDetails && transactionDetails.debited_info && transactionDetails.debited_info.map((val) => {
      return ([
        {
          value: (val.fee_type && val.fee_type.fee_type_name) || (val.other_fee && val.other_fee.fee_type_name),
          type: 'string'
        },
        {
          value: (val.installment && val.installment.installment_name) || (val.other_fee_inst && val.other_fee_inst.installment_name),
          type: 'string'
        },
        {
          value: val.transaction_id,
          type: 'string'
        },
        {
          value: val.used_date,
          type: 'string'
        },
        {
          value: val.payment_choice === '1' ? 'Cash' : val.payment_choice === '2' ? 'Cheque' : val.payment_choice === '3' ? 'Internet' : val.payment_choice === '4' ? 'Swipe' : val.payment_choice === '5' ? 'Online' : val.payment_choice === '6' ? 'Wallet' : '',
          type: 'string'
        },
        {
          value: '- ₹' + val.used_amount,
          type: 'string'
        },
        // {
        //   value: val.other_fee,
        //   type: 'string'
        // },
        // {
        //   value: val.other_fee_inst,
        //   type: 'string'
        // },
        {
          value: val.added_by && val.added_by.first_name,
          type: 'string'
        },
        {
          value: 'Used',
          type: 'string'
        },
        {
          value: val.remark,
          type: 'string'
        }
      ])
    })
    body && body1 && body.push(...body1)
    console.log('body: ', body || body1
    )
    const config = {
      filename: 'Transaction_info',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }
  let transactionInfoModel = null
  if (transInfoModel) {
    transactionInfoModel = (
      <Modal open={transInfoModel} click={hideWalletInfoModelHandler} large>
        <React.Fragment>
          <p style={{ fontSize: '25px', textAlign: 'center' }}>Transaction Info</p>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <p style={{ fontSize: '20px', color: 'green' }}>Remaning Amount : { remaningAmount ? '₹ ' : ''}{remaningAmount} </p>
            </Grid>
            <Grid item xs='3' />
            <Grid item xs='4'>
              <Button
                variant='contained'
                color='primary'
                style={{ }}
                onClick={transInfoDownloadHandler}
              > Download Transaction Report</Button>
            </Grid>
          </Grid>
          <hr />
          <Table>
            <TableHead>
              <TableRow style={{ fontSize: '22px' }}>
                <TableCell style={{ fontSize: '15px' }}><b>Fee Type Name</b></TableCell>
                <TableCell style={{ fontSize: '15px' }}> Installment Name</TableCell>
                <TableCell style={{ fontSize: '15px' }}>Transaction Id </TableCell>
                <TableCell style={{ fontSize: '15px' }}>Paid Date </TableCell>
                <TableCell style={{ fontSize: '15px' }}>Payment Choice</TableCell>
                <TableCell style={{ fontSize: '15px' }}>Amount(₹)</TableCell>
                {/* <TableCell style={{ fontSize: '15px' }}>Other Fee</TableCell>
                <TableCell style={{ fontSize: '15px' }}>Other Fee Installment</TableCell> */}
                <TableCell style={{ fontSize: '15px' }}>Added By</TableCell>
                <TableCell style={{ fontSize: '15px' }}>Status</TableCell>
                <TableCell style={{ fontSize: '15px' }}>Remark</TableCell>
                {/* <TableCell>Updated By</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionDetails && transactionDetails.debited_info && transactionDetails.debited_info.map((val) => {
                return (
                  <TableRow>
                    {/* <TableCell>{val.fee_type && val.fee_type.fee_type_name} </TableCell>
                    <TableCell> {val.installment && val.installment.installment_name} </TableCell>
                    <TableCell>{val.transaction_id} </TableCell>
                    <TableCell>{val.used_date} </TableCell>
                    <TableCell>{val.payment_choice === '1' ? 'Cash' : val.payment_choice === '2' ? 'Cheque' : val.payment_choice === '3' ? 'Internet' : val.payment_choice === '4' ? 'Swipe' : val.payment_choice === '5' ? 'Online' : '' } </TableCell>
                    <TableCell style={{ color: 'red', fontSize: '15px' }}>{ val.used_amount ? '- ₹' + val.used_amount : ''} {val.amount}</TableCell>
                    <TableCell>{val.other_fee}</TableCell>
                    <TableCell>{val.other_fee_inst}</TableCell>
                    <TableCell>{val.added_by && val.added_by.first_name}</TableCell>
                    {/* <TableCell>{val.updated_by}</TableCell> */}
                    {/* <TableCell style={{ color: 'red' }}>Used</TableCell> */}
                    {/* <TableCell style={{ fontSize: '15px' }}>{val.remarks}</TableCell> */}
                    <TableCell>{val.fee_type && val.fee_type.fee_type_name ? val.fee_type.fee_type_name : ''}{val.other_fee ? (val.other_fee && val.other_fee.fee_type_name) : '' } </TableCell>
                    <TableCell> {val.installment && val.installment.installment_name ? val.installment.installment_name : ''} {val.other_fee_inst ? (val.other_fee_inst && val.other_fee_inst.installment_name) : ''} </TableCell>
                    <TableCell>{val.transaction_id ? val.transaction_id : 'NA'} </TableCell>
                    <TableCell>{val.used_date ? val.used_date : 'NA'} </TableCell>
                    <TableCell>{val.payment_choice === '1' ? 'Cash' : val.payment_choice === '2' ? 'Cheque' : val.payment_choice === '3' ? 'Internet' : val.payment_choice === '4' ? 'Swipe' : val.payment_choice === '5' ? 'Online' : val.payment_choice === '6' ? 'Wallet' : 'NA'} </TableCell>
                    <TableCell style={{ color: 'red', fontSize: '15px' }}>{'- ₹' + val.used_amount}</TableCell>
                    {/* <TableCell>{val.other_fee ? val.other_fee : 'NA' }</TableCell> */}
                    {/* <TableCell>{val.other_fee_inst ? val.other_fee_inst : 'NA'}</TableCell> */}
                    <TableCell>{val.added_by && val.added_by.first_name ? val.added_by.first_name : 'NA'}</TableCell>
                    {/* <TableCell>{val.updated_by}</TableCell> */}
                    <TableCell style={{ color: 'red' }}>Used</TableCell>
                    <TableCell style={{ fontSize: '15px' }}>{val.remarks ? val.remarks : 'NA'}</TableCell>
                  </TableRow>
                )
              })
              }
              {transactionDetails && transactionDetails.credited_info && transactionDetails.credited_info.map((val) => {
                return (
                  <TableRow>
                    <TableCell>{val.fee_type && val.fee_type.fee_type_name ? val.fee_type.fee_type_name : ''} {val.other_fee ? (val.other_fee && val.other_fee.fee_type_name) : ''} </TableCell>
                    <TableCell> {val.installment && val.installment.installment_name ? val.installment.installment_name : ''} {val.other_fee_inst ? (val.other_fee_inst && val.other_fee_inst.installment_name) : ''} </TableCell>
                    <TableCell>{val.transaction_id ? val.transaction_id : 'NA'} </TableCell>
                    <TableCell>{val.paid_date ? val.paid_date : 'NA'} </TableCell>
                    <TableCell>{val.payment_choice === '1' ? 'Cash' : val.payment_choice === '2' ? 'Cheque' : val.payment_choice === '3' ? 'Internet' : val.payment_choice === '4' ? 'Swipe' : val.payment_choice === '5' ? 'Online' : val.payment_choice === '6' ? 'Wallet' : 'NA' } </TableCell>
                    <TableCell style={{ color: 'green', fontSize: '15px' }}>{'+ ₹' + val.amount}</TableCell>
                    {/* <TableCell>{val.other_fee ? val.other_fee : 'NA'}</TableCell>
                    <TableCell>{val.other_fee_inst ? val.other_fee_inst : 'NA'}</TableCell> */}
                    <TableCell>{val.added_by && val.added_by.first_name ? val.added_by.first_name : 'NA'}</TableCell>
                    {/* <TableCell>{val.updated_by}</TableCell> */}
                    <TableCell style={{ color: 'green' }}>Added</TableCell>
                    <TableCell style={{ fontSize: '15px' }}>{val.remarks ? val.remarks : 'NA'}</TableCell>
                  </TableRow>
                )
              })
              }
            </TableBody>
          </Table>
        </React.Fragment>
      </Modal>
    )
  }
  const erpSearchHandler = (e) => {
    let ErpSearch = WalletAmtDetails && WalletAmtDetails.filter((val) => (val.student && +val.student.erp.includes(+e.target.value)) || (val.erp && +val.erp.includes(+e.target.value)))
    setErpsearch(e.target.value)
    setFilterWalletErp(ErpSearch)
  }
  const addWalletAmtHandler = (erp, amount) => {
    // setShow(true)
    // setAmount('')
    setAmountWallet(amount)
    setErp(erp)
    fetchFeeStructureListErp(erp, sessionData && sessionData.value, alert, user)
    setFeeDisplay(true)
  }
  const hideDeleteModal = () => {
    setshowDeleteModal(false)
  }
  const goBackDeleteHandler = () => {
    setCancelModal(false)
    setDeleteRemark('')
    setDeleteAmount(null)
  }
  const hideCancelModalHandler = () => {
    setCancelModal(false)
  }
  const deleteAmountHandler = (e) => {
    setDeleteAmount(e.target.value)
  }
  const cancelRemarkHandler = (e) => {
    setDeleteRemark(e.target.value)
  }
  const deleteProceedHandler = (e) => {
    if (deleteAmount > 0 && deleteAmount <= walletUnusedAmt) {
      if (deleteRemark && deleteAmount) {
        const data = {
          id: deleteInstId,
          remark: deleteRemark,
          amount: deleteAmount,
          erp_code: erp,
          academic_year: sessionData && sessionData.value
        }
        deleteWalletUnusedAmount(data, alert, user)
        setshowDeleteModal(false)
        setCancelModal(false)
        setDeleteRemark('')
        setDeleteAmount(null)
      } else {
        alert.warning('Fill all required Fields!')
      }
    } else {
      alert.warning('Amount should be greater than zero or less than or equal to Unused Wallet Amount!')
    }
  }
  let changeCancelModal = null
  if (cancelModal) {
    changeCancelModal = (
      <Modal open={cancelModal} click={hideCancelModalHandler} style={{ borderStyle: 'solid', borderColor: 'lightGrey' }} small>
        <React.Fragment>
          <p style={{ textAlign: 'center', fontSize: '16px' }}>Do You want to Delete Amount ?</p>
          <Grid container spacing={3} style={{ padding: 5, marginLeft: '20px' }}>
            <Grid item xs='5'>
              <TextField
                id='remark'
                type='number'
                required
                InputLabelProps={{ shrink: true }}
                value={deleteAmount || ''}
                onChange={deleteAmountHandler}
                margin='normal'
                variant='outlined'
                label='amount'
              />
            </Grid>
            <Grid item xs='5'>
              <TextField
                id='remark'
                type='text'
                required
                InputLabelProps={{ shrink: true }}
                value={deleteRemark || ''}
                onChange={cancelRemarkHandler}
                margin='normal'
                variant='outlined'
                label='remark'
              />
            </Grid>
            <Grid item xs='5'>
              <Button
                variant='contained'
                color='primary'
                // style={{ marginTop: 20 }}
                onClick={deleteProceedHandler}
              >
                  Proceed
              </Button>
            </Grid>
            <Grid item xs='5'>
              <Button
                variant='contained'
                color='primary'
                // style={{ marginTop: 20 }}
                onClick={goBackDeleteHandler}
              >
                  Go Back
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }
  const deleteAmountButHandler = (id, amt) => {
    setDeleteInstId(id)
    setWalletUnusedAmt(amt)
    setCancelModal(true)
  }
  let deleteModal = null
  if (showDeleteModal) {
    deleteModal = (
      <Modal open={showDeleteModal} click={hideDeleteModal} >
        <Grid container spacing={3} style={{ padding: '15px' }} >
          <React.Fragment>
            <div>
              <hr />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell style={{ fontSize: '15px' }}><b>Fee Type </b></TableCell>
                    <TableCell style={{ fontSize: '15px' }}><b>Installment Name</b></TableCell>
                    <TableCell style={{ fontSize: '15px' }}><b>Transaction Id</b></TableCell>
                    <TableCell style={{ fontSize: '15px' }}><b>Paid Date</b></TableCell>
                    <TableCell style={{ fontSize: '15px' }}><b>Unused Wallet Amount</b></TableCell>
                    {/* <TableCell>Delete Wallet Amount</TableCell> */}
                    <TableCell style={{ fontSize: '15px' }}><b>Delete Amount </b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notUsedWalletAmtList && notUsedWalletAmtList.length > 0 ? notUsedWalletAmtList.map((row, i) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell />
                        <TableCell>{row.fee_type ? row.fee_type : 'NA'}</TableCell>
                        <TableCell>{row.installment ? row.installment : 'NA'}</TableCell>
                        <TableCell>{row.transaction_id ? row.transaction_id : 'NA'}</TableCell>
                        <TableCell>{row.paid_date ? row.paid_date : 'NA'}</TableCell>
                        <TableCell>{row.amount ? row.amount : 'NA'}</TableCell>
                        {/* <TableCell> <TextField
                          id='filled-number'
                          label='Delete Amount'
                          value={amount[row.id]}
                          onChange={(e) => addAmountHandler(e, row.id, row.fee_type && row.fee_type.id, row.installment && row.installment.id, row.amount, row.transaction_id, row.createdAt)}
                          type='number'
                          InputLabelProps={{
                            shrink: true
                          }}
                          // style={{ marginLeft: '30px', marginBottom: '10px' }}
                          variant='outlined'
                        /></TableCell> */}
                        <TableCell>  <Button
                          variant='contained'
                          color='primary'
                          style={{ marginTop: '20px' }}
                          onClick={() => deleteAmountButHandler(row.id, row.amount)}
                        >Delete</Button> </TableCell>
                        <TableCell />
                      </TableRow>
                    )
                  }) : 'No Records Found'}
                </TableBody>
              </Table>
              {/* <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={addAmountButHandler}
              >Submit</Button> */}
            </div>
          </React.Fragment>
        </Grid>
      </Modal>
    )
  }
  const deleteWalletAmtHandler = (erp) => {
    setshowDeleteModal(true)
    setErp(erp)
    fetchWalletAmtNotUsed(erp, sessionData && sessionData.value, alert, user)
  }
  const hideFeeDisplayModalHandler = () => {
    setFeeDisplay(false)
    setAmount({})
  }
  const addAmountButHandler = (other, otherIns, id) => {
    console.log('amt', amount, amountWallet, amtPaid)
    if ((+amount) > 0) {
      if (amount && amount.length > 0 && fieldId === id) {
        if (fieldId === id && amount && (+amount) <= amtPaid) {
          const data = {
            fee_type: feeType ? { fee_type: feeType,
              installment_id: instName
            } : null,
            other_fee: other ? {
              fee_type: other,
              installment_id: otherIns
            } : null,
            // fee_type: feeType,
            // installment_id: instName,
            wallet_amount: amount,
            academic_year: sessionData && sessionData.value,
            // paid_date: paidDate,
            transaction_id: transId,
            branch: branchData && branchData.value,
            erp: erp,
            grade: gradeData && gradeData.value
          }
          setAmount({ ...amount, [id]: '' })
          // setShow(false)
          addWalletAmount(data, alert, user)
          setFeeDisplay(false)
          // fetchWalletAmount(sessionData && sessionData.value, branchData && branchData.value, gradeData && gradeData.value, alert, user)
          console.log('data', data)
        } else {
          alert.warning('Amount should be less than or equal to Amount Paid!')
        }
      } else {
        alert.warning('Fill the required Field!')
      }
    } else {
      alert.warning('Enter amount greater then zero!')
    }
  }
  const addAmountHandler = (e, id, feeType, InstName, amtPaid, trans, date) => {
    setTransId(trans)
    // setPaidDate(date)
    setFieldId(id)
    if (e.target.value >= 0) {
      setAmount(e.target.value)
    } else {
      alert.warning('Enter amount greater then zero!')
    }
    setAmtPaid(amtPaid)
    setFeeType(feeType)
    setInsName(InstName)
  }
  let fullFeeStruc = null
  if (feeStructure) {
    fullFeeStruc = (
      <Modal open={feeDisplay} click={hideFeeDisplayModalHandler} large>
        <Grid container spacing={3} style={{ padding: '15px' }} >
          <React.Fragment>
            <div>
              <hr />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Fee Type</TableCell>
                    <TableCell>Installment Name</TableCell>
                    <TableCell>Transaction Id</TableCell>
                    {/* <TableCell>Fine Amount</TableCell> */}
                    {/* <TableCell>Fee Amount</TableCell> */}
                    {/* <TableCell>Concession</TableCell> */}
                    <TableCell>Paid Date</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Add Wallet Amount</TableCell>
                    <TableCell>Add Amount </TableCell>
                    {/* <TableCell /> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeStructure && feeStructure.length > 0 ? feeStructure.filter((val) => val.fee_type || val.other_fee).map((row, i) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell />
                        <TableCell>{row.fee_type && row.fee_type.fee_type_name ? row.fee_type.fee_type_name : ''} {row.other_fee && row.other_fee.fee_type_name ? row.other_fee.fee_type_name : ''}</TableCell>
                        <TableCell>{row.installment && row.installment.installment_name ? row.installment.installment_name : ''}{row.other_fee_inst && row.other_fee_inst.installment_name ? row.other_fee_inst.installment_name : ''}</TableCell>
                        {/* <TableCell>{row.fine_amount ? row.fine_amount : 0}</TableCell> */}
                        <TableCell>{row.transaction_id ? row.transaction_id : 'NA'}</TableCell>
                        {/* <TableCell>{row.installment && row.installment.installment_amount ? parseInt(row.installment.installment_amount) : 0}</TableCell> */}
                        {/* <TableCell>{row.discount ? row.discount : 0}</TableCell> */}
                        <TableCell>{row.createdAt ? row.createdAt : 'NA'}</TableCell>
                        <TableCell>{row.amount ? row.amount : 0}</TableCell>
                        <TableCell>{row.balance ? row.balance : 0}</TableCell>
                        <TableCell> <TextField
                          id='filled-number'
                          label='Add Amount'
                          value={amount[row.id]}
                          onChange={(e) => addAmountHandler(e, row.id, row.fee_type && row.fee_type.id, row.installment && row.installment.id, row.amount, row.transaction_id, row.createdAt)}
                          type='number'
                          InputLabelProps={{
                            shrink: true
                          }}
                          // style={{ marginLeft: '30px', marginBottom: '10px' }}
                          variant='outlined'
                        /></TableCell>
                        <TableCell>  <Button
                          variant='contained'
                          color='primary'
                          style={{ marginTop: '20px' }}
                          onClick={() => addAmountButHandler(row.other_fee && row.other_fee.id, row.other_fee_inst && row.other_fee_inst.id, row.id)}
                        >Add</Button> </TableCell>
                        <TableCell />
                      </TableRow>
                    )
                  }) : 'No Records Found'}
                </TableBody>
              </Table>
              {/* <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '20px' }}
                onClick={addAmountButHandler}
              >Submit</Button> */}
            </div>
          </React.Fragment>
        </Grid>
      </Modal>
    )
  }
  const walletAmountDetailsTable = () => {
    let walletTable = (
      <React.Fragment>
        {filterWalletErp && filterWalletErp.length > 0
          ? <div style={{ marginTop: '70px' }}>
            <TextField
              id='filled-number'
              label='Erp Search'
              value={searchErp}
              onChange={erpSearchHandler}
              type='number'
              InputLabelProps={{
                shrink: true
              }}
              style={{ marginLeft: '30px', marginBottom: '10px' }}
              variant='outlined'
            />
            <div>
              <hr />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '18px' }}>Erp </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Name </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Total Amount(₹) </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Used Amount(₹) </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Remaning Amount(₹) </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Transaction Info </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Add Wallet Amount</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Delete Wallet Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterWalletErp && filterWalletErp.map((val) => {
                    return (
                      <TableRow>
                        <TableCell>{(val.student && val.student.erp) || val.erp} </TableCell>
                        <TableCell> {(val.student && val.student.name) || val.name} </TableCell>
                        <TableCell>{val.total_amount ? '₹' : ''} {val.total_amount} </TableCell>
                        <TableCell> {val.used_amount ? '₹' : ''} {val.used_amount} </TableCell>
                        <TableCell>{val.reaming_amount ? '₹' : ''}{val.reaming_amount} </TableCell>
                        <TableCell align='center' style={{ cursor: 'pointer', color: 'blue' }} onClick={() => showInstaModalHandler((val.student && val.student.id) || val.id, val.reaming_amount)}>
                          <Info />
                        </TableCell>
                        <TableCell> <Button
                          variant='contained'
                          color='primary'
                          style={{ marginTop: '20px' }}
                          onClick={() => addWalletAmtHandler((val.student && val.student.erp) || val.erp, val.reaming_amount)}
                        >Add Amount</Button></TableCell>
                        <TableCell> <Button
                          variant='contained'
                          color='primary'
                          style={{ marginTop: '20px' }}
                          onClick={() => deleteWalletAmtHandler((val.student && val.student.erp) || val.erp, val.reaming_amount)}
                        >Delete Amount</Button></TableCell>
                      </TableRow>
                    )
                  })
                  }
                </TableBody>
              </Table>
            </div>
          </div>
          : []}
      </React.Fragment>
    )
    return walletTable
  }
  return (
    <div>
      <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={WalletReportHandler}
          >Download Wallet Report</Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={walletAmtRequestHandler}
          >Request Wallet Amount</Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} wrap='wrap'style={{ padding: '15px' }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={branchData}
            options={
              branches.length
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }
            onChange={changehandlerbranch}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Grades*</label>
          <Select
            placeholder='Select Grade'
            value={gradeData}
            options={
              gradesPerBranch
                ? gradesPerBranch.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                : []
            }
            onChange={gradeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={validHandler}
          >Get Wallet Amount</Button>
        </Grid>
      </Grid>
      {showWalletDeatilTable ? walletAmountDetailsTable() : []}
      {reqWalletAmtModal}
      {transactionInfoModel}
      {fullFeeStruc}
      {deleteModal}
      {changeCancelModal}
      { dataLoading ? <CircularProgress open /> : null }
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.common.gradeList,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  sections: state.finance.common.sectionsPerGradeAdminAllOpt,
  WalletAmtDetails: state.finance.BalanceAdjustWalletReducer.walletAmount,
  transactionDetails: state.finance.BalanceAdjustWalletReducer.transactionDetails,
  feeStructure: state.finance.BalanceAdjustWalletReducer.feeStructureList,
  notUsedWalletAmtList: state.finance.BalanceAdjustWalletReducer.notUsedWalletAmtList
  // unassignStudent: state.finance.BalanceAdjustWalletReducer.unassignStudent
})
const mapDispatchToProps = dispatch => ({
  deleteWalletUnusedAmount: (data, alert, user) => dispatch(actionTypes.deleteWalletUnusedAmount({ data, alert, user })),
  fetchWalletAmtNotUsed: (erp, session, alert, user) => dispatch(actionTypes.fetchWalletAmtNotUsed({ erp, session, alert, user })),
  fetchFeeStructureListErp: (erp, session, alert, user) => dispatch(actionTypes.fetchFeeStructureListErp({ erp, session, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  addWalletAmount: (data, alert, user) => dispatch(actionTypes.addWalletAmount({ data, alert, user })),
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user })),
  fetchErpList: (session, grade, branch, section, alert, user) => dispatch(actionTypes.fetchErpList({ session, grade, branch, section, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId })),
  sendValidRequest: (data, alert, user) => dispatch(actionTypes.sendValidRequest({ data, alert, user })),
  fetchWalletAmount: (session, branch, grade, alert, user) => dispatch(actionTypes.fetchWalletAmount({ session, branch, grade, alert, user })),
  fetchTransDetails: (session, branch, grade, student, alert, user) => dispatch(actionTypes.fetchTransDetails({ session, branch, grade, student, alert, user }))
  // fetchAllSection: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId }))
})

export default connect(mapStateToProps, mapDispatchToProps)((ExtraAmtAdjust))
