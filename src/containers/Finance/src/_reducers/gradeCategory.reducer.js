import { apiConstants } from '../_constants'

export function gradeCategory (state = {}, action) {
  switch (action.type) {
    case apiConstants.GRADECATEGORY_REQUEST:
      return {
        loading: true
      }
    case apiConstants.GRADECATEGORY_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.GRADECATEGORY_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
