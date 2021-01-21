import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Button
} from '@material-ui/core'
import {
  HighlightOffOutlined as CloseIcon,
  EditOutlined as EditIcon,
  OpenInBrowserOutlined as OpenIcon
} from '@material-ui/icons'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { urls } from '../../../urls'

const QuizModal = ({
  id,
  alert,
  onClose
}) => {
  const [quizLink, setQuizLink] = useState({})
  const [existingLink, setExistingLink] = useState(null)
  const user = useSelector(state => state.authentication.user)

  useEffect(() => {
    if (id) {
      axios.get(`${urls.OnlineClassQuizLink}?online_class_id=${id}`, {
        headers: {
          Authorization: 'Bearer ' + user
        }
      }).then(res => {
        if (res.data && res.data.length) {
          const index = res.data.length - 1
          setExistingLink(res.data[index])
        }
      }).catch(err => console.error(err))
    }
  }, [id, user])

  const errorCallback = (err, customMessage) => {
    console.error(err)
    alert.warning(customMessage)
  }

  const submitQuizHandler = () => {
    const reqMetaData = {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }
    let quizPutPromise
    let quizPostPromise
    if (existingLink && existingLink.isEditable) {
      const body = {
        online_class_id: id,
        quiz: [existingLink]
      }
      quizPutPromise = axios.put(urls.OnlineClassQuizLink, body, reqMetaData)
    } else if (quizLink.name && quizLink.link) {
      const body = {
        online_class_id: id,
        quiz: [quizLink]
      }
      quizPostPromise = axios.post(urls.OnlineClassQuizLink, body, reqMetaData)
    }

    Promise.all([quizPutPromise, quizPostPromise]
      .filter(Boolean)
      .map((p) => (
        p.catch(err => errorCallback(
          err,
          `Error Occured While ${p === quizPostPromise
            ? 'Submitting Links'
            : 'Updating Links'}`
        ))
      ))).then(() => {
      if (quizPostPromise || quizPutPromise) {
        alert.success('Work Submitted Successfully')
        setTimeout(() => {
          onClose()
        }, 500)
      }
    })
  }

  const resourceChangeHandler = (e, isExisting) => {
    const resource = isExisting ? existingLink : quizLink
    const newResource = { ...resource }
    newResource[e.target.name] = e.target.value
    isExisting ? setExistingLink(newResource) : setQuizLink(newResource)
  }

  const editLinkHandler = () => {
    const resource = { ...existingLink, isEditable: true }
    setExistingLink(resource)
  }

  const openLinkHandler = (link) => {
    if (link && link.length) {
      window.open(link)
    }
  }

  const removeLinkHandler = (quizId) => {
    axios.delete(`${urls.OnlineClassQuizLink}?online_class_quiz_link_id=${quizId}`, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(() => {
      setExistingLink(null)
      setQuizLink({})
      alert.success('Link Removed Successfully')
    }).catch(err => {
      console.error(err)
      alert.warning('Failed to Delete')
    })
  }

  const getLinkData = (item, isExisting) => (
    <React.Fragment>
      <Grid item xs={12} md={3}>
        <TextField
          label='Quiz Name'
          value={item.name || ''}
          variant='outlined'
          placeholder='Resource Name'
          fullWidth
          name='name'
          disabled={isExisting && !item.isEditable}
          onChange={(e) => resourceChangeHandler(e, isExisting)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label='Quiz Link'
          value={item.link || ''}
          variant='outlined'
          placeholder='Resource Link'
          fullWidth
          disabled={isExisting && !item.isEditable}
          name='link'
          onChange={(e) => resourceChangeHandler(e, isExisting)}
        />
      </Grid>
      {
        isExisting && (
          <Grid item xs={4} md={1}>
            <Tooltip title='Edit Link'>
              <IconButton onClick={editLinkHandler}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )
      }
      {
        isExisting && (
          <Grid item xs={4} md={1}>
            <Tooltip title='Remove'>
              <IconButton onClick={() => removeLinkHandler(item.id)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )
      }
      <Grid item xs={4} md={1}>
        <Tooltip title='Open Link'>
          <IconButton onClick={() => openLinkHandler(item.link && item.link.trim())}>
            <OpenIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid xs={12}>
        <Divider />
      </Grid>
    </React.Fragment>
  )
  return (
    <div style={{ padding: '12px' }}>
      <Typography variant='h4' style={{ textAlign: 'center' }}>
        Quiz Link
      </Typography>
      <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }}>
        {existingLink ? getLinkData(existingLink, true) : getLinkData(quizLink, false)}
      </Grid>
      <Button
        color='primary'
        variant='contained'
        onClick={submitQuizHandler}
        size='large'
        style={{ marginTop: '15px' }}
      >
        Submit
      </Button>
    </div>
  )
}
export default QuizModal
