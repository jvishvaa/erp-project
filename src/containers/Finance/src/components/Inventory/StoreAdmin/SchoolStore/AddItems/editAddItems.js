import React, { useEffect, useState } from 'react'
import { Grid, FormControlLabel, Switch, Button } from '@material-ui/core'
import Select from 'react-select'
// import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux'
import { connect } from 'react-redux'

// import CircularProgress from '../../../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../../../store/actions'

const modalHeadStyle = {
  width: '100%',
  textAlign: 'center',
  marginTop: '12px'
}

const inputStyle = {
  alignItems: 'center',
  backgroundColor: 'hsl(0,0%,100%)',
  borderColor: 'hsl(0,0%,80%)',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderWidth: '1px',
  cursor: 'default',
  height: '38px',
  paddingLeft: '12px'
}

const GENDER = [
  { id: 1, gender: 'Male' },
  { id: 2, gender: 'Female' },
  { id: 3, gender: 'Both' }
]

const EditAddItems = ({
  alert,
  user,
  fetchUnitColorSubcat,
  dataLoading,
  subCatList,
  colorsList,
  measurementsList,
  itemsList,
  itemid,
  updateItems,
  close
}) => {
  const [subCat, setSubCat] = useState(null)
  const [measurement, setMeasurement] = useState(null)
  const [inclusiveGst, setInclusiveGst] = useState(true)
  const [isUniform, setisUniform] = useState(false)
  const [selectedGender, setSelectedGender] = useState(null)
  const [soldAlone, setSoldAlone] = useState(false)
  const [color, setColor] = useState(null)
  const [itemName, setItemName] = useState(null)
  const [description, setDescription] = useState(null)
  const [sku, setSku] = useState(null)
  const [bar, setBar] = useState(null)
  const [sac, setSac] = useState(null)
  const [sale, setSale] = useState(null)
  const [tax, setTax] = useState(null)
  const [gst, setGst] = useState(null)
  const [compulsoryValue, setCompulsoryValue] = useState(null)
  const [isDelivery, setIsDelivery] = useState(false)
  // const [isBundled, setIsBundled] = useState(false)

  // const itemName = useRef()
  // const descriptionRef = useRef()
  // const skuRef = useRef()
  // const barRef = useRef()
  // const sacRef = useRef()
  // const saleRef = useRef()
  // const taxRef = useRef()
  // const gstRef = useRef()

  // const dispatch = useDispatch()

  // const itemsList = useSelector(state =>
  //   state.inventory.storeAdmin.schoolStore.itemsList, shallowEqual
  // )

  useEffect(() => {
    fetchUnitColorSubcat(alert, user)
    // dispatch(actionTypes.listUnitColorSubCat({ alert, user }))
  }, [alert, user, fetchUnitColorSubcat])

  useEffect(() => {
    if (itemsList && itemsList.length > 0) {
      const data = itemsList.filter(ele => ele.id === itemid)[0]
      const storeSub = {
        value: data.store_sub_category && data.store_sub_category.id,
        label: data.store_sub_category && data.store_sub_category.sub_category_name
      }
      const measure = {
        value: data.unit_of_measurement && data.unit_of_measurement.id,
        label: data.unit_of_measurement && data.unit_of_measurement.unit
      }
      const selgender = GENDER.filter(ele => +ele.id === +data.gender)[0]
      const selectedGender = {
        value: selgender.id,
        label: selgender.gender
      }
      const color = {
        value: data.color && data.color.id,
        label: data.color && data.color.color_name
      }
      const compulsory = {
        label: data.item_compulsory === '1' ? 'Compulsory only for New Students' : data.item_compulsory === '2' ? 'Compulsory only for Old Students' : data.item_compulsory === '3' ? 'Not Compulsory for Both' : 'Compulsory for Both',
        value: +data.item_compulsory
      }
      setSubCat(storeSub || '')
      setItemName(data.item_name ? data.item_name : '')
      setDescription(data.item_description ? data.item_description : '')
      setSku(data.sku_code ? data.sku_code : '')
      setBar(data.barcode ? data.barcode : '')
      setSac(data.sac_code ? data.sac_code : '')
      setMeasurement(measure || '')
      setSale(data.sale_price ? data.sale_price : '')
      setTax(data.tax_code ? data.tax_code : '')
      setGst(data.final_price_after_gst ? data.final_price_after_gst : '')
      setSoldAlone(data.can_be_sold_alone_to_all ? data.can_be_sold_alone_to_all : false)
      setisUniform(data.is_uniform_item ? data.is_uniform_item : false)
      setInclusiveGst(data.is_price_inclusive_of_gst ? data.is_price_inclusive_of_gst : false)
      setSelectedGender(selectedGender || '')
      setColor(color || '')
      setCompulsoryValue(compulsory || '')
      setIsDelivery(data.is_delivery_item ? data.is_delivery_item : false)
      // setIsBundled(data.is_bundled ? data.is_bundled : false)
    }
  }, [itemsList, itemid])

  const inputChangeHandler = (name, e) => {
    switch (name) {
      case 'sub_category' : {
        setSubCat(e)
        break
      }
      case 'item_name' : {
        setItemName(e.target.value)
        break
      }
      case 'item_description' : {
        setDescription(e.target.value)
        break
      }
      case 'sku' : {
        setSku(e.target.value)
        break
      }
      case 'bar' : {
        setBar(e.target.value)
        break
      }
      case 'sac' : {
        setSac(e.target.value)
        break
      }
      case 'unit_measurement' : {
        setMeasurement(e)
        break
      }
      case 'sale' : {
        setSale(e.target.value)
        break
      }
      case 'tax' : {
        setTax(e.target.value)
        break
      }
      case 'final_price' : {
        setGst(e.target.value)
        break
      }
      case 'selling_price' : {
        setInclusiveGst(e.target.checked)
        break
      }
      case 'is_uniform' : {
        setisUniform(e.target.checked)
        break
      }
      case 'sold_alone' : {
        setSoldAlone(e.target.checked)
        break
      }
      case 'gender' : {
        setSelectedGender(e)
        break
      }
      case 'color' : {
        setColor(e)
        break
      }
      default: {
        console.log('Default Case')
        break
      }
    }
  }

  const compulsoryHandler = (e) => {
    setCompulsoryValue(e)
  }

  const deliveryChangeHandler = (e) => {
    if (e.target.checked) {
      setIsDelivery(e.target.checked)
      setisUniform(false)
    } else {
      setIsDelivery(e.target.checked)
    }
  }

  // const bundleHandler = () => {
  //   setIsBundled(!isBundled)
  // }

  // const subCatChangeHandler = (e) => {
  //   setSubCat(e)
  // }

  // const measurementChangeHandler = (e) => {
  //   setMeasurement(e)
  // }

  // const inclusiveGstChangeHandler = (e) => {
  //   setInclusiveGst(e.target.checked)
  // }

  // const uniformChangeHandler = (e) => {
  //   setisUniform(e.target.checked)
  // }

  // const genderChangeHandler = (e) => {
  //   setSelectedGender(e)
  // }

  // const canSoldAloneChangeHandler = (e) => {
  //   setSoldAlone(e.target.checked)
  // }

  // const colorChangeHandler = (e) => {
  //   setColor(e)
  // }

  // const itemNameChangeHandler = (e) => {
  //   setItemName(e.target.value)
  // }

  // const descriptionChangeHandler = (e) => {
  //   setDescription(e.target.value)
  // }

  // const skuChangeHandler = (e) => {
  //   setSku(e.target.value)
  // }

  // const barChangeHandler = (e) => {
  //   setBar(e.target.value)
  // }

  // const sacChangeHandler = (e) => {
  //   setSac(e.target.value)
  // }

  // const saleChangeHandler = (e) => {
  //   setSale(e.target.value)
  // }

  // const taxChangeHandler = (e) => {
  //   setTax(e.target.value)
  // }

  // const gstChangeHandler = (e) => {
  //   setGst(e.target.value)
  // }

  const updateItemsHandler = () => {
    const data = {
      id: itemid,
      store_sub_category: subCat.value,
      item_name: itemName,
      item_description: description,
      sku_code: sku,
      sac_code: sac,
      barcode: bar,
      unit_of_measurement: measurement.value,
      sale_price: sale,
      tax_code: tax,
      final_price_after_gst: inclusiveGst ? sale : gst,
      is_price_inclusive_of_gst: inclusiveGst,
      is_uniform_item: isUniform,
      can_be_sold_alone_to_all: soldAlone,
      gender: selectedGender.value,
      color: color.value,
      is_delivery_item: isDelivery,
      item_compulsory: compulsoryValue && compulsoryValue.value
      // is_bundled: isBundled
    }
    updateItems(data, alert, user)
    close()
  }

  return (
    <React.Fragment>
      <h3 style={modalHeadStyle}>Add Items</h3>
      <hr />
      <Grid container justify='center' alignItems='center' style={{ padding: '5px 15px' }}>
        <Grid item xs={4}>
          <label style={{ fontWeight: '20' }}>Store Sub Category*</label>
          <Select
            placeholder='Sub Category'
            style={{ width: '90%' }}
            value={subCat || ''}
            options={
              subCatList && subCatList.length
                ? subCatList.map(list => ({ value: list.id, label: list.sub_category_name })
                ) : []}
            onChange={(e) => inputChangeHandler('sub_category', e)}
          />
        </Grid>
        {/* <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isBundled}
                onChange={bundleHandler}
                value='isBundled'
                color='primary'
              />
            }
            label='Is Bundled?'
          />
        </Grid> */}
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20', width: '100%' }}>Item Name*</label>
          <input
            type='text'
            style={{ ...inputStyle, width: '90%' }}
            placeholder='Enter Item Name'
            value={itemName || ''}
            onChange={(e) => inputChangeHandler('item_name', e)} />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Item Description</label>
          <input
            type='text'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Enter Item Description'
            value={description || ''}
            onChange={(e) => inputChangeHandler('item_description', e)} />
        </Grid>
      </Grid>
      <Grid container justify='center' alignItems='center' style={{ padding: '5px 15px' }}>
        <Grid item xs={4}>
          <label style={{ fontWeight: '20' }}>Enter SKU Code</label>
          <input
            type='text'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Enter SKU Code'
            value={sku || ''}
            onChange={(e) => inputChangeHandler('sku', e)} />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Enter Bar Code</label>
          <input
            type='text'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Enter Bar Code'
            value={bar || ''}
            onChange={(e) => inputChangeHandler('bar', e)}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Enter SAC Code</label>
          <input
            type='text'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Enter SAC Code'
            value={sac || ''}
            onChange={(e) => inputChangeHandler('sac', e)}
          />
        </Grid>
      </Grid>
      <Grid container justify='center' alignItems='center' style={{ padding: '5px 15px' }}>
        <Grid item xs={4}>
          <label style={{ fontWeight: '20' }}>Unit Of Measurement*</label>
          <Select
            placeholder='Measurement'
            value={measurement || ''}
            options={
              measurementsList && measurementsList.length
                ? measurementsList.map(list => ({ value: list.id, label: list.unit })
                ) : []}
            onChange={(e) => inputChangeHandler('unit_measurement', e)}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Sale Price*</label>
          <input
            type='number'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Sale Price'
            value={sale || ''}
            onChange={(e) => inputChangeHandler('sale', e)}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Tax %</label>
          <input
            type='number'
            style={{ ...inputStyle, width: '100%' }}
            placeholder='Tax Percent'
            value={tax || ''}
            onChange={(e) => inputChangeHandler('tax', e)}
          />
        </Grid>
      </Grid>
      <Grid container justify='center' alignItems='center' style={{ padding: '5px 15px' }}>
        <Grid item xs={4}>
          <label style={{ fontWeight: '20' }}>Price (GST Inc)</label>
          <input type='number' style={{ ...inputStyle, width: '100%' }}
            placeholder='Final Price'
            value={gst || ''}
            onChange={(e) => inputChangeHandler('final_price', e)}
            disabled={inclusiveGst} />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={inclusiveGst}
                onChange={(e) => inputChangeHandler('selling_price', e)}
                value='inclusiveGST'
                color='primary'
              />
            }
            label='Selling Price Inclusive Of GST'
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isUniform}
                onChange={(e) => inputChangeHandler('is_uniform', e)}
                value='isUniform'
                color='primary'
                disabled={isDelivery}
              />
            }
            label='Is Uniform'
          />
        </Grid>
      </Grid>
      <Grid container justify='center' alignItems='center' style={{ padding: '5px 15px' }}>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={soldAlone}
                onChange={(e) => inputChangeHandler('sold_alone', e)}
                value='canSoldAlone'
                color='primary'
              />
            }
            label='Can be Sold Alone'
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={isDelivery}
                onChange={deliveryChangeHandler}
                value='isDelivery'
                color='primary'
              />
            }
            label='Delivery Charge'
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Gender*</label>
          <Select
            placeholder='Gender'
            value={selectedGender || ''}
            options={
              GENDER.map(gender => ({ value: gender.id, label: gender.gender })
              )}
            onChange={(e) => inputChangeHandler('gender', e)}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Color</label>
          <Select
            placeholder='Color'
            value={color || ''}
            options={
              colorsList && colorsList.length > 0 ? colorsList.map(list => ({ value: list.id, label: list.color_name })
              ) : []}
            onChange={(e) => inputChangeHandler('color', e)}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: '40px' }}>
          <label style={{ fontWeight: '20' }}>Is Compulsory*</label>
          <Select
            placeholder='Is Compulsory'
            value={compulsoryValue || null}
            options={[
              {
                label: 'Compulsory only for New Students',
                value: 1
              },
              {
                label: 'Compulsory only for Old Students',
                value: 2
              },
              {
                label: 'Not Compulsory for Both',
                value: 3
              },
              {
                label: 'Compulsory for Both',
                value: 4
              }
            ]}
            // onChange={(e) => { compulsoryHandler(e) }}
            onChange={compulsoryHandler}
          />
        </Grid>
      </Grid>
      <div style={{ margin: '20px 5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span>
          <Button
            variant='outlined'
            color='primary'
            size='large'
            onClick={updateItemsHandler}
          >
            Update
          </Button>
        </span>
      </div>
      {/* {dataLoading ? <CircularProgress open /> : null} */}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  colorsList: state.inventory.storeAdmin.schoolStore.colorsList,
  measurementsList: state.inventory.storeAdmin.schoolStore.measurementsList,
  subCatList: state.inventory.storeAdmin.schoolStore.storeSubCat,
  itemsList: state.inventory.storeAdmin.schoolStore.itemsList
})

const mapDispatchToProps = (dispatch) => ({
  createMeasurement: (unit, alert, user) => dispatch(actionTypes.createMeasurement({ unit, alert, user })),
  fetchUnitColorSubcat: (alert, user) => dispatch(actionTypes.listUnitColorSubCat({ alert, user })),
  fetchItems: (session, branch, grade, alert, user) => dispatch(actionTypes.listItems({ session, branch, grade, alert, user })),
  updateItems: (data, alert, user) => dispatch(actionTypes.updateAddItems({ data, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditAddItems)
