import React from 'react';
import '../viewAssessment.css';

const McqQuestion = () => {
  return (
    <div>
      <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>Q1</div>
        <div>Progress - 1/20</div>
      </div>
      <div className='mcq-question-wrapper'>
        <h3>Look at the picture and choose the following options</h3>
        <img src='https://via.placeholder.com/150' alt='question image' />
        <div className='mcq-options'>Pen</div>
        <div className='mcq-options'>Pencil</div>
        <div className='mcq-options'>Car</div>
        <div className='mcq-options'>Bike</div>
        <div className='question-submit-btn'>Next</div>
      </div>
    </div>
  );
};

export default McqQuestion;
