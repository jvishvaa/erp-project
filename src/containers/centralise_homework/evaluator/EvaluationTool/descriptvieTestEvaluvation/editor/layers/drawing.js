import React, { useRef, useEffect, useState } from 'react';
// import imageTest from '../../../CorrectionTool/DESTEST.jpeg'

var userStrokeStyle = 'red';

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
  enableMagnifier,
}) => {
  const canvasDrawingElement = useRef();
  const [context, setContext] = useState('');
  const [isPainting, setIsPainting] = useState(false);
  const [line, setLine] = useState([]);
  const [prevPos, setPrevPos] = useState({});
  const [drawedChanges, setDrawedChanges] = useState({});
  const drawingRef = useRef(null);
  // const [cImg, setImg] = useState()

  useEffect(() => {
    const handleListener = (ev) => {
      if (ev.target === canvasDrawingElement.current) {
        if (enablePainting || enableEraser) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
        }
      }
    };
    window.addEventListener('touchstart', handleListener, { passive: false });
    window.addEventListener('touchmove', handleListener, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleListener, { passive: false });
      window.removeEventListener('touchmove', handleListener, { passive: false });
    };
  }, [enablePainting, enableEraser]);

  useEffect(() => {
    if (drawedChanges && Object.keys(drawedChanges).length) {
      handleSave(drawedChanges);
    }
  }, [drawedChanges, handleSave]);

  useEffect(() => {
    let drawingCanvas = canvasDrawingElement.current;
    drawingCanvas.height = height;
    drawingCanvas.width = width;
    const context = drawingCanvas.getContext('2d');
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    setContext(context);
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 5;

    if (drawingCanvas) {
      const context = drawingCanvas.getContext('2d');
      // eslint-disable-next-line no-undef
      let img = new Image();
      img.src = drawing;
      img.addEventListener('load', () => {
        // drawingCanvas.width = width;
        // drawingCanvas.height = height;
        drawingCanvas.width = 700;
        drawingCanvas.height = 500;
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        context.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
      });
      // setImg(img.src)
      drawingRef.current = img;
    }
  }, [width, height, drawing]);

  const onMouseMove = ({ nativeEvent }) => {
    if (isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      setLine(line.concat(positionData));
      paint(prevPos, offSetData, userStrokeStyle);
    }
  };
  const onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (enablePainting || enableEraser) {
      setIsPainting(true);
      setPrevPos({ offsetX, offsetY });
    }
  };
  const onTouchStart = ({ nativeEvent: touchEvent }) => {
    touchEvent.stopPropagation();
    touchEvent.preventDefault();
    let drawingCanvas = canvasDrawingElement.current;
    var rect = drawingCanvas.getBoundingClientRect();
    var offsetX = touchEvent.touches[0].clientX - rect.left;
    var offsetY = touchEvent.touches[0].clientY - rect.top;
    if (enablePainting || enableEraser) {
      setIsPainting(true);
      setPrevPos({ offsetX, offsetY });
    }
  };

  const onTouchMove = ({ nativeEvent: touchEvent }) => {
    let drawingCanvas = canvasDrawingElement.current;
    var rect = drawingCanvas.getBoundingClientRect();
    var offsetX = touchEvent.touches[0].clientX - rect.left;
    var offsetY = touchEvent.touches[0].clientY - rect.top;
    if (isPainting) {
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      setLine(line.concat(positionData));
      paint(prevPos, offSetData, userStrokeStyle);
    }
  };

  const endPaintEvent = () => {
    if (isPainting) {
      setIsPainting(false);
      let drawingCanvas = canvasDrawingElement.current;
      setDrawedChanges({
        image: drawingCanvas.toDataURL(),
        // containerImg: containerImg.toDataURL(),
        containerImg: '',
        operation: 'manualSave',
        isSaving: 'true',
        viewHeight: refH && refH.current,
        viewWidth: refW && refW.current,
      });
      // if (extenstion === 'pdf') {
      //   onChange({ image: drawingCanvas.toDataURL(), containerImg: containerImg.toDataURL(), operation: 'autoSave' })
      // }
    }
  };

  // const drawRotated = useCallback(() => {
  //   let canvas = canvasDrawingElement.current
  //   // let drawingCanvas = canvasDrawingElement.current
  //   if (canvas) {
  //     // let img = cImg
  //     const ctx = canvas.getContext('2d')
  //     // eslint-disable-next-line no-undef
  //     var img = new Image()
  //     // img.src = imgRef.current.src
  //     img.crossOrigin = 'anonymous'
  //     // img.id = 'actual_image'
  //     const decidedAngle = initialAngle ? angleInDegrees - 90 : angleInDegrees
  //     img.src = cImg
  //     if (img && angleInDegrees !== 0) {
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
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    if (enablePainting) {
      context.beginPath();
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = strokeStyle;
      // Move the the prevPosition of the mouse
      context.moveTo(x, y);
      // Draw a line to the current position of the mouse
      context.lineTo(offsetX, offsetY);
      // Visualize the line using the strokeStyle
      context.stroke();
      context.lineWidth = 2;
    } else {
      context.globalCompositeOperation = 'destination-out';
      context.arc(offsetX, offsetY, 8, 0, Math.PI * 2, false);
      context.fill();
    }
    setPrevPos({ offsetX, offsetY });
  };

  return (
    <canvas
      key={page}
      style={{ position: 'absolute', left: 0, top: 0 }}
      // style={{ position: 'absolute'}}
      ref={canvasDrawingElement}
      onMouseDown={onMouseDown}
      onMouseLeave={endPaintEvent}
      onMouseUp={endPaintEvent}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={endPaintEvent}
      className='editor-drawing-layer'
    />
  );
};

export default DrawingLayer;
