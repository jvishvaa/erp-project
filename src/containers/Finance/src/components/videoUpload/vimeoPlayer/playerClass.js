import React from 'react'
import Player from '@vimeo/player'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import QuestionsContainer from '../../OnlineClass/RecordedLecturesQuestions/QuestionsContainer'
import './player_stylesheet.css'
import TakeNote from '../../OnlineClass/RecordedLecturesQuestions/takeNote'

class PlayerInstance extends React.Component {
    state={ duration: 0, seconds: undefined, isPaused: undefined }
    constructor (props) {
      super(props)
      let { videoId } = props
      if (!videoId) {
        window.alert('no video id')
      }
    }
    onPlay = (data) => {
      this.setState({ isPaused: false, isEnded: false }, () => {
        this.updatePlaybackPosition()
      })
    }
    onPause=() => {
      this.setState({ isPaused: true })
    }
    onEnded = () => {
      this.setState({ isPaused: true, isEnded: true })
    }
    updatePlaybackPosition = () => {
      if (!this.player) return
      if (!this.state.duration) {
        this.player.getDuration().then(duration => {
          this.setState({ duration })
        })
      }
      this.player.getCurrentTime().then(seconds => {
        this.setState({ seconds })
        if (seconds <= this.state.duration && !this.state.isPaused) {
          this.updatePlaybackPosition()
          // console.log(seconds, 'mk')
        }
        // if (seconds >= 9.200 && seconds <= 9.218) {
        //   this.pause()
        // }
      })
    }
    resume=() => {
      if (!this.player) return
      // const { isEnded } = this.state
      // if (isEnded) {
      //   console.log('video already ended', 'condition failed, player error: resume func')
      //   return null
      // }
      this.player.play().then(() => {
        // The video is playing
      }).catch((error) => {
        console.log(error, 'player error: resume func')
        switch (error.name) {
          case 'PasswordError':
            // The video is password-protected
            break

          case 'PrivacyError':
            // The video is private
            break

          default:
            // Some other error occurred
            break
        }
      })
    }
    pause=() => {
      if (!this.player) return
      this.player.pause().then(() => {
        // The video is paused
      }).catch((error) => {
        console.log(error, 'player error: pause func')
        switch (error.name) {
          case 'PasswordError':
            // The video is password-protected
            break

          case 'PrivacyError':
            // The video is private
            break

          default:
            // Some other error occurred
            break
        }
      })
    }
    setThePlaybackPosition=(seconds, seekAndPlay = false) => {
      if (!this.player) return
      this.player.setCurrentTime(seconds).then((seconds) => {
        // `seconds` indicates the actual time that the player seeks to
        // eslint-disable-next-line no-debugger
        // debugger
        if (seekAndPlay) {
          this.updatePlaybackPosition()
          this.resume()
        }
      }).catch((error) => {
        console.log(error, 'player error: setThePlaybackPosition func')
        switch (error.name) {
          case 'RangeError':
            // The time is less than 0 or greater than the video's duration
            break

          default:
            // Some other error occurred
            break
        }
      })
    }
    getChildsState=({ open: notesOpen } = {}) => {
      this.setState({ __notes_open: notesOpen })
    }
    componentDidMount () {
      var iframe = document.getElementById(this.props.videoId)
      if (iframe) {
        this.player = new Player(iframe)
        // eslint-disable-next-line no-debugger
        // debugger
        this.player.on('play', this.onPlay)
        this.player.on('pause', this.onPause)
        this.player.on('ended', this.onEnded)
        this.player.ready().then(() => {
          // The player is ready

          this.setState({ playerReady: true })
        })
        this.player.getVideoTitle().then(title => {
          this.setState({ title })
        }).catch((error) => {
          console.log(error, 'player error: getVideoTitle func')
          // eslint-disable-next-line no-debugger
          // debugger
        })
        // this.setThePlaybackPosition(10)
        // player.getVideoUrl().then(function(url) {
        //   // `url` indicates the vimeo.com URL of the video
        // }).catch(function(error) {
        //   switch (error.name) {
        //       case 'PrivacyError':
        //           // The URL isn't available because of the video's privacy setting
        //           break;

        //       default:
        //           // Some other error occurred
        //           break;
        //   }
        // });
      }
    }
    // {/* {
    //   <div className='bar'>
    //     {this.state.playerReady ? 'Player ready' : 'player not ready'}
    //     <p>{Math.round(this.state.seconds)}/{this.state.duration}</p>
    //     <button onClick={this.pause} >pause</button>
    //     {this.state.seconds && <button onClick={this.resume} >resume</button>}
    //     <button onClick={this.setThePlaybackPosition} >set</button>
    //     {this.state.title}
    //   </div>
    // } */}
    iconBtnStyles={
      background: 'rgba(0, 0, 0,0.5)',
      boxShadow: '0px 0px 2px black',
      borderRadius: '17px',
      padding: 4,
      minWidth: '34px',
      minHeight: '34px',
      maxHeight: '34px'
    }

