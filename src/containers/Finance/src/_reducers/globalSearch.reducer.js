// import { handle } from 'redux-pack'
// import { apiConstants } from '../_constants'

// export function globalSearch (state = { staff: {}, student: {} }, action) {
//   const { type, payload } = action
//   console.log(payload)
//   switch (type) {
//     case apiConstants.GLOBAL_SEARCH:
//       return handle(state, action, {
//         start: prevState => {
//           return {
//             staff: {
//               ...prevState.staff,
//               loading: true,
//               error: false
//             },
//             student: {
//               ...prevState.student,
//               loading: true,
//               error: false
//             }
//           }
//         },
//         finish: prevState => {
//           return prevState
//         },
//         failure: prevState => ({
//           ...prevState,
//           staff: {
//             ...prevState.staff,
//             loading: false,
//             error: payload
//           },
//           student: {
//             ...prevState.student,
//             loading: false,
//             error: payload
//           }
//         }),
//         success: prevState => {
//           const { current_page: currentStaffPage, total_pages: totalStaffPages, total_items: totalStaffItems, results: staffResult } = payload[0]
//           const { current_page: currentStudentPage, total_pages: totalStudentPages, total_items: totalStudentItems, results: studentResult } = payload[1]
//           return {
//             staff: {
//               ...prevState.staff,
//               loading: false,
//               data: {
//                 ...prevState.staff.data,
//                 [currentStaffPage]: staffResult
//               },
//               currentPage: currentStaffPage,
//               totalPages: totalStaffPages,
//               totalItems: totalStaffItems
//             },
//             student: {
//               ...prevState.student,
//               loading: false,
//               data: {
//                 ...prevState.student.data,
//                 [currentStudentPage]: studentResult
//               },
//               currentPage: currentStudentPage,
//               totalPages: totalStudentPages,
//               totalItems: totalStudentItems
//             }
//           }
//         //   return ({ ...prevState,
//         //     data: {
//         //       ...prevState.data,
//         //       [currentPage]: result
//         //     },
//         //     total_pages: totalPages,
//         //     total_items: totalItems,
//         //     loading: false
//         //   })
//         }
//       })
//     default:
//       return state
//   }
// }
