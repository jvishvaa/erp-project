/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
// import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import MessageIcon from '@material-ui/icons/Message'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

import { Grid, Divider, TextField, Button } from '@material-ui/core'

import './reply.css'
import SubComments from '../SubComments.js/SubComments'
import { discussionUrls } from '../../../../../urls'

function Reply ({ alert, reply, number, likeCommentFunction }) {
  const [authForm] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [showSubComments, setShowSubComments] = useState(false)
  const [commentReply, setReply] = useState('')
  const [subComments, setSubComments] = useState([])
  const [likeInfo, setLikeInfo] = useState(reply.comment_user_like)

  function handleLike (id) {
    likeCommentFunction(id)
    setLikeInfo(!likeInfo)
  }
  const showCommentReplyFunc = () => {
    setShowSubComments(prevVal => !prevVal)
  }

  const showReplyBoxFunc = () => {
    setShowReplyBox(true)
  }

  const replyToCommentFunc = () => {
    if (!commentReply) {
      alert.warning('Please Enter Your comment')
      return
    }
    let data = {
      answer: commentReply,
      comment_fk: reply.id
    }
    axios
      .post(discussionUrls.GetSubReplies, data, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          setShowReplyBox(false)
          setReply('')
          // alert.success('Sucessfull Posted')
          //   this.refreshComponent()
        } else {
          // alert.warning(JSON.stringify(res.data))
          console.log('Error')
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.GetReplies)
      })
  }

  useEffect(() => {
    axios
      .get(`${discussionUrls.GetSubReplies}?last_index=0&comment_id=${reply.id}`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setSubComments(res.data)
          // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [authForm.personal_info.token, reply.id, showReplyBox])
  return (
    <>
      <div style={{ marginBottom: '20px', padding: '25px', position: 'relative' }}>
        {/* <div style={{ backgroundColor: number % 2 === 0 ? '#ffa76f' : '#b2ce41' }} className='colorBoxReply' /> */}
        <div className='topInfoReply'>
          <AccountCircleIcon className='nameIcon' />
          <p className='titleNameReply'>{reply.comment_user === null ? 'random_user' : reply.comment_user.first_name}</p>
        </div>

        <p className='commentTime'>Question asked {reply.comment_creation_ago}</p>
        <div className='answerToQuestion'>{ReactHtmlParser(reply.answer)}</div>
        <Divider />
        <div className='likeCommentSec'>
          <Grid container>
            <Grid item xs={2}>
              <a className='likeIcon'><ThumbUpIcon style={{ color: likeInfo ? '' : 'lightgray' }} onClick={() => handleLike(reply.id)} />
                <span className='counts'>{reply.like_count}</span></a>
            </Grid>
            <Grid item xs={6}>
              <a className='messageIcon counts repTOQuest' onClick={showReplyBoxFunc} >COMMENT</a>
            </Grid>
          </Grid>
          <br />
        </div>
        {subComments.length !== 0 &&
          <Grid container>
            <Grid item xs={4}>
              <a className='messageIcon' onClick={showCommentReplyFunc}><span><MessageIcon /></span>
                <span className='counts'><span>{showSubComments === true ? 'Hide' : 'View' }</span> {subComments.length} comments </span></a>
            </Grid>
          </Grid>
        }
        {showReplyBox === true &&
          <Grid container>
            <Grid item xs={12}>
              <TextField id='standard-basic' label='Reply to the Comment' fullWidth multiline onChange={(e) => setReply(e.target.value)} value={commentReply} />
              <div style={{ float: 'right', marginTop: '10px' }}>
                <Button variant='contained' style={{ marginRight: '15px' }} color='secondary' onClick={() => setShowReplyBox(false)}>Cancel</Button>
                <Button variant='contained' style={{ backgroundColor: '#ffaf67' }} onClick={replyToCommentFunc}>Reply</Button>
              </div>
            </Grid>
          </Grid>
        }
        {showSubComments === true && subComments && subComments.map((subComment, index) =>
          <div className='subComments' ><SubComments subComment={subComment} number={number} /></div>
        )
        }
      </div>
    </>
  )
}

export default Reply
