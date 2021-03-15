import React from 'react'

const QRCodeGenerator = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./qrCodeGenerator'))

export {
  QRCodeGenerator
}
