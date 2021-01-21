import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import TextField from '@material-ui/core/TextField'
// import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import { CheckCircleOutline } from '@material-ui/icons'
import ToolModal from './toolModal'
import ImageModal from './imageModal'
import FolderType from './cardtypes/folder'
import { useHomework } from './context'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth: 345
  },
  media: {
    height: 140
  }
})

function CardItem ({ card, onClick, isLoading, remarks, setRemarks, link }) {
  const classes = useStyles()
  const [mediaType, setMediaType] = useState('img')
  const [open, setOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const homework = useHomework()

  function exitFullScreen () {
    // console.log("Exiting fullscreen...")
    try {
      if (document.fullscreenEnabled) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen().catch(e => console.log('Fullscreen issue', e))
        }
      }
    } catch (e) {
      console.log('Fullscreen issue', e)
    }
  }
  function enterFullScreen (elem = document.getElementById('correction-iframe')) {
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen().catch(e => console.log('Fullscreen issue', e))
      }
    } catch (e) {
      console.log('Fullscreen issue', e)
    }
  }

  function fullScreenAndCloseEventListener (event) {
    // can message back using event.source.postMessage(...)
    if (event.data === 'closeMe') {
      setOpen(false)
      homework.reloadContentWithUIUpdate()
    } else if (event.data === 'toggleFullscreen') {
      if (isFullScreen) {
        exitFullScreen()
        setIsFullScreen(false)
      } else {
        enterFullScreen()
        setIsFullScreen(true)
      }
    }
  }

  open && window.addEventListener('message', fullScreenAndCloseEventListener)
  !open && window.removeEventListener('message', fullScreenAndCloseEventListener)
  useEffect(() => {
    if (card.media) {
      const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
      const extension = (card.media.match(fileExtensionPattern)[0]).replace('.', '')
      if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
        setMediaType('img')
      } else if (extension === 'mp3' || extension === 'ogg') {
        setMediaType('audio')
      } else if (extension === 'mp4') {
        setMediaType('video')
      }
    }
  }, [card.media])

  return card.type === 'folder' ? <FolderType isLoading={isLoading} onClick={() => onClick()} card={card} /> : <Card className={classes.root}>
    <CardActionArea onClick={() => { card.media && mediaType === 'img' ? setOpen(true) : onClick() }}>
      <CardMedia
        className={classes.media}
        component={() => {
          if (mediaType === 'audio') {
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, width: '100%' }}><audio controls>
              <source src={card.media} type='audio/ogg' />
              <source src={card.media} type='audio/mpeg' />
          Your browser does not support the audio element.
            </audio></div>
          } else if (mediaType === 'video') {
            return <div style={{ height: 200, width: '100%' }}><video height='200' controls>
              <source src={card.media} type='video/mp4' />
              <source src={card.media} type='video/ogg' />
        Your browser does not support the video element.
            </video>
            </div>
          } else if (mediaType === 'img') {
            return <div style={{ height: 200, width: '100%', overflow: 'hidden' }}><img crossOrigin='anonymous' style={{ height: 'auto', width: '100%' }} src={card.media} /></div>
          } else {
            return null
          }
        }}
        src={card.media ? card.media : '/homework_image.jpg'}
        default=''
        title={card.content}
      />
      <CardContent style={{ display: 'flex' }}>
        {card.corrected && <div style={{ padding: 4, color: 'green' }}><CheckCircleOutline /></div>}
        <Typography gutterBottom variant='h5' component='h2'>
          {card.content}
        </Typography>
      </CardContent>
    </CardActionArea>
    <>{card.media && remarks && <CardActions>
      {card.corrected && card.review }
      {mediaType !== 'img' && !card.corrected && <TextField
        id='outlined-multiline-static'
        label='Remarks'
        onChange={(e) => {
          let value = e.target.value
          setRemarks(remarks => {
            remarks = { ...remarks }
            remarks[card.id] = value
            return remarks
          })
        }}
        value={remarks[card.id]}
        multiline
        fullWidth
        rows={4}
        variant='outlined'
      />}
    </CardActions>}</>
    {link && !card.corrected && <ToolModal link={link} onView={() => setOpen(true)} onClose={() => setOpen(false)} open={open} src={card.media} />}
    {card.corrected && <ImageModal onView={() => setOpen(true)} onClose={() => setOpen(false)} open={open} src={card.media} />}
  </Card>
}

export default CardItem
