import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
import ReactHtmlParser from 'react-html-parser'
import {
  Segment,
  Grid,
  Label,
  Dimmer,
  Loader,
  Input
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'
import axios from 'axios'
import AuthService from '../../AuthService'
import { qBUrls } from '../../../urls'
import { CompConsumer, CompContext } from '../CompContext'
import { AlertMessage, RouterButton } from '../../../ui'
// require("bootstrap/less/bootstrap.less")

class QuestionDraft extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      questions: {
        data: [],
        loading: false,
        value: [],
        publishDisable: []
      }
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleRating = this.handleRating.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }

  componentDidMount () {
    let quesData
    if (this.context.questionsD.data.length > 0) {
      this.context.questionsD.data.forEach(function (question) {
        quesData = Object.assign(
          { [question.id]: { value: '', publish: true } },
          quesData
        )
      })
      this.setState({ quesData: quesData })
    }
  }

  handleDelete = (e, updateCompQues) => {
    console.log('question id', e)
    let newurl =
      qBUrls.ListQuestion.substring(0, qBUrls.ListQuestion.length - 1) + `${e}`
    axios
      .delete(newurl, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        //  this.props.alert.success("Question Deleted");
        window.alert('Comprehension Deleted')
        updateCompQues()
      })
      .catch(error => {
        console.log(error)
        // this.props.alert.error("Something went wrong");
        window.alert('Something went wrong')
      })
  };

  handleRating = (id, event) => {
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

  handlePublish = id => {
    let data = {
      is_approve: true,
      rating: this.state.quesData[id]['value']
    }
    axios
      .put(qBUrls.PublishQuestion + id + '/', data, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.context.questionsD.data.splice(
            this.context.questionsD.data.findIndex(ques => ques.id === id),
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
        <CompConsumer>
          {context => (
            <div>
              {console.log('drafted', context)}
              <Grid>
                <Grid.Row>
                  <Grid.Column floated='right' width={5}>
                    <div>
                      {' '}
                      Total Questions : {context.questionsD.question_count}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div>
                {context.loadindDrafted ? (
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                ) : context.questionsD.data.length > 0 && quesData ? (
                  context.questionsD.data.map((qus, i) => (
                    <div>
                      <div
                        style={{
                          padding: '20px',
                          background: '#ccc',
                          marginTop: '20px'
                        }}
                      >
                        {' '}
                        {++i})&nbsp;&nbsp;{' '}
                        {ReactHtmlParser(qus.compreshion_text)}
                      </div>
                      <Segment>
                        {qus.questions.length > 0 ? (
                          qus.questions.map((q, i) => (
                            <div>
                              <Segment>
                                {++i})&nbsp;&nbsp;{' '}
                                {ReactHtmlParser(q.questiontext)}{' '}
                                {/* q.questiontext */}
                              </Segment>
                              <div>
                                Options:
                                {q.option.map((op, i) => (
                                  <div style={{ marginLeft: '20px' }}>
                                    {++i}&nbsp;&nbsp;{ReactHtmlParser(op)}
                                  </div>
                                ))}
                              </div>
                              <br />
                              <div>
                                Ans:&nbsp;&nbsp;{q.correct_ans.substring(2, 9)}{' '}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>No Questions</div>
                        )}
                        <div style={{ marginTop: '20px' }} />
                        <Label>
                          {qus.subject ? qus.subject : 'No Subject'}
                        </Label>
                        <Label>{qus.grade ? qus.grade : 'No Grade'}</Label>
                        <Label>
                          {qus.chapter ? qus.chapter : 'No Chapter'}
                        </Label>
                        <Label>
                          {qus.questionlevel
                            ? qus.questionlevel
                            : 'No Question Level'}
                        </Label>
                        <Label>
                          {qus.questioncategory
                            ? qus.questioncategory
                            : 'No Question Category'}
                        </Label>
                        <Label>
                          {qus.user_name ? qus.user_name : 'No Author'}
                        </Label>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={10}>
                              {this.userProfile.personal_info.role ===
                                ('Reviewer' || 'Subjecthead') ? (
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
                              <Button
                                onClick={() => { this.handleDelete(qus.id, context.updateCompQues) }}
                              >
                                Remove
                              </Button>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Segment>
                    </div>
                  ))
                ) : context.loadindDrafted ? (
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                ) : (
                  <div>No Data</div>
                )}
              </div>
              <Grid>
                <Grid.Row>
                  <Grid.Column floated='right'>
                    <Pagination
                      activePage={this.props.activePageD}
                      totalItemsCount={context.questionsD.total_page_count * 10}
                      itemsCountPerPage={10}
                      pageRangeDisplayed={5}
                      onChange={this.props.pageD}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          )}
        </CompConsumer>
      </div>
    )
  }
}

QuestionDraft.contextType = CompContext

export default QuestionDraft
