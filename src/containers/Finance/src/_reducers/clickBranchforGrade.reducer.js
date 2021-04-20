import { apiConstants } from '../_constants'

export function clickBranchforGrade (state = {}, action) {
  switch (action.type) {
    case apiConstants.GRADE_FROM_BRANCH_REQUEST:
      return {
        loading: true
      }
    case apiConstants.GRADE_FROM_BRANCH_SUCCESS:
    // console.log('inside reducer',action);
      return Object.assign({}, state, {
        loading: false,
        items: action.data
      })
    case apiConstants.GRADE_FROM_BRANCH_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
