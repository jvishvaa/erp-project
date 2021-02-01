import React from 'react'

const ReceiptBookAdm = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./ReceiptBook/receiptBook'))
const TotalPaidDueReportsAdm = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./TotalPaidDueReports/totalPaidReports'))

export {
  ReceiptBookAdm,
  TotalPaidDueReportsAdm
}
