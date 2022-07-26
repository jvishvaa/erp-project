export default class Auth {
    constructor () {
      this.logout = this.logout.bind(this)
      this.isAuthenticated = this.isAuthenticated.bind(this)
    }
  
    setSession (authResult) {      
      localStorage.removeItem('userDetails')
      localStorage.setItem('userDetails', JSON.stringify(authResult)) 
    }
  
    updateUserDetails(newDetails){
      localStorage.removeItem('userDetails')
      localStorage.setItem('userDetails', JSON.stringify(newDetails))
    }
  
    logout () {  
      localStorage.removeItem('userDetails')
      localStorage.removeItem('expires_at')
      window.location.replace('/')
    }
  
    isAuthenticated () {     
      let userProfile
      try {
        userProfile = JSON.parse(localStorage.getItem('userDetails'))
        return userProfile
      } catch {
        return undefined
      }
    }
  }