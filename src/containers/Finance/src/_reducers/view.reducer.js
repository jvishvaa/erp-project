export function view (state = { sidebar: false, withoutBase: false }, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        sidebar: !state.sidebar,
        title: state.title,
        withoutBase: state.withoutBase
      }
    case 'CHANGE_PATH':
      return {
        sidebar: state.sidebar,
        title: action.title,
        path: action.path,
        withoutBase: Boolean(action.withoutBase)
      }
    default:
      return state
  }
}
