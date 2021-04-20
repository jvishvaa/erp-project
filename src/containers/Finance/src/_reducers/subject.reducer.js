import { apiConstants } from '../_constants'

export function subjects (state = {}, action) {
  switch (action.type) {
    case apiConstants.SUBJECT_REQUEST:
      return {
        loading: true
      }
    case apiConstants.SUBJECT_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.SUBJECT_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
