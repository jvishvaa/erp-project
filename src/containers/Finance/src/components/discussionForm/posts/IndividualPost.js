import React, { useState, useEffect } from 'react'
import { withStyles, Paper, Divider, Button, Grid, Dialog, DialogContent, IconButton, Typography, Box } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import ReactHtmlParser from 'react-html-parser'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import StarsIcon from '@material-ui/icons/Stars'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import styles from './individualPost.style'
import './IndividualPost.css'

function IndividualPost ({ data, showAns, getData, number, likeFunction, classes, addAwardFunction, awwardResponse, rewardListInfo }) {
  const sendDataBack = (question, number) => {
    showAns()
    getData(question, number)
  }
  const [open, setOpen] = useState(false)
  const [rewardList] = useState(rewardListInfo)
  const [selectAward, setSelectedAward] = useState('')
  const [awardId, setAwardId] = useState('')
  const [likeInfo, setLikeInfo] = useState(data.user_like)
  function handleImage (data, id) {
    setAwardId(id)
    setSelectedAward(data)
  }

  function handleLike (id) {
    setLikeInfo(!likeInfo)
    likeFunction(data.id)
  }

  useEffect(() => {
    if (awwardResponse) {
      handleClose()
    }
  }, [awwardResponse])

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

  function functionToOpenModel () {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedAward('')
  }

  function OpenAward () {
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
          Give An Reward to this Post <b style={{ color: 'blue' }}>{data.title}</b>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} alignContent='center' justify='center'>
            {rewardList && rewardList.map((item) => (
              <Grid item md={4} xs={4} key={item.id}>
                <Box border={3} className={classes.imageHover} style={{ textAlign: 'center', borderColor: selectAward === item.award_name ? '#835' : 'lightgray' }} onClick={() => handleImage(item.award_name, item.id)}>
                  <img src={require(`./${item.award_name}.jpg`)} width='40%' height='30%' alt='crash' />
                </Box>
                <Typography style={{ textAlign: 'center' }}>{item.award_name}</Typography>
              </Grid>
            ))}
            <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
              <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={() => addAwardFunction(selectAward, data.id, awardId)}
              >
                   Add Reward
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

      <Paper elevation={3} key={data.id} style={{ backgroundColor: number % 2 === 0 ? '#ffede2' : '#fff9f5', position: 'relative' }}>
        <div style={{ backgroundColor: number % 2 === 0 ? '#ffa76f' : '#b2ce41' }} className='colorBox' />

        <div className='post'>
          <Grid container spacing={2}>
            <Grid item md={3} xs={6}>
              <div className='topInfo'>
                <AccountCircleIcon className='nameIcon' />
                <span className='titleName'>{data.post_user !== null ? data.post_user.first_name : 'Random_User'}</span>
                <br />
                {data.post_related_data.branch &&
                <span style={{ fontFamily: 'time' }}>{data.post_related_data && data.post_related_data.branch && data.post_related_data.branch}</span>
                }
                {data.post_related_data.grade &&
                <span style={{ fontFamily: 'time' }}> > {data.post_related_data && data.post_related_data.grade && data.post_related_data.grade}</span>
                }
                {data.post_related_data.section &&
                <span style={{ fontFamily: 'time' }}> > {data.post_related_data && data.post_related_data.section && data.post_related_data.section}</span>
                }
              </div>
            </Grid>
            <Grid item md={2} xs={2} justify='center' alignContent='center'>
              {data.gold_count !== 0 && <><img src='https://img.icons8.com/color/30/000000/gold-medal--v1.png' alt='crash' /></>}
              {data.silver_count !== 0 && <><img src='https://img.icons8.com/office/30/000000/olympic-medal-silver.png' alt='crash' /></>}
              {data.bronze_count !== 0 && <><img src='https://img.icons8.com/officel/30/000000/olympic-medal-bronze.png' alt='crash' /></>}
            </Grid>
            <Grid item md={3} />
            <Grid item md={4} xs={4}>
              <span style={{ fontFamily: 'time' }}>{data.category && data.category.title && data.category.title}</span>
              {data.sub_category &&
              <span style={{ fontFamily: 'time' }}> > {data.sub_category && data.sub_category.title && data.sub_category.title}</span>
              }
              {data.sub_sub_category &&
              <span style={{ fontFamily: 'time' }}> > {data.sub_sub_category && data.sub_sub_category.title && data.sub_sub_category.title}</span>
              }
            </Grid>
          </Grid>
          <a onClick={() => sendDataBack(data, number)} style={{ cursor: 'pointer' }}>
            <p className='title'>{data.title}</p>
          </a>
          <div className='question' style={{ height: '30px', overflow: 'hidden' }}>{ReactHtmlParser(data.description)}</div>
          <Divider />
          <div className='extraInfo'>
            <span className='like-span'>{data.like_count} &nbsp; <ThumbUpIcon className='thumbsUp' style={{ color: likeInfo ? 'blue' : '' }} onClick={() => handleLike(data.id)} /></span> &nbsp;&nbsp; . &nbsp;
            <span>{data.comment_count} answers</span>  &nbsp; . &nbsp;
            <span>{data.post_creation_ago}</span>  &nbsp; &nbsp;
            <span><Button style={{ color: '#888' }} onClick={() => functionToOpenModel(data.id)}><StarsIcon /> Give Award</Button></span>
            <span>
              {data.gold_count !== 0 && <> &nbsp; <span> Gold Awards = {data.gold_count}</span> &nbsp;</>}
              {data.silver_count !== 0 && <> &nbsp;<span> Silver Awards = {data.silver_count}</span> &nbsp;</>}
              {data.bronze_count !== 0 && <>&nbsp; <span> Bronze Awards = {data.bronze_count}</span> &nbsp;</>}
            </span>
          </div>
        </div>
      </Paper>
      {OpenAward()}
    </>
  )
}
export default withStyles(styles)(IndividualPost)
