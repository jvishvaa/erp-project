import React from 'react'

const StorePaymentRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./storePaymentRequests'))
const PendingStoreRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./pendingStoreRequests'))
const ApprovedStoreRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./approvedStoreRequests'))
const RejectedStoreRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./rejectedStoreRequests'))
const CancelledStoreRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./cancelledStoreRequests'))
const EditStoreTransactionDetails = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editStoreTransactionDetails'))

export {
  StorePaymentRequests,
  PendingStoreRequests,
  ApprovedStoreRequests,
  RejectedStoreRequests,
  CancelledStoreRequests,
  EditStoreTransactionDetails
}
