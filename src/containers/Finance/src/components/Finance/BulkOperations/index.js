import React from 'react'

const BulkActiveInactive = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./BulkActiveInactive/bulkActiveInactive'))
const OnlinePaymentUpload = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./OnlinePaymentUpload/onlinePaymentUpload'))
const BulkAccountantLogin = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./AccountantLogin/AccountantLogin'))
const BulkFeeUpload = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./BulkFeeUpload/bulkFeeUpload'))
const BulkReportUpload = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./bulkReportUpload'))
const BulkReportStatus = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./bulkReportStatus'))
const BulkActiveInactiveParent = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./BulkActiveInactiveParent/bulkActiveInactiveParent'))

export {
  BulkActiveInactive,
  OnlinePaymentUpload,
  BulkAccountantLogin,
  BulkReportUpload,
  BulkReportStatus,
  BulkFeeUpload,
  BulkActiveInactiveParent
}
