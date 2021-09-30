import React, { Component } from 'react'
import { Typography, Modal } from '@material-ui/core'
import ReactHtmlParser from 'react-html-parser'
import LinkTag from '@material-ui/core/Link'
// import { InternalPageStatus } from '../../../../../ui'
import './HostPostQuiz.css'
import CloseIcon from '@material-ui/icons/Close';
export class LongestQuestion extends Component {
  constructor () {
    super()
    this.state = {
      open: false
    }
  }

  parseHtml = (question) => {
    return (
      <React.Fragment>
        <Typography gutterBottom variant='h5'>
                  Question :
        </Typography>
        {ReactHtmlParser(question)}
      </React.Fragment>
    )
  }

  getLongestQuestion = () => {
    const { questions, questionId } = this.props
    const question = questions.find(question => Number(question.id) === Number(questionId))
    const {question_answer:questionAnswer} =question||{}
    const [{question:questionText='Question has no content'}]=(questionAnswer||[]).length?questionAnswer:[{}]
    if (question) return this.parseHtml(questionText)
    return <h1>Question not found</h1>
  }

  render () {
    // const { fetchStatus: { isFetching, isFetchFailed } } = this.props
    const { fetchStatus: { isFetching, isFetchFailed }, questions = [], questionId } = this.props
    let questionSequence = questions.length ? questions.map(item => String(item.id)).indexOf(String(questionId)) : undefined
    questionSequence = questionSequence >= 0 ? (questionSequence + 1) : undefined
    return (
      <div className='longest__question--container' style={{ position: 'relative' }}>
        <h2 className='session__highlights--title' style={{ whiteSpace: 'pre-line' }}>
          {/* Longest Question */}
          {questionSequence
            ? `${Number.ordinalSuffixOf(
                questionSequence
              )} question \n is the Longest Question`
            : isFetching
            ? 'Loading...'
            : isFetchFailed
            ? 'Failed to load'
            : 'Longest question\n not found'}
        </h2>
        {questionSequence ? (
          <LinkTag
            component='button'
            onClick={() => {
              this.setState({ open: true });
            }}
            style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}
          >
            <b style={{ textTransform: 'uppercase', color: 'yellow' }}>view question</b>
          </LinkTag>
        ) : null}
        <Modal
          onClose={() => {
            this.setState({ open: false });
          }}
          open={this.state.open}
        >
          <div>
            <div className='view__question--modal'>
              <CloseIcon
                onClick={() => {
                  this.setState({ open: false });
                }}
                style={{ color: '#fff' }}
                className='view__question--close_icon'
              />
              {this.getLongestQuestion()}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LongestQuestion
