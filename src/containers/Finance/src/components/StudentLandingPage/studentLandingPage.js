import React, { Component } from 'react'
import UtilityImageCenter from './img/utility_center.svg'
import UtilityLeftBottom from './img/utility_left_bottom.svg'
import UtilityRightBottom from './img/utility_right_bottom.svg'
import Student from './img/student_eye_blink.gif'
import './styles.css'

class StudentLandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSlide: 1,
      totalSlides: JSON.parse(localStorage.getItem('user_profile')).personal_info.role === 'Student' ? 4 : 2,
      role: JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    }
  }

  componentDidMount () {
    this.interval(false)
  }

  interval = (clear) => {
    if (clear) {
      clearTimeout(this.timeOut)
      return
    }
    this.timeOut = setInterval(() => this.tick(), 3000)
  }

  tick = () => {
    const { currentSlide, totalSlides } = this.state
    const slide = currentSlide === totalSlides ? 1 : currentSlide + 1
    this.setState(state => ({ currentSlide: slide }))
  }

  getSliderContent = (slideNumber, content) => {
    const { currentSlide } = this.state
    return (
      <h2 className={`studentlanding__announcement--container ${currentSlide === slideNumber ? 'show__carousel' : 'hide__carousel'}`}
        onMouseOver={() => { this.interval(true) }}
        onMouseOut={() => { this.interval(false) }}>
        {content}
      </h2>
    )
  }

  render () {
    let name = JSON.parse(localStorage.getItem('user_profile')).personal_info.first_name
    let greeting
    var time = new Date().getHours()
    if (time < 12) {
      greeting = 'Good Morning'
    } else if (time < 16) {
      greeting = 'Good Afternoon'
    } else {
      greeting = 'Good Evening'
    }
    return (
      <React.Fragment>
        <section
          style={{ height: '65vh', position: 'relative' }}
          className='student__landingpage--container'
          id='home'>
          <img className='studentlanding__logo' src='https://letseduvate.s3.ap-south-1.amazonaws.com/prod/build/static/media/logo.56aee486.png' />
          <div className='studentlanding__greetings--container'>
            <h2 className='greeting__timeof_theday'>{greeting}</h2>
            <h2 className='greeting__student--name'>{name}</h2>
            {this.getSliderContent(
              1,
              <React.Fragment>
                <span className='studentlanding__announcement--whatsnew'>What's new?</span><br />
              Our very own Radio Station - <span className='orchadio__logo--yellow orchadio__logo'>orchadio</span>.<br /> Tune in to listen to exciting programmes by the kids, for the kids!
              </React.Fragment>
            )}
            {
              this.getSliderContent(
                this.state.role === 'Student' ? 2 : 3,
                <React.Fragment>
                  Help your peers by answering questions they have, post your own queries, have a healthy debate, or just see what everyone is talking about in our latest addition, the <span className='orchadio__logo--red orchadio__logo'>Discussion Forum! </span>Go check it out!
                </React.Fragment>
              )
            }
            {
              this.getSliderContent(
                this.state.role === 'Student' ? 3 : 2,
                <React.Fragment>
                  Want to experience learning with fun? Here's some specially curated informative yet entertaining content for you. Click on <span className='orchadio__logo--green orchadio__logo'>Publications</span> in the menu, check out the newly added content and experience learning like never before.
                </React.Fragment>
              )
            }
            {
              this.getSliderContent(
                4,
                <React.Fragment>
                  Want to treasure these moments of a lifetime? Here's an opportunity for you to heart out and share thoughts, feelings and accounts of your daily life through
                  <span className='orchadio__logo--green orchadio__logo'>The Lockdown Journal</span>. Get ready to rediscover yourself like never before.
                </React.Fragment>
              )
            }
          </div>
          <div className='studentlanding__centerimage--container'>
            <img src={UtilityImageCenter} alt='Landing Page' className='studentlanding__centerimage' />
            <img src={Student} alt='Student Studying' className='studentlanding__studying' />
          </div>
          <div className='studentlanding__leftbottom--container'>
            <img src={UtilityLeftBottom} alt='Landing Page' className='studentlanding__leftbottomimage' />
          </div>
          <div className='studentlanding__rightbottom--container'>
            <img src={UtilityRightBottom} alt='Landing Page' className='studentlanding__rightbottomimage' />
          </div>
        </section>
      </React.Fragment>)
  }
}
export default StudentLandingPage
