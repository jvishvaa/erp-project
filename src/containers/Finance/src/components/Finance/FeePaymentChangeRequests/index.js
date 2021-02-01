import React from 'react'

const FeePaymentChangeRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./feePaymentChangeRequests'))
const PendingRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./pendingRequestView'))
const ApprovedRequestView = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./approvedRequestView'))
const RejectedRequestView = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./rejectedRequestView'))
const CancelledRequestView = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./cancelledRequestView'))
const EditTransactionDetails = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editTransactionDetails'))

export {
  FeePaymentChangeRequests,
  PendingRequests,
  ApprovedRequestView,
  RejectedRequestView,
  CancelledRequestView,
  EditTransactionDetails
}
