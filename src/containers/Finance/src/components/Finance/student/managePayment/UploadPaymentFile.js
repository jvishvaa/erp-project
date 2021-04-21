import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import ImageIcon from '@material-ui/icons/Image'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import { urls } from '../../../../urls'

const url = urls.UploadPaymentFile

function UploadPaymentFile (props) {
  const [transactionId, setTransactionId] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [uploadImage, setUploadImage] = useState('')
  const [isupload, setIsUpload] = useState(false)

  const currBrnch = JSON.parse(localStorage.getItem('user_profile'))
  useEffect(() => {
  }, [])

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value)
  }
  const today = new Date()
  const handleTransactionDateChange = (e) => {
    if ((today.getTime() - new Date(e.target.value).getTime()) > 0) {
      setTransactionDate(e.target.value)
    } else {
      props.alert.warning('Please select proper date')
    }
  }

  const handleTransactionImageChange = (e) => {
    setUploadImage(e.target.files[0])
    setIsUpload(true)
  }

  const handleClickimage = () => {
  }

  const clearState = () => {
    setTransactionDate('')
    setTransactionId('')
    setUploadImage('')
    setIsUpload(false)
  }
  const handleClick = () => {
    const formData = new FormData()
    if (transactionDate !== '') {
      formData.append('payment_screenshot', uploadImage)
      formData.append('paid_date', transactionDate)
      formData.append('transction_id', transactionId)
      formData.append('normal_fee_amount', JSON.stringify(props.location.state.dataObj.normalFee))
      formData.append('other_fee_amount', JSON.stringify(props.location.state.dataObj.otherFee))
      formData.append('fee_account', props.location.state.fee_account_id)
      formData.append('total_paid_amount', props.location.state.total_paid_amount)
      formData.append('academic_year', currBrnch.current_acad_session)
      formData.append('branch', currBrnch.branch_id)

      axios.post(url, formData, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
        .then(res => {
          props.alert.success(res.data)
          if (res.data === 'Sucesssfully Uploaded') {
            setTimeout(function () {
              props.history.push('/finance/ManagePayments')
            }, 1000)
          }
          clearState()
        }
        )
        .catch(error => console.log(error))
    } else {
      props.alert.warning(' Please Select Date')
    }
    setIsUpload(false)
  }

  const GoBackHandler = () => {
    props.history.goBack('/')
  }

  return (
    <div style={{ marginTop: '3%', marginLeft: '2%' }}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3} md={3} lg={2}>
          <TextField
            id='standard-password-input'
            label='UPI Id'
            type='text'
            value={transactionId}
            onChange={handleTransactionIdChange}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={3} lg={2}>
          <form noValidate>
            <TextField
              id='date'
              requiredfiles
              label='Date of Payment'
              type='date'
              value={transactionDate}
              InputLabelProps={{
                shrink: true
              }}
              onChange={handleTransactionDateChange}
            />
          </form>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <Button
            variant='contained'
            component='label'
            onClick={handleClickimage}
            // className={classes.button}
            size='large'
            style={{ backgroundColor: '#ad1457', color: 'white' }}
          >
            Upload payment screenshot
            <input
              accept='image/*'
              type='file'
              required
              onChange={handleTransactionImageChange}
              style={{ display: 'none' }}
            />
            <ImageIcon />
          </Button>
        </Grid>
        <Grid iten xs={6} sm={2} md={2} lg={2} style={{ marginTop: '5px' }}>
          <Button
            variant='contained'
            onClick={handleClick}
            disabled={!isupload}
            type='submit'
            size='large'
            // style={{ marginTop: '10px' }}
            color='primary'>
            Submit Details
          </Button>
        </Grid>
        <Grid iten xs={6} sm={2} md={2} lg={2}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '5px' }}
            onClick={GoBackHandler}
          >
            Go Back
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  makePaymentList: state.finance.studentManagePayment.studentMakePaymentList,
  amount: state.finance.studentManagePayment.amount
})

const mapDispatchToProps = dispatch => ({
  fetchListMakePayment: (session, alert, user) => dispatch(actionTypes.fetchMakePaymentList({ session, alert, user })),
  clearUnrelevantData: () => dispatch({ type: actionTypes.CLEAR_UNRELEVANT_DATA }),
  makePayment: (data, alert, user) => dispatch(actionTypes.makePaymentStudent({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(UploadPaymentFile)))
