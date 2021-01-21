import React from 'react'
import { Typography, Grid, Card, CardContent, Button, Slide, Dialog, AppBar, IconButton, Toolbar } from '@material-ui/core'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser'
import _ from 'lodash'
import { Drafts, HighlightOff, Visibility } from '@material-ui/icons'
import { apiActions } from '../../../_actions'
import { OmsSelect, InternalPageStatus } from '../../../ui'
import TinyMce from '../../../components/questbox/TinyMCE/tinyMce'
import { urls, qBUrls } from '../../../urls'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from '../utils/config'
import '../blog.css'
// import { async } from 'rxjs/internal/scheduler/async'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const minimumWordLimitList = [
  { 'Grade 4': 50 },
  { 'Grade 5': 50 },
  { 'Grade 6': 70 },
  { 'Grade 7': 70 },
  { 'Grade 8': 90 }

]
class WriteBlog extends React.Component {
  constructor () {
    super()
    this.state = {
      title: '',
      files: [],
      subjectId: '',
      textEditorContent: '',
      key: 0,
      isButtonDisabled: false,
      isEdit: false,
      count: 0,
      image: '',
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      genres: [],
      open: false,
      draftBlog: false,
      autoSaveForm: false,
      blogId: '',
      assignOtherGenre: false,
      otherGenreValue: '',
      genre: '',
      genreId: '',
      key1: 1,
      date: new Date(),
      minWidth: '',
      postCount: 0,
      setMessage: false,
      creating: true,
      promiseStatus: '',
      created: false,
      disableDraftButton: false,
      timeout: 0,
      wordCount: 0,
      submit: false

    }
    this.delayedCallback = _.debounce(() => {
      const { blogId, isEdit, creating } = this.state

      if (!blogId && !isEdit && this.isFormValid()) {
        const subceededWordCount = this.isWordCountSubceeded()
        if (subceededWordCount) {
          this.props.alert.error(subceededWordCount)
          return
        }

        if (creating) {
          this.postData()
            .then(res => {
              this.setState({
                creating: false,
                created: true
              })
            })
            .catch(err => {
              this.logError(err)
            })
        }
      }
      if (blogId && !isEdit && this.isFormValid()) {
        this.autoSaveUpdate()
      }
    }, 30000)

    this.handleGenreChange = this.handleGenreChange.bind(this)
  }

  componentDidMount () {
    const { match: { params } } = this.props

    this.gradeName = JSON.parse(localStorage.getItem('user_profile')).grade_name
    console.log(this.gradeName, 'gradename')
    if (this.gradeName) {
      this.getGradewiseWordLimit()
    }
    if (params.blog_id) {
      this.setState({ isEdit: true }, () => {
        this.getBlogDetails(params.blog_id)
      })
    }
    this.genresTypes()
    this.setState({
      minWidth: window.screen.width
    })
  }
  genresTypes=() => {
    axios.get(`${qBUrls.GenretType}`, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        this.setState({
          genres: res.data
        })
      })
      .catch(err => {
        this.logError(err)
      })
  }

  autoSaveUpdate=(bId) => {
    const { blogId, otherGenreValue, title, files, subjectId, textEditorContent, draftBlog, genreId, personalInfo } = this.state

    const formData = new FormData()
    formData.append('title', title)
    formData.append('subjectmapping_id', subjectId)
    formData.append('content', textEditorContent)
    formData.append('thumbnail', files[0])
    formData.append('is_drafted', draftBlog ? 'True' : 'False')
    formData.append('genre_id', genreId)
    formData.append('genre_type', otherGenreValue)
    formData.append('id', Number(blogId))
    const url = `${urls.CreateBlog}`
    const config = { headers: { 'Authorization': 'Bearer ' + personalInfo.token } }
    const autoSaveData = axios.put(url, formData, config)
    autoSaveData
      .then(res => {
        this.setState({
          isButtonDisabled: false,
          setMessage: true,
          fadeIn: true
        })
      })
      .catch(err => {
        console.log(err, 'error')
      })
  }
  getBlogDetails = (id) => {
    axios.get(`${urls.CreateBlog}?id=${id}`, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        const { data } = res.data
        // eslint-disable-next-line camelcase
        const { title, content, id, subjectmapping, thumbnail, genre, is_drafted } = data[0]
        this.setState({ title,
          textEditorContent: content,
          key: id,
          subjectId: subjectmapping,
          count: this.state.count + 1,
          image: thumbnail,
          genre: genre.genre,
          genreId: genre.id,
          otherGenreValue: genre.genre_subtype,
          draftBlog: is_drafted

        })
        if (genre.genre === 'Others') {
          this.setState({
            assignOtherGenre: true
          })
        }
      })
      .catch(err => {
        this.logError(err)
      })
  }

