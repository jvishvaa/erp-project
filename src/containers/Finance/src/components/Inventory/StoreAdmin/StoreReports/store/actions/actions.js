import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const FETCH_STORE_REPORT = 'FETCH_STORE_REPORT'
export const BRANCHS_LISTS = 'BRANCHS_LISTS'
// export const LIST_KIT_WISE_ITEMS = 'LIST_KIT_WISE_ITEMS'

// action-creator
export const fetchStoreReport = (payload) => {
  const {
    session,
    branch,
    date,
    startDate,
    endDate,
    wise,
    dateWise,
    alert,
    user
  } = payload
  let storeUrl = null
  if (date.value === 4) {
    storeUrl = `${urls.StoreReport}?session_year=${session.value}&branch=${branch.value}&date=${date.value}&from_date=${startDate}&to_date=${endDate}&type=${wise.value}&formats=${dateWise.value}`
  } else {
    storeUrl = `${urls.StoreReport}?session_year=${session.value}&branch=${branch.value}&date=${date.value}&type=${wise.value}&formats=${dateWise.value}`
  }
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(storeUrl, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(response => {
      dispatch({
        type: FETCH_STORE_REPORT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      alert.warning('Unable to fetch report!')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchBranchLists = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.BranchList}?session_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: BRANCHS_LISTS,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err.message)
      dispatch(actionTypes.dataLoaded())
      payload.alert.warning('Unable to Edit')
    })
  }
}
