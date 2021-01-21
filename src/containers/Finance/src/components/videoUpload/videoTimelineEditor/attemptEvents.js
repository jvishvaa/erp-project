export class AttemptEvents {
  constructor (questionPaper, events) {
    this.questionPaper = questionPaper
    this.events = events
  }
  addEvent (event) {
    this.events.push(event)
  }
  removeEvent (index) {
    let event = this.events[index]
    event.questions.forEach(question => {
      question.event = null
    })
    this.events.splice(index, 1)
  }
  getEvents () {
    return this.events
  }
  hasEvent (event) {
    let index = this.events.includes(event)
    if (index) {
      return true
    }
    return false
  }
}

export class AttemptEvent {
  constructor (timestamp = '0:00', questions = []) {
    this.timestamp = timestamp
    this.questions = questions
  }
  addQuestion (question) {
    this.questions.push(question)
  }
  removeQuestion (question) {
    let index = this.questions.includes(question)
    this.questions.splice(index, 1)
  }
  updateTimestamp (newTimeStamp) {
    this.timestamp = newTimeStamp
  }
}

export default AttemptEvent
