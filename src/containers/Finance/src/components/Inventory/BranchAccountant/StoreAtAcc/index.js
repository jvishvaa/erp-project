import React from 'react'

const StoreAtAcc = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./storeAtAcc'))
const ConfigItems = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./configItems'))
const ShippingAmount = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'../shippingAmount/ShippingAmount'))

export {
  StoreAtAcc,
  ConfigItems,
  ShippingAmount
}
