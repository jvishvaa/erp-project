import { apiConstants } from '../_constants'

export function student (state = {}, action) {
  switch (action.type) {
    case apiConstants.STUDENTS_REQUEST:
      return {
        loading: true
      }
    case apiConstants.STUDENTS_SUCCESS:
      return {
        loading: false,
        success: action.data.result,
        totalPages: action.data.totalPages
      }
    case apiConstants.STUDENTS_FAILURE:
      return {
        error: action.error,
        response: action
      }
    case apiConstants.STUDENTS_ERROR_RESET:
      return {
        error: '',
        success: ''
      }
    default:
      return state
  }
}
