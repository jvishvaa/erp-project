/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
// import axios from 'axios'
import axiosInstance from '../../config/axios';
import { connect } from 'react-redux'
import { Grid, makeStyles, AppBar, IconButton, Tooltip } from '@material-ui/core'
import { ArrowBack, ArrowForward, ZoomOutMap, Undo, Close } from '@material-ui/icons'
import endpoints from '../../config/endpoints';
import './canvas.css'
// import axios from 'axios';
// import AnnotateCanvas from './annotate'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  pager: {
    listStyleType: 'none',
    display: 'flex',
    margin: '0 auto',
    padding: '10px'
  },
  Button: {
    color: '#fff'
  },
  largeIcon: {
    width: 60,
    height: 60
  }
}))
const EbookPdf = (props) => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isZoomed, setZoomStatus] = useState(false)
  const [hover, setHover] = useState(false)
  const classes = useStyles()
  const [bookPage, setBookPage] = useState('')
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [domineName, setDomineName] = useState('')
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const restrictCopyAndSave = (event) => {
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false
    }
  }
  const drawing = useCallback(() => {
    var canvas = document.getElementById(`drawing-${page}`)
    var contextCopy = canvas.getContext('2d')

    var x, y
    const startDrawing = event => {
      isMouseDown = true;
      [x, y] = [event.offsetX, event.offsetY]
    }

    const colorPicker = document.querySelector('.js-color-picker')
    colorPicker.addEventListener('change', event => {
      // setting pencil color

      contextCopy.strokeStyle = event.target.value
    })

    contextCopy.lineCap = 'round'
    const lineWidthRange = document.querySelector('.js-line-range')
    lineWidthRange.addEventListener('input', () => {
      contextCopy.lineWidthLabel = 0.005 * canvas.width
    })

    const drawLine = event => {
      if (isMouseDown) {
        const newX = event.offsetX
        const newY = event.offsetY
        contextCopy.beginPath()
        contextCopy.moveTo(x, y)
        contextCopy.lineTo(newX, newY)
        contextCopy.stroke()
        x = newX
        y = newY
      }
    }
    let isMouseDown = false

    const stopDrawing = () => {
      isMouseDown = false
      let data = canvas.toDataURL()
      let data1 =
            {
              'anotate_image': data,
              'ebook_id': props.id,
              'page_number': page,
              'top_position': x,
              'left_position': y,
              'type_of_activity': 0
            }
      let AnnotateURL = `${endpoints.ebook.AnnotateEbook}?ebook_id=${props.id}`
      axiosInstance
      .post(AnnotateURL, data1)
        .then(res => {
        })
        .catch(error => {
          console.log(error)
        })
    }

    canvas.removeEventListener('mousedown', startDrawing)
    canvas.removeEventListener('mousemove', drawLine)
    canvas.removeEventListener('mouseup', stopDrawing)

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', drawLine)
    canvas.addEventListener('mouseup', stopDrawing)
  }, [props.id, page, props.user])

  useEffect(() => {
    const {host}= new URL(axiosInstance.defaults.baseURL) // "dev.olvorchidnaigaon.letseduvate.com"
    const hostSplitArray = host.split('.')
    const subDomainLevels = hostSplitArray.length - 2
    let domain = ''
    let subDomain = ''
    let subSubDomain = ''
    if(hostSplitArray.length > 2){
        domain = hostSplitArray.slice(hostSplitArray.length-2).join('')
    }
    if(subDomainLevels === 2){
        subSubDomain = hostSplitArray[0]
        subDomain = hostSplitArray[1]
    } else if(subDomainLevels === 1){
        subDomain = hostSplitArray[0]
    }
    const domainTobeSent = subDomain 
    setDomineName(domainTobeSent);
  },[])
  useEffect(() => {
    // setClear(false)
    restrictCopyAndSave()
  }, [page, props.id])

  useEffect(() => {
    setPage(props.pageNumber)
  }, [props.pageNumber])

  useEffect(() => {
    if(props.id) {
      getSplittedImages();
    }
  }, [page, props.id, height, width])

  const getSplittedImages = useCallback(() => {
    if(props.id && page) {
    let imgUrl = `${endpoints.ebook.AnnotateEbook}?ebook_id=${props.id}&page_number=${page}`
    setLoading(true)
    axiosInstance
      .get(imgUrl)
      .then(res => {
        setLoading(false)
        setBookPage(res.data.ebook_image)
        setTotalPages(res.data.total_page)
        let canvas = document.getElementById(`drawing-${page}`)
        let pageCanvas = document.getElementById('canvastyleview')
        console.log(pageCanvas, pageCanvas.width, pageCanvas.height)
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');
        if (res.data.anotate_image !== undefined && res.data.anotate_image && res.data.anotate_image) {
          context.clearRect(0, 0, canvas.width, canvas.height)
          // eslint-disable-next-line no-undef
          let imgObj = new Image()
          imgObj.src = res.data.anotate_image
          imgObj.onload = () => {
            canvas.width = width
            canvas.height = height
            context.drawImage(imgObj, 0, 0, canvas.width, canvas.height)
          }
        }
        drawing()
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
    }
  }, [props.id, page, height, width])
  const onZoomHandler = () => {
    setZoomStatus(!isZoomed)
    setHover(!hover)
  }

  const goBack = () => {
    axiosInstance
    .post(`${endpoints.ebook.EbookUser}`,
      {
        page_number: page,
        ebook_id: props.id,
        user_id: localStorage.getItem('userDetails') &&
        JSON.parse(localStorage.getItem('userDetails'))?.user_id,
      })
      .then(res => {
        props.goBackFunction();
      })
      .catch(error => {
        console.log(error)
      })
  }
  const handleClose = () => {
    goBack()
  }

  const deleteAnnotateData = () => {
    const canv = document.getElementById(`drawing-${page}`)
    const context = canv.getContext('2d')
    document.getElementById('clear').addEventListener('click', function () {
      context.clearRect(0, 0, canv.width, canv.height)
    })
    let deleteAnnotateURL = endpoints.ebook.AnnotateEbook + '?ebook_id=' + props.id + '&page_number=' + page
    axiosInstance
    .delete(deleteAnnotateURL)
      .then(res => {
      })
      .catch(error => {
        console.log(error)
      })
  }

  const dynamicPageNumber = () => {
    var input = document.getElementById('dpage')
    input.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        getSplittedImages()
      }
    })
  }

  const detectImageLoad = ({ target: img }) => {
    setLoading(false)
    setWidth(img.offsetWidth)
    setHeight(img.offsetHeight)
  }

  return (
    <Grid>
      <div style={{ height: '300px' }} >
        {
          hover ? ' '
            : <AppBar>
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4} md={4}>
                    <IconButton color='inherit' aria-label='Close'  style={{ color: 'white' }}>
                      <Close onClick={handleClose} /> &nbsp; <span onClick={handleClose} style={{ fontSize: '17px' }}>Close</span>
                    </IconButton>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <div className='subject-name'>
                      <h2 style={{ 'text-transform': 'capitalize' }}>{props.name}</h2>
                    </div>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <ul className='tools__annotate'>
                      <li>
                        <input type='range' className='js-line-range' min='3' max='72' value='1' />
                        <Tooltip title='Undo' arrow style={{ color: 'white', cursor: 'pointer' }}>
                          <Undo id='clear' onClick={deleteAnnotateData} />
                        </Tooltip>
                      </li>
                      &nbsp;
                      &nbsp;
                      <li>
                        <Tooltip title='Marker' arrow style={{ color: 'white' }}>
                          <input type='color' className='js-color-picker color-picker' />
                        </Tooltip>
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </div>
            </AppBar>
        }
        <div id='background__pdf'>

          {
            loading
              ? <span style={{ position: 'absolute', top: '40%', left: '45%' }}>
                <div className='loader' />
              </span>
              : <div>
                <img
                  onLoad={detectImageLoad}
                  src={bookPage}
                  id='canvastyleview'
                  alt='No image'

                  style={{
                    display: 'block',
                    margin: '0 auto',
                    'margin-top': isZoomed ? '18%' : '5%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease 0s',
                    transform: isZoomed ? 'scale(1.5,1.5)' : 'scale(1,1)',
                    height: '100vh'

                  }}
                />

              </div>
          }
          <canvas
            className='drwaing-resposive'
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
              ' margin-left': 'auto',
              'margin-right': 'auto',
              // 'margin-bottom': '5%',
              cursor: 'pointer',
              transition: 'all 0.3s ease 0s',
              'margin-top': isZoomed ? '18%' : '5%',
              // backgroundColor: '#ff000045',
              // height: '100vh',
              transform: isZoomed ? 'scale(1.5,1.5)' : 'scale(1,1)'
            }}
          />
        </div>
        {/* {
          !loading && bookPage ? <AnnotateCanvas id={props.id} page={page} zoom={isZoomed} undo={clear} pdfFile={bookPage} height={height} width={width} />
            : ''
        } */}

        <ZoomOutMap
          className='zoom-icon'
          onClick={onZoomHandler}
        />
        {

          hover ? ''
            : <div className='pager-coustom'>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={4} md={4}>
                  <ArrowBack
                    className='next-prev left-icon'
                    disabled={page === 1}
                    onClick={page === 1 ? '' : () => {
                      setPage(page - 1)
                    }}>previous
                  </ArrowBack>
                </Grid>
                <Grid item xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
              Page &nbsp;
                  <input id='dpage' type='text'
                    value={page}
                    onChange={(event) => {
                      const { value } = event.target
                      setPage(Number(value) > totalPages ? page : value)
                      if (value) {
                        setPage(Number(value) > totalPages ? page : Number(value))
                      }
                    }}
                    onKeyPress={dynamicPageNumber} /> &nbsp; of &nbsp; {totalPages}
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <ArrowForward
                    className='next-prev right-icon'
                    fontFamily='large'
                    onClick={page === totalPages ? '' : () => { setPage(page + 1) }}>Next</ArrowForward>
                </Grid>
              </Grid>
            </div>
        }

      </div>
    </Grid>
  )
}
const mapStateToProps = (state) => ({
  // user: state.authentication.user
})
export default connect(mapStateToProps)(EbookPdf)
