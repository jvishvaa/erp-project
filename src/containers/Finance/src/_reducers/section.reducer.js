import { apiConstants } from '../_constants'

export function sections (state = {}, action) {
  switch (action.type) {
    case apiConstants.SECTION_REQUEST:
      return {
        loading: true
      }
    case apiConstants.SECTION_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.SECTION_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
