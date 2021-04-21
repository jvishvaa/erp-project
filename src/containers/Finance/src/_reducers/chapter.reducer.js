import { apiConstants } from '../_constants'

export function chapter (state = {}, action) {
  switch (action.type) {
    case apiConstants.CHAPTER_REQUEST:
      return {
        loading: true
      }
    case apiConstants.CHAPTER_SUCCESS:
      return {
        items: action.data
      }
    case apiConstants.CHAPTER_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
