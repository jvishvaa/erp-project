import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Typography, CardActions, Tooltip } from '@material-ui/core'
import { Brush, ArrowBack, ArrowForward, FullscreenRounded, FullscreenExitRounded, GetApp } from '@material-ui/icons'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import SinglePagePDFEdtior from '../editor/index'
import { useLockdown } from '../context/index'

// import { InternalPageStatus } from '../../../ui'

import '../editor/pdf_styles.css'
import '../journals.css'

// const theme = createMuiTheme({
//   palette: {
//     primary: '#82807f'

//   }
// })
function StudentJournal (props) {
  const containerRef = useRef()
  const [fullscreen, setFullscreen] = useState(false)
  const { tool, setTool, enableTool, onClickNext, onClickPrevious,
    getPageData, onChange, url, page, open, setOpen, formData, drawing, totalPages, loading, isPending, downloadPdfFile,
    setIsPending, getDataOnLoad,
    status } = useLockdown()
  useEffect(() => {
    console.log(window.screen.width, 'screen view')
  }, [])
  const showStartJourneyPage = () => {
    setOpen(!open)
    getPageData(page)
  }

  const handleBackButton = () => {
    setTool('')
    getDataOnLoad()
    if (fullscreen) {
      document.exitFullscreen()
      setFullscreen(false)
    }
    setOpen(!open)
  }
  function onClickFullscreen () {
    let container = containerRef.current
    if (!fullscreen) {
      container.requestFullscreen().then(() => {
        setFullscreen(true)
      })
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }
  return (
    <React.Fragment >
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: '65vh', background: 'url("/background.svg")', backgroundSize: 'cover' }}>

        <div style={{ top: fullscreen ? 0 : 64 }} className='pdf-toolbar'>
          <div style={{ display: 'block', position: 'relative', height: '100%' }} className='pdf-toolbar-left'>
            {
              !open
                ? <Button variant='contained' color='primary' style={{
                  'box-shadow': 'none',
                  'border-top-left-radius': '8px',
                  'border-top-right-radius': '8px',
                  width: '200px',
                  'border-bottom-left-radius': '0px',
                  'border-bottom-right-radius': '0px',
                  position: 'absolute',
                  background: 'rgb(69, 158, 49)',
                  bottom: 0,
                  left: 8
                }}>My LockDown Journal</Button>
                : <Button variant='contained' color='primary' style={{
                  'box-shadow': 'none',
                  'border-top-left-radius': '8px',
                  'border-top-right-radius': '8px',
                  width: 'fit-content',
                  'border-bottom-left-radius': '0px',
                  'border-bottom-right-radius': '0px',
                  position: 'absolute',
                  bottom: 0,
                  left: window.isMobile ? '-9px' : 8
                }} onClick={() => handleBackButton()}>Back</Button>
            }

          </div>

          <div style={{ display: 'flex' }} className='pdf-toolbar-right'>
            <Button onClick={() => downloadPdfFile()} aria-label='download'style={{ border: 'none', display: open ? '' : 'none' }}>
              <Tooltip title='Download' arrow>
                <GetApp />
              </Tooltip>
            </Button>

            <Button onClick={onClickPrevious} aria-label='pre'style={{ border: 'none', display: open ? '' : 'none' }}>
              <Tooltip title='Previous' arrow>
                <ArrowBack />
              </Tooltip>
            </Button>
            <Typography style={{ marginTop: '14px', display: open ? '' : 'none' }}>{page} / {totalPages}</Typography>
            <Button onClick={onClickNext} aria-label='next' style={{ border: 'none', display: open ? '' : 'none' }}>
              <Tooltip title='Next' arrow>
                <ArrowForward />
              </Tooltip>
            </Button>

            <ToggleButtonGroup exclusive value={tool} onChange={enableTool} aria-label='text formatting' >

            &nbsp;&nbsp;&nbsp;
              <ToggleButton value='paint' aria-label='paint' style={{ display: !open ? 'none' : '' }}>
                <Tooltip title='Pencil' arrow>
                  <Brush />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value='eraser' aria-label='eraser' style={{ display: !open ? 'none' : '' }}>
                <Tooltip title='Eraser' arrow>
                  <svg style={{ width: '24', height: '24' }} viewBox='0 0 24 24'>
                    <path fill='currentColor' d='M15.14,3C14.63,3 14.12,3.2 13.73,3.59L2.59,14.73C1.81,15.5 1.81,16.77 2.59,17.56L5.03,20H12.69L21.41,11.27C22.2,10.5 22.2,9.23 21.41,8.44L16.56,3.59C16.17,3.2 15.65,3 15.14,3M17,18L15,20H22V18' />
                  </svg>
                </Tooltip>
              </ToggleButton>

            </ToggleButtonGroup>
            <Button onClick={onClickFullscreen} aria-label='next' style={{ border: 'none', display: open ? '' : 'none' }} disabled={!open}>
              <Tooltip title='Full Screen' arrow>
                {fullscreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
              </Tooltip>
            </Button>
            {/* <Button onClick={onSave} aria-label='save' disabled={!open} style={{ display: open ? '' : 'none' }}>
            <Tooltip title='Save' arrow>
              <Save />
            </Tooltip>
          </Button> */}
          </div>

        </div>

        {
          !open

            ? <Card className='start__journey__card' style={{ 'box-shadow': 'none',
              'border-radius': '12px',
              alignSelf: 'center',
              justifySelf: 'center',
              maxWidth: '253px' }}>
              <div className='add__icon' onClick={() => { showStartJourneyPage() }} style={{ display: status === 'start' ? '' : 'none' }} />
              {(loading) && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 900, left: 0, top: 0, height: '100%', width: '100%', background: 'white ' }}>Loading...</div>}
              <CardActions>

                <Typography style={{ 'margin-bottom': '10px',
                  'margin-left': '10px',
                  'font-family': 'fantasy'
                }}
                // eslint-disable-next-line react/jsx-indent-props
                onClick={() => status === 'start' ? '' : showStartJourneyPage()}
                >{ status === 'start' ? 'Start journey' : 'Continue Journey'}</Typography>

              </CardActions>

            </Card>
            : <div className='lider__constent'>
              {(loading || isPending) && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 900, left: 0, top: 0, height: '100%', width: '100%', background: 'white ' }}>Loading...</div>}
              {
                url && <SinglePagePDFEdtior page={page} setIsPending={setIsPending} fullscreen={fullscreen} onChange={onChange} tool={tool} url={url} formData={formData} drawing={drawing} loader={loading} />
              }
            </div>
        }

      </div>
    </React.Fragment>
  )
}
export default StudentJournal
