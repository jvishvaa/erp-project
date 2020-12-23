/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import fileDownload from 'js-file-download';
import _ from 'lodash';

// import { urls } from "../../../../../urls";

export const DescriptiveTestContext = createContext();

export function useDescriptvieContex() {
  const context = useContext(DescriptiveTestContext);
  if (context === undefined) {
    throw new Error('error happened');
  }
  return context;
}

export function DescriptiveTestContextProvider({
  children,
  alert,
  desTestDetails,
  mediaContent,
  handleClose,
  callBackOnPageChange,
  handleSaveFile,
}) {
  const [{ asessment_response: { evaluvated_result: evlRes } = {} }] = desTestDetails;

  const [tool, setTool] = useState('');
  const [pageNumber, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [url, setUrl] = useState();
  const [drawing, setDrawing] = useState();
  const [loading, setLoading] = useState(false);
  const [mediaImg, setMedia] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [correctedPaperImg, setCorrectedPaper] = useState([]);
  const [isSaved, setisSave] = useState(false);
  const [pendingPageNumber, setPendingPageNumber] = useState();
  const [pdfState, setPdfState] = useState('NS');
  const [angleInDegrees, setAngleInDegrees] = useState(0);
  const [rotation, setRotation] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mediaId, setMediaId] = useState(0);
  const [initialAngle, setInitialAngle] = useState();
  const [splittedMedia, setSplittedMedia] = useState([]);
  const [zoom, setZoom] = useState({});
  const [isReset, setIsReset] = useState(false);
  const delayedCallback = _.debounce((data) => {
    sendFormdata(data);
  }, 2000);
  // console.log(evlRes.rotated_angle)
  // console.log()
  const enableTool = (event, updateTool) => {
    if (updateTool !== tool) {
      setTool(updateTool);
    } else {
      setTool('');
    }
  };
  const handleInitialZoom = (mode) => {
    let xA = 1.5;
    let yA = 1.5;

    let x = 0;
    let y = 0;

    if (mode === 'zoom in') {
      x = xA;
      y = yA;
    } else {
      x = 0.5;
      y = 0.5;
    }

    return { x, y };
  };

  const handleZoomINOut = (mode) => {
    let { sX, sY, m } = zoom;
    let x = 1.5;
    let y = 1.5;
    let mg = 10;
    if (zoom && Object.keys(zoom).length) {
      if (mode === 'zoom in') {
        if (sX === 0.5) {
          x = 1;
          y = 1;
        } else if (sX === 1) {
          x = 1.5;
          y = 1.5;
        } else if (sX < 1.5) {
          x = 0.1;
          y = 0.1;
          x = sX + x;
          y = sY + y;
        } else {
          x += sX;
          y += sY;
        }
      } else {
        if (sX === 1.5) {
          x = sX - 0.5;
          y = sY - 0.5;
        } else if (sX < 1.5) {
          x = 0.1;
          y = 0.1;
          if (sX === 1) {
            x = 0.5;
            y = 0.5;
          } else {
            x = sX - x;
            y = sY - y;
          }
        } else {
          x = sX - x;
          y = sY - y;
        }
      }
    } else {
      let { x, y } = handleInitialZoom(mode);
      return { x, y };
    }

    return { x, y };
  };

  const enableZoom = (event, updateTool) => {
    console.log(updateTool);
    let { x, y, mg } = handleZoomINOut(updateTool);

    setZoom({
      zoomAction: updateTool,
      sX: x,
      sY: y,
      m: mg,
    });
  };
  const enableRotation = (event, updateRotation) => {
    if (updateRotation !== rotation) {
      console.log(event, updateRotation, 'rotatt');
      if (updateRotation === 'rRight') {
        rotateClockWise();
      } else {
        rotateCounterClockWise();
      }
      // rotateClockWise()
    } else {
      setTool('');
    }
  };
  const getPaperImage = useCallback(
    (evlRes) => {
      console.log(mediaId, 'medii');
      let res =
        evlRes &&
        evlRes.filter((e) => e.actual_paper_id === mediaId)[0] &&
        evlRes.filter((e) => e.actual_paper_id === mediaId)[0].corrected_paper_image;
      // console.log(res, 'reee')
      console.log(res, 'res');
      if (!res) {
        // console.log(res, 'reee22')
        res =
          evlRes &&
          evlRes.filter((e) => e.actual_paper_id === mediaId)[0] &&
          evlRes.filter((e) => e.actual_paper_id === mediaId)[0]
            .pdf_corrected_paper_image;
        console.log(res, 'res');
      }

      return res;
    },
    [mediaId]
  );

  const reset = () => {
    setIsReset(!isReset);
  };

  const getResData = useCallback(() => {
    // eslint-disable-next-line no-debugger
    // debugger;
    const res = evlRes && evlRes.filter((e) => e.actual_paper_id === mediaId)[0];

    let angl = 0;
    let width = 0;
    let height = 0;
    console.log(res, 'res in this');
    if (res) {
      console.log(angl, 'inside');
      angl =
        res.rotated_angle === null || res.rotated_angle === undefined
          ? 0
          : res.rotated_angle;
      width = res.width || 0;
      height = res.height || 0;
    }
    console.log(angl, 'out side');

    return { angl, width, height };
  }, [evlRes, mediaId]);

  useEffect(() => {
    const {
      file_content: mediaUrl,
      id: mediaId,
      splitted_media: splittedMedia,
    } = mediaContent;
    const paperImage = getPaperImage(evlRes);
    setMediaId(mediaId);
    const { angl, width, height } = getResData();
    const totalPagesCount = splittedMedia && splittedMedia.length;
    console.log(paperImage, 'pp');
    setDrawing(paperImage);
    setUrl(mediaUrl);
    setTotalPages(totalPagesCount);
    setAngleInDegrees(angl);
    setInitialAngle(angl);
    setHeight(height);
    setWidth(width);
  }, [evlRes, getPaperImage, getResData, mediaContent]);

  function handleTotalPage(tPage) {
    setTotalPages(tPage);
  }

  function handleONSaveHW(h, w) {
    setWidth(w);
    setHeight(h);
  }

  // const getDescriptivrTestPdfPaperContent = useCallback((pagenumber) => {
  //   // setLoading(true)
  //   let path = `${urls.DescriptiveOnlineTestPdfView}?actual_paper_id=${mediaId}&page_number=${pagenumber || 1}`
  //   axios.get(path, {
  //     headers: {
  //       Authorization: 'Bearer ' + localStorage.getItem('id_token')
  //     }
  //   })
  //     .then(res => {
  //       const { data: {
  //         data: {
  //           pdf_corrected_paper_image: pdfcpImg,
  //           pdf_corrected_paper_content: pdfContent,
  //           rotted_angle: rottedAngle
  //         } = {}
  //       } = {}
  //       } = res
  //       console.log(pdfcpImg, pdfContent)
  //       setCorrectedPaper([res.data.data])
  //       setDrawing(pdfcpImg)
  //       setAngleInDegrees(rottedAngle || 0)
  //       console.log(res)
  //     })
  //     .catch(err => {
  //       setLoading(false)
  //       setAngleInDegrees(0)
  //       setCorrectedPaper()
  //       setDrawing()
  //       console.log(err)
  //     })
  // }, [mediaId])

  function rotateClockWise() {
    let anglDgree = angleInDegrees + 90;
    console.log(angleInDegrees, 'clock wise', anglDgree);
    if (anglDgree > 360) {
      setAngleInDegrees(90);
    } else {
      setAngleInDegrees(anglDgree);
    }
  }

  function rotateCounterClockWise() {
    let anglDgree = angleInDegrees - 90;
    if (anglDgree < -360) {
      setAngleInDegrees(-90);
    } else {
      setAngleInDegrees(anglDgree);
    }
  }

  function onClickNext() {
    // if (drawing) {
    //   if (pageNumber + 1 <= totalPages) {
    //     if (isPending || loading) {
    //       setPendingPageNumber(pageNumber + 1);
    //       setPage(pageNumber + 1);
    //     } else {
    //       setPage(pageNumber + 1);
    //       getDescriptivrTestPdfPaperContent(pageNumber + 1);
    //       // setFormData({})
    //       setDrawing("");
    //     }
    //   }
    // } else {
    //   alert.warning("please make changes and save");
    // }
  }

  function onClickPrevious() {
    // if (pageNumber - 1 > 0) {
    //   if (isPending || loading) {
    //     setPendingPageNumber(pageNumber - 1);
    //     setPage(pageNumber - 1);
    //   } else {
    //     setPage(pageNumber - 1);
    //     getDescriptivrTestPdfPaperContent(pageNumber - 1);
    //     // setFormData({})
    //     setDrawing("");
    //   }
    // }
  }
  useEffect(() => {
    let media = url;

    // if (pendingPageNumber && !isPending) {
    //   getDescriptivrTestPdfPaperContent(pendingPageNumber);
    //   // setFormData({})
    //   setDrawing("");
    //   setPendingPageNumber(null);
    // }
  }, [
    evlRes,
    // getDescriptivrTestPdfPaperContent,
    isPending,
    pendingPageNumber,
    url,
  ]);

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
  const sendFormdata = async (data) => {
    if (data.operation === 'manualSave') {
      setisSave(true);
      // alert.warning("wait for 10 sec updating changes ...");
    }

    if (data.viewHeight) {
      setHeight(data.viewHeight);
    }
    if (data.viewWidth) {
      setWidth(data.viewWidth);
    }

    console.log(data.viewHeight, data.viewWidth, 'eeee------>');

    const [
      { id, online_test_assessment: { assessment_id: assId } = {} } = {},
    ] = desTestDetails;
    let formdata = new FormData();
    let correctedPaper = '';
    setCorrectionLoading(true);
    const urlCopy = url;
    let extenstion = urlCopy.split('.').pop();
    let ext = extenstion === 'JPG' ? 'jpg' : extenstion;
    console.log(ext);
    window.scrollTo(0, 0);
    html2canvas(document.getElementById('editor-evaluvation-container'), {
      logging: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      // scrollY: -window.scrollY
    })
      .then((canvas) => {
        // setTimeout(() => {
        correctedPaper = canvas.toDataURL();
        // console.log(correctedPaper, '88888888888888888888888888')
        let myFilename = String(new Date().getTime()) + '.' + 'png';
        setCorrectionLoading(false);
        if (correctedPaper && data.image) {
          const fileObj = base64StringtoFile(correctedPaper, myFilename);
          formdata.set('onlinetest_instance', id);
          formdata.set('assessment_id', assId);
          if (ext === 'pdf') {
            formdata.set('page_number', pageNumber);
            formdata.set('width', data.viewWidth);
            formdata.set('height', data.viewHeight);
          }
          formdata.set('corrected_paper_image', data.image);
          formdata.set('corrected_paper', fileObj);
          formdata.set('actual_paper_id', mediaId);
          formdata.set('is_paper_corrected', 'true');
          formdata.set('rotated_angle', angleInDegrees);

          handleSaveFile(fileObj);

          //         axios
          //           .post(urls.TeacherEvalDesTest, formdata, {
          //             headers: {
          //               Authorization: "Bearer " + localStorage.getItem("id_token"),
          //               "Content-Type": "multipart/formData",
          //             },
          //           })
          //           .then((res) => {
          //             alert.success("Saved successfully");
          //             if (data.operation === "manualSave") {
          //               setisSave(false);
          //             }
          //             // console.log(res.data)
          //             const {
          //               data: {
          //                 data: [
          //                   { asessment_response: { evaluvated_result: evlRes } = {} },
          //                 ] = [],
          //               } = {},
          //             } = res;
          //             // console.log(res.data)
          //             setCorrectedPaper(evlRes);
          //             const image = getPaperImage(evlRes);
          //             // console.log(image, evlRes)
          //             setDrawing(image);
          //           })
          //           .catch((err) => {
          //             console.log(err);
          //             alert.error("Something went wrong with correction");
          //           });
        } else {
          // alert.warning("please make changes and save");
          console.log('else case triggered ', correctedPaper, data.image);
        }
        // }, 3000);
      })
      .catch((error) => console.log('error in converting to canvas', error));
    //   window.scrollTo(
    //     0,
    //     document.body.scrollHeight || document.documentElement.scrollHeight
    //   );
  };
  const onChange = (data) => {
    console.log(data, '***ad');
    const mediaImg = data.containerImg;
    setMedia(mediaImg);
    if (data.image) {
      setDrawing(data.image);
    }
    delayedCallback(data);
  };

  const getFileUrl = () => {
    let fUrl = correctedPaperImg.filter((e) => e.actual_paper_id === mediaId)[0]
      ? correctedPaperImg.filter((e) => e.actual_paper_id === mediaId)[0]
          .corrected_paper_content
      : evlRes.filter((e) => e.actual_paper_id === mediaId)[0] &&
        evlRes.filter((e) => e.actual_paper_id === mediaId)[0].corrected_paper_content;

    if (!fUrl) {
      fUrl = correctedPaperImg.filter((e) => e.actual_paper_id === mediaId)[0]
        ? correctedPaperImg.filter((e) => e.actual_paper_id === mediaId)[0]
            .pdf_corrected_paper_content
        : evlRes.filter((e) => e.actual_paper_id === mediaId)[0] &&
          evlRes.filter((e) => e.actual_paper_id === mediaId)[0]
            .pdf_corrected_paper_content;
    }

    // return fUrl;
  };

  const downloadPdfFile = (type) => {
    console.log('type** ', type);
    let media = url;
    const urlCopy = url;
    let params = '';
    let extenstion = urlCopy.split('.').pop();
    if (extenstion === 'pdf' && type === 'corrected') {
      // media = urls.imageASpdf;
      // params = { actual_paper_id: mediaId }
      // axios
      //   .get(
      //     `${urls.imageASpdf}?actual_paper_id=${mediaId}&width=${width}&height=${height}`,
      //     {
      //       responseType: "blob",
      //       headers: {
      //         Authorization: "Bearer " + localStorage.getItem("id_token"),
      //       },
      //     }
      //   )
      //   .then((res) => {
      //     fileDownload(res.data, `${type}Paper.${extenstion}`);
      //   })
      //   .catch((err) => {
      //     setLoading(false);
      //     console.log(err);
      //   });
    } else {
      if (type === 'corrected') {
        media = getFileUrl();
        //for testing
        media =
          'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg';
      }
      const method = 'GET';
      const url = media;
      axios
        .request({
          url,
          method,
          responseType: 'blob',
        })
        .then(({ data }) => {
          fileDownload(data, `${type}Paper.${extenstion}`);
          // fileDownload(data, `Paper.JPG`);
        });
    }
    setIsDownloaded(!isDownloaded);
  };

  return (
    <DescriptiveTestContext.Provider
      value={{
        setTool,
        tool,
        enableTool,
        url,
        onChange,
        pageNumber,
        open,
        setOpen,
        drawing,
        loading,
        downloadPdfFile,
        handleClose,
        correctionLoading,
        isDownloaded,
        isSaved,
        alert,
        onClickPrevious,
        onClickNext,
        handleTotalPage,
        totalPages,
        setIsPending,
        setPdfState,
        rotation,
        enableRotation,
        angleInDegrees,
        splittedMedia,
        handleONSaveHW,
        initialAngle,
        zoom,
        reset,
        isReset,
        enableZoom,
      }}
    >
      {children}
    </DescriptiveTestContext.Provider>
  );
}