handleInput = (event) => {
  const { blogId, isEdit } = this.state
  const { name, value } = event.target

  this.setState({
    [name]: value,
    fadeIn: false
  })

  if (blogId && isEdit === false && this.isFormValid()) {
    this.delayedCallback()
  } else {
    this.autoSave()
  }
}

renderInputField = (value, name, label = '', placeholder = '') => {
  return (
    <Grid item xs={12} sm={6} md={6}>
      <label className='blog--form-label'>{label}</label>
      <input
        type='text'
        value={value}
        placeholder={placeholder}
        className='blog--form-input'
        name={name}
        onChange={this.handleInput}
        autoComplete='off'
        maxLength='155'
        style={{ 'font-size': '20px' }}

      />

    </Grid>
  )
}

handleTextEditor = (content) => {
  const { blogId, isEdit } = this.state
  console.log(content.replace(/&nbsp;/g, ''))

  // remove  begining and end white space
  content = content.replace(/&nbsp;/g, '')

  this.setState({ textEditorContent: content, fadeIn: false })

  if (blogId && isEdit === false && this.isFormValid()) {
    this.delayedCallback()
  } else {
    this.autoSave()
  }
}

isImage = (files) => {
  if (files[0].name.match(/.(jpg|jpeg|png)$/i)) {
    return true
  }
  return false
}

onDrop = (files) => {
  const { blogId, isEdit } = this.state
  if (!this.isImage(files)) {
    this.props.alert.warning('Please select only image file format')
    return
  } else if (files.length > 1) {
    this.props.alert.warning('You can select only a single image at once')
    return
  }
  this.setState({ files: files, image: URL.createObjectURL(files[0]) })
  if (blogId && isEdit === false && this.isFormValid()) {
    this.delayedCallback()
  } else {
    this.autoSave()
  }
}

getFileNameAndSize = (files) => {
  if (files.length) {
    const fileName = this.state.files && this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    return fileName
  }
  return null
}

isFormValid = () => {
  const { title, textEditorContent, genre, otherGenreValue, subjectId, genreId } = this.state

  if (!title) {
    this.props.alert.warning('Please enter a title')
    this.setState({ isButtonDisabled: false })
    return false
  }

  if (!subjectId) {
    this.props.alert.warning('Please select Subject')
    this.setState({ isButtonDisabled: false })
    return false
  }

  if (!genreId) {
    this.props.alert.warning('Please select Genre')
    this.setState({ isButtonDisabled: false })
    return false
  }
  if (!textEditorContent) {
    this.props.alert.warning('Please enter content for your blog!')
    this.setState({ isButtonDisabled: false })
    return false
  }

  if (genre === 'Others' && !otherGenreValue) {
    this.props.alert.warning('Please select others Genre ')
    this.setState({ isButtonDisabled: false })
    return false
  }

  return true
}

resetForm = () => {
  this.setState({
    title: '',
    files: [],
    subjectId: '',
    textEditorContent: '',
    key: this.state.key + 1,
    isButtonDisabled: false,
    image: '',
    genre: '',
    autoSaveForm: false,
    draftBlog: false,
    assignOtherGenre: false,
    fadeIn: false

  })
}

logError = (err, alertType = 'error') => {
  let { message, response: { data: { status: messageFromDev, err_msg: middleWareMsg } = {} } = {} } = err || {}
  let alertMsg
  if (messageFromDev) {
    alertMsg = messageFromDev
  } else if (middleWareMsg) {
    alertMsg = middleWareMsg
  } else if (message) {
    alertMsg = message
  } else {
    alertMsg = 'Failed to connect to server'
  }
  this.props.alert[alertType](`${alertMsg}`)
}

getGradewiseWordLimit=() => {
  // // eslint-disable-next-line no-debugger
  // debugger
  let wordCount = minimumWordLimitList.filter(cnt => cnt[this.gradeName]).map(v => v[this.gradeName])[0]
  console.log(wordCount, typeof (wordCount), 'word count')
  this.setState({ wordCount })
  return wordCount
}

