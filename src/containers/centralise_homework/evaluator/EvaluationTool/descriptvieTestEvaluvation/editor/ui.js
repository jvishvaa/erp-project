import React, { useEffect, useState, useRef, useCallback } from 'react';
import './correction_styles.css';
import {
  marginStyleAngle,
  marginPDFStyle,
  marginStyleBelowWindowSize,
  marginStyleAngleReverse,
} from './connstant';

// The workerSrc property shall be specified.
function CorrectionComponent({
  url,
  pageNumber,
  drawing,
  formData,
  onChange,
  tool,
  fullscreen,
  setIsPending,
  handleSave,
  handleTotalPage,
  setPdfState,
  angleInDegrees,
  setAngleInDegrees,
  rotation,
  splittedMedia,
  handleONSaveHW,
  initialAngle,
  restore,
  setRestore,
  zoom,
  isReset,
  drawedHistory,
  setDrawedHistory,
  isRotated,
  setIsRotated,
}) {
  const canvasElement = useRef();
  const pageRef = useRef(null);
  const imgRef = useRef(null);
  const divElement = useRef(null);
  const hRef = useRef(0);
  const wRef = useRef(0);
  const drawingRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const [style, setStyle] = useState({});
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState(
    drawedHistory.length - 1
  );
  const [context, setContext] = useState('');
  const [isPainting, setIsPainting] = useState(false);
  const [line, setLine] = useState([]);
  const [prevPos, setPrevPos] = useState({});
  const [drawedChanges, setDrawedChanges] = useState({});
  const enablePainting = tool === 'paint';
  const enableEraser = tool === 'eraser';
  var userStrokeStyle = 'red';

  const urlCopy = url;
  const extenstion = urlCopy.split('.').pop();

  useEffect(() => {
    const canvas = canvasElement.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      const pgUrl =
        splittedMedia && splittedMedia.length
          ? splittedMedia.filter((e) => e.page_number === pageNumber)[0].file_content
          : url;
      // eslint-disable-next-line no-undef
      var img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.id = 'actual_image';
      img.onload = async function () {
        let width = 0;
        let height = 0;

        width = extenstion === 'pdf' ? viewWidth : 700;
        height = extenstion === 'pdf' ? viewHeight : 700;
        canvas.height = height;
        canvas.width = width;
        hRef.current = height;
        wRef.current = width;

        setContainerHeight(height);
        setContainerWidth(width);
        let base64Image = await imageUrlToBase64(img?.src);
        setDrawedHistory([
          ...drawedHistory,
          {
            image: base64Image,
            containerImg: '',
            operation: 'manualSave',
            isSaving: 'true',
            viewHeight: height,
            viewWidth: width,
            historyType: 'loading',
          },
        ]);
        setDrawedChanges({
          image: base64Image,
          containerImg: '',
          operation: 'manualSave',
          isSaving: 'true',
          viewHeight: height,
          viewWidth: width,
          historyType: 'loading',
        });
        setSelectedDrawingIndex(selectedDrawingIndex + 1);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, width, height);
      };
      img.src = `${pgUrl}??${escape(new Date().getTime())}`;
      imgRef.current = img;
    }
  }, [extenstion, pageNumber, splittedMedia, url, viewHeight, viewWidth]);

  useEffect(() => {
    if (restore === 'undo') {
      restoreDrawing('undo');
    } else if (restore === 'redo') {
      restoreDrawing('redo');
    }
  }, [restore]);

  const restoreDrawing = (type) => {
    let drawingCanvas = canvasElement.current;
    if (drawedHistory.length > 1) {
      const context = drawingCanvas.getContext('2d');
      // eslint-disable-next-line no-undef
      let img = new Image();
      let selectedDrawing;
      if (type === 'undo') {
        if (selectedDrawingIndex > 0) {
          selectedDrawing = drawedHistory[selectedDrawingIndex - 1];
          setSelectedDrawingIndex(selectedDrawingIndex - 1);
        }
      }
      if (type === 'redo') {
        if (selectedDrawingIndex < drawedHistory.length - 1) {
          selectedDrawing = drawedHistory[selectedDrawingIndex + 1];
          setSelectedDrawingIndex(selectedDrawingIndex + 1);
        }
      }
      img.src = selectedDrawing?.image;
      img.addEventListener('load', () => {
        drawingCanvas.width = containerWidth;
        drawingCanvas.height = containerHeight;
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        context.drawImage(
          img,
          0,
          0,
          selectedDrawing.viewWidth,
          selectedDrawing.viewHeight
        );
      });
      setRestore('');
      drawingRef.current = img;
    }
  };

  //URL to base 64
  const imageUrlToBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    let promissedResult = new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    let data = await promissedResult;
    return data;
  };

  //rotate use effect
  const drawRotated = useCallback(() => {
    var { sX, sY, zoomAction, m } = zoom;

    let margin = '5% 0% 0% 3%';

    if (hRef && hRef.current && wRef && wRef.current) {
      if (hRef.current < 1000) {
        if (sX < 1) {
          sX = 1.5;
          sY = 1.5;
          margin = '7% 0% 0% 0%';
        } else if (sX == 1) {
          margin = '7% 0% 0% 0%';
        } else if (sX == 1.5) {
          margin = '20% auto';
        } else if (sX == 3) {
          sX = 1.7;
          sY = 1.7;
          margin = '25% auto';
        }
      } else if (hRef.current > 1000) {
        if (sX < 1) {
          sX = 1;
          sY = 1;
          margin = '7% 0% 0% 0%';
        } else if (sX == 1) {
          margin = '7% 0% 0% 0%';
        } else if (sX == 1.5) {
          if (angleInDegrees === 0) margin = '0% 40% auto';
          else margin = '8% auto';
        } else if (sX == 3) {
          if (angleInDegrees === 0) margin = '0% 42% 0 40%';
          else margin = '36% 33% 0 40%';
        }
        if (
          (angleInDegrees === 270 ||
            angleInDegrees === -270 ||
            angleInDegrees === 90 ||
            angleInDegrees === -90) &&
          sX == 1
        ) {
          margin = '0% 0% 0% 0%';
        } else if (
          (angleInDegrees === 270 ||
            angleInDegrees === -270 ||
            angleInDegrees === 90 ||
            angleInDegrees === -90) &&
          sX == 1.5
        ) {
          margin = '5% 0% 0% 10%';
        } else if ((angleInDegrees === -270 || angleInDegrees === 90) && sX == 3) {
          margin = '18% 15% 0% 0%';
        } else if ((angleInDegrees === 270 || angleInDegrees === -90) && sX == 3) {
          margin = '18% 0% 0% 45%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 1) {
          margin = '0% 0% 0% 0%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 1.5) {
          margin = '0%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 3) {
          margin = '5% 0% 0% 0%';
        }
      }
    }

    let style = {
      width: containerWidth,
      height: fullscreen ? 'calc(100vh - 46px)' : 'calc(100vh - 46px)',
      overflow: 'auto',
    };

    if (extenstion === 'pdf') {
      let v = marginPDFStyle[String(sX)];
      margin = '5% auto';
      // style.margin = margin;
    }

    let x = sX || 1;
    let y = sY || 1;

    style.width =
      angleInDegrees === -90 ||
      angleInDegrees === 90 ||
      angleInDegrees === 270 ||
      angleInDegrees === -270
        ? 700
        : 700;

    style.height =
      angleInDegrees === 0 ||
      angleInDegrees === 180 ||
      angleInDegrees === -180 ||
      angleInDegrees === -360
        ? 700
        : 700;
    // style.transform =
    //   zoomAction === 'zoom in'
    //     ? `rotate(${angleInDegrees}deg) scale(${x},${y})`
    //     : `rotate(${angleInDegrees}deg)scale(${x},${y})`;

    setStyle(style);
    rotateCanvas(angleInDegrees);
  }, [angleInDegrees, containerHeight, containerWidth, extenstion, fullscreen]);

  const drawZoom = useCallback(() => {
    var { sX, sY, zoomAction, m } = zoom;

    let margin = '5% 0% 0% 3%';

    if (hRef && hRef.current && wRef && wRef.current) {
      if (hRef.current < 1000) {
        if (sX < 1) {
          sX = 1.5;
          sY = 1.5;
          margin = '7% 0% 0% 0%';
        } else if (sX == 1) {
          margin = '7% 0% 0% 0%';
        } else if (sX == 1.5) {
          margin = '20% auto';
        } else if (sX == 3) {
          sX = 1.7;
          sY = 1.7;
          margin = '25% auto';
        }
      } else if (hRef.current > 1000) {
        if (sX < 1) {
          sX = 1;
          sY = 1;
          margin = '7% 0% 0% 0%';
        } else if (sX == 1) {
          margin = '7% 0% 0% 0%';
        } else if (sX == 1.5) {
          if (angleInDegrees === 0) margin = '0% 40% auto';
          else margin = '8% auto';
        } else if (sX == 3) {
          if (angleInDegrees === 0) margin = '0% 42% 0 40%';
          else margin = '36% 33% 0 40%';
        }
        if (
          (angleInDegrees === 270 ||
            angleInDegrees === -270 ||
            angleInDegrees === 90 ||
            angleInDegrees === -90) &&
          sX == 1
        ) {
          margin = '0% 0% 0% 0%';
        } else if (
          (angleInDegrees === 270 ||
            angleInDegrees === -270 ||
            angleInDegrees === 90 ||
            angleInDegrees === -90) &&
          sX == 1.5
        ) {
          margin = '5% 0% 0% 10%';
        } else if ((angleInDegrees === -270 || angleInDegrees === 90) && sX == 3) {
          margin = '18% 15% 0% 0%';
        } else if ((angleInDegrees === 270 || angleInDegrees === -90) && sX == 3) {
          margin = '18% 0% 0% 45%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 1) {
          margin = '0% 0% 0% 0%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 1.5) {
          margin = '0%';
        } else if ((angleInDegrees === 180 || angleInDegrees === -180) && sX == 3) {
          margin = '5% 0% 0% 0%';
        }
      }
    }

    let style = {
      width: containerWidth,
      height: fullscreen ? 700 : 700,
      overflow: 'auto',
    };

    if (extenstion === 'pdf') {
      let v = marginPDFStyle[String(sX)];
      margin = '5% auto';
      style.margin = margin;
    }

    let x = sX || 1;
    let y = sY || 1;

    style.transform = zoomAction === 'zoom in' ? ` scale(${x},${y})` : `scale(${x},${y})`;

    setStyle(style);
  }, [zoom]);

  useEffect(() => {
    drawRotated();
  }, [angleInDegrees, drawRotated]);

  useEffect(() => {
    drawZoom();
  }, [zoom]);

  //rotate canvas
  async function rotateCanvas(angle) {
    if (isRotated) {
      let rotationAngle = 0;

      rotationAngle = (rotationAngle + angle) % 360;

      // Create an off-screen canvas to store the current content
      const canvas = canvasElement.current;
      const pgUrl =
        splittedMedia && splittedMedia.length
          ? splittedMedia.filter((e) => e.page_number === pageNumber)[0].file_content
          : url;
      let img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.id = 'actual_image_rotation';
      img.src = canvas?.toDataURL();
      // img.style.transform = `rotate(${angleInDegrees}deg)`;

      let newWidth = 700;
      let newHeight = 700;

      const ctx = canvas.getContext('2d');
      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = canvas.width;
      offScreenCanvas.height = canvas.height;
      const offScreenCtx = offScreenCanvas.getContext('2d');
      offScreenCtx.drawImage(canvas, 0, 0);

      // Update canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Clear the main canvas
      ctx.clearRect(0, 0, newWidth, newHeight);

      // Apply the rotation

      img.onload = async function () {
        ctx.save();
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Redraw the saved image from the off-screen canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.restore();
      };
      // img.src = `${pgUrl}??${escape(new Date().getTime())}`;
      imgRef.current = img;

      setDrawedChanges({
        image: img?.src,
        // containerImg: containerImg.toDataURL(),
        containerImg: '',
        operation: 'manualSave',
        isSaving: 'true',
        viewHeight: hRef && hRef.current,
        viewWidth: wRef && wRef.current,
      });
      setDrawedHistory([
        ...drawedHistory,
        {
          image: canvas?.toDataURL(),
          // containerImg: containerImg.toDataURL(),
          containerImg: '',
          operation: 'manualSave',
          isSaving: 'true',
          viewHeight: hRef && hRef.current,
          viewWidth: wRef && wRef.current,
          historyType: 'rotating',
        },
      ]);
      setAngleInDegrees(0);
      setIsRotated(false);
    }
  }

  useEffect(() => {
    if (pageRef && pageRef.current) {
      handleTotalPage(pageRef.current);
    }
  }, [handleTotalPage, pageRef]);

  useEffect(() => {
    const handleListener = (ev) => {
      if (ev.target === canvasElement.current) {
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

  // Draw image on canvas after every change
  useEffect(() => {
    let drawingCanvas = canvasElement.current;
    drawingCanvas.height = containerHeight;
    drawingCanvas.width = containerWidth;
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
        drawingCanvas.width = containerWidth;
        drawingCanvas.height = containerHeight;
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        context.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
      });
      drawingRef.current = img;
    }
  }, [drawing]);

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

  // start drawing
  const onTouchStart = ({ nativeEvent: touchEvent }) => {
    touchEvent.stopPropagation();
    touchEvent.preventDefault();
    let drawingCanvas = canvasElement.current;
    var rect = drawingCanvas.getBoundingClientRect();
    var offsetX = touchEvent.touches[0].clientX - rect.left;
    var offsetY = touchEvent.touches[0].clientY - rect.top;
    if (enablePainting || enableEraser) {
      setIsPainting(true);
      setPrevPos({ offsetX, offsetY });
    }
  };

  // drawing
  const onTouchMove = ({ nativeEvent: touchEvent }) => {
    let drawingCanvas = canvasElement.current;
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

  //Leave Drawing
  const endPaintEvent = () => {
    if (isPainting) {
      setIsPainting(false);
      let drawingCanvas = canvasElement.current;

      //state updation for saving updated canvas
      setDrawedChanges({
        image: drawingCanvas?.toDataURL(),
        // containerImg: containerImg.toDataURL(),
        containerImg: '',
        operation: 'manualSave',
        isSaving: 'true',
        viewHeight: hRef && hRef.current,
        viewWidth: wRef && wRef.current,
      });

      if (drawedHistory.length - selectedDrawingIndex > 1) {
        let dummyHistory = drawedHistory;
        let dummyHistory2 = dummyHistory.slice(0, selectedDrawingIndex + 1);

        setDrawedHistory([
          ...dummyHistory2,
          {
            image: drawingCanvas?.toDataURL(),
            // containerImg: containerImg.toDataURL(),
            containerImg: '',
            operation: 'manualSave',
            isSaving: 'true',
            viewHeight: hRef && hRef.current,
            viewWidth: wRef && wRef.current,
            historyType: 'drawing',
          },
        ]);
        setSelectedDrawingIndex(dummyHistory2.length);

        return;
      }
      setDrawedHistory([
        ...drawedHistory,
        {
          image: drawingCanvas?.toDataURL(),
          // containerImg: containerImg.toDataURL(),
          containerImg: '',
          operation: 'manualSave',
          isSaving: 'true',
          viewHeight: hRef && hRef.current,
          viewWidth: wRef && wRef.current,
          historyType: 'drawing',
        },
      ]);
      setSelectedDrawingIndex(drawedHistory.length);
      // setDrawedHistory(drawedHistory.splice(selectedDrawingIndex, drawedHistory.length));
      // if (extenstion === 'pdf') {
      //   onChange({ image: drawingCanvas.toDataURL(), containerImg: containerImg.toDataURL(), operation: 'autoSave' })
      // }
    }
  };

  // line drawing
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
    <div ref={divElement} style={style} id='editor-evaluvation-container'>
      <canvas
        style={{
          left: 0,
          top: 0,
          height: 'auto',
          width: 'auto',
          margin: 'auto',
          display: 'block',
        }}
        ref={canvasElement}
        id='editor-evaluvation-drawing-layer'
        onMouseDown={onMouseDown}
        onMouseLeave={endPaintEvent}
        onMouseUp={endPaintEvent}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchEnd={endPaintEvent}
        className='editor-drawing-layer'
      />
    </div>
  );
}

export default CorrectionComponent;
