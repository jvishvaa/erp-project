import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const FEE_TYPES_PER_TYPES = 'FEE_TYPES_PER_TYPES'
export const GET_FEE_ACCOUNT_PER_BRANCH = 'GET_FEE_ACCOUNT_PER_BRANCH'

// action creators
export const fetchFeeTypesPerType = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FeeTypesPerType + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&type=' + payload.feeId, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_TYPES_PER_TYPES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to fetch fee types for this branch')
        console.log(error)
      })
  }
}

export const fetchFeeAccountsReceiptBook = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.GetFeeAccountsPerBranch + '?academic_year=' + payload.session + '&branch=' + payload.branch + '&types=' + payload.types + '&fee_types=' + payload.feetypes, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: GET_FEE_ACCOUNT_PER_BRANCH,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}
