import React from 'react'

const UnassignFeeRequests = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./UnassignFeeRequests/unassignFeeRequestsTab'))
const ApprovalRequest = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./UnassignFeeRequests/Components/approvalRequest'))
const PendingRequest = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./UnassignFeeRequests/Components/pendingRequest'))
const RejectedRequest = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./UnassignFeeRequests/Components/rejectedRequest'))
const StudentShuffleReq = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./StudentShuffle/studentShuffleReq'))
const ApprovePendingReq = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./StudentShuffle/Components/approvePendingReq'))

export {
  UnassignFeeRequests,
  ApprovalRequest,
  PendingRequest,
  RejectedRequest,
  StudentShuffleReq,
  ApprovePendingReq
}
