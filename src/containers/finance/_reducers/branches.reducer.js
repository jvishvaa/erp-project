import { apiConstants } from '../_constants'

export function branches (state = {}, action) {
  switch (action.type) {
    case apiConstants.BRANCH_REQUEST:
      return {
        loading: true
      }
    case apiConstants.BRANCH_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.BRANCH_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
