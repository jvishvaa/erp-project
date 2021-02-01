import React from 'react'

const FeeStructure = React.lazy(() => import(/* webpackChunkName: 'STDfIN' */'./feeStructure'))

export {
  FeeStructure
}
