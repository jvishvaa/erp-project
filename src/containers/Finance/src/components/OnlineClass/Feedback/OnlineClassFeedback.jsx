import React, { Component } from 'react'
import { EmojiAverage, EmojiExcellent, EmojiGood, EmojiPoor, EmojiWorst } from '../../../ui/Feedback/EmojiFeedback'

class OnlineClassFeedback extends Component {
  handleEmojiClick = (name) => {
    this.props.handleFeedBack(name)
  }

  render () {
    return (
      <div>
        <EmojiWorst handleEmojiClick={this.handleEmojiClick} type={this.props.feedbackType} />
        <EmojiPoor handleEmojiClick={this.handleEmojiClick} type={this.props.feedbackType} />
        <EmojiAverage handleEmojiClick={this.handleEmojiClick} type={this.props.feedbackType} />
        <EmojiGood handleEmojiClick={this.handleEmojiClick} type={this.props.feedbackType} />
        <EmojiExcellent handleEmojiClick={this.handleEmojiClick} type={this.props.feedbackType} />
      </div>
    )
  }
}

export default OnlineClassFeedback
