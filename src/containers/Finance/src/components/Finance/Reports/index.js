import React from 'react'

const TallyReports = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./TallyReports/tallyReports'))
const ReceiptBook = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./ReceiptBook/receiptBook'))
const TotalPaidReports = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./TotalPaidDueReports/totalPaidReports'))
const ChequeBounceReports = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./ChequeBounceReports/chequeBounceReports'))

export {
  TallyReports,
  ReceiptBook,
  TotalPaidReports,
  ChequeBounceReports
}
