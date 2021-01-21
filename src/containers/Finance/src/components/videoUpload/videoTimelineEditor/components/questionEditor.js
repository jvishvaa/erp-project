import React, { useCallback, useState, useRef, useEffect } from 'react'
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
export default function QuestionsEditor ({ questions, cancel, setQuestions, file, alert }) {
  const [limits, setLimits] = useState({ max: 0, min: 0 })
  const [actualRef, setActualRef] = useState()
  const canvasRef = useRef()
  const [updatedQuestions, setUpdatedQuestions] = useState([])

  useEffect(() => {
    if (Array.isArray(questions)) {
      let newQuestions = questions.map(question => ({ ...question }))
      setUpdatedQuestions([...newQuestions])
    }
  }, [questions])
  const videoRef = useCallback(node => {
    if (node !== null) {
      let video = node
      video.oncanplay = (event) => {
        setLimits({ max: video.duration, min: 0 })
      }
      setActualRef(node)
    }
  }, [])
  function onSaveChanges () {
    let hasZeros = false
    updatedQuestions.forEach(question => {
      if (question.timestamp === 0) {
        hasZeros = true
      }
    })
    if (hasZeros) {
      if (window.confirm('Some questions have 00:00:00 as the timestamp. They will be shown at the beginning of the video. Are you sure you want to continue?')) {
        setQuestions(updatedQuestions)
      }
    } else {
      setQuestions(updatedQuestions)
    }
  }

  function cancelChanges () {
    cancel()
  }
  function onSliderChange (event, value, index) {
    let newUpdatedQuestions = [...updatedQuestions]
    if (!isNaN(value) && value < limits.max) {
      actualRef.currentTime = parseFloat(value)
      let video = actualRef
      let canvas = canvasRef.current
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      newUpdatedQuestions[index].image = canvas.toDataURL()
      newUpdatedQuestions[index].timestamp = value
      setUpdatedQuestions(newUpdatedQuestions)
    }
  }

  return <div>
    <Dialog
      fullWidth
      maxWidth={'xl'}
      aria-labelledby='simple-dialog-title' open>
      <DialogTitle id='simple-dialog-title'>Assign Questions To Timeline</DialogTitle>
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
            <Slider
              valueLabelDisplay='on'
              track={false}
              disabled
              min={limits.min}
              max={limits.max}
              value={updatedQuestions.map(question => question.timestamp)}
              aria-labelledby='track-false-slider'
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
        {updatedQuestions && updatedQuestions.map((question, index) => {
          return <div>
            <Card style={{ margin: 8 }}>
              <CardContent>
                <Grid direction='column' container>
                  <Grid item>

                    <Typography gutterBottom variant='h5' component='h2'>
                      {index + 1} {')'} {ReactHtmlParser(question.question, {
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
                  <Grid container item>
                    <Grid style={{ padding: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={6} item>
                      <Slider
                        onChange={(event, value) => onSliderChange(event, value, index)}
                        valueLabelDisplay='on'
                        track={false}
                        min={limits.min}
                        max={limits.max}
                        value={question.timestamp}
                        aria-labelledby='track-false-slider'
                        valueLabelFormat={(sec) => {
                          let formatted = moment('1900-01-01 00:00:00').add(sec, 'seconds').format('HH:mm:ss')
                          if (Number(formatted[0]) === 0 && Number(formatted[1]) === 0) {
                            return formatted.substring(3)
                          }
                          return formatted
                        }}
                      />
                    </Grid>
                    <Grid style={{ padding: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={2}>
                      <Input
                        margin='dense'
                        fullWidth
                        onChange={(e) => {
                          let value = e.target.value
                          let a = value.split(':')
                          let seconds = 0
                          if (a.length === 3) {
                            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
                          } else if (a.length === 2) {
                            seconds = (+a[0]) * 60 + (+a[1])
                          }
                          onSliderChange(e, seconds, index)
                        }}
                        value={moment('1900-01-01 00:00:00').add(question.timestamp, 'seconds').format('HH:mm:ss')}
                        inputProps={{
                          step: 1,
                          min: moment('1900-01-01 00:00:00').add(limits.min, 'seconds').format('HH:mm:ss'),
                          max: moment('1900-01-01 00:00:00').add(limits.max, 'seconds').format('HH:mm:ss'),
                          type: 'time',
                          'aria-labelledby': 'input-slider'
                        }}
                      />
                    </Grid>
                    <Grid xs={2} item>
                      <img src={question.image} width={'100px'} height={'auto'} />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card></div>
        })}

      </DialogContent>
      <DialogActions>
        <Button onClick={onSaveChanges}> ASSIGN </Button>
        <Button onClick={cancelChanges}> CANCEL </Button>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogActions>
    </Dialog>
  </div>
}
