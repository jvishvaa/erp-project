import { apiConstants } from '../_constants'

export function staffs (state = {}, action) {
  switch (action.type) {
    case apiConstants.STAFF_REQUEST:
      return {
        loading: true
      }
    case apiConstants.STAFF_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        [action.branchId]: action.data.result,
        currentPage: action.data.current_page,
        totalPages: action.data.total_pages
      })

    case apiConstants.STAFF_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
