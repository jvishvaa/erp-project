export function authHeader () {
  // return authorization header with jwt token
  let idToken = JSON.parse(localStorage.getItem('userDetails'))

  if (idToken) {
    return { 'Authorization': 'Bearer ' + idToken.token }
  } else {
    return {}
  }
}
