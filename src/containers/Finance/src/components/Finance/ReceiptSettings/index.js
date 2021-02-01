import React from 'react'

const ReceiptSettings = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ReceiptSettings'))
const receiptSettingAdd = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ReceiptSettingAdd'))

export {
  ReceiptSettings,
  receiptSettingAdd
}
