/* eslint-disable camelcase */
import React, { Component } from 'react'
import { Grid, Segment, Button } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import Radio from '@material-ui/core/Radio'
import { urls } from '../../../urls'

class QuestionTemplate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedAnswerList: [],
      maxMarksPerQuestionList: [],
      obtainedMarksPerQuestionList: [],
      isDisabled: true
    }
    this.token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
  }

  componentDidMount () {
    if (this.props.studentId) {
      this.getStudentObtainedAndQuestionPaperDetails()
    }
  }

  getStudentObtainedAndQuestionPaperDetails = () => {
    const { uniqueTestId, questionPaperId, studentId } = this.props
    axios.get(`${urls.QuestionPaperMarks}?qp_id=${questionPaperId}&student_id=${studentId}&test_id=${uniqueTestId}`, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    })
      .then(res => {
        const { question_paper_marks, each_question_json, student_obtained_marks } = res.data
        this.setState({ selectedAnswerList: each_question_json,
          obtainedMarksPerQuestionList: student_obtained_marks,
          maxMarksPerQuestionList: question_paper_marks
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  convertNumericToAlphabet = (numericList) => {
    numericList.map((mark, index) => {
      mark[index + 1] = (Number(mark[index + 1]) + 9).toString(36) === '9' ? null : (Number(mark[index + 1]) + 9).toString(36)
    })
    return numericList
  }

  handleRadioButtonChange = (event, index) => {
    const { selectedAnswerList } = this.state
    let reselectedAnswerList = selectedAnswerList
    reselectedAnswerList[index][index + 1] = event.target.value
    this.setState({ selectedAnswerList: reselectedAnswerList, isDisabled: false })
  }

  handleObtainedMarksChange = (event, index) => {
    const { value } = event.target
    const { obtainedMarksPerQuestionList } = this.state
    let editedMarksList = obtainedMarksPerQuestionList
    editedMarksList[index][index + 1] = value === '' ? '' : +value.replace(/\./g, '')
    this.setState({ obtainedMarksPerQuestionList: editedMarksList, isDisabled: false })
  }

  renderRadioButton = (value, index) => {
    let { selectedAnswerList } = this.state
    return selectedAnswerList.length
      ? (
        <Radio
          checked={selectedAnswerList[index] && selectedAnswerList[index][index + 1] === value}
          onChange={(event) => {
            this.handleRadioButtonChange(event, index)
          }}
          value={value}
          name='radio-button-demo'
        />
      )
      : ''
  }

  handleSubmit = () => {
    const { selectedAnswerList, obtainedMarksPerQuestionList } = this.state
    const { uniqueTestId, questionPaperId, studentId } = this.props

    // let formData = new FormData()
    let updatedData = selectedAnswerList.map((answer, index) => {
      let obj = {}
      obj.seq = String(index + 1)
      obj.selectedAnswer = answer[index + 1]
      obj.obtainedMarks = obtainedMarksPerQuestionList[index][index + 1]
      return obj
    })
    let form_data = { 'updated_data': updatedData }
    console.log(form_data, 'form dataaa')
    // formData.append('updated_data', JSON.stringify(updatedData))
    // eslint-disable-next-line no-debugger
    axios.post(urls.QuestionPaperMarks + '?qp_id=' + questionPaperId + '&student_id=' + studentId + '&test_id=' + uniqueTestId, form_data, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    })
      .then(res => {
        window.alert('Successfully updated')
      })
      .catch(error => {
        console.log(error)
        window.alert('Failed to update')
      })
  }

  render () {
    console.log(this.props.questions)
    const {
      // selectedAnswerList,
      maxMarksPerQuestionList, obtainedMarksPerQuestionList } = this.state
    return (
      <Grid>
        {this.props.questions ? this.props.questions.map((row, i) => (
          <React.Fragment key={i}>
            {row.comprehension_details
              ? <React.Fragment>
                <Grid.Row>
                  <Grid.Column width={1}></Grid.Column>
                  <Grid.Column width={13} style={{ display: 'inline' }}>
                    <label>
                      {i + 1}){ReactHtmlParser(row.comprehension_details.comprehension_question)}
                    </label>
                  </Grid.Column>
                </Grid.Row>
                {row.sub_question_details.map((ques, j) =>
                  (
                    <Grid.Row key={j}>
                      <Grid.Column width={1}></Grid.Column>
                      <Grid.Column width={13}>
                        <label>{++j}.{ReactHtmlParser(ques.question)}</label>
                        {this.props.view === 'teacher' || this.props.view === 'student'
                          ? <Segment>
                            <b>Options</b> : <br />
                            {this.renderRadioButton('1', i)}
                            a. {ReactHtmlParser(ques.options.option1)}
                            {this.renderRadioButton('2', i)}
                            b. {ReactHtmlParser(ques.options.option2)}
                            {this.renderRadioButton('3', i)}
                            c. {ReactHtmlParser(ques.options.option3)}
                            {this.renderRadioButton('4', i)}
                            d. {ReactHtmlParser(ques.options.option4)}
                          </Segment>
                          : this.props.view === 'student1'
                            ? <Segment>
                              <Grid>
                                <b>Options</b> :
                                <Grid.Column
                                  width={3}
                                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                                >
                                  a. {ReactHtmlParser(ques.options.option1)}
                                </Grid.Column>
                                <Grid.Column
                                  width={3}
                                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                                >
                                  b. {ReactHtmlParser(ques.options.option2)}
                                </Grid.Column>
                                <Grid.Column
                                  width={3}
                                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                                >
                                  c. {ReactHtmlParser(ques.options.option3)}
                                </Grid.Column>
                                <Grid.Column
                                  width={3}
                                  style={{ paddingLeft: '10px', display: 'inline-block' }}
                                >
                                  d. {ReactHtmlParser(ques.options.option4)}
                                </Grid.Column>
                              </Grid>
                            </Segment>
                            : this.props.view === 'student2'
                              ? <Segment>
                                <Grid>
                                  <Grid.Row style={{ padding: '10px' }}>
                                    <b>Options :</b>
                                  </Grid.Row>
                                  <Grid.Row>
                                    <Grid.Column
                                      width={6}
                                      style={{ paddingLeft: '20px', display: 'inline-block' }}
                                    >
                                      a. {ReactHtmlParser(ques.options.option1)}
                                    </Grid.Column>
                                    <Grid.Column
                                      width={6}
                                      style={{ paddingLeft: '20px', display: 'inline-block' }}
                                    >
                                      b. {ReactHtmlParser(ques.options.option2)}
                                    </Grid.Column>
                                    <Grid.Column
                                      width={6}
                                      style={{ paddingLeft: '20px', display: 'inline-block' }}
                                    >
                                      c. {ReactHtmlParser(ques.options.option3)}
                                    </Grid.Column>
                                    <Grid.Column
                                      width={6}
                                      style={{ paddingLeft: '20px', display: 'inline-block' }}
                                    >
                                      d. {ReactHtmlParser(ques.options.option4)}
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              </Segment>
                              : ''}
                        {this.props.view === 'teacher'
                          ? <p style={{ paddingBottom: '10px' }}>
                            <b>Correct Answer</b> : {ReactHtmlParser(ques.correct_ans.substring(2, 9))}
                          </p>
                          : ''
                        }
                      </Grid.Column>
                    </Grid.Row>
                  )
                )}
              </React.Fragment>
              : <Grid.Row>
                <Grid.Column width={1}></Grid.Column>
                <Grid.Column width={13}>
                  <label>{i + 1}){ReactHtmlParser(row.question)}</label>
                  {this.props.view === 'teacher' || this.props.view === 'student'
                    ? <Segment style={{ position: 'relative' }}>
                      <Grid.Row style={{ paddingLeft: '10px' }}>
                        <b>Options</b> : <br />
                      </Grid.Row>
                      <Grid.Row style={{ paddingLeft: '10px' }}>
                        {this.renderRadioButton('1', i)}
                        a. {ReactHtmlParser(row.options.option1)}
                      </Grid.Row>
                      <Grid.Row style={{ paddingLeft: '10px' }}>
                        {this.renderRadioButton('2', i)}
                        b. {ReactHtmlParser(row.options.option2)}
                      </Grid.Row>
                      <Grid.Row style={{ paddingLeft: '10px' }}>
                        {this.renderRadioButton('3', i)}
                        c. {ReactHtmlParser(row.options.option3)}
                      </Grid.Row>
                      <Grid.Row style={{ paddingLeft: '10px' }}>
                        {this.renderRadioButton('4', i)}
                        d. {ReactHtmlParser(row.options.option4)}
                      </Grid.Row>
                      {
                        this.props.isEditable && this.state.maxMarksPerQuestionList.length
                          ? (
                            <div style={{ position: 'absolute', bottom: '-15px', right: '0%', transform: 'translate(-20%, 0%)' }}>
                              <p style={{ margin: 0 }}>Obtained Marks</p>
                              <input
                                type='text'
                                style={{ width: 100, height: 34, borderRadius: 3, paddingLeft: 5 }}
                                value={obtainedMarksPerQuestionList[i] ? obtainedMarksPerQuestionList[i][i + 1] : ''}
                                onChange={(event) => {
                                  let pattern =
                                  // new RegExp(`^[0-${maxMarksPerQuestionList[i][i + 1]}]{1}?$`, 'ig')
                                  new RegExp(`^[0-${maxMarksPerQuestionList[i][i + 1]}]$`, 'g')
                                  let isValid = pattern.test(Number(event.target.value))
                                  if (isValid) {
                                    this.handleObtainedMarksChange(event, i)
                                  }
                                }}
                              />
                            </div>
                          )
                          : ''
                      }
                    </Segment>
                    : this.props.view === 'student1'
                      ? <Segment>
                        <Grid>
                          <b>Options</b> : <br />
                          <Grid.Column
                            width={3}
                            style={{ paddingLeft: '10px', display: 'inline-block' }}
                          >
                            a. {ReactHtmlParser(row.options.option1)}
                          </Grid.Column>
                          <Grid.Column
                            width={3}
                            style={{ paddingLeft: '10px', display: 'inline-block' }}
                          >
                            b. {ReactHtmlParser(row.options.option2)}
                          </Grid.Column>
                          <Grid.Column
                            width={3}
                            style={{ paddingLeft: '10px', display: 'inline-block' }}
                          >
                            c. {ReactHtmlParser(row.options.option3)}
                          </Grid.Column>
                          <Grid.Column
                            width={3}
                            style={{ paddingLeft: '10px', display: 'inline-block' }}
                          >
                            d. {ReactHtmlParser(row.options.option4)}
                          </Grid.Column>
                        </Grid>
                      </Segment>
                      : this.props.view === 'student2'
                        ? <Segment>
                          <Grid>
                            <Grid.Row style={{ padding: '10px' }}>
                              <b>Options :</b>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column
                                width={6}
                                style={{ paddingLeft: '20px', display: 'inline-block' }}
                              >
                                a. {ReactHtmlParser(row.options.option1)}
                              </Grid.Column>
                              <Grid.Column
                                width={6}
                                style={{ paddingLeft: '20px', display: 'inline-block' }}
                              >
                                b. {ReactHtmlParser(row.options.option2)}
                              </Grid.Column>
                              <Grid.Column
                                width={6}
                                style={{ paddingLeft: '20px', display: 'inline-block' }}
                              >
                                c. {ReactHtmlParser(row.options.option3)}
                              </Grid.Column>
                              <Grid.Column
                                width={6}
                                style={{ paddingLeft: '20px', display: 'inline-block' }}
                              >
                                d. {ReactHtmlParser(row.options.option4)}
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Segment>
                        : ''
                  }
                  {this.props.view === 'teacher'
                    ? <p style={{ paddingBottom: '10px' }}>
                      <b>Correct Answer</b> : {ReactHtmlParser(String(Object.keys(JSON.parse(row.correct_ans))))}
                    </p>
                    : ''
                  }
                </Grid.Column>
              </Grid.Row>
            }
          </React.Fragment>
        )) : <div> No question added </div>
        }
        <Grid.Row>
          <Grid.Column width={5}></Grid.Column>
          <Grid.Column width={6}>
            {this.props.questions && !this.props.isEditable
              ? <Button
                primary
                href={urls.ExportQuestionTeacher + '?id=' + this.props.match.params.id +
                  '&view=' + this.props.view}
                target='_blank'
              >
                Export Question Paper
              </Button>
              : this.props.isEditable && this.props.questions
                ? <Button
                  disabled={this.state.isDisabled}
                  primary
                  onClick={() => { this.setState({ isDisabled: true }, () => { this.handleSubmit() }) }}
                >
              Submit
                </Button>
                : ''
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)((withRouter(QuestionTemplate)))
