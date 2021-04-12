import React, { useState } from 'react';
import { Divider } from '@material-ui/core';

import Section from '../section';

const Question = ({ question, onDeleteSection, onDeleteQuestion }) => {
  return (
    <>
      <div className='question-container'>
        <div className='sections-container'>
          {question.sections?.map((section) => {
            console.log('sections: ', section)
            return (
              <Section
              question={question}
              section={section}
              questionId={question.id}
              onDelete={onDeleteSection}
              onDeleteQuestion={onDeleteQuestion}
            />
            )
          })}
        </div>
      </div>
      <div className='divider-container'>
        <Divider />
      </div>
    </>
  );
};
export default Question;
