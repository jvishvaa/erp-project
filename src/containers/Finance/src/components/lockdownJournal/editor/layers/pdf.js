import React, { useEffect, useState, useRef } from 'react'
import pdfjsLib from 'pdfjs-dist'

import '../pdf_styles.css'

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
function PDFLayer ({ url, pageNumber, updateTextBoxes }) {
  const [scale] = useState(1)
  const canvasElement = useRef()
  useEffect(() => {
    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(url)
    loadingTask.promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        var viewport = page.getViewport({ scale: scale })
        // Prepare canvas using PDF page dimensions
        var canvas = canvasElement.current
        var context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        }
        var renderTask = page.render(renderContext)
        renderTask.promise.then(function () {
          console.log('Page rendered')
          page.getAnnotations().then((annotations) => {
            let rects = []
            annotations.forEach(annotation => {
              let rect = annotation.rect
              rect = pdfjsLib.Util.normalizeRect(viewport.convertToViewportRectangle(rect))
              rects.push(rect)
            })
            updateTextBoxes(rects)
          })
        })
      })
    }, function (reason) {
    // PDF loading error
      console.error(reason)
    })
  }, [scale, updateTextBoxes, url])

  return <canvas ref={canvasElement} className='editor-pdf-layer' />
}

export default PDFLayer