isWordCountSubceeded = () => {
  // // eslint-disable-next-line no-debugger
  // debugger
  let { textEditorContent, wordCount } = this.state
  const parsedTextEditorContent = textEditorContent.replace(/(<([^>]+)>)/ig, '').split(' ')
  if (parsedTextEditorContent && parsedTextEditorContent.length < wordCount) {
    const errorMsg = `Please write atleast ${wordCount} words.Currently only ${parsedTextEditorContent.length} words have been written`
    return errorMsg
  }
  return false
}

    postData = async () => {
      const { title, creating, created, postCount, blogId, personalInfo, subjectId, otherGenreValue, textEditorContent, isEdit, files, draftBlog, genreId } = this.state

      const { match: { params } } = this.props
      const formData = new FormData()
      formData.append('title', title)
      formData.append('subjectmapping_id', subjectId)
      formData.append('content', textEditorContent)
      formData.append('thumbnail', files[0])
      formData.append('is_drafted', draftBlog ? 'True' : 'False')
      formData.append('genre_id', genreId)
      formData.append('genre_type', otherGenreValue)
      if (isEdit) {
        formData.append('id', params.blog_id)
      }
      const url = `${urls.CreateBlog}`
      const config = { headers: { 'Authorization': 'Bearer ' + personalInfo.token } }
      function MakeQuerablePromise (promiseVal) {
        if (promiseVal.isResolved) return promiseVal

        var isPending = true
        var isRejected = false
        var isFulfilled = false

        var result = promiseVal.then(
          function (v) {
            isFulfilled = true
            isPending = false
            return v
          },
          function (e) {
            isRejected = true
            isPending = false
            throw e
          }
        )
        result.isFulfilled = function () { return isFulfilled }
        result.isPending = function () { return isPending }
        result.isRejected = function () { return isRejected }
        return result
      }

      let updateData
      if (!isEdit && creating && !created) {
        updateData = axios.post(url, formData, config)
      } else if (isEdit) {
        updateData = axios.put(url, formData, config)
      }

      if (this.state.promiseStatus && this.state.promiseStatus.isPending()) {
      }
      if (updateData) {
        var promiseStatus

        promiseStatus = MakeQuerablePromise(updateData)
        this.setState({ promiseStatus })

        promiseStatus
          .then(res => {
            if (draftBlog && !isEdit) {
              this.props.alert.success('Your blog was successfully drafted')
              this.props.history.push('/blog/view/student')
            }

            if (isEdit) {
              this.props.alert.success('Your blog was successfully updated')

              this.props.history.push('/blog/view/student')
            }
            if (res.status === 200 && !blogId) {
              this.setState({
                blogId: JSON.stringify(res.data.id),
                isButtonDisabled: false,
                disableDraftButton: false
              })
              if (postCount === 1 && !isEdit) {
                this.props.alert.success('Your blog was successfully created')
                this.props.history.push('/blog/view/student')
              }
            }
          })
          .catch(err => {
            this.logError(err)
            this.setState({ isButtonDisabled: false })
          })
        return promiseStatus
      }
    }

  handleSubmit = () => {
    const subceededWordCount = this.isWordCountSubceeded()
    if (subceededWordCount) {
      this.props.alert.error(subceededWordCount)
      return
    }

    const { isEdit, blogId, created } = this.state
    if (!blogId) {
      this.setState({
        postCount: 1
      })
    }

    if (isEdit === false) {
      this.setState({ isButtonDisabled: true, draftBlog: false, autoSaveForm: false, fadeIn: false }, () => {
        if (this.isFormValid()) {
          this.delayedCallback()
        }
      })
    } else {
      this.setState({ isButtonDisabled: true }, () => {
        if (this.isFormValid()) {
          this.postData()
        }
      })
    }
    if (created) {
      setTimeout(() => {
        this.setState({
          isButtonDisabled: true
        })
        this.props.history.push('/blog/view/student')
      }, 30000)
    }
  }

  handleRemoveBlogFromDraft=() => {
    if (this.isFormValid()) {
      this.setState({ isButtonDisabled: true, draftBlog: false }, () => {
        this.postData()
      })
    }
  }

handleGSelect = (data) => {
  const { subject_mapping_id: subjectMappingId } = data
  const { blogId, isEdit } = this.state
  if (subjectMappingId) {
    this.setState({ subjectId: subjectMappingId, fadeIn: false })
  }
  if (blogId && isEdit === false && this.isFormValid()) {
    this.delayedCallback()
  } else {
    this.autoSave()
  }
}

