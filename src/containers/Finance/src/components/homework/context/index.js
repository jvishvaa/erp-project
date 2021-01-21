import React, { createContext, useState, useContext } from 'react'
import ContentManager from '../contentManager'

export const HomeworkContext = createContext()

export function useHomework () {
  const context = useContext(HomeworkContext)
  if (context === undefined) {
    throw new Error('useHomework should be used inside homework module')
  }
  return context
}

export function HomeworkContextProvider ({ children }) {
  const [ contentManager ] = useState(() => new ContentManager())
  return (
    <HomeworkContext.Provider value={contentManager}>
      {children}
    </HomeworkContext.Provider>
  )
}
