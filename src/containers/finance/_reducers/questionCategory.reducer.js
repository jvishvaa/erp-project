import { apiConstants } from '../_constants'

export function questionCategory (state = {}, action) {
  switch (action.type) {
    case apiConstants.QUESTIONCATEGORY_REQUEST:
      return {
        loading: true
      }
    case apiConstants.QUESTIONCATEGORY_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.QUESTIONCATEGORY_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
