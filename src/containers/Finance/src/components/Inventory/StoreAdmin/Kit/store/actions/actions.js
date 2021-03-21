import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const LIST_GRADE_KIT = 'LIST_GRADE_KIT'
export const CREATE_GRADE_KIT = 'CREATE_GRADE_KIT'
export const LIST_COLOR_ITEMS = 'LIST_COLOR_ITEMS'
export const CREATE_COLOR_KIT = 'CREATE_COLOR_KIT'
export const DELETE_GRADE_KIT = 'DELETE_GRADE_KIT'
export const UPDATE_GRADE_KIT = 'UPDATE_GRADE_KIT'
export const BULK_ITEMS_UPLOAD = 'BULK_ITEMS_UPLOAD'
// export const LIST_KIT_WISE_ITEMS = 'LIST_KIT_WISE_ITEMS'

// action-creator
export const listGradeKit = (payload) => {
  const {
    session,
    branch,
    grade,
    // alert,
    user
  } = payload
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.ListKit}?academic_year=${session}&branch_id=${branch.id}&grade_id=${grade.id}`, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: LIST_GRADE_KIT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createGradeKit = (payload) => {
  console.log(payload)
  // debugger;
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    const body = {
      academic_year: payload.currentSession,
      branch: payload.currentBranch.id,
      grade: payload.currentGrade.id,
      is_applicable_to_new_student: payload.isNewStudent,
      is_applicable_to_old_student: payload.isOldStudent,
      is_mandatory: payload.isMandatory,
      is_uniform_kit: payload.isUniform,
      kit_name: payload.kitName,
      kit_description: payload.kitDesc,
      kit_price: payload.kitPrice,
      kit_colour: payload.color ? payload.color.id : null,
      second_language: payload.secondLang ? payload.secondLang.id : null,
      third_language: payload.thirdLang ? payload.thirdLang.id : null,
      items_quantity: payload.items,
      item: payload.itemsId,
      is_common_kit: payload.isCommon,
      common_kit_ids: payload.commonKitIds,
      is_delivery_kit: payload.isDelivery
      // item: payload.finalItemQuantity
    }
    axios.post(urls.CreateKit, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      payload.alert.success('Created Successfully!')
      dispatch({
        type: CREATE_GRADE_KIT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.error('Something went Wrong!')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const updateKits = (payload) => {
  console.log(payload)
  // debugger;
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    const body = {
      academic_year: payload.currentSession,
      branch: payload.currentBranch.id,
      grade: payload.currentGrade.id,
      is_applicable_to_new_student: payload.isNewStudent,
      is_applicable_to_old_student: payload.isOldStudent,
      is_mandatory: payload.isMandatory,
      is_uniform_kit: payload.isUniform,
      kit_name: payload.kitName,
      kit_description: payload.kitDesp,
      kit_price: payload.kitAmount,
      kit_colour: payload.color ? payload.color.id : null,
      second_language: payload.secondLang ? payload.secondLang.id : null,
      third_language: payload.thirdLang ? payload.thirdLang.id : null,
      kit_id: payload.kitId,
      items_quantity: payload.items,
      item: payload.itemsId,
      is_common_kit: payload.isCommon,
      common_kit_ids: payload.commonKitIds,
      is_delivery_kit: payload.isDelivery
      // item: payload.finalItemQuantity
    }
    axios.post(urls.UpdateKitInStore, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      payload.alert.success('Saved!')
      dispatch({
        type: UPDATE_GRADE_KIT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.error('Something went Wrong!')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const listColorItems = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    const header = {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }
    axios.all([
      axios.get(urls.ListColor, header),
      axios.get(`${urls.KitWiseItems}?academic_year=${payload.session}&branch_id=${payload.branch.id}&grade_id=${payload.grade.id}&is_uniform=${payload.isUniform}&is_delivery_item=${payload.isDelivery}`, header)
    ]).then(axios.spread((color, item) => {
      dispatch({
        type: LIST_COLOR_ITEMS,
        payload: {
          color: color.data,
          item: item.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    })).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createColorKit = (payload) => {
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
        type: CREATE_COLOR_KIT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
      payload.alert.success('Saved Successfully')
    }).catch(err => {
      console.log('error', err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const deleteGradeKit = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.delete(`${urls.Store}\\${payload.id}${urls.DeleteKit}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: DELETE_GRADE_KIT,
        id: payload.id
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const bulkItemsUpload = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.post(`${urls.BulkItemsUpload}`, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: BULK_ITEMS_UPLOAD,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
