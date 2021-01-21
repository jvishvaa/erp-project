import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
import {
  Segment,
  Grid,
  Label,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'
import AuthService from '../../AuthService'
import { qBUrls } from '../../../urls'
import { RouterButton } from '../../../ui'
import { CompConsumer } from '../CompContext'

class QuestionPublished extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      questions: {
        data: [],
        loading: false
      }
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  handleDelete (e, i, v) {
    console.log('question id', e)
    // console.log(i);
    // console.log(v)
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
      })
      .catch(error => {
        console.log(error)
        // this.props.alert.error("Something went wrong");
        window.alert('Something went wrong')
      })
  };
  render () {
    return (
      <CompConsumer>
        {context => (
          <div>
            {console.log('published', context)}
            <Grid>
              <Grid.Row>
                <Grid.Column floated='right' width={5}>
                  <div>
                    {' '}
                    Total Questions : {context.questionsP.question_count}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div>
              {context.loadingPublished ? (
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              ) : context.questionsP.data.length > 0 ? (
                context.questionsP.data.map((qus, i) => (
                  <div>
                    {' '}
                    <div
                      style={{
                        padding: '20px',
                        background: '#ccc',
                        marginTop: '20px'
                      }}
                    >
                      {' '}
                      {++i})&nbsp;&nbsp; {ReactHtmlParser(qus.compreshion_text)}{' '}
                    </div>
                    <Segment>
                      {qus.questions.length > 0 ? (
                        qus.questions.map((q, i) => (
                          <div>
                            <Segment>
                              {++i})&nbsp;&nbsp;{' '}
                              {ReactHtmlParser(q.questiontext)}
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
                      <Label>{qus.chapter ? qus.chapter : 'No Chapter'}</Label>
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
                      {this.role === 'Admin' || this.role === 'Subjecthead'
                        ? <Grid>
                          <Grid.Row>
                            <Grid.Column floated='right'>
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
                                onClick={() => { this.handleDelete(qus.id) }}
                              >
                              Remove
                              </Button>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                        : ''
                      }
                    </Segment>
                  </div>
                ))
              ) : context.loadingPublished ? (
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
                    activePage={this.props.activePageP}
                    totalItemsCount={context.questionsP.total_page_count * 10}
                    itemsCountPerPage={10}
                    pageRangeDisplayed={5}
                    onChange={this.props.pageP}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
      </CompConsumer>
    )
  }
}

export default QuestionPublished
