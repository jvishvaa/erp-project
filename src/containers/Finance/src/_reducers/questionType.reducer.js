import { apiConstants } from '../_constants'

export function questionType (state = {}, action) {
  switch (action.type) {
    case apiConstants.QUESTIONTYPE_REQUEST:
      return {
        loading: true
      }
    case apiConstants.QUESTIONTYPE_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.QUESTIONTYPE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
