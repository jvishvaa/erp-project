import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { TextareaAutosize, withStyles } from '@material-ui/core'
import { urls } from '../../../urls'
import './note.css'
/* global screen */
const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  drawerPaper: {
    width: '500px',
    overflow: 'hidden'
  }
})
class TakeNote extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      noteData: '',
      auth: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      date: new Date(),
      minWidth: ''
    }
    this.delayedCallback = _.debounce((value) => {
      this.handleAutoSave(value)
    }, 10000)
    this.getOnChangeData = this.getOnChangeData.bind(this)
  }

  componentDidMount () {
    this.getNotes()
    this.setState({
      minWidth: window.screen.width
    })
    window.addEventListener('orientationchange', this.handleClose)
  }

  componentWillUnmount () {
    window.removeEventListener('orientationchange', this.handleClose)
  }
  componentWillUpdate (nextProps, nextState) {
    const paramTobeSent = ['open']
    const updated = paramTobeSent.some((paramKey) => nextState[paramKey] !== this.state[paramKey])
    if (updated) {
      this.props.updateStateToParent(nextState)
    }
  }
  // componentWillMount () {
  //   this.setState({ open: false }, this.handleClickOpen)
  // }
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')

  getNotes=() => {
    const { auth } = this.state
    const { RecordedLetureQuestionPaper } = urls
    let videoId = document.location.href.split('?')
    let lmsId = videoId[1].split('&')[1].split('=')[1]

    let params = [
      ['lms_video_id', lmsId && lmsId ? lmsId : '']
    ]

    let query = this.createQuery(params)
    let pathWithQuery = RecordedLetureQuestionPaper + '?' + query

    axios.get(pathWithQuery, {
      headers: {
        Authorization: 'Bearer ' + auth.token

      }
    })
      .then(res => {
        if (res.data.data.lms_vrl_details_user.notes !== null) {
          this.setState({
            noteData: res.data.data.lms_vrl_details_user.notes

          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
     handleClickOpen = () => {
       const { open } = this.state
       var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
       console.log('Orientation', orientation)
       if (window.isMobile) {
         if (orientation === 'portrait-secondary' || orientation === 'portrait-primary') {
           console.log('Mmmh... you should rotate your device to landscap')
           this.setState({ open: !open }, () => {
             this.getNotes()
           })
         } else if (orientation === 'landscape-secondary' || orientation === 'landscape-primary') {
           window.alert('This orientation is not supported for mobile.')
         } else if (orientation === undefined) {
           this.setState({ open: !open }, () => {
             this.getNotes()
           })
         }
       } else {
         this.setState({ open: !open }, () => {
           this.getNotes()
         })
       }
     }

handleClose = () => {
  this.setState({ open: false }, () => {
  })
}

handleAutoSave = () => {
  const { noteData, auth } = this.state
  let videoId = document.location.href.split('?')
  let data = {
    lms_video_id: videoId[1].split('&')[1].split('=')[1],
    notes: noteData
  }

  axios.put(urls.RecordedLeture, data, {
    headers: {
      Authorization: 'Bearer ' + auth.token

    }
  })
    .then(res => {
      this.setState({
        date: new Date()

      })
    })
    .catch(err => {
      console.log(err)
    })
}
getOnChangeData=(e) => {
  const { value } = e.target
  this.setState({
    noteData: value
  }, () => {
    this.delayedCallback(value)
  })
}
takeNote=() => {
  const { noteData, minWidth } = this.state

  return (
    <React.Fragment>
      <div style={{ width: minWidth > 1024 ? '' : '242px' }}>
        <TextareaAutosize className='notepad'
          value={noteData} onChange={this.getOnChangeData}
          placeholder='take your notes here' style={{ 'min-height': minWidth > 1024 ? '93vh' : '86vh', height: '0px', overflow: 'auto' }}

        />
        <div style={{ position: 'relative', float: 'right', 'margin-top': minWidth > 1024 ? '-95vh' : '-87vh', 'margin-right': minWidth > 1024 ? '10px' : '-18px' }}>
          <svg xmlns='http://www.w3.org/2000/svg' width='64' height={minWidth > 1024 ? '34' : '20'} viewBox='0 0 64 64' onClick={this.handleClose}>
            <g id='Group_6' data-name='Group 6' transform='translate(-1822 -833)'>
              <g id='Ellipse_2' data-name='Ellipse 2' transform='translate(1822 833)' fill='#fff' stroke='#7dc37d' strokeWidth='2'>
                <circle cx='32' cy='32' r='32' stroke='none' />
                <circle cx='32' cy='32' r='31' fill='none' />
              </g>
              <g id='Group_3' data-name='Group 3' transform='translate(16 -38)'>
                <line id='Line_1' data-name='Line 1' x1='19' y2='24' transform='translate(1829.5 891.5)' fill='none' stroke='#7dc37d' strokeLinecap='round' strokeWidth='4' />
                <line id='Line_2' data-name='Line 2' x2='19' y2='24' transform='translate(1829.5 891.5)' fill='none' stroke='#7dc37d' strokeLinecap='round' strokeWidth='4' />
              </g>
            </g>
          </svg>
        </div>

      </div>

    </React.Fragment>

  )
}
render () {
  const { open, minWidth } = this.state
  return <div style={{ ...this.props.__style }} >
    {open
      ? <React.Fragment>
        {/* <div style={{ margin: 'auto', width: '100%' }}> */}

        {this.takeNote()}
        {/* </div> */}
      </React.Fragment>
      : <div style={{ marginTop: minWidth > 1024 ? '-90vh' : '-81vh' }}>
        <svg xmlns='http://www.w3.org/2000/svg' width='64' height='53' viewBox='0 0 64 64' onClick={this.handleClickOpen}>
          <g id='Group_5' data-name='Group 5' transform='translate(-1833 -865)'>
            <circle id='Ellipse_3' data-name='Ellipse 3' cx='32' cy='32' r='32' transform='translate(1833 865)' fill='#7dc37d' />
            <g id='Group_2' data-name='Group 2' transform='translate(-117 -1377)'>
              <path id='Path_1' data-name='Path 1' d='M1989.257,2260.111h-19.4s-3.035-.153-2.968,3.428,0,22.229,0,22.229.155,3.428,2.968,3.428h19.4s2.968.231,2.968-3.428V2270.7' transform='translate(3.928)' fill='none' stroke='#fff' strokeWidth='2' />
              <path id='Path_2' data-name='Path 2' d='M1991.322,2288.477l-18.089-6.024v3.436s.143,3.436-3.006,3.315' transform='translate(3.441)' fill='#fff' stroke='#fff' strokeWidth='2' />
              <g id='Group_1' data-name='Group 1' transform='translate(-46.819 6.103)'>
                <path id='Path_3' data-name='Path 3' d='M2041.906,2255.223l-9.279,11.246-2.28,5.933s-.173.526.165.754a1.068,1.068,0,0,0,.871,0l5.134-3.187,9.363-11.56Z' transform='translate(0 -0.423)' fill='#fff' />
                <path id='Path_4' data-name='Path 4' d='M2044.38,2253.886l4.047,3.171,1.088-1.34a1.3,1.3,0,0,0,0-1.831c-.9-.823-2.322-1.911-2.322-1.911a1.14,1.14,0,0,0-1.579.345C2044.844,2253.249,2044.38,2253.886,2044.38,2253.886Z' transform='translate(-1.737)' fill='#fff' />
              </g>
            </g>
          </g>
        </svg>
      </div>
    }
  </div>
}
}

export default withStyles(styles)(TakeNote)
