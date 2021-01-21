import React, { useState } from 'react'
import {
  makeStyles,
  Grid
} from '@material-ui/core'
import axios from 'axios'

import CustomVideoPlayer from './customVideoPlayer'
import { ExternalBase } from '../core'
import { urls } from '../../urls'

const useStyle = makeStyles(() => ({
  videoPlayer: {
    width: '100%',
    margin: 'auto'
  }
}))

const ExternalVideoPlayer = (props) => {
  const [completedStatus, setCompletedStatus] = useState(false)

  const classes = useStyle()

  const timeChangeHandler = (event) => {
    const percentComplete = (event.target.currentTime / event.target.duration) * 100

    if (percentComplete > 80 && !completedStatus) {
      console.log('60 percent done')
      setCompletedStatus(true)
      const params = {
        id: props.id,
        tok: props.token,
        status: 'finished'
      }
      axios.get(`${urls.VideoSourceUrl}`, {
        params
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.error(err)
      })
    }
  }
  return (
    <ExternalBase title='OMS Player'>
      <Grid container justify='center' style={{ height: '100%' }}>
        <Grid item xs={12} md={6}>
          <CustomVideoPlayer
            src={props.src}
            className={classes.videoPlayer}
            nonDownloadable
            onTimeUpdate={timeChangeHandler}
          />
        </Grid>
      </Grid>
    </ExternalBase>
  )
}

export default ExternalVideoPlayer
