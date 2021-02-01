import axios from 'axios'
import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// action types
export const LIST_FEE_TYPE = 'LIST_FEE_TYPE'
export const ADD_LIST_FEE_TYPE = 'ADD_LIST_FEE_TYPE'
export const CONCESSION_FEE_TYPE_PER_FEE_TYPE = 'CONCESSION_FEE_TYPE_PER_FEE_TYPE'
export const LIST_CONCESSION_SETTINGS = 'LIST_CONCESSION_SETTINGS'
export const UPDATE_LIST_CONCESSION_SETTINGS = 'UPDATE_LIST_CONCESSION_SETTINGS'
export const LIST_CONCESSION_TYPES = 'LIST_CONCESSION_TYPES'
export const ADD_LIST_CONCESSION_SETTINGS = 'ADD_LIST_CONCESSION_SETTINGS'
export const ADD_CONCESSION_TYPES = 'ADD_CONCESSION_TYPES'

// action creators
export const fetchListConcessionSettings = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ConcessionDetails, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_CONCESSION_SETTINGS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const updateListConcessionSettings = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.ConcessionFeeTypes, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_LIST_CONCESSION_SETTINGS,
          payload: {
            data: response.data
          }
        })
        // payload.alert.success('Updated Successfully')
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const addConcessionTypes = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddConcessionType, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_CONCESSION_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const addListConcessionSettings = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ConcessionFeeTypes, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_LIST_CONCESSION_SETTINGS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Added Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}

export const fetchListConcessionTypes = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ConcessionFeeTypes, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_CONCESSION_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const fetchListFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetManageFees + '?concession_id=' + payload.concessionId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: LIST_FEE_TYPE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const addListFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.AddFeeTypesAccountant, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: ADD_LIST_FEE_TYPE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Added SuccessFully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something went wrong')
        console.log(error)
      })
  }
}

export const fetchConcessionFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.concessionFeeType + '?id=' + payload.feeTypeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CONCESSION_FEE_TYPE_PER_FEE_TYPE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}
