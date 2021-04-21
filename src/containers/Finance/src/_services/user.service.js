// import Dexie from 'dexie'
import { urls } from '../urls'

/* global fetch */

export const userService = {
  login,
  logout
}

function login (username, password, webLink) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: webLink === 'www.alwaysonlearning.com' || webLink === 'alwaysonlearning.com' || webLink === 'dev.alwaysonlearning.com' ? JSON.stringify({ username, password, source: 'aol' }) : JSON.stringify({ username, password })
  }

  return fetch(urls.LOGIN, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.personal_info && user.personal_info.token) {
        if (user.personal_info.role === 'Parent') {
          localStorage.setItem('user_profile', JSON.stringify({ personal_info: user.personal_info }))
          localStorage.setItem('parent_profile', JSON.stringify(user))
          localStorage.setItem('id_token', user.personal_info.token)
          window.location.reload()
          return user.personal_info.token
        }
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user_profile', JSON.stringify(user))
        localStorage.setItem('id_token', user.personal_info.token)
        window.location.reload()
        return user.personal_info.token
      }
    })
}

function logout () {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  // remove user from local storage to log user out
  localStorage.removeItem('user_profile')
  localStorage.removeItem('discussion_form_Login')
  localStorage.removeItem('id_token')
  localStorage.removeItem('parent_profile')
  localStorage.removeItem('ps_revision')
  // eslint-disable-next-line no-undef
  sessionStorage.removeItem('activeStep')
  // eslint-disable-next-line no-undef
  sessionStorage.removeItem('detailedObj')
  // Dexie.delete('PSDB')
  fetch(urls.LOGOUT, requestOptions)
  window.location = window.location.origin
}

function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const error = (data && (data.message || data.status)) || response.statusText
      return Promise.reject(error)
    }
    if (response.status === 211) {
      const error = (data && (data.message || data.status)) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
