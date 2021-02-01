import React from 'react'

const MiscFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./miscFeeType'))
const AddMiscFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addMiscFee'))
const EditMiscFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editMiscFee'))

export {
  MiscFeeType,
  AddMiscFeeType,
  EditMiscFeeType
}
