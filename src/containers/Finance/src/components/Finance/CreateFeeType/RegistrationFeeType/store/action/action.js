import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const REGISTRATION_APPLICATION_FEE_TYPE_LIST = 'REGISTRATION_APPLICATION_FEE_TYPE_LIST'
export const UPDATE_REGISTRATION_FEE_TYPES = 'UPDATE_REGISTRATION_FEE_TYPES'
export const ADD_REGISTRATION_FEE_TYPES = 'ADD_REGISTRATION_FEE_TYPES'
export const DELETE_REGISTRATION_FEE_TYPES = 'DELETE_REGISTRATION_FEE_TYPES'
export const REMAINING_BRANCHES_PER_TYPE = 'REMAINING_BRANCHES_PER_TYPE'

// action creators
export const fetchListRegistrationFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.RegistrationFeeTypeList + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&type=' + payload.type, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: REGISTRATION_APPLICATION_FEE_TYPE_LIST,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unale to load data')
        console.log(error)
      })
  }
}

export const updateRegistrationFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .put(urls.RegistrationFeeTypeList + payload.id, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: UPDATE_REGISTRATION_FEE_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Updated Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unale to load data')
        console.log(error)
      })
  }
}

export const addRegistrationFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.AddRegtAndAppFeetype, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (response.status === 201) {
          // payload.alert.success('Added Successfully!')
          dispatch({
            type: ADD_REGISTRATION_FEE_TYPES,
            payload: {
              data: response.data
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to add')
        console.log(error)
      })
  }
}

export const deleteRegistrationFeeType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .delete(urls.RegistrationFeeTypeList + payload.id, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        console.log(response)
        dispatch({
          type: DELETE_REGISTRATION_FEE_TYPES,
          payload: {
            id: payload.id
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Deleted Successfully')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unale to load data')
        console.log(error)
      })
  }
}

export const fetchRemainingBranchesPerType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.RemainingBranchesPerType + '?academic_year=' + payload.session + '&type=' + payload.type, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: REMAINING_BRANCHES_PER_TYPE,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unale to load data')
        console.log(error)
      })
  }
}
