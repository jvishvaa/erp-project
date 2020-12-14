import React, { createContext, useState, useContext } from 'react'

export const CorrectionContext = createContext()

export function usePDFEditor () {
  const context = useContext(CorrectionContext)
  if (context === undefined) {
    throw new Error('usePDFEditor should be used inside PDF module')
  }
  return context
}

export function CorrectionContextProvider ({ children }) {
  const [pages, setPages] = useState([])
  const [pageData, setPageData] = useState({})
  return (
    <CorrectionContext.Provider value={{ pages, pageData, setPages, setPageData }}>
      {children}
    </CorrectionContext.Provider>
  )
}
