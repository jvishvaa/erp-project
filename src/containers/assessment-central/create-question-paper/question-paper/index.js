import React, { useState, useRef } from 'react';
import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  makeStyles,
} from '@material-ui/core';
import minimizeIcon from '../../../../assets/images/minimize.svg';
import maximizeIcon from '../../../../assets/images/maximize.svg';
import Question from '../question';
import './styles.scss';

const useStyles = makeStyles((theme) => ({
  questionsheader: {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
  },
  draftbtn: {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    background: 'white',
  },
  addSectionInfo: {
    color: theme.palette.secondary.main,
    fontSize: '1.1rem',
  },
}));

const QuestionPaper = ({
  grade,
  subject,
  level,
  sections,
  handleAddSection,
  onCreateQuestionPaper,
  onChangePaperName,
  questionPaperName,
  onDeleteSection,
  onDeleteQuestion,
  updateQuesionPaper,
}) => {
  const classes = useStyles();
  const [minimize, setMinimize] = useState(false);
  const [noOfSections, setNoOfSections] = useState(1);
  const addNewContainerRef = useRef(null);
  const handleAddNewSection = () => {
    setNoOfSections((noOfSections) => noOfSections + 1);
    handleAddSection(noOfSections);
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
              <div className={classes.questionsheader}>Questions</div>
              <div className='divider-container'>
                <Divider color='secondary' />
              </div>
              <div className='questions-content'>
                {sections?.map((question) => (
                  <Question
                    question={question}
                    onDeleteSection={onDeleteSection}
                    onDeleteQuestion={onDeleteQuestion}
                  />
                ))}

                <div className='add-new' ref={addNewContainerRef}>
                  <div className={classes.addSectionInfo}>
                    Add Sections For This Question Paper
                  </div>
                  <div
                    className='add-new-btn-container'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Button
                      size='medium'
                      variant='contained'
                      color='primary'
                      style={{ color: 'white', width: '100%' }}
                      onClick={handleAddNewSection}
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
            size='medium'
            className={classes.draftbtn}
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
            {updateQuesionPaper ? 'Update' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuestionPaper;
