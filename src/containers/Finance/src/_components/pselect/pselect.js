import React from 'react'
import { UI } from './ui'
import { SelectorContextProvider } from './context'
/**
 * @param  {} props
 * @param onClick when button is clicked this function is called. (TODO : Renaming to onOpen ?)
 * Context Provides Data to UI
 * @example ContextData = {
    data,
    rowCount -> Total No. of Branches,
    columnCount -> Total No. OF Grades + 1,
    db -> indexedDB access
    setDB, -> TODO: Deprecated (Unused)
    initialized -> Boolean , Marks whether data was inserted to indexedDB,
    list -> TODO : Unused ( To be removed ),
    setInitialized -> TODO : To be removed,
    currentIndex -> Boolean UI State, to say which branch is active right now (Default 1st one branch will be open (index : 0)),
    setCurrentIndex,
    loadedRowCount -> No of rows Fetched from database to state,
    loadedRowsMap -> which and all rows : TODO,
    loadingRowCount -> No of rows currently being fetched,
    randomScrollToIndex -> callback function to scroll to a perticular index(Branch) in Grid,
    gridColumnCount -> TODO:,
    setLoadingRowCount -> set the no of loading row count,
    STATUS_LOADING
  }
 */
export default function PSelect (props) {
  return <SelectorContextProvider>
    <UI {...props} />
  </SelectorContextProvider>
}
