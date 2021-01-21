/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Card, CardContent, Button, CardMedia, CardActions, Box, Modal, Backdrop, Fade, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Favorite } from '@material-ui/icons'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { withRouter } from 'react-router'
import RatingScale from '../utils/RatingScale'
import Review from '../Review'
import ViewEntireBlog from '../utils/ViewEntireBlog'
import '../blog.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: 325,
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    margin: '0 auto',
    marginTop: '10px'
  },
  button: {
    margin: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    width: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  spacingLeft: {
    marginLeft: 15
  }
}))

const Blog = (props) => {
  const { views, likes, is_published: isPublished, currentTab, title, thumbnail, created_at: createdAt, is_reviewed: isReviewed, id, deleteBlog, content, blog_fk: blogRatings, id: blogId, genre: genreList, is_drafted: drafted, is_revision_required: isRevisionRequired, blog_fk_revision: blogFkRevision } = props
  const blogFeedback = blogFkRevision[0] ? blogFkRevision[0].feedback : 'Feedback not yet given'

  const classes = useStyles()
  const [open, setOpen] = useState(false)
  // const [like, setlike] = useState(0)
  const [showEntireBLog, setShowEntireBlog] = useState(false)
  const [personalInfo] = useState(JSON.parse(localStorage.getItem('user_profile')).personal_info)

  const handleOpen = () => {
    setOpen(true)
  }

  const getFormatedDate = () => {
    const date = new Date(createdAt)
    const month = date.toLocaleString('default', { month: 'long' })
    const dt = date.getDate()
    const year = date.getFullYear()
    return `${month} ${dt}, ${year}`
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEdit = () => {
    props.history.push(`/blog/edit/${id}`)
  }

  const handleReadBlog = () => {
    setShowEntireBlog(true)
  }

  const blogClosed = () => {
    setShowEntireBlog(false)
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete?')
    if (confirmDelete) {
      deleteBlog(id)
    }
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

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <div className='onblog'>
          <CardMedia
            className='student__blog--media'
            image={`${thumbnail}`}
            title={title}
          ><div className='student__blog--overlay' />
            <div
              className='Read_Blog_Button'
              variant='outlined'
              color='primary'
              onClick={handleReadBlog}
            >
              Read Blog
            </div>

          </CardMedia>
          <CardContent>
            <Typography className={classes.title} color='textSecondary' gutterBottom>
              {ReactHtmlParser(title)}&nbsp;&nbsp;&nbsp;&nbsp; {getFormatedDate()}&nbsp;&nbsp;  {views}views
              <div className='student__blog--author'>
                {isRevisionRequired && isReviewed ? <p style={{ color: 'purple' }}>Feedback:{blogFeedback} </p> : ''}
                {isReviewed ? <div>
                  <p style={{ color: 'orange' }}>
                REVIEWED</p>
                </div> : ''}&nbsp; &nbsp;
                {isPublished ? <div>
                  <p style={{ color: 'green' }}>PUBLISHED</p>
                </div> : ''}
              </div>
            </Typography>
          </CardContent>

          <React.Fragment>

            {
              isReviewed
                ? <CardActions disableSpacing>
                  <Box component='fieldset' borderColor='transparent'>
                    <RatingScale rating={blogRatings[0] ? blogRatings[0].average_rating : 0} />
                  </Box>
                  <Button
                    variant='outlined'
                    color='primary'
                    className={classes.button}
                    startIcon={<VisibilityIcon />}
                    onClick={handleOpen}
                    size='small'
                  >
                  View Review
                  </Button>
                </CardActions>
                : <div>
                  {
                    genreList !== null && genreList !== undefined ? <Typography style={{ color: 'blue', 'margin-left': '1rem', display: 'flex', 'text-transform': 'capitalize' }}>Genre :&nbsp;{genreList && genreList.genre} {genreList && genreList.genre_subtype ? (genreList && '(' + ' ' + genreList.genre_subtype + ' ' + ')') : ''}</Typography> : ''

                  }
                  {
                    drafted ? <Typography className={classes.spacingLeft}>Drafted</Typography> : <Typography className={classes.spacingLeft}>Yet to be reviewed</Typography>

                  }
                </div>

            }
          </React.Fragment>
          {currentTab !== 1
            ? <CardActions>
              <Grid container>
                <Grid item xs={3} >
                  <Button>
                    <Favorite style={{ color: 'red' }} />{likes}</Button>
                </Grid>
                <Grid item xs={3} >
                  <Button
                    onClick={handleEdit}
                    variant='outlined'
                    className={classes.button}
                    startIcon={<EditIcon />}
                    color='primary'
                    style={{ width: '70px' }}
                    size='small'
                    disabled={isReviewed === true && isRevisionRequired === false}
                  >Edit
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant='outlined'
                    size='small'
                    style={{ width: '70px' }}
                    className={classes.button}
                    color='secondary'
                    disabled={isReviewed}
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >Delete</Button>
                </Grid>

              </Grid>
            </CardActions> : ''}
        </div>
      </Card>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div>
              <HighlightOffIcon
                onClick={handleClose}
                className='closemodal'
              />
              <Review alert={props.alert} overallRemark={getOverAllRemark} blogId={blogId} ratingParameters={getRatings} />
            </div>
          </div>
        </Fade>
      </Modal>
      <React.Fragment>
        {
          showEntireBLog
            ? <ViewEntireBlog blogRatings={[]} blogClosed={blogClosed} content={content} author={personalInfo.first_name} blogTitle={title} blogThumbnail={thumbnail} />
            : ''
        }

      </React.Fragment>
    </React.Fragment>
  )
}
export default withRouter(Blog)
