import React, { Component } from 'react'
import {
  Form,
  Grid,
  Divider,
  Segment,
  Label,
  Header
} from 'semantic-ui-react'
import axios from 'axios'
import { Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiActions } from '../../_actions'
import '../css/staff.css'
import { AlertMessage, OmsSelect } from '../../ui'
import { urls } from '../../urls'

class TeacherPractice extends Component {
  constructor () {
    super()
    this.state = {
      subjectArr: [],
      gradeArr: [],
      chapter: []
    }
    this.handleArrow = this.handleArrow.bind(this)
  }

  handleSubject = (e) => {
    this.props.loadGradeChapter(e.value)
    this.setState({ subject: e.value, grade: '', valueSubject: e, valueGrade: [] })
  };

  handleGrade = (e) => {
    this.setState({ grade: e.value, valueGrade: e })
  };

  handleSave = () => {
    let { subject, grade } = this.state
    if (!subject) {
      this.setState({
        alertMessage: {
          messageText: 'Select Subject',
          variant: 'warning',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      return false
    } else if (!grade) {
      this.setState({
        alertMessage: {
          messageText: 'Select Grade',
          variant: 'warning',
          reset: () => {
            this.setState({ alertMessage: null })
          }
        }
      })
      return false
    }

    delete this.state.subjectArr
    delete this.state.gradeArr
    console.log('state', this.state)
    this.setState({ chapter: [] }, () => {
      axios
        .get(urls.Chapter + `?s_id=${subject}&g_id=${grade}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          this.setState({ chapter: res.data })
        })
        .catch(er => {
          this.setState({
            alertMessage: {
              messageText: 'Error Occured',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        })
    })
  };

  handleArrow = v => {
    console.log(v)
    this.props.history.push(this.props.match.url)
  };

  render () {
    const subjectsArr = this.props.subjects
      ? this.props.subjects.map(qst => {
        return {
          key: `${qst.id}`,
          value: qst.id,
          label: qst.subject_name
        }
      })
      : ''

    let gradesArr = []
    if (this.props.grades && typeof this.props.grades !== 'string') {
      gradesArr = this.props.grades.map(grd => {
        return {
          key: `${grd.id}`,
          value: grd.grade_id,
          label: grd.grade_name
        }
      })
    }

    return (
      <React.Fragment>
        <div>
          <AlertMessage alertMessage={this.state.alertMessage} />
          <label style={{ padding: '10px' }}>Chapter Information</label>
          <Divider />
          <Form onSubmit={this.handleSave} style={{ paddingLeft: '20px' }}>
            <Form.Group>
              <Form.Field width={6}>
                <label>
                    Subject<sup>*</sup>
                </label>
                <OmsSelect
                  placeholder='Select Subject'
                  options={subjectsArr}
                  change={this.handleSubject}
                  defaultValue={this.state.valueSubject}
                />
              </Form.Field>
            </Form.Group>

            <Form.Group>
              <Form.Field width={6}>
                <label>
                    Grade<sup>*</sup>
                </label>
                <OmsSelect
                  placeholder='Select Grade'
                  options={gradesArr}
                  change={this.handleGrade}
                  defaultValue={this.state.valueGrade}
                />
              </Form.Field>
            </Form.Group>

            <Form.Group style={{ padding: '20px' }}>
              <Button type='submit' color='green'>
                  Show Chapters
              </Button>
              <Button
                primary
                onClick={this.props.history.goBack}
                type='button'
              >
                  Return
              </Button>
            </Form.Group>
          </Form>
          {this.state.chapter !== 'Chapter Data not found' && this.state.chapter.length > 0 ? (
            <div>
              {' '}
              <Header
                style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: '#737373'
                }}
                as='h1'
                textAlign='center'
                content='Chapters'
              />
            </div>
          ) : null}
          <Grid columns={4}>
            {this.state.chapter !== 'Chapter Data not found' && this.state.chapter.length > 0
              ? this.state.chapter.map(v => (
                <Grid.Column>
                  <Segment style={{ height: '150px', display: 'flex' }}>
                    <Label
                      size='large'
                      style={{ marginRight: 'auto', marginBottom: 'auto' }}
                    >
                      {v.chapter_name}
                    </Label>
                    <Button
                      onClick={e => this.handleArrow(v.id)}
                      size='small'
                      circular
                      style={{ marginLeft: 'auto', marginTop: 'auto' }}
                      color='teal'
                      icon='external square alternate'
                    />
                  </Segment>
                </Grid.Column>
                // <Icon fitted name='external square alternate' />
              ))
              : null}
            {this.state.chapter === 'Chapter Data not found' && <div style={{ padding: 10 }}>No chapter data found.</div>}
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items,
  grades: state.gradeSubject.items
})

const mapDispatchToProps = dispatch => ({
  loadSubjects: dispatch(apiActions.listSubjects()),
  loadGradeChapter: sub => dispatch(apiActions.listGradesChapter(sub))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TeacherPractice))
