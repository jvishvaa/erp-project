import { apiConstants } from '../_constants'

export function academicSession (state = {}, action) {
  switch (action.type) {
    case apiConstants.ACADEMICSESSION_REQUEST:
      return {
        loading: true
      }
    case apiConstants.ACADEMICSESSION_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.ACADEMICSESSION_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
