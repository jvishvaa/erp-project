import { apiConstants } from '../_constants'

export function questionLevel (state = {}, action) {
  switch (action.type) {
    case apiConstants.QUESTIONLEVEL_REQUEST:
      return {
        loading: true
      }
    case apiConstants.QUESTIONLEVEL_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.QUESTIONLEVEL_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
