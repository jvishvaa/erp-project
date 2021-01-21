import React, { useCallback, useState, useRef } from 'react'
import { Grid, Card, DialogActions, CardContent,
  Typography, Button, Dialog, DialogContent,
  ListItemText, ListItem, Input,
  Slider, DialogTitle, ListItemIcon } from '@material-ui/core'
import { GraphicEq } from '@material-ui/icons'
import ReactHtmlParser from 'react-html-parser'
import moment from 'moment'

function transform (node, index) {
  if (node.type === 'tag' && node.name === 'img') {
    return <img src={node.attribs.src} style={{ width: 100, height: 100 }} />
  }
}
export default function EventEditor ({ activeEvent, questions, updateQuestions, updateEvents, file }) {
  const [limits, setLimits] = useState({ max: 0, min: 0 })
  const [actualRef, setActualRef] = useState()
  const canvasRef = useRef()
  const videoRef = useCallback(node => {
    if (node !== null) {
      let video = node
      console.log('Video loaded', video, video.duration)
      video.oncanplay = (event) => {
        setLimits({ max: video.duration, min: 0 })
      }
      setActualRef(node)
    }
  }, [])

  function onSliderChange (event, value) {
    actualRef.currentTime = value
    activeEvent.timestamp = value
    let video = actualRef
    let canvas = canvasRef.current
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  }

  return <div>
    <Dialog
      fullWidth
      maxWidth={'xl'}
      aria-labelledby='simple-dialog-title' open>
      <DialogTitle id='simple-dialog-title'>Add Quiz To Timeline</DialogTitle>
      <DialogContent dividers={'paper'}>
        <Grid container>
          <Grid xs={4} item>
            <video ref={videoRef} id='myVideo' width='320' height='176' controls>
              <source src={URL.createObjectURL(file)} type='video/mp4' />
              {/* <source src='mov_bbb.ogg' type='video/ogg' /> */}
        Your browser does not support HTML5 video.
            </video>
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={8} item>
            <Typography variant='p' component='p'>
              Select Time
            </Typography>
            <Slider
              onChange={(event, newValue) => { console.log(videoRef.current, newValue); actualRef.currentTime = newValue; activeEvent.timestamp = newValue }}
              valueLabelDisplay='on'
              track={false}
              min={limits.min}
              max={limits.max}
              aria-labelledby='track-false-slider'
              value={activeEvent.timestamp}
              valueLabelFormat={(sec) => {
                let formatted = moment('1900-01-01 00:00:00').add(sec, 'seconds').format('HH:mm:ss')
                if (Number(formatted[0]) === 0 && Number(formatted[1]) === 0) {
                  return formatted.substring(3)
                }
                return formatted
              }}
            />
          </Grid>
        </Grid>
        {questions && questions.map(question => {
          console.log(question)
          return <div>

            <Card style={{ margin: 8 }}>
              <CardContent>
                <Grid container>
                  <Grid xs={6} item>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {ReactHtmlParser(question.question, {
                        transform: transform
                      })}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' component='p'>
                      {
                        question.options && Object.values(question.options).map(option => {
                          return <ListItem>
                            <ListItemIcon><GraphicEq /></ListItemIcon>
                            <ListItemText primary={ReactHtmlParser(option)} />
                          </ListItem>
                        })}
                    </Typography>
                  </Grid>
                  <Grid xs={4} item>
                    <Slider
                      onChange={onSliderChange}
                      valueLabelDisplay='on'
                      track={false}

                      min={limits.min}
                      max={limits.max}
                      aria-labelledby='track-false-slider'
                      value={activeEvent.timestamp}
                      valueLabelFormat={(sec) => {
                        let formatted = moment('1900-01-01 00:00:00').add(sec, 'seconds').format('HH:mm:ss')
                        if (Number(formatted[0]) === 0 && Number(formatted[1]) === 0) {
                          return formatted.substring(3)
                        }
                        return formatted
                      }}
                    />
                  </Grid>
                  <Grid xs={2} item>
                    <Input
                      value={activeEvent.timestamp}
                      margin='dense'
                      inputProps={{
                        step: 10,
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                  <Grid xs={2} item>
                    <canvas width={100} height={100} ref={canvasRef} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card></div>
        })}

      </DialogContent>        <DialogActions>
        <Button onClick={() => updateEvents(activeEvent)} > Close </Button>
      </DialogActions></Dialog>
  </div>
}
