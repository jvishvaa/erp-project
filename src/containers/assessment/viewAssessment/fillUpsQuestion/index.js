import React from 'react';
import '../viewAssessment.css';
import { TextField } from '@material-ui/core';

const FillUpsQuestion = () => {
  return (
    <div>
      <div className='question-header'>
        Fill up the blanks in the sentence correctly by typing the words in below option
      </div>
      <div className='question-numbers'>
        <div>Q1</div>
        <div>Progress - 1/20</div>
      </div>
      <div className='mcq-question-wrapper'>
        <h3>
          This is a _____ for a _____ to be fullfilled by _____ under this _____
          circumstance.
        </h3>
        <TextField id='outlined-basic' label='First option' variant='outlined' />
        <TextField id='outlined-basic' label='Second option' variant='outlined' />
        <TextField id='outlined-basic' label='Third option' variant='outlined' />
        <TextField id='outlined-basic' label='Fouth option' variant='outlined' />

        <div className='question-submit-btn'>Next</div>
      </div>
    </div>
  );
};

export default FillUpsQuestion;
