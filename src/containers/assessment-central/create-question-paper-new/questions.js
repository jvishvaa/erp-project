import React, { useState } from 'react';
import { Divider } from '@material-ui/core';
import Sections from './sections';


const Question = ({ question, onDeleteSection, onDeleteQuestion , erpCategory , grade,questionPaperWise,deleteOneSection,isEdit}) => {
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
                deleteOneSection={deleteOneSection}
                isEdit={isEdit}
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
