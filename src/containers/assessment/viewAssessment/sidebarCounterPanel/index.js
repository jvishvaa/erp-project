/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import { AssessmentHandlerContext } from '../../assess-attemption/assess-attemption-context';
import './sidebarPanel.css';
import { Button } from '@material-ui/core';

const SidebarCounterPanel = () => {
  const {
    controls: {
      selectQues,
      nextQues,
      prevQues,
      attemptQuestion,
      currentQuesionId,
      isStarted,
      start,
      startedAt,
    } = {},
    questionsArray = [],
  } = useContext(AssessmentHandlerContext);
  return (
    <div className='sidebar-panel'>
      <div className='sidebar-panel-wrapper'>
        <div className='sidebar-content'>
          <h4 className='cardTitleHeading'>Question Paper B</h4>
          <h5>Grade 3, Vol 2, English</h5>
        </div>
        <div className='sidebar-time-counter'>
          <h4>Time Remaining</h4>
          <h5 className='counter-timer'>00:34</h5>
        </div>
      </div>
      <div className='sidebar-question-list'>
        <h6>Question List</h6>
        <div className='sidebar-box-wrapper'>
          {questionsArray.map((ques, index) => (
            <div
              key={ques.id}
              onClick={() => {
                selectQues(ques.id);
              }}
              className='box'
            >
              {` ${index + 1}`}
            </div>
          ))}
          {/* <div className='box'> 1</div>
          <div className='box'> 2</div>
          <div className='box'> 3</div>
          <div className='box'> 4</div>
          <div className='box'> 5</div>
          <div className='box'> 6</div>
          <div className='box'> 7</div>
          <div className='box'> 8</div> */}
        </div>
      </div>
      <div className='sidebar-legend'>
        <h6>Legends</h6>
        <div className='sidebar-box-wrapper'>
          <div className='box'>
            <div className='demo-box green' /> Attempted
          </div>
          <div className='box'>
            <div className='demo-box purple' /> Incomplete
          </div>
          <div className='box'>
            <div className='demo-box' /> Unattempted
          </div>
          <div className='box'>
            <div className='demo-box ongoing' /> Ongoing
          </div>
        </div>
        <p>Note: Only attempted questions will be considered for review.</p>
      </div>
      <div className='sidebar-button-wrapper'>
        <Button className='outlined' color='outlined' color="secondary'>">
          Instructions
        </Button>
        <Button className='contained' variant='contained' color='primary'>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SidebarCounterPanel;
