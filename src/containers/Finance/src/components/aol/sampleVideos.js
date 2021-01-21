import React from 'react'
// import axios from 'axios'
// import { makeStyles } from '@material-ui/core/styles'
// import Timer from 'react-compound-timer'
import { Paper, Grid, Button } from '@material-ui/core'
import './aol.css'
import Nav from './nav'
// import logo from './assets/logo.png'

// import AccountCircle from '@material-ui/icons/AccountCircle'
// import LockIcon from '@material-ui/icons/Lock'

// const useStyles = makeStyles(theme => ({
//   margin: {
//     margin: theme.spacing(1),
//   },
//   pap: {
//     // width: '40%'
//   }
// }))
function SampleVideos (props) {
  // const videoList = [
  //   {
  //     videoTitle: 'Simplifying Calculations | Maths | Thought Park',
  //     link: 'https://www.youtube.com/embed/qcO5FyrMo9k'
  //   },
  //   {
  //     videoTitle: 'Elements and Compounds | Thought park Chemistry',
  //     link: 'https://www.youtube.com/embed/okGKDjD2FiI'
  //   },
  //   {
  //     videoTitle: 'Our Solar System | Geography | Thought Park',
  //     link: 'https://www.youtube.com/embed/ZCJXSonVsXY'
  //   },
  //   {
  //     videoTitle: 'Early Humans : The Stone Ages | History | Thought Park',
  //     link: 'https://www.youtube.com/embed/gL4-fI0rNtA'
  //   },
  //   {
  //     videoTitle: 'Thought Park English Grammar | Introduction of NOUN',
  //     link: 'https://www.youtube.com/embed/oWlDBUsBnbg'
  //   },
  //   {
  //     videoTitle: 'Art and Craft | Make Flower Prints with Balloons | Thought Park',
  //     link: 'https://www.youtube.com/embed/dl3kX-qRjAg'
  //   }
  // ]
  const videoList = [
    {
      videoTitle: 'Rocks and Their Types | Geography | Thought Park',
      link: 'https://www.youtube.com/embed/LGkSD1u8jKw'
    },
    {
      videoTitle: 'Maths | Simplifying Calculations | Addition and Subtraction | Associations | Thought Park',
      link: 'https://www.youtube.com/embed/qcO5FyrMo9k'
    },
    {
      videoTitle: 'Elements and Compounds | Thought park Chemistry',
      link: 'https://www.youtube.com/embed/okGKDjD2FiI'
    },
    {
      videoTitle: 'Our Solar System | Geography | Thought Park',
      link: 'https://www.youtube.com/embed/ZCJXSonVsXY'
    },
    {
      videoTitle: 'Maths | Divisibility Test of 11 | Thought Park',
      link: 'https://www.youtube.com/embed/E6ZnuMM_M5A'
    },
    {
      videoTitle: 'Maths | Solving long expressions using Distributive Property | Thought Park',
      link: 'https://www.youtube.com/embed/RZswHat34VE'
    },
    {
      videoTitle: 'Layers of Earth: Part 1 | Geography | Thought Park',
      link: 'https://www.youtube.com/embed/zXgerqzjXQA'
    },
    {
      videoTitle: 'Maths | Simplifying Calculations | Addition and Subtraction | Associations | Thought Park',
      link: 'https://www.youtube.com/embed/qcO5FyrMo9k'
    }
  ]

  const viewMoreHandler = () => {
    window.open('https://www.youtube.com/channel/UCGxtpqR_RdVq1dqkUehLZCg/videos', '_blank')
  }
  const isLoggedIn = !!(localStorage.getItem('id_token'))

  return (
    <React.Fragment>
      {!isLoggedIn && <Nav />}
      <div className='wrapper'>
        {isLoggedIn ? <h1>&nbsp;</h1> : <h1>Thought Park Library</h1>}

        <Grid container spacing={3}>
          {videoList.length && videoList.map((video, index) => (
            <Grid item md={4} xs={12} key={index + 1}>
              <Paper elevation={2}>
                <iframe width='100%' height='200' title={video.videoTitle} src={video.link} frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
                <h4 style={{ margin: 0, padding: 20 }}>{video.videoTitle}</h4>
              </Paper>
            </Grid>
          ))}
          <Grid item md={12} xs={12}>
            <Button variant='outlined' color='primary' style={{ float: 'right' }} onClick={viewMoreHandler}>View More</Button>
          </Grid>
          {/* <Grid item xs={12}>
            <h1 style={{ textAlign: 'center' }}>Coming soon...</h1>
          </Grid> */}
        </Grid>
      </div>
    </React.Fragment>
  )
}

export default SampleVideos
