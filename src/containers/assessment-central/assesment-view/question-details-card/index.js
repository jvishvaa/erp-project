import React, { useState, useEffect } from 'react';
import { useTheme, makeStyles } from '@material-ui/core';

import './styles.scss';
import QuestionView from '../question-view';

const useStyles = makeStyles((theme) => ({
  headerName: {
    // color: theme.palette.primary.main,
    color: 'red',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    display: 'flex',
    justifyContent: 'flex-end',
    // padding: '.75rem',
    // border: '1px solid',
    marginRight: '10px',
  },
}));

const configFEHardcodedTypeSubTypeAutoAssessment = [
  { id: 1, label: 'MCQ SINGLE CHOICE', subTypeId: [32] },
  { id: 2, label: 'MCQ_MULTIPLE_CHOICE', subTypeId: [34] },
  { id: 3, label: 'Match the Following', subTypeId: [] },
  { id: 4, label: 'Video Question', subTypeId: [] },
  { id: 5, label: 'PPT Question', subTypeId: [] },
  { id: 6, label: 'Matrix Questions', subTypeId: [] },
  { id: 7, label: 'Comprehension Questions', subTypeId: [33] },
  { id: 8, label: 'True False', subTypeId: [3] },
  { id: 9, label: 'Fill In The Blanks', subTypeId: [2] },
  {
    id: 10,
    label: 'Descriptive',
    subTypeId: [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 29, 30,
      31,
    ],
  },
];

const resolveQuestionTypeName = (type, subtype) => {
  if ([undefined, null].includes(subtype)) {
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
  } else {
    return configFEHardcodedTypeSubTypeAutoAssessment?.filter((each) =>
      each.subTypeId?.includes(type)
    )?.length
      ? configFEHardcodedTypeSubTypeAutoAssessment?.filter((each) =>
          each.subTypeId?.includes(type)
        )[0].label
      : '--';
  }
};

const menuOptions = [
  'Assign marks',
  // 'Without marks',
  'Negative marking',
  // 'Grades only',
  // 'Relative marking',
];

const QuestionDetailCard = ({ question, expanded, index }) => {
  const classes = useStyles();

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
          <div className={classes.headerName}>
            {resolveQuestionTypeName(
              question.question_type,
              question.question_type_sub_type_id
            )}
          </div>
          {/* <div className='mode'>Online</div> */}
          {/* <div className='is-published'> {'Published'}</div> */}
          {/* <div className='created'> */}
          {/* <div>Created on</div> */}
          {/* <div style={{ fontWeight: 550, fontSize: '1rem' }}>30.12.2020</div> */}
          {/* </div> */}
          {/* <AssignMarksMenu menuOptions={menuOptions} handleChange={() => {}} /> */}
        </div>
        {/* <Divider style={{ backgroundColor: '#014b7e' }} /> */}
        <div style={{ padding: '0 0.5rem' }}>
          <QuestionView question={question} index={index} />
        </div>
      </>
    </div>
  );
};
export default QuestionDetailCard;
