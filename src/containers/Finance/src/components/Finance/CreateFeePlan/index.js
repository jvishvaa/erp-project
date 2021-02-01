import React from 'react'

const CreateFeePlan = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./createFeePlan'))
const AddFeePlan = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addFeePlan'))
const ManageFeeType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./manageFeeType'))
const EditFeeInstallment = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editFinanaceInstallment'))
const AddFeePlanType = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./addFeePlanType'))
const EditFeePlanName = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./editFeePlanName'))

export {
  CreateFeePlan,
  AddFeePlan,
  ManageFeeType,
  EditFeeInstallment,
  AddFeePlanType,
  EditFeePlanName
}

// export { default as CreateFeePlan } from './createFeePlan'
// export { default as AddFeePlan } from './addFeePlan'
// export { default as ManageFeeType } from './manageFeeType'
// export { default as EditFeeInstallment } from './editFinanaceInstallment'
// export { default as AddFeePlanType } from './addFeePlanType'
// export { default as EditFeePlanName } from './editFeePlanName'
