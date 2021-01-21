import axios from 'axios'
import * as actionTypes from '../../../store/actions/actions'
import { urls } from '../../../../../urls'

// action types
export const FETCH_TERM_LIST = 'FETCH_TERM_LIST'

// action creators
export const fetchTermList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.TermConditionList + '?academic_year=' + payload.session + '&branch=' + payload.branch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_TERM_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(error => {
      dispatch(actionTypes.dataLoaded())
      console.log(error)
    })
  }
}
