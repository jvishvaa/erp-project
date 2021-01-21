import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, TextField, Button, FormControlLabel, Switch, Fab, Table, TableBody, TableRow, TableHead, TableCell } from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import Modal from '../../../ui/Modal/modal'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'

const CreateCoupon = ({ alert, user, createCoupon, listAllCoupon, couponAllList, couponDetailUpdate }) => {
  const [active, setActive] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [couponName, setCouponName] = useState('')
  const [discount, setDiscount] = useState(null)
  const [validFrom, setValidFrom] = useState(null)
  const [validTo, setValidTo] = useState(null)
  // const [showCoupon, setShowCoupon] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [couponId, setCouponId] = useState(null)
  const [validToHelerTxt, setValidToHelerTxt] = useState(null)
  const [validFromHelerTxt, setValidFromHelerTxt] = useState(null)
  const [disableUpdateBut, setDisableUpdateBut] = useState(false)

  useEffect(() => {
    listAllCoupon(alert, user)
  }, [alert, listAllCoupon, user])

  useEffect(() => {
    if (validTo) {
      let a = validTo
      let b = a.split('T')
      let c = b[0].split('-')
      let d = c.reverse()
      let e = d.join('-')
      console.log('a,b,c,d,d', a, b, c, d, e)
      console.log('time', b[1])
      if (b[1] < '12:00') {
        setValidToHelerTxt(e + ' (' + b[1] + 'AM)')
        console.log('AM')
      } else {
        setValidToHelerTxt(e + ' (' + b[1] + 'PM)')
        console.log('PM')
      }
    }
    if (validFrom) {
      let a = validFrom
      let b = a.split('T')
      let c = b[0].split('-')
      let d = c.reverse()
      let e = d.join('-')
      console.log('time', b[1])
      if (b[1] < '12:00') {
        setValidFromHelerTxt(e + ' (' + b[1] + 'AM)')
        console.log('AM')
      } else {
        setValidFromHelerTxt(e + ' (' + b[1] + 'PM)')
        console.log('PM')
      }
    }
  }, [validFrom, validTo])

  const activeInactiveHandeler = (e) => {
    console.log('switch value: ', e.target.value)
    if (e.target.value === 'isActive') {
      setIsActive(e.target.checked)
    }
    if (e.target.value === 'isUpdateActive' && active) {
      setActive(false)
      setDisableUpdateBut(false)
    } else {
      setActive(false)
      setDisableUpdateBut(true)
    }
  }
  const setCouponNameHandler = (e) => {
    setCouponName(e.target.value)
  }
  const discountHandler = (e) => {
    if (e.target.value <= 100 && e.target.value > 0) {
      setDiscount(e.target.value)
    } else {
      alert.warning('Discount should be greater than 0 less than 100')
    }
  }
  const setValidFromHandler = (e) => {
    if (validTo) {
      if (e.target.value < validTo) {
        setValidFrom(e.target.value)
      } else {
        alert.warning('Valid From Date should be less than Valid To Date')
      }
    } else {
      setValidFrom(e.target.value)
    }
  }
  const setValidToHandler = (e) => {
    if (validFrom) {
      if (validFrom < e.target.value) {
        setValidTo(e.target.value)
      } else {
        alert.warning('Valid To Date should be grater than Valid From Date')
      }
    } else {
      setValidTo(e.target.value)
    }
  }
  const createCouponHandler = () => {
    if (couponName && validFrom && validTo && discount) {
      const data = {
        coupon: couponName,
        valid_from: validFrom,
        valid_to: validTo,
        discount: discount,
        active: isActive
      }
      createCoupon(data, alert, user)
      setCouponName('')
      setValidFrom(null)
      setValidTo(null)
      setDiscount(null)
      setValidFromHelerTxt('')
      setValidToHelerTxt('')
      // setShowCoupon(true)
    } else {
      alert.warning('Fill all the Required field and Date with Time also!')
    }
  }
  const hideEditModalHandler = () => {
    setEditModal(false)
    setCouponName('')
    setValidTo('')
    setValidFrom('')
    setDiscount('')
    setValidToHelerTxt('')
    setValidFromHelerTxt('')
  }
  const showEditModalHandler = (couId, coupon, from, to, discount, active) => {
    setCouponId(couId)
    setEditModal(true)
    setCouponName(coupon)
    setValidTo(to)
    setValidFrom(from)
    setDiscount(discount)
    setActive(active)
    if (active) {
      setDisableUpdateBut(false)
    } else {
      setDisableUpdateBut(true)
    }
    setValidFromHelerTxt('')
    setValidToHelerTxt('')
  }
  const updateCouponHandler = () => {
    if (couponName && validFrom && validTo && discount) {
      let id = couponId
      const data = {
        coupon_id: couponId,
        coupon: couponName,
        valid_from: validFrom,
        valid_to: validTo,
        discount: discount,
        active: active
      }
      console.log('data', data)
      couponDetailUpdate(id, data, alert, user)
      setEditModal(false)
      setCouponName('')
      setValidTo('')
      setValidFrom('')
      setDiscount('')
      setValidToHelerTxt('')
      setValidFromHelerTxt('')
    } else {
      alert.warning('Fill all the Required field and Date with Time also!')
    }
    // setCouponName('')
    // setValidFrom(null)
    // setValidTo(null)
    // setDiscount(null)
  }

  let changeModal = null
  if (editModal) {
    changeModal = (
      <Modal open={editModal} click={hideEditModalHandler} large>
        <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <TextField
                id='coupon_name'
                type='text'
                required
                InputLabelProps={{ shrink: true }}
                value={couponName || ''}
                onChange={setCouponNameHandler}
                margin='normal'
                variant='outlined'
                label='Coupon Name'
              />
            </Grid>
            <Grid item xs='3'>
              <TextField
                id='discount'
                type='number'
                required
                InputLabelProps={{ shrink: true }}
                value={discount || ''}
                onChange={discountHandler}
                margin='normal'
                variant='outlined'
                label='Discount Percentage'
              />
            </Grid>
            <Grid item xs='3'>
              <TextField
                id='valid_from'
                type='datetime-local'
                required
                InputLabelProps={{ shrink: true }}
                value={validFrom}
                helperText={validFromHelerTxt}
                onChange={setValidFromHandler}
                margin='normal'
                variant='outlined'
                label='Valid From'
              />
            </Grid>
            <Grid item xs='3'>
              <TextField
                id='valied_to'
                type='datetime-local'
                required
                InputLabelProps={{ shrink: true }}
                value={validTo}
                helperText={validToHelerTxt}
                onChange={setValidToHandler}
                margin='normal'
                variant='outlined'
                label='Valid To'
              />
            </Grid>
            <Grid item xs='3'>
              <FormControlLabel
                control={
                  <Switch
                    checked={active}
                    onChange={activeInactiveHandeler}
                    value='isUpdateActive'
                    color='primary'
                  />
                }
                label='Active/Inactive'
              />
            </Grid>
            <Grid item xs={3}>
              <Button style={{ marginTop: 0 }} variant='contained'
                color='primary'
                disabled={disableUpdateBut}
                onClick={updateCouponHandler}
              >
              UPDATE
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </Modal>
    )
  }

  const allCouponList = () => {
    let tabledata = couponAllList && couponAllList.map((coupon) => {
      return (
        <TableBody>
          <TableRow>
            <TableCell>{coupon.coupon} </TableCell>
            <TableCell>{coupon.valid_from && coupon.valid_from} </TableCell>
            <TableCell>{coupon.valid_to && coupon.valid_to} </TableCell>
            <TableCell>{coupon.discount}</TableCell>
            <TableCell> {coupon.active ? 'Active' : 'Inactive'} </TableCell>
            <TableCell> <Fab size='small' color='primary' style={{ marginBottom: '5px' }}
              onClick={() => showEditModalHandler(coupon.id, coupon.coupon, coupon.v_from, coupon.v_to, coupon.discount, coupon.active)}
            >
              <Edit style={{ cursor: 'pointer' }} />
            </Fab>,</TableCell>
          </TableRow>
        </TableBody>
      )
    })
    return tabledata
  }
  return (
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs='3'>
          <TextField
            id='coupon_name'
            type='text'
            required
            InputLabelProps={{ shrink: true }}
            value={couponName || ''}
            onChange={setCouponNameHandler}
            margin='normal'
            variant='outlined'
            label='Coupon Name'
          />
        </Grid>
        <Grid item xs='3'>
          <TextField
            id='discount'
            type='number'
            required
            InputLabelProps={{ shrink: true }}
            value={discount || ''}
            onChange={discountHandler}
            margin='normal'
            variant='outlined'
            label='Discount Percentage'
          />
        </Grid>
        <Grid item xs='3'>
          <TextField
            id='valid_from'
            type='datetime-local'
            required
            InputLabelProps={{ shrink: true }}
            helperText={validFromHelerTxt}
            value={validFrom || ''}
            onChange={setValidFromHandler}
            margin='normal'
            variant='outlined'
            label='Valid From'
          />
        </Grid>
        <Grid item xs='3'>
          <TextField
            id='valied_to'
            type='datetime-local'
            required
            InputLabelProps={{ shrink: true }}
            value={validTo || ''}
            helperText={validToHelerTxt}
            onChange={setValidToHandler}
            margin='normal'
            variant='outlined'
            label='Valid To'
          />
        </Grid>
        <Grid item xs='3'>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={activeInactiveHandeler}
                value='isActive'
                color='primary'
              />
            }
            label='Active/Inactive'
          />
        </Grid>
        <Grid item xs={3}>
          <Button style={{ marginTop: 0 }} variant='contained'
            color='primary'
            onClick={createCouponHandler}
          >
              CREATE COUPON
          </Button>
        </Grid>
      </Grid>
      <Table style={{ marginTop: 50 }}>
        <TableHead>
          <TableCell><b style={{ fontSize: 16 }}>Coupon Name</b></TableCell>
          <TableCell><b style={{ fontSize: 16 }}>Valid From</b> </TableCell>
          <TableCell><b style={{ fontSize: 16 }}>Valid To </b></TableCell>
          <TableCell><b style={{ fontSize: 16 }}>Discount(%)</b></TableCell>
          <TableCell><b style={{ fontSize: 16 }}>Active/Inactive</b></TableCell>
          <TableCell><b style={{ fontSize: 16 }}>Edit</b></TableCell>
        </TableHead>
        {allCouponList()}
        {changeModal}
      </Table>
    </React.Fragment>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  // couponList: state.finance.createCoupon.couponList,
  couponAllList: state.finance.createCoupon.couponAllList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  createCoupon: (data, alert, user) => dispatch(actionTypes.createCoupon({ data, alert, user })),
  couponDetailUpdate: (id, data, alert, user) => dispatch(actionTypes.couponDetailUpdate({ id, data, alert, user })),
  // listCoupon: (alert, user) => dispatch(actionTypes.listCoupon({ alert, user }))
  listAllCoupon: (alert, user) => dispatch(actionTypes.listAllCoupon({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((CreateCoupon))
