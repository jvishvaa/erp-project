class SessionStorageHandler {
  constructor (key) {
    this.key = key || ''
    this.eduvateStore = this.eduvateStore.bind(this)
    this.store = this.store.bind(this)
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.clear = this.clear.bind(this)
    this.getloginUserRole = this.getloginUserRole.bind(this)
    this.handleRole = this.handleRole.bind(this)
    this.getsessionRole = this.getsessionRole.bind(this)
    this.handleRole()
  }
  handleRole () {
    if (this.getsessionRole() !== this.getloginUserRole()) this.clear()
  }
  getsessionRole () {
    let eduvateStore = this.eduvateStore()
    return eduvateStore['role']
  }
  getloginUserRole () {
    const userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    const { personal_info: { role } = {} } = userProfile
    return role
  }
  eduvateStore () {
    return JSON.parse(window.sessionStorage.getItem('eduvate')) || {}
  }
  store (data = {}) {
    Object.assign(data, { role: this.getloginUserRole() })
    window.sessionStorage.setItem('eduvate', JSON.stringify(data))
  }
  get (key = this.key) {
    let eduvateStore = this.eduvateStore()
    return eduvateStore[key]
  }
  set (data, key = this.key) {
    let eduvateStore = this.eduvateStore()
    eduvateStore[key] = data
    this.store(eduvateStore)
  }
  clear () {
    this.store({})
  }
}
export default SessionStorageHandler
