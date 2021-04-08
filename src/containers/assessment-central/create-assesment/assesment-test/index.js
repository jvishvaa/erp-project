import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Checkbox,
  Popover,
  MenuItem,
  useTheme,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

import { AutoSizer } from '@material-ui/data-grid';
import minimizeIcon from '../../../../assets/images/minimize.svg';
import maximizeIcon from '../../../../assets/images/maximize.svg';
import productIcon from '../../../../assets/images/product-icons.svg';
import infoicon from '../../../../assets/images/infoicon.svg';

import './styles.scss';
import { fetchQuestionPaperDetails } from '../../../../redux/actions';
import QuestionDetailCard from '../question-detail-card.js';

const menuOptions = [
  'Assign marks',
  // 'Without marks',
  'Negative marking',
  // 'Grades only',
  // 'Relative marking',
];

const ITEM_HEIGHT = 60;

function extractContent(s) {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

const AssesmentTest = ({
  branch,
  grade,
  subject,
  questionPaper,
  onMarksAssignModeChange,
  marksAssignMode,
  onChangeTestMarks,
  onCreate,
  onTestNameChange,
  onInstructionsChange,
  onTestIdChange,
  onTestDateChange,
  onTestDurationChange,
  onTotalMarksChange,
  testName,
  testId,
  testDuration,
  testDate,
  testInstructions,
  totalMarks,
}) => {
  const [minimize, setMinimize] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const history = useHistory();
  console.log(questionPaper, '=====');
  return (
    <div className='create-container'>
      <div className='header'>
        <div className='applied-filters'>
          <div className='filter'>{branch}</div>
          {grade && <span className='dot'>.</span>}
          <div className='filter'>{grade}</div>
          {grade && <span className='dot'>.</span>}
          <div className='filter'>{subject}</div>
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
            <div className='test-detail-container'>
              <div className='form-field-header'>TEST DETAILS</div>
              <div className='test-details'>
                <div className='detail'>
                  <div className='label'>Test Name</div>
                  <div className='input-container'>
                    <TextField
                      variant='outlined'
                      size='small'
                      className='bg-white'
                      value={testName}
                      onChange={(e) => {
                        onTestNameChange(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className='dividerVertical' />
                <div className='detail'>
                  <div className='label'>Test ID</div>
                  <div className='input-container'>
                    <TextField
                      variant='outlined'
                      size='small'
                      className='bg-white'
                      value={testId}
                      onChange={(e) => {
                        const { target: { value } = {} } = e || {};
                        if (Number.isFinite(+value)) {
                          onTestIdChange(+value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className='dividerVertical' />
                <div className='detail'>
                  <div className='label'>Test Date</div>
                  <div className='input-container'>
                    <TextField
                      variant='outlined'
                      type='datetime-local'
                      size='small'
                      className='date-time-picker bg-white'
                      value={testDate}
                      color='primary'
                      onChange={(e) => {
                        console.log('value ', e.target.value);
                        onTestDateChange(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className='detail'>
                  <div className='label'>Test Duration</div>
                  <div className='input-container duration'>
                    <TextField
                      variant='outlined'
                      type='number'
                      size='small'
                      className='bg-white'
                      value={testDuration}
                      style={{ width: '70px' }}
                      onChange={(e) => {
                        const { target: { value } = {} } = e || {};
                        if (Number.isFinite(+value)) {
                          onTestDurationChange(+value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className='detail'>
                  <div className='label'>Test Marks</div>
                  <div className='input-container duration'>
                    <TextField
                      variant='outlined'
                      type='number'
                      size='small'
                      className='bg-white'
                      value={totalMarks}
                      style={{ width: '70px' }}
                      onChange={(e) => {
                        const { target: { value } = {} } = e || {};
                        if (Number.isFinite(+value)) {
                          onTotalMarksChange(+value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='form-field'>
              <div className='form-field-header'>GENERAL INSTRUCTIONS</div>
              {openEditor && (
                <Editor
                  init={{
                    height: 300,
                    menubar: false,
                    toolbar:
                      'fontselect fontsizeselect bold italic alignleft aligncenter alignright underline bullist numlist file image customInsertButton',
                    setup(editor) {
                      editor.ui.registry.addButton('customInsertButton', {
                        text: 'Finish',
                        onAction: (_) => {
                          setOpenEditor(false);
                        },
                      });
                    },
                  }}
                  value={testInstructions}
                  onEditorChange={(value) => onInstructionsChange(value)}
                />
              )}
              {!openEditor && (
                <TextField
                  id='outlined-search'
                  variant='outlined'
                  size='small'
                  fullWidth
                  className='dropdownIcon'
                  value={extractContent(testInstructions)}
                  onChange={(e) => {
                    onInstructionsChange(e.target.value);
                  }}
                  inputProps={{ autocomplete: 'off' }}
                  InputProps={{
                    endAdornment: (
                      <>
                        <div className='dividerVertical' />
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
                          onClick={() => {
                            setOpenEditor(true);
                          }}
                        >
                          Format Text
                        </Button>
                        <IconButton>
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
              )}
            </div>
            <div className='questions-container'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                className='questions-header-container'
              >
                <div className='questions-header'>QUESTIONS </div>
                <Button
                  variant='contained'
                  onClick={() => {
                    history.push(`/assessment-question`);
                  }}
                  color='primary'
                  className='mv-20'
                  style={{ margin: '1rem', borderRadius: '10px' }}
                >
                  ADD QUESTION PAPER
                </Button>
              </div>
              <div className='divider-container'>
                <Divider color='secondary' />
              </div>

              <div className='questions-content'>
                <div
                  className='question-header-row'
                  style={{ justifyContent: 'flex-end' }}
                >
                  {/* <div className='info-section'>
                <p>Question paper 1</p>
                <div className='dividerVertical'></div>
                <p>Online</p>
                <div className='dividerVertical'></div>
                <p>Created on 02.02.2021</p>
              </div> */}
                  <div className='action-section'>
                    <FormGroup>
                      {/* <FormLabel>Parent marks</FormLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            size='small'
                            onChange={onMarksAssignModeChange}
                            color='primary'
                            checked={marksAssignMode}
                          />
                        }
                      />
                      <FormLabel>Child marks</FormLabel> */}
                    </FormGroup>
                  </div>
                </div>
                <div className='question-container'>
                  <div className='sections-container'>
                    {questionPaper?.map((section) => (
                      <div className='section-container'>
                        <div className='section-header'>
                          <div className='left'>
                            <div className='checkbox'>
                              <Checkbox
                                checked
                                onChange={() => {}}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                color='primary'
                              />
                            </div>
                            <div className='section-name'>{`SECTION ${section.name}`}</div>
                          </div>
                        </div>

                        <div className='section-content'>
                          {section.questions.map((q) => (
                            <div className='question-detail-card-wrapper'>
                              <QuestionDetailCard
                                question={q}
                                expanded={marksAssignMode}
                                onChangeMarks={onChangeTestMarks}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='submit-btn-conntainer mv-20'>
                  <Button
                    variant='contained'
                    className=''
                    style={{ borderRadius: '10px' }}
                    color='primary'
                    onClick={onCreate}
                    disabled={
                      !totalMarks || !testDate || !testDuration || !testName || !testId
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AssesmentTest;
