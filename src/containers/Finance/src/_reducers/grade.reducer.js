import { apiConstants } from '../_constants'

export function grades (state = {}, action) {
  switch (action.type) {
    case apiConstants.GRADE_REQUEST:
      return {
        loading: true
      }
    case apiConstants.GRADE_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.GRADE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
