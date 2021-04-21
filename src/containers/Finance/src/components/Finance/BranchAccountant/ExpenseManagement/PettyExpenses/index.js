import React from 'react'

const PettyExpenses = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./pettyExpenses'))
const BankReport = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./BankReport/bankReport'))
const CashReport = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./CashReport/cashReport'))
const FinancialLedgerReport = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./FinancialLedgerReport/financialLedgerReport'))
const LedgerReport = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./LedgerReport/ledgerReport'))
const MakeEntry = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./MakeEntry/makeEntry'))

export {
  PettyExpenses,
  BankReport,
  CashReport,
  FinancialLedgerReport,
  LedgerReport,
  MakeEntry
}
