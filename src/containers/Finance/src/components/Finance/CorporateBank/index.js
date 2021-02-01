import React from 'react'

const Bank = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./bank'))
const ViewBanks = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewBanks/viewBanks'))
const ViewFeeAccounts = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewFeeAccounts/viewFeeAccounts'))
const editBanks = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewBanks/editBanks'))
const AddBanks = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewBanks/addBanks'))
const editFeeAccounts = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewFeeAccounts/editFeeAccounts'))
const AddFeeAccounts = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewFeeAccounts/addFeeAccounts'))
const AccToBranch = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./AccountToBranch/'))
const AccToClass = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./AccountToClass/'))
const TabView = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./CorporateBankTabView/'))
const AirPayFeeAccount = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./AirPayFeeAccount/'))
const AccToStore = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./AccountToStore/'))

export {
  Bank,
  ViewBanks,
  ViewFeeAccounts,
  editBanks,
  AddBanks,
  editFeeAccounts,
  AddFeeAccounts,
  AccToBranch,
  AccToClass,
  TabView,
  AirPayFeeAccount,
  AccToStore
}

// export { default as Bank } from './bank'
// export { default as ViewBanks } from './viewBanks'
// export { default as ViewFeeAccounts } from './viewFeeAccounts'
// export { default as editBanks } from './editBanks'
// export { default as AddBanks } from './addBanks'
// export { default as editFeeAccounts } from './editFeeAccounts'
// export { default as AddFeeAccounts } from './addFeeAccounts'
// export { default as AccToBranch } from './AccountToBranch/index'
// export { default as AccToClass } from './AccountToClass/index'
// export { default as TabView } from './CorporateBankTabView/index'
