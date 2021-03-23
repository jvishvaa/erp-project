import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import StoreAtAcc from '../BranchAccountant/StoreAtAcc/storeAtAcc'
import {
  withStyles, Table, TableRow, TableHead, TableBody, TableCell, Button, TextField, Grid
} from '@material-ui/core/'
import { urls } from '../../../../urls'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import ConfigItems from '../StoreAtAcc/configItems'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
    backgroundColor: '#2196f3',
    marginTop: '0px',
    '&:hover': {
      backgroundColor: '#1a8cff'
    }
  }
})

const ShippingAmount = ({ fetchShipping, shippingDetails, deliveryList, trnsId, sendDeliveryDetails, fetchDeliveryDetails, erpValue, session, dataLoading, alert, user, history }) => {
  const [erp, setErp] = useState(null)
  const [role, setRole] = useState(null)
  const [showConfigItem, setShowConfigItem] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [state, setState] = useState('')
  const [kitId, setKitId] = useState('')
  const [tranId, setTranId] = useState('')

  useEffect(() => {
    const erp = (JSON.parse(localStorage.getItem('userDetails'))).erp
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const roleLogin = userProfile.personal_info.role.toLowerCase()
    setRole(roleLogin)
    if (roleLogin === 'financeaccountant') {
      fetchShipping(erpValue, alert, user)
      fetchDeliveryDetails(erpValue, alert, user)
    } else {
      fetchShipping(erp, alert, user)
      fetchDeliveryDetails(erp, alert, user)
    }
    setErp(erp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trnsId])
  // useEffect(() => {
  //   console.log('payment done, refreshing')
  //   if (role === 'financeaccountant') {
  //     fetchShipping(erpValue, alert, user)
  //     fetchDeliveryDetails(erpValue, alert, user)
  //   } else {
  //     fetchShipping(erp, alert, user)
  //     fetchDeliveryDetails(erp, alert, user)
  //   }
  // }, [trnsId, alert, user, fetchShipping, fetchDeliveryDetails, erpValue, erp, role])
  useEffect(() => {
    console.log('shipping data', history, erp)
  })

  const configHandler = (kit, tran) => {
    console.log('kitId: ', kit)
    setKitId(kit)
    setTranId(tran)
    setShowConfigItem(!showConfigItem)
  }

  const hideDeliveryModalHandler = () => {
    setShowDeliveryModal(false)
  }

  const showDeliveryModalHandler = () => {
    setShowDeliveryModal(true)
    setName(deliveryList.length && deliveryList[0].name ? deliveryList[0].name : '')
    setPhone(deliveryList.length && deliveryList[0].phone_number ? deliveryList[0].phone_number : '')
    setAddress1(deliveryList.length && deliveryList[0].address1 ? deliveryList[0].address1 : '')
    setAddress2(deliveryList.length && deliveryList[0].address2 ? deliveryList[0].address2 : '')
    setCity(deliveryList.length && deliveryList[0].city ? deliveryList[0].city : '')
    setZipcode(deliveryList.length && deliveryList[0].zip_code ? deliveryList[0].zip_code : '')
    setState(deliveryList.length && deliveryList[0].state ? deliveryList[0].state : '')
  }

  const handleData = (event) => {
    switch (event.target.id) {
      case 'name': {
        setName(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { name: event.target.value }))
        break
      }
      case 'phone': {
        setPhone(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { phone: event.target.value }))
        break
      }
      case 'address1': {
        setAddress1(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { address1: event.target.value }))
        break
      }
      case 'address2': {
        setAddress2(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { address2: event.target.value }))
        break
      }
      case 'zipcode': {
        setZipcode(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { zipcode: event.target.value }))
        break
      }
      case 'city': {
        setCity(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { city: event.target.value }))
        break
      }
      case 'state': {
        setState(event.target.value)
        // this.setState(Object.assign(this.state.delivery, { state: event.target.value }))
        break
      }
      default: {

      }
    }
  }

  const sendAddress = () => {
    // send api
    if (!name.length || !address1.length || !city.length || !state.length) {
      alert.warning('Enter all the fields!')
      return
    }
    if (phone.length !== 10) {
      alert.warning('Enter 10 digits phone number')
      return
    }
    if (zipcode.length !== 6) {
      alert.warning('Enter 6 digits Zip code')
      return
    }
    let data = {
      student: { erp: erp || erpValue },
      name: name,
      phone_number: phone,
      address1: address1,
      address2: address2,
      zip_code: zipcode,
      city: city,
      state: state
    }
    sendDeliveryDetails(data, alert, user)
    hideDeliveryModalHandler()
  }

  const deliveryModal = (
    <Modal open={showDeliveryModal} justifyContent='center' click={hideDeliveryModalHandler} style={{ width: '30%', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Enter Shipping Address</h2>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField id='name' value={name} label='Contact Name' onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='phone' label='Phone Number' value={phone} type='number' onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='address1' multiline rowsMax='4' value={address1} label='Address Line 1' onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='address2' multiline rowsMax='4' value={address2} label='Address Line 2' onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='zipcode' label='Zip Code' value={zipcode} type='number' onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='city' label='City' value={city} onChange={handleData} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='state' label='State' value={state} onChange={handleData} />
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            // disabled={!this.state.secondLang || !this.state.thirdLang}
            style={{ marginTop: '20px' }}
            variant='contained'
            color='primary'
            onClick={sendAddress}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Modal>
  )

  const paymentHandler = (kit, tran) => {
    console.log('kit to be paid: ', role, kit, tran)
    if (!deliveryList.length) {
      alert.warning('Enter shipping address to proceed!')
      return
    }
    if (!shippingDetails.kit_data.length) {
      alert.warning('Kit Shipping amount is not assigned, cannot proceed, Sorry!')
      return
    }
    if (role === 'financeaccountant') {
      configHandler(kit, tran)
    } else {
      let isStudent = true
      let del = null
      let kitTobePaid = {
        delivery_data_kit_id: kit,
        t_no: tran
      }
      console.log('kit to be paid inside else: ', kitTobePaid)
      if (shippingDetails.kit_data && shippingDetails.kit_data[0] && shippingDetails.kit_data[0].kit && shippingDetails.kit_data[0].kit.kit_price) {
        del = {
          delivery: {
            delivery_id: shippingDetails.kit_data[0].kit && shippingDetails.kit_data[0].kit.id,
            items: shippingDetails.kit_data[0].kit && shippingDetails.kit_data[0].kit.item
          }
        }
      }
      history.replace({
        pathname: '/airpay/',
        state: {
          session_year: '2020-21',
          uniform: {
            uniform_id: null,
            items: []
          },
          stationary: {
            stationary_id: null,
            items: []
          },
          ...shippingDetails.kit_data.length ? del : null,
          total_paid_amount: shippingDetails.kit_data[0].kit && shippingDetails.kit_data[0].kit.kit_price,
          ...kit ? kitTobePaid : null
        },
        user: user,
        url: isStudent ? urls.AirPayHdfcStore : urls.AirpayStore
      })
    }
  }
  return (
    <div style={{ padding: 20 }}>
      {/* <h1>hello, {erp}</h1> */}
      {showConfigItem
        ? <React.Fragment>
          <ConfigItems
            selectedTotal={0}
            erpCode={erpValue}
            session={session}
            shippingComponent={showConfigItem}
            checkedKits={[]}
            // isUniformBought={this.props.isUniformBought}
            // isStationaryBought={this.props.isStationaryBought}
            // hasSubjectChoosen={this.props.hasSubjectChoosen}
            // isNewStudent={this.props.isNewStudent}
            getBack={configHandler}
            alert={alert}
            user={user}
            isStudent={false}
            isDelivery='home'
            kitIdToBePaid={kitId}
            transactionId={tranId}
            selctedKits={[]}
          />
        </React.Fragment>
        : shippingDetails && shippingDetails.paid_data && shippingDetails.paid_data.length
          ? <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kit Name</TableCell>
                <TableCell>Kit Type</TableCell>
                <TableCell>Opted for Home Shipping?</TableCell>
                <TableCell>Shipping Charge</TableCell>
                <TableCell>Pay Shipping Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shippingDetails.paid_data.map((kit) => {
                return (
                  <TableRow key={kit.kit}>
                    <TableCell>{kit.kit_name}</TableCell>
                    <TableCell>{kit.is_uniform_kit ? 'Uniform kit' : 'Stationary Kit'}</TableCell>
                    <TableCell>{kit.is_delivery_home ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{kit.is_delivery_home ? kit.amount : shippingDetails.kit_data && shippingDetails.kit_data[0] && shippingDetails.kit_data[0].kit ? shippingDetails.kit_data[0].kit.kit_price : 'NA'}</TableCell>
                    <TableCell><Button color='primary' disabled={kit.is_uniform_kit || kit.is_delivery_home} variant='outlined' onClick={() => paymentHandler(kit.kit, kit.t_no)}>Pay Now</Button></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          : <p>Hi, You have made no transaction yet, please go to Books and Uniforms section to buy kits!</p>}
      {!showConfigItem ? <Button color='secondary' style={{ marginTop: 20 }} variant='outlined' onClick={showDeliveryModalHandler}> Enter/Modify Delivery Address</Button> : ''}
      {deliveryList.length && !showConfigItem
        ? <div style={{ marginTop: 20 }}>
          <h3>Shipping Details</h3>
          <p>Contact Person Name: {deliveryList.length && deliveryList[0].name}</p>
          <p>Mobile Number: {deliveryList.length && deliveryList[0].phone_number}</p>
          <p>Address: {deliveryList.length && deliveryList[0].address1} <br />
            {deliveryList.length && deliveryList[0].address2} <br />
            {deliveryList.length && deliveryList[0].city} <br />
            {deliveryList.length && deliveryList[0].zip_code} <br />
            {deliveryList.length && deliveryList[0].state} <br />
          </p>
        </div>
        : ''}
      {deliveryModal}
      {dataLoading ? <CircularProgress open /> : null}
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  shippingDetails: state.inventory.branchAcc.storeAtAcc.shippingDetails,
  deliveryList: state.inventory.branchAcc.storeAtAcc.deliveryList,
  dataLoading: state.finance.common.dataLoader,
  trnsId: state.inventory.branchAcc.storeAtAcc.transactionId
})
const mapDispatchToProps = dispatch => ({
  fetchShipping: (erp, alert, user) => dispatch(actionTypes.fetchShippingTransaction({ erp, alert, user })),
  fetchDeliveryDetails: (erp, alert, user) => dispatch(actionTypes.fetchDeliveryDetails({ erp, alert, user })),
  sendDeliveryDetails: (data, alert, user) => dispatch(actionTypes.sendDeliveryDetails({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ShippingAmount)))
