import React from 'react'

const FeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./feeType'))
const AddFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addfeeType'))
const EditFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editFeeType'))

export {
  FeeType,
  AddFeeType,
  EditFeeType
}
