import React, { useState, useEffect } from 'react';
import {
  useTheme,
  makeStyles
} from '@material-ui/core';

import './styles.scss';
import QuestionView from '../question-view';

const useStyles = makeStyles((theme)=>({
  headerName: {
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
    padding: '.75rem',
    border: '1px solid',
    margin: '0 5px 0 1rem',
  }
}))
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

const QuestionDetailCard = ({ question, expanded }) => {
  const classes = useStyles()

  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={`selected-question-card ${expanded && 'extra-width'}`}>
      <>
        <div className='expanded-selected-question-card-header'>
          <div
            className={classes.headerName}
          >
            {resolveQuestionTypeName(question.question_type)}
          </div>
          {/* <div className='mode'>Online</div> */}
          {/* <div className='is-published'> {'Published'}</div> */}
          <div className='created'>
            {/* <div>Created on</div> */}
            {/* <div style={{ fontWeight: 550, fontSize: '1rem' }}>30.12.2020</div> */}
          </div>
          {/* <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} /> */}
        </div>
        {/* <Divider style={{ backgroundColor: '#014b7e' }} /> */}
        <div style={{ padding: '2rem' }}>
          <QuestionView question={question} />
        </div>
      </>
    </div>
  );
};
export default QuestionDetailCard;
