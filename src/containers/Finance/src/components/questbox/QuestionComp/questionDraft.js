import React from 'react'
import {
  Segment,
  Grid,
  Button,
  Label,
  Dimmer,
  Loader,
  Input
} from 'semantic-ui-react'
import ReactHtmlParser from 'react-html-parser'
import Pagination from 'react-js-pagination'
import { connect } from 'react-redux'
import axios from 'axios'
import { FamilyContext, FamilyConsumer } from '../SmallContext'
import { AlertMessage, RouterButton } from '../../../ui'
import { qBUrls } from '../../../urls'
import { apiActions } from '../../../_actions'

class QuestionDraft extends React.Component {
  constructor () {
    super()
    this.state = {
      questions: {
        data: [],
        loading: false,
        value: [],
        publishDisable: []
      }
    }
    this.userProfile = JSON.parse(window.localStorage.getItem('user_profile'))
    this.handleDelete = this.handleDelete.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }

  componentDidMount () {
    let quesData
    if (this.context.questions_drafted.data.length > 0) {
      this.context.questions_drafted.data.forEach(function (question) {
        quesData = Object.assign(
          { [question.id]: { value: '', publish: true } },
          quesData
        )
      })
      this.setState({ quesData: quesData })
    }
  }

  handleDelete (e, updateQues) {
    console.log('question id', e)
    let newurl =
      qBUrls.ListQuestion.substring(0, qBUrls.ListQuestion.length - 1) + `${e}`
    axios
      .delete(newurl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.props.alert.success('Question Deleted')
        updateQues()
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  };

  handleRating (id, event) {
    let rating = event.target.value
    let quesData = this.state.quesData
    quesData[id]['value'] = rating
    if (rating >= 1 && rating <= 10) {
      quesData[id]['publish'] = false
    } else {
      quesData[id]['publish'] = true
    }
    this.setState({ quesData: quesData })
  };

  handlePublish (id) {
    let data = {
      is_approve: true,
      rating: this.state.quesData[id]['value']
    }
    axios
      .put(qBUrls.PublishQuestion + id + '/', data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.context.questions_drafted.data.splice(
            this.context.questions_drafted.data.findIndex(
              ques => ques.id === id
            ),
            1
          )
          this.setState({
            alertMessage: {
              messageText: res.data,
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't post data to " + qBUrls.PublishQuestion,
          error
        )
      })
  };

  render () {
    let { quesData } = this.state
    return (
      <div>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <FamilyConsumer>
          {context => (
            <div>
              {console.log('context', context)}
              <Grid>
                <Grid.Row>
                  <Grid.Column floated='right' width={5}>
                    <div>
                      {' '}
                      Total Questions :{' '}
                      {context.questions_drafted.question_count}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div>
                {context.loadingD ? (
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                ) : context.questions_drafted.data.length > 0 && quesData ? (
                  context.questions_drafted.data.map((qus, i) => (
                    <Segment>
                      <Segment>
                        {((this.props.activePageD - 1) * 10) + i + 1}){ReactHtmlParser(qus.question)}
                      </Segment>
                      <div>
                        Options:
                        {qus.option.map((op, i) => (
                          <div style={{ marginLeft: '20px' }}>
                            {++i}&nbsp;&nbsp;{ReactHtmlParser(op)}
                          </div>
                        ))}
                      </div>
                      <br />
                      {qus.correct_ans.length > 0 ? (
                        qus.correct_ans === 'True' ||
                          qus.correct_ans === 'False' ? (
                            <div>
                              Ans:&nbsp;&nbsp; <span> {qus.correct_ans} </span>{' '}
                            </div>
                          ) : (
                            <div>
                              Ans:&nbsp;&nbsp;{' '}
                              <span>{qus.correct_ans.substring(2, 9)}</span>{' '}
                            </div>
                          )
                      ) : null}
                      <div style={{ marginTop: '20px' }} />
                      <Label>
                        {qus.subjectname ? qus.subjectname : 'No Subject'}
                      </Label>
                      <Label>
                        {qus.question_type
                          ? qus.question_type
                          : 'No Question Type'}
                      </Label>
                      <Label>{qus.grade ? qus.grade : 'No Grade'}</Label>
                      <Label>{qus.chapter ? qus.chapter : 'No Chapter'}</Label>
                      <Label>
                        {this.props.questionLevel
                          ? this.props.questionLevel
                            .filter(obj => obj.id === Number(qus.questionlevel))[0]['question_level']
                          : 'No Question Level'
                        }
                      </Label>
                      <Label>
                        {this.props.questionCategory
                          ? this.props.questionCategory
                            .filter(obj => obj.id === Number(qus.questioncategory))[0]['category_name']
                          : 'No Question Category'
                        }
                      </Label>
                      <Label>
                        {qus.user_name ? qus.user_name : 'No Author'}
                      </Label>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={10}>
                            {(this.userProfile.personal_info.role === 'Reviewer' || this.userProfile.personal_info.role === 'Subjecthead') ? (
                              <div>
                                <Input
                                  type='number'
                                  min='1'
                                  max='10'
                                  value={quesData[qus.id].value}
                                  onChange={(e) => { this.handleRating(qus.id, e) }}
                                />
                                  &nbsp;
                                <Button
                                  disabled={quesData[qus.id].publish}
                                  onClick={() => { this.handlePublish(qus.id) }}
                                >
                                    Publish
                                </Button>
                              </div>
                            ) : (
                              ''
                            )}
                          </Grid.Column>
                          <Grid.Column width={6}>
                            <RouterButton
                              id={qus.id}
                              value={{
                                label: 'Edit',
                                href: `/questbox/editquestion/${
                                  qus.id
                                }/type/normal`
                              }}
                            />
                            <Button onClick={() => { this.handleDelete(qus.id) }}>
                              Remove
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  ))
                ) : context.loadingD ? (
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                ) : (<div>No Data</div>)}
              </div>
              <Grid>
                <Grid.Row>
                  <Grid.Column floated='right'>
                    <Pagination
                      activePage={this.props.activePageD}
                      totalItemsCount={
                        context.questions_drafted.total_page_count * 10
                      }
                      itemsCountPerPage={10}
                      pageRangeDisplayed={5}
                      onChange={this.props.pagedrafted}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          )}
        </FamilyConsumer>
      </div>
    )
  }
}

QuestionDraft.contextType = FamilyContext

const mapStateToProps = state => ({
  user: state.authentication.user,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items
})

const mapDispatchToProps = dispatch => ({
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDraft)
