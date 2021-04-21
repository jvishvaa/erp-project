import React from 'react'

const TransactionStatus = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./transactionStatus'))

export {
  TransactionStatus
}
