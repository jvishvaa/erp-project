export class QuestionPaper {
  constructor (id, questions) {
    this.id = id
    this.questions = questions.map(question => new Question(question.id, question.question, question.options, question.correct_ans, 0))
  }

  getQuestions () {
    return this.questions
  }
}

export class Question {
  constructor (id, question, options, correctAnswer, timestamp, image) {
    this.id = id
    this.question = question
    this.options = options
    this.correctAnswer = correctAnswer
    this.timestamp = timestamp
    this.image = image
  }
}
