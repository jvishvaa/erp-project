import React, { useEffect, useState } from 'react'
import {
  Typography,
  Divider,
  withStyles,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Grid,
  Button
} from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'

import styles from './pendingReq.styles'
import * as actionTypes from '../../../store/actions'
import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'

const ApprovePendingReq = ({
  classes,
  alert,
  user,
  history,
  location,
  dataLoading,
  fetchStdFee,
  instLists,
  fetchFeePlans,
  feePlans,
  reassignReq,
  clearProps,
  response
}) => {
  const [amount, setAmount] = useState({})
  const [sum, setSum] = useState({})
  const [totalAmount, setTotalAmount] = useState(0)
  // const [totalAmtSum, setTotalAmtSum] = useState(0)
  const [currentErp, setCurrentErp] = useState('')
  const [shuffleId, setShuffleId] = useState(0)
  const [currentFeePlan, setCurrentFeePlan] = useState('')
  // const [totalAmtAdjust, setTotalAmtAdjust] = useState(0)
  const [diffTotalAmtPaidAdjust, setDiffTotalAmtPaidAdjust] = useState(0)
  const [disableAmount, setDisableAmount] = useState(false)
  const [concAmount, setConcAmount] = useState({})
  // const [diffAmt, setDiffAmt] = useState(0)
  // const [adjAmt, setAdjAmt] = useState(0)

  // for unmount
  useEffect(() => {
    return () => {
      clearProps()
    }
  }, [clearProps])

  useEffect(() => {
    if (response) {
      history.push({
        pathname: '/finance/student_shuffle'
      })
    }
  }, [response, history])

  useEffect(() => {
    const {
      erp,
      shuffleId,
      Remarks
    } = location.state
    if (erp && shuffleId && Remarks) {
      setCurrentErp(erp)
      setShuffleId(shuffleId)
      fetchFeePlans(shuffleId, alert, user)
    } else {
      history.replace({
        pathname: '/finance/student_shuffle'
      })
    }
  }, [fetchStdFee, alert, user, fetchFeePlans, history, location.state])

  useEffect(() => {
    if (currentFeePlan) {
      fetchStdFee(currentFeePlan.value, alert, user)
    }
  }, [currentFeePlan, alert, user, fetchStdFee])

  useEffect(() => {
    const calcAmount = instLists.reduce((acc, item) => {
      acc[item.id] = item.installment_amount
      return acc
    }, {})
    setAmount(calcAmount)
    setSum(calcAmount)
  }, [instLists, setAmount])

  useEffect(() => {
    if (location.state && location.state.nrmlFeeAmt === 0) {
      setDisableAmount(true)
    } else {
      setDisableAmount(false)
    }
  }, [location])

  // useEffect(() => {
  //   if (Object.keys(amount).length > 0) {
  //     setTotalAmtSum(Object.keys(amount).reduce((acc, item) => acc + (+amount[item]), 0))
  //   }
  // }, [amount])

  // useEffect(() => {
  //   if (location.state.totalAmount && diffAmt) {
  //     setAdjAmt(location.state.totalAmount - diffAmt)
  //   }
  // }, [location.state.totalAmount, diffAmt])

  useEffect(() => {
    if (Object.keys(sum).length > 0) {
      setTotalAmount(Object.keys(sum).reduce((acc, item) => acc + (+sum[item]), 0))
    }
    // setTotalAmtAdjust(Object.keys(sum).reduce((acc, item) => acc + (+sum[item]), 0))
  }, [sum])

  // useEffect(() => {
  //   if (totalAmtSum && totalAmount && instLists && instLists.length > 0) {
  //     setDiffAmt(+totalAmount - +totalAmtSum)
  //   }
  // }, [totalAmtSum, totalAmount, instLists])

  const feePlanChangeHandler = (e) => {
    setCurrentFeePlan(e)
  }

  const amountChangeHandler = (e, amt, id) => {
    if (e.target.value <= amt) {
      const newAmt = { ...amount }
      newAmt[id] = e.target.value
      const initialSum = Object.keys(newAmt).reduce((acc, item) => acc + (+newAmt[item]), 0)
      // setTotalAmtAdjust(initialSum)
      const diff = totalAmount - initialSum
      setDiffTotalAmtPaidAdjust(diff)
      if (+location.state.totalAmount - diff < 0) {
        alert.warning('Adjustment amount cannot be less than 0')
        return
      }
      setAmount(newAmt)
    } else {
      alert.warning('Invalid Amount')
    }
  }

  // const reducer = (accumulator, currentValue) => +accumulator + +currentValue

  // const totalAmountHandler = useCallback(() => {
  //   let finalAmt = 0
  //   if (Object.keys(amount).length > 0) {
  //     finalAmt = Object.values(amount).reduce(reducer)
  //     console.log('amt obkect values', finalAmt)
  //   } else {
  //     finalAmt = totalAmount
  //   }
  //   return finalAmt
  // }, [amount, totalAmount])

  // const amountToBePaid = () => {
  //   if (totalAmtSum > 0) {
  //     return totalAmtSum
  //   }
  // }

  // const amountToBeAdjusted = () => {
  //   return adjAmt
  // }

  const getButton = () => {
    let button = null
    if (instLists && instLists.length > 0) {
      button = (
        <Grid container className={classes.root} justify='center' alignItems='center'>
          <Grid item sm={4} md={4} xs={4} className={classes.item}>
            <Button
              className={classes.addButton}
              color='primary'
              size='large'
              variant='contained'
              onClick={approveRequest}
            >
              Approve Shuffle Request
            </Button>
          </Grid>
        </Grid>
      )
    }
    return button
  }

  // const getButton = useCallback(() => {
  //   let button = null
  //   if (instLists && instLists.length > 0) {
  //     button = (
  //       <Grid container className={classes.root} justify='center' alignItems='center'>
  //         <Grid item sm={4} md={4} xs={4} className={classes.item}>
  //           <Button
  //             className={classes.addButton}
  //             color='primary'
  //             size='large'
  //             variant='contained'
  //             onClick={approveRequest}
  //           >
  //             Approve Shuffle Request
  //           </Button>
  //         </Grid>
  //       </Grid>
  //     )
  //   }
  //   return button
  // }, [instLists, amount])

  const concAmountChangeHandler = (event, instaAmount, id) => {
    if (event.target.value <= instaAmount) {
      let newAmt = { ...concAmount }
      newAmt[id] = event.target.value
      setConcAmount(newAmt)
    } else {
      return alert.warning('Concession amount cant be greater than installment amount!')
    }
  }

  const approveRequest = () => {
    let stdDetails = JSON.parse(JSON.stringify(instLists))
    let instaDetails = JSON.parse(JSON.stringify(instLists))
    let concAmt = 0
    for (let [key, value] of Object.entries(concAmount)) {
      concAmt += +value
    }
    if (location.state.concessionAmt !== concAmt) {
      return alert.warning('Adjust Concession amount properly')
    }
    instaDetails.map(val => {
      Object.keys(amount).map(id => {
        if (+val.id === +id) {
          val['installment_amount'] = +amount[id]
          val['concession_amount'] = +concAmount[id] ? +concAmount[id] : 0
        }
      })
    })

    let feeTypeIds = []
    stdDetails.map((instas) => feeTypeIds.push(instas.fee_type))
    let newFeeTypeIds = feeTypeIds.filter((a, b) => feeTypeIds.indexOf(a) === b)
    let objAmount = {}

    for (let i = 0; i < newFeeTypeIds.length; i++) {
      let bal = 0
      for (let j = 0; j < stdDetails.length; j++) {
        if (newFeeTypeIds[i] === stdDetails[j].fee_type) {
          bal += stdDetails[j].installment_amount - amount[stdDetails[j].id]
        }
      }
      objAmount[newFeeTypeIds[i]] = bal
    }
    // let amount = 0

    // stdDetails.map((instas) => {

    // })
    const data = {
      studentshuffle_id: shuffleId,
      student_installments: instaDetails,
      remarks: location.state.Remarks,
      fee_type_amount: objAmount,
      total_amount_to_pay: totalAmount
    }
    // console.log('amt stdDetails', data)
    if (totalAmount) {
      if (location.state.nrmlFeeAmt === diffTotalAmtPaidAdjust) {
        reassignReq(data, alert, user)
        history.push('Approval/Requests/StudentShuffleRequest');
      } else {
        alert.warning('Please Adjust Paid Amount. Total Amount to be Paid :' + ( totalAmount - location.state.concessionAmt ) + ' and Total Amount to be Adjust: ' + location.state.nrmlFeeAmt + ' to adjust the Amount Decrease Total Paid Amount in any Installment')
      }
    }
  }

  const getPenTableDetails = () => {
    let tableRow = null
    if (instLists && instLists.length > 0) {
      tableRow = instLists.map((val, index) => (
        <TableRow>
          <TableCell align='left'>{index + 1}</TableCell>
          <TableCell align='left'>{val.installment_name ? val.installment_name : ''}</TableCell>
          <TableCell align='left'>{val.installment_percentage ? val.installment_percentage : 0}</TableCell>
          <TableCell align='left'>{val.installment_start_date ? val.installment_start_date : ''}</TableCell>
          <TableCell align='left'>{val.due_date ? val.due_date : ''}</TableCell>
          <TableCell align='left'>{val.installment_end_date ? val.installment_end_date : ''}</TableCell>
          <TableCell align='left'>{val.installment_amount ? val.installment_amount : 0}</TableCell>
          <TableCell align='left'>
            {/* {location.state.concessionAmt || 0} */}
            <TextField
              type='number'
              margin='normal'
              label='Concession Amount'
              style={{ width: '250px' }}
              disabled={location.state.concessionAmt === 0}
              defaultValue={concAmount[val.id]}
              value={concAmount[val.id] || 0}
              onChange={(e) => {
                concAmountChangeHandler(e, val.installment_amount, val.id)
              }}
              variant='outlined'
            />
          </TableCell>
          <TableCell align='left' style={{ width: '200px' }}>
            <TextField
              type='number'
              margin='normal'
              label='Amount'
              style={{ width: '250px' }}
              disabled={disableAmount}
              defaultValue={amount[val.id]}
              value={amount[val.id] || 0}
              onChange={(e) => {
                amountChangeHandler(e, val.installment_amount, val.id)
              }}
              variant='outlined'
            />
          </TableCell>
        </TableRow>
      ))
    } else if (instLists && instLists.length === 0) {
      tableRow = 'No Records Found !!!'
    }
    return tableRow
  }

  const getPendingData = () => {
    let data = null
    if (instLists) {
      data = (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>S.No</TableCell>
              <TableCell align='left'>Installment Name</TableCell>
              <TableCell align='left'>Installment Percentage</TableCell>
              <TableCell align='left'>Installment Start Date</TableCell>
              <TableCell align='left'>Installment Due Date</TableCell>
              <TableCell align='left'>Installment End Date</TableCell>
              <TableCell align='left'>Installment Amount</TableCell>
              <TableCell align='left'>Concession Amount</TableCell>
              <TableCell align='left'>Remaining Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPenTableDetails()}
          </TableBody>
        </Table>
      )
    }
    return data
  }

  // const getPendingData = useCallback(() => {
  //   let data = null
  //   if (instLists) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell align='left'>S.No</TableCell>
  //             <TableCell align='left'>Installment Name</TableCell>
  //             <TableCell align='left'>Installment Percentage</TableCell>
  //             <TableCell align='left'>Installment Start Date</TableCell>
  //             <TableCell align='left'>Installment Due Date</TableCell>
  //             <TableCell align='left'>Installment End Date</TableCell>
  //             <TableCell align='left'>Installment Amount</TableCell>
  //             <TableCell align='left'>Amount</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getPenTableDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  //   return data
  // }, [instLists, amount])

  return (
    <React.Fragment>
      <Typography variant='h5' align='center'>ReAssign Requests</Typography>
      <Divider className={classes.divider} />
      <div>
        <label style={{ marginLeft: '20px' }}>ERP :</label>&nbsp;{currentErp}
      </div>
      <Grid container className={classes.root}>
        <Grid item sm={3} md={3} xs={12}>
          <label>Fee Plan*</label>
          <Select
            className={classes.textField}
            placeholder='Select Fee Plan'
            value={currentFeePlan || ''}
            options={
              feePlans && feePlans.length > 0
                ? feePlans.map(fee => ({
                  value: fee.id ? fee.id : '',
                  label: fee.fee_plan_name ? fee.fee_plan_name : ''
                }))
                : []
            }
            onChange={feePlanChangeHandler}
          />
        </Grid>
      </Grid>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ overflow: 'auto', marginBottom: '30px' }}>
          {getPendingData()}
        </div>
        {instLists && instLists.length > 0 ? <div style={{ marginLeft: '20px', fontSize: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Total Amount to be Paid :</label>&nbsp;
            {totalAmount - location.state.concessionAmt}
            {/* <div style={{ float: 'right', marginBottom: '15px', marginRight: 15 }}>
              <label>Total Amount to be Adjust:</label>&nbsp; */}
            {/* {amountToBePaid()} */}{
            }
            {/* <div style={{ marginBottom: '15px', marginRight: '15px', marginTop: '15px' }}>
                <label> Amount Remaning to be Adjust:</label>&nbsp;
                {diffTotalAmtPaidAdjust}
              </div> */}
            {/* </div> */}
          </div>
          {/* <div>
            <label>Total Amount to be Adjusted</label>&nbsp;
            {amountToBeAdjusted()}
          </div> */}
          <div>
            <label>Total Normal Fee Amount to be Adjust :</label>&nbsp;
            {location.state.nrmlFeeAmt || 0}
          </div>
          <div>
            <label>Concession Amount to be Adjusted:</label>&nbsp;
            {location.state.concessionAmt || 0}
          </div>
          <div>
            <label>Total Other Fee Amount :</label>&nbsp;
            {location.state.othrFeeAmt || 0}
          </div>
        </div> : null}
      </div>
      <div>
        {getButton()}
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

ApprovePendingReq.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  instLists: state.finance.studentShuffle.instLists,
  feePlans: state.finance.studentShuffle.feePlans,
  response: state.finance.studentShuffle.reassignRes,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchStdFee: (feePlanId, alert, user) => dispatch(actionTypes.fetchInstListPerFeePlan({ feePlanId, alert, user })),
  fetchFeePlans: (stdId, alert, user) => dispatch(actionTypes.fetchFeePlanPerStdShuffle({ stdId, alert, user })),
  reassignReq: (data, alert, user) => dispatch(actionTypes.reassignStudentShuffle({ data, alert, user })),
  clearProps: () => dispatch(actionTypes.clearReassignProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ApprovePendingReq)))