    iconStyles={ padding: 0, margin: 0, fontSize: '1.6rem', fontWeight: 'bolder', color: 'white' }

    render () {
      // eslint-disable-next-line no-unused-vars
      let { style, width, height, handleClose, videoDataObj, isRecordedLecture, ...rest } = this.props
      isRecordedLecture = true
      let { chapterName, subjectName, gradeName, title: titleFromProps, lmsId, videoId } = videoDataObj || {}
      let { playerReady, mouseOver, isPaused, title, isEnded } = this.state
      console.log(this.props.tab)
      // wrapperDimentions= {__}
      return <div
        className='holder' id='holder'
        style={{
          width: `${width}px`,
          height: `${height}px`,
          padding: 5 }}

      >
        {
          !playerReady
            ? <div className='loading-bar'>
                Loading...
            </div>
            : null
        }

        <div
          style={{ position: 'absolute', top: 0, zIndex: '100' }}
          className={
            // [
            //   'closebtn-titlebar-wrapper',
            mouseOver || isPaused || !playerReady || isPaused === undefined // undefined indicates no video data yet
              ? 'fadeInAnimation' : 'fadeOutAnimation'
            // ].join(' ')
          }
        >
          <IconButton onClick={handleClose}
            style={this.iconBtnStyles}
            aria-label='upload picture'
            component='span'
          >
            <KeyboardArrowDownIcon
              onClick={handleClose}
              style={this.iconStyles}
            />
          </IconButton>

          <div className='title-bar' >
            {[
              title || titleFromProps,
              gradeName,
              subjectName,
              chapterName
            ].filter(item => !!item).join('  |  ')}
          </div>

        </div>

        {/* {
          isRecordedLecture
            ? <div className='text__notes'>
              <TakeNote makeAbort={this.pause} makePlay={this.resume} alertMessages={this.props.alertMessages} />
            </div>

            : null
        } */}

        <div style={{ boxSizing: 'content-box',
          margin: 0,
          padding: 0,
          // border: '1px solid blue',
          ...this.state.__notes_open ? { display: 'flex' } : {}
        }}>
          <div style={{
            boxSizing: 'content-box',
            // border: '1px solid red',
            width: `${(width - (width * (this.state.__notes_open ? 0.4 : 0)) - 10)}px`,
            margin: 0,
            padding: 0,
            height: height - 10
          }}>

            <iframe
              className='frame'
              // onMouseOver={() => { this.setState({ mouseOver: true }) }}
              // onMouseOut={() => { this.setState({ mouseOver: false }) }}
              key={this.props.videoId}
              src={this.props.uri}
              id={this.props.videoId}
              autoPlay
              frameBorder='0'
            // allowFullScreen
            // webkitallowfullscreen
            // mozallowfullscreen
            // {...rest}
            />
          </div>
          <TakeNote

            __style={{
              boxSizing: 'content-box',
              // border: '1px solid green',
              ...this.state.__notes_open
                ? {
                  width: `${(width - (width * (this.state.__notes_open ? 0.6 : 0)))}px`,
                  height: height - 10

                }
                : {
                  position: 'absolute',
                  bottom: 10,
                  right: 5,
                  padding: 0,
                  margin: 0,
                  zIndex: 100000
                }
            }}
            makeAbort={this.pause}
            makePlay={this.resume}
            alertMessages={this.props.alertMessages}
            updateStateToParent={this.getChildsState}
          />
          {/* </div> */}
        </div>
        {isRecordedLecture
          ? <div className='wrapper-to-player'>
            <QuestionsContainer
              // __style={{
              //   padding: '35px 35px 0px 35px',
              //   width: `${width - 35 - 35}px`,
              //   height: `${height - 35}px`,
              //   boxSizing: 'content-box',
              //   color: 'white'
              // }}
              __style={{
                padding: '35px 35px 0px 35px',
                width: `${(width - (width * (this.state.__notes_open ? 0.4 : 0)) - 35 - 35)}px`,
                height: `${height - 35}px`,
                boxSizing: 'content-box',
                color: 'white'
                // border: '1px solid orange'
              }}
              lmsId={lmsId}
              ___lmsId={2190}
              videoId={videoId}
              pause={this.pause}
              // resume={() => {
              // let seekPosition = Math.ceil(this.state.seconds + 0.5)
              // if (seekPosition > this.state.duration) {
              //   seekPosition = this.state.duration
              // }
              // // let seekPosition = this.state.seconds + 1
              // this.setThePlaybackPosition(seekPosition, true)
              // }}
              resume={this.resume}
              setThePlaybackPosition={this.setThePlaybackPosition}
              playbackPosition={String(Math.floor(this.state.seconds))}
              timeStamp={String(Math.floor(this.state.seconds))}
              playerState={{ playerReady, isEnded, isPaused, playbackPosition: this.state.seconds }}
              handleClose={handleClose}
            />
          </div> : null
        }

      </div>
    }
}
export default PlayerInstance
