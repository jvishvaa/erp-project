/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactHtmlParser from 'react-html-parser'
import { Button } from 'semantic-ui-react'
import CloseIcon from '@material-ui/icons/Close'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import Drawer from '@material-ui/core/Drawer'
import TextField from '@material-ui/core/TextField'

import { Modal, Fade, Backdrop, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Grid } from '@material-ui/core'
import axios from 'axios'
import { withRouter } from 'react-router'
import { InternalPageStatus, OmsSelect } from '../../../ui'

import Review from '../Review'
import { urls } from '../../../urls'
import '../blog.css'

const keeperOptionsTabBranch = [
  { label: 'Across Orchids', value: 'across_orchids' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Section', value: 'across_section' }

]
const keeperOptionsTabGrade = [
  { label: 'Across Orchids', value: 'across_orchids' },
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Section', value: 'across_section' }

]
const keeperOptionsTabGradePrincipal = [
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Section', value: 'across_section' },
  { label: 'Across Orchids', value: 'across_orchids' }

]
const keeperOptionsTabSection = [
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Orchids', value: 'across_orchids' }

]
const keeperOptionsTabSectionACoordinator = [
  { label: 'Across Grade', value: 'across_grade' }
]
const keeperOptionsTabSectionPri = [
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Orchids', value: 'across_orchids' }

]
const keeperOptionsTabBranchPri = [
  { label: 'Across Section', value: 'across_section' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Orchids', value: 'across_orchids' }

]
const keeperOptions = [
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Section', value: 'across_section' },
  { label: 'Across Orchids', value: 'across_orchids' }
]
const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const keerperOptionLimitedPrin = [
  { label: 'Across Branch', value: 'across_branch' },
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Section', value: 'across_section' },
  { label: 'Across Orchids', value: 'across_orchids' }

]
const keerperOptionLimitedCo = [
  { label: 'Across Grade', value: 'across_grade' },
  { label: 'Across Section', value: 'across_section' }
]
const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'block'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    border: '2px solid #9f2a79',
    padding: '20px 30px 0px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    height: '-webkit-fill-available',
    overflow: 'scroll'

  },
  buttonRight: {
    position: 'absolute',
    right: 50
  },
  buttonRightFeedback: {
    position: 'absolute',
    right: 30,
    height: '10%'

  },
  buttonRightP: {
    position: 'absolute',
    right: 250
  },

  title: {
    color: 'white'
  },
  drawerPaper: {
    width: '45%'
  },
  textField: {
    position: 'absolute',
    marginLeft: theme.spacing.unit * 2,
    width: '80%'
  }
}))

