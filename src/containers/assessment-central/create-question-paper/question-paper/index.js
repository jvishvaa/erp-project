import React, { useState, useRef } from 'react';
import { IconButton, Divider, TextField, Button, SvgIcon } from '@material-ui/core';
import minimizeIcon from '../../../../assets/images/minimize.svg';
import maximizeIcon from '../../../../assets/images/maximize.svg';
import Question from '../question';
import './styles.scss';

const QuestionPaper = ({
  grade,
  subject,
  level,
  questions,
  handleAddQuestion,
  onCreateQuestionPaper,
  onChangePaperName,
  questionPaperName,
  onDeleteSection,
  onDeleteQuestion,
}) => {
  const [minimize, setMinimize] = useState(false);
  const [noOfSections, setNoOfSections] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const addNewContainerRef = useRef(null);
  const handleAddSection = () => {
    setNoOfSections((noOfSections) => noOfSections + 1);
    handleAddQuestion(noOfSections);
  };

  return (
    <div className='create-container'>
      <div className='header'>
        <div className='applied-filters'>
          <div className='filter'>{grade}</div>
          {subject && <span className='dot'>.</span>}
          <div className='filter'>{subject}</div>
          {subject && <span className='dot'>.</span>}
          <div className='filter'>{level}</div>
        </div>
      </div>
      <div className='questions-paper-container'>
        <div className='minimize-container'>
          <span className='info'>{!minimize ? 'Minimize' : 'Maximize'}</span>
          {!minimize ? (
            <IconButton
              onClick={() => {
                setMinimize(true);
              }}
            >
              <SvgIcon component={() => <img src={minimizeIcon} alt='minimize' />} />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                setMinimize(false);
              }}
            >
              <SvgIcon component={() => <img src={maximizeIcon} alt='maximize' />} />
            </IconButton>
          )}
        </div>

        {!minimize && (
          <>
            <div className='form-field'>
              <TextField
                id='outlined-search'
                label='Question Paper Name'
                placeholder='Question Paper Name'
                variant='outlined'
                size='small'
                className='dropdownIcon'
                fullWidth
                onChange={onChangePaperName}
                value={questionPaperName || ''}
                inputProps={{
                  autoComplete: 'off',
                  maxLength: 100,
                }}
              />
            </div>
            <div className='questions-container'>
              <div className='questions-header'>Questions</div>
              <div className='divider-container'>
                <Divider color='secondary' />
              </div>
              <div className='questions-content'>
                {questions?.map((question) => (
                  <Question
                    question={question}
                    onDeleteSection={onDeleteSection}
                    onDeleteQuestion={onDeleteQuestion}
                  />
                ))}

                <div className='add-new' ref={addNewContainerRef}>
                  {showPopup && (
                    <div
                      className='add-section-popup'
                      style={{
                        bottom: addNewContainerRef.current.clientHeight + 1,
                      }}
                    >
                      <div>
                        <TextField
                          id='outlined-search'
                          label='No of sections'
                          variant='outlined'
                          size='small'
                          fullWidth
                          value={noOfSections}
                          type='number'
                          onChange={(e) => {
                            setNoOfSections(e.target.value < 1 ? 1 : e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          style={{
                            color: '#ff6b6b',
                            border: '1px solid #ff6b6b',
                            background: 'white',
                          }}
                          onClick={() => {
                            handleAddQuestion(noOfSections);
                            setShowPopup(false);
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className='info'>Add Sections For This Question Paper</div>
                  <div
                    className='add-new-btn-container'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Button
                      size='medium'
                      variant='contained'
                      color='primary'
                      style={{ color: 'white', width: '100%' }}
                      onClick={handleAddSection}
                    >
                      Add New
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className='submit-btn-conntainer mv-20'>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            style={{ color: '#ff6b6b', border: '1px solid #ff6b6b', background: 'white' }}
            onClick={() => {
              onCreateQuestionPaper(true);
            }}
          >
            Save as draft
          </Button>

          <Button
            variant='contained'
            style={{ color: 'white' }}
            size='medium'
            color='primary'
            onClick={() => {
              onCreateQuestionPaper(false);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuestionPaper;
