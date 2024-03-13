import React from 'react'

import { CorrectionContextProvider } from './context'
import UI from './ui'

function PDFEditor (props) {
  return <CorrectionContextProvider>
    <UI {...props} />
  </CorrectionContextProvider>
}

export default PDFEditor
