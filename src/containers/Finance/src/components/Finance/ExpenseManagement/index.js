import React from 'react'

// const GeneralExpense = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./GeneralExpense/generalExpense'))
const DepositTab = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./Deposits/deposits'))
const Ledger = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./Ledger/ledger'))

export {
  // GeneralExpense,
  DepositTab,
  Ledger
}
