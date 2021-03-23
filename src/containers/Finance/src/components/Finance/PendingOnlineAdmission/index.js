
import React from 'react'

const OnlineAdmission = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./pendingOnlineAdmission.js'))

export {
  OnlineAdmission
}
