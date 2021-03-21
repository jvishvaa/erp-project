import React from 'react'

const MiscFeeClass = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./miscFeeClass'))
const EditMiscFee = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editMiscFee'))

export {
  MiscFeeClass,
  EditMiscFee
}

// export { default as MiscFeeClass } from './miscFeeClass'
// export { default as EditMiscFee } from './editMiscFee'
