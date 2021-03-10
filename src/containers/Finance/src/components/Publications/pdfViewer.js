import React, { useEffect, useState, useRef } from 'react'
import pdfjsLib from 'pdfjs-dist'
// import * as pdfWorker from 'pdfjs-dist/build/pdf.worker'
// import { pdfjs } from 'react-pdf'
import Button from '@material-ui/core/Button'
// import { InternalPageStatus } from '../../ui'
// import pdfWorker from '../../../node_modules/pdfjs-dist/build/pdf.worker'
import './publications.css'

// The workerSrc property shall be specified.
// console.log(pdfWorker, 'pp')
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const MyPdfViewer = ({ url }) => {
  const [scale] = useState(1)
  const canvasElement = useRef()
  const [pageNumber, setPageNumber] = useState(1)
  const [totalpage, setTotalPage] = useState(1)
  // const [containerWidth, setContainerWidth] = useState(0)
  // const pdfPage = useRef({
  //   totalPage: 0
  // })
  const [fetchingPdf, setFetchingPdf] = useState(false)
  // const [containerHeight, setContainerHeight] = useState(0)
  useEffect(() => {
    setFetchingPdf(true)
    var loadingTask = pdfjsLib.getDocument(url)
    loadingTask.promise.then(function (pdf) {
      // pdfPage.current.totalPage = pdf.numPages
      pdf.getPage(pageNumber).then(function (page) {
        console.log('rendering...........')
        var viewport = page.getViewport({ scale: scale })
        // Prepare canvas using PDF page dimensions
        var canvas = canvasElement.current
        var context = canvas.getContext('2d')
        if (canvas) {
          canvas.height = viewport.height
          canvas.width = viewport.width
        }
        setTotalPage(pdf.numPages)
        // setContainerHeight(viewport.height)
        // setContainerWidth(viewport.width)

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        }
        var renderTask = page.render(renderContext)
        renderTask.promise.then(function () {
          console.log('Page rendered')
          setFetchingPdf(false)
        })
      })
    }, function (reason) {
      console.log('error while loading')
      // PDF loading error
      console.error(reason)
    })
  }, [scale, pageNumber, url])

  const onNextPageClick = () => {
    // console.log(pdfPage)
    // console.log(pageNumber)
    if (pageNumber < totalpage) {
      console.log('true', totalpage)
      setPageNumber(pageNumber + 1)
      console.log(pageNumber)
    }
  }
  const onPreviousPageClick = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  return (
    <div>
      { pageNumber === 1 ? null : <Button primary variant='contained' onClick={e => onPreviousPageClick()} >Previous</Button>}
      {/* <Button primary variant='contained' onClick={e => onPreviousPageClick()} >Previous</Button> */}
      {/* <div style={{ textAlign: 'center' }} > Current Page: {pageNumber} Total Page: {pdfPage} </div> */}
      { pageNumber === totalpage ? null : <Button primary variant='contained' onClick={e => onNextPageClick()} style={{ float: 'right' }}>Next</Button>}
      {/* <Button primary variant='contained' onClick={e => onNextPageClick()} style={{ float: 'right' }}>Next</Button> */}
      <div style={{ width: '100%', height: '100%', top: '10px' }} >

        {fetchingPdf && <div className='notification-text' style={{ padding: window.isMobile ? '10px' : '20px' }}>please wait loading...</div>}

        <canvas ref={canvasElement} className='canvas-pdf' />
        <div style={{ textAlign: 'center' }} >
          { pageNumber + '-' + totalpage }
        </div>
      </div>
    </div>

  )
}

export default MyPdfViewer
