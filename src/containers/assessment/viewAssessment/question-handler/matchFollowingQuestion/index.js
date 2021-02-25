/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';

import ReactHtmlParser from 'react-html-parser';
import endpoints from '../../../../../config/endpoints';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import MatchAndDraw from './match-and-draw-UI';
import '../../assess-attemption.css';

const MatchFollowingQuestion = (props) => {
  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);
  const { questionObj: currentQuestionObj } = props || {};
  const {
    id: qId,
    question_answer: questionAnswer,
    user_response: {
      // attemption_status: attemptionStatus,
      answer: existingAnswer = [],
    } = {},
  } = currentQuestionObj || {};

  const [{ options = [], question, matchingOptions }] =
    questionAnswer && questionAnswer.length
      ? questionAnswer
      : [{ options: [], matchingOptions: [] }];

  // function shuffle(array) {
  //   let currentIndex = array.length;
  //   let temporaryValue;
  //   let randomIndex;

  //   // While there remain elements to shuffle...
  //   while (currentIndex !== 0) {
  //     // Pick a remaining element...
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;

  //     // And swap it with the current element.
  //     temporaryValue = array[currentIndex];
  //     array[currentIndex] = array[randomIndex];
  //     array[randomIndex] = temporaryValue;
  //   }

  //   return array;
  // }
  const generatePoints = () => {
    const noOfRows = options.length === matchingOptions.length ? options.length : 0;
    const dummyRowsArray = new Array(noOfRows).fill('dummy');
    // const shuffledOptions = shuffle(options);
    const points = dummyRowsArray.map((row, rowIndex) => {
      const { optionValue: questionValue, images: [quesImgSrc] = [] } =
        options[rowIndex] || {};
      const { images: [ansImgSrc] = [], optionValue: answerValue } =
        matchingOptions[rowIndex] || {};
      const rowArray = [
        {
          name: `p${rowIndex + 1}1`,
          option: options[rowIndex],
          matchingOption: matchingOptions[rowIndex],
          src: `${endpoints.assessment.s3}${quesImgSrc}`,
          value: questionValue,
        },
        {
          name: `p${rowIndex + 1}2`,
          option: options[rowIndex],
          matchingOption: matchingOptions[rowIndex],
          src: `${endpoints.assessment.s3}${ansImgSrc}`,
          value: answerValue,
        },
      ];
      return rowArray;
    });
    return points;
  };

  const getLinesObjFromArray = () => {
    /*
      from:
      [
        {answer: "Fruit", question: "Apple"},
        {answer: "Bike", question: "Yamaha"},
        {answer: "car", question: "BMW"},
      ]
      to:
      { BMW: 'car', Yamaha: 'Bike', Apple: 'Fruit' }
    */
    const lines = {};
    existingAnswer.forEach((item) => {
      const { question, answer } = item;
      lines[question] = answer;
    });
    return lines;
  };

  const getArrayFromLinesObj = (linesObj) => {
    /*
      from:
      { BMW: 'car', Yamaha: 'Bike', Apple: 'Fruit' }
      to:
      [
        {answer: "Fruit", question: "Apple"},
        {answer: "Bike", question: "Yamaha"},
        {answer: "car", question: "BMW"},
      ]
    */
    const answerArray = [];
    Object.entries(linesObj).forEach(([key, value]) => {
      answerArray.push({ question: key, answer: value });
    });
    return answerArray;
  };
  const attemptionQuestionToContext = (linesObj) => {
    const answerArray = getArrayFromLinesObj(linesObj) || [];
    const attemptionStatus = answerArray.length === options.length;
    attemptQuestion(qId, { attemption_status: attemptionStatus, answer: answerArray });
  };

  return (
    <div>
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <div className='match-question-wrapper'>
          <MatchAndDraw
            points={generatePoints()}
            lines={getLinesObjFromArray()}
            onChange={(lines) => {
              attemptionQuestionToContext(lines);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchFollowingQuestion;
