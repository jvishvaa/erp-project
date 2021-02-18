import React, { useContext } from 'react';
import McqQuestion from './mcqQuestion';
import DescriptiveQuestion from './descriptiveQuestion';
import FillUpsQuestion from './fillUpsQuestion';
import TrueFalseQuestion from './trueFalseQuestion';
import VideoQuestion from './videoQuestion';
import MatchFollowingQuestion from './matchFollowingQuestion';
import MatrixQuestion from './matrixQuestion';
import '../viewAssessment.css';

const QuestionBody = ({ children, ...restProps }) => {
  const decideQuestion = {
    1: (propObj) => <McqQuestion {...propObj} />,
    3: (propObj) => <MatchFollowingQuestion {...propObj} />,
    4: (propObj) => <VideoQuestion {...propObj} />,
    6: (propObj) => <MatrixQuestion {...propObj} />,
    7: (propObj) => {
      return (
        <>
          <p>Comp questions</p>
          <p>Sub questions</p>
          {
           console.log('propObj.questionObj.sub_questions', propObj.questionObj.sub_questions) 
          }
          {propObj.questionObj.sub_questions.map((subQues, index) => {
            return <QuestionBody key={subQues.id} qIndex={index} questionObj={subQues} />;
          })}
        </>
      );
    },
    8: (propObj) => <TrueFalseQuestion {...propObj} />,
    9: (propObj) => <FillUpsQuestion {...propObj} />,
    10: (propObj) => <DescriptiveQuestion {...propObj} />,
  };

  const { qIndex, questionObj } = restProps || {};
  const { id: qId, question_type: questionType } = questionObj || {};
  const { [questionType]: questionrenderer = () => <></> } = decideQuestion || {};
  return <>{questionrenderer(restProps)}</>;
};
export default QuestionBody;
