import React, { useState } from 'react'
import {
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  TextField,
  Button,
  makeStyles
} from '@material-ui/core'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { urls } from '../../../urls'
import { Modal } from '../../../ui'

const styles = (theme) => ({
  links: {
    color: 'blue',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})

const useStyles = makeStyles(styles)

const SubmissionModal = ({
  data,
  type,
  alert,
  closeModal
}) => {
  const [remarks, setRemarks] = useState({})
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [source, setSource] = useState(null)
  const [overallRemarks, setOverallRemarks] = useState('')

  const user = useSelector(state => state.authentication.user)

  const classes = useStyles()

  const changeRemarksHandler = (e, id) => {
    const newRemarks = { ...remarks, [id]: e.target.value }
    setRemarks(newRemarks)
  }

  const submitRemarksHandler = () => {
    const remarksKeys = Object.keys(remarks)
    let isError = false
    data.homework_submission_details.forEach(submission => {
      if (submission.submission_type.trim() !== 'image') {
        if (!remarksKeys.includes(`${submission.id}`) || !remarks[submission.id]) {
          isError = true
        }
      }
    })

    if (isError || !overallRemarks.trim().length) {
      alert.warning('Please Provide  Remarks to Each Item and Overall Remarks')
      return
    }
    const remarksPerFile = remarksKeys.map(key => (
      {
        homework_submission: +key,
        review: remarks[key]
      }
    ))

    const body = {
      'file_review': remarksPerFile,
      'over_all_review': {
        'homework_id': data.homework_details.id,
        'review': overallRemarks
      }
    }
    axios.post(`${urls.HomeWorkSubmission}addReviewForSubmission/`, body, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }).then(res => {
      alert.success('Submission Successfull')
      // closeModal()
    }).catch(err => {
      console.error(err)
      alert.error('Remarks Submission Failed')
      // closeModal()
    })
  }

  const imageEvaluateHandler = () => {
    const imagesData = data.homework_submission_details
      .filter(item => item.submission_type.trim() === 'image')
    const imageSubmissionId = imagesData.map(item => item.id)
    window.open(`${urls.HomeWorkImageEvaluation}?hw_submission_id=${imageSubmissionId.join(',')}`)
  }

  const imageClickHandler = (url) => {
    axios.get(url, {
      responseType: 'blob'
      // headers: {
      //   Authorization: 'Bearer ' + user
      // }
    }).then(res => {
      const url = window.URL.createObjectURL(res.data)
      window.open(url, 'Image')
    }).catch(err => {
      console.error(err)
      alert.warning('Failed To Get Image')
    })
  }

  const playClickHandler = (type, src) => {
    if (type === 'audio') {
      setAudioModalOpen(true)
    } else {
      setVideoModalOpen(true)
    }
    setSource(src)
  }

  let audioModal = null
  if (audioModalOpen) {
    audioModal = (
      <Modal
        open={audioModalOpen}
        click={() => setAudioModalOpen(false)}
        style={{ zIndex: '1500' }}
        small
      >
        <audio controls style={{ marginTop: '15px' }}>
          <source src={source} type='audio/ogg' />
          <source src={source} type='audio/mpeg' />
          <source src={source} type='audio/wav' />
          Your browser does not support the audio element.
        </audio>
      </Modal>
    )
  }

  let videoModal = null
  if (videoModalOpen) {
    videoModal = (
      <Modal
        open={videoModalOpen}
        click={() => setVideoModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <video width='100%' height='100%' autoPlay controls style={{ marginTop: '15px' }}>
          <source src={source} type='video/mp4' />
          <source src={source} type='video/ogg' />
          <source src={source} type='video/webm' />
          Your browser does not support the video tag.
        </video>
      </Modal>
    )
  }

  return (
    <div style={{ padding: '12px' }}>
      <Typography variant='h5' style={{ textAlign: 'center', marginTop: '10px' }}>
        Submission Data
      </Typography>
      <Divider style={{ marginBottom: '10px' }} />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant='h6'>
            ERP
          </Typography>
        </Grid>
        <Grid item xs={4}>
          :
        </Grid>
        <Grid item xs={4}>
          {data.erp}
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6'>
            Name
          </Typography>
        </Grid>
        <Grid item xs={4}>
          :
        </Grid>
        <Grid item xs={4}>
          {data.username}
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: '10px' }} />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Submission Type</TableCell>
              <TableCell>Link</TableCell>
              {type === 'NE' ? (
                <TableCell>Remarks</TableCell>
              ) : <TableCell>' '</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.homework_submission_details.map((item, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.submission_type.toUpperCase()}</TableCell>
                <TableCell>{item.submission_type.trim() === 'image' ? (
                  <span
                    className={classes.links}
                    onClick={() => imageClickHandler(item.submission)}
                  >
                    View
                  </span>
                ) : (
                  <span
                    className={classes.links}
                    onClick={() => playClickHandler(item.submission_type.trim(), item.submission)}
                  >
                    Play
                  </span>
                )}</TableCell>
                {type === 'NE' && item.submission_type.trim() !== 'image' ? (
                  <TableCell>
                    <TextField
                      value={remarks[item.id] || ''}
                      onChange={(e) => changeRemarksHandler(e, item.id)}
                      variant='outlined'
                      // fullWidth
                      size='small'
                    />
                  </TableCell>
                ) : <TableCell>{' '}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {
        type === 'NE' ? (
          <Grid container style={{ marginTop: '15px', marginBottom: '15px' }}>
            <Grid xs={6}>
              <TextField
                label='Overall Remarks'
                required
                value={overallRemarks}
                onChange={(e) => setOverallRemarks(e.target.value)}
                variant='outlined'
                fullWidth
              />
            </Grid>
          </Grid>
        ) : null
      }
      {
        type === 'NE' ? (
          <div>
            <Typography variant='caption'>
            ** Note : To Evaluate Images Click on Evaluate Images
            </Typography>
            <br />
            <Typography variant='caption'>
              ** Note : Fill Remarks for all Non Image submissions
            </Typography>
            <Grid
              container
              spacing={2}
              justify='space-between'
              style={{ marginTop: '12px' }}
            >
              <Grid item xs={4}>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={submitRemarksHandler}
                >
                  Submit Remarks
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={imageEvaluateHandler}
                >
                  Evaluate Images
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : null
      }
      {audioModal}
      {videoModal}
    </div>
  )
}

export default SubmissionModal
