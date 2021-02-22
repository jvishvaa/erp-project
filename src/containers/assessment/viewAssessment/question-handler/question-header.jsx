import React from 'react';
import '../viewAssessment.css';

const QuestionHeader = (props) => {
  const { qIndex, questionsArray } = props || {};
  return (
    <>
      {/* <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div> */}
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>{`Progress - ${qIndex + 1}/${questionsArray.length}`}</div>
      </div>
    </>
  );
};
export default QuestionHeader;
