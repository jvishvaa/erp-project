import React, {
  useEffect,
  useState
} from 'react'
import { withStyles, Grid, Button, TableRow, TableHead, TableCell, TableBody, Table, TextField
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
// import RequestShuffle from './requestShuffle'
// import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  headersSize: {
    fontSize: '14px',
    paddingRight: '5px'
  }
})

const AcceptRejectPayment = ({ classes, session, dataLoading, getPaymentDetails, cancelPayment, acceptPayment, paymentDetails, branches, fetchGradeList, externalshuffleDetail, internalshuffleDetail, fetchInternalShuffle, fetchExternalShuffle, gradeList, fetchBranches, alert, user }) => {
  const [sessionYear, setSession] = useState({ value: '2020-21', label: '2020-21' })
  // const [grade, setGrade] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [acceptModal, setAcceptModal] = useState(false)
  const [cancelRemark, setCancelRemark] = useState('')
  const [acceptRemark, setAcceptRemark] = useState('')
  const [feeType, setFeeType] = useState(null)
  const [otherFee, setOtherFee] = useState(null)
  const [installId, setInstallId] = useState(null)
  const [otherFeeinstId, setOtherFeeinstId] = useState(null)
  const [student, setStudent] = useState(null)
  const [listId, setListId] = useState(null)
  const [searchErp, setErpsearch] = useState(null)
  const [filterWalletErp, setFilterWalletErp] = useState(null)
  const [searchAcceptReject, setSearchAcceptReject] = useState('')
  const [acceptData, setAcceptData] = useState({})
  const [upiId, setUpiId] = useState('')
  const [hideTrans, setHideTrans] = useState(true)
  const [showImg, setShowImg] = useState(false)
  const [imgs, setImg] = useState('')

  useEffect(() => {
    setFilterWalletErp(paymentDetails)
  }, [paymentDetails])
  const handleSession = (e) => {
    setSession(e)
    // fetchGradeList(alert, user)
    // fetchStudentShuffle(alert, user)
    setShowTable(false)
  }

  // const handleGrade = (e) => {
  //   setGrade(e)
  // }
  const handlePaymentDetails = (e) => {
    getPaymentDetails(sessionYear && sessionYear.value, alert, user)
    setShowTable(true)
  }

  const acceptPaymentHandler = (fee, other, installments, otherinstallments, stud, id, erp, grade, normalAmt, otherAmt, date, upi) => {
    const data = {
      student: stud,
      normal_fee: fee ? { fee_type: fee,
        installment_id: installments,
        amount: normalAmt
      } : null,
      other_fee: other ? {
        fee_type: other,
        installment_id: otherinstallments,
        amount: otherAmt
      } : null,
      paid_date: date,
      installments: installments,
      other_fee_installments: otherinstallments,
      academic_year: sessionYear && sessionYear.value,
      id: id,
      erp: erp,
      grade: grade
    }
    if (hideTrans) {
      setUpiId(upi)
    }
    setAcceptData(data)
    // acceptPayment(data, alert, user)
    setAcceptModal(true)
  }

  const rejectPaymentHandler = (feetype, otherfee, inst, otherInstId, stu, id, upi) => {
    setFeeType(feetype)
    setOtherFee(otherfee)
    setInstallId(inst)
    setOtherFeeinstId(otherInstId)
    setCancelModal(true)
    setStudent(stu)
    setListId(id)
    // setUpiId(upiId)
    if (hideTrans) {
      setUpiId(upi)
    }
  }
  const hideCancelModalHandler = (e) => {
    setCancelModal(false)
  }
  const cancelRemarkHandler = (e) => {
    setCancelRemark(e.target.value)
  }
  const acceptRemarkHandler = (e) => {
    setAcceptRemark(e.target.value)
  }
  const proceedPaymentHandler = () => {
    if (cancelRemark) {
      const data = {
        student: student,
        fee_type: feeType,
        other_fee: otherFee,
        installments: installId,
        other_fee_installments: otherFeeinstId,
        rejected_reason: cancelRemark,
        academic_year: sessionYear && sessionYear.value,
        id: listId,
        transction_id: upiId
      }
      cancelPayment(data, alert, user)
      setCancelModal(false)
      setCancelRemark('')
    } else {
      alert.warning('Fill the Remark to Proceed!')
    }
  }
  const goBackPaymentHandler = () => {
    setCancelModal(false)
  }
  let changeCancelModal = null
  if (cancelModal) {
    changeCancelModal = (
      <Modal open={cancelModal} click={hideCancelModalHandler} small>
        <React.Fragment>
          <p style={{ textAlign: 'center', fontSize: '16px' }}>Do You want to Reject ?</p>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <TextField
                id='remark'
                type='text'
                required
                InputLabelProps={{ shrink: true }}
                value={cancelRemark || ''}
                onChange={cancelRemarkHandler}
                margin='normal'
                variant='outlined'
                label='remark'
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 20 }}
                onClick={proceedPaymentHandler}
              >
                  Proceed
              </Button>
            </Grid>
            <Grid item xs='4'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 20 }}
                onClick={goBackPaymentHandler}
              >
                  Go Back
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }
  const proceedAcceptPaymentHandler = () => {
    if (acceptRemark && upiId) {
      const data = {
        ...acceptData,
        remarks: acceptRemark,
        transction_id: upiId
      }
      acceptPayment(data, alert, user)
      setAcceptModal(false)
      setAcceptRemark('')
    } else {
      alert.warning('Fill the Remark and Upi Id to Proceed!')
    }
  }
  const hideAcceptModalHandler = () => {
    setAcceptModal(false)
  }
  const goBackAcceptPaymentHandler = () => {
    setAcceptModal(false)
  }
  let changeAcceptModal = null
  if (acceptModal) {
    changeAcceptModal = (
      <Modal open={acceptModal} click={hideAcceptModalHandler} small>
        <React.Fragment>
          <p style={{ textAlign: 'center', fontSize: '16px' }}>Do You want to Accept ?</p>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <TextField
                id='remark'
                type='text'
                required
                InputLabelProps={{ shrink: true }}
                value={acceptRemark || ''}
                onChange={acceptRemarkHandler}
                margin='normal'
                variant='outlined'
                label='remark'
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 20 }}
                onClick={proceedAcceptPaymentHandler}
              >
                  Proceed
              </Button>
            </Grid>
            <Grid item xs='4'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 20 }}
                onClick={goBackAcceptPaymentHandler}
              >
                  Go Back
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }
  const hideImageModalHandler = () => {
    setShowImg(false)
  }
  const goBackImageHandler = () => {
    setShowImg(false)
  }
  let ImgModal = null
  if (showImg) {
    ImgModal = (
      <Modal open={showImg} click={hideImageModalHandler} large>
        <React.Fragment>
          <div>
            <img src={imgs} alt='payment_screenshot' />
          </div>
          <Button
            variant='contained'
            color='primary'
            style={{ position: 'relative', bottom: 0, right: 0 }}
            onClick={goBackImageHandler}
          >
                  Go Back
          </Button>
        </React.Fragment>
      </Modal>
    )
  }
  const erpSearchHandler = (e) => {
    let ErpSearch = paymentDetails && paymentDetails.length && paymentDetails.filter((val) => val.student && +val.student.erp.includes(+e.target.value))
    setErpsearch(e.target.value)
    setFilterWalletErp(ErpSearch)
  }
  const activeInactiveSearchHandler = (e) => {
    setSearchAcceptReject(e.target.value)
    if (e.target.value === 'accept') {
      let ErpSearch = paymentDetails && paymentDetails.length && paymentDetails.filter((val) => val.is_paid_done && val.is_paid_done === true)
      setFilterWalletErp(ErpSearch)
    } else if (e.target.value === 'reject') {
      let ErpSearch = paymentDetails && paymentDetails.length && paymentDetails.filter((val) => val.is_rejected && val.is_rejected === true)
      setFilterWalletErp(ErpSearch)
    } else {
      setFilterWalletErp(paymentDetails)
    }
  }
  const editUpiIdHandler = (e) => {
    setUpiId(e.target.value)
    setHideTrans(false)
  }
  const imgHandler = (image) => {
    setImg(image)
    setShowImg(true)
  }
  const paymentDetailsTable = () => {
    let walletTable = (
      <React.Fragment>
        {paymentDetails && paymentDetails.length > 0
          ? <div style={{ marginTop: '70px' }}>
            <TextField
              id='filled-number'
              label='Erp Search'
              placeholder='Erp'
              value={searchErp}
              onChange={erpSearchHandler}
              type='number'
              InputLabelProps={{
                shrink: true
              }}
              style={{ marginLeft: '30px', marginBottom: '10px' }}
              variant='outlined'
            />
            <TextField
              id='filled-number'
              label='Search accept/reject'
              placeholder='Enter accept/reject'
              value={searchAcceptReject}
              onChange={activeInactiveSearchHandler}
              type='text'
              InputLabelProps={{
                shrink: true
              }}
              style={{ marginLeft: '30px', marginBottom: '10px' }}
              variant='outlined'
            />
            <hr />
            <div style={{ overflowX: 'scroll' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '18px' }}>Erp </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Name </TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Fee Type </TableCell>
                    {/* <TableCell style={{ fontSize: '18px' }}>Fee Account </TableCell> */}
                    <TableCell style={{ fontSize: '18px' }}>Upi Id</TableCell>
                    {/* <TableCell style={{ fontSize: '18px' }}>Other Fee</TableCell> */}
                    <TableCell style={{ fontSize: '18px' }}>Installment Amount</TableCell>
                    {/* <TableCell style={{ fontSize: '18px' }}>Other Fee Installment</TableCell> */}
                    {/* <TableCell style={{ fontSize: '18px' }}>Other Fee Installment Amount</TableCell> */}
                    <TableCell style={{ fontSize: '18px' }}>Paid Date</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Payment Screenshot</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Accept Status</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Accept Remark</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Reject Status</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Reject Reason</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Accept</TableCell>
                    <TableCell style={{ fontSize: '18px' }}>Reject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterWalletErp && filterWalletErp.length && filterWalletErp.map((val) => {
                    return (
                      <TableRow>
                        <TableCell>{val.student && val.student.erp ? val.student.erp : 'NA'} </TableCell>
                        <TableCell> {val.student && val.student.name ? val.student.name : 'NA'} </TableCell>
                        <TableCell>{val.installments_amount ? val.fee_type && val.fee_type.fee_type_name : ''} {val.other_fee_installment_amount ? val.other_fee && val.other_fee.fee_type_name : ''}</TableCell>
                        {/* <TableCell>{val.fee_account}</TableCell> */}
                        <TableCell>
                          {/* {val.transction_id} */}
                          <TextField
                            // id='text'
                            // label='Upi Id'
                            // placeholder={val.transction_id}
                            id={val.id}
                            value={hideTrans ? val.transction_id : upiId[val.id]}
                            onChange={editUpiIdHandler}
                            type='text'
                            // InputLabelProps={{
                            //   shrink: true
                            // }}
                            style={{ width: '100px' }}
                            // variant='outlined'
                          />
                        </TableCell>
                        {/* <TableCell>{val.other_fee && val.other_fee.fee_type_name}</TableCell> */}
                        <TableCell> {val.installments_amount ? val.installments_amount : val.other_fee_installment_amount} </TableCell>
                        {/* <TableCell>{val.other_fee_installments}</TableCell> */}
                        {/* <TableCell>{val.other_fee_installment_amount}</TableCell> */}
                        <TableCell>{val.paid_date ? val.paid_date : 'NA'}</TableCell>
                        <TableCell><Button
                          variant='contained'
                          color='primary'
                          style={{ marginTop: 20 }}
                          onClick={() => imgHandler(val.payment_screenshot)}
                        >
                                View Screenshot
                        </Button> </TableCell>
                        <TableCell style={{ color: 'green' }}>{val.is_paid_done ? 'Accept' : val.is_paid_done === false && val.is_rejected === false ? 'Pending' : 'No'}</TableCell>
                        <TableCell>{val.is_paid_done ? val.remarks : 'NA'}</TableCell>
                        <TableCell style={{ color: 'red' }}>{val.is_rejected ? 'Reject' : val.is_rejected === false && val.is_paid_done === false ? 'Pending' : 'No'}</TableCell>
                        <TableCell>{val.is_rejected ? val.rejected_reason : 'NA'}</TableCell>
                        <TableCell> <Button
                          variant='contained'
                          disabled={val.is_paid_done || val.is_rejected}
                          color='primary'
                          style={{ marginTop: 20 }}
                          onClick={() => acceptPaymentHandler(val.fee_type && val.fee_type.id, val.other_fee && val.other_fee.id, val.installments && val.installments.id, val.other_fee_installments && val.other_fee_installments.id, val.student && val.student.id, val.id, val.student && val.student.erp, val.student && val.student.grade && val.student.grade.id, val.installments_amount, val.other_fee_installment_amount, val.paid_date, val.transction_id)}
                        >
                                ACCEPT
                        </Button></TableCell>
                        <TableCell> <Button
                          variant='contained'
                          color='secondary'
                          disabled={val.is_rejected || val.is_paid_done}
                          style={{ marginTop: 20 }}
                          onClick={() => rejectPaymentHandler(val.fee_type && val.fee_type.id, val.other_fee && val.other_fee.id, val.installments && val.installments.id, val.other_fee_installments && val.other_fee_installments.id, val.student && val.student.id, val.id, val.transction_id)}
                        >
                          REJECT
                        </Button></TableCell>
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
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15, marginBottom: 60 }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
            value={sessionYear || ''}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={(e) => handleSession(e)}
          />
        </Grid>
        {/* <Grid item xs={3}>
          <label>Grade*</label>
          <Select
            placeholder='Select Grade'
            value={grade || ''}
            options={gradeList
              ? gradeList.map(grades => ({
                value: grades.id,
                label: grades.grade
              })) : []}
            onChange={(e) => handleGrade(e)}
          /> */}
        {/* </Grid> */}
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 20 }}
            onClick={handlePaymentDetails}
          >
              GET
          </Button>
        </Grid>
      </Grid>
      {showTable ? paymentDetailsTable() : []}
      {changeCancelModal}
      {changeAcceptModal}
      {ImgModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  gradeList: state.finance.common.gradeList,
  paymentDetails: state.finance.accountantReducer.acceptRejectPaymentReducer.paymentDetails
  // studentShuffle: state.finance.accountantReducer.studentShuffle.shuffleDetails,
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  acceptPayment: (data, alert, user) => dispatch(actionTypes.acceptPayment({ data, alert, user })),
  cancelPayment: (data, alert, user) => dispatch(actionTypes.cancelPayment({ data, alert, user })),
  getPaymentDetails: (session, alert, user) => dispatch(actionTypes.getPaymentDetails({ session, alert, user })),
  // fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AcceptRejectPayment)))
