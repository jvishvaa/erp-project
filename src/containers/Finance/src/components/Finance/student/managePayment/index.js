import React from 'react'

const ManagePayment = React.lazy(() => import(/* webpackChunkName: 'STDfIN' */'./managePayment'))
const FeedBack = React.lazy(() => import(/* webpackChunkName: 'STDfIN' */'./feedBack'))

export {
  ManagePayment,
  FeedBack
}
// export { default as ManagePayment } from './managePayment'
// export { default as FeedBack } from './feedBack'
