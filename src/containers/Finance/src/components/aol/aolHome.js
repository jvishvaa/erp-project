import React, { useEffect, useState, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grid, Button, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import './aol.css'
// import AolLogin from './aolLogin'
import Nav from './nav'
import RegisterationForm from './register'
import SampleVideos from './sampleVideos'
import Footer from './footer'
import banner from './assets/banner1.png'
import notebook from './assets/notebook.png'
import learn from './assets/learning.png'
import online from './assets/instructor.png'
import ThankYou from './thankYou'
import { qBUrls } from '../../urls'
import ClassCounter from './classCounter'

// function rand () {
//   return Math.round(Math.random() * 20) - 10
// }

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #fff',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const Home = (props) => {
  const classes = useStyles()
  const [showModal, setShowModal] = useState(false)
  // const [showModal, setShowModal] = useState(false)
  const [video, setVideo] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [noOfClasses, setNoOfClasses] = useState(0)
  const [duration, setDuration] = useState(0)
  const [modalStyle] = useState(getModalStyle)

  useLayoutEffect(() => {
    let w = window.innerWidth
    if (w < 500) {
      setIsMobile(true)
    }
  }, [setIsMobile])
  useEffect(() => {
    axios
      .get(qBUrls.ClassCounterUrl)
      .then(res => {
        console.log('res', res)
        if (res && res.data) {
          setNoOfClasses(res.data.last_seven_days_new_classes_added)
          setDuration(res.data.total_duration_onlineclass)
        }
      }).catch(error => {
        console.clear()
        console.log(error)
      })
  }, [])

  const handleModal = (title) => {
    setShowModal(!showModal)
    setVideo(title)
  }
  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 style={{ textAlign: 'center' }} id='simple-modal-title'>{video === 'aol' ? 'About Always On Learning' : 'Testimonial'}</h2>
      <video width='100%' height={isMobile ? '260' : '300'} controls>
        <source src={video === 'aol' ? 'https://letseduvate.s3.ap-south-1.amazonaws.com/aol/WhatsApp+Video+2020-03-30+at+4.00.57+PM.mp4' : 'https://letseduvate.s3.ap-south-1.amazonaws.com/aol/WhatsApp+Video+2020-03-30+at+4.00.56+PM.mp4'} type='video/mp4' />
      </video>
    </div>
  )
  return (
    <React.Fragment>
      <Nav style={{ zIndex: 999 }} alert={props.alert} isMobile={isMobile} duration={duration} classNo={noOfClasses} />
      {isMobile
        ? <div style={{ backgroundColor: '#ace5fd', zIndex: 99, margin: 0 }}>
          <ClassCounter duration={duration} classNo={noOfClasses} />
        </div>
        : ''}
      <Grid container spacing={0} className='home__css'>
        <Grid item md={7} xs={12}>
          <div className='wrapper'>
            <div className='banner'>
              <img src={banner} alt='banner' width='100%' />
              <a href='#reg' className='register_btn'><Button variant='contained' style={{ color: '#fff', background: '#5fc4d6' }}>Register Now</Button></a>
            </div>
            <div style={{ margin: '25px 0px' }}>
              <h1 style={{ marginTop: 0 }}>Overview</h1>
              <p>Always on Learning (AOL) is a platform for students that allows students an access to an enhanced remote learning experience. Apart from live online classes, students of all grades will get practice questions for various subjects and online videos.</p>
              <div style={{ margin: '25px 0px' }}>
                <video width='100%' height={isMobile ? '230' : '300'} controls>
                  <source src='https://alwaysonlearning.s3.ap-south-1.amazonaws.com/AOL+Features+SD.mp4+' type='video/mp4' />
                </video>
              </div>
            </div>
            <div className='features'>
              <div className='single-feature'>
                <div className='feature-img'>
                  <img src={online} alt='banner' width='100px' height='100px' />
                </div>
                <div className='feature-content'>
                  <h3>Online Streamed Classes</h3>
                  <p>This is an online programme that will allow the LIVE interaction between students and subject experts. This is intended to address the students with doubts, or even without, and help them comprehend the complex topics of a subject.</p>
                </div>
              </div>
              <div className='single-feature'>
                <div className='feature-img'>
                  <img src={notebook} alt='banner' width='100px' height='100px' />
                  {/* <p>Practice Questions</p> */}
                  {/* <div>Icons made by <a href='https://www.flaticon.com/authors/flat-icons' title='Flat Icons'>Flat Icons</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a></div> */}
                </div>
                <div className='feature-content'>
                  <h3>Practice Questions</h3>
                  <p>For the students who seek excellence through practice, this is the right platform. Here is a bank of practice questions that can be conceptual and challenging for a pupil to attempt and practice. As always, practice leads to perfection.</p>
                </div>
              </div>
              <div className='single-feature'>
                <div className='feature-img'>
                  {/* <p>LMS LOGO</p> */}
                  <img src={learn} alt='banner' width='100px' height='100px' />
                </div>
                <div className='feature-content'>
                  <h3>LMS- Subject Online Videos</h3>
                  <p>This includes meticulously tailor-made videos on specific subject that caters to the conceptual understanding, and rather in an exciting way. Students can select the video as per their choice and subject of their interest.</p>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid id='reg' item md={5} xs={12}>
          <RegisterationForm alert={props.alert} history={props.history} />
        </Grid>
      </Grid>
      <div className='aol_testi'>
        <div>
          <h1 style={{ textAlign: 'center', marginBottom: 10 }}>Testimonial</h1>
        </div>
        <div className='wrapper' style={{ textAlign: 'center' }}>
          <video width={isMobile ? '100%' : '70%'} height={isMobile ? '230' : '300'} controls>
            <source src='https://alwaysonlearning.s3.ap-south-1.amazonaws.com/AOL+Testimonials+Feedback+SD.mp4+' type='video/mp4' />
          </video>
        </div>
      </div>
      <Modal
        open={showModal}
        onClose={handleModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {modalBody}
      </Modal>
    </React.Fragment>
  )
}

function AolHome ({ alert }) {
  useEffect(() => {
    // alert.success('mounted')
  }, [])
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/' exact component={() => <Home alert={alert} />} />
          {/* <Route path='/aolLogin' exact component={() => <AolLogin alert={alert} />} /> */}
          <Route path='/videos' exact component={SampleVideos} />
          <Route path='/thankyou' exact component={ThankYou} />
        </Switch>
        {/* <Route path  */}
        <Footer />
      </div>
    </Router>
  )
}

export default AolHome
