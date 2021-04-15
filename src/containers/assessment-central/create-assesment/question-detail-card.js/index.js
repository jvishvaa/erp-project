import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Button,
  Divider,
  Popover,
  MenuItem,
  useTheme,
  Checkbox,
  TextField,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { debounce } from 'throttle-debounce';

import './styles.scss';
import QuestionView from '../question-view';
import AssignMarksMenu from '../assign-marks-menu';

const resolveQuestionTypeName = (type) => {
  switch (type) {
    case 1:
      return 'MCQ SINGLE CHOICE';
    case 2:
      return 'MCQ_MULTIPLE_CHOICE';
    case 3:
      return 'Match the Following';
    case 4:
      return 'Video Question';
    case 5:
      return 'PPT Question';
    case 6:
      return 'Matrix Questions';
    case 7:
      return 'Comprehension Questions';
    case 8:
      return 'True False';
    case 9:
      return 'Fill In The Blanks';
    case 10:
      return 'Descriptive';
    default:
      return '--';
  }
};

const menuOptions = [
  'Assign marks',
  // 'Without marks',
  'Negative marking',
  // 'Grades only',
  // 'Relative marking',
];

const QuestionDetailCard = ({ question, expanded, onChangeMarks, testMarks, createdAt }) => {
  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    console.log('testMarks: ', testMarks, question)
  })
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchMarks = (option) => {
    // if (!testMarks.length) {
    //   return
    // }
    for (let i = 0; i < testMarks.length; i++) {
      if (option === 'Assign marks' && question.id === testMarks[i].question_id) {
        return testMarks[i].question_mark[0]
      } else if (option === 'Negative marking' && question.id === testMarks[i].question_id) {
        return testMarks[i].question_mark[1]
      }
    }

  }

  const extractDate = (dateValue) => {
    return dateValue.split("T")[0]
    // date.split("-")
  }

  const debouncedOnChangeMarks = debounce(300, onChangeMarks);

  // const debouncedOnChangeMarks = debounced.current;
  return (
    <div className={`selected-question-card ${expanded && 'extra-width'}`}>
      {!expanded && (
        <>
          <div className='selected-question-card-header'>
            <div className='header-name'>
              {resolveQuestionTypeName(question.question_type)}
            </div>
            <div className='icon'>
              <IconButton onClick={handleMenuOpen}>
                <MoreHorizIcon color='primary' />
              </IconButton>
              <Popover
                id=''
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                className='assesment-card-popup-menu'
                PaperProps={{
                  style: {
                    border: `1px solid ${themeContext.palette.primary.main}`,
                    boxShadow: 0,
                    '&::before': {
                      content: '',
                      position: 'absolute',
                      right: '50%',
                      top: '-6px',
                      backgroundColor: '#ffffff',
                      width: '10px',
                      height: '10px',
                      transform: 'rotate(45deg)',
                      border: '1px solid #ff6b6b',
                      borderBottom: 0,
                      borderRight: 0,
                      zIndex: 10,
                    },
                  },
                }}
              >
                {menuOptions.map((option) => (
                  <MenuItem
                    className='assesment-card-popup-menu-item'
                    key={option}
                    selected={option === 'Pyxis'}
                    onClick={() => {}}
                    style={{
                      color: themeContext.palette.primary.main,
                    }}
                  >
                    <div className='checkbox'>
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        color='primary'
                      />
                    </div>
                    {option}
                    <div className='value-input'>
                      <TextField
                        variant='outlined'
                        size='small'
                        type='number'
                        value={fetchMarks(option)}
                        onChange={(e) => {
                          console.log('onchange');
                          onChangeMarks(
                            question.id,
                            true,
                            option,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </MenuItem>
                ))}
              </Popover>
            </div>
          </div>
          <div className='content'>
            <div className='left'>
              <div style={{ fontWeight: 550, fontSize: '1rem' }}>Online</div>
              {/* <div> {q.is_published ? 'Published' : 'Draft'}</div> */}
              <div> {'Published'}</div>
            </div>
            <div className='right'>
              <div className='created'>
                <div>Created on</div>
                <div style={{ fontWeight: 550, fontSize: '1rem' }}>{extractDate(createdAt)}</div>
              </div>
              {/* <div>
                <Button variant='contained' color='primary'>
                  VIEW MORE
                </Button>
              </div> */}
            </div>
          </div>
        </>
      )}
      {expanded && (
        <>
          <div className='expanded-selected-question-card-header'>
            <div className='header-name'>
              {resolveQuestionTypeName(question.question_type)}
            </div>
            <div className='mode'>Online</div>
            <div className='is-published'> {'Published'}</div>
            <div className='created'>
              <div>Created on</div>
              <div style={{ fontWeight: 550, fontSize: '1rem' }}>{createdAt}</div>
            </div>
            <AssignMarksMenu
              menuOptions={menuOptions}
              handleChange={(field, value) => {
                debouncedOnChangeMarks(question.id, true, field, value);
              }}
            />
          </div>
          <Divider style={{ backgroundColor: '#014b7e' }} />
          <QuestionView
            question={question}
            onChangeMarks={(
              field,
              value,
              option,
              isQuestionMark,
              questionId,
              parentQuestionId
            ) => {
              if (!isQuestionMark) {
                debouncedOnChangeMarks(
                  questionId,
                  false,
                  field,
                  value,
                  option,
                  parentQuestionId
                );
              } else {
                debouncedOnChangeMarks(
                  questionId,
                  true,
                  field,
                  value,
                  null,
                  parentQuestionId
                );
              }
            }}
          />
        </>
      )}
    </div>
  );
};
export default QuestionDetailCard;
