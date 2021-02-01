// import { handle } from 'redux-pack'
// import { apiConstants } from '../_constants'

// export function globalSearchStudent (state = {}, action) {
//   const { type, payload } = action
//   switch (type) {
//     case apiConstants.GLOBAL_SEARCH_STUDENT:
//       return handle(state, action, {
//         start: prevState => ({
//           ...prevState,
//           loading: true,
//           result: [],
//           fooError: null
//         }),
//         finish: prevState => ({ ...prevState, loading: false }),
//         failure: prevState => ({ ...prevState, error: payload }),
//         success: prevState => ({ ...prevState, ...payload, loading: false })
//       })
//     default:
//       return state
//   }
// }
