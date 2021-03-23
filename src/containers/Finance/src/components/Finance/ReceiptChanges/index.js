import React from 'react'

const createReceipt = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./createReceipt'))
const EditReceipt = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editReceipt'))
const AddReceipt = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addReceipt'))

export {
  createReceipt,
  EditReceipt,
  AddReceipt
}
// export { default as createReceipt } from './createReceipt'
// export { default as EditReceipt } from './editReceipt'
// export { default as AddReceipt } from './addReceipt'
