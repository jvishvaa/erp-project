import { apiConstants } from '../_constants'

export function listGradeCategoryId (state = {}, action) {
  switch (action.type) {
    case apiConstants.LISTGRADECATEGORYID_REQUEST:
      return {
        loading: true
      }
    case apiConstants.LISTGRADECATEGORYID_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        items: action.data
      })
    case apiConstants.LISTGRADECATEGORYID_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