handleClearThumbnail = () => {
  this.setState({ files: [], image: '' })
}
handleGenreChange=(e) => {
  const { blogId, isEdit } = this.state
  if (e.label === 'Others') {
    this.setState({
      assignOtherGenre: true
    })
  } else {
    this.setState({
      assignOtherGenre: false,
      otherGenreValue: ''
    })
  }
  this.setState({ genre: e.label, genreId: e.value, fadeIn: false }, () => {
    if (blogId && isEdit === false && this.isFormValid()) {
      this.delayedCallback()
    } else {
      this.autoSave()
    }
  })
}
drafteData=() => {
  const subceededWordCount = this.isWordCountSubceeded()
  if (subceededWordCount) {
    this.props.alert.error(subceededWordCount)
    return
  }
  const { blogId, isEdit, created } = this.state
  if (this.isFormValid()) {
    this.setState({ draftBlog: true, disableDraftButton: true }, () => {
      if (blogId && isEdit === false) {
        this.delayedCallback()
      }
      if (isEdit === true) {
        this.postData()
      }
    })
  }
  if (created) {
    setTimeout(() => {
      this.setState({
        disableDraftButton: true
      })
      this.props.history.push('/blog/view/student')
    }, 30000)
  }
}
handleClose = () => {
  this.setState({
    open: false
  })
};
previewData=() => {
  const { title, textEditorContent, files } = this.state
  if (!title && !textEditorContent && files.length === 0) {
    this.props.alert.warning('Nothing is there to preview')
  } else {
    this.setState({
      open: true
    })
  }
}
autoSave=() => {
  const { textEditorContent, isEdit } = this.state
  if (textEditorContent && isEdit === false) {
    if (this.isFormValid()) {
      this.setState({
        autoSaveForm: true
      }, () => this.delayedCallback())
    }
  }
}
getOtherVal=(e) => {
  const { blogId, isEdit } = this.state
  this.setState({
    otherGenreValue: e.target.value
  })
  if (blogId && isEdit === false && this.isFormValid()) {
    this.delayedCallback()
  } else {
    this.autoSave()
  }
}

