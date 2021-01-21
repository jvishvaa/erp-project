import Pagination from 'react-js-pagination'
import React, { Component } from 'react'
import {
  Segment,
  Grid,
  Button,
  Label,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'
import AuthService from '../../AuthService'
import { qBUrls } from '../../../urls'
import { CompConsumer } from '../CompContext'
import { RouterButton } from '../../../ui'

class QuestionComp extends Component {
  constructor (props) {
    console.log('inside const comp')
    super(props)
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      questions: {
        data: [],
        loading: false
      }
    }
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete (e, updateCompQues) {
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
        updateCompQues()
      })
      .catch(error => {
        console.log(error)
        // this.props.alert.error("Something went wrong");
        window.alert('Something went wrong')
      })
  };
  render () {
    // console.log("rrender",this.state.questions)
    return (
      <CompConsumer>
        {context => (
          <div>
            {console.log('context', context)}
            <Grid>
              <Grid.Row>
                <Grid.Column floated='right' width={5}>
                  <div>
                    {' '}
                    {/* Total Questions : {context.questionsM.question_count} */}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div>
              {context.loadingM ? (
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              ) : context.questionsM.data.length > 0 ? (
                context.questionsM.data.map((qus, i) => (
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
                      {++i})&nbsp;&nbsp;{ReactHtmlParser(qus.compreshion_text)}{' '}
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
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='right'>
                            <RouterButton
                              id={qus.id}
                              value={{
                                label: 'Edit',
                                href: `/questbox/editquestion/${
                                  qus.id
                                }/type/comp`
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
              ) : context.loadingM ? (
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
                    activePage={this.props.activePage}
                    totalItemsCount={context.questionsM.total_page_count * 10}
                    itemsCountPerPage={10}
                    pageRangeDisplayed={5}
                    onChange={this.props.pageM}
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

export default QuestionComp
