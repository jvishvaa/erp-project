import { userConstants } from '../_constants'

let user = localStorage.getItem('id_token')
const initialState = user ? { loggedIn: true, user } : { loggedIn: false, user: null }

export function authentication (state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      }
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      }
    case userConstants.LOGIN_FAILURE:
      return {
        error: action.error
      }
    case userConstants.LOGOUT:
      return {}
    default:
      return state
  }
}
