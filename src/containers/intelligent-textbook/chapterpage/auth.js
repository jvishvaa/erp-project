export default class Auth {
    constructor () {
      this.logout = this.logout.bind(this)
      this.isAuthenticated = this.isAuthenticated.bind(this)
    }
  
    setSession (authResult) {
      // Set the time that the access token will expire at
      //const expiresAt = JSON.stringify((authResult.expires_at * 1000) + new Date().getTime())
      localStorage.removeItem('userDetails')
      localStorage.setItem('userDetails', JSON.stringify(authResult))
      //localStorage.setItem('expires_at', expiresAt)
    }
  
    updateUserDetails(newDetails){
      localStorage.removeItem('userDetails')
      localStorage.setItem('userDetails', JSON.stringify(newDetails))
    }
  
    logout () {
      // Clear access token from local storage
      localStorage.removeItem('userDetails')
      localStorage.removeItem('expires_at')
      window.location.replace('/')
    }
  
    isAuthenticated () {
      // Check whether the current time is past the
      // access token's expiry time
      // const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
      // return new Date().getTime() < expiresAt && userProfile
      let userProfile
      try {
        userProfile = JSON.parse(localStorage.getItem('userDetails'))
        return userProfile
      } catch {
        return undefined
      }
    }
  }