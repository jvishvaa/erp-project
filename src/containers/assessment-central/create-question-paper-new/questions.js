import React, { useState } from 'react';
import { Divider } from '@material-ui/core';
import Sections from './sections';


const Question = ({ question, onDeleteSection, onDeleteQuestion , erpCategory , grade,questionPaperWise}) => {
  return (
    <>
      {/* <div className='question-container'>
        <div className='sections-container'> */}
          {question?.sections?.map((section) => {
            return (
              <Sections
                question={question}
                section={section}
                erpCategory = {erpCategory}
                questionId={question.id}
                grade = {grade}
                onDelete={onDeleteSection}
                onDeleteQuestion={onDeleteQuestion}
                questionPaperWise={questionPaperWise}
              />
            );
          })}
        {/* </div>
      </div> */}
      <div className='divider-container'>
        <Divider />
      </div>
    </>
  );
};
export default Question;
