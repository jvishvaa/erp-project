import React from 'react'

const AppFormList = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./appFormList'))
const RegFormList = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./regFormList'))
const AdmFormList = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./admFormList'))
const TotalFormCount = React.lazy(() => import(/* webpackChunkName: 'COMMfIN' */'./totalFormCount'))

export { TotalFormCount, AppFormList, RegFormList, AdmFormList }
