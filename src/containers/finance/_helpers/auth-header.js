export function authHeader () {
  // return authorization header with jwt token
  let idToken = localStorage.getItem('id_token')

  if (idToken) {
    return { 'Authorization': 'Bearer ' + idToken }
  } else {
    return {}
  }
}
