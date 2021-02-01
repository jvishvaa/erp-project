import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Button
} from '@material-ui/core'

import * as actionTypes from '../../store/actions'

const searchOptions = [{
  value: 1,
  label: 'IFSC'
},
{
  value: 2,
  label: 'MICR'
},
{
  value: 3,
  label: 'Not Listed'
}]

const cards = [
  {
    value: 1,
    label: 'Credit'
  },
  {
    value: 2,
    label: 'Debit'
  }
]

const EditMode = ({
  type,
  user,
  alert,
  typeNumber,
  fetchMicr,
  fetchIfsc,
  ifscDetails,
  micrDetails,
  fetchReceiptRange,
  branch,
  receiptRange,
  session,
  transactionId,
  fetchFormMode,
  modeDetails,
  updateTransactionMode,
  close
  // date,
  // studentName,
  // fatherName,
  // optingClass,
  // amount
}) => {
  // const [changedStdName, setChangedStdName] = useState(studentName);
  // const [changedFatName, setFatName] = useState(fatherName);
  // const [changedOptClass, setChangesOptClass] = useState(optingClass);
  // const [changedAmount, setChangedAmount] = useState(amount);
  // const [chnagedDate, setChangedDate] = useState(date);

  const [changedMode, setChangedMode] = useState('1')
  const [changedChequeNo, setChangedChequeNo] = useState('')
  const [changedChequeDate, setChangedChequeDate] = useState(null)
  const [searchBy, setSearchBy] = useState(3)
  const [ifsc, setIfsc] = useState('')
  const [micr, setMicr] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [internetDate, setInternetDate] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [cardType, setCardType] = useState('')
  const [cardDigit, setCardDigit] = useState('')
  const [approvalCode, setApprovalCode] = useState('')
  const [receiptType, setReceiptType] = useState('1')
  const [receiptNo, setReceiptNo] = useState('')

  useEffect(() => {
    if (ifscDetails && +searchBy === 1) {
      setMicr(ifscDetails.micr || null)
      setBankName(ifscDetails.bank || null)
      setBankBranch(ifscDetails.branch || null)
    }
  }, [ifscDetails, searchBy])

  useEffect(() => {
    if (micrDetails && micrDetails.data && +searchBy === 2) {
      setIfsc(micrDetails.data[0].IFSC || null)
      setBankName(micrDetails.data[0].Bank || null)
      setBankBranch(micrDetails.data[0].Branch || null)
    }
  }, [micrDetails, searchBy])

  useEffect(() => {
    fetchReceiptRange(session, branch, alert, user)
  }, [alert, branch, fetchReceiptRange, session, user])

  useEffect(() => {
    if (type !== 'Admission' && transactionId) {
      fetchFormMode(type.toLowerCase(), transactionId, user, alert)
    }
  }, [type, transactionId, user, alert, fetchFormMode])

  useEffect(() => {
    if (modeDetails) {
      switch (modeDetails.payment_in) {
        case '1' : {
          setChangedMode('1')
          setChangedChequeNo('')
          setChangedChequeDate('')
          setIfsc('')
          setMicr('')
          setBankName('')
          setBankBranch('')
          setCardType('')
          setCardDigit('')
          setApprovalCode('')
          setInternetDate(' ')
          setRemarks('')
          setReceiptType(modeDetails.receipt_type || '1')
          setReceiptNo(modeDetails.receipt_number)
          break
        }
        case '2' : {
          setChangedMode('2')
          setChangedChequeNo(modeDetails.cheque_number || '')
          setChangedChequeDate(modeDetails.date_of_cheque || '')
          setIfsc(modeDetails.ifsc_code || '')
          setMicr(modeDetails.micr_code || '')
          setBankName(modeDetails.bank_name || '')
          setBankBranch(modeDetails.bank_branch || '')
          setCardType('')
          setCardDigit('')
          setApprovalCode('')
          setInternetDate(' ')
          setRemarks('')
          setReceiptType(modeDetails.receipt_type || '1')
          setReceiptNo(modeDetails.receipt_number)
          break
        }
        case '3': {
          setChangedMode('3')
          setChangedChequeNo('')
          setChangedChequeDate('')
          setIfsc('')
          setMicr('')
          setBankName('')
          setBankBranch('')
          setCardType('')
          setCardDigit('')
          setApprovalCode('')
          setInternetDate(modeDetails.date_of_transaction || ' ')
          setRemarks(modeDetails.remarks)
          setReceiptType(modeDetails.receipt_type || '1')
          setReceiptNo(modeDetails.receipt_number)
          break
        }
        case '4': {
          setChangedMode('4')
          setChangedChequeNo('')
          setChangedChequeDate('')
          setIfsc('')
          setMicr('')
          setBankName(modeDetails.bank_name || '')
          setBankBranch('')
          setCardType(modeDetails.card_type || '')
          setCardDigit(modeDetails.card_last_digits || '')
          setApprovalCode(modeDetails.approval_code || '')
          setInternetDate(' ')
          setRemarks(modeDetails.remarks || '')
          setReceiptType(modeDetails.receipt_type || '1')
          setReceiptNo(modeDetails.receipt_number)
          break
        }
        default: {

        }
      }
    }
  }, [modeDetails])

  useEffect(() => {
    console.log('the States: ', ifsc, micr)
  })

  const changeSearchByHandler = (e) => {
    setSearchBy(e.target.value)
    setIfsc('')
    setMicr('')
  }

  const changeMicrhandler = (e) => {
    setMicr(e.target.value)
    if (+searchBy === 2 && e.target.value.length === 9) {
      fetchMicr(e.target.value, alert, user)
    }
  }

  const changeIfscHandler = (e) => {
    setIfsc(e.target.value)
    console.log('Value', e.target.value)
    if (+searchBy === 1 && e.target.value.length === 11) {
      console.log('Inside IFSC')
      fetchIfsc(e.target.value, alert, user)
    }
  }

  const editClickHandler = () => {
    console.log('Insiode Edit')
    if (+changedMode === 2 &&
      (!changedChequeDate ||
        !changedChequeNo ||
        !ifsc ||
        !micr ||
        !bankBranch ||
        !bankName)) {
      alert.warning('Please Fill all Cheque Details')
      return
    }
    if (+changedMode === 3 &&
      (!remarks ||
        !internetDate)) {
      alert.warning('Please Fill all Internet details')
      return
    }
    if (+changedMode === 4 && (
      !cardDigit ||
      !approvalCode ||
      !bankName ||
      !remarks
    )) {
      alert.warning('Please Fill all Card Details')
      return
    }

    if (+receiptType === 2) {
      if (!receiptNo) {
        alert.warning('Please Fill Receipt Number')
        return
      }

      let min = 0
      let max = 0
      if (receiptRange && receiptRange.manual && receiptRange.manual.length > 0) {
        min = +receiptRange.manual[0].range_from
        max = +receiptRange.manual[0].range_to
      }

      if ((+receiptNo < min) || (+receiptNo > max)) {
        alert.warning('Receipt Number not valid')
      }
    }

    let body = {}

    switch (+changedMode) {
      case 1 : {
        body = {
          'payment_in': 1,
          'receipt_type': receiptType,
          'receipt_number': receiptNo,
          'prev_receipt_type': modeDetails.receipt_type,
          'transaction_id': transactionId,
          'prev_payment_in': modeDetails.payment_in,
          'academic_year': session,
          branch
        }
        break
      }
      case 2 : {
        body = {
          'payment_in': 2,
          'cheque_number': changedChequeNo,
          'date_of_cheque': changedChequeDate,
          'micr_code': micr,
          'ifsc_code': ifsc,
          'bank_name': bankName,
          'bank_branch': bankBranch,
          'receipt_type': receiptType,
          'receipt_number': receiptNo,
          'prev_receipt_type': modeDetails.receipt_type,
          'transaction_id': transactionId,
          'prev_payment_in': modeDetails.payment_in,
          'academic_year': session,
          branch
        }
        break
      }
      case 3 : {
        body = {
          'payment_in': 3,
          'date_of_transaction': internetDate,
          'remarks': remarks,
          'receipt_type': receiptType,
          'receipt_number': receiptNo,
          'prev_receipt_type': modeDetails.receipt_type,
          'transaction_id': transactionId,
          'prev_payment_in': modeDetails.payment_in,
          'academic_year': session,
          branch
        }
        break
      }
      case 4: {
        body = {
          payment_in: 4,
          'card_type': cardType,
          'card_last_digit': cardDigit,
          'approval_code': approvalCode,
          'bank_name': bankName,
          'remarks': remarks,
          'receipt_type': receiptType,
          'receipt_number': receiptNo,
          'prev_receipt_type': modeDetails.receipt_type,
          'transaction_id': transactionId,
          'prev_payment_in': modeDetails.payment_in,
          'academic_year': session,
          branch
        }
        break
      }
    }

    updateTransactionMode(body, transactionId, user, alert)
    close()
  }

  const getSearchByView = (code) => {
    switch (code) {
      case 1: {
        return (
          <Grid item xs={6}>
            <TextField
              required
              label='IFSC'
              value={ifsc}
              onChange={changeIfscHandler}
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
        )
      }
      case 2: {
        return (
          <Grid item xs={6}>
            <TextField
              required
              label='MICR'
              value={micr}
              onChange={changeMicrhandler}
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
        )
      }
      default: {
        return (
          <React.Fragment>
            <Grid item xs={6}>
              <TextField
                required
                label='IFSC'
                value={ifsc}
                onChange={changeIfscHandler}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='MICR'
                required
                value={micr}
                onChange={changeMicrhandler}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </React.Fragment>
        )
      }
    }
  }

  const getModeBasedView = () => {
    switch (changedMode) {
      case '1': {
        return null
      }
      case '2': {
        return (
          <React.Fragment>
            <Grid item xs={6}>
              <TextField
                required
                label='Cheque Number'
                type='number'
                value={changedChequeNo}
                onChange={(e) => setChangedChequeNo(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Cheque Date'
                type='date'
                value={changedChequeDate || ' '}
                onChange={(e) => setChangedChequeDate(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                required
                label='Search By'
                value={searchBy}
                onChange={changeSearchByHandler}
                margin='normal'
                variant='outlined'
                fullWidth
              >
                {searchOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {getSearchByView(searchBy)}
            <Grid item xs={6}>
              <TextField
                required
                label='Bank Name'
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Bank Branch'
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </React.Fragment>
        )
      }
      case '3': {
        return (
          <React.Fragment>
            <Grid item xs={6}>
              <TextField
                required
                label='Date'
                type='date'
                value={internetDate || ' '}
                onChange={(e) => setInternetDate(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Remarks'
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </React.Fragment>
        )
      }
      case '4': {
        return (
          <React.Fragment>
            <Grid item xs={6}>
              <TextField
                select
                required
                label='Cards'
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              >
                {cards.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Last 4 Digit'
                type='number'
                value={cardDigit}
                onChange={(e) => setCardDigit(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Approval Code'
                value={approvalCode}
                onChange={(e) => setApprovalCode(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Bank Name'
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label='Remarks'
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </React.Fragment>
        )
      }
      default: {
        return null
      }
    }
  }

  const receiptTypeView = () => {
    let helperText = ''
    if (receiptRange && receiptRange.manual && receiptRange.manual.length > 0) {
      helperText = `From: ${receiptRange.manual[0].range_from} To: ${receiptRange.manual[0].range_to}`
    }
    if (+receiptType === 2) {
      return (
        <Grid item xs={6}>
          <TextField
            required
            label='Receipt Range'
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
            helperText={helperText}
          />
        </Grid>
      )
    }
    return null
  }

  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant='subtitle2' style={{ marginBottom: '10px' }}>{`${type} Number : ${typeNumber}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Payment Mode</FormLabel>
            <RadioGroup aria-label='position'
              name='position'
              value={changedMode} onChange={(e) => setChangedMode(e.target.value)} row>
              <FormControlLabel
                value='1'
                control={<Radio color='primary' />}
                label='Cash'
                labelPlacement='end'
              />
              <FormControlLabel
                value='2'
                control={<Radio color='primary' />}
                label='Cheque'
                labelPlacement='end'
              />
              <FormControlLabel
                value='3'
                control={<Radio color='primary' />}
                label='Internet'
                labelPlacement='end'
              />
              <FormControlLabel
                value='4'
                control={<Radio color='primary' />}
                label='Swipe'
                labelPlacement='end'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {getModeBasedView()}
        <Grid item xs={12}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Receipt Type</FormLabel>
            <RadioGroup aria-label='position'
              name='position'
              value={receiptType} onChange={(e) => setReceiptType(e.target.value)} row>
              <FormControlLabel
                value='1'
                control={<Radio color='primary' />}
                label='Online'
                labelPlacement='end'
              />
              <FormControlLabel
                value='2'
                control={<Radio color='primary' />}
                label='Manual'
                labelPlacement='end'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {receiptTypeView()}
      </Grid>
      <Grid container justify='flex-end'>
        <Grid item xs={3}>
          <Button
            color='primary'
            variant='contained'
            onClick={editClickHandler}
          >Edit Mode</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  dataLoading: state.finance.common.dataLoader,
  receiptRange: state.finance.makePayAcc.receiptRange,
  ifscDetails: state.finance.common.ifscDetails,
  micrDetails: state.finance.common.micrDetails,
  modeDetails: state.finance.accountantReducer.totalFormCount.modeDetails
})

const mapDispatchToProps = dispatch => ({
  fetchReceiptRange: (session, branch, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, branch, alert, user })),
  fetchIfsc: (ifsc, alert, user) => dispatch(actionTypes.fetchIfsc({ ifsc, alert, user })),
  fetchMicr: (micr, alert, user) => dispatch(actionTypes.fetchMicr({ micr, alert, user })),
  updateTransactionMode: (body, tranactionId, user, alert) => dispatch(actionTypes.updateTransactionMode({ body, tranactionId, user, alert })),
  fetchFormMode: (type, transactionId, user, alert) => dispatch(actionTypes.fetchFormModeDetails({ type, transactionId, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMode)
