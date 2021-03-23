import { apiConstants } from '../_constants'

export function onlineTest (state = {}, action) {
  switch (action.type) {
    case apiConstants.GETONLINETEST_REQUEST : return { loading: true }
    case apiConstants.GETONLINETEST_SUCCESS : return { ...state, loading: false, items: action.data }
    case apiConstants.GETONLINETEST_FAILURE: return { error: action.error }
    default : return state
  }
}
