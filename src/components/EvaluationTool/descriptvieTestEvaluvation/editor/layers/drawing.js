import React, { useRef, useEffect, useState } from 'react'
// import imageTest from '../../../CorrectionTool/DESTEST.jpeg'

var userStrokeStyle = 'red'

const DrawingLayer = ({
  page,
  width,
  height,
  enablePainting,
  enableEraser,
  onChange,
  drawing,
  containerImg,
  handleSave,
  extenstion,
  angleInDegrees,
  viewHeight,
  viewWidth,
  refW,
  refH,
  initialAngle,
  enableMagnifier
}) => {
  const canvasDrawingElement = useRef()
  const [context, setContext] = useState('')
  const [isPainting, setIsPainting] = useState(false)
  const [line, setLine] = useState([])
  const [prevPos, setPrevPos] = useState({})
  const [drawedChanges, setDrawedChanges] = useState({})
  const drawingRef = useRef(null)
  // const [cImg, setImg] = useState()

  console.log(refH, refW, 'ref height', drawing, width, height)

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
    if (drawedChanges && Object.keys(drawedChanges).length) {
      handleSave(drawedChanges)
    }
  },
  [drawedChanges, handleSave]
  )

  useEffect(() => {
    // console.log('commm', drawing)
    let drawingCanvas = canvasDrawingElement.current
    drawingCanvas.height = height
    drawingCanvas.width = width
    const context = drawingCanvas.getContext('2d')
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
    setContext(context)
    context.lineJoin = 'round'
    context.lineCap = 'round'
    context.lineWidth = 5
    // // eslint-disable-next-line no-debugger
    // debugger
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
        context.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height)
      })
      // setImg(img.src)
      drawingRef.current = img
    }
  }, [width, height, drawing])

  const onMouseMove = ({ nativeEvent }) => {
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
  const onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    if (enablePainting || enableEraser) {
      setIsPainting(true)
      setPrevPos({ offsetX, offsetY })
    }
  }
  const onTouchStart = ({ nativeEvent: touchEvent }) => {
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

  const onTouchMove = ({ nativeEvent: touchEvent }) => {
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

  const endPaintEvent = () => {
    if (isPainting) {
      setIsPainting(false)
      console.log('end finished')
      let drawingCanvas = canvasDrawingElement.current
      console.log(drawingCanvas, drawingCanvas.toDataURL())
      setDrawedChanges({
        image: drawingCanvas.toDataURL(),
        containerImg: containerImg.toDataURL(),
        operation: 'manualSave',
        isSaving: 'true',
        viewHeight: refH && refH.current,
        viewWidth: refW && refW.current
      })
      // if (extenstion === 'pdf') {
      //   onChange({ image: drawingCanvas.toDataURL(), containerImg: containerImg.toDataURL(), operation: 'autoSave' })
      // }
    }
  }

  // const drawRotated = useCallback(() => {
  //   let canvas = canvasDrawingElement.current
  //   // let drawingCanvas = canvasDrawingElement.current
  //   console.log(angleInDegrees, 'angle in drawing')
  //   if (canvas) {
  //     // let img = cImg
  //     const ctx = canvas.getContext('2d')
  //     // eslint-disable-next-line no-undef
  //     var img = new Image()
  //     // img.src = imgRef.current.src
  //     img.crossOrigin = 'anonymous'
  //     // img.id = 'actual_image'
  //     console.log(width, height, 'wwwwwwwwwwwwwwwwwwwwwwwwhhhhhhhhhhhh in drawing')
  //     const decidedAngle = initialAngle ? angleInDegrees - 90 : angleInDegrees
  //     img.src = cImg
  //     if (img && angleInDegrees !== 0) {
  //       console.log('hhh')
  //       img.addEventListener('load', function () {
  //         ctx.clearRect(0, 0, canvas.width, canvas.height)
  //         ctx.save()
  //         canvas.width = width
  //         canvas.height = height
  //         ctx.translate(canvas.width / 2, canvas.height / 2)
  //         ctx.rotate((decidedAngle) * (Math.PI / 180))
  //         if (img && img.width && img.height) {
  //           ctx.drawImage(img, -img.width / 2, -img.height / 2)
  //         }

  //         ctx.restore()
  //       })
  //     }
  //   }
  // }, [angleInDegrees, cImg, height, initialAngle, width]
  // )

  // useEffect(() => {
  //   drawRotated()
  // }, [angleInDegrees, drawRotated])

  const paint = (prevPos, currPos, strokeStyle) => {
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
