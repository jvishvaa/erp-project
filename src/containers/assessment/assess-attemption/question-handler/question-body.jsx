import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import McqQuestion from './mcqQuestion';
import McqQuestionMultiAnswer from './mcqQuestionMultiAnswer';
import DescriptiveQuestion from './descriptiveQuestion';
import FillUpsQuestion from './fillUpsQuestion';
import TrueFalseQuestion from './trueFalseQuestion';
import VideoQuestion from './videoQuestion';
import MatchFollowingQuestion from './matchFollowingQuestion';
import MatrixQuestion from './matrixQuestion';
import '../assess-attemption.css';

const QuestionBody = ({ children, ...restProps }) => {
  const decideQuestion = {
    1: (propObj) => <McqQuestion {...propObj} />,
    2: (propObj) => <McqQuestionMultiAnswer {...propObj} />,
    3: (propObj) => <MatchFollowingQuestion {...propObj} />,
    4: (propObj) => <VideoQuestion {...propObj} />,
    5: () => <p>PPT question</p>,
    6: (propObj) => <MatrixQuestion {...propObj} />,
    7: (propObj) => {
      const { questionObj } = propObj;
      let { question_answer: questionAnswer = [] } = questionObj || {
        question_answer: [],
      };
      questionAnswer = questionAnswer.length
        ? questionAnswer
        : [{ question: 'Question not found' }];
      const [{ question: comprehensionText }] = questionAnswer;
      return (
        <>
          <div>{ReactHtmlParser(comprehensionText)}</div>
          {propObj.questionObj.sub_questions.map((subQuesItem, index) => {
            const { id: subQuesId } = subQuesItem || {};
            const { [subQuesId]: subQuesObj } = restProps.questionsDataObj || {};
            return (
              <>
                <span>
                  {`Q${index + 1}.`}
                  &nbsp;
                </span>
                <QuestionBody
                  key={subQuesId}
                  qIndex={index}
                  questionObj={subQuesObj || subQuesItem}
                />
              </>
            );
          })}
        </>
      );
    },
    8: (propObj) => <TrueFalseQuestion {...propObj} />,
    9: (propObj) => <FillUpsQuestion {...propObj} />,
    10: (propObj) => <DescriptiveQuestion {...propObj} />,
  };

  const {
    // qIndex,
    questionObj,
  } = restProps || {};
  const {
    // id: qId,
    question_type: questionType,
  } = questionObj || {};
  const { [questionType]: questionrenderer = () => <></> } = decideQuestion || {};
  return (
    <>
      {/* qId:
      {qId}
      ,index:
      {qIndex} */}
      {questionrenderer({ ...restProps, key: restProps.qIndex })}
    </>
  );
};
export default QuestionBody;
