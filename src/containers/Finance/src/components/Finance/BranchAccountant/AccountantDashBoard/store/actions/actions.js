import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

// action types
export const GET_POST_DATE_COUNT = 'GET_POST_DATE_COUNT'
export const FETCH_RECENT_CHEQUES = 'FETCH_RECENT_CHEQUES'
export const FETCH_ACCOUNTANT_BRANCH = Symbol('FETCH_ACCOUNTANT_BRANCH')
export const FETCH_BRANCH = Symbol('FETCH_BRANCH')
export const SWITCH_BRANCH = Symbol('SWITCH_BRANCH')
export const CHECK_RETURN = Symbol('CHECK_RETURN')
export const RETURN_ADMIN = Symbol('RETURN_ADMIN')

// action creators
export const fetchPostDateCount = (payload) => {
  return (dispatch) => {
    // console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ChequePaymentPostCount + '?academic_year=' + '2019-20', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: GET_POST_DATE_COUNT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load dashboard data')
      })
  }
}

export const fetchRecentDated = (payload) => {
  return (dispatch) => {
    // console.log(payload)
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ChequePaymentPost + '?academic_year=' + '2019-20', {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_RECENT_CHEQUES,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        console.log(error)
        // payload.alert.warning('Unable to load dashboard data')
      })
  }
}

export const fetchBranch = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListApplicableBranches, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: FETCH_BRANCH,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Cannot Fetch Applicable Branches')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const checkReturn = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.CheckReturn, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: CHECK_RETURN,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('SomeThing Went Wrong!!!')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const switchBranch = (payload) => {
  const body = {
    'to_branch': payload.value
  }
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.ChangeAccBranch, body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: SWITCH_BRANCH,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Something went wrong.')
      console.log(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const returnAdmin = (payload) => {
  const data = {
    'to_branch': 23
  }
  return (dispatch) => {
    axios.put(urls.AdminReturn, data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: RETURN_ADMIN,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Cannot Fetch Branch')
      console.error(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchAccountantBranch = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.FetchAccountantBranch, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(res => {
      dispatch({
        type: FETCH_ACCOUNTANT_BRANCH,
        payload: {
          data: res.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Cannot Fetch Branch')
      console.error(err)
      dispatch(actionTypes.dataLoaded())
    })
  }
}
