/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  Paper,
  IconButton
} from '@material-ui/core'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ReactHTMLParser from 'react-html-parser'
import CloseIcon from '@material-ui/icons/Close'
import CommentIcon from '@material-ui/icons/Comment'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import styles from './editConnents.style'
import TinyMce from '../TinyMCE/tinymce'
import Loader from '../../loader'
import { discussionUrls } from '../../../../urls'

const EditComments = ({ alert, classes, history }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [commentsData] = useState(JSON.parse(localStorage.getItem('commentId')))
  const [loading, setloading] = useState(false)
  const [commentsList, setCommentsList] = useState([])
  const [viewMore, setViewMore] = useState(true)

  const [editAnswer, setEditAnswer] = useState('')
  const [answerId, setAnswerId] = useState('')
  const [open, setOpen] = useState(false)

  const [replayList, setReplayList] = useState([])
  const [selectedReplayIndex, setSelectedReplayIndex] = useState('')

  const [commentId, setCommentId] = useState('')
  const [editReplayInfo, setEditReplayInfo] = useState('')
  const [replayId, setReplayId] = useState('')
  const [openReplay, setReplayOpen] = useState(false)

  function handleBacktoPost () {
    history.push({
      pathname: '/discussion-form_edit_Post'
    })
  }

  function functionToGetComments (id) {
    setloading(true)
    const url = `${discussionUrls.getCommentsonPostApi}?post_id=${id}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setCommentsList(res.data)
        if (res.data.length === 10) {
          setViewMore(false)
        }
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }
  useEffect(() => {
    if (auth && commentsData) {
      functionToGetComments(commentsData.id)
    }
  }, [auth, commentsData])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function functionToDeleteComment (id) {
    setloading(true)
    const url = `${discussionUrls.updateConnemmtForPostApi}${id}/update_comments/`
    axios
      .put(url, {
        'is_delete': true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        console.log(res.data)
        functionToGetComments(commentsData.id)
        alert.success('Answer Deleted Successfully')
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }

  function functionToUpdatAnswer () {
    if (!editAnswer) {
      alert.warning('enter Answer')
      return
    }
    setloading(true)
    const url = `${discussionUrls.updateConnemmtForPostApi}${answerId}/update_comments/`
    axios
      .put(url, {
        'answer': editAnswer
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        console.log(res.data)
        handleClose()
        functionToGetComments(commentsData.id)
        alert.success('Answer Updated Successfully')
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }

  function editCommentOpenModel (answer, id) {
    setEditAnswer(answer)
    setAnswerId(id)
    setOpen(true)
  }
  const handleClose = () => {
    setEditAnswer('')
    setAnswerId('')
    setOpen(false)
  }

  function editReplayOpenModel (replay, id) {
    setEditReplayInfo(replay)
    setReplayId(id)
    setReplayOpen(true)
  }

  const handleCloseReplay = () => {
    setEditReplayInfo('')
    setReplayId('')
    setReplayOpen(false)
  }

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant='h6'>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label='close'
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    )
  }

  function functionToGetReplayList (id, index) {
    setloading(true)
    const url = `${discussionUrls.getReplayOnCommentsonPostApi}?comment_id=${id}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setReplayList(res.data)
        setloading(false)
        setSelectedReplayIndex(index)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function handleReplays (index, id) {
    functionToGetReplayList(id, index)
    setCommentId(id)
  }

  function functionToUpdatReplay () {
    if (!editReplayInfo) {
      alert.warning('enter Reply ')
      return
    }
    setloading(true)
    const url = `${discussionUrls.UpdateReplayOnCommentsonPostApi}${replayId}/update_reply/`
    axios
      .put(url, {
        answer: editReplayInfo
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        alert.success('Reply  Updated Successfully')
        handleCloseReplay()
        functionToGetReplayList(commentId, selectedReplayIndex)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionToDelterReplay (id) {
    setloading(true)
    const url = `${discussionUrls.UpdateReplayOnCommentsonPostApi}${id}/update_reply/`
    axios
      .put(url, {
        is_delete: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        alert.success('Reply  Deleted Successfully')
        handleCloseReplay()
        functionToGetReplayList(commentId, selectedReplayIndex)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function replayOpen () {
    let modal = null
    modal = (
      <Dialog
        disableEnforceFocus
        maxWidth='xl'
        open={openReplay}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.mcqmodal}
      >
        <DialogTitle id='alert-dialog-title' onClose={handleCloseReplay}>
          Edit Reply
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant='h5'>Reply  :</Typography>
              <TinyMce id={'Q1345'} get={(content) => setEditReplayInfo(content)} content={editReplayInfo} />
            </Grid>
            <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
              <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={() => functionToUpdatReplay(replayId)}
              >
                   Update Reply
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    )
    return modal
  }

  function AnswerOpen () {
    let modal = null
    modal = (
      <Dialog
        disableEnforceFocus
        maxWidth='xl'
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.mcqmodal}
      >
        <DialogTitle id='alert-dialog-title' onClose={handleClose}>
          Edit Answer
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant='h5'>Answer :</Typography>
              <TinyMce id={'Q1345'} get={(content) => setEditAnswer(content)} content={editAnswer} />
            </Grid>
            <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
              <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={() => functionToUpdatAnswer()}
              >
                   Update Answer
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    )
    return modal
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} style={{ padding: '15px' }}>
          <Button variant='contained' style={{ float: 'right' }} color='primary' onClick={() => handleBacktoPost()}>Back To Posts</Button>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: '20px', overflow: 'auto' }}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
                <Typography>Posted on : {commentsData.post_date}</Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant='h5' style={{ color: 'blue' }}>Title : {commentsData.title}</Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography variant='h6'>Description : </Typography>
              </Grid>
              <Grid item md={10} xs={12} style={{ marginTop: '6px' }}>
                {ReactHTMLParser(commentsData.description)}
              </Grid>
              <Grid item md={9} xs={12} style={{ textAlign: 'left' }}>
                <Button color='primary'>
                  <CommentIcon /> : {commentsData.comment_count}
                </Button>
                {''}
                <Button color='primary'>
                  <ThumbUpAltIcon /> : {commentsData.like_count}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {commentsList && commentsList.length === 0 &&
        <Grid item md={12} xs={12}style={{ textAlign: 'center', marginTop: '30px' }}>
          <Typography variant='h5' style={{ color: 'blue' }}>No Reply For this Post</Typography>
        </Grid>
        }
        <Grid item md={1} />
        <Grid item md={10} xs={12} style={{ padding: '20px', overflow: 'auto' }}>
          {commentsList && commentsList.length !== 0 && commentsList.map((item, index) => (
            <Paper className={classes.commentpaper} key={index} elevation={3} style={{ backgroundColor: index % 2 === 0 ? '#ffede2' : '#fff9f5', position: 'relative' }}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
                  <Typography>Commented on : {item.comment_date}</Typography>
                </Grid>
                <Grid item md={1} xs={12}>
                  <Typography variant='h6' style={{ color: 'blue' }}>Answer</Typography>
                </Grid>
                <Grid item md={11} xs={12} style={{ marginTop: '6px' }}>
                  {ReactHTMLParser(item.answer)}
                </Grid>
                <Grid item md={8} xs={12} style={{ textAlign: 'left' }}>
                  <Button color='primary' onClick={() => handleReplays(index, item.id)}>
                    <CommentIcon /> : {item.reply_count}
                  </Button>
                  {''}
                  <Button color='primary'>
                    <ThumbUpAltIcon /> : {item.like_count}
                  </Button>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Button fullWidth variant='contained' color='primary' style={{ display: 'none' }} onClick={() => editCommentOpenModel(item.answer, item.id)}>
                      Edit Answer
                  </Button>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Button fullWidth variant='contained' color='primary' onClick={() => functionToDeleteComment(item.id)}>
                      Delete Post
                  </Button>
                </Grid>
              </Grid>
              {index === selectedReplayIndex &&
              <>
                <Divider className={classes.divider} />
                <Grid container spacing={2}>
                  {replayList && replayList.length === 0 &&
                  <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '10px' }}>
                    <Typography variant='h5' style={{ color: 'blue' }}>No Replays For this Comment</Typography>
                  </Grid>
                  }
                  {replayList && replayList.length !== 0 && replayList.map((datainfo, indexx) => (
                    <Grid item md={12} xs={12} key={indexx}>
                      <Grid container spacing={2} >
                        <Grid item md={1} xs={1} />
                        <Grid item md={10} xs={10}>
                          <Paper className={classes.replayPaper} elevation={3} style={{ backgroundColor: indexx % 2 === 0 ? '#ffede2' : '#fff9f5', position: 'relative', padding: '20px', overflow: 'auto' }}>
                            <Grid container spacing={2}>
                              <Grid item md={6} xs={6}>
                                <Typography variant='h6' style={{ color: 'blue' }}>Reply</Typography>
                              </Grid>
                              <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
                                <Typography>Replayed on : {datainfo.comment_date}</Typography>
                              </Grid>
                              <Grid item md={12} xs={12}>
                                {ReactHTMLParser(datainfo.answer)}
                              </Grid>
                              <Grid item md={10} xs={10} />
                              <Grid item md={1} xs={1}>
                                <IconButton fullWidth variant='contained' style={{ display: 'none' }} color='primary' onClick={() => editReplayOpenModel(datainfo.answer, datainfo.id)}>
                                  <EditIcon color='primary' />
                                </IconButton>
                              </Grid>
                              <Grid item md={1} xs={1}>
                                <IconButton fullWidth variant='contained' color='primary' onClick={() => functionToDelterReplay(datainfo.id)}>
                                  <DeleteIcon color='primary' />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))
                  }
                  {/* {replayList && replayList.length !== 0 &&
                    <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '20px', marginBottom: '15px' }}>
                      <Button variant='contained' color='primary' size='large' disabled style={{ borderRadius: '10px' }}>View More Replays</Button>
                    </Grid>
                  } */}
                </Grid>
              </>
              }
            </Paper>
          ))}
        </Grid>
        <Divider className={classes.divider} />
        {commentsList && commentsList.length !== 0 &&
        <Grid item md={12} xs={12}style={{ textAlign: 'center', padding: '10px', color: 'blue' }}>
          <Button variant='contained' color='primary' size='large' disabled={viewMore === true} style={{ borderRadius: '10px' }}>View More Comments</Button>
        </Grid>
        }
      </Grid>
      {AnswerOpen()}
      {replayOpen()}
      {loader}
    </>
  )
}
export default (withStyles(styles)(withRouter(EditComments)))
// export default withStyles(styles)(EditComments)
