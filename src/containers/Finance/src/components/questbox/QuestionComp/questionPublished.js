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
import Pagination from 'react-js-pagination'
import axios from 'axios'
import { connect } from 'react-redux'
import { qBUrls } from '../../../urls'
import { RouterButton } from '../../../ui'
import { FamilyConsumer } from '../SmallContext'
import { apiActions } from '../../../_actions'

class QuestionPublished extends Component {
  constructor () {
    super()
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
    let newurl =
      qBUrls.ListQuestion.substring(0, qBUrls.ListQuestion.length - 1) + `${e}`
    axios
      .delete(newurl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success('Question Deleted')
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  }

  render () {
    return (
      <FamilyConsumer>
        {context => (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column floated='right' width={5}>
                  <div>
                    {' '}
                    Total Questions :{' '}
                    {context.questions_published.question_count}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div>
              {context.loadingP ? (
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              ) : context.questions_published.data.length > 0 ? (
                context.questions_published.data.map((qus, i) => (
                  <Segment>
                    <Segment>
                      {((this.props.activePageP - 1) * 10) + i + 1}){ReactHtmlParser(qus.question)}
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
                    <Label>{qus.user_name ? qus.user_name : 'No Author'}</Label>

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
                ))
              ) : context.loadingP ? (
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
                    totalItemsCount={
                      context.questions_published.total_page_count * 10
                    }
                    itemsCountPerPage={10}
                    pageRangeDisplayed={5}
                    onChange={this.props.pagepublished}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
      </FamilyConsumer>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items
})

const mapDispatchToProps = dispatch => ({
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPublished)
