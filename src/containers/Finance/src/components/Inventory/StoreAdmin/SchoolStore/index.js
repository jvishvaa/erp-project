import React from 'react'

const AddItems = React.lazy(() => import(/* webpackChunkName: 'StrAdm' */'./AddItems/addItems'))

export {
  AddItems
}
