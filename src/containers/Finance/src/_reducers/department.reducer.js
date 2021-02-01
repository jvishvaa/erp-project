import { apiConstants } from '../_constants'

export function department (state = {}, action) {
  switch (action.type) {
    case apiConstants.DEPARTMENT_REQUEST:
      return {
        loading: true
      }
    case apiConstants.DEPARTMENT_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.DEPARTMENT_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
