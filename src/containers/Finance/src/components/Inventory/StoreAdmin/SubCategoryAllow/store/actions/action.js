import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

export const FETCH_SUB_CATEGORY = 'FETCH_SUB_CATEGORY'
export const CREATE_SUB_CATEGORY = 'CREATE_SUB_CATEGORY'

export const fetchSubCategory = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListSubCategory + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&grade=' + payload.grade, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        if (response && response.data.length <= 0) {
          payload.alert.warning('Please Create Sub-Category to View Sub-Category!')
        }
      }
      dispatch({
        type: FETCH_SUB_CATEGORY,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const createSubCategory = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreatSubCategort, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 200) {
        payload.alert.success('Updated successfully!')
        dispatch({
          type: CREATE_SUB_CATEGORY,
          payload: {
            data1: response.data
          }
        })
      } else if (+response.status === 201) {
        payload.alert.success('Created successfully!')
        dispatch({
          type: CREATE_SUB_CATEGORY,
          payload: {
            data: response.data
          }
        })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
