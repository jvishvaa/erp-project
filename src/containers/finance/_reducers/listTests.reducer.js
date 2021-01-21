import { apiConstants } from '../_constants'

export function listTests (state = {}, action) {
  switch (action.type) {
    case apiConstants.LISTTESTS_REQUEST : return { loading: true }
    case apiConstants.LISTTESTS_SUCCESS : return { ...state, loading: false, items: action.data, isFailed: false }
    case apiConstants.LISTTESTS_FAILURE: return { error: action.error, isFailed: true }
    default : return state
  }
}
