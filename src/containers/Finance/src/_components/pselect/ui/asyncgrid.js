import React, { useState, useEffect } from 'react'

import { Grid, AutoSizer, InfiniteLoader } from 'react-virtualized'

/**
 * @description AsyncLoading Grid
 * @param props
 * @param props.data Data to be shown in the grid.
 * @param props.onScroll Function to fetch when grid is scrolled. Should return a promise.
 * @param props.rowCount No of rows.
 * @param props.columnCount No of columns.
 */
function AsyncGrid (props) {
  let { data, onScroll, rowCount, columnCount, height, expandedHeight, currentIndex, cellRenderer } = props
  const [ gridCurrentIndex, setGridCurrentIndex ] = useState(0)
  let _onRowsRendered
  let _registerChild

  useEffect(() => {
    setGridCurrentIndex(currentIndex)
    _registerChild.recomputeGridSize(currentIndex)
  }, [_registerChild, currentIndex])
  /**
   * @param  {} {index}
   */
  function isRowLoaded ({ index }) {
    return Boolean(data[index])
  }

  /**
   * @param  {} {startIndex
   * @param  {} stopIndex}
   */
  function loadMoreRows ({ startIndex, stopIndex }) {
    return onScroll({ startIndex, stopIndex })
  }

  /**
   * @param  {} {rowStartIndex
   * @param  {} rowStopIndex}
   */
  function onSectionRendered ({ rowStartIndex, rowStopIndex }) {
    loadMoreRows({
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    })
    _onRowsRendered({
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    })
  }

  return <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={40} threshold={20}>
    {({ onRowsRendered, registerChild }) => {
      _onRowsRendered = onRowsRendered
      _registerChild = registerChild
      return <AutoSizer disableHeight>
        {({ width }) => (
          <Grid
            ref={(ref) => {
              registerChild = ref
              _registerChild = registerChild
            }}
            height={300}
            onSectionRendered={onSectionRendered}
            rowCount={rowCount}
            rowHeight={({ index }) => {
              return index === gridCurrentIndex ? expandedHeight : height
            }}
            columnCount={columnCount}
            columnWidth={200}
            cellRenderer={cellRenderer}
            overscanRowCount={10}
            scrollToIndex={null}
            width={width}
          />)}
      </AutoSizer>
    }}
  </InfiniteLoader>
}

export default AsyncGrid
