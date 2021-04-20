import { apiConstants } from '../_constants'

export function classgrouptypes (state = {}, action) {
  switch (action.type) {
    case apiConstants.CLASSGROUPTYPE_REQUEST:
      return {
        loading: true
      }
    case apiConstants.CLASSGROUPTYPE_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.CLASSGROUPTYPE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
