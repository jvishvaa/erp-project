export function filterIndex (state = { }, action) {
  switch (action.type) {
    case 'UPDATE_INDEX':
      return {
        index: action.data
      }
    default:
      return state
  }
}
