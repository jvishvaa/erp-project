// import { handle } from 'redux-pack'
// import { apiConstants } from '../_constants'

// export function studentSearch (state = {}, action) {
//   const { type, payload } = action
//   switch (type) {
//     case apiConstants.STUDENT_SEARCH:
//       return handle(state, action, {
//         start: prevState => ({
//           ...prevState,
//           loading: true,
//           search_result: [],
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
