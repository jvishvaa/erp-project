import React from 'react'

const AssignCoupon = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./assignCoupon'))
const ReAssignCoupon = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./reassignCoupon'))

export {
  AssignCoupon,
  ReAssignCoupon
}

// export { AssignCoupon } from './assignCoupon'
