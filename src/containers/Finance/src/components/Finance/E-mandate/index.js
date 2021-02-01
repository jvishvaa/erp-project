import React from 'react'

const EMandate = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./e-mandate'))
const BillingDetails = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./billingDetails'))
const AddCustomerDeatils = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addCustomerDeatils'))
const OrderDetails = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./orderDetails'))
const GenerateSubsequentPayment = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./generateSubsequentPayment'))
const DailyBillingDetails = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./dailyBillingDetails'))
const DailyBillingDetailsPage = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./dailyDetails'))
const CreateLink = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./createLink'))

export {
  EMandate,
  BillingDetails,
  AddCustomerDeatils,
  OrderDetails,
  GenerateSubsequentPayment,
  DailyBillingDetails,
  DailyBillingDetailsPage,
  CreateLink
}
