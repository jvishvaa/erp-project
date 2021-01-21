import React from 'react'

const MakePayment = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./makePayment'))

export {
  MakePayment
}
