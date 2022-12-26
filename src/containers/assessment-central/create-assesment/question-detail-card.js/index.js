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
  Grid,
  SvgIcon,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { debounce } from 'throttle-debounce';

import './styles.scss';
import QuestionView from '../question-view';
import AssignMarksMenu from '../assign-marks-menu';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import VisibilityIcon from '@material-ui/icons/Visibility';

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

const QuestionDetailCard = ({
  question,
  expanded,
  onChangeMarks,
  testMarks,
  createdAt,
  paperchecked,
}) => {
  const themeContext = useTheme();
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

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
        return testMarks[i].question_mark[0];
      } else if (
        option === 'Negative marking' &&
        question.id === testMarks[i].question_id
      ) {
        return testMarks[i].question_mark[1];
      }
    }
  };

  const extractDate = (dateValue) => {
    return dateValue?.split('T')[0];
    // date.split("-")
  };

  const debouncedOnChangeMarks = debounce(300, onChangeMarks);

  // const debouncedOnChangeMarks = debounced.current;
  return (
    <div className={`selected-question-card ${expanded && 'extra-width'}`}>
      {!expanded && (
        <>
          <div className='selected-question-card-header'>
            <div className='header-name'>
              <span style={{ color: '#426a9c', fontWeight: 550, fontSize: '1rem' }}>
                {resolveQuestionTypeName(question.question_type)}
              </span>
              {question?.question_answer.map((item) => {
                let que = '',
                  index = item.question.indexOf('<img');
                if (index === -1) {
                  que = item.question;
                } else {
                  var s;
                  s = item.question.slice(index, item.question.indexOf('/>') + 2);
                  que = item.question.replace(s, '');
                }
                return (
                  <>
                    <p>
                      Question :{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: que,
                        }}
                      />
                    </p>

                    <span style={{ marginLeft: '5px' }}>
                      {item.question?.split('"').filter((str) => str.startsWith('https'))
                        ?.length > 0 && (
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: (() => {
                                let newArray = item?.question?.split('"');
                                let filtered = newArray.filter((str) =>
                                  str.startsWith('https')
                                );
                                const images = filtered || {};
                                const attachmentsArray = [];
                                images.forEach((image) => {
                                  const attachmentObj = {
                                    src: image,
                                    name: `${image}`.split('.').slice(0, -1).join('.'),
                                    extension: `.${`${image}`.split('.').slice(-1)[0]}`,
                                  };
                                  attachmentsArray.push(attachmentObj);
                                });
                                return attachmentsArray;
                              })(),
                            });
                          }}
                        >
                          <SvgIcon
                            component={() => (
                              <VisibilityIcon style={{ cursor: 'pointer' }} />
                            )}
                          />
                        </a>
                      )}
                    </span>
                  </>
                );
              })}
            </div>
            <div className='icon'>
              {!paperchecked && (
                <>
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
                      {option}
                      <div className='value-input'>
                        <TextField
                          variant='outlined'
                          size='small'
                          type='number'
                          value={fetchMarks(option)}
                          onChange={(e) => {
                            onChangeMarks(
                              question.id,
                              true,
                              option,
                              e.target.value > 1000 ? 1000 : e.target.value,
                              question.is_central
                            );
                          }}
                        />
                      </div>
                    </MenuItem>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className='content'>
            <div className='left'>
              {/* <div style={{ fontWeight: 550, fontSize: '1rem' }}>Online</div> */}
              {/* <div> {q.is_published ? 'Published' : 'Draft'}</div> */}
              {/* <div> {'Published'}</div> */}
              <div className='created'>
                {/* <div style={{ fontWeight: 550, fontSize: '1rem', color:"#168d00"}}>
                Created on {extractDate(createdAt)}
                </div> */}
              </div>
              <div className='right'>
                {/* <div className='created'> */}
                {/* <div>Created on :</div> */}
                {/* <div style={{ fontWeight: 550, fontSize: '1rem'}}>
                Created on :{extractDate(createdAt)}
                </div> */}
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
              <div>Created on </div>
              <div style={{ fontWeight: 550, fontSize: '1rem' }}>
                {extractDate(createdAt)}
              </div>
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
