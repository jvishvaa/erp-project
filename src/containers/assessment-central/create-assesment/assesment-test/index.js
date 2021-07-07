import React, { useState, useEffect, useContext } from 'react';
import {
  IconButton,
  Divider,
  TextField,
  Button,
  SvgIcon,
  FormGroup,
  Switch,
  Checkbox,
  Grid,
  useTheme,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import minimizeIcon from '../../../../assets/images/minimize.svg';
import maximizeIcon from '../../../../assets/images/maximize.svg';
import infoicon from '../../../../assets/images/infoicon.svg';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './styles.scss';
import QuestionDetailCard from '../question-detail-card.js';
import ENVCONFIG from '../../../../config/config';

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
  testMarks,
  paperchecked,
  setChecked,
}) => {
  const [minimize, setMinimize] = useState(false);
  const [openEditor, setOpenEditor] = useState(true);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  // const [paperchecked, setChecked] = React.useState(false);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  const handleChange = (event) => {
    let value = 0;
    let fieldName = event.target.name;
    if (fieldName === 'duration') {
      value = Math.round(+event.target.value);
      if (value <= 1440) {
        onTestDurationChange(+value);
      } else {
        setAlert('error', "Duration can't be more than 1440 minutes / 24 hours / 1 day!");
      }
    }
    if (fieldName === 'testid') {
      value = event.target.value;
      if (/^[0-9]{0,9}$/.test(value) /*.match(/^[0-9a-z]{1,10}$/)*/) {
        onTestIdChange(value);
      } else {
        setAlert('error', 'Test ID can contain numbers & must not exceed length of 9!');
      }
    }
    if (fieldName === 'testmarks') {
      value = Math.round(+event.target.value);
      if (value <= 1000) {
        onTotalMarksChange(+value);
      } else {
        setAlert('error', "Test marks can't be more than 1000!");
      }
    }
  };

  const { TINYMCE_API_KEY = 'g8mda2t3wiq0cvb9j0vi993og4lm8rrylzof5e6lml5x8wua' } =
    ENVCONFIG || {};

  return (
    <div className='create-container'>
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
                <Grid container spacing={5}>
                  <Grid xs={12} sm={6}>
                    <div className='detail'>
                      <div className='label'>Test Name</div>
                      <div className='input-container'>
                        <TextField
                          variant='outlined'
                          size='small'
                          placeholder='Test Name'
                          className='bg-white'
                          style={{ width: '100%' }}
                          value={testName}
                          inputProps={{
                            autocomplete: 'off',
                            maxLength: 100,
                          }}
                          onChange={(e) => {
                            onTestNameChange(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                  {/* <div className='dividerVertical' /> */}
                  <Grid xs={12} sm={6}>
                    <div className='detail'>
                      <div className='label'>Test ID</div>
                      <div className='input-container'>
                        <TextField
                          variant='outlined'
                          placeholder='Test ID'
                          size='small'
                          style={{ width: '100%' }}
                          className='bg-white'
                          name='testid'
                          value={testId}
                          // onChange={(e) => {
                          //   const { target: { value } = {} } = e || {};
                          //   if (Number.isFinite(+value)) {
                          //     onTestIdChange(+value);
                          //   }
                          // }}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </Grid>
                  {/* <div className='dividerVertical' /> */}
                  <Grid xs={12} sm={6}>
                    <div className='detail'>
                      <div className='label' style={{ marginRight: isMobile && '1rem' }}>
                        Test Date
                      </div>
                      <div className='input-container'>
                        <TextField
                          variant='outlined'
                          type='datetime-local'
                          size='small'
                          inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                          className='date-time-picker bg-white'
                          value={testDate}
                          color='primary'
                          style={{ width: isMobile ? '50%' : '100%' }}
                          onChange={(e) => {
                            onTestDateChange(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className='detail'>
                      <div className='label'>Test Duration</div>
                      <div className='input-container duration'>
                        <TextField
                          variant='outlined'
                          inputProps={{
                            maxLength: 4,
                          }}
                          size='small'
                          className='bg-white'
                          name='duration'
                          placeholder='In Minutes'
                          value={testDuration}
                          style={{ width: '100%' }}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={12} sm={6} style={{ padding: '15px 25px' }}>
                    <Typography>
                      <Grid component='label' container alignItems='center' spacing={1}>
                        <Grid item>Ques. Wise Marks</Grid>
                        <Switch checked={paperchecked} onChange={toggleChecked} />
                        <Grid item>Ques. Paper Wise Marks</Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                  {paperchecked && (
                    <Grid xs={12} sm={6}>
                      <div className='detail'>
                        <div className='label'>Test Marks</div>
                        <div className='input-container duration'>
                          <TextField
                            variant='outlined'
                            inputProps={{
                              min: 0,
                              max: 1000,
                              maxLength: 4,
                            }}
                            size='small'
                            className='bg-white'
                            name='testmarks'
                            value={totalMarks}
                            style={{ width: '100%' }}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </div>
            </div>

            <div className='form-field'>
              <div className='form-field-header'>GENERAL INSTRUCTIONS</div>
              {openEditor && (
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  init={{
                    height: 300,
                    menubar: false,
                    toolbar:
                      'fontselect fontsizeselect bold italic underline alignleft aligncenter alignright  bullist numlist file image  ', //customInsertButton
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
                  inputProps={{ autocomplete: 'off', maxLength: 500 }}
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
                  style={{ color: 'white', margin: '1rem', borderRadius: '10px' }}
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
                                createdAt={q?.created_at}
                                question={q}
                                expanded={marksAssignMode}
                                onChangeMarks={onChangeTestMarks}
                                testMarks={testMarks}
                                paperchecked={paperchecked}
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
                      !testDate ||
                      !testDuration ||
                      !testName ||
                      !testId ||
                      !testInstructions
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
