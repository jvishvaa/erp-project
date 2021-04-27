import { apiConstants } from '../_constants'

export function smsTypes (state = {}, action) {
  switch (action.type) {
    case apiConstants.SMSTYPES_REQUEST:
      return {
        loading: true
      }
    case apiConstants.SMSTYPES_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.SMSTYPES_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
