import { apiConstants } from '../_constants'

export function designations (state = {}, action) {
  switch (action.type) {
    case apiConstants.DESIGNATION_REQUEST:
      return {
        loading: true
      }
    case apiConstants.DESIGNATION_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.DESIGNATION_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
