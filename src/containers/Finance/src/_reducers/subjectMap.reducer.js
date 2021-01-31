import { apiConstants } from '../_constants'

export function subjectMap (state = {}, action) {
  switch (action.type) {
    case apiConstants.SUBJECTMAP_REQUEST:
      return {
        loading: true
      }
    case apiConstants.SUBJECTMAP_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        items: action.data
      })
    case apiConstants.SUBJECTMAP_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
