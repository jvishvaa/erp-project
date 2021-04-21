import { filterConstants } from '../_constants'

export function filter (state = { apply_all: false }, action) {
  switch (action.type) {
    case filterConstants.UPDATE:
      return state
    case filterConstants.APPLY_ALL:
      return {
        ...state,
        apply_all: !state.apply_all
      }
    case filterConstants.REQUEST:
      return { ...state, data: action.data }
    case filterConstants.CLEAR:
      return {
        ...state,
        type: null,
        message: null
      }
    default:
      return state
  }
}
