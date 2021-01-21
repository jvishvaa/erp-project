/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { usePdf } from '@mikecousins/react-pdf'
import axios from 'axios'
import { connect } from 'react-redux'
import { Grid, makeStyles, AppBar, IconButton, Tooltip } from '@material-ui/core'
import { ArrowBack, ArrowForward, ZoomOutMap, Undo, Close } from '@material-ui/icons'
import { urls } from '../../urls'
import './canvas.css'
import AnnotateCanvas from './annotate'

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
  const [isZoomed, setZoomStatus] = useState(false)
  const [hover, setHover] = useState(false)
  const [clear, setClear] = useState(false)
  const classes = useStyles()
  const canvasRef = useRef(null)
  const { pdfDocument, pdfPage } = usePdf({
    file: props.url,
    page,
    canvasRef,
    rotate: 0

  })

  const restrictCopyAndSave = (event) => {
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false
    }
  }

  useEffect(() => {
    setClear(false)
    restrictCopyAndSave()
  }, [page, props.id])

  useEffect(() => {
    setPage(props.pageNumber)
  }, [props.pageNumber])

  const onZoomHandler = () => {
    setZoomStatus(!isZoomed)
    setHover(!hover)
  }

  const goBack = () => {
    props.goBackFunction()
    axios.post(urls.EbookUser,
      {
        page_number: page,
        ebook_id: props.id,
        user_id: JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
      }, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
      })
      .catch(error => {
        console.log(error)
      })
  }
  const handleClose = () => {
    goBack()
  }

  const deleteAnnotateData = () => {
    setClear(true)
    const canv = document.getElementById(`drawing-${page}`)
    const context = canv.getContext('2d')
    document.getElementById('clear').addEventListener('click', function () {
      context.clearRect(0, 0, canv.width, canv.height)
    })
    let deleteAnnotateURL = urls.AnnotateEbook + '?ebook_id=' + props.id + '&page_number=' + page
    console.log(props.user)
    axios.delete(deleteAnnotateURL,
      {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
      .then(res => {

      })
      .catch(error => {
        console.log(error)
      })
  }

  const dynamicPageNumber = () => {
    console.log('image rendering')
    var input = document.getElementById('dpage')
    input.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        axios.post(urls.EbookUser,
          {
            page_number: parseInt(page),
            ebook_id: props.id,
            user_id: JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
          }, {
            headers: {
              Authorization: 'Bearer ' + props.user,
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
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
                    <IconButton color='inherit' aria-label='Close'>
                      <Close onClick={handleClose} /> &nbsp; <span style={{ fontSize: '17px' }}>Close</span>
                    </IconButton>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <div className='subject-name'>
                      <h2>{props.name}</h2>
                    </div>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <ul className='marker_undo'>
                      <li>
                        <input type='range' className='js-line-range' min='3' max='72' value='1' />
                        <Tooltip title='Undo' arrow>
                          <Undo id='clear'
                            onClick={deleteAnnotateData}
                          />
                        </Tooltip>
                      </li>
                      &nbsp;
                      &nbsp;
                      <li>
                        <Tooltip title='Marker' arrow>
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
          <canvas
            id='canvastyleview'
            ref={canvasRef}
            style={{
              display: 'block',
              margin: '0 auto',
              'margin-top': isZoomed ? '18%' : '5%',
              cursor: 'pointer',
              transition: 'all 0.3s ease 0s',
              transform: isZoomed ? 'scale(1.5,1.5)' : 'scale(1,1)',
              height: '100vh'
              // 'margin-bottom': '5%',
              // top: 0,
              // position: 'absolute',
              // left: 0,
              // padding: 0,
              // bottom: 0,
              // right: 0

            }}
          />
        </div>
        <AnnotateCanvas id={props.id} page={page} zoom={isZoomed} undo={clear} pdfFile={pdfDocument} />

        <ZoomOutMap
          className='zoom-icon'
          onClick={onZoomHandler}
        />

        {pdfDocument === undefined && pdfPage === undefined
          ? <span style={{ position: 'absolute', top: '40%', left: '45%' }}>
            <div className='loader' />
          </span> : ''}

        {Boolean(pdfDocument && pdfDocument.numPages
        ) && (
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
                      setPage(Number(value) > pdfDocument.numPages ? page : value)
                      if (value) {
                        setPage(Number(value) > pdfDocument.numPages ? page : Number(value))
                      }
                    }}
                    onKeyPress={dynamicPageNumber} /> &nbsp; of &nbsp; {pdfDocument.numPages}
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <ArrowForward
                    className='next-prev right-icon'
                    fontFamily='large'
                    onClick={page === pdfDocument.numPages ? '' : () => { setPage(page + 1) }}>Next</ArrowForward>
                </Grid>
              </Grid>
            </div>
        )}
      </div>
    </Grid>
  )
}
const mapStateToProps = (state) => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(EbookPdf)
