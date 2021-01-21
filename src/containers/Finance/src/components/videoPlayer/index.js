import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import InternalVideoPlayer from './internalPlayer'
import ExternalVideoPlayer from './externalVideoPlayer'
import { urls } from '../../urls'

// const data = [
//   {
//     id: 1,
//     src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
//   },
//   {
//     id: 2,
//     src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
//   }
// ]

const VideoPlayer = ({
  match,
  alert,
  ...props
}) => {
  const [src, setSrc] = useState('')
  const [id, setId] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const key = match.params.key
    const tok = match.params.token
    setId(key)
    setToken(tok)
    // const matchedRes = data.filter(item => item.id === +key)
    // setSrc(matchedRes[0].src)
    const params = {
      id: key,
      tok,
      status: 'visited'
    }
    axios.get(`${urls.VideoSourceUrl}`, {
      params
    }).then(res => {
      console.log('response URl', res.data.video_url)
      setSrc(res.data.video_url)
    }).catch(err => {
      console.error(err)
      //  Remove it in prop
      alert.error('Unable to find video')
    })
  }, [match, alert])

  var user = JSON.parse(localStorage.getItem('user_profile'))
  return (
    user
      ? <InternalVideoPlayer
        src={src}
        id={id}
        token={token}
        alert={alert}
      /> : <ExternalVideoPlayer
        src={src}
        id={id}
        token={token}
        alert={alert}
      />
  )
}

export default withRouter(VideoPlayer)
