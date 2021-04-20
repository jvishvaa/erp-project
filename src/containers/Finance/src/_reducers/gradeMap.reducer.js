import { apiConstants } from '../_constants'

export function gradeMap (state = {}, action) {
  switch (action.type) {
    case apiConstants.GRADEMAP_REQUEST:
      return {
        loading: true
      }
    case apiConstants.GRADEMAP_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        items: action.data
      })
    case apiConstants.GRADEMAP_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
