import React, { useContext } from 'react';
// import ReactHtmlParser from 'react-html-parser';

// import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../viewAssessment.css';

const QuestionHeader = (props) => {
  const { qIndex, questionsArray } = props || {};
  // const {
  //     assessmentQp: { fetching },
  //     fetchAssessmentQp,

  //     questionsDataObj,
  //     questionsArray,
  //     controls: {
  //       selectQues,
  //       nextQues,
  //       //   prevQues,
  //       attemptQuestion,
  //       isStarted,
  //       currentQuesionId,
  //       start,
  //       //   startedAt,
  //     },
  //   } = useContext(AssessmentHandlerContext);

  return (
    <>
      <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>{`Progress - ${qIndex + 1}/${questionsArray.length}`}</div>
      </div>
    </>
  );
};
export default QuestionHeader;
