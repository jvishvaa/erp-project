import React, { useRef, useEffect, useState } from 'react'

var userStrokeStyle = '#EE92C2'

function DrawingLayer ({ page, width, height, enablePainting, enableEraser, onChange, drawing }) {
  const canvasDrawingElement = useRef()
  const [context, setContext] = useState('')
  const [isPainting, setIsPainting] = useState(false)
  const [line, setLine] = useState([])
  const [prevPos, setPrevPos] = useState({})

  useEffect(() => {
    const handleListener = (ev) => {
      if (ev.target === canvasDrawingElement.current) {
        console.log('Touch started')
        if (enablePainting || enableEraser) {
          console.log('Painting enabled')
          ev.preventDefault()
          ev.stopImmediatePropagation()
        }
      }
    }
    window.addEventListener('touchstart', handleListener, { passive: false })
    window.addEventListener('touchmove', handleListener, { passive: false })
    return () => {
      window.removeEventListener('touchstart', handleListener, { passive: false })
      window.removeEventListener('touchmove', handleListener, { passive: false })
    }
  }, [enablePainting, enableEraser])
  useEffect(() => {
    let drawingCanvas = canvasDrawingElement.current
    drawingCanvas.height = height
    drawingCanvas.width = width
    const context = drawingCanvas.getContext('2d')
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
    setContext(context)
    context.lineJoin = 'round'
    context.lineCap = 'round'
    context.lineWidth = 5
    if (drawingCanvas) {
      const context = drawingCanvas.getContext('2d')
      // eslint-disable-next-line no-undef
      let img = new Image()
      img.src = drawing
      console.log(img, 'loaded image...')
      img.addEventListener('load', () => {
        console.log('Image loaded...', img)
        drawingCanvas.width = width
        drawingCanvas.height = height
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        context.drawImage(img, 0, 0)
      })
    }
  }, [width, height, drawing])

  function onMouseMove ({ nativeEvent }) {
    if (isPainting) {
      const { offsetX, offsetY } = nativeEvent
      const offSetData = { offsetX, offsetY }
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...prevPos },
        stop: { ...offSetData }
      }
      // Add the position to the line array
      setLine(line.concat(positionData))
      paint(prevPos, offSetData, userStrokeStyle)
    }
  }
  function onMouseDown ({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    if (enablePainting || enableEraser) {
      setIsPainting(true)
      setPrevPos({ offsetX, offsetY })
    }
  }
  function onTouchStart ({ nativeEvent: touchEvent }) {
    touchEvent.stopPropagation()
    touchEvent.preventDefault()
    let drawingCanvas = canvasDrawingElement.current
    var rect = drawingCanvas.getBoundingClientRect()
    var offsetX = touchEvent.touches[0].clientX - rect.left
    var offsetY = touchEvent.touches[0].clientY - rect.top
    if (enablePainting || enableEraser) {
      setIsPainting(true)
      setPrevPos({ offsetX, offsetY })
    }
  }

  function onTouchMove ({ nativeEvent: touchEvent }) {
    let drawingCanvas = canvasDrawingElement.current
    var rect = drawingCanvas.getBoundingClientRect()
    var offsetX = touchEvent.touches[0].clientX - rect.left
    var offsetY = touchEvent.touches[0].clientY - rect.top
    console.log(offsetX)
    if (isPainting) {
      const offSetData = { offsetX, offsetY }
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...prevPos },
        stop: { ...offSetData }
      }
      // Add the position to the line array
      setLine(line.concat(positionData))
      paint(prevPos, offSetData, userStrokeStyle)
    }
  }

  function endPaintEvent () {
    if (isPainting) {
      setIsPainting(false)
      console.log('end finished')
      let drawingCanvas = canvasDrawingElement.current
      onChange({ image: drawingCanvas.toDataURL() })
    }
  }

  function paint (prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos
    const { offsetX: x, offsetY: y } = prevPos

    if (enablePainting) {
      context.beginPath()
      context.globalCompositeOperation = 'source-over'
      context.strokeStyle = strokeStyle
      // Move the the prevPosition of the mouse
      context.moveTo(x, y)
      // Draw a line to the current position of the mouse
      context.lineTo(offsetX, offsetY)
      // Visualize the line using the strokeStyle
      context.stroke()
      context.lineWidth = 5
    } else {
      context.globalCompositeOperation = 'destination-out'
      context.arc(offsetX, offsetY, 8, 0, Math.PI * 2, false)
      context.fill()
    }
    setPrevPos({ offsetX, offsetY })
  }

  return <canvas
    key={page}
    style={{ position: 'absolute', left: 0, top: 0 }}
    ref={canvasDrawingElement}
    onMouseDown={onMouseDown}
    onMouseLeave={endPaintEvent}
    onMouseUp={endPaintEvent}
    onMouseMove={onMouseMove}
    onTouchMove={onTouchMove}
    onTouchStart={onTouchStart}
    onTouchEnd={endPaintEvent}
    className='editor-drawing-layer' />
}

export default DrawingLayer
