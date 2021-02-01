import React from 'react'

const OnlinePayment = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./uploadOnlinePayments'))

export {
  OnlinePayment
}
