import axios from 'axios'
import { store } from '../_helpers'

export const viewActions = {
  toggleSidebar,
  changePath
}

function toggleSidebar () {
  if (document.documentElement.clientWidth > 600) {
    if (store.getState().view.sidebar) {
      document.getElementById('content').style.maxWidth = `calc(100vw - 112px)`
    } else {
      document.getElementById('content').style.maxWidth = `calc(100vw - 288px)`
    }
  }
  // else {
  //   document.getElementById('content').style.maxWidth = `calc(100vw - 48px)`
  // }
  return { type: 'TOGGLE_SIDEBAR' }
}

function changePath (title, path, withoutBase) {
  axios.Cancel()
  return { type: 'CHANGE_PATH', title, path, withoutBase }
}
