/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import ReactHTMLParser from 'react-html-parser';
import { InternalPageStatus } from '../../../../mp-quiz-utils';
import { constants } from '../../../../mp-quiz-providers';
import './ReviewAnswers.css'


const {
  urls: {
    fetchQuizQpPaper: {
      headers: fetchQuizQpPaperHeaders,
      endpoint: fetchQuizQpPaperAPIEndpoint,
    } = {},
  },
} = constants || {};

export class ReviewAnswers extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      questions: [],
    };
  }

  getQuestions = () => {
    const {
      params: { lobby_identifier: lobbyIdentifier, question_paper: questionPaper } = {},
    } = constants;
    const apiUrl = `${fetchQuizQpPaperAPIEndpoint}?question_paper=${questionPaper}&lobby_identifier=${lobbyIdentifier}&online_class_id=${lobbyIdentifier}`;
    
    axios
      .get(apiUrl, fetchQuizQpPaperHeaders)
      .then((res) => {
        const {
          result: { questions :data= [] },
        } = res.data;
        if (res.status === 200) {
          this.setState({ loading: false, questions: data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.getQuestions();
    });
  }

  renderQuestion = (question) => {
    return (
      <div>
        <div className='resizeable'>
          {ReactHTMLParser(question.replace(/&nbsp;/g, ' '))}
        </div>
      </div>
    );
  };

  convertJSONObjToObj = (jsonStr = this.throwErr(), questionId) => {
    let parsedStr;
    try {
      parsedStr = JSON.parse(jsonStr);
    } catch (e) {
      parsedStr = 'Incorrect Format';
    }
    return parsedStr;
  };

  convertOptionObjToArr = (optionJson) => {
    const optionObj = this.convertJSONObjToObj(optionJson);
    return [...Object.values(optionObj)];
  };

  getCorrectAnsOptionIndex(optionsArray, correctAnsjson) {
    const correctAnsObj = this.convertJSONObjToObj(correctAnsjson);
    const correctAns = Object.keys(correctAnsObj).length
      ? Object.values(correctAnsObj)[0]
      : null;
    return optionsArray.indexOf(correctAns);
  }

  getOptionList = (questionObj) => {
    const { response: responseObj, question_answer: questionAnswer } = questionObj || {};
    const [{ answer: answerArray = 'answer not found', options = [] }] = (
      questionAnswer || []
    ).length
      ? questionAnswer
      : [{}];

    const { answer: attemptedAnswerArray, attemption_status: isAttempted } =
      responseObj || {};

    const [attemptedOption] = attemptedAnswerArray || [];

    const optionsArray = options.map((item) => {
      const [optionContentObj] = Object.values(item || {});
      const [optionLabel] = Object.keys(item || {});
      return { ...optionContentObj, label: optionLabel, identifier: optionLabel };
    });
    const [correctOption] = answerArray || [];

    const correctAnsStyles = {
      backgroundColor: 'rgb(98,195,112)',
      border: '3px solid rgb(98,195,112)',
    };
    const wrongAnsStyles = {
      backgroundColor: 'rgb(231,69,70)',
      border: 'rgb(231,69,70)',
    };
    // let correctAnsOptionIndex = String(this.getCorrectAnsOptionIndex(this.convertOptionObjToArr(option), correctAns))
    return (
      <Grid container className='options-grid-rl options__container--quiz'>
        {optionsArray.map((option, index) => {
          return (
            <Grid className='option-rl' item xs={12} sm={3} md={3} lg={3}>
              <div
                className='option-inner-rl option-inner__border'
                style={{
                  ...(isAttempted
                    ? correctOption === option.identifier
                      ? correctAnsStyles
                      : attemptedOption === option.identifier
                      ? wrongAnsStyles
                      : { display: 'block' }
                    : {}),
                  ...(attemptedOption === option.identifier
                    ? { border: '3px solid white' }
                    : {}),
                }}
              >
                <div className='resizeable-text-rl'>
                  <div className='resizeable-rl'>{option.optionValue}</div>
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  render() {
    const { loading, questions } = this.state;
    return (
      <div style={{ marginTop: 100 }}>
        {loading ? (
          <InternalPageStatus label='Loading your answers. Please wait!' />
        ) : questions && questions.length ? (
          questions.map((question, index) => {
            const { question_answer: questionAnswer } = question || {};
            const [{ question: questionContent = 'No content available' }] = (
              questionAnswer || []
            ).length
              ? questionAnswer
              : [{}];
            return (
              <div className='review__answers--quiz'>
                <h1>{`${index + 1}`}</h1>
                {this.renderQuestion(questionContent)}
                {this.getOptionList(question)}
              </div>
            );
          })
        ) : (
          <InternalPageStatus label='No questions were found!' loader={false} />
        )}
      </div>
    );
  }
}

export default ReviewAnswers;
