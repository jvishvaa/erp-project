import React from 'react'
import SinglePagePDFEditor from './index'

function EditorExample ({ alert }) {
  console.log('Editor example')
  return <SinglePagePDFEditor alert={alert} url={'/test.pdf'} />
}

export default EditorExample
