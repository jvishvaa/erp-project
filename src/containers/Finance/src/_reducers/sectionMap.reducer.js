import { apiConstants } from '../_constants'

export function sectionMap (state = {}, action) {
  switch (action.type) {
    case apiConstants.SECTIONMAP_REQUEST:
      return {
        loading: true
      }
    case apiConstants.SECTIONMAP_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        items: action.data
      })
    case apiConstants.SECTIONMAP_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
