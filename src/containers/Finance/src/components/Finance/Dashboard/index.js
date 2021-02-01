import React from 'react'

const AdminDashboard = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./FinanceAdmin/dashboard'))
// const AccountantDashboard = React.lazy(() => import(/* webpackChunkName: 'AccfIN' */'./FinanceAccountant/dashboard'))
const ActivateInactivateStudentAdm = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./FinanceAdmin/activateInactivateStudent'))

export {
  AdminDashboard,
  // AccountantDashboard,
  ActivateInactivateStudentAdm
}
