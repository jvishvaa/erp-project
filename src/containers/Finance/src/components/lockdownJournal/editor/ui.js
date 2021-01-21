import React, { useEffect, useState, useRef, useCallback } from 'react'
import pdfjsLib from 'pdfjs-dist'
import FormLayer from './layers/form'
import DrawingLayer from './layers/drawing'

import './pdf_styles.css'

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
function SinglePagePDFEditor ({ url, page, drawing, formData, onChange, tool, fullscreen, setIsPending }) {
  console.log(url)
  const [values, setValues] = useState({})
  const [scale] = useState(1)
  const canvasElement = useRef()
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [textBoxes, setTextBoxes] = useState([])

  const renderPage = useCallback(() => {
    if (canvasElement.current && url) {
      // Asynchronous download of PDF
      setIsPending(true)
      var loadingTask = pdfjsLib.getDocument(url)
      loadingTask.promise.then((pdf) => {
        // Fetch the first page
        var pageNumber = 1
        pdf.getPage(pageNumber).then((page) => {
          var viewport = page.getViewport({ scale: scale })
          var canvas = canvasElement.current
          if (canvas) {
            var context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width
            setContainerHeight(viewport.height)
            setContainerWidth(viewport.width)
            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            }
            var renderTask = page.render(renderContext)
            renderTask.promise.then(() => {
              console.log('Page rendered')
              page.getAnnotations().then((annotations) => {
                let newTextBoxes = []
                annotations.forEach(annotation => {
                  let rect = pdfjsLib.Util.normalizeRect(viewport.convertToViewportRectangle(annotation.rect))
                  newTextBoxes.push({
                    annotation,
                    rect
                  })
                })
                setTextBoxes(newTextBoxes)
              })
              setIsPending(false)
            })
          }
        })
      }, function (reason) {
        // PDF loading error
        console.error(reason)
      })
    }
  }, [scale, setIsPending, url])

  useEffect(() => {
    setValues(formData)
  }, [formData])

  useEffect(() => {
    renderPage()
  }, [renderPage, url])

  return <div >
    <div style={{ width: '100vw', height: fullscreen ? 'calc(100vh - 46px)' : containerHeight, overflow: 'auto' }} id='editor-pdf-container'>
      <canvas
        style={{ position: 'absolute', left: 0, top: 0 }}
        ref={canvasElement} className='editor-pdf-layer' />
      <DrawingLayer page={page} drawing={drawing} onChange={onChange} enableEraser={tool === 'eraser'} enablePainting={tool === 'paint'} width={containerWidth} height={containerHeight} />
      <FormLayer onChange={onChange} values={values} setValues={setValues} textBoxes={textBoxes} />
    </div></div>
}

export default SinglePagePDFEditor
