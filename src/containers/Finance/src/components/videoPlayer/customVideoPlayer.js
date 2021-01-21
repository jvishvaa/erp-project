import React from 'react'
import {
  Typography,
  LinearProgress
} from '@material-ui/core'

const CustomVideoPlayer = ({
  src,
  nonDownloadable,
  forwardRef,
  ...props
}) => {
  return (
    <React.Fragment>
      {
        src && src.length ? (
          <video
            width='400'
            controls
            style={{ ...props.style }}
            className={props.className}
            controlsList={nonDownloadable ? 'nodownload' : 'download'}
            ref={forwardRef}
            {...props}
          >
            <source src={src} type='video/mp4' />
            <source src={src} type='video/ogg' />
            <source src={src} type='video/webm' />
            Your browser does not support HTML5 video.
          </video>
        )
          : (
            <div>
              <Typography
                variant='h4'
                style={{ fontWeight: 'lighter', marginTop: '15px', marginBottom: '15px' }}
              >
                Getting Your Video Ready.....
              </Typography>
              <LinearProgress />
            </div>
          )
      }
    </React.Fragment>
  )
}

export default CustomVideoPlayer
