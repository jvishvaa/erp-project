import React from 'react'

import { PDFEditorContextProvider } from './context'
import UI from './ui'

function PDFEditor (props) {
  console.log(props, 'PROPS')
  return <PDFEditorContextProvider>
    <UI {...props} />
  </PDFEditorContextProvider>
}

export default PDFEditor
