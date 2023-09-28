import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { ArrowBack, ArrowForward, ZoomOutMap, Undo, Close } from '@material-ui/icons';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import {
  LeftOutlined,
  EditOutlined,
  ClearOutlined,
  CloseSquareOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, Select, Menu, message, Tooltip, Form } from 'antd';
import clsx from 'clsx';
import { Pagination } from 'antd';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import './canvas.css';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  pager: {
    listStyleType: 'none',
    display: 'flex',
    margin: '0 auto',
    padding: '10px',
  },
  Button: {
    color: '#fff',
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  pagercoustom: {
    display: 'flex',
    margin: '0px',
    padding: '10px',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    position: 'fixed',
    width: '100%',
    bottom: 0,
  },
}));
const EbookPdf = (props) => {
  const [page, setPage] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isZoomed, setZoomStatus] = useState(false);
  const [hover, setHover] = useState(false);
  const classes = useStyles();
  const [bookPage, setBookPage] = useState('');
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [mode, _setMode] = useState('pen');
  const modeRef = useRef('pen');
  const [domineName, setDomineName] = useState('');

  useEffect(() => {
    const { host } = new URL(axiosInstance.defaults.baseURL);
    const hostSplitArray = host.split('.');
    const subDomainLevels = hostSplitArray.length - 2;
    let domain = '';
    let subDomain = '';
    let subSubDomain = '';
    if (hostSplitArray.length > 2) {
      domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
    }
    if (subDomainLevels === 2) {
      subSubDomain = hostSplitArray[0];
      subDomain = hostSplitArray[1];
    } else if (subDomainLevels === 1) {
      subDomain = hostSplitArray[0];
    }
    const domainTobeSent = subDomain;
    setDomineName(domainTobeSent);
  });

  const restrictCopyAndSave = (event) => {
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false;
    };
  };

  const setMode = (value) => {
    modeRef.current = value;
    _setMode(value);
  };

  const drawing = useCallback(() => {
    const canvas = document.getElementById(`drawing-${page}`);
    const contextCopy = canvas.getContext('2d');
    let isMouseDown = false;
    let x;
    let y;

    const startDrawing = (event) => {
      isMouseDown = true;
      [x, y] = [event.offsetX, event.offsetY];
    };

    const colorPicker = document.querySelector('.js-color-picker');
    colorPicker.addEventListener('change', (event) => {
      contextCopy.strokeStyle = event.target.value;
    });

    const drawLine = (event) => {
      if (isMouseDown) {
        if (modeRef.current === 'pen') {
          const newX = event.offsetX;
          const newY = event.offsetY;
          contextCopy.globalCompositeOperation = 'source-over';
          contextCopy.beginPath();
          contextCopy.moveTo(x, y);
          contextCopy.lineTo(newX, newY);
          contextCopy.stroke();
          x = newX;
          y = newY;
        } else {
          contextCopy.globalCompositeOperation = 'destination-out';
          const newX = event.offsetX;
          const newY = event.offsetY;
          contextCopy.arc(newX, newY, 8, 0, Math.PI * 2, false);
          contextCopy.fill();
          x = newX;
          y = newY;
        }
      }
    };

    contextCopy.lineCap = 'round';
    const lineWidthRange = document.querySelector('.js-line-range');
    lineWidthRange.addEventListener('input', () => {
      contextCopy.lineWidthLabel = 0.005 * canvas.width;
    });

    const stopDrawing = () => {
      isMouseDown = false;
      const data = canvas.toDataURL();
      const data1 = {
        anotate_image: data,
        ebook_id: props.id,
        page_number: page,
        top_position: x,
        left_position: y,
        type_of_activity: 0,
      };
      const AnnotateURL = `${endpoints.ebook.AnnotateEbook}?ebook_id=${props.id}`;
      axiosInstance
        .post(AnnotateURL, data1)
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    };
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('mouseup', stopDrawing);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
  }, [props.id, page, height, width, mode, props.user]);

  useEffect(() => {
    restrictCopyAndSave();
  }, [props.id, page, height, width, mode]);

  useEffect(() => {
    if (props?.recently == true) {
      console.log(props);
      setPage(props?.pageNumber);
    } else {
      setPage(1);
    }
  }, []);

  const getSplittedImages = useCallback(() => {
    if (props.id && page) {
      const imgUrl = `${endpoints.ebook.AnnotateEbook}?ebook_id=${props.id}&page_number=${page}`;
      setLoading(true);
      axiosInstance
        .get(`${imgUrl}`)
        .then((res) => {
          setBookPage(res.data.ebook_image);
          setTotalPages(res.data.total_page);
          setLoading(false);
          const canvas = document.getElementById(`drawing-${page}`);
          const pageCanvas = document.getElementById('canvastyleview');
          console.log(pageCanvas, pageCanvas.width, pageCanvas.height, res);
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if (
            res.data.anotate_image !== undefined &&
            res.data.anotate_image &&
            res.data.anotate_image
          ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const imgObj = new Image();
            imgObj.src = res.data.anotate_image;
            imgObj.onload = () => {
              canvas.width = width;
              canvas.height = height;
              context.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
            };
          }
          drawing();
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [props.id, page, height, width]);

  const onZoomHandler = () => {
    setZoomStatus(!isZoomed);
    setHover(!hover);
  };

  useEffect(() => {
    if (props.id) {
      getSplittedImages();
    }
  }, [props.id, page, height, width]);

  const goBack = () => {
    axiosInstance
      .post(`${endpoints.ebook.EbookUser}`, {
        page_number: page,
        ebook_id: props.id,
        user_id:
          localStorage.getItem('userDetails') &&
          JSON.parse(localStorage.getItem('userDetails'))?.user_id,
      })
      .then((res) => {
        props.goBackFunction();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClose = () => {
    goBack();
  };

  const deleteAnnotateData = () => {
    const canv = document.getElementById(`drawing-${page}`);
    const context = canv.getContext('2d');
    document.getElementById('clear').addEventListener('click', function () {
      context.clearRect(0, 0, canv.width, canv.height);
    });
    const deleteAnnotateURL = `${endpoints.ebook.AnnotateEbook}?ebook_id=${props.id}&page_number=${page}`;
    axiosInstance
      .delete(deleteAnnotateURL)
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const dynamicPageNumber = () => {
    const input = document.getElementById('dpage');
    input.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });
  };

  const detectImageLoad = ({ target: img }) => {
    setLoading(false);
    setWidth(img.offsetWidth);
    setHeight(img.offsetHeight);
  };

  const handlePage = (e) => {
    console.log(e);
    setPage(e);
    props.getPageNum(e);
  };

  let rightClick = document.getElementsByClassName('anticon anticon-right');
  let leftClick = document.getElementsByClassName('anticon anticon-left');

  document.onkeydown = function (e) {
    console.log(e);
    if (e?.keyCode == 39) {
      console.log(rightClick, 'right');
      if (isZoomed == false) {
        rightClick[1].click();
      } else {
        handlePage(page + 1);
      }
    }
    if (e?.keyCode == 37) {
      console.log(leftClick, 'left');
      if (isZoomed == false) {
        leftClick[1].click();
      } else {
        handlePage(page - 1);
      }
    }
  };

  return (
    <Grid>
      <div style={{ height: '300px' }}>
        {hover ? (
          ''
        ) : (
          <div className={classes.root} id='pdfviewhead'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#e7e7e7',
                position: 'fixed',
                top: '0',
                width: '100%',
              }}
            >
              <div
                style={{ width: '15%', display: 'flex', justifyContent: 'space-around' }}
              >
                <Button
                  onClick={() => setMode('pen')}
                  shape='circle'
                  icon={<EditOutlined />}
                  className={clsx(classes.backButton)}
                  style={{
                    fontSize: '25px',
                    color: mode === 'pen' ? '#40a9ff' : 'black',
                    borderColor: mode === 'pen' ? '#40a9ff' : 'black',
                  }}
                />
                <Button
                  onClick={() => setMode('eraser')}
                  shape='circle'
                  icon={<ClearOutlined />}
                  className={clsx(classes.backButton)}
                  style={{
                    fontSize: '25px',
                    color: mode === 'eraser' ? '#40a9ff' : 'black',
                    borderColor: mode === 'eraser' ? '#40a9ff' : 'black',
                  }}
                />
                <input
                  type='range'
                  className='js-line-range'
                  min='3'
                  max='72'
                  value='1'
                />
                {/* <Tooltip
                  title='Undo'
                  arrow
                  style={{ color: 'white', cursor: 'pointer' }}
                > */}
                {/* <Undo id='clear' onClick={deleteAnnotateData} /> */}
                <Button
                  onClick={deleteAnnotateData}
                  id='clear'
                  shape='circle'
                  icon={<UndoOutlined />}
                  className={clsx(classes.backButton)}
                  style={{
                    fontSize: '25px',
                    // color: '#40a9ff',
                    // borderColor: '#40a9ff',
                  }}
                />
                {/* </Tooltip> */}
                <Tooltip title='Marker' arrow style={{ color: 'white' }}>
                  <input type='color' className='js-color-picker color-picker' />
                </Tooltip>
              </div>
              <div>
                <Button
                  icon={<CloseSquareOutlined />}
                  onClick={() => props.goBackFunction()}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className='subject-name'>
              <h2 style={{ 'text-transform': 'capitalize', color: 'black' }}>
                {props.name}
              </h2>
            </div>
          </div>
        )}
        <div id='background__pdf'>
          {loading ? (
            <span style={{ position: 'absolute', top: '40%', left: '45%' }}>
              <div className='loader' />
            </span>
          ) : (
            <div>
              <img
                onLoad={detectImageLoad}
                src={`${endpoints.centralBucket}/${bookPage}`}
                id='canvastyleview'
                alt='No'
                style={{
                  display: 'block',
                  margin: '0 auto',
                  'margin-top': isZoomed ? '18%' : '5%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease 0s',
                  transform: isZoomed ? 'scale(1.5,1.5)' : 'scale(1,1)',
                  height: '80vh',
                }}
              />
            </div>
          )}
          <canvas
            className={mode === 'pen' ? 'drwaing-resposive' : 'drwaing-resposive1'}
            id={`drawing-${page}`}
            key={`drawing-${page}`}
            style={{
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: 'transparent',
              margin: '0 auto',
              marginLeft: 'auto',
              marginRight: 'auto',
              transition: 'all 0.3s ease 0s',
              'margin-top': isZoomed ? '18%' : '5%',
              transform: isZoomed ? 'scale(1.5,1.5)' : 'scale(1,1)',
            }}
          />
        </div>
        <ZoomInIcon className='zoom-icon' onClick={onZoomHandler} />
        {hover ? (
          ''
        ) : (
          <>
            {console.log(totalPages)}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'fixed',
                bottom: '0',
                width: '100%',
                background: '#e7e7e7',
              }}
            >
              <span>Page</span>
              <Pagination
                simple
                showSizeChanger={false}
                current={page}
                total={totalPages}
                defaultPageSize={1}
                onChange={handlePage}
                size='default'
              />
            </div>
            {/* <div className={classes.pagercoustom}>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={4} md={4}>
                <ArrowBack
                  style={{ color: 'white' }}
                  className='next-prev left-icon'
                  disabled={page === 1}
                  onClick={
                    page === 1
                      ? ''
                      : () => {
                        if (page > 1) {
                          setPage(page - 1);
                        }
                      }
                  }
                >
                  previous
                </ArrowBack>
              </Grid>
              <Grid item xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
                Page &nbsp;
                <input
                  id='dpage'
                  type='text'
                  value={page}
                  onChange={(event) => {
                    const { value } = event.target;
                    setPage(
                      Number(value) > totalPages
                        ? page
                        : Number(value.replace(/[^\w\s]/gi, ''))
                    );
                    if (value) {
                      setPage(
                        Number(value) > totalPages
                          ? page
                          : Number(value.replace(/[^\w\s]/gi, ''))
                      );
                    }
                  }}
                  onKeyPress={dynamicPageNumber}
                />
                &nbsp; of &nbsp;
                {totalPages}
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <ArrowForward
                  style={{ color: 'white' }}
                  className='next-prev right-icon'
                  fontFamily='large'
                  onClick={
                    page === totalPages
                      ? ''
                      : () => {
                        setPage(page + 1);
                      }
                  }
                >
                  Next
                </ArrowForward>
              </Grid>
            </Grid>
          </div> */}
          </>
        )}
      </div>
    </Grid>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(EbookPdf);
