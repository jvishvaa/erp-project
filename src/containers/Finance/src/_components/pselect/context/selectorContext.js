import React, { createContext, useState, useEffect } from 'react'

import Database from '../database'

const STATUS_LOADING = 1

export const Context = createContext({})

export const Provider = props => {
  /***
   * @description Grid Related Variables
   *
  ***/
  const [ loadedRowCount ] = useState(0)
  let data = {}
  const [ loadingRowCount, setLoadingRowCount ] = useState(0)
  const [ loadedRowsMap ] = useState({})
  const [ list ] = useState({})
  const [ currentIndex, setCurrentIndex ] = useState(0)
  const [ initialized, setInitialized ] = useState(false)
  const [ db, setDB ] = useState(new Database())
  let randomScrollToIndex = null
  let gridColumnCount = 7
  useEffect(() => {
    if (db.db) {
      db.deleteOldDb(() => {
        setInitialized(true)
      })
    }
  }, [db])

  let { children } = props
  // add all branches to db
  let ContextData = {
    data,
    db,
    setDB,
    initialized,
    list,
    setInitialized,
    currentIndex,
    setCurrentIndex,
    loadedRowCount,
    loadedRowsMap,
    loadingRowCount,
    randomScrollToIndex,
    gridColumnCount,
    setLoadingRowCount,
    STATUS_LOADING
  }
  // pass the value in provider and return
  return <Context.Provider value={ContextData}>{children}</Context.Provider>
}

export const { Consumer } = Context