const ViewEntireBlog = (props) => {
  const { revisionRequired, blogFeedback, content, blogThumbnail, author, blogTitle, blogRatings, blogId, currentTab, alert, isPublished, isReviewed } = props
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [right, setRight] = useState(false)
  const [keeper, setKeeper] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  const personalInfo = JSON.parse(localStorage.getItem('user_profile')).personal_info
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const handleClose = (blogId) => {
    setOpen(false)
    props.blogClosed(blogId)
  }
  const getRatings = () => {
    if (!blogRatings.length) {
      return []
    }
    const ratings = blogRatings[0]
    const type = typeof ratings.remark_rating
    const parsedRatings = type === 'object' ? ratings.remark_rating : JSON.parse(ratings.remark_rating)
    const allRatingParamters = [...parsedRatings]
    return allRatingParamters
  }

  const getOverAllRemark = () => {
    if (!blogRatings.length) {
      return null
    }
    return blogRatings[0].overall_remark
  }
  const handlePublishSubmit = () => {
    const formData = new FormData()
    formData.append('blog_id', blogId)
    formData.append('publish_across', keeper)
    setLoading(true)
    axios.post(`${urls.CreateBlog}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
        setLoading(false)
        handleClose(blogId)
        alert.success('Successfully Published the blog')
        props.getPubBlogs()
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  const handleLevelOnChange = (event) => {
    const { value: KeeperValue } = event
    setKeeper(KeeperValue)
  }
  const publishBlog = () => {
    return (
      <React.Fragment>
        {(role === 'Admin' || role === 'Subjecthead' || role === 'Planner') && currentTab === 1
          ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptions}
          /> : ''}
        {(role === 'Admin' || role === 'Subjecthead' || role === 'Planner') && props.currentTabPub === 1
          ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabBranch}
          /> : ''}
        {(role === 'Admin' || role === 'Subjecthead' || role === 'Planner') && props.currentTabPub === 2
          ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabGrade}
          /> : ''}
        {(role === 'Admin' || role === 'Subjecthead' || role === 'Planner') && props.currentTabPub === 3
          ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabSection}
          /> : ''}

        {/* { role === 'Teacher' ? <OmsSelect
          label='Publishing level'
          change={(event) => { handleLevelOnChange(event) }}
          options={keerperOptionLimitedTeacher}
        /> : ''} */}
        {
          role === 'Principal' && currentTab === 1 ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keerperOptionLimitedPrin}
          /> : ' '}
        {
          (role === 'Principal') && props.currentTabPub === 1 ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabBranchPri}
          /> : ''}
        {
          (role === 'Principal') && props.currentTabPub === 2 ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabGradePrincipal}
          /> : ' '}
        {
          (role === 'Principal') && props.currentTabPub === 3 ? <OmsSelect
            label='Publishing level'
            change={(event) => { handleLevelOnChange(event) }}
            options={keeperOptionsTabSectionPri}
          /> : ''}

        {
          (role === 'AcademicCoordinator' || role === 'Teacher') && currentTab === 1
            ? <OmsSelect
              label='Publishing level'
              change={(event) => { handleLevelOnChange(event) }}
              options={keerperOptionLimitedCo}
            /> : ''
        }
        {
          (role === 'AcademicCoordinator' || role === 'Teacher') && props.currentTabPub === 3
            ? <OmsSelect
              label='Publishing level'
              change={(event) => { handleLevelOnChange(event) }}
              options={keeperOptionsTabSectionACoordinator}
            /> : ''
        }
        <br />
        <br />
        {
          loading
            ? <InternalPageStatus label='Publishing Blogs...' loader />
            : <Button
              variant='contained'
              color='primary'
              onClick={handlePublishSubmit}

            >
             Publish
            </Button>
        }

      </React.Fragment>
    )
  }
  const handleOpenP = () => {
    setRight(true)
  }
  const handleClosePublish = () => {
    setRight(false)
  }

  const handleUnpublish = () => {
    const formData = new FormData()
    formData.append('blog_id', blogId)
    formData.append('un_publish', true)
    setLoading(true)
    axios.post(`${urls.CreateBlog}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
        setLoading(false)
        handleClose(blogId)
        props.getPubBlogs()
        alert.success('Successfully UnPublished the blog')
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  const handleFeedback = () => {
    const formData = new FormData()
    formData.append('blog_id', blogId)
    formData.append('feedback', feedback)
    setLoading(true)
    axios.post(`${urls.BlogFeedBack}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
        setLoading(false)
        handleClose(blogId)
        alert.success('Successfully blog send for revision with feedback')
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  return (
    <Dialog fullScreen open={open} onClose={() => { handleClose() }} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar style={{ position: 'relative' }}>
          <IconButton edge='start' color='inherit' onClick={() => { handleClose() }} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
              Close
          </Typography>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            currentTab === 1 &&
              role !== 'Student'
              ? <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>

                  <Button
                    inverted
                    onClick={handleOpenP}
                  >
                 Publish
                  </Button>
                </Grid>

                <Drawer anchor='right' open={right} onClose={handleClosePublish}
                  classes={{
                    paper: classes.drawerPaper
                  }}
                >
                  {publishBlog()}
                </Drawer>

              </Grid>

              : ''
          }
          {(props.currentTabPub === 1 || props.currentTabPub === 2 || props.currentTabPub === 3) && (role === 'Admin' || role === 'Planner' || role === 'Subjecthead') &&
              role !== 'Student' && role !== 'Teacher'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>

                <Button
                  inverted
                  onClick={handleOpenP}
                >
                 Publish
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Drawer anchor='right' open={right} onClose={handleClosePublish}
                  classes={{
                    paper: classes.drawerPaper
                  }}
                >
                  {publishBlog()}
                </Drawer>
              </Grid>
            </Grid>

            : ''
          }
          {(props.currentTabPub === 1 || props.currentTabPub === 2 || props.currentTabPub === 3) && (role === 'Principal') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>

                <Button
                  inverted
                  onClick={handleOpenP}
                >
                 Publish
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Drawer anchor='right' open={right} onClose={handleClosePublish}>
                  {publishBlog()}
                </Drawer>
              </Grid>
            </Grid>

            : ''
          }
          {(props.currentTabPub === 3) && (role === 'AcademicCoordinator' || role === 'Teacher') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>

                <Button
                  inverted
                  onClick={handleOpenP}
                >
                 Publish
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Drawer anchor='right' open={right} onClose={handleClosePublish}
                  classes={{
                    paper: classes.drawerPaper
                  }}
                >
                  {publishBlog()}
                </Drawer>
              </Grid>
            </Grid>

            : ''
          }&nbsp;&nbsp;&nbsp;&nbsp;
          {(props.currentTabPub === 0 || props.currentTabPub === 1 || props.currentTabPub === 2 || props.currentTabPub === 3) && (role === 'Admin' || role === 'Planner' || role === 'Subjecthead') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  inverted
                  onClick={handleUnpublish}
                >
                 UnPublish
                </Button>
              </Grid>
            </Grid> : ''}
          {(props.currentTabPub === 0 || props.currentTabPub === 1 || props.currentTabPub === 2 || props.currentTabPub === 3) && (role === 'Principal') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  inverted
                  onClick={handleUnpublish}
                >
               UnPublish
                </Button>
              </Grid>
            </Grid> : ''}
          {(props.currentTabPub === 2 || props.currentTabPub === 3) && (role === 'AcademicCoordinator' || role === 'Teacher') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  inverted
                  onClick={handleUnpublish}
                >
               UnPublish
                </Button>
              </Grid>
            </Grid> : ''}
          {/* {(props.currentTabPub === 3) && (role === 'Teacher') &&
              role !== 'Student'
            ? <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  inverted
                  onClick={handleUnpublish}
                >
               UnPublish
                </Button>
              </Grid>
            </Grid> : ''} */}
          { !isPublished && (
            role === 'Subjecthead' || role === 'Admin' || role === 'Teacher')
            ? <Button className={classes.buttonRight} inverted onClick={() => { setModalOpen(true) }}>Add Review</Button>
            : ''
          }
        </Toolbar>
      </AppBar>
      {/* <React.Fragment>
        <div className='entire__blog-page'>
          {
            thumbnail
              ? <div
                className='entire__blog--thumbnail'
                style={{
                  backgroundImage: `url(https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`
                }}
              />
              : ''
          }
          {ReactHtmlParser(content)}
        </div>
      </React.Fragment> */}
      {
        blogThumbnail
          ? <Grid container >

            <img className='preview-image' alt='no data' src={blogThumbnail} />
          </Grid>
          : ''
      }
      <Typography style={{
        'text-align': 'center',
        'font-size': '2rem',
        'font-family': 'cursive',
        color: 'darkblack',
        'margin-top': '5%',
        'text-transform': 'capitalize'

      }}>{ReactHtmlParser(blogTitle)}</Typography>
      <Typography style={{ 'margin-left': '4%', 'margin-top': '2%', 'font-size': '1rem', color: '#5d1049' }}>Author : {author}</Typography>
      <Typography style={{ 'margin-left': '4%', 'margin-right': '3%', 'margin-top': '2%', 'margin-bottom': '3%' }}>{ ReactHtmlParser(content)}</Typography>
      {isPublished === false && isReviewed && revisionRequired === false && (role === 'Admin' || role === 'Subjecthead' || role === 'Teacher')
        ? <Grid container spacing={2}>

          <Grid item xs={6} sm={4} md={4}>
            <TextField
              className={classes.textField}
              variant='outlined'
              label='Feedback'
              placeholder='Please enter feedback of this blog'
              type='text'
              onChange={e => setFeedback(e.target.value)}
            /></Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Button variant='contained' className={classes.buttonRightFeedback}
              onClick={handleFeedback}

            >
             SEND FOR REVISION
            </Button></Grid>
        </Grid>
        : <Typography style={{ color: 'orange',
          fontFamily: 'Arial',
          fontSize: '1.15rem',
          'margin-left': '4%',
          'margin-top': '2%',
          'font-size': '1rem'
        }}>  FEEDBACK :{blogFeedback}</Typography>
      }
      <React.Fragment>
        <Modal
          className={classes.modal}
          open={modalOpen}
          onClose={() => { setModalOpen(false) }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 100
          }}
        >
          <Fade in={modalOpen}>
            <div className={classes.paper}>
              <div>
                <HighlightOffIcon
                  onClick={() => { setModalOpen(false) }}
                  className='closemodal'
                />
                <Review closeFullscreen={handleClose} alert={props.alert} blogId={blogId} ratingParameters={getRatings} overallRemark={getOverAllRemark} />
              </div>
            </div>
          </Fade>
        </Modal>
      </React.Fragment>
    </Dialog>
  )
}

export default withRouter(ViewEntireBlog)
