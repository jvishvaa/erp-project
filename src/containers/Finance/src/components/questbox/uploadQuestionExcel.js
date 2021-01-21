import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CardContent from '@material-ui/core/CardContent'
import Checkbox from '@material-ui/core/Checkbox'
import axios from 'axios'
import { Button } from '@material-ui/core/'
import {
  Grid,
  Divider, Table
} from 'semantic-ui-react'
import '../css/staff.css'

import AuthService from '../AuthService'
import { urls, staticUrls } from '../../urls'
import { apiActions } from '../../_actions'
import { OmsSelect } from '../../ui'

class UploadQuestionExcel extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      files: [],
      subjectArr: [],
      gradeArr: [],
      chapterArr: [],
      questionTypeArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      checked: false
    }
    this.onDrop = this.onDrop.bind(this)
    // this.excel = this.excel.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount = () => {
    this.props.listGrades()
  }
  onDrop (files) {
    this.state.files
      ? this.setState({
        files: files
      })
      : this.setState({ files: files })
  }

  changehandlergrade = event => {
    this.props.listSubjects(event.value)
    let { mappedSubjectsArr = [] } = this.state
    if (this.role === 'Subjecthead') {
      // let subjectsArr = mappedSubjectsArr.filter(item => { if (item.grade_id === event.value) { return item } })
      let subjectsArr = mappedSubjectsArr.filter(item => { if (item.grade_id === event.value) { return item } })
      this.setState({ subjectsArr })
    }
    this.setState({ gradeId: event.value })
  }

  handleSubject = e => {
    this.props.loadGradeChapter(e.value)
    console.log(e.value)
    this.props.loadChapter(e.value, this.state.gradeId)
    // this.setState({ subject: i.value })
    this.setState({ subject: e.value })
  }
  // handleSubject = (e, i) => {
  //   console.log(i.value)
  //   this.props.loadGradeChapter(i.value)
  //   this.setState({ subject: i.value })
  // };
  // handleGrade = (e) => {
  //   console.log(e, 'graaaaaaaaaaaaaaaaaaaaaadeee')
  //   this.setState({ grade: e.value }, () => {
  //     this.props.loadChapter(this.state.subject, e.value)
  //   })
  // };
  questionType = (e, value) => {
    console.log('questiontype', value)
    this.setState({ question_type: e.value })
  };
  handleChapter = (e, value) => {
    this.setState({ chapter: e.value })
  };
  handleQlevel = (e, value) => {
    console.log('level', value)
    this.setState({ level: e.value })
  };
  handleCategory = (e, value) => {
    console.log('category', value)
    this.setState({ category: e.value })
  };
  handleChange=(event) => {
    // console.log('checked', checked)
    this.setState({ checked: event.target.checked })
  };
  handleSave = e => {
    var formData = new FormData()
    delete this.state.subjectArr
    delete this.state.gradeArr
    delete this.state.chapterArr
    delete this.state.questionCategoryArr
    delete this.state.questionLevelArr
    delete this.state.questionTypeArr

    // var excelf = e.target.excel.files[0]
    // formData.append('excel_file', this.state.files)
    formData.append('question_type', this.state.question_type)
    formData.append('subject', this.state.subject)
    formData.append('grade', this.state.gradeId)
    formData.append('level', this.state.level)
    formData.append('category', this.state.category)
    formData.append('chapter', this.state.chapter)
    formData.append('is_approved', this.state.checked)
    console.log(this.state)
    console.log(formData)
    let files = this.state.files
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      formData.append('excel_file', this.state.files[fileIndex])
    }

    axios
      .post(urls.UploadQuestionExcel, formData, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success(res.data)
      })
      .catch(error => {
        console.log(error)

        this.props.alert.error('Something went wrong')
      })
  }

  onClick () {
    window.open(staticUrls.UploadQuestionTemplateExcel, '_blank')
  }
  render () {
    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    const questionArr = this.props.questionTypes
      ? this.props.questionTypes.map(qst => {
        return {
          key: `${qst.id}`,
          value: qst.id,
          label: qst.question_type
        }
      })
      : [
        {
          key: `no key`,
          value: '002',
          label: `no Question Type `
        }
      ]

    // const subjects = this.props.subjects
    //   ? this.props.subjects.map(qst => {
    //     return {
    //       key: `${qst.id}`,
    //       value: qst.id,
    //       label: qst.subject_name
    //     }
    //   })
    //   : [
    //     {
    //       key: `no key`,
    //       value: '003',
    //       label: `no subject `
    //     }
    //   ]

    const questionLArr = this.props.questionLevel
      ? this.props.questionLevel.map(qst => {
        return {
          key: `${qst.id}`,
          value: qst.id,
          label: qst.question_level
        }
      })
      : [
        {
          key: `no key`,
          value: '004',
          label: `no Level `
        }
      ]
    const questionCArr = this.props.questionCategory
      ? this.props.questionCategory.map(qst => {
        return {
          key: `${qst.id}`,
          value: qst.id,
          label: qst.category_name
        }
      })
      : [
        {
          key: `no key`,
          value: '005',
          label: `no Category `
        }
      ]
    // // let gradesArr = []
    // if (this.props.grades && typeof this.props.grades !== 'string') {
    //   gradesArr = this.props.grades.map(grd => {
    //     return {
    //       key: `${grd.id}`,
    //       value: grd.id,
    //       label: grd.grade
    //     }
    //   })
    // } else {
    //   gradesArr = [{ key: '0', label: 'No Data', value: '000' }]
    // }

    let chapterArr = []
    if (this.props.chapter && typeof this.props.chapter !== 'string') {
      chapterArr = this.props.chapter.map(chp => {
        return {
          key: `${chp.id}`,
          value: chp.id,
          label: chp.chapter_name
        }
      })
    } else {
      chapterArr = [{ key: '0', label: 'No Data', value: '000' }]
    }

    return (
      <React.Fragment>
        <label style={{ padding: '10px' }}>Chapter Information</label>
        <Divider />

        {/* <Form onSubmit={this.handleSave} style={{ paddingLeft: '20px' }}> */}
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>
                        Select Question Type<sup>*</sup>
              </label>
              <br />
              <OmsSelect
                placeholder='State'
                search
                selection
                options={questionArr}
                change={this.questionType}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>Grade*</label>
              <OmsSelect
                placeholder='Select Grade'
                options={this.role === 'Subjecthead'
                  ? this.state.gradeData : this.props.grades
                    ? this.props.grades.map(grade => ({
                      value: grade.id,
                      label: grade.grade
                    }))
                    : []}
                defaultvalue={this.state.gradevalue}
                change={this.changehandlergrade}

              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>Subject*</label>
              <OmsSelect
                placeholder='Select Subject'
                options={this.role === 'Subjecthead'
                  ? this.state.subjectsArr
                  : this.props.subjects
                    ? this.props.subjects.map(subject => ({
                      value: subject.id,
                      label: subject.subject_name
                    }))
                    : []}
                // defaultvalue={this.state.gradevalue}
                change={this.handleSubject}

              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>
                        Select Chapter<sup>*</sup>
              </label>
              <br />
              <OmsSelect
                placeholder='State'
                search
                selection
                // options={this.props.chapter ? this.props.chapter.map(chap => ({ value: chap.id, label: chap.chapter_name })) : []}
                options={chapterArr}
                change={this.handleChapter}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>
                        Select Question Level<sup>*</sup>
              </label>
              <br />
              <OmsSelect
                placeholder='State'
                search
                selection
                options={questionLArr}
                change={this.handleQlevel}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <label>
                        Select Question Category<sup>*</sup>
              </label>
              <br />
              <OmsSelect
                placeholder='State'
                search
                selection
                options={questionCArr}
                change={this.handleCategory}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              {/* <label>
                        Select File<sup>*</sup>
                </label>
                <br />
                <input
                  type='file'
                  name='excel'
                  style={{ width: '70%' }}
                /> */}
              <Dropzone onDrop={this.onDrop}>
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
                      {files}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div style={{ padding: '10px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checked}
                onChange={(e) => this.handleChange(e)}
                // value='checked'
                color='primary'
              />
            }
            label='Publish all the Questions'
          />
          <Table collapsing celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Question</Table.HeaderCell>
                <Table.HeaderCell>Option 1</Table.HeaderCell>
                <Table.HeaderCell>Option 2</Table.HeaderCell>
                <Table.HeaderCell>Option 3</Table.HeaderCell>
                <Table.HeaderCell>Option 4</Table.HeaderCell>
                <Table.HeaderCell>Answer </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </div>
        <Grid>
          <Grid.Column>

            <Button disabled={!this.state.files} onClick={this.handleSave} color='green'>
                        Upload
            </Button>
            <Button color='blue' onClick={this.onClick}>Download Template</Button>
            <Button
              primary
              onClick={this.props.history.goBack}
              type='button'
            >
                        Return
            </Button>

          </Grid.Column>
        </Grid>
        {/* </Form> */}

        <br />
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  questionTypes: state.questionType.items,
  subjects: state.subjects.items,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items,
  grades: state.grades.items,
  chapter: state.chapter.items
})
const mapDispatchToProps = dispatch => ({
  listGrades: () => dispatch(apiActions.listGrades()),
  listSubjects: gradeId => dispatch(apiActions.listSubjects(gradeId)),
  loadQuestionType: dispatch(apiActions.listQuestionType()),
  loadSubjects: dispatch(apiActions.listSubjects()),
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory()),
  loadGradeChapter: sub => dispatch(apiActions.listGradesChapter(sub)),
  loadChapter: (sub, grade) => dispatch(apiActions.listChapter(sub, grade))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UploadQuestionExcel))
