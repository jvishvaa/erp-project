import React from 'react'
import { AddItems } from './SchoolStore'

const AdminKit = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./Kit/kit'))
const StoreReports = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./StoreReports/storeReports'))
const AddGst = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./AddGst/addGst'))
const OrderStatusUpload = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./OrderStatusUpload/orderStatusUpload'))
const SubCategoryAllow = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./SubCategoryAllow/subCategoryAllow'))
export {
  AddItems,
  AdminKit,
  StoreReports,
  AddGst,
  OrderStatusUpload,
  SubCategoryAllow
}
