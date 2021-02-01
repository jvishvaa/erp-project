import React from 'react'

const ConcessionSettings = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./concessionSettings'))
const AddConcessionSettings = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addConcession'))
const EditConcessionSettings = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editConcession'))

export {
  ConcessionSettings,
  AddConcessionSettings,
  EditConcessionSettings
}
