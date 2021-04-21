import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const PARTY_LIST = 'PARTY_LIST'
export const SAVE_PARTY = 'SAVE_PARTY'
export const EDIT_PARTY = 'EDIT_PARTY'
export const DELETE_PARTY = 'DELETE_PARTY'

export const partyList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListCreateParty + '?branch_id=' + payload.branch, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: PARTY_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // payload.alert.warning('Something Went Wrong')
    })
  }
}

export const saveParty = (payload) => {
  return (dispatch) => {
    const body = {
      party_name: payload.name,
      address_no: payload.address,
      contact_no: payload.contact,
      gstin_no: payload.gst,
      pan_no: payload.pan,
      branch_id: payload.branch
    }
    dispatch(actionTypes.dataLoading())
    axios.post(urls.ListCreateParty, body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 201) {
        // payload.alert.success('Party Added Successfully')
        dispatch({
          type: SAVE_PARTY,
          payload: {
            data: response.data
          }
        })
      } else {
        // payload.alert.warning('Unable To save Party')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // payload.alert.warning('Something Went Wrong')
    })
  }
}

export const editParty = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const body = {
      party_name: payload.name,
      address_no: payload.address,
      contact_no: payload.contact,
      gstin_no: payload.gst,
      pan_no: payload.pan
    }

    axios.put(`${urls.Finance}${payload.id}${urls.UpdateDeleteParty}`, body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 200) {
        // payload.alert.success('Updated Successfully')
        dispatch({
          type: EDIT_PARTY,
          payload: {
            data: response.data
          }
        })
      } else {
        // payload.alert.warning('Unable To Update')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const deleteParty = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const { id } = payload
    axios.delete(`${urls.Finance}${payload.id}${urls.UpdateDeleteParty}`, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      if (+response.status === 204) {
        // payload.alert.success('Deleted Successfully')
        dispatch({
          type: DELETE_PARTY,
          payload: {
            data: id
          }
        })
      } else {
        // payload.alert.warning('Unable To Delete')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      dispatch(actionTypes.dataLoaded())
      // payload.alert.warning('Something Went Wrong')
    })
  }
}
