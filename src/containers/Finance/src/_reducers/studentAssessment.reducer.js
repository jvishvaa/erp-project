import { apiConstants } from '../_constants'

export function studentAssessment (state = {}, action) {
  switch (action.type) {
    case apiConstants.STUDENTASSESSMENT_REQUEST:
      return {
        loading: true
      }
    case apiConstants.STUDENTASSESSMENT_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.STUDENTASSESSMENT_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
