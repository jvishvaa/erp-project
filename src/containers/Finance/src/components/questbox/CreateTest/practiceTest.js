import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
// import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import AssessStatTable from './assessSatisticsTable'
import { urls, qBUrls } from '../../../urls'
// import TestModule from './testModuleQuestionWise'

class PracticeTest extends Component {
  constructor () {
    super()

    this.state = {
      expandedStats: null,
      chapters: [] }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.renderSubjectsCard = this.renderSubjectsCard.bind(this)
    this.renderChapters = this.renderChapters.bind(this)
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let acadGrade = this.userProfile
    if (this.role === 'Student') {
      this.setState({
        branchGradeId: acadGrade.acade_branch_grade_id,
        gradeId: acadGrade.grade_id
      }, () => { this.getSubjects() })
    }
  }
  getChapters=(subjectId) => {
    let { state: { gradeId } } = this
    this.setState({ subjectId, isChapLoading: true })

    var path = urls.Chapter + '?'
    path += gradeId ? 'grade_id=' + gradeId + '&' : ''
    path += subjectId ? 'subject_id=' + subjectId + '&' : ''

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        let data = res.data
        if (Array.isArray(data)) {
          this.setState({ chapters: data, isChapLoading: false
          })
        } else {
          this.setState({ chapters: [] })
        }
        console.log(res.data, 'chapters')
      }
    })
      .catch(e => {
        this.setState({ isChapLoading: false })
      })
  }

  getSubjects = (state) => {
    let { state: { branchGradeId } } = this
    var path = urls.SubjectMapping + '?'
    path += branchGradeId ? 'acad_branch_grade_mapping_id=' + branchGradeId + '&' : ''

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ subjectData: res.data
        })
        console.log(this.state.subjectData, 'dataa')
      }
    })
      .catch(e => console.log(e))
  }
  renderChapters (cardSubId) {
    let { chapters = [], isChapLoading, subjectId } = this.state
    if (Number(subjectId) === Number(cardSubId)) {
      if (!chapters.length) { return <p>No Chapters Available</p> }
      if (isChapLoading) { return <p>Loading Chapters</p> }

      return <Card><List style={{ maxHeight: 400, overflow: 'auto' }}>{chapters.map(chapter => (

        <ListItem button onClick={() => this.setState({ chapterId: chapter.id }, this.getQuestionsList)}>
          {chapter.chapter_name}
        </ListItem>
      ))}</List></Card>
    } else {
      return null
    }
  }
  renderSubjectsCard () {
    let { subjectData = [] } = this.state
    return (<Card><List style={{ maxHeight: 400, overflow: 'auto' }}>
      {subjectData.map(subject => (
        <ListItem button onClick={() => this.getChapters(subject.subject.id)}>
          {subject.subject.subject_name}
        </ListItem>))}
    </List></Card>
    )
  }
  getQuestionsList = () => {
    let { subjectId, gradeId, chapterId, currentPage } = this.state
    let page = currentPage || 0
    page += 1
    let newurl =
    qBUrls.ListQuestion +
    `pagenumber=${page}&subject=${String(subjectId)}&grade=${String(
      gradeId
    )}&chapter=${String(chapterId)}&type=&category=&level=&question_status=Published&ques_type=MCQ`
    this.setState({ loading: true }, () => {
      axios
        .get(newurl, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
        //   if (Array.isArray(res.data)) {
          let totalPageCount = res.data['total_page_count']
          this.setState({ ...res.data, totalPageCount, questionsList: res.data.data, loading: false })
        //   }
        })
        .catch(error => {
          console.log('error', error)
          this.setState({ loading: false })
        })
    })
  }
  handlePagination = () => {
    let { currentPage, total_page_count: totalPageCount } = this.state
    if (currentPage <= totalPageCount) {
      this.setState({ currentPage: currentPage + 1 }, this.getQuestionsList)
    }
  }
  render () {
    let { subjectId } = this.state
    return (
      <React.Fragment>
        <Grid container>
          <Grid item>
            {this.renderSubjectsCard()}
          </Grid>
          <Grid>
            {subjectId && this.renderChapters(subjectId)}
          </Grid>
        </Grid>
        {/* {this.state.questionsList &&
        <TestModule
          onFinish={this.handlePagination}
          questions={this.state.questionsList || []}
          alert={this.props.alert}
        />} */}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({

  user: state.authentication.user

})
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles()(PracticeTest)))
