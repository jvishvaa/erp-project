export function updateLocation (url) {
  const state = {}
  const title = 'Homeworks'
  window.history.pushState(state, title, url)
}