render () {
  const { files, date, fadeIn, setMessage, disableDraftButton, minWidth, genreId, draftBlog, personalInfo, genre, otherGenreValue, isEdit, assignOtherGenre, title, textEditorContent, key, isButtonDisabled, subjectId, image, wordCount } = this.state
  var datetime = 'Last Saved: ' + date.getDate() + ' ' + (monthNames[date.getMonth()]) + ' ' + date.getFullYear() + ' @ ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

  return (

    <div>
      {
        isButtonDisabled || disableDraftButton ? <InternalPageStatus label={isButtonDisabled ? 'Blog is submitting, please wait...' : 'Saving as draft, please wait...'} />
          : <div className='write__blog--container'>
            <Typography align='center' variant='h4'>{ isEdit ? 'Edit a Blog' : 'Write a Blog'}</Typography>
            <Grid container className='write__blog--grid-container'>
              {this.renderInputField(title, 'title', 'Blog Title')}

              <Grid item xs={12} sm={6} md={6} className='blog__padding--top'>

                <span
                  style={minWidth > 1024 ? {
                    width: assignOtherGenre ? '84%' : '50%',
                    display: 'flex',
                    margin: '0 auto'
                  } : {
                    margin: '0 auto'
                  }

                  }
                >
                  <GSelect
                    className='geselect__dropdown--height'
                    key={key}
                    config={COMBINATIONS}
                    onChange={this.handleGSelect}
                    initialValue={{ subject_mapping_id: subjectId }}

                  />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <OmsSelect
                    label='Genre'
                    placeholder='Select..'
                    options={this.state.genres.map((data) => {
                      return { label: data.genre, value: data.id }
                    })}
                    change={this.handleGenreChange}
                    defaultValue={{ label: genre, value: genreId }}
                  />

                  <input
                    type='text'
                    placeholder='Enter genre'
                    onChange={this.getOtherVal}
                    value={otherGenreValue}
                    style={minWidth > 1024
                      ? { display: assignOtherGenre ? '' : 'none', border: 'none', width: '140px', 'border-style': 'ridge', 'border-radius': '1rem', outline: 'none' }
                      : {
                        display: assignOtherGenre ? '' : 'none',
                        border: 'none',
                        width: '140px',
                        'border-style': 'ridge',
                        'border-radius': '1rem',
                        outline: 'none',
                        height: '53px',
                        'margin-top': '11px'
                      }

                    } />

                </span>

              </Grid>

            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>

                <label className='blog--form-label'>Upload a thumbnail (optional)</label>
                <Dropzone onDrop={this.onDrop} >
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept
                  }) => (
                    <Card
                      elevation={0}
                      style={{
                        border: '1px solid black',
                        borderStyle: 'dotted',
                        padding: 20
                      }}
                      {...getRootProps()}
                      className='dropzone'

                    >
                      <CardContent>
                        <input {...getInputProps()} accept='.png, .jpg, .jpeg' />
                        <div>
                          {isDragAccept && 'Only image files will be accepted'}
                          {!isDragActive && 'Drag and drop or Click here to upload'}
                        </div>
                        {this.getFileNameAndSize(files)}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid>
              {
                image
                  ? <Grid item xs={12} sm={6} md={6} style={{ position: 'relative' }}>
                    <HighlightOff
                      className='thumbnail__close--icon'
                      onClick={this.handleClearThumbnail}
                    />
                    <label className='blog--form-label' />
                    <img className='thumbnail__image' src={image} />
                  </Grid>
                  : ''
              }
            </Grid>
            <Grid container className='write__blog--grid-container'>
              {this.gradeName ? <p style={{ color: 'red', fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
              > Write the blog with atleast {wordCount || '20'} words </p> : ''}
              <TinyMce
                key={key}
                id={key}
                get={this.handleTextEditor}
                content={textEditorContent}

              />
            </Grid>
            {
              setMessage
                ? <div style={{

                  position: 'absolute',
                  height: '30px',
                  'text-align': 'center',
                  background: '#5d1049',
                  'margin-left': '65%',
                  color: 'white',
                  'font-weight': 'bold',
                  'box-shadow': '2px 2px 2px 2px',
                  'border-radius': '10px',
                  width: '20%',
                  padding: '4px',
                  opacity: fadeIn ? 3.7 : 0
                }}>{datetime}</div> : ''
            }
            {
              isEdit && draftBlog
                ? <Button
                  disabled={isButtonDisabled}
                  style={{ marginTop: 20 }}
                  variant='contained'
                  color='primary'
                  onClick={this.handleRemoveBlogFromDraft}
                >
                  {isButtonDisabled ? 'Submitting please wait...' : isEdit && draftBlog ? 'Post' : '' }
                </Button> : <Button
                  disabled={isButtonDisabled}
                  style={{ marginTop: 20 }}
                  variant='contained'
                  color='primary'
                  onClick={this.handleSubmit}
                >
                  {isButtonDisabled ? 'Submitting please wait...' : isEdit ? 'Update' : 'Submit' }
                </Button>
            }

      &nbsp;&nbsp;&nbsp;
            {
              isEdit === false ? <Button

                style={{ marginTop: 20 }}
                variant='contained'
                color='primary'
                onClick={this.drafteData}
                disabled={disableDraftButton}
                startIcon={<Drafts />}
              >
                {disableDraftButton ? 'Saving please wait...' : 'Save as draft'}
              </Button> : isEdit && draftBlog ? <Button

                style={{ marginTop: 20 }}
                variant='contained'
                color='primary'
                onClick={this.drafteData}
                startIcon={<Drafts />}
              >
            Save as draft
              </Button> : ''
            }
      &nbsp;&nbsp;&nbsp;

            <Button style={{ marginTop: 20 }} variant='contained' color='primary' onClick={this.previewData} startIcon={<Visibility />}>

      Preview
            </Button>

            <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
              <AppBar >
                <Toolbar style={{ 'min-height': '20px' }}>
                  <IconButton edge='start' color='inherit' onClick={this.handleClose} aria-label='close'>
              Dismiss
                  </IconButton>

                </Toolbar>

              </AppBar>
              {
                image
                  ? <Grid container >

                    <img className='preview-image' alt='no data' src={image} />
                  </Grid>
                  : ''
              }
              <Typography style={{
                'text-align': 'center',
                'font-size': '2rem',
                'font-family': 'cursive',
                color: 'darkblack',
                'margin-top': '40px',
                'text-transform': 'capitalize'

              }}>{ReactHtmlParser(title)}</Typography>
              <Typography style={{ 'margin-left': '4%', 'margin-top': '2%', 'font-size': '1rem', color: '#5d1049' }}>Author : {personalInfo.first_name}</Typography>
              <Typography style={{ 'margin-left': '4%', 'margin-right': '3%', 'margin-top': '2%' }}>{ ReactHtmlParser(textEditorContent)}</Typography>

            </Dialog>
          </div>
      }
    </div>

  )
}
}

const mapStateToProps = state => {
  return {
    subjects: state.subjects.items
  }
}

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WriteBlog))
