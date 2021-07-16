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
  // const [cImg, setImg] = useState()

  const urlCopy = url;
  const extenstion = urlCopy.split('.').pop();

  const renderPagePdf = useCallback(() => {
    if (canvasElement.current && url) {
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(
        (pdf) => {
          pageRef.current = pdf.numPages;
          pdf.getPage(pageNumber).then((page) => {
            var viewport = page.getViewport({ scale: scale });
            setViewHeight(viewport.height);
            setViewWidth(viewport.width);
            hRef.current = viewport.height;
            wRef.current = viewport.width;
            // handleONSaveHW(viewHeight, viewWidth)
          });
        },
        function (reason) {
          // PDF loading error
          console.error(reason);
        }
      );
    }
  }, [pageNumber, scale, url]);

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

      if (extenstion === 'pdf') {
        renderPagePdf();
      }
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

        setContainerHeight(height);
        setContainerWidth(width);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = `${pgUrl}??${escape(new Date().getTime())}`;
      imgRef.current = img;
    }
  }, [
    angleInDegrees,
    extenstion,
    pageNumber,
    renderPagePdf,
    splittedMedia,
    url,
    viewHeight,
    viewWidth,
  ]);

  const drawRotated = useCallback(() => {
    // let coX = '10px'
    // let ratio = '300'
    const { sX, sY, zoomAction, m } = zoom;

    let margin = '5% 0% 0% 3%';

    if (hRef && hRef.current && wRef && wRef.current) {
      if (wRef.current > 1300) {
        margin = '5% 0% 0% 0%';
      }
      // ratio = (wRef.current - hRef.current) / 2 + 20
    }
    if (
      angleInDegrees === 270 ||
      angleInDegrees === -270 ||
      angleInDegrees === 90 ||
      angleInDegrees === -90
    ) {
      // coX = `-${ratio}px`
      margin = '32% 0% 0% 0%';
      let v = marginStyleAngle[String(sX)];
      if (sX <= 1) {
        margin = '0%';
      } else {
        margin = sX <= 1.5 ? `${v}` : margin;
      }
    } else {
      let v = marginStyleAngleReverse[String(sX)];

      margin = sX <= 1.5 ? `${v}` : margin;
    }

    let style = {
      width: containerWidth,
      height: fullscreen ? 'calc(100vh - 46px)' : 'calc(100vh - 46px)',
      overflow: 'auto',
      // transform: `rotate(${angleInDegrees}deg)`,
      margin: margin,
    };

    if (extenstion === 'pdf') {
      let v = marginPDFStyle[String(sX)];
      margin = '5% auto';
      margin = sX >= 1.5 ? `${v}` : margin;

      style.margin = margin;
    }

    if (hRef && hRef.current && wRef && wRef.current && extenstion !== 'pdf') {
      if (hRef && hRef.current && wRef && wRef.current < window.innerWidth) {
        if (
          angleInDegrees === 270 ||
          angleInDegrees === -270 ||
          angleInDegrees === 90 ||
          angleInDegrees === -90
        ) {
          let v = marginStyleAngle[String(sX)];
          margin = '32% auto';
          margin = sX >= 1.5 ? `${v}` : margin;
          style.margin = margin;
        } else {
          let v = marginStyleBelowWindowSize[String(sX)];
          margin = '10% auto';
          margin = sX >= 1.5 ? `${v}` : margin;
          style.margin = margin;
        }
      }
    }

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

  // function drawCanvasWithMagnifier (isShow, point) {
  //   Ctx.clearRect(0, 0, canvas.width, canvas.height)// Clean canvas
  //   Ctx.drawImage(img, 0, 0, canvas.width, canvas.height)// Draw an image on a canvas

  //   /* Drawing magnifiers with off-screen */
  //   if (isShow) {
  //     const { x, y } = point

  //     const mr = 50 // side length of square magnifier

  //     // (sx, sy): the starting coordinates of the image to be enlarged
  //     const sx = x - mr / 2
  //     const sy = y - mr / 2

  //     // (dx, dy): the starting coordinates of the enlarged image
  //     const dx = x - mr
  //     const dy = y - mr

  //     // The length and width of (sx, sy) on offCanvas are all square regions of Mr.
  //     // zoom in to
  //     // (dx, dy) on canvas begins with a square visible region of 2 * MR in length and width
  //     // Thus the amplification effect is realized.
  //     ctx.drawImage(offCanvas, sx, sy, mr, mr, dx, dy, 2 * mr, 2 * mr)
  //   }
  //   /*********************/
  // }

  return (
    <div ref={divElement} style={style} id='editor-evaluvation-container'>
      {/* <img src={penTool} /> */}
      <canvas
        style={{left:0, top: 0,height:'90vh',width:'auto',margin:'auto',display:'block' }}
        ref={canvasElement}
        id='editor-evaluvation-drawing-layer'
      />
      <DrawingLayer
        page={pageNumber}
        drawing={drawing}
        onChange={onChange}
        enableEraser={tool === 'eraser'}
        enablePainting={tool === 'paint'}
        width={containerWidth}
        height={containerHeight}
        containerImg={canvasElement.current}
        handleSave={handleSave}
        extenstion={extenstion}
        angleInDegrees={angleInDegrees}
        viewHeight={viewHeight}
        viewWidth={viewWidth}
        refW={wRef}
        refH={hRef}
        initialAngle={initialAngle}
      />
      {/* <canvas id='off-canvas' style='display: none;' /> */}
    </div>
  );
}

export default CorrectionComponent;
