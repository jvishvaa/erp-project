import React, { createContext, useState, useContext } from 'react'

export const PDFEditorContext = createContext()

export function usePDFEditor () {
  const context = useContext(PDFEditorContext)
  if (context === undefined) {
    throw new Error('usePDFEditor should be used inside PDF module')
  }
  return context
}

export function PDFEditorContextProvider ({ children }) {
  const [pages, setPages] = useState([])
  const [pageData, setPageData] = useState({})
  return (
    <PDFEditorContext.Provider value={{ pages, pageData, setPages, setPageData }}>
      {children}
    </PDFEditorContext.Provider>
  )
}
