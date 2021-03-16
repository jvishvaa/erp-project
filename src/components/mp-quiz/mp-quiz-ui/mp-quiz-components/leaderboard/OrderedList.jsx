/* eslint-disable no-undef */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import List from './List'
import StudentRankingDetails from './StudentRankingDetails'
import PostQuizStudentRankingDetails from './PostQuiz/PostQuizStudentRankingDetails'

export class OrderedList extends Component {
  constructor () {
    super()
    this.state = {
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info
    }
  }

  myRef = React.createRef()

  componentWillReceiveProps () {
    this.props.leaders.forEach(child => {
      // Find the ref for this specific child.
      const ref = this.refs[child.user_id]
      // Look up the DOM node

      const domNode = ReactDOM.findDOMNode(ref)

      // Calculate the bounding box
      const boundingBox = domNode.getBoundingClientRect()

      // Store that box in the state, by its key.
      this.setState({
        [child.user_id]: boundingBox
      })
      const domReference = this.myRef.current
      if (domReference) {
        domReference.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }
    })
  }

  componentDidUpdate (previousProps) {
    previousProps.leaders.forEach(child => {
      let domNode = ReactDOM.findDOMNode(this.refs[child.user_id])
      const newBox = domNode.getBoundingClientRect()
      const oldBox = this.state[child.user_id]

      const deltaX = oldBox.left - newBox.left
      const deltaY = oldBox.top - newBox.top

      requestAnimationFrame(() => {
        domNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        domNode.style.transition = 'transform 0s'

        requestAnimationFrame(() => {
          // In order to get the animation to play, we'll need to wait for
          // the 'invert' animation frame to finish, so that its inverted
          // position has propagated to the DOM.
          //
          // Then, we just remove the transform, reverting it to its natural
          // state, and apply a transition so it does so smoothly.
          domNode.style.transform = ''
          domNode.style.transition = 'transform 500ms'
        })
      })
    })
  }

  render () {
    const { showWithProgress, leaders, possibleScore, totalQuestions, isHost, showTopFive } = this.props
    return (
      <div>
        {leaders.map(({ user_id: userId, ...otherProps }, index) => {
          return showWithProgress
            ? <PostQuizStudentRankingDetails
              key={userId}
              {...otherProps}
              possibleScore={possibleScore}
              ref={userId}
              totalQuestions={totalQuestions}
              isHost={isHost}
              visibility={showTopFive && index > 4 ? 'hidden' : 'visible'}
            />
            : <StudentRankingDetails
              key={userId}
              studentDetails={{ ...otherProps, user_id: userId, childRef: this.myRef }}
              ref={userId}
            />
        }
        ) }
      </div>
    )
  }
}

export default OrderedList
