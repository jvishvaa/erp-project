import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  Button,
  SvgIcon,
  Checkbox,
  Popover,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';

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

const ITEM_HEIGHT = 48;

const menuOptions = ['Delete'];

const Section = ({ question, section, questionId, onDelete, onDeleteQuestion }) => {
  let history = useHistory();

  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(questionId, section.id);
  };

  const handleDeleteQuestion = (q) => {
    handleMenuClose();
    onDeleteQuestion(q?.id, section)
  };

  return (
    <div className='section-container'>
      <div className='section-header'>
        <div className='left'>
          <div className='checkbox'>
            <Checkbox
              checked={true}
              onChange={() => {}}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color='primary'
            />
          </div>
          <div className='section-name'>{section.name}</div>
        </div>
        <div className='right'>
          <Button
            style={{ borderRadius: '10px' }}
            color='primary'
            variant='contained'
            onClick={() => {
              history.push(
                `/question-bank?question=${questionId}&section=${section.name}`
              );
            }}
          >
            Add question
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon color='primary' />
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
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
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
                onClick={handleDelete}
                style={{
                  color: themeContext.palette.primary.main,
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Popover>
        </div>
      </div>
      <div className='section-content'>
        {section?.questions.map((q) => (
          <div className='selected-question-card'>
            <div className='selected-question-card-header'>
              <div className='header-name'>
                {resolveQuestionTypeName(q.question_type)}
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
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch',
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
                      onClick={() => handleDeleteQuestion(q)}
                      style={{
                        color: themeContext.palette.primary.main,
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Popover>
              </div>
            </div>
            <div className='content'>
              <div className='left'>
                <div style={{ fontWeight: 550, fontSize: '1rem' }}>Online</div>
                <div> {q.is_published ? 'Published' : 'Draft'}</div>
              </div>
              <div className='right'>
                <div className='created'>
                  <div>Created on</div>
                  <div style={{ fontWeight: 550, fontSize: '1rem' }}>30.12.2020</div>
                </div>
                {/* <div>
                  <Button variant='contained' color='primary'>
                    VIEW MORE
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
