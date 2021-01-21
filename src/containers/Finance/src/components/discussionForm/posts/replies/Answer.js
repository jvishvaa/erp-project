import React, { useState, useEffect } from 'react'
import { Button, Paper } from '@material-ui/core'
import ReactHtmlParser from 'react-html-parser'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import axios from 'axios'
import './Answer.css'
import TinyMce from '../../TinyMCE/tinymce'
import { discussionUrls } from '../../../../urls'
import AllReplies from './allReplies/AllReplies'

export default function Answer ({ alert, goToAllPosts, yourData, number, likeFunction }) {
  const [authForm] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [tinyMceData, setTinyMceData] = useState('')
  const [allReplies, setAllReplies] = useState([])
  const [key, setKey] = useState(number)
  const [LikeStatus, setLikeStatus] = useState('')
  const [likeInfo, setLikeInfo] = useState(yourData.user_like)
  const [lastIndex, setLastIndex] = useState(0)
  const [handleMode, setHandleMore] = useState(false)

  // const showReplyBoxFunc = () => {
  //   setShowReplyBox(true)
  // }
  const cancelReplyFunc = () => {
    // setShowReplyBox(false)
    setKey(prevVal => prevVal + 1)
  }

  const handleAnswerChange = (content, id) => {
    setTinyMceData(content)
  }

  useEffect(() => {
    axios
      .get(`${discussionUrls.GetReplies}?last_index=${lastIndex}&post_id=${yourData.id}`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          if (lastIndex === 0) {
            setAllReplies(res.data)
          } else {
            setAllReplies(prevVal => [...prevVal, ...res.data])
            if (res.data.length !== 10) {
              setHandleMore(true)
            }
          }
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
  }, [yourData.id, showReplyBox, authForm.personal_info.token, LikeStatus, lastIndex])

  const replyToQuestFunc = () => {
    if (!tinyMceData) {
      alert.warning('Please enter your Answer')
      return
    }
    let data = {
      answer: tinyMceData,
      post_fk: yourData.id
    }
    axios
      .post(discussionUrls.GetReplies, data, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          setShowReplyBox(prevVal => !prevVal)
          setKey(prevVal => prevVal + 1)
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
  function functionToLikeComment (id) {
    let Url = `${discussionUrls.apiForLikeComment}`
    axios
      .post(Url, {
        comment: id
      }, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          setLikeStatus(res.data)
          // alert.success('Thaks For the Like')
        } else {
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleLike (id) {
    setLikeInfo(!likeInfo)
    likeFunction(id)
  }

  function handleViewMore (data) {
    setLastIndex(data)
  }

  return (
    <>
      <Button onClick={goToAllPosts} variant='contained' color='primary' size='small' style={{ marginBottom: '5px' }}>Go Back To Topics</Button>

      <div style={{ position: 'relative', marginTop: '15px' }}>
        <div style={{ backgroundColor: number % 2 === 0 ? '#ffa76f' : '#b2ce41' }} className='colorBoxAnswer' />
        <Paper elevation={3} style={{ padding: '45px', backgroundColor: number % 2 === 0 ? '#ffede2' : '#fff9f5' }}>
          <span className='questionAskedBy'>Question Asked By {yourData.post_user !== null ? yourData.post_user.first_name : 'Random_User'}</span>
          {/* <span className='questionAsked'> {yourData.post_creation_ago}</span> */}
          <div className='questionNew'>{ReactHtmlParser(yourData.description)}</div>
          <div className='extraInfo'>
            <span className='like-span'>{yourData.like_count} &nbsp; <ThumbUpIcon className='thumbsUp' style={{ color: likeInfo ? 'blue' : '' }} onClick={() => handleLike(yourData.id)} /></span> &nbsp;&nbsp; . &nbsp;
            <span >{yourData.comment_count} answers</span>  &nbsp; . &nbsp;
            <span>{yourData.post_creation_ago}</span>
            {/* {showReplyBox === false &&
            <Button variant='contained' color='primary' style={{ marginLeft: '72%', display: 'inline-block' }} onClick={showReplyBoxFunc}>Reply</Button>} */}
          </div>
          <Paper style={{ marginTop: '10px', marginBottom: '10px' }}>
            <TinyMce id={'Q13422456'} get={handleAnswerChange} key={key} />
            <div style={{ float: 'right', marginTop: '10px', marginBottom: '10px' }}>
              <Button variant='contained' onClick={cancelReplyFunc} color='secondary' style={{ marginRight: '10px' }}>Cancel</Button>
              <Button variant='contained' color='primary' onClick={replyToQuestFunc} >Reply </Button>
              <br />
            </div>
          </Paper>
          <AllReplies alert={alert} replies={allReplies} number={number} likeCommentFunction={functionToLikeComment} />
          <Button variant='contained' color='primary' style={{ float: 'right' }} disabled={handleMode} onClick={() => handleViewMore(allReplies.length)}>View More ...</Button>
        </Paper>
      </div>
      {/* {showReplyBox === false &&
        <Paper style={{ marginTop: '10px' }}>
          <TinyMce id={'Q13422456'} get={handleAnswerChange} />
          <div style={{ float: 'right', marginTop: '10px' }}>
            <Button variant='contained' onClick={cancelReplyFunc} color='secondary' style={{ marginRight: '10px' }}>Cancel</Button>
            <Button variant='contained' color='primary' onClick={replyToQuestFunc} >Reply to Question </Button>
            <br />
          </div>
        </Paper>
      } */}

    </>
  )
}
