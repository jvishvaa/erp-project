import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const CREATE_MEASUREMENT = 'CREATE_MEASUREMENT'
export const CREATE_COLOR = 'CREATE_COLOR'
export const CREATE_SUBCAT = 'CREATE_SUBCAT'
export const ADD_ITEM = 'ADD_ITEM'
export const LIST_UNIT_COLOR_SUBCAT = 'LIST_UNIT_COLOR_SUBCAT'
export const LIST_ITEMS = 'LIST_ITEMS'
export const UPDATE_ITEMS = 'UPDATE_ITEMS'

// action - creators
export const createMeasurement = (payload) => {
  return (dispatch) => {
    const body = {
      unit: payload.unit
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateMeasurement, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: CREATE_MEASUREMENT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Saved Successfully')
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createColor = (payload) => {
  return (dispatch) => {
    const body = {
      color_name: payload.color
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateColor, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: CREATE_COLOR,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Saved Successfully')
    }).catch(err => {
      console.log('error', err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createSubcat = (payload) => {
  return (dispatch) => {
    const body = {
      sub_category_name: payload.subCatName
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateStoreSubCat, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: CREATE_SUBCAT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Saved Successfully')
    }).catch(err => {
      console.log('error', err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const listUnitColorSubCat = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    const header = {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }
    axios.all([
      axios.get(urls.ListMeasurement, header),
      axios.get(urls.ListColor, header),
      axios.get(urls.ListStoreSubCat, header)
    ]).then(axios.spread((measurement, color, subCat) => {
      dispatch({
        type: LIST_UNIT_COLOR_SUBCAT,
        payload: {
          color: color.data,
          measurement: measurement.data,
          subCat: subCat.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    })).catch(err => {
      console.log(err)
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const addItem = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const body = {
      academic_year: payload.currentSession,
      branch: payload.currentBranch.id,
      item_name: payload.itemName,
      item_description: payload.itemDesc,
      sku_code: payload.skuCode,
      barcode: payload.barCode,
      sac_code: payload.sacCode,
      store_sub_category: { ...payload.subCat },
      store_item_category: payload.currentGrade.id,
      color: payload.color,
      is_language_subject_textbook: payload.isDelivery ? payload.isUniform : !payload.isUniform,
      is_uniform_item: payload.isUniform,
      gender: payload.selectedGender.id,
      upload_image: null,
      sale_price: payload.salePrice,
      unit_of_measurement: { ...payload.measurement },
      tax_code: payload.taxCode,
      is_price_inclusive_of_gst: payload.inclusiveGst,
      final_price_after_gst: payload.gstPrice,
      can_be_sold_alone_to_all: payload.soldAlone,
      is_delivery_item: payload.isDelivery,
      item_compulsory: payload.compulsoryValue && payload.compulsoryValue.value
      // is_bundled: payload.isBundled
    }
    axios.post(urls.CreateStoreItem, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: ADD_ITEM,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Added Successfully')
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // payload.alert.warning('Something Went Wrong')
    })
  }
}

export const listItems = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.ListStoreItem}?academic_year=${payload.session}&branch_id=${payload.branch.id}&grade_id=${payload.grade.id}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: LIST_ITEMS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const updateAddItems = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateStoreItems, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: UPDATE_ITEMS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      // payload.alert.success('Updated Successfully')
    }).catch(err => {
      console.log(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
