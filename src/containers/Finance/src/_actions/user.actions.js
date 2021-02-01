import { userConstants } from '../_constants'
import { userService } from '../_services'

export const userActions = {
  login,
  logout
}

function login (username, password, webLink) {
  return dispatch => {
    dispatch(request({ username }))

    userService.login(username, password, webLink)
      .then(
        user => {
          dispatch(success(user))
        },
        error => {
          dispatch(failure(error))
        }
      )
  }

  function request (user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success (user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure (error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout () {
  userService.logout()
  return { type: userConstants.LOGOUT }
}
