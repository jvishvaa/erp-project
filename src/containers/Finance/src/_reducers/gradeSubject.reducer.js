import { apiConstants } from '../_constants'

export function gradeSubject (state = {}, action) {
  switch (action.type) {
    case apiConstants.GRADECHAPTER_REQUEST:
      return {
        loading: true
      }
    case apiConstants.GRADECHAPTER_SUCCESS:
      console.log('grade', action)
      return {
        items: action.data
      }
    case apiConstants.GRADECHAPTER_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
