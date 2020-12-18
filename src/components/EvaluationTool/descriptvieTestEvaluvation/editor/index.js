import React from 'react'

import { CorrectionContextProvider } from './context'
import UI from './ui'

function PDFEditor (props) {
  console.log(props, 'PROPS')
  return <CorrectionContextProvider>
    <UI {...props} />
  </CorrectionContextProvider>
}

export default PDFEditor
