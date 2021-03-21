import React from 'react'

const OtherFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./otherFeeType'))
const AddOtherFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addOtherFee'))
const EditOtherFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editOtherFee'))

export {
  OtherFeeType,
  AddOtherFeeType,
  EditOtherFeeType
}
