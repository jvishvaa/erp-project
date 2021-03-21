import React from 'react'

const StudentUniform = React.lazy(() => import(/* webpackChunkName: 'StrMgr' */'./studentUniform'))
const BulkUniform = React.lazy(() => import(/* webpackChunkName: 'StrMgr' */'./BulkUniform/bulkUniform'))
const UniformVedio = React.lazy(() => import(/* webpackChunkName: 'StrMgr' */'./UniformVedio/uniformVedio'))
const UniformChart = React.lazy(() => import(/* webpackChunkName: 'StrMgr' */'./UniformChart/uniformChart'))
export {
  StudentUniform,
  BulkUniform,
  UniformVedio,
  UniformChart
}
