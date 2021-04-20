// import { handle } from 'redux-pack'
// import { apiConstants } from '../_constants'

// export function globalSearchStaff (state = { data: {} }, action) {
//   const { type, payload } = action
//   switch (type) {
//     case apiConstants.GLOBAL_SEARCH_STAFF:
//       return handle(state, action, {
//         start: prevState => ({
//           ...prevState,
//           loading: true,
//           result: [],
//           fooError: null
//         }),
//         finish: prevState => ({ ...prevState, loading: false }),
//         failure: prevState => ({ ...prevState, error: payload }),
//         success: prevState => {
//           const { current_page: currentPage, total_pages: totalPages, total_items: totalItems, result } = payload && payload.staff_data
//           return ({ ...prevState,
//             data: {
//               ...prevState.data,
//               [currentPage]: result
//             },
//             total_pages: totalPages,
//             total_items: totalItems,
//             loading: false })
//         }
//       })
//     default:
//       return state
//   }
// }
