import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { Button, Chip, withStyles, Paper, Typography, AppBar, Toolbar } from '@material-ui/core/'
import Pagination from 'react-js-pagination'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { apiActions } from '../../_actions'
import { urls, vimeoUrl } from '../../urls'
import { OmsSelect } from '../../ui'
import './pagination.css'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  }
})

class publicView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activePage: 1,
      chapterId: ''
    }
    this.handleSubjectChange = this.handleSubjectChange.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  componentDidMount () {
    let url = ''
    this.filter(url)
  }

  handleSubjectChange (event) {
    let aSubjectId = []
    aSubjectId.push(event.value)
    if (this.role === 'Student') {
      this.setState({
        valueSubject: event,
        subjectId: aSubjectId,
        valueChapter: [],
        chapterId: ''
      }, () => this.handleGradeChange(this.state.gradeValue))
    } else {
      this.setState({
        valueSubject: event,
        subjectId: aSubjectId,
        valueChapter: [],
        valueGrade: [],
        gradeId: [],
        chapterId: ''
      })
      axios
        .get(urls.Chapter + `?s_id=${event.value}`)
        .then(res => {
          let aGrade = []
          if (typeof res.data !== 'string') {
            aGrade = res.data.map(grade => ({
              value: grade.id, label: grade.grade
            }))
            this.setState({ gradeData: aGrade })
          }
        })
    }
  }

  handleGradeChange (event) {
    let { subjectId } = this.state
    let gradeId = []
    event.forEach(grade => {
      gradeId.push(grade.value)
    })
    this.setState({
      gradeId: gradeId,
      valueGrade: event,
      valueChapter: [],
      chapterId: ''
    })
    axios
      .get(urls.Chapter + `?s_id=${subjectId}` + `&g_id=${gradeId}`)
      .then(res => {
        let aChapter = []
        if (typeof res.data !== 'string') {
          aChapter = res.data.map(chapter => ({
            value: chapter.id, label: chapter.chapter_name
          }))
          this.setState({ chapterData: aChapter })
        }
      })
  }

  handleFilter () {
    let { subjectId, gradeId, chapterId, activePage } = this.state
    let url = ''
    url = '?subject_id=' + JSON.stringify(subjectId) + '&grade_id=' +
      JSON.stringify(gradeId) + '&chapter_id=' + chapterId + '&page_number=' + activePage
    this.filter(url)
  }

  filter (url) {
    axios
      .get(urls.LMS + url)
      .then(res => {
        let url = []
        res.data.data.map(data => {
          let videos = JSON.parse(data.video)
          videos.map(video => {
            url.push({
              uri: vimeoUrl.get + video,
              chapter: data.chapter.chapter_name,
              grade: data.chapter.grade.grade,
              subject: data.chapter.subject.subject_name
            })
          })
        })
        this.setState({ url, videoData: res.data })
      }).catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber },
      () => this.handleFilter())
  }

  render () {
    let { gradeData, chapterData, valueGrade, valueChapter, valueSubject, url, videoData, activePage } = this.state
    const { classes } = this.props
    return localStorage.getItem('id_token')
      ? <Redirect to={{ pathname: '/dashboard' }} />
      : <React.Fragment>
        <AppBar
          position='fixed'
          className={classNames(classes.appBar)}
        >
          <Toolbar disableGutters>
            <Typography variant='h5' color='inherit' noWrap style={{ marginLeft: 40 }}>
              Eduvate<sup style={{ fontSize: 12 }}> beta</sup>
            </Typography>
          </Toolbar>
        </AppBar>
        <div
          style={{
            marginTop: 64,
            height: 100,
            padding: 10,
            backgroundColor: '#821057',
            color: '#ffffff'
          }}
        >
          <Typography
            variant='h4'
            style={{ color: '#fff', marginLeft: 24, marginTop: 24 }}
          >
            Learning Management System
          </Typography>
        </div>
        <Paper style={{ marginTop: 70, marginLeft: 40, marginRight: 40, minHeight: '85vh', display: 'flex', flexDirection: 'column' }} >
          <Grid style={{ margin: 10 }}>
            <Grid.Row>
              <Grid.Column width={4}>
                <OmsSelect
                  label='Subject'
                  placeholder='Select Subject'
                  options={this.props.subject
                    ? this.props.subject
                      .map(subject => ({ value: subject.id, label: subject.subject_name }))
                    : []}
                  change={this.handleSubjectChange}
                  defaultValue={valueSubject}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <OmsSelect
                  label='Grade'
                  placeholder='Select Grade'
                  options={gradeData}
                  change={this.handleGradeChange}
                  isMulti
                  defaultValue={valueGrade}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <OmsSelect
                  label='Chapter'
                  placeholder='Select Chapter'
                  options={chapterData}
                  change={e => this.setState({ chapterId: e.value, valueChapter: e })}
                  defaultValue={valueChapter}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Button onClick={this.handleFilter}> Filter </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid centered columns={2}>
            {url
              ? url.map((url, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid.Row>
                      <Grid.Column width={3}>
                        <Grid.Row>
                          <Chip label={url.grade} className={classes.chip} />
                        </Grid.Row>
                        <Grid.Row>
                          <Chip label={url.subject} className={classes.chip} />
                        </Grid.Row>
                        <Grid.Row>
                          <Chip label={url.chapter} className={classes.chip} />
                        </Grid.Row>
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <iframe
                          src={url.uri}
                          width='480'
                          height='360'
                          frameBorder='0'
                          allowFullScreen
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </React.Fragment>
                )
              })
              : ''
            }
            {videoData && videoData.data.length > 0
              ? <React.Fragment>
                <Grid.Row>
                  <Grid.Column width={5}>
                    <Pagination
                      activePage={activePage}
                      totalItemsCount={videoData.total_video_item_count}
                      itemsCountPerPage={10}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    />
                  </Grid.Column>
                  <Grid.Column width={10}>
                  </Grid.Column>
                </Grid.Row>
              </React.Fragment>
              : ''
            }
          </Grid>
        </Paper>
      </React.Fragment>
  }
}

const mapStateToProps = state => ({
  subject: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(publicView))
