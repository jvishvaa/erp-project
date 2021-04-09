import React, { useState } from 'react';
import { Divider } from '@material-ui/core';

import Section from '../section';

const Question = ({ question, onDeleteSection }) => {
  return (
    <>
      <div className='question-container'>
        <div className='sections-container'>
          {question.sections?.map((section) => (
            <Section
              question={question}
              section={section}
              questionId={question.id}
              onDelete={onDeleteSection}
            />
          ))}
        </div>
      </div>
      <div className='divider-container'>
        <Divider />
      </div>
    </>
  );
};
export default Question;
