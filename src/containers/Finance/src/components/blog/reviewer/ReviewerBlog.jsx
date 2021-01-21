import React, { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { makeStyles } from '@material-ui/core/styles'
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons'
import { Card, CardHeader, CardMedia, Button, Typography } from '@material-ui/core'
import axios from 'axios'
import { urls } from '../../../urls'

import '../blog.css'

import ViewEntireBlog from '../utils/ViewEntireBlog'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    background: '#9a9a9a',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  },
  onblog: {
    cursor: 'pointer',
    height: '460px'
  },
  mblBlog: {
    cursor: 'pointer',
    height: '510px',
    width: '346px'
  },
  button: {
    margin: theme.spacing(1),
    width: '-webkit-fill-available'
  }
}))

const ReviewerBlogs = (props) => {
  const classes = useStyles()
  const personalInfo = JSON.parse(localStorage.getItem('user_profile')).personal_info
  const [mobileView, setMobileView] = useState('')
  const { author: { student: { branch, grade, section, name } }, is_published: isPublished, is_reviewed: isReviewed, content, title, thumbnail, created_at: createdAt, blog_fk: blogRatings, id: blogId, genre: genreList, currentTab, likes,
    blog_fk_like: blogFkLike, blog_fk_revision: blogFkRevision, is_revision_required: revisionRequired } = props
  const likedUserIds = blogFkLike.map(blog => blog.user)
  const indexOfLoginUser = likedUserIds.indexOf(personalInfo.user_id)
  const loginUser = likedUserIds.includes(personalInfo.user_id)
  const isLiked = loginUser ? blogFkLike[indexOfLoginUser].is_liked : false
  const blogFeedback = blogFkRevision && blogFkRevision[0] ? blogFkRevision[0].feedback : 'Feedback not yet given'
  const [currentLikes, setCurrentLikes] = useState(0)
  const [showFullBlog, setShowFullBlog] = useState(false)
  const [likeStatus, setLikeStatus] = useState(false)
  useEffect(() => {
    setMobileView(window.screen.width)
  }, [])
  const blogClosed = (id) => {
    setShowFullBlog(false)
    props.detachBlog(id)
  }

  const getFormatedDate = () => {
    const date = new Date(createdAt)
    const month = date.toLocaleString('default', { month: 'long' })
    const dt = date.getDate()
    const year = date.getFullYear()
    return (<div>  <p style={{ fontFamily: 'Arial', color: 'black', display: 'flex' }}>{month} {dt}, {year} </p></div>)
  }

  const getAuthor = () => {
    return (<div><p style={{ fontFamily: 'Arial', color: 'red', width: 'auto' }}> Author : {name}</p></div>)
  }
  const handleView = () => {
    setShowFullBlog(true)
    const formData = new FormData()
    formData.append('blog_id', blogId)
    axios.post(`${urls.ViewBlog}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getLikeStatus = () => {
    if (isLiked === true && likeStatus === false) {
      setCurrentLikes(currentLikes => likes - 1)
      setLikeStatus(likeStatus => true)
    } else if (isLiked === true && likeStatus === true) {
      setCurrentLikes(currentLikes => likes + 1)
      setLikeStatus(likeStatus => false)
    } else if (isLiked === false && likeStatus === false) {
      setCurrentLikes(currentLikes => likes + 1)
      setLikeStatus(likeStatus => true)
    } else if (isLiked === false && likeStatus === true) {
      setCurrentLikes(currentLikes => likes)
      setLikeStatus(likeStatus => false)
    }
  }
  const handleLike = () => {
    getLikeStatus()
    const formData = new FormData()
    formData.append('blog_id', blogId)
    axios.post(`${urls.LikeBlog}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div>
      <Card className={classes.root}>
        <div className={mobileView < 1024 ? classes.mblBlog : classes.onblog}>
          <div className='branch__grade--sec'>
            <p> {branch.branch_name}</p> <span className='vl' /> &nbsp;
            <p>{grade.grade}</p> <span className='vl' />&nbsp;
            <p> {section.section_name}</p>
            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
            <Button
              onClick={handleLike}
            > {isLiked || likeStatus ? <Favorite style={{ color: 'red' }} />
                : <FavoriteBorder style={{ color: 'red' }} />}
              {currentLikes === 0 ? likes
                : currentLikes
              }
            </Button>
          </div>
          <CardMedia
            className={classes.media}
            image={thumbnail}
            title={title}
          />
          <CardHeader
            className='title_card-header'
            title={ReactHtmlParser(title)}
            subheader={getAuthor()}
          />
          <div className='student__blog--author'>
            {getFormatedDate()}   &nbsp; &nbsp;
            {isReviewed ? <div >
              <p style={{ fontFamily: 'Arial', color: 'orange', 'margin-left': '1rem', display: 'flex', 'margin-top': '-7px' }}>
              REVIEWED</p>

            </div> : ''}&nbsp; &nbsp;
            {isPublished ? <div>
              <p style={{ fontFamily: 'Arial', color: 'green', 'margin-left': '1rem', 'margin-top': '-7px' }}>PUBLISHED</p>
            </div> : ''}

          </div>
          {
            genreList !== null && genreList !== undefined ? <Typography style={{ fontFamily: 'Arial', color: 'blue', 'margin-left': '1rem', display: 'flex', 'text-transform': 'capitalize' }}> Genre :&nbsp;{genreList && genreList.genre} {genreList && genreList.genre_subtype ? (genreList && '(' + ' ' + genreList.genre_subtype + ' ' + ')') : ''}</Typography> : ''
          } &nbsp; &nbsp;
          <div
            aria-label='show more'
          >
            <Button
              variant='contained'
              onClick={handleView}
              color='primary'
              className={classes.button}
              startIcon={<Visibility />}
            >
View Blog
            </Button>
          </div>
        </div>
      </Card>
      <React.Fragment>
        {
          showFullBlog
            ? <ViewEntireBlog alert={props.alert} isReviewed={isReviewed} blogFeedback={blogFeedback} revisionRequired={revisionRequired}
              getPubBlogs={props.getPubBlogs} currentTabPub={props.currentTabPub} isPublished={isPublished} currentTab={currentTab} blogId={blogId} blogClosed={blogClosed}
              content={content} blogRatings={blogRatings} author={name} blogTitle={title} blogThumbnail={thumbnail} />
            : ''
        }
      </React.Fragment>
    </div>
  )
}
export default ReviewerBlogs
