import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { TextField, Grid, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import Select from 'react-select'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions'
// import { WebIdentityCredentials } from 'aws-sdk'

const EditFeeInstallmentAmount = ({
  installmentList,
  feeAccountList,
  id,
  acadId,
  alert,
  editDataLoading,
  user,
  close,
  updateIndividualInstallment,
  feeTypeId,
  ...props }) => {
  const [installmentName, setInstallmentName] = useState('')
  const [installmentAmount, setInstallmentAmount] = useState(null)
  useEffect(() => {
    let currentInstallment = installmentList.filter(val => val.id === id)
    currentInstallment.forEach((val) => {
      setInstallmentAmount(val.installment_amount)
      setInstallmentName(val.installment_name)
    })
    // feeAccountList(acadId, alert, user)
    // setInstallmentAmount(null)
  }, [installmentList, id])
  const handlevalue = e => {
    e.preventDefault()
    var data = {
      id: parseInt(id),
      installmentName: installmentName,
      installmentAmount: installmentAmount
    }
    props.updateInstallmentAmount(id, feeTypeId, data, alert, user)
    close()
  }
  const installmentAmountHandler = e => {
    setInstallmentAmount(e.target.value)
  }

  return (
    <React.Fragment>
      <Form onSubmit={handlevalue}>
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='8'>
            <label className='student-addStudent-segment1-heading'>
                        Edit Installments
            </label>
          </Grid>
          <Grid item xs='6'>
            <label>Installment Name : {installmentName}</label>
          </Grid>
          <Grid item xs='4'>
            <label>Edit Installment amount :</label>
          </Grid>
          <Grid item xs='4'>
            <TextField id='outlined-basic'placeholder='Installment Amount' type='text' onChange={installmentAmountHandler} value={installmentAmount} variant='outlined' />
          </Grid>
          <Grid item xs='8'>
            <Button
            style={{ marginRight: '10px' }}
              type='submit'
              color='primary'
              variant='contained'
            >
                    Update
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={close}
              style={{ marginLeft: '20px' }}
              type='button'
            >
                    Return
            </Button>
          </Grid>
        </Grid>
        {editDataLoading ? <CircularProgress open /> : null}
      </Form>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  installmentList: state.finance.feePlan.feeInstallments,
  feeAccountListFromAcadId: state.finance.feePlan.feeAccountListFromAcadId
//   editDataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  feeAccountList: (acadId, alert, user) => dispatch(actionTypes.feeAccountListFromAcadId({ acadId, alert, user })),
  updateIndividualInstallment: (installmentId, data, alert, user) => dispatch(actionTypes.updateInstallmentRecord({ installmentId, data, alert, user })),
  updateInstallmentAmount: (id, feeTypeId, data, alert, user) => dispatch(actionTypes.updateInstallmentAmount({ id, feeTypeId, data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditFeeInstallmentAmount)))
