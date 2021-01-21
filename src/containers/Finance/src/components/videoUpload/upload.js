import React from 'react'
import axios from 'axios'
import { Grid } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { Card, CardContent, Input, LinearProgress, Button, Tab, Tabs, AppBar, Paper } from '@material-ui/core/'
// import CreatableSelect from 'react-select/lib/Creatable'
import { Clear } from '@material-ui/icons'

import { urls, vimeoUrl } from '../../urls'
import { apiActions } from '../../_actions'
import { OmsSelect } from '../../ui'
import { COMBINATIONS } from './config/combination'
import GSelect from '../../_components/globalselector'
import { COMBINATION } from './config/gradeCombination'
import VideoTimelineEditor from './videoTimelineEditor'
import './pagination.css'

let count = 0
let uploadCount = 0

class VideoUpload extends React.Component {
  constructor () {
    super()
    this.state = {
      link: [],
      videoId: [],
      disableDrop: false,
      name: '',
      description: '',
      currentTab: 0,
      isLecture: false,
      questionPapers: [],
      questionPaperId: '',
      questionTypeId: 0,
      types: [],
      videoType: '',
      gselectKey: new Date().getTime(),
      typeKey1: new Date().getTime()
      // typeKey2: new Date().getTime(),
      // typeKey3: new Date().getTime(),
      // typeKey4: new Date().getTime()

    }
    this.onDrop = this.onDrop.bind(this)
    this.spaceCreation = this.spaceCreation.bind(this)
    this.assignDomain = this.assignDomain.bind(this)
    this.upload = this.upload.bind(this)
    this.checkUpload = this.checkUpload.bind(this)
    this.sendData = this.sendData.bind(this)
    this.resetData = this.resetData.bind(this)
    this.handleAudienceChange = this.handleAudienceChange.bind(this)
    this.handleUploadVideo = this.handleUploadVideo.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  handleAudienceChange (event) {
    let aAudience = []
    event.map(audience => aAudience.push(audience.value))
    this.setState({ audience: aAudience, valueAudience: event })
  }

  spaceCreation (file, index, length) {
    let data = {
      upload: {
        'approach': 'tus',
        'size': file.size
      },
      name: this.state.name ? this.state.name : file.name,
      description: this.state.description ? this.state.description : '',
      privacy: {
        view: 'anybody',
        download: false,
        embed: 'whitelist'
      },
      embed: {
        buttons: {
          embed: false,
          like: false,
          share: false,
          watchlater: false
        },
        logos: {
          vimeo: false
        },
        title: {
          name: 'hide',
          owner: 'hide',
          portrait: 'hide'
        }
      }
    }
    axios
      .post(vimeoUrl.spaceCreation, data, {
        headers: {
          'Authorization': 'Bearer ' + vimeoUrl.uploadAuthToken
        },
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      })
      .then(res => {
        if (res.status === 200) {
          let link = res.data.upload.upload_link
          let videoId = parseInt(res.data.uri.split('/')[2])
          this.assignDomain(videoId)
          this.upload(link, file, 0, index, length)
          this.setState({
            link: [...this.state.link, link],
            videoId: [...this.state.videoId, videoId]
          })
          count++
          if (count === length) {
            this.sendData()
          }
        } else {
          this.props.alert.error('Upload Failed')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  getVideoTypes=() => {
    axios.get(urls.LmsVideoTypes, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      this.setState({ types: res.data.data })
    })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  }
  assignDomain (videoId) {
    let { domains, video: videoUrl } = vimeoUrl
    let urlEmbed = videoUrl + videoId + '/privacy/domains/'
    this.setState({ uploaded: true })
    let promises = []
    for (let key in domains) {
      promises.push(axios
        .put(urlEmbed + domains[key], {}, {
          headers: {
            'Authorization': 'Bearer ' + vimeoUrl.uploadAuthToken
          }
        }))
    }
    Promise.all(promises).then(res => {
      if (res.status === 204) {
        console.log('domain assigned')
      }
    })
      .catch(error => {
        console.log(error)
      })
  }

  upload (link, file, offset, index, length) {
    const { videoType } = this.state
    axios
      .patch(link, file, {
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': offset,
          'Content-Type': 'application/offset+octet-stream',
          'Accept': 'application/vnd.vimeo.*+json;version=3.4'
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = this.state.percentCompleted
          if (!percentCompleted) {
            percentCompleted = []
          }
          percentCompleted[index] = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          if (percentCompleted[index] === 100) {
            percentCompleted[index] = 0
            this.setState({ percentCompleted })
          }
        }
      })
      .then(res => {
        uploadCount++
        if (res.status === 409 || file.size.toString() !== res.headers['upload-offset']) {
          this.checkUpload(link, file, index)
        } else {
          if (uploadCount === length) {
            this.resetData()
          }
          if (videoType === 1) {
            this.props.alert.success('Video has been uploaded.')
          } else {
            this.props.alert.success('Video ' + (index + 1) + ' Uploaded')
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  checkUpload (link, file, index) {
    axios
      .head(link, {
        headers: {
          'Tus-Resumable': '1.0.0',
          'Accept': 'application/vnd.vimeo.*+json;version=3.4'
        }
      })
      .then(res => {
        if (res.status === 200) {
          if (res.headers['upload-offset'] !== res.headers['upload-length']) {
            this.upload(link, file, res.headers['upload-offset'], index)
          } else {
            this.props.alert.success('Video ' + (index + 1) + ' Uploaded')
          }
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  onDrop (files) {
    const { isLecture } = this.state
    if (isLecture && files.length > 1) {
      this.props.alert.warning('You can select only a single video at once')
    } else {
      this.state.files
        ? this.setState({
          files: [...this.state.files, ...files]
        })
        : this.setState({ files: files })
      this.setState({ disableDrop: true })
    }
  }

  handleUploadVideo () {
    let error = this.validate()
    if (error) {
      let { files } = this.state
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          this.spaceCreation(files[i], i, files.length)
        }
      } else {
        this.props.alert.error('Attach a file')
      }
    }
  }

  sendData () {
    let { gradeId, chapterId, isLecture, audience, videoId, currentTab, videoType, questionPaperDetails, questionPaperId } = this.state
    let role, data
    if (currentTab === 0) {
      role = audience ? JSON.stringify(audience) : ''

      data = {
        video_title: this.state.name ? this.state.name : '',
        video_description: this.state.description ? this.state.description : '',
        grade: JSON.stringify(gradeId),
        chapter: chapterId,
        role: role,
        video: JSON.stringify(videoId),
        video_type: videoType
      }
      if (isLecture) {
        let paperId = { question_paper_id: questionPaperId
        }
        let questionDetails = { question_details: questionPaperDetails
        }
        data = Object.assign(data, paperId, questionDetails)
      }
    } else {
      role = audience ? JSON.stringify(audience) : ''
      data = {
        video_title: this.state.name ? this.state.name : '',
        video_description: this.state.description ? this.state.description : '',
        role: role,
        grade: JSON.stringify(gradeId),
        is_video_of_day: 'True',
        // role: JSON.stringify(role),
        video: JSON.stringify(videoId)
      }
    }
    axios
      .post(urls.LmsVideo, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  resetData () {
    count = 0
    uploadCount = 0
    this.setState({
      files: null,
      videoId: [],
      link: [],
      subjectId: null,
      valueSubject: [],
      gradeId: null,
      valueGrade: [],
      chapterId: null,
      valueChapter: [],
      audience: null,
      valueAudience: [],
      privacy: null,
      name: '',
      description: '',
      disableDrop: false,
      isLecture: false,
      questionPaperId: '',
      questionTypeId: 0,
      videoType: '',
      gselectKey: new Date().getTime(),
      questionPapers: [],
      typeKey1: new Date().getTime()
      // typeKey2: new Date().getTime(),
      // typeKey3: new Date().getTime(),
      // typeKey4: new Date().getTime()
    })
  }

  componentDidMount () {
    this.getVideoTypes()
  }
  getQuestionPapers=() => {
    const { subjectId, gradeId } = this.state
    let type = 'lecture video id'
    let path = urls.LmsQuestionPapers + `?subject_id=${subjectId}&grade_id=${gradeId}&question_paper_type_id=${type}`

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      res.data.map(type => {
        if (type.question_paper_type === 'Recorded Lectures') {
          this.getQuestionPaperList(type.id)
        }
      })
    })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  }
  getQuestionPaperList=(questionTypeId) => {
    const { subjectId, gradeId } = this.state
    let path = urls.QuestionPaperFilter + `?subject_id=${subjectId}&grade_id=${gradeId}&question_paper_type_id=${questionTypeId}`

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      this.setState({
        questionPapers: res.data
      })
    })
      .catch(error => {
        console.log(error)
      })
  }
  validate () {
    let { subjectId, gradeId, chapterId, privacy, audience, currentTab, videoType, questionPaperId, questionPaperDetails } = this.state
    if (currentTab === 0) {
      if (!subjectId) {
        this.props.alert.error('Select Subject')
        return false
      } else if (!gradeId) {
        this.props.alert.error('Select Grade')
        return false
      } else if (!chapterId) {
        this.props.alert.error('Select Chapter')
        return false
      } else if (!privacy) {
        this.props.alert.error('Select Privacy')
        return false
      } else if (privacy.value === 'Letseduvate' && !audience) {
        this.props.alert.error('Select Audienece')
        return false
      } else if (videoType === 'Recorded Lectures' && !questionPaperId) {
        this.props.alert.error('Select Question Paper')
        return false
      } else if (videoType === 'Recorded Lectures' && !questionPaperDetails) {
        this.props.alert.error('No Questions Selected')
        return false
      } else {
        return true
      }
    } else {
      if (!gradeId) {
        this.props.alert.error('Select Grade')
        return false
      } else {
        return true
      }
    }
  }

  getGrades = () => {
    axios.get(urls.GRADE, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      let grades = res.data.map(grade => {
        return { label: grade.grade, value: grade.id }
      })
      this.setState({ gradeData: grades })
    })
      .catch(error => {
        console.log(error)
      })
  }

  handleTabChange = (e, tab) => {
    console.log(tab)
    if (tab === 1) {
      this.setState({ currentTab: tab, gradeData: [], valueGrade: [], gradeId: [] }, () => { this.getGrades() })
    } else {
      this.setState({ currentTab: tab, gradeData: [], valueGrade: [], gradeId: [], subjectId: '', valueSubject: [] })
    }
  }

  onChange = (data) => {
    console.log(data)
    const { grade_id: gradeId, subject_id: subjectId, id } = data
    if (this.role !== 'Subjecthead') {
      if (id) {
        this.setState({ gradeId: [gradeId], chapterId: id, subjectId: [subjectId] })
      } else if (gradeId && subjectId) {
        this.setState({ gradeId: [gradeId], chapterId: '', subjectId: [subjectId] })
      } else {
        this.setState({ gradeId: [gradeId], chapterId: '', subjectId: [] })
      }
    } else {
      if (id) {
        this.setState({ gradeId: [gradeId], chapterId: id, subjectId: [subjectId] })
      } else if (gradeId && subjectId) {
        this.setState({ gradeId: [gradeId], chapterId: '', subjectId: [subjectId] })
      } else {
        this.setState({ subjectId: [subjectId], chapterId: '', gradeId: [] })
      }
    }
  }

  onGradeChange = (data) => {
    if (data.grade_id) {
      this.setState({ gradeId: [data.grade_id] })
    }
  }
  getDurationAndPaperId=(data) => {
    this.setState({
      questionPaperDetails: data
    })
  }
  handleQuestionPapers=(event) => {
    this.setState({
      questionPaperId: event.value
    })
  }
  handleTypes=(e) => {
    if (e.label === 'Recorded Lectures') {
      this.setState({
        isLecture: true,
        videoType: e.value
      }, () => this.getQuestionPapers())
    } else {
      this.setState({
        videoType: e.value,
        isLecture: false
      })
    }
  }

  render () {
    const file = this.state.files &&
      this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    let { gselectKey, typeKey1, percentCompleted, types, valueAudience, privacy, files, name, description, disableDrop, currentTab, isLecture } = this.state
    return (
      <React.Fragment>
        {(this.role === 'Admin' || this.role === 'Planner' || this.role === 'Subjecthead' || this.role === 'EA Academics') && <AppBar style={{ backgroundColor: '#f0f0f0', padding: '0px !important', margin: 0 }} position='static'>
          <Paper square>
            <Tabs
              indicatorColor='primary'
              textColor='primary'
              onChange={this.handleTabChange}
              value={this.state.currentTab}
              variant='fullWidth'
              style={{ marginRight: 20 }}
            >
              <Tab label='All Videos' />
              <Tab label='Video of the day' />
            </Tabs>
          </Paper>
        </AppBar>}
        <Grid style={{ margin: 10 }}>
          <Grid.Row>
            {
              currentTab === 0
                ? <GSelect key={gselectKey} keyvariant={'selector'} onChange={this.onChange} config={COMBINATIONS} /> : ''
            }
            {currentTab === 1
              ? <GSelect variant={'selector'} onChange={this.onGradeChange} config={COMBINATION} />
              : ''
            }
            {currentTab === 0 || currentTab === 1
              ? <Grid.Column computer={5} mobile={16} tablet={10}>
                <OmsSelect
                  key={typeKey1 + '_privacy'}
                  label='Privacy'
                  placeholder='Select Privacy'
                  options={[
                    { value: 'Public', label: 'Public' },
                    { value: 'Letseduvate', label: 'Letseduvate' }
                  ]}
                  change={e => this.setState({ privacy: e })}
                  defaultValue={privacy}
                />
              </Grid.Column> : '' }
            {((currentTab === 0 || currentTab === 1) && privacy) && privacy.value === 'Letseduvate'
              ? <Grid.Column computer={5} mobile={16} tablet={10}>
                <OmsSelect
                  key={typeKey1 + '_audience'}
                  label='Audience'
                  placeholder='Select Audience'
                  options={this.props.roles
                    ? this.props.roles.filter(role =>
                      role.role_name === 'Student' || role.role_name === 'Teacher' || role.role_name === 'GuestStudent'
                    ).map(role => ({
                      value: role.id, label: role.role_name
                    }))
                    : []
                  }
                  change={this.handleAudienceChange}
                  isMulti
                  defaultValue={valueAudience}
                />
              </Grid.Column>
              : ''}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={16} tablet={10}>
              <Input
                fullWidth
                type='text'
                value={name}
                placeholder='Title for the video'
                onChange={e => this.setState({ name: e.target.value })}
              />
            </Grid.Column>
            <Grid.Column computer={5} mobile={16} tablet={10}>
              <Input
                fullWidth
                type='text'
                value={description}
                placeholder='Description for the video'
                onChange={e => this.setState({ description: e.target.value })}
              />
            </Grid.Column>
          </Grid.Row>
          {
            currentTab === 0
              ? <Grid.Row>
                <Grid.Column>

                  <OmsSelect
                    label='Select Type'
                    key={typeKey1 + '_type'}
                    placeholder='Select Type'
                    options={
                      types &&
                      types.map(val => ({
                        value: val.id,
                        label: val.video_type
                      }))
                    }
                    change={this.handleTypes}

                  />

                  {
                    isLecture ? <OmsSelect
                      label='Select Question Paper'

                      key={typeKey1 + '_paper'}
                      placeholder='Select Question Paper'
                      options={
                        this.state.questionPapers &&
                      this.state.questionPapers.map(ques => ({
                        value: ques.id,
                        label: ques.question_paper_name
                      }))
                      }
                      change={this.handleQuestionPapers}

                    /> : ''
                  }

                </Grid.Column>
              </Grid.Row>
              : ''}
          <Grid.Row>
            <Grid.Column computer={5} mobile={16} tablet={10} style={{ display: window.isMobile ? '' : 'flex' }}>

              <Dropzone disabled={disableDrop} onDrop={this.onDrop}>
                {({
                  getRootProps,
                  getInputProps,
                  isDragActive,
                  isDragAccept,
                  isDragReject
                }) => (
                  <Card
                    elevation={0}
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                      border: '1px solid black',
                      borderStyle: 'dotted'
                    }}
                    {...getRootProps()}
                    className='dropzone'
                  >
                    <CardContent>
                      <input {...getInputProps()} />
                      <div>
                        {isDragAccept && 'All files will be accepted'}
                        {isDragReject && 'Some files will be rejected'}
                        {!isDragActive && 'Drop your files here.'}
                      </div>
                      {file}
                      {
                        file && file.length
                          ? <Clear
                            className='clear__files'
                            onClick={(event) => {
                              event.stopPropagation()
                              this.setState({
                                files: [],
                                disableDrop: false
                              })
                            }}
                          /> : ''
                      }
                    </CardContent>
                  </Card>
                )}
              </Dropzone>

            </Grid.Column>
          </Grid.Row>
          {files && percentCompleted && files.map((file, index) => (
            <Grid.Row>
              <Grid.Column computer={5} mobile={16} tablet={10}>
                {percentCompleted[index] > 0 &&
                  <React.Fragment>
                    Video - {index + 1}
                    <LinearProgress variant={'determinate'} value={percentCompleted[index]} />
                    {percentCompleted[index]}% Uploaded
                  </React.Fragment>
                }
              </Grid.Column>
            </Grid.Row>
          ))}
          <Grid.Row>
            <Grid.Column computer={5} mobile={16} tablet={10}>
              {this.state.files && this.state.files[0] && this.state.questionPaperId && <VideoTimelineEditor file={this.state.files[0]} questionPaperId={this.state.questionPaperId} onChange={this.getDurationAndPaperId} alert={this.props.alert} />}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={16} tablet={10}>
              <Button onClick={this.handleUploadVideo}> Upload </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subject: state.subjects.items,
  roles: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects()),
  listRoles: dispatch(apiActions.listRoles())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoUpload)
