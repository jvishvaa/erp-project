import { apiConstants } from '../_constants'

export function roles (state = {}, action) {
  switch (action.type) {
    case apiConstants.ROLE_REQUEST:
      return {
        loading: true
      }
    case apiConstants.ROLE_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.ROLE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
