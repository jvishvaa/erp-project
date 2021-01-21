
import React, { useState, useEffect } from 'react'

import {
  // Divider,
  makeStyles

} from '@material-ui/core'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AudioPlayerWrapper from './../listeners/audioPlayerWrapper'
import { urls } from '../../../urls'
// import { getSparseDate, getFormattedHrsMnts } from '../../../utils'
import { CircularProgress } from '../../../ui'
import orchadioImg from '../../../assets/ORCHADIO.jpg'
import radio from './../listeners/assets/radio.svg'
import styles from './../listeners/orchadioListeners.styles'

const useStyles = makeStyles(styles)

const OrchadioPlayer = ({
  alert,
  match,
  ...props

}) => {
  const [radioData, setRadioData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(state => state.authentication.user)
  const id = match.params.id
  const token = match.params.token

  const classes = useStyles()

  useEffect(() => {
    const params = {
      id: id,
      token: token
    }
    console.log(params, 'para')
    setIsLoading(true)
    axios.get(`${urls.PublicOrchadio}`, {
      params
    }).then(res => {
      let { data: { data } = {} } = res
      console.log(data, 'datatat')
      setRadioData(data)
      setIsLoading(false)
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
      //  Remove it in prop
      alert.error('Unable to find audio')
    })
  }, [alert, id, match.params.id, match.params.token, token])

  const likeClickHandler = (id) => {
    const body = {
      radio_program_id: id,
      token: token
    }

    axios.post(`${urls.PublicOrchadioLikes}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then(res => {
      if (res.data && res.data.success === 'true') {
        radioData.is_liked = 'True'
        radioData.program_likes += 1
        console.log(radioData, 'radio')
        setRadioData(radioData)
      }

      if (res.data && res.data.success === 'false') {
        radioData.is_liked = 'False'
        radioData.program_likes -= 1
        console.log(radioData, 'radio')
        setRadioData(radioData)
      }
    })
  }

  const completedOnPecentageLimit = (id, percentageCompleted) => {
    const body = {
      radio_program_id: id,
      listened_upto: percentageCompleted === 1 ? 0 : 30,
      token: token
    }
    axios.post(`${urls.PublicOrchadioListners}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then((res) => {
      console.log(res)
    }

    ).catch(err =>
      console.log(err)
    )
  }
  const completionCallback = (id) => {
    const body = {
      radio_program_id: id
    }

    // Just making the request not handling
    axios.post(`${urls.OrchadioParticipants}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    })
  }

  console.log(radioData, 'radio')

  const getRadioList = () => {
    let { program_name: programName, program_made_by: programMadeBy, audio_file: audioFile, id: iD, is_liked: isLiked, program_likes: programLikes, program_views: programViews } = radioData
    const result =
      <div >
        <AudioPlayerWrapper
          albumName={programName}
          // imageTxt='Orchids'
          albumComposers={programMadeBy.split(', ')}
          src={audioFile}
          completionPercentage={80}
          completionCallback={() => completionCallback(iD)}
          completedOnPecentageLimit={(percentage) => completedOnPecentageLimit(iD, percentage)}
          likeHandler={() => likeClickHandler(iD)}
          likesCount={programLikes}
          viewCount={programViews}
          imageSrc={orchadioImg}
          isLiked={isLiked === 'True'}
          isPublic='True'
        />
      </div>
    return result
  }

  const getBlankView = () => {
    return (
      <div
        style={{
          position: 'relative',
          minHeight: '65vh',
          width: '100%',
          overflow: 'hidden'
        }}>
        <img src={radio} alt='radio' className={classes.radioImg} />
        <div className={classes.notFound}>Sorry! Programs Found</div>

      </div>
    )
  }

  return (
    <div style={{ padding: '12px' }}>

      {
        radioData && Object.keys(radioData).length
          ? getRadioList() : getBlankView()
      }
      {isLoading && <CircularProgress open />}
    </div>
  )
}

export default withRouter(OrchadioPlayer)
