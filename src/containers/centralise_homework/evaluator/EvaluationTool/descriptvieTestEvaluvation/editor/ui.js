import React, { useEffect, useState, useRef, useCallback } from 'react';
import pdfjsLib from 'pdfjs-dist';
import DrawingLayer from './layers/drawing';
import './correction_styles.css';
import {
  marginStyleAngle,
  marginPDFStyle,
  marginStyleBelowWindowSize,
  marginStyleAngleReverse,
} from './connstant';

// The workerSrc property shall be specified.
// pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
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
  rotation,
  splittedMedia,
  handleONSaveHW,
  initialAngle,
  restore,
  setRestore,
  zoom,
  isReset,
}) {
  // const [values, setValues] = useState({})
  const [scale] = useState(1);
  const canvasElement = useRef();
  const pageRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const imgRef = useRef(null);
  const divElement = useRef(null);
  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const hRef = useRef(0);
  const wRef = useRef(0);
  const [style, setStyle] = useState({});
  const [drawedHistory, setDrawedHistory] = useState([]);
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState(null);
  // const [cImg, setImg] = useState()

  console.log({ drawing });

  const urlCopy = url;
  const extenstion = urlCopy.split('.').pop();

  useEffect(() => {
    const canvas = canvasElement.current;

    // let offCanvas = document.getElementById('off-canvas')
    if (canvas) {
      const context = canvas.getContext('2d');
      // const offContext = offCanvas.getContext('2d')
      const pgUrl =
        splittedMedia && splittedMedia.length
          ? splittedMedia.filter((e) => e.page_number === pageNumber)[0].file_content
          : url;
      // eslint-disable-next-line no-undef

      // eslint-disable-next-line no-undef

      // eslint-disable-next-line no-undef
      var img = new Image();
      // img.src = pgUrl
      img.setAttribute('crossorigin', 'anonymous');
      //  crossOrigin = 'Anonymous';
      img.id = 'actual_image';
      // imgRef.current = img
      // window.scrollTo(0, 0)
      // img.src = pgUrl
      img.onload = function () {
        // window.alert(`${img.width}, ${img.height}`)
        let width = 0;
        let height = 0;

        width = extenstion === 'pdf' ? viewWidth : img.width;
        height = extenstion === 'pdf' ? viewHeight : img.height;

        canvas.height = height;
        canvas.width = width;
        hRef.current = height;
        wRef.current = width;

        console.log(
          img.width,
          img.height,
          img,
          canvas.width,
          canvas.height,
          'canvas',
          wRef.current,
          hRef,
          'ref'
        );

        setContainerHeight(height);
        setContainerWidth(width);
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, width, height);
        console.log({ context });
      };
      img.src = `${pgUrl}??${escape(new Date().getTime())}`;
      imgRef.current = img;
    }
  }, [angleInDegrees, extenstion, pageNumber, splittedMedia, url, viewHeight, viewWidth]);

  useEffect(() => {
    if (restore === 'undo') {
      restoreDrawing('undo');
    }
  }, [restore]);

  const restoreDrawing = (type) => {
    console.log('restore drawing', type);
    let drawingCanvas = canvasElement.current;
    if (drawedHistory.length > 1) {
      const context = drawingCanvas.getContext('2d');
      // eslint-disable-next-line no-undef
      let img = new Image();
      let selectedDrawing;
      if (type === 'undo') {
        selectedDrawing = drawedHistory[drawedHistory.length - 2];
        setDrawedHistory(drawedHistory.slice(0, -1));
      }
      img.src = selectedDrawing.image;
      console.log(
        base64StringtoFile(drawedHistory[drawedHistory.length - 2].image),
        selectedDrawing,
        'imageaFASSAFSAF'
      );
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
      // setImg(img.src)
      drawingRef.current = img;
    }
  };

  const base64StringtoFile = (base64String, filename) => {
    let arr = base64String.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    // eslint-disable-next-line no-undef
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // eslint-disable-next-line no-undef
    return new File([u8arr], filename, { type: mime });
  };

  const drawRotated = useCallback(() => {
    // let coX = '10px'
    // let ratio = '300'
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
      // ratio = (wRef.current - hRef.current) / 2 + 20
    }

    let style = {
      width: containerWidth,
      height: fullscreen ? 'calc(100vh - 46px)' : 'calc(100vh - 46px)',

      // height: 842,
      overflow: 'auto',
      // transform: `rotate(${angleInDegrees}deg)`,
      // margin: margin,
    };

    if (extenstion === 'pdf') {
      let v = marginPDFStyle[String(sX)];
      margin = '5% auto';
      // margin = sX >= 1.5 ? `${v}` : '7% auto';
      // margin = sX >= 3 ? `${v}` : '10% auto';

      style.margin = margin;
    }

    // if (hRef && hRef.current && wRef && wRef.current && extenstion !== 'pdf') {
    //   if (hRef && hRef.current && wRef && wRef.current < window.innerWidth) {
    //     if (
    //       angleInDegrees === 270 ||
    //       angleInDegrees === -270 ||
    //       angleInDegrees === 90 ||
    //       angleInDegrees === -90
    //     ) {
    //       let v = marginStyleAngle[String(sX)];
    //       margin = '32% auto';
    //       margin = sX >= 1.5 ? `${v}` : margin;
    //       style.margin = margin;
    //     } else {
    //       let v = marginStyleBelowWindowSize[String(sX)];
    //       margin = '10% auto';
    //       margin = sX >= 1.5 ? `${v}` : margin;
    //       style.margin = margin;
    //     }
    //   }
    // }

    let x = sX || 1;

    let y = sY || 1;

    style.transform =
      zoomAction === 'zoom in'
        ? `rotate(${angleInDegrees}deg) scale(${x},${y})`
        : `rotate(${angleInDegrees}deg)scale(${x},${y})`;

    setStyle(style);
  }, [angleInDegrees, containerHeight, containerWidth, extenstion, fullscreen, zoom]);

  useEffect(() => {
    drawRotated();
  }, [angleInDegrees, drawRotated]);

  useEffect(() => {
    if (pageRef && pageRef.current) {
      handleTotalPage(pageRef.current);
    }
  }, [handleTotalPage, pageRef]);

  const renderPage = useCallback(() => {
    if (canvasElement.current && url) {
      // Asynchronous download of PDF
      setIsPending(true);
      setPdfState('S');
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(
        (pdf) => {
          // Fetch the first page
          // var pageNumber = 1
          pageRef.current = pdf.numPages;
          pdf.getPage(pageNumber).then((page) => {
            var viewport = page.getViewport({ scale: scale });
            var canvas = canvasElement.current;
            if (canvas) {
              var context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              setContainerHeight(viewport.height);
              setContainerWidth(viewport.width);
              // Render PDF page into canvas context
              var renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              var renderTask = page.render(renderContext);
              renderTask.promise.then(() => {
                page.getAnnotations().then((annotations) => {
                  let newTextBoxes = [];
                  annotations.forEach((annotation) => {
                    let rect = pdfjsLib.Util.normalizeRect(
                      viewport.convertToViewportRectangle(annotation.rect)
                    );
                    newTextBoxes.push({
                      annotation,
                      rect,
                    });
                  });
                  // setTextBoxes(newTextBoxes)
                });
                setIsPending(false);
                setPdfState('C');
              });
            }
          });
        },
        function (reason) {
          // PDF loading error
          console.error(reason);
        }
      );
    }
  }, [pageNumber, scale, setIsPending, setPdfState, url]);

  useEffect(() => {
    if (extenstion === 'pdf' && splittedMedia && !splittedMedia.length) {
      renderPage();
    }
  }, [extenstion, renderPage, splittedMedia, url]);

  const canvasDrawingElement = useRef();
  const [context, setContext] = useState('');
  const [isPainting, setIsPainting] = useState(false);
  const [line, setLine] = useState([]);
  const [prevPos, setPrevPos] = useState({});
  const [drawedChanges, setDrawedChanges] = useState({});
  console.log({ drawedChanges });
  console.log({ drawedHistory });
  const drawingRef = useRef(null);
  // const [cImg, setImg] = useState()
  const enablePainting = tool === 'paint';
  const enableEraser = tool === 'eraser';
  var userStrokeStyle = 'red';

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
        // drawingCanvas.width = width;
        // drawingCanvas.height = height;
        drawingCanvas.width = containerWidth;
        drawingCanvas.height = containerHeight;
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        context.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
      });
      // setImg(img.src)
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

  const endPaintEvent = () => {
    if (isPainting) {
      setIsPainting(false);
      let drawingCanvas = canvasElement.current;
      setDrawedChanges({
        image: drawingCanvas.toDataURL(),
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
          image: drawingCanvas.toDataURL(),
          // containerImg: containerImg.toDataURL(),
          containerImg: '',
          operation: 'manualSave',
          isSaving: 'true',
          viewHeight: hRef && hRef.current,
          viewWidth: wRef && wRef.current,
        },
      ]);
      // if (extenstion === 'pdf') {
      //   onChange({ image: drawingCanvas.toDataURL(), containerImg: containerImg.toDataURL(), operation: 'autoSave' })
      // }
    }
  };

  // const drawRotated = useCallback(() => {
  //   let canvas = canvasElement.current
  //   // let drawingCanvas = canvasElement.current
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
    <div ref={divElement} style={style} id='editor-evaluvation-container'>
      {/* <img src={penTool} /> */}
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
        // ref={canvasDrawingElement}
        onMouseDown={onMouseDown}
        onMouseLeave={endPaintEvent}
        onMouseUp={endPaintEvent}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchEnd={endPaintEvent}
        className='editor-drawing-layer'
      />
      {/* <DrawingLayer
        page={pageNumber}
        drawing={drawing}
        onChange={onChange}
        enableEraser={tool === 'eraser'}
        enablePainting={tool === 'paint'}
        width={595}
        height={842}
        containerImg={canvasElement.current}
        handleSave={handleSave}
        extenstion={extenstion}
        angleInDegrees={angleInDegrees}
        viewHeight={viewHeight}
        viewWidth={viewWidth}
        refW={wRef}
        refH={hRef}
        initialAngle={initialAngle}
      /> */}
      {/* <canvas id='off-canvas' style='display: none;' /> */}
    </div>
  );
}

export default CorrectionComponent;
