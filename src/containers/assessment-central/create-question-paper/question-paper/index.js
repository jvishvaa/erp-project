import React, { useState, useRef } from 'react';
import { IconButton, Divider, TextField, Button, SvgIcon } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import infoicon from '../../../../assets/images/infoicon.svg';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import minimizeIcon from '../../../../assets/images/minimize.svg';
import maximizeIcon from '../../../../assets/images/maximize.svg';
import productIcon from '../../../../assets/images/product-icons.svg';
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
        {/* <div className='icon'>
          <img src={productIcon} alt='product' />
        </div> */}
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
                // InputProps={{
                //   endAdornment: (
                //     <>
                //       <div className='dividerVertical'></div>
                //       <Button
                //         onClick={() => { }}
                //         style={{
                //           color: '#014b7e',
                //           background: 'none',
                //           fontSize: '1rem',
                //           textTransform: 'none',
                //         }}
                //       >
                //         Edit
                //       </Button>
                //       <Button
                //         onClick={() => { }}
                //         style={{
                //           color: 'rgb(140, 140, 140)',
                //           background: 'none',
                //           fontSize: '1rem',
                //           textTransform: 'none',
                //         }}
                //       >
                //         Save
                //       </Button>
                //     </>
                //   ),
                // }}
              />
            </div>
            {/* <div className='form-field'>
              <TextField
                id='outlined-search'
                label='Instructions'
                variant='outlined'
                size='small'
                fullWidth
                InputProps={{
                  endAdornment: (
                    <>
                      <div className='dividerVertical'></div>
                      <Button
                        variant='contained'
                        style={{
                          color: 'white',
                          textTransform: 'none',
                          width: '12%',
                          margin: '0px 0px 0px 15px',
                        }}
                        color='primary'
                        className='modifyDesign'
                        size='small'
                        onClick={() => {}}
                      >
                        Format Text
                      </Button>
                      <IconButton
                      // onClick={() => setIsTopFilterOpen(!isTopFilterOpen)}
                      >
                        <div>
                          <SvgIcon
                            component={() => (
                              <img
                                style={{ height: '24px', width: '25px' }}
                                src={infoicon}
                                alt='info'
                              />
                            )}
                          />
                        </div>
                      </IconButton>
                    </>
                  ),
                }}
              />
            </div> */}
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
                          className='outlined-btn'
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
                    {/* <TextField
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
                    /> */}
                    {/* <div className='caret-icon' style={{ margin: '0 5px' }}>
                      {!showPopup ? (
                        <ArrowDropDownIcon
                          color='secondary'
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setShowPopup(true);
                          }}
                        />
                      ) : (
                        <ArrowDropUpIcon
                          color='secondary'
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setShowPopup(false);
                          }}
                        />
                      )}
                    </div> */}

                    <Button
                      className='action'
                      variant='contained'
                      color='primary'
                      style={{ cursor: 'pointer' }}
                      onClick={handleAddSection}
                    >
                      ADD NEW
                    </Button>

                    {/* <div
                      className='action'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        // handleAddQuestion(noOfSections);
                        setShowPopup((prev) => !prev);
                      }}
                    >
                      ADD NEW
                    </div> */}
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
            style={{ borderRadius: '10px' }}
            className='outlined-btn'
            onClick={() => {
              onCreateQuestionPaper(true);
            }}
          >
            Save as draft
          </Button>

          <Button
            variant='contained'
            style={{ borderRadius: '10px' }}
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
